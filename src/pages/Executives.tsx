import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Card, CardBody, CardHeader } from "../components/Card";
import { useStore } from "../context/Store";
import { BranchBadge } from "../components/BranchBadge";
import { INR, startOfMonthISO, todayISO, genExecId, classNames, fmtNum } from "../lib/utils";
import { Mail, Phone, Plus, Pencil, Trash2, X, Receipt } from "lucide-react";
type ExecForm = { id: string; name: string; phone: string; email: string; territory: string; branchId: string; joinedOn: string; targetMonthly: number; incentivePct: number | "" };
export function Executives(): JSX.Element {
  const { state, setState } = useStore();
  const [form, setForm] = useState<ExecForm>({ id: "", name: "", phone: "", email: "", territory: "", branchId: state.branches[0]?.id || "", joinedOn: todayISO(), targetMonthly: 0, incentivePct: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedExecSales, setSelectedExecSales] = useState<typeof state.sales[0] | null>(null);

  function reset() {
    setForm({ id: "", name: "", phone: "", email: "", territory: "", branchId: state.branches[0]?.id || "", joinedOn: todayISO(), targetMonthly: 0, incentivePct: "" });
    setEditingId(null);
    setShowForm(false);
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name is required");
    if (!form.branchId) return alert("Branch is required");
    const normalized = { ...form, incentivePct: form.incentivePct === "" ? 0 : Number(form.incentivePct) } as Omit<typeof form, "incentivePct"> & { incentivePct: number };
    if (editingId) {
      setState(prev => ({ ...prev, executives: prev.executives.map(x => x.id === editingId ? { ...x, ...normalized, id: editingId } : x) }));
    } else {
      const newId = form.id?.trim() || genExecId(state.executives);
      setState(prev => ({ ...prev, executives: [...prev.executives, { ...normalized, id: newId }] }));
    }
    reset();
  }
  function editExec(id: string) {
    const ex = state.executives.find(x => x.id === id); if (!ex) return;
    setForm({ ...ex, incentivePct: (ex.incentivePct ?? 0).toString() as unknown as number | "" } as ExecForm);
    setEditingId(id); setShowForm(true);
  }
  function deleteExec(id: string) {
    const hasSales = state.sales.some(s => s.execId === id);
    if (hasSales) { alert("Cannot delete – this executive has sales records."); return; }
    if (!confirm("Delete this executive?")) return;
    setState(prev => ({ ...prev, executives: prev.executives.filter(x => x.id !== id) }));
  }

  function showExecSales(execId: string) {
    const exec = state.executives.find(e => e.id === execId);
    if (!exec) return;
    setSelectedExecSales(exec);
  }

  const monthStart = startOfMonthISO();
  const monthEnd = todayISO();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Executives" actions={<button onClick={() => setShowForm(true)} className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"><Plus className="w-4 h-4 inline mr-1"/> Add Executive</button>} />
        {(showForm || editingId) && (
          <CardBody>
            <form onSubmit={submit} className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs opacity-60">Executive ID (optional)</label>
                <input value={form.id} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, id: e.target.value })} placeholder="e.g., E003" className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs opacity-60">Full Name *</label>
                <input required value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} placeholder="Enter name" className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="text-xs opacity-60">Phone</label>
                <input value={form.phone} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: e.target.value })} placeholder="+91…" className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="text-xs opacity-60">Email</label>
                <input type="email" value={form.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="text-xs opacity-60">Territory</label>
                <input value={form.territory} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, territory: e.target.value })} placeholder="e.g., North Zone" className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="text-xs opacity-60">Branch Location *</label>
                <select value={form.branchId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, branchId: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2">
                  {state.branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.city})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs opacity-60">Date Joined</label>
                <input type="date" value={form.joinedOn} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, joinedOn: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="text-xs opacity-60">Monthly Target (₹)</label>
                <input type="number" value={form.targetMonthly} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, targetMonthly: Number(e.target.value || 0) })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="text-xs opacity-60">Incentive Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={form.incentivePct}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, incentivePct: e.target.value as unknown as number | "" })}
                  onBlur={() => setForm(prev => ({ ...prev, incentivePct: prev.incentivePct === "" ? "" : Number(prev.incentivePct) }))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>
              <div className="md:col-span-3 flex items-center gap-3 pt-2">
                <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" type="submit">{editingId ? "Save Changes" : "Add Executive"}</button>
                <button type="button" onClick={reset} className="px-4 py-2 rounded-xl border">Cancel</button>
              </div>
            </form>
          </CardBody>
        )}
      </Card>

      <Card>
        <CardHeader title="All Executives" />
        <CardBody>
          {state.executives.length === 0 ? (
            <div className="text-center py-10 opacity-60">No executives added yet</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left opacity-60 border-b">
                    <th className="py-2 pr-3">Exec ID</th>
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Contact</th>
                    <th className="py-2 pr-3">Branch</th>
                    <th className="py-2 pr-3">Joined</th>
                    <th className="py-2 pr-3">Target (₹)</th>
                    <th className="py-2 pr-3">Achieved (month)</th>
                    <th className="py-2 pr-3">Incentive (month)</th>
                    <th className="py-2 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.executives.map((e) => {
                    const sales = state.sales.filter((s) => s.execId === e.id && s.date >= monthStart && s.date <= monthEnd);
                    const total = sales.reduce((acc, s) => acc + s.qty * s.unitPrice, 0);
                    const pct = e.targetMonthly ? Math.round((total / e.targetMonthly) * 100) : 0;
                    const incentiveAmt = Math.round(total * Number(e.incentivePct || 0) / 100);
                    return (
                      <tr key={e.id} className="border-b last:border-b-0">
                        <td className="py-2 pr-3 font-medium">{e.id}</td>
                        <td className="py-2 pr-3">
                          <div className="font-medium cursor-pointer hover:text-emerald-600" onClick={() => showExecSales(e.id)}>{e.name}</div>
                          <div className="text-xs opacity-60">{e.territory || "—"}</div>
                        </td>
                        <td className="py-2 pr-3 text-xs">
                          <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {e.phone || "—"}</div>
                          <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {e.email || "—"}</div>
                        </td>
                        <td className="py-2 pr-3"><BranchBadge branchId={e.branchId} /></td>
                        <td className="py-2 pr-3 text-xs">{e.joinedOn}</td>
                        <td className="py-2 pr-3">{INR(e.targetMonthly)}</td>
                        <td className="py-2 pr-3">
                          <div className="text-sm font-medium">{INR(total)}</div>
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                            <div className={"h-1.5 " + (pct >= 70 ? "bg-emerald-500" : "bg-rose-500")} style={{ width: `${Math.min(100, pct)}%` }} />
                          </div>
                          <div className="text-xs opacity-60 mt-1">{pct}%</div>
                        </td>
                        <td className="py-2 pr-3">
                          <div className="text-sm font-medium">{INR(incentiveAmt)}</div>
                          <div className="text-xs opacity-60">@ {Number(e.incentivePct||0)}%</div>
                        </td>
                        <td className="py-2 pr-3">
                          <div className="flex items-center gap-2">
                            <button title="Edit" onClick={() => editExec(e.id)} className="p-2 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700"><Pencil className="w-4 h-4" /></button>
                            <button title="Delete" onClick={() => deleteExec(e.id)} className="p-2 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {selectedExecSales && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl border border-slate-200 dark:border-slate-600 shadow-xl">
            <div className="px-4 py-3 border-b dark:border-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5" />
                <h3 className="font-semibold">{selectedExecSales.name} - Sales Records</h3>
              </div>
              <button onClick={() => setSelectedExecSales(null)} className="px-3 py-1.5 rounded-xl border">Close</button>
            </div>
            <div className="p-4">
              {(() => {
                const execSales = state.sales.filter(s => s.execId === selectedExecSales.id);
                const totalAmount = execSales.reduce((acc, s) => acc + s.qty * s.unitPrice, 0);
                const totalQty = execSales.reduce((acc, s) => acc + s.qty, 0);
                
                return (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div>
                        <div className="text-xs opacity-60">Total Sales</div>
                        <div className="text-lg font-semibold">{INR(totalAmount)}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-60">Total Items</div>
                        <div className="text-lg font-semibold">{fmtNum(totalQty)}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-60">Total Bills</div>
                        <div className="text-lg font-semibold">{execSales.length}</div>
                      </div>
                    </div>
                    
                    {execSales.length === 0 ? (
                      <div className="text-center py-10 opacity-60">No sales records found</div>
                    ) : (
                      <div className="overflow-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left opacity-60 border-b">
                              <th className="py-2 pr-3">Bill No</th>
                              <th className="py-2 pr-3">Date</th>
                              <th className="py-2 pr-3">Item</th>
                              <th className="py-2 pr-3">SKU</th>
                              <th className="py-2 pr-3">Category</th>
                              <th className="py-2 pr-3 text-right">Qty</th>
                              <th className="py-2 pr-3 text-right">Unit Price</th>
                              <th className="py-2 pr-3 text-right">Amount</th>
                              <th className="py-2 pr-3">Branch</th>
                            </tr>
                          </thead>
                          <tbody>
                            {execSales.map((sale) => {
                              const branchName = state.branches.find(b => b.id === sale.branchId)?.name || sale.branchId;
                              const itemCategory = state.inventory.find(item => item.name === sale.item && item.sku === sale.sku)?.category || "—";
                              const amount = sale.qty * sale.unitPrice;
                              return (
                                <tr key={sale.id} className="border-b last:border-b-0">
                                  <td className="py-2 pr-3 font-medium">{sale.billNo}</td>
                                  <td className="py-2 pr-3">{sale.date}</td>
                                  <td className="py-2 pr-3">{sale.item}</td>
                                  <td className="py-2 pr-3">{sale.sku}</td>
                                  <td className="py-2 pr-3">{itemCategory}</td>
                                  <td className="py-2 pr-3 text-right">{fmtNum(sale.qty)}</td>
                                  <td className="py-2 pr-3 text-right">{INR(sale.unitPrice)}</td>
                                  <td className="py-2 pr-3 text-right font-medium">{INR(amount)}</td>
                                  <td className="py-2 pr-3">{branchName}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
