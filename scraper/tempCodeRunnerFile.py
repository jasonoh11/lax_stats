    sorted_map = sorted(production_map.items(), key=lambda item: item[1][1], reverse=True)

    max_team_len = max(len(team) for team in production_map)
    header_team = "Team"
    team_col_width = max(len(header_team), max_team_len) + 2 

    print(f"{header_team:<{team_col_width}} {'Returning':>10} {'Total':>10} {'% Ret.':>8}")
    print("-" * (team_col_width + 30))

    for team, (total, returning) in sorted_map:
        percent = (returning / total) * 100 if total > 0 else 0
        print(f"{team:<{team_col_width}} {returning:>10} {total:>10} {percent:>7.1f}%")