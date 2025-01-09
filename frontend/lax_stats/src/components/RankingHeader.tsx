import "./RankingHeader.css";

interface Props{
	league: String;
	title1: String;
	title2: String;
	title3: String;
}

const RankingHeader = ({league, title1, title2, title3} : Props) => {
  return (
    <div className="list-group-item ranking-header">
      <div className="ranking-title">{league}</div>
      <div className="stats-titles">
        <span>{title1}</span>
        <span>{title2}</span>
        <span>{title3}</span>
      </div>
    </div>
  );
};

export default RankingHeader;
