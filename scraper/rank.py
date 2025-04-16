import numpy as np



'''
Scale ratings to produce intuitive, accurate values
'''
def scale_ratings(ranking_vector):

	# 1. Apply a logarithmic transformation to reduce right skew.
	epsilon = 1e-8
	log_ratings = np.log(ranking_vector + epsilon)

	# 2. Convert to z-scores (this centers the data and preserves league variance).
	mean_log = np.mean(log_ratings)
	std_log = np.std(log_ratings)
	z_scores = (log_ratings - mean_log) / std_log

	# 3. Apply logistic (sigmoid) scaling with a lower steepness (k).
	A = 100   # Maximum rating
	k = 1.0   # Lower steepness reduces saturation at the top.
	# We want an average team (z = 0) to be around 60.
	x0 = -0.405465 / k  # x0 is derived so that when z=0, rating ≈ 60.

	scaled_ratings = A / (1 + np.exp(-k * (z_scores - x0)))
	return scaled_ratings

'''
Performs PageRank power iteration and tracks how much each team contributes
to the final score of every other team.
'''
def power_iteration(markov_matrix, tolerance=1e-8, max_iter=200):
    n = markov_matrix.shape[0]
    ranking = np.ones(n) / n

    for _ in range(max_iter):
        new_ranking = np.zeros(n)
        contribution_matrix = np.zeros((n, n))

        for i in range(n):
            for j in range(n):
                flow = markov_matrix[j][i] * ranking[j]
                new_ranking[i] += flow
                contribution_matrix[i][j] = flow

        if np.linalg.norm(new_ranking - ranking, 1) < tolerance:
            break

        ranking = new_ranking

    # Final normalized ranking and scaled scores
    ranking /= ranking.sum()
    scaled_rankings = scale_ratings(ranking)

    # Scale raw contributions to match scaled output
    scaled_contributions = np.zeros_like(contribution_matrix)
    for i in range(n):
        if ranking[i] > 0:
            scaled_contributions[i] = (contribution_matrix[i] / ranking[i]) * scaled_rankings[i]

    return scaled_rankings, scaled_contributions

'''
Print contributions in a formatted manner
'''
def print_contributions(teams, ids, ranking_vector, scaled_contributions):
	team_names_by_id = {v: k for k, v in ids.items()}
	for target_team in teams:
		team_id = ids[target_team]
		scaled_score = float(ranking_vector[team_id])

		print(f"\n--- Scaled Rating Breakdown for {target_team} ---")
		print(f"Final Scaled Score: {scaled_score:.2f}\n")

		contribs = []
		for j in range(len(ranking_vector)):
			if j != team_id and scaled_contributions[team_id][j] > 0:
				name = team_names_by_id[j]
				contribs.append((name, scaled_contributions[team_id][j]))

		for name, scaled in sorted(contribs, key=lambda x: x[1], reverse=True)[:10]:
			print(f"{name:25s} | {scaled:.2f} pts")

'''
Print ratings in a formatted manner
'''
def print_ratings(team_ratings):
	print("=== Team Rankings ===")
	for team, rating in sorted(team_ratings.items(), key=lambda x: x[1], reverse=True):
		print(f"{team:<25} | {rating:.4f}")

def calculate_rank(games, ids):

	num_teams = len(ids)

	adj_matrix = np.zeros((num_teams, num_teams))

	for (_, team1, team2, score1, score2, division, league_id) in games:
		loser = team1 if score1 < score2 else team2
		winner = team1 if score1 > score2 else team2
		margin = abs(score1 - score2)

		if team1 in ids and team2 in ids:
			# Compress the reward for blowouts
			adj_matrix[ids[loser], ids[winner]] += np.sqrt(margin)

	# Add a mock 1-goal loss to self to allow teams to retain some ranking
	RETENTION_WEIGHT = 1.0
	for i in range(num_teams):
		adj_matrix[i, i] += RETENTION_WEIGHT



	# Normalize each row - handle undefeated teams by distributing equally across all columns
	for row in adj_matrix:
		row_sum = row.sum()
		for i, n in enumerate(row):
			row[i] = (1 / num_teams) if row_sum == 0 else (n / row_sum)

	# Apply a damping fator of 0.15
	uniform_matrix = np.ones((num_teams, num_teams)) / num_teams
	markov_matrix = (0.85) * adj_matrix + (0.15) * uniform_matrix
	

	ranking_vector, scaled_contributions = power_iteration(markov_matrix)
	team_ratings = {team: float(ranking_vector[id]) for team, id in ids.items()}


	return team_ratings



def calculate_schedule(team_ratings, games):

	# init map to store team -> (games played, aggregate rating of opponenets)
	aggregate_opp_rating = {}

	# for each game, get the rating of each team
	
	for (_, team1, team2, score1, score2, division, league_id) in games:
		if team1 in team_ratings and team2 in team_ratings:
			team1_rating = team_ratings[team1]
			team2_rating = team_ratings[team2]

			if team1 in aggregate_opp_rating:
				entry = list(aggregate_opp_rating[team1])
				entry[0] += 1
				entry[1] += team2_rating
				aggregate_opp_rating[team1] = tuple(entry)
			else:
				aggregate_opp_rating[team1] = (1, team2_rating)

			if team2 in aggregate_opp_rating:
				entry = list(aggregate_opp_rating[team2])
				entry[0] += 1
				entry[1] += team1_rating
				aggregate_opp_rating[team2] = tuple(entry)
			else:
				aggregate_opp_rating[team2] = (1, team1_rating)

	schedule_ratings = {} # team -> average opponent rating
	for (team, (games_played, opp_rating)) in aggregate_opp_rating.items():
		avg_opp_rating = opp_rating / games_played
		schedule_ratings[team] = avg_opp_rating

	return schedule_ratings
	
