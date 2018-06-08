 /* jshint esversion: 6 */
$(function () {
    let oksName='yes';                                  //账户不规范不给过
    let checkName=false;                                //不查询不给过
    $('.login').click(function () {                     //不允许空白登录
        $u_id=$('.u_account').val().trim();
        $u_password=$('.u_password').val().trim();
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
        $(".register-line").hide();
       // $("#register").animate({ 'transform':'rotateY(0deg)'});
    });
    $(".to-login").click((e)=>{             //跳去登录界面
        e.preventDefault();
        $("#register").css( 'transform','rotateY(270deg)');
        $(".reg_account,.reg_password,.reg_password_config,.reg_name").val('');
        // $("#register").animate({ 'transform':'rotateY(0deg)'});
    });
    $(".register").click(()=>{              //登录检测   不允许漏填   两次密码检测
       let reg_account=$(".reg_account").val().trim();
       let reg_password=$(".reg_password").val().trim();
       let config_pass=$(".reg_password_config").val().trim();
       let reg_name=$(".reg_name").val().trim();
        $(".register-line").fadeOut();
        if(reg_account===''||reg_password===''||config_pass===''||reg_name===''){
           $(".register-line").fadeIn().text('你认真的吗?');
           return 0;
       }
       if(reg_password!==config_pass){
           $(".register-line").fadeIn().text('两次密码不一样');
           return 0;
       }
       if(!checkName){
           $(".register-line").fadeIn().text('请先检测账号');
           return 0;
       }
       $.post('/login/register',{account:reg_account,password:reg_password,name:reg_name},function (result) {
           console.log(result);
           if(result==='insert success'){
               $(".register-line").fadeIn().text('注册成功');
               $(".reg_account,.reg_password,.reg_password_config,.reg_name").val('');
               return 0;
           }
           if(result==='database err'){
               $(".register-line").fadeIn().text('数据错误，请稍后再试');
               return 0;
           }
       })
    });

     $(".reg_account").blur(function () {       //检测用户名是否合法
         let symbol=/[^_a-zA-Z0-9]/g;
         let value=$(".reg_account").val().trim();
         console.log('账户名:'+value);
         $(".reg_account").css('border-bottom','1px solid rgba(59, 100, 61, 0.42)');
         $(".register-line").fadeOut();
         oksName='yes';
         if(symbol.test(value)){     //如果用户输入空格 非数字 非字母 非下划线 就提醒
             $(".register-line").fadeIn().text('请输入数字、字母，或者下划线');
             $(".reg_account").css('border-bottom','1px solid red');
             oksName='no';
         }
         checkName=false;
     });

    $(".check-account").click(()=>{          //用户名查重
        let reg_account=$(".reg_account").val().trim();
        if(oksName==='no'){
            $(".register-line").fadeIn().text('请输入中文、数字、字母，或者下划线');
            return 0;
        }
        if($(".reg_account").val().trim()===''){
            $(".register-line").fadeIn().text('总得写点什么吧');
            return 0;
        }
        $.post('/login/check',{account:reg_account},function (result) {
            checkName=true;
            if(result==='exist'){
                checkName=false;
            }
            $(".register-line").fadeIn().text(result);    //反馈查询信息
        });
    });
});
