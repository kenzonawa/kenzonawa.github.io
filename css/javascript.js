console.log("loaded");

$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if(scroll >= 500) {
        $(".header").addClass(".change");
    } else {
        $(".header").removeClass(".change");
    }
});