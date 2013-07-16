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
	this.scope3d = null;

	this.init = function() {
		this.traceFunction("init");
		return this;
	};

	this.createGui = function() {

		SLICER.Params = {
			orbitSpeed: 0.0015,
			guiWidth: 250,
			radius: 200,
			radiusRange: .75,
			centerRadius: 10,
			centerSpeed: 0.1,
			centerOffset: 0.001,
			multiplier: 10.0005,
			heightOffset: 10,
			groundHeight: 10,
			maxHeightRange: 1,
			noiseSpeed: .05,
			noiseAmount: .3,
			noiseIntensity:1,
			speed: 3.25,
			colorOffset:.35,
			colorRange:.5,
			wrapAmount: 0.99999,
			delay: 0.001,
			randomizeAllValues: function(){
				scope.randomizeAllValues();
			},
			randomizeColor: function(){
				scope.randomizeColor();
			}

		};

		this.gui = new dat.GUI({
			width: SLICER.Params.guiWidth,
			// autoPlace: false
		});

		this.guiContainer = this.gui.domElement;

		this.guiContainer.onselectStart = function() {
			return false;
		};

		SLICER.Sliders.speed = this.gui.add(SLICER.Params, 'speed', 0.1, 5.0).step(0.0005).name('speed');
		SLICER.Sliders.delay = this.gui.add(SLICER.Params, 'delay', 0.0, 5.0).step(0.0005).name('delay');

		SLICER.Sliders.noiseSpeed = this.gui.add(SLICER.Params, 'noiseSpeed', -1, 1).step(0.0005).name('noiseSpeed');
		SLICER.Sliders.noiseAmount = this.gui.add(SLICER.Params, 'noiseAmount', 0, 5).step(0.0005).name('noiseAmount');
		SLICER.Sliders.noiseIntensity = this.gui.add(SLICER.Params, 'noiseIntensity', .25, 2).step(0.0005).name('noiseIntensity');
		
		SLICER.Sliders.radiusRange = this.gui.add(SLICER.Params, 'radiusRange', .5, 1).step(0.0005).name('radiusRange');
		SLICER.Sliders.radius = this.gui.add(SLICER.Params, 'radius', 100, 400).step(0.0005).name('radius');

		SLICER.Sliders.centerRadius = this.gui.add(SLICER.Params, 'centerRadius', 0, 25).step(0.0005).name('centerRadius');
		SLICER.Sliders.centerSpeed = this.gui.add(SLICER.Params, 'centerSpeed', -.125, .125).step(0.0005).name('centerSpeed');
		SLICER.Sliders.centerOffset = this.gui.add(SLICER.Params, 'centerOffset', -2, 2).step(0.0005).name('centerOffset');

		SLICER.Sliders.multiplier = this.gui.add(SLICER.Params, 'multiplier', -15, 15).step(0.0005).name('multiplier');
		SLICER.Sliders.maxHeightRange = this.gui.add(SLICER.Params, 'maxHeightRange', -1, 1).step(0.0005).name('maxHeightRange');
		
		SLICER.Sliders.heightOffset = this.gui.add(SLICER.Params, 'heightOffset', -50, 50).step(0.0005).name('heightOffset');
		SLICER.Sliders.groundHeight = this.gui.add(SLICER.Params, 'groundHeight', -100, 50).step(0.0005).name('groundHeight');

		SLICER.Sliders.wrapAmount = this.gui.add(SLICER.Params, 'wrapAmount', 0, 1).step(0.0005).name('wrapAmount');
		SLICER.Sliders.orbitSpeed = this.gui.add(SLICER.Params, 'orbitSpeed', -.1, .1).step(0.0005).name('orbitSpeed');

		SLICER.Sliders.colorOffset = this.gui.add(SLICER.Params, 'colorOffset', 0, 1).step(0.0005).name('colorOffset');
		SLICER.Sliders.colorRange = this.gui.add(SLICER.Params, 'colorRange', .25, .5).step(0.0005).name('colorRange');

		this.gui.add(SLICER.Params, 'randomizeAllValues').name('MORPH SHAPE');
		this.gui.add(SLICER.Params, 'randomizeColor').name('UPDATE COLOR');

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

	this.randomizeColor = function() {
		// trace("randomizeColor");
		var tweens = [];
		var tween;

		function delayer (total){

			var order = shuffleArray(total);
			var counter = 0;
			return function(e){
				return order[counter++]*SLICER.Params.delay;
			};
		};

		var getItemDelay = delayer(2);

		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.colorOffset,  param:SLICER.Params.colorOffset}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.colorRange, param:SLICER.Params.colorRange}));

		tween = {
			time:0,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				// scope.waiter();
			},
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();
		return this;

	};	
	this.randomizeAllValues = function() {
		// trace("randomizeAllValues");
		var tweens = [];
		var tween;

		function delayer (total){
			var order = shuffleArray(total);
			var counter = 0;
			return function(e){
				return order[counter++]*SLICER.Params.delay;
			};
		};

		var getItemDelay = delayer(11);

		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.noiseAmount,  param:SLICER.Params.noiseAmount}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.noiseIntensity,  param:SLICER.Params.noiseIntensity}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.radiusRange,  param:SLICER.Params.radiusRange}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.radius,  param:SLICER.Params.radius}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.centerRadius,  param:SLICER.Params.centerRadius}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.centerSpeed,  param:SLICER.Params.centerSpeed}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.centerOffset,  param:SLICER.Params.centerOffset}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.multiplier,  param:SLICER.Params.multiplier}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.maxHeightRange,  param:SLICER.Params.maxHeightRange}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.heightOffset,  param:SLICER.Params.heightOffset}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.groundHeight,  param:SLICER.Params.groundHeight}));
		// tweens.push(this.createTween({ delay:getItemDelay(),  slider:SLICER.Sliders.wrapAmount,  param:SLICER.Params.wrapAmount}));
		tween = {
			time:0,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				// scope.waiter();
			},
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();
		return this;

	};

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
		this.scope3d = arg;
		return this;
	};

};

SLICER.Params.prototype = new UNCTRL.BoilerPlate();
SLICER.Params.prototype.constructor = SLICER.Params;