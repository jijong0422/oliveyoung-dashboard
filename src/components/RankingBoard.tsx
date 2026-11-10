/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import {
  Star,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  Calendar,
  Search,
  Download
} from "lucide-react";
import { Category, Product, ScrapeRun } from "../types";
import ProductDetailModal from "./ProductDetailModal";

interface RankingBoardProps {
  categories: Category[];
  historyRuns: ScrapeRun[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  selectedTimestamp: string;
  setSelectedTimestamp: (ts: string) => void;
  domesticProducts: Product[];
  globalProducts: Product[];
  isLoading: boolean;
}

// 제품 대표 사진 컴포넌트 (엉뚱한 Unsplash 스톡 이미지 폴백 완전 제거!)
function ProductThumbnail({ product }: { product: Product }) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isOfficialOyImage =
    product.imageUrl && product.imageUrl.includes("image.oliveyoung.co.kr");
  const proxyImageUrl = isOfficialOyImage
    ? product.imageUrl
    : `/api/product-image?brand=${encodeURIComponent(product.brand)}&q=${encodeURIComponent(
        product.name
      )}`;

  return (
    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0 flex items-center justify-center">
      {!loaded && !hasError && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}

      {!hasError ? (
        <img
          src={proxyImageUrl}
          alt={`${product.brand} ${product.name}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setHasError(true);
            setLoaded(true);
          }}
          className={`w-full h-full object-contain p-0.5 transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        /* 이미지를 못 찾았을 때 가짜 스톡 사진 대신 정직한 브랜드 타이포 아바타 표시 */
        <div className="w-full h-full bg-[#F8FAFC] flex flex-col items-center justify-center p-1 text-center">
          <span className="text-[11px] font-black text-[#7a9630] leading-tight line-clamp-2">
            {product.brand}
          </span>
        </div>
      )}

      {product.rank <= 3 && (
        <span className="absolute top-0 left-0 bg-[#1A1C1E]/85 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-br-md">
          TOP {product.rank}
        </span>
      )}
    </div>
  );
}

function RankChangeBadge({ change }: { change: number | "NEW" }) {
  if (change === "NEW") {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-extrabold bg-amber-100 text-amber-800">
        NEW
      </span>
    );
  }
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-red-600">
        <TrendingUp className="w-3 h-3" />+{change}
      </span>
    );
  }
  if (change < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-blue-600">
        <TrendingDown className="w-3 h-3" />
        {change}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-xs font-medium text-gray-400">
      <Minus className="w-3 h-3" />
    </span>
  );
}

export default function RankingBoard({
  categories,
  historyRuns,
  selectedCategory,
  setSelectedCategory,
  selectedTimestamp,
  setSelectedTimestamp,
  domesticProducts,
  globalProducts,
  isLoading
}: RankingBoardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [quickFilter, setQuickFilter] = useState<"all" | "special_set" | "high_discount" | "rookie">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filterProducts = (list: Product[]) => {
    return list.filter((p) => {
      if (searchTerm.trim()) {
        const lower = searchTerm.toLowerCase();
        if (!p.name.toLowerCase().includes(lower) && !p.brand.toLowerCase().includes(lower)) {
          return false;
        }
      }
      if (quickFilter === "special_set") {
        return !!(p.attributes && !p.attributes.isSingle);
      }
      if (quickFilter === "high_discount") {
        const disc =
          p.originalPrice && p.originalPrice > p.price
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 0;
        return disc >= 25;
      }
      if (quickFilter === "rookie") {
        return (
          p.change === "NEW" ||
          (typeof p.change === "number" && p.change >= 3) ||
          (p.reviewCount > 0 && p.rank <= 15 && p.reviewCount < 1000)
        );
      }
      return true;
    });
  };

  const filteredDomestic = filterProducts(domesticProducts);
  const filteredGlobal = filterProducts(globalProducts);
  const currentCategoryName =
    categories.find((c) => c.id === selectedCategory)?.name || "전체 카테고리";

  // [MD 인사이트] 1. 국내 vs 글로벌 교차 갭(Gap) 브랜드 & 2. 카테고리 핵심 소구 키워드 TOP 3
  const mdQuickInsights = React.useMemo(() => {
    const brandAliasMap: Record<string, string> = {
      TORRIDEN: "토리든",
      "ROUND LAB": "라운드랩",
      ROUNDLAB: "라운드랩",
      ANUA: "아누아",
      "BEAUTY OF JOSEON": "조선미녀",
      MEDIHEAL: "메디힐",
      AESTURA: "에스트라",
      "DR.G": "닥터지",
      CLIO: "클리오",
      "ROM&ND": "롬앤",
      ROMAND: "롬앤",
      "D'ALBA": "달바",
      DALBA: "달바",
      GOODAL: "구달",
      NUMBUZIN: "넘버즈인",
      COSRX: "코스알엑스",
      BIODANCE: "바이오던스",
      FATION: "파티온",
      UNOVE: "어노브",
      ILLIYOON: "일리윤",
      ORTHOMOL: "오쏘몰",
      LACTFIT: "락토핏"
    };

    const normalizeBrand = (b: string) => {
      const upper = b.trim().toUpperCase();
      return brandAliasMap[upper] || b.trim();
    };

    const domTop15Brands = new Set(domesticProducts.slice(0, 15).map((p) => normalizeBrand(p.brand)));
    const globTop15Brands = new Set(globalProducts.slice(0, 15).map((p) => normalizeBrand(p.brand)));
    const allGlobBrands = new Set(globalProducts.map((p) => normalizeBrand(p.brand)));
    const allDomBrands = new Set(domesticProducts.map((p) => normalizeBrand(p.brand)));

    // 국내 TOP 15에는 있으나 글로벌 TOP 30(또는 글로벌 TOP 15)에 없는 브랜드 (글로벌 확장 유망)
    let domOnlyTopBrands = Array.from(domTop15Brands)
      .filter((b) => !allGlobBrands.has(b))
      .slice(0, 3);
    if (domOnlyTopBrands.length === 0) {
      domOnlyTopBrands = Array.from(domTop15Brands)
        .filter((b) => !globTop15Brands.has(b))
        .slice(0, 3);
    }

    // 글로벌 TOP 15에는 있으나 국내 TOP 30(또는 국내 TOP 15)에 없는 브랜드 (K-뷰티 역직구 특화)
    let globOnlyTopBrands = Array.from(globTop15Brands)
      .filter((b) => !allDomBrands.has(b))
      .slice(0, 3);
    if (globOnlyTopBrands.length === 0) {
      globOnlyTopBrands = Array.from(globTop15Brands)
        .filter((b) => !domTop15Brands.has(b))
        .slice(0, 3);
    }

    // 상품명 및 성분에서 자주 등장하는 효능/성분/제형 키워드 빈도 집계
    const keywordRules = [
      { label: "수분/히알루론", regex: /수분|히알루론|다이브인|보습|속건조/i },
      { label: "진정/시카/어성초", regex: /진정|시카|어성초|티트리|판테놀|마데카|붉은기/i },
      { label: "장벽/세라마이드", regex: /장벽|세라마이드|아토베리어|크림|더마/i },
      { label: "미백/비타/잡티", regex: /미백|비타|잡티|브라이트닝|글루타치온|나이아신|토닝/i },
      { label: "모공/피지/각질", regex: /모공|피지|블랙헤드|각질|클렌징|바하|파하|살리실산/i },
      { label: "탄력/콜라겐/슬로우에이징", regex: /탄력|콜라겐|레티놀|펩타이드|리프팅|안티에이징|리들샷|PDRN/i },
      { label: "자외선차단/톤업선", regex: /선크림|선세럼|자외선|무기자차|유기자차|톤업|SPF/i },
      { label: "밀착/지속력/커버", regex: /쿠션|파운데이션|컨실러|픽서|밀착|커버|지속/i },
      { label: "글로우/물막/립틴트", regex: /틴트|글로우|립밤|플럼핑|블러셔|섀도우|물막/i },
      { label: "손상모/두피/단백질", regex: /트리트먼트|노워시|단백질|두피|탈모|샴푸|헤어/i },
      { label: "대용량/1+1기획", regex: /기획|1\+1|더블|리필|대용량|증정/i }
    ];

    const keywordCounts = keywordRules
      .map((rule) => {
        const count = domesticProducts.filter((p) => {
          const targetText = `${p.name} ${p.ingredients || ""} ${p.attributes?.packageType || ""}`;
          return rule.regex.test(targetText);
        }).length;
        return { label: rule.label, count };
      })
      .filter((k) => k.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return { domOnlyTopBrands, globOnlyTopBrands, keywordCounts };
  }, [domesticProducts, globalProducts]);

  // Google OAuth 로그인 없이 클릭 즉시 엑셀(CSV)로 저장하는 실무용 내보내기 함수
  const handleDownloadCsv = () => {
    const allRows = [...domesticProducts, ...globalProducts];
    if (allRows.length === 0) return;

    const headers = ["채널", "순위", "변동", "브랜드", "상품명", "판매가(원)", "정가(원)", "평점", "리뷰수", "상품링크"];
    const csvLines = [
      headers.join(","),
      ...allRows.map((p) =>
        [
          p.mallType === "domestic" ? "국내몰" : "글로벌몰",
          p.rank,
          p.change,
          `"${p.brand.replace(/"/g, '""')}"`,
          `"${p.name.replace(/"/g, '""')}"`,
          p.price,
          p.originalPrice || p.price,
          p.rating,
          p.reviewCount,
          `"${p.link}"`
        ].join(",")
      )
    ];

    // 한글 깨짐 방지를 위한 UTF-8 BOM(\uFEFF) 추가
    const blob = new Blob(["\uFEFF" + csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const catName = categories.find((c) => c.id === selectedCategory)?.name || selectedCategory;
    a.href = url;
    a.download = `올리브영_${catName}_TOP30_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderProductCard = (p: Product) => {
    const discountRate =
      p.originalPrice && p.originalPrice > p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

    return (
      <div
        key={p.id}
        onClick={() => setSelectedProduct(p)}
        className="p-3.5 bg-white hover:bg-gray-50/90 transition-colors flex items-start gap-3.5 border-b border-gray-100 last:border-b-0 cursor-pointer"
      >
        <div className="w-8 flex flex-col items-center justify-center pt-1 shrink-0">
          <span className={`text-sm font-black ${p.rank <= 3 ? "text-[#98B941]" : "text-gray-700"}`}>
            {p.rank}
          </span>
          <RankChangeBadge change={p.change} />
        </div>

        <ProductThumbnail product={p} />

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-gray-600 truncate">{p.brand}</span>
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-[#98B941] transition-colors shrink-0 p-0.5"
              title="올리브영 검색 결과 열기"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{p.name}</p>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {p.attributes?.packageType && (
              <span className="text-[11px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                <Package className="w-3 h-3 text-[#98B941]" />
                {p.attributes.packageType}
              </span>
            )}
            {p.attributes?.volume && (
              <span className="text-[11px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                {p.attributes.volume}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-1.5">
              {discountRate > 0 && (
                <span className="text-xs font-extrabold text-red-500">{discountRate}%</span>
              )}
              <span className="text-sm font-black text-gray-900">
                {p.price.toLocaleString()}원
              </span>
              {p.originalPrice && p.originalPrice > p.price && (
                <span className="text-xs text-gray-400 line-through">
                  {p.originalPrice.toLocaleString()}원
                </span>
              )}
            </div>

            {/* 실데이터 프로모션 플래그(세일/쿠폰/증정/오늘드림) 또는 리뷰 표시 */}
            {p.promoFlags && p.promoFlags.length > 0 ? (
              <div className="flex items-center gap-1">
                {p.promoFlags.map((flag) => (
                  <span
                    key={flag}
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      flag === "세일"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : flag === "쿠폰"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : flag === "오늘드림"
                        ? "bg-pink-50 text-pink-600 border border-pink-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {flag}
                  </span>
                ))}
              </div>
            ) : p.rating > 0 ? (
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{p.rating.toFixed(1)}</span>
                {p.reviewCount > 0 && (
                  <span className="text-gray-400">({p.reviewCount.toLocaleString()})</span>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4" id="ranking-board-stage">
      {/* 상단 필터 바 (가로 스크롤 없이 깔끔한 flex-wrap 배치) */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#98B941] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="브랜드 또는 상품명 필터..."
                className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none w-40"
              />
            </div>

            {/* MD 실무 퀵 필터 칩 */}
            <div className="flex flex-wrap items-center gap-1 bg-gray-100 p-1 rounded-lg">
              {[
                { id: "all", label: "전체 SKU" },
                { id: "special_set", label: "📦 기획/1+1만" },
                { id: "high_discount", label: "💸 25%↑ 고할인" },
                { id: "rookie", label: "🔥 급상승/루키" }
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setQuickFilter(chip.id as any)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                    quickFilter === chip.id
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={selectedTimestamp}
                onChange={(e) => setSelectedTimestamp(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
              >
                {historyRuns.map((run) => (
                  <option key={run.id} value={run.timestamp}>
                    {new Date(run.timestamp).toLocaleString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#98B941]" />
            엑셀(CSV) 즉시 다운로드
          </button>
        </div>
      </div>

      {/* [신규] MD 실무 3초 요약 배너: 채널 간 White-Space 브랜드 & 소구 키워드 TOP 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-extrabold text-gray-500 flex items-center gap-1.5">
            🎯 글로벌 확장 유망 (국내 강세·글로벌 미진입)
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {mdQuickInsights.domOnlyTopBrands.length > 0 ? (
              mdQuickInsights.domOnlyTopBrands.map((b) => (
                <span
                  key={b}
                  onClick={() => setSearchTerm(b)}
                  className="text-xs font-extrabold bg-[#98B941]/15 text-[#657d24] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[#98B941]/25 transition-colors"
                  title="클릭 시 해당 브랜드 필터링"
                >
                  {b}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">국내·글로벌 상위 브랜드 동조화 상태</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-extrabold text-gray-500 flex items-center gap-1.5">
            🌍 해외 팬덤 특화 (글로벌 강세·국내 미진입)
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {mdQuickInsights.globOnlyTopBrands.length > 0 ? (
              mdQuickInsights.globOnlyTopBrands.map((b) => (
                <span
                  key={b}
                  onClick={() => setSearchTerm(b)}
                  className="text-xs font-extrabold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md cursor-pointer hover:bg-blue-100 transition-colors"
                  title="클릭 시 해당 브랜드 필터링"
                >
                  {b}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">글로벌 단독 특화 브랜드 없음</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-extrabold text-gray-500 flex items-center gap-1.5">
            🧪 현재 카테고리 핵심 소구 키워드 TOP 3 (국내 30위 기준)
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {mdQuickInsights.keywordCounts.length > 0 ? (
              mdQuickInsights.keywordCounts.map((k, idx) => (
                <span
                  key={k.label}
                  className="text-xs font-extrabold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md"
                >
                  {idx + 1}위 {k.label} ({k.count}건)
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">집계된 주요 효능 키워드 없음</span>
            )}
          </div>
        </div>
      </div>

      {/* 국내몰 vs 글로벌몰 2단 비교 보드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">올리브영 국내몰 TOP 30</h3>
              <p className="text-xs text-gray-500">한국 소비자 실시간 구매 및 리뷰 데이터 기준 (클릭 시 상세 분석)</p>
            </div>
            <span className="text-xs font-bold bg-[#98B941]/15 text-[#7a9630] px-2.5 py-1 rounded-md">
              {domesticProducts.some(
                (p) =>
                  p.isRealData === true ||
                  (p.isRealData !== false && p.link?.includes("getGoodsDetail.do"))
              )
                ? "🟢 실시간 올리브영 연동"
                : "🟡 기준 시뮬레이션"}
            </span>
          </div>
          <div className="divide-y divide-gray-100 max-h-[720px] overflow-y-auto">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-gray-400 animate-pulse">
                랭킹 및 제품 사진을 불러오는 중입니다...
              </div>
            ) : filteredDomestic.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400">일치하는 상품이 없습니다.</div>
            ) : (
              filteredDomestic.map(renderProductCard)
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">올리브영 글로벌몰 TOP 30</h3>
              <p className="text-xs text-gray-500">북미·일본 등 해외 직구 베스트셀러 기준 (클릭 시 상세 분석)</p>
            </div>
            <span className="text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-md">
              {globalProducts.some((p) => p.isRealData === true || p.id.startsWith("glob_"))
                ? "🟢 글로벌몰 실데이터"
                : "🟡 글로벌 기준 데이터"}
            </span>
          </div>
          <div className="divide-y divide-gray-100 max-h-[720px] overflow-y-auto">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-gray-400 animate-pulse">
                랭킹 및 제품 사진을 불러오는 중입니다...
              </div>
            ) : filteredGlobal.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400">일치하는 상품이 없습니다.</div>
            ) : (
              filteredGlobal.map(renderProductCard)
            )}
          </div>
        </div>
      </div>

      {/* 상품 상세 분석 모달 */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          categoryName={currentCategoryName}
        />
      )}
    </div>
  );
}
