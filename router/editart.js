const express = require('express');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});

router.get('/:artid',(req,res)=>{
    let art_id=req.params.artid;
    res.send(JSON.stringify({msg:art_id}))
});

module.exports=router;