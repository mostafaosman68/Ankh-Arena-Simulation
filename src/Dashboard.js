import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";


const Dashboard = ({ email1 }) => {
  const [userInfo, setUserInfo] = useState({
    name: "", // Now it starts as an empty string
    teamName: "Golden Pharaohs",
    rank: 512,
    points: 1543,
    gameweekPoints: 67,
    totalTransfers: 25,
    budget: "98.5M",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!email1) return; // Prevent unnecessary fetch calls

      try {
        //  const response = await axios.post('http://localhost:5000/api/getUserInfo', { email: userEmail });
        const response = await fetch("http://localhost:5000/api/getUserInfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email1 }),
        });

        const data = await response.json();
        
        if (data.success && data.nameusr) {
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            name: data.nameusr, // Updating the name with fetched data
          }));
        } else {
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            name: "User Not Found", // Default if no user is returned
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          name: "Error Loading Name",
        }));
      }
    };

    fetchUserData();
  }, [email1]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Fantasy Dashboard</h1>
        <h2>Welcome, {userInfo.name} yasmina!</h2> 
      </header>

      <div className="profile-section">
        <div className="profile-card">
          <h3>{userInfo.teamName}</h3>
          <p>Rank: #{userInfo.rank}</p>
          <p>Total Points: {userInfo.points}</p>
          <p>Gameweek Points: {userInfo.gameweekPoints}</p>
          <p>Total Transfers: {userInfo.totalTransfers}</p>
          <p>Budget: {userInfo.budget}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 