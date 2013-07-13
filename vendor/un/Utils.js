/**
 * Created by .
 * User: manuelt
 * unsorted utils, will ned to convert to a framework eventually
 */
function distanceTo(a, b) {
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return Math.sqrt((dx * dx) + (dy * dy));
}

function dotProduct(v0, v) {
	return (v0.x * v.x) + (v0.y * v.y);
}

function crossProduct(v0, v) {
	return(v0.x * v.y) - (v.x * v0.y);
}
function randomRange(min, max) {
	return ((Math.random() * (max - min)) + min);
}
function randomRange(min, max, expo) {
	return toDecimal(((Math.random() * (max - min)) + min), expo);
}
function toDecimal(arg, expo) {
	return parseFloat(arg.toFixed(expo));
}

function clamp(min, max, value) {
	return Math.max(min, Math.min(max, value));
}

function shuffleArray(total){
	var a = [];
	var b = [];
	for (var i=0; i<total; i++) {
		a.push(i);
	}
	while (a.length>0) {
		b.push(a.splice( (Math.random()*a.length) , 1)|0);
	}
	return b;
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

var TO_DEGREES = 180 / Math.PI;
var TO_RADIANS = Math.PI / 180;
var TWO_PI = Math.PI * 2;
var ONE_PI = Math.PI;

function hsvToHex(h, s, v){

    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return "0x" + (((1 << 24) + ((r * 255) << 16) + ((g * 255) << 8) + (b * 255))|0).toString(16).slice(1);

}
