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


insert_query = """
INSERT INTO games (team1, team2, score1, score2)
VALUES (%s, %s, %s, %s)
"""

d1_mcla = set()

def get_num_pages():
	url = 'https://mcla.us/schedule/2024/'
	html_text = requests.get(url).text
	soup = BeautifulSoup(html_text, 'lxml')

	pagination = soup.find("ul", class_="pagination")
	return int((pagination.find_all("li"))[-2].a.text)


def populate_lax_stats():
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
				if (team1 == "Texas" or team2 == "Texas"):
					my_cursor.execute(insert_query, (team1, team2, score1, score2))
				


	db_connection.commit()


	
		


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

				


def main():

	populate_d1_set()
	populate_lax_stats()

	my_cursor.close()
	db_connection.close()

if __name__ == "__main__":
    main()
