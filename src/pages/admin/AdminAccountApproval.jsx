import React, { useState } from 'react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import { User, Check, X, AlertCircle, Truck, ShieldCheck } from 'lucide-react';

// Helper for displaying a dash if value is empty
const dash = v => (v === undefined || v === null || v === '' ? '–' : v);

const dummyLogistics = [
  {
    id: 1,
    name: 'Transpo Lanka',
    owner: 'Nimal Perera',
    email: 'nimal@transpolanka.com',
    phone: '0771234567',
    regNo: 'TL-2024-001',
    address: 'No. 12, Main Street, Colombo',
    status: 'pending',
    vehicleCount: 12,
    serviceArea: 'Colombo, Gampaha',
    proof: true,
  },
  {
    id: 2,
    name: 'QuickMove Logistics',
    owner: 'Saman Silva',
    email: 'saman@quickmove.lk',
    phone: '0719876543',
    regNo: 'QM-2024-002',
    address: '45, Lake Road, Kandy',
    status: 'pending',
    vehicleCount: 7,
    serviceArea: 'Kandy, Matale',
    proof: false,
  },
];

const dummyModerators = [
  {
    id: 1,
    name: 'Ishara Fernando',
    email: 'ishara@agrovia.com',
    phone: '0775551234',
    status: 'pending',
    joinDate: '2025-06-01',
    proof: true,
    description: 'Experienced in agricultural content moderation.'
  },
  {
    id: 2,
    name: 'Ruwan Jayasuriya',
    email: 'ruwan@agrovia.com',
    phone: '0712223344',
    status: 'pending',
    joinDate: '2025-06-10',
    proof: false,
    description: 'Background in agri policy and compliance.'
  },
];

const TABS = [
  { id: 'logistics', label: 'Logistics Providers', icon: Truck },
  { id: 'moderators', label: 'Moderators', icon: ShieldCheck },
];

const AdminAccountApproval = () => {
  const [activeTab, setActiveTab] = useState('logistics');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [accounts, setAccounts] = useState({
    logistics: dummyLogistics,
    moderators: dummyModerators,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const handleAction = (id, action) => {
    setActionLoading(true);
    setActionError('');
    setActionSuccess('');
    setTimeout(() => {
      setAccounts(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(a => a.id !== id),
      }));
      setActionSuccess(`${action === 'approve' ? 'Approved' : 'Rejected'} successfully!`);
      setTimeout(() => {
        setModalOpen(false);
        setSelected(null);
        setActionSuccess('');
      }, 1200);
      setActionLoading(false);
    }, 900);
  };

  const Modal = () => {
    const isLogistics = activeTab === 'logistics';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl border border-green-200 max-w-lg w-full p-0 overflow-hidden animate-fadeInUp" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{isLogistics ? 'Logistics Provider Details' : 'Moderator Details'}</h3>
            <button onClick={() => { setModalOpen(false); setSelected(null); }} className="text-white hover:text-green-100 transition-colors">
              <X size={28} />
            </button>
          </div>
          {/* Modal Content */}
          <div className="p-8 space-y-5 overflow-y-auto" style={{ flex: 1 }}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700">
                {isLogistics ? <Truck className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
              </div>
              <div>
                <div className="text-lg font-semibold text-green-900">{dash(selected?.name)}</div>
                <div className="text-sm text-green-700">{dash(selected?.email)}</div>
                <div className="text-xs mt-1">
                  <span className="inline-block px-2 py-1 rounded font-semibold bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-green-700 mb-1">Phone</label>
                <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.phone)}</div>
              </div>
              {isLogistics && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Owner</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.owner)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Reg. No</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.regNo)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Address</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.address)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Service Area</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.serviceArea)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Vehicle Count</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.vehicleCount)}</div>
                  </div>
                </>
              )}
              {!isLogistics && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-green-700 mb-1">Description</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.description)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Join Date</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.joinDate)}</div>
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-green-700 mb-1">Proof Document</label>
                {selected?.proof ? (
                  <a href="#" className="text-green-700 underline">View Document</a>
                ) : (
                  <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">–</div>
                )}
              </div>
            </div>
            {actionError && (
              <div className="flex items-center space-x-1 text-red-500 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{actionError}</span>
              </div>
            )}
            {actionSuccess && (
              <div className="flex items-center space-x-1 text-green-600 text-sm mt-2">
                <Check className="w-4 h-4" />
                <span>{actionSuccess}</span>
              </div>
            )}
          </div>
          {/* Modal Footer */}
          <div className="bg-slate-50 px-8 py-4 flex justify-end space-x-4">
            <button
              onClick={() => handleAction(selected.id, 'reject')}
              disabled={actionLoading}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => handleAction(selected.id, 'approve')}
              disabled={actionLoading}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!accounts[activeTab]) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 shadow-sm border-b border-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold text-white">Account Approval</h1>
              <p className="text-green-100 text-lg mt-2">Approve or reject logistics and moderator accounts</p>
            </div>
            <div className="flex space-x-2">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setModalOpen(false); setSelected(null); }}
                  className={`flex items-center px-4 py-2 rounded-md font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-green-700' : 'bg-green-500 text-white'}`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{activeTab === 'logistics' ? 'Owner' : 'Join Date'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts[activeTab].map(acc => (
                  <tr key={acc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-green-900">{acc.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dash(acc.email)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dash(acc.phone)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activeTab === 'logistics' ? dash(acc.owner) : dash(acc.joinDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-block px-2 py-1 rounded font-semibold bg-yellow-100 text-yellow-700">Pending</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => { setSelected(acc); setModalOpen(true); }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal */}
      {modalOpen && selected && <Modal />}
    </div>
  );
};

export default AdminAccountApproval;
