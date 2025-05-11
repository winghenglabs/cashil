// src/components/SummaryCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({ highestIncome, highestExpense }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">Ringkasan</h2>
      <div className="space-y-4">
        <div className="flex items-start justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <TrendingUp size={24} className="mr-3 text-green-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">Pendapatan Tertinggi</p>
              <p className="text-xs text-slate-500">{highestIncome.description} ({highestIncome.date})</p>
            </div>
          </div>
          <p className="font-semibold text-green-600 text-right">Rp{highestIncome.amount.toLocaleString('id-ID')}</p>
        </div>
        <div className="flex items-start justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <TrendingDown size={24} className="mr-3 text-red-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">Pengeluaran Tertinggi</p>
              <p className="text-xs text-slate-500">{highestExpense.description} ({highestExpense.date})</p>
            </div>
          </div>
          <p className="font-semibold text-red-600 text-right">Rp{highestExpense.amount.toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
