console.log("loaded");



$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    var block1 = $("#block1").offset().top;
    var block2 = $("#block2").offset().top;

    if(scroll >= block1) {
        $("#step2").addClass("active");
    }

    if(scroll <= block1) {
        $("#step2").removeClass("active");
    } 

    if(scroll >= block2) {
        $("#step3").addClass("active");
    }

    if(scroll <= block2) {
        $("#step3").removeClass("active");
    } 
});