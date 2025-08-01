const utils = require('../../utils');

function makeLinks(data) {
    if (!data.media || data.media.length === 0) {
        return [];
    }

    let links = [];
    for (let m of data.media) {
        if (m.length > 0) {
            // Capitalize only the first letter of the first media type
            if (links.length === 0) {
                m = utils.capitalizeFirstLetter(m);
            }
            
            if (data.tags.includes("archive")) {
                links.push(m);
            } else {
                links.push(`<a href="/${m.replace(/\s+/g, '-').toLowerCase()}">${m}</a>`);
                // TODO: ideally we are matching against existing tags to avoid broken links, worst case write tests for this
                // let matched; 
                // data.collections.mediaTypes.find(mediaData => {
                //     return mediaData.name === m ? mediaData.slug : false;
                // })                
                // if (!matched) {
                //     links.push(m);
                //     // throw new Error(`Media link not matched: ${m} on page ${data.title}`);
                // } else {
                //     links.push(`<a href="/${matched.slug}">${m}</a>`);
                // }
                
            }
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
        mediaLinks: data => makeLinks(data),
        relatedProjects: data => {
            if (data.collections.portfolio.length === 0 || data.title === "Projects") return;

            let curIdx = -1;
            for (let i = 0; i < data.collections.portfolio.length; i++) {
                let iProject = data.collections.portfolio[i];
                if (iProject.data.title === data.title) {
                    curIdx = i;
                    break;
                }
            }
            // console.log("--at idx", curIdx);
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
                    // console.error("prev", prevIdx || "NULL", "cur", curIdx, "next", nextIdx);
                    // console.error(e);
                    throw e;
                }

                // console.log("================================");
                ret = {
                    next: data.collections.portfolio[nextIdx],
                    prev: data.collections.portfolio[prevIdx]
                };
            } else {
                // TODO: this is kind of a sucky situation actually... maybe we should show portfolio[0] and portfolio[1]? or random?
                console.log("Skipping next/prev links for:", data.title)
            }
            return ret;
        }
    }
};