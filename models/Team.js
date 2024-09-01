import { calculateWinAndLossChance, getScores } from "../util/calculations.js";
import { MyGame } from "./MyGame.js";

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
        /**@type {MyGame[]} myGames */
        this.myGames = [];
        /** @type {Team[]} scheduledOpponents */
        this.nextOpponent = null;
        this.numberOfWins = 0;
        this.numberOfDefeats = 0;
        this.points = 0;
        this.basketsScored = 0;
        this.basketsReceived = 0;
        this.netScoreDifference = 0;
        this.winStreakCount = 0;//if it's under 0, team is in a losing streak
        //maybe do 'exhibitionData' as an object property
        this.exhibitionData = {};
    }

    /***  @param {MyGame} game */
    addGame(game)
    {
        this.myGames.push(game);

        this.basketsScored += game.myScore;
        this.basketsReceived += game.opponentsScore;
    }

    static evaluateExibitionGamesData(exibitionGames)
    {
        //takes in Data, Opponent, and Result, all strings, result split on -
        let evaluatedExhibitionData = {
            basketsScored: 0,
            basketsReceived: 0,
            netScoreDifference: 0,
            winStreakCount: 0
        };

        exibitionGames.forEach((exhibitionGame) => {
            let myScore = parseInt(exhibitionGame.Result.split('-')[0]);
            let opponentsScore = parseInt(exhibitionGame.Result.split('-')[1]);
            evaluatedExhibitionData.basketsScored += myScore;
            evaluatedExhibitionData.basketsReceived += opponentsScore;
            evaluatedExhibitionData.netScoreDifference += (evaluatedExhibitionData.basketsScored - evaluatedExhibitionData.basketsReceived);

            myScore > opponentsScore
                ? evaluatedExhibitionData.winStreakCount++
                : evaluatedExhibitionData.winStreakCount--
        });

        return evaluatedExhibitionData;
    }

    //check which type this should be
    //if it's only MyGame, you can't really calculate the score
    //maybe that should not be an array, but an object,
    //called myNextOpponent of type Team
    //since I'm in a knockout stage, etc etc

    /*** @param {Team} team */
    addOpponent(team)
    {
        this.nextOpponent = team;
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
        /**Kod određivanja verovatnoće pobednika uzeti u obzir i formu ekipe. 
         * Početna tačka za ovu kalkulaciju mogu biti podaci iz fajla exibitions.json 
         * u kome su dati rezultati 2 prijateljske utakmice za svaku ekipu. 
         * Formu prera;unavati kako turnir odmiče, a možete kao faktor forme uključiti
         *  i jačinu protivnika i razliku koju je ekipa ostvarila. */

        if(Math.random() > 0.5)
            score = getScores("blowout");
        else
            score = getScores("closeGame");
        //so that the higher the ranking - the greater the chance of winning is
        const winningChances = calculateWinAndLossChance(this, opposingTeam);
        const myChanceOfWinning = winningChances.myChanceOfWinning;
        const opponentsChanceOfWinning = winningChances.opponentsChanceOfWinning;

        if(myChanceOfWinning > opponentsChanceOfWinning)
        {
            this.addWin();
            this.addGame(new MyGame(
                opposingTeam.name,
                score.winnersBasketCount,
                score.losersBasketCount
            ));
            opposingTeam.addLoss();
            opposingTeam.addGame(
                new MyGame(
                    this.name,
                    score.losersBasketCount,
                    score.winnersBasketCount
                )
            );

            console.log(`${this.name} - ${opposingTeam.name} (${score.winnersBasketCount}:${score.losersBasketCount})`);
        }
        else
        {
            // deliberately added this if, there's no tie in basketball if the chances are equal
            if(myChanceOfWinning < opponentsChanceOfWinning)
            {
                this.addLoss();
                this.addGame(
                    new MyGame(
                        opposingTeam.name,
                        score.losersBasketCount,
                        score.winnersBasketCount
                    )
                );
                opposingTeam.addWin();
                opposingTeam.addGame(
                    new MyGame(
                        this.name,
                        score.winnersBasketCount,
                        score.losersBasketCount
                    )
                );
                console.log(`${this.name} - ${opposingTeam.name} (${score.losersBasketCount}:${score.winnersBasketCount})`);
            }
        }

        this.netScoreDifference = this.basketsScored - this.basketsReceived;
        opposingTeam.netScoreDifference = opposingTeam.basketsScored - opposingTeam.basketsReceived;

        //print the final result
        //won't do it here so that I don't traverse the list for no reason
    }

    getLastPlayedGame()
    {
        return this.myGames[this.myGames.length - 1];
    }
}