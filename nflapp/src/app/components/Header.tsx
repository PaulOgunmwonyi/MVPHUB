"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleHomeNavigate = () => {
    router.push("/");
  };

  const handlePastWinnersNavigate = () => {
    router.push("/past-winners");
  };

  return (
    <header style={{
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 20px rgba(30, 60, 114, 0.3)",
      borderBottom: "3px solid #ffffff"
    }}>
      <h1 
        onClick={handleHomeNavigate}
        style={{
          color: "#ffffff",
          fontSize: "2.2rem",
          fontWeight: "900",
          margin: 0,
          fontFamily: "Arial, sans-serif",
          cursor: "pointer",
          letterSpacing: "2px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.color = "#e3f2fd";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.color = "#ffffff";
        }}
      >
        MVPHUB
      </h1>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={handleHomeNavigate}
          style={{
            backgroundColor: pathname === "/" ? "#ffffff" : "transparent",
            color: pathname === "/" ? "#1e3c72" : "#ffffff",
            border: "2px solid #ffffff",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
          onMouseEnter={(e) => {
            if (pathname !== "/") {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#1e3c72";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 255, 255, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/") {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          MVP Predictor
        </button>
        <button
          onClick={handlePastWinnersNavigate}
          style={{
            backgroundColor: pathname === "/past-winners" ? "#ffffff" : "transparent",
            color: pathname === "/past-winners" ? "#1e3c72" : "#ffffff",
            border: "2px solid #ffffff",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
          onMouseEnter={(e) => {
            if (pathname !== "/past-winners") {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#1e3c72";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 255, 255, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/past-winners") {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          Past MVP Winners
        </button>
      </nav>
    </header>
  );
};

export default Header;
