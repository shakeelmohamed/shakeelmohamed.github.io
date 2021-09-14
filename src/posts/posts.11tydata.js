module.exports = {
    eleventyComputed: {
        pageTitle: data => data.title + " by Shakeel Mohamed",
        // Reformat the date in ISO format
        cleanDate: data => formatDate(data.page.date),
        atomFeedDate: data => formatDateForAtomFeed(data.page.date),
        categoriesList: data => data.tags.filter((val) => {
            return !(val.toLowerCase() == "post" || val.toLowerCase() == "featured");
        }),
        categories: data => data.tags.filter((val) => {
            return !(val.toLowerCase() == "post" || val.toLowerCase() == "featured");
        }).join(", ")
    }
};

// The date returned may be off by 1 day due to UTC Offset
// This split on T is probably not ideal, but good enough for now
function formatDate(date) {
    return date.toISOString().split("T")[0];
}

// TODO: actually this is for Atom/RSS feeds, not sitemaps
function formatDateForAtomFeed(date) {
    let dateObj = new Date(date);
    // Atom uses RFC 3339 dates
    // https://tools.ietf.org/html/rfc3339#section-5.8
    let s = dateObj.toISOString();

    // remove milliseconds
    let split = s.split(".");
    split.pop();

    return split.join("") + "Z";
}

// TODO: if date is missing, try to parse it from the folder name?