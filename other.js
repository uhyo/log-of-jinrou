// Script 4: other

const {
    checkFileNotExist,
    load,
    saveTo,
} = require('./util/file');

const input = "./data/gamelogs-team.json";
const output = "./data/{}.csv";

load(input)
.then(obj=>{
    const {
        data,
    } = JSON.parse(obj);
    for (const d of data){
        if (d.ratio.Werewolf === 1 && d.winner !== 'Werewolf'){
            console.log(d);
        }
    }
})
.catch(err=>{
    console.error(err);
    process.exit(1);
});
