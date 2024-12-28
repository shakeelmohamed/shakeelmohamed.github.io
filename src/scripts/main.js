// Mobile hamburger menu

let menuOpen = false;
function makeMenu() {    
    document.querySelector(".hamburgerIcon").addEventListener('click', function(e) {
        e.preventDefault();

        let mobileBranding = document.querySelector(".mobileBranding");
        let mobileHeader = document.querySelector(".mobileHeader");
        let menuItems = document.querySelector(".menuItems");

        // TODO: this is not really elegant, but it is functional...
        // cargo structure is definitely better
        if (menuOpen) {
            // remove class + show branding
            mobileHeader.classList.remove("menuOpen");
            mobileBranding.style.setProperty("display", "block");
            menuItems.style.setProperty("display", "none");

        } else {
            // add class + hide branding
            mobileHeader.classList.add("menuOpen");
            mobileBranding.style.setProperty("display", "none");
            menuItems.style.setProperty("display", "block");
        }

        menuOpen = !menuOpen;
    });
}

// Customized behavior of the lightbox 

const singleOptions = {
    openEffect: "fade",
    closeEffect: "fade",
    zoomable: false,
    draggable: false
};

const galleryOptions = {
    openEffect: singleOptions.openEffect,
    closeEffect: singleOptions.closeEffect,
    zoomable: singleOptions.zoomable,
    draggable: singleOptions.draggable,
    loop: true,
    cssEfects: { // NOTE THE TYPO IN THE API
        slide: {in: 'fadeIn', out: 'fadeOut'},
        slideBack: {in: 'fadeIn', out: 'fadeOut'}
    }
};

// This is how we can support multiple per page, TBD how these will be called
function makeLightbox(selector) {
    const options = {
        openEffect: singleOptions.openEffect,
        closeEffect: singleOptions.closeEffect,
        zoomable: singleOptions.zoomable,
        draggable: singleOptions.draggable,
        selector: selector
    }

    return GLightbox(options);
}

// This is how we can support multiple per page, TBD how these will be called
function makeGallery(selector) {
    const options = {
        openEffect: galleryOptions.openEffect,
        closeEffect: galleryOptions.closeEffect,
        zoomable: galleryOptions.zoomable,
        draggable: galleryOptions.draggable,
        selector: selector,
        loop: galleryOptions.loop,
        cssEfects: galleryOptions.cssEfects
    }

    return GLightbox(options);
}


let lightbox;
let lightboxAlbum;
function lights() {
    lightbox = makeLightbox(".lightbox");

    lightboxAlbum = makeGallery('.lightbox-album > img');

    // TODO: add click handler on image to close also
    // let slides = document.querySelectorAll('.gslide-image > img');
    // for (let i = 0; i < slides.length; i++) {
    //     slides[i].addEventListener('click', function(e) {
    //         e.preventDefault();
    //         lightbox.close();
    //     });
    // }
}

function init() {
    lights();
    makeMenu();
}

window.addEventListener('load', init);