const fs = require('fs');

// file h
function checkFileNotExist(file){
    return new Promise((resolve, reject)=>{
        fs.stat(file, err=>{
            if (err && err.code === 'ENOENT'){
                // OK
                resolve();
            }else if (err){
                reject(err);
            }else{
                reject(new Error('Output file already exitsts!'));
            }
        });
    });
}
exports.checkFileNotExist = checkFileNotExist;

function saveTo(file, content){
    return new Promise((resolve, reject)=>{
        fs.writeFile(file, content, 'utf8', err=>{
            if (err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
}
exports.saveTo = saveTo;

function load(file){
    return new Promise((resolve, reject)=>{
        fs.readFile(file, 'utf8', (err, buf)=>{
            if (err){
                reject(err);
            }else{
                resolve(buf);
            }
        });
    });
}
exports.load = load;
