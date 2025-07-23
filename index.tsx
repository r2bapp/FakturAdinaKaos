// File: pages/index.tsx
import { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

const produkList = {
  "Lengan Pendek Combed 24S": {
    "Putih": { "S": 42000, "M": 42500, "L": 46000, "XL": 49000, "2XL": 50500, "3XL": 52500 },
    "Hitam": { "S": 44500, "M": 45000, "L": 49000, "XL": 52000, "2XL": 54000, "3XL": 56500 },
    "Warna": { "S": 45000, "M": 46000, "L": 50600, "XL": 53000, "2XL": 55000, "3XL": 57500 }
  },
  "Polo": {
    "Semua Warna": { "S": 87000, "M": 87000, "L": 87000, "XL": 87000, "2XL": 93500, "3XL": 100000 }
  }
};

export default function Home() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: '',
    customer: '',
    address: '',
    items: [],
    note: ''
  });
  const [currentItem, setCurrentItem] = useState({
    product: '', color: '', size: '', quantity: 1, unitPrice: 0
  });

  useEffect(() => {
    const now = new Date();
    const number = `INV-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
    setInvoiceData(prev => ({ ...prev, invoiceNumber: number, date: now.toISOString().slice(0, 10) }));
  }, []);

  const handleAddItem = () => {
    const total = currentItem.quantity * currentItem.unitPrice;
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { ...currentItem, total }]
    }));
  };

  const generatePDF = () => {
    const element = document.getElementById('invoice')!;
    html2pdf().from(element).save(`${invoiceData.invoiceNumber}.pdf`);
  };

  const handleSave = async () => {
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
  };

  return (
    <div className="p-8 text-sm">
      <h1 className="text-2xl font-bold text-orange-600">ADINA KAOS - Invoice Generator</h1>

      <div className="my-4">
        <input type="text" placeholder="Nama Pelanggan" className="border p-1 mr-2" onChange={e => setInvoiceData({ ...invoiceData, customer: e.target.value })} />
        <input type="text" placeholder="Alamat" className="border p-1" onChange={e => setInvoiceData({ ...invoiceData, address: e.target.value })} />
      </div>

      <div className="my-2">
        <select className="border p-1 mr-2" onChange={e => setCurrentItem({ ...currentItem, product: e.target.value })}>
          <option value="">Pilih Produk</option>
          {Object.keys(produkList).map(prod => <option key={prod}>{prod}</option>)}
        </select>

        <select className="border p-1 mr-2" onChange={e => setCurrentItem({ ...currentItem, color: e.target.value })}>
          <option value="">Warna</option>
          {currentItem.product && Object.keys(produkList[currentItem.product]).map(w => <option key={w}>{w}</option>)}
        </select>

        <select className="border p-1 mr-2" onChange={e => {
          const price = produkList[currentItem.product]?.[currentItem.color]?.[e.target.value] || 0;
          setCurrentItem({ ...currentItem, size: e.target.value, unitPrice: price });
        }}>
          <option value="">Ukuran</option>
          {['S','M','L','XL','2XL','3XL'].map(size => <option key={size}>{size}</option>)}
        </select>

        <input type="number" min={1} className="border p-1 w-16 mr-2" value={currentItem.quantity} onChange={e => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) })} />

        <input type="number" className="border p-1 w-20 mr-2" value={currentItem.unitPrice} onChange={e => setCurrentItem({ ...currentItem, unitPrice: parseInt(e.target.value) })} />

        <button className="bg-orange-600 text-white px-3 py-1" onClick={handleAddItem}>Tambah</button>
      </div>

      <div className="my-4 border p-4" id="invoice">
        <h2 className="font-bold text-xl">Invoice #{invoiceData.invoiceNumber}</h2>
        <p>{invoiceData.date}</p>
        <p><strong>Kepada:</strong> {invoiceData.customer} - {invoiceData.address}</p>

        <table className="w-full text-left border mt-4">
          <thead><tr><th>Produk</th><th>Warna</th><th>Ukuran</th><th>Qty</th><th>Harga</th><th>Total</th></tr></thead>
          <tbody>
            {invoiceData.items.map((item, i) => (
              <tr key={i} className="border-t">
                <td>{item.product}</td><td>{item.color}</td><td>{item.size}</td>
                <td>{item.quantity}</td><td>{item.unitPrice}</td><td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-2 font-bold">Grand Total: Rp {invoiceData.items.reduce((sum, i) => sum + i.total, 0)}</p>
      </div>

      <div className="mt-4">
        <textarea placeholder="Catatan..." className="border p-2 w-full" rows={2} onChange={e => setInvoiceData({ ...invoiceData, note: e.target.value })} />
        <button className="bg-black text-white px-4 py-2 mt-2 mr-2" onClick={generatePDF}>Unduh PDF</button>
        <button className="bg-gray-700 text-white px-4 py-2 mt-2" onClick={handleSave}>Simpan</button>
      </div>
    </div>
  );
} 
