// TODO: the real challenge will be making this drag+drop editable when I want to edit the image set
// TODO: another cool feature could be like soot.world, allow for different/random animated viewing of images

const imgs = [
    {
        src: "14682199_10154007887733435_7185986522188715313_o-copy.png",
        pos: {x: 60, y: 230, z: 28, width: 40}
        // "width":39.999745702370056,"x":59.326365578272814,"y":230.75475536568,"z":28
    },
    {
        src: "1_-fQH4MHdzfF1zeJkTtoFGg.png",
        pos: {x: 62.3, y: 341, z: 23, width: 25}
        // width: 25%; top: 341.252%; left: 62.3233%; z-index: 23; cursor: move;
    },
    {
        src: "36DOT---1.png",
        pos: {x: 42, y: 258, z: 27, width: 45}
        // width: 44.9999%; top: 258.951%; left: 42.0926%; z-index: 27; cursor: move;
    },
    {
        src: "3Artboard-1-copy-3.png",
        pos: {x: 72.5, y: 65, z: 16, width: 25}
        // width: 25%; top: 64.905%; left: 72.5359%; z-index: 16; cursor: move;
    },
    {
        src: "52764681_2414447898567717_469558075708145664_o.jpg",
        pos: {x: 40, y: 140, z: 11, width: 45}
        // width: 45%; top: 140%; left: 40%; z-index: 11; cursor: move;
    },
    {
        src: "66-Artboard-1.png",
        pos: {x: 67.47, y: 310.75, z: 31, width: 30}
        // width: 29.9995%; top: 310.755%; left: 67.4772%; z-index: 31; cursor: move;
    },
    {
        src: "B.jpg",
        pos: {x: 7.5, y: 265, z: 6, width: 25}
        // width: 25%; top: 265%; left: 7.5%; z-index: 6; cursor: move;
    },
    {
        src: "BREAK---belief---IMG_0304.png",
        pos: {x: 2.5, y: 197.5, z: 4, width: 30}
        // width: 30%; top: 197.5%; left: 2.5%; z-index: 4; cursor: move;
    },
    {
        src: "CS15.3-projects-day-photo.jpg",
        pos: {x: 32.4185, y: 200, z: 25, width: 40}
        // width: 39.9997%; top: 199.29%; left: 32.4185%; z-index: 25; cursor: move;
    },
    {
        src: "D.png",
        pos: {x: 37.36, y: 232.8, z: 29, width: 19.6}
        // width: 19.6089%; top: 232.809%; left: 37.3633%; z-index: 29;
    },
    {
        src: "I.png",
        pos: {x: 52.5, y: 165, z: 10, width: 40}
        // width: 40%; top: 165%; left: 52.5%; z-index: 10; cursor: move;
    },
    {
        src: "IMG_3707.jpg",
        pos: {x: 1.9, y: 366.645, z: 22, width: 50}
        // width: 50%; top: 366.645%; left: 1.98861%; z-index: 22; cursor: move;
    },
    {
        src: "IMG_9258-copy.png",
        pos: {x: 0, y: 0, z: 14, width: 67.5}
        // width: 67.5%; top: 0%; left: 0%; z-index: 14; cursor: move;
    },
    {
        src: "Press-Release.008.png",
        pos: {x: 45, y: 46.46, z: 18, width: 40}
        // width: 39.9997%; top: 46.4646%; left: 44.9903%; z-index: 18;
    },
    {
        src: "Whispique---cover.png",
        pos: {x: 1.46, y: 323.16, z: 21, width: 62.5}
        // width: 62.5%; top: 323.16%; left: 1.46475%; z-index: 21;
    },
    {
        src: "animation-v3-3.png",
        pos: {x: 3, y: 88, z: 19, width: 40}
        // width: 39.9997%; top: 88.0334%; left: 3.04649%; z-index: 19;
    },
    {
        src: "c.png",
        pos: {x: 35, y: 67.14, z: 20, width: 30}
        // width: 29.9995%; top: 67.1384%; left: 34.999%; z-index: 20; cursor: move;
    },
    {
        src: "camus.png",
        pos: {x: 0.244, y: 298.9, z: 26, width: 30}
        // width: 29.9995%; top: 298.933%; left: 0.244126%; z-index: 26;
    },
    {
        src: "crazy-timeline---04132079-8bdc-4857-82cf-f356bcaf402c.jpg",
        pos: {x: 0, y: 52.5, z: 1, width: 40}
        // width: 40%; top: 52.5%; left: 0%; z-index: 1;
    },
    {
        src: "cudi-Artboard-1.png",
        pos: {x: 47.68, y: 370.77, z: 24, width: 25}
        // width: 25%; top: 370.772%; left: 47.6802%; z-index: 24;
    },
    {
        src: "digital-anarchy---cover_rough.png",
        pos: {x: 63.67, y: 24.15, z: 17, width: 32.63}
        // width: 32.6277%; top: 24.1456%; left: 63.6755%; z-index: 17;
    },
    {
        src: "f.png",
        pos: {x: 68.70, y: 5.55, z: 15, width: 25}
        // width: 25%; top: 5.55615%; left: 68.7068%; z-index: 15;
    },
    {
        src: "final-1Artboard-1-copy.png",
        pos: {x: 0, y: 152.5, z: 12, width: 40}
        // width: 40%; top: 152.5%; left: 0%; z-index: 12;
    },
    {
        src: "frank-ocean-template-days-23-for-print-copy.png",
        pos: {x: 5, y: 222.5, z: 5, width: 30}
        // width: 30%; top: 222.5%; left: 5%; z-index: 5;
    },
    {
        src: "inclusion---1.png",
        pos: {x: 0, y: 115, z: 2, width: 40}
        // width: 40%; top: 115%; left: 0%; z-index: 2;
    },
    {
        src: "latest---07_cover_top-copy.png",
        pos: {x: 69, y: 288.71, z: 30, width: 30}
        // width: 29.9995%; top: 288.716%; left: 69.0234%; z-index: 30;
    },
    {
        src: "logo-on-black-1500-square-centered.png",
        pos: {x: 47.5, y: 107.5, z: 9, width: 40}
        // width: 40%; top: 107.5%; left: 47.5%; z-index: 9;
    },
    {
        src: "m.png",
        pos: {x: 70, y: 197.5, z: 13, width: 30}
        // width: 30%; top: 197.5%; left: 70%; z-index: 13;
    },
    {
        src: "n.png",
        pos: {x: 27.5, y: 285, z: 7, width: 30}
        // width: 30%; top: 285%; left: 27.5%; z-index: 7;
    },
    {
        src: "t---updated-green-copy.png",
        pos: {x: 65, y: 85, z: 3, width: 25}
        // width: 25%; top: 85%; left: 65%; z-index: 3;
    },
    {
        src: "v.png",
        pos: {x: 75, y: 360, z: 8, width: 25}
        // width: 25%; top: 360%; left: 75%; z-index: 8;
    }
];

// TODO: maybe temp hack... sort by top to avoid abs height mess?
imgs.sort((a, b) => a.pos.y - b.pos.y);

for (var i = 0; i < imgs.length; i++) {
    const wrapper = document.createElement('div');

    // TODO: onclick -> lightbox, with caption
    //

    wrapper.classList.add("gallery_card");
    wrapper.style.width = `${imgs[i].pos.width}%`;
    wrapper.style.left = `${imgs[i].pos.x}%`;
    wrapper.style.top = `${imgs[i].pos.y}%`;

    const innerWrapper = document.createElement('div');
    innerWrapper.classList.add("gallery_card_image");

    const newImg = document.createElement('img');
    newImg.classList.add("image-zoom"); // TODO: this functionality is not there yt
    newImg.setAttribute("src", "./img/" + imgs[i].src);


    innerWrapper.appendChild(newImg);
    wrapper.appendChild(innerWrapper);


    document.querySelector(".thumbnail_sizer").appendChild(wrapper);
}

function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

window.addEventListener('load', fixPaddingBottom);
window.addEventListener('resize', fixPaddingBottom);

gsap.registerPlugin(Draggable);
Draggable.create('.gallery_card', {
    allowContextMenu: true,
    onDragEnd: function () {
        console.log('Dragging');
        // Calculate and set the final position using percentages
        const element = this.target;
        const container = element.parentElement;

        // Get the bounding box of the parent element
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // Calculate the top-left position in percentages
        const xPercent = ((elementRect.left - containerRect.left) / containerRect.width) * 100;
        const yPercent = ((elementRect.top - containerRect.top) / containerRect.height) * 100;

        // Apply the percentage values to the element
        element.style.left = `${xPercent}%`;
        element.style.top = `${yPercent}%`;

        // Clear the transform to ensure accurate placement
        element.style.transform = "translate3d(0, 0, 0)";

        // TODO: in theory recalculate here but its causing jumping bugs
        // fixPaddingBottom();
    }
});

function fixPaddingBottom() {
    const cards = document.querySelectorAll('.gallery_card');
    const imgs = [];
    for (let i = 0; i < cards.length; i++) {
        imgs.push(cards[i]);
    }
    // TODO: some bugs with this sort algorithm
    // imgs.sort((a, b) => (a.getBoundingClientRect().y + a.getBoundingClientRect().height) - (b.getBoundingClientRect().y + b.getBoundingClientRect().height));


    // TODO: bug first call will shrink, then every subsequent call calculates correctly oops;
    // might be same bug as onDragEnd() above

    const lastImg = imgs[imgs.length - 1];
    if (!lastImg) {
        return;
    }
    const t1box = lastImg.getBoundingClientRect();
    const newPaddingBottom = t1box.top + t1box.height + document.querySelector('.newfooter').getBoundingClientRect().height;
    document.querySelector('.image-gallery').style.setProperty('padding-bottom', `${newPaddingBottom}px`);
    // console.log('resized, new pb', newPaddingBottom);
}