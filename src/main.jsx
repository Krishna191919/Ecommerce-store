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
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>
);
