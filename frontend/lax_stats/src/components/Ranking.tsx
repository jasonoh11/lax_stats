import "./Ranking.css"
 
interface Props  {
	rank: number;
	teamName: String;
	wins: number;
	losses: number;
	rating: number;
	logo_url: string
}

const Ranking = ({rank, teamName, wins, losses, rating, logo_url}: Props) => {
  return (
	<div className = {rank % 2 === 0 ? "list-group-item even" : "list-group-item odd"}>
		<div className = "team-info">
			<span className = "team-number">{rank}</span>
			<img className = "team-img" src = {logo_url}/>
			<span className = "team-name">{teamName}</span>
		</div>
		<div className = "team-stats">
			<span>{wins + "-" + losses}</span>
			<span>{rating}</span>
			<span>00.0</span>
		</div>
	</div>

  )
}

export default Ranking;