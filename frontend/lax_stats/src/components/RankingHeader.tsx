import "./RankingHeader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useState, useEffect } from "react";
import { Tooltip } from "bootstrap";


interface Props{
	league: String;
	title1: String;
	title2: String;
	title3: String;
}


const RankingHeader = ({league, title1, title2, title3} : Props) => {

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

  // data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top"

  return (
    <div className="list-group-item ranking-header">
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
  );
};

export default RankingHeader;
