 /* jshint esversion: 6 */
$(function () {
    console.log(1);
    $('.login').click(function () {
        $u_id=$('.u_account').val();
        $u_password=$('.u_password').val();
        if($u_id===''||$u_password===''){
            $('.line').fadeIn().text('钥匙都没有,喵的还想进门？ 填表！');
        }
        else{
            $.post("/login",{u_id:$u_id,u_password:$u_password},function(result){
                if(result==='ok'){
                    window.location.href=`/`;
                }
                else{
                    $('.line').fadeIn().text(result);
                }
            });
        }
        console.log( typeof $u_id +' '+ $u_password);
    });
});
