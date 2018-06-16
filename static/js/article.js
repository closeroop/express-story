 /* jshint esversion: 6 */
$(function () {
    let art_id=$(".time").text();                       //获取当前文章ID
    let time=new Date(parseInt($(".time").text()));
    let standard= getTime(time);                        //格式化时间
    let word=  $(".article").text().replace(/\s+/g,'').length;
    let commonpage;                                     //分页需要
    let currentPage=0;                                  //初始是页面第一页
    $(".standard_time").text(standard);
    $(".word").text(`字数 : ${word}`);
    $(window).scroll(function () {                     //回顶部按钮出现时机
        if($(window).scrollTop()>200){
            $(".navigation").show();
        }
        else{
                $(".navigation").hide();
            }
    });
    $(".navigation").click(function () {               //回顶部按钮-----------------------------
        window.scroll(0,0);
    });
    $(".article img").click(function (e) {                  //大图片展示-----------------------------
        e.stopPropagation();
        let url=$(this).get(0).src;
        $('.big-pic').css('background-image',`url(${url})`).show();
    });
   $(window).click(function (e) {                           //图片消失---------------------------
       $('.big-pic').hide();
   });
   $(".comment-word").click(function () {
       $(".comment-text").animate({'padding-bottom':'10px'},500);
       $(".comment-up").fadeIn(500);
   });
   $(".comment-up a").click(function () {
       $(this).parent().fadeOut(300);
       $(".comment-word").val('');
       setTimeout(()=>{
           $(".comment-text").animate({'padding-bottom':'0px'},500);
       },310)
   });

   $(".comment-up-me").click((e)=>{                                         //上传评论---------------------------
       e.stopPropagation();
       let upContent=$(".comment-word").val().trim();
       let art_id=$(".time").text();
       let time=new Date();
       let upTime=Date.parse(time);
       let commentCount= parseInt($(".comment-list-head span").text());

       //console.log(art_id);
       let updata={                     //需要上传的数据
           comment:upContent,
           art_id:art_id,
           upTime:upTime
       };
       if(!upContent){
           alert("评论不允许为空!");
           return 0;
       }
      $.ajax({
          type: "post",
          url: "/comment/up",
          data: updata,
          beforeSend: function () {
              // 禁用按钮防止重复提交
              $(".comment-up-me").text('正在提交');
              $(".comment-up-animate").fadeIn(300).css("transform","rotateY(30deg)");
              $(".comment-up-stop").show();
          },
          success:function (data) {
              console.log('success'+data);
          },
          complete: function (data) {
              console.log('complete');
             //console.log(data.responseJSON.u_id);
             if(data.responseJSON===undefined){
                  alert('滚去登录');
                  $(".comment-up-me").text('提交');
                  $(".comment-up-animate").css("transform","rotateY(0deg)").fadeOut(500);
                  $(".comment-up-stop").hide();
                  return 0;
              }
              console.log(data.responseJSON);
              let commentuser=$('#user_come').css('background-image').slice(4,-1);   //评论者头像地址
              let u_id= data.responseJSON.u_id;
              $(".comment-up-me").text('提交');
              $(".comment-up-animate").css("transform","rotateY(0deg)").fadeOut(2000);
              $(".comment-word").val('');
              $(".comment-up-stop").hide();
              let newCommentTime=getTime(time);
              let newNode=$(`<div class="comment-list-custom">
                                 <div class="comment-list-info">
                                     <img src=${commentuser} alt="s">
                                     <div class="comment-list-info-1">
                                         <span class="comment-people">${u_id}</span><br>
                                         <span class="comment-time">${newCommentTime}</span>
                                         <a href="javascript:" class="reply">回复 TA</a>
                                     </div>
                                     <div class="comment-list-info-2">
                                        ${upContent}
                                     </div>
                                 </div>          
                            </div>`);
              $('.comment-list-head').after(newNode);
              $(".comment-list-head span").text(`${ commentCount +1 }条评论`);
              $(".no-comment").hide();
              if(commentCount+1>8 ){
                  $(".comment-page").show();
              }
              commonpage=commentCount+1;
          }
      })
   });      //上传评论---------------------------

  $.post('/comment/download',{art_id:art_id},function (datas) {        //初始展示的评论--------------------
      if(datas==='data err'){
          $(".no-comment").show().text("哎呀 出现错误了");
          return 0;
      }
      console.log(datas);
      if(!datas.data.length){
          $(".no-comment").show();
          $(".comment-list-custom").hide();
          $(".comment-list-head span").text("0条评论");
          $(".comment-page").hide();
          return 0;
      }
      let commentLength=datas.commentNum;
      commonpage=commentLength;
      $(".comment-list-head span").text(`${ commentLength } 条评论`);
      let animateNo=0;
      for(let data of datas.data){
          let time=new Date(data.comment_time*1);
          let commentTime=getTime(time);
          animateNo+=1;
          if(!data.head){
              data.head="./pic/user_tou/tou-3.jpg";
          }
          let node=$(`<div class="comment-list-custom">
                 <div class="comment-list-info">
                     <a href="/user/${data.u_id}"><img src="../${data.head}" alt="s"></a>
                     <div class="comment-list-info-1">
                         <span class="comment-people">${data.u_id}</span><br>
                         <span class="comment-time">${commentTime}</span>
                         <span style="display: none" class="origin-comment-time">${data.comment_time}</span>
                         <a href="javascript:" class="reply">回复 TA</a>
                     </div>
                     <div class="comment-list-info-2">
                        ${data.comment_content}
                     </div>
                 </div>
                <div class="comment-list-back" >                    
                                                                          
                </div>
             </div>`);
          for(let reply of data.comment_comment){    //有回复就加进去     翻页亦如是
                let standardTime=getTime(new Date(reply.comment_time*1));
                let replyNode=$(`<div class="back-list">
                                           <a href="javascript:">${reply.comment_user} </a>:<a href="javascript:"> @${reply.commented_user} :</a>
                                            <span>${reply.content}</span><br>
                                            <span class="back-list-time">${standardTime}</span><a href="javascript:" class="reply-comment">回复 TA</a>
                                        </div>`);
                node.find(".comment-list-back").append(replyNode);
          }
          if(animateNo%2===0){
              node.css("animation","comment-animate-left 2s ease");
          }
          else{
              node.css("animation","comment-animate-right 2s ease");
          }
          $('.comment-page').before(node);
      }
      if(commentLength<=8){
          $(".comment-page").hide();
      }
      //console.log(datas.data);
  });   //初始展示的评论--------------------

  $(".page-pre").click(()=>{
      maxPage=Math.ceil(commonpage/8);     //  最大页数获取
      //console.log(commonpage,maxPage);
      if(currentPage===0){
          return 0;
      }
      currentPage=currentPage-1;
      console.log("当前页面："+(currentPage+1));
      $(".page-count").html(`${currentPage+1}`);
      let upPageInfo={currentPage:currentPage,art_id:art_id};
      pageRquest(upPageInfo);                  //>>------------------------------看 pageRequest函数
      window.scroll(0,$(".comment-list-head")[0].offsetTop-300);
  });                                           //上一页按钮---------------------

/*.............................分割线..........................................................*/

  $(".page-next").click(()=>{         //下一页按钮
      maxPage=Math.ceil(commonpage/8);     //  最大页数获取
      //console.log(commonpage,maxPage);
      if(currentPage+1===maxPage){
          return 0;
      }
      currentPage=currentPage+1;
      console.log("当前页面："+(currentPage+1));
      $(".page-count").html(`${currentPage+1}`);
      let upPageInfo={currentPage:currentPage,art_id:art_id};
      pageRquest(upPageInfo);                  //>>------------------------------看pageRequest函数
      window.scroll(0,$(".comment-list-head")[0].offsetTop-300);
  });                                       //下一页按钮-----------------------

    /*........................................文章作者头像..........................*/
    let master=$(".atr-master").text();
    $.post('/getface',{userhead:master},function (result) {  //获取头像
        if(result==='bad data'||result[0].head===null){
            return 0;
        }
        //console.log(result);
        $('.user-img').attr('src',`../${result[0].head}`);
    });
    /*........................................文章作者头像..........................*/
    /*........................................回复的回复........start..................*/
    let whoComment;  //玩家对玩家 还是玩家对电脑？<-----p2p- or -p2a---->    玩家相互留言 or 玩家对作者留言
    $(".comment-list").on('click','.reply',function () {
        //回复框站位
       let replyholder= $(this).parents().filter(".comment-list-info-1").find(".comment-people").text().trim();
        let replyNode=`<div class="user-comment">
                       <textarea placeholder="@${replyholder}" class="comment-word reply-word"></textarea>  
                       <div class="user-comment-up">
                            <div class=" user-me-up" >发送</div>
                            <a href="javascript:">取消</a>
                       </div>
                   </div>`;
        /* $(this).parents().filter('.comment-list-info').next().show();*/
        $(this).parents().filter(".comment-list-info").next().append(replyNode);
        $(this).hide();
        $(this).parents().filter(".comment-list-info").next().find(".reply-comment").hide();
        whoComment='p2a';
    });
    $(".comment-list").on('click','.user-comment-up a',function () {
        $(this).parents().filter(".comment-list-back").prev().find('.reply').show();
        $(this).parents().filter(".comment-list-back").find(".reply-comment").show();
        $(this).parents().filter(".user-comment").remove();
    });
    $(".comment-list").on('click','.user-me-up',function () {
        let art_id=$(".time").text();
        let comment_user=$(".user-face").text();
        let commented_user=$(this).parents().filter(".comment-list-back").prev().find(".comment-people").text().trim();
        let content=$(this).parent().prev().val();
        let comment_id=$(this).parents().filter(".comment-list-back").prev().find(".origin-comment-time").text().trim();
        let now= new Date();
        let commentTime=Date.parse(now);
        let standardTime=getTime(now);
        if(whoComment==='p2p'){
            commented_user=$(this).parent().prev().attr('placeholder').slice(1);
        }
        if(comment_user===''){
            alert("请先登录");
            return 0;
        }
        if(content.replace(/\s/g,'')===''){
            alert("无字天书吗？");
            return 0;
        }
        let updata={
            art_id:art_id,
            comment_user:comment_user,
            commented_user:commented_user,
            comment_time:commentTime,
            content:content,
            comment_id:comment_id
        };
        $this=$(this);
        $.ajax({
            type: "post",
            url: "/comment/comtocom",
            data: updata,
            beforeSend: function () {

            },
            success:function (data) {
                data=JSON.parse(data);
                if(data.msg==='insert success'){
                    let commentNode=$(`<div class="back-list">
                                           <a href="javascript:">${comment_user} </a>:<a href="javascript:"> @${commented_user} :</a>
                                            <span>${content}</span><br>
                                            <span class="back-list-time">${standardTime}</span><a href="javascript:" class="reply-comment">回复 TA</a>
                                        </div>`);
                    $this.parents().filter(".comment-list-back").append(commentNode);

                }
            },
            complete:function () {
                $this.parents().filter(".comment-list-back").prev().find('.reply').show();
                $this.parents().filter(".comment-list-back").find(".reply-comment").show();
                $this.parents().filter(".user-comment").remove();
            }
        })
    });

    $(".comment-list").on('click','.reply-comment',function () {  //回复其他人
        let replyholder= $(this).siblings(":first").text().trim();// @的人
        let replyNode=`<div class="user-comment">
                       <textarea placeholder="@${replyholder}" class="comment-word reply-word"></textarea>  
                       <div class="user-comment-up">
                            <div class=" user-me-up" >发送</div>
                            <a href="javascript:">取消</a>
                       </div>
                   </div>`;
         $(this).parents().filter(".comment-list-back").append(replyNode);
         $(this).hide();
         $(this).parent().siblings().find(".reply-comment").hide();
         $(this).parents().filter(".comment-list-back").prev().find('.reply').hide();
         whoComment='p2p';
    });

    /*........................................回复的回复.......end...................*/
});

 /*---------------------------------------------几个全局方法------------------------------------*/
        function pageRquest(upPageInfo) {
            $.ajax({
                type: "post",
                url: "/comment/downloadmore",
                data: upPageInfo,
                beforeSend: function () {
                    // 禁用按钮防止重复提交
                    $(".page-pre ,.page-next").css("disabled","disabled");
                },
                success: function (datas) {
                    replaceNode(datas);       //>>------------------------------------分页函数
                    console.log("评论:");
                    console.log(datas);
                },
                complete: function () {
                    $(".page-pre,.page-next").removeAttr("disabled");
                }
            });
        }  //>-----------------------该函数嵌套了replaceNode函数
        function replaceNode(datas) {
            $(".comment-list-custom").remove();
            let animateNo=0;
            for(let data of datas) {
                let time = new Date(data.comment_time * 1);
                let commentTime = getTime(time);
                animateNo+=1;
                if(!data.head){
                    data.head="./pic/user_tou/tou-3.jpg";
                }
                let node = $(`<div class="comment-list-custom">
                         <div class="comment-list-info">
                              <a href="/user/${data.u_id}"><img src="../${data.head}" alt="s"></a>
                             <div class="comment-list-info-1">
                                 <span class="comment-people">${data.u_id}</span><br>
                                 <span class="comment-time">${commentTime}</span>
                                 <span style="display: none" class="origin-comment-time">${data.comment_time}</span>
                                 <a href="javascript:" class="reply">回复 TA</a>
                             </div>
                             <div class="comment-list-info-2">
                                ${data.comment_content}
                             </div>
                         </div>
                        <div class="comment-list-back" >   
                              
                        </div>
                     </div>`);
                for(let reply of data.comment_comment){
                    let standardTime=getTime(new Date(reply.comment_time*1));
                    let replyNode=$(`<div class="back-list">
                                           <a href="javascript:">${reply.comment_user} </a>:<a href="javascript:"> @${reply.commented_user} :</a>
                                            <span>${reply.content}</span><br>
                                            <span class="back-list-time">${standardTime}</span><a href="javascript:" class="reply-comment">回复 TA</a>
                                        </div>`);
                    node.find(".comment-list-back").append(replyNode);
                }
                if(animateNo%2===0){
                    node.css("animation","comment-animate-left 2s ease");
                }
                else{
                    node.css("animation","comment-animate-right 2s ease");
                }
                $('.comment-page').before(node);
            }
        }    //>>------------------------------ 分页按钮专属
        function getTime(time) {
             let year=time.getFullYear();
             let month=time.getMonth();
             let day=time.getDate();
             let hour=time.getHours();
             let min=time.getMinutes();
             let sen=time.getSeconds();
             let standard=year+'-'+getzero(month)+'-'+getzero(day)+' '+getzero(hour)+':'+getzero(min)+':'+getzero(sen);
             return standard;
         }   //格式化时间
        function getzero(num) {
             if(num<10){
                 num='0'+num;
             }
             return num;
         }
        let node2=`<div class="user-comment">
                       <textarea placeholder="@YY" class="comment-word reply-word"></textarea>  
                       <div class="user-comment-up">
                            <div class=" user-me-up" >发送</div>
                            <a href="javascript:">取消</a>
                       </div>
                   </div>`;    //m-m
        let abbd;