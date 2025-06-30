import React, { useState } from 'react';
import ComplaintsDashboard from './ComplaintsDashboard';
import CropComplaintForm from './CropComplaintForm';
import ShopComplaintForm from './ShopComplaintForm';
import TransportComplaintForm from './TransportComplaintForm';
import ComplaintsList from './ComplaintsList';
import ComplaintDetail from './ComplaintDetail';

function Complaint() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [complaints, setComplaints] = useState([
    {
      id: '1',
      type: 'crop',
      title: 'Damaged Tomatoes Received',
      description: 'The tomatoes I received were already spoiled and had black spots. This has caused significant financial loss as I cannot sell these to my customers. The damage appears to be from poor storage conditions during transport.',
      status: 'consider',
      priority: 'high',
      submittedAt: new Date('2024-01-15'),
      submittedBy: 'John Smith',
      cropType: 'Tomatoes',
      location: 'Farm Block A-12',
      category: 'Quality Issues',
      assignedTo: 'Sarah Johnson',
      notes: [
        {
          id: '1',
          author: 'Sarah Johnson',
          content: 'Investigating with supplier about storage conditions',
          timestamp: new Date('2024-01-16')
        }
      ],
      actions: [
        {
          id: '1',
          type: 'status_change',
          description: 'Status changed to Consider',
          author: 'System',
          timestamp: new Date('2024-01-15')
        },
        {
          id: '2',
          type: 'assignment',
          description: 'Assigned to Sarah Johnson',
          author: 'Admin',
          timestamp: new Date('2024-01-16')
        }
      ]
    },
    {
      id: '2',
      type: 'shop',
      title: 'Defective Seeds',
      description: 'The corn seeds purchased from your shop have very low germination rate. Out of 100 seeds planted, only 15 germinated. This is well below the expected 85% germination rate mentioned on the package.',
      status: 'consider',
      priority: 'medium',
      submittedAt: new Date('2024-01-14'),
      submittedBy: 'Maria Garcia',
      shopName: 'Green Valley Seeds',
      orderNumber: 'ORD-2024-001',
      category: 'Defective Seeds',
      assignedTo: 'Mike Davis',
      notes: [
        {
          id: '1',
          author: 'Mike Davis',
          content: 'Contacted supplier for batch testing results',
          timestamp: new Date('2024-01-15')
        }
      ],
      actions: [
        {
          id: '1',
          type: 'status_change',
          description: 'Status changed to Consider',
          author: 'System',
          timestamp: new Date('2024-01-14')
        }
      ]
    },
    {
      id: '3',
      type: 'transport',
      title: 'Late Delivery of Vegetables',
      description: 'My vegetable order was delivered 3 days late, causing significant losses. The vegetables were supposed to arrive on Monday for the weekly market, but arrived on Thursday when they were no longer fresh.',
      status: 'not-consider',
      priority: 'urgent',
      submittedAt: new Date('2024-01-13'),
      submittedBy: 'Robert Chen',
      transportCompany: 'FastFresh Logistics',
      location: 'Downtown Market District',
      category: 'Late Delivery',
      assignedTo: null,
      notes: [],
      actions: [
        {
          id: '1',
          type: 'status_change',
          description: 'Status changed to Not Consider',
          author: 'Admin',
          timestamp: new Date('2024-01-14')
        }
      ]
    }
  ]);

  const addComplaint = (complaint) => {
    const newComplaint = {
      ...complaint,
      id: Date.now().toString(),
      submittedAt: new Date(),
      assignedTo: null,
      notes: [],
      actions: [
        {
          id: '1',
          type: 'created',
          description: 'Complaint created',
          author: 'System',
          timestamp: new Date()
        }
      ]
    };
    setComplaints(prev => [newComplaint, ...prev]);
    setCurrentPage('complaints');
  };

  const updateComplaintStatus = (id, status) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id ? { 
          ...complaint, 
          status,
          actions: [
            ...complaint.actions,
            {
              id: Date.now().toString(),
              type: 'status_change',
              description: `Status changed to ${status === 'consider' ? 'Consider' : 'Not Consider'}`,
              author: 'Admin',
              timestamp: new Date()
            }
          ]
        } : complaint
      )
    );
  };

  const addComplaintNote = (id, note) => {
    setComplaints(prev =>
      prev.map(complaint =>
        complaint.id === id ? {
          ...complaint,
          notes: [
            ...complaint.notes,
            {
              id: Date.now().toString(),
              author: 'Current User',
              content: note,
              timestamp: new Date()
            }
          ],
          actions: [
            ...complaint.actions,
            {
              id: Date.now().toString(),
              type: 'note_added',
              description: 'Note added to complaint',
              author: 'Current User',
              timestamp: new Date()
            }
          ]
        } : complaint
      )
    );
  };

  const assignComplaint = (id, assignee) => {
    setComplaints(prev =>
      prev.map(complaint =>
        complaint.id === id ? {
          ...complaint,
          assignedTo: assignee,
          actions: [
            ...complaint.actions,
            {
              id: Date.now().toString(),
              type: 'assignment',
              description: `Assigned to ${assignee}`,
              author: 'Admin',
              timestamp: new Date()
            }
          ]
        } : complaint
      )
    );
  };

  const viewComplaint = (id) => {
    setSelectedComplaintId(id);
    setCurrentPage('complaint-detail');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'crop-complaint':
        return (
          <CropComplaintForm 
            onSubmit={addComplaint}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'shop-complaint':
        return (
          <ShopComplaintForm 
            onSubmit={addComplaint}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'transport-complaint':
        return (
          <TransportComplaintForm 
            onSubmit={addComplaint}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'complaints':
        return (
          <ComplaintsList 
            complaints={complaints}
            onUpdateStatus={updateComplaintStatus}
            onViewComplaint={viewComplaint}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'complaint-detail': {
        const selectedComplaint = complaints.find(c => c.id === selectedComplaintId);
        return (
          <ComplaintDetail
            complaint={selectedComplaint}
            onBack={() => setCurrentPage('complaints')}
            onUpdateStatus={updateComplaintStatus}
            onAddNote={addComplaintNote}
            onAssign={assignComplaint}
          />
        );
      }
      default:
        return (
          <ComplaintsDashboard 
            complaints={complaints}
            onNavigate={setCurrentPage}
            onViewComplaint={viewComplaint}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {renderCurrentPage()}
    </div>
  );
}

export default Complaint;