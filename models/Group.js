import { Team } from "./Team.js";

export class Group
{
    constructor(groupName, teams)
    {
        this.groupName = groupName;
        //this makes array elements have my class methods
        //instead of being from a generic JS object
        this.teams = teams.map((team) =>
            new Team(
                team.Team,
                team.ISOCode,
                team.FIBARanking
            )                        
        );
    }

    printGroup()
    {
        console.log(`******** Grupa: ${this.groupName} ********`);
        this.teams.forEach((team) => {
            console.log(team.name);
        });
    }
}