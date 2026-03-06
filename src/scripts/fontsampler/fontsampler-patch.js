document.addEventListener("fontsampler.events.skininit", function (e) {
  var fs = e.detail && e.detail.fontsampler;
  if (!fs || !fs.root) return;

  var tester = fs.root.querySelector("[data-fsjs='tester']");

  function normalizeLineEndSpaces() {
    if (!tester) return;
    var html = tester.innerHTML;
    var cleaned = html
      // spaces/NBSP before forced line breaks
      .replace(/(?:&nbsp;|\u00A0|[ \t])+(?=<br\s*\/?>)/gi, "")
      // spaces/NBSP before iOS contenteditable block boundaries
      .replace(/(?:&nbsp;|\u00A0|[ \t])+(?=<\/div>)/gi, "")
      // trailing spaces at end of content
      .replace(/(?:&nbsp;|\u00A0|[ \t])+$/gi, "");

    if (cleaned !== html) tester.innerHTML = cleaned;
  }

  // Your existing mobile slider patch
  fs.root.querySelectorAll("input[type='range'][data-fsjs-ui='slider']").forEach(function (slider) {
    if (slider.dataset.mobilePatchApplied) return;
    slider.dataset.mobilePatchApplied = "1";

    slider.addEventListener("input", function () {
      var value = parseFloat(slider.value);
      var key = slider.dataset.fsjs;

      if (key) {
        fs.setValue(key, value);
      } else {
        var axis = slider.dataset.axis;
        var variation = fs.getValue("variation") || {};
        variation[axis] = value;
        fs.setValue("variation", variation);
      }

      // Re-wrap after value change can expose trailing NBSP artifacts
      normalizeLineEndSpaces();
    });
  });

  // Avoid caret jump while typing: clean on blur, and once after init
  if (tester) tester.addEventListener("blur", normalizeLineEndSpaces);
  requestAnimationFrame(normalizeLineEndSpaces);
}, true);

