import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../components/Card";
import { useStore } from "../context/Store";
import type { InventoryItem } from "../lib/types";
import { INR, fmtNum, uid } from "../lib/utils";

export function InventoryPage(): JSX.Element {
  const { state, setState } = useStore();
  const inventory = Array.isArray(state.inventory) ? state.inventory : [];
  const [editing, setEditing] = useState<null | InventoryItem>(null);
  const [form, setForm] = useState<{ name: string; sku: string; costPrice: number | ""; sellingPrice: number | ""; stock: number | "" }>({ name: "", sku: "", costPrice: "", sellingPrice: "", stock: "" });

  function reset() { setForm({ name: "", sku: "", costPrice: "", sellingPrice: "", stock: "" }); setEditing(null); }

  function save() {
    if (!form.name.trim() || !form.sku.trim()) { alert("Missing fields"); return; }
    const normalized = {
      name: form.name,
      sku: form.sku,
      costPrice: form.costPrice === "" ? 0 : Number(form.costPrice),
      sellingPrice: form.sellingPrice === "" ? 0 : Number(form.sellingPrice),
      stock: form.stock === "" ? 0 : Number(form.stock),
    };
    if (editing) {
      setState(prev => ({ ...prev, inventory: (Array.isArray(prev.inventory)?prev.inventory:[]).map(i => i.id === editing.id ? { ...editing, ...normalized } : i) }));
    } else {
      setState(prev => ({ ...prev, inventory: [{ id: uid("I"), ...normalized }, ...(Array.isArray(prev.inventory)?prev.inventory:[])] }));
    }
    reset();
  }

  function edit(item: InventoryItem) { setEditing(item); setForm({ name: item.name, sku: item.sku, costPrice: String(item.costPrice) as unknown as number|"", sellingPrice: String(item.sellingPrice) as unknown as number|"", stock: String(item.stock) as unknown as number|"" }); }
  function remove(id: string) { if (!confirm("Delete item?")) return; setState(prev => ({ ...prev, inventory: prev.inventory.filter(i => i.id !== id) })); }

  const profitInsights = useMemo(() => inventory.map(i => ({
    id: i.id,
    name: i.name,
    sku: i.sku,
    marginPerUnit: Math.max(0, i.sellingPrice - i.costPrice),
    potentialProfit: Math.max(0, (i.sellingPrice - i.costPrice) * i.stock)
  })), [inventory]);
  const totalPotential = useMemo(() => profitInsights.reduce((sum, r) => sum + r.potentialProfit, 0), [profitInsights]);

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
              <input
                type="number"
                min={0}
                value={form.costPrice}
                onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                onBlur={() => setForm(prev => ({ ...prev, costPrice: prev.costPrice === "" ? "" : Number(prev.costPrice) }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs opacity-60">Selling Price</label>
              <input
                type="number"
                min={0}
                value={form.sellingPrice}
                onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                onBlur={() => setForm(prev => ({ ...prev, sellingPrice: prev.sellingPrice === "" ? "" : Number(prev.sellingPrice) }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs opacity-60">Stock</label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                onBlur={() => setForm(prev => ({ ...prev, stock: prev.stock === "" ? "" : Number(prev.stock) }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button onClick={save} className="px-4 py-2 rounded-xl bg-emerald-600 text-white">{editing ? "Update" : "Add"}</button>
            {editing && <button onClick={reset} className="px-4 py-2 rounded-xl border">Cancel</button>}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={`Inventory (${inventory.length})`} />
        <CardBody>
          <div className="flex items-center justify-end text-sm mb-3">
            <span className="opacity-60 mr-2">Total Potential Profit:</span>
            <span className="font-semibold">{INR(totalPotential)}</span>
          </div>
          {inventory.length === 0 ? (
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
                      <td className="py-2 pr-3 text-right">{INR((inventory.find(i=>i.id===r.id)?.costPrice)||0)}</td>
                      <td className="py-2 pr-3 text-right">{INR((inventory.find(i=>i.id===r.id)?.sellingPrice)||0)}</td>
                      <td className="py-2 pr-3 text-right">{fmtNum((inventory.find(i=>i.id===r.id)?.stock)||0)}</td>
                      <td className="py-2 pr-3 text-right">{INR(r.marginPerUnit)}</td>
                      <td className="py-2 pr-3 text-right font-medium">{INR(r.potentialProfit)}</td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { const item = inventory.find(i=>i.id===r.id); if (item) edit(item); }} className="p-2 rounded-lg border">Edit</button>
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


