export type ID = string;
export interface Business { name: string; address: string; logo?: string; }
export interface Branch { id: ID; name: string; city: string; }
export interface Executive {
  id: ID; name: string; phone?: string; email?: string; territory?: string; branchId: ID; joinedOn: string; targetMonthly: number; incentivePct?: number;
}
export interface Sale { id: ID; billNo: string; date: string; execId: ID; branchId: ID; item: string; sku: string; qty: number; unitPrice: number; }
export interface InventoryItem { id: ID; name: string; sku: string; category?: string; costPrice: number; sellingPrice: number; stock: number; }
export interface AppState { business: Business; branches: Branch[]; executives: Executive[]; sales: Sale[]; inventory: InventoryItem[]; categories?: string[]; }
