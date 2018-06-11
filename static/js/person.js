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
    /*............................格式化是时间..............end.................................*/
    if(artLength){
        $(".no-art").hide();
    }


    /*...................................主动请求登陆者的头像................................................*/

    let face=$('.user-face').text();
    if(face===''){    //如果没有登录就不请求
        return 0;
    }
    $.post('/getface',{userhead:face},function (result) {  //获取头像
        if(result==='bad data'||result[0].head===null){
            return 0;
        }
        //console.log(result);
        $('#user_come').css("background-image",`url(../${result[0].head})`)
    });
});

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