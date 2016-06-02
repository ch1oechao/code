$(document).ready(function(){

  // 回到顶部
  $(".post-body").scroll(function() {
    $(".post-body").scrollTop() > $('.article-header').height()
      ? $("#returnTop").css("bottom", "15px")
      : $("#returnTop").css("bottom", "-200px");
  });

  $("#returnTop").on("click", function() {
    $(".post-body").animate({
      scrollTop: 0
    }, 500);
  });

  console.log('© zchen9 🙋 2015-' + (new Date()).getFullYear());

  //分类菜单显示
  // $("#cateShow").bind("click",function(){
  //   if($(".cate-content").css("display") == "none"){
  //     $(".cate-content").show(400);
  //   }else{
  //     $(".cate-content").hide(400);
  //   }
  // });

  //菜单点击
  // $(".post-cate-list") && $(".post-cate-list").hide();
  // $(".cate-list li").bind("click", function(){
  //   var cateName = $(this).attr("data-cate");
  //   $(".cate-content").hide(400);
  //   $(".posts-container > ul[data-cate != " + cateName + "]").slideUp(280);
  //   $(".posts-container > ul[data-cate = " + cateName + "]").slideDown(400);
  // });

  //菜单隐藏
  // $("header, .container").bind("click",function(){
  //   $(".cate-content").hide(400);
  // });
  
});