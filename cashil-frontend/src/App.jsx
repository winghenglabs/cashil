import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartComponent from './ChartComponent';

// Scrollable TransactionsHistory
function TransactionsHistory({ transactions, selectedId, setSelectedId, deleteTransaction }) {
  return (
    <div className="relative bg-white rounded-xl p-6 shadow-md flex flex-col flex-1">
      <h3 className="text-xl font-semibold mb-4">Transactions History</h3>
      <ul className="space-y-4 pr-4 max-h-[400px] overflow-y-auto">
        {transactions.map(tx => (
          <li key={tx.id} className="flex justify-between items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setSelectedId(selectedId === tx.id ? null : tx.id)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                tx.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {tx.type === 'income' ? '+' : '-'}
              </div>
              <div>
                <p className="font-medium">{tx.title}</p>
                <p className="text-xs text-gray-500">{tx.date.split('T')[0]}</p>
              </div>
            </div>
            <p className={`${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {tx.type === 'income' ? '+' : '-'} ${Math.abs(tx.amount)}
            </p>
            {selectedId === tx.id && (
              <div className="ml-4 flex gap-2">
                <button onClick={() => deleteTransaction(tx.id)} className="text-sm text-red-600">
                  Delete
                </button>
                <button onClick={() => setSelectedId(null)} className="text-sm text-gray-600">
                  Cancel
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CashilApp() {
  const [transactions, setTransactions] = useState([]);
  const [selectedId, setSelectedId]     = useState(null);
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm]                 = useState({ type: 'Income', title: '', amount: '', date: '' });

  // Fetch data once
  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions')
      .then(res => setTransactions(res.data.map(tx => ({ ...tx, amount: Number(tx.amount) }))))
      .catch(console.error);
  }, []);

  // Compute totals
  const balance = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const income  = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Add transaction
  function addTransaction(e) {
    e.preventDefault();
    const payload = {
      title:  form.title,
      date:   form.date,
      amount: form.type === 'Income' ? parseFloat(form.amount) : -parseFloat(form.amount),
      type:   form.type.toLowerCase(),
    };
    axios.post('http://localhost:5000/api/transactions', payload)
      .then(res => {
        setTransactions([{ ...res.data, amount: Number(res.data.amount) }, ...transactions]);
        setShowModal(false);
        setForm({ type: 'Income', title: '', amount: '', date: '' });
        setSelectedId(null);
      })
      .catch(console.error);
  }

  // Delete transaction
  function deleteTransaction(id) {
    axios.delete(`http://localhost:5000/api/transactions/${id}`)
      .then(() => {
        setTransactions(transactions.filter(tx => tx.id !== id));
        setSelectedId(null);
      })
      .catch(console.error);
  }

  // Summary calculations
  const incomeByDate = transactions.reduce((acc, tx) => {
    if (tx.amount > 0) acc[tx.date] = (acc[tx.date] || 0) + tx.amount;
    return acc;
  }, {});
  const expenseByDate = transactions.reduce((acc, tx) => {
    if (tx.amount < 0) acc[tx.date] = (acc[tx.date] || 0) + Math.abs(tx.amount);
    return acc;
  }, {});
  const maxKey = obj => Object.keys(obj).length
    ? Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b))
    : '-';
  const highestIncomeDate  = maxKey(incomeByDate).split('T')[0];
  const highestExpenseDate = maxKey(expenseByDate).split('T')[0];

  const tips = [
    'Sisihkan 10% pendapatan untuk tabungan.',
    'Catat pengeluaran harian agar tidak bocor.',
    'Batasi langganan streaming yang jarang dipakai.',
    'Manfaatkan diskon dan cashback saat belanja.',
    'Review keuangan setiap akhir bulan.'
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  // MBTI-like insight
  const isBoros      = expense > income;
  const insightEmoji = isBoros ? '😅' : '🧐';
  const insightTag   = isBoros ? '#Boros #Balance' : '#Hemat #Balance';
  const insightText  = isBoros
    ? 'Pengeluaran lebih besar dari pendapatan. Atur ulang budget!'
    : 'Kamu mengontrol pengeluaran dengan baik!';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 p-4 text-white flex items-center">
        <div className="w-8 h-8 rounded-full bg-white flex justify-center items-center mr-2">
          <img src="/wallet-icon.png" alt="Logo" className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-semibold">Cashil</h1>
        <span className="ml-2 italic">: Track your money. Stay chill. Cashil.</span>
      </header>

      {/* Main */}
      <main className="flex flex-1 p-6 gap-6 overflow-hidden">
        {/* Left panel */}
        <div className="w-1/2 flex flex-col gap-6">
          <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg">Total Balance</h2>
            <p className="text-4xl font-bold mt-2">${balance}</p>
            <div className="mt-4 flex justify-between">
              <div>
                <span className="text-sm">Income</span>
                <p className="text-xl">${income}</p>
              </div>
              <div>
                <span className="text-sm">Expenses</span>
                <p className="text-xl">${expense}</p>
              </div>
            </div>
          </div>
          <div className="relative flex-1">
            <TransactionsHistory
              transactions={transactions}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              deleteTransaction={deleteTransaction}
            />
            <button
              onClick={() => setShowModal(true)}
              className="absolute bottom-6 right-6 bg-blue-600 bg-opacity-75 text-white w-12 h-12 flex items-center justify-center rounded-full"
            >
              +
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-1/2 flex flex-col gap-6">
          {/* Chart */}
          <ChartComponent transactions={transactions} />
          {/* Summary fills remaining height */}
          <div className="flex-1 bg-white rounded-xl p-6 shadow-md border-t-4 border-blue-600 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Summary</h3>
              <p><span className="font-medium">Pemasukan tertinggi:</span> {highestIncomeDate}</p>
              <p><span className="font-medium">Pengeluaran tertinggi:</span> {highestExpenseDate}</p>
            </div>
            <div>
              <hr className="my-4" />
              <p className="italic">Tip: {randomTip}</p>
              <p className="mt-4 text-xl">{insightEmoji} <span className="font-semibold">{insightTag}</span></p>
              <p className="text-sm mt-1">{insightText}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Add Transaction</h2>
            <form onSubmit={addTransaction} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Type</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option>Income</option>
                  <option>Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Deskripsi transaksi"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Amount</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  placeholder="$ 0.00"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  required

                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold">
                Add Transaction
              </button>
            </form>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}