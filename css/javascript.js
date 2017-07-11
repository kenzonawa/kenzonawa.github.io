console.log("loaded");



$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if($("#block1")) console.log("LOADED TWICE");
    var block1 = $("#block1").offset().top-200;
    var block2 = $("#block2").offset().top-200;
    var block3 = $("#block3").offset().top-200;
    var block4 = $("#block4").offset().top-200;
    var block5 = $("#block5").offset().top-200;
    var block6 = $("#block6").offset().top-200;
    var block7 = $("#block7").offset().top-200;
    var block8 = $("#block8").offset().top-200;
    var block9 = $("#block9").offset().top-200;
    var block10 = $("#block10").offset().top-200;
    var block11 = $("#block11").offset().top-200;


    showUp(scroll, block1,"#step1");
    showUp(scroll, block2,"#step2");
    showUp(scroll, block3,"#step3");
    showUp(scroll, block4,"#step4");
    showUp(scroll, block5,"#step5");
    showUp(scroll, block6,"#step6");
    showUp(scroll, block7,"#step7");
    showUp(scroll, block8,"#step8");
    showUp(scroll, block9,"#step9");
    showUp(scroll, block10,"#step10");
    showUp(scroll, block11,"#step11");


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