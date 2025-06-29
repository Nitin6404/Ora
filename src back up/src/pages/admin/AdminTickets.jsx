import React, { useEffect, useState } from 'react';
import api from '../../services/apiService';
import Navigation from './Navigation';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.get('/api/patient/tickets/').then(res => setTickets(res.data));
  }, []);

  return (
    <Navigation>
        <div>
        <h2 className="text-xl font-bold mb-4">Support Tickets</h2>
        {tickets.map(ticket => (
            <div key={ticket.id} className="border p-4 rounded mb-2">
            <strong>{ticket.ticket_subject}</strong> ({ticket.ticket_type})<br />
            <p>{ticket.ticket_desc}</p>
            <span className="text-gray-500 text-sm">{new Date(ticket.created_date).toLocaleString()}</span>
            </div>
        ))}
        </div>
    </Navigation>
  );
}