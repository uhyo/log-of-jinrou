// Script 1: extract from MongoDB into JSON.
const {
    MongoClient,
} = require('mongodb');

const {
    checkFileNotExist,
    saveTo,
} = require('./util/file');

const user = "test", password = "test";
const host = "localhost:27017";
const db = "werewolf";

const output = "./data/gamelogs.json";

checkFileNotExist(output)
.then(()=> MongoClient.connect(`mongodb://${user}:${password}@${host}/${db}?w=1`))
.then(proc)
.then(result=>{
    return saveTo(output, JSON.stringify(result));
})
.then(()=>{
    console.log('done.');
})
.catch(err=>{
    console.error(err);
    process.exit(1);
});

function proc(db){
    const games = db.collection('games');

    const cursor = games.find({
        "finished": true,
        "rule.jobrule": {
            $in: ["特殊ルール.闇鍋", "特殊ルール.一部闇鍋"],
        },
    }).project({
        id: 1,
        players: 1,
        winner: 1,
    });

    return new Promise((resolve, reject)=>{
        let cnt = 0;
        const result = [];

        cursor.forEach((doc)=>{
            cnt++;
            if (cnt % 500 === 0){
                console.log(`handled ${cnt} documents`);
            }

            // 役職をカウント
            const jobs = [];
            doc.players.forEach(pl=>{
                jobs.push(pl.originalType);
            });

            result.push({
                id: doc.id,
                winner: doc.winner,
                jobs,
            });

        }, (err)=>{
            db.close();
            if (err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
}

