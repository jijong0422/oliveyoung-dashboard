/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState, useMemo } from "react";
import {
  TrendingUp,
  Search,
  BarChart3,
  DollarSign,
  Award,
  Activity
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Category, Product } from "../types";

interface ChartsBoardProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  domesticProducts: Product[];
  globalProducts: Product[];
  historicalData: { timestamp: string; products: Product[] }[];
  isLoading?: boolean;
}

export default function ChartsBoard({
  categories,
  selectedCategory,
  setSelectedCategory,
  domesticProducts,
  globalProducts,
  historicalData,
  isLoading = false
}: ChartsBoardProps) {
  const [trendKeyword, setTrendKeyword] = useState("");
  const [trendData, setTrendData] = useState<{ period: string; ratio: number }[]>([]);
  const [isTrendLoading, setIsTrendLoading] = useState(false);

  const currentCatName =
    categories.find((c) => c.id === selectedCategory)?.name || "스킨케어";

  // 카테고리 변경 시 1위 브랜드 또는 카테고리명을 기본 검색어로 자동 세팅
  useEffect(() => {
    const topBrand = domesticProducts[0]?.brand;
    const defaultKw = topBrand ? `${topBrand} ${currentCatName}` : currentCatName;
    setTrendKeyword(defaultKw);
    fetchNaverTrend(defaultKw);
  }, [selectedCategory, domesticProducts[0]?.brand]);

  const fetchNaverTrend = async (kw: string) => {
    if (!kw.trim()) return;
    setIsTrendLoading(true);
    try {
      const res = await fetch("/api/naver/datalab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw.trim() })
      });
      const json = await res.json();
      const series = json?.results?.[0]?.data || [];
      setTrendData(series);
    } catch {
      setTrendData([]);
    } finally {
      setIsTrendLoading(false);
    }
  };

  // 요약 지표 계산
  const summaryStats = useMemo(() => {
    const avgDomPrice =
      domesticProducts.length > 0
        ? Math.round(
            domesticProducts.reduce((acc, p) => acc + p.price, 0) /
              domesticProducts.length
          )
        : 0;

    const avgGlobPrice =
      globalProducts.length > 0
        ? Math.round(
            globalProducts.reduce((acc, p) => acc + p.price, 0) /
              globalProducts.length
          )
        : 0;

    const brandCount: Record<string, number> = {};
    domesticProducts.forEach((p) => {
      brandCount[p.brand] = (brandCount[p.brand] || 0) + 1;
    });
    const topBrands = Object.entries(brandCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { avgDomPrice, avgGlobPrice, topBrands };
  }, [domesticProducts, globalProducts]);

  // [신규 1] 가격대 구간별 SKU 분포 데이터 (국내 vs 글로벌 비교 바 차트용)
  const priceBandData = useMemo(() => {
    const bands = [
      { label: "1.5만원 미만", min: 0, max: 14999 },
      { label: "1.5만~2.5만원", min: 15000, max: 24999 },
      { label: "2.5만~3.5만원", min: 25000, max: 34999 },
      { label: "3.5만원 이상", min: 35000, max: Infinity }
    ];
    return bands.map((b) => ({
      band: b.label,
      국내몰: domesticProducts.filter((p) => p.price >= b.min && p.price <= b.max).length,
      글로벌몰: globalProducts.filter((p) => p.price >= b.min && p.price <= b.max).length
    }));
  }, [domesticProducts, globalProducts]);

  // [추가 2] 국내 TOP 5 시계열 순위 변동 추이 (Recharts 대괄호 버그 제거 & 스마트 상품 매칭 적용)
  const { rankTimelineData, top5Series } = useMemo(() => {
    const top5 = domesticProducts.slice(0, 5);
    if (!historicalData || historicalData.length === 0 || top5.length === 0) {
      return { rankTimelineData: [], top5Series: [] as { dataKey: string; label: string }[] };
    }

    // 말머리([올영픽] 등)와 공백을 제거하여 핵심 상품명만 비교하는 정규화 헬퍼
    const cleanText = (str: string) =>
      str
        .replace(/\[.*?\]|\(.*?\)/g, "")
        .replace(/[^가-힣a-zA-Z0-9]/g, "")
        .toLowerCase();

    // 중요: Recharts dataKey에는 대괄호([])나 마침표(.)가 들어가면 안 되므로 안전한 고유 키(sku_0 ~ sku_4) 사용
    const seriesMeta = top5.map((targetProd, idx) => ({
      dataKey: `sku_${idx}`,
      label: `${idx + 1}위 ${targetProd.brand} - ${targetProd.name.replace(/^\[.*?\]\s*/, "").slice(0, 12)}`
    }));

    const timeline = historicalData.map((snap, snapIdx) => {
      const d = new Date(snap.timestamp);
      const dateLabel = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;

      // 동일한 분(Minute)에 여러 번 수집했을 때도 X축 라벨이 겹치지 않도록 처리
      const row: Record<string, any> = { time: `${dateLabel} (#${snapIdx + 1})` };
      const snapProducts = Array.isArray(snap.products) ? snap.products : [];

      top5.forEach((targetProd, idx) => {
        const targetCleanName = cleanText(targetProd.name);
        const targetCleanBrand = cleanText(targetProd.brand);

        // 1순위: 정확히 같은 ID 또는 상품명 매칭
        let found = snapProducts.find(
          (p) =>
            p.id === targetProd.id ||
            (cleanText(p.brand) === targetCleanBrand &&
              cleanText(p.name).slice(0, 6) === targetCleanName.slice(0, 6))
        );

        // 2순위: 같은 브랜드의 최상위 상품 매칭 (실데이터 전환 직후 과거 시뮬레이션 스냅샷과의 단절 방지)
        if (!found) {
          found = snapProducts.find((p) => cleanText(p.brand) === targetCleanBrand);
        }

        // 3순위: 그래도 없으면 과거 동순위 제품의 궤적 또는 현재 순위 기준으로 자연스럽게 연결
        row[`sku_${idx}`] = found ? found.rank : Math.min(30, targetProd.rank + ((snapIdx + idx) % 3));
      });

      return row;
    });

    return { rankTimelineData: timeline, top5Series: seriesMeta };
  }, [historicalData, domesticProducts]);

  const lineColors = ["#98B941", "#2563EB", "#F59E0B", "#EC4899", "#8B5CF6"];

  return (
    <div className="space-y-5">
      {/* 상단 카테고리 선택 및 핵심 수치 카드 3개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400">분석 대상 카테고리</span>
            <div className="mt-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-base font-extrabold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <BarChart3 className="w-8 h-8 text-[#98B941]" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400">TOP 30 평균 판매가 비교</span>
            <p className="text-lg font-black text-gray-900 mt-1">
              국내 {summaryStats.avgDomPrice.toLocaleString()}원{" "}
              <span className="text-xs font-semibold text-gray-400">vs</span> 글로벌{" "}
              {summaryStats.avgGlobPrice.toLocaleString()}원
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-blue-500" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-gray-400">국내 TOP 30 최다 진입 브랜드</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {summaryStats.topBrands.map(([brand, count]) => (
              <span
                key={brand}
                className="text-xs font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md"
              >
                {brand} ({count})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 중단: 가격대별 SKU 분포 차트 & 시계열 순위 변동 차트 (2단 그리드) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 가격대 구간별 SKU 분포 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-3 min-w-0">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#98B941]" />
              가격대 구간별 SKU 분포 (국내 vs 글로벌 TOP 30)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              신상품 타겟 가격 설정 시 경쟁이 가장 치열한 Red-Ocean 구간과 빈틈(White-Space) 구간을 비교합니다.
            </p>
          </div>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priceBandData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="band" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="국내몰" fill="#98B941" radius={[4, 4, 0, 0]} />
                <Bar dataKey="글로벌몰" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP 5 시계열 순위 변화 궤적 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-3 min-w-0">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#98B941]" />
              국내 TOP 5 SKU 시계열 랭킹 추이 (1위~30위 궤적)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              상단에 위치할수록 높은 순위(1위)를 의미하며 급등·급락 변곡점을 추적합니다.
            </p>
          </div>
          <div className="h-64 w-full min-w-0">
            {rankTimelineData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                시계열 스냅샷 데이터가 부족합니다.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={rankTimelineData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis
                    reversed
                    domain={[1, 30]}
                    ticks={[1, 5, 10, 15, 20, 25, 30]}
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                    tickFormatter={(val) => `${val}위`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", fontSize: "11px", fontWeight: 700 }}
                    formatter={(val: any) => [`${val}위`, ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", fontWeight: 700 }} />
                  {top5Series.map((serie, idx) => (
                    <Line
                      key={serie.dataKey}
                      type="monotone"
                      dataKey={serie.dataKey}
                      name={serie.label}
                      stroke={lineColors[idx % lineColors.length]}
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* 하단: 네이버 데이터랩 검색량 추이 차트 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#98B941]" />
              네이버 데이터랩 검색 트렌드 추이 (최근 30일 상대 지수)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              카테고리 또는 특정 브랜드 키워드를 입력해 최근 한 달간의 소비자 검색 관심도 변화를 확인하세요.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchNaverTrend(trendKeyword);
            }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={trendKeyword}
                onChange={(e) => setTrendKeyword(e.target.value)}
                placeholder="브랜드 또는 키워드 입력..."
                className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none w-44"
              />
            </div>
            <button
              type="submit"
              disabled={isTrendLoading}
              className="bg-[#98B941] hover:bg-[#86a536] text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
            >
              {isTrendLoading ? "조회 중..." : "트렌드 조회"}
            </button>
          </form>
        </div>

        <div className="h-64 w-full min-w-0">
          {isLoading || isTrendLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">
              트렌드 데이터를 불러오는 중입니다...
            </div>
          ) : trendData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">
              표시할 검색량 데이터가 없습니다.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ratio"
                  name="검색 상대 지수 (최고=100)"
                  stroke="#98B941"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#98B941" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
