const mysql=require('mysql');
const path=require('path');
const fs= require('fs');
let db=mysql.createConnection({host:'127.0.0.1',user:'root',password:'123456', database:'hobtu'});
let pagesql=`SELECT count(*) as pages from artcle_table`;
let pages;   //数据的条数
let returndata;
 db.query(pagesql,(err,data)=>{
    if(err){
        console.log(err);
    }
    else{
        pages=data[0].pages;
        console.log(pages+"  条数据");     //9
    }
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
 }         //获取几个文件的前几句话

    /*let page=Math.ceil(~~pages / 4);     //数据页数 3
    let remainder=~~pages%4;             //余数*/
!function(){
    let sql = `SELECT * from artcle_table LIMIT 0,4`; //每次获取四条数据
    console.log(`页数：${Math.ceil(pages/4)}`);    //3
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            let promise1= readdata(data[0]);
            let promise2= readdata(data[1]);
            let promise3= readdata(data[2]);
            let promise4= readdata(data[3]);
            Promise.all([promise1,promise2,promise3,promise4]).then((result)=>{
                    data.forEach((item ,index)=>{
                        data[index].showart = result[index].slice(0,-1);
                    });
                    returndata=result;
                }
            )
        }
    });
}();

module.exports={data:returndata};
