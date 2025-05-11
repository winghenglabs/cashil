// src/components/BalanceCard.jsx
import React from 'react';

const BalanceCard = ({ balance, income, expense }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-xl">
      <div className="flex items-center mb-4">
        <span className="mr-2 text-3xl">💰</span>
        <h2 className="text-xl font-semibold">Saldo Total</h2>
      </div>
      <p className="text-4xl font-bold mb-2">Rp{balance.toLocaleString('id-ID')}</p>
      <div className="flex justify-between text-blue-100 mt-4">
        <div>
          <p className="text-sm opacity-80">Pendapatan</p>
          <p className="text-lg font-semibold">Rp{income.toLocaleString('id-ID')}</p>
        </div>
        <div>
          <p className="text-sm opacity-80">Pengeluaran</p>
          <p className="text-lg font-semibold">Rp{expense.toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
