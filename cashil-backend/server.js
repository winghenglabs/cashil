const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// GET all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM transactions ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { title, date, amount, type } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO transactions (title, date, amount, type) VALUES (?, ?, ?, ?)',
      [title, date, amount, type]
    );
    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// DELETE transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM transactions WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
}); 
// PUT update transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, amount, type } = req.body;
    await pool.execute(
      'UPDATE transactions SET title=?, date=?, amount=?, type=? WHERE id=?',
      [title, date, amount, type, id]
    );
    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port ${PORT}"));