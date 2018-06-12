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
    }
    /*............................文章删除..............s.................................*/
    $(".delete-art").click(function(e){
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