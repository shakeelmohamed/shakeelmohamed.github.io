const fs = require('fs');
const utils = require('../../utils');

module.exports = {
    eleventyComputed: {
        pageTitle: data => data.title + " by Shakeel Mohamed",
        // Reformat the date in ISO format
        cleanDate: data => utils.formatDate(data.page.date),
        atomFeedDate: data => utils.formatDateForAtomFeed(data.page.date),
        atomUpdatedDate: data => utils.gitDates(data.page.inputPath).then(dates => utils.formatDateForAtomFeed(dates.modified)),
        categoriesList: data => data.tags.filter((val) => {
            return !(val.toLowerCase() == "post" || val.toLowerCase() == "featured");
        }),
        categories: data => data.tags.filter((val) => {
            return !(val.toLowerCase() == "post" || val.toLowerCase() == "featured");
        }).join(", "),
        openGraphImage: data => {
            return utils.buildOGImageURL(data) || 'https://placehold.co/1200x630';
        }
    }
};