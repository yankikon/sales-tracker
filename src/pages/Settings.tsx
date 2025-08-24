import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Card, CardBody, CardHeader } from "../components/Card";
import { useStore } from "../context/Store";
export function SettingsPage(): JSX.Element {
  const { state, setState } = useStore();
  const [biz, setBiz] = useState({ name: state.business.name, address: state.business.address });
  const [branch, setBranch] = useState({ name: "", city: "" });
  function saveBiz(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(prev => ({ ...prev, business: { ...prev.business, ...biz } }));
  }
  function addBranch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!branch.name.trim()) return alert("Branch name required");
    if (!branch.city.trim()) return alert("Branch city required");
    setState(prev => ({ ...prev, branches: [...prev.branches, { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), name: branch.name.trim(), city: branch.city.trim() }] }));
    setBranch({ name: "", city: "" });
  }
  function deleteBranch(id: string) {
    const used = state.executives.some(e => e.branchId === id) || state.sales.some(s => s.branchId === id);
    if (used) { alert("Cannot delete – branch is used in executives / sales."); return; }
    if (!confirm("Delete this branch?")) return;
    setState(prev => ({ ...prev, branches: prev.branches.filter(b => b.id !== id) }));
  }
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="Business Profile" />
        <CardBody>
          <form onSubmit={saveBiz} className="space-y-3">
            <div>
              <label className="text-xs opacity-60">Business Name</label>
              <input value={biz.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setBiz({ ...biz, name: e.target.value })} placeholder="Your company name" className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">Address</label>
              <textarea value={biz.address} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBiz({ ...biz, address: e.target.value })} rows={4} placeholder="Street, Area, City, State, PIN" className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" type="submit">Save Profile</button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Branches / Locations" />
        <CardBody>
          <form onSubmit={addBranch} className="grid md:grid-cols-3 gap-3 mb-4">
            <div className="md:col-span-2">
              <label className="text-xs opacity-60">Branch Name</label>
              <input value={branch.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setBranch({ ...branch, name: e.target.value })} placeholder="e.g., Guwahati Branch" className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-xs opacity-60">City</label>
              <input value={branch.city} onChange={(e: ChangeEvent<HTMLInputElement>) => setBranch({ ...branch, city: e.target.value })} placeholder="City" className="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div className="md:col-span-3">
              <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" type="submit">Add Branch</button>
            </div>
          </form>

          {state.branches.length === 0 ? (
            <div className="text-center py-10 opacity-60">No branches</div>
          ) : (
            <ul className="divide-y">
              {state.branches.map((b) => (
                <li key={b.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs opacity-60">{b.city}</div>
                  </div>
                  <button onClick={() => deleteBranch(b.id)} className="p-2 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700">Delete</button>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
