import "./RankingHeader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useState, useEffect } from "react";
import { Tooltip } from "bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';

interface Props{
	league: String;
	title1: String;
	title2: String;
	title3: String;
  sortingCriteria: String;
  onSortChange: (newSort: String) => void;
}


const RankingHeader = ({league, title1, title2, title3, sortingCriteria, onSortChange} : Props) => {

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );

    // Clean up tooltips on unmount
    return () => {
      tooltipList.forEach((tooltip) => tooltip.dispose());
    };
}, []);

  // var [selectedSort, setSort] = useState("Sort By")

  return (
    <div className="list-group-item ranking-header">
      <div className="header-dropdowns border-bottom">
      <Dropdown>
      <Dropdown.Toggle variant="outline-light" id="dropdown-basic" className="dropdown-toggle" size="sm">
          {sortingCriteria}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => onSortChange("Rating")}>Rating</Dropdown.Item>
          <Dropdown.Item onClick={() => onSortChange("Schedule")}>Schedule</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </div>
      <div className="header-labels">
        <div className="ranking-title">Team</div>
        <div className="stats-titles">
          <span>{title1}</span>
          <div>
            <span>{title2}</span>
              <i className="bi bi-info-circle info-tooltip" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="This is my tooltip"></i>
          </div>
          <span>{title3}</span>
        </div>
      </div>
    </div>
  );
};

export default RankingHeader;
