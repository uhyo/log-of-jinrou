// Script 3: from data to csv

const {
    checkFileNotExist,
    load,
    saveTo,
} = require('./util/file');

const input = "./data/gamelogs-team.json";
const output = "./data/{}.csv";

load(input)
.then((obj)=>{
    const {
        teams,
        data,
    } = JSON.parse(obj);
    return Promise.all(teams.map(team=> true || checkFileNotExist(output.replace("{}", team)))).then(()=>{
        return Promise.all(teams.map(team=>{
            const d = makedata(team, data);
            return saveTo(output.replace("{}", team), d);
        }));
    });
})
.catch(err=>{
    console.error(err);
    process.exit(1);
});


function makedata(team, data){
    // このteam用のデータを作る
    const table = [];
    // 5%ごとに区切る
    for (let i = 0; i <= 20; i++){
        table[i] = {
            win: 0,
            total: 0,
        };
    }
    for (const {winner, ratio} of data){
        const r = ratio[team];
        // 5%の枠に入れる
        let idx = Math.floor(r * 20);
        if (Number.isNaN(idx)){
            idx = 0;
        }
        if (winner === team){
            table[idx].win++;
        }
        table[idx].total++;
    }

    // 列ごとに入れる
    const result = [];
    for (let i = 0; i <= 20; i++){
        result.push(`${i*5},${table[i].win},${table[i].total}\n`);
    }
    return result.join('');
}


