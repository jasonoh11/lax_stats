import "./RankingDropdowns.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useState, useEffect } from "react";

const divisions = [1, 2];
const years = [2025, 2024];

interface Props {
  division: number;
  onDivisionChange: (newDivision: number) => void;
  year: number;
  onYearChange: (newYear: number) => void;
}

const RankingDropdowns = ({
  division,
  onDivisionChange,
  year,
  onYearChange,
}: Props) => {
  var [lastUpdated, setLastUpdated] = useState("");

  const handleSelect = (division: number, year: number) => {
    onDivisionChange(division);
    onYearChange(year);
  };

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const url = `${apiUrl}/api/leagues?division=${division}&year=${year}`;

    fetch(url, { mode: "cors" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.length > 0 && data[0].last_updated) {
          setLastUpdated(
            new Date(data[0].last_updated)
              .toLocaleString("en-CA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
              .replace(",", "")
          );
        } else {
          setLastUpdated("N/A");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [division, year]);

  return (
    <div className="header-container">
      <div className="header-dropdowns">
        <DropdownButton
          title={`Division ${division}`}
          className="dropdown-button"
          variant="outline-dark"
          onSelect={(eventKey) => {
            if (eventKey) {
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
          className="dropdown-button"
          variant="outline-dark"
          onSelect={(eventKey) => {
            if (eventKey) {
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
      </div>
      <div className="last-updated">
        Updated: <span>{lastUpdated}</span>
      </div>
    </div>
  );
};

export default RankingDropdowns;
