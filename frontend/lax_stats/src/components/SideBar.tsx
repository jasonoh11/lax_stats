import "./SideBar.css"

function SideBar() {
  return (
    <div className="side-bar">
      <div className="side-bar-card">
        <h2 className="heading">About These Rankings</h2>
        <p className="description">
          Our ranking system evaluates team performance using a modified
          PageRank algorithm, which takes into account the following factors:
        </p>
        <ul className="criteria-list">
          <li>
            <i className="bi bi-check-lg"></i> Head-to-head results
          </li>
          <li>
            <i className="bi bi-check-lg"></i> Margin of victory
          </li>
          <li>
            <i className="bi bi-check-lg"></i> Strength of opponents
          </li>
        </ul>
        <p className="description">
          The model does <strong>not</strong> account for recent performance or
          home vs. away games, meaning all games are weighted equally regardless
          of when or where they were played.
        </p>
        <p className="description">
          A team's schedule score is calculated as the average rating of all
          opponents they have played, meaning it is not an input in the rating
          calculation but rather a product of it.
        </p>
        <a href="" className="link">
          <strong>
            Learn More <i className="bi bi-arrow-right-short"></i>
          </strong>
        </a>
      </div>
      <div className="side-bar-card">
        <h2>Why the Rankings?</h2>
        <p>
          MCLAIndex provides an unbiased ranking based purely on performance.
          Other rankings, like the official Coaches Poll (voted on by 27
          coaches) and the Varsity Club Lacrosse x ULAX rankings, are valuable
          but naturally influenced by personal biases. MCLAIndex removes that
          subjectivity by evaluating teams solely by their results. These
          rankings aren’t a definitive statement on who’s best but a useful tool
          to compare resumes and understand team strength.
        </p>
      </div>
    </div>
  );
}

export default SideBar;
