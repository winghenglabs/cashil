// src/components/AddTransactionModal.jsx
import React from 'react';
import { Plus } from 'lucide-react';

export default function AddTransactionModal({ setShowModal, apiError, addTransaction, form, setForm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">Tambah Transaksi Baru</h2>
          <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
            <Plus size={28} className="rotate-45" />
          </button>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 rounded-md text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={addTransaction} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Jenis</label>
            <select
              id="type"
              className="w-full border-slate-300 rounded-md shadow-sm px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="Income">Pendapatan</option>
              <option value="Expense">Pengeluaran</option>
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Judul</label>
            <input
              id="title"
              type="text"
              className="w-full border-slate-300 rounded-md shadow-sm px-3 py-2"
              placeholder="cth: Gaji bulanan"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
            <input
              id="amount"
              type="number"
              className="w-full border-slate-300 rounded-md shadow-sm px-3 py-2"
              placeholder="0"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              required
              min="0"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
            <input
              id="date"
              type="date"
              className="w-full border-slate-300 rounded-md shadow-sm px-3 py-2"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md font-semibold shadow-md transition-colors"
          >
            Simpan Transaksi
          </button>
        </form>
      </div>
    </div>
  );
}
