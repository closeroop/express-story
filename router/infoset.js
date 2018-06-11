const express = require('express');
const mysql=require('mysql');
const multipart=require('multiparty');
const path=require('path');
const fs= require('fs');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});

router.get('/',(req,res)=>{
    let user_come=req.session.u_id;
    let sql=`SELECT * FROM user_bass WHERE u_id='${user_come}'`;
    db.query(sql,(err,data)=>{
       if(err){
           res.send('err');
           return 0;
       }
        res.render('infoSet',{user:user_come,basicdata:data[0]});
        //console.log(data[0]);
    });

});
router.post('/portrait',(req,res)=>{
    let user_come=req.session.u_id;
    let now=Date.parse(new Date());
    let form=new multipart.Form({uploadDir:'./upload/upprotrait'});
    form.parse(req,function (err,filds,files) {
        if(err){
            res.send({
                "msg":'失败'
            });
        }
        else{
            //console.log('修改的信息：');
            //console.log(filds);   //传过来的data
            let inputFile=files.uppic[0];
            //console.log(inputFile);   //查看文件信息
            let extname= path.extname(inputFile.originalFilename) ;
            let oldname=inputFile.path;
            let newname;
            newname=`./upload/upprotrait/`+now+`${extname}`;
            fs.rename(oldname,newname,(err)=>{
                if(err){
                    res.send({
                        "msg":'失败2'
                    });
                }
                else{
                    let sql;
                    if(extname===''){ //如果无扩展名，即是上传的空文件，就不更新数据库库的图片路径
                        fs.unlink(newname,function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        sql=`UPDATE user_bass set sex='${filds.sex[0]}',minname='${filds.minname[0]}',intro='${filds.intro[0]}',phone='${filds.phone[0]}',
                                    birth='${filds.birth[0]}' WHERE u_id='${user_come}'`;

                    }
                    else {
                        sql=`UPDATE user_bass set sex='${filds.sex[0]}',minname='${filds.minname[0]}',intro='${filds.intro[0]}',phone='${filds.phone[0]}',
                                    birth='${filds.birth[0]}', head='${newname}' WHERE u_id='${user_come}'`;
                    }
                    db.query(sql,(err,data)=>{
                        if(err){
                            res.send({
                                "msg":"band data"
                            });
                            return 0;
                        }
                        res.send({
                            "msg":"success"
                        });
                    });
                }
            })

        }
    });
});   //修改个人资料
module.exports=router;