import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./Navbar.jsx"; 
import Footer from "./Footer.jsx"; 

// App Component
const App = () => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: "20px" }}>
                <h2>Welcome to My Website</h2>
                <p>This is the main content area.</p>
            </div>
            <Footer />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);