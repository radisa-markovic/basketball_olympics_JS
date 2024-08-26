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