import React, { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Card, CardBody, CardHeader } from "../components/Card";
import { useStore } from "../context/Store";
import { AddSaleModal } from "../components/AddSaleModal";
import { EditSaleModal } from "../components/EditSaleModal";
import { Download, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { INR, fmtNum } from "../lib/utils";

export function Sales(): JSX.Element {
  const { state, setState } = useStore();
  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("");
  const [category, setCategory] = useState("");
  const [execId, setExecId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingSale, setEditingSale] = useState<null | (typeof state.sales[number])>(null);

  const rows = useMemo(() => state.sales
    .filter((s) => {
      const okBranch = !branch || s.branchId === branch;
      const okExec = !execId || s.execId === execId;
      const okDate = (!from || s.date >= from) && (!to || s.date <= to);
      const inv = (Array.isArray(state.inventory)?state.inventory:[]).find(i => i.sku === s.sku);
      const okCat = !category || (inv?.category === category);
      return okBranch && okExec && okDate && okCat;
    })
    .filter((s) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return s.billNo.toLowerCase().includes(q) || s.item.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q);
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1)), [state.sales, branch, execId, from, to, query]);

  const totalAmount = rows.reduce((acc, r) => acc + r.qty * r.unitPrice, 0);
  const totalQty = rows.reduce((acc, r) => acc + r.qty, 0);

  function exportCSV() {
    const headers = ["Exec ID", "Exec Name", "Bill No", "Date", "Item", "SKU", "Quantity", "Unit Price", "Amount", "Branch"];
    const lines = rows.map((r) => {
      const name = state.executives.find((e) => e.id === r.execId)?.name || r.execId;
      const branchName = state.branches.find((b) => b.id === r.branchId)?.name || r.branchId;
      const amount = r.qty * r.unitPrice;
      return [r.execId, name, r.billNo, r.date, r.item, r.sku, r.qty, r.unitPrice, amount, branchName].join(",");
    });
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sales_export_${from}_to_${to}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  function deleteSale(id: string) {
    if (!confirm("Delete this sale?")) return;
    setState(prev => ({ ...prev, sales: prev.sales.filter(s => s.id !== id) }));
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Filters" actions={
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"><Plus className="w-4 h-4" />Add Sale</button>
            <button onClick={exportCSV} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border"><Download className="w-4 h-4" />Export CSV</button>
          </div>
        } />
        <CardBody>
          <div className="space-y-4">
            <div className="grid lg:grid-cols-4 gap-3">
              <div className="lg:col-span-2">
                <label className="text-xs opacity-60">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                  <input value={query} onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} placeholder="Bill / Item / SKU" className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2" />
                </div>
              </div>
              <div>
                <label className="text-xs opacity-60">Branch</label>
                <select value={branch} onChange={(e: ChangeEvent<HTMLSelectElement>) => setBranch(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2">
                  <option value="">All</option>
                  {state.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs opacity-60">Executive</label>
                <select value={execId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setExecId(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2">
                  <option value="">All</option>
                  {state.executives.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-3">
              <div>
                <label className="text-xs opacity-60">Category</label>
                <select value={category} onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2">
                  <option value="">All</option>
                  {(state.categories || []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs opacity-60">From</label>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="text-xs opacity-60">To</label>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={`Sales (${rows.length})`} />
        <CardBody>
          {rows.length === 0 ? (
            <div className="text-center py-10 opacity-60">No matching sales</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left opacity-60 border-b">
                    <th className="py-2 pr-3">Exec</th>
                    <th className="py-2 pr-3">Bill No.</th>
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Item</th>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3">Category</th>
                    <th className="py-2 pr-3 text-right">Qty</th>
                    <th className="py-2 pr-3 text-right">Unit</th>
                    <th className="py-2 pr-3 text-right">Amount</th>
                    <th className="py-2 pr-3">Branch</th>
                    <th className="py-2 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const name = state.executives.find((e) => e.id === r.execId)?.name || r.execId;
                    const branchName = state.branches.find((b) => b.id === r.branchId)?.name || r.branchId;
                    const amount = r.qty * r.unitPrice;
                    const cat = (Array.isArray(state.inventory)?state.inventory:[]).find(i => i.sku === r.sku)?.category || "—";
                    return (
                      <tr key={r.id} className="border-b last:border-b-0">
                        <td className="py-2 pr-3">{name}</td>
                        <td className="py-2 pr-3 font-medium">{r.billNo}</td>
                        <td className="py-2 pr-3">{r.date}</td>
                        <td className="py-2 pr-3">{r.item}</td>
                        <td className="py-2 pr-3">{r.sku}</td>
                        <td className="py-2 pr-3">{cat}</td>
                        <td className="py-2 pr-3 text-right">{fmtNum(r.qty)}</td>
                        <td className="py-2 pr-3 text-right">{INR(r.unitPrice)}</td>
                        <td className="py-2 pr-3 text-right font-medium">{INR(amount)}</td>
                        <td className="py-2 pr-3">{branchName}</td>
                        <td className="py-2 pr-3">
                          <div className="flex items-center gap-2">
                            <button title="Edit" onClick={() => setEditingSale(r)} className="p-2 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700"><Pencil className="w-4 h-4" /></button>
                            <button title="Delete" onClick={() => deleteSale(r.id)} className="p-2 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 border-t pt-3 flex items-center justify-end gap-6 text-sm">
                <div><span className="opacity-60">Total Qty:</span> <span className="font-medium">{fmtNum(totalQty)}</span></div>
                <div><span className="opacity-60">Total Amount:</span> <span className="font-semibold">{INR(totalAmount)}</span></div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {showAdd && <AddSaleModal onClose={() => setShowAdd(false)} />}
      {editingSale && <EditSaleModal sale={editingSale} onClose={() => setEditingSale(null)} />}
    </div>
  );
}
