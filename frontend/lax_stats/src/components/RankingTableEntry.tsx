import "./RankingTableEntry.css";
import ListGroup from "react-bootstrap/ListGroup";

interface Props {
  rank: number;
  teamName: String;
  urlName: String;
  wins: number;
  losses: number;
  rating: number;
  schedule: number;
  year: number
  logo_url: string;
}

const RankingTableEntry = ({
  rank,
  teamName,
  urlName,
  wins,
  losses,
  rating,
  schedule,
  year,
  logo_url,
}: Props) => {
  const team_url = `https://mcla.us/teams/${urlName}/${year}/schedule`;
  return (
    <ListGroup.Item className="list-group-team">
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

export default RankingTableEntry;
