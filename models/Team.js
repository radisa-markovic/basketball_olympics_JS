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
        this.points += this.POINTS_FOR_WINNING;
    }

    addLoss()
    {
        this.numberOfDefeats++;
        this.points += this.POINTS_FOR_LOSING;
    }
}