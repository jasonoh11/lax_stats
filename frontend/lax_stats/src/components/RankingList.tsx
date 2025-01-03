import "./RankingList.css";
import Ranking from "./Ranking"

const RankingList = () => {
  return (
    <ul className="list-group">
      <li className="list-group-item">
        <Ranking></Ranking>
      </li>
      <li className="list-group-item">
        <Ranking></Ranking>
      </li>
      <li className="list-group-item">
        <Ranking></Ranking>
      </li>
      <li className="list-group-item">
        <Ranking></Ranking>
      </li>
      <li className="list-group-item">
        <Ranking></Ranking>
      </li>
    </ul>
  );
};

export default RankingList;
