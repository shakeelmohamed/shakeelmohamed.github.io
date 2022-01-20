// TODO: bring in more metadata fields: tools, client, year
module.exports = {
    eleventyComputed: {
        pageTitle: data => data.title + " – Design Portfolio – Shakeel Mohamed",
        openGraphImage: data => {
            if (data.openGraphImage) {
                return data.page.filePathStem.replace("index", "") + data.openGraphImage;
            } else {
                return "https://dummyimage.com/1200x630/000/fff.png&text=Project+Cover+Photo+Here";
            }
        },
        // TODO: update metadata in every project, then swap "data." with "media."
        media: data => data.tags.join(", ")
    }
};