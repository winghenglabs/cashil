// client/src/services/transactionService.js
import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchTransactions  = () => API.get('/transactions');
export const createTransaction  = payload => API.post('/transactions', payload);
export const deleteTransaction  = id      => API.delete(`/transactions/${id}`);
