import React, { useState } from "react";
import Footer from "./Footer";
import "./HowItWorks.css";
import FAQ from "./FAQ"

const HowItWorks: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen main-container">
      {/* Hero Section */}
      <div className="py-8 text-center">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-gray-600 text-xl">
          Understanding MCLA Index Rankings
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-bold mb-4">Powered by PageRank</h3>
            <div className="header-container">
              <div className="pagerank-desc text-gray-700 mb-4">
                <p>
                  Our rankings use PageRank, the same algorithm that powers
                  Google's search engine, to evaluate lacrosse teams based on
                  their performance. This network-based approach thrives in
                  leagues like the MCLA, where final scores are the only
                  consistent metric available.
                </p>
                <p>
                  Unlike simple win-loss records or linear models like RPI, our
                  system accounts for the league’s interconnectedness,
                  recognizing indirect relationships between teams to provide a
                  more comprehensive and accurate ranking.
                </p>
              </div>
              <div className="pagerank-img">
                <img src="/pagerank-grok.jpg" alt="" />
              </div>
            </div>
          </div>
        </section>
        {/* Core Ranking System */}
        <section>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-4">Building the Network</h3>
              <div className="graph-container">
                <div className="graph-img">
                  <img
                    className="lax-graph"
                    src="/example-graph.png"
                    alt="example_graph"
                  />
                  <p className="text-gray-700 text-sm mt-4">
                    Small subset of 2025 games
                  </p>
                </div>
                <div className="graph-desc">
                  <p className="text-gray-700 mb-4">
                    At its core, our system represents the MCLA as a directed
                    weighted graph, where:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-gray-700">
                    <li className="mb-2">Each team is a node in the graph</li>
                    <li className="mb-2">
                      Games create directed edges from losing teams to winning
                      teams
                    </li>
                    <li className="mb-2">
                      The weight of each edge corresponds to the margin of
                      victory
                    </li>
                  </ul>
                  <div>
                    <p className="text-gray-700">In the example graph:</p>
                    <ul className="list-disc pl-6 mb-6 text-gray-700">
                      <li className="mb-2">
                        Florida → Texas (weight 4) | 16-12 Texas win
                      </li>
                      <li className="mb-2">
                        Texas → Liberty (weight 2) | 12-10 Liberty win
                      </li>
                    </ul>
                    <p className="text-gray-700">and so on</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-xl font-bold mb-4">The PageRank Algorithm</h3>
              <div className="algo-container mb-6">
                <div className="algo-desc">
                  <h5 className="font-bold mb-4">Understanding Ranking Flow</h5>
                  <div className="text-gray-700 mb-4 mr-4">
                    <p className="text-gray-700 mb-4 mr-4">
                      Imagine the MCLA as a league of perfect sportsmanship,
                      where teams rank each other through a voting system:
                    </p>
                    <ul className="list-disc mb-6 text-gray-700">
                      <li className="mb-2">
                        When a team loses, they "vote" for the team that beat
                        them
                      </li>
                      <li className="mb-2">
                        The number of votes depend on the margin of victory
                      </li>
                      <li className="mb-2">
                        The value of the votes given depend on the number and
                        value of the losing team's existing votes
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="algo">
                  <p className="text-gray-700 mb-4">
                    The algorithm calculates rankings through an iterative
                    process:
                  </p>
                  <ol className="list-decimal pl-6 text-gray-700 mb-6">
                    <li className="mb-2">
                      Assign each team an equal share of ranking power
                    </li>
                    <li className="mb-2">
                      Distribute each team's ranking power along it's outgoing
                      edges
                    </li>
                    <li className="mb-2">
                      The amount of power transferred depends on the margin of
                      victory and current team power
                    </li>
                    <li className="mb-2">Repeat until rankings stabilize</li>
                  </ol>
                </div>
              </div>
              <div className="algo-footer mb-6">
                {/* <i className='bi bi-lightbulb'></i> */}
                <div>
                  With each iteration, teams that consistently beat good
                  opponents rise to the top, while teams with weak schedules or
                  poor performance against quality opponents fall.
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3
                className="text-xl font-semibold mb-4 cursor-pointer"
                onClick={() => toggleSection("refinements")}
              >
                <i
                  className={`bi ${
                    expandedSection === "refinements"
                      ? "bi-chevron-down"
                      : "bi-chevron-right"
                  } mr-2`}
                ></i>
                Technical Refinements
              </h3>
              {expandedSection === "refinements" && (
                <div className="pl-6 text-gray-700">
                  <p className="mb-4">
                    <strong>Managing Score Differentials:</strong> In order to
                    prevent teams from being excessively rewarded for running up
                    the score on weaker teams, we apply a{" "}
                    <em>square root transformation</em> to the margin of
                    victory. This means that each additional goal scored in a
                    win has a progressively smaller impact.
                  </p>
                  <p className="mb-4">
                    <strong>Damping Factor:</strong> PageRank requires a
                    connected graph, meaning undefeated or winless teams can
                    prevent it from stabilizing. We solve this with a{" "}
                    <em>damping factor</em> of 0.15. In effect, this distributes
                    15% of each team's ranking power equally across all teams.
                    This ensures the algorithm converges to a stable solution
                    while preserving the integrity of actual game results.
                  </p>
                  <p className="mb-4">
                    <strong>Rating Transformation:</strong> Our raw PageRank
                    calculations produce numbers that aren't immediately
                    intuitive. To create a more meaningful scale, we apply
                    various mathematical transformations. First, we use a
                    logarithmic function to smooth out extreme gaps between
                    teams. We then convert to z-scores to center the data, and
                    use logistic scaling to fit the ratings between 0 and 100,
                    centered around 60. This provides intuitive rating values
                    while preserving relative gaps between teams.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <FAQ></FAQ>
      <Footer />
    </div>
  );
};

export default HowItWorks;
