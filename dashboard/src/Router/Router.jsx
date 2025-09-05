import React from "react";
import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "../components/PrivateRoute";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Customers from "../pages/Customers";
import Analytics from "../pages/Analytics";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";
import WebsiteSettings from "../pages/WebsiteSettings";
import UserManagement from "../pages/UserManagement";
import AddEditProduct from "../pages/AddEditProduct";
import UserDashboard from "../pages/UserDashboard";
import { useAuth } from "../contexts/AuthContext";
import Wishlist from "../pages/Wishlist";
import OrderTracking from "../pages/OrderTracking";
import NoAccess from "../pages/NoAccess";
import InvoiceManagement from "../pages/InvoiceManagement";
import DeactivatedAccount from "../pages/DeactivatedAccount";

const Router = () => {
  const { userRole } = useAuth();
  const admin = userRole === "admin";
  const employee = userRole === "employee";
  const customer = userRole === "customer";

  return (
    <div className="min-h-screen bg-neutral-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/track-order/:orderNumber" element={<OrderTracking />} />
        <Route path="/no-access" element={<NoAccess />} />
        <Route path="/account-deactivated" element={<DeactivatedAccount />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              {admin ? (
                <Dashboard />
              ) : employee ? (
                <EmployeeDashboard />
              ) : (
                customer && <UserDashboard />
              )}
            </PrivateRoute>
          }
        />

        {/* Profile Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              {admin ? <WebsiteSettings /> : <Navigate to="/" />}
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              {admin ? <UserManagement /> : <Navigate to="/" />}
            </PrivateRoute>
          }
        />

        {/* Products List Page */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />

        {/* Add Product Page */}
        <Route
          path="/products/add"
          element={
            <PrivateRoute>
              <AddEditProduct />
            </PrivateRoute>
          }
        />

        {/* Edit Product Page */}
        <Route
          path="/products/edit/:id"
          element={
            <PrivateRoute>
              <AddEditProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <PrivateRoute>
              {(admin || employee) ? <InvoiceManagement /> : <Navigate to="/no-access" />}
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              {customer ? <Wishlist /> : <Navigate to="/" />}
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <Customers />
            </PrivateRoute>
          }
        />
        {/* <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              }
            /> */}
      </Routes>
    </div>
  );
};

export default Router;
