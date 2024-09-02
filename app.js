import { promises as fsp } from "fs";
import { Group } from "./models/Group.js";
import { Team } from "./models/Team.js";

try
{
    const groups = await fsp.readFile('./groups.json', 'utf-8');
    const exibitionGames = await fsp.readFile("./exibitions.json", 'utf-8');
    const parsedGroupData = JSON.parse(groups);
    const parsedExhibitionGames = JSON.parse(exibitionGames);

    const groupA = new Group('A', parsedGroupData['A'], parsedExhibitionGames);
    const groupB = new Group('B', parsedGroupData['B'], parsedExhibitionGames);
    const groupC = new Group('C', parsedGroupData['C'], parsedExhibitionGames);

    // console.log("Konačan plasman u grupama:");
    // groupA.printGroup();
    groupA.playFirstRound();
    groupA.playSecondRound();
    groupA.playThirdRound();
    const sortedGroupA = groupA.sortGroup();

    groupB.playFirstRound();
    groupB.playSecondRound();
    groupB.playThirdRound();
    const sortedGroupB = groupB.sortGroup();

    groupC.playFirstRound();
    groupC.playSecondRound();
    groupC.playThirdRound();
    const sortedGroupC = groupC.sortGroup();

    const firstPlacedTeams = [];
    firstPlacedTeams.push(sortedGroupA[0]);
    firstPlacedTeams.push(sortedGroupB[0]);
    firstPlacedTeams.push(sortedGroupC[0]);
    firstPlacedTeams.sort((teamA, teamB) => sortByRank(teamA, teamB));

    const secondPlacedTeams = [];
    secondPlacedTeams.push(sortedGroupA[1]);
    secondPlacedTeams.push(sortedGroupB[1]);
    secondPlacedTeams.push(sortedGroupC[1]);
    secondPlacedTeams.sort((teamA, teamB) => sortByRank(teamA, teamB));

    const thirdPlacedTeams = [];
    thirdPlacedTeams.push(sortedGroupA[2]);
    thirdPlacedTeams.push(sortedGroupB[2]);
    thirdPlacedTeams.push(sortedGroupC[2]);
    thirdPlacedTeams.sort((teamA, teamB) => sortByRank(teamA, teamB));
    thirdPlacedTeams.splice(2);//remove the last ranked team

    const potD = [firstPlacedTeams[0], firstPlacedTeams[1]];
    const potE = [firstPlacedTeams[2], secondPlacedTeams[0]];
    const potF = [secondPlacedTeams[1], secondPlacedTeams[2]];
    const potG = [thirdPlacedTeams[0], thirdPlacedTeams[1]];

    //Now I have the pots, seeding needs to be done to order the proper teams

    drawQuarterfinalPairs(potD, potE);
    drawQuarterfinalPairs(potF, potG);
    
    //now teams have their opponents in scheduledOpponents array
    //the games should be played now
    console.log("=====================>>>>> Playoffs");
    potD[0].playWithTeam(potD[0].nextOpponent);//1 team from D goes to F bracket
    potD[1].playWithTeam(potD[1].nextOpponent);//1 team from here goes to matching F bracket
    console.log("=====================>>>>> Playoffs - other bracket  <===");
    potF[0].playWithTeam(potF[0].nextOpponent);
    potF[1].playWithTeam(potF[1].nextOpponent);

    //to get the winner, access last added element of myGames array
    //should be the last one, that's what JS push does
    //then pair d with f for semifinals, and repeat the process for finals

    let quarterfinalWinner1;
    let quarterfinalWinner2;
    let quarterfinalWinner3;
    let quarterfinalWinner4;
    
    if(potD[0].myGames[potD[0].myGames.length - 1].opponentWasBeaten())
        quarterfinalWinner1 = potD[0];
    else
        quarterfinalWinner1 = potD[0].nextOpponent;

    if(potD[1].myGames[potD[1].myGames.length - 1].opponentWasBeaten())
        quarterfinalWinner2 = potD[1];
    else
        quarterfinalWinner2 = potD[1].nextOpponent;

    if(potF[0].myGames[potF[0].myGames.length - 1].opponentWasBeaten())
        quarterfinalWinner3 = potF[0];
    else
        quarterfinalWinner3 = potF[0].nextOpponent;

    if(potF[1].myGames[potF[1].myGames.length - 1].opponentWasBeaten())
        quarterfinalWinner4 = potF[1];
    else
        quarterfinalWinner4 = potF[1].nextOpponent;

    //print out the quarterfinalist winners
    console.log("Playoff winners:");
    console.log(quarterfinalWinner1.name);
    console.log(quarterfinalWinner2.name);
    console.log(quarterfinalWinner3.name);
    console.log(quarterfinalWinner4.name);

    //manually assigning tournament pairs
    //1st and 3rd, 2nd and 4th
    quarterfinalWinner1.nextOpponent = quarterfinalWinner3;
    quarterfinalWinner3.nextOpponent = quarterfinalWinner1;
    quarterfinalWinner2.nextOpponent = quarterfinalWinner4;
    quarterfinalWinner4.nextOpponent = quarterfinalWinner2;

    //play the games
    quarterfinalWinner1.playWithTeam(quarterfinalWinner1.nextOpponent);
    quarterfinalWinner2.playWithTeam(quarterfinalWinner2.nextOpponent);

    let firstFinalist;
    let secondFinalist;

    if(quarterfinalWinner1.getLastPlayedGame().opponentWasBeaten())
        firstFinalist = quarterfinalWinner1;
    else
        firstFinalist = quarterfinalWinner1.nextOpponent;

    if(quarterfinalWinner2.getLastPlayedGame().opponentWasBeaten())
        secondFinalist = quarterfinalWinner2;
    else
        secondFinalist = quarterfinalWinner2.nextOpponent;

    console.log("******* Finalists ***********");
    console.log(firstFinalist.name);
    console.log(secondFinalist.name);

    firstFinalist.nextOpponent = secondFinalist;
    secondFinalist.nextOpponent = firstFinalist;

    console.log("***** Final game *****");
    firstFinalist.playWithTeam(secondFinalist);

    let tournamentWinner;

    if(firstFinalist.getLastPlayedGame().opponentWasBeaten())
        tournamentWinner = firstFinalist;
    else
        tournamentWinner = secondFinalist;

    console.log("WINNER GOLD MEDAL");
    console.log(tournamentWinner.name);
    // groupA.printGroup();
}
catch(error)
{
    console.error(error);
}

/**
 * 
 * @param {Team} teamA 
 * @param {Team} teamB 
 */
function sortByRank(teamA, teamB)
{
    if(teamA.points > teamB.points)
        return -1;

    if(teamA.points === teamB.points)
    {
        if(teamA.netScoreDifference > teamB.netScoreDifference)
            return 1;
        else
            if(teamA.basketsScored > teamB.basketsScored)
                return -1;
    }

    return 1;
}

//each pot has the same amount of teams, draw lasts until no more teams remain in it
/**
 * 
 * @param {Team[]} potA 
 * @param {Team[]} potB 
 */
function drawQuarterfinalPairs(potA, potB)
{
    let numberOfDrawnTeams = 0;

    while(numberOfDrawnTeams !== potA.length)
    {
        let randomNumberFromA = Math.trunc(Math.random() * 1_000) % potA.length; 
        let randomNumberFromB = Math.trunc(Math.random() * 1_000) % potB.length; 
        //if the numbers are not drawn, or if one of them has already got an opponent
        //then do redraw
        if(
            !potA[randomNumberFromA].nextOpponent &&
            !potB[randomNumberFromB].nextOpponent
        )
        {
            //can't break out of forEach, use while loop instead
            let matchIsScheduled = false;
            let gameID = 0;
            while(!matchIsScheduled)
            {
                //if two teams didn't play game in group stage
                if(
                    potA[randomNumberFromA].myGames[gameID].opponentsName !==
                    potB[randomNumberFromB].name
                )
                {
                    //mutually schedule games
                    potA[randomNumberFromA].addOpponent(potB[randomNumberFromB]);
                    potB[randomNumberFromB].addOpponent(potA[randomNumberFromA]);
                    matchIsScheduled = true;
                    numberOfDrawnTeams++;
                }
                else
                {
                    //get another team from the second pot to match with the first team
                    randomNumberFromB = Math.trunc(Math.random() * 1_000) % potB.length;
                }

                gameID++;
            }
        }
        // else
        // {
        //     randomNumberFromA = Math.trunc(Math.random() * 1_000) % potA.length; 
             
        // }        
    }


}