const express = require('express');
const mysql=require('mysql');
const router = express.Router();
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456',
    database:'hobtu'});

router.get('/',(req,res)=>{
    //console.log('login');
    res.render('login2');
});
router.post('/',(req,res)=>{
    let u_id=req.body.u_id;
    let u_password=req.body.u_password;
    //console.log( u_id +' '+ u_password);  //看看密码和账号
    //console.log( `'${u_id}'`);
    //db.connect();  去掉有助于持久链接
    let sql=`SELECT user_table.u_id,user_table.u_password 
              FROM user_table WHERE user_table.u_id='${u_id}'
               `;
    db.query(sql,(err,data)=>{
               if(err){
                   res.status(501).send('cuowu');
               }
               else{
                   console.log(data);
                   if(data[0]===undefined){
                       res.send('用户不存在');
                   }
                   else {
                       if(data[0].u_password!==u_password) {
                           res.send('密码错误');
                       }
                       else{
                           req.session.u_id=data[0].u_id;
                           res.send('ok');
                       }
                   }
               }
    });
    //db.end();

});
module.exports = router;