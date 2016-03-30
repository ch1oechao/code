$(document).ready(function(){

  // 回到顶部
  $("article").scroll(function(){
    $("article").scrollTop() > $("header").height()
      ? $("#returnTop").css("bottom", "80px")
      : $("#returnTop").css("bottom", "-200px");
  });
  $(window).scroll(function(){
    $(window).scrollTop() > $("header").height()
      ? $("#returnTop").css("bottom", "80px")
      : $("#returnTop").css("bottom", "-200px");
  });
  $("#returnTop").bind("click",function(){
    $("article").animate({scrollTop: 0}, 500);
    $("html,body").animate({scrollTop: 0}, 500);
  });

  //分类菜单显示
  $("#cateShow").bind("click",function(){
    if($(".cate-content").css("display") == "none"){
      $(".cate-content").show(400);
    }else{
      $(".cate-content").hide(400);
    }
  });

  //菜单点击
  $(".cates").hide();
  $(".cate-list li").bind("click",function(){
    var cateName = $(this).attr("data-cate");
    $(".cate-content").hide(400);
    $(".cate-posts > ul[data-cate != "+cateName+"]").slideUp(280);
    $(".cate-posts > ul[data-cate = "+cateName+"]").slideDown(400);
  });


  $("header, .container").bind("click",function(){
    //菜单隐藏
    $(".cate-content").hide(400);
  });
  
});