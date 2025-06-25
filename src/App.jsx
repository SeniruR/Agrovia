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

import BuyersMarketplace from "./pages/ByersMarketPlace";
import AgriShopMarketplace from "./pages/AgriShopMarketplace";
import ShopProductView from "./pages/ShopProductView";
import CropListings from "./pages/CropListing";
import Profile from "./pages/Profile";
import Footer from "./components/pages/Footer";
import DriversMyList from "./pages/DriversMyList";
import MyOrderCrops from "./pages/MyOrderCrops"
import FarmerReviews from "./pages/farmer/FarmersReviews";
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


    </Routes>
    
  );
};

export default App;
