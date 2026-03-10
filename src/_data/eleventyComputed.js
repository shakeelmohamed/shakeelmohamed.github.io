const utils = require('../../utils');

module.exports = {
    eleventyComputed: {
        cleanDate: function(data) {
            return utils.formatDate(data.page.date);
        },
        atomFeedUpdatedDate: function(data) {
            let postsOnly = data.collections.all.filter(e => e.filePathStem.startsWith('/posts/2'));
            if (!postsOnly.length) {
                return null;
            }
            let latest = postsOnly.reduce((currLatest, entry) => {
                return entry.date > currLatest.date ? entry : currLatest;
            });
            return utils.formatDateForAtomFeed(latest.date);
        }
    }
};
