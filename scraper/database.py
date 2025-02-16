import scrape
import rank
import mysql
import mysql.connector
from dotenv import load_dotenv
import os

'''
Add team info to database for a league
'''
def populate_teams(league, division, league_id):
	my_cursor = db_connection.cursor()
	insert_query = """
				INSERT INTO teams (team_name, full_name, wins, losses, rating, schedule, conference, division, league_id,  logo_url)
				VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
				"""
	
	for team in league:
		if len(team) < 4: team.append("-")
		my_cursor.execute(insert_query, (team[3], team[0], 0, 0, 0.0, 0.0, team[1], division, league_id, team[2]))

	db_connection.commit()
	my_cursor.close()


'''
Populate games table and update records
'''
def populate_games(league_set, games, division, league_id, min_games):
	my_cursor = db_connection.cursor()
	insert_query = """
				INSERT INTO games (team1, team2, score1, score2, division, league_id)
				VALUES (%s, %s, %s, %s, %s, %s)
				"""
	update_win_query = """
				UPDATE teams
				SET wins = %s
				WHERE team_name = %s;
				"""
	update_loss_query = """
					UPDATE teams
					SET losses = %s
					WHERE team_name = %s;
					"""


	record_map = {key: [0, 0] for key in league_set}

	for (team1, team2, score1, score2) in games:
		print(team1, team2)
		my_cursor.execute(insert_query, (team1, team2, score1, score2, division, league_id))
		if score1 > score2:
			record_map.get(team1)[0] += 1
			record_map.get(team2)[1] += 1
		if score2 > score1:
			record_map.get(team1)[1] += 1
			record_map.get(team2)[0] += 1

	for team, (wins, losses) in record_map.items():
		print(team, wins, losses)
		my_cursor.execute(update_win_query, (wins, team))
		my_cursor.execute(update_loss_query, (losses, team))


	# Discard teams that played under min_games games

	my_cursor.execute(f"DELETE FROM games WHERE team1 IN (SELECT team_name FROM teams WHERE (wins + losses) < {min_games}) OR team2 IN (SELECT team_name FROM teams WHERE (wins + losses) < {min_games});")
	my_cursor.execute("DELETE FROM teams WHERE (wins + losses) < {min_games};")

	db_connection.commit()
	my_cursor.close()

'''
Get rank calculations from rank/calculate rank and update db
'''
def populate_rank(league, league_id):

	my_cursor = db_connection.cursor()


	my_cursor.execute(f"SELECT * FROM games WHERE league_id = {league_id}")
	games = my_cursor.fetchall()

	ids = {} # map teams to their id
	for i, n in enumerate(league):
		ids[n] = i

	team_ratings = rank.calculate_rank(games, ids)

	update_rating_query = """
				UPDATE teams
				SET rating = %s
				WHERE team_name = %s;
				"""
	
	for (team, rating) in team_ratings.items():
		my_cursor.execute(update_rating_query, (rating, team))


	insert_schedule_query = """
				UPDATE teams
				SET schedule = %s
				WHERE team_name = %s
				"""
	
	schedule_ratings = rank.calculate_schedule(team_ratings, games)

	for (team, schedule_rating) in schedule_ratings.items():
		my_cursor.execute(insert_schedule_query, (schedule_rating, team))


	db_connection.commit()
	my_cursor.close()

	

load_dotenv()
db_connection = mysql.connector.connect(
    host = os.getenv("DB_HOST"),  
    user = os.getenv("DB_USER"),     
    password = os.getenv("DB_PASSWORD"),
    database = os.getenv("DB_NAME")
)


# d1_2024 = scrape.scrape_team_info(2024, 1)
# populate_teams(d1_2024, 1, 1)

d1_2024 = scrape.scrape_teams(2024, 1)

# d1_2024_games = scrape.scrape_games(d1_2024, 2024, 16)
# tourney_games = [
# 			("Simon Fraser", "Texas", 4, 17),
# 			("Northeastern", "Liberty", 6, 11),
# 			("Michigan State", "Brigham Young", 4, 19),
# 			("Utah Valley", "Chapman", 7, 6),
# 			("Tennessee", "San Diego State", 7, 11),
# 			("Colorado", "UC Santa Barbara", 10, 11),
# 			("Arizona State", "Virginia Tech", 12, 11),
# 			("California", "Georgia Tech", 11, 12),

# 			("UC Santa Barbara", "Texas", 15, 14),
# 			("San Diego State", "Brigham Young", 10, 15),
# 			("Utah Valley", "Georgia Tech", 17, 14),
# 			("Arizona State", "Liberty", 10, 11),

# 			("Liberty", "Brigham Young", 12, 20),
# 			("Utah Valley", "UC Santa Barbara", 13, 12),

# 			("Utah Valley", "Brigham Young", 5, 13)
# 		]
# total_games = d1_2024_games + tourney_games
# populate_games(d1_2024, total_games, 1, 1, 5)
populate_rank(d1_2024, 1)

# d2_2024 = scrape.scrape_team_info(2024, 2)
# populate_teams(d2_2024, 2, 2)

d2_2024 = scrape.scrape_teams(2024, 2)
# d2_2024_games = scrape.scrape_games(d2_2024, 2024, 16)
# populate_games(d2_2024, d2_2024_games, 2, 2, 5)
populate_rank(d2_2024, 2)



db_connection.close()