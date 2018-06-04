const express = require('express');
const fs= require('fs');
const path=require('path');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456',database:'hobtu'});

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
};

router.post('/',(req,res)=>{
    let page=req.body.page;
    //console.log(page);

    let sql = `SELECT * from artcle_table  ORDER BY art_id  DESC  LIMIT ${page*2+8},2`; //每次获取2条数据
    db.query(sql, (err, data) => {
        if (err) {
            res.status(500).send('Bad database');
        }
        else {
            let promise1= readdata(data[0]);
            let promise2= readdata(data[1]);
           /* let promise3= readdata(data[2]);
            let promise4= readdata(data[3]);
            let promise5= readdata(data[4]);
            let promise6= readdata(data[5]);
            let promise7= readdata(data[6]);
            let promise8= readdata(data[7]);*/    //以后加的数据
            let promiseLine=[];
            promiseLine.push(...[promise1,promise2]);
            Promise.all(promiseLine).then((result)=>{
                    data.forEach((item ,index)=>{
                        if(result[index].match(/src=".*?"/)){
                            data[index].pic=result[index].match(/src=".*?"/)[0].slice(5,-1);
                        }
                        data[index].showart = result[index].replace(/<.*?>/g,'').replace(/\&nbsp;/g,'');
                    });
                    res.send(data);
                }
            ).catch(()=>{
                console.log(2333);
                res.send('err 2333');
            });
        }
    });
});



module.exports=router;