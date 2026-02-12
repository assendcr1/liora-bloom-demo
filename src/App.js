// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar, { NAVBAR_HEIGHT } from "./components/Navbar";
import Footer from "./components/Footer"; // 1. IMPORT THE FOOTER

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext"; 
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute"; 

/* PUBLIC */
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import BloomFinder from "./pages/BloomFinder";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

/* ADMIN */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import AdminUsers from "./pages/admin/Users";
import AdminPromotions from "./pages/admin/Promotions";
import AdminReports from "./pages/admin/Reports";

/* USER DASHBOARD */
import UserLayout from "./pages/user/UserLayout";
import UserProfile from "./pages/user/UserProfile";
import UserOrders from "./pages/user/UserOrders";
import UserReviews from "./pages/user/UserReviews";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <OrderProvider>
            <Router>
              <Navbar />
              
              {/* This wrapper ensures content starts below the fixed Navbar */}
              <div style={{ paddingTop: NAVBAR_HEIGHT, minHeight: '100vh' }}>
                <Routes>
                  {/* PUBLIC */}
                  <Route path="/" element={<Home />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/bloom-finder" element={<BloomFinder />} />
                  <Route path="/our-story" element={<OurStory />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* USER DASHBOARD */}
                  <Route
                    path="/account"
                    element={
                      <PrivateRoute>
                        <UserLayout />
                      </PrivateRoute>
                    }
                  >
                    <Route index element={<UserProfile />} />
                    <Route path="orders" element={<UserOrders />} />
                    <Route path="reviews" element={<UserReviews />} />
                  </Route>

                  {/* ADMIN */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="promotions" element={<AdminPromotions />} />
                    <Route path="reports" element={<AdminReports />} />
                  </Route>
                </Routes>
              </div>

              <Footer /> {/* 2. RENDER THE FOOTER HERE */}
              
            </Router>
          </OrderProvider>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}