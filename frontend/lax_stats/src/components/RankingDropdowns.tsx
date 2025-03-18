import "./RankingDropdowns.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Dropdown, DropdownButton } from "react-bootstrap";

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

  const handleSelect = (division: number, year: number) => {
    onDivisionChange(division);
    onYearChange(year);
  };

  return (
	<div className="header-dropdowns">
	<DropdownButton
		title={`Division ${division}`}
		className="dropdown-button"
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
		className="dropdown-button"
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
	</div>
  );
};

export default RankingDropdowns;
