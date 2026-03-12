// TODO: the real challenge will be making this drag+drop editable when I want to edit the image set
// TODO: another cool feature could be like soot.world, allow for different/random animated viewing of images
// Image positions are defined in src/_data/labyrinthImages.json
// To update layout: drag images locally, click "Copy layout JSON", paste the output back into labyrinthImages.json

const imgs = JSON.parse(document.getElementById('labyrinth-images-data').textContent);

const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
let latestJson = null;

// TODO: maybe temp hack... sort by top to avoid abs height mess?
imgs.sort((a, b) => a.pos.y - b.pos.y);

for (let i = 0; i < imgs.length; i++) {
    const wrapper = document.createElement('div');

    wrapper.classList.add("gallery_card");
    wrapper.style.width = `${imgs[i].pos.width}%`;
    wrapper.style.left = `${imgs[i].pos.x}%`;
    wrapper.style.top = `${imgs[i].pos.y}%`;
    wrapper.style.zIndex = `${imgs[i].pos.z}`;
    wrapper.dataset.imgSrc = imgs[i].src;

    const innerWrapper = document.createElement('div');
    innerWrapper.classList.add("gallery_card_image");

    const newImg = document.createElement('img');
    // newImg.classList.add("image-zoom"); // TODO: this functionality is not there yt
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

        if (isLocal) {
            const item = imgs.find(img => img.src === element.dataset.imgSrc);
            if (item) {
                item.pos.x = Math.round(xPercent * 1000) / 1000;
                item.pos.y = Math.round(yPercent * 1000) / 1000;
            }
            const sorted = [...imgs].sort((a, b) => a.pos.y - b.pos.y);
            latestJson = JSON.stringify(sorted, null, 4);
            console.log('labyrinth layout JSON:', latestJson);
        }

        // TODO: in theory recalculate here but its causing jumping bugs
        // fixPaddingBottom();
    }
});

if (isLocal) {
    const btn = document.createElement('button');
    btn.id = 'labyrinth-copy-btn';
    btn.textContent = 'Copy layout JSON';
    btn.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:9999;padding:8px 12px;background:#000;color:#fff;border:none;cursor:pointer;font-family:monospace;font-size:13px;';
    btn.addEventListener('click', () => {
        if (!latestJson) {
            console.log('No layout changes yet — drag an image first');
            return;
        }
        navigator.clipboard.writeText(latestJson).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy layout JSON'; }, 2000);
        }).catch(() => {
            btn.textContent = 'Copy failed';
            setTimeout(() => { btn.textContent = 'Copy layout JSON'; }, 2000);
        });
    });
    document.body.appendChild(btn);
}

function fixPaddingBottom() {
    const cards = document.querySelectorAll('.gallery_card');
    const cardList = [];
    for (let i = 0; i < cards.length; i++) {
        cardList.push(cards[i]);
    }
    // TODO: some bugs with this sort algorithm
    // cardList.sort((a, b) => (a.getBoundingClientRect().y + a.getBoundingClientRect().height) - (b.getBoundingClientRect().y + b.getBoundingClientRect().height));

    // TODO: bug first call will shrink, then every subsequent call calculates correctly oops;
    // might be same bug as onDragEnd() above

    const lastCard = cardList[cardList.length - 1];
    if (!lastCard) {
        return;
    }
    const t1box = lastCard.getBoundingClientRect();
    const footer = document.querySelector('.newfooter');
    if (!footer) return;
    const gallery = document.querySelector('.image-gallery');
    if (!gallery) return;
    const newPaddingBottom = t1box.top + t1box.height + footer.getBoundingClientRect().height;
    gallery.style.setProperty('padding-bottom', `${newPaddingBottom}px`);
    // console.log('resized, new pb', newPaddingBottom);
}
