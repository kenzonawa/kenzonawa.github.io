console.log("loaded");

$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if(scroll >= 500) {
        $("#step2").addClass("active");
    }

    if(scroll <= 500) {
        $("#step2").removeClass("active");
    } 

    if(scroll >= 1000) {
        $("#step3").addClass("active");
    }

    if(scroll <= 1000) {
        $("#step3").removeClass("active");
    } 
});