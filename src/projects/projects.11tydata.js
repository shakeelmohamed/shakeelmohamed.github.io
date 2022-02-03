// TODO: bring in more metadata fields: what (branding, type, etc.), tools, client, year
module.exports = {
    eleventyComputed: {
        pageTitle: data => data.title + " – Shakeel Mohamed",
        openGraphImage: data => {
            if (data.openGraphImage) {
                return data.page.filePathStem.replace("index", "") + data.openGraphImage;
            } else {
                return "https://dummyimage.com/1200x630/000/fff.png&text=Project+Cover+Photo+Here";
            }
        },
        // TODO: consider making media a hardcoded string... unless using it for filtering
        //      (e.g.: I could make a "tag" view for projects /media/experimental-typography)
        mediaString: data => (data.media || []).sort().join(", ")
    }
};