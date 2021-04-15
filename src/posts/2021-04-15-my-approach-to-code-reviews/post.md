# My Approach to Code Reviews

One of my first code reviews was when I had a student job in the web development office at Bellevue College. I’d cobbled together a mess of PHP code as a WordPress “plugin” with horrendous variable names like `$sillyMe`, no exaggeration.

Over the years I’ve learned a lot about software design and don’t make *sillyMe-stakes* anymore. In fact, after having my code reviewed dozens of times over the years I became known to give thorough code reviews by knowing what to look for.

This is my attempt to codify the instinctive and intuitive approach I take to code reviews. These are prompts that you can ask yourself as a reviewer or when writing and self-reviewing code. The process may seem very drawn out, but often the steps happen in a matter of seconds.


For brevity, I’ll refer to code reviews as PRs (short for [pull requests](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)) and author as the person submitting the PR.

## 1. Can I understand this change?

PRs are created for various reasons: new features, tests, bug/security fixes, refactors, and style changes are the common ones. It helps to contextualize the code I’m reviewing within these categories first. Hopefully, it’s obvious from skimming the PR description, if not from the title. If it’s not clear to me, I might look at the git commit messages or which files were changed. For example, if a git repository has a directory for tests and only those files have been changed, there’s a good chance the PR is focused on adding or updating tests. Once I know the category for this PR, I can look at it through the appropriate lens.

At this point, I’ll read through the PR description more carefully to understand the reviewer’s intention for this change. If I’m not already familiar with the project, I might search for details about this change in other places (Jira, Slack, GitHub issues, etc.). If I’m not clear by then, I’ll reach out to the PR author directly.

## 2. Is this code change performing the correct behavior?

This is the most important part of the review. I have a clear understanding of the goal, so it’s time to check if the PR aligns with that goal. If the requirements are documented, I’ll refer to those (Jira, the PR description, or wherever the origin of this change was). If the PR author has made any assumptions that don’t align with the requirements, the implementation will likely reflect those assumptions. 

If the code seems to generally be doing the right thing without unintentional side effects, then it’s time to think like a QA engineer - how might this code break?

For example, with a function like `doStuff(int a)` what happens if parameter `a` is:

* Zero
* One
* Even
* Odd 
* Negative
* Very large
* Very small

I'm looking for [edge cases](https://en.wikipedia.org/wiki/Edge_case) at this step. When code goes out in the proverbial “real world”, we should expect just about anything. Sometimes addressing these cases are simple fixes, other times they may require a refactor, so it’s good to catch them early in the review process. It’s much better to catch potential issues in review than in production which can lead to any number of problems from data loss to a system outage.

## 3.  What’s the impact of this change?

Not all code changes are created equally, nor are the impacts of releasing them. Working on developer tools for several years has taught me to always watch out for breaking changes. Suppose you’re working on an SDK and decide to rename a function. That’s all good and well and you can complete the refactor within the SDK codebase without any issues. However, as soon as you release that change, every single consumer of the SDK who uses that function will have a broken program.

This level of review can be tricky and may require a solid understanding of the overall codebase, third-party libraries, programming language, runtime environment, and the broader ecosystem of the project. For example, with JavaScript projects, one might consider which EcmaScript or ES standard version the project needs to be compatible with. The ES version required will then impact which JavaScript language features and libraries can be used, as well as which environments the code can run in. 

The ripple effect of code changes are not always easy to anticipate because they can manifest in many ways. It helps to have customer empathy when working on shared code because those APIs essentially are the product, and nobody likes a broken product.

## 4. How will this code be used, and by whom?

Early in my career, I didn’t think about API design at all. I’d have a task and focus on completing it, and sometimes checking if it performed the correct behavior (see sections 1–2). After working closely with product managers at Splunk, I began to understand that the code I write isn’t just for me to use. Others on my team or other teams at my company might use code I’ve written. When working on developer tools and open source projects, this becomes even more important - someone you’ll never meet might be using your code! This could be a customer building their own solution, or somebody lurking on GitHub trying to do the same thing you are.

I’ll check things like the encapsulation of variables, see if things are scoped properly, etc. Then it gets into more subjective topics like naming and inline documentation in code comments. I believe APIs should be written in a way that requires little to no documentation when possible, and still have a bit of commentary available. It’s also important to look at how many implementation details the end-user needs to know before using your API.

Bottom line: think with the end customer in mind.

## 5. At a glance, how does this change impact performance?

Software performance is not one of my strengths as a developer, but it’s often on my mind during code reviews. Obvious things to pay attention to are any kind of multithreading, recursion or loops, especially with larger input sizes. For example, spinning up 5 process threads is not necessarily a bad thing, however spinning up 5 million threads is going to cause some performance issues.

When working with any kind of network connectivity, the amount of network requests can dramatically impact the performance of an application. If there’s an entity that can be directly retrieved with an HTTP GET call, that’s usually better than a using an HTTP GET call for a collection of entities to then find the the specific one you need. These bottlenecks can be tougher to track down when working with multiple layers of abstraction in a codebase.

With a careful analysis of the code, I believe many performance issues can be caught before requiring any sort of performance testing. Who knows, you might even find some ways to optimize the existing code’s performance.

## 6. Can the code change be simplified?

I think about programming the same way I think about writing. It helps to get a rough draft to start putting ideas together. Sometimes I even start with a list of comments that resembles an essay outline. That first draft might be messy (slow, duplicative, etc.) but it will improve with an iterative process.

By this point in the review, the code change should be functionally sound. Some may consider these last two sections as a bonus. However, I believe they’re essential in keeping the codebase readable and maintainable in the long run.

As with writing, there’s a balance between brevity and readability to consider. A starting point might be to leverage existing utility functions, data structures, and design patterns. The next pass of this might be seeing where code can be shared or abstracted so it’s not implemented multiple times (refer to the [rule of three](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming))).
I don’t have any hard and fast rules on simplifying code, I approach this step more intuitively. If the code feels overly complicated, there may be an opportunity to simplify.

## 7. Does this code change fit the codebase?

The idea of “fit” can be subjective, and can lead to unnecessary pushback from the PR author, so this is where reviewers should tread carefully.

When developing new features, we should take into account the “status quo” or conventions of the project, how the other features interact with each other, and where they exist in the directory structure. If a very large or unique feature is being developed, it may be worth considering if that feature needs its own module or even its own git repository.

As in Section 4, naming should be focused on the consumers of the code for review. Everything from file names to variables and classes can impact the readability and thus the usability of your code.

Finally, it’s time to consider code style. Ideally, the compiler or automatic static analysis tools in the CI pipeline have already caught these issues, but sometimes they slip through anyway. Here is where I’ll check for odds and ends to align the incoming PR with the existing codebase. For example:

* Indentation (tabs vs. spaces, consistent indent width)
* Reasonable comments (inline vs. multiline comments, spacing around them, etc.)
* Removing any new commented-out code
* Spelling and grammatical errors
* Consistent spacing around operators, parentheses, braces, and brackets
* Naming conventions for module, class, function, and variable names (relative to the rest of the codebase)

## Final Thoughts

Once I started writing, I was surprised by how much knowledge about code reviews I’ve amassed over the years. This has not been an exhaustive formula on how to review PRs (Google already written one, the link is below) but, rather the way I’ve gone about them. 

To the future reviewers of the World, I hope these ideas spark something for your next PR. 

### Additional Reading

* [Code Review Developer Guide | eng-practices](https://google.github.io/eng-practices/review/) - Google’s guide to code reviews
* [A Philosophy of Software Design by John Ousterhout](https://smile.amazon.com/Philosophy-Software-Design-John-Ousterhout-ebook/dp/B07N1XLQ7D/) - a great succinct book on software design
* [The Design of Everyday Things by Don Norman](https://smile.amazon.com/Design-Everyday-Things-Revised-Expanded/dp/0465050654/) - not directly related to software, but a great read about designing intuitive and empathetic solutions

