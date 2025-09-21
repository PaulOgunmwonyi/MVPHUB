"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import ChatInterface from "./components/ChatInterface";

type InputFields = {
  wins: string;
  passing_yards: string;
  passing_tds: string;
  interceptions: string;
  passer_rating: string;
  qbr_total: string;
  epa_total: string;
  epa_per_play: string;
  qb_plays: string;
  sacks: string;
  rushing_yards: string;
  rushing_tds: string;
};

const initialInput: InputFields = {
  wins: "",
  passing_yards: "",
  passing_tds: "",
  interceptions: "",
  passer_rating: "",
  qbr_total: "",
  epa_total: "",
  epa_per_play: "",
  qb_plays: "",
  sacks: "",
  rushing_yards: "",
  rushing_tds: "",
};

export default function HomePage() {
  const [input, setInput] = useState<InputFields>(initialInput);
  const [prediction, setPrediction] = useState<string>("Input values for a prediction!");
  const [predictionData, setPredictionData] = useState<any>(null);

  // Field descriptions and examples
  const fieldInfo = {
    wins: { description: "Number of games won by the team", example: "13" },
    passing_yards: { description: "Total passing yards in the season", example: "4306" },
    passing_tds: { description: "Total passing touchdowns thrown", example: "28" },
    interceptions: { description: "Total interceptions thrown", example: "6" },
    passer_rating: { description: "NFL passer rating (0-158.3)", example: "99.6" },
    qbr_total: { description: "Total Quarterback Rating (0-100)", example: "68.2" },
    epa_total: { description: "Expected Points Added total for the season", example: "85.4" },
    epa_per_play: { description: "Expected Points Added per play", example: "0.142" },
    qb_plays: { description: "Total number of QB plays (dropbacks)", example: "601" },
    sacks: { description: "Number of times sacked", example: "23" },
    rushing_yards: { description: "Total rushing yards by the QB", example: "523" },
    rushing_tds: { description: "Total rushing touchdowns by the QB", example: "15" }
  };

  // Check if all fields are filled
  const isFormValid = Object.values(input).every(value => value.trim() !== "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const numericInput = Object.fromEntries(
        Object.entries(input).map(([k, v]) => [k, parseFloat(v)])
      );
      
      const res = await axios.post("http://localhost:5001/predict", numericInput);
      
      if (res.data && typeof res.data.mvp !== "undefined") {
        setPrediction(
          res.data.mvp
            ? `That is high enough and they would likely win MVP.`
            : `That is not high enough and they would likely not win MVP.`
        );
        
        // Store data for chat
        setPredictionData(numericInput);
      } else {
        setPrediction("Prediction unavailable.");
      }
    } catch {
      setPrediction("Error making prediction.");
    }
  };

  return (
    <div style={{ 
      fontFamily: "Arial, sans-serif", 
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)", 
      minHeight: "100vh", 
      padding: 0 
    }}>
      {/* Main Content Container */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        
        {/* Left Side - Input Form */}
        <div style={{ flex: 1, maxWidth: '800px' }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "2rem",
            boxShadow: "0 8px 25px rgba(30, 60, 114, 0.15)",
            border: "2px solid #90caf9"
          }}>
            <h2 style={{
              color: "#1e3c72",
              textAlign: "center",
              marginBottom: "1rem",
              fontSize: "1.8rem",
              fontWeight: "700"
            }}>
              Enter Quarterback Statistics
            </h2>

            <div style={{
              backgroundColor: "#f0f9ff",
              border: "1px solid #90caf9",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "2rem",
              textAlign: "center"
            }}>
              <p style={{
                color: "#1e3c72",
                margin: 0,
                fontSize: "0.9rem"
              }}>
                All fields are required. Hover over input fields for descriptions and examples.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem"
              }}>
                {Object.entries(input).map(([key, value]) => (
                  <div key={key}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#1e3c72",
                      fontWeight: "600",
                      fontSize: "0.9rem"
                    }}>
                      {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:
                      <span style={{ color: "#e74c3c", marginLeft: "2px" }}>*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name={key}
                      value={value}
                      onChange={handleChange}
                      required
                      title={`${fieldInfo[key as keyof typeof fieldInfo].description}. Example: ${fieldInfo[key as keyof typeof fieldInfo].example}`}
                      placeholder={`e.g., ${fieldInfo[key as keyof typeof fieldInfo].example}`}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e3f2fd",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        transition: "border-color 0.3s ease",
                        outline: "none",
                        color: "#1e3c72", 
                        backgroundColor: "white"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#1e3c72";
                        e.target.style.color = "#1e3c72";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e3f2fd";
                        e.target.style.color = "#1e3c72";
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                style={{
                  width: "100%",
                  padding: "15px",
                  backgroundColor: isFormValid ? "#1e3c72" : "#cccccc",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: isFormValid ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  boxShadow: isFormValid ? "0 4px 15px rgba(30, 60, 114, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  opacity: isFormValid ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (isFormValid) {
                    e.currentTarget.style.backgroundColor = "#2a5298";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFormValid) {
                    e.currentTarget.style.backgroundColor = "#1e3c72";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
                title={!isFormValid ? "Please fill in all required fields" : ""}
              >
                Predict MVP Chances
              </button>
            </form>

            {/* Prediction Result */}
            <div style={{
              marginTop: "2rem",
              padding: "1.5rem",
              backgroundColor: "#f8f9ff",
              borderRadius: "10px",
              border: "2px solid #e3f2fd"
            }}>
              <h3 style={{
                color: "#1e3c72",
                marginBottom: "1rem",
                fontSize: "1.3rem"
              }}>
                Prediction Result:
              </h3>
              <p style={{
                color: "#2c3e50",
                fontSize: "1.1rem",
                lineHeight: "1.5",
                margin: 0
              }}>
                {prediction}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Chat Interface */}
        <div style={{ 
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-start',
          paddingTop: '1rem'
        }}>
          <ChatInterface
            predictionData={predictionData}
          />
        </div>
      </div>
    </div>
  );
}