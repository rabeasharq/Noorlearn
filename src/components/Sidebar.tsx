/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, FolderOpen, BarChart3, HelpCircle } from "lucide-react";
import { APP_NAME, APP_VERSION } from "../types";

interface SidebarProps {
  view: string;
  setView: (v: string) => void;
  plansCount: number;
}

export default function Sidebar({ view, setView, plansCount }: SidebarProps) {
  const nav = [
    { key: "form", icon: <BookOpen className="w-5 h-5" />, label: "تحضير جديد" },
    { key: "history", icon: <FolderOpen className="w-5 h-5" />, label: "خططي الدراسية", count: plansCount },
    { key: "feedback", icon: <BarChart3 className="w-5 h-5" />, label: "التغذية الراجعة" },
    { key: "guide", icon: <HelpCircle className="w-5 h-5" />, label: "دليل الاستخدام" },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden select-none shrink-0 no-print">
      {/* Brand & Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚜️</span>
          <div>
            <h1 className="text-xl font-bold font-display text-amber-400 tracking-tight">
              {APP_NAME}
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              تحضير العربية الذكي
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>الإصدار {APP_VERSION}</span>
          <span>للصفوف 7-9</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {nav.map(item => {
          const active = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-right transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold"
                  : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={active ? "text-amber-400" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span className="text-[15px] font-sans">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="bg-amber-400 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Yemeni Footer Specifications */}
      <div className="p-6 border-t border-slate-800 bg-slate-950/40">
        <div className="text-[11px] text-slate-500 leading-relaxed font-sans space-y-1">
          <p>📍 الجمهورية اليمنية</p>
          <p>📝 معايير المنهج الوطني المعتمد</p>
          <p>📊 خطة دراسية متكاملة (14 أسبوعاً)</p>
          <p className="text-emerald-500/80 font-semibold flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            مخزن محلي (Offline-first)
          </p>
        </div>
      </div>
    </aside>
  );
}
