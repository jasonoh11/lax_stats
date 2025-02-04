import "./RankingHeader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useState, useEffect } from "react";
import { Tooltip } from "bootstrap";
import Dropdown from "react-bootstrap/Dropdown";

interface Props {
  league: String;
  title1: String;
  title2: String;
  title3: String;
  sortingCriteria: String;
  onSortChange: (newSort: String) => void;
  leagueID: number;
  onLeagueChange: (newID: number) => void;
}

const RankingHeader = ({
  league,
  title1,
  title2,
  title3,
  sortingCriteria,
  onSortChange,
  leagueID,
  onLeagueChange,
}: Props) => {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );

    // Clean up tooltips on unmount
    return () => {
      tooltipList.forEach((tooltip) => tooltip.dispose());
    };
  }, []);

  let leagueMap = new Map<number, string>([
    [1, "MCLA D1"],
    [2, "MCLA D2"],
  ]);

  return (
    <div className="list-group-item ranking-header">
      <div className="header-labels">
        <Dropdown className="ranking-title">
          <Dropdown.Toggle
            className="league-title"
            size="sm"
            variant="outline-light"
            id="dropdown-alert"
          >
            {leagueMap.get(leagueID)}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1" onClick={() => onLeagueChange(1)}>
            {leagueMap.get(1)}
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={() => onLeagueChange(2)}>
            {leagueMap.get(2)}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {/* <button onClick={() => onLeagueChange(leagueID == 2 ? 1 : 2)}>
          {leagueID}
        </button> */}
        <div className="stats-titles">
          <span>{title1}</span>
          <div>
            <i
              className={
                "bi hover-effect bi-funnel" +
                (sortingCriteria == "Rating" ? "-fill" : "")
              }
              onClick={() => onSortChange("Rating")}
            ></i>
            <span>{title2}</span>
          </div>
          <div>
            <i
              className={
                "bi hover-effect bi-funnel" +
                (sortingCriteria == "Schedule" ? "-fill" : "")
              }
              onClick={() => onSortChange("Schedule")}
            ></i>
            <span>{title3}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingHeader;
