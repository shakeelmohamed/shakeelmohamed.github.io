const gitDateExtractor = require('git-date-extractor');

module.exports = {
    // The date returned may be off by 1 day due to UTC Offset
    // This split on T is probably not ideal, but good enough for now
    formatDate: function(date) {
        return date.toISOString().split("T")[0];
    },
    // TODO: actually this is for Atom/RSS feeds, not sitemaps
    formatDateForAtomFeed: function(date) {
        let dateObj = new Date(date);
        // Atom uses RFC 3339 dates
        // https://tools.ietf.org/html/rfc3339#section-5.8
        let s = dateObj.toISOString();

        // remove milliseconds
        let split = s.split(".");
        split.pop();

        return split.join("") + "Z";
    },
    buildOGImageURL: data => {
        if (data.openGraphImage) {
            return data.page.filePathStem.replace("index", "") + data.openGraphImage;
        } else {
            console.warn(`buildOGImageURL is missing an OG image for ${data.title}`);
            return;
        }
    },
    gitDates: async function(path) {
        function epochToDate(epoch) {
            let ret = new Date(0);
            ret.setUTCSeconds(epoch);
            return ret;
        }
        return gitDateExtractor.getStamps({
            outputToFile: false,
            projectRootPath: __dirname,
            files: path
        }).then(dates => {
            // Remove './' prefix from the path
            let pathStem = path.substring(2);
            return {
                modified: epochToDate(dates[pathStem].modified),
                created: epochToDate(dates[pathStem].created)
            };
        });
    }
    // TODO: if date is missing, try to parse it from the folder name?
};