import "./Home.css";
import RankingTable from "./Rankings/RankingContainer";
import SideBar from "./SideBar";
import Footer from "./Footer";

function Home() {
  return (
    <div className="app-wrapper">
      <div className="main-wrapper">
        <div className="main-card">
          <RankingTable />
        </div>
        <SideBar />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
