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
});
