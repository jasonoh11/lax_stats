import "./Ranking.css"
import ListGroup from 'react-bootstrap/ListGroup';
 
interface Props  {
	rank: number;
	teamName: String;
	wins: number;
	losses: number;
	rating: number;
	schedule: number;
	logo_url: string
}

const Ranking = ({rank, teamName, wins, losses, rating, schedule, logo_url}: Props) => {
  return (

	<ListGroup.Item className = {rank % 2 === 0 ? "even" : "odd"}>
		<div className = "team-info">
			<span className = "team-number">{rank}</span>
			<img className = "team-img" src = {logo_url}/>
			<span className = "team-name">{teamName}</span>
		</div>
		<div className = "team-stats">
			<span>{wins + "-" + losses}</span>
			<span>{rating}</span>
			<span>{schedule}</span>
		</div>
	</ListGroup.Item>

  )
}

export default Ranking;