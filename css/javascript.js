console.log("loaded");

$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if(scroll >= 500) {
        $("#step2").addClass(".active");
    } else {
        $(".header").removeClass(".change");
    }
});