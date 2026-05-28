/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { useApp } from "./AppCtx";
import {
  PlanForm,
  GRADES,
  SUBJECTS,
  DAYS,
  PERIODS,
  LESSON_TYPES,
  INTRO_TYPES,
  ALPHA_STRATEGIES,
  CHALLENGES,
  ERRORS,
  REVIEW_WEEKS
} from "../types";
import ReviewBanner from "./ReviewBanner";
import { Calendar, BookOpen, GraduationCap, Sparkles } from "lucide-react";

interface FormPanelProps {
  onGenerate: (form: PlanForm) => void;
}

const EMPTY_FORM: PlanForm = {
  teacherName: "",
  schoolName: "",
  supervisorName: "",
  grade: "",
  subject: "",
  subType: "",
  lessonTitle: "",
  bookUnit: "",
  day: "",
  period: "",
  date: new Date().toISOString().split("T")[0],
  duration: "35",
  week: "1",
  lessonType: "",
  introType: "",
  alphaStrategy: "",
  classProblems: []
};

export default function FormPanel({ onGenerate }: FormPanelProps) {
  const { profile, setProfile, toast } = useApp();
  const [form, setForm] = useState<PlanForm>(() => ({
    ...EMPTY_FORM,
    ...profile
  }));
  const [activeTab, setActiveTab] = useState<"info" | "pedagogy" | "classroom">("info");

  const u = <K extends keyof PlanForm>(k: K, v: PlanForm[K]) => {
    setForm(f => ({ ...f, [k]: v }));
  };

  const toggleChallenge = (k: string) => {
    const isSelected = form.classProblems.includes(k);
    const updated = isSelected
      ? form.classProblems.filter(x => x !== k)
      : [...form.classProblems, k];
    u("classProblems", updated);
  };

  const selectedGrade = form.grade ? GRADES[form.grade] : null;
  const selectedSubject = form.subject ? SUBJECTS[form.subject] : null;

  // Auto-suggest lesson style based on chosen topic
  const suggestedStyleKey = form.subject
    ? Object.entries(LESSON_TYPES).find(([_, v]) => v.best.includes(form.subject))?.[0]
    : null;

  function handleFormSubmit() {
    if (!form.grade || !form.subject || !form.lessonTitle || !form.day) {
      toast("يرجى ملء الحقول الإلزامية: الصف الدراسي، القسم، عنوان الدرس واليوم", "error");
      return;
    }

    // Persist registration values for next visits
    setProfile({
      teacherName: form.teacherName,
      schoolName: form.schoolName,
      supervisorName: form.supervisorName,
      grade: form.grade
    });

    // Invoke callback on build
    onGenerate(form);
  }

  const tabItems = [
    { key: "info", label: "📝 بيانات الدرس", icon: <BookOpen className="w-4 h-4" /> },
    { key: "pedagogy", label: "💡 طرائق جيل ألفا", icon: <Sparkles className="w-4 h-4" /> },
    { key: "classroom", label: "🧠 ملف الفروق الصفية", icon: <GraduationCap className="w-4 h-4" /> }
  ] as const;

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-6">
      {/* Dynamic Tab Bar Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 no-print">
        {tabItems.map(item => {
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                active
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/10"
                  : "bg-slate-900/40 text-slate-400 border border-slate-800/80 hover:text-slate-200"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <ReviewBanner week={form.week} />

      {/* ── TAB CONTENT: INFO ── */}
      {activeTab === "info" && (
        <div className="space-y-6 animate-fade-in">
          {/* Identity Info Cards */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-[15px] font-bold text-slate-200 mb-2 flex items-center gap-2">
              <span className="text-lg">🏫</span>
              البيانات الرقابية للمعلم والمؤسسة
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5Block">
                <label className="text-xs text-slate-400 block mb-1">اسم المعلم / المعلمة</label>
                <input
                  type="text"
                  value={form.teacherName}
                  onChange={e => u("teacherName", e.target.value)}
                  placeholder="أدخل الاسم الرباعي"
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5Block">
                <label className="text-xs text-slate-400 block mb-1">اسم المدرسة</label>
                <input
                  type="text"
                  value={form.schoolName}
                  onChange={e => u("schoolName", e.target.value)}
                  placeholder="اسم المدرسة الحالية"
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5Block">
                <label className="text-xs text-slate-400 block mb-1">الموجه التربوي المختص</label>
                <input
                  type="text"
                  value={form.supervisorName}
                  onChange={e => u("supervisorName", e.target.value)}
                  placeholder="اسم موجه اللغة العربية"
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Core Lesson Detail Rows */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-[15px] font-bold text-slate-200 mb-2 flex items-center gap-2">
              <span className="text-lg">📚</span>
              تفاصيل الدرس المراد التحضير له
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1Block">
                <label className="text-xs text-slate-400 block mb-1">الصف الدراسي <span className="text-rose-500">*</span></label>
                <select
                  value={form.grade}
                  onChange={e => {
                    u("grade", e.target.value);
                    u("subject", "");
                    u("subType", "");
                  }}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                >
                  <option value="">— اختر الصف —</option>
                  {Object.entries(GRADES).map(([k, g]) => (
                    <option key={k} value={k}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1Block">
                <label className="text-xs text-slate-400 block mb-1">المادة / الفرع <span className="text-rose-500">*</span></label>
                <select
                  value={form.subject}
                  disabled={!form.grade}
                  onChange={e => {
                    u("subject", e.target.value);
                    u("subType", "");
                  }}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors disabled:opacity-40"
                >
                  <option value="">— اختر الفرع —</option>
                  {Object.entries(SUBJECTS).map(([k, s]) => (
                    <option key={k} value={k}>
                      {s.icon} {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1Block">
                <label className="text-xs text-slate-400 block mb-1">النمط الإملائي أو فرع التعبير</label>
                <select
                  value={form.subType}
                  disabled={!form.subject || selectedSubject?.sub.length === 0}
                  onChange={e => u("subType", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors disabled:opacity-40"
                >
                  <option value="">— اختر النمط (إن وُجد) —</option>
                  {selectedSubject?.sub.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1Block">
                <label className="text-xs text-slate-400 block mb-1">عنوان موضوع الدرس <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={form.lessonTitle}
                  onChange={e => u("lessonTitle", e.target.value)}
                  placeholder="أدخل عنوان موضوع الدرس بالتفصيل"
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1Block">
                <label className="text-xs text-slate-400 block mb-1">رقم الوحدة اللغوية أو السورة المقررة</label>
                <input
                  type="text"
                  value={form.bookUnit}
                  onChange={e => u("bookUnit", e.target.value)}
                  placeholder="مثال: الوحدة الثالثة: فضائل الأخلاق"
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Schedule Configurations */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-[15px] font-bold text-slate-200 mb-2 flex items-center gap-2">
              <span className="text-lg">🗓️</span>
              المحددات الزمنية وتوزيع الحصص
            </h4>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="space-y-1Block">
                <label className="text-xs text-slate-400 block mb-1">اليوم <span className="text-rose-500">*</span></label>
                <select
                  value={form.day}
                  onChange={e => u("day", e.target.value)}
                  className="w-full px-3 py-3 bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                >
                  <option value="">— اليوم —</option>
                  {DAYS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1Block">
                <label className="text-xs text-slate-400 block mb-1">رقم الحصة</label>
                <select
                  value={form.period}
                  onChange={e => u("period", e.target.value)}
                  className="w-full px-3 py-3 bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                >
                  <option value="">— الحصة —</option>
                  {PERIODS.map((p, idx) => (
                    <option key={idx} value={String(idx + 1)}>
                      الحصة {idx + 1} ({p})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1Block col-span-2 lg:col-span-1">
                <label className="text-xs text-slate-400 block mb-1">التاريخ الميلادي</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => u("date", e.target.value)}
                  className="w-full px-3 py-3 bg-slate-950/60 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors font-mono"
                />
              </div>

              <div className="space-y-1Block">
                <label className="text-xs text-slate-400 block mb-1">مدة زمن الحصة</label>
                <select
                  value={form.duration}
                  onChange={e => u("duration", e.target.value)}
                  className="w-full px-3 py-3 bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                >
                  <option value="35">35 دقيقة (نموذجي يمني)</option>
                  <option value="30">30 دقيقة (استثنائي)</option>
                </select>
              </div>

              <div className="space-y-1Block">
                <label className="text-xs text-slate-400 block mb-1">الأسبوع الدراسي</label>
                <select
                  value={form.week}
                  onChange={e => u("week", e.target.value)}
                  className="w-full px-3 py-3 bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                >
                  {Array.from({ length: 14 }, (_, i) => i + 1).map(w => (
                    <option key={w} value={String(w)}>
                      الأسبوع {w} {REVIEW_WEEKS.includes(w) ? "🔁" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grade Insights Banner if grade is chosen */}
          {selectedGrade && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border border-blue-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <h5 className="font-bold text-slate-200">
                  فهم الفئة المستهدفة: {selectedGrade.label} — {selectedGrade.level}
                </h5>
              </div>
              <p className="text-xs text-slate-350 leading-relaxed font-serif">
                مستوى بلوم: <strong className="text-blue-300">{selectedGrade.bloom}</strong>. {selectedGrade.cog}
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {selectedGrade.alphaRisks.map(risk => (
                  <span
                    key={risk}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/10"
                  >
                    {risk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB CONTENT: PEDAGOGY ── */}
      {activeTab === "pedagogy" && (
        <div className="space-y-6 animate-fade-in">
          {/* Lesson pedagogy pattern */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-[15px] font-bold text-slate-200 mb-2 flex items-center gap-2">
              <span className="text-lg">🎓</span>
              طبيعة ونمط سير الحصة
            </h4>

            {suggestedStyleKey && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/15 text-xs md:text-sm text-blue-300 leading-relaxed flex items-center gap-2.5">
                <span>💡</span>
                <span>
                  النمط المقترح للمادة والفرع المحدد حالياً:{" "}
                  <strong>{LESSON_TYPES[suggestedStyleKey]?.label}</strong> —{" "}
                  {LESSON_TYPES[suggestedStyleKey]?.desc}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(LESSON_TYPES).map(([k, v]) => {
                const isSelected = form.lessonType === k;
                return (
                  <div
                    key={k}
                    onClick={() => u("lessonType", k)}
                    className={`p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                      isSelected
                        ? "bg-amber-400/10 border-amber-400 text-amber-300"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700/60 hover:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{v.icon}</span>
                      <strong className={`text-sm ${isSelected ? "text-amber-400 font-bold" : "text-slate-200 font-semibold"}`}>
                        {v.label}
                      </strong>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-80">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Intro type */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-[15px] font-bold text-slate-200 mb-2 flex items-center gap-2">
              <span className="text-lg">🌅</span>
              التهيئة العقدية والوجدانية (التمهيد وإثارة الفضول)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(INTRO_TYPES).map(([k, v]) => {
                const isSelected = form.introType === k;
                return (
                  <div
                    key={k}
                    onClick={() => u("introType", k)}
                    className={`p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                      isSelected
                        ? "bg-purple-500/10 border-purple-500 text-purple-300"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700/60 hover:text-slate-300"
                    }`}
                  >
                    <strong className={`text-sm block mb-1.5 ${isSelected ? "text-purple-400 font-bold" : "text-slate-200"}`}>
                      {v.label}
                    </strong>
                    <p className="text-[11px] leading-relaxed opacity-85">{v.ex}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alpha Strategy */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-[15px] font-bold text-slate-200 mb-2 flex items-center gap-2">
              <span className="text-lg">⚡</span>
              استراتيجيات التعلم النشط المواتية لجيل ألفا
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(ALPHA_STRATEGIES).map(([k, v]) => {
                const isSelected = form.alphaStrategy === k;
                return (
                  <div
                    key={k}
                    onClick={() => u("alphaStrategy", k)}
                    className={`p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                      isSelected
                        ? "bg-teal-500/10 border-teal-500 text-teal-300 animate-pulse-subtle"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700/60 hover:text-slate-300"
                    }`}
                  >
                    <strong className={`text-sm block mb-1 ${isSelected ? "text-teal-400 font-bold" : "text-slate-200"}`}>
                      {v.label}
                    </strong>
                    <p className="text-[11px] leading-relaxed opacity-80">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: CLASSROOM ── */}
      {activeTab === "classroom" && (
        <div className="space-y-6 animate-fade-in">
          {/* Group differences checklists */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-[15px] font-bold text-slate-200 mb-2 flex items-center gap-2">
              <span className="text-lg">🧠</span>
              الحالات وتحديات الصف المستشرية بالفصل
            </h4>
            <p className="text-xs text-slate-400 leading-normal max-w-2xl">
              ثق تماماً أن رصد التحديات يرسخ تحضيراً دقيقاً؛ حدد العقبات الأساسية في هذا الفصل لنُضمّن الخطة السلوكية تدابير وورش عمل فورية لعلاجها:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(CHALLENGES).map(([k, v]) => {
                const isSelected = form.classProblems.includes(k);
                return (
                  <div
                    key={k}
                    onClick={() => toggleChallenge(k)}
                    className={`p-4 rounded-xl border cursor-pointer select-none flex items-center gap-3 transition-all duration-200 ${
                      isSelected
                        ? "bg-amber-400/10 border-amber-400 text-amber-300"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700/60"
                    }`}
                  >
                    <span className="text-xl shrink-0">{v.icon}</span>
                    <strong className="text-xs md:text-sm text-slate-200">
                      {v.label}
                    </strong>
                  </div>
                );
              })}
            </div>

            {/* Generated specific alerts if challenges selected */}
            {form.classProblems.length > 0 && (
              <div className="p-4 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <span>💡</span>
                  تدابير موجهة مدمجة بخطة التدريس الحالية:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-350 leading-relaxed font-serif">
                  {form.classProblems.flatMap(k => CHALLENGES[k]?.recs || []).map((rec, i) => (
                    <p key={i} className="flex items-start gap-1 p-0.5">
                      <span className="text-amber-500">•</span>
                      <span>{rec}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Core Expected Spelling Deficiencies */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-[15px] font-bold text-slate-200 mb-2 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              الأخطاء والعلل اللفظية المتوقعة لهذا القسم والصف
            </h4>

            {form.grade && form.subject ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(ERRORS[form.subject]?.[Number(form.grade)] || []).map((err, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-1.5">
                    <strong className="text-xs md:text-sm text-rose-450 font-bold flex items-center gap-1 text-rose-300">
                      <span>⚠️</span>
                      {err}
                    </strong>
                    <p className="text-xs text-slate-400 font-serif leading-relaxed">
                      <strong>الإجراء التربوي الفوري:</strong> عرض مثال لغوي مقابل، إتاحة الفرص للتصحيح الذاتي التفاعلي فوراً.
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 text-center border border-dashed border-slate-800 rounded-xl">
                يُرجي تحديد (الصف الدراسي) و (فرع المادة) أولاً لتشخيص معضلات الفهم والأخطاء المقابلة لها.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Primary Generator CTA Button */}
      <div className="pt-4 no-print border-t border-slate-900/40">
        <button
          onClick={handleFormSubmit}
          className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-450 hover:to-amber-450 text-slate-950 font-extrabold text-base md:text-lg tracking-wide shadow-xl shadow-amber-400/10 cursor-pointer transition-all hover:scale-[1.005] duration-200"
        >
          ✨ صياغة وتوليد مصفوفة الخطة التربوية المتكاملة
        </button>
      </div>
    </div>
  );
}
