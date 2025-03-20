import scrape
import rank
import database

def update_team_info(db, year, division, league_id):
	league = scrape.scrape_team_info(year, division)
	old_count = database.clear_teams(db, 2)
	database.populate_teams(db, league, division, league_id, year)
	new_count = len(league)
	print("Deleted", old_count, "teams, Added", new_count, "teams, +", (new_count - old_count))

'''
Rescrape games for a given league and update the records/rankings
'''
def update_league(db, year, division, league_id, min_games=1, manual_games=[], weeks=15):
	print("Updating division", division, ",", year, ",", "League ID:", league_id)
	league = scrape.scrape_teams(year, division)
	games = scrape.scrape_games(league, year, weeks)

	old_count = database.clear_games(db, league_id)
	database.populate_games(db, league, games + manual_games, division, league_id, min_games)
	new_count = len(games) + len(manual_games)
	print("Deleted", old_count, "games, Added", new_count, "games, +", (new_count - old_count))

	database.populate_rank(db, league, league_id)

def main():
	db = database.get_connection()

	d1_2024_tourney_games = [

			("Simon Fraser", "Texas", 4, 17),
			("Northeastern", "Liberty", 6, 11),
			("Michigan State", "Brigham Young", 4, 19),
			("Utah Valley", "Chapman", 7, 6),
			("Tennessee", "San Diego State", 7, 11),
			("Colorado", "UC Santa Barbara", 10, 11),
			("Arizona State", "Virginia Tech", 12, 11),
			("California", "Georgia Tech", 11, 12),

			("UC Santa Barbara", "Texas", 15, 14),
			("San Diego State", "Brigham Young", 10, 15),
			("Utah Valley", "Georgia Tech", 17, 14),
			("Arizona State", "Liberty", 10, 11),

			("Liberty", "Brigham Young", 12, 20),
			("Utah Valley", "UC Santa Barbara", 13, 12),

			("Utah Valley", "Brigham Young", 5, 13)
		]
	
	d2_2024_tourney_games = [
			("Bridgewater", "Air Force", 11, 13),
			("Montana", "GVSU", 5, 19),
			("Missouri State", "St. Thomas", 13, 22),
			("Tulane", "Montana State", 3, 14),
			("UNC-Charlotte", "Northwest Nazarene", 13, 17),
			("UC San Diego", "Florida Atlantic", 10, 15),
			("Kennesaw State", "Cal State San Marcos", 14, 12),
			("Coastal Carolina", "Rhode Island", 7, 16),

			("Kennesaw State", "St. Thomas", 7, 17),
			("Northwest Nazarene", "Air Force", 8, 21),
			("Rhode Island", "Montana State", 6, 13),
			("Florida Atlantic", "GVSU", 8, 16),

			("Montana State", "Air Force", 21, 4),
			("GVSU", "St. Thomas", 8, 10),

			("Montana State", "St. Thomas", 12, 7)
		]
	
	# update_league(db, 2024, 1, 1, 5, d1_2024_tourney_games)

	# update_team_info(db, 2024, 2, 2)
	# update_league(db, 2024, 2, 2, 3, d2_2024_tourney_games)

	# update_league(db, 2025, 1, 3)

	update_league(db, 2025, 2, 4)

	db.close()
if __name__ == "__main__":
    main()
