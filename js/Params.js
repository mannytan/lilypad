/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 03/20/12
 */

var LILYPAD = LILYPAD || {};

LILYPAD.Params = {};
LILYPAD.Sliders = {};

LILYPAD.Params = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Params';
	this.scope3d = null;

	this.init = function() {
		this.traceFunction("init");
		return this;
	};

	this.createGui = function() {

		LILYPAD.Params = {
			orbitSpeed: 0.0015,
			guiWidth: 250,
			radius: 200,
			radiusRange: .75,
			centerRadius: 10,
			centerSpeed: 0.1,
			centerOffset: 0.001,
			multiplier: 10.0005,
			heightOffset: 10,
			waterHeight: 10,
			maxHeightRange: 1,
			noiseSpeed: .05,
			noiseAmount: .3,
			noiseIntensity:1,
			speed: 3.25,
			colorSpeed:.0001,
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
			width: LILYPAD.Params.guiWidth,
			// autoPlace: false
		});

		this.guiContainer = this.gui.domElement;

		this.guiContainer.onselectStart = function() {
			return false;
		};

		LILYPAD.Sliders.speed = this.gui.add(LILYPAD.Params, 'speed', 0.1, 5.0).step(0.0005).name('speed');
		LILYPAD.Sliders.delay = this.gui.add(LILYPAD.Params, 'delay', 0.0, 5.0).step(0.0005).name('delay');

		LILYPAD.Sliders.noiseSpeed = this.gui.add(LILYPAD.Params, 'noiseSpeed', -1, 1).step(0.0005).name('noiseSpeed');
		LILYPAD.Sliders.noiseAmount = this.gui.add(LILYPAD.Params, 'noiseAmount', 0, 5).step(0.0005).name('noiseAmount');
		LILYPAD.Sliders.noiseIntensity = this.gui.add(LILYPAD.Params, 'noiseIntensity', .25, 2).step(0.0005).name('noiseIntensity');
		
		LILYPAD.Sliders.radiusRange = this.gui.add(LILYPAD.Params, 'radiusRange', .5, 1).step(0.0005).name('radiusRange');
		LILYPAD.Sliders.radius = this.gui.add(LILYPAD.Params, 'radius', 100, 400).step(0.0005).name('radius');

		LILYPAD.Sliders.centerRadius = this.gui.add(LILYPAD.Params, 'centerRadius', 0, 25).step(0.0005).name('centerRadius');
		LILYPAD.Sliders.centerSpeed = this.gui.add(LILYPAD.Params, 'centerSpeed', -.125, .125).step(0.0005).name('centerSpeed');
		LILYPAD.Sliders.centerOffset = this.gui.add(LILYPAD.Params, 'centerOffset', -2, 2).step(0.0005).name('centerOffset');

		LILYPAD.Sliders.multiplier = this.gui.add(LILYPAD.Params, 'multiplier', -15, 15).step(0.0005).name('multiplier');
		LILYPAD.Sliders.maxHeightRange = this.gui.add(LILYPAD.Params, 'maxHeightRange', -1, 1).step(0.0005).name('maxHeightRange');
		
		LILYPAD.Sliders.heightOffset = this.gui.add(LILYPAD.Params, 'heightOffset', -50, 50).step(0.0005).name('heightOffset');
		LILYPAD.Sliders.waterHeight = this.gui.add(LILYPAD.Params, 'waterHeight', -100, 50).step(0.0005).name('waterHeight');

		LILYPAD.Sliders.wrapAmount = this.gui.add(LILYPAD.Params, 'wrapAmount', 0, 1).step(0.0005).name('wrapAmount');
		LILYPAD.Sliders.orbitSpeed = this.gui.add(LILYPAD.Params, 'orbitSpeed', -.1, .1).step(0.0005).name('orbitSpeed');

		LILYPAD.Sliders.colorSpeed = this.gui.add(LILYPAD.Params, 'colorSpeed', -.001, .001).step(0.0005).name('colorSpeed');
		LILYPAD.Sliders.colorRange = this.gui.add(LILYPAD.Params, 'colorRange', .0, .5).step(0.0005).name('colorRange');

		this.gui.add(LILYPAD.Params, 'randomizeAllValues').name('MORPH SHAPE');
		this.gui.add(LILYPAD.Params, 'randomizeColor').name('UPDATE COLOR');

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
			duration:LILYPAD.Params.speed,
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
				return order[counter++]*LILYPAD.Params.delay;
			};
		};

		var getItemDelay = delayer(2);

		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.colorSpeed,  param:LILYPAD.Params.colorSpeed}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.colorRange, param:LILYPAD.Params.colorRange}));

		tween = {
			time:0,
			duration:LILYPAD.Params.speed,
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
				return order[counter++]*LILYPAD.Params.delay;
			};
		};

		var getItemDelay = delayer(13);

		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.noiseAmount,  param:LILYPAD.Params.noiseAmount}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.noiseIntensity,  param:LILYPAD.Params.noiseIntensity}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.radiusRange,  param:LILYPAD.Params.radiusRange}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.radius,  param:LILYPAD.Params.radius}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.centerRadius,  param:LILYPAD.Params.centerRadius}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.centerSpeed,  param:LILYPAD.Params.centerSpeed}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.centerOffset,  param:LILYPAD.Params.centerOffset}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.multiplier,  param:LILYPAD.Params.multiplier}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.maxHeightRange,  param:LILYPAD.Params.maxHeightRange}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.heightOffset,  param:LILYPAD.Params.heightOffset}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.waterHeight,  param:LILYPAD.Params.waterHeight}));

		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.colorSpeed,  param:LILYPAD.Params.colorSpeed}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.colorRange, param:LILYPAD.Params.colorRange}));

		// tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.wrapAmount,  param:LILYPAD.Params.wrapAmount}));
		tween = {
			time:0,
			duration:LILYPAD.Params.speed,
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
			duration:LILYPAD.Params.speed*.5,
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

LILYPAD.Params.prototype = new UNCTRL.BoilerPlate();
LILYPAD.Params.prototype.constructor = LILYPAD.Params;