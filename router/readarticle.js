const express = require('express');
const fs= require('fs');
const path=require('path');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});

router.get('/:artid',(req,res)=>{
    let sql=`SELECT * from artcle_table  where art_id=${req.params.artid};`;
    db.query(sql,(err,useInfo)=>{
        if(err){
            res.status(501).send('cuowu');
        }
        else {
            let address=path.join(__dirname,useInfo[0].art_address);
           // console.log(address);
            fs.readFile(address,{encoding:"utf-8"},(err,articles)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.render('article',{user:req.session.u_id,articles:articles,info:useInfo[0]});
                   // res.json({data1:data1,data2:data2});
                }
            });
        }
    })
});

module.exports=router;