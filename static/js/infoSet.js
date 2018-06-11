$(function () {
    $(".birth-data").flatpickr();
    //头像预览
    $("#info-pic-up span,.info-part-one-pic").click(()=>{
        $("#info-pic-up input").click();
        $("#info-pic-up input").on('change',function () {
            let imgfile=getObjectURL(this.files[0]) ; //获取图片的路径，该路径不是图片在本地的路径
            console.log(imgfile);
            if (imgfile) {
                $(".info-part-one-pic").attr("src", imgfile) ; //将图片路径存入src中，显示出图片
            }
        })
    });
    $(".save-up").click(function () {
        let minname=$("input[name='minName']").val();
        let sex=$("input[name='sex']:checked").val();
        let phone=$("input[name='phone']").val();
        let birth=$("input[name='birth']").val();
        let intro=$(".info-textarea").val();
        datas={
            minname:minname,   //昵称
            sex:sex,        //性别
            phone:phone,       //电话号码
            birth:birth,       //生日
            intro:intro         //个人简介
        };
       // console.log(datas);
        $.ajaxFileUpload({
            url: "/infoset/portrait",
            fileElementId: 'picUp', //文件上传域的ID，这里是input的ID，而不是img的
            dataType: 'json', //返回值类型 一般设置为json
            type: 'POST',
            data:datas,
            success: function (data) {
                console.log('success:');
                console.log(data);
                if(data.msg==='success'){
                    $(".up-info").show().text('上传成功✔');
                    return 0;
                }
                $(".up-info").show().text('上传失败✘');
            },
        });
    });
});
function getObjectURL(file) {
    let url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}