import React from "react";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import logo from '../assets/images/heroimage.jpg';

const facilities = [
  { name: "Marketplace", icon: <StorefrontIcon fontSize="large" /> },
  { name: "Knowledge", icon: <MenuBookIcon fontSize="large" /> },
  { name: "Transport", icon: <LocalShippingIcon fontSize="large" /> },
  { name: "Support", icon: <SupportAgentIcon fontSize="large" /> },
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

      <section className="py-12 px-6 text-center md:p-20">
        <h2 className="text-2xl font-bold text-green-700 mb-8">
          We are providing different Facilities
        </h2>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mx-[20%] py-[10px]">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-green-50 p-4 rounded-lg shadow hover:shadow-md transition"
              style={{
                backgroundColor: "var(--green)",
                borderRadius: "10px",
                padding: "15px",
                justifyContent: "center",
                margin: "0px 10px",
              }}
            >
              <div className="text-4xl mb-2">{facility.icon}</div>
              <p className="text-sm font-medium text-gray-700">{facility.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F8F7F0] py-12 px-6 md:p-20 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2">
          <img src={logo} alt="Farm Landscape" className="rounded-lg shadow-md" />
        </div>

        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Farm Benefits</h2>
          <p className="text-green-700 text-xl font-semibold mb-4">Why Choose Agrovia Market</p>
          <p className="text-gray-600 mb-6">
            Agrovia is a smart, integrated platform designed to uplift Sri Lankan farmers by bridging the digital divide and promoting sustainable agriculture. It offers real-time tools, direct market access, and inclusive features tailored to local needs.
          </p>

          <ul className="space-y-4">
            <li>
              <h4 className="text-lg font-semibold text-gray-800">Direct Market Access</h4>
              <p className="text-gray-600 text-sm">
                Farmers can sell directly to consumers and buyers, reducing reliance on intermediaries and ensuring fair pricing.
              </p>
            </li>
            <li>
              <h4 className="text-lg font-semibold text-gray-800">Income Stability</h4>
              <p className="text-gray-600 text-sm">
                Predictive tools and pre-harvest contracts help secure stable buyers and reduce financial uncertainty.
              </p>
            </li>
            <li>
              <h4 className="text-lg font-semibold text-gray-800">Bulk Purchasing & Cooperative Selling</h4>
              <p className="text-gray-600 text-sm">
                Enables cost-efficient group transactions, benefiting both farmers and buyers through discounts and shared logistics.
              </p>
            </li>
            <li>
              <h4 className="text-lg font-semibold text-gray-800">Knowledge & Sustainability</h4>
              <p className="text-gray-600 text-sm">
                A knowledge hub and pest alert system promote sustainable farming practices and informed decision-making.
              </p>
            </li>
            <li>
              <h4 className="text-lg font-semibold text-gray-800">Digital Transformation</h4>
              <p className="text-gray-600 text-sm">
                Agrovia modernizes agriculture with a digital marketplace, logistics management, and certification features.
              </p>
            </li>
          </ul>

          <button className="mt-6 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition">
            Discover More
          </button>
        </div>
      </section>

      <section className="bg-green-50 py-12 px-6 md:p-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">You've Any Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-green-700 mb-2">How can I sell my crops directly?</h4>
              <p className="text-gray-600 text-sm">
                Agrovia connects you with buyers across Sri Lanka, eliminating middlemen and ensuring fair prices through direct-to-consumer listings.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-green-700 mb-2">What support is available for rural farmers?</h4>
              <p className="text-gray-600 text-sm">
                We offer SMS alerts, Sinhala/Tamil interfaces, and offline-friendly tools to ensure accessibility for farmers in remote areas.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-green-700 mb-2">How does Agrovia help with crop planning?</h4>
              <p className="text-gray-600 text-sm">
                Our platform uses weather data, soil conditions, and market trends to recommend the best crops for your region and season.
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-full h-full">
          <img
            src={logo}
            alt="Farmer holding crops"
            className="rounded-lg shadow-md w-full !h-[100%] object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-yellow-300 p-6 rounded-lg shadow-md text-left max-w-xs">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Call Us Anytime</h3>
            <p className="text-lg text-gray-700">+94 76 123 4567</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10 px-6 rounded-lg shadow-md md:p-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">What They are talking about Agrovia</h2>
          <p className="text-gray-500 mb-6">
            There are many variations of passages of available but the majority have suffered alteration in some form by injected humor or random word which don't look even.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 text-lg">
                ★★★★★
              </div>
            </div>
            <p className="text-gray-700 italic mb-4">
              "Agrovia has truly revolutionized the way I approach farming. The tools and community support have made a real difference in my productivity."
            </p>
            <p className="text-sm text-gray-600 text-right">– Bonnie Tolbert</p>

          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 text-lg">
                ★★★★★
              </div>
            </div>
            <p className="text-gray-700 italic mb-4">
              "Agrovia has helped me connect with other farmers and access resources I never knew existed. Highly recommended!"
            </p>
            <p className="text-sm text-gray-600 text-right">– Samuel Green</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 text-lg">
                ★★★★★
              </div>
            </div>
            <p className="text-gray-700 italic mb-4">
              "The support and knowledge base on this platform are outstanding. My yields have improved thanks to Agrovia."
            </p>
            <p className="text-sm text-gray-600 text-right">– Priya Sharma</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingContent;
