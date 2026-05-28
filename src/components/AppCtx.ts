/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext } from "react";

export interface TeacherProfile {
  teacherName: string;
  schoolName: string;
  supervisorName: string;
  grade: string;
}

export interface AppCtxType {
  profile: TeacherProfile;
  setProfile: (p: Partial<TeacherProfile>) => void;
  toast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const AppCtx = createContext<AppCtxType | null>(null);

export const useApp = () => {
  const context = useContext(AppCtx);
  if (!context) {
    throw new Error("useApp must be used within an AppCtx Provider");
  }
  return context;
};
