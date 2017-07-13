// Extract log from script
const {
    MongoClient,
} = require('mongodb');

const user = "test", password = "test";
const host = "localhost:27017";
const db = "werewolf";

const IP = "::ffff:127.0.0.1";
const type = "speak";

MongoClient.connect(`mongodb://${user}:${password}@${host}/${db}?w=1`)
.then(proc)
.catch(err=>{
    console.error(err);
    process.exit(1);
});

function proc(db){
    const logs = db.collection('logs');

    const query = {
        ip: IP,
    };
    if (type){
        query.type = type;
    }

    const cursor = logs.find(query)
    .sort({
        timestamp: 1,
    });

    return new Promise((resolve, reject)=>{
        cursor.forEach(({
            type,
            comment,
            ip,
            timestamp,
        })=>{
            console.log(`[${type}] [${ip}] [${new Date(timestamp).toISOString()}] ${comment}`);
        }, err=>{
            db.close();
            if (err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
}
