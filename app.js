import { promises as fsp } from "fs";
import { Group } from "./models/Group.js";

try
{
    const groups = await fsp.readFile('./groups.json', 'utf-8');
    const parsedGroupData = JSON.parse(groups);
    const groupA = new Group('A', parsedGroupData['A']);
    const groupB = new Group('B', parsedGroupData['B']);
    const groupC = new Group('C', parsedGroupData['C']);

    groupA.printGroup();
    groupB.printGroup();
    groupC.printGroup();
}
catch(error)
{
    console.error("File error: " + error);
}