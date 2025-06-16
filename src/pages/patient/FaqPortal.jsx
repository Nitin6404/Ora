import React, { useEffect, useState } from 'react';
import api from '../../services/apiService';
import Navigation from './Navigation';

export default function FaqPortal() {
  const [faqs, setFaqs] = useState([]);
  const [ticket, setTicket] = useState({ ticket_subject: '', ticket_desc: '', ticket_type: 'query' });

  useEffect(() => {
    api.get('/api/patient/faqs/').then(res => setFaqs(res.data));
  }, []);

  const submitTicket = async (e) => {
    e.preventDefault();
    await api.post('/api/patient/tickets/', ticket);
    setTicket({ ticket_subject: '', ticket_desc: '', ticket_type: 'query' });
    alert("Ticket submitted!");
  };

  return (
    <Navigation>
        <div className="p-4">
        <h2 className="text-xl font-bold mb-4">FAQs</h2>
        {faqs.map(faq => (
            <div key={faq.id} className="mb-4 border p-2 rounded">
            <details>
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-2">{faq.answer}</p>
            </details>
            </div>
        ))}

        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Submit a Ticket</h3>
        <form onSubmit={submitTicket} className="space-y-2">
            <input value={ticket.ticket_subject} onChange={(e) => setTicket({ ...ticket, ticket_subject: e.target.value })} placeholder="Subject" className="border p-2 w-full" required />
            <textarea value={ticket.ticket_desc} onChange={(e) => setTicket({ ...ticket, ticket_desc: e.target.value })} placeholder="Description" className="border p-2 w-full" required />
            <select value={ticket.ticket_type} onChange={(e) => setTicket({ ...ticket, ticket_type: e.target.value })} className="border p-2 w-full">
            <option value="query">Query</option>
            <option value="issue">Issue</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
        </form>
        </div>
    </Navigation>
  );
}