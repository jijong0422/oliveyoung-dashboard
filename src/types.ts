/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OliveYoungAttributes {
  isSpecial: boolean;   // 기획 여부
  isSingle: boolean;    // 단품 여부
  isDouble: boolean;    // 1+1, 더블 여부
  isGift: boolean;      // 사은품/증정 여부
  packageType: string;  // "기획세트", "Special Set", etc.
  quantity: string;     // 수량 (e.g. "12개입", "12 Sheets")
  specText: string;     // 규격/용량 (e.g. "50ml", "80매입")
  volume?: string;      // extracted volume/weight (e.g., "50ml", "50ml+50ml")
  count?: number;       // total item count (e.g., 1, 2, 10, 80)
}

export interface Product {
  rank: number;
  id: string;
  name: string;
  brand: string;
  price: number; // in KRW for domestic, USD formatted to KRW equivalent or just a numeric price
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  link: string;
  change: number | "NEW"; // rank change (e.g., +2, -1, 0, "NEW")
  category: string; // category ID
  mallType: "domestic" | "global";
  timestamp: string; // ISO date string when scraped
  attributes?: OliveYoungAttributes;
  ingredients?: string; // 전성분표
  salesVolume3h?: number; // 최근 3시간 주문 수량
  salesRevenue3h?: number; // 최근 3시간 주문 금액
  promoFlags?: string[]; // [추가] 실제 올리브영 프로모션 배지 ("세일", "쿠폰", "증정", "오늘드림")
  isRealData?: boolean;  // [추가] ZenRows 실제 수집 데이터 여부 (true: 실데이터, false: 시뮬레이션)
}

export interface Category {
  id: string;
  name: string;
}

export interface ScrapeRun {
  id: string;
  timestamp: string;
  status: "success" | "failed";
  productsCount: number;
  durationMs: number;
  isSimulated: boolean;
}

export interface MDInsight {
  id: string;
  timestamp: string;
  title: string;
  summary: string;
  content: string; // Markdown formatted
  category: string;
}

export interface CustomAlert {
  id: string;
  name: string;
  categoryId: string;
  conditionType: "rank_entry" | "brand_mention" | "rank_gap" | "first_place_change";
  brandName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface TriggeredAlert {
  id: string;
  alertId: string;
  alertName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface MonitoringLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  category: string;
  mallType: "domestic" | "global";
  message: string;
  details?: string;
  productId?: string;
  errorType: "missing_data" | "format_mismatch" | "invalid_value" | "pipeline_fault";
  status?: "pending" | "resolved";
}

export interface SavedReport {
  id: string;
  title: string;
  subtitle: string;
  authorName: string;
  departmentName: string;
  reportDate: string;
  confidentialGrade: string;
  categoryName: string;
  categoryId: string;
  sourceType: "scraped_data" | "ai_advisor";
  sourceRunId?: string; // timestamp or id of reference run
  executiveSummary: string;
  strategicStrategy: string;
  recommendations: string[];
  metrics: {
    avgDomPrice: number;
    avgGlobPrice: number;
    minDom: number;
    maxDom: number;
    minGlob: number;
    maxGlob: number;
    premiumPercent: number;
    topDomBrand: string;
    topGlobBrand: string;
    totalProductsCount: number;
  };
  chartBrandData: Array<{ name: string; 국내몰점유: number; 글로벌몰점유: number; total: number }>;
  chartPriceData: Array<{ name: string; 국내몰: number; 글로벌몰: number }>;
  createdAt: string; // ISO String
  userId: string;
}

