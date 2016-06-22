window.showPreview = function showPreview(productId) {
    var modalSelector = "#product-" + productId + "-modal";
    var $productModal = $(modalSelector);
    if ($productModal.length) {
        $productModal.modal("show");
        return;
    }

    // make sure modals disappear and are not "cached"
    $(document).on("hidden.bs.modal", modalSelector, function() {
        $(modalSelector).remove();
    });

    $.ajax({
        url: "/xtheme/product_preview",
        method: "GET",
        data: {
            id: productId
        },
        success: function(data) {
            $("body").append(data);
            $(modalSelector).modal("show");
            updatePrice();
            $(".selectpicker").selectpicker();
        }
    });
};

function updatePrice() {
    var $quantity = $("#product-quantity");
    if ($quantity.length === 0 || !$quantity.is(":valid")) {
        return;
    }

    var data = {
        id: $("input[name=product_id]").val(),
        quantity: $quantity.val()
    };
    var $simpleVariationSelect = $("#product-variations");
    if ($simpleVariationSelect.length > 0) {
        // Smells like a simple variation; use the selected child's ID instead.
        data.id = $simpleVariationSelect.val();
    } else {
        // See if we have variable variation select boxes; if we do, add those.
        $("select.variable-variation").serializeArray().forEach(function(obj) {
            data[obj.name] = obj.value;
        });
    }
    jQuery.ajax({url: "/xtheme/product_price", dataType: "html", data: data}).done(function(responseText) {
        var $content = jQuery("<div>").append(jQuery.parseHTML(responseText)).find("#product-price-div");
        jQuery("#product-price-div").replaceWith($content);
        if ($content.find("#no-price").length > 0) {
            $("#add-to-cart-button").prop("disabled", true);
        } else {
            $("#add-to-cart-button").not(".not-orderable").prop("disabled", false);
        }
    });
};

window.moveToPage = function moveToPage(pageNumber) {
    var pager = $("ul.pager");

    // Prevent double clicking when ajax is loading
    if (pager.prop("disabled")) {
        return false;
    }
    pager.prop("disabled", true);

    if (typeof (pageNumber) !== "number") {
        pageNumber = parseInt(pageNumber);
        if (isNaN(pageNumber)) {
            return;
        }
    }
    window.PAGE_NUMBER = pageNumber;

    reloadProducts();
};

var reloadProducts = function() {
    var filterString = "?sort=" + $("#id_sort").val() + "&page=" + window.PAGE_NUMBER;
    $("#ajax_content").load(location.pathname + filterString);
    $("html, body").animate({scrollTop: $("#ajax_content").offset().top-50}, "slow");
};

var slowScrollToTop = function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
};

$(function() {

    $(document).on("change", ".variable-variation, #product-variations, #product-quantity", updatePrice);

    updatePrice();

    $("#scroll_top").click(function(e) {
        e.preventDefault();
        slowScrollToTop();
    });

    $('.support-nav .dropdown-menu').click(function(e) {
        e.stopPropagation();
    });

    // Set up frontpage carusel
    $('.frontpage-carousel').carousel({
        interval: 6000,
        cycle: true,
        pause: false
    });

    // Set up owl carousel for product list with 5 items
    $(".owl-carousel.five").owlCarousel({
        margin: 20,
        nav: true,
        navText: [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: { // breakpoint from 0 up
                items : 2,
                slideBy: 2,
            },
            640: { // breakpoint from 640 up
                items : 4,
                slideBy: 2,
            },
            1200: { // breakpoint from 992 up
                items : 5,
                slideBy: 3,
            }
        }
    });

    //add tooltip triggers to data-attribute html with data-toggle=tooltip
    $('[data-toggle="tooltip"]').tooltip({
        delay: { "show": 750, "hide": 100 }
    });

    // Add slideDown animation to all bootstrap dropdowns
    $('.dropdown').on('show.bs.dropdown', function() {
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown(200, "easeInSine");
    });

    // Add slideUp animation to all bootstrap dropdowns
    $('.dropdown').on('hide.bs.dropdown', function() {
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp(300, "easeOutSine");
    });

    $('.selectpicker select').selectpicker();

    //Enable carousel slide change by swiping
    $(".carousel-inner").swipe({
        // Swipe handler for swiping left
        swipeLeft: function() {
            $('.frontpage-carousel').carousel('next');
        },
        // Swipe handler for swiping left
        swipeRight: function() {
            $('.frontpage-carousel').carousel('prev');
        },
        fallbackToMouseEvents: false,
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() > 400) {
            $("#scroll_top").addClass('visible');
        } else {
            $("#scroll_top").removeClass('visible');
        }
    });

    $(".category-link").hover(toggleMegaMenu);

    // Adds a toggle icon to offcanvas nav's each element that have child elements
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

function toggleMegaMenu() {
    var elem = $(this).find("div.mega-menu-container");
    const posY = $(this).position().top - 70;
    elem.css("top", posY);
    elem.toggleClass("open");
    if(elem.hasClass("open")) {
        const identifier = ".mega-menu-container >ul";
        const elementWidth = elem.children(identifier).first().width();
        const ulCount = elem.children(identifier).length;

        if (ulCount > 4)
            ulCount = 4;

        elem.css("width", elementWidth * ulCount + 20);
    }
}

function isOffcanvasNavOpen() {
    return document.body.classList.contains("offcanvas-open");
}

function setOffcanvasNavState(flag) {
    document.body.classList.toggle("offcanvas-open", !!flag);
}
