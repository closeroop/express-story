const express = require('express');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456',database:'hobtu'});

router.get('/likeme',(req,res)=>{    //喜欢
    let u_id=req.session.u_id;
    let art_id=req.query.art_id;
    if(u_id===null){
        res.send(JSON.stringify({msg:'no jurisdiction'}));
        return 0;
    }
    let sql=`INSERT into like_table VALUES ('${u_id}','${art_id}',0)`;   //
    db.query(sql,(err,data)=>{
        if(err){
            res.send(JSON.stringify({msg:'data err'}));
            return 0;
        }
        let sql=`UPDATE artcle_table set art_like=(SELECT COUNT(likedart_id) FROM like_table WHERE 
        like_table.likedart_id='${art_id}') WHERE artcle_table.art_id='${art_id}'`;    //喜欢写入后更新文章喜欢数量
        db.query(sql,(err,data)=>{
            if(err){
                res.send(JSON.stringify({msg:'data err'}));
                return 0;
            }
            res.send(JSON.stringify({msg:'ok'}));
        });
    });
});
router.get('/nolike',(req,res)=>{  //不喜欢
    let u_id=req.session.u_id;
    let art_id=req.query.art_id;
    if(u_id===null){
        res.send(JSON.stringify({msg:'no jurisdiction'}));
        return 0;
    }
    let sql=`DELETE FROM like_table WHERE u_id='${u_id}' and likedart_id='${art_id}';`;
    db.query(sql,(err,data)=>{
        if(err){
            res.send(JSON.stringify({msg:'data err'}));
            return 0;
        }
        let sql=`UPDATE artcle_table set art_like=(SELECT COUNT(likedart_id) FROM like_table WHERE 
        like_table.likedart_id='${art_id}') WHERE artcle_table.art_id='${art_id}'`;//喜欢取消后更新文章喜欢数量
        db.query(sql,(err,data)=>{
            if(err){
                res.send(JSON.stringify({msg:'data err'}));
                return 0;
            }
            res.send(JSON.stringify({msg:'ok'}));
        });
    });
});
router.get('/follow',(req,res)=>{    //关注
    let u_id=req.session.u_id;
    let followed_id=req.query.followed_id;
    if(u_id===null){
        res.send(JSON.stringify({msg:'no jurisdiction'}));
        return 0;
    }
    let sql=`INSERT into follow_table VALUES ('${u_id}','${followed_id}',0)`;  //写入关注表
    db.query(sql,(err,data)=>{
        if(err){
            res.send(JSON.stringify({msg:'data err'}));
            return 0;
        }
        res.send(JSON.stringify({msg:'ok'}));
    });
});
router.get('/escfollow',(req,res)=>{  //不关注
    let u_id=req.session.u_id;
    let followed_id=req.query.followed_id;
    if(u_id===null){
        res.send(JSON.stringify({msg:'no jurisdiction'}));
        return 0;
    }
    let sql=`DELETE FROM follow_table WHERE u_id='${u_id}' and follow_id='${followed_id}'`;  //取消关注人
    db.query(sql,(err,data)=>{
        if(err){
            res.send(JSON.stringify({msg:'data err'}));
            return 0;
        }
        res.send(JSON.stringify({msg:'ok'}));
    });
});
module.exports=router;