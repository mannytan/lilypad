/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 03/20/12
 */

var SLICER = SLICER || {};

SLICER.Params = {};
SLICER.Sliders = {};

SLICER.Params = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Params';
	this.slicer3D = null;

	this.init = function() {
		this.traceFunction("init");
		return this;
	};

	this.createGui = function() {

		SLICER.Params = {
			orbitSpeed: 0.0001,
			guiWidth: 200,
			explode: 180,
			explodeVertical: 20,
			speed: 3.25,
			delay: 0.001

		};

		this.gui = new dat.GUI({
			width: SLICER.Params.guiWidth,
			// autoPlace: false
		});

		this.guiContainer = this.gui.domElement;

		this.guiContainer.onselectStart = function() {
			return false;
		};

		this.gui.add(SLICER.Params, 'explode', 0, 300).step(0.0005).name('explode');
		this.gui.add(SLICER.Params, 'explodeVertical', -30, 30).step(0.0005).name('explodeVertical');

		this.guiContainer = document.getElementById('guiContainer');
		this.guiContainer.appendChild(this.gui.domElement);

		return this;

	};
	this.createListeners = function(arg){

		return this;

	};

	this.createTween = function(arg){
		var slider = arg.slider;
		var param = arg.param;
		var endValue = arg.endValue ? arg.endValue : (slider.__max - slider.__min)*Math.random() + slider.__min;
		var delayValue = arg.delay ? arg.delay : 0;
		var setter = 
		(function( id ){
			return function(element, state) {
				slider.setValue(state.value);
			}
		})(slider);
		return {
			time:delayValue,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:param,
			stop:endValue,
			onFrame:setter,
			onStop:setter,
		}
	}

	this.waiter = function() {
		// trace("waiter");
		var tweens = [];
		var tween;

		tween = {
			time:0,
			duration:SLICER.Params.speed*.5,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				scope.randomizeAllValues();
			}
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();

		return this;
	};

	this.set3DScope = function(arg) {
		this.slicer3D = arg;
		return this;
	};

};

SLICER.Params.prototype = new UNCTRL.BoilerPlate();
SLICER.Params.prototype.constructor = SLICER.Params;