module.exports = {
    eleventyComputed: {
        pageTitle: data => data.title + " – Design Portfolio – Shakeel Mohamed",
        openGraphImage: data => {
            if (data.openGraphImage) {
                return data.page.filePathStem.replace("index", "") + data.openGraphImage;
            } else {
                return "https://dummyimage.com/1200x630/000/fff.png&text=Project+Cover+Photo+Here";
            }
        }
    }
};