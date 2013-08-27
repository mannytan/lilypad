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
			colorRange:.125,
			wrapAmount: 1.0,
			delay: 0.150,
			randomizeAllValues: function(){
				scope.randomizeAllValues();
			},
			randomizeColor: function(){
				scope.randomizeColor();
			},
			toggleView: function(){
				scope.toggleView();
			},
			randomizeTotalNumbers: function(){
				scope.randomizeTotalNumbers();
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

		var f1 = this.gui.addFolder('LILYPAD');
		var f2 = this.gui.addFolder('GLOBAL');

		LILYPAD.Sliders.speed = f2.add(LILYPAD.Params, 'speed', 0.1, 5.0).step(0.0005).name('speed');
		LILYPAD.Sliders.delay = f2.add(LILYPAD.Params, 'delay', 0.0, 2.0).step(0.0005).name('delay');

		LILYPAD.Sliders.noiseSpeed = f1.add(LILYPAD.Params, 'noiseSpeed', -.35, .35).step(0.0005).name('noiseSpeed');
		LILYPAD.Sliders.noiseAmount = f1.add(LILYPAD.Params, 'noiseAmount', 0, 3).step(0.0005).name('noiseAmount');
		LILYPAD.Sliders.noiseIntensity = f1.add(LILYPAD.Params, 'noiseIntensity', .25, 2).step(0.0005).name('noiseIntensity');
		
		LILYPAD.Sliders.radiusRange = f1.add(LILYPAD.Params, 'radiusRange', .75, 1).step(0.0005).name('radiusRange');
		LILYPAD.Sliders.radius = f1.add(LILYPAD.Params, 'radius', 100, 400).step(0.0005).name('radius');

		LILYPAD.Sliders.centerRadius = f1.add(LILYPAD.Params, 'centerRadius', 0, 25).step(0.0005).name('centerRadius');
		LILYPAD.Sliders.centerSpeed = f1.add(LILYPAD.Params, 'centerSpeed', -.1, .1).step(0.0005).name('centerSpeed');
		LILYPAD.Sliders.centerOffset = f1.add(LILYPAD.Params, 'centerOffset', -2, 2).step(0.0005).name('centerOffset');

		LILYPAD.Sliders.multiplier = f1.add(LILYPAD.Params, 'multiplier', -15, 15).step(0.0005).name('multiplier');
		LILYPAD.Sliders.maxHeightRange = f1.add(LILYPAD.Params, 'maxHeightRange', -1, 1).step(0.0005).name('maxHeightRange');
		
		LILYPAD.Sliders.heightOffset = f1.add(LILYPAD.Params, 'heightOffset', -50, 50).step(0.0005).name('heightOffset');
		LILYPAD.Sliders.waterHeight = f1.add(LILYPAD.Params, 'waterHeight', -100, 50).step(0.0005).name('waterHeight');

		LILYPAD.Sliders.wrapAmount = f1.add(LILYPAD.Params, 'wrapAmount', 0, 1).step(0.0005).name('wrapAmount');
		LILYPAD.Sliders.orbitSpeed = f1.add(LILYPAD.Params, 'orbitSpeed', -.1, .1).step(0.0005).name('orbitSpeed');

		LILYPAD.Sliders.colorSpeed = f1.add(LILYPAD.Params, 'colorSpeed', -.001, .001).step(0.0005).name('colorSpeed');
		LILYPAD.Sliders.colorRange = f1.add(LILYPAD.Params, 'colorRange', .0, .35).step(0.0005).name('colorRange');

		this.gui.add(LILYPAD.Params, 'randomizeAllValues').name('MORPH SHAPE');
		f2.add(LILYPAD.Params, 'randomizeColor').name('UPDATE COLOR');
		// f2.add(LILYPAD.Params, 'randomizeTotalNumbers').name('CHANGE RES');
		f2.add(LILYPAD.Params, 'toggleView').name('CHANGE VIEW');

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
			effect:'quadInOut', 
			start:param,
			stop:endValue,
			onFrame:setter,
			onStop:setter,
		}
	}


	this.toggleView = function() {
		trace("toggleView");
		this.dispatchEvent("TOGGLE_VIEW",[]);
		return this;
	};


	this.randomizeTotalNumbers = function() {
		trace("randomizeTotalNumbers");
		window.location.href=window.location.pathname + "?totalWidth=" +((Math.random()*20)|0 + 2)+ "&totalDepth=" + ((Math.random()*20)|0 + 2);
		return this;
	};
	
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

		var getItemDelay = delayer(14);

		tweens.push(this.createTween({ delay:getItemDelay(),  slider:LILYPAD.Sliders.noiseSpeed,  param:LILYPAD.Params.noiseSpeed}));
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
			effect: 'easeInOut',
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