import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  return (
    <main className="container py-12">
      <h1 className="text-4xl">Dashboard (Preview)</h1>
      <p className="muted">This is a placeholder for the client dashboard. When logged in, users will see balances, recent activity, and quick actions here.</p>

      <section style={{marginTop:20}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          <div className="card elevated">
            <h3>Balance</h3>
            <div style={{fontSize:24,fontWeight:700,marginTop:8}}>$8,420.33</div>
          </div>
          <div className="card elevated">
            <h3>Pending</h3>
            <div style={{fontSize:24,fontWeight:700,marginTop:8}}>$1,200.00</div>
          </div>
          <div className="card elevated">
            <h3>Recent Activity</h3>
            <ul className="muted" style={{marginTop:8}}>
              <li>PMT-002 — Pending</li>
              <li>PMT-001 — Completed</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{marginTop:20}}>
        <Link to="/payments" className="btn-primary">Go to payments</Link>
      </section>
    </main>
  )
}
