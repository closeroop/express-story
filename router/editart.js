const express = require('express');
const mysql=require('mysql');
const fs= require('fs');
const path=require('path');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});

router.get('/:artid',(req,res)=>{
    let art_id=req.params.artid;
    let user=req.session.u_id;                  //未登录是undefined  登录是用户ID
    let user_head=req.session.head;           //用户头像
    /*res.send(JSON.stringify({msg:art_id}))*/
    let sql=`SELECT * from artcle_table  where art_id=${req.params.artid};`;
    db.query(sql,(err,useInfo)=>{
        if(err){
            res.status(501).send('err');
        }
        else {
            let address=path.join(__dirname,useInfo[0].art_address);
            fs.readFile(address,{encoding:"utf-8"},(err,articles)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.render('editArticle',{user:user,articles:articles,info:useInfo[0],user_head:user_head});
                }
            });
        }
    });
});

router.post('/save',(req,res)=>{
    let content=req.body.content;
    let title=req.body.title;
    let art_id=req.body.art_id;
    /*let address='./upload/upArt/'+art_id+'.txt';*/ //这样也可以
    let address=path.join(__dirname,'../upload/upArt/'+art_id+'.txt');
    //console.log(address);
    //C:\Users\ASUS\Desktop\test\demo2\upload\upArt\1528200758000.txt   ---->  '../upload/upArt/'+art_id+'.txt'   __dirname当前文件所在目录完整路径
    //C:\Users\ASUS\Desktop\test\demo2\router\upload\upArt\1528200758000.txt  ---->  './upload/upArt/'+art_id+'.txt'
    let sql=`UPDATE artcle_table SET art_head='${title}' WHERE art_id='${art_id}'`;
    fs.writeFile(address,content,(err)=>{
        if(err){
            res.send(JSON.stringify({msg:'err data'}));
            return 0;
        }
        db.query(sql,(err,data)=>{
            if(err){
                res.send(JSON.stringify({msg:'err data'}));
                return 0;
            }
            res.send(JSON.stringify({msg:'ok'}));
        })
    });

});

module.exports=router;