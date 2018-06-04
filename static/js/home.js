$(function () {
    let number=0;
    $(".more").click(()=>{
        //number+=1;
        $.ajax({
            type: "post",
            url: "/moreArt",
            data:{ page:number },
            beforeSend: function () {


            },
            success: function (datas) {
                let node=null;
                let animateNo=0;
                for(let data of datas){
                    animateNo+=1;
                    if(!data.pic){
                         node=$(`<div class="article">     
                                <div class="art_header">  
                                    <div class="user_tou">
                                        <!--头像-->
                                        <a href="/user/${data.u_id}"></a>
                                    </div>
                                    <span class="author"><a href="/user/${data.u_id}" target="_blank">${data.u_id}</a></span>
                                    <h3><a href="/art/${ data.art_id }"  target="_blank">${ data.art_head }</a></h3>           
                                </div>
                                <div class="art_info">                                                        
                                    <p>${data.showart.slice(0,100)}......</p>
                                </div>
                                <div class="art_footer"> 
                                    <div><a href="" class="art_foo_i">喜欢<span>${ data.art_like }</span></a></div>
                                    <div><a href="" class="art_foo_i">评论<span>${ data.art_laud }</span></a></div>
                                    <div><a href="" class="art_foo_i">浏览量<span>999+</span></a></div>
                                </div>
                                </div>`);
                    }
                    else{
                        node=$(`<div class="article">
                         <div class="art_header">  
                                    <div class="user_tou">
                                        <!--头像-->
                                        <a href="/user/${data.u_id}"></a>
                                    </div>
                                    <span class="author"><a href="/user/${data.u_id}" target="_blank">${data.u_id}</a></span>
                                    <h3><a href="/art/${ data.art_id }"  target="_blank">${ data.art_head }</a></h3>           
                                </div>
                                <div class="art_info">                    
                                    <a href="/art/${data.art_id }" class="art_info_pic" style="background: url(${data.pic}) center/cover no-repeat"  target="_blank"></a>                   
                                    <p>${data.showart.slice(0,100)}......</p>
                                </div>
                                <div class="art_footer"> 
                                <div><a href="" class="art_foo_i">喜欢<span>${ data.art_like }</span></a></div>
                                <div><a href="" class="art_foo_i">评论<span>${ data.art_laud }</span></a></div>
                                    <div><a href="" class="art_foo_i">浏览量<span>999+</span></a></div>
                                </div>
                         </div>`);
                    }
                    if(animateNo%2===0){
                        node.css("animation","article-animate-left 2s ease");
                    }
                    else{
                        node.css("animation","article-animate-right 2s ease");
                    }
                    $("#show_art").append(node);
                }
                //console.log(node);
                console.log(datas);
            },
            complete: function () {

            }
        });
    });
});



