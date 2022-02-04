const utils = require('../../utils');

// TODO: bring in more metadata fields: what (branding, type, etc.), tools, client, year
module.exports = {
    eleventyComputed: {
        pageTitle: data => data.title + " – Shakeel Mohamed",
        openGraphImage: data => utils.buildOGImageURL(data),
        // TODO: consider making media a hardcoded string... unless using it for filtering
        //      (e.g.: I could make a "tag" view for projects /media/experimental-typography)
        mediaString: data => (data.media || []).sort().join(", ")
    }
};