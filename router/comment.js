const express = require('express');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456',database:'hobtu'});
router.post('/up',(req,res,next)=>{
        if(req.session.u_id===undefined || req.session.u_id===null){    /*用户未登录，跳转登录页面*/
            res.send("请先登录");
        }
        else{
            next();
        }
     },(req,res)=>{
        let comment=req.body.comment;
        let u_id=req.session.u_id;
        let art_id=req.body.art_id;
        let commentTime=req.body.upTime;
        console.log(u_id,comment,art_id,commentTime);
        let sql=`INSERT into comment_table VALUES ('${art_id}','${u_id}','${comment}','${commentTime}',null)`;
        db.query(sql,(err,data)=>{
            if(err){
                res.status(501).send('上传异常');
                return 0;
            }
                res.send({status:'ok',u_id:u_id});
        });
});
router.post('/download',(req,res)=>{
    let art_id=req.body.art_id;
    let sql=`SELECT * FROM comment_table WHERE art_id='${art_id}' ORDER BY comment_time  DESC LIMIT 0,8`;
    let sqlCommentNum=`SELECT COUNT(*) as num FROM comment_table WHERE art_id='${art_id}';`;
    db.query(sql,(err,data)=>{   //获取评论 限制的
        if(err){
            res.status(501).send('拉取评论异常');
            return 0;
        }
        db.query(sqlCommentNum ,(err,commentNum)=>{
            if(err){
                res.status(501).send('拉取评论异常');
                return 0;
            }
            console.log("评论数：");
            console.log(commentNum[0].num);
            /*if(commentNum[0].num<=8){
                res.json(data);   //如果数据小于八条就不分页了  -----还是算了吧
                return 0;
            }*/
            res.json({data:data,commentNum:commentNum[0].num});   //发送  评论 和 评论总数量
        });
    });
});
router.post('/downloadmore',(req,res)=>{
    let page=req.body.currentPage;
    let art_id=req.body.art_id;
    let sql=`SELECT * FROM comment_table WHERE art_id='${art_id}' ORDER BY comment_time  DESC LIMIT ${page*8},8`;
    db.query(sql,(err,data)=>{
        if(err){
            res.status(501).send('data err');
            return 0;
        }
        res.send(data);
    });
});
module.exports=router;