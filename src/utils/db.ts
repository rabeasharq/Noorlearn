/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlanForm, ArabicPlan } from "../types";

const IDB_NAME = "NoorArabicDB";
const IDB_VER = 1;
const STORE_PLANS = "plans";
const STORE_PREFS = "prefs";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VER);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_PLANS)) {
        const s = db.createObjectStore(STORE_PLANS, { keyPath: "id", autoIncrement: true });
        s.createIndex("savedAt", "savedAt");
        s.createIndex("grade", "grade");
        s.createIndex("subject", "subject");
      }
      if (!db.objectStoreNames.contains(STORE_PREFS)) {
        db.createObjectStore(STORE_PREFS, { keyPath: "key" });
      }
    };
    req.onsuccess = (e: any) => resolve(e.target.result as IDBDatabase);
    req.onerror = (e: any) => reject(e.target.error);
  });
}

export const NoorDB = {
  async savePlan(planForm: PlanForm): Promise<number> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PLANS, "readwrite");
      const store = tx.objectStore(STORE_PLANS);
      const data = { ...planForm, savedAt: new Date().toISOString() };
      
      const req = planForm.id 
        ? store.put(data)
        : store.add(data);

      req.onsuccess = () => resolve(req.result as number);
      req.onerror = () => reject(req.error);
    });
  },

  async getPlans(): Promise<PlanForm[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PLANS, "readonly");
      const req = tx.objectStore(STORE_PLANS).getAll();
      req.onsuccess = () => {
        const list = req.result || [];
        // Sort newest first
        resolve(list.reverse());
      };
      req.onerror = () => reject(req.error);
    });
  },

  async deletePlan(id: number): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PLANS, "readwrite");
      const req = tx.objectStore(STORE_PLANS).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async getPref<T>(key: string, def: T | null = null): Promise<T | null> {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PREFS, "readonly");
      const req = tx.objectStore(STORE_PREFS).get(key);
      req.onsuccess = () => resolve(req.result ? (req.result.value as T) : def);
      req.onerror = () => resolve(def);
    });
  },

  async setPref<T>(key: string, value: T): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PREFS, "readwrite");
      const req = tx.objectStore(STORE_PREFS).put({ key, value });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async exportBackup(): Promise<string> {
    const plans = await this.getPlans();
    const profile = await this.getPref("profile");
    
    const backupObj = {
      appName: "NoorArabic",
      version: "1.0.0",
      backupDate: new Date().toISOString(),
      plans,
      prefs: {
        profile
      }
    };
    return JSON.stringify(backupObj, null, 2);
  },

  async importBackup(jsonString: string): Promise<void> {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== "object") {
      throw new Error("بنية الملف غير صالحة. يجب أن يكون ملف JSON صحيحاً.");
    }
    
    if (data.appName !== "NoorArabic") {
      throw new Error("عذراً، هذا الملف لا ينتمي لشبكة تحضيرات منظومة نور.");
    }

    if (!Array.isArray(data.plans)) {
      throw new Error("ملف النسخة الاحتياطية فارغ أو يحتوي على بيانات خطط تالفة.");
    }

    const db = await openDB();

    // 1. Restore Plans
    const txPlans = db.transaction(STORE_PLANS, "readwrite");
    const storePlans = txPlans.objectStore(STORE_PLANS);
    
    await new Promise<void>((resolve, reject) => {
      const clearReq = storePlans.clear();
      clearReq.onsuccess = () => resolve();
      clearReq.onerror = () => reject(clearReq.error);
    });

    for (const plan of data.plans) {
      await new Promise<void>((resolve, reject) => {
        const pCopy = { ...plan };
        const reqPlan = storePlans.put(pCopy);
        reqPlan.onsuccess = () => resolve();
        reqPlan.onerror = () => reject(reqPlan.error);
      });
    }

    // 2. Restore Prefs
    if (data.prefs && typeof data.prefs === "object") {
      const txPrefs = db.transaction(STORE_PREFS, "readwrite");
      const storePrefs = txPrefs.objectStore(STORE_PREFS);

      for (const [key, value] of Object.entries(data.prefs)) {
        if (value !== undefined && value !== null) {
          await new Promise<void>((resolve, reject) => {
            const reqPref = storePrefs.put({ key, value });
            reqPref.onsuccess = () => resolve();
            reqPref.onerror = () => reject(reqPref.error);
          });
        }
      }
    }
  }
};
