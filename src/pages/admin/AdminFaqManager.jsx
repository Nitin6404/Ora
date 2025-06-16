import React, { useEffect, useState } from 'react';
import api from '../../services/apiService';
import Navigation from './Navigation';

export default function AdminFaqManager() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ question: '', answer: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    const res = await api.get('/api/patient/faqs/');
    setFaqs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/api/patient/faqs/${editingId}/`, form);
    } else {
      await api.post('/api/patient/faqs/', form);
    }
    setForm({ question: '', answer: '' });
    setEditingId(null);
    loadFaqs();
  };

  const handleEdit = (faq) => {
    setEditingId(faq.id);
    setForm({ question: faq.question, answer: faq.answer });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this FAQ?')) {
      await api.delete(`/api/patient/faqs/${id}/`);
      loadFaqs();
    }
  };

  return (
    <Navigation>
      <div>
        <h2 className="text-xl font-bold mb-4">Manage FAQs</h2>
        <form onSubmit={handleSubmit} className="space-y-2 mb-6">
          <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question" className="border p-2 w-full" />
          <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Answer" className="border p-2 w-full" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Add'}</button>
        </form>

        <ul>
          {faqs.map(faq => (
            <li key={faq.id} className="border p-2 mb-2">
              <strong>{faq.question}</strong>
              <p>{faq.answer}</p>
              <button onClick={() => handleEdit(faq)} className="text-blue-600 mr-2">Edit</button>
              <button onClick={() => handleDelete(faq.id)} className="text-red-600">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </Navigation>
  );
}