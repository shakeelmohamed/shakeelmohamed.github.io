const utils = require('../../utils');

function makeLinks(media) {
    if (!media || media.length === 0) {
        return [];
    }

    let links = [];
    for (let m of media) {
        if (m.length > 0) {
            // TODO: bring this back after implementing build-time /media/<media_name> pages
            // let link = "/media/" + encodeURIComponent(m.replaceAll(" ", "-"));
            // links.push(`<a href="${link}">${m}</a>`);

            links.push(m);
        }
    }

    return links.join(", ");
}

function nextIndex(cur, len) {
    return (cur + 1) % len;

}

function previousIndex(cur, len) {
    let mod = cur - 1;
    if (mod < 0) {
        mod = len - 1;
    }
    return mod;
}

// TODO: bring in more metadata fields: what (branding, type, etc.), tools, client, year
module.exports = {
    eleventyComputed: {
        pageTitle: data => data.title + " – Shakeel Mohamed",
        openGraphImage: data => utils.buildOGImageURL(data),
        // TODO: consider making media a hardcoded string... unless using it for filtering
        //      (e.g.: I could make a "tag" view for projects /media/experimental-typography)
        
        // TODO: can insert an nbsp; before n-1 words to prevent widows... might need that everywhere tho ugh
        mediaString: data => utils.capitalizeFirstLetter((data.media || []).sort().join(", ")),
        mediaLinks: data => utils.capitalizeFirstLetter((makeLinks(data.media))),
        relatedProjects: data => {
            if (data.collections.portfolio.length === 0 || data.title === "Projects") {
            console.log("================================");
            // TODO: should be able to do some simple math now
            console.log("Total portfolio projects", data.collections.portfolio.length);
            console.log("Current", data.title);

            let curIdx = -1;
            for (let i = 0; i < data.collections.portfolio.length; i++) {
                let iProject = data.collections.portfolio[i];
                // console.dir(iProject);
                if (iProject.data.title === data.title) {
                    curIdx = i;
                    break;
                }
            }
            console.log("--at idx", curIdx);
            let ret = {};
            // Only show prev/next project if current page is a portfolio project (featured on homepage)
            if (curIdx >= 0) {
                let nextIdx, prevIdx;
                try {
                    nextIdx = nextIndex(curIdx, data.collections.portfolio.length);
                    // console.log("Next project", data.collections.portfolio[nextIdx].data.title);
                    // console.log("--next idx", nextIdx);

                    prevIdx = previousIndex(curIdx, data.collections.portfolio.length);
                    // console.log("Previous project", data.collections.portfolio[prevIdx].data.title);
                    // console.log("--prev idx", prevIdx);
                    
                    // console.dir(data.collections.portfolio[nextIdx]);
                } catch (e) {
                    console.error("prev", prevIdx || "NULL", "cur", curIdx, "next", nextIdx);
                    console.error(e);
                    throw e;
                }

                console.log("================================");
                ret = {
                    next: data.collections.portfolio[nextIdx],
                    prev: data.collections.portfolio[prevIdx]
                };
            } else {
                console.log("Skipping next/prev links for:", data.title)
            }
            return ret;
        }
    }
};