import "./RankingHeader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface Props {
  sortingCriteria: String;
  onSortChange: (newSort: string) => void;
}

const RankingHeader = ({
  sortingCriteria,
  onSortChange
}: Props) => {

  return (
    <div className="header-labels">
      <div className="team-titles">
        <span>Rank</span>
      </div>
      <div className="stats-titles">
        <span>Record</span>
        <div>
          <i
            className={
              "bi hover-effect bi-funnel" +
              (sortingCriteria == "Rating" ? "-fill" : "")
            }
            onClick={() => onSortChange("Rating")}
          ></i>
          <span>Rating</span>
        </div>
        <div>
          <i
            className={
              "bi hover-effect bi-funnel" +
              (sortingCriteria == "Schedule" ? "-fill" : "")
            }
            onClick={() => onSortChange("Schedule")}
          ></i>
          <span>Schedule</span>
        </div>
      </div>
    </div>
  );
};

export default RankingHeader;
