import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Product from "./components/Product.jsx";
import "./index.css";
import Services from "./components/Services.jsx";
import Contact from "./components/Contact.jsx";
import Cartpage from "./components/Cartpage.jsx";
import Signin from "./components/signin.jsx";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import RequireRole from "./components/admin/RequireRole.jsx";
import AdminPanel from "./components/admin/AdminPanel.jsx";
import MyOrders from "./components/MyOrders.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Hero />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "products/:id",
        element: <Product />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "cart",
        element: <Cartpage />,
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "admin",
        element: (
          <RequireRole roles={["admin"]}>
            <AdminPanel mode="admin" />
          </RequireRole>
        ),
      },
      {
        path: "vendor",
        element: (
          <RequireRole roles={["vendor", "admin"]}>
            <AdminPanel mode="vendor" />
          </RequireRole>
        ),
      },
      {
        path: "orders",
        element: (
          <RequireRole roles={["buyer", "vendor", "admin"]}>
            <MyOrders />
          </RequireRole>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <ToastProvider>
        <RouterProvider router={appRouter} />
      </ToastProvider>
    </CartProvider>
  </StrictMode>
);
