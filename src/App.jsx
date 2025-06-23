import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Layout from "./components/Layout";

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
    </Routes>
  );
};

export default App;
