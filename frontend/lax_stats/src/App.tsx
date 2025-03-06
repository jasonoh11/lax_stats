import "./App.css";
import RankingList from "./components/RankingList";
import Nav from "./components/NavBar";

function App() {
  return (
    <div className="app-wrapper">
      <Nav />
      <div className="main-wrapper">
        <div className="main-card">
          <RankingList />
        </div>
        <div className="side-bar">
          <div className="section">
            <h2>Why the Rankings?</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at
              velit sem. Maecenas nunc tortor, dapibus tristique urna et,
              pretium lobortis ex. Suspendisse hendrerit magna vitae turpis
              laoreet lobortis. Etiam pellentesque nibh pulvinar, ultrices quam
              in, aliquam dui. Pellentesque eget diam id diam maximus iaculis.
            </p>
          </div>
          <div className="section">
            <h2>How Rankings Work</h2>
            <p>
              Proin accumsan est a mauris consectetur lobortis. Vivamus aliquam
              iaculis est. Nunc odio quam, posuere eu nulla vel, pretium feugiat
              ligula. Orci varius natoque penatibus et magnis dis parturient
              montes, nascetur ridiculus mus. Etiam mattis tincidunt ultrices.
              Etiam eu gravida tellus. Aenean at nunc efficitur felis feugiat
              fringilla. Etiam sed aliquet lorem.
            </p>
          </div>
          <div className="section">
            <h2>Methodology</h2>
            <p>
              Duis ut diam eleifend metus mattis consectetur sed vitae sem.
              Phasellus vitae nisl fringilla, pulvinar est suscipit, efficitur
              leo. Nunc nulla est, lobortis ac nulla ut, venenatis malesuada
              arcu. Ut at lorem id purus varius faucibus. Cras imperdiet iaculis
              ante quis vehicula. Nullam consectetur risus quis massa blandit
              pharetra. Mauris eros felis, efficitur nec lacinia vitae, aliquet
              ac risus.
            </p>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <p>2025 MCLAIndex.</p>
          <p>|</p>
          <p>Developed by Jason Oh</p>
          <p>|</p>
          <p>
            <a
              href="https://github.com/jasonoh11/lax_stats"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit my GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
