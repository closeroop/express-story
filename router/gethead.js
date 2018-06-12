const express = require('express');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});

router.post('/',(req,res)=>{
    let head=req.body.userhead;
    let sql;
    sql=`SELECT user_bass.head from user_bass  WHERE u_id='${head}'`;
    db.query(sql,(err,data)=>{
       if(err){
           res.send('bad data');
           return 0;
       }
        console.log("请求者头像：");
        console.log(data);
        res.send(data);
    });

});
module.exports=router;