import type { LucideIcon } from "lucide-react";
import React from "react";
import { Card, CardBody } from "./Card";
export function KpiCard({ title, value, icon: Icon, note }: { title: string; value: React.ReactNode; icon: LucideIcon; note?: string }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-700 dark:border-slate-600"><Icon className="w-5 h-5" /></div>
          <div>
            <p className="text-xs opacity-60">{title}</p>
            <p className="text-lg font-semibold">{value ?? "—"}</p>
            {note && <p className="text-xs opacity-60 mt-0.5">{note}</p>}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
