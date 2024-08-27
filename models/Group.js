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
        const teamsSorted = this.sortGroup();
        teamsSorted.forEach((team, index) => {
            console.log(`\t\t${index + 1}. ${team.printStanding()}`);
        });
    }

    //third condition not yet done
    sortGroup()
    {
        return this.teams.toSorted((teamA, teamB) => {
            if(teamA.points > teamB.points)
                return -1;
            else
                if(teamA.points < teamB.points)
                    return 1;
            
            //here's the case when the points are equal
            const tiebreakerGame = teamA.myGames.find((game) => game.opponentsName === teamB.name);
            if(tiebreakerGame.opponentWasBeaten())
                return -1;
            else
                return 1;            
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
        //TODO: add console.log() for scores and round name
        console.log(`Grupa: ${this.groupName} - I kolo`);
        this.teams[0].playWithTeam(this.teams[1]);
        this.teams[2].playWithTeam(this.teams[3]);
        // this.sortGroup();
    }

    playSecondRound()
    {
        console.log(`Grupa: ${this.groupName} - II kolo`);
        this.teams[0].playWithTeam(this.teams[2]);
        this.teams[1].playWithTeam(this.teams[3]);
        // this.sortGroup();
    }

    playThirdRound()
    {
        console.log(`Grupa: ${this.groupName} - III kolo`);
        this.teams[0].playWithTeam(this.teams[3]);
        this.teams[1].playWithTeam(this.teams[2]);
        // this.sortGroup();
    }
}