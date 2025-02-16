from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv



'''
Scrape scores and return as array
'''
def scrape_games(league_set, year, num_weeks):
	games = []
	for i in range(1, num_weeks + 1):

		url = f"https://mcla.us/games?current_season_year={year}&week_key=week-{i}"
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
				games.append([team1, team2, score1, score2])

	return games


'''
Get shorter image url after redirect
'''
def get_final_image_url(img_tag):
    full_url = img_tag.get("src")
    response = requests.head(full_url, allow_redirects=True)
    return response.url.strip()


'''
Scrape full name, url, conf, and match with abbr name
'''
def scrape_team_info(year, division):
	teams = []

	url = f"https://mcla.us/teams?view_by=division&current_season_year={year}"
	html_text = requests.get(url).text
	soup = BeautifulSoup(html_text, 'lxml')

	tables = soup.find_all(id="teams-table")
	table = tables[division - 1]
	table_body = table.find("tbody")
	rows = table_body.find_all("tr")

	full_names = {} # full name -> index in teams
	url_map = {} # url -> index in teams (if full_name != abbr_name)

	i = 0
	for row in rows:
		a_tags = row.find_all("a")
		name_tag = a_tags[0]
		if name_tag:
			full_name = name_tag.text.strip()
			full_names[full_name] = i

			conf_tag = a_tags[1]
			if conf_tag:
				conf = conf_tag.text.strip()
				if conf == "NON-MCLA": continue
				if division == 1 and conf == "CCLA": continue # not real

				img_tag = row.find("img")
				if img_tag:
					print("Getting url for", full_name)
					image_url = get_final_image_url(img_tag)

					url_map[image_url] = i
					teams.append([full_name, conf, image_url])
					i += 1

	url = f"https://mcla.us/standings/division/d{division}?current_season_year={year}"

	html_text = requests.get(url).text
	soup = BeautifulSoup(html_text, 'lxml')

	table = soup.find(id="teams-table")
	table_body = table.find("tbody")
	rows = table_body.find_all("tr")

	for row in rows:
		name_tag = row.find("a")
		if name_tag:
			abbr_name = name_tag.text.strip()
			if abbr_name in full_names:
				teams[full_names[abbr_name]].append(abbr_name)
			else:
				# compare image url to match full name with abbr_name
				img_tag = row.find("img")
				if img_tag:
					print("Getting url for", abbr_name)
					image_url = get_final_image_url(img_tag)
					if image_url in url_map:
						teams[url_map[image_url]].append(abbr_name)

	return teams

'''
Scrape only abbr team names for a league
'''
def scrape_teams(year, division):
	teams = set()

	url = f"https://mcla.us/standings/division/d{division}?current_season_year={year}"

	html_text = requests.get(url).text
	soup = BeautifulSoup(html_text, 'lxml')

	table = soup.find(id="teams-table")
	table_body = table.find("tbody")
	rows = table_body.find_all("tr")

	for row in rows:
		name_tag = row.find("a")
		if name_tag:
			abbr_name = name_tag.text.strip()
			teams.add(abbr_name)

	return teams

