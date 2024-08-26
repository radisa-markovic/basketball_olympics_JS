import { getScores } from "../util/calculations.js";

export class Team
{
    static POINTS_FOR_WINNING = 2;
    static POINTS_FOR_LOSING = 1;

    constructor(
        name,
        isoCode,
        fibaRanking,
    )
    {
        this.name = name;
        this.isoCode = isoCode;
        this.fibaRanking = fibaRanking;
        this.numberOfWins = 0;
        this.numberOfDefeats = 0;
        this.points = 0;
        this.basketsScored = 0;
        this.basketsReceived = 0;
        this.netScoreDifference = 0;
    }

    addWin()
    {
        this.numberOfWins++;
        this.points += Team.POINTS_FOR_WINNING;
    }

    addLoss()
    {
        this.numberOfDefeats++;
        this.points += Team.POINTS_FOR_LOSING;
    }

    printStanding()
    {
        return `${this.name}\t ${this.numberOfWins} / ${this.numberOfDefeats} / ${this.points} / ${this.basketsScored} / ${this.basketsReceived} / ${this.netScoreDifference}`;
    }

    /** 
     * Simulates a game being played
     * @param {Team} opposingTeam 
     * */
    playWithTeam(opposingTeam)
    {
        let score;
        if(Math.random() > 0.5)
            score = getScores("blowout");
        else
            score = getScores("closeGame");
        //this should definitely include fibaRanking in some place
        const myChanceOfWinning = this.fibaRanking * Math.random();
        const opponentsChanceOfWinning = opposingTeam.fibaRanking * Math.random();

        if(myChanceOfWinning > opponentsChanceOfWinning)
        {
            this.addWin();
            this.basketsScored += score.winnersBasketCount;
            this.basketsReceived += opposingTeam.basketsScored;
            opposingTeam.addLoss();
            opposingTeam.basketsReceived += score.winnersBasketCount;
            opposingTeam.basketsScored += score.losersBasketCount; 
        }
        else
        {
            // deliberately added this if, there's no tie in basketball if the chances are equal
            if(myChanceOfWinning < opponentsChanceOfWinning)
            {
                this.addLoss();
                this.basketsScored += score.losersBasketCount;
                this.basketsReceived += score.winnersBasketCount;
                opposingTeam.addWin();
                opposingTeam.basketsScored += score.winnersBasketCount; 
                opposingTeam.basketsReceived += score.losersBasketCount;
            }
        }

        this.netScoreDifference = this.basketsScored - this.basketsReceived;
        opposingTeam.netScoreDifference = opposingTeam.basketsScored - opposingTeam.basketsReceived;
    }
}