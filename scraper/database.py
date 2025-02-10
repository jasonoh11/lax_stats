import scrape
import requests
import mysql
import mysql.connector
from dotenv import load_dotenv
import os


def populate_teams(league, division, league_id):
	my_cursor = db_connection.cursor()
	insert_query = """
				INSERT INTO teams (team_name, full_name, wins, losses, rating, schedule, conference, division, league_id,  logo_url)
				VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
				"""
	
	for team in league:
		my_cursor.execute(insert_query, (team[3], team[0], 0, 0, 0.0, 0.0, team[1], division, league_id, team[2]))

	db_connection.commit()
	my_cursor.close()


load_dotenv()
db_connection = mysql.connector.connect(
    host = os.getenv("DB_HOST"),  
    user = os.getenv("DB_USER"),     
    password = os.getenv("DB_PASSWORD"),
    database = os.getenv("DB_NAME")
)

d1_2024 = scrape.scrape_teams(2024, 1)
populate_teams(d1_2024, 1, 1)

d2_2024 = scrape.scrape_teams(2024, 2)
populate_teams(d2_2024, 2, 2)

# TODO - not all d2 teams exist, causing index oob, either fix in scrape or error handle and enter full name as - to be removed later after records calculated

db_connection.close()