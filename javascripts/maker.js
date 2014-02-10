make={},make.debounce=function(a,b){function c(c){return function(){var d=arguments;window.clearTimeout(i),i=setTimeout(function(){c.apply(a,d)},b.distance)}}if("object"!=typeof a&&"function"!=typeof a)return console.error('throttle:throttle maker requires a function, or an object as target(the first argument). All the methods will be treated as throttles. The second argument(options) accepts "methods" as an array with the names of methods you want to become throttle.');void 0===b&&(b={}),b.distance=b.distance||200;var d=b.methods;"object"==typeof a&&d&&(d=d.length&&"object"==typeof d?d:[d]);var e=d||Object.keys(a),f=null,g=0,h=e.length,i=(b.distance,null);if("object"!=typeof a)return c(a);for(;h>g;g++)"function"==typeof a[e[g]]&&(f=e[g],a[f]=c(a[f]));return a},function(){make.setAndGetable=function(a,b){b=b||{},b.specificOnly=b.specificOnly||!1,b.setter=b.setter||!0,b.getter=b.getter||!0,b.filterIn=b.filterIn||!1,b.filterOut=b.filterOut||!1,b.protected=b.protected||!0;var c=null;for(c in a)a.hasOwnProperty(c)&&!function(a,c){var d=a[c],e=c[0].toUpperCase()+c.substring(1);a["set"+e]=function(e){var f=null;return b.filterIn?(f=b.filterIn(c,e),void 0!==f&&(d=f)):d=e,a},a["get"+e]=function(){return b.filterOut?b.filterOut(c,d):d},b.protected&&Object.defineProperty(a,c,{enumerable:!1,configurable:!1,set:function(a){return this["set"+e](a),this},get:function(){return this["get"+e]()}})}(a,c);!b.setter||a.set||b.specificOnly||(a.set=function(b,c){return a["set"+(b[0].toUpperCase()+b.substring(1))](c)}),!b.getter||a.get||b.specificOnly||(a.get=function(b){return a["get"+(b[0].toUpperCase()+b.substring(1))]()})},make.settable=function(a){return make.setAndGetable(a,{getter:!1})},make.gettable=function(a){return make.setAndGetable(a,{setter:!1})}}(),make.indexable=function(a){function b(){var a=this,b=function(a,b){return b=b||"",b="object"==typeof a&&a.length?"["+b+"]":"."+b};this.find=function(c,d,e,f){if(void 0===c)return console.error("indexable:Method find expected one argument.");e=e||[],d=d||a,f=f||{};var g=null,h=!1,i=function(a,b,c){var d=null,e=c;f.regEx?c instanceof RegExp||(c=new RegExp(c,"i")):c=new RegExp(c,""),d=f.lookingForKey?b:a[b],d=d.valueOf()||"";try{if(d.match&&d.match(c)||d==e)return!0}catch(g){console.warn("compare","A problem occurred when trying to compare values. Possible error with a regExp, perhaps?",g)}return!1};for(g in d)if(d.hasOwnProperty(g)){if(i(d,g,c)){e.push(b(d,g)),h=!0;break}if(d[g]&&"object"==typeof d[g]){if(e.push(b(d,g)),h=a.find(c,d[g],e,f))return h;e.pop()}}return h&&e&&e.length?e.join("").replace(".",""):!1},this.locate=function(a){return this.find(a,!1,!1,{lookingForKey:!0})},this.findLike=function(a){return this.find(a,!1,!1,{regEx:!0})},this.locateLike=function(a){return this.find(a,!1,!1,{lookingForKey:!0,regEx:!0})},this.getAt=function(a){for(var b=a.replace(/\[/g,".").replace(/\]/g,"").split("."),c=b.length,d=this,e=0;c>e;e++){if(void 0===d[b[e]])return void 0;d=d[b[e]]}return d}}return a&&"object"==typeof a?void b.apply(a):console.error("indexable:Method makeIndexable expects first argument to be an Object")},make.readonly=function(a,b){if("object"!=typeof a)return console.error('throttle:throttle maker requires an object as target(the first argument). All the methods will be treated as throttles. The second argument(options) accepts "methods" as an array with the names of methods you want to become throttle.');void 0===b&&(b={});for(prop in a)a.hasOwnProperty(prop)&&Object.defineProperty(a,prop,{enumerable:!0,configurable:!1,writable:!1,value:a[prop]});return a},make.throttle=function(a,b){function c(b){return function(){return j.getTime()+i<=(new Date).getTime()?(j=new Date,b.apply(a,arguments)):void 0}}if("object"!=typeof a&&"function"!=typeof a)return console.error('throttle:throttle maker requires a function or an object as target(the first argument). All the methods will be treated as throttles. The second argument(options) accepts "methods" as an array with the names of methods you want to become throttle.');void 0===b&&(b={}),b.distance=b.distance||100;var d=b.methods;d&&(d=d.length&&"object"==typeof d?d:[d]);var e=d||Object.keys(a),f=null,g=0,h=e.length,i=b.distance,j=new Date((new Date).getTime()-i);if("object"!=typeof a)return c(a);for(;h>g;g++)"function"==typeof a[e[g]]&&(f=e[g],a[f]=c(a[f]));return a},make.worker=function(a,b){function c(a){function b(b){var c=new Blob([b]),d=new Worker(window.URL.createObjectURL(c));return d.onmessage=function(b){a.workerFinished(b.data),window.URL.revokeObjectURL(c)},d}var c=a.toString();return c=" self.onmessage = function(e) { \n self.postMessage(("+c,c+=").apply(self, e.data))};\n ",c.match(/document|window|body/)?(console.warn("worker:Function passed to make.worker tries to access DOM elements. The function will work, but will not be a worker"),c):function(){var d=Array.prototype.slice.call(arguments,0);"function"==typeof d[d.length-1]&&(a.workerFinished=d.pop());var e=b(c);e.postMessage(d)}}if("object"!=typeof a&&"function"!=typeof a)return console.error('worker:Worker maker requires a function or an object as target(the first argument). All the methods will be treated as workers, but you can pass in the second argument(options), the property "methods" with an array with the names of methods you want, only they will become workers.');b=b||{};var d=b.methods;d&&(d=d.length&&"object"==typeof d?d:[d]);var e=d||Object.keys(a),f=null,g=0,h=e.length;if("object"!=typeof a)return c(a);for(;h>g;g++)"function"==typeof a[e[g]]&&(f=e[g],a[f]=c(a[f]));return a};