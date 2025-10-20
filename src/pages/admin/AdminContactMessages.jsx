import React, { useEffect, useMemo, useState } from 'react';
import { adminContactService } from '../../services/adminContactService';
import { MessageSquare, Mail, Phone, User, Filter, Search, X, Send, Trash2, RefreshCw, Inbox } from 'lucide-react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';

const statusBadges = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  responded: 'bg-green-100 text-green-800 border-green-200',
  discarded: 'bg-gray-100 text-gray-600 border-gray-200'
};

const typeBadges = {
  support: 'bg-blue-100 text-blue-800 border-blue-200',
  feedback: 'bg-purple-100 text-purple-800 border-purple-200'
};

const timeAgo = (value) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return 'Just now';
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString();
};

const ContactRow = ({ item, onSelect, onRespond, onDiscard }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm">
    <td className="px-4 py-3">
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="text-left text-gray-900 font-medium hover:text-green-600"
      >
        #{item.id}
      </button>
      <p className="text-xs text-gray-500">{item.name || 'Anonymous'}</p>
    </td>
    <td className="px-4 py-3"><span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeBadges[item.type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{item.type}</span></td>
    <td className="px-4 py-3 text-gray-700">{item.category || '—'}</td>
    <td className="px-4 py-3 text-gray-600 line-clamp-2 leading-snug">{item.message}</td>
    <td className="px-4 py-3 text-gray-500">{item.email || '—'}</td>
    <td className="px-4 py-3 text-gray-500">{item.phone || '—'}</td>
    <td className="px-4 py-3">
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadges[item.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
      </span>
    </td>
    <td className="px-4 py-3 text-gray-500">
  {timeAgo(item.created_at)}
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onRespond(item)}
          className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
        >
          <Send size={14} className="mr-1" /> Reply
        </button>
        <button
          type="button"
          onClick={() => onDiscard(item)}
          className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
        >
          <Trash2 size={14} className="mr-1" /> Discard
        </button>
      </div>
    </td>
  </tr>
);

const DetailPanel = ({ item, onClose }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
    <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-green-50 p-2 text-green-600"><MessageSquare size={20} /></div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Support Request #{item.id}</p>
            <p className="text-xs text-gray-500">Submitted {timeAgo(item.created_at)}</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X size={18} /></button>
      </div>
      <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-6">
        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact Details</h4>
          <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span>{item.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-400" />
              <span>{item.email || '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-400" />
              <span>{item.phone || '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <span>{item.category || '—'}</span>
            </div>
          </div>
        </section>
        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Message</h4>
          <div className="mt-3 whitespace-pre-line rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            {item.message}
          </div>
        </section>
        {item.status !== 'pending' && (
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Response</h4>
            <div className="mt-3 space-y-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              {item.response_subject && <p className="font-semibold">{item.response_subject}</p>}
              {item.response_message && <p className="whitespace-pre-line">{item.response_message}</p>}
              <p className="text-xs text-green-500">Sent {timeAgo(item.responded_at)} by {item.responder_full_name || 'Support Team'}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

const RespondModal = ({ item, onClose, onSubmit, loading }) => {
  const [subject, setSubject] = useState(() => item ? `Re: ${item.category || 'Your Agrovia inquiry'}` : '');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ subject: subject.trim(), message: message.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-50 p-2 text-green-600"><Send size={20} /></div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Reply to {item.name || 'user'}</p>
              <p className="text-xs text-gray-500">Support request #{item.id}</p>
            </div>
          </div>
          <button onClick={onClose} type="button" className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-5 px-6 py-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              placeholder={`Hello ${item.name || 'there'},\n\nThank you for reaching out to Agrovia. ...`}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} className="mr-1" />} {loading ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
    <Inbox size={40} className="text-gray-300" />
    <p className="text-sm font-medium text-gray-600">{message}</p>
    <p className="text-xs text-gray-400">Adjust filters or come back later.</p>
  </div>
);

const AdminContactMessages = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: 'pending', type: '', search: '' });
  const [selected, setSelected] = useState(null);
  const [responding, setResponding] = useState(null);
  const [respondLoading, setRespondLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [discarding, setDiscarding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await adminContactService.list({
          limit: 100,
          status: filters.status || undefined,
          type: filters.type || undefined,
          search: filters.search || undefined
        });
        if (!cancelled) {
          setData(res?.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || err?.message || 'Failed to load contact messages');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [filters, refreshTrigger]);

  const handleRespond = async (payload) => {
    if (!responding) return;
    try {
      setRespondLoading(true);
      await adminContactService.respond(responding.id, payload);
      setResponding(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to send response');
    } finally {
      setRespondLoading(false);
    }
  };

  const handleDiscard = async (item) => {
    if (!window.confirm('Discard this contact message? This cannot be undone.')) return;
    try {
      setDiscarding(true);
      await adminContactService.updateStatus(item.id, 'discarded');
      setSelected((prev) => (prev && prev.id === item.id ? null : prev));
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to discard message');
    } finally {
      setDiscarding(false);
    }
  };

  const statusCounts = useMemo(() => {
    return data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-sm text-gray-500">Monitor and respond to support or feedback messages sent through the Contact Us page.</p>
        </div>
        <button
          type="button"
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw size={16} className="mr-2" /> Refresh
        </button>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Search</label>
            <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="search"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="ml-2 w-full bg-transparent text-sm text-gray-700 focus:outline-none"
                placeholder="Search by name, email, category or message"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            >
              <option value="">All</option>
              <option value="pending">Pending ({statusCounts.pending || 0})</option>
              <option value="responded">Responded ({statusCounts.responded || 0})</option>
              <option value="discarded">Discarded ({statusCounts.discarded || 0})</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            >
              <option value="">All</option>
              <option value="support">Support</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Request</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Message</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center">
                    <FullScreenLoader text="Loading contact submissions..." />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-sm text-red-600">{error}</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10"><EmptyState message="No contact submissions found for the current filters." /></td>
                </tr>
              ) : (
                data.map((item) => (
                  <ContactRow
                    key={item.id}
                    item={item}
                    onSelect={setSelected}
                    onRespond={setResponding}
                    onDiscard={handleDiscard}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <DetailPanel item={selected} onClose={() => setSelected(null)} />
      )}

      {responding && (
        <RespondModal
          item={responding}
          onClose={() => setResponding(null)}
          onSubmit={handleRespond}
          loading={respondLoading}
        />
      )}

      {discarding && <FullScreenLoader text="Discarding message..." />}
    </div>
  );
};

export default AdminContactMessages;
