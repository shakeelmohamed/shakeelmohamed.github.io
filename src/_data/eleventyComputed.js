const utils = require('../../utils');

module.exports = {
    eleventyComputed: {
        atomFeedUpdatedDate: function(data) {
            // Calculated only for the atom feed
            if (Object.keys(data.page).length > 0 && data.page.fileSlug === "feed.xml") {
                let postsOnly = data.collections.all.filter(e => e.filePathStem.startsWith('/posts/2'));
                let latest = postsOnly.pop();
                return utils.formatDateForAtomFeed(latest.date);
            }
            else return null;
        }
    }
};
