
/*访问用户主页页面  需要 ：登录用户ID，被访问者ID，被访问者的文章内容，被访问者头像地址 */

const express = require('express');
const fs= require('fs');
const path=require('path');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});

router.get('/:u_id',(req,res,next)=>{
    let u_id=req.params.u_id ;
    let user=req.session.u_id;                  //未登录是undefined  登录是用户ID
    let user_head=req.session.head;     //用户头像
    let sql=`SELECT * FROM user_bass WHERE u_id='${u_id}'`;   //获取用户ID 和 用户头像地址
    let finduser=new Promise((resolve, reject) => {
        db.query(sql,(err,data)=>{
                if(err){
                    reject('err');
                }
                else {
                    //console.log('master：');
                   // console.log(data[0]);
                    resolve(data[0]);
                }
           })
        });                         //先看看路径合不合法，实际是看看用户是否存在

    finduser.then(function (data) {             //拿到了上一步传下来的data
        return new Promise((resolve, reject) => {
            if(data===undefined){               //如果用户不存在  传404给下一步
                resolve('404');
                return 0;
            }
            let sql=`SELECT * FROM follow_table WHERE u_id='${user}' and follow_id='${u_id}'`; //关注信息
            db.query(sql,(err,followinfo)=>{
                if(err){
                    reject('data err2');
                    return 0;
                }
                data.followinfo=followinfo[0];
                resolve(data);  //{ k:v }      //用户存在的情况下，继续传数据
            });

        });
    }).then(function (data) {
           if(data==='404'){
                 next();                //跳出当前路由  给404处理
                 return 0;
             }
           let findDate=data.u_id;
           let masterhead=data.head;
           let masterinfo=data;
        let sql=`SELECT * FROM artcle_table WHERE u_id='${findDate}'  ORDER BY art_id  DESC  LIMIT 0,4`;
            db.query(sql, (err, data) => {
                if (err) {
                    res.status(500).send('Bad database');
                }
                else {
                    //onsole.log(data);
                    let promise1= readdata(data[0]);
                    let promise2= readdata(data[1]);
                    let promise3= readdata(data[2]);
                    let promise4= readdata(data[3]);
                    /*let promise5= readdata(data[4]);
                    let promise6= readdata(data[5]);
                    let promise7= readdata(data[6]);
                    let promise8= readdata(data[7]);*/
                    let promiseLine=[];
                    promiseLine.push(...[promise1,promise2,promise3,promise4]);
                    Promise.all(promiseLine).then((result)=>{
                            data.forEach((item ,index)=>{
                                if(result[index].match(/src=".*?"/)){
                                    data[index].pic=result[index].match(/src=".*?"/)[0].slice(5,-1);
                                }
                                data[index].showart = result[index].replace(/<.*?>/g,'').replace(/\&nbsp;/g,'');
                            });
                            res.render('person',{user:user,master:u_id,artData:data,masterinfo:masterinfo,user_head:user_head});       //逻辑是：如果登录ID（当然没登是null）与访问ID不同就进入访客模式。相同就是访自己
                            //console.log(data);                                                                   //传过去了登录用户ID，被访问者ID，被访问者的文章内容，被访问者头像地址
                        }
                    ).catch(()=>{
                        res.send('233');
                    });
                }
            });
    }).catch(function (err) {
        console.log(err);
        console.log(233);
    });
});
 function readdata(datas) {
    if(!datas){
        return Promise.resolve('-');
    }
    else{
        return new Promise((reslove,reject)=>{
            let  buf = Buffer.from('');
            let length=0;
            let f=fs.createReadStream(path.join(__dirname,datas.art_address)/*,{ start: 0, end: 319 }*/);
            f.on('data',(chunk)=>{
                buf+= Buffer.from(chunk);
                length+=chunk.length;
            });
            f.on('end',()=>{
                reslove(buf);
            });
            f.on('err',(err)=>{
                reject(err);
            })
        });
    }
}         //
/*...........................................................................................................*/
module.exports=router;