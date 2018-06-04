const express = require('express');
const multipart=require('multiparty');
const moment=require('moment');
const mysql=require('mysql');
const fs= require('fs');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456',
    database:'hobtu'});
router.post('/upImg',(req,res)=>{
    let now=Date.parse(new Date());
    /*let now=moment().toDate();
    let mun=Math.floor(Math.random()*100000);
    now=moment().format('YYYY-MM-DD')+ mun;*/
    let form=new multipart.Form({uploadDir:'./upload/upImg'});
    form.parse(req,function (err,filds,files) {
        if(err){
            res.send({
                "errno":'失败',
                "data": []
            });
        }
        else{
            let inputFile=files.yourImg[0];
            let oldname=inputFile.path;
            fs.rename(oldname,`./upload/upImg/`+now+`.png`,(err)=>{
                if(err){
                    res.send('err2');
                }
                else{
                    res.send({
                        "errno": 0,
                        "data": [
                            `.`+`./upload/upImg/`+now+`.png`
                        ]
                    })
                }
            })
        }
    });
});
router.post('/upArt',(req,res,next)=>{
    if(req.session.u_id===undefined || req.session.u_id===null){    /*用户未登录，跳转登录页面*/
        res.redirect('/login');
    }
    else{
        next();
    }
},(req,res)=>{
    let content=req.body.content;
    let title=req.body.title;
    let artId=Date.parse(new Date());
    /*let artId=moment().toDate();
    let mun=Math.floor(Math.random()*100000);
    artId=moment().format('YYYY-MM-DD')+ mun;*/
    let address='./upload/upArt/'+artId+'.txt';
    fs.writeFile(address,content,(err)=>{
        if (err) throw err;
        else {
            console.log('The file has been saved!');
            sql=`INSERT INTO artcle_table VALUES ('${req.session.u_id}','${artId}','${title}','.${address}',0,0)`;
            db.query(sql,(err,data)=>{
                if(err){
                    res.status(501).send('cuowu');
                    return 0;
                }
                else{
                    res.send('ok');
                }
            })
        }
    })
});
module.exports=router;