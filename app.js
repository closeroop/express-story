 /* jshint esversion: 6 */
    const express=require('express');
    const bodyparser=require('body-parser');
    const cookieSession=require('cookie-session');
    const path=require('path');
    const login=require('./router/login');
    const  index=require('./router/index');
    const  readdata=require('./router/readdata');
    const upload=require('./router/upload');
    const readarticle=require('./router/readarticle');
    const comment=require('./router/comment');
    const moreArt=require('./router/moreArt');
    const userindex=require('./router/userindex');
    const infoset=require('./router/infoset');
    const  gethead=require('./router/gethead');
    const deleteart=require('./router/deleteart');
    const editart=require('./router/editart');
    const server=express();
    server.use(bodyparser.urlencoded({}));
    server.set('view engine','ejs') ; //输出什么东西
    server.set('views',path.join(__dirname, "views"));   //模板文件位置
    server.use(cookieSession({
                        name:'Yx',   //会话名
                        keys:['ok','nice','yours'],   //秘钥
                        maxAge:1000*60*60*5     //会话时间 5个小时
                        })); //会话设置

   server.use((req,res,next)=>{
       if(req.session.u_id===undefined){
           req.session.u_id=null;
       }
       if(req.session.head===undefined){
           req.session.head=null;
       }
       //console.log(server.locals.bb);
       next();
   });                              //防止越级访问后 造成req.session.u_id为被设置为null

    server.use('/',index);    //首页路由

    server.use('/moreArt',moreArt);  //首页下拉获取更多的推送

    server.use('/login',login);  //  登录/注册 路由

    server.get('/getout',(req,res)=>{
         req.session.u_id=null;
         req.session.head=null;
         res.redirect('/');
    });     //用户退出

    server.get('/writeArt',(req,res,next)=>{
         if(req.session.u_id===undefined || req.session.u_id===null){    /*用户未登录，跳转登录页面*/
             res.redirect('/login');
         }
         else{
             next();
         }
        },(req,res)=>{
             res.render('writeArticle');
        });   /* 写文章路由  */

    server.use('/upload',upload)  ;    //上传图片 文章路由

    server.use('/art',readarticle);   //写文章

   server.use('/comment',comment);  //添加评论和显示评论

    server.use('/getdata',readdata);  //得到展示数据demo

   server.use('/user',userindex);    //个人主页

   server.use('/infoset',infoset);   //个人信息设置

    server.use('/getface',gethead); //获取头像

    server.use('/delete',deleteart);  //删除文章

    server.use('/edit',editart);    //修改文章   （编辑文章）

    server.use(express.static('./'));
    server.use(express.static('./static'));
    server.use('/art',express.static('./static'));
    server.use('/user',express.static('./static'));

     server.use((req,res,next)=>{
         res.status(404).send('sorry');   //404页面  一定要写最后啊
     });

    server.listen(8080);
