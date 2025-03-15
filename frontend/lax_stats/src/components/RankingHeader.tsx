import "./RankingHeader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import  { useState, useEffect } from "react";
import { Tooltip } from "bootstrap";
import { Dropdown, DropdownButton } from "react-bootstrap";

const divisions = [1, 2];
const years = [2025, 2024];

interface Props {
  title1: String;
  title2: String;
  title3: String;
  sortingCriteria: String;
  onSortChange: (newSort: string) => void;
  division: number;
  onDivisionChange: (newDivision: number) => void;
  year: number;
  onYearChange: (newYear: number) => void;
}

const RankingHeader = ({
  title1,
  title2,
  title3,
  sortingCriteria,
  onSortChange,
  division,
  onDivisionChange,
  year,
  onYearChange,
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

  // const [selected, setSelected] = useState(`MCLA D${division} - ${year}`);


  const handleSelect = (division: number, year: number) => {
    // setSelected(`MCLA D${division} - ${year}`);
    onDivisionChange(division);
    onYearChange(year);
  };

  return (
    <div className="list-group-item ranking-header">
      <div className="header-dropdowns">
        <DropdownButton
          title={`Division ${division}`}
          className="ranking-title"
          variant="outline-dark"
          onSelect={(eventKey) => {
            if (eventKey){
              const division = parseInt(eventKey, 10);
              handleSelect(division, year);
            }
          }}
        >
          {divisions.map((division) => (
            <Dropdown.Item key={division} eventKey={division}>
              {`Division ${division}`}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          title={year}
          className="ranking-title"
          variant="outline-dark"
          onSelect={(eventKey) => {
            if (eventKey){
              const year = parseInt(eventKey, 10);
              handleSelect(division, year);
            }
          }}
        >
          {years.map((year) => (
            <Dropdown.Item key={year} eventKey={year}>
              {year}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        {/* <DropdownButton
          title={selected}
          className="ranking-title"
          variant="outline-dark"
          onSelect={(eventKey) => {
            if (eventKey){
              const [divStr, yearStr] = eventKey.split(" ");
              const division = parseInt(divStr, 10);
              const year = parseInt(yearStr, 10);
              handleSelect(division, year);
            }
          }}
        >
          {years.map((year) => (
            <React.Fragment key={year}>
              <Dropdown.Header>{year}</Dropdown.Header>
              {divisions.map((division) => (
                <Dropdown.Item
                  key={`${division}-${year}`}
                  eventKey={`${division} ${year}`}
                >
                  {`Division ${division}`}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
            </React.Fragment>
          ))}
        </DropdownButton> */}
      </div>
      <div className="header-labels">
        <div className="team-titles">
          <span>Rank</span>
        </div>
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
