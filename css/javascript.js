console.log("loaded");



$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    var block1 = $("#block1").offset().top-100;
    var block2 = $("#block2").offset().top-100;
    var block3 = $("#block3").offset().top-100;

    showUp(block1,"#step1");
    showUp(block2,"#step2");
    showUp(block3,"#step3");

});

function showUp(block,id){
    if(scroll >= block) {
        $(id).addClass("active");
    }

    if(scroll <= block) {
        $(id).removeClass("active");
    } 
}