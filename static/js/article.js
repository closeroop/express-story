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
              let u_id= data.responseJSON.u_id;
              $(".comment-up-me").text('提交');
              $(".comment-up-animate").css("transform","rotateY(0deg)").fadeOut(2000);
              $(".comment-word").val('');
              $(".comment-up-stop").hide();
              let newCommentTime=getTime(time);
              let newNode=$(`<div class="comment-list-custom">
                                 <div class="comment-list-info">
                                     <img src="./pic/user_tou/tou-4.jpg" alt="s">
                                     <div class="comment-list-info-1">
                                         <span class="comment-people">${u_id}</span><br>
                                         <span class="comment-time">${newCommentTime}</span>
                                         <a href="javascript:">回复 TA</a>
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
   });

  $.post('/comment/download',{art_id:art_id},function (datas) {        //初始展示的评论--------------------
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
          let node=$(`<div class="comment-list-custom">
                 <div class="comment-list-info">
                     <img src="./pic/user_tou/tou-4.jpg" alt="s">
                     <div class="comment-list-info-1">
                         <span class="comment-people">${data.u_id}</span><br>
                         <span class="comment-time">${commentTime}</span>
                         <a href="javascript:">回复 TA</a>
                     </div>
                     <div class="comment-list-info-2">
                        ${data.comment_content}
                     </div>
                 </div>
                <div class="comment-list-back" style="display: none">   
                    <a href="javascript:">Yx </a>:<a href="javascript:"> @Yw </a>
                    <span> 这是后期工作了</span><br>
                    <span>2018-2-33</span>
                </div>
             </div>`);
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
  });

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

    /*......................................登录用户头像.............................*/
    let face=$('.user-face').text();
    if(face===''){    //如果没有登录就不请求
        //什么都不做
    }
    else {
        $.post('/getface',{userhead:face},function (result) {  //获取头像
            if(result==='bad data'||result[0].head===null){
                return 0;
            }
            //console.log(result);
            $('#user_come').css("background-image",`url(../${result[0].head})`);
            $('.my-head').attr('src',`../${result[0].head}`);
        });
    }
    /*........................................文章作者头像..........................*/
    let master=$(".atr-master").text();
    $.post('/getface',{userhead:master},function (result) {  //获取头像
        if(result==='bad data'||result[0].head===null){
            return 0;
        }
        //console.log(result);
        $('.user-img').attr('src',`../${result[0].head}`);
    });
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
                    console.log("评论:"+datas);
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
                let node = $(`<div class="comment-list-custom">
                         <div class="comment-list-info">
                             <img src="./pic/user_tou/tou-4.jpg" alt="s">
                             <div class="comment-list-info-1">
                                 <span class="comment-people">${data.u_id}</span><br>
                                 <span class="comment-time">${commentTime}</span>
                                 <a href="javascript:">回复 TA</a>
                             </div>
                             <div class="comment-list-info-2">
                                ${data.comment_content}
                             </div>
                         </div>
                        <div class="comment-list-back" style="display: none">   
                            <a href="javascript:">Yx </a>:<a href="javascript:"> @Yw </a>
                            <span> 这是后期工作了</span><br>
                            <span>2018-2-33</span>
                        </div>
                     </div>`);
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