$(function () {
    /*............................个性签名...............................................*/
    let text;
    let replaceWord ;
    $('.show-word').click(function (e) {
        e.stopPropagation();
        text=$('.show-word span').text();
        $('.replace-word').removeAttr('disabled').css('border','1px solid rgba(217, 217, 217, 0.29)')
            .val(text);
        $('.show-word span').text('');/*css('color','transparent')*/

        replaceWord= $('.replace-word').val();
    });
    $('.replace-word').click((e)=>{
        e.stopPropagation();
    });
    $('.replace-word').keydown((e)=>{
        if(e.keyCode === 13){
            $('.show-word span').text($('.replace-word').val());
            $('.replace-word').attr('disabled','disabled').css('border','none').val('');
        }
        });
    $(window).click(function(){
        let replaceWord= $('.replace-word').val()===''? $('.show-word span').text():$('.replace-word').val();
        $('.show-word span').text(replaceWord);
        $('.replace-word').attr('disabled','disabled').css('border','none').val('');
    });
    /*............................个性签名..............end.................................*/
    /*............................切换便签..............start.................................*/
    let index=0;
    $('.underline:first').css('transform','rotateY(0deg)');
    $(".art-me-nav a").hover(function () {
         //('.underline').css('transform','rotateY(90deg)');
         $('.underline')[ $(this).index()].style.transform='rotateY(0deg)';
    },function () {
        $('.underline').css('transform','rotateY(90deg)');
        $('.underline').get(index).style.transform='rotateY(0deg)';
    });
    $('.art-me-nav a').click(function(){
        //console.log($(this).index());
        index=$(this).index();
        $('.underline').css('transform','rotateY(90deg)');
        $('.underline').get(index).style.transform='rotateY(0deg)';
    });
    /*............................切换标签..............end.................................*/
    /*............................格式化时间..............start.................................*/
    let artLength=$(".my-art").length;
    for (let i=0;i<artLength;i++){
        let time=$(".write-time")[i].textContent;
        let time2=new Date(time*1);
        let writeTime=getTime(time2);
        $(".write-time")[i].textContent=writeTime;
    }
    /*............................格式化时间..............end.................................*/

    if(artLength){
        $(".no-art").hide();
        $('.add-more').show();
    }

    /*............................文章删除..............s.................................*/
    $(".art-me-list").on("click",".delete-art",function(e){   //动态绑定事件
        e.preventDefault();
        $this=$(this);
        let title=$this.parents().filter(".my-art").find('h3').text();//获得标题
        let split=$(this)[0].href.split('/');  //对链接分组  得到一个数组
        let artID=split[split.length-1];      //得到文章ID
        let confirm = window.confirm(`确定要删除文章《${title}》？`);
        if(!confirm){
            alert("虚惊一场");
            return 0;
        }
       $.post(`/delete/${artID}`,function (result) {
           result=JSON.parse(result);
           if(result.msg==="delete success"){
               $this.parents(".my-art").remove();
               /*$this.parents().filter(".my-art")*/     //二选一    找到该元素的指定祖先 然后移除
               return 0;
           }
           alert("delete fail");
       })
    });
    /*............................文章删除..............end.................................*/

    /*............................加载更多文章..............start.................................*/
    let number=0;
    $(".add-more").click(function () {
        let master=$(".master").text();
        let user=$(".user-face").text();
        $.ajax({
            type: "post",
            url: "/moreArt",
            data:{ page:number,classify:'person',master:master },
            beforeSend: function () {

            },
            success:function (datas) {
                if(datas.length===0){
                    $('.add-more a').text('没有更多了');
                    return 0;
                }
                let node;
                for(let data of datas){
                    let picpart;
                    let artpadding;
                    let edit;
                    let time=getTime(new Date(data.art_id*1));
                    if(data.pic){
                         picpart=`<a href="/art/${data.art_id }" class="art-pic" style="background: url(${data.pic}) center/cover no-repeat"  target="_blank"></a>`;
                         artpadding=``;
                    }
                    else {
                        picpart=``;
                        artpadding=`style="padding-right: 0"`;
                    }
                    if(user===master){
                        edit=`<div class="art-edit">
                                <a href="/edit/${ data.art_id } " class="edit-art" target="_blank">编辑</a>
                                <a href="/delete/${ data.art_id }" class="delete-art">删除</a>
                            </div>`;
                    }
                    else {
                        edit=``;
                    }
                    node=$(`<div class="my-art">
                        <div class="art-intro">
                            <h3><a href="/art/${ data.art_id }" target="_blank">${ data.art_head }</a></h3>
                            ${picpart}                                    
                            <p ${artpadding}>
                                ${data.showart.slice(0,80)}.......
                            </p>                          
                        </div>
                        <div class="art-comment">
                            <span class="write-time">${ time }</span><a href="javascript:">评论: ${ data.art_laud }</a>
                            <a href="javascript:">喜欢 ${ data.art_like }</a> <a href="javascript:">浏览量 ${ data.art_view }</a>
                               ${edit}                                    
                        </div>
                    </div>`);
                    $(".art-me-list").append(node);
                }
            },
            complete:function () {
                number+=1;
                console.log(number);
                window.localStorage.setItem("page",number);
                $(".art-me-list").append($('.add-more'));
            }
        })
    });
    /*............................加载更多文章..............end.................................*/

    /*........................................保持状态.......start...................*/
    /*let su=$(".my-art");
    window.history.pushState({"html":su.html()},"", window.location.href);
    window.onpopstate = function(event){
        if(event.state){
            su.innerHTML = event.state.html;
        }
    };*/
    /*........................................保持状态.......end...................*/
});

function getTime(time) {
    let year=time.getFullYear();
    let month=time.getMonth()+1;
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