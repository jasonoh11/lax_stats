import './App.css'
import RankingList from './components/RankingList'
import Nav from './components/NavBar'


function App() {

  return (
    <div className="app-wrapper">
      <Nav/>
      <div className="main-card">
        <RankingList/>
      </div>
    </div>
  )
}

export default App
