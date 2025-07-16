import React from "react";
import { Link } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import logo from '../assets/images/heroimage.jpg';
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

const facilities = [
  { name: "Marketplace", icon: <StorefrontIcon fontSize="large"/>, path: '/byersmarket', desc: "Buy and sell fresh produce directly from farmers and trusted vendors." },
  { name: "Agri Shop", icon: <StorefrontOutlinedIcon fontSize="large" />, path: '/agrishop', desc: "Access quality seeds, fertilizers, and agri-equipment at the best prices." },
  { name: "Transport", icon: <LocalShippingIcon fontSize="large" />, path: '/transportreviews', desc: "Find reliable logistics and transport solutions for your harvest." },
  { name: "Support", icon: <SupportAgentIcon fontSize="large" />, path: '/complaintHandling', desc: "Get expert help and customer support for all your agri-needs." },
];

const LandingContent = () => {
  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white text-center"
        style={{
          backgroundImage: `url(${logo})`,
        }}
      >
        <div className="bg-black/30 p-[30px] rounded-lg">
          <h1 className="text-3xl md:text-5xl font-bold leading-snug" style={{ color:'white'}}>
            Empowering Our Farmers,<br />
            Connecting Communities,<br />
            Growing Together.
          </h1>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 px-4 text-center bg-gray-50 border-b">
        <h2 className="text-3xl font-extrabold text-green-700 mb-10 tracking-tight">
          What Can You Do With Agrovia?
        </h2>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {facilities.map((facility, index) => (
            <div key={index} className="flex flex-col items-center bg-white p-7 rounded-2xl shadow-md hover:shadow-xl transition group border border-green-100">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 group-hover:bg-green-200 transition">
                <span className="text-green-700 text-4xl">{facility.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{facility.name}</h3>
              <p className="text-gray-600 text-sm mb-4 min-h-[48px]">{facility.desc}</p>
              {facility.path && (
                <Link
                  to={facility.path}
                  className="inline-block mt-auto bg-green-600 text-white px-4 py-2 rounded font-medium text-sm shadow hover:bg-green-700 transition"
                >
                  Explore
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section - Modern Split Layout */}
      <section className="bg-[#F8F7F0] py-16 px-4 flex flex-col md:flex-row items-center gap-14 max-w-6xl mx-auto rounded-2xl mt-12 shadow-lg">
        <div className="md:w-1/2 flex justify-center">
          <img src={logo} alt="Farm Landscape" className="rounded-2xl shadow-xl w-full max-w-md object-cover" />
        </div>

        <div className="md:w-1/2">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Why Choose Agrovia?</h2>
          <p className="text-green-700 text-xl font-semibold mb-6">Empowering Sri Lankan Agriculture</p>
          <ul className="space-y-5 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">•</span>
              <div>
                <span className="font-semibold text-gray-800">Direct Market Access:</span>
                <span className="text-gray-600 ml-1">Sell directly to buyers, ensuring fair prices and transparency.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">•</span>
              <div>
                <span className="font-semibold text-gray-800">Income Stability:</span>
                <span className="text-gray-600 ml-1">Predictive tools and contracts reduce financial uncertainty.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">•</span>
              <div>
                <span className="font-semibold text-gray-800">Bulk & Cooperative Selling:</span>
                <span className="text-gray-600 ml-1">Group transactions for better rates and shared logistics.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">•</span>
              <div>
                <span className="font-semibold text-gray-800">Knowledge & Sustainability:</span>
                <span className="text-gray-600 ml-1">Access expert advice, pest alerts, and best practices.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">•</span>
              <div>
                <span className="font-semibold text-gray-800">Digital Transformation:</span>
                <span className="text-gray-600 ml-1">Modern tools for logistics, certification, and more.</span>
              </div>
            </li>
          </ul>
          <Link
            to="/discover-more"
            className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow hover:bg-green-700 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* FAQ & Contact Section - Modern Accordion and Contact Card */}
      <section className="bg-green-50 py-16 px-4 grid md:grid-cols-2 gap-14 items-center max-w-6xl mx-auto rounded-2xl mt-12">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-5">
            <details className="bg-white rounded-lg shadow p-5 group" open>
              <summary className="font-semibold text-green-700 text-lg cursor-pointer outline-none group-open:text-green-800">How can I sell my crops directly?</summary>
              <p className="text-gray-600 text-sm mt-2">
                Agrovia connects you with buyers across Sri Lanka, eliminating middlemen and ensuring fair prices through direct-to-consumer listings.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-5 group">
              <summary className="font-semibold text-green-700 text-lg cursor-pointer outline-none group-open:text-green-800">What support is available for rural farmers?</summary>
              <p className="text-gray-600 text-sm mt-2">
                We offer SMS alerts, Sinhala/Tamil interfaces, and offline-friendly tools to ensure accessibility for farmers in remote areas.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-5 group">
              <summary className="font-semibold text-green-700 text-lg cursor-pointer outline-none group-open:text-green-800">How does Agrovia help with crop planning?</summary>
              <p className="text-gray-600 text-sm mt-2">
                Our platform uses weather data, soil conditions, and market trends to recommend the best crops for your region and season.
              </p>
            </details>
          </div>
        </div>
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <img
            src={logo}
            alt="Farmer holding crops"
            className="rounded-2xl shadow-xl w-full max-w-md object-cover mb-6"
          />
          <div className="bg-yellow-300 p-7 rounded-2xl shadow-lg text-left max-w-xs w-full flex flex-col items-start">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Call Us Anytime</h3>
            <p className="text-lg text-gray-700 mb-1">+94 76 123 4567</p>
            <span className="text-sm text-gray-600">Our support team is here to help you 24/7.</span>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern Card Layout */}
      <section className="bg-gray-50 py-16 px-4 rounded-2xl shadow-md max-w-6xl mx-auto mt-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">What Our Users Say</h2>
          <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
            Hear from real farmers and buyers who have transformed their agri-business with Agrovia.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="text-2xl text-green-700">👩‍🌾</span>
            </div>
            <div className="text-yellow-400 text-lg mb-2">★★★★★</div>
            <p className="text-gray-700 italic mb-4">
              "Agrovia has truly revolutionized the way I approach farming. The tools and community support have made a real difference in my productivity."
            </p>
            <p className="text-sm text-gray-600 font-semibold">– Bonnie Tolbert</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="text-2xl text-green-700">👨‍🌾</span>
            </div>
            <div className="text-yellow-400 text-lg mb-2">★★★★★</div>
            <p className="text-gray-700 italic mb-4">
              "Agrovia has helped me connect with other farmers and access resources I never knew existed. Highly recommended!"
            </p>
            <p className="text-sm text-gray-600 font-semibold">– Samuel Green</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="text-2xl text-green-700">👩‍🔬</span>
            </div>
            <div className="text-yellow-400 text-lg mb-2">★★★★★</div>
            <p className="text-gray-700 italic mb-4">
              "The support and knowledge base on this platform are outstanding. My yields have improved thanks to Agrovia."
            </p>
            <p className="text-sm text-gray-600 font-semibold">– Priya Sharma</p>
          </div>
        </div>
      </section>

      {/* Sidebar Demo Section - Minimized and Styled */}
      <section className="py-10 px-4 bg-neutral-50 mt-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Modern Sidebar Demo
          </h2>
          <p className="text-neutral-600 mb-6">
            The sidebar is fully responsive and features smooth animations. Try opening it using the menu icon in the navigation bar.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold text-agrovia-700 mb-2">
                Responsive Design
              </h3>
              <p className="text-neutral-600 leading-relaxed text-sm">
                On desktop, the sidebar slides out and shifts content to the right. On mobile, it appears as an overlay.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold text-agrovia-700 mb-2">
                Smooth Animations
              </h3>
              <p className="text-neutral-600 leading-relaxed text-sm">
                All transitions use CSS animations for a smooth user experience. The content shifts seamlessly when the sidebar opens and closes.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingContent;
