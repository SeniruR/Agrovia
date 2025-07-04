import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Login from "./pages/Login";
import BuyerDashboard from "./components/dashboards/BuyerDashboard";
import FarmerDashboard from "./components/dashboards/FarmerDashboard";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import LayoutAll from "./components/LayoutAll";
import FarmerCropViews from "./pages/Farmer/AllCropsViews";
import './index.css'; // or wherever you have Tailwind directives
import ItemPostedForm from "./pages/shop/ItemPostedForm";
import ShopDashBoard from "./pages/shop/ShopDashboard";
import ForgotPassword from "./pages/ForgotPassword";
// import SupportForm from "./pages/contact-us/SupportForm";
// import FeedbackForm from "./pages/contact-us/FeedbackForm";
import FarmerSignup from "./pages/FarmerSignup";
import BuyerSignup from "./pages/BuyerSignup";
import TransporterSignup from "./pages/TransporterSignup";

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

import CropPostForm from "./pages/farmer/CropPostForm";

import CreateArticle from "./pages/Moderator/CreateArticle";

import FarmerReviews from "./pages/farmer/FarmersReviews";
import FarmerViewOrders from "./pages/farmer/FarmerViewOrders";
import FarmerViewOrderDetails from "./pages/farmer/FarmerViewOrderDetails";

import TranspoartManagementDashboard from "./pages/transport/TranspoartManagementDashboard";

import ShopReviews from "./pages/shop/ShopReviews";

import CreateOrganizationForm from "./pages/organization/CreateOrganizationForm";

import NotFound from "./components/pages/NotFound";
import Complaint from "./pages/complaint/Complaint";

import AdminDashboard from "./pages/admin/AdminDahboard"
import AdminUserManagement from "./pages/admin/AdminUserManagement"
import SubscriptionManagement from "./pages/SubscriptionManagement";


import OrganizationDashBoard from "./pages/organization/Oraganization";
import FarmingPestAlerts from "./pages/PestAlert";
import PestAlertInterface from "./pages/PestAlert";
import TransportServicesReviews from "./pages/transport/TransportReviews";
import ShopItem from "./pages/shop/Items";
import EmailAlerts from "./pages/EmailAlerts";
import WeatherNotifications from "./pages/WeatherAlerts"; 
import PriceForcasting from "./pages/PriceForcasting";
import ContentApprovalDashboard from "./pages/ContentApproval";

// import ShopOwnerSignup from "./pages/ShopOwnerSignup";
// import ModeratorSignup from "./pages/ModeratorSignup";
// import TransporterSignup from "./pages/TransporterSignup";


const App = () => {
  return (
    
    <Routes>
      <Route path="/" element={
          <LayoutAll>
            <Home />
          </LayoutAll>
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
        </Layout>} 
      />
      <Route path="/signup/buyer" element={
        <Layout>
          <BuyerSignup />
        </Layout>} 
      />
      <Route path="/signup/transporter" element={
        <Layout>
          <TransporterSignup />
        </Layout>} 
      />
        {/* Dashboard Routes - No Layout */}
      <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
      <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
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
      <Route path="/croppostform" element={
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
      <Route path="/shopdashboard" element={
          <Layout>
            <ShopDashBoard />
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
      <Route path="/complaintHandling" element={
          <Layout>
            <Complaint />
          </Layout>
        }

      />

      <Route path="/admindashboard" element={
          <Layout>
            <AdminDashboard/>
          </Layout>
        }

      />
      <Route path="/createorganization" element={
          <Layout>
            <CreateOrganizationForm />
          </Layout>
        }
      />

      <Route path="/organization" element={
          <Layout>
            <OrganizationDashBoard />
          </Layout>
        }
      />
      

      <Route path="/farmervieworders" element={
          <Layout>
            <FarmerViewOrders />
          </Layout>
       }
      />
       <Route path="/usermanagement" element={
          <Layout>
            <AdminUserManagement />
          </Layout>
        }
      />
       <Route path="/pestalert" element={
          <Layout>
            <PestAlertInterface/>
          </Layout>
        }
      />
      <Route path="/subscriptionmanagement" element={
        <Layout>
          <SubscriptionManagement />
        </Layout>
      }
      />
      <Route path="/farmervieworderdetails" element={
          <Layout>
            <FarmerViewOrderDetails />
          </Layout>
        }
      />
        <Route path="/transportreviews" element={
          <Layout>
            <TransportServicesReviews/>
          </Layout>
        }
      />
      <Route path="/createarticle" element={
          <Layout>
            <CreateArticle/>
          </Layout>
        }
      />
      <Route path="/shopitem" element={
          <Layout>
            <ShopItem/>
          </Layout>
        }
      />

       <Route path="/emailalerts" element={
          <Layout>
            <EmailAlerts/>
          </Layout>
        }
      />
 <Route path="/weatheralerts" element={
          <Layout>
            <WeatherNotifications/>
          </Layout>
        }
      />
      <Route path="/priceforcast" element={
        <Layout>
          <PriceForcasting />
        </Layout>
      }
      />
 <Route path="/conapproval" element={
        <Layout>
          <ContentApprovalDashboard />
        </Layout>
      }
      />


    </Routes>
  );
};

export default App;