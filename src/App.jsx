import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import './index.css'; // or wherever you have Tailwind directives


import ForgotPassword from "./pages/ForgotPassword";
import SupportForm from "./pages/contact-us/SupportForm";
import FeedbackForm from "./pages/contact-us/FeedbackForm";
import FarmerSignup from "./pages/FarmerSignup";
import BuyersMarketplace from "./pages/ByersMarketPlace";
// import ShopOwnerSignup from "./pages/ShopOwnerSignup";
// import ModeratorSignup from "./pages/ModeratorSignup";
// import TransporterSignup from "./pages/TransporterSignup";

const App = () => {
  return (
    
    <Routes>
      <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route path="/users" element={
          <Layout>
            <Users />
          </Layout>
        }
      />
      <Route path="/login" element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route path="/signup" element={
          <Layout>
            <Signup />
          </Layout>
        }
      />
      <Route path="/signup/farmer" element={
        <Layout>
          <FarmerSignup />
        </Layout>} />
{/* <Route path="/signup/shop-owner" element={<ShopOwnerSignup />} />
<Route path="/signup/moderator" element={<ModeratorSignup />} />
<Route path="/signup/transporter" element={<TransporterSignup />} /> */}

      <Route path="/forgotpassword" element={
          <Layout>
            <ForgotPassword />
          </Layout>
        }
      />
      <Route path="/byersmarket" element={
          <Layout>
            <BuyersMarketplace />
          </Layout>
        }
      />
      <Route path="/contact-us/support" element={
          <Layout>
            <SupportForm />
          </Layout>
        }
      />
      <Route path="/contact-us/feedback" element={
          <Layout>
            <FeedbackForm />
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;
