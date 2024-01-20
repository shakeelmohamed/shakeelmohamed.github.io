const utils = require('../../utils');

function makeLinks(media) {
    if (!media || media.length === 0) {
        return [];
    }

    let links = [];
    for (let m of media) {
        if (m.length > 0) {
            // TODO: bring this back after implementing build-time /media/<media_name> pages
            // let link = "/media/" + encodeURIComponent(m.replaceAll(" ", "-"));
            // links.push(`<a href="${link}">${m}</a>`);

            links.push(m);
        }
    }

    return links.join(", ");
}

// TODO: bring in more metadata fields: what (branding, type, etc.), tools, client, year
module.exports = {
    eleventyComputed: {
        pageTitle: data => data.title + " – Shakeel Mohamed",
        openGraphImage: data => utils.buildOGImageURL(data),
        // TODO: consider making media a hardcoded string... unless using it for filtering
        //      (e.g.: I could make a "tag" view for projects /media/experimental-typography)
        mediaString: data => (data.media || []).sort().join(", "),
        mediaLinks: data => makeLinks(data.media)
    }
};