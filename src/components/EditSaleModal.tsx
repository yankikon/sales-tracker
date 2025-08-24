import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useStore } from "../context/Store";
import type { Sale } from "../lib/types";
export function EditSaleModal({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  const { state, setState } = useStore();
  const [form, setForm] = useState<Sale>({ ...sale });
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.billNo.trim() || !form.item.trim() || !form.sku.trim()) { alert("Missing required fields"); return; }
    setState(prev => ({ ...prev, sales: prev.sales.map(s => s.id === sale.id ? { ...s, ...form, qty: Number(form.qty||0), unitPrice: Number(form.unitPrice||0) } : s) }));
    onClose();
  }
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-600 shadow-xl">
        <div className="px-4 py-3 border-b dark:border-slate-600 flex items-center justify-between">
          <h3 className="font-semibold">Edit Sale</h3>
          <button onClick={onClose} className="px-3 py-1.5 rounded-xl border">Close</button>
        </div>
        <div className="p-4">
          <form onSubmit={submit} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs opacity-60">Bill No *</label>
              <input value={form.billNo} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, billNo: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">Date *</label>
              <input type="date" value={form.date} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, date: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">Executive *</label>
              <select value={form.execId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, execId: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2">
                {state.executives.map((e) => (<option key={e.id} value={e.id}>{e.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-xs opacity-60">Branch *</label>
              <select value={form.branchId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, branchId: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2">
                {state.branches.map((b) => (<option key={b.id} value={b.id}>{b.name} ({b.city})</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs opacity-60">Item *</label>
              <input value={form.item} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, item: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">SKU *</label>
              <input value={form.sku} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, sku: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">Quantity *</label>
              <input type="number" min={1} value={form.qty} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, qty: Number(e.target.value || 0) })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">Unit Price (₹) *</label>
              <input type="number" min={0} value={form.unitPrice} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, unitPrice: Number(e.target.value || 0) })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div className="md:col-span-3 flex items-center gap-3 pt-2">
              <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" type="submit">Save</button>
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
