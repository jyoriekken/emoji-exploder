parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"2u/B":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function i(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var n=function(){function t(){e(this,t),this.inBrowser=!!window,this.x=window.innerWidth/2,this.y=window.innerHeight/2,this.defaultEmoji="🔥",this.emojiLifespan=2e3,this.renderSpeed=1e3/15,this.addEvents()}return i(t,[{key:"addEvents",value:function(){this.inBrowser&&window.addEventListener("pointermove",this.onPointerMove.bind(this))}},{key:"onPointerMove",value:function(e){this.x=e.pageX,this.y=e.pageY}},{key:"explode",value:function(){if(this.inBrowser){var e=document.createElement("div");e.style="position: absolute; left: ".concat(this.x,"px; top: ").concat(this.y,"px; opacity: 1"),e.textContent=this.pickEmoji(),e.dataset.drift=4*(-.5+Math.random());var t=document.body.appendChild(e);this.animateEmoji(t),setTimeout(this.expireEmoji.bind(this,t),this.emojiLifespan)}}},{key:"animateEmoji",value:function(e){e&&setInterval(function(){e.style.top="".concat(parseInt(e.style.top)+5,"px"),e.style.left="".concat(parseInt(e.style.left)+parseInt(e.dataset.drift),"px"),e.style.opacity="".concat(.98*e.style.opacity)},this.renderSpeed)}},{key:"expireEmoji",value:function(e){document.body.removeChild(e)}},{key:"pickEmoji",value:function(){return this.defaultEmoji}}]),t}(),o=n;exports.default=o;
},{}]},{},["2u/B"], null)
//# sourceMappingURL=/index.js.map