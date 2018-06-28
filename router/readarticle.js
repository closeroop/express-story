const express = require('express');
const fs= require('fs');
const path=require('path');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});

router.get('/:artid',(req,res)=>{
    let user_head=req.session.head;     //用户头像
    let user_come=req.session.u_id;      //用户ID
    let sql=`SELECT * from artcle_table  where art_id=${req.params.artid};`;
    let sql2=`UPDATE artcle_table SET art_view =art_view+1  WHERE art_id='${req.params.artid}'`;//更新浏览量
    let sql3=`SELECT * FROM like_table WHERE u_id='${user_come}' and likedart_id='${req.params.artid}'`; //喜欢文章吗
    db.query(sql2,(err,data)=>{
        if(err){
            res.status(501);
        }
    });
    let promise=new Promise((resolve,reject)=>{
        db.query(sql,(err,useInfo)=> {   //获得文章信息
            if (err) {
                reject('data err1');
                return 0;
            }
            resolve(useInfo[0]);
        });
    });
    promise.then((useInfo)=>new Promise((resolve,reject)=>{
        let address=path.join(__dirname,useInfo.art_address); //读取文章
        fs.readFile(address,{encoding:"utf-8"},(err,articles)=>{
            if(err){
                reject('readFile err2');
                return 0;
            }
            let datas={info:useInfo,articles:articles };
            resolve(datas);
        });
    })).then((datas)=>new Promise((resolve,reject)=>{
        db.query(sql3,(err,likeinfo)=>{   //获取喜欢信息
            if(err){
                reject('data err3');
                return 0;
            }
            datas.likeinfo=likeinfo[0];
            resolve(datas);
        });
    })).then((datas)=>{
        let sql=`SELECT * FROM follow_table WHERE u_id='${user_come}' and follow_id='${datas.info.u_id}'`; //关注信息
        db.query(sql,(err,followinfo)=>{
            if(err){
                res.send('err4');
                return 0;
            }
            datas.followinfo=followinfo[0];
            datas.user=user_come;
            datas.user_head=user_head;
            res.render('article',datas);
        });
    }).catch(function (err) {
        console.log(err);
        res.send('err');
    });
    /*db.query(sql,(err,useInfo)=>{
        if(err){
            res.status(501).send('err0');return 0;
        }
        else {
            let address=path.join(__dirname,useInfo[0].art_address);
            fs.readFile(address,{encoding:"utf-8"},(err,articles)=>{
                if(err){
                    console.log(err);
                    res.send('err1');return 0;
                }
                else{
                    db.query(sql3,(err,likeinfo)=>{
                        if(err){
                            res.status(501).send('err2');return 0;
                        }
                        res.render('article',{user:user_come,articles:articles,info:useInfo[0],user_head:user_head,likeinfo:likeinfo[0]});
                    });
                }
            });
        }
    })*/
});

module.exports=router;