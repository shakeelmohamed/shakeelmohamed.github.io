// Mobile hamburger menu

let menuOpen = false;

function makeMenu() {
    document.querySelector(".hamburgerIcon").addEventListener('click', function (e) {
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

// https://stackoverflow.com/questions/4588119/get-elements-css-selector-when-it-doesnt-have-an-id
function fullPath(el) {
    const names = [];
    while (el.parentNode) {
        if (el.id) {
            names.unshift('#' + el.id);
            break;
        } else {
            if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
            else {
                for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++) ;
                names.unshift(el.tagName + ":nth-child(" + c + ")");
            }
            el = el.parentNode;
        }
    }
    return names.join(" > ");
}

let carousels = [];
let carouselGalleries = [];

/*
TODO: make this a class, no reason not to

class Carousel {
  constructor(selector, interval = 2000) {
    this.element = document.querySelector(selector);
    this.slideIndex = 0;
    this.interval = interval;
    this.slides = this.element.children;
    this.gallery = GLightbox({
      ...galleryOptions,
      selector: `${selector} > div > img`
    });

    this.start();
  }

  next() {
    Array.from(this.slides).forEach((slide, i) => {
      slide.style.display = i === this.slideIndex ? "block" : "none";
    });
    this.slideIndex = (this.slideIndex + 1) % this.slides.length;
  }

  start() {
    this.next();
    setInterval(() => this.next(), this.interval);
  }
}

// Usage
function makeSliders() {
  document.querySelectorAll(".project-slider")
    .forEach(slider => new Carousel(".project-slider"));
}
 */

// TODO: would be nice to add fade transitions, maybe a better way to do this
// TODO: can allow an optional timer value, fallback to 2000ms
function makeCarousel(selector) {
    console.log("makeCarousel", selector);
    let newGallery = makeGallery(fullPath(selector) + " > div > img");
    carouselGalleries.push(newGallery);
    if (!selector || !selector.children) {
        return;
    }
    let newCarousel = {
        slideIndex: 0,
        slides: selector.children
    };

    newCarousel.next = function () {
        console.log("next");
        for (let i = 0; i < this.slides.length; i++) {
            if (i === this.slideIndex) {
                this.slides[i].style.display = "block";
            } else {
                this.slides[i].style.display = "none";
            }
        }
        this.slideIndex = (++this.slideIndex % this.slides.length);
    };

    newCarousel.next();
    carousels.push(newCarousel);
}

setInterval(function () {
    for (let i = 0; i < carousels.length; i++) {
        carousels[i].next();
    }
}, 2000);


function makeSliders() {
    let sliders = document.querySelectorAll(".project-slider");
    for (let i = 0; i < sliders.length; i++) {
        makeCarousel(sliders[i]);
    }
}

function init() {
    lights();
    makeMenu();
    makeSliders();
}

window.addEventListener('load', init);