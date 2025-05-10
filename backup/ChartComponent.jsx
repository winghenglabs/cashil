import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartComponent({ transactions }) {
  const dates = Array.from(new Set(transactions.map(tx => tx.date.split('T')[0]))).sort();

  const incomeData = dates.map(d =>
    transactions
      .filter(tx => tx.date.startsWith(d) && tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0)
  );
  const expenseData = dates.map(d =>
    transactions
      .filter(tx => tx.date.startsWith(d) && tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
  );

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: '#10B981',
        backgroundColor: '#10B98133',
        tension: 0.3,
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: '#EF4444',
        backgroundColor: '#EF444433',
        tension: 0.3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Income vs Expenses Over Time' },
    },
    scales: {
      x: { ticks: { maxRotation: 0, minRotation: 0 } },
      y: { beginAtZero: true, ticks: { callback: v => `$${v}` } }
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md" style={{ height: 300 }}>
      <Line data={data} options={options} />
    </div>
  );
}