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
			orbitSpeed: 0.0015,
			guiWidth: 250,
			radius: 100,
			radiusRange: .75,
			centerRadius: 10,
			centerSpeed: 0.1,
			maxHeight: 10,
			heightOffset: 10,
			noiseSpeed: .05,
			noiseAmount: .3,
			noiseIntensity:1,
			speed: 3.25,
			wrapAmount: 0.0001,
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

		
		this.gui.add(SLICER.Params, 'noiseSpeed', -1, 1).step(0.0005).name('noiseSpeed');
		this.gui.add(SLICER.Params, 'noiseAmount', 0, 2).step(0.0005).name('noiseAmount');
		this.gui.add(SLICER.Params, 'noiseIntensity', 0, 5).step(0.0005).name('noiseIntensity');
		
		this.gui.add(SLICER.Params, 'radiusRange', 0, 1).step(0.0005).name('radiusRange');
		this.gui.add(SLICER.Params, 'radius', 0, 400).step(0.0005).name('radius');

		this.gui.add(SLICER.Params, 'centerRadius', 0, 50).step(0.0005).name('centerRadius');
		this.gui.add(SLICER.Params, 'centerSpeed', -1, 1).step(0.0005).name('centerSpeed');
		this.gui.add(SLICER.Params, 'maxHeight', 0.1, 15).step(0.0005).name('maxHeight');
		this.gui.add(SLICER.Params, 'heightOffset', -30, 30).step(0.0005).name('heightOffset');

		this.gui.add(SLICER.Params, 'wrapAmount', 0, 1).step(0.0005).name('wrapAmount');
		this.gui.add(SLICER.Params, 'orbitSpeed', -.1, .1).step(0.0005).name('orbitSpeed');

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