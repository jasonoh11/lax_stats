from bs4 import BeautifulSoup
import requests
import database
import os
import json

CACHE_DIR = 'cache'

'''
Get all the url_names for a league
'''
def get_url_names(league_id=3):
    db = database.get_connection()
    url_names = database.get_url_names(db, league_id)
    db.close()
    return url_names

'''
Given a team name as input, return a mapping of each player id to classification
'''
def get_class_map(team):
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache_path = os.path.join(CACHE_DIR, f"{team}.json")
    if os.path.exists(cache_path):
        with open(cache_path, "r") as f:
            print("Got", team, "from cache")
            return json.load(f)
        

    print("Populating", team, "class map")
    url = f'https://mcla.us/teams/{team}/2025/roster'
    html_text = requests.get(url).text
    soup = BeautifulSoup(html_text, 'lxml')

    player_ids = []
    name_tiles = soup.findAll(class_="player-tile__name")
    for t in name_tiles:
        player_ids.append(t.find('a').get('href').split('/')[-1])

    classes = []
    detail_tiles = soup.findAll(class_="player-tile__details")
    for t in detail_tiles:
        classes.append(t.findAll('p')[1].text)

    assert(len(player_ids) == len(classes))    
    
    class_map = {}
    for (player, year) in zip(player_ids, classes):
        class_map[player] = year

    with open(cache_path, "w") as f:
        json.dump(class_map, f)    

    return class_map


'''
Get a team's total points and returning points
'''
def get_returning_production(team):
    url = f'https://mcla.us/teams/{team}/2025/stats'
    html_text = requests.get(url).text
    soup = BeautifulSoup(html_text, 'lxml')

    class_map = get_class_map(team)
    total_points, returning_points = 0, 0

    table = soup.findAll(class_='game-stats__table')[2].find('tbody')
    players = table.findAll('tr')
    for p in players:
        player_id = p.find('a').get('href').split('/')[-1]
        points = int(p.findAll('td')[3].text)
        total_points += points
        assert(player_id in class_map)

        if class_map[player_id] in ['Fr', 'So', 'Jr']:
            returning_points += points

    return total_points, returning_points

'''
Get a mapping of team name to games played
'''
def get_games_played_map(league_id=3):
    db = database.get_connection()
    games_played_map = database.get_games_played(db, league_id)
    db.close()
    return games_played_map


'''
Display all returning production data in a readable format
'''
def print_all_returning_production():
    games_played = get_games_played_map()
    production_map = {}

    teams = get_url_names()
    for team in teams:
        production_map[team] = get_returning_production(team)

    data = []
    for team, (total, returning) in production_map.items():
        gp = games_played.get(team, 1)
        rppg = returning / gp if gp > 0 else 0
        percent = (returning / total) * 100 if total > 0 else 0
        data.append((team, total, returning, gp, rppg, percent))

    sorted_data = sorted(data, key=lambda x: x[4], reverse=True)

    # Formatting
    max_team_len = max(len(team) for team in production_map)
    team_col_width = max(len("Team"), max_team_len) + 2

    print(f"{'Team':<{team_col_width}} {'Returning':>10} {'Total':>10} {'% Ret.':>8} {'RPPG':>8}")
    print("-" * (team_col_width + 38))

    for team, total, returning, gp, rppg, percent in sorted_data:
        print(f"{team:<{team_col_width}} {returning:>10} {total:>10} {percent:>7.1f}% {rppg:>8.2f}")


# problem - teams goal reporting is not accurate. Can include cross divisional games and scrimmages
print_all_returning_production()

