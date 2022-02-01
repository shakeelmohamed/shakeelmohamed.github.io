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
    }
    // TODO: if date is missing, try to parse it from the folder name?
};