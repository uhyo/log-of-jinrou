// Script 2: annotate with team info.
const path = require('path');
const expandtilde = require('expand-tilde');
const coffeescript = require('coffeescript');

const input = "./data/gamelogs.json";
const output= "./data/gamelogs-team.json";

// jinrou directory
const jinrou = "~/node/jinrou";

const {
    checkFileNotExist,
    saveTo,
    load,
} = require('./util/file');

checkFileNotExist(output)
.then(()=> load(path.resolve(expandtilde(jinrou), "client/code/shared/game.coffee")))
.then(source=>{
    const games = coffeescript.compile(source);
    // evalで実行
    const gamedata = eval(`
        var exports = {};
        var module = {exports};
        ${games}
        exports`);
    return loadGamedata(gamedata);
})
.then((gamedata)=>{
    return load(input).then(str=>{
        const data = JSON.parse(str);
        return {
            teams: gamedata.teams,
            data: annotate(data, gamedata),
        };
    });
})
.then(result=>{
    return saveTo(output, JSON.stringify(result));
})
.catch(err=>{
    console.error(err);
    process.exit(1);
});


function loadGamedata(gamedata){
    // game.coffeeの内容をアレする
    const {
        teams,
    } = gamedata;

    const jobToTeam = {};

    for (const team in teams){
        const obj = teams[team];
        for (const job of obj){
            jobToTeam[job] = team;
        }
    }
    return {
        jobToTeam,
        teams: Object.keys(teams),
    };
}

function annotate(data, {jobToTeam, teams}){
    console.log(`Annotating ${data.length} rooms`);
    data.forEach(obj=>{
        const {
            jobs,
        } = obj;
        const teamdata = [];
        const ratio = {};
        for (const team of teams){
            ratio[team] = 0;
        }

        for (const job of jobs){
            const team = jobToTeam[job];
            teamdata.push(team);
            if (!team){
                console.error(`??? ${job}`);
            }else{
                ratio[team]++;
            }
        }
        const len = jobs.length;
        for (const team of teams){
            ratio[team] /= len;
        }
        obj.teams = teamdata;
        obj.ratio = ratio;
    });
    return data;
}
