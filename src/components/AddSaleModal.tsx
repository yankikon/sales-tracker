import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useStore } from "../context/Store";
import type { InventoryItem } from "../lib/types";
import { todayISO, uid } from "../lib/utils";
import type { Sale } from "../lib/types";
export function AddSaleModal({ onClose }: { onClose: () => void }) {
  const { state, setState } = useStore();
  const [form, setForm] = useState<Omit<Sale, "id">>({ billNo: "", date: todayISO(), execId: state.executives[0]?.id || "", branchId: state.branches[0]?.id || "", item: "", sku: "", qty: 1, unitPrice: 0 });
  const [notice, setNotice] = useState<string | null>(null);

  function onSelectItem(inv: InventoryItem | null) {
    if (!inv) return;
    setForm(prev => ({ ...prev, item: inv.name, sku: inv.sku, unitPrice: inv.sellingPrice }));
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.billNo.trim() || !form.item.trim() || !form.sku.trim() || !form.execId || !form.branchId) { alert("Missing required fields"); return; }
    const matched = state.inventory.find(i => i.sku === form.sku);
    if (matched) {
      if (form.qty > matched.stock) { setNotice("Out of stock"); return; }
      // deduct stock
      setState(prev => ({ ...prev, inventory: prev.inventory.map(i => i.id === matched.id ? { ...i, stock: i.stock - form.qty } : i) }));
    }
    setState(prev => ({ ...prev, sales: [ { id: uid("S"), ...form, qty: Number(form.qty||0), unitPrice: Number(form.unitPrice||0) }, ...prev.sales ] }));
    onClose();
  }
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-600 shadow-xl">
        <div className="px-4 py-3 border-b dark:border-slate-600 flex items-center justify-between">
          <h3 className="font-semibold">Add Sale</h3>
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
                {state.executives.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs opacity-60">Branch *</label>
              <select value={form.branchId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, branchId: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2">
                {state.branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.city})</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs opacity-60">Item *</label>
              <select value={form.sku} onChange={(e: ChangeEvent<HTMLSelectElement>) => { const inv = state.inventory.find(i => i.sku === e.target.value) || null; setForm({ ...form, sku: e.target.value, item: inv?.name || "" }); onSelectItem(inv); }} className="w-full border border-slate-300 rounded-xl px-3 py-2">
                <option value="">Select item</option>
                {state.inventory.map(i => <option key={i.id} value={i.sku}>{i.name} ({i.sku})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs opacity-60">Quantity *</label>
              <input type="number" min={1} value={form.qty} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, qty: Number(e.target.value || 0) })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              {notice && <p className="text-xs text-red-600 mt-1">{notice}</p>}
            </div>
            <div>
              <label className="text-xs opacity-60">Unit Price (₹) *</label>
              <input type="number" min={0} value={form.unitPrice} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, unitPrice: Number(e.target.value || 0) })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
              <p className="text-xs opacity-60 mt-1">Auto-fills from inventory</p>
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
