import React, { useEffect, useState } from "react";
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import ComplaintsList from "./ComplaintsList";

const ComplaintsListContainer = (props) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add status update handler
  const handleUpdateStatus = async (id, type, status) => {
    let url = "";
    if (type === "crop") url = `/api/v1/crop-complaints/${id}`;
    else if (type === "shop") url = `/api/v1/shop-complaints/${id}`;
    else if (type === "transport") url = `/api/v1/transport-complaints/${id}`;
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  // Delete complaint handler
  const handleDeleteComplaint = async (id, type) => {
    let url = "";
    if (type === "crop") url = `/api/v1/crop-complaints/${id}`;
    else if (type === "shop") url = `/api/v1/shop-complaints/${id}`;
    else if (type === "transport") url = `/api/v1/transport-complaints/${id}`;
    await fetch(url, { method: "DELETE" });
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    const fetchAllComplaints = async () => {
      setLoading(true);
      try {
        // Fetch all types in parallel
        const [cropRes, shopRes, transportRes] = await Promise.all([
          fetch("/api/v1/crop-complaints"),
          fetch("/api/v1/shop-complaints"),
          fetch("/api/v1/transport-complaints"),
        ]);
        const [crop, shop, transport] = await Promise.all([
          cropRes.json(),
          shopRes.json(),
          transportRes.json(),
        ]);
        // Add type field for filtering
        const all = [
          ...crop.map((c) => ({ ...c, type: "crop" })),
          ...shop.map((c) => ({ ...c, type: "shop" })),
          ...transport.map((c) => ({ ...c, type: "transport" })),
        ];
        // Filter for non-admins
        let filtered = all;
        if (props.userType !== '0') {
          filtered = all.filter(c => String(c.user_id || c.submitted_by || c.submittedBy || '') === String(props.userId));
        }
        // Optionally sort by date/ID
        filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        setComplaints(filtered);
      } catch (err) {
        setComplaints([]);
      }
      setLoading(false);
    };
    fetchAllComplaints();
  }, []);

  if (loading) return <FullScreenLoader />;

  return (
    <ComplaintsList
      complaints={complaints}
      onUpdateStatus={handleUpdateStatus}
      onViewComplaint={props.onViewComplaint}
      onBack={props.onBack}
      onDeleteComplaint={handleDeleteComplaint}
      {...props}
    />
  );
};

export default ComplaintsListContainer;
