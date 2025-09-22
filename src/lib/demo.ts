import type { AppState } from "./types";
import { todayISO, uid } from "./utils";
export const STORAGE_KEY = "se-tracker-v1" as const;
export function demoState(): AppState {
  return {
    business: { name: "", address: "" },
    branches: [
      { id: "b_koh", name: "Kohima HQ", city: "Kohima" },
      { id: "b_dim", name: "Dimapur Branch", city: "Dimapur" }
    ],
    executives: [
      { id: "E001", name: "Rahul Sharma", phone: "+91 98xxxxxx12", email: "rahul@example.com", territory: "Kohima City", branchId: "b_koh", joinedOn: "2025-06-01", targetMonthly: 800000, incentivePct: 2.5 },
      { id: "E002", name: "Anjali Verma", phone: "+91 99xxxxxx45", email: "anjali@example.com", territory: "Dimapur Urban", branchId: "b_dim", joinedOn: "2025-05-15", targetMonthly: 700000, incentivePct: 2 }
    ],
    sales: [
      { id: uid("S"), billNo: "B1001", date: todayISO(), execId: "E001", branchId: "b_koh", item: "Thermal Printer", sku: "TP-200", qty: 3, unitPrice: 15000 },
      { id: uid("S"), billNo: "B1002", date: todayISO(), execId: "E002", branchId: "b_dim", item: "Label Roll", sku: "LR-58", qty: 20, unitPrice: 120 },
      { id: uid("S"), billNo: "B1003", date: todayISO(), execId: "E001", branchId: "b_koh", item: "Barcode Scanner", sku: "BS-900", qty: 2, unitPrice: 4500 }
    ],
    inventory: [
      { id: uid("I"), name: "Thermal Printer", sku: "TP-200", category: "Electronics", costPrice: 12000, sellingPrice: 15000, stock: 10 },
      { id: uid("I"), name: "Label Roll", sku: "LR-58", category: "Accessories", costPrice: 80, sellingPrice: 120, stock: 200 },
      { id: uid("I"), name: "Barcode Scanner", sku: "BS-900", category: "Electronics", costPrice: 3500, sellingPrice: 4500, stock: 25 }
    ],
    categories: ["Electronics", "Home", "Accessories", "Lights", "Furniture"]
  };
}
