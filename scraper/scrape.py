from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv
import database



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
            score1_text = scores[i].text.strip()
            score2_text = scores[i+1].text.strip()
            score1 = 0 if score1_text == '' else int(scores[i].text.strip())
            score2 = 0 if score2_text == '' else int(scores[i+1].text.strip())
            if team1 in league_set and team2 in league_set and score1 + score2 != 0:
                games.append([team1, team2, score1, score2])

    return games

'''
Get shorter image url after redirect
'''
def get_final_image_url(img_tag, session):
    full_url = img_tag.get("src")
    response = session.head(full_url, allow_redirects=True)
    return response.url.strip()


'''
Scrape url name, image url, conf, and match with abbr name
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

    url_names = {} # url name -> index in teams
    img_map = {} # url -> index in teams (if url_name != abbr_name)

    # Reuse TCP connection to reduce overhead
    with requests.Session() as session:
        i = 0
        for row in rows:
            a_tags = row.find_all("a")
            name_tag = a_tags[0]
            if name_tag:
                url_name = name_tag.get('href').split("/")[2]
                url_names[url_name] = i
                full_name = name_tag.text.strip()

                conf_tag = a_tags[1]
                if conf_tag:
                    conf = conf_tag.text.strip()
                    if conf == "NON-MCLA": continue
                    if division == 1 and conf == "CCLA": continue # not real

                    img_tag = row.find("img")
                    if img_tag:
                        image_url = get_final_image_url(img_tag, session)

                        img_map[image_url] = i
                        # Tentatively add full name in case abbr name is not listed
                        teams.append([url_name, conf, image_url, full_name])
                        i += 1

        # print(teams)

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
                if abbr_name in url_names:
                    teams[url_names[abbr_name]].append(abbr_name)
                else:
                    # compare image url to match url name with abbr_name
                    img_tag = row.find("img")
                    if img_tag:
                        image_url = get_final_image_url(img_tag, session)
                        if image_url in img_map:
                            teams[img_map[image_url]][3] = abbr_name

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


    url = f"https://mcla.us/teams?view_by=division&current_season_year={year}"
    html_text = requests.get(url).text
    soup = BeautifulSoup(html_text, 'lxml')

    tables = soup.find_all(id="teams-table")
    table = tables[division - 1]
    table_body = table.find("tbody")
    rows = table_body.find_all("tr")

    # url_names = database.get_team_url_names(2)

    # Some teams in D2 aren't listed in MCLA standings, only in resources
    for row in rows:
        a_tags = row.find_all("a")
        name_tag = a_tags[0]
        if name_tag:
            full_name = name_tag.text.strip()
            if full_name not in teams:
                teams.add(full_name)

    return teams

