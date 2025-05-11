// ChartComponent.jsx
// Komponen React fungsional untuk menampilkan grafik garis menggunakan Recharts.
// Disesuaikan untuk menerima prop 'transactions' dari App.js dan memprosesnya.
// Warna garis disesuaikan dengan gambar UI (biru untuk pendapatan, ungu untuk pengeluaran).

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Fungsi untuk memproses data transaksi menjadi format yang sesuai untuk Recharts
const processChartData = (transactions) => {
  if (!transactions || transactions.length === 0) {
    console.log("No transactions data available for chart.");
    return []; // Kembalikan array kosong jika tidak ada transaksi
  }

  console.log("Processing transactions for chart:", transactions);

  // Mengelompokkan transaksi berdasarkan tanggal dan menghitung total pendapatan/pengeluaran harian
  const dailyDataReducer = transactions.reduce((acc, tx) => {
    // Log raw date string from transaction
    console.log(`Raw tx.date: ${tx.date}`);

    // --- PERUBAHAN DI SINI ---
    // Buat objek Date dari string ISO 8601 lengkap
    const dateObj = new Date(tx.date);

    // Ekstrak komponen tanggal (tahun, bulan, hari) berdasarkan zona waktu LOKAL browser
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // getMonth() berbasis 0, jadi tambahkan 1
    const day = dateObj.getDate();

    // Format ulang menjadi string YYYY-MM-DD untuk digunakan sebagai kunci pengelompokan
    // Pastikan bulan dan hari memiliki leading zero jika kurang dari 10
    const date = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    // Log the constructed YYYY-MM-DD date string based on local time
    console.log(`Constructed local date (YYYY-MM-DD) for grouping: ${date}`);
    // --- AKHIR PERUBAHAN ---


    if (!acc[date]) {
      acc[date] = { income: 0, expenses: 0 };
    }

    if (tx.amount > 0) {
      acc[date].income += tx.amount;
    } else {
      acc[date].expenses += Math.abs(tx.amount);
    }
    return acc;
  }, {});

  console.log("Daily data reducer result:", dailyDataReducer);

  // Ubah objek yang dikelompokkan menjadi array dan urutkan berdasarkan tanggal
  const chartData = Object.keys(dailyDataReducer)
    .map(date => {
      // --- PERUBAHAN DI SINI ---
      // Buat objek Date lagi dari string date YYYY-MM-DD (ini akan diinterpretasikan
      // sebagai tengah malam di zona waktu lokal, yang sesuai untuk tampilan tanggal)
      const localDateForDisplay = new Date(date);

      // Format tanggal menggunakan toLocaleDateString dari objek Date lokal
      const formattedDate = localDateForDisplay.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
      // Log the final formatted date string
      console.log(`Formatted date for chart axis for ${date}: ${formattedDate}`);
      // --- AKHIR PERUBAHAN ---

      return {
        name: formattedDate, // Gunakan tanggal yang sudah diformat
        income: dailyDataReducer[date].income,
        expenses: dailyDataReducer[date].expenses,
        fullDate: date, // Simpan tanggal asli (YYYY-MM-DD lokal) untuk pengurutan
      };
    })
    .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate)); // Urutkan data berdasarkan tanggal asli

  console.log("Final chart data before rendering:", chartData);

  return chartData;
};

// Komponen ChartComponent menerima 'transactions' sebagai prop
const ChartComponent = ({ transactions }) => {
  const chartDisplayData = processChartData(transactions);

  if (chartDisplayData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 p-4 text-center">
        Data transaksi tidak cukup untuk menampilkan grafik.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartDisplayData}
        margin={{
          top: 5,
          right: 20, // Ruang untuk label sumbu Y
          left: 10,  // Ruang untuk label sumbu Y
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={{ stroke: '#D1D5DB' }}
            // interval="preserveStartEnd" // Untuk memastikan label awal dan akhir selalu tampil jika banyak data
            // angle={-15} // Jika label terlalu panjang
            // textAnchor="end"
        />
        <YAxis
            tickFormatter={(value) => `Rp${(value/1000).toLocaleString('id-ID')}k`} // Format: Rp2k, Rp10k
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={{ stroke: '#D1D5DB' }}
            width={50} // Lebar untuk sumbu Y agar label tidak terpotong
        />
        <Tooltip
          contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', padding: '8px 12px' }}
          labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '6px', fontSize: '13px' }}
          itemStyle={{ color: '#374151', fontSize: '12px' }}
          formatter={(value, name) => [`Rp${value.toLocaleString('id-ID')}`, name.charAt(0).toUpperCase() + name.slice(1)]}
        />
        {/* Legend dinonaktifkan karena sudah ada di atas grafik (di App.js) */}
        {/* <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} /> */}

        {/* Garis untuk data 'income' (Pendapatan) - Warna Biru */}
        <Line
          type="monotone"
          dataKey="income"
          name="Pendapatan"
          stroke="#3B82F6" // Biru (sesuai gambar UI)
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#3B82F6', strokeWidth: 1, stroke: '#FFFFFF' }}
          activeDot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFFFFF' }}
        />
        {/* Garis untuk data 'expenses' (Pengeluaran) - Warna Ungu */}
        <Line
          type="monotone"
          dataKey="expenses"
          name="Pengeluaran"
          stroke="#8B5CF6" // Ungu (sesuai gambar UI)
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 1, stroke: '#FFFFFF' }}
          activeDot={{ r: 6, fill: '#8B5CF6', strokeWidth: 2, stroke: '#FFFFFF' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
