import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      backgroundColor: "#222",
      color: "white"
    }}>
      <h3 style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}>
        Order Management
      </h3>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
