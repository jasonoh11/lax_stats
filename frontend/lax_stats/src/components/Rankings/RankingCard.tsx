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
  sortingCriteria: String;
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
  sortingCriteria
}: Props) => {
  const team_url = `https://mcla.us/teams/${urlName}/${year}/schedule`;

  return (
    <div className="ranking-card">
      <div className="card-left">
        <span className="team-number">#{rank}</span>
      </div>
      <div className="card-right">
        <div className="team-info">
          <img src={logo_url} className="team-img" />
          <div className="team-details">
            <a className="team-link" href={team_url} target="_blank">
              <span className="team-name">{teamName}</span>
            </a>
            <span className="team-record">
              {wins}-{losses}
            </span>
          </div>
        </div>
        <div className="rating-info">
          <div className="team-rating">{sortingCriteria === "Rating" ? rating : schedule}</div>
          <div className="schedule-info">
            <span className="schedule-label">{sortingCriteria === "Rating" ? "SOS:" : "Rating:"}</span>{" "}
            <span>{sortingCriteria === "Rating" ? schedule : rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingCard;
