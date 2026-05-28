/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { AppCtx, TeacherProfile } from "./components/AppCtx";
import { PlanForm, ArabicPlan } from "./types";
import { NoorDB } from "./utils/db";
import { buildPlan } from "./utils/planEngine";

import Sidebar from "./components/Sidebar";
import FormPanel from "./components/FormPanel";
import HistoryPanel from "./components/HistoryPanel";
import FeedbackPanel from "./components/FeedbackPanel";
import GuidePanel from "./components/GuidePanel";
import PreviewPanel from "./components/PreviewPanel";

import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [view, setView] = useState<string>("form");
  const [plan, setPlan] = useState<ArabicPlan | null>(null);
  const [saved, setSaved] = useState<boolean>(false);

  // Archive state and loading
  const [plans, setPlans] = useState<PlanForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Toast notifier state
  const [toastMsg, setToastMsg] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  // Teacher Profile configuration
  const [profile, setProfileState] = useState<TeacherProfile>({
    teacherName: "",
    schoolName: "",
    supervisorName: "",
    grade: ""
  });

  // Re-fetch all saved entries from database
  const refreshPlans = useCallback(async () => {
    try {
      const list = await NoorDB.getPlans();
      setPlans(list);
    } catch (err) {
      console.error("Failed to read lesson plans catalog:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial profile and items on mount
  useEffect(() => {
    // 1. Fetch teacher config values
    NoorDB.getPref<TeacherProfile>("profile").then(savedProfile => {
      if (savedProfile) {
        setProfileState(savedProfile);
      }
    });

    // 2. Query available archived plans
    refreshPlans();
  }, [refreshPlans]);

  // Display toast notice triggers
  const triggerToast = useCallback((msg: string, type: "success" | "error" | "info" = "info") => {
    setToastMsg(msg);
    setToastType(type);
    
    // Clear auto-timeout
    const t = setTimeout(() => setToastMsg(""), 3000);
    return () => clearTimeout(t);
  }, []);

  // Set and save teacher profile preferences
  const handleProfileUpdate = useCallback((newProfile: Partial<TeacherProfile>) => {
    setProfileState(prev => {
      const updated = { ...prev, ...newProfile };
      NoorDB.setPref("profile", updated).catch(err => {
        console.error("Critical error saving profile configurations:", err);
      });
      return updated;
    });
  }, []);

  // Generate lesson plan preview
  const handleGenerate = useCallback((formValues: PlanForm) => {
    const constructedPlan = buildPlan(formValues);
    setPlan(constructedPlan);
    setSaved(!!formValues.id);
    setView("preview");
  }, []);

  // Persist current active plan to IndexedDB
  const handleSave = useCallback(async () => {
    if (!plan) return;
    try {
      const savedId = await NoorDB.savePlan(plan.form);
      
      // Update the plan object with the newly returned or existing id
      const updatedForm = { ...plan.form, id: savedId };
      const updatedPlan = { ...plan, form: updatedForm };
      
      setPlan(updatedPlan);
      setSaved(true);
      triggerToast("✅ تم حفظ الخطة وتعميدها بنجاح في خططك الدراسية", "success");
      
      // Update state listings
      await refreshPlans();
    } catch (err) {
      console.error("Failed to save plan:", err);
      triggerToast("❌ خطأ طارئ أثناء حفظ الخطة التربوية؛ يرجى المحاولة ثانيةً", "error");
    }
  }, [plan, triggerToast, refreshPlans]);

  // Load selected plan from history
  const handleLoad = useCallback((p: PlanForm) => {
    const reconstructed = buildPlan(p);
    setPlan(reconstructed);
    setSaved(true);
    setView("preview");
  }, []);

  // Remove plan from local catalog
  const handleDelete = useCallback(async (id: number) => {
    try {
      await NoorDB.deletePlan(id);
      triggerToast("ℹ️ تم حذف الخطة التعليمية بنجاح من الأرشيف", "info");
      await refreshPlans();
    } catch (err) {
      console.error("Failed to delete plan:", err);
      triggerToast("❌ فشل حذف الخطة الدراسية من الأرشيف", "error");
    }
  }, [triggerToast, refreshPlans]);

  // Global Context Provider values
  const ctxValue = {
    profile,
    setProfile: handleProfileUpdate,
    toast: triggerToast
  };

  // Setup layout panel headings dynamically based on selection state
  const panelTitles: Record<string, string> = {
    form: "صياغة خطة تحضيرية جديدة",
    history: `الأرشيف ودليل خططي الدراسية (${plans.length})`,
    feedback: "التحليلات ومستوى التنوع التراكمي",
    guide: "دليل منظومة نور ومناهج اللغة العربية"
  };

  const activeTitle = panelTitles[view] || "المساعد التربوي للتحضير";

  // Render isolated document page preview if active
  if (view === "preview" && plan) {
    return (
      <AppCtx.Provider value={ctxValue}>
        <PreviewPanel
          plan={plan}
          onBack={() => setView("form")}
          onSave={handleSave}
          saved={saved}
        />
        {/* Persistent Floating Toast Alerts */}
        {toastMsg && (
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-full text-sm font-bold shadow-2xl z-[9999] transition-all transform animate-fade-in font-sans ${
              toastType === "success"
                ? "bg-emerald-500 text-white"
                : toastType === "error"
                ? "bg-rose-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {toastMsg}
          </div>
        )}
      </AppCtx.Provider>
    );
  }

  return (
    <AppCtx.Provider value={ctxValue}>
      <div className="flex h-screen overflow-hidden bg-[#080c1a] text-[#e8f0ff]">
        {/* Navigation Sidebar */}
        <Sidebar view={view} setView={setView} plansCount={plans.length} />

        {/* Core Screen Area layouts */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Control Bar Status Header */}
          <header className="bg-slate-900/40 border-b border-slate-800/80 px-8 py-4.5 flex items-center justify-between shrink-0 select-none no-print">
            <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
              {activeTitle}
            </h2>
            <div className="flex items-center gap-3">
              {profile.teacherName && (
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700/30">
                  أ. {profile.teacherName}
                </span>
              )}
              {profile.schoolName && (
                <span className="text-xs bg-slate-950/50 text-slate-400 px-3 py-1.5 rounded-xl block border border-slate-900/80 max-w-[150px] truncate">
                  {profile.schoolName}
                </span>
              )}
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                غير متصل (IndexedDB)
              </span>
            </div>
          </header>

          {/* Fluid Component Transitions using motion/react */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.main
                key={view}
                initial={{ opacity: 0, scale: 0.995, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.995, y: -4 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="w-full h-full overflow-y-auto px-8 py-2 no-print"
              >
                {view === "form" && <FormPanel onGenerate={handleGenerate} />}
                {view === "history" && (
                  <HistoryPanel
                    plans={plans}
                    loading={loading}
                    onLoad={handleLoad}
                    onDelete={handleDelete}
                  />
                )}
                {view === "feedback" && <FeedbackPanel plans={plans} />}
                {view === "guide" && <GuidePanel />}
              </motion.main>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Persistent Floating Toast Alerts */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-full text-sm font-bold shadow-2xl z-[9999] transition-all transform animate-fade-in font-sans ${
            toastType === "success"
              ? "bg-emerald-500 text-white"
              : toastType === "error"
              ? "bg-rose-500 text-white"
              : "bg-blue-600 text-white"
          }`}
        >
          {toastMsg}
        </div>
      )}
    </AppCtx.Provider>
  );
}
