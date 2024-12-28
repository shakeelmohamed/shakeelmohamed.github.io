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

window.addEventListener('load', lights);