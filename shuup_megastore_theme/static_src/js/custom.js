function slowScrollToTop() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
}

function toggleMegaMenu() {
    var elem = $(this).find("div.mega-menu-container");
    const posY = $(this).position().top - 70;
    elem.css("top", posY);

    // make everything hidden
    $(".mega-menu-container").removeClass("open");
    elem.addClass("open");  // show only this element

    if (elem.hasClass("open")) {
        const identifier = ".mega-menu-container >ul";
        const elementWidth = elem.children(identifier).first().width();
        var ulCount = elem.children(identifier).length;

        if (ulCount > 4) {
            ulCount = 4;
        }

        elem.css("width", elementWidth * ulCount + 20);
    }
}

function isOffcanvasNavOpen() {
    return document.body.classList.contains("offcanvas-open");
}

function setOffcanvasNavState(flag) {
    document.body.classList.toggle("offcanvas-open", !!flag);
}

$(function() {
    $("#scroll_top").click(function(event) {
        event.preventDefault();
        slowScrollToTop();
    });

    $(".support-nav .dropdown-menu").click(function(event) {
        event.stopPropagation();
    });

    // Set up frontpage carousel
    $(".frontpage-carousel").carousel({
        interval: 6000,
        cycle: true,
        pause: false
    });

    // Set up owl carousel for product list with 5 items
    $(".owl-carousel.five").owlCarousel({
        margin: 20,
        nav: true,
        navText: [
            "<i class='fa fa-angle-left'></i>",
            "<i class='fa fa-angle-right'></i>"
        ],
        responsiveClass: true,
        responsive: {
            0: { // breakpoint from 0 up
                items : 2,
                slideBy: 2
            },
            640: { // breakpoint from 640 up
                items : 4,
                slideBy: 2
            },
            1200: { // breakpoint from 992 up
                items : 5,
                slideBy: 3
            }
        }
    });

    //add tooltip triggers to data-attribute html with data-toggle=tooltip
    $("[data-toggle='tooltip']").tooltip({
        delay: { "show": 750, "hide": 100 }
    });

    const $dropdown = $(".dropdown");
    // Add slideDown animation to all bootstrap dropdowns
    $dropdown.on("show.bs.dropdown", function() {
        $(this).find(".dropdown-menu").first().stop(true, true).slideDown(200, "easeInSine");
    });

    // Add slideUp animation to all bootstrap dropdowns
    $dropdown.on("hide.bs.dropdown", function() {
        $(this).find(".dropdown-menu").first().stop(true, true).slideUp(300, "easeOutSine");
    });

    $(".selectpicker select").selectpicker();

    $(window).scroll(function() {
        if ($(window).scrollTop() > 400) {
            $("#scroll_top").addClass("visible");
        } else {
            $("#scroll_top").removeClass("visible");
        }
    });

    $(".category-link").hover(toggleMegaMenu);

    // Adds a toggle icon to offcanvas navigation each element that have child elements
    $(".offcanvas-nav > ul li").each(function addOffcanvasToggler() {
        if ($(this).find("ul").length) {
            $(this).children("a").after("<span class='toggle-icon'></span>");
        }
    });

    // Toggle navigation items when toggle icon is clicked
    $(".offcanvas-nav ul li .toggle-icon").on("click", function toggleNavItems(e) {
        e.stopPropagation();
        $(this).parent().toggleClass("open");
    });

    /* Close offcanvas navigation if user clicks outside the nav element
    when the navigation is open */
    $(document).on("click", function(e) {
        if (isOffcanvasNavOpen() && !$(e.target).closest(".offcanvas-nav").length) {
            setOffcanvasNavState(false);
        }
    });

    // Toggle the visibility of offcanvas navigation when the menu icon is clicked
    $("#nav-toggler").click(function(e) {
        e.stopPropagation();
        setOffcanvasNavState(!isOffcanvasNavOpen());
    });

});
