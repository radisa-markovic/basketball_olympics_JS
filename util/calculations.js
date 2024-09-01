/**
 * 
 * @param {"blowout" | "closeGame" | "official"} typeOfVictory 
 * @returns 
 */
export function getScores(typeOfVictory)
{
    //if there was a no show or any form of interruption
    //score is officially 20:0
    let winnersBasketCount;
    let losersBasketCount;

    switch(typeOfVictory)
    {
        case "blowout":
            winnersBasketCount = 130;
            losersBasketCount = 80;
            break;

        case 'closeGame':
            winnersBasketCount = 87;
            losersBasketCount = 86;
            break;
        
        case 'official':
        default:
            winnersBasketCount = 20;
            losersBasketCount = 0;
            break;
    }

    return {
        winnersBasketCount,
        losersBasketCount
    };
}

export function calculateWinAndLossChance(teamA, teamB)
{
    //maybe a statistics object like
    // win/loss ratio
    // fiba ranking (adjusted)
    const TOTAL_FIBA_MEMBERS_COUNT = 212;
    let myChanceOfWinning = (TOTAL_FIBA_MEMBERS_COUNT - teamA.fibaRanking) * Math.random() + teamA.winStreakCount * teamA.exhibitionData.netScoreDifference;
    let opponentsChanceOfWinning = (TOTAL_FIBA_MEMBERS_COUNT - teamB.fibaRanking) * Math.random() + teamB.winStreakCount * teamB.exhibitionData.netScoreDifference;

    if(teamA.fibaRanking - teamB.fibaRanking > 10)
        myChanceOfWinning += 10;
    if(teamB.fibaRanking - teamA.fibaRanking > 10)
        opponentsChanceOfWinning += 10;

    return {
        myChanceOfWinning,
        opponentsChanceOfWinning
    }
}