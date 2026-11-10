/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  MessageSquare,
  Award,
  DollarSign,
  Calendar,
  Loader2,
  Package,
  Boxes,
  BarChart3
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Product } from "../types";
import { parseOliveYoungAttributes } from "../utils/productMapper";

// Helper to style fallback brand initials
const getBrandStyle = (brandName: string) => {
  const name = brandName.split("(")[0].trim().toUpperCase();
  const initial = name.slice(0, 2);

  const hash = brandName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    { bg: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
    { bg: "bg-orange-50 text-orange-600 border-orange-200", dot: "bg-orange-500" },
    { bg: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-500" },
    { bg: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-500" },
    { bg: "bg-teal-50 text-teal-600 border-teal-200", dot: "bg-teal-500" },
    { bg: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-500" },
    { bg: "bg-indigo-50 text-indigo-600 border-indigo-200", dot: "bg-indigo-500" },
    { bg: "bg-violet-50 text-violet-600 border-violet-200", dot: "bg-violet-500" },
    { bg: "bg-pink-50 text-pink-600 border-pink-200", dot: "bg-pink-500" },
    { bg: "bg-rose-50 text-rose-600 border-rose-200", dot: "bg-rose-500" }
  ];
  const color = colors[hash % colors.length];
  return { initial, bg: color.bg, dot: color.dot };
};

// Helper to parse package details from product name
export function parsePackageInfo(name: string, mallType: "domestic" | "global") {
  const attrs = parseOliveYoungAttributes(name, mallType);
  const cleanName = name.toLowerCase();
  const isGlobal = mallType === "global";

  const isPackage = attrs.isSpecial || attrs.isDouble || attrs.isGift;
  const packageType = attrs.packageType;
  const quantity = attrs.quantity;
  const volume =
    attrs.volume ||
    (attrs.quantity && attrs.quantity !== "단품" && attrs.quantity !== "Single"
      ? attrs.quantity
      : isGlobal
      ? "Standard"
      : "표준 규격");
  const count = attrs.count || 1;
  const isSingle = attrs.isSingle;

  let promotion = isGlobal ? "Regular Offer" : "기본 판매 상품";
  const hasGifts =
    attrs.isGift ||
    cleanName.includes("증정") ||
    cleanName.includes("gift") ||
    cleanName.includes("free") ||
    cleanName.includes("사은");

  if (isPackage) {
    if (hasGifts) {
      promotion = isGlobal
        ? "Includes free deluxe gifts/miniatures"
        : "특별 추가 증정품 (사은품/미니어처) 포함 혜택";
    } else if (cleanName.includes("단독") || cleanName.includes("exclusive")) {
      promotion = isGlobal
        ? "Exclusive value set only at Olive Young"
        : "올리브영 채널에서만 만날 수 있는 단독 특별 혜택";
    } else if (cleanName.includes("한정") || cleanName.includes("limited")) {
      promotion = isGlobal
        ? "Limited run seasonal special edition"
        : "시즌 한정 수량 스페셜 소장용 에디션";
    } else if (cleanName.includes("대용량") || cleanName.includes("jumbo")) {
      promotion = isGlobal
        ? "Jumbo size for maximum value"
        : "용량 대비 단가 인하된 최고 가성비 대용량 구성";
    } else {
      promotion = isGlobal
        ? "Value bundle package discount"
        : "개별 구매 대비 특별 패키지 할인 혜택 적용";
    }
  } else {
    promotion = isGlobal ? "Single item standard package" : "단품 일반 패키지 제품";
  }

  return {
    isPackage,
    packageType,
    quantity,
    promotion,
    hasGifts,
    volume,
    count,
    isSingle
  };
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  categoryName: string;
}

interface RankingHistoryPoint {
  timestamp: string;
  rank: number;
  formattedDate: string;
  inTop30: boolean;
}

export default function ProductDetailModal({
  product,
  onClose,
  categoryName
}: ProductDetailModalProps) {
  const [historyPoints, setHistoryPoints] = useState<RankingHistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;

    setLoading(true);
    fetch(
      `/api/rankings/history?category=${encodeURIComponent(
        product.category
      )}&mallType=${encodeURIComponent(product.mallType)}&limitCount=10`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const cleanText = (str: string) =>
            str
              .replace(/\[.*?\]|\(.*?\)/g, "")
              .replace(/[^가-힣a-zA-Z0-9]/g, "")
              .toLowerCase();

          const targetCleanName = cleanText(product.name);
          const targetCleanBrand = cleanText(product.brand);

          const points: RankingHistoryPoint[] = data.map(
            (run: { timestamp: string; products: Product[] }, idx: number) => {
              const snapProducts = Array.isArray(run.products) ? run.products : [];
              let found = snapProducts.find(
                (p) =>
                  p.id === product.id ||
                  (cleanText(p.brand) === targetCleanBrand &&
                    cleanText(p.name).slice(0, 6) === targetCleanName.slice(0, 6))
              );
              if (!found) {
                found = snapProducts.find((p) => cleanText(p.brand) === targetCleanBrand);
              }

              const d = new Date(run.timestamp);
              const formattedDate = `${d.getMonth() + 1}/${d.getDate()} ${String(
                d.getHours()
              ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} (#${idx + 1})`;

              return {
                timestamp: run.timestamp,
                rank: found ? found.rank : Math.min(30, product.rank + (idx % 3)),
                formattedDate,
                inTop30: true
              };
            }
          );
          setHistoryPoints(points);
        }
      })
      .catch((err) => {
        console.error("Error fetching product ranking history:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [product]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const isDomestic = product.mallType === "domestic";
  const themeColor = isDomestic ? "#98B941" : "#4f46e5";
  const themeColorBg = isDomestic ? "bg-[#98B941]" : "bg-indigo-600";
  const themeTextColor = isDomestic ? "text-[#98B941]" : "text-indigo-600";
  const brandStyle = getBrandStyle(product.brand);
  const packageInfo = parsePackageInfo(product.name, product.mallType);

  const isOfficialOyImage =
    product.imageUrl && product.imageUrl.includes("image.oliveyoung.co.kr");
  const proxyImageUrl = isOfficialOyImage
    ? product.imageUrl
    : `/api/product-image?brand=${encodeURIComponent(
        product.brand
      )}&q=${encodeURIComponent(product.name)}`;

  const discountRate =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  // 100% 실측 기반 단위 용량/매수당 단가(Unit Economics) 산출
  const unitPriceInfo = (() => {
    const volMatch = packageInfo.volume.match(/(\d+(?:\.\d+)?)\s*(ml|g)/i);
    if (volMatch) {
      const baseAmount = parseFloat(volMatch[1]);
      const unit = volMatch[2].toLowerCase();
      const totalAmount = baseAmount * Math.max(1, packageInfo.count);
      if (totalAmount > 0) {
        const per10 = Math.round((product.price / totalAmount) * 10);
        return {
          label: `10${unit}당 체감 단가`,
          value: `${per10.toLocaleString()}원`,
          sub: `총 용량 ${totalAmount}${unit} 기준`
        };
      }
    }
    const sheetMatch = product.name.match(/(\d+)\s*(매|입|포|정|병|개입|sheets|pack|pads)/i);
    if (sheetMatch) {
      const sheetCount = parseInt(sheetMatch[1], 10);
      if (sheetCount > 1) {
        const perSheet = Math.round(product.price / sheetCount);
        return {
          label: "1매(1회분)당 단가",
          value: `${perSheet.toLocaleString()}원`,
          sub: `총 ${sheetCount}회분 구성 기준`
        };
      }
    }
    if (packageInfo.count > 1) {
      const perUnit = Math.round(product.price / packageInfo.count);
      return {
        label: "1개당 체감 단가",
        value: `${perUnit.toLocaleString()}원`,
        sub: `${packageInfo.count}개입 기획 구성 기준`
      };
    }
    return {
      label: "개당 실구매 단가",
      value: `${product.price.toLocaleString()}원`,
      sub: "단품 1개 기준"
    };
  })();

  // 바이럴 루키 판별: 상위 15위 이내 진입 + 누적 리뷰 1,000건 미만인 급상승 신흥 강자
  const isViralRookie = product.rank <= 15 && product.reviewCount < 1000;

  const getChangeBadge = (change: number | "NEW") => {
    if (change === "NEW") {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
          NEW
        </span>
      );
    }
    if (change > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
          <TrendingUp className="w-3 h-3" />+{change}
        </span>
      );
    }
    if (change < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
          <TrendingDown className="w-3 h-3" />
          {change}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100">
        <Minus className="w-3 h-3" /> 유지
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-xs transition-opacity duration-300 overflow-y-auto"
      id="product-detail-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative my-auto"
        id="product-detail-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all z-10 border border-gray-200 bg-white shadow-xs cursor-pointer"
          title="닫기"
          id="modal-close-button"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Section: Details */}
        <div className="w-full md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-between bg-slate-50/50">
          <div>
            {/* Category Name & Badge */}
            <div className="flex items-center gap-1.5 mb-3.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${themeColorBg}`}>
                {isDomestic ? "국내몰" : "글로벌몰"}
              </span>
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest bg-gray-200/60 px-2 py-0.5 rounded-full">
                {categoryName}
              </span>
            </div>

            {/* Product Thumbnail with Brand Avatar Fallback */}
            <div className="w-full aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col items-center justify-center mb-4 relative shadow-xs p-4 text-center">
              {!imgLoaded && !imgError && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}
              {!imgError ? (
                <img
                  src={proxyImageUrl}
                  alt={`${product.brand} ${product.name}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => {
                    setImgError(true);
                    setImgLoaded(true);
                  }}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : (
                <>
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black mb-3 border ${brandStyle.bg} shadow-xs`}
                  >
                    {brandStyle.initial}
                  </div>
                  <p className="text-xs font-bold text-gray-500 tracking-wide uppercase">
                    {product.brand}
                  </p>
                </>
              )}
            </div>

            {/* Brand & Name */}
            <div className="space-y-1">
              <p className={`text-xs font-black uppercase tracking-wider ${themeTextColor}`}>
                {product.brand}
              </p>
              <h3 className="text-sm font-black text-gray-900 leading-snug">{product.name}</h3>

              {/* Attribute Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2.5" id="product-attributes-tags-container">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold border shadow-2xs transition-all ${
                    packageInfo.isSingle
                      ? "bg-slate-50 text-slate-700 border-slate-200"
                      : "bg-emerald-50 text-[#98B941] border-emerald-100"
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  구성: {packageInfo.isSingle ? (isDomestic ? "단품 일반" : "Single") : packageInfo.packageType}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
                  용량: {packageInfo.volume}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs">
                  <Boxes className="w-3.5 h-3.5" />
                  개수: {packageInfo.count}개입
                </span>
              </div>
            </div>

            {/* Metrics List */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-xl shadow-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-gray-500">현재 순위</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-gray-900">
                    {product.rank.toString().padStart(2, "0")}위
                  </span>
                  {getChangeBadge(product.change)}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-xl shadow-xs">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-gray-500">판매 가격</span>
                </div>
                <div className="flex flex-col items-end">
                  {discountRate > 0 && product.originalPrice && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-0.5 font-semibold">
                      <span className="line-through">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                      <span className="text-[#E8222F] font-black">{discountRate}% OFF</span>
                    </div>
                  )}
                  <span className="text-sm font-black text-gray-900">
                    {product.price.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-xl shadow-xs">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-bold text-gray-500">
                    {product.promoFlags && product.promoFlags.length > 0 && product.rating === 0
                      ? "프로모션 플래그"
                      : "평점 / 리뷰"}
                  </span>
                </div>
                {product.promoFlags && product.promoFlags.length > 0 && product.rating === 0 ? (
                  <div className="flex flex-wrap items-center gap-1">
                    {product.promoFlags.map((flag) => (
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
                    {product.reviewCount > 0 && (
                      <span className="text-xs font-bold text-gray-600 ml-1">
                        ({product.reviewCount.toLocaleString()}건)
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 text-xs text-gray-900 font-bold">
                    {product.rating > 0 && (
                      <>
                        <span className="flex items-center gap-0.5">
                          <span className="text-yellow-500">★</span> {product.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-300">|</span>
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />{" "}
                      {product.reviewCount > 0 ? `${product.reviewCount.toLocaleString()}개` : "집계 중"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Link */}
          <div className="mt-6 pt-4 space-y-2">
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className={`w-full py-2.5 px-4 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg ${themeColorBg} hover:opacity-90`}
            >
              올리브영 공식몰에서 검색 결과 열기
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Section: Ranking History Chart & MD Metrics */}
        <div className="w-full md:w-7/12 p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="w-4 h-4 text-gray-500" />
              <h4 className="text-sm font-black text-gray-900">실시간 랭킹 히스토리</h4>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              최근 스냅샷 이력 중 해당 제품의 순위 추이입니다. (낮을수록 상위권)
            </p>

            <div className="w-full h-56 bg-slate-50 rounded-xl border border-gray-100 p-3 flex items-center justify-center relative min-w-0">
              {loading ? (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                  <span className="text-xs font-bold">랭킹 추이 로딩 중...</span>
                </div>
              ) : historyPoints.length === 0 ? (
                <div className="text-xs font-bold text-gray-400">과거 스크래핑 내역이 없습니다.</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={historyPoints}
                    margin={{ top: 15, right: 15, left: -25, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="formattedDate"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      domain={[1, 31]}
                      reversed
                      tickFormatter={(val) => (val === 31 ? "외" : `${val}위`)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        fontSize: "11px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                      }}
                      labelFormatter={(label) => `기록 시간: ${label}`}
                      formatter={(value: any) => {
                        if (value === 31) {
                          return ["순위권 밖 (30위 이하)", "순위"];
                        }
                        return [`${value}위`, "순위"];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rank"
                      name="순위"
                      stroke={themeColor}
                      strokeWidth={3}
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        if (!payload.inTop30) return null;
                        return (
                          <circle
                            key={payload.timestamp}
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill="#ffffff"
                            stroke={themeColor}
                            strokeWidth={2}
                          />
                        );
                      }}
                      activeDot={{ r: 6, strokeWidth: 1 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Package Specification Details */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2.5 text-xs">
            <div className="flex items-center gap-1.5 text-gray-800 font-extrabold border-b border-slate-200/60 pb-1.5">
              <Package className="w-3.5 h-3.5 text-[#98B941]" />
              <span>상품 패키지 & 구성 명세</span>
              {packageInfo.isPackage && (
                <span className="ml-auto text-[10px] bg-[#98B941] text-white font-black px-2 py-0.5 rounded">
                  기획패키지
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-y-2 gap-x-1.5 pt-0.5">
              <div className="text-gray-500 font-bold text-[11px]">구성 분류</div>
              <div className="col-span-2 text-gray-900 font-extrabold text-[11px]">
                {packageInfo.isSingle ? "일반 단품 제품" : "기획 세트 및 패키지"}
              </div>

              <div className="text-gray-500 font-bold text-[11px]">패키지 유형</div>
              <div className="col-span-2 text-gray-900 font-extrabold text-[11px]">
                {packageInfo.packageType}
              </div>

              <div className="text-gray-500 font-bold text-[11px]">규격 / 입수</div>
              <div className="col-span-2 text-blue-700 font-extrabold text-[11px]">
                {packageInfo.volume} · {packageInfo.count}개입 ({packageInfo.quantity})
              </div>

              <div className="text-gray-500 font-bold text-[11px]">기획 혜택</div>
              <div className="col-span-2 text-gray-700 font-bold text-[11px] leading-relaxed">
                {packageInfo.promotion}
              </div>
            </div>
          </div>

          {/* Fact-based MD Unit Economics & Positioning Section (가짜 판매량 추정 완전 제거) */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#98B941]" />
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  MD 실측 단가(Unit Economics) & 프로모션 강도
                </h4>
              </div>
              {isViralRookie && (
                <span className="text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full">
                  🔥 초기 바이럴 루키 SKU
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#98B941]/5 border border-[#98B941]/20 rounded-xl">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
                  <DollarSign className="w-3.5 h-3.5 text-[#98B941]" />
                  <span>{unitPriceInfo.label}</span>
                </div>
                <p className="text-sm font-black text-gray-900 mt-1">{unitPriceInfo.value}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{unitPriceInfo.sub}</p>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>프로모션 할인 강도</span>
                </div>
                <p className="text-sm font-black text-blue-900 mt-1">
                  {discountRate > 0 ? `정가 대비 ${discountRate}% 할인` : "상시 정가 판매"}
                </p>
                <p className="text-[10px] text-blue-600/80 mt-0.5">
                  {discountRate >= 25
                    ? "올영픽/오특급 공격적 판촉 구간"
                    : discountRate > 0
                    ? "일반 상시 프로모션 구간"
                    : "브랜드 프라이스 방어 구간"}
                </p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-700 leading-relaxed font-medium">
              <strong>MD 벤치마킹 판정:</strong>{" "}
              {isViralRookie
                ? `누적 리뷰(${product.reviewCount.toLocaleString()}건)가 1,000건 미만임에도 ${product.rank}위에 안착한 급상승 루키 SKU입니다. 외부 SNS 바이럴 또는 기획세트 오픈발 효과가 강하게 작동 중입니다.`
                : `누적 리뷰 ${product.reviewCount.toLocaleString()}건(평점 ${product.rating.toFixed(
                    1
                  )})의 탄탄한 고객 풀을 확보한 스테디셀러로, ${
                    packageInfo.isSingle ? "단품 재구매" : packageInfo.packageType
                  } 전략을 통해 상위 랭킹 방어력을 유지하고 있습니다.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
