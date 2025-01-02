import "./RankingList.css";
import Ranking from "./Ranking"

const RankingList = () => {
  return (
    <ul className="list-group">
      <li className="list-group-item">
        <Ranking></Ranking>
      </li>
      <li className="list-group-item">A second item</li>
      <li className="list-group-item">A third item</li>
      <li className="list-group-item">A fourth item</li>
      <li className="list-group-item">And a fifth one</li>
    </ul>
  );
};

export default RankingList;
