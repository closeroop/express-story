const express = require('express');
const fs= require('fs');
const path=require('path');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});
router.get('/',(req,res)=>{
    //console.log(req.session.u_id);

    if(req.session.u_id===undefined){   //第一次的时候  req.session.u_id 是 undefined 呀！这里其实可以省略了
        req.session.u_id=null;
    }
    let user_come=req.session.u_id;
    /*................................................................................*/
    /*let pagesql=`SELECT count(*) as pages from artcle_table`;
    let pages;                                                  //数据的条数
    db.query(pagesql,(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            pages=data[0].pages;
            //console.log(pages+"  条数据");     //9
            let page=Math.ceil(~~pages / 4);     //数据页数 3
            let remainder=~~pages%4;             //余数
            //console.log(`页数：${Math.ceil(pages/4)}`);    //3
        }
    });*/
    /*................................................................................*/
    let sql = `SELECT artcle_table.*,user_bass.* from artcle_table,user_bass  WHERE artcle_table.u_id=user_bass.u_id ORDER BY art_id DESC  LIMIT 0,8`; //每次获取8条数据
    db.query(sql, (err, data) => {
        if (err) {
            res.status(500).send('Bad database');
        }
        else {
            let promise1= readdata(data[0]);
            let promise2= readdata(data[1]);
            let promise3= readdata(data[2]);
            let promise4= readdata(data[3]);
            let promise5= readdata(data[4]);
            let promise6= readdata(data[5]);
            let promise7= readdata(data[6]);
            let promise8= readdata(data[7]);
            let promiseLine=[];
            promiseLine.push(...[promise1,promise2,promise3,promise4,promise5,promise6,promise7,promise8]);
            Promise.all(promiseLine).then((result)=>{
                    data.forEach((item ,index)=>{
                        if(result[index].match(/src=".*?"/)){
                            data[index].pic=result[index].match(/src=".*?"/)[0].slice(5,-1);
                        }
                        data[index].showart = result[index].replace(/<.*?>/g,'').replace(/\&nbsp;/g,'');
                    });
                    res.render('home',{user:user_come,artData:data});
                    //console.log(data[0]);
                }
            ).catch(()=>{
                res.send('err')
            });
        }
    });
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
module.exports=router;