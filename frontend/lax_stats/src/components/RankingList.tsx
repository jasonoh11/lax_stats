import "./RankingList.css";
import Ranking from "./Ranking";
import React, { useState, useEffect } from "react";
import RankingHeader from "./RankingHeader";
import ListGroup from 'react-bootstrap/ListGroup';

const RankingList = () => {
  var [teams, setTeams] = useState([]);
  var [sortingCriteria, setSortingCriteria] = useState("Rating");

  useEffect(() => {
    const url = `http://localhost:3000/api/teams?sort_by=${sortingCriteria.toLowerCase()}`;
    console.log(url)
    fetch(url, { mode: "cors" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTeams(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [sortingCriteria]);


  const handleSortChange = (newSort: string) => {
    setSortingCriteria(newSort);
  }

  return (
    <>
      <ListGroup>
      <RankingHeader league="MCLA D1" title1="Record" title2="Rating" title3="Schedule" sortingCriteria={sortingCriteria} onSortChange={handleSortChange}/>
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
    </ListGroup>
    </>
  );
};

export default RankingList;
