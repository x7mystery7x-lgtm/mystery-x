# ⚙️ Admin Dashboard Pages - Implementation

## ADMIN DASHBOARD

### DASHBOARD PAGE - `src/pages/Admin/Dashboard.jsx`

```jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-12">Manage clients, payments, and communications</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link to="/admin/clients" className="card hover:shadow-lg transition cursor-pointer">
          <h3 className="text-3xl font-bold mb-2">👥</h3>
          <p className="text-xl font-bold">Clients</p>
          <p className="text-gray-600">Manage clients</p>
        </Link>

        <Link to="/admin/payments" className="card hover:shadow-lg transition cursor-pointer">
          <h3 className="text-3xl font-bold mb-2">💳</h3>
          <p className="text-xl font-bold">Payments</p>
          <p className="text-gray-600">Track payments</p>
        </Link>

        <Link to="/admin/messages" className="card hover:shadow-lg transition cursor-pointer">
          <h3 className="text-3xl font-bold mb-2">💬</h3>
          <p className="text-xl font-bold">Messages</p>
          <p className="text-gray-600">Client messages</p>
        </Link>

        <div className="card">
          <h3 className="text-3xl font-bold mb-2">⚙️</h3>
          <p className="text-xl font-bold">Settings</p>
          <p className="text-gray-600">System config</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <ul className="space-y-2">
            <li>✓ View all clients</li>
            <li>✓ Filter payments</li>
            <li>✓ Send messages</li>
            <li>✓ Generate reports</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">System Info</h2>
          <p className="text-gray-700 mb-2"><strong>Role:</strong> {user?.role}</p>
          <p className="text-gray-700"><strong>Status:</strong> Online ✓</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

---

### CLIENTS MANAGEMENT - `src/pages/Admin/Clients.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({ email: '', uuid: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.email) params.email = filters.email;
      if (filters.uuid) params.uuid = filters.uuid;
      if (filters.search) params.search = filters.search;

      const response = await adminAPI.getClients(params);
      setClients(response.data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    fetchClients();
  };

  const handleViewClient = async (client) => {
    try {
      const response = await adminAPI.getClient(client._id);
      setSelectedClient(response.data.client || response.data);
      setEditData({ name: response.data.name });
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  const handleUpdateClient = async () => {
    try {
      await adminAPI.updateClient(selectedClient._id, editData);
      alert('Client updated successfully');
      setEditMode(false);
      fetchClients();
      setSelectedClient(null);
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await adminAPI.deleteClient(id);
        alert('Client deleted successfully');
        fetchClients();
        setSelectedClient(null);
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Client Management</h1>

      {selectedClient ? (
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
            <button onClick={() => setSelectedClient(null)} className="btn-secondary">Back to List</button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2"><strong>Email:</strong> {selectedClient.email}</p>
              <p className="text-gray-600 mb-2"><strong>Role:</strong> {selectedClient.role}</p>
              <p className="text-gray-600 mb-4"><strong>Verified:</strong> {selectedClient.isVerified ? 'Yes' : 'No'}</p>

              {editMode ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="form-control"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleUpdateClient} className="btn-primary">Save</button>
                    <button onClick={() => setEditMode(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditMode(true)} className="btn-primary">Edit</button>
                  <button onClick={() => handleDeleteClient(selectedClient._id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold mb-2">Account Details</h3>
              <p className="text-gray-600 text-sm">Created: {new Date(selectedClient.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input
                type="email"
                name="email"
                placeholder="Filter by email"
                value={filters.email}
                onChange={handleFilterChange}
                className="form-control"
              />
              <input
                type="text"
                name="uuid"
                placeholder="Filter by UUID"
                value={filters.uuid}
                onChange={handleFilterChange}
                className="form-control"
              />
              <input
                type="text"
                name="search"
                placeholder="Search by name"
                value={filters.search}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            <button onClick={applyFilters} className="btn-primary">Apply Filters</button>
          </div>

          {/* Clients Table */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{client.name}</td>
                    <td className="px-6 py-3">{client.email}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded text-sm ${client.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {client.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button onClick={() => handleViewClient(client)} className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {clients.length === 0 && <p className="p-6 text-center text-gray-500">No clients found</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default Clients;
```

---

### ADMIN PAYMENTS - `src/pages/Admin/AdminPayments.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../../services/api';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ month: '', year: '', uuid: '', email: '', status: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;
      if (filters.uuid) params.uuid = filters.uuid;
      if (filters.email) params.email = filters.email;
      if (filters.status) params.status = filters.status;

      const response = await paymentAPI.getAllPayments(params);
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    fetchPayments();
  };

  const handleUpdateStatus = async (paymentId, newStatus) => {
    try {
      await paymentAPI.updatePaymentStatus(paymentId, { status: newStatus });
      alert('Payment status updated');
      fetchPayments();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleExportCSV = () => {
    let csv = 'Month,Year,UUID,Email,Status,Date\n';
    payments.forEach((p) => {
      csv += `${p.month},${p.year},"${p.addressUuid}","${p.userId?.email || 'N/A'}",${p.status},"${new Date(p.createdAt).toLocaleDateString()}"\n`;
    });
    
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = 'payments.csv';
    link.click();
  };

  if (loading) return <div className="text-center py-12">Loading payments...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Payment Management</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Advanced Filters</h2>
        <div className="grid grid-cols-5 gap-3 mb-4">
          <input type="number" name="month" placeholder="Month" value={filters.month} onChange={handleFilterChange} className="form-control" />
          <input type="number" name="year" placeholder="Year" value={filters.year} onChange={handleFilterChange} className="form-control" />
          <input type="text" name="uuid" placeholder="UUID" value={filters.uuid} onChange={handleFilterChange} className="form-control" />
          <input type="email" name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} className="form-control" />
          <select name="status" value={filters.status} onChange={handleFilterChange} className="form-control">
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        <button onClick={applyFilters} className="btn-primary mr-2">Apply Filters</button>
        <button onClick={handleExportCSV} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">📥 Export CSV</button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left">Month</th>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">UUID</th>
              <th className="px-4 py-3 text-left">Client Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{payment.month}</td>
                <td className="px-4 py-3">{payment.year}</td>
                <td className="px-4 py-3 font-mono text-xs">{payment.addressUuid?.substring(0, 8)}...</td>
                <td className="px-4 py-3 text-sm">{payment.userId?.email || 'N/A'}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded text-sm font-bold ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={payment.status}
                    onChange={(e) => handleUpdateStatus(payment._id, e.target.value)}
                    className="text-sm p-1 border rounded"
                  >
                    <option value="paid">Mark Paid</option>
                    <option value="unpaid">Mark Unpaid</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="p-6 text-center text-gray-500">No payments found</p>}
      </div>

      <p className="mt-6 text-gray-600 text-sm">Total Records: {payments.length}</p>
    </div>
  );
};

export default AdminPayments;
```

---

### ADMIN MESSAGES - `src/pages/Admin/AdminMessages.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { messageAPI } from '../../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filters, setFilters] = useState({ userId: '' });
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState({ to: '', subject: '', body: '' });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = filters.userId ? { userId: filters.userId } : {};
      const response = await messageAPI.getAllMessages(params);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.to || !newMessage.subject || !newMessage.body) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await messageAPI.sendAdminMessage(newMessage);
      setNewMessage({ to: '', subject: '', body: '' });
      fetchMessages();
      alert('Message sent');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await messageAPI.deleteMessage(id);
        fetchMessages();
        alert('Message deleted');
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading messages...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Message Management</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Send Message */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Send Message to Client</h2>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <input
              type="text"
              placeholder="Client User ID"
              value={newMessage.to}
              onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
              className="form-control text-sm"
            />
            <input
              type="text"
              placeholder="Subject"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
              className="form-control"
            />
            <textarea
              placeholder="Message"
              rows="4"
              value={newMessage.body}
              onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
              className="form-control"
            ></textarea>
            <button type="submit" className="btn-primary w-full">Send</button>
          </form>
        </div>

        {/* Messages List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">All Messages</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Filter by User ID"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              className="form-control mb-2"
            />
            <button onClick={fetchMessages} className="btn-primary text-sm">Apply Filter</button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg._id} className="p-4 bg-gray-50 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{msg.subject}</h3>
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-700 mb-2">{msg.body}</p>
                <p className="text-xs text-gray-500">From: {msg.fromUserId?.email || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
            ))}
            {messages.length === 0 && <p className="text-gray-500">No messages</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
```

---

## 🚀 FINAL STEPS SUMMARY

### Everything You've Created:

1. ✅ React app with Vite setup
2. ✅ Tailwind CSS styling
3. ✅ API service layer (all endpoints)
4. ✅ Authentication context
5. ✅ Protected routes
6. ✅ Public pages (Home, About, Contact, Services)
7. ✅ Auth pages (Login, Register)
8. ✅ Client dashboard (Profile, Payments, Messages)
9. ✅ Admin dashboard (Dashboard, Clients, Payments, Messages)
10. ✅ Navigation & routing

### Next: Run & Test

```bash
# Terminal 1: Backend (if not running)
cd psp_project_1
npm run server

# Terminal 2: Frontend
cd psp_frontend
npm run dev
```

### Quick Testing Checklist:
- [ ] Register a new client account
- [ ] Login with client account
- [ ] View and edit profile
- [ ] Create address with UUID
- [ ] Create mock payment
- [ ] Send message to admin
- [ ] Login with admin account (use admin seed data)
- [ ] View all clients
- [ ] Filter payments by multiple criteria
- [ ] Send message to client
- [ ] Export payments CSV

### Then: Deploy
1. Create `.env` file for production
2. Build: `npm run build`
3. Deploy to Vercel, Netlify, or your hosting

**Status:** 🟢 READY FOR FINAL PHASE
