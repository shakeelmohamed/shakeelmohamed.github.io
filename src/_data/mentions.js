var all = [
    {
        // TODO: need to support italics for magazine title
        "date": "March 11, 2024",
        "title": "Interview with Voyage LA Magazine",
        "url": "https://voyagela.com/interview/daily-inspiration-meet-shakeel-mohamed/"
    },
    {
        "date": "June 16, 2023",
        "title": "A year in the life: Graduate Graphic Design student Shakeel Mohamed recaps his first chapter. - @artcenteredu on Instagram",
        "url": "https://www.instagram.com/p/CtjqybbxLWW/"
    },
    {
        "date": "March 23, 2023",
        "title": "Type Thursday LA Featured Speaker - @typethursdayla on Instagram",
        "url": "https://www.instagram.com/p/CqJdQNfPx1P/"
    },
    {
        "date": "July 21, 2022",
        "title": "2022 AIGA Portfolio Festival | One Year Can Change Your Whole Life by Shakeel Mohamed",
        "url": "https://www.youtube.com/watch?v=HtRtGYQx480"
    },
    {
        "date": "May 17, 2021",
        "title": "Made With Love podcast - Shakeel's Journey (part 2)",
        "url": "https://podcasts.apple.com/me/podcast/shakeels-journey-part-2/id1556518451?i=1000521087904"
    },
    {
        "date": "March 30, 2021",
        "title": "Made With Love podcast - Shakeel's Journey (part 1)",
        "url": "https://podcasts.apple.com/me/podcast/shakeels-journey/id1556518451?i=1000515042963"
    },
    {
        "date": "March 12, 2021",
        "title": "Agile Mentality in Business with Love Nescio - @lovenescio on Instagram",
        "url": "https://www.instagram.com/p/CMVpHC7AeDk/"
    },
    {
        "date": "Aug 4, 2020",
        "title": "Announcing the Newest Version of SimData",
        "url": "https://www.splunk.com/en_us/blog/tips-and-tricks/introducing-simdata-v1-2.html"
    },
    {
        "date": "August 8, 2020",
        "title": "Spotifaves (Codeday Labs 2020 mentor project)",
        "utl": "https://showcase.codeday.org/project/ckkh1rouo20550711o548ws85h8"
    },
    {
        "date": "May 21, 2020",
        "title": "Meet Shakeel Mohamed. He's the founder of ntrsct designs - @thehealthaisle on Instagram",
        "url": "https://www.instagram.com/p/CAeR7YonA2x/"
    },
    {
        "date": "March 11, 2019",
        "title": "Inspiring the Next Generation in Cybersecurity at CodeDay",
        "url": "https://www.splunk.com/content/splunk-blogs/en/2019/03/11/inspiring-the-next-generation-in-cybersecurity-at-codeday.html"
    },
    {
        "date": "October 5, 2017",
        "title": "Maintainer Burden Group Therapy - Node.js Interactive 2017 Vancouver, BC",
        "url": "https://www.youtube.com/watch?v=_Afog6J1pcA&t=6m36s"
    },
    {
        "date": "January 6, 2016",
        "title": "An Hour of Code with Splunk",
        "url": "http://blogs.splunk.com/2016/01/06/an-hour-of-code-with-splunk/"
    },
    {
        "date": "June 14, 2015",
        "title": "Commencement pride shines for Seattle University grads",
        "url": "http://www.seattletimes.com/photo-video/photography/commencement-pride-shines-for-seattle-university-grads/"
    },
    {
        "date": "March 25, 2015",
        "title": "The Splunk SDK for JavaScript gets support for Node.js v0.12 and io.js!",
        "url": "https://www.splunk.com/en_us/blog/tips-and-tricks/the-splunk-sdk-for-javascript-gets-support-for-node-js-v0-12-and-io-js.html"
    },
    {
        "date": "September 17, 2014",
        "title": "New support for authoring modular inputs in Node.js",
        "url": "https://www.splunk.com/en_us/blog/tips-and-tricks/new-support-for-authoring-modular-inputs-in-node-js.html"
    },
    {
        "date": "September 10, 2013",
        "title": "The Splunk SDK for Python gets modular input support",
        "url": "https://www.splunk.com/en_us/blog/tips-and-tricks/the-splunk-sdk-for-python-gets-modular-input-support.html"
    },
    {
        "date": "August 23, 2012",
        "title": "Meet the 7 startup teams in StudentRND's summer incubator",
        "url": "http://www.geekwire.com/2012/meet-teams-student-rnd-summer-incubator/"
    },
    {
        "date": "February 28, 2012",
        "title": "BC Computer Science Club",
        "url": "http://www.thewatchdogonline.com/bc-computer-science-club-8639"
    }
];

var recent = all.filter(mention => {
    const twoYearsAgo = (new Date()).getFullYear() - 2;
    return (new Date(mention.date)).getFullYear() >= twoYearsAgo;
});

module.exports = {
    all,
    recent
};