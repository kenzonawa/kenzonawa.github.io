console.log("loaded");



$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if($("#block1")){
        var block1 = $("#block1").offset().top-200;
        showUp(scroll, block1,"#step1");
    }
    if($("#block2")) {
        var block2 = $("#block2").offset().top-200;
        showUp(scroll, block2,"#step2");
    }
    if($("#block3")) {
        var block3 = $("#block3").offset().top-200;
        showUp(scroll, block3,"#step3");
    }
    if($("#block4")) {
        var block4 = $("#block4").offset().top-200;
        showUp(scroll, block4,"#step4");
    }
    if($("#block5")) {
        var block5 = $("#block5").offset().top-200;
        showUp(scroll, block5,"#step5");
    }
    if($("#block6")) {
        var block6 = $("#block6").offset().top-200;
        showUp(scroll, block6,"#step6");
    }
    if($("#block7")) {
        var block7 = $("#block7").offset().top-200;
        showUp(scroll, block7,"#step7");
    }
    if($("#block8")) {
        var block8 = $("#block8").offset().top-200;
        showUp(scroll, block8,"#step8");
    }
    if($("#block9")) {
        var block9 = $("#block9").offset().top-200;
        showUp(scroll, block9,"#step9");
    }
    if($("#block10")) {
        var block10 = $("#block10").offset().top-200;
        showUp(scroll, block10,"#step10");
    }
    if($("#block11")) {
        var block11 = $("#block11").offset().top-200;
        showUp(scroll, block11,"#step11");
    }
});

function showUp(scroll, block, id){
    console.log("I'm in "+scroll+block+id);
    if(scroll >= block) {
        $(id).addClass("active");
    }

    if(scroll <= block) {
        $(id).removeClass("active");
    } 
}