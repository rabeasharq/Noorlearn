/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from "react";
import { ArrowLeft, Save, FileEdit, Printer, Award, Book, AlertTriangle, CheckSquare, Layers } from "lucide-react";
import { ArabicPlan, REVIEW_WEEKS } from "../types";
import { exportWord } from "../utils/exporter";

interface PreviewPanelProps {
  plan: ArabicPlan;
  onBack: () => void;
  onSave: () => void;
  saved: boolean;
}

export default function PreviewPanel({ plan, onBack, onSave, saved }: PreviewPanelProps) {
  const m = plan.meta;
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Parse check for weekly reviews
  const isReviewWeek = REVIEW_WEEKS.includes(Number(m.week));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans print:bg-white print:text-black">
      {/* Tool Actions Navigation Header */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 p-4 shadow-lg flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800/50 border border-slate-700/40 hover:border-slate-600/60 text-sm font-semibold cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          تعديل الخطة
        </button>

        <div className="text-center hidden md:block">
          <span className="text-xs text-amber-500 font-bold block">معاينة التقرير التربوي</span>
          <span className="text-sm font-semibold text-slate-200 mt-0.5 block font-display">
            {m.lessonTitle} — {m.subject}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!saved ? (
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 py-2 px-4.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/10 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              حفظ وتعميد
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              محفوظة بنجاح
            </span>
          )}

          <button
            onClick={() => exportWord(plan)}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/10 cursor-pointer transition-colors"
          >
            📄 تصدير Word
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/10 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            طباعة / PDF
          </button>
        </div>
      </nav>

      {/* Main Document Canvas Sheet Simulation (A4 Portrait Layout) */}
      <div
        ref={printAreaRef}
        className="max-w-4xl mx-auto my-6 p-8 bg-white text-slate-900 border border-slate-100 shadow-2xl rounded-2xl print:shadow-none print:border-none print:m-0 print:p-0 font-serif"
        dir="rtl"
      >
        {/* Official Governmental Header of Yemen */}
        <div className="border-b-4 border-double border-slate-900 pb-5 mb-6 flex flex-row items-center justify-between gap-4 font-serif">
          <div className="w-1/3 text-right text-xs space-y-1 font-bold text-slate-800 leading-relaxed">
            <p className="text-sm font-black text-slate-900">الجمهورية اليمنية</p>
            <p>وزارة التربية والتعليم</p>
            <p>مكتب التربية والتعليم بمحافظة الأمانة</p>
            {m.schoolName && <p>مدرسة: {m.schoolName}</p>}
          </div>

          <div className="w-1/3 flex flex-col items-center text-center justify-center">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mb-1">الخطة الدراسية السنوية</h1>
            <strong className="text-xs text-slate-800 font-bold block">وزارة التربية والتعليم</strong>
            <span className="text-[10px] text-slate-500 block">منظومة نور للتوجيه والتحضير</span>
          </div>

          <div className="w-1/3 text-left text-xs space-y-1 font-semibold text-slate-800 leading-relaxed font-sans">
            <p>التاريخ: <span className="font-bold text-slate-900">{m.date || new Date().toLocaleDateString("ar-YE")}</span></p>
            <p>الصف: <span className="font-bold text-slate-900">{m.grade}</span></p>
            <p>المادة: <span className="font-bold text-slate-900">{m.subject}</span></p>
          </div>
        </div>

        {/* Document Frame Header Banner */}
        <div
          className="p-6 text-white rounded-xl mb-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${m.color}, ${m.accent})`
          }}
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-amber-300 block uppercase opacity-90 print:text-black">
                الجمهورية اليمنية · وزارة التربية والتعليم
              </span>
              <h2 className="text-2xl font-bold font-display mt-1 tracking-tight print:text-black">
                خطة تحضير درس اللغة العربية المطور
              </h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-100/90 print:text-black">
                <span className="font-sans font-bold">{m.grade}</span>
                <span>·</span>
                <span>{m.subject} {m.subType && `(${m.subType})`}</span>
              </div>
            </div>

            <div className="text-right sm:text-left text-xs text-slate-100/90 space-y-1 print:text-black font-sans leading-relaxed">
              {m.teacherName && (
                <p>
                  اسم المعلم/ة: <strong className="text-white print:text-black font-bold">{m.teacherName}</strong>
                </p>
              )}
              {m.schoolName && (
                <p>
                  المدرسة: <strong className="text-white print:text-black font-bold">{m.schoolName}</strong>
                </p>
              )}
              {m.supervisorName && (
                <p>
                  الموجه التربوي: <strong className="text-white print:text-black font-bold">{m.supervisorName}</strong>
                </p>
              )}
              <p className="opacity-60 text-[10px]">منظومة نور التربوية v1.0.0</p>
            </div>
          </div>
        </div>

        {/* Unified 3x3 Metadata Grid Block */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { label: "عنوان الدرس", val: m.lessonTitle || "بدون عنوان", imp: true },
            { label: "الوحدة أو الفصل الدراسي", val: m.bookUnit || "غير محدد" },
            { label: "الأسبوع الدراسي", val: `الأسبوع ${m.week} من 14 ${isReviewWeek ? "🔁 أسبوع مراجعة" : ""}` },
            { label: "اليوم والتوجيه الزمني", val: `${m.day} — ${m.date}` },
            { label: "الحصة ومداها الحركي", val: m.periodNum ? `الحصة ${m.periodNum} (${m.period})` : "—" },
            { label: "المدة الزمنية المقررة", val: `${m.duration} دقيقة` },
            { label: "النمط التربوي المطبق", val: m.lessonTypeLabel || "—" },
            { label: "استراتيجية جيل ألفا", val: m.alphaLabel || "—" },
            { label: "نوع تهيئة التثقيف", val: m.introTypeLabel || "—" }
          ].map((item, idx) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
              <span className="text-[10px] text-slate-500 font-sans font-bold block mb-1">
                {item.label}
              </span>
              <span className={`text-sm ${item.imp ? "font-bold text-slate-900" : "text-slate-800"}`}>
                {item.val}
              </span>
            </div>
          ))}
        </div>

        {/* Cognitive Level Focus Banner */}
        <div className="mb-6 p-4 rounded-xl border border-blue-100 bg-blue-50/30 flex items-start gap-3">
          <Layers className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 print:text-black" />
          <div className="space-y-1 text-xs md:text-sm">
            <p className="text-slate-800 leading-normal">
              <strong>المستوى المعرفي للفئة المستهدفة:</strong> {m.level} — <span className="text-blue-700 font-bold">{m.bloom} (مستوى بلوم)</span>
            </p>
          </div>
        </div>

        {/* Educational Objectives */}
        <div className="mb-6">
          <h3
            className="text-[15px] font-bold pb-2 border-b-2 mb-3.5 flex items-center gap-2 font-sans"
            style={{ color: m.color, borderColor: m.color }}
          >
            <CheckSquare className="w-5 h-5" />
            الأهداف التعليمية الإجرائية السلوكية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {plan.objectives.map((obj, idx) => (
              <div
                key={idx}
                className="p-3.5 border border-slate-100 rounded-xl bg-slate-50 flex items-start gap-2.5"
              >
                <span
                  className="w-5 h-5 rounded-full text-white text-xs font-bold font-sans flex items-center justify-center shrink-0 mt-0.5 print:bg-black print:text-white"
                  style={{ backgroundColor: m.accent }}
                >
                  {idx + 1}
                </span>
                <span className="text-sm text-slate-800 leading-relaxed font-serif">
                  {obj}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alpha & Intro Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
            <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5 font-sans">
              <span className="text-base">⚡</span>
              استراتيجية ألفا: {plan.alphaStrategy}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-serif">
              {plan.alphaDesc}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 space-y-2">
            <h4 className="text-sm font-bold text-violet-800 flex items-center gap-1.5 font-sans">
              <span className="text-base font-sans">🌅</span>
              التمهيد وإثارة الانتباه: {plan.introLabel}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-serif">
              {plan.introEx}
            </p>
          </div>
        </div>

        {/* Adaptable Remedial & Psychological Layer */}
        {plan.remedialPlan && (
          <div className="mb-6 p-4 border border-purple-200 bg-purple-50/15 rounded-xl space-y-3.5 print:bg-purple-50/5">
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2 font-display">
              <span className="text-base">🧬</span>
              {plan.remedialPlan.title} (الطبقة العلاجية المتغيرة المستجدة)
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-serif">
              <strong>التشخيص الطارئ للفجوة اللغوية:</strong> {plan.remedialPlan.targetGap}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-purple-800 block">🪜 الإجراءات المصاحبة لردم الفجوة:</span>
                <div className="space-y-1">
                  {plan.remedialPlan.microPlan.map((act, i) => (
                    <p key={i} className="text-xs text-slate-700 font-serif leading-relaxed flex items-start gap-1">
                      <span className="text-purple-600 font-sans">•</span>
                      <span>{act}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-teal-850 block">🎭 التدابير النفسية والتهيئة السلوكية المطبقة:</span>
                <div className="space-y-1">
                  {plan.remedialPlan.psychActions.map((item, i) => (
                    <p key={i} className="text-xs text-slate-700 font-serif leading-relaxed flex items-start gap-1">
                      <span className="text-teal-600 font-sans">•</span>
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tools and Strategies Table card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div
              className="px-4 py-2.5 text-white text-sm font-bold font-sans flex items-center gap-2"
              style={{ backgroundColor: m.color }}
            >
              <span>🛠️</span>
              الوسائل التعليمية والمعينات الصفية
            </div>
            <div className="p-4 space-y-2">
              {plan.tools.map((t, i) => (
                <div key={i} className="text-xs text-slate-750 flex items-start gap-1 p-0.5">
                  <span className="text-slate-400 shrink-0">•</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div
              className="px-4 py-2.5 text-white text-sm font-bold font-sans flex items-center gap-2"
              style={{ backgroundColor: m.color }}
            >
              <span>🎓</span>
              الاستراتيجيات والطرائق التدريسية الموظفة
            </div>
            <div className="p-4 space-y-2">
              {plan.strategies.map((s, i) => (
                <div key={i} className="text-xs text-slate-750 flex items-start gap-1 p-0.5">
                  <span className="text-slate-400 shrink-0">•</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps and Stages Table format */}
        <div className="mb-6">
          <h3
            className="text-[15px] font-bold pb-2 border-b-2 mb-3.5 flex items-center gap-2 font-sans"
            style={{ color: m.color, borderColor: m.color }}
          >
            <Book className="w-5 h-5" />
            خطوات وإجراءات سير الدرس
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 font-sans">
                  <th className="p-3 w-1/4">المرحلة والمخطط</th>
                  <th className="p-3 text-center w-16">الزمن</th>
                  <th className="p-3 w-1/2">الأنشطة والإجراءات المتبادلة</th>
                  <th className="p-3 text-center">دور المعلم/ة</th>
                  <th className="p-3 text-center">دور الطالب/ة</th>
                </tr>
              </thead>
              <tbody>
                {plan.stages.map((st, i) => (
                  <tr key={i} className="border-b border-slate-150 last:border-0 hover:bg-slate-50/40">
                    <td className="p-3 font-bold text-slate-900 leading-normal font-sans">
                      <span className="text-amber-600 ml-1">
                        {["①", "②", "③", "④"][i]}
                      </span>
                      {st.name}
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[11px] font-mono">
                        {st.t}′
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 leading-relaxed space-y-1 font-serif">
                      {(st.acts || []).map((action, actionIdx) => (
                        <p key={actionIdx} className="relative pr-3">
                          <span className="absolute right-0 top-0 text-slate-400">•</span>
                          {action}
                        </p>
                      ))}
                    </td>
                    <td className="p-3 text-center text-slate-500 font-sans leading-normal">
                      {["التجليل والتهيئة", "الشرح والعرض", "الإرشاد والتوجيه", "التقييم والختم"][i]}
                    </td>
                    <td className="p-3 text-center text-slate-500 font-sans leading-normal">
                      {["الاستماع والتوقع", "الفهم التشاركي", "التدريب الموجه", "التعبير والتقييم الذاتي"][i]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expected Errors and Immediate Remedy section */}
        <div className="mb-6">
          <h3
            className="text-[15px] font-bold pb-2 border-b-2 mb-3.5 flex items-center gap-2 font-sans"
            style={{ color: m.color, borderColor: m.color }}
          >
            <AlertTriangle className="w-5 h-5" />
            الأخطاء والعيوب الاملائية المتوقعة ومسارات العلاج الفوري
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 font-sans">
                  <th className="p-3 w-2/5">الخطأ المتوقع</th>
                  <th className="p-3">الإجراء التربوي الإملائي المستعجل</th>
                </tr>
              </thead>
              <tbody>
                {plan.expectedErrors.map((err, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/20">
                    <td className="p-3 text-rose-700 font-bold font-sans">
                      ⚠️ {err}
                    </td>
                    <td className="p-3 text-slate-800 leading-relaxed font-serif">
                      ✓ {plan.errorRemedies[i] || "معالجة فنية فورية بتقديم مثال إملائي موازن."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assessment and Homework Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold font-sans">
              📊 أساليب التقييم التكويني المطبقة
            </div>
            <div className="p-4 space-y-2">
              {plan.assessments.map((a, i) => (
                <div key={i} className="text-xs text-slate-700 flex items-start gap-1 p-0.5">
                  <span className="text-emerald-500 shrink-0">✓</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold font-sans">
              🏠 الواجبات المنزلية المقترحة
            </div>
            <div className="p-4 text-xs text-slate-700 leading-relaxed font-serif">
              {plan.homework}
            </div>
          </div>
        </div>

        {/* Group Challenges Suggestions */}
        {plan.challengeRecs.length > 0 && (
          <div className="mb-6 p-4.5 bg-yellow-50/40 border border-yellow-200/60 rounded-xl">
            <h4 className="text-xs font-bold text-amber-900 mb-2 font-sans">
              💡 توصيات للتحديات ومراعاة الفروق الفردية بالفصل:
            </h4>
            <div className="flex flex-wrap gap-2">
              {plan.challengeRecs.map((rec, idx) => (
                <span
                  key={idx}
                  className="bg-amber-100/50 text-amber-900 border border-amber-200/65 px-3 py-1 rounded-full text-xs font-sans"
                >
                  ◈ {rec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Psychological, War and Outages Notes */}
        <div className="mb-6 p-4.5 rounded-xl border border-violet-150 bg-violet-50/20">
          <h4 className="text-xs font-bold text-violet-900 mb-1.5 font-sans leading-none">
            🧬 ملخص جيل ألفا المعرفي والثقافي لليمن:
          </h4>
          <p className="text-xs text-slate-700 font-serif leading-relaxed mb-1.5">
            {m.cogNote}
          </p>
          <p className="text-[11px] text-slate-500 font-serif leading-normal italic">
            تنبيه تربوي مهني: تسهم الفجوة اللغوية في صعوبة دمج القواعد المعقدة — بادر بالتدريج الصعودي والبطاقات الملونة.
          </p>
        </div>

        {/* References */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-600 mb-2 font-sans">
            📚 المراجع والمصادر التعليمية المعتمدة:
          </h4>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 font-sans">
            {plan.references.map((item, idx) => (
              <span key={idx} className="bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-full">
                📎 {item}
              </span>
            ))}
          </div>
        </div>

        {/* Signature Box */}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-slate-600 font-sans leading-relaxed">
            <div>
              <p className="h-10">توقيع المعلم / المعلمة</p>
              <div className="border-t border-slate-300 w-4/5 mx-auto pt-1 text-[11px] text-slate-400">
                التاريخ: ___ / ___ / ______
              </div>
            </div>
            <div>
              <p className="h-10">توقيع مدير المدرسة</p>
              <div className="border-t border-slate-300 w-4/5 mx-auto pt-1 text-[11px] text-slate-400">
                التاريخ: ___ / ___ / ______
              </div>
            </div>
            <div>
              <p className="h-10">توقيع الموجه التربوي</p>
              <div className="border-t border-slate-300 w-4/5 mx-auto pt-1 text-[11px] text-slate-400">
                التاريخ: ___ / ___ / ______
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
