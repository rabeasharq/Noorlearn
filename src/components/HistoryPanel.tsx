/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { Search, Trash2, BookOpen, Calendar, GraduationCap, ChevronLeft } from "lucide-react";
import { PlanForm, SUBJECTS, GRADES } from "../types";
import { fmtDate } from "../utils/planEngine";

interface HistoryPanelProps {
  plans: PlanForm[];
  loading: boolean;
  onLoad: (p: PlanForm) => void;
  onDelete: (id: number) => void;
}

export default function HistoryPanel({ plans, loading, onLoad, onDelete }: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Memoize search and filter logic to maximize execution performance
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const title = (plan.lessonTitle || "").toLowerCase();
      const unit = (plan.bookUnit || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        !searchQuery ||
        title.includes(query) ||
        unit.includes(query) ||
        (SUBJECTS[plan.subject]?.label || "").toLowerCase().includes(query) ||
        (GRADES[plan.grade]?.label || "").toLowerCase().includes(query);

      const matchesFilter =
        selectedFilter === "all" ||
        plan.subject === selectedFilter ||
        plan.grade === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [plans, searchQuery, selectedFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="w-12 h-12 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin mb-4" />
        <p className="text-sm">جاري تحميل المعطيات والخطط المحفوظة...</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-5 max-w-5xl mx-auto font-sans">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/30 p-4 border border-slate-800/80 rounded-2xl">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث بالعنوان، المادة أو الصف الدراسي..."
            className="w-full pl-4 pr-11 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedFilter}
            onChange={e => setSelectedFilter(e.target.value)}
            className="w-full sm:w-48 px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl text-slate-200 text-sm outline-none"
          >
            <option value="all">جميع الخطط الدراسية</option>
            <optgroup label="تقسيم حسب الصف">
              {Object.entries(GRADES).map(([k, g]) => (
                <option key={k} value={k}>
                  {g.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="تقسيم حسب القسم">
              {Object.entries(SUBJECTS).map(([k, s]) => (
                <option key={k} value={k}>
                  {s.icon} {s.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Plans List */}
      {filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-850 rounded-2xl bg-slate-900/10">
          <span className="text-4xl mb-4">📂</span>
          <h3 className="text-base font-bold text-slate-300">لم يتم العثور على خطط دراسية</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {searchQuery || selectedFilter !== "all"
              ? "جرّب تعديل كلمات البحث أو الخيارات لإيجاد تحضيرك."
              : "ابدأ صياغة خطتك الإبداعية الأولى لحفظها هنا والوصول إليها لاحقاً."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPlans.map(plan => {
            const gradeInfo = GRADES[plan.grade];
            const subjectInfo = SUBJECTS[plan.subject];
            const dateStr = plan.date ? fmtDate(plan.date) : "—";

            return (
              <div
                key={plan.id}
                className="group relative bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/60 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200 hover:bg-slate-900/60"
              >
                {/* Plan Metadata Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {gradeInfo?.label || plan.grade}
                    </span>
                    <span
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
                      style={{
                        backgroundColor: `${subjectInfo?.color || "#1e293b"}15`,
                        color: subjectInfo?.color || "#e2e8f0",
                        border: `1px solid ${subjectInfo?.color || "#334155"}30`
                      }}
                    >
                      <span>{subjectInfo?.icon}</span>
                      {subjectInfo?.label || plan.subject}
                    </span>
                    {plan.week && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        الأسبوع {plan.week}
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors font-display">
                    {plan.lessonTitle || "بدون عنوان"}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{plan.day}، {dateStr}</span>
                    </div>
                    {plan.bookUnit && (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-bold">الوحدة:</span>
                        <span>{plan.bookUnit}</span>
                      </div>
                    )}
                    {plan.period && (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-bold">الحصة:</span>
                        <span>{plan.period}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions group */}
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t border-slate-800/40 pt-3 md:pt-0 md:border-0">
                  <button
                    onClick={() => onLoad(plan)}
                    className="flex-1 md:flex-initial py-2 px-4 rounded-xl text-center bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-700/50 hover:border-slate-600/60 cursor-pointer transition-colors"
                  >
                    عرض الخطة
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("هل أنت متأكد من حذف هذه الخطة من الأرشيف تماماً؟")) {
                        onDelete(plan.id!);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors cursor-pointer"
                    title="حذف الخطة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
