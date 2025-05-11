// src/components/TransactionHistory.jsx
import React from 'react';
import { ListChecks, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const TransactionHistory = ({ transactions, selectedId, setSelectedId, deleteTransaction, getIconForTransaction, setShowModal }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center h-full p-4 text-center bg-slate-50 rounded-lg">
        <ListChecks size={48} className="text-slate-400 mb-3" />
        <p className="text-slate-600 font-medium">Belum ada transaksi.</p>
        <p className="text-sm text-slate-500">Mulai tambahkan transaksi untuk melihat riwayat Anda di sini.</p>
        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-150"
        >
          <Plus size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-lg flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">Transaksi Terkini</h2>
      <ul className="space-y-3 overflow-y-auto pr-2 max-h-96">
        {transactions.map(tx => (
          <li key={tx.id} className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-150">
            <div
              className="flex items-center cursor-pointer flex-grow"
              onClick={() => setSelectedId(selectedId === tx.id ? null : tx.id)}
            >
              <span className="mr-3 p-2 bg-slate-200 rounded-full">
                {getIconForTransaction(tx)}
              </span>
              <div className="flex-grow">
                <p className="font-medium text-slate-800">{tx.title}</p>
                <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="text-right ml-2">
              <p className={`font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {tx.amount > 0 ? '+' : '-'}Rp{Math.abs(tx.amount).toLocaleString('id-ID')}
              </p>
              {selectedId === tx.id && (
                <div className="mt-1 flex gap-2 justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteTransaction(tx.id); }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                    className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setShowModal(true)}
        className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-150"
        aria-label="Tambah Transaksi"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default TransactionHistory;
