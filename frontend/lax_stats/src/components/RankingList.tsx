import "./RankingList.css";
import Ranking from "./Ranking";
import React, { useState, useEffect } from "react";

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
      {teams.map((team, index) => (
        <Ranking
          key={index}
          rank={index + 1}
          teamName={team["team_name"]}
          wins={team["wins"]}
          losses={team["losses"]}
          logo_url={team["logo_url"]}
        />
      ))}
    </ul>
  );
};

export default RankingList;
