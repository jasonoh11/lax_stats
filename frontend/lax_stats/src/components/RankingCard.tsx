import "./RankingCard.css";

interface Props {
  rank: number;
  teamName: String;
  urlName: String;
  wins: number;
  losses: number;
  rating: number;
  schedule: number;
  year: number;
  logo_url: string;
}

const RankingCard = ({
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
    <div className="ranking-card">
      <div className="card-top">
        <div className="team-info">
          <img src={logo_url} className="team-img" />
          <div className="team-details">
            <a className="team-link" href={team_url} target="_blank">
              <span className="team-name">{teamName}</span>
            </a>
            <div className="team-number">Rank {rank}</div>
          </div>
        </div>
        <div className="rating-info">
          <div className="team-rating">{rating}</div>
          <div className="rating-label">Rating</div>
        </div>
      </div>
      <div className="card-bottom">
        <div className="record-info">
          <span className="record-label">Record:</span>{" "}
          <span>
            {wins}-{losses}
          </span>
        </div>
        <div className="schedule-info">
          <span className="schedule-label">Schedule:</span>{" "}
          <span>{schedule}</span>
        </div>
      </div>
    </div>
  );
};

export default RankingCard;
