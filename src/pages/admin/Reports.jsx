// src/pages/admin/Reports.jsx
import { Download } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

export default function AdminReports() {
  const { products } = useProducts();
  const { orders } = useOrders();

  // 1. Calculate Real KPIs
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // 2. Prepare Product Performance Data
  // (In a production app, you'd calculate 'orders' per product from an order_items table)
  const productReport = products.map(p => ({
    name: p.name,
    category: p.category || "Uncategorized",
    stock: p.stock,
    price: p.price,
    value: p.price * p.stock
  }));

  // CSV Export Logic (Simple version)
  const downloadCSV = () => {
    const headers = ["Product,Category,Stock,Price,Total Value\n"];
    const rows = productReport.map(p => 
      `${p.name},${p.category},${p.stock},${p.price},${p.value}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'liora_inventory_report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <h1 className="text-4xl font-light italic font-serif mb-12">
        Reports
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {[
          { label: "Total Revenue", value: `R ${totalRevenue.toLocaleString()}` },
          { label: "Total Orders", value: totalOrders },
          { label: "Products", value: totalProducts },
          { label: "Inventory Value", value: `R ${totalStockValue.toLocaleString()}` },
        ].map((kpi, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-2">
              {kpi.label}
            </p>
            <p className="text-2xl font-light">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* DETAILED TABLE */}
      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden mb-12">
        <div className="p-8 border-b flex justify-between items-center">
          <h2 className="font-serif italic text-xl">Inventory Performance</h2>
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 text-xs underline"
          >
            <Download size={14} />
            Download CSV
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-5 text-left">Product</th>
              <th className="p-5">Category</th>
              <th className="p-5 text-center">Stock</th>
              <th className="p-5 text-center">Price</th>
              <th className="p-5 text-right">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {productReport.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="p-5 font-medium">{p.name}</td>
                <td className="p-5 text-stone-500 uppercase text-[10px] tracking-wider text-center">
                  {p.category}
                </td>
                <td className="p-5 text-center">{p.stock}</td>
                <td className="p-5 text-center">R {p.price.toFixed(2)}</td>
                <td className="p-5 text-right font-mono">R {p.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {productReport.length === 0 && (
          <div className="p-10 text-center text-stone-400">No data available.</div>
        )}
      </div>

      {/* EXPORTS */}
      <div className="flex gap-6">
        <button 
          onClick={downloadCSV}
          className="bg-stone-900 text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
        >
          Export Inventory Data
        </button>
      </div>
    </>
  );
}