(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FontsamplerSkin = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.dropkickjs=t():e.dropkickjs=t()}(this,function(){return function(e){function t(s){if(i[s])return i[s].exports;var a=i[s]={i:s,l:!1,exports:{}};return e[s].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var i={};return t.m=e,t.c=i,t.d=function(e,i,s){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:s})},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,i){"use strict";function s(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l=function(){function e(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,i,s){return i&&e(t.prototype,i),s&&e(t,s),t}}(),o=i(1),d=s(o),r=i(2),c=s(r),h=i(3),u=s(h),f=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),p=window.parent!==window.self,b=void 0,m=function(){function e(t,i){a(this,e),this.sel=t;var s=void 0,n=void 0,l=window.Dropkick;for("string"==typeof this.sel&&"#"===this.sel[0]&&(this.sel=document.getElementById(t.substr(1))),s=0;s<l.uid;s++)if((n=l.cache[s])instanceof e&&n.data.select===this.sel)return d.default.extend(n.data.settings,i),n;if(!this.sel)throw"You must pass a select to DropKick";if(this.sel.length<1)throw"You must have options inside your <select>: "+t;if("SELECT"===this.sel.nodeName)return this.init(this.sel,i)}return l(e,[{key:"init",value:function(t,i){var s,a=window.Dropkick,n=e.build(t,"dk"+a.uid);if(this.data={},this.data.select=t,this.data.elem=n.elem,this.data.settings=d.default.extend({},c.default,i),this.disabled=t.disabled,this.form=t.form,this.length=t.length,this.multiple=t.multiple,this.options=n.options.slice(0),this.selectedIndex=t.selectedIndex,this.selectedOptions=n.selected.slice(0),this.value=t.value,this.data.cacheID=a.uid,a.cache[this.data.cacheID]=this,this.data.settings.initialize.call(this),a.uid+=1,this._changeListener||(t.addEventListener("change",this),this._changeListener=!0),!f||this.data.settings.mobile){if(t.parentNode.insertBefore(this.data.elem,t),t.setAttribute("data-dkCacheId",this.data.cacheID),this.data.elem.addEventListener("click",this),this.data.elem.addEventListener("keydown",this),this.data.elem.addEventListener("keypress",this),this.form&&this.form.addEventListener("reset",this),!this.multiple)for(s=0;s<this.options.length;s++)this.options[s].addEventListener("mouseover",this);b||(document.addEventListener("click",e.onDocClick),p&&parent.document.addEventListener("click",e.onDocClick),b=!0)}return this}},{key:"add",value:function(e,t){var i,s,a;"string"==typeof e&&(i=e,e=document.createElement("option"),e.text=i),"OPTION"===e.nodeName&&(s=d.default.create("li",{class:"dk-option","data-value":e.value,text:e.text,innerHTML:e.innerHTML,role:"option","aria-selected":"false",id:"dk"+this.data.cacheID+"-"+(e.id||e.value.replace(" ","-"))}),d.default.addClass(s,e.className),this.length+=1,e.disabled&&(d.default.addClass(s,"dk-option-disabled"),s.setAttribute("aria-disabled","true")),e.hidden&&(d.default.addClass(s,"dk-option-hidden"),s.setAttribute("aria-hidden","true")),this.data.select.add(e,t),"number"==typeof t&&(t=this.item(t)),a=this.options.indexOf(t),a>-1?(t.parentNode.insertBefore(s,t),this.options.splice(a,0,s)):(this.data.elem.lastChild.appendChild(s),this.options.push(s)),s.addEventListener("mouseover",this),e.selected&&this.select(a))}},{key:"item",value:function(e){return e=e<0?this.options.length+e:e,this.options[e]||null}},{key:"remove",value:function(e){var t=this.item(e);t.parentNode.removeChild(t),this.options.splice(e,1),this.data.select.remove(e),this.select(this.data.select.selectedIndex),this.length-=1}},{key:"close",value:function(){var e,t=this.data.elem;if(!this.isOpen||this.multiple)return!1;for(e=0;e<this.options.length;e++)d.default.removeClass(this.options[e],"dk-option-highlight");t.lastChild.setAttribute("aria-expanded","false"),d.default.removeClass(t.lastChild,"dk-select-options-highlight"),d.default.removeClass(t,"dk-select-open-(up|down)"),this.isOpen=!1,this.data.settings.close.call(this)}},{key:"open",value:function(){var e=void 0,t=void 0,i=void 0,s=void 0,a=void 0,n=void 0,l=this.data.elem,o=l.lastChild,r=void 0!==window.pageXOffset,c="CSS1Compat"===(document.compatMode||""),h=r?window.pageYOffset:c?document.documentElement.scrollTop:document.body.scrollTop;if(a=d.default.offset(l).top-h,n=window.innerHeight-(a+l.offsetHeight),this.isOpen||this.multiple)return!1;o.style.display="block",e=o.offsetHeight,o.style.display="",t=a>e,i=n>e,s=t&&!i?"-up":"-down",this.isOpen=!0,d.default.addClass(l,"dk-select-open"+s),o.setAttribute("aria-expanded","true"),this._scrollTo(this.options.length-1),this._scrollTo(this.selectedIndex),this.data.settings.open.call(this)}},{key:"disable",value:function(e,t){var i="dk-option-disabled";0!==arguments.length&&"boolean"!=typeof e||(t=void 0===e,e=this.data.elem,i="dk-select-disabled",this.disabled=t),void 0===t&&(t=!0),"number"==typeof e&&(e=this.item(e)),t?(e.setAttribute("aria-disabled",!0),d.default.addClass(e,i)):(e.setAttribute("aria-disabled",!1),d.default.removeClass(e,i))}},{key:"hide",value:function(e,t){void 0===t&&(t=!0),e=this.item(e),t?(e.setAttribute("aria-hidden",!0),d.default.addClass(e,"dk-option-hidden")):(e.setAttribute("aria-hidden",!1),d.default.removeClass(e,"dk-option-hidden"))}},{key:"select",value:function(e,t){var i,s,a,n,l=this.data.select;if("number"==typeof e&&(e=this.item(e)),"string"==typeof e)for(i=0;i<this.length;i++)this.options[i].getAttribute("data-value")===e&&(e=this.options[i]);return!(!e||"string"==typeof e||!t&&d.default.hasClass(e,"dk-option-disabled"))&&(d.default.hasClass(e,"dk-option")?(s=this.options.indexOf(e),a=l.options[s],this.multiple?(d.default.toggleClass(e,"dk-option-selected"),a.selected=!a.selected,d.default.hasClass(e,"dk-option-selected")?(e.setAttribute("aria-selected","true"),this.selectedOptions.push(e)):(e.setAttribute("aria-selected","false"),s=this.selectedOptions.indexOf(e),this.selectedOptions.splice(s,1))):(n=this.data.elem.firstChild,this.selectedOptions.length&&(d.default.removeClass(this.selectedOptions[0],"dk-option-selected"),this.selectedOptions[0].setAttribute("aria-selected","false")),d.default.addClass(e,"dk-option-selected"),e.setAttribute("aria-selected","true"),n.setAttribute("aria-activedescendant",e.id),n.className="dk-selected "+a.className,n.innerHTML=a.innerHTML,this.selectedOptions[0]=e,a.selected=!0),this.selectedIndex=l.selectedIndex,this.value=l.value,t||this.data.select.dispatchEvent(new u.default("change",{bubbles:this.data.settings.bubble})),e):void 0)}},{key:"selectOne",value:function(e,t){return this.reset(!0),this._scrollTo(e),this.select(e,t)}},{key:"search",value:function(e,t){var i,s,a,n,l,o,d,r,c=this.data.select.options,h=[];if(!e)return this.options;for(t=t?t.toLowerCase():"strict",t="fuzzy"===t?2:"partial"===t?1:0,r=new RegExp((t?"":"^")+e,"i"),i=0;i<c.length;i++)if(a=c[i].text.toLowerCase(),2==t){for(s=e.toLowerCase().split(""),n=l=o=d=0;l<a.length;)a[l]===s[n]?(o+=1+o,n++):o=0,d+=o,l++;n===s.length&&h.push({e:this.options[i],s:d,i:i})}else r.test(a)&&h.push(this.options[i]);return 2===t&&(h=h.sort(function(e,t){return t.s-e.s||e.i-t.i}).reduce(function(e,t){return e[e.length]=t.e,e},[])),h}},{key:"focus",value:function(){this.disabled||(this.multiple?this.data.elem:this.data.elem.children[0]).focus()}},{key:"reset",value:function(e){var t,i=this.data.select;for(this.selectedOptions.length=0,t=0;t<i.options.length;t++)i.options[t].selected=!1,d.default.removeClass(this.options[t],"dk-option-selected"),this.options[t].setAttribute("aria-selected","false"),!e&&i.options[t].defaultSelected&&this.select(t,!0);this.selectedOptions.length||this.multiple||this.select(0,!0)}},{key:"refresh",value:function(){Object.keys(this).length>0&&(!f||this.data.settings.mobile)&&this.dispose().init(this.data.select,this.data.settings)}},{key:"dispose",value:function(){var e=window.Dropkick;return Object.keys(this).length>0&&(!f||this.data.settings.mobile)&&(delete e.cache[this.data.cacheID],this.data.elem.parentNode.removeChild(this.data.elem),this.data.select.removeAttribute("data-dkCacheId")),this}},{key:"handleEvent",value:function(e){if(!this.disabled)switch(e.type){case"click":this._delegate(e);break;case"keydown":this._keyHandler(e);break;case"keypress":this._searchOptions(e);break;case"mouseover":this._highlight(e);break;case"reset":this.reset();break;case"change":this.data.settings.change.call(this)}}},{key:"_delegate",value:function(e){var t,i,s,a,n=e.target;if(d.default.hasClass(n,"dk-option-disabled"))return!1;if(this.multiple){if(d.default.hasClass(n,"dk-option"))if(t=window.getSelection(),"Range"===t.type&&t.collapseToStart(),e.shiftKey)if(s=this.options.indexOf(this.selectedOptions[0]),a=this.options.indexOf(this.selectedOptions[this.selectedOptions.length-1]),i=this.options.indexOf(n),i>s&&i<a&&(i=s),i>a&&a>s&&(a=s),this.reset(!0),a>i)for(;i<a+1;)this.select(i++);else for(;i>a-1;)this.select(i--);else e.ctrlKey||e.metaKey?this.select(n):(this.reset(!0),this.select(n))}else this[this.isOpen?"close":"open"](),d.default.hasClass(n,"dk-option")&&this.select(n)}},{key:"_highlight",value:function(e){var t,i=e.target;if(!this.multiple){for(t=0;t<this.options.length;t++)d.default.removeClass(this.options[t],"dk-option-highlight");d.default.addClass(this.data.elem.lastChild,"dk-select-options-highlight"),d.default.addClass(i,"dk-option-highlight")}}},{key:"_keyHandler",value:function(e){var t,i,s=this.selectedOptions,a=this.options,n=1,l={tab:9,enter:13,esc:27,space:32,up:38,down:40};switch(e.keyCode){case l.up:n=-1;case l.down:if(e.preventDefault(),t=s[s.length-1],d.default.hasClass(this.data.elem.lastChild,"dk-select-options-highlight"))for(d.default.removeClass(this.data.elem.lastChild,"dk-select-options-highlight"),i=0;i<a.length;i++)d.default.hasClass(a[i],"dk-option-highlight")&&(d.default.removeClass(a[i],"dk-option-highlight"),t=a[i]);n=a.indexOf(t)+n,n>a.length-1?n=a.length-1:n<0&&(n=0),this.data.select.options[n].disabled||(this.reset(!0),this.select(n),this._scrollTo(n));break;case l.space:if(!this.isOpen){e.preventDefault(),this.open();break}case l.tab:case l.enter:for(n=0;n<a.length;n++)d.default.hasClass(a[n],"dk-option-highlight")&&this.select(n);case l.esc:this.isOpen&&(e.preventDefault(),this.close())}}},{key:"_searchOptions",value:function(e){var t,i=this,s=String.fromCharCode(e.keyCode||e.which);void 0===this.data.searchString&&(this.data.searchString=""),function(){i.data.searchTimeout&&clearTimeout(i.data.searchTimeout),i.data.searchTimeout=setTimeout(function(){i.data.searchString=""},1e3)}(),this.data.searchString+=s,t=this.search(this.data.searchString,this.data.settings.search),t.length&&(d.default.hasClass(t[0],"dk-option-disabled")||this.selectOne(t[0]))}},{key:"_scrollTo",value:function(e){var t,i,s,a=this.data.elem.lastChild;if(-1===e||"number"!=typeof e&&!e||!this.isOpen&&!this.multiple)return!1;"number"==typeof e&&(e=this.item(e)),t=d.default.position(e,a).top,i=t-a.scrollTop,s=i+e.offsetHeight,s>a.offsetHeight?(t+=e.offsetHeight,a.scrollTop=t-a.offsetHeight):i<0&&(a.scrollTop=t)}}]),e}();window.Dropkick=m,window.Dropkick.cache={},window.Dropkick.uid=0,m.build=function(e,t){var i,s,a,n=[],l={elem:null,options:[],selected:[]},o=function e(i){var s,a,n,o,r=[];switch(i.nodeName){case"OPTION":s=d.default.create("li",{class:"dk-option ","data-value":i.value,text:i.text,innerHTML:i.innerHTML,role:"option","aria-selected":"false",id:t+"-"+(i.id||i.value.replace(" ","-"))}),d.default.addClass(s,i.className),i.disabled&&(d.default.addClass(s,"dk-option-disabled"),s.setAttribute("aria-disabled","true")),i.hidden&&(d.default.addClass(s,"dk-option-hidden"),s.setAttribute("aria-hidden","true")),i.selected&&(d.default.addClass(s,"dk-option-selected"),s.setAttribute("aria-selected","true"),l.selected.push(s)),l.options.push(this.appendChild(s));break;case"OPTGROUP":for(a=d.default.create("li",{class:"dk-optgroup"}),i.label&&a.appendChild(d.default.create("div",{class:"dk-optgroup-label",innerHTML:i.label})),n=d.default.create("ul",{class:"dk-optgroup-options"}),o=i.children.length;o--;r.unshift(i.children[o]));i.disabled&&(a.classList.add("dk-optgroup-disabled"),r.forEach(function(e){e.disabled=i.disabled})),r.forEach(e,n),this.appendChild(a).appendChild(n)}};for(l.elem=d.default.create("div",{class:"dk-select"+(e.multiple?"-multi":"")}),s=d.default.create("ul",{class:"dk-select-options",id:t+"-listbox",role:"listbox"}),e.disabled&&(d.default.addClass(l.elem,"dk-select-disabled"),l.elem.setAttribute("aria-disabled",!0)),l.elem.id=t+(e.id?"-"+e.id:""),d.default.addClass(l.elem,e.className),e.multiple?(l.elem.setAttribute("tabindex",e.getAttribute("tabindex")||"0"),s.setAttribute("aria-multiselectable","true")):(i=e.options[e.selectedIndex],l.elem.appendChild(d.default.create("div",{class:"dk-selected "+(i?i.className:""),tabindex:e.tabindex||0,innerHTML:i?i.text:"&nbsp;",id:t+"-combobox","aria-live":"assertive","aria-owns":s.id,role:"combobox"})),s.setAttribute("aria-expanded","false")),a=e.children.length;a--;n.unshift(e.children[a]));return n.forEach(o,l.elem.appendChild(s)),l},m.onDocClick=function(e){var t,i,s=window.Dropkick;if(1!==e.target.nodeType)return!1;null!==(t=e.target.getAttribute("data-dkcacheid"))&&s.cache[t].focus();for(i in s.cache)d.default.closest(e.target,s.cache[i].data.elem)||i===t||s.cache[i].disabled||s.cache[i].close()},void 0!==window.jQuery&&(window.jQuery.fn.dropkick=function(){var e=Array.prototype.slice.call(arguments);return jQuery(this).each(function(){e[0]&&"object"!==n(e[0])?"string"==typeof e[0]&&m.prototype[e[0]].apply(new m(this),e.slice(1)):new m(this,e[0]||{})})}),t.default=m},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=-1!==navigator.appVersion.indexOf("MSIE"),a={hasClass:function(e,t){var i=new RegExp("(^|\\s+)"+t+"(\\s+|$)");return e&&i.test(e.className)},addClass:function(e,t){e&&!this.hasClass(e,t)&&(e.className+=" "+t)},removeClass:function(e,t){var i=new RegExp("(^|\\s+)"+t+"(\\s+|$)");e&&(e.className=e.className.replace(i," "))},toggleClass:function(e,t){[(this.hasClass(e,t)?"remove":"add")+"Class"](e,t)},extend:function(e){return Array.prototype.slice.call(arguments,1).forEach(function(t){if(t)for(var i in t)e[i]=t[i]}),e},offset:function(e){var t=e.getBoundingClientRect()||{top:0,left:0},i=document.documentElement,a=s?i.scrollTop:window.pageYOffset,n=s?i.scrollLeft:window.pageXOffset;return{top:t.top+a-i.clientTop,left:t.left+n-i.clientLeft}},position:function(e,t){for(var i={top:0,left:0};e&&e!==t;)i.top+=e.offsetTop,i.left+=e.offsetLeft,e=e.parentNode;return i},closest:function(e,t){for(;e;){if(e===t)return e;e=e.parentNode}return!1},create:function(e,t){var i=void 0,s=document.createElement(e);t||(t={});for(i in t)t.hasOwnProperty(i)&&("innerHTML"===i?s.innerHTML=t[i]:s.setAttribute(i,t[i]));return s},deferred:function(e){return function(){var t=this,i=arguments;window.setTimeout(function(){e.apply(t,i)},1)}}};t.default=a},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s={initialize:function(){},mobile:!0,change:function(){},open:function(){},close:function(){},search:"strict",bubble:!0};t.default=s},function(e,t,i){(function(t){var i=t.CustomEvent;e.exports=function(){try{var e=new i("cat",{detail:{foo:"bar"}});return"cat"===e.type&&"bar"===e.detail.foo}catch(e){}return!1}()?i:"undefined"!=typeof document&&"function"==typeof document.createEvent?function(e,t){var i=document.createEvent("CustomEvent");return t?i.initCustomEvent(e,t.bubbles,t.cancelable,t.detail):i.initCustomEvent(e,!1,!1,void 0),i}:function(e,t){var i=document.createEventObject();return i.type=e,t?(i.bubbles=Boolean(t.bubbles),i.cancelable=Boolean(t.cancelable),i.detail=t.detail):(i.bubbles=!1,i.cancelable=!1,i.detail=void 0),i}}).call(t,i(4))},function(e,t){var i;i=function(){return this}();try{i=i||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(i=window)}e.exports=i}])});
},{}],2:[function(_dereq_,module,exports){

module.exports = {
    "init": "fontsampler.events.init",
    "skinInit": "fontsampler.events.skininit",
    "languageChanged": "fontsampler.events.languagechanged",
    "fontChanged": "fontsampler.events.fontchanged",
    "fontLoaded": "fontsampler.events.fontloaded",
    "fontRendered": "fontsampler.events.fontrendered",
    "fontsPreloaded": "fontsampler.events.fontspreloaded",
    "valueChanged": "fontsampler.events.valuechanged",
    "opentypeChanged": "fontsampler.events.opentypechanged",
    "focused": "fontsampler.events.focused",
    "blurred": "fontsampler.events.blurred",
}

},{}],3:[function(_dereq_,module,exports){
/**
 * DOM related helpers
 */

function pruneClass(className, classNames) {
    if (!classNames) {
        return ""
    }

    classNames = classNames.trim()

    if (!className) {
        return classNames
    }

    className = className.trim()

    var classes = classNames.split(" "),
        classIndex = classes.indexOf(className)

    if (classIndex !== -1) {
        classes.splice(classIndex, 1)
    }

    if (classes.length > 0) {
        return classes.join(" ")
    } else {
        return ""
    }
}

/**
 * 
 * @param str className 
 * @param str classNames - space separated
 */
function addClass(className, classNames) {
    if (!classNames) {
        classNames = ""
    }

    if (className === classNames) {
        return classNames
    }

    classNames = classNames.trim()

    if (!className) {
        return classNames
    }

    className = className.trim()

    var classes = classNames.split(" "),
        classIndex = classes.indexOf(className)

    if (classIndex === -1) {
        if (classNames) {
            return classNames + " " + className
        } else {
            return className
        }
    } else {
        return classNames
    }
}

function nodeAddClass(node, className) {
    if (!isNode(node) || typeof(className) !== "string") {
        return false
    }

    node.className = addClass(className, node.className)

    return true
}

function nodeAddClasses(node, classes) {
    if (!isNode(node) || !Array.isArray(classes) || classes.length < 1) {
        return false
    }

    for (var c = 0; c < classes.length; c++) {
        node.className = addClass(classes[c], node.className)
    }

    return true
}

function nodeRemoveClass(node, className) {
    if (!isNode(node) || typeof(className) !== "string") {
        return false
    }

    node.className = pruneClass(className, node.className)

    return true
}

/**
 * Really just an approximation of a check
 * 
 * @param {*} node 
 */
function isNode(node) {
    return typeof(node) === "object" && node !== null && "nodeType" in node
}

module.exports = {
    nodeAddClass: nodeAddClass,
    nodeAddClasses: nodeAddClasses,
    nodeRemoveClass: nodeRemoveClass,
    isNode: isNode
}
},{}],4:[function(_dereq_,module,exports){
/**
 * Non-app specific JS helpers
 */

/**
 * Number clamp to min—max with fallback for when any input value is not a number
 * @param {*} value 
 * @param {*} min 
 * @param {*} max 
 * @param {*} fallback 
 */
function clamp(value, min, max, fallback) {
    value = parseFloat(value)
    min = parseFloat(min)
    max = parseFloat(max)

    if (isNaN(value) || isNaN(min) || isNaN(max)) {
        if (typeof (fallback) !== "undefined") {
            value = fallback
        } else {
            return value
        }
    }

    return Math.min(max, Math.max(value, min))
}

/**
 * flatten an array recursively from https://stackoverflow.com/a/42916843/999162
 * @method flattenDeep
 * @param array {Array}
 * @return {Array} flatten array
 */
function flattenDeep(array) {
    try {
        return array.reduce(function (acc, current) {
            return Array.isArray(current) ? acc.concat(flattenDeep(current)) : acc.concat([current]);
        }, []);
    } catch (e) {
        console.error(e)
        return []
    }
}

function arrayUnique(a) {
    if (!Array.isArray(a)) {
        return false
    }
    return a.filter(function (value, index, self) {
        return self.indexOf(value) === index
    }, a)
}


/**
 * Via https://stackoverflow.com/a/17369384/999162
 * 
 * @param {*} value 
 * @returns 
 */
function countDecimals(value) {
    try {
        if ((value % 1) != 0) {
            return value.toString().split(".")[1].length;
        }
    } catch (e) {
        return 0
    }
    return 0;
};

module.exports = {
    flattenDeep: flattenDeep,
    arrayUnique: arrayUnique,
    clamp: clamp,
    countDecimals: countDecimals
}
},{}],5:[function(_dereq_,module,exports){
const Dropkick = _dereq_("../node_modules/dropkickjs/dist/dropkick").default
const events = _dereq_("./constants/events")
const dom = _dereq_("./helpers/dom")
const utils = _dereq_("./helpers/utils")

function Skin(FS) {

    FS.root.addEventListener(events.init, init)

    function init() {
        console.debug("Skin.init()", FS)

        if (FS.initialized === true) {
            console.error(FS.root)
            throw new Error("FontsamplerSkin: Cannot apply skin to a Fontsampler that is already initialized.")
        }

        dom.nodeAddClass(FS.root, "fsjs-skin")


        const rangeInputs = FS.root.querySelectorAll("input[type=range][data-fsjs-ui='slider']")
        if (rangeInputs.length) {
            rangeInputs.forEach(slider => {
                let mouseDown = false;

                function updateSlider (e) {
                    if (!mouseDown) {
                        return
                    }
        
                    const w = slider.getBoundingClientRect().width,
                        x = Math.max(0, Math.min(w, e.layerX)),
                        percent = x / w,
                        min = parseFloat(slider.min) || 1, // _some_ defaults
                        max = parseFloat(slider.max) || 1000, // _some_ defaults
                        step = parseFloat(slider.step) || 1, // _some_ defaults
                        step_decimals = utils.countDecimals(slider.step),
                        range = min < max ? max - min : min - max;
        
                    let key = slider.dataset.fsjs,
                        value;
        
                    value = Math.round((min + (percent * range)) / step) * step;
                    
                    if (step_decimals > 0) {
                        value = value.toPrecision(step_decimals)
                    }
        
                    if (typeof (key) === "undefined") {
                        // Set variable axis slider
                        let key = slider.dataset.axis;
                        opt[key] = value
                        FS.setValue("variation", opt)
                    } else {
                        // Set regular slider (leading, letter spacing, ...)
                        FS.setValue(key, value)
                    }
                }

                slider.addEventListener("mousedown", function (e) {
                    mouseDown = true
                    updateSlider(e)
                })

                slider.addEventListener("mouseup", function () {
                    mouseDown = false
                })

                slider.addEventListener("mousemove", updateSlider)
            })
        }

        const selectInputs = FS.root.querySelectorAll("select[data-fsjs-ui='dropdown']")
        let dropdowns = []
        if (selectInputs.length) {
            for (let i = 0; i < selectInputs.length; i++) {
                let dropdown = new Dropkick(selectInputs[i], {
                    mobile: true
                })
                dropdowns.push(dropdown)

                // listen for and trigger updates on native change event on select
                selectInputs[i].dataset.i = i
                selectInputs[i].addEventListener("change", function () {
                    dropdowns[this.dataset.i].refresh()
                })
            }
        }

        // Provide a hook for when the UI has finished setting up
        FS.root.dispatchEvent(new CustomEvent(events.skinInit, {
            detail: {
                fontsampler: FS
            }
        }))
    }
}

module.exports = Skin
},{"../node_modules/dropkickjs/dist/dropkick":1,"./constants/events":2,"./helpers/dom":3,"./helpers/utils":4}]},{},[5])(5)
});
