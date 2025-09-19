"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Header from "./components/Header";

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/predict", {
        ...Object.fromEntries(
          Object.entries(input).map(([k, v]) => [k, parseFloat(v)])
        ),
      });
      if (res.data && typeof res.data.mvp !== "undefined") {
        setPrediction(
          res.data.mvp
            ? "That is high enough and they would likely win MVP"
            : "That is not high enough and they would likely not win MVP"
        );
      } else {
        setPrediction("Prediction unavailable.");
      }
    } catch {
      setPrediction("Error making prediction.");
    }
  };

  return (
    <div>
      <div style={{ 
        fontFamily: "Arial, sans-serif", 
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)", 
        minHeight: "100vh", 
        padding: 0 
      }}>
        <div style={{ padding: "3rem 2rem" }}>
          <h1 style={{ 
            color: "#1e3c72", 
            textAlign: "center", 
            fontSize: "3rem", 
            marginBottom: "1rem",
            fontWeight: "900",
            letterSpacing: "2px",
            textShadow: "2px 2px 4px rgba(30, 60, 114, 0.2)"
          }}>
            NFL MVP Predictor
          </h1>
          <p style={{ 
            color: "#2a5298", 
            fontSize: "1.2rem", 
            maxWidth: 800, 
            margin: "0 auto 3rem auto", 
            lineHeight: 1.8, 
            textAlign: "center",
            fontWeight: "400"
          }}>
            Enter quarterback statistics to predict their likelihood of winning the NFL MVP award. 
            The machine learning model analyzes key performance metrics to determine MVP probability 
            based on historical data from the past 7 seasons.
          </p>
          <div className="container" style={{ 
            backgroundColor: "#ffffff", 
            padding: "3rem", 
            borderRadius: "20px", 
            margin: "3rem auto", 
            boxShadow: "0 20px 40px rgba(30, 60, 114, 0.15)", 
            maxWidth: "1300px",
            border: "1px solid #e1f5fe"
          }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 25 }}>
              <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 25 }}>
                {(Object.keys(initialInput) as Array<keyof InputFields>).map((key) => (
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", textAlign: "left" }} key={key}>
                    <label htmlFor={key} style={{ 
                      fontWeight: "bold", 
                      marginBottom: 8, 
                      color: "#1e3c72", 
                      fontSize: "1.1rem",
                      textTransform: "capitalize"
                    }}>
                      {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
                    </label>
                    <input
                      type="number"
                      step={key === "epa_per_play" ? "0.0001" : key === "passer_rating" || key === "qbr_total" || key === "epa_total" ? "0.1" : "1"}
                      id={key}
                      name={key}
                      value={input[key]}
                      onChange={handleChange}
                      required
                      style={{ 
                        padding: "14px 16px", 
                        border: "2px solid #90caf9", 
                        borderRadius: "10px", 
                        fontSize: "1rem", 
                        width: "100%", 
                        boxSizing: "border-box",
                        color: "#1e3c72",
                        backgroundColor: "#f8fdff",
                        transition: "all 0.3s ease",
                        fontWeight: "500"
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#1e3c72";
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.boxShadow = "0 0 10px rgba(30, 60, 114, 0.2)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#90caf9";
                        e.currentTarget.style.backgroundColor = "#f8fdff";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
              <button 
                type="submit" 
                style={{ 
                  padding: "16px 32px", 
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", 
                  color: "#ffffff", 
                  border: "none", 
                  borderRadius: "12px", 
                  fontSize: "1.2rem", 
                  cursor: "pointer", 
                  transition: "all 0.3s ease",
                  fontWeight: "bold",
                  marginTop: "1.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  boxShadow: "0 8px 20px rgba(30, 60, 114, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(30, 60, 114, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(30, 60, 114, 0.3)";
                }}
              >
                Predict MVP Probability
              </button>
            </form>
            {prediction && (
              <div style={{
                marginTop: "2rem",
                padding: "2rem",
                backgroundColor: "#e3f2fd",
                borderRadius: "15px",
                border: "2px solid #90caf9",
                textAlign: "center"
              }}>
                <h2 style={{ 
                  color: "#1e3c72", 
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  margin: 0
                }}>
                  Prediction: {prediction}
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}