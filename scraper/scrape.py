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
def populate_games(league):

	insert_query = """
				INSERT INTO games (team1, team2, score1, score2)
				VALUES (%s, %s, %s, %s)
				"""
	

	my_cursor.execute("TRUNCATE TABLE games")

	for i in range(get_num_pages()):

		url = "https://mcla.us/schedule/2024/?page=" + str(i + 1)
		html_text = requests.get(url).text
		soup = BeautifulSoup(html_text, 'lxml')

		rows = soup.find_all('tr')
		for row in rows[1:]:
			data = row.find_all('td')

			team1 = data[4].a.text
			team2 = data[5].a.text
			score1, score2 = map(int, data[6].text.split(" - "))

			if (team1 in league and team2 in league and score1 + score2 > 0):
				my_cursor.execute(insert_query, (team1, team2, score1, score2))
				# if score1 > score2:
				# 	my_cursor.execute(update_win_query, (team1,))
				# 	my_cursor.execute(update_loss_query, (team2,))
				# else:
				# 	my_cursor.execute(update_win_query, (team2,))
				# 	my_cursor.execute(update_loss_query, (team1,))
				


'''
Scrape the names and icons for d1 MCLA
'''
def get_d1_teams():
	# conferences = ["alc", "clc", "lsa", "pncll", "rmlc", "selc", "slc", "umlc", "wcll"]
	d1_mcla = {}

	url = "https://mcla.us/teams"
	html_text = requests.get(url).text
	soup = BeautifulSoup(html_text, 'lxml')

	# scrape teams
	teams = soup.find(class_="team-roster")
	rows = teams.find_all("tr")

	images = []

	# scrape images
	for icon in soup.find_all("i", class_="team-icon"):
		style = icon.get("style", "")
		start = style.find("url('") + 5
		end = style.find("')", start)
		image_url = "https:" + style[start:end]
		images.append(image_url)

	# populate dict
	for i, row in enumerate(rows):
		team_name = row.a.text.strip()
		d1_mcla[team_name] = images[i]

	return d1_mcla

	


'''
Add team name and icon to database
'''
def populate_league(league):

	insert_query = """
					INSERT INTO teams (team_name, wins, losses, rating, logo_url)
					VALUES (%s, %s, %s, %s, %s)
				   """
	
	my_cursor.execute("TRUNCATE TABLE teams")

	for team in league:
		my_cursor.execute(insert_query, (team, 0, 0, 0.00, league[team]))

'''
Read from games table to populate record field in teams table
'''
def update_records():
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
	
	my_cursor.execute("SELECT * FROM games")
	games = my_cursor.fetchall()

	for (id, team1, team2, score1, score2) in games:
		if score1 > score2:
			my_cursor.execute(update_win_query, (team1, ))
			my_cursor.execute(update_loss_query, (team2, ))
		else:
			my_cursor.execute(update_win_query, (team2, ))
			my_cursor.execute(update_loss_query, (team1, ))

	
def calculate_rank(league):
	my_cursor.execute("SELECT * FROM games")
	games = my_cursor.fetchall()
	ids = {} # map teams to their id
	for i, n in enumerate(league):
		ids[n] = i

	num_teams = len(ids)

	adj_matrix = np.zeros((num_teams, num_teams))

	for (_, team1, team2, score1, score2) in games:
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

def calculate_schedule():

	# init map to store team -> (games played, aggregate rating of opponenets)
	aggregate_opp_rating = {}

	# get entries of games
	my_cursor.execute("SELECT * FROM games")
	games = my_cursor.fetchall()

	# for each game, get the rating of each team

	get_rating_query = """
				SELECT rating
				FROM teams
				WHERE team_name = %s;
				"""
	
	for (_, team1, team2, score1, score2) in games:

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
	d1_mcla = get_d1_teams()
	# populate_league(d1_mcla)
	populate_games(d1_mcla)
	# update_records()
	calculate_rank(d1_mcla)
	calculate_schedule()
	my_cursor.close()
	db_connection.commit()
	db_connection.close()

if __name__ == "__main__":
    main()

