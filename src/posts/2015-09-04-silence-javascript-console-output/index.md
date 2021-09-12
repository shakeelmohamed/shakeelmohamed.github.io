---
layout: post
date: 2015-09-04
title: Silence JavaScript console output
description: This is super helpful for unit testing with 100% code coverage, while maintaining a clean test output on the console!
tags:
    - post
    - development
---

This is super helpful for unit testing with 100% code coverage, while maintaining a clean test output on the console!

First you need some basic setup code:

```js
// Backup console.log so we can restore it later
var ___log = console.log;
/**
 * Silences console.log
 * Undo this effect by calling unmute().
 */
function mute() {
    console.log = function(){};
}
/**
 * Un-silences console.log
 */
function unmute() {
    console.log = ___log;
}
```

Then, you can write code using `mute()` and `unmute()` like so:

```js
mute();
MyClass.functionThatPrintsOutput();
unmute();
```