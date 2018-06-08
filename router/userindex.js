/*  自己访问自己主页页面 */
const express = require('express');
const fs= require('fs');
const path=require('path');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});

router.get('/:u_id',(req,res,next)=>{
    let u_id=req.params.u_id ;
    let user=req.session.u_id;
    let visit='';
    let sql=`SELECT u_id FROM user_table WHERE u_id='${u_id}'`;
    let finduser=new Promise((resolve, reject) => {
        db.query(sql,(err,data)=>{
                if(err){
                    reject('err');
                }
                else {
                    resolve(data[0]);
                }
           })
        });                         //看看路径合不合法，实际是看看用户是否存在

    /*..........................................................................*/
    /*finduser.then(function (data) {
        if(data===undefined){
               next();  //跳出当前路由  给404处理
               return 0;
        }
        if(req.session.u_id!==u_id){
            res.render('person',{visit:'访客模式',user:null});     //如果退出了就不要以主人访问个人主页了，而是以访客
            return 0;
        }
        res.render('person',{visit:'',user:u_id});  //个人主页了
    }).catch(function () {
        res.send(222);
    });*/
    /*..........................................................................*/
    finduser.then(function (data) {             //拿到了上一步传下来的Data
        return new Promise((resolve, reject) => {
            if(data===undefined){               //如果用户不存在  传404给下一步
                resolve('404');
                return 0;
            }
            if(req.session.u_id!==u_id){     //用户存在的情况下，如果登录的用户id和访问该用户id不同，进入访客模式，向下穿被访问者ID
                resolve(u_id);
                return 0;
            }
            resolve(data);  //{ k:v }      //用户存在的情况下，如果登录的用户id和访问该用户id相同，访问自己，穿自己
        });
    }).then(function (data) {
           if(data==='404'){
                 next();                //跳出当前路由  给404处理
                 return 0;
             }
            if(data!==user){         //登录的用户id和访问该用户id不同
                //u_id=null;
                visit=u_id;
                }
           let findDate=data.u_id||u_id;    //二选一，有一个是undefined
           let sql=`SELECT * FROM artcle_table WHERE u_id='${findDate}'  ORDER BY art_id  DESC  LIMIT 0,8`;
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
                    let promise5= readdata(data[4]);
                    let promise6= readdata(data[5]);
                    let promise7= readdata(data[6]);
                    let promise8= readdata(data[7]);
                    let promiseLine=[];
                    promiseLine.push(...[promise1,promise2,promise3,promise4,promise5,promise6,promise7,promise8]);
                    Promise.all(promiseLine).then((result)=>{
                            data.forEach((item ,index)=>{
                                if(result[index].match(/src=".*?"/)){
                                    data[index].pic=result[index].match(/src=".*?"/)[0].slice(5,-1);
                                }
                                data[index].showart = result[index].replace(/<.*?>/g,'').replace(/\&nbsp;/g,'');
                            });
                            res.render('person',{user:user,visit:visit,artData:data});
                            //console.log(data);
                        }
                    ).catch(()=>{
                        res.send('233');
                    });
                }
            });
    }).catch(function () {
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