"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

type Player = {
  season: number;
  name_first: string;
  name_last: string;
  team: string;
  wins: number;
  losses: number;
  passing_yards: number;
  passing_tds: number;
  interceptions: number;
  rushing_yards: number;
  rushing_tds: number;
  passer_rating: number;
  qbr_total: number;
  epa_total: number;
  qb_plays: number;
  epa_per_play: number;
  sacks: number;
  mvp: number;
};

type Record = {
  team: string;
  year: number;
  wins: number;
  losses: number;
};

export default function PastWinners() {
  const [mvpData, setMvpData] = useState<Player[]>([]);
  const [recordData, setRecordData] = useState<Record[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/data")
      .then((res) => {
        const allData: Player[] = res.data;
        setMvpData(allData.filter((player) => player.mvp === 1));
        setRecordData(
          allData.map((player) => ({
            team: player.team,
            year: player.season,
            wins: player.wins,
            losses: player.losses,
          }))
        );
      })
      .catch(() => setMvpData([]));
  }, []);

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
            marginBottom: "2rem",
            fontWeight: "900",
            letterSpacing: "2px",
            textShadow: "2px 2px 4px rgba(30, 60, 114, 0.2)"
          }}>
            Past MVP Winners
          </h1>
          <p style={{ 
            color: "#2a5298", 
            fontSize: "1.2rem", 
            maxWidth: 1000, 
            margin: "0 auto 3rem auto", 
            lineHeight: 1.8, 
            textAlign: "center",
            fontWeight: "400"
          }}>
            Explore the statistical achievements of NFL MVP winners from the past 7 seasons. 
            These are the quarterbacks who dominated their respective years and earned the league&apos;s most prestigious individual award.
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
            <h2 style={{ 
              color: "#1e3c72", 
              fontSize: "2rem", 
              fontWeight: "bold", 
              marginBottom: "2rem",
              textAlign: "center",
              letterSpacing: "1px"
            }}>
              MVP Winners - Past 7 Years
            </h2>
            <div style={{ overflowX: "auto", borderRadius: "15px", border: "2px solid #90caf9" }}>
              <table style={{ 
                textAlign: "center", 
                borderCollapse: "collapse", 
                width: "100%",
                backgroundColor: "#ffffff"
              }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" }}>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Year</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Player Name</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Team</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Record</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Pass Yds</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Pass TDs</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>INTs</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Rush Yds</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Rush TDs</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Rating</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>QBR</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>EPA</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Plays</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>EPA/Play</th>
                    <th style={{ border: "1px solid #90caf9", padding: "16px", color: "#ffffff", fontWeight: "bold", fontSize: "0.9rem" }}>Sacks</th>
                  </tr>
                </thead>
                <tbody>
                  {mvpData.map((player, idx) => (
                    <tr key={idx} style={{ 
                      backgroundColor: idx % 2 === 0 ? "#f8fdff" : "#e3f2fd",
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#bbdefb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#f8fdff" : "#e3f2fd";
                    }}
                    >
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72", fontWeight: "500" }}>{player.season}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72", fontWeight: "600" }}>{player.name_first} {player.name_last}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#2a5298", fontWeight: "500" }}>{player.team}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72", fontWeight: "500" }}>{(() => {
                        const record = recordData.find(
                          (r) => r.team === player.team && r.year === player.season
                        );
                        return record ? `${record.wins}-${record.losses}` : "";
                      })()}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.passing_yards}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.passing_tds}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.interceptions}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.rushing_yards}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.rushing_tds}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.passer_rating}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.qbr_total}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.epa_total}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.qb_plays}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.epa_per_play}</td>
                      <td style={{ border: "1px solid #90caf9", padding: "12px", color: "#1e3c72" }}>{player.sacks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}