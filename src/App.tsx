/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Sparkles,
  Bell,
  Play,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Flame,
  FileText,
  X
} from "lucide-react";
import { Category, Product, ScrapeRun, CustomAlert, TriggeredAlert, MDInsight } from "./types";
import { baselineProducts } from "./baselineProducts";
import RankingBoard from "./components/RankingBoard";
import ChartsBoard from "./components/ChartsBoard";
import AIAdvisor from "./components/AIAdvisor";
import AlertTracker from "./components/AlertTracker";
import ReportBuilder from "./components/ReportBuilder";

interface ToastMessage {
  id: number;
  type: "success" | "error";
  title: string;
  description: string;
}

export default function App() {
  // 핵심 4대 탭으로 경량화 (불필요한 sheets, monitoring 탭 제거)
  const [activeTab, setActiveTab] = useState<"rankings" | "charts" | "ai" | "reports">("rankings");
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Core Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [historyRuns, setHistoryRuns] = useState<ScrapeRun[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimestamp, setSelectedTimestamp] = useState("");

  // Loaded rankings
  const [domesticProducts, setDomesticProducts] = useState<Product[]>([]);
  const [globalProducts, setGlobalProducts] = useState<Product[]>([]);
  const [historicalData, setHistoricalData] = useState<{ timestamp: string; products: Product[] }[]>([]);

  // Alerts
  const [alerts, setAlerts] = useState<CustomAlert[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);

  // Loaders
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeScope, setScrapeScope] = useState<"current" | "all">("current");
  const [isDataLoading, setIsDataLoading] = useState(false);

  const showToast = useCallback((type: "success" | "error", title: string, description: string) => {
    const id = Date.now();
    setToast({ id, type, title, description });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  const fetchMetadata = async () => {
    try {
      const [catRes, runRes] = await Promise.all([
        fetch("/api/categories").catch(() => null),
        fetch("/api/scrape-history").catch(() => null)
      ]);

      if (!catRes || !catRes.ok) throw new Error("API Offline");

      const catData = await catRes.json();
      setCategories(Array.isArray(catData) ? catData : []);

      const runData = runRes && runRes.ok ? await runRes.json() : [];
      if (Array.isArray(runData)) {
        setHistoryRuns(runData);
        if (runData.length > 0 && !selectedTimestamp) setSelectedTimestamp(runData[0].timestamp);
      }
    } catch (err) {
      console.warn("백엔드 API 연결 안됨. 로컬 더미 카테고리를 로드합니다.");
      // Fallback: 백엔드가 없을 때 띄워줄 기본 카테고리
      setCategories([
        { id: "all", name: "전체" },
        { id: "skincare", name: "스킨케어" },
        { id: "makeup", name: "메이크업" }
      ]);
      const fallbackTime = new Date().toISOString();
      setHistoryRuns([{ id: "local_run", timestamp: fallbackTime, isSimulated: true, categoriesScraped: 3 }]);
      if (!selectedTimestamp) setSelectedTimestamp(fallbackTime);
    }
  };

  const fetchAlerts = async () => {
    try {
      const [alertRes, trigRes] = await Promise.all([
        fetch("/api/alerts").catch(() => null),
        fetch("/api/triggered-alerts").catch(() => null)
      ]);
      if (!alertRes || !alertRes.ok) throw new Error("API Offline");

      const alertData = await alertRes.json();
      setAlerts(Array.isArray(alertData) ? alertData : []);

      const trigData = trigRes && trigRes.ok ? await trigRes.json() : [];
      setTriggeredAlerts(Array.isArray(trigData) ? trigData : []);
    } catch (err) {
      setAlerts([]);
      setTriggeredAlerts([]);
    }
  };

  useEffect(() => {
    fetchMetadata();
    fetchAlerts();
  }, []);

  const loadRankings = useCallback(async () => {
    if (!selectedCategory || !selectedTimestamp) return;
    setIsDataLoading(true);
    try {
      const [domRes, globRes, histRes] = await Promise.all([
        fetch(`/api/rankings?category=${selectedCategory}&mallType=domestic&timestamp=${selectedTimestamp}`).catch(() => null),
        fetch(`/api/rankings?category=${selectedCategory}&mallType=global&timestamp=${selectedTimestamp}`).catch(() => null),
        fetch(`/api/rankings/history?category=${selectedCategory}&mallType=domestic&limitCount=6`).catch(() => null)
      ]);

      if (!domRes || !domRes.ok || !globRes || !globRes.ok || !histRes || !histRes.ok) {
        throw new Error("API Offline");
      }

      const [domData, globData, histData] = await Promise.all([
        domRes.json(), globRes.json(), histRes.json()
      ]);

      setDomesticProducts(domData.products || []);
      setGlobalProducts(globData.products || []);
      setHistoricalData(Array.isArray(histData) ? histData : []);
    } catch (err) {
      console.warn("백엔드 API 연결 안됨. baselineProducts 데이터를 화면에 표시합니다.");
      // Fallback: API 호출 실패 시 로컬 샘플 데이터 띄우기
      setDomesticProducts(baselineProducts || []);
      // 글로벌 쪽은 시각적 구분을 위해 순서를 뒤집어서 보여줌
      setGlobalProducts(baselineProducts ? [...baselineProducts].reverse() : []);
      setHistoricalData([]);
    } finally {
      setIsDataLoading(false);
    }
  }, [selectedCategory, selectedTimestamp]);

  useEffect(() => {
    loadRankings();
  }, [selectedCategory, selectedTimestamp, loadRankings]);

  const handleScrapeTrigger = async () => {
    setIsScraping(true);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          scrapeAll: scrapeScope === "all"
        })
      });
      const data = await response.json();
      if (data.success) {
        const currentCatName =
          categories.find((c) => c.id === selectedCategory)?.name || "선택 카테고리";
        showToast(
          "success",
          data.run?.isSimulated
            ? "시뮬레이션 폴백 업데이트 완료"
            : `올리브영 실데이터 수집 완료 (${data.realScrapedCategoriesCount}개 부문)`,
          scrapeScope === "all"
            ? `전체 10개 카테고리 수집 완료 · 신규 알림 ${data.newTriggeredAlertsCount}건`
            : `[${currentCatName}] 최신 랭킹 반영 완료 · 신규 알림 ${data.newTriggeredAlertsCount}건`
        );
        await Promise.all([fetchMetadata(), fetchAlerts()]);
        setSelectedTimestamp(data.run.timestamp);
      } else {
        showToast("error", "수집 실패", data.error || "스크래핑 중 오류가 발생했습니다.");
      }
    } catch (err: any) {
      showToast("error", "네트워크 오류", err.message);
    } finally {
      setIsScraping(false);
    }
  };

  const handleAddAlert = async (alertObj: Omit<CustomAlert, "id" | "createdAt">) => {
    const newAlert: CustomAlert = {
      ...alertObj,
      id: `alert_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAlert)
    });
    if (res.ok) {
      fetchAlerts();
      showToast("success", "알림 규칙 등록 완료", `'${alertObj.name}' 조건이 추가되었습니다.`);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    const res = await fetch("/api/alerts/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (res.ok) fetchAlerts();
  };

  const handleMarkAsRead = async (id: string) => {
    const res = await fetch("/api/triggered-alerts/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (res.ok) fetchAlerts();
  };

  const handleClearTriggered = async () => {
    const res = await fetch("/api/triggered-alerts/clear", { method: "POST" });
    if (res.ok) fetchAlerts();
  };

  const handleGenerateInsight = async (
    categoryId: string,
    targetCondition?: string
  ): Promise<MDInsight> => {
    const res = await fetch("/api/insights/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, targetCondition })
    });
    const data = await res.json();
    if (data.success) return data.insight;
    throw new Error(data.error || "Gemini 분석 생성에 실패했습니다.");
  };

  const latestRun = historyRuns[0];
  const totalProductsCount = domesticProducts.length + globalProducts.length;
  const unreadAlertsCount = triggeredAlerts.filter((a) => !a.isRead).length;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1A1C1E] font-sans antialiased pb-16" id="applet-dashboard">
      {/* 토스트 알림 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 right-4 z-[60] max-w-sm w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-start gap-3"
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#98B941] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{toast.title}</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{toast.description}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. 상단 네비게이션 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#98B941] flex items-center justify-center text-white shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                  올리브영 MD 트렌드 워크스페이스
                </h1>
                <span className="text-xs bg-[#98B941]/15 text-[#7a9630] font-bold px-2 py-0.5 rounded-md border border-[#98B941]/30 hidden sm:inline-block">
                  v2.0 SLIM
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">국내·글로벌 TOP 30 벤치마킹 및 실측 기반 상품기획 시스템</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAlertDrawerOpen(true)}
              className="relative bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors cursor-pointer"
              title="맞춤 알림 센터"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* 수집 범위 선택 토글 (ZenRows 크레딧 절약용) */}
            <select
              value={scrapeScope}
              onChange={(e) => setScrapeScope(e.target.value as "current" | "all")}
              disabled={isScraping}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2 px-2.5 rounded-lg border border-gray-200 focus:outline-none cursor-pointer"
              title="ZenRows 수집 범위 선택"
            >
              <option value="current">현재 카테고리만 수집 (빠름·절약)</option>
              <option value="all">전체 10개 카테고리 수집</option>
            </select>

            <button
              onClick={handleScrapeTrigger}
              disabled={isScraping}
              className="bg-[#98B941] hover:bg-[#85a337] active:scale-95 transition-all text-white text-xs font-bold py-2 px-3.5 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 disabled:bg-gray-300"
            >
              <Play className={`w-3.5 h-3.5 ${isScraping ? "animate-spin" : ""}`} />
              <span>{isScraping ? "수집 중..." : "지금 랭킹 수집"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. 메인 스테이지 */}
      <main className="max-w-7xl mx-auto px-4 mt-5 space-y-5">
        {/* 상단 핵심 요약 카드 4개 */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#98B941]/10 flex items-center justify-center text-[#98B941]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">핵심 MD 카테고리</span>
              <span className="text-base font-extrabold text-gray-900">{categories.length}개 부문</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#98B941]/10 flex items-center justify-center text-[#98B941]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">현재 조회 상품</span>
              {isDataLoading ? (
                <div className="h-5 w-16 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <span className="text-base font-extrabold text-gray-900">{totalProductsCount}개 SKU</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-gray-500 block">최근 스냅샷</span>
              <span className="text-sm font-extrabold text-gray-900 truncate block">
                {latestRun
                  ? new Date(latestRun.timestamp).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
                  : "이력 없음"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAlertDrawerOpen(true)}
            className="rounded-xl border border-gray-200 bg-white hover:border-gray-300 p-4 shadow-xs flex items-center gap-3 cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-[#98B941]/10 text-[#98B941] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">순위 변동 알림</span>
              <span className="text-base font-extrabold text-gray-900">미확인 {unreadAlertsCount}건</span>
            </div>
          </button>
        </section>

        {/* 3. 4대 핵심 기능 탭 바 */}
        <section className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex flex-wrap items-center gap-1 bg-gray-200/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("rankings")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "rankings" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              실시간 랭킹 보드
            </button>
            <button
              onClick={() => setActiveTab("charts")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "charts" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              트렌드 교차 차트
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "ai" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#98B941]" />
              AI MD 어드바이저
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "reports" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText className="w-4 h-4 text-[#98B941]" />
              실무 상품기획서 (PRD)
            </button>
          </div>
        </section>

        {/* 4. 탭 콘텐츠 */}
        <section className="min-h-[480px]">
          <AnimatePresence mode="wait">
            {activeTab === "rankings" && (
              <motion.div key="rankings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <RankingBoard
                  categories={categories}
                  historyRuns={historyRuns}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedTimestamp={selectedTimestamp}
                  setSelectedTimestamp={setSelectedTimestamp}
                  domesticProducts={domesticProducts}
                  globalProducts={globalProducts}
                  isLoading={isDataLoading}
                />
              </motion.div>
            )}

            {activeTab === "charts" && (
              <motion.div key="charts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <ChartsBoard
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  domesticProducts={domesticProducts}
                  globalProducts={globalProducts}
                  historicalData={historicalData}
                />
              </motion.div>
            )}

            {activeTab === "ai" && (
              <motion.div key="ai" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <AIAdvisor categories={categories} onGenerateInsight={handleGenerateInsight} />
              </motion.div>
            )}

            {activeTab === "reports" && (
              <motion.div key="reports" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <ReportBuilder
                  categories={categories}
                  domesticProducts={domesticProducts}
                  globalProducts={globalProducts}
                  historyRuns={historyRuns}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedTimestamp={selectedTimestamp}
                  setSelectedTimestamp={setSelectedTimestamp}
                  isDataLoading={isDataLoading}
                  user={null}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* 우측 알림 드로어 */}
      <AnimatePresence>
        {isAlertDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAlertDrawerOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#F8FAFC] z-50 shadow-2xl border-l border-gray-200 flex flex-col"
            >
              <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#98B941]" />
                  <h2 className="text-base font-extrabold text-gray-900">맞춤 트렌드 알림 센터</h2>
                </div>
                <button
                  onClick={() => setIsAlertDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <AlertTracker
                  mode="alerts-only"
                  categories={categories}
                  alerts={alerts}
                  triggeredAlerts={triggeredAlerts}
                  onAddAlert={handleAddAlert}
                  onDeleteAlert={handleDeleteAlert}
                  onMarkAsRead={handleMarkAsRead}
                  onClearTriggered={handleClearTriggered}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto px-4 mt-12 py-6 border-t border-gray-200 text-center text-xs text-gray-500 font-medium">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#98B941]" />
          올리브영 글로벌·국내 랭킹 데이터 기반 MD 기획 워크스페이스
        </p>
      </footer>
    </div>
  );
}
