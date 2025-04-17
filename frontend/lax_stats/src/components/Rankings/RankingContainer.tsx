import "./RankingContainer.css";
import Ranking from "./RankingTableEntry";
import { useState, useEffect } from "react";
import RankingHeader from "./RankingHeader";
import ListGroup from "react-bootstrap/ListGroup";
import RankingCard from "./RankingCard";
import RankingDropdowns from "./RankingDropdowns";

const RankingContainer = () => {
  var [teams, setTeams] = useState([]);
  var [sortingCriteria, setSortingCriteria] = useState("Rating");
  var [division, setDivision] = useState(1);
  var [year, setYear] = useState(2025);
  var [expanded, setExpanded] = useState(false);

  var [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const url = `${apiUrl}/api/teams?sort_by=${sortingCriteria.toLowerCase()}&division=${division}&year=${year}`;
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
  }, [sortingCriteria, division, year]);

  const handleSortChange = (newSort: string) => {
    setSortingCriteria(newSort);
  };

  const handleDivisionChange = (newDivision: number) => {
    setDivision(newDivision);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  if (isMobile) {
    return (
      <>
        <div className="ranking-cards-header">
          <RankingDropdowns
            division={division}
            onDivisionChange={handleDivisionChange}
            year={year}
            onYearChange={handleYearChange}
            sortingCriteria={sortingCriteria}
            onSortChange={handleSortChange}
            isMobile={true}
          />
        </div>
        <div
          className={`ranking-cards-wrapper${!expanded ? " limit-height" : ""}`}
        >
          {teams.map((team, index) => (
            <RankingCard
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
              sortingCriteria={sortingCriteria}
            />
          ))}
        </div>
        <div
          className="ranking-expand-row"
          onClick={() => setExpanded(!expanded)}
        >
          <span>Show {expanded ? "Less ▴" : "More ▾"}</span>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="ranking-list-wrapper">
          <ListGroup>
            <div className="list-group-item ranking-header">
              <RankingDropdowns
                division={division}
                onDivisionChange={handleDivisionChange}
                year={year}
                onYearChange={handleYearChange}
                sortingCriteria={sortingCriteria}
                onSortChange={handleSortChange}
                isMobile={false}
              />
              <RankingHeader
                sortingCriteria={sortingCriteria}
                onSortChange={handleSortChange}
              />
            </div>
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
        </div>
      </>
    );
  }
};

export default RankingContainer;
