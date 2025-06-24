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

      <section className="py-12 px-6 text-center">
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
    </div>
  );
};

export default LandingContent;
