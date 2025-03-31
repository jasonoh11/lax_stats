import "./SideBar.css";

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
            <i className="bi bi-check-lg"></i> Margin of victory
          </li>
          <li>
            <i className="bi bi-check-lg"></i> Strength of opponents
          </li>
        </ul>
        <p className="description">
          A team's strength of schedule is calculated as the average rating of all
          opponents they have played, meaning it is not an input in the rating
          calculation but rather a product of it.
        </p>
        <a href="/how-it-works" className="link">
          <strong>
            Learn More <i className="bi bi-arrow-right-short"></i>
          </strong>
        </a>
      </div>
      <div className="side-bar-card">
        <h2>Why the Rankings?</h2>
        <p>
          MCLAIndex provides an unbiased ranking based purely on performance.
          While other rankings, like the official{" "}
          <a
            href="https://mcla.us/polls?division_id=d1&week_key=week-4"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            <strong>Coaches Poll</strong>
          </a>{" "}
          (voted on by 27 coaches) and the{" "}
          <a
            href="https://www.instagram.com/varsityclublacrosse/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            <strong>Varsity Club Lacrosse x ULAX rankings</strong>
          </a>{" "}
          offer valuable perspectives, they naturally include personal biases.
          MCLAIndex removes that subjectivity by evaluating teams solely by
          their results.
        </p>
        <p>
          These rankings are meant to complement rather than replace existing polls, serving
          as an objective reference point to evaluate team performance. At the
          end of the day, no ranking model is perfect, which is why across all
          major sports, humans have the final decision on rankings and
          tournament seedings.
        </p>
        <a href="/about" className="link">
          <strong>
            About <i className="bi bi-arrow-right-short"></i>
          </strong>
        </a>
      </div>
    </div>
  );
}

export default SideBar;
