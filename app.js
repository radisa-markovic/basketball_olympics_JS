import { promises as fsp } from "fs";
import { Group } from "./models/Group.js";

try
{
    const groups = await fsp.readFile('./groups.json', 'utf-8');
    const parsedGroupData = JSON.parse(groups);
    const groupA = new Group('A', parsedGroupData['A']);
    const groupB = new Group('B', parsedGroupData['B']);
    const groupC = new Group('C', parsedGroupData['C']);

    // console.log("Konačan plasman u grupama:");
    // groupA.printGroup();
    groupA.playFirstRound();
    // groupA.printGroup();
    groupA.playSecondRound();
    // groupA.printGroup();
    groupA.playThirdRound();
    groupA.printGroup();
}
catch(error)
{
    console.error("File error: " + error);
}