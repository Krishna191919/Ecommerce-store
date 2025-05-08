// Navbar Component
export const Navbar = () => {
    return (
        <nav style={{ backgroundColor: "red", padding: "10px", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1>My Navbar</h1>
            <ul style={{ listStyleType: "none", display: "flex", gap: "10px", padding: 0 }}>
                <li><a href="#" style={{ color: "white", textDecoration: "none" }}>Home</a></li>
                <li><a href="#" style={{ color: "white", textDecoration: "none" }}>About</a></li>
                <li><a href="#" style={{ color: "white", textDecoration: "none" }}>Contact</a></li>
            </ul>
        </nav>
    );
};