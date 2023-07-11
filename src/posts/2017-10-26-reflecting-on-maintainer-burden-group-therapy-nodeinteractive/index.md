---
layout: post
date: 2017-10-26
title: "Reflecting on Maintainer Burden Group Therapy @ #NodeInteractive"
description: "When your group discussion ends up on YouTube… you might as well write a blog post about it!"
tags:
    - post
    - career
---


Earlier this month I made the drive up to beautiful British Columbia to attend [Node.js Interactive](http://events.linuxfoundation.org/events/node-interactive). After nearly two days of awesome technical sessions, there was one final slot remaining before the closing keynotes. I saw a new session show up on the schedule titled “Maintainer Burden Group Therapy” and knew I had to go **immediately**!

<iframe src="https://www.youtube.com/embed/_Afog6J1pcA?start=396" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" style="aspect-ratio: 16 / 9; width: 100%;"></iframe>


## Before we get into what I shared on stage, let’s take a journey through what got me interested me in this session to begin with…

When I joined Splunk as an intern back in the summer of 2013, I began working on several of Splunk’s SDKs. Over the course of my two years as an intern, I went from knowing very little about the process of software development to becoming the sole maintainer of about 15 GitHub projects. The learning process over those two years was invaluable. Off the top of my head, I remember learning about:

* Writing code in Python 2.7, Node.js (since v0.10), and modern C# using async/await
* Writing developer friendly APIs (s/o to [Glenn Block](https://www.linkedin.com/in/gblock))
* Git branching strategies (mainly [git-flow](http://nvie.com/posts/a-successful-git-branching-model/))
* Coding standards (thank you [David Foster](https://twitter.com/davidfstr)!)
* Writing unit and integration tests
* Configuring CI systems on both Travis CI and Jenkins
* Writing developer facing docs, examples, and blog posts (like this one!)
* Triaging customer issues, and even making a phone call if needed
* Most of all, responding to GitHub issues and pull requests

## Bro, you learned a lot… what’s the problem?

I wouldn’t necessarily call it a problem… Those two years were amazing, but my career growth had stagnated. As a recent college grad, my time was more valuable spent in areas I could grow — such as Splunk Enterprise, * our flagship product. This is where things got interesting. The customer requests, both internally and externally, never stopped and I had to spend most of my time on Splunk’s core backend.

## ## “I can just work a few more hours and still work on SDKs”

Well, that didn’t work. What also didn’t work was trying to context switch between my main project, and as many as 4 of our open source projects within the same week! In Jeff Sutherland’s [“Scrum: The Art of Doing Twice the Work in Half the Time”](https://amzn.to/2WmnnIo), I distinctly remember a table showing how painful context switching can be. By the time an individual is working on 5 concurrent projects, they’re losing about 75% of their time to context switching. That meant that **75% of my time was being wasted**!!

Unfortunately, we as a company didn’t do a great job with this transition of high to low support of the SDKs - but the pain has become manageable nowadays. The projects themselves have been deprioritized, so unless a truly urgent issue comes up - the work is put on the backlog. With some internal re-orgs, we’re now able to load-balance what little work comes up among teams in our product area. Assigning an SDK task to someone with no experience on the project isn’t necessarily the most efficient thing, but it definitely has helped ease the maintainer burden from me (regardless of how much another engineer might need my consultation).


## Now we get to the juicy parts!

As you can see, I had plenty of motivation for attending group therapy after my experiences with open source at Splunk - not to mention maintaining some of my own projects like [Zen Audio Player](https://medium.com/@_shakeel/reflecting-on-1-year-of-zen-audio-player-57ee759365ee)!

The Maintainer Burden Group Therapy session was held in the largest hall used for the conference. Yeah, the same one used for the keynotes… definitely a little intimidating. After a bit of an introduction, we split up into groups to discuss how we (the collective open source community) can do things better, especially as open source maintainers. I’m still not sure how I ended up presenting for my group, and I definitely had no idea they were recording the short group presentations, or that it’d end up on YouTube! 😂 The following is a summary of what my group came up with:

* Selling our projects (outbound marketing) to get more people interested and excited about using them. Inbound marketing (finding projects to work on for people interested in open source) has been solved with things like [Up For Grabs](http://up-for-grabs.net/) and [Hacktoberfest](https://hacktoberfest.digitalocean.com/).
* Adding GitHub labels to issues for “new contributors only”
* [Adding contributing notes to your GitHub repo](https://help.github.com/articles/setting-guidelines-for-repository-contributors/)
* Creating GitHub [issue](https://help.github.com/articles/creating-an-issue-template-for-your-repository/) and [PR](https://help.github.com/articles/creating-a-pull-request-template-for-your-repository/) templates
* When possible, setting up CI for all pull requests. [Travis CI](https://travis-ci.org/) makes this easy, there’s plenty of other free providers too!
* Documenting why the project was started, to give all contributors a shared understanding and context to the code they’re looking at
* Maximizing time when on-boarding new contributors. This is a lot easier with my with co-workers in some ways because I can just sit next to them and pair program. This is much tougher to pull of virtually, but maybe even a quick phone or video call might be more effective than chat/email/GitHub discussions over weeks/months- give it a try! (Remember, too much context switching can be deadly).
* Bringing on more non-technical folks, most developers aren’t world class technical writers or marketing geniuses. Let’s bring in people with those skills and make them part of the open source community!


## I did it, I wrote a whole blog post!

Only 9 months since my last one 🎉

PS: Special thanks to those not mentioned above: Itay Neeman (who hired me as a young scrappy intern), Tedd Hellmann (for being an awesome PM), and jory burson for facilitating our small group discussion!