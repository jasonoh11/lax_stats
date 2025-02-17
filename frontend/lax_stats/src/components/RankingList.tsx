import "./RankingList.css";
import Ranking from "./Ranking";
import React, { useState, useEffect } from "react";
import RankingHeader from "./RankingHeader";
import ListGroup from "react-bootstrap/ListGroup";

const RankingList = () => {
  var [teams, setTeams] = useState([]);
  var [sortingCriteria, setSortingCriteria] = useState("Rating");
  var [leagueID, setLeagueID] = useState(1);

  useEffect(() => {
    const url = `http://localhost:3000/api/teams?sort_by=${sortingCriteria.toLowerCase()}&league_id=${leagueID}`;
    console.log(url);
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
  }, [sortingCriteria, leagueID]);

  const handleSortChange = (newSort: string) => {
    setSortingCriteria(newSort);
  };

  const handleLeagueChange = (newID: number) => {
    setLeagueID(newID);
  };

  return (
    <>
      <ListGroup>
        <RankingHeader
          league="MCLA D1"
          title1="Record"
          title2="Rating"
          title3="Schedule"
          sortingCriteria={sortingCriteria}
          onSortChange={handleSortChange}
          leagueID={leagueID}
          onLeagueChange={handleLeagueChange}
        />
        {teams.map((team, index) => (
          <Ranking
            key={index}
            rank={index + 1}
            teamName={team["team_name"]}
            urlName={team["url_name"]}
            wins={team["wins"]}
            losses={team["losses"]}
            rating={team["rating"]}
            schedule={team["schedule"]}
            year={team["year"]}
            logo_url={team["logo_url"]}
          />
        ))}
      </ListGroup>
    </>
  );
};

export default RankingList;
