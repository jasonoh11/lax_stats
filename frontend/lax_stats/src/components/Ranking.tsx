import "./Ranking.css"

interface Props  {
	teamName: String;
	wins: String;
	losses: String;
}

const Ranking = ({teamName, wins, losses}: Props) => {
  return (
	<div className = "ranking-container list-group-item">
		<div className = "team-info">
			<span>#</span>
			<span>img</span>
			<span>{teamName}</span>
		</div>
		<div className = "team-stats">
			<span>{wins + "-" + losses}</span>
			<span>00.0</span>
			<span>00.0</span>
		</div>
	</div>

  )
}

export default Ranking;