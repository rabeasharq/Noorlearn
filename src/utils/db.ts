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
  }
};
