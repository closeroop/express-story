let E = window.wangEditor;
let  editor= new E('#div1', '#div2');
// 配置服务器端地址
editor.customConfig.uploadImgServer = '/upload/upImg';
editor.customConfig.uploadFileName = 'yourImg';
editor.customConfig.zIndex = 0;
editor.create();
console.log(editor.txt.html());   //<p>欢迎使用 <b>wangEditor</b> 富文本编辑器</p><p><br></p>
//console.log(editor.txt.text());  //欢迎使用 wangEditor 富文本编辑器
$(function () {
    $("#home").fadeIn(500);
    $("#showPic").hover(function () {
          $("#navigator,#content").hide(500);
    },function () {
        $("#navigator,#content").show(500);
    });
    $("#upload").click(function () {
        console.log(editor.txt.html());   //看看 内容  可以
        console.log($("#getTitle").val()); //看看 标题 可以
        if(editor.txt.html()===''||$("#getTitle").val()===''){
            alert('什么都不写？');
            return 0;
        }
        $.post("/upload/upArt",{content:editor.txt.html(),title:$("#getTitle").val()},function(result){
            if(result==='ok'){
                alert("提交成功");
            }
            else{
                alert("提交失败");
            }
        });
    });

});