import { Team } from "./Team.js";

export class Group
{
    constructor(groupName, teams)
    {
        this.groupName = groupName;
        //this makes array elements have my class methods
        //instead of being from a generic JS object
        /** @type {Team[]} teams */
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
        console.log(`\tGrupa ${this.groupName} (Ime - pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika)::`);
        this.teams.forEach((team, index) => {
            console.log(`\t\t${index + 1}. ${team.printStanding()}`);
        });
    }

    //with all sorts of various tiebreakers
    sortGroup()
    {
        this.teams.sort((teamA, teamB) => {
            return teamA.points > teamB.points;
        });
    }

    /**
     * Hardcoding based on the fact that I certainly know in advance 
     * how many teams I've got in the group
     * therefore I can manually plan who plays with who.
     * Version 2.0 will have randomized chance of drawing pairs
     * */

    playFirstRound()
    {
        this.teams[0].playWithTeam(this.teams[1]);
        this.teams[2].playWithTeam(this.teams[3]);
        this.sortGroup();
    }

    playSecondRound()
    {
        this.teams[0].playWithTeam(this.teams[2]);
        this.teams[1].playWithTeam(this.teams[3]);
        this.sortGroup();
    }

    playThirdRound()
    {
        this.teams[0].playWithTeam(this.teams[3]);
        this.teams[1].playWithTeam(this.teams[2]);
        this.sortGroup();
    }
}