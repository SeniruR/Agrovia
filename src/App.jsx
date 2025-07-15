import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Login from "./pages/Login";
import BuyerDashboard from "./components/dashboards/BuyerDashboard";
import FarmerDashboard from "./components/dashboards/FarmerDashboard";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import FarmerCropViews from "./pages/farmer/AllCropsViews";
import './index.css'; // or wherever you have Tailwind directives
import ItemPostedForm from "./pages/shop/ItemPostedForm";
import ShopDashBoard from "./pages/shop/ShopDashboard";
import ForgotPassword from "./pages/ForgotPassword";
// import SupportForm from "./pages/contact-us/SupportForm";
// import FeedbackForm from "./pages/contact-us/FeedbackForm";
import FarmerSignup from "./pages/FarmerSignup";
import BuyerSignup from "./pages/BuyerSignup";
import TransporterSignup from "./pages/TransporterSignup";
import ShopOwnerSignup from "./pages/ShopOwnerSignup";
import ModeratorSignup from "./pages/ModeratorSignup";

import KnowledgeHubHome from "./pages/KnowledgeHubHome";
import KHubCon from "./pages/KHubCon";

import BuyersMarketplace from "./pages/ByersMarketPlace";
import CartPage from "./pages/CartPage";
import AgriShopMarketplace from "./pages/shop/AgriShopMarketplace";
import ShopProductView from "./pages/shop/ShopProductView";
import CropListings from "./pages/CropListing";
import FarmerProfileEdit from "./pages/Profile";
import FarmerProfile from "./pages/profiles/FarmerProfile";
import BuyerProfile from "./pages/profiles/BuyerProfile";
import ShopOwnerProfile from "./pages/profiles/ShopOwnerProfile";
import TransporterProfile from "./pages/profiles/TransporterProfile";
import ProfileRouter from "./components/ProfileRouter";
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
import AdminOrganizationApproval from "./pages/admin/AdminOrganizationApproval";
import SubscriptionManagement from "./pages/SubscriptionManagement";


import OrganizationDashBoard from "./pages/organization/Oraganization";
import FarmingPestAlerts from "./pages/PestAlert";
import PestAlertInterface from "./pages/PestAlert";
import TransportServicesReviews from "./pages/transport/TransportReviews";
import DeliveryStatus from "./pages/transport/DeliveryStatus";
import ShopItem from "./pages/shop/Items";
import EmailAlerts from "./pages/EmailAlerts";
import WeatherNotifications from "./pages/WeatherAlerts"; 
import PriceForcasting from "./pages/PriceForcasting";
import ContentApprovalDashboard from "./pages/ContentApproval";
import FarmerVerificationPanel from "./pages/organization/farmerVerificationPanel";
import CropReccomendationSystem from "./pages/CropRecommendation";
import OrderHistory from "./components/dashboards/OrderHistory";
import SavedItems from "./components/dashboards/SavedItems";
import TrackOrders from "./components/dashboards/TrackOrders";
import MyShopItem from "./pages/shop/MyShopItem";

import NavigationTest from "./pages/NavigationTest";

import CropDetailView from "./pages/farmer/CropDetailView";

import AdminMyShopItem from "./pages/admin/AdminShopItem";

import BuyerComplaintDashboard from "./pages/complaint/BuyerComplaintDashboard";
import ContactPage from "./components/contact/ContactPage";


// import ShopOwnerSignup from "./pages/ShopOwnerSignup";
// import ModeratorSignup from "./pages/ModeratorSignup";
// import TransporterSignup from "./pages/TransporterSignup";


const App = () => {
  return (
    <Routes>
      <Route path="/admin/organization-approval" element={
        <Layout>
          <AdminOrganizationApproval />
        </Layout>
      } />
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
      <Route path="/signup/moderator" element={
        <Layout>
          <ModeratorSignup />
        </Layout>} 
      />
      <Route path="/signup/shop-owner" element={
        <Layout>
          <ShopOwnerSignup />
        </Layout>} 
      />
        {/* Dashboard Routes - Now with Layout */}
      <Route path="/dashboard/farmer" element={<Layout><FarmerDashboard /></Layout>} />
      <Route path="/dashboard/buyer" element={<Layout><BuyerDashboard /></Layout>} />
{/* <Route path="/signup/moderator" element={<ModeratorSignup />} /> */}

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
      <Route path="/cart" element={
          <Layout>
            <CartPage />
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
      <Route path="/profile" element={<ProfileRouter />} />
      {/* <Route path="/profile/general" element={
          <Layout>
            <Profile />
         </Layout>
        }
      /> */}
      <Route path="/profile/farmer" element={
          <Layout>
            <FarmerProfile />
         </Layout>
        }
      />
      <Route path="/profile/farmer/edit" element={
          <Layout>
            <FarmerProfileEdit />
         </Layout>
        }
      />
      <Route path="/profile/buyer" element={
          <Layout>
            <BuyerProfile />
         </Layout>
        }
      />
      <Route path="/profile/shop-owner" element={
          <Layout>
            <ShopOwnerProfile />
         </Layout>
        }
      />
      <Route path="/profile/transporter" element={
          <Layout>
            <TransporterProfile />
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
      <Route path="/navigation-test" element={
          <Layout>
            <NavigationTest />
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
      <Route path="/deliverystatus" element={
        <Layout>
          <DeliveryStatus/>
        </Layout>
      }
      />

       <Route path="/verificationpanel" element={
        <Layout>
          <FarmerVerificationPanel/>
        </Layout>
      }
      />
       <Route path="/cropreco" element={
        <Layout>
          <CropReccomendationSystem/>
        </Layout>
      }
      />
        <Route path="/order-history" element={
        <Layout>
          <OrderHistory/>
        </Layout>
      }
      />
       <Route path="/saved-items" element={
        <Layout>
          <SavedItems/>
        </Layout>
      }
      />
       <Route path="/track-orders" element={
        <Layout>
          <TrackOrders/>
        </Layout>
      }
      />
 <Route path="/myshopitem" element={
        <Layout>
          <MyShopItem/>
        </Layout>
      }
      />
      <Route path="/crop/:id" element={
          <Layout>
            <CropDetailView />
          </Layout>
        } />


         <Route path="/adminshopitems" element={
          <Layout>
            <AdminMyShopItem />
          </Layout>
        } />

         <Route path="/buyer-com-dash" element={
        <Layout>
          <BuyerComplaintDashboard/>
        </Layout>
      }
      />

      <Route path="/contact" element={
        <Layout>
          <ContactPage/>
        </Layout>
      }
      />

    </Routes>
    
    
  );
};

export default App;