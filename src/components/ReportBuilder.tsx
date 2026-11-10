/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useMemo, useState } from "react";
import {
  Printer,
  BarChart2,
  AlertCircle,
  Scale,
  ClipboardList,
  PackageCheck
} from "lucide-react";
import { User } from "firebase/auth";
import { Category, Product, ScrapeRun } from "../types";

interface ReportBuilderProps {
  categories: Category[];
  domesticProducts: Product[];
  globalProducts: Product[];
  historyRuns: ScrapeRun[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  selectedTimestamp: string;
  setSelectedTimestamp: (ts: string) => void;
  isDataLoading: boolean;
  user: User | null;
}

export default function ReportBuilder({
  categories,
  domesticProducts,
  globalProducts,
  selectedCategory,
  setSelectedCategory,
  selectedTimestamp,
  isDataLoading,
  user
}: ReportBuilderProps) {
  const [authorName, setAuthorName] = useState(user?.displayName || "담당 MD");
  const [departmentName, setDepartmentName] = useState("상품기획팀 (Beauty MD)");

  // [신규] 올리브영 채널 마진 및 목표 제조원가(COGS) 역산 시뮬레이터 상태
  const [targetRetailPrice, setTargetRetailPrice] = useState<number>(0);
  const [channelMarginRate, setChannelMarginRate] = useState<number>(55); // 올리브영 평균 입점 수수료/마진율 기본값 55%
  const [targetCogsRate, setTargetCogsRate] = useState<number>(22); // 공급가 대비 목표 제조원가율 기본값 22%

  // 카테고리 변경 시 수동 입력 타겟 판매가를 초기화하여 해당 카테고리 중위가(medianDomPrice)가 자동 반영되도록 처리
  useEffect(() => {
    setTargetRetailPrice(0);
  }, [selectedCategory]);

  const categoryName =
    categories.find((c) => c.id === selectedCategory)?.name || "전체 카테고리";

  // 수집된 실데이터(Fact)만으로 엄격하게 통계 산출 (추정치/과장 배제)
  const factMetrics = useMemo(() => {
    const domCount = domesticProducts.length;
    const globCount = globalProducts.length;

    const calcAvg = (arr: number[]) =>
      arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    const calcMedian = (arr: number[]) => {
      if (arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0
        ? sorted[mid]
        : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    };

    const domPrices = domesticProducts.map((p) => p.price).filter((v) => v > 0);
    const globPrices = globalProducts.map((p) => p.price).filter((v) => v > 0);

    const avgDomPrice = calcAvg(domPrices);
    const medianDomPrice = calcMedian(domPrices);
    const avgGlobPrice = calcAvg(globPrices);
    const medianGlobPrice = calcMedian(globPrices);

    // 정가 대비 할인율 계산 (실제 originalPrice가 존재하는 데이터만 대상)
    const discountedDom = domesticProducts.filter(
      (p) => p.originalPrice && p.originalPrice > p.price
    );
    const avgDomDiscountRate =
      discountedDom.length > 0
        ? Math.round(
            discountedDom.reduce(
              (acc, p) => acc + ((p.originalPrice! - p.price) / p.originalPrice!) * 100,
              0
            ) / discountedDom.length
          )
        : 0;

    // 기획세트(1+1, 더블, 기획, 증정) 비중 산출
    const isSpecialSet = (p: Product) =>
      Boolean(
        p.attributes?.isSpecial ||
          p.attributes?.isDouble ||
          p.attributes?.isGift ||
          /기획|1\+1|더블|세트|special|double|set/i.test(p.name)
      );

    const domSpecialCount = domesticProducts.filter(isSpecialSet).length;
    const globSpecialCount = globalProducts.filter(isSpecialSet).length;
    const domSpecialRatio = domCount > 0 ? Math.round((domSpecialCount / domCount) * 100) : 0;
    const globSpecialRatio = globCount > 0 ? Math.round((globSpecialCount / globCount) * 100) : 0;

    // 브랜드 점유율 (TOP 30 내 2개 이상 진입한 강세 브랜드 추출)
    const countBrands = (list: Product[]) => {
      const map: Record<string, { count: number; bestRank: number; avgPrice: number }> = {};
      list.forEach((p) => {
        if (!map[p.brand]) {
          map[p.brand] = { count: 0, bestRank: p.rank, avgPrice: 0 };
        }
        map[p.brand].count += 1;
        map[p.brand].bestRank = Math.min(map[p.brand].bestRank, p.rank);
        map[p.brand].avgPrice += p.price;
      });
      return Object.entries(map)
        .map(([brand, info]) => ({
          brand,
          count: info.count,
          bestRank: info.bestRank,
          avgPrice: Math.round(info.avgPrice / info.count)
        }))
        .sort((a, b) => b.count - a.count || a.bestRank - b.bestRank);
    };

    const topDomBrands = countBrands(domesticProducts).slice(0, 5);
    const topGlobBrands = countBrands(globalProducts).slice(0, 5);

    // 리뷰 검증도 (TOP 10 평균 리뷰 수 및 평점 / 실데이터 프로모션 배지 집계)
    const domTop10 = domesticProducts.slice(0, 10);
    const ratedTop10 = domTop10.filter((p) => p.rating > 0);
    const avgDomTop10Reviews = calcAvg(domTop10.filter((p) => p.reviewCount > 0).map((p) => p.reviewCount));
    const avgDomTop10Rating =
      ratedTop10.length > 0
        ? (ratedTop10.reduce((a, b) => a + b.rating, 0) / ratedTop10.length).toFixed(2)
        : "0.00";
    const domTop10SaleCount = domTop10.filter(
      (p) => p.promoFlags?.includes("세일") || (p.originalPrice && p.originalPrice > p.price)
    ).length;
    const domTop10CouponGiftCount = domTop10.filter(
      (p) => p.promoFlags?.includes("쿠폰") || p.promoFlags?.includes("증정")
    ).length;

    // 가격대 구간 분포 (국내몰 기준)
    const priceBands = {
      under15k: domesticProducts.filter((p) => p.price < 15000).length,
      from15kTo25k: domesticProducts.filter((p) => p.price >= 15000 && p.price <= 25000).length,
      over25k: domesticProducts.filter((p) => p.price > 25000).length
    };

    return {
      domCount,
      globCount,
      avgDomPrice,
      medianDomPrice,
      avgGlobPrice,
      medianGlobPrice,
      avgDomDiscountRate,
      discountedDomCount: discountedDom.length,
      domSpecialCount,
      domSpecialRatio,
      globSpecialCount,
      globSpecialRatio,
      topDomBrands,
      topGlobBrands,
      avgDomTop10Reviews,
      avgDomTop10Rating,
      domTop10SaleCount,
      domTop10CouponGiftCount,
      priceBands,
      domTop3: domesticProducts.slice(0, 3),
      globTop3: globalProducts.slice(0, 3)
    };
  }, [domesticProducts, globalProducts]);

  // [신규] 타겟 판매가 기본값을 카테고리 중위가(medianDomPrice)와 연동하여 손익(P&L) 역산
  const pnlSim = useMemo(() => {
    const finalSellingPrice =
      targetRetailPrice > 0 ? targetRetailPrice : factMetrics.medianDomPrice || 18000;
    const vatExcludedPrice = Math.round(finalSellingPrice / 1.1); // 부가세(10%) 제외 실판매가
    const supplyPriceToOY = Math.round(vatExcludedPrice * (1 - channelMarginRate / 100)); // 브랜드사 올리브영 납품 공급가
    const maxAllowedCogs = Math.round(supplyPriceToOY * (targetCogsRate / 100)); // OEM/ODM 최대 허용 제조원가(내용물+부자재)
    const brandGrossMargin = supplyPriceToOY - maxAllowedCogs; // 개당 브랜드 매출총이익(마케팅·물류비 재원)

    return {
      finalSellingPrice,
      vatExcludedPrice,
      supplyPriceToOY,
      maxAllowedCogs,
      brandGrossMargin
    };
  }, [targetRetailPrice, factMetrics.medianDomPrice, channelMarginRate, targetCogsRate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5" id="md-prd-report-builder">
      {/* 컨트롤 바 (인쇄 시 숨김) */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
            <span className="text-xs font-bold text-gray-500">분석 카테고리:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-gray-900 focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="소속 부서"
            className="text-xs font-semibold border border-gray-200 rounded-lg px-3 py-2 w-44"
          />
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="작성자명"
            className="text-xs font-semibold border border-gray-200 rounded-lg px-3 py-2 w-32"
          />
        </div>

        <button
          onClick={handlePrint}
          className="bg-[#1A1C1E] hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Printer className="w-4 h-4 text-[#98B941]" />
          실무 기획서 PDF 인쇄 / 저장
        </button>
      </div>

      {/* 실무 MD 제품기획서 (PRD) 본문 영역 */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-xs p-6 md:p-10 space-y-8 print:border-0 print:shadow-none print:p-0">
        {/* 문서 헤더 */}
        <div className="border-b-2 border-gray-900 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-gray-900 text-white text-xs font-extrabold px-2.5 py-0.5 rounded">
                MD 상품기획 기초조사서 (Fact-Based PRD)
              </span>
              <span className="text-xs font-bold text-[#7a9630] bg-[#98B941]/15 px-2.5 py-0.5 rounded">
                과장·추정 배제 실측 데이터 기반
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              [{categoryName}] 국내·글로벌 TOP 30 벤치마킹 및 SKU 기획안
            </h1>
          </div>

          <div className="text-xs text-gray-600 space-y-0.5 sm:text-right font-medium">
            <p>
              <strong>작성 부서/담당:</strong> {departmentName} / {authorName}
            </p>
            <p>
              <strong>기준 데이터 시각:</strong>{" "}
              {selectedTimestamp
                ? new Date(selectedTimestamp).toLocaleString("ko-KR")
                : "최신 스냅샷"}
            </p>
            <p>
              <strong>표본 규모:</strong> 국내몰 {factMetrics.domCount}개 / 글로벌몰{" "}
              {factMetrics.globCount}개 (총 {factMetrics.domCount + factMetrics.globCount}개 SKU)
            </p>
          </div>
        </div>

        {isDataLoading ? (
          <div className="py-16 text-center text-sm text-gray-400 animate-pulse">
            실측 데이터를 기반으로 MD 기획서를 연산하고 있습니다...
          </div>
        ) : (
          <>
            {/* 섹션 1: 정량 지표 요약 (Quantitative Evidence) */}
            <section className="space-y-3">
              <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 border-l-4 border-[#98B941] pl-2.5">
                <Scale className="w-4 h-4 text-[#98B941]" />
                1. 카테고리 가격 및 프로모션 실측 지표 (표본: TOP 30)
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5">
                  <span className="text-xs font-semibold text-gray-500 block">
                    국내몰 평균가 / 중위가
                  </span>
                  <span className="text-base font-black text-gray-900 mt-1 block">
                    {factMetrics.avgDomPrice.toLocaleString()}원{" "}
                    <span className="text-xs font-bold text-gray-500">
                      (중위 {factMetrics.medianDomPrice.toLocaleString()}원)
                    </span>
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    할인 적용 {factMetrics.discountedDomCount}개 상품 평균 할인율{" "}
                    <strong>{factMetrics.avgDomDiscountRate}%</strong>
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5">
                  <span className="text-xs font-semibold text-gray-500 block">
                    글로벌몰 평균가 / 중위가
                  </span>
                  <span className="text-base font-black text-gray-900 mt-1 block">
                    {factMetrics.avgGlobPrice.toLocaleString()}원{" "}
                    <span className="text-xs font-bold text-gray-500">
                      (중위 {factMetrics.medianGlobPrice.toLocaleString()}원)
                    </span>
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    국내 평균가 대비{" "}
                    <strong>
                      {factMetrics.avgDomPrice > 0
                        ? `${Math.round(
                            ((factMetrics.avgGlobPrice - factMetrics.avgDomPrice) /
                              factMetrics.avgDomPrice) *
                              100
                          )}%`
                        : "0%"}
                    </strong>{" "}
                    가격 차이
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5">
                  <span className="text-xs font-semibold text-gray-500 block">
                    기획세트(1+1·더블·증정) 비중
                  </span>
                  <span className="text-base font-black text-gray-900 mt-1 block">
                    국내 {factMetrics.domSpecialRatio}% / 글로벌 {factMetrics.globSpecialRatio}%
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    국내 30개 중 {factMetrics.domSpecialCount}개, 글로벌 30개 중{" "}
                    {factMetrics.globSpecialCount}개가 기획 구성
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5">
                  <span className="text-xs font-semibold text-gray-500 block">
                    {factMetrics.avgDomTop10Reviews > 0
                      ? "국내 TOP 10 평균 리뷰·평점"
                      : "국내 TOP 10 프로모션 배지 현황"}
                  </span>
                  {factMetrics.avgDomTop10Reviews > 0 ? (
                    <>
                      <span className="text-base font-black text-gray-900 mt-1 block">
                        {factMetrics.avgDomTop10Reviews.toLocaleString()}건{" "}
                        {factMetrics.avgDomTop10Rating !== "0.00" && (
                          <span className="text-xs font-bold text-amber-600">
                            (★ {factMetrics.avgDomTop10Rating})
                          </span>
                        )}
                      </span>
                      <p className="text-[11px] text-gray-500 mt-1">
                        상위권 진입을 위한 최소 리뷰 볼륨 기준점
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-base font-black text-gray-900 mt-1 block">
                        세일 {factMetrics.domTop10SaleCount}건 / 쿠폰·증정{" "}
                        {factMetrics.domTop10CouponGiftCount}건
                      </span>
                      <p className="text-[11px] text-gray-500 mt-1">
                        실시간 TOP 10 내 프로모션 플래그 적용 SKU 수
                      </p>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* 섹션 2: 경쟁사 벤치마킹 팩트 테이블 (근거 중심) */}
            <section className="space-y-3">
              <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 border-l-4 border-[#98B941] pl-2.5">
                <BarChart2 className="w-4 h-4 text-[#98B941]" />
                2. 채널별 상위 랭킹 실측 벤치마킹 (TOP 3 레퍼런스 및 점유 브랜드)
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 space-y-2.5">
                  <h3 className="text-xs font-extrabold text-gray-800">
                    [국내몰] 실측 1~3위 SKU 및 다수 진입 브랜드
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {factMetrics.domTop3.map((p) => (
                      <li key={p.id} className="bg-gray-50 p-2.5 rounded border border-gray-100">
                        <strong>
                          {p.rank}위 [{p.brand}]
                        </strong>{" "}
                        {p.name} —{" "}
                        <span className="font-bold text-gray-900">
                          {p.price.toLocaleString()}원
                        </span>{" "}
                        {p.promoFlags && p.promoFlags.length > 0
                          ? `[배지: ${p.promoFlags.join("·")}]`
                          : p.rating > 0
                          ? `(평점 ${p.rating}, 리뷰 ${p.reviewCount.toLocaleString()}건)`
                          : ""}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-600 pt-1">
                    <strong>TOP 30 내 최다 진입 브랜드:</strong>{" "}
                    {factMetrics.topDomBrands
                      .map((b) => `${b.brand}(${b.count}개, 평균 ${b.avgPrice.toLocaleString()}원)`)
                      .join(", ")}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 space-y-2.5">
                  <h3 className="text-xs font-extrabold text-gray-800">
                    [글로벌몰] 실측 1~3위 SKU 및 다수 진입 브랜드
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {factMetrics.globTop3.map((p) => (
                      <li key={p.id} className="bg-gray-50 p-2.5 rounded border border-gray-100">
                        <strong>
                          {p.rank}위 [{p.brand}]
                        </strong>{" "}
                        {p.name} —{" "}
                        <span className="font-bold text-gray-900">
                          {p.price.toLocaleString()}원
                        </span>{" "}
                        {p.promoFlags && p.promoFlags.length > 0
                          ? `[배지: ${p.promoFlags.join("·")}]`
                          : p.rating > 0
                          ? `(평점 ${p.rating}, 리뷰 ${p.reviewCount.toLocaleString()}건)`
                          : ""}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-600 pt-1">
                    <strong>TOP 30 내 최다 진입 브랜드:</strong>{" "}
                    {factMetrics.topGlobBrands
                      .map((b) => `${b.brand}(${b.count}개, 평균 ${b.avgPrice.toLocaleString()}원)`)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </section>

            {/* 섹션 3: 데이터 근거 기반 MD 상품 기획안 (Product Spec & Pricing Guide) */}
            <section className="space-y-3">
              <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 border-l-4 border-[#98B941] pl-2.5">
                <ClipboardList className="w-4 h-4 text-[#98B941]" />
                3. 실측 데이터 기반 신상품(또는 리뉴얼) MD 기획 명세서
              </h2>

              <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                  <div className="bg-gray-50 p-3 font-extrabold text-gray-800 border-b md:border-b-0 md:border-r border-gray-200">
                    권장 타겟 판매가 (프로모션가)
                  </div>
                  <div className="p-3 md:col-span-3 text-gray-700 space-y-1">
                    <p className="font-bold text-gray-900">
                      국내몰 권장가: {factMetrics.medianDomPrice.toLocaleString()}원 내외 (권장 정가 설정:{" "}
                      {Math.round(
                        factMetrics.medianDomPrice / (1 - factMetrics.avgDomDiscountRate / 100 || 0.8)
                      ).toLocaleString()}
                      원, 할인율 {factMetrics.avgDomDiscountRate}% 적용 시)
                    </p>
                    <p className="text-gray-500">
                      <strong>산출 근거:</strong> 현재 국내 TOP 30의 가격대 분포는 1.5만원 미만{" "}
                      {factMetrics.priceBands.under15k}개, 1.5만~2.5만원{" "}
                      {factMetrics.priceBands.from15kTo25k}개, 2.5만원 초과{" "}
                      {factMetrics.priceBands.over25k}개로, 극단치를 제외한 중위가(
                      {factMetrics.medianDomPrice.toLocaleString()}원)가 실제 주력 구매 가격대임.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                  <div className="bg-gray-50 p-3 font-extrabold text-gray-800 border-b md:border-b-0 md:border-r border-gray-200">
                    패키지 및 기획세트 구성 전략
                  </div>
                  <div className="p-3 md:col-span-3 text-gray-700 space-y-1">
                    <p className="font-bold text-gray-900">
                      {factMetrics.domSpecialRatio >= 40
                        ? "단품 단독 런칭 지양 → 본품+리필 또는 1+1 더블 기획세트 필수 구성"
                        : "단품 기본형 우선 런칭 후 올영세일 기간 한정 증정 기획 운영"}
                    </p>
                    <p className="text-gray-500">
                      <strong>산출 근거:</strong> 현재 해당 카테고리 국내 상위 30개 중 기획세트 비중이{" "}
                      {factMetrics.domSpecialRatio}%({factMetrics.domSpecialCount}개)로 집계됨. 용량당 가성비를 소구하지 않으면 동일 가격대에서 순위 방어가 어려움.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="bg-gray-50 p-3 font-extrabold text-gray-800 border-b md:border-b-0 md:border-r border-gray-200">
                    초기 런칭 KPI 및 리뷰 확보 목표
                  </div>
                  <div className="p-3 md:col-span-3 text-gray-700 space-y-1">
                    <p className="font-bold text-gray-900">
                      1차 목표: 평점 {factMetrics.avgDomTop10Rating} 이상 유지 및 초기 시딩 리뷰 최소 500건 이상 확보
                    </p>
                    <p className="text-gray-500">
                      <strong>산출 근거:</strong> 현재 TOP 10 진입 상품들의 평균 누적 리뷰 수는{" "}
                      {factMetrics.avgDomTop10Reviews.toLocaleString()}건이며 평균 평점은{" "}
                      {factMetrics.avgDomTop10Rating}점임. 초기 체험단 운영 없이는 자연 유입만으로 상위 랭킹 고착화 진입이 불가함.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* [신규 섹션 4] 올리브영 입점 마진 및 목표 제조원가(COGS) 역산 시뮬레이터 */}
            <section className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 border-l-4 border-[#98B941] pl-2.5">
                  <PackageCheck className="w-4 h-4 text-[#98B941]" />
                  4. 올리브영 입점 마진 구조 및 목표 제조원가(COGS) 역산 시뮬레이션
                </h2>
                <span className="text-[11px] font-semibold text-gray-500 print:hidden">
                  * 수치를 조정하면 품의서 인쇄 시 그대로 반영됩니다.
                </span>
              </div>

              {/* 인터랙티브 파라미터 조절 바 (인쇄 시에는 깔끔한 텍스트 표로 자동 노출) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3.5 print:hidden">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    목표 실판매가 (프로모션 할인가, 원)
                  </label>
                  <input
                    type="number"
                    step={500}
                    value={pnlSim.finalSellingPrice}
                    onChange={(e) => setTargetRetailPrice(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs font-extrabold text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    올리브영 채널 마진율 ({channelMarginRate}%)
                  </label>
                  <input
                    type="range"
                    min={35}
                    max={65}
                    value={channelMarginRate}
                    onChange={(e) => setChannelMarginRate(Number(e.target.value))}
                    className="w-full accent-[#98B941] cursor-pointer mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    공급가 대비 목표 원가율 ({targetCogsRate}%)
                  </label>
                  <input
                    type="range"
                    min={15}
                    max={40}
                    value={targetCogsRate}
                    onChange={(e) => setTargetCogsRate(Number(e.target.value))}
                    className="w-full accent-[#98B941] cursor-pointer mt-1.5"
                  />
                </div>
              </div>

              {/* 역산 결과 요약 테이블 (인쇄 포함) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="border border-gray-200 rounded-lg p-3">
                  <span className="text-gray-500 font-semibold block">
                    ① 목표 실판매가 (VAT 별도)
                  </span>
                  <span className="text-sm font-black text-gray-900 mt-1 block">
                    {pnlSim.finalSellingPrice.toLocaleString()}원{" "}
                    <span className="text-[11px] font-normal text-gray-500">
                      ({pnlSim.vatExcludedPrice.toLocaleString()}원)
                    </span>
                  </span>
                </div>

                <div className="border border-gray-200 rounded-lg p-3">
                  <span className="text-gray-500 font-semibold block">
                    ② 올리브영 납품 공급가 (마진 {channelMarginRate}%)
                  </span>
                  <span className="text-sm font-black text-blue-700 mt-1 block">
                    {pnlSim.supplyPriceToOY.toLocaleString()}원
                  </span>
                </div>

                <div className="border border-[#98B941] bg-[#98B941]/5 rounded-lg p-3">
                  <span className="text-[#657d24] font-extrabold block">
                    ③ OEM 제조원가 상한선 (원가율 {targetCogsRate}%)
                  </span>
                  <span className="text-sm font-black text-gray-900 mt-1 block">
                    {pnlSim.maxAllowedCogs.toLocaleString()}원 이하 권장
                  </span>
                </div>

                <div className="border border-gray-200 rounded-lg p-3">
                  <span className="text-gray-500 font-semibold block">
                    ④ 개당 브랜드 매출총이익 (마케팅 재원)
                  </span>
                  <span className="text-sm font-black text-gray-900 mt-1 block">
                    {pnlSim.brandGrossMargin.toLocaleString()}원 / 개
                  </span>
                </div>
              </div>
            </section>

            {/* 섹션 5: 데이터 한계 명시 (과장 및 거짓 방지 가드레일) */}
            <section className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              <h3 className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                5. 데이터 해석 유의사항 및 실무 추가 검증 항목 (Fact-Check Guardrail)
              </h3>
              <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 leading-relaxed">
                <li>
                  본 기획서의 모든 수치는 <strong>수집 시점의 TOP 30 노출 가격 및 리뷰 데이터</strong>만을 집계한 결과이며, 올리브영 내부의 실제 매출액(GMV)이나 순이익률(Margin)을 임의로 추정하지 않았습니다.
                </li>
                <li>
                  랭킹 순위는 일시적인 프로모션(오늘의 특가, 올영픽) 구좌 노출 여부에 따라 변동될 수 있으므로, 최종 발주 수량 산정 전 최소 7일 이상의 시계열 순위 유지 여부를 교차 확인해야 합니다.
                </li>
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
