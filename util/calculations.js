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

/**
 * 
 * @param {Team} teamA 
 * @param {Team} teamB 
 * @returns 
 */
/*formula should include something like "win rating" regarding if you beat like Puerto Rico
and South Sudan, you don't have the same rating like losing to USA by a point,
but I'm short on personal time at the moment of writing this code*/
export function calculateWinAndLossChance(teamA, teamB)
{
    //maybe a statistics object like
    // win/loss ratio
    // fiba ranking (adjusted)
    const TOTAL_FIBA_MEMBERS_COUNT = 212;
    let myChanceOfWinning = 
        (TOTAL_FIBA_MEMBERS_COUNT - teamA.fibaRanking) + 
        (teamA.winStreakCount + teamA.exhibitionData.netScoreDifference) + 
        teamA.netScoreDifference + Math.random() * teamA.winStreakCount;
    let opponentsChanceOfWinning = 
        (TOTAL_FIBA_MEMBERS_COUNT - teamB.fibaRanking) + 
        teamB.winStreakCount + teamB.exhibitionData.netScoreDifference + 
        teamB.netScoreDifference + Math.random() * teamB.winStreakCount;

    if(teamA.fibaRanking - teamB.fibaRanking > 10)
        myChanceOfWinning += 10;
    if(teamB.fibaRanking - teamA.fibaRanking > 10)
        opponentsChanceOfWinning += 10;

    return {
        myChanceOfWinning,
        opponentsChanceOfWinning
    }
}