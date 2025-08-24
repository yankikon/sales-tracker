import React from "react";
import { ThemeCtx } from "../context/Store";
import { classNames } from "../lib/utils";
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  const theme = React.useContext(ThemeCtx);
  const base = theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900";
  return <div className={classNames(base, "border rounded-2xl shadow-sm", className)}>{children}</div>;
}
export function CardHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  const theme = React.useContext(ThemeCtx);
  const border = theme === "dark" ? "border-slate-700" : "border-slate-100";
  return (
    <div className={classNames("px-4 pt-4 pb-2 flex items-center justify-between border-b", border)}>
      <h3 className="font-semibold">{title}</h3>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}
export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={classNames("p-4", className)}>{children}</div>;
}
