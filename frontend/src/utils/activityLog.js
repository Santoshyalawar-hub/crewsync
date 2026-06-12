/**
 * activityLog.js  –  CrewSync
 * Records admin activity in localStorage so the ControlRoom can
 * display real recent-activity without a backend dependency.
 *
 * Usage (from any page):
 *   import { logActivity } from "@/utils/activityLog";
 *   logActivity({ action: "Added employee", target: "Ravi Kumar", tag: "Person" });
 *
 * CareDesked tags (drives colour coding on the dashboard):
 *   "Person" | "Operator" | "TimeAway" | "Timesheet" | "Delete" | "General"
 */

const STORAGE_KEY = "crewsync_activity_log";
const MAX_ENTRIES = 50;

/** Push a new activity entry and broadcast it. */
export function logActivity({ action, target = "", tag = "General" }) {
  try {
    const entry = {
      id: Date.now(),
      action,
      target,
      tag,
      timestamp: new Date().toISOString(),
    };
    const next = [entry, ...getActivities()].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // broadcast so ControlRoom updates live without refresh
    window.dispatchEvent(new CustomEvent("crewsync_activity", { detail: entry }));
  } catch { /* ignore storage errors */ }
}

/** Return all stored activities (newest first). */
export function getActivities() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Remove all entries (call on logout). */
export function clearActivities() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}