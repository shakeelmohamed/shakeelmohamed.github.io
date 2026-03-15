// TODO: another cool feature could be like soot.world, allow for different/random animated viewing of images
// Image positions are defined in src/_data/labyrinth.json
// To update layout: drag images locally, click "Copy layout JSON", paste the output back into labyrinth.json

const imgs = JSON.parse(document.getElementById('labyrinth-images-data').textContent);
const thumbnailSizer = document.querySelector('.thumbnail_sizer');
const imageGallery = document.querySelector('.image-gallery');
const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const resizeHandleDirections = ['nw', 'ne', 'sw', 'se'];
const imageLoadPromises = [];

let latestJson = null;
let paddingBottomFrame = null;
let resizeState = null;
let draggablesInitialized = false;

imgs.sort((a, b) => a.pos.y - b.pos.y);

for (let i = 0; i < imgs.length; i++) {
    const wrapper = document.createElement('div');

    wrapper.classList.add('gallery_card', 'gallery_card--editable');
    applyCardPosition(wrapper, imgs[i].pos);
    wrapper.dataset.imgSrc = imgs[i].src;
    wrapper.dataset.imgIndex = `${i}`;

    const innerWrapper = document.createElement('div');
    innerWrapper.classList.add('gallery_card_image');

    const newImg = document.createElement('img');
    // newImg.classList.add("image-zoom"); // TODO: this functionality is not there yet
    newImg.setAttribute('src', './img/' + imgs[i].src);
    newImg.setAttribute('alt', '');
    newImg.addEventListener('load', scheduleFixPaddingBottom, { once: true });

    const imageReadyPromise = new Promise(resolve => {
        if (newImg.complete) {
            resolve();
            return;
        }

        newImg.addEventListener('load', resolve, { once: true });
        newImg.addEventListener('error', resolve, { once: true });
    });
    imageLoadPromises.push(imageReadyPromise);

    innerWrapper.appendChild(newImg);
    wrapper.appendChild(innerWrapper);
    addResizeHandles(wrapper);
    thumbnailSizer.appendChild(wrapper);
}

updateLatestJson();
initializeWhenReady();

function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function roundPositionValue(value) {
    return Math.round(value * 1000) / 1000;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function updateLatestJson() {
    latestJson = JSON.stringify([...imgs].sort((a, b) => a.pos.y - b.pos.y), null, 4);
}

function updateDumpOutput() {
    updateLatestJson();
    if (isLocal) {
        console.log('labyrinth layout JSON:', latestJson);
    }
}

function scheduleFixPaddingBottom() {
    if (paddingBottomFrame !== null) {
        window.cancelAnimationFrame(paddingBottomFrame);
    }

    paddingBottomFrame = window.requestAnimationFrame(() => {
        paddingBottomFrame = null;
        fixPaddingBottom();
    });
}

function initializeWhenReady() {
    Promise.all(imageLoadPromises).then(() => {
        initializeDraggables();
        scheduleFixPaddingBottom();
    });
}

function applyCardPosition(element, pos) {
    element.style.width = `${pos.width}%`;
    element.style.left = `${pos.x}%`;
    element.style.top = `${pos.y}%`;
    element.style.zIndex = `${pos.z}`;
}

function getImgRecord(element) {
    return imgs.find(img => img.src === element.dataset.imgSrc);
}

function bringCardToFront(element) {
    const item = getImgRecord(element);
    if (!item) {
        return;
    }

    const maxZ = imgs.reduce((acc, img) => Math.max(acc, img.pos.z), 0);
    item.pos.z = maxZ + 1;
    element.style.zIndex = `${item.pos.z}`;
    updateLatestJson();
}

function persistCardPosition(element, shouldLog = true) {
    if (!thumbnailSizer) {
        return;
    }

    const containerRect = thumbnailSizer.getBoundingClientRect();
    if (!containerRect.width || !containerRect.height) {
        return;
    }

    const elementRect = element.getBoundingClientRect();
    const item = getImgRecord(element);
    if (!item) {
        return;
    }

    const xPercent = clamp(((elementRect.left - containerRect.left) / containerRect.width) * 100, 0, 100);
    const yPercent = Math.max(0, ((elementRect.top - containerRect.top) / containerRect.height) * 100);
    const widthPercent = clamp((elementRect.width / containerRect.width) * 100, 5, 100);

    item.pos.x = roundPositionValue(xPercent);
    item.pos.y = roundPositionValue(yPercent);
    item.pos.width = roundPositionValue(widthPercent);

    applyCardPosition(element, item.pos);

    if (shouldLog && isLocal) {
        updateDumpOutput();
    } else {
        updateLatestJson();
    }
}

function getResizeCursor(direction) {
    return direction === 'nw' || direction === 'se' ? 'nwse-resize' : 'nesw-resize';
}

function handleResizeMove(event) {
    if (!resizeState || !thumbnailSizer) {
        return;
    }

    const containerRect = thumbnailSizer.getBoundingClientRect();
    if (!containerRect.width) {
        return;
    }

    const deltaX = event.clientX - resizeState.startClientX;
    const minWidthPx = Math.max(containerRect.width * 0.05, 48);

    let nextWidthPx = resizeState.startWidthPx;
    let nextLeftPx = resizeState.startLeftPx;

    if (resizeState.direction.endsWith('e')) {
        nextWidthPx = clamp(
            resizeState.startWidthPx + deltaX,
            minWidthPx,
            containerRect.width - resizeState.startLeftPx
        );
    } else {
        nextWidthPx = clamp(
            resizeState.startWidthPx - deltaX,
            minWidthPx,
            resizeState.startRightPx
        );
        nextLeftPx = resizeState.startRightPx - nextWidthPx;
    }

    const item = getImgRecord(resizeState.element);
    if (!item) {
        return;
    }

    item.pos.width = roundPositionValue((nextWidthPx / containerRect.width) * 100);
    item.pos.x = roundPositionValue((nextLeftPx / containerRect.width) * 100);
    applyCardPosition(resizeState.element, item.pos);
    scheduleFixPaddingBottom();
}

function stopResize() {
    if (!resizeState) {
        return;
    }

    resizeState.element.classList.remove('is-resizing');
    document.body.style.cursor = '';
    window.removeEventListener('pointermove', handleResizeMove);
    window.removeEventListener('pointerup', stopResize);
    window.removeEventListener('pointercancel', stopResize);

    persistCardPosition(resizeState.element, true);
    scheduleFixPaddingBottom();
    resizeState = null;
}

function startResize(event, element, direction) {
    if (!thumbnailSizer) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    bringCardToFront(element);

    const containerRect = thumbnailSizer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    resizeState = {
        direction,
        element,
        startClientX: event.clientX,
        startLeftPx: elementRect.left - containerRect.left,
        startRightPx: elementRect.right - containerRect.left,
        startWidthPx: elementRect.width
    };

    element.classList.add('is-resizing');
    document.body.style.cursor = getResizeCursor(direction);
    window.addEventListener('pointermove', handleResizeMove);
    window.addEventListener('pointerup', stopResize);
    window.addEventListener('pointercancel', stopResize);
}

function addResizeHandles(wrapper) {
    for (let i = 0; i < resizeHandleDirections.length; i++) {
        const direction = resizeHandleDirections[i];
        const handle = document.createElement('button');

        handle.type = 'button';
        handle.classList.add('gallery_resize_handle', `gallery_resize_handle--${direction}`);
        handle.setAttribute('aria-label', `Resize ${wrapper.dataset.imgSrc} from ${direction} corner`);
        handle.addEventListener('pointerdown', event => startResize(event, wrapper, direction));
        wrapper.appendChild(handle);
    }
}

window.addEventListener('load', scheduleFixPaddingBottom);
window.addEventListener('resize', scheduleFixPaddingBottom);

gsap.registerPlugin(Draggable);

function initializeDraggables() {
    if (draggablesInitialized) {
        return;
    }

    const cards = document.querySelectorAll('.gallery_card');
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const dragTrigger = card.querySelector('.gallery_card_image') || card;

        Draggable.create(card, {
            type: 'left,top',
            trigger: dragTrigger,
            allowContextMenu: true,
            minimumMovement: 3,
            onPress: function () {
                if (resizeState && resizeState.element === this.target) {
                    return;
                }

                bringCardToFront(this.target);
                this.target.classList.add('is-dragging');
            },
            onRelease: function () {
                this.target.classList.remove('is-dragging');
            },
            onDragEnd: function () {
                if (resizeState && resizeState.element === this.target) {
                    return;
                }

                persistCardPosition(this.target, true);
                scheduleFixPaddingBottom();
            }
        });
    }

    draggablesInitialized = true;
}

if (isLocal) {
    const btn = document.createElement('button');
    btn.id = 'labyrinth-copy';
    btn.textContent = 'Copy layout JSON';
    btn.addEventListener('click', () => {
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
    if (!thumbnailSizer || !imageGallery) {
        return;
    }

    const cards = document.querySelectorAll('.gallery_card');
    const gutter = convertRemToPixels(2);

    let maxBottom = 0;

    for (let i = 0; i < cards.length; i++) {
        const cardBottom = cards[i].offsetTop + cards[i].offsetHeight;
        if (Number.isFinite(cardBottom)) {
            maxBottom = Math.max(maxBottom, cardBottom);
        }
    }

    const newPaddingBottom = Math.max(gutter, maxBottom + gutter);
    imageGallery.style.setProperty('padding-bottom', `${newPaddingBottom}px`);
}
