import "./RankingList.css";
import Ranking from "./Ranking";
import React, { useState, useEffect } from "react";
import RankingHeader from "./RankingHeader";

const RankingList = () => {
  var [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/teams", { mode: "cors" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTeams(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  return (
    <ul className="list-group">
      <RankingHeader league="MCLA D1" title1="Record" title2="Rating" title3="Schedule"/>
      {teams.map((team, index) => (
        <Ranking
          key={index}
          rank={index + 1}
          teamName={team["team_name"]}
          wins={team["wins"]}
          losses={team["losses"]}
          rating={team["rating"]}
          schedule={team["schedule"]}
          logo_url={team["logo_url"]}
        />
      ))}
    </ul>
  );
};

export default RankingList;
