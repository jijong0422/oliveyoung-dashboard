/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import {
  Bell,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldAlert
} from "lucide-react";
import { CustomAlert, TriggeredAlert, Category } from "../types";

interface AlertTrackerProps {
  mode?: "alerts-only" | "both";
  categories: Category[];
  alerts: CustomAlert[];
  triggeredAlerts: TriggeredAlert[];
  onAddAlert: (alert: Omit<CustomAlert, "id" | "createdAt">) => Promise<void>;
  onDeleteAlert: (id: string) => Promise<void>;
  onMarkAsRead: (id: string) => Promise<void>;
  onClearTriggered: () => Promise<void>;
}

export default function AlertTracker({
  mode = "alerts-only",
  categories,
  alerts,
  triggeredAlerts,
  onAddAlert,
  onDeleteAlert,
  onMarkAsRead,
  onClearTriggered
}: AlertTrackerProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [conditionType, setConditionType] = useState<"first_place_change" | "brand_mention" | "rank_entry">("first_place_change");
  const [brandName, setBrandName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const safeTriggeredAlerts = Array.isArray(triggeredAlerts) ? triggeredAlerts : [];
  const unreadCount = safeTriggeredAlerts.filter((a) => !a.isRead).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddAlert({
        name,
        categoryId,
        conditionType,
        brandName: conditionType === "brand_mention" ? brandName : undefined,
        isActive: true
      });
      setName("");
      setBrandName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5" id="alert-tracker-container">
      <div className={mode === "alerts-only" ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-3 gap-4"}>
        {/* 1. 발생 알림 내역 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              실시간 감지 알림
              {unreadCount > 0 && (
                <span className="bg-[#98B941] text-white text-xs px-2 py-0.5 rounded-full font-extrabold">
                  {unreadCount}
                </span>
              )}
            </h3>
            {safeTriggeredAlerts.length > 0 && (
              <button
                onClick={onClearTriggered}
                className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer font-semibold"
              >
                전체 비우기
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 mt-2">
            {safeTriggeredAlerts.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400 font-medium">
                아직 발생한 트렌드 변동 알림이 없습니다.
              </div>
            ) : (
              safeTriggeredAlerts.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border transition-all ${
                    log.isRead ? "bg-gray-50 border-gray-200 opacity-70" : "bg-[#98B941]/10 border-[#98B941]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className={`text-xs leading-relaxed ${log.isRead ? "text-gray-600" : "text-gray-900 font-bold"}`}>
                        {log.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <span>{log.alertName}</span>
                        <span>·</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString("ko-KR")}</span>
                      </div>
                    </div>
                    {!log.isRead && (
                      <button
                        onClick={() => onMarkAsRead(log.id)}
                        className="text-[#7a9630] hover:text-[#607824] text-xs font-bold whitespace-nowrap cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        읽음
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. 새 알림 규칙 추가 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-[#98B941]" />
            맞춤 알림 규칙 추가
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">규칙 이름</label>
              <input
                type="text"
                required
                placeholder="예: 선케어 자사 브랜드 TOP 5 진입"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#98B941]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">감시 카테고리</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#98B941]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">감지 조건</label>
                <select
                  value={conditionType}
                  onChange={(e) => setConditionType(e.target.value as any)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#98B941]"
                >
                  <option value="first_place_change">1위 상품 변동</option>
                  <option value="brand_mention">특정 브랜드 진입</option>
                  <option value="rank_entry">신규(NEW) 차트 진입</option>
                </select>
              </div>
            </div>

            {conditionType === "brand_mention" && (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">추적할 브랜드명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 토리든, 아누아"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#98B941]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#98B941] hover:bg-[#85a337] text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-gray-300"
            >
              <Plus className="w-4 h-4" />
              {isSubmitting ? "등록 중..." : "알림 규칙 저장"}
            </button>
          </form>
        </div>

        {/* 3. 활성 규칙 목록 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#98B941]" />
            활성 알림 규칙 ({safeAlerts.length})
          </h3>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {safeAlerts.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">등록된 알림 규칙이 없습니다.</div>
            ) : (
              safeAlerts.map((rule) => {
                const catName = categories.find((c) => c.id === rule.categoryId)?.name || rule.categoryId;
                return (
                  <div
                    key={rule.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-800">{rule.name}</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-semibold">
                          {catName}
                        </span>
                        <span className="text-xs bg-[#98B941]/15 text-[#7a9630] px-2 py-0.5 rounded font-bold">
                          {rule.conditionType === "first_place_change"
                            ? "1위 변동"
                            : rule.conditionType === "brand_mention"
                            ? `브랜드 진입 (${rule.brandName})`
                            : "신규 진입"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteAlert(rule.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                      title="규칙 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
