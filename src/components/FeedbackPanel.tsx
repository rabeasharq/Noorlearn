/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";
import { Award, CheckCircle2, AlertCircle, BarChart2 } from "lucide-react";
import { SUBJECTS, PlanForm, REVIEW_WEEKS } from "../types";

interface FeedbackPanelProps {
  plans: PlanForm[];
}

export default function FeedbackPanel({ plans }: FeedbackPanelProps) {
  // Memoize all stat calculations to maximize rendering performance
  const stats = useMemo(() => {
    if (!plans || plans.length < 3) {
      return null;
    }

    const bySubj: Record<string, number> = {};
    plans.forEach(p => {
      const s = p.subject;
      if (s) {
        bySubj[s] = (bySubj[s] || 0) + 1;
      }
    });

    const entries = Object.entries(bySubj);
    const most = entries.length > 0 ? entries.sort((a, b) => b[1] - a[1])[0] : null;
    const least = entries.length > 0 ? entries.sort((a, b) => a[1] - b[1])[0] : null;
    const diversityCount = entries.length;

    const mostLabel = most ? (SUBJECTS[most[0]]?.label || most[0]) : "—";
    const leastLabel = least ? (SUBJECTS[least[0]]?.label || least[0]) : "—";

    let milestone: string | null = null;
    if (plans.length >= 20) {
      milestone = "🏆 معلم متميز — أكملت 20 خطة بنجاح!";
    } else if (plans.length >= 10) {
      milestone = "⭐ معلم مبادر — أكملت 10 خطط دراسية!";
    } else if (plans.length >= 5) {
      milestone = "🌱 بداية موفقة — أكملت 5 خطط بنجاح!";
    }

    const positives: string[] = [
      plans.length >= 10 ? "✅ التزام رائع ومستدام — أكثر من 10 خطط جاهزة وملتزمة!" : `✅ أنجزت ${plans.length} خطط دراسية متميزة — استمر بنشاطك!`,
      diversityCount >= 4 ? "✅ تنوع رائع بين أقسام اللغة العربية الستة لشمول التعليم" : "⚠️ ركّز أكثر على تفعيل أسلوب التنويع لتشمل كافة فروع اللغة العربية",
    ];
    if (most) {
      positives.push(`✅ مهارة بارزة في تهيئة مادة: ${SUBJECTS[most[0]]?.label || most[0]}`);
    }

    const improvements: string[] = [];
    if (diversityCount < 5) {
      improvements.push(`💡 غطّيت فقط ${diversityCount}/6 فروع — ينصح بتحضير موضوعات في الفروع المتبقية لتحقيق التوازن.`);
    }
    if (plans.length < 10) {
      improvements.push("💡 نسعى لمشاركتك الفذة باستهداف 10 خطط هذا الشهر لاستكمال متطلبات الرقابة التربوية.");
    }
    if (least && least[0] !== most?.[0]) {
      improvements.push(`💡 الفرع الأقل كتابة وتحضيراً: ${SUBJECTS[least[0]]?.label || least[0]} — ركّز عليه في خطتك القادمة.`);
    }

    return {
      total: plans.length,
      diversity: diversityCount,
      mostLabel,
      leastLabel,
      bySubj,
      milestone,
      positives,
      improvements
    };
  }, [plans]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mb-6 shadow-xl shadow-amber-500/5">
          📊
        </div>
        <h3 className="text-xl font-bold font-display text-slate-100">تحليل الأداء والتغذية الراجعة</h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          يتم تفعيل التقييم التلقائي للأعوام والمناهج فور كتابة <strong>3 خطط دراسية</strong> أو أكثر لتتبع معدلات التوزيع والتنوع الصفي.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-900/40 border border-slate-800/80 rounded-full text-xs text-amber-400">
          <span>عدد خططك الحالية:</span>
          <span className="font-bold font-mono text-sm">{plans.length}</span>
          <span>من اصل</span>
          <span className="font-bold">3</span>
        </div>
      </div>
    );
  }

  const barColors: Record<string, string> = {
    grammar: "bg-sky-500",
    texts: "bg-amber-600",
    reading: "bg-emerald-500",
    dictation: "bg-rose-500",
    calligraphy: "bg-amber-400",
    expression: "bg-purple-500"
  };

  return (
    <div className="py-6 space-y-6 max-w-4xl mx-auto">
      {stats.milestone && (
        <div className="bg-gradient-to-r from-amber-500/15 to-yellow-500/5 border border-amber-500/30 p-5 rounded-2xl flex items-center gap-4 animate-pulse">
          <Award className="w-10 h-10 text-amber-400 shrink-0" />
          <div>
            <h4 className="font-bold text-base text-amber-300">أوسمة نور المهنية الحرة</h4>
            <p className="text-sm text-slate-300 mt-0.5">{stats.milestone}</p>
          </div>
        </div>
      )}

      {/* Grid of basic statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "إجمالي الخطط المحفوظة", value: stats.total, color: "text-sky-400", bg: "bg-sky-500/5", border: "border-sky-500/10" },
          { label: "الأقسام والمهارات المقررة", value: `${stats.diversity} من 6`, color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/10" },
          { label: "المادة الأكثر تجهيزاً", value: stats.mostLabel, color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/10" }
        ].map((item, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${item.bg} ${item.border} text-center`}>
            <span className={`text-2xl md:text-3xl font-bold block ${item.color} font-sans`}>
              {item.value}
            </span>
            <span className="text-xs text-slate-400 mt-2 block font-sans">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Distribution analysis */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-amber-500" />
          توزيع التحضيرات على فروع وجوانب اللغة
        </h3>
        <div className="space-y-4">
          {Object.entries(SUBJECTS).map(([k, s]) => {
            const count = stats.bySubj[k] || 0;
            const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            const barBg = barColors[k] || "bg-slate-500";

            return (
              <div key={k} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <span className="text-sm">{s.icon}</span>
                    {s.label}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {count} خطط ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barBg} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Positives */}
      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-6">
        <h3 className="text-base font-bold text-emerald-400 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          إيجابيات ومكاسب التخطيط
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {stats.positives.map((p, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-500 shrink-0">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities for improvement */}
      {stats.improvements.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-6">
          <h3 className="text-base font-bold text-amber-400 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            مجالات وفرص التطوير المهني
          </h3>
          <ul className="space-y-2.5 text-sm text-slate-300">
            {stats.improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-amber-500 shrink-0">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* General recommendation advice */}
      {stats.total >= 10 && (
        <div className="bg-violet-500/5 border border-violet-500/15 rounded-2xl p-5 text-sm leading-relaxed text-slate-300">
          <p className="font-bold text-violet-300 mb-1">💡 فكرة توجيهية هامة:</p>
          لقد حققت انتظاماً مثالياً، ننصح بمشاركة أوراق عمل محطات جيل ألفا مع الموجه التربوي لقياس أثر انخراط الفئة المستهدفة، واستعد لأسابيع التقييم والتكرار لضمان دمج الفوائد الإملائية والسرعة التعبيرية.
        </div>
      )}
    </div>
  );
}
