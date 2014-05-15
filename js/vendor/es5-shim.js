/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2014 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */
(function(t,r){if(typeof define==="function"&&define.amd){define(r)}else if(typeof exports==="object"){module.exports=r()}else{t.returnExports=r()}})(this,function(){var t=Function.prototype.call;var r=Array.prototype;var e=Object.prototype;var n=r.slice;var i=Array.prototype.splice;var o=Array.prototype.push;var a=Array.prototype.unshift;var l=function(t){return e.toString.call(t)==="[object Function]"};var u=function(t){return e.toString.call(t)==="[object RegExp]"};function p(){}if(!Function.prototype.bind){Function.prototype.bind=function H(t){var r=this;if(!l(r)){throw new TypeError("Function.prototype.bind called on incompatible "+r)}var e=n.call(arguments,1);var i=function(){if(this instanceof s){var i=r.apply(this,e.concat(n.call(arguments)));if(Object(i)===i){return i}return this}else{return r.apply(t,e.concat(n.call(arguments)))}};var o=Math.max(0,r.length-e.length);var a=[];for(var u=0;u<o;u++){a.push("$"+u)}var s=Function("binder","return function("+a.join(",")+"){return binder.apply(this,arguments)}")(i);if(r.prototype){p.prototype=r.prototype;s.prototype=new p;p.prototype=null}return s}}var s=t.bind(e.hasOwnProperty);var f=t.bind(e.toString);var c;var h;var y;var g;var v;if(v=s(e,"__defineGetter__")){c=t.bind(e.__defineGetter__);h=t.bind(e.__defineSetter__);y=t.bind(e.__lookupGetter__);g=t.bind(e.__lookupSetter__)}if([1,2].splice(0).length!==2){if(function(){function t(t){var r=[];while(t--){r.unshift(t)}return r}var r=[];var e;r.splice.bind(r,0,0).apply(null,t(20));r.splice.bind(r,0,0).apply(null,t(26));e=r.length;r.splice(5,0,"XXX");if(e+1===r.length){return true}}()){Array.prototype.splice=function(t,r){if(!arguments.length){return[]}else{return i.apply(this,[t===void 0?0:t,r===void 0?this.length-t:r].concat(n.call(arguments,2)))}}}else{Array.prototype.splice=function(t,r){var e;var l=n.call(arguments,2);var u=l.length;if(!arguments.length){return[]}if(t===void 0){t=0}if(r===void 0){r=this.length-t}if(u>0){if(r<=0){if(t===this.length){o.apply(this,l);return[]}if(t===0){a.apply(this,l);return[]}}e=n.call(this,t,t+r);l.push.apply(l,n.call(this,t+r,this.length));l.unshift.apply(l,n.call(this,0,t));l.unshift(0,this.length);i.apply(this,l);return e}return i.call(this,t,r)}}}if([].unshift(0)!==1){Array.prototype.unshift=function(){a.apply(this,arguments);return this.length}}if(!Array.isArray){Array.isArray=function L(t){return f(t)==="[object Array]"}}var d=Object("a");var b=d[0]!=="a"||!(0 in d);var m=function Y(t){var r=true;if(t){t.call("foo",function(t,e,n){if(typeof n!=="object"){r=false}})}return!!t&&r};if(!Array.prototype.forEach||!m(Array.prototype.forEach)){Array.prototype.forEach=function q(t){var r=B(this),e=b&&f(this)==="[object String]"?this.split(""):r,n=arguments[1],i=-1,o=e.length>>>0;if(!l(t)){throw new TypeError}while(++i<o){if(i in e){t.call(n,e[i],i,r)}}}}if(!Array.prototype.map||!m(Array.prototype.map)){Array.prototype.map=function z(t){var r=B(this),e=b&&f(this)==="[object String]"?this.split(""):r,n=e.length>>>0,i=Array(n),o=arguments[1];if(!l(t)){throw new TypeError(t+" is not a function")}for(var a=0;a<n;a++){if(a in e)i[a]=t.call(o,e[a],a,r)}return i}}if(!Array.prototype.filter||!m(Array.prototype.filter)){Array.prototype.filter=function K(t){var r=B(this),e=b&&f(this)==="[object String]"?this.split(""):r,n=e.length>>>0,i=[],o,a=arguments[1];if(!l(t)){throw new TypeError(t+" is not a function")}for(var u=0;u<n;u++){if(u in e){o=e[u];if(t.call(a,o,u,r)){i.push(o)}}}return i}}if(!Array.prototype.every||!m(Array.prototype.every)){Array.prototype.every=function Q(t){var r=B(this),e=b&&f(this)==="[object String]"?this.split(""):r,n=e.length>>>0,i=arguments[1];if(!l(t)){throw new TypeError(t+" is not a function")}for(var o=0;o<n;o++){if(o in e&&!t.call(i,e[o],o,r)){return false}}return true}}if(!Array.prototype.some||!m(Array.prototype.some)){Array.prototype.some=function V(t){var r=B(this),e=b&&f(this)==="[object String]"?this.split(""):r,n=e.length>>>0,i=arguments[1];if(!l(t)){throw new TypeError(t+" is not a function")}for(var o=0;o<n;o++){if(o in e&&t.call(i,e[o],o,r)){return true}}return false}}var w=false;if(Array.prototype.reduce){w=typeof Array.prototype.reduce.call("a",function(t,r,e,n){return n})==="object"}if(!Array.prototype.reduce||!w){Array.prototype.reduce=function W(t){var r=B(this),e=b&&f(this)==="[object String]"?this.split(""):r,n=e.length>>>0;if(!l(t)){throw new TypeError(t+" is not a function")}if(!n&&arguments.length===1){throw new TypeError("reduce of empty array with no initial value")}var i=0;var o;if(arguments.length>=2){o=arguments[1]}else{do{if(i in e){o=e[i++];break}if(++i>=n){throw new TypeError("reduce of empty array with no initial value")}}while(true)}for(;i<n;i++){if(i in e){o=t.call(void 0,o,e[i],i,r)}}return o}}if(!Array.prototype.reduceRight){Array.prototype.reduceRight=function tr(t){var r=B(this),e=b&&f(this)==="[object String]"?this.split(""):r,n=e.length>>>0;if(!l(t)){throw new TypeError(t+" is not a function")}if(!n&&arguments.length===1){throw new TypeError("reduceRight of empty array with no initial value")}var i,o=n-1;if(arguments.length>=2){i=arguments[1]}else{do{if(o in e){i=e[o--];break}if(--o<0){throw new TypeError("reduceRight of empty array with no initial value")}}while(true)}if(o<0){return i}do{if(o in this){i=t.call(void 0,i,e[o],o,r)}}while(o--);return i}}if(!Array.prototype.indexOf||[0,1].indexOf(1,2)!==-1){Array.prototype.indexOf=function rr(t){var r=b&&f(this)==="[object String]"?this.split(""):B(this),e=r.length>>>0;if(!e){return-1}var n=0;if(arguments.length>1){n=$(arguments[1])}n=n>=0?n:Math.max(0,e+n);for(;n<e;n++){if(n in r&&r[n]===t){return n}}return-1}}if(!Array.prototype.lastIndexOf||[0,1].lastIndexOf(0,-3)!==-1){Array.prototype.lastIndexOf=function er(t){var r=b&&f(this)==="[object String]"?this.split(""):B(this),e=r.length>>>0;if(!e){return-1}var n=e-1;if(arguments.length>1){n=Math.min(n,$(arguments[1]))}n=n>=0?n:e-Math.abs(n);for(;n>=0;n--){if(n in r&&t===r[n]){return n}}return-1}}if(!Object.keys){var S=!{toString:null}.propertyIsEnumerable("toString"),x=function(){}.propertyIsEnumerable("prototype"),A=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],j=A.length,O=function nr(t){var r=f(t);var e=r==="[object Arguments]";if(!e){e=!Array.isArray(r)&&t!==null&&typeof t==="object"&&typeof t.length==="number"&&t.length>=0&&l(t.callee)}return e};Object.keys=function ir(t){var r=l(t),e=O(t),n=t!==null&&typeof t==="object",i=n&&f(t)==="[object String]";if(!n&&!r&&!e){throw new TypeError("Object.keys called on a non-object")}var o=[];var a=x&&r;if(i||e){for(var u=0;u<t.length;++u){o.push(String(u))}}else{for(var p in t){if(!(a&&p==="prototype")&&s(t,p)){o.push(String(p))}}}if(S){var c=t.constructor,h=c&&c.prototype===t;for(var y=0;y<j;y++){var g=A[y];if(!(h&&g==="constructor")&&s(t,g)){o.push(g)}}}return o}}var E=-621987552e5,N="-000001";if(!Date.prototype.toISOString||new Date(E).toISOString().indexOf(N)===-1){Date.prototype.toISOString=function or(){var t,r,e,n,i;if(!isFinite(this)){throw new RangeError("Date.prototype.toISOString called on non-finite value.")}n=this.getUTCFullYear();i=this.getUTCMonth();n+=Math.floor(i/12);i=(i%12+12)%12;t=[i+1,this.getUTCDate(),this.getUTCHours(),this.getUTCMinutes(),this.getUTCSeconds()];n=(n<0?"-":n>9999?"+":"")+("00000"+Math.abs(n)).slice(0<=n&&n<=9999?-4:-6);r=t.length;while(r--){e=t[r];if(e<10){t[r]="0"+e}}return n+"-"+t.slice(0,2).join("-")+"T"+t.slice(2).join(":")+"."+("000"+this.getUTCMilliseconds()).slice(-3)+"Z"}}var T=false;try{T=Date.prototype.toJSON&&new Date(NaN).toJSON()===null&&new Date(E).toJSON().indexOf(N)!==-1&&Date.prototype.toJSON.call({toISOString:function(){return true}})}catch(I){}if(!T){Date.prototype.toJSON=function ar(t){var r=Object(this),e=P(r),n;if(typeof e==="number"&&!isFinite(e)){return null}n=r.toISOString;if(typeof n!=="function"){throw new TypeError("toISOString property is not callable")}return n.call(r)}}var D=Date.parse("+033658-09-27T01:46:40.000Z")===1e15;var _=!isNaN(Date.parse("2012-04-04T24:00:00.500Z"))||!isNaN(Date.parse("2012-11-31T23:59:59.000Z"));var M=isNaN(Date.parse("2000-01-01T00:00:00.000Z"));if(!Date.parse||M||_||!D){Date=function(t){function r(e,n,i,o,a,l,u){var p=arguments.length;if(this instanceof t){var s=p===1&&String(e)===e?new t(r.parse(e)):p>=7?new t(e,n,i,o,a,l,u):p>=6?new t(e,n,i,o,a,l):p>=5?new t(e,n,i,o,a):p>=4?new t(e,n,i,o):p>=3?new t(e,n,i):p>=2?new t(e,n):p>=1?new t(e):new t;s.constructor=r;return s}return t.apply(this,arguments)}var e=new RegExp("^"+"(\\d{4}|[+-]\\d{6})"+"(?:-(\\d{2})"+"(?:-(\\d{2})"+"(?:"+"T(\\d{2})"+":(\\d{2})"+"(?:"+":(\\d{2})"+"(?:(\\.\\d{1,}))?"+")?"+"("+"Z|"+"(?:"+"([-+])"+"(\\d{2})"+":(\\d{2})"+")"+")?)?)?)?"+"$");var n=[0,31,59,90,120,151,181,212,243,273,304,334,365];function i(t,r){var e=r>1?1:0;return n[r]+Math.floor((t-1969+e)/4)-Math.floor((t-1901+e)/100)+Math.floor((t-1601+e)/400)+365*(t-1970)}function o(r){return Number(new t(1970,0,1,0,0,0,r))}for(var a in t){r[a]=t[a]}r.now=t.now;r.UTC=t.UTC;r.prototype=t.prototype;r.prototype.constructor=r;r.parse=function l(r){var n=e.exec(r);if(n){var a=Number(n[1]),l=Number(n[2]||1)-1,u=Number(n[3]||1)-1,p=Number(n[4]||0),s=Number(n[5]||0),f=Number(n[6]||0),c=Math.floor(Number(n[7]||0)*1e3),h=Boolean(n[4]&&!n[8]),y=n[9]==="-"?1:-1,g=Number(n[10]||0),v=Number(n[11]||0),d;if(p<(s>0||f>0||c>0?24:25)&&s<60&&f<60&&c<1e3&&l>-1&&l<12&&g<24&&v<60&&u>-1&&u<i(a,l+1)-i(a,l)){d=((i(a,l)+u)*24+p+g*y)*60;d=((d+s+v*y)*60+f)*1e3+c;if(h){d=o(d)}if(-864e13<=d&&d<=864e13){return d}}return NaN}return t.parse.apply(this,arguments)};return r}(Date)}if(!Date.now){Date.now=function lr(){return(new Date).getTime()}}if(!Number.prototype.toFixed||8e-5.toFixed(3)!=="0.000"||.9.toFixed(0)==="0"||1.255.toFixed(2)!=="1.25"||0xde0b6b3a7640080.toFixed(0)!=="1000000000000000128"){(function(){var t,r,e,n;t=1e7;r=6;e=[0,0,0,0,0,0];function i(n,i){var o=-1;while(++o<r){i+=n*e[o];e[o]=i%t;i=Math.floor(i/t)}}function o(n){var i=r,o=0;while(--i>=0){o+=e[i];e[i]=Math.floor(o/n);o=o%n*t}}function a(){var t=r;var n="";while(--t>=0){if(n!==""||t===0||e[t]!==0){var i=String(e[t]);if(n===""){n=i}else{n+="0000000".slice(0,7-i.length)+i}}}return n}function l(t,r,e){return r===0?e:r%2===1?l(t,r-1,e*t):l(t*t,r/2,e)}function u(t){var r=0;while(t>=4096){r+=12;t/=4096}while(t>=2){r+=1;t/=2}return r}Number.prototype.toFixed=function p(t){var r,e,n,p,s,f,c,h;r=Number(t);r=r!==r?0:Math.floor(r);if(r<0||r>20){throw new RangeError("Number.toFixed called with invalid number of decimals")}e=Number(this);if(e!==e){return"NaN"}if(e<=-1e21||e>=1e21){return String(e)}n="";if(e<0){n="-";e=-e}p="0";if(e>1e-21){s=u(e*l(2,69,1))-69;f=s<0?e*l(2,-s,1):e/l(2,s,1);f*=4503599627370496;s=52-s;if(s>0){i(0,f);c=r;while(c>=7){i(1e7,0);c-=7}i(l(10,c,1),0);c=s-1;while(c>=23){o(1<<23);c-=23}o(1<<c);i(1,1);o(2);p=a()}else{i(0,f);i(1<<-s,0);p=a()+"0.00000000000000000000".slice(2,2+r)}}if(r>0){h=p.length;if(h<=r){p=n+"0.0000000000000000000".slice(0,r-h+2)+p}else{p=n+p.slice(0,h-r)+"."+p.slice(h-r)}}else{p=n+p}return p}})()}var F=String.prototype.split;if("ab".split(/(?:ab)*/).length!==2||".".split(/(.?)(.?)/).length!==4||"tesst".split(/(s)*/)[1]==="t"||"".split(/.?/).length||".".split(/()()/).length>1){(function(){var t=/()??/.exec("")[1]===void 0;String.prototype.split=function(r,e){var n=this;if(r===void 0&&e===0)return[];if(Object.prototype.toString.call(r)!=="[object RegExp]"){return F.apply(this,arguments)}var i=[],o=(r.ignoreCase?"i":"")+(r.multiline?"m":"")+(r.extended?"x":"")+(r.sticky?"y":""),a=0,l,u,p,s;r=new RegExp(r.source,o+"g");n+="";if(!t){l=new RegExp("^"+r.source+"$(?!\\s)",o)}e=e===void 0?-1>>>0:e>>>0;while(u=r.exec(n)){p=u.index+u[0].length;if(p>a){i.push(n.slice(a,u.index));if(!t&&u.length>1){u[0].replace(l,function(){for(var t=1;t<arguments.length-2;t++){if(arguments[t]===void 0){u[t]=void 0}}})}if(u.length>1&&u.index<n.length){Array.prototype.push.apply(i,u.slice(1))}s=u[0].length;a=p;if(i.length>=e){break}}if(r.lastIndex===u.index){r.lastIndex++}}if(a===n.length){if(s||!r.test("")){i.push("")}}else{i.push(n.slice(a))}return i.length>e?i.slice(0,e):i}})()}else if("0".split(void 0,0).length){String.prototype.split=function ur(t,r){if(t===void 0&&r===0)return[];return F.apply(this,arguments)}}var R=String.prototype.replace;var C=function(){var t=[];"x".replace(/x(.)?/g,function(r,e){t.push(e)});return t.length===1&&typeof t[0]==="undefined"}();if(!C){String.prototype.replace=function pr(t,r){var e=l(r);var n=u(t)&&/\)[*?]/.test(t.source);if(!e||!n){return R.apply(this,arguments)}else{var i=function(e){var n=arguments.length;var i=t.lastIndex;t.lastIndex=0;var o=t.exec(e);t.lastIndex=i;o.push(arguments[n-2],arguments[n-1]);return r.apply(this,o)};return R.call(this,t,i)}}}if("".substr&&"0b".substr(-1)!=="b"){var k=String.prototype.substr;String.prototype.substr=function sr(t,r){return k.call(this,t<0?(t=this.length+t)<0?0:t:t,r)}}var U="	\n\f\r \xa0\u1680\u180e\u2000\u2001\u2002\u2003"+"\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028"+"\u2029\ufeff";var Z="\u200b";if(!String.prototype.trim||U.trim()||!Z.trim()){U="["+U+"]";var J=new RegExp("^"+U+U+"*"),X=new RegExp(U+U+"*$");String.prototype.trim=function fr(){if(this===void 0||this===null){throw new TypeError("can't convert "+this+" to object")}return String(this).replace(J,"").replace(X,"")}}if(parseInt(U+"08")!==8||parseInt(U+"0x16")!==22){parseInt=function(t){var r=/^0[xX]/;return function e(n,i){n=String(n).trim();if(!Number(i)){i=r.test(n)?16:10}return t(n,i)}}(parseInt)}function $(t){t=+t;if(t!==t){t=0}else if(t!==0&&t!==1/0&&t!==-(1/0)){t=(t>0||-1)*Math.floor(Math.abs(t))}return t}function G(t){var r=typeof t;return t===null||r==="undefined"||r==="boolean"||r==="number"||r==="string"}function P(t){var r,e,n;if(G(t)){return t}e=t.valueOf;if(l(e)){r=e.call(t);if(G(r)){return r}}n=t.toString;if(l(n)){r=n.call(t);if(G(r)){return r}}throw new TypeError}var B=function(t){if(t==null){throw new TypeError("can't convert "+t+" to object")}return Object(t)}});
//# sourceMappingURL=es5-shim.map