/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, BookOpen, Clock, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import { Category, MDInsight } from "../types";

interface AIAdvisorProps {
  categories: Category[];
  onGenerateInsight: (categoryId: string, targetCondition?: string) => Promise<MDInsight>;
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  // **굵은 텍스트** 패턴을 안전하게 파싱
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-extrabold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function AIAdvisor({ categories, onGenerateInsight }: AIAdvisorProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [targetCondition, setTargetCondition] = useState("");
  const [insight, setInsight] = useState<MDInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState("");

  const steps = [
    "올리브영 실시간 수집 데이터베이스 로드 중...",
    "국내몰 및 글로벌몰 TOP 10 교차 대조 분석 중...",
    "Gemini 3.5 모델 기반 상품 기획 및 가상 신상품 콘셉트 수립 중...",
    "국가별 타겟팅 프로모션 마케팅 기획안 수석 MD 보고서 완성 중..."
  ];

  // Load existing insight for category on mount/change
  useEffect(() => {
    fetchLatestInsight();
  }, [selectedCategory]);

  const fetchLatestInsight = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/insights?category=${selectedCategory}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setInsight(data[0]); // newest first
        } else {
          setInsight(null);
        }
      }
    } catch (err) {
      console.error("Error fetching insights:", err);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setInsight(null);
    
    // Cycle through steps for high-fidelity interactive loader
    let stepIdx = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      if (stepIdx < steps.length - 1) {
        stepIdx++;
        setLoadingStep(steps[stepIdx]);
      }
    }, 1800);

    try {
      const generated = await onGenerateInsight(selectedCategory, targetCondition.trim());
      setInsight(generated);
    } catch (err: any) {
      setError(err.message || "보고서 생성에 실패했습니다. API 키 구성을 확인하세요.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4" id="ai-advisor-container">
      {/* Introduction Card */}
      <div className="bg-[#1A1C1E] text-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" id="ai-intro-banner">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-[#98B941]/20 text-[#98B941] text-[10px] px-2 py-0.5 rounded font-extrabold flex items-center gap-1 border border-[#98B941]/30 tracking-wider">
              <Sparkles className="w-3 h-3 animate-pulse" />
              AI MD INTELLIGENCE REPORT
            </span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">Gemini 기반 카테고리 상품기획 및 글로벌 공략 보고서</h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            올리브영 국내몰과 글로벌몰 TOP 30 실시간 랭킹의 가격 분포, 제품 성향, 브랜드 파워, 리뷰 수치 데이터를 교차 연산하여 소비자 선호도 장벽을 파괴하고, 정교한 신규 상품 기획안 및 글로벌 마케팅 공략 보고서를 즉각 산출합니다.
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
            <span className="text-[10px] text-[#98B941] font-bold uppercase tracking-wider whitespace-nowrap px-1">분석 카테고리:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-4"
              disabled={isLoading}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id} className="text-slate-900 bg-white">{c.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-[#98B941] hover:bg-[#85a337] active:scale-[0.98] transition-all text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:bg-slate-700 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isLoading ? "AI 컨설팅 생성 중..." : "AI MD 심층 보고서 생성"}
          </button>
        </div>
      </div>

      {/* [신규] MD 기획 타겟 조건부 프롬프트 옵션 바 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
            🎯 MD 기획 타겟 조건 지정 (선택 사항 — 입력 시 상위 30위와 정면 비교 시뮬레이션)
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              "패드 제형 · 2만원 이하 · 모공/진정",
              "1+1 더블기획 · 저분자 히알루론산 · 속건조",
              "글로벌 역직구 타겟 · 저자극 비건 선세럼"
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTargetCondition(preset)}
                className="text-[11px] font-bold bg-gray-100 hover:bg-[#98B941]/15 hover:text-[#657d24] text-gray-600 px-2 py-1 rounded-md transition-colors cursor-pointer"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={targetCondition}
            onChange={(e) => setTargetCondition(e.target.value)}
            placeholder="예: 패드 제형, 프로모션가 18,900원, PDRN+시카 성분 배합, 본품+리필 기획세트..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#98B941]"
          />
          {targetCondition && (
            <button
              type="button"
              onClick={() => setTargetCondition("")}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 px-2 py-1 cursor-pointer"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm space-y-4 animate-pulse" id="ai-loading-card">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#98B941]/20 animate-ping" />
            <div className="w-12 h-12 rounded-full border-4 border-[#98B941] border-t-transparent animate-spin flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-[#98B941]" />
            </div>
          </div>
          <div className="space-y-1 max-w-lg mx-auto">
            <p className="text-xs font-bold text-gray-800">국내외 실시간 데이터 심층 교차분석 중</p>
            <p className="text-[11px] text-[#98B941] font-extrabold bg-[#98B941]/10 px-3 py-1 rounded-full inline-block animate-bounce">
              {loadingStep}
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center space-y-4" id="ai-error-card">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-800">분석 데이터를 생성할 수 없습니다</h4>
            <p className="text-xs text-amber-700 max-w-md mx-auto">{error}</p>
          </div>
          <p className="text-[10px] text-amber-600 leading-relaxed">
            API 키가 올바르게 주입되어 있지 않거나, 데이터 로드 실패일 수 있습니다. <br />
            AI Studio Secrets 패널에서 <strong>GEMINI_API_KEY</strong>가 바르게 등록되었는지 검수해 주세요.
          </p>
        </div>
      ) : insight ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" id="ai-report-card">
          {/* Report Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#98B941] bg-[#98B941]/10 px-2 py-0.5 rounded font-mono tracking-wider">
                CONFIDENTIAL REPORT
              </span>
              <h3 className="text-sm font-bold text-gray-800">{insight.title}</h3>
              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                생성일시: {new Date(insight.timestamp).toLocaleString("ko-KR")}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#98B941] bg-[#98B941]/10 px-2.5 py-1 rounded border border-[#98B941]/20">
              <CheckCircle className="w-3.5 h-3.5 text-[#98B941]" />
              MD 실시간 분석 검수 완료
            </div>
          </div>

          {/* Report Body */}
          <div className="p-4 md:p-6 space-y-4">
            <div className="bg-gray-50 border-l-4 border-[#98B941] p-3.5 rounded-r-lg">
              <h4 className="text-xs font-bold text-[#98B941] mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                핵심 요약 (Executive Summary)
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                {insight.summary}
              </p>
            </div>

            {/* Simulated Clean Markdown rendering via tailored components */}
            <div className="prose max-w-none text-gray-800 space-y-2.5 text-sm leading-relaxed" id="ai-markdown-content">
              {insight.content.split("\n").map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={idx} className="h-1" />;

                if (trimmed.startsWith("#### ")) {
                  return (
                    <h5 key={idx} className="text-sm font-bold text-gray-800 mt-4 mb-1">
                      {renderInlineMarkdown(trimmed.slice(5))}
                    </h5>
                  );
                }
                if (trimmed.startsWith("### ")) {
                  return (
                    <h4 key={idx} className="text-sm font-bold text-gray-900 mt-5 mb-2 border-b border-gray-200 pb-1.5 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#98B941]" />
                      {renderInlineMarkdown(trimmed.slice(4))}
                    </h4>
                  );
                }
                if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
                  const cleanHeading = trimmed.replace(/^#+\s+/, "");
                  return (
                    <h3 key={idx} className="text-base font-extrabold text-gray-900 mt-6 mb-2 border-l-4 border-[#98B941] pl-2.5">
                      {renderInlineMarkdown(cleanHeading)}
                    </h3>
                  );
                }
                if (/^[-*]\s+/.test(trimmed)) {
                  return (
                    <div key={idx} className="flex items-start gap-2 pl-2">
                      <span className="text-[#98B941] font-bold mt-0.5">•</span>
                      <p className="flex-1 text-gray-700">{renderInlineMarkdown(trimmed.replace(/^[-*]\s+/, ""))}</p>
                    </div>
                  );
                }
                if (/^\d+\.\s+/.test(trimmed)) {
                  const match = trimmed.match(/^(\d+\.)\s+(.*)$/);
                  return (
                    <div key={idx} className="flex items-start gap-2 pl-1 font-medium">
                      <span className="text-[#98B941] font-extrabold">{match?.[1]}</span>
                      <p className="flex-1 text-gray-800">{renderInlineMarkdown(match?.[2] || trimmed)}</p>
                    </div>
                  );
                }

                return (
                  <p key={idx} className="text-gray-700">
                    {renderInlineMarkdown(trimmed)}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm space-y-3" id="ai-empty-card">
          <Sparkles className="w-10 h-10 text-gray-300 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-700">이 카테고리에 대한 생성된 보고서가 없습니다</h3>
            <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
              위의 우측 <strong>'AI MD 심층 보고서 생성'</strong> 버튼을 클릭하여 실시간 순위 대조 및 신규 상품 콘셉트를 설계하세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
