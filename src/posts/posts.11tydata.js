const utils = require("../../utils");

module.exports = {
    eleventyComputed: {
        pageTitle: data => data.title + " | Shakeel Mohamed — Brand Systems Designer",
        cleanDate: data => utils.formatDate(data.page.date),
        atomFeedDate: data => utils.formatDateForAtomFeed(data.page.date),
        atomUpdatedDate: data => utils.gitDates(data.page.inputPath).then(dates => {
            const date = dates.modified || data.page.date;
            return utils.formatDateForAtomFeed(date);
        }),
        categoriesList: data => data.tags.filter((val) => {
            return !(val.toLowerCase() == "post" || val.toLowerCase() == "featured");
        }),
        categories: data => data.tags.filter((val) => {
            return !(val.toLowerCase() == "post" || val.toLowerCase() == "featured");
        }).join(", "),
        openGraphImage: data => {
            return utils.buildOGImageURL(data);
        }
    }
};