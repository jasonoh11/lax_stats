import scrape
import rank
import mysql
import mysql.connector
from dotenv import load_dotenv
import os

'''
Add team info to database for a league
'''
def populate_teams(db_connection, league, division, league_id, year):
    my_cursor = db_connection.cursor()
    insert_query = """
                INSERT INTO teams (team_name, url_name, wins, losses, rating, schedule, conference, division, year, league_id,  logo_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
    
    for team in league:
        print(team)
        if len(team) < 4: team.append("-")
        my_cursor.execute(insert_query, (team[3], team[0], 0, 0, 0.0, 0.0, team[1], division, year, league_id, team[2]))

    db_connection.commit()
    my_cursor.close()


'''
Populate games table and update records
'''
def populate_games(db_connection, league_set, games, division, league_id, min_games):
    my_cursor = db_connection.cursor()
    insert_query = """
                INSERT INTO games (team1, team2, score1, score2, division, league_id)
                VALUES (%s, %s, %s, %s, %s, %s)
                """
    update_win_query = """
                UPDATE teams
                SET wins = %s
                WHERE team_name = %s
                AND league_id = %s;
                """
    update_loss_query = """
                    UPDATE teams
                    SET losses = %s
                    WHERE team_name = %s
                    AND league_id = %s;
                    """


    record_map = {key: [0, 0] for key in league_set}

    insert_data = []
    for (team1, team2, score1, score2) in games:
        insert_data.append((team1, team2, score1, score2, division, league_id))

        if score1 > score2:
            record_map[team1][0] += 1 
            record_map[team2][1] += 1  
        elif score2 > score1:
            record_map[team1][1] += 1  
            record_map[team2][0] += 1  

    my_cursor.executemany(insert_query, insert_data)


    win_data = [(wins, team, league_id) for team, (wins, losses) in record_map.items()]
    loss_data = [(losses, team, league_id) for team, (wins, losses) in record_map.items()]

    my_cursor.executemany(update_win_query, win_data)
    my_cursor.executemany(update_loss_query, loss_data)
            
    # Discard teams that played under min_games games

    my_cursor.execute(f"DELETE FROM games WHERE team1 IN (SELECT team_name FROM teams WHERE (wins + losses) < {min_games} AND league_id = {league_id}) OR team2 IN (SELECT team_name FROM teams WHERE (wins + losses) < {min_games} AND league_id = {league_id}) AND league_id = {league_id};")
    my_cursor.execute(f"DELETE FROM teams WHERE (wins + losses) < {min_games} AND league_id = {league_id};")

    db_connection.commit()
    my_cursor.close()

'''
Get rank calculations from rank/calculate rank and update db
'''
def populate_rank(db_connection, league, league_id, update=True):

    my_cursor = db_connection.cursor()

    # Get rid of teams that don't exist in the database
    my_cursor.execute("SELECT team_name FROM teams WHERE league_id = %s;", (league_id, ))
    valid_teams = {row[0] for row in my_cursor.fetchall()}
    league.intersection_update(valid_teams)


    my_cursor.execute(f"SELECT * FROM games WHERE league_id = {league_id}")
    games = my_cursor.fetchall()

    ids = {} # map teams to their id
    for i, n in enumerate(league):
        ids[n] = i

    team_ratings = rank.calculate_rank(games, ids)

    if(update):
        update_rating_query = """
                    UPDATE teams
                    SET rating = %s
                    WHERE team_name = %s
                    AND league_id = %s;
                    """
        
        for (team, rating) in team_ratings.items():
            my_cursor.execute(update_rating_query, (rating, team, league_id))


        insert_schedule_query = """
                    UPDATE teams
                    SET schedule = %s
                    WHERE team_name = %s
                    AND league_id = %s;
                    """
        
        schedule_ratings = rank.calculate_schedule(team_ratings, games)

        for (team, schedule_rating) in schedule_ratings.items():
            my_cursor.execute(insert_schedule_query, (schedule_rating, team, league_id))

        update_last_updated_query = """
                    UPDATE leagues
                    SET last_updated = NOW()
                    WHERE league_id = %s;
                    """
        my_cursor.execute(update_last_updated_query, (league_id,))


    db_connection.commit()
    my_cursor.close()

def clear_games(db_connection, league_id):
    my_cursor = db_connection.cursor()
    my_cursor.execute(f"SELECT COUNT(*) FROM games WHERE league_id = {league_id}")
    num_games = my_cursor.fetchone()[0]

    my_cursor.execute(f"DELETE FROM games WHERE league_id = {league_id}")
    db_connection.commit()
    my_cursor.close()

    return num_games
    
def clear_teams(db_connection, league_id):
    my_cursor = db_connection.cursor()
    my_cursor.execute(f"SELECT COUNT(*) FROM teams WHERE league_id = {league_id}")
    num_teams = my_cursor.fetchone()[0]

    my_cursor.execute(f"DELETE FROM teams WHERE league_id = {league_id}")
    db_connection.commit()
    my_cursor.close()

    return num_teams

def get_url_names(db_connection, league_id):
    my_cursor = db_connection.cursor()
    my_cursor.execute(f'SELECT url_name FROM teams WHERE league_id = {league_id}')
    url_names = [x[0] for x in my_cursor.fetchall()]
    return url_names

def get_games_played(db_connection, league_id):
    my_cursor = db_connection.cursor()
    my_cursor.execute(f'SELECT url_name, wins, losses FROM teams WHERE league_id = {league_id}')
    games_played = {}
    for (team, wins, losses) in my_cursor.fetchall():
        games_played[team] = wins + losses
    return games_played


def get_connection():
    load_dotenv()
    db_connection = mysql.connector.connect(
        host = os.getenv("DB_HOST"),  
        user = os.getenv("DB_USER"),     
        password = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME")
    )
    return db_connection



