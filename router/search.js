const express = require('express');
const mysql=require('mysql');
const fs= require('fs');
const path=require('path');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456',
    database:'hobtu'});

router.get('/',(req,res)=>{
    let question=req.query.question;
    let sql=`SELECT * FROM artcle_table WHERE art_head LIKE "%${question}%";`;
    db.query(sql,(err,data)=>{
        if(err){
            res.send(JSON.stringify({'msg':'data err'}));
            return 0;
        }
        if(data.length===0){
            res.send(JSON.stringify({'msg':'no data'}));
            return 0;
        }
        //console.log(data.length);
        let length=data.length;
        let promiseLine=[];
        for(let i=0;i<length;i++){
            promiseLine.push(readdata(data[i]));
        }
        Promise.all(promiseLine).then((result)=>{
                data.forEach((item ,index)=>{
                    if(result[index].match(/src=".*?"/)){
                        data[index].pic=result[index].match(/src=".*?"/)[0].slice(5,-1);
                    }
                    data[index].showart = result[index].replace(/<.*?>/g,'').replace(/\&nbsp;/g,'');
                });
                res.send(JSON.stringify({...data}));
            }
        ).catch(()=>{
            res.send(JSON.stringify({'msg':'data err'}));
        });
    })
});
function readdata(datas) {
    if(!datas){
        return Promise.resolve('-');
    }
    else{
        return new Promise((reslove,reject)=>{
            let  buf = Buffer.from('');
            let length=0;
            let f=fs.createReadStream(path.join(__dirname,datas.art_address)/*,{ start: 0, end: 319 }*/);
            f.on('data',(chunk)=>{
                buf+= Buffer.from(chunk);
                length+=chunk.length;
            });
            f.on('end',()=>{
                reslove(buf);
            });
            f.on('err',(err)=>{
                reject(err);
            })
        });
    }
}         //获取几个文件的前几句话
module.exports = router;