import "./Ranking.css";
import ListGroup from "react-bootstrap/ListGroup";

interface Props {
  rank: number;
  teamName: String;
  fullName: String;
  wins: number;
  losses: number;
  rating: number;
  schedule: number;
  year: number
  logo_url: string;
}

const Ranking = ({
  rank,
  teamName,
  fullName,
  wins,
  losses,
  rating,
  schedule,
  year,
  logo_url,
}: Props) => {
  const team_url = `https://mcla.us/teams/${fullName.replace(" ", "-")}/${year}/schedule`;
  return (
    <ListGroup.Item className={rank % 2 === 0 ? "even" : "odd"}>
      <div className="team-info">
        <span className="team-number">{rank}</span>
        <img className="team-img" src={logo_url} />
        <a className="team-link" href={team_url} target="_blank">
          <span className="team-name">{teamName}</span>
        </a>
      </div>
      <div className="team-stats">
        <span>{wins + "-" + losses}</span>
        <span>{rating}</span>
        <span>{schedule}</span>
      </div>
    </ListGroup.Item>
  );
};

export default Ranking;
