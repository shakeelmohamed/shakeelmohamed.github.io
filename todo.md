# TODO

## Important, not urgent

- [ ] Add DMARC policy for gmail

For conversion from mp4 to avif (eventually, phase out all gifs):

```shell
ffmpeg -i ontology_cover.mp4 -c:v libaom-av1 -crf 20 -b:v 0 -still-picture 0 ontology_cover.avif
```

Figure out how to CLI automate spell check like this app: https://www.spl.ing/report-card?website=shakeelmohamed.com&uuid=e4e2c283-6e32-4327-97f6-955a0a38ef2d

## ASAP

- [ ] check all opengraph images


- Thesis:
- [ ] social media, re-do it
- [ ] the quiz!
- [ ] process book
- [ ] other sketches, ideation from fall
- [ ] thesis slide from graduation walk?

Others
- [ ] referential mono: crit/printed process, kashida/Eid motion, what about the posters?
- [ ] RM: show research kufic chart also
- [ ]   brand guidelines document (MJ) - great 1920x1080 mockup, just need to design the images now
- [ ]   website (Thesis, TPS, MJ)
- [ ]   MJ motion (logo reveal, 15-30s piece, product UI features)
- [ ]   fix composition for "Ontology - 15.png", the leading is not right
- [ ] Rough out some UI/web case study (maybe Digital Anarchy)

## P1

- [ ] MJ: why am I not showing the brand guidelines? NEED THIS in a slide overview off-axis angle format
- [ ] MJ: motion
- [ ] MJ: update project summary
- [ ] MJ: spend 3 hours on motion (new storyboard, logo decomposition into layers, production), goal should be 10 seconds max
- [ ] Thesis: what are the points of my talk? some high level ideas, or takeaways... still unclear what I am bringing to expand the perceived value of designers
- [ ] APS: show micro ID system overview
- [ ] Rothko: photoshoot outside of my holding fabric poster(s) https://www.instagram.com/p/CxGUOs_rMTE/?img_index=1
- [ ] Social media design ~~~~ need it in portfolio now!
- [ ] Rothko: update all book imgs, missing some stills instead of all gifs
- [ ] Rothko: try to match background colors to the brand gray tone
- [ ] Rothko: why is the book cover so pixelated, esp PBS logo? investigate
- [ ] ALL CAPTIONS: add periods at the end check emmmmm
- [ ] add more 3D stuff to labyrinth
- [ ] TPS: process is missing
- [ ] Can update bio to speak about trained as a designer all along (clearly explain why I changed careers)


## Grad show

- [ ] Link to to graduation walk, maybe make a YT clip: https://youtu.be/SASQKIg3VY4?t=5040
- [ ] I am running into lots of issues here... Can show a 3D model of the wall too, host on sketchfab w/ annotations: https://support.fab.com/s/article/Annotations
    - [ ] See also: https://github.com/sketchfab/blender-plugin/releases/tag/1.6.1
- [ ] Spinning 3D model of biz card would be so cool
- [ ] Include thesis process images

## Bio revision

- [ ] Can set up thesis in my bio a bit to speak more maturely as being an advocate and helping others to become advocates.
- [ ] Need a new tagline! 3 key ideas: advocate/community for designers, cross-disciplinary approach, and typography is central to everything I do.
- [ ] ...(longer form about me could build) ... this began in my past career as a software engineer where I built my analytical thinking skills, while understanding the need for clearer communication about the technologies I was building...
- [ ] Overall positioning through leadership, technical expertise, and economy design

# P3


- [ ] hmm (security) Add rel="noopener noreferrer" to external links
- [ ] Labyrinth: bring src/projects/mark-rothko/img/Rothko-AR-demo.png over
- [ ] MJ: keep working on lighting in the installation scene, renders have some odd ghosting on the left side from the HDR
- [ ] TPS maybe show lightsail itself in the motion reveal?
- [ ] TPS make the 30s trailer idea I’ve been thinking about with music, etc.
- [ ] digital signage motion posters
- [ ] more micro touchpoints, so many beautiful print materials - especially the vellum and metallic stuff. Play with Blender renders on this
    - [ ] https://blender.stackexchange.com/questions/131930/translucent-material-a-sheet-of-paper-with-image-texture
- [ ] merch - where’s the jacket + hat?
- [ ] MR: some ephemera like all 12 astrology sign info cards or stickers idk
- [ ] MR: lifestyle brand packaging mockups
- [ ] Type design list page (ideally I have all the tag-specific pages auto generated, otherwise I can curate the ones I need by skill (type design, branding, motion, editorial, web))
- [ ] MJ: show prompts
- [ ] Ontology: re-export all the gif/avif spread-mockups at higher res, the small type is a bit pixelated
- [ ] maybe add a spacer for empty grid divs... https://github.com/shakeelmohamed/shakeelmohamed.github.io/pull/181#discussion_r2114879681; see also https://github.com/shakeelmohamed/shakeelmohamed.github.io/pull/181#discussion_r2114880664
- [ ] multi-column text settings for all fonts would be helpful to see


## LATER

- [ ] Explore using fluid typography... how does this fit w/ Tailwind?
    - [ ] https://fluidtypography.com/#usarusFluidTypographyGetStarted
    - [ ] https://codepen.io/iamryanyu/pen/gbpWGYQ
- [ ] How might I reframe all projects to speak to expertise vs. the project… (e.g. More about me… through Rothko….. vs. about Rothko)
- [ ] How can symbol make it onto the about page? ugh
- [ ] Update all website meta descriptions, “holds an MFA” is not so interesting
- [ ] check favicon colors against printed materials
- [ ] Look at some SEO tricks for primary featured images, could be nice to get my whole portfolio showing in search results: https://stackoverflow.com/questions/32577999/how-can-i-add-schema-org-primaryimageofpage-in-my-site
- [ ] Setup 404 tracking w/ GA: https://www.analyticsmania.com/post/track-404-errors-with-google-analytics-google-tag-manager/#ga4-gtm
- [ ] Design 404 page; https://www.404s.design/; consider an opportunity for generative design
- [ ] Fix issues with mobile font tester [WIP might be okay now]
- [ ] All through MFA I was working on typefaces because they did X for me; the result is I can see comms symbols/forms in a whole new way. I understand the rigor of what it takes to find mastery of craft. [In interviews, speak about myself vs. describing the fonts themselves, consider speaking to hiring manager as non-designers.] How will it benefit a team?
    - [ ] ...(related) I have been modifying type for identity projects (Rothko and MJ) which began my interest in type design
- [ ] Salgirah: can move it into labyrinth if I want to keep it anywhere (I’d rather keep it as a hidden page)
- [ ] Labyrinth: include more things like WHP, community photos, etc.
- [ ] WHP: maybe rename since Studio Matthews had a show called “your words have power”
- [ ] Labyrinth description: value is my intelligent approach to work, skillful ability to work in simplicity and complexity, dedication to community, learning in formal/informal/digital settings - one of my biggest strengths
- [ ] TODO: optimize email obfuscation: https://github.com/shakeelmohamed/shakeelmohamed.github.io/pull/161#discussion_r1976589880; and https://github.com/shakeelmohamed/shakeelmohamed.github.io/pull/161#discussion_r1976589879
- [ ] overall tailwind class exceptions need to be optimized: https://github.com/shakeelmohamed/shakeelmohamed.github.io/pull/161#discussion_r1976589881


## My notes
- [X] Start posting on Behance!
- [ ] MJ: could 3D model the exterior facade for the conf, and make a wayfinding program with a clear system + grid
- [ ] Tests would be nice
- [ ] Rework projects to have a cover.png shown at the top (ideally its the same image as the OG, just scaled up + higher res) -> scale should be about 1920x1200, the OG size feels too wide for cover images
- [ ] Perhaps use cover.png instead of opengraph for project thumbnails
- [ ] Can include small images for AIGA talks on about page... BELOW the resume area
- [ ] Mindful Roman - poster has kinda tight leading on the 3 paragraphs, I think... need to check at full scale
- [ ] Mindful Roman - do some motion gifs/stills of the font2 specimen sheets I made, fun play on the day/night concept
- [ ] Mindful Roman - gendesign whole astrology chart... oh yeah
- [ ] Overall, I need to clean up all overview descriptions, there are a bit loose at the moment. Writing center is a good move there.
- [ ] Salgirah + others, fix weird images sizes + replace all content, can make it flatter + break up the carousels so it reads cleanly
- [ ] Revisit footer design, some inspo: https://www.footer.design/, https://www.footer.design/styles/typographic
- [ ] Do I need avif fallback? Ontology is using them and it’s really nice... can I get away with no gifs on the website?


## Low priority

- [ ] Redo mockups for TPS tickets, start from a clean INDD file -> PSD, maybe even do Blender mockups
- [ ] learn about noreferrer, etc: https://linkbuilder.io/rel-noopener-noreferrer/
- [ ] Rework semantics for SEO for: h1/h2/etc
- [ ] JS to prevent bad breaks (widows / orphans)
- [ ] - [ ] Responsive image loading... add avif/etc optimized loadtime support; see https://github.com/saneef/eleventy-plugin-img2picture
- [ ] figure out how to generate the tag pages (e.g. .com/branding)
- [ ] figure out how to show extra process (another slider, hidden section, etc.)

## Consider Revisiting

- [ ] Footer: need a home link (rough added to my name, can it be more obvious)
- [ ] Footer: on project pages, can have a next/prev project (need some logic for that)
- [ ] Capitalize first letter of first tag (homepage under each project, and thesis page), within a project page, capitalize like “Media: Poster”; and then lowercase homepage “Branding, typography, leadership” to be consistent
- [ ] HSTS support via cloudflare? Not sure if this still works with github pages
- [ ] ALL CAPTIONS: automate check for periods at the end


## DONE

## New done lol...

- [X] check all the media types for each project, maybe replace posters with print hmm
- [x] fix the website mockup/video, hard color blocking top/bottom
- [X] MJ: start with logo (or motion), can move the HQ down a bit
- [X] SM spelled out in Mindful Roman... duh
- [X] HMCT gallery / my final photo w/ Greg maybe
- [X] thesis: Blender model process
- [X] thesis: AIGA talk photo(s)
- [X] Ontology: crit close-up on the Latin
- [X] Remove react from resume
- [X] Rothko front cover mockup is looking dark
- [X] Rothko, many things are different in the book (esp. animation of spreads in the mockup)
- [X] personal note from me
- [X] can setup a thin sticky banner at the top -> grad show modal maybe
- [X] Apple Invite link to RSVP: https://www.icloud.com/invites/073mzZ3mToW9eku77lcZsJI6g
- [X] Enable the sticky header in base.pug when ready to go live

## week 13

- [X] grad show logistics
- [X] Thesis: overall clean it up ASAP and remove the note about it... [easier once midterm deck is done];
- [X] cleanup grad show portfolio to basically match website
- [X] Thesis website: overall clean it up ASAP and remove the note about it... [easier once midterm deck is done]
- [X] thesis imagery
- [x] Rothko, update special thanks from book

## week 10


- [X] Rothko: move the TOC listing down a bit (leverage the grid-2 structure below to explain the editorial)
- [X] APS: all micro posters have to be updated with new font adjustments (esp. the s change)
- [X] APS: + and the cover / OG photo
- [X] check colors on planetary society images, might need to export the variable font still as RGB (e.g. font outline image... also make it 1920x1080 or make the video 1920x1200 idk)
- [X] APS: have to rebuild ticket mockups FML -- AND THE AI FILES WITH UPDATED TYPE WOW.
- [X] APS: show identity system overview for macro and micro (type, color, logo lockups)
- [X] move rule into the footer and out of the bottom of body
- [X] large screen issue: R margin does not match; image/videos are not full width (e.g. they are smaller resolution than the screen)
- [x] bring all JS files into the repo, all remote libraries!
- [X] on large screens, images max out in size at 1920 and have a huge right margin sometimes
- [X] ALL CAPTIONS: check for periods at the end

### Week 7
- [X] Address mobile layout issues - see March 02, 2025 in notes app

### Week 6

- [X] Update resume ASAP
- [X] add JS or CSS tick for email obfuscation
- [X] Add meta descriptions for all project pages 
- [X] Good to hide the Salgirah project from website now...
- [X] opengraph image: remove colon, lowercase T and L
- [X] wget all images from cargo, bring them into the repo... its risky right now [Done: Rothko, MJ, TPS, MR, RM, Salgirah]
- [x] Rothko: crop the video to avoid black bars
- [x] Rothko: update all book imgs with gifs
- [X] Rothko TV bug: optimize as a gif or add some music
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
