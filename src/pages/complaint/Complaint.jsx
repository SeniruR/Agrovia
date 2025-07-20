import React, { useState } from 'react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import ComplaintsDashboardContainer from './ComplaintsDashboardContainer';
import ComplaintsListContainer from './ComplaintsListContainer';
import ComplaintDetail from './ComplaintDetail';
import CropComplaintForm from './CropComplaintForm';
import ShopComplaintForm from './ShopComplaintForm';
import TransportComplaintForm from './TransportComplaintForm';

function Complaint() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [complaintDetail, setComplaintDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch a single complaint by ID and type from backend
  const fetchComplaintDetail = async (id, type) => {
    setLoading(true);
    let url = '';
    if (type === 'crop') url = `/api/v1/crop-complaints/${id}`;
    else if (type === 'shop') url = `/api/v1/shop-complaints/${id}`;
    else if (type === 'transport') url = `/api/v1/transport-complaints/${id}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      // Normalize fields for frontend
      let attachments = [];
      if (Array.isArray(data.attachments)) {
        attachments = data.attachments;
      } else if (typeof data.attachments === 'string') {
        try {
          const arr = JSON.parse(data.attachments);
          if (Array.isArray(arr)) attachments = arr;
          else if (arr) attachments = [arr];
        } catch {
          // If it's a base64 string or single file string
          if (data.attachments && /^[A-Za-z0-9+/=]+$/.test(data.attachments)) attachments = [data.attachments];
        }
      }
      setComplaintDetail({
        ...data,
        type,
        submittedByName: data.submittedBy || data.submitted_by || '',
        submittedAt: data.submittedAt || data.submitted_at || data.created_at || new Date().toISOString(),
        attachments
      });
      setCurrentPage('complaint-detail');
    } catch (err) {
      setComplaintDetail(null);
      setCurrentPage('complaint-detail');
    } finally {
      setLoading(false);
    }
  };

  // Update complaint
  const handleUpdateComplaint = async (updatedComplaint) => {
    const { id, type } = updatedComplaint;
    let url = '';
    if (type === 'crop') url = `/api/v1/crop-complaints/${id}`;
    else if (type === 'shop') url = `/api/v1/shop-complaints/${id}`;
    else if (type === 'transport') url = `/api/v1/transport-complaints/${id}`;
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedComplaint)
      });
      if (!res.ok) throw new Error('Failed to update complaint');
      // Refresh the complaint details
      await fetchComplaintDetail(id, type);
      // Show success message (you can implement a toast notification system here)
      alert('Complaint updated successfully');
    } catch (err) {
      console.error('Error updating complaint:', err);
      alert('Failed to update complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add reply to complaint
  const handleAddReply = async (id, reply) => {
    const type = complaintDetail.type;
    let url = '';
    if (type === 'crop') url = `/api/v1/crop-complaints/${id}/reply`;
    else if (type === 'shop') url = `/api/v1/shop-complaints/${id}/reply`;
    else if (type === 'transport') url = `/api/v1/transport-complaints/${id}/reply`;
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply })
      });
      if (!res.ok) throw new Error('Failed to add reply');
      // Refresh the complaint details
      await fetchComplaintDetail(id, type);
    } catch (err) {
      console.error('Error adding reply:', err);
      alert('Failed to add reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      {(() => {
        switch (currentPage) {
          case 'crop-complaint':
            return <CropComplaintForm onBack={() => setCurrentPage('dashboard')} />;
          case 'shop-complaint':
            return <ShopComplaintForm onBack={() => setCurrentPage('dashboard')} />;
          case 'transport-complaint':
            return <TransportComplaintForm onBack={() => setCurrentPage('dashboard')} />;
          case 'complaints':
            return (
              <ComplaintsListContainer
                onViewComplaint={(id, type) => fetchComplaintDetail(id, type)}
                onBack={() => setCurrentPage('dashboard')}
              />
            );
          case 'complaint-detail':
            return (
              <ComplaintDetail
                complaint={complaintDetail}
                onBack={() => setCurrentPage('complaints')}
                onAddReply={handleAddReply}
                onUpdateComplaint={handleUpdateComplaint}
              />
            );
          default:
            return (
              <ComplaintsDashboardContainer
                onNavigate={setCurrentPage}
                onViewComplaint={(id, type) => fetchComplaintDetail(id, type)}
              />
            );
        }
      })()}
    </>
  );
}

export default Complaint;