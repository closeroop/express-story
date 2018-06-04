 /* jshint esversion: 6 */
$(function () {
    let picindex=0;
    let picnum=$('.cell').length;   //图片个数
    let picwideh=$('.cell').width();
    let maxscorll=(picwideh+10)*(picnum); //最大滚动距离
    $(".scroll").width(maxscorll);   //设置获取滚动的宽
    $('.page').text(`${picindex+1}/${picnum}`); //page
    $img=$('.cell').eq(picindex).css('background-image');
    $('.cell').eq(picindex).css({'opacity':'1','border':'2px solid white'}).siblings().css({'opacity':'.5','border':'none'});
    $(".container").width(~~($(".showpic").height()*0.75)).css('background-image',$img);


    function changepic(picindex,direction) {
        $('.page').text(`${picindex+1}/${picnum}`);
        $img=$('.cell').eq(picindex).css('background-image');
        $(".scroll").animate({'left':`${direction}=120px`},"500");
        $(".container").css({'background-image':$img});
        $('.cell').eq(picindex).css({'opacity':'1','border':'2px solid white'}).siblings().css({'opacity':'.5','border':'none'});
    }    //传参  序号，方向
    function jump(picindex,jumpnum,direction) {
        $('.page').text(`${picindex+1}/${picnum}`);
        $img=$('.cell').eq(picindex).css('background-image');
        $(".scroll").animate({'left':`${direction}=${jumpnum*120}px`},"500");
        $(".container").css({'background-image':$img});
        $('.cell').eq(picindex).css({'opacity':'1','border':'2px solid white'}).siblings().css({'opacity':'.5','border':'none'});
    }   //     序号 ，跳页数，方向
    $('.pre').click(function () {                   // 上一张点击按钮
        if(picindex===0){
            return false;
        }
        else{
            picindex-=1;
            changepic(picindex,'+');
        }
    });
    $('.next').click(function () {      // 下一张点击按钮
        if(picindex===(picnum-1)){
            return false;
        }
        else{
            picindex+=1;
            changepic(picindex,'-');
        }
    });
    $('.jumpnext').click(function () {    // 下一组点击按钮
        if(picnum<5||(picnum-picindex-1)<2){
            return false;
        }
        else{
            picindex+=2;
            jump(picindex,2,'-');
        }
    });
    $('.jumppre').click(function () {    // 上一组点击按钮
        if(picindex<2){     //2 是jumpnum
            return false;
        }
        else{
            picindex-=2;
            jump(picindex,2,'+');
        }
    });

    $(window).resize(function() {
        let off= picindex*110+55;
        $(".container").width(~~($(".container").height()*0.75));
        $(".scroll").css('left',`calc( 50% - ${off}px)`);
    });

    $('.next ,.pre,.jumppre,.jumpnext').hover(function () {
        $(this).css('background-color','#0c0c0c');
    },function () {
        $(this).css('background-color','#000000');
    });

});
