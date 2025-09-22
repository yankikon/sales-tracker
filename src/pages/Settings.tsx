import React, { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Card, CardBody, CardHeader } from "../components/Card";
import { useStore } from "../context/Store";
import { Upload, X } from "lucide-react";
export function SettingsPage(): JSX.Element {
  const { state, setState } = useStore();
  const [biz, setBiz] = useState({ name: state.business.name, address: state.business.address });
  const [branch, setBranch] = useState({ name: "", city: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  function handleLogoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('File size must be less than 2MB');
      return;
    }

    // Create image to check dimensions
    const img = new Image();
    img.onload = () => {
      // Validate dimensions (max 200x200 for square logo)
      if (img.width > 200 || img.height > 200) {
        alert('Image dimensions must be 200x200 pixels or smaller');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setState(prev => ({ 
          ...prev, 
          business: { ...prev.business, logo: base64 } 
        }));
      };
      reader.readAsDataURL(file);
    };
    img.src = URL.createObjectURL(file);
  }

  function removeLogo() {
    setState(prev => ({ 
      ...prev, 
      business: { ...prev.business, logo: undefined } 
    }));
  }
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="Business Profile" />
        <CardBody>
          <form onSubmit={saveBiz} className="space-y-3">
            <div>
              <label className="text-xs opacity-60">Business Logo</label>
              <div className="flex items-center gap-3">
                {state.business.logo ? (
                  <div className="flex items-center gap-3">
                    <img 
                      src={state.business.logo} 
                      alt="Business Logo" 
                      className="w-16 h-16 object-cover rounded-lg border border-slate-300"
                    />
                    <button 
                      type="button" 
                      onClick={removeLogo}
                      className="p-2 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 opacity-40" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Upload Logo
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs opacity-60 mt-1">Max 200x200px, 2MB, JPEG/PNG/GIF</p>
            </div>
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
