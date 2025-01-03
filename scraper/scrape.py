from bs4 import BeautifulSoup
import requests
import mysql
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()
db_connection = mysql.connector.connect(
    host = os.getenv("DB_HOST"),  
    user = os.getenv("DB_USER"),     
    password = os.getenv("DB_PASSWORD"),
    database = os.getenv("DB_NAME")
)

my_cursor = db_connection.cursor()



d1_mcla = set()

def get_num_pages():
	url = 'https://mcla.us/schedule/2024/'
	html_text = requests.get(url).text
	soup = BeautifulSoup(html_text, 'lxml')

	pagination = soup.find("ul", class_="pagination")
	return int((pagination.find_all("li"))[-2].a.text)


def populate_lax_stats():

	insert_query = """
				INSERT INTO games (team1, team2, score1, score2)
				VALUES (%s, %s, %s, %s)
				"""
	
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

			if (team1 in d1_mcla and team2 in d1_mcla and score1 + score2 > 0):
				my_cursor.execute(insert_query, (team1, team2, score1, score2))
				if score1 > score2:
					my_cursor.execute(update_win_query, (team1,))
					my_cursor.execute(update_loss_query, (team2,))
				else:
					my_cursor.execute(update_win_query, (team2,))
					my_cursor.execute(update_loss_query, (team1,))
				


	
		


def populate_d1_set():
	# conferences = ["alc", "clc", "lsa", "pncll", "rmlc", "selc", "slc", "umlc", "wcll"]

	url = "https://mcla.us/teams"
	html_text = requests.get(url).text
	soup = BeautifulSoup(html_text, 'lxml')

	teams = soup.find(class_="team-roster")

	rows = teams.find_all("tr")

	# Print the selected rows
	# print(rows[0].a.text)
	for row in rows:
		d1_mcla.add(row.a.text.strip())


def populate_teams():
	populate_d1_set()
	insert_query = """
					INSERT INTO teams (team_name, wins, losses, rating)
					VALUES (%s, %s, %s, %s)
				   """
	
	my_cursor.execute("TRUNCATE TABLE teams")

	for team in d1_mcla:
		my_cursor.execute(insert_query, (team, 0, 0, 0.00))

				


def main():
	populate_teams()
	populate_lax_stats()
	my_cursor.close()
	db_connection.commit()
	db_connection.close()

if __name__ == "__main__":
    main()

