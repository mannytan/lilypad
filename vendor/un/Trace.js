/**
 * Created by .
 * User: manuelt
 * Date: 7/23/11
 * Time: 2:13 PM
 * To change this template use File | Settings | File Templates.
 */

function trace(e) {
	// $("#output").prepend(e + "\n");
	console.log(e);
}

function tracer() {
	trace(arguments);
}

function tracerFunction() {
	var args = Array.prototype.slice.call(arguments);
	var func = args.shift();
	trace(func + "(" + args + ");");
}

function tracerEvent() {
	var args = Array.prototype.slice.call(arguments);
	var func = args.shift();
	trace(func + "(" + args + ");" + " --> ");
}