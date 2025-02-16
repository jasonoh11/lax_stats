import numpy as np

def calculate_rank(games, ids):

	num_teams = len(ids)

	adj_matrix = np.zeros((num_teams, num_teams))

	for (_, team1, team2, score1, score2, division, league_id) in games:
		loser = team1 if score1 < score2 else team2
		winner = team1 if score1 > score2 else team2
		margin = abs(score1 - score2)

		adj_matrix[ids[loser], ids[winner]] = margin

		# total = score1 + score2

		# adj_matrix[ids[team1], ids[team2]] = score2 + 1 / total + 2
		# adj_matrix[ids[team2], ids[team1]] = score1 + 1 / total + 2

	

	uniform_matrix = np.ones((num_teams, num_teams)) / num_teams
	markov_matrix = (0.85) * adj_matrix + (0.15) * uniform_matrix

	for row in markov_matrix:
		row_sum = 0
		for n in row:
			row_sum += n
		if row_sum != 0:
			for i, n in enumerate(row):
				row[i] = (n / row_sum)
	

	eigenvalues, eigenvectors = np.linalg.eig(markov_matrix.T)
	principal_eigenvector = eigenvectors[:, np.isclose(eigenvalues, 1)]
	principal_eigenvector = principal_eigenvector / np.sum(principal_eigenvector)
	ranking_vector = np.real(principal_eigenvector)	


	# Normalize the values to 0–1
	x_min = ranking_vector.min()
	x_max = ranking_vector.max()
	normalized = (ranking_vector - x_min) / (x_max - x_min)

	# Define logistic parameters
	A = 100  # Maximum value
	k = 10   # Steepness of the curve
	x0 = 0.5 # Midpoint in the normalized range

	# Apply logistic scaling
	scaled_ratings = A / (1 + np.exp(-k * (normalized - x0)))

	team_ratings = {}
	for (team, id) in ids.items():
		# print("Team:", team, ranking_vector[id] * 100)
		rating = float(scaled_ratings[id].item())
		team_ratings[team] = rating

	return team_ratings


def calculate_schedule(team_ratings, games):

	# init map to store team -> (games played, aggregate rating of opponenets)
	aggregate_opp_rating = {}

	# for each game, get the rating of each team
	
	for (_, team1, team2, score1, score2, division, league_id) in games:

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
	
