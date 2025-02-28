# TODO

## Urgent

- [ ] wait 3 days; get DNS working, then add DMARC policy for gmail
- [X] Good to hide the Salgirah project from website now...
- [X] opengraph image: remove colon, lowercase T and L
- [ ] wget all images from cargo, bring them into the repo... its risky right now [Done: Rothko, MJ, TPS] [WIP:]


## Blocking

- [x] Rothko: crop the video to avoid black bars
- [x] Rothko: update all book imgs with gifs

## ASAP

- [ ] Rothko: update all book imgs, missing some stills instead of all gifs
- [ ] Rothko TV bug: optimize as a gif or add some music
- [ ] Rothko: try to match background colors to the brand gray tone
- [ ] Rothko: why is the book cover so piexelated, esp PBS logo? investigate
- [ ] APS: show identity system overview for macro and micro (type, color, logo lockups) --- just make it like a slide hehehehehehehehehehehehehehehehehehehe
- [ ] MJ: spend 1 hour, see if I can salvage some of the motion
- [ ] Thesis: overall clean it up ASAP and remove the note about it... [easier once midterm deck is done]
- [ ] Thesis: what are the points of my talk? some high level ideas, or takeaways... still unclear what I am bringing to expand the perceived value of designers
- [ ] ALL CAPTIONS: add periods at the end check emmmmm
- [ ] Update resume ASAP once approved

## LATER

- [ ] Fix issues with mobile font tester
- [ ]  All through MFA I was working on typefaces because they did X for me; the result is I can see comms symbols/forms in a whole new way. I understand the rigor of what it takes to find mastery of craft. [In interviews, speak about myself vs. describing the fonts themselves, consider speaking to hiring manager as non-designers.] How will it benefit a team?
- [ ] Salgirah + others, fix weird images sizes + replace all content, can make it flatter + break up the carousels so it reads cleanly
- [ ] Salgirah: can move it into labyrinth if I want to keep it anywhere (I’d rather keep it as a hidden page)
- [ ] Labyrinth: include more things like WHP, community photos, etc.
- [ ] Labyrinth description: value is my intelligent approach to work, skillful ability to work in simplicity and complexity, dedication to community, learning in formal/informal/digital settings - one of my biggest strengths


## My notes
- [ ] Start posting on Behance!
- [ ] add JS or CSS tick for email obfuscation
- [ ] Add meta descriptions for all project pages 
- [ ] Rework projects to have a cover.png shown at the top (ideally its the same image as the OG, just scaled up + higher res) -> scale should be about 1920x1200, the OG size feels too wide for cover images
- [ ] on large screens, images max out in size at 1920 and have a huge right margin sometimes
- [ ] Perhaps use cover.png instead of opengraph for project thumbnails
- [ ] Can include small images for AIGA talks on about page... BELOW the resume area
- [ ] Mindful Roman - poster has kinda tight leading on the 3 paragraphs, I think... need to check at full scale
- [ ] Overall, I need to clean up all overview descriptions, there are a bit loose at the moment. Writing center is a good move there.
- [ ] Revisit footer design, some inspo: https://www.footer.design/, https://www.footer.design/styles/typographic


## Low priority

- [ ] learn about noreferrer, etc: https://linkbuilder.io/rel-noopener-noreferrer/
- [ ] Rework semantics for SEO for: h1/h2/etc
- [ ] JS to prevent bad breaks (widows / orphans)
- [ ] nice to have: setup a contact card button for grad show: https://vcard.link/card
- [ ] - [ ] Respnsive image laoding... add avif/etc optimized loadtime support
- [ ] figure out how to generate the tag pages (e.g. .com/branding)
- [ ] figure out how to show extra process (another slider, hidden section, etc.)
- [ ] ALL CAPTIONS: automate check for periods at the end
- [ ] Might as well do a custom 404: https://www.404s.design/

## Consider Revisiting

- [ ] Footer: need a home link (rough added to my name, can it be more obvious)
- [ ] Footer: on project pages, can have a next/prev project (need some logic for that)
- [ ] Capitalize first letter of first tag (homepage under each project, and thesis page), within a project page, capitalize like “Media: Poster”; and then lowercase homepage “Branding, typography, leadership” to be consistent
- [ ] HSTS support via cloudflare? Not sure if this still works with github pages


## DONE

### Week 6

- [X] Sticky header: https://tw-elements.com/docs/standard/extended/sticky-header/
- [X] About: build out fuller resume like before, include descriptions of each position at least
- [X] TYPO: maybe the goal is too ambitious lol
- [X] TYPO: needs captions + design decisions for why black and white
- [X] Make the sticky header full-width, silly that it is not esp for Labyrtinth!!!
      Quick fix is add the following on `.newHeader` 

```css
.newHeader {
    margin-left: -2rem;
    padding-left: 2rem;
    margin-right: -2rem;
    padding-right: 2rem;  
}  
```


### Week 4

- [X] About page heroes: “how much I have dedicated the past 4 years to involving myself in design communities to enrich my experience + share the experiences with others, building my design leadership experiences”; currently it is too much just hero worship... dedication to me and to the people I work with to bring communities together (one of the more valuable things that I do together)
- [X] Break out special thanks, render it at the bottom of those projects
- [X] MJ: David Holz on blue conf poster is larger type than others... well he’s the CEO but maybe they should just be the same size
- [X] All projects: restructure the special thanks to (remove colon, say “instructors... ”) for those people so we know who there. [Done: MJ, TODO: thesis, Rothko, TYPO, Salgirah, RM, MR]
- [X] Header: rename labyrinth to experiments, but keep the header on that page

### Week 2

- [X] About: Period after “the” in PD quote
- [X] Rothko: Can just say “table of contents” above on right column
- [X] Rothko: can move Sean Adams photo out, can move to about me page instead [also the description of former chair... ya not great]
- [X] Rothko: OOPS there’s a repetition of carousel w/ the 2-up grid
- [X] Rothko: What was the AR experience? Might be moved to labyrinth
- [X] Rothko: caption for Inventing the Alphabet - does that go italics or something? check it + just run it by her if changing it
- [X] SLIGHLTLY more margin above captions, ~4pt equivelent
- [X] About me: “on site in Los Angeles”, not super critical but an easy fix to update everywhere
- [X] Thesis: month+year for AIGA conf
- [X] Thesis: crazy line breaks on right column, whyyyy
- [X] Salgirah: remove portfolio festival video. Maybe just keep it linked from about page in the mini-resume thing
- [X] Footer: need a home link (rough added to my name, can it be more obvious)
- [X] Footer: on project pages, can have a next/prev project (need some logic for that)
- [X] Capitalize first letter of first tag (homepage under each project, and thesis page), within a project page, capitalize like “Media: Poster”; and then lowercase homepage “Branding, typography, leadership” to be consistent

- [X] Test DNS origin rule with subdomains... this might solve the 2 domain issue: https://developers.cloudflare.com/rules/origin-rules/examples/change-uri-path-and-host-header/ (solved with simple redirect of shakeel.design to shakeelmohamed.com)
- [X] Update all opengraph images (1200 x 630) [Done: Mindful Roman, Referential Mono, TYPO, Salgirah, Thesis, Rothko, MJ, TPS, inclusion tee, Lyric posters]
