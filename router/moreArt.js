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
}

router.post('/',(req,res)=>{
    let page=req.body.page;
    let classify=req.body.classify;
    let sql;
    if(classify==='common'){
        sql = `SELECT artcle_table.*,user_bass.* from artcle_table,user_bass  WHERE 
                artcle_table.u_id=user_bass.u_id  ORDER BY art_id  DESC  LIMIT ${page*4+8},4`; //每次获取4条数据
    }
    else {
        let master=req.body.master;
        sql = `SELECT * FROM artcle_table WHERE u_id='${master}' ORDER BY art_id  DESC  LIMIT ${page*4+4},4`;
                                                                                                //每次获取4条数据
    }
    db.query(sql, (err, data) => {
        if (err) {
            res.status(500).send('Bad database');
        }
        else {
            /*let promise1= readdata(data[0]);
            let promise2= readdata(data[1]);
            let promise3= readdata(data[2]);
            let promise4= readdata(data[3]);
            let promise5= readdata(data[4]);
            let promise6= readdata(data[5]);
            let promise7= readdata(data[6]);
            let promise8= readdata(data[7]);*/    //以后加的数据
            let promiseLine=[];
            let length=data.length;
            for(let i=0;i<length;i++){
                promiseLine.push(readdata(data[i]));  //承诺放到数组里
            }
            Promise.all(promiseLine).then((result)=>{
                    data.forEach((item ,index)=>{
                        if(result[index].match(/src=".*?"/)){
                            data[index].pic=result[index].match(/src=".*?"/)[0].slice(5,-1);
                        }
                        data[index].showart = result[index].replace(/<.*?>/g,'').replace(/\&nbsp;/g,'');
                    });
                setTimeout(()=>{
                        res.send(data);    //前台演示需要
                    },2000);
                }
            ).catch(()=>{
                console.log(2333);
                res.send('err 2333');
            });
        }
    });
});

module.exports=router;

/*   关于函数readdata()中
* if(!datas){
*            return Promise.resolve('-');     为什么要resolve('-');而前台实际不会收到 '- '呢
*           }
*
*    首先  resolve('-')是为了 promise 可以--全部--顺利完成
*    因为我是把resolve的结果作为属于给对应的 data 的，而data是数据库检索出来的，所以上一步那些多余的 '- ',没有
*      对应的data，因此不会发给前台，前台也不必担心这个问题
*
* */