console.log("loaded");

$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if(scroll >= 1000) {
        $("#step3").addClass("active");
    }

    if(scroll <= 1000) {
        $("#step3").removeClass("active");
    } 
});