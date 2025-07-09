import React, { useEffect, useState } from "react";
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
        // Optionally sort by date/ID
        all.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        setComplaints(all);
      } catch (err) {
        setComplaints([]);
      }
      setLoading(false);
    };
    fetchAllComplaints();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ComplaintsList
      complaints={complaints}
      onUpdateStatus={handleUpdateStatus}
      {...props}
    />
  );
};

export default ComplaintsListContainer;
