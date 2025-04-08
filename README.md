# MCLA Index

A rankings website for the MCLA club lacrosse league powered by the PageRank algorithm.

[👉 Visit the site](https://mclaindex.com)

---

## 📝 Description

**MCLA Index** computes and displays club lacrosse team rankings using PageRank, a graph-based algorithm originally developed by Google. It aims to provide an alternative, data-driven view of team performance based solely on game outcomes and network strength—free from bias or preseason expectations.

This project is built for players, coaches, and fans of the MCLA looking for transparent and algorithmic insight into how teams stack up.

---

## ⚙️ How It Works

- Scrapes game results and scores from the [official MCLA website](https://mcla.us)
- Builds a graph of team matchups where wins are treated as weighted edges
- Runs the PageRank algorithm to compute relative team strength
- Displays results in an interactive table

---

## 🛠️ Tech Stack

- **Backend**: Python, BeautifulSoup, MySQL, Node.js/Express
- **Frontend**: React, TypeScript, Tailwind CSS, Bootstrap
- **Hosting**: [mclaindex.com](https://mclaindex.com), Docker, AWS ECS/EC2, Amplify

---

## 📈 Future Plans

- Algorithm refinements based on past data
- Player rankings
- Live ranking updates as scores are released
- Matchup predictions/spreads

---

## 🙏 Acknowledgements

- [MCLA](https://mcla.us) for public game data
- [YouTube – Using PageRank to Rate Sports Teams (StatQuest)](https://youtu.be/meonLcN7LD4?feature=shared)
- [Patrick T. Brown – Ranking Sports Teams According to Cumulative Connections](https://patricktbrown.org/ranking-sports-teams-according-to-cumulative-connections/)
- [S. J. Brin and L. Page – The Anatomy of a Large-Scale Hypertextual Web Search Engine (PageRank origin)](http://stat.wharton.upenn.edu/~steele/Courses/956/Ranking/RankingFootballSIAM93.pdf)
- [YouTube – Ranking Teams with PageRank (Computerphile)](https://www.youtube.com/watch?v=fw7URbi1vL8)
- [Carl Meyer – Ranking Teams via Eigenvector Methods](http://carlmeyer.com/pdfFiles/SASGF08RankingPaper.pdf)
- [SportsRank GitHub Repo](https://github.com/bnak/SportsRank)

