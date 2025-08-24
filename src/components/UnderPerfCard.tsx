import React from "react";
import { Card, CardBody, CardHeader } from "./Card";
import { startOfMonthISO, todayISO } from "../lib/utils";
import { useStore } from "../context/Store";
export function UnderPerfCard({ className }: { className?: string }) {
  const { state } = useStore();
  const monthStart = startOfMonthISO();
  const monthEnd = todayISO();
  const rows = state.executives.map((e) => {
    const sales = state.sales.filter((s) => s.execId === e.id && s.date >= monthStart && s.date <= monthEnd);
    const total = sales.reduce((acc, s) => acc + s.qty * s.unitPrice, 0);
    const pct = e.targetMonthly ? Math.round((total / e.targetMonthly) * 100) : 0;
    return { id: e.id, name: e.name, pct, target: e.targetMonthly };
  }).filter(x => x.target > 0 && x.pct < 70);
  if (rows.length === 0) return null;
  return (
    <Card className={className}>
      <CardHeader title="Needs Attention" />
      <CardBody>
        <ul className="space-y-2">
          {rows.map(r => (
            <li key={r.id} className="text-sm flex items-center justify-between">
              <span>{r.name}</span>
              <span className="text-rose-500 font-medium">{r.pct}%</span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
