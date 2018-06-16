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
    let sql=`SELECT  comment_table.*,user_bass.head FROM comment_table,user_bass 
             WHERE art_id='${art_id}' and comment_table.u_id=user_bass.u_id
             ORDER BY comment_table.comment_time  DESC LIMIT 0,8`;               //拉取文章评论 和评论者信息
    let sqlCommentNum=`SELECT COUNT(*) as num FROM comment_table WHERE art_id='${art_id}';`;  //拉取总评论数
    let replies=`SELECT * FROM reply_table WHERE art_id='${art_id}' `;      //拉取这篇文章评论者间的回复
    let promise=new Promise((resolve,reject)=>{            //拉取文章
        db.query(sql,(err,data)=>{
            if(err){
                reject('err1');
                return 0;
            }
            data.forEach((item,index)=>{
                 data[index].comment_comment=[];         //给回复用的位置
            });
            resolve(data);
             });
        });
    promise.then(function (data) {
        return new Promise((resolve,reject)=>{
            db.query(sqlCommentNum ,(err,commentNum)=>{             //拉取总评论数
                if(err){
                    reject('err2');
                    return 0;
                }
                console.log("评论数：");
                console.log(commentNum[0].num);
                resolve({data:data,commentNum:commentNum[0].num,reply:null})   //这里的reply你懂得
            }) ;
        });
    }).then(function (data) {
         return new Promise((resolve,reject)=>{
            db.query(replies,(err,replies)=>{
                if(err){
                    reject('err3');
                    return 0;
                }
                data.reply=replies;
                resolve(data);
            });
         });
    }).then(function (data) {
        let comment=mix(data.data,data.reply);      //把回复 push 到data的comment_comment 里
        res.json({data:comment,commentNum:data.commentNum});   //发送  评论 和 评论总数量
    }).catch(function (err) {
        res.send("data err");
        console.log(err);
    });

    /*db.query(sql,(err,data)=>{   //获取评论 限制的
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
            res.json({data:data,commentNum:commentNum[0].num});   //发送  评论 和 评论总数量
        });
    });*/  //该部分已经由Promise 函数重写

});
router.post('/downloadmore',(req,res)=>{
    let page=req.body.currentPage;
    let art_id=req.body.art_id;
    let sql=`SELECT comment_table.*,user_bass.head FROM comment_table,user_bass 
              WHERE art_id='${art_id}' and comment_table.u_id=user_bass.u_id 
              ORDER BY comment_table.comment_time  DESC LIMIT ${page*8},8`;
    let replies=`SELECT * FROM reply_table WHERE art_id='${art_id}' `;
    db.query(sql,(err,data)=>{
        if(err){
            res.status(501).send('err data');
            return 0;
        }
        data.forEach((item,index)=>{
            data[index].comment_comment=[];         //同上上上
        });
        db.query(replies,(err,replies)=>{
            if(err){
                res.send('err data');
                return 0;
            }
            let comment=mix(data,replies);     //同上操作
            res.send(comment);
        });
    });
});
router.post('/comtocom',(req,res)=>{
    let art_id=req.body.art_id;
    let comment_user=req.body.comment_user;
    let commented_user=req.body.commented_user;
    let commentTime=req.body.comment_time;
    let content=req.body.content;
    let comment_id=req.body.comment_id;
    let sql=`insert into reply_table values ('${comment_id}','${art_id}','${content}','${commentTime}',
                                              '${comment_user}','${commented_user}',null)`;
    db.query(sql,(err)=>{
       if(err){
           res.send(JSON.stringify({msg:'insert err'}));
           return 0;
       }
       res.send(JSON.stringify({msg:'insert success'}));
    });
});
module.exports=router;
function mix(a,b){     //把回复加到评论中
    for(let data1 of a){
        for (let data2 of b) {
            if(data2.comment_id===data1.comment_time){
                data1.comment_comment.push(data2);
            }
        }
    }
    return a;
}