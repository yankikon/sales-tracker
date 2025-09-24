import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../components/Card";
import { KpiCard } from "../components/KpiCard";
import { startOfMonthISO, todayISO, fmtNum, INR } from "../lib/utils";
import { CircleDollarSign, Receipt, Users, Target, PiggyBank } from "lucide-react";
import { useStore } from "../context/Store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

export function Dashboard(): JSX.Element {
  const { state } = useStore();
  const [from, setFrom] = useState<string>(startOfMonthISO());
  const [to, setTo] = useState<string>(todayISO());

  const filteredSales = useMemo(() => state.sales.filter((s) => s.date >= from && s.date <= to), [state.sales, from, to]);

  const totals = useMemo(() => {
    const revenue = filteredSales.reduce((acc, s) => acc + s.qty * s.unitPrice, 0);
    const items = filteredSales.reduce((acc, s) => acc + s.qty, 0);
    const bills = new Set(filteredSales.map((s) => s.billNo)).size;
    const best = (() => {
      const map = filteredSales.reduce<Record<string, number>>((m, s) => ((m[s.execId] = (m[s.execId] || 0) + s.qty * s.unitPrice), m), {});
      let bestExecId: string | null = null; let bestVal = -Infinity;
      Object.entries(map).forEach(([id, v]) => { if (v > bestVal) { bestVal = v; bestExecId = id; } });
      const ex = state.executives.find((e) => e.id === bestExecId);
      return ex ? `${ex.name} (${INR(bestVal)})` : "—";
    })();
    const incentives = filteredSales.reduce((sum, s) => {
      const ex = state.executives.find(e => e.id === s.execId);
      const rate = Number(ex?.incentivePct || 0) / 100;
      return sum + (s.qty * s.unitPrice * rate);
    }, 0);
    const potentialProfit = state.inventory.reduce((sum, i) => sum + Math.max(0, (i.sellingPrice - i.costPrice) * i.stock), 0);
    return { revenue, items, bills, best, incentives, potentialProfit };
  }, [filteredSales, state.executives, state.inventory]);

  const salesByExecData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSales.forEach((s) => {
      const name = state.executives.find((e) => e.id === s.execId)?.name || s.execId;
      map[name] = (map[name] || 0) + s.qty * s.unitPrice;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredSales, state.executives]);

  const salesByDateData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSales.forEach((s) => { map[s.date] = (map[s.date] || 0) + s.qty * s.unitPrice; });
    return Object.entries(map).sort(([a],[b]) => (a > b ? 1 : -1)).map(([date, value]) => ({ date, value }));
  }, [filteredSales]);

  const salesByItemData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSales.forEach((s) => { map[s.item] = (map[s.item] || 0) + s.qty * s.unitPrice; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredSales]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Filters" />
        <CardBody>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400">From</label>
              <input 
                type="date" 
                value={from} 
                onChange={(e) => setFrom(e.target.value)} 
                className="border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900" 
                style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400">To</label>
              <input 
                type="date" 
                value={to} 
                onChange={(e) => setTo(e.target.value)} 
                className="border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900" 
                style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid md:grid-cols-5 gap-4">
        <KpiCard title="Revenue" icon={CircleDollarSign} value={INR(totals.revenue)} note={`${fmtNum(totals.bills)} bills`} />
        <KpiCard title="Items Sold" icon={Receipt} value={fmtNum(totals.items)} note="All products" />
        <KpiCard title="Best Executive" icon={Users} value={totals.best} note="Top performer (range)" />
        <TargetCard from={from} to={to} />
        <KpiCard title="Incentives (range)" icon={CircleDollarSign} value={INR(totals.incentives)} note="At configured rates" />
        <KpiCard title="Potential Profit" icon={PiggyBank} value={INR(totals.potentialProfit)} note="If all stock sold" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Sales by Executive" />
          <CardBody className="h-72">
            {salesByExecData.length === 0 ? (
              <div className="text-center py-10 opacity-60">No sales in range</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByExecData as any}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => INR(v)} />
                  <Bar dataKey="value" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sales Trend" />
          <CardBody className="h-72">
            {salesByDateData.length === 0 ? (
              <div className="text-center py-10 opacity-60">No sales in range</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesByDateData as any}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => INR(v)} />
                  <Line type="monotone" dataKey="value" stroke="#2196F3" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Product Contribution" />
          <CardBody className="h-80">
            {salesByItemData.length === 0 ? (
              <div className="text-center py-10 opacity-60">No sales in range</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={salesByItemData as any} dataKey="value" nameKey="name" labelLine={false} label={false}>
                    {salesByItemData.map((_, i) => (
                      <Cell key={i} fill={["#4CAF50","#2196F3","#FFB300","#FF7043","#26C6DA","#7E57C2","#9C27B0","#795548"][i % 8]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => INR(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function TargetCard({ from, to }: { from: string; to: string }) {
  const { state } = useStore();
  const thisMonth = useMemo(() => {
    const monthStart = startOfMonthISO(new Date(from));
    const monthEnd = to;
    const totals = Object.values(
      state.sales.filter((s) => s.date >= monthStart && s.date <= monthEnd)
        .reduce<Record<string, number>>((m, s) => ((m[s.execId] = (m[s.execId] || 0) + s.qty * s.unitPrice), m), {})
    ).reduce((a, b) => a + b, 0);
    const target = state.executives.reduce((acc, e) => acc + (e.targetMonthly || 0), 0);
    const pct = target ? Math.round((totals / target) * 100) : 0;
    return { totals, target, pct };
  }, [state.sales, state.executives, from, to]);
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-700 dark:border-slate-600">
            <Target className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-600 dark:text-slate-400">Team Target (month)</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{INR(thisMonth.totals)} / {INR(thisMonth.target)}</p>
            <div className="h-2 rounded-full overflow-hidden mt-2 bg-slate-200 dark:bg-slate-700">
              <div className="h-2" style={{ width: `${Math.min(100, thisMonth.pct)}%`, backgroundColor: thisMonth.pct >= 70 ? '#10B981' : '#EF4444' }} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{thisMonth.pct}% achieved</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
