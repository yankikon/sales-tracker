import type { Executive, Sale } from "./types";
export const INR = (n: number | string): string => (typeof n === "number" ? n : Number(n || 0)).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const fmtNum = (n?: number): string => (n ?? 0).toLocaleString();
export const todayISO = (): string => new Date().toISOString().slice(0, 10);
export const startOfMonthISO = (d: Date = new Date()): string => new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
export const uid = (prefix = "id"): string => `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
export function classNames(...xs: Array<string | false | null | undefined>): string { return xs.filter(Boolean).join(" "); }
export function calcIncentivesTotal(sales: Sale[], executives: Executive[]): number {
  const rateByExec: Record<string, number> = Object.fromEntries((executives || []).map(e => [e.id, Number(e.incentivePct || 0)]));
  return (sales || []).reduce((sum, s) => sum + (s.qty * s.unitPrice) * ((rateByExec[s.execId] || 0) / 100), 0);
}
export function genExecId(execs: Executive[]): string {
  const nums = execs.map((e) => Number((e.id || "").replace(/\D/g, ""))).filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `E${String(next).padStart(3, "0")}`;
}
