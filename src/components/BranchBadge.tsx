import React from "react";
import { MapPin } from "lucide-react";
import { useStore } from "../context/Store";
export function BranchBadge({ branchId }: { branchId: string }) {
  const { state } = useStore();
  const b = state.branches.find((x) => x.id === branchId);
  if (!b) return null;
  return (
    <span className="inline-flex items-center text-xs gap-1 px-2 py-0.5 rounded-full bg-slate-100/60 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600">
      <MapPin className="w-3 h-3" /> {b.name}
    </span>
  );
}
