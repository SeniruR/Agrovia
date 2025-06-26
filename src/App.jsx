import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import FarmerCropViews from "./pages/Farmer/AllCropsViews";
import './index.css'; // or wherever you have Tailwind directives

import ItemPostedForm from "./pages/shop/ItemPostedForm";
import ForgotPassword from "./pages/ForgotPassword";
import SupportForm from "./pages/contact-us/SupportForm";
import FeedbackForm from "./pages/contact-us/FeedbackForm";
import FarmerSignup from "./pages/FarmerSignup";

import KnowledgeHubHome from "./pages/KnowledgeHubHome";
import KHubCon from "./pages/KHubCon";


import BuyersMarketplace from "./pages/ByersMarketPlace";
import AgriShopMarketplace from "./pages/shop/AgriShopMarketplace";
import ShopProductView from "./pages/shop/ShopProductView";
import CropListings from "./pages/CropListing";
import Profile from "./pages/Profile";
import Footer from "./components/pages/Footer";
import DriversMyList from "./pages/DriversMyList";
import MyOrderCrops from "./pages/MyOrderCrops"

import CropPostForm from "./components/pages/farmer/CropPostForm";

import FarmerReviews from "./pages/farmer/FarmersReviews";
import TranspoartManagementDashboard from "./pages/transport/TranspoartManagementDashboard";
import ShopReviews from "./pages/shop/ShopReviews";

import KnowledgeHubHome from "./pages/KnowledgeHubHome";
import KHubCon from "./pages/KHubCon";

import NotFound from "./components/pages/NotFound";


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
      <Route path="/agrishop" element={
          <Layout>
            <AgriShopMarketplace />
          </Layout>
        }
      />
      <Route path="/shop" element={
          <Layout>
            <ShopProductView />
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

      <Route path="/cropListings" element={
          <Layout>
            <CropListings />

         </Layout>
        }
      />
      <Route path="/profile" element={
          <Layout>
            <Profile />

         </Layout>
        }
      />

      <Route path="/farmviewAllCrops" element={
          <Layout>
            <FarmerCropViews />
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

      <Route path="/cropListings" element={
          <Layout>
            <CropListings />

         </Layout>
        }
      />

      <Route path="/footer" element={
          <Layout>
            <Footer />
          </Layout>
        }
      />
      <Route path="/driversmylist" element={
          <Layout>
            <DriversMyList />
          </Layout>
        }
      />
      <Route path="/myorderedcroplist" element={
          <Layout>
            <MyOrderCrops />
          </Layout>
        }
      />
      <Route path="/CropPostForm" element={
          <Layout>
            <CropPostForm />
          </Layout>
        }
      />

      <Route path="/itempostedForm" element={
          <Layout>
            <ItemPostedForm />
          </Layout>
        }
      />
       <Route path="/farmerreviews" element={
          <Layout>
            <FarmerReviews />
          </Layout>
        }
      />

       <Route path="/knowledge-hub" element={
          <Layout>
            <KnowledgeHubHome/>
          </Layout>
        }
      />
        <Route path="/hubContent" element={
          <Layout>
            <KHubCon/>
          </Layout>
        }
      />
      


      <Route path="/notfound" element={
        <Layout>
          <NotFound />
        </Layout>
      }
      />

      <Route path="/shopreviews" element={
          <Layout>
            <ShopReviews />
          </Layout>
        }

      />
       <Route path="/transportdashboard" element={
          <Layout>
            <TranspoartManagementDashboard />
          </Layout>
        }
      />
      <Route path="/knowledgehub" element={
          <Layout>
            <KnowledgeHubHome />
          </Layout>
        }
      />
      <Route path="/knowledgecontent" element={
          <Layout>
            <KHubCon />
          </Layout>
        }
      />

    </Routes>
  );
};

export default App;
