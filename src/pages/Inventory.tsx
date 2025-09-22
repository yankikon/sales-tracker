import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../components/Card";
import { useStore } from "../context/Store";
import type { InventoryItem } from "../lib/types";
import { INR, fmtNum, uid } from "../lib/utils";

export function InventoryPage(): JSX.Element {
  const { state, setState } = useStore();
  const [editing, setEditing] = useState<null | InventoryItem>(null);
  const [form, setForm] = useState<Omit<InventoryItem, "id">>({ name: "", sku: "", costPrice: 0, sellingPrice: 0, stock: 0 });

  function reset() { setForm({ name: "", sku: "", costPrice: 0, sellingPrice: 0, stock: 0 }); setEditing(null); }

  function save() {
    if (!form.name.trim() || !form.sku.trim()) { alert("Missing fields"); return; }
    if (editing) {
      setState(prev => ({ ...prev, inventory: prev.inventory.map(i => i.id === editing.id ? { ...editing, ...form } : i) }));
    } else {
      setState(prev => ({ ...prev, inventory: [{ id: uid("I"), ...form }, ...prev.inventory] }));
    }
    reset();
  }

  function edit(item: InventoryItem) { setEditing(item); setForm({ name: item.name, sku: item.sku, costPrice: item.costPrice, sellingPrice: item.sellingPrice, stock: item.stock }); }
  function remove(id: string) { if (!confirm("Delete item?")) return; setState(prev => ({ ...prev, inventory: prev.inventory.filter(i => i.id !== id) })); }

  const profitInsights = useMemo(() => state.inventory.map(i => ({
    id: i.id,
    name: i.name,
    sku: i.sku,
    marginPerUnit: Math.max(0, i.sellingPrice - i.costPrice),
    potentialProfit: Math.max(0, (i.sellingPrice - i.costPrice) * i.stock)
  })), [state.inventory]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title={editing ? "Edit Item" : "Add Item"} />
        <CardBody>
          <div className="grid md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs opacity-60">Item name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">SKU *</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">Cost Price</label>
              <input type="number" min={0} value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value || 0) })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">Selling Price</label>
              <input type="number" min={0} value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value || 0) })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">Stock</label>
              <input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value || 0) })} className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button onClick={save} className="px-4 py-2 rounded-xl bg-emerald-600 text-white">{editing ? "Update" : "Add"}</button>
            {editing && <button onClick={reset} className="px-4 py-2 rounded-xl border">Cancel</button>}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={`Inventory (${state.inventory.length})`} />
        <CardBody>
          {state.inventory.length === 0 ? (
            <div className="text-center py-10 opacity-60">No items</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left opacity-60 border-b">
                    <th className="py-2 pr-3">Item</th>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3 text-right">Cost</th>
                    <th className="py-2 pr-3 text-right">Selling</th>
                    <th className="py-2 pr-3 text-right">Stock</th>
                    <th className="py-2 pr-3 text-right">Margin/Unit</th>
                    <th className="py-2 pr-3 text-right">Potential Profit</th>
                    <th className="py-2 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profitInsights.map(r => (
                    <tr key={r.id} className="border-b last:border-b-0">
                      <td className="py-2 pr-3">{r.name}</td>
                      <td className="py-2 pr-3">{r.sku}</td>
                      <td className="py-2 pr-3 text-right">{INR(state.inventory.find(i=>i.id===r.id)!.costPrice)}</td>
                      <td className="py-2 pr-3 text-right">{INR(state.inventory.find(i=>i.id===r.id)!.sellingPrice)}</td>
                      <td className="py-2 pr-3 text-right">{fmtNum(state.inventory.find(i=>i.id===r.id)!.stock)}</td>
                      <td className="py-2 pr-3 text-right">{INR(r.marginPerUnit)}</td>
                      <td className="py-2 pr-3 text-right font-medium">{INR(r.potentialProfit)}</td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => edit(state.inventory.find(i=>i.id===r.id)!)} className="p-2 rounded-lg border">Edit</button>
                          <button onClick={() => remove(r.id)} className="p-2 rounded-lg border">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}


