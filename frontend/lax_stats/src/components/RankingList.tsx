import "./RankingList.css";
import Ranking from "./Ranking";
import { useState, useEffect } from "react";
import RankingHeader from "./RankingHeader";
import ListGroup from "react-bootstrap/ListGroup";

const RankingList = () => {
  var [teams, setTeams] = useState([]);
  var [sortingCriteria, setSortingCriteria] = useState("Rating");
  var [division, setDivision] = useState(1);
  var [year, setYear] = useState(2024);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const url = `${apiUrl}/api/teams?sort_by=${sortingCriteria.toLowerCase()}&division=${division}&year=${year}`;
    
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
  }, [sortingCriteria, division, year]);

  const handleSortChange = (newSort: string) => {
    setSortingCriteria(newSort);
  };

  const handleDivisionChange = (newDivision: number) => {
    setDivision(newDivision);
  }

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  }

  return (
    <>
      <ListGroup>
        <RankingHeader
          title1="Record"
          title2="Rating"
          title3="Schedule"
          sortingCriteria={sortingCriteria}
          onSortChange={handleSortChange}
          division={division}
          onDivisionChange={handleDivisionChange}
          year={year}
          onYearChange={handleYearChange}
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
