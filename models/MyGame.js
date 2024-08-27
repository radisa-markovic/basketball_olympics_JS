export class MyGame
{
    constructor(
        opponentsName,
        myScore,
        opponentsScore
    )
    {
        this.opponentsName = opponentsName;
        this.myScore = myScore;
        this.opponentsScore = opponentsScore;
    }

    opponentWasBeaten()
    {
        return this.myScore > this.opponentsScore;
    }
}