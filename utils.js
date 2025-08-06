const gitDateExtractor = require('git-date-extractor');

const cfs = function(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

module.exports = {
    // The date returned may be off by 1 day due to UTC Offset
    // This split on T is probably not ideal, but good enough for now
    formatDate: function(date) {
        return date.toISOString().split("T")[0];
    },
    // displayDate: function(data) {
    // TODO: desired format is January 01, 2025
    // },
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
        if (!data.openGraphImage) {
            // TODO: this is where to generate the OG images, for now use the IDD template
            // TODO: OR this should be the default OG image but its relative path may require work to compute
            console.warn(`buildOGImageURL is missing an OG image for ${data.title}`);
            return;
        }
        else if (!data.openGraphImage.startsWith("https:")) {
            return data.page.filePathStem.replace("index", "") + data.openGraphImage;
        }
        else {
            return data.openGraphImage;
        }
    },
    capitalizeFirstLetter: cfs,
    titleCase: function(str) {
        const words = str.split(" ");

        if (words.length < 2) {
            return cfs(str);
        }

        for (let i = 0; i < words.length; i++) {
            words[i] = cfs(words[i]);
        }
        return words.join(" ");
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
