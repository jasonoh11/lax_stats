from bs4 import BeautifulSoup
import requests
import mysql
import mysql.connector
from dotenv import load_dotenv
import os
import numpy as np


load_dotenv()
db_connection = mysql.connector.connect(
    host = os.getenv("DB_HOST"),  
    user = os.getenv("DB_USER"),     
    password = os.getenv("DB_PASSWORD"),
    database = os.getenv("DB_NAME")
)

my_cursor = db_connection.cursor()




'''
Scrape the number of pages in the schedule
Helper for populate_games
'''
def get_num_pages():
	url = 'https://mcla.us/schedule/2024/'
	html_text = requests.get(url).text
	soup = BeautifulSoup(html_text, 'lxml')

	pagination = soup.find("ul", class_="pagination")
	return int((pagination.find_all("li"))[-2].a.text)


'''
Scrape scores and populate games table
'''
def populate_games(league_set, league_id):
	insert_query = """
				INSERT INTO games (team1, team2, score1, score2, league_id)
				VALUES (%s, %s, %s, %s, %s)
				"""

	my_cursor.execute(f"DELETE FROM games WHERE league_id = {league_id}")

	for i in range(2, 17):

		url = "https://mcla.us/games?current_season_year=2024&week_key=week-" + str(i)
		html_text = requests.get(url).text
		soup = BeautifulSoup(html_text, 'lxml')
		teams = soup.findAll(class_="team__name")
		scores = soup.findAll(class_="game-tile__score")

		for i in range(0, len(teams), 2):
			team1 = teams[i].text.strip()
			team2 = teams[i+1].text.strip()
			score1 = int(scores[i].text.strip())
			score2 = int(scores[i+1].text.strip())
			if team1 in league_set and team2 in league_set and score1 + score2 != 0:
				my_cursor.execute(insert_query, (team1, team2, score1, score2, league_id))

	if league_id == 1:
		tourney_games = [
			("Simon Fraser", "Texas", 4, 17),
			("Northeastern", "Liberty", 6, 11),
			("Michigan State", "BYU", 4, 19),
			("Utah Valley", "Chapman", 7, 6),
			("Tennessee", "San Diego State", 7, 11),
			("Colorado", "UC Santa Barbara", 10, 11),
			("Arizona State", "Virginia Tech", 12, 11),
			("California", "Georgia Tech", 11, 12),

			("UC Santa Barbara", "Texas", 15, 14),
			("San Diego State", "BYU", 10, 15),
			("Utah Valley", "Georgia Tech", 17, 14),
			("Arizona State", "Liberty", 10, 11),

			("Liberty", "BYU", 12, 20),
			("Utah Valley", "UC Santa Barbara", 13, 12),

			("Utah Valley", "BYU", 5, 13)
		]

		for game in tourney_games:
			if game[0] not in league_set:
				print(game[0])
			if game[1] not in league_set:
				print(game[1])
			my_cursor.execute(insert_query, game + (league_id, ))

				


'''
Scrape the names and icons for d1 MCLA
'''
def get_2024_teams(update_db, league_id):
	league_set = set()

	insert_query = """
				INSERT INTO teams (team_name, full_name, wins, losses, rating, schedule, conference, league_id,  logo_url)
				VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
				"""
	
	if update_db:
		# my_cursor.execute("ALTER TABLE teams AUTO_INCREMENT = 1")
		# my_cursor.execute(f"DELETE FROM teams WHERE league_id = {league_id}")
		# TEMP
		if league_id == 1: 
			my_cursor.execute("TRUNCATE TABLE teams")

		
	

	url = "https://mcla.us/teams?view_by=division&current_season_year=2024"
	html_text = requests.get(url).text
	soup = BeautifulSoup(html_text, 'lxml')

	tables = soup.find_all(id="teams-table")
	table = tables[league_id - 1]
	table_body = table.find("tbody")
	rows = table_body.find_all("tr")

	# So we can pair full names with abbr names
	url_map = {} # img_url -> full_name

	for row in rows:
		a_tags = row.find_all("a")
		name_tag = a_tags[0]
		if name_tag:
			full_name = name_tag.text.strip()

			if update_db:
				img_tag = row.find("img")
				if img_tag:
					full_url = img_tag.get("src")
					response = requests.head(full_url, allow_redirects=True)
					image_url = response.url.strip()

					conf_tag = a_tags[1]
					conf = conf_tag.text.strip()

					if conf == "NON-MCLA": continue

					url_map[image_url] = full_name

					my_cursor.execute(insert_query, ("-", full_name, 0, 0, 0.00, 0.00, conf, league_id, image_url))
			

	url = f"https://mcla.us/standings/division/d{league_id}?current_season_year=2024"

	html_text = requests.get(url).text
	soup = BeautifulSoup(html_text, 'lxml')

	update_query = '''
					UPDATE teams
					SET team_name = %s
					WHERE full_name = %s;
				'''
	
	table = soup.find(id="teams-table")
	table_body = table.find("tbody")
	rows = table_body.find_all("tr")

	for row in rows:
		name_tag = row.find("a")
		if name_tag:
			team_name = name_tag.text.strip()
			league_set.add(team_name)
			
			if update_db:
				img_tag = row.find("img")
				if img_tag:
					full_url = img_tag.get("src")
					response = requests.head(full_url, allow_redirects=True)
					image_url = response.url.strip()
					if image_url in url_map:
						full_name = url_map[image_url]
						my_cursor.execute(update_query, (team_name, full_name))

	return league_set

	
'''
Read from games table to populate record field in teams table
'''
def update_records(league_set, league_id):
	update_win_query = """
				UPDATE teams
				SET wins = wins + 1
				WHERE team_name = %s;
				"""
	update_loss_query = """
					UPDATE teams
					SET losses = losses + 1
					WHERE team_name = %s;
					"""
	
	my_cursor.execute(f"UPDATE teams SET wins = 0, losses = 0 WHERE league_id = {league_id};")
	my_cursor.execute(f"SELECT * FROM games WHERE league_id = {league_id}")
	games = my_cursor.fetchall()

	for (id, team1, team2, score1, score2, league_id) in games:
		if score1 > score2:
			my_cursor.execute(update_win_query, (team1, ))
			my_cursor.execute(update_loss_query, (team2, ))
		else:
			my_cursor.execute(update_win_query, (team2, ))
			my_cursor.execute(update_loss_query, (team1, ))

	my_cursor.execute("DELETE FROM games WHERE team1 IN (SELECT team_name FROM teams WHERE (wins + losses) < 5) OR team2 IN (SELECT team_name FROM teams WHERE (wins + losses) < 5);")
	my_cursor.execute("DELETE FROM teams WHERE (wins + losses) < 5;")


	# # Delete games where either team has played < 5 games
	# my_cursor.execute(f"""
	# 	DELETE FROM games 
	# 	WHERE team1 IN (SELECT team_name FROM teams WHERE league_id = {league_id} AND (wins + losses) < 5)
	# 	OR team2 IN (SELECT team_name FROM teams WHERE league_id = {league_id} AND (wins + losses) < 5);
	# """)

	# # Delete teams that have played < 5 games
	# my_cursor.execute(f"""
	# 	DELETE FROM teams 
	# 	WHERE league_id = {league_id} AND (wins + losses) < 5;
	# """)


	
def calculate_rank(league, league_id):
	# TEMP
	my_cursor.execute(f"SELECT * FROM games WHERE league_id = {league_id}")
	games = my_cursor.fetchall()
	ids = {} # map teams to their id
	for i, n in enumerate(league):
		ids[n] = i

	num_teams = len(ids)

	adj_matrix = np.zeros((num_teams, num_teams))

	for (_, team1, team2, score1, score2, league_id) in games:
		# loser = team1 if score1 < score2 else team2
		# winner = team1 if score1 > score2 else team2
		# margin = abs(score1 - score2)

		# adj_matrix[ids[loser], ids[winner]] = margin

		total = score1 + score2

		adj_matrix[ids[team1], ids[team2]] = score2 + 1 / total + 2
		adj_matrix[ids[team2], ids[team1]] = score1 + 1 / total + 2

	

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

	update_rating_query = """
				UPDATE teams
				SET rating = %s
				WHERE team_name = %s;
				"""
	
	for (team, id) in ids.items():
		# print("Team:", team, ranking_vector[id] * 100)
		rating = float(scaled_ratings[id].item())
		my_cursor.execute(update_rating_query, (rating, team))

def calculate_schedule(league_id):

	# init map to store team -> (games played, aggregate rating of opponenets)
	aggregate_opp_rating = {}

	# get entries of games
	# TEMP
	my_cursor.execute(f"SELECT * FROM games WHERE league_id = {league_id}")
	games = my_cursor.fetchall()

	# for each game, get the rating of each team

	get_rating_query = """
				SELECT rating
				FROM teams
				WHERE team_name = %s;
				"""
	
	for (_, team1, team2, score1, score2, league_id) in games:

		my_cursor.execute(get_rating_query, (team1, ))
		team1_rating = my_cursor.fetchone()[0]
		my_cursor.execute(get_rating_query, (team2, ))
		team2_rating = my_cursor.fetchone()[0]

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


	insert_schedule_query = """
					UPDATE teams
					SET schedule = %s
					WHERE team_name = %s
					"""
	

	for (team, (games_played, opp_rating)) in aggregate_opp_rating.items():
		avg_opp_rating = opp_rating / games_played
		my_cursor.execute(insert_schedule_query, (avg_opp_rating, team))


def main():
	'''
	TODO: add d2 support
	Get d2 games, update records, calculate rank
	'''
	# d1_2024 = get_2024_teams(False, 1)
	# print(d1_2024)
	# populate_games(d1_2024, 1)
	# update_records(d1_2024, 1)
	# calculate_rank(d1_2024, 1)
	# calculate_schedule(1)

	d2_2024 = get_2024_teams(False, 2)
	# populate_games(d2_2024, 2)
	# update_records(d2_2024, 2)
	calculate_rank(d2_2024, 2)
	calculate_schedule(2)
	# print("Calculated rank")
	# print("Calculated schedule")
	db_connection.commit()
	my_cursor.close()
	db_connection.close()

if __name__ == "__main__":
    main()

