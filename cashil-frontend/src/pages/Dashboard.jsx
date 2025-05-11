// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTransactionModal from '../components/AddTransactionModal';
import BalanceCard from '../components/BalanceCard';
import SummaryCard from '../components/SummaryCard';
import ChartComponent from '../components/ChartComponent';
import TransactionHistory from '../components/TransactionHistory';

import { ArrowUpCircle, ArrowDownCircle, Wallet, AlertTriangle } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: 'Income', title: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [apiError, setApiError] = useState(null);

  const fetchTransactions = () => {
    axios.get('http://localhost:5000/api/transactions')
      .then(res => {
        setTransactions(res.data.map(tx => ({ ...tx, amount: Number(tx.amount) })).sort((a, b) => new Date(b.date) - new Date(a.date)));
        setApiError(null);
      })
      .catch(err => {
        console.error("Error fetching transactions:", err);
        setApiError("Gagal memuat transaksi. Pastikan server backend berjalan.");
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const balance = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  function addTransaction(e) {
    e.preventDefault();
    setApiError(null);
    const payload = {
      title: form.title,
      date: form.date,
      amount: form.type === 'Income' ? parseFloat(form.amount) : -parseFloat(form.amount),
      type: form.type.toLowerCase(),
    };
    axios.post('http://localhost:5000/api/transactions', payload)
      .then(() => {
        fetchTransactions();
        setShowModal(false);
        setForm({ type: 'Income', title: '', amount: '', date: new Date().toISOString().split('T')[0] });
        setSelectedId(null);
      })
      .catch(err => {
        console.error("Error adding transaction:", err);
        setApiError("Gagal menambah transaksi. Silakan coba lagi.");
      });
  }

  function deleteTransaction(id) {
    setApiError(null);
    axios.delete(`http://localhost:5000/api/transactions/${id}`)
      .then(() => {
        fetchTransactions();
        setSelectedId(null);
      })
      .catch(err => {
        console.error("Error deleting transaction:", err);
        setApiError("Gagal menghapus transaksi. Silakan coba lagi.");
      });
  }

  const getSummaryData = () => {
    let highestIncome = { amount: 0, date: '-', description: 'N/A' };
    let highestExpense = { amount: 0, date: '-', description: 'N/A' };

    transactions.forEach(tx => {
      if (tx.amount > 0 && tx.amount > highestIncome.amount) {
        highestIncome = { amount: tx.amount, date: new Date(tx.date).toLocaleDateString('id-ID'), description: tx.title };
      } else if (tx.amount < 0 && Math.abs(tx.amount) > highestExpense.amount) {
        highestExpense = { amount: Math.abs(tx.amount), date: new Date(tx.date).toLocaleDateString('id-ID'), description: tx.title };
      }
    });
    return { highestIncome, highestExpense };
  };
  const { highestIncome, highestExpense } = getSummaryData();

  const getIconForTransaction = (transaction) => {
    return transaction.amount > 0
      ? <ArrowUpCircle className="text-green-500" size={20} />
      : <ArrowDownCircle className="text-red-500" size={20} />;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white flex items-center shadow-md sticky top-0 z-50">
        <Wallet size={28} className="mr-3" />
        <h1 className="text-2xl font-semibold tracking-tight">Cashil — Track Your Money, Stay Chill.</h1>
      </header>

      <main className="flex-grow p-4 lg:p-6">
        {apiError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            {apiError}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <BalanceCard balance={balance} income={income} expense={expense} />

            <div className="flex-grow min-h-[300px] lg:min-h-0">
              <TransactionHistory
                transactions={transactions}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                deleteTransaction={deleteTransaction}
                getIconForTransaction={getIconForTransaction}
                setShowModal={setShowModal}
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-1 text-slate-700">Pendapatan vs. Pengeluaran</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-sm text-slate-600">Pendapatan</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  <span className="text-sm text-slate-600">Pengeluaran</span>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ChartComponent transactions={transactions} />
              </div>
            </div>

            <SummaryCard highestIncome={highestIncome} highestExpense={highestExpense} />
          </div>
        </div>
      </main>

      {/* Modal Tambah Transaksi */}
      {showModal && (
        <AddTransactionModal
          setShowModal={setShowModal}
          apiError={apiError}
          addTransaction={addTransaction}
          form={form}
          setForm={setForm}
        />
      )}
    </div>
  );
}