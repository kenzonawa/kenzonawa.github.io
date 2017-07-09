console.log("loaded");



$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    var block1 = $("#block1").offset().top-300;
    var block2 = $("#block2").offset().top-300;
    var block3 = $("#block3").offset().top-300;

    if(scroll >= block1) {
        $("#step1").addClass("active");
    }

    if(scroll <= block1) {
        $("#step1").removeClass("active");
    } 

    if(scroll >= block2) {
        $("#step2").addClass("active");
    }

    if(scroll <= block2) {
        $("#step2").removeClass("active");
    } 
});