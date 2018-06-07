 /* jshint esversion: 6 */
$(function () {
    let oksName='yes';
    $('.login').click(function () {                     //不允许空白登录
        $u_id=$('.u_account').val();
        $u_password=$('.u_password').val();
        if($u_id===''||$u_password===''){
            $('.line').fadeIn().text('拜托 认真点');
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
        //console.log( typeof $u_id +' '+ $u_password);
    });
    $(".to-register").click((e)=>{            //跳去注册界面
        e.preventDefault();
       $("#register").css( 'transform','rotateY(0deg)');
        $('.line').hide();
       // $("#register").animate({ 'transform':'rotateY(0deg)'});
    });
    $(".to-login").click((e)=>{             //跳去登录界面
        e.preventDefault();
        $("#register").css( 'transform','rotateY(270deg)');
        $(".reg_account,.reg_password,.reg_password_config").val('');
        // $("#register").animate({ 'transform':'rotateY(0deg)'});
    });
    $(".register").click(()=>{              //登录检测   不允许漏填   两次密码检测
       let reg_account=$(".reg_account").val();
       let reg_password=$(".reg_password").val();
       let config_pass=$(".reg_password_config").val();
        $(".register-line").fadeOut();
        if(reg_account===''||reg_password===''||config_pass===''){
           $(".register-line").fadeIn().text('你认真的吗?');
           return 0;
       }
       if(reg_password!==config_pass){
           $(".register-line").fadeIn().text('两次密码不一样');
           return 0;
       }
    });

     $(".reg_account").blur(function () {       //检测用户名是否合法
         let symbol=/[^\u4e00-\u9fa5_a-zA-Z0-9]/g;
         let value=$(".reg_account").val().trim();
         console.log(value);
         $(".reg_account").css('border-bottom','1px solid rgba(59, 100, 61, 0.42)');
         $(".register-line").fadeOut();
         oksName='yes';
         if(symbol.test(value)){     //如果用户输入空格 非数字 非字母 非下划线 就提醒
             $(".register-line").fadeIn().text('请输入中文、数字、字母，或者下划线');
             $(".reg_account").css('border-bottom','1px solid red');
             oksName='no';
         }

     });

    $(".check-account").click(()=>{          //用户名查重
        if(oksName==='no'){
            $(".register-line").fadeIn().text('请输入中文、数字、字母，或者下划线');
            return 0;
        }
        if($(".reg_account").val().trim()===''){
            $(".register-line").fadeIn().text('总得写点什么吧');
            return 0;
        }
    });
});
