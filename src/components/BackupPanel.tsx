/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useContext, ChangeEvent, DragEvent } from "react";
import { 
  Database, 
  Download, 
  Upload, 
  FileJson, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck
} from "lucide-react";
import { NoorDB } from "../utils/db";
import { AppCtx } from "./AppCtx";
import { motion } from "motion/react";

interface BackupPanelProps {
  onImportSuccess: () => void;
  plansCount: number;
}

export default function BackupPanel({ onImportSuccess, plansCount }: BackupPanelProps) {
  const ctx = useContext(AppCtx);
  const [loading, setLoading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [importError, setImportError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export database to JSON
  const handleExport = async () => {
    setLoading(true);
    try {
      const jsonString = await NoorDB.exportBackup();
      
      // Create and trigger download
      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      // Formatting current time forfilename
      const dateStr = new Date().toISOString().split("T")[0];
      
      link.href = url;
      link.setAttribute("download", `نسخة_احتياطية_منظومة_نور_${dateStr}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      ctx?.toast("📥 تم تصدير واستخراج ملف النسخة الاحتياطية بنجاح", "success");
    } catch (err) {
      console.error("Failed to export backup:", err);
      ctx?.toast("❌ فشل تصدير الملف الحسي للبيانات", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper file parsing function
  const parseAndImportFile = async (file: File) => {
    setLoading(true);
    setImportError("");
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          await NoorDB.importBackup(content);
          
          ctx?.toast("⚡ تم استيراد واستعادة البيانات بالكامل بنجاح!", "success");
          onImportSuccess();
        } catch (err: any) {
          console.error("Validation failed during import:", err);
          setImportError(err?.message || "فشل تحليل الملف؛ تأكد من سلامة ملف JSON وبنيته.");
          ctx?.toast("❌ فشل استعادة البيانات", "error");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.error("File reading error:", err);
      setImportError("خطأ تقني أثناء محاولة قراءة الملف المختار.");
      ctx?.toast("❌ فشل استيراد الملف", "error");
      setLoading(false);
    }
  };

  // Import triggers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseAndImportFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseAndImportFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Intro Header Info Panel */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative flex flex-col md:flex-row gap-6 items-center">
          <div className="p-4 bg-slate-950/60 border border-slate-700/30 rounded-2xl shrink-0">
            <Database className="w-14 h-14 text-amber-500 animate-pulse" />
          </div>
          <div className="text-center md:text-right space-y-2">
            <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center justify-center md:justify-start gap-3">
              <span>إدارة البيانات والنسخ الاحتياطي للكمبيوتر</span>
              <span className="text-xs font-sans bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
                نشط (IndexedDB)
              </span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-sans max-w-2xl">
              تعتمد منظومة نور على ذاكرة تسمى <strong className="text-slate-200">IndexedDB</strong> المدمجة داخل متصفح اللابتوب. هذه الذاكرة قوية ومقاومة للمسح التلقائي والعادي للمتصفح مقارنة بالذاكرة التخزينية العادية لمعالجة وتأمين خطط جيل ألفا والدراسات التعليمية بشكل ثابت.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 border-t border-slate-800/80 pt-6">
          <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl text-center">
            <p className="text-xs text-slate-500 font-sans">عدد الخطط المحفوظة حالياً</p>
            <p className="text-2xl font-bold text-amber-500 mt-1 font-display">{plansCount} خطط</p>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl text-center">
            <p className="text-xs text-slate-500 font-sans">نوع قاعدة التخزين المحلية</p>
            <p className="text-base font-bold text-blue-400 mt-2 font-sans flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-blue-400" />
              IndexedDB صلبة
            </p>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl text-center">
            <p className="text-xs text-slate-500 font-sans">مقاومة حذف الكاش والمؤقت</p>
            <p className="text-base font-bold text-emerald-400 mt-2 font-sans flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
              مستوى أمان مرتفع
            </p>
          </div>
        </div>
      </div>

      {/* Backup Actions Component Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* EXPORT PANEL */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-200">تصدير قاعدة الأرشيف كملف</h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">استخراج فوري للبيانات تحسباً للطوارئ</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              يسمح لك هذا الزر بضغط وتحويل كافة الملفات المحضرة مسبقاً، وإعدادات ملفك الشخصي كمعلم، وسجل التنوع الدراسي إلى ملف نصي صلب <strong className="text-amber-500">JSON</strong> يمكنك حفظه في قرص خارجي أو هاتف لضمان استعادته بأي وقت.
            </p>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 space-y-2 text-xs text-amber-400 font-sans">
              <p className="flex items-start gap-2">
                <span className="mt-0.5 select-none">•</span>
                <span>لا يتطلب الإنترنت للعمل بشكل كامل.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-0.5 select-none">•</span>
                <span>الملف يحتوي على جميع النصوص وتواريخ الحفظ والقرارات.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-0.5 select-none">•</span>
                <span>يوصى بالاحتفاظ بنسخة دورية بعد كل 5 خطط دراسية مضافة.</span>
              </p>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={handleExport}
              disabled={loading}
              className={`w-full py-3.5 px-6 rounded-xl bg-amber-550 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold font-sans flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-550/10 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-slate-950" />
              )}
              <span>تصدير البيانات كملف صلب (JSON)</span>
            </button>
          </div>
        </div>

        {/* IMPORT PANEL */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-200">استرجاع الأرشيف من ملف</h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">شحن الأرشيف واسترجاع الخطط السابقة</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              إذا قمت بفرمتة اللابتوب أو حذفت المتصفح، يمكنك استعادة جميع ملفاتك والعودة لنفس النقطة السابقة فوراً. لعمل ذلك، قم بإدراج أو إسقاط ملف النسخة الاحتياطية المصدّر سابقاً.
            </p>

            {/* Error Message */}
            {importError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3.5 rounded-xl flex gap-2.5 items-start font-sans">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{importError}</span>
              </div>
            )}

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-blue-400 bg-blue-500/5"
                  : "border-slate-800 hover:border-slate-700 hover:bg-slate-950/20"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <FileJson className={`w-8 h-8 mx-auto mb-2.5 ${dragActive ? "text-blue-400" : "text-slate-500"}`} />
              <p className="text-xs text-slate-300 font-sans">
                اسحب ملف الـ JSON وأسقطه هنا، أو <span className="text-blue-400 font-bold underline">تصفح من جهازك</span>
              </p>
              <p className="text-[10px] text-slate-500 font-sans mt-1">تنسيق ملفات الدعم المعتمدة: .json فقط</p>
            </div>
          </div>

          <div className="pt-6">
            <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-3 text-[11px] text-slate-500 font-sans flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500/80 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="text-amber-400/80 font-bold">تنبيه حرج:</span> استيراد نسخة احتياطية قديمة سيحل محل الخطط والملف الشخصي الحالي تماماً. يوصى بتصدير نسختك الحالية قبل القيام بالاستيراد لمزيد من الأمان وتجنب فقدان البيانات النشطة.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Database Security and Reliability specifications */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 font-sans">
        <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>🛡️ معايير حفظ خصوصية وتحضير المعلم اليمني</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="space-y-2">
            <p className="flex gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>عدم تتبع الإنترنت:</strong> لا ترسل منظومة نور أي بيانات، أو أسماء مدارس، أو خطط دراسية إلى سيرفرات خارجية بالكامل؛ جميع الملفات معالجة وحصرية داخل جهاز الكمبيوتر الخاص بك.</span>
            </p>
            <p className="flex gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>سرعة في المعالجة:</strong> قاعدة IndexedDB تعمل بمستوى النانو ثانية، مما يعني عدم تأثر سرعة استرجاع وتحضير الحصص حتى مع وجود مئات الخطط بالأرشيف.</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>الامتثال التام:</strong> توافق دائم مع شروط النزاهة وحفظ الخصوصية للكوادر التعليمية والتربوية اليمنية.</span>
            </p>
            <p className="flex gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>حماية استثنائية:</strong> الملف المصدّر بصيغة JSON هو ملف خفيف، آمن، مشفر من البرمجيات الضارة ويمكن إرساله للمعلمين والزملاء للمشاركة بكل سهولة.</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
