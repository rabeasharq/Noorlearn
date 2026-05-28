/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, HelpCircle, GraduationCap, Laptop, Share2, Award, Info } from "lucide-react";
import { ALPHA_STRATEGIES } from "../types";

export default function GuidePanel() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sections = [
    {
      icon: <Info className="w-5 h-5 text-amber-400" />,
      title: "نظرة عامة على المنظومة",
      body: `منظومة "نور" التربوية صُممت خصيصاً لتيسير وإثراء عملية تحضير دروس اللغة العربية لمعلمينا الأعزاء في اليمن.
      تتميز برؤية متكاملة تدعم العمل دون توفر شبكة إنترنت (Offline-first)، مستندة بالكلية على خوادم المتصفح التخزينية (IndexedDB) لحفظ خصوصية وجودة بياناتك.
      تسهم المنظومة في جسر فجوات التشتت المعرفي والانقطاع المدرسي الممتد لجيل كامل، عبر توظيف أنماط استراتيجية مرنة ومخصصة.`
    },
    {
      icon: <BookOpen className="w-5 h-5 text-amber-400" />,
      title: "خطوات التثبيت والتحضير السلس",
      body: `1. تسجيل الهويّة: أدخل اسمك واسم المدرسة والموجه في الصفحة الأولى (ستكون البيانات محفوظة تلقائياً ومستمرة).
2. فئة الهدف: حدد الصف الدراسي والقسم لتصفية المكتسبات المعرفية وعينات الأخطاء المتوقعة.
3. التكييف والتمهيد: أدرج عنوان الدرس، واختر نوع التمهيد المفضل والنمط التعليمي لجيل ألفا.
4. تحديات الصف: حدد الفروق الجوهرية (مثلاً: تشتت الانتباه) للحصول على تدابير علاجية ذكية في مسار الخطة.
5. استخراج التقارير: بلمسة زر واحدة، يمكنك تحميل الخطة بصيغة Word مجهزة كلياً، أو طباعتها PDF مباشرة.`
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
      title: "خطط جيل ألفا اليمني التفاعلية",
      body: Object.entries(ALPHA_STRATEGIES)
        .map(([_, v]) => `• ${v.label}: ${v.desc}`)
        .join("\n\n")
    },
    {
      icon: <Share2 className="w-5 h-5 text-amber-400" />,
      title: "نظام المراجعة المدمج",
      body: `تتميز المنظومة بمسار مبادئ متكامل يسير على مدار 14 أسبوعاً دراسياً:
• الأسبوع 5: محطة المراجعة الأولى (لأقسام الوحدات والمهارات الفنية 1-3)
• الأسبوع 10: محطة المراجعة والتقريب الثانية (للوحدات النحوية والأدبية 4-8)
• الأسبوع 14: التقييم الشامل للأثر التعليمي للمنهج.
عند إدخال هذه الأرقام في حقل الأسبوع، ستكشف المنظومة تلقائياً عن لوحة مقترحة للمراجعة التراكمية.`
    },
    {
      icon: <Laptop className="w-5 h-5 text-amber-400" />,
      title: "التصدير، التحرير، والحفظ الفوري",
      body: `• توافق تام: التوريد المباشر كملفات Microsoft Word (.doc) بمخطط يطابق معايير لجان التوجيه الرسمية باليمن.
• حفظ محلي كامل: يتم تأمين جميع الخطط الخاصة بك في قاعدة بيانات آمنة داخلك، وتظل قابلة للتعديل والتحوير والاسترجاع حتى بعد مرور شهور من الكتابة الأوفلاين.`
    },
    {
      icon: <Award className="w-5 h-5 text-amber-400" />,
      title: "الأطوار القادمة ومستقبل نور",
      body: `• حسابات سحابية لربط المدارس وتقارير الإنجاز التفاعلية.
• استيراد المناهج الرسمية بصيغة PDF لتوزيع المهارات والأهداف بلمسة ذكية.
• ربط المنظومة ببوت تعليمي محلي يمني للمساعدة في توليد قطع إنشائية بليغة ونثرية تدعم المنهج.`
    }
  ];

  return (
    <div className="py-6 space-y-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <HelpCircle className="w-12 h-12 text-amber-400 mx-auto mb-2" />
        <h2 className="text-2xl font-bold font-display text-slate-100">دليل المستخدم التربوي</h2>
        <p className="text-sm text-slate-400 mt-1">
          كيف تستغل الفاعلية القصوى لمنظومة نور في ممارساتك التعليمية اليومية
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-250 hover:border-slate-700/60"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-right cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  {section.icon}
                  <h3 className="text-base font-bold text-slate-200 font-sans">
                    {section.title}
                  </h3>
                </div>
                <span className="text-slate-500 font-bold text-sm transition-transform duration-200">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/40 whitespace-pre-line">
                      {section.body}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
