import React from 'react'
import { Link } from 'react-router-dom'

export default function Payments(){
  const payments = [
    { id: 'PMT-001', date: '2026-01-20', amount: '$240.00', status: 'Completed', client: 'Acme Co' },
    { id: 'PMT-002', date: '2026-01-18', amount: '$1,200.00', status: 'Pending', client: 'Bright LLC' },
    { id: 'PMT-003', date: '2026-01-15', amount: '$85.50', status: 'Failed', client: 'Solo Freelancer' },
  ]

  return (
    <main className="container py-12">
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 className="text-4xl">Payments</h1>
          <p className="muted">View recent payments, refunds and statuses.</p>
        </div>
        <div>
          <Link to="/register" className="btn-primary">Create account</Link>
        </div>
      </header>

      <section style={{marginTop:20}}>
        <div className="card">
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <th style={{padding:12}}>ID</th>
                <th>Date</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{borderBottom:'1px solid rgba(255,255,255,0.02)'}}>
                  <td style={{padding:12}}>{p.id}</td>
                  <td>{p.date}</td>
                  <td>{p.client}</td>
                  <td>{p.amount}</td>
                  <td>{p.status}</td>
                  <td style={{textAlign:'right',padding:12}}>
                    <button className="btn-secondary" style={{marginRight:8}}>View</button>
                    <button className="btn-outline">Refund</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
