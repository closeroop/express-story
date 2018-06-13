let E = window.wangEditor;
let  editor= new E('#div1', '#div2');
// 配置服务器端地址
editor.customConfig.uploadImgServer = '/upload/upImg';
editor.customConfig.uploadFileName = 'yourImg';
editor.customConfig.zIndex = 0;
editor.create();
$(function () {
    $("#home").fadeIn(500);
    $(".write_art").hide();  //编辑文章就不要再写文章了
    let split=window.location.pathname.split('/');
    let artID=split[split.length-1];//获取文章ID
    $(".btn-2").click(function (e) {     //保存按钮
        e.preventDefault();
        console.log(editor.txt.html());   //看看 内容  可以
        console.log($("#getTitle").val()); //看看 标题 可以
        if(editor.txt.html()===''||$("#getTitle").val()===''){
            alert('什么都不写？');
            return 0;
        }
        $.post("/edit/save",{content:editor.txt.html(),title:$("#getTitle").val(),art_id:artID},function(result){
            result=JSON.parse(result);
            if(result.msg==='ok'){
                alert("修改成功");
            }
            else{
                alert("修改失败");
            }
        });
    });

});