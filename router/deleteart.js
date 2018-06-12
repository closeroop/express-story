const express = require('express');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});

router.post('/:artid',(req,res)=>{
    let art_id=req.params.artid;
   let sql=`DELETE FROM artcle_table WHERE artcle_table.art_id='${art_id}'`;
    db.query(sql,(err,data)=>{
        if(err){
            res.send(JSON.stringify({msg:'delete err'}));
            return 0 ;
        }
         res.send(JSON.stringify({msg:'delete success'}));
   });
});

module.exports=router;