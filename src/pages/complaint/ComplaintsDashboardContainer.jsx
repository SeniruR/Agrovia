import React, { useEffect, useState } from "react";
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import ComplaintsDashboard from "./ComplaintsDashboard";

const ComplaintsDashboardContainer = (props) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Get user info from localStorage
        let userType = null, userId = null;
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const userObj = JSON.parse(userStr);
            userType = userObj.user_type;
            userId = userObj.id;
          }
        } catch {}
        // Filter for non-admins
        let filtered = all;
        if (userType !== '0') {
          filtered = all.filter(c => String(c.user_id || c.submitted_by || c.submittedBy || '') === String(userId));
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
    <ComplaintsDashboard
      complaints={complaints}
      {...props}
    />
  );
};

export default ComplaintsDashboardContainer;
