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
			guiWidth: 150,
			explode: 0,
			speed: 3.25,
			delay: 0.001,

			audioHistoryArray:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
			audioFFTRange:36,
			audioFFTOffset:12,
			audioFFTSmoothness:.1,

			displayFanBlade: false,
			displayFanBladeRim: false,
			displayMenderParticle: false,
			displayMeanderLines: true,
			displayMeanderLineSegments: false,
			displayMeanderLineHair: false,
			displayMeanderDroplet: true,
			displayCenterLine: true,
			displaySurface: false,

			centerLineSmoothness: 2,
			centerLineSpeed: 0.001,
			centerLineRange: 400,
			centerLineDistance: 600,
			centerLineXMultiplier: 1,
			centerLineYMultiplier: 1,
			centerLineZMultiplier: 2,
			centerLineRandomize: function(){
				scope.randomizeSomeValues(0);
			},

			meanderParticlesSmoothness: 6,
			meanderParticlesSpeed: 0.001,
			meanderParticlesRange: 500,
			meanderParticlesOffset: 3,
			meanderParticlesRangeTwistiness: 0, //.5
			meanderParticlesRangeDistribution: .5,
			meanderParticlesType: "random",
			meanderParticlesRandomize: function(){
				scope.randomizeSomeValues(1);
			},

			fanSpeed: 0.0004,
			fanRange: 10,
			fanType: "random",
			fanRandomize: function(){
				scope.randomizeSomeValues(2);
			},
			dropA: 4, //.5
			dropB: .5, //.5
			dropC: .25, //.5
			dropSpeed: .001,
			dropRandomize: function(){
				scope.randomizeSomeValues(3);
			},
			explodeView: function(){
				scope.explodeView();
			},
			dropletsView: function(){
				scope.dropletsView();
			},
			dnaView: function(){
				scope.dnaView();
			},
			surfaceView: function(){
				scope.surfaceView();
			},
			wireView: function(){
				scope.wireView();
			},
			allView: function(){
				scope.allView();
			},
			randomizeAllValues: function(){
				scope.randomizeAllValues();
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

		var viewGUI = this.gui.addFolder('VIEWS (depreciated)');
		var controlGUI = this.gui.addFolder('CONTROLS');

		var gerneralGUI = controlGUI.addFolder('GENERAL');
		var shapesGUI = controlGUI.addFolder('SHAPES');
		var centerGUI = controlGUI.addFolder('CENTER LINE');
		var meanderGUI = controlGUI.addFolder('MEANDER PARTICLE');
		var fanGUI = controlGUI.addFolder('FAN');
		var dropletGUI = controlGUI.addFolder('SLICERLETS');

		SLICER.Sliders.explodeView = viewGUI.add(SLICER.Params, 'explodeView').name('EXPLODE VIEW');
		SLICER.Sliders.dropletsView = viewGUI.add(SLICER.Params, 'dropletsView').name('SLICERLETS VIEW');
		SLICER.Sliders.dropletsView = viewGUI.add(SLICER.Params, 'dnaView').name('DNA VIEW');
		SLICER.Sliders.surfaceView = viewGUI.add(SLICER.Params, 'surfaceView').name('SURFACE VIEW');
		SLICER.Sliders.wireView = viewGUI.add(SLICER.Params, 'wireView').name('WIRE VIEW');
		SLICER.Sliders.allView = viewGUI.add(SLICER.Params, 'allView').name('VIEW ALL');

		SLICER.Sliders.displayCenterLine = shapesGUI.add(SLICER.Params, 'displayCenterLine').name('center line');
		SLICER.Sliders.displayMenderParticle = shapesGUI.add(SLICER.Params, 'displayMenderParticle').name('meander particle');
		SLICER.Sliders.displayMeanderLines = shapesGUI.add(SLICER.Params, 'displayMeanderLines').name('meander lines');
		SLICER.Sliders.displayMeanderLineSegments = shapesGUI.add(SLICER.Params, 'displayMeanderLineSegments').name('meander segments');
		SLICER.Sliders.displayMeanderLineHair = shapesGUI.add(SLICER.Params, 'displayMeanderLineHair').name('meander hair');
		SLICER.Sliders.displayMeanderDroplet = shapesGUI.add(SLICER.Params, 'displayMeanderDroplet').name('droplet');
		SLICER.Sliders.displaySurface = shapesGUI.add(SLICER.Params, 'displaySurface').name('surface');
		SLICER.Sliders.displayFanBlade = shapesGUI.add(SLICER.Params, 'displayFanBlade').name('fan');
		SLICER.Sliders.displayFanBladeRim = shapesGUI.add(SLICER.Params, 'displayFanBladeRim').name('fanRim');
		SLICER.Sliders.fanType = shapesGUI.add(SLICER.Params, 'fanType', ['unified', 'distributed', 'random']).name('fan type');
		SLICER.Sliders.meanderParticlesType = shapesGUI.add(SLICER.Params, 'meanderParticlesType', ['unified', 'random']).name('meander type');

		SLICER.Sliders.explode = gerneralGUI.add(SLICER.Params, 'explode', 0.0, 2000).step(0.0005).name('explode');
		SLICER.Sliders.speed = gerneralGUI.add(SLICER.Params, 'speed', 0.1, 5.0).step(0.0005).name('speed');
		SLICER.Sliders.delay = gerneralGUI.add(SLICER.Params, 'delay', 0.0, 5.0).step(0.0005).name('delay');

		SLICER.Sliders.centerLineSmoothness = centerGUI.add(SLICER.Params, 'centerLineSmoothness', 0.0, 4).step(0.0005).name('smoothness');
		SLICER.Sliders.centerLineSpeed = centerGUI.add(SLICER.Params, 'centerLineSpeed', -0.005, 0.005).step(0.0005).name('speed');
		SLICER.Sliders.centerLineRange = centerGUI.add(SLICER.Params, 'centerLineRange', 400, 600).step(1).name('range');
		SLICER.Sliders.centerLineDistance = centerGUI.add(SLICER.Params, 'centerLineDistance', 800, 1400).step(0.0005).name('distance');
		SLICER.Sliders.centerLineXMultiplier = centerGUI.add(SLICER.Params, 'centerLineXMultiplier', 1.0, 2).step(0.0005).name('x multipier');
		SLICER.Sliders.centerLineYMultiplier = centerGUI.add(SLICER.Params, 'centerLineYMultiplier', 1.0, 2).step(0.0005).name('y multipier');
		SLICER.Sliders.centerLineZMultiplier = centerGUI.add(SLICER.Params, 'centerLineZMultiplier', 1.0, 2).step(0.0005).name('z multipier');
		SLICER.Sliders.centerLineRandomize = centerGUI.add(SLICER.Params, 'centerLineRandomize').name('RANDOMIZE GROUP');

		SLICER.Sliders.meanderParticlesSmoothness = meanderGUI.add(SLICER.Params, 'meanderParticlesSmoothness', 0.0, 6).step(0.0005).name('smoothness');
		SLICER.Sliders.meanderParticlesSpeed = meanderGUI.add(SLICER.Params, 'meanderParticlesSpeed', -0.005, 0.005).step(0.0005).name('speed');
		SLICER.Sliders.meanderParticlesRange = meanderGUI.add(SLICER.Params, 'meanderParticlesRange', 200, 500).step(0.0005).name('range');
		SLICER.Sliders.meanderParticlesOffset = meanderGUI.add(SLICER.Params, 'meanderParticlesOffset', 0, 50).step(0.0005).name('offset');
		SLICER.Sliders.meanderParticlesRangeTwistiness = meanderGUI.add(SLICER.Params, 'meanderParticlesRangeTwistiness', 0.0, 1.5).step(0.0005).name('twistiness');
		SLICER.Sliders.meanderParticlesRangeDistribution = meanderGUI.add(SLICER.Params, 'meanderParticlesRangeDistribution', 0.0, 1.0).step(0.0005).name('distribution');
		SLICER.Sliders.meanderParticlesRandomize = meanderGUI.add(SLICER.Params, 'meanderParticlesRandomize').name('RANDOMIZE GROUP');

		// SLICER.Sliders.fanSpeed = fanGUI.add(SLICER.Params, 'fanSpeed', -0.0025, 0.0025).step(0.0001).name('fanSpeed');
		SLICER.Sliders.fanSpeed = fanGUI.add(SLICER.Params, 'fanSpeed', 0.0, 0.00125).step(0.0001).name('fanSpeed');
		SLICER.Sliders.fanRange = fanGUI.add(SLICER.Params, 'fanRange', 2, 20).step(1).name('fanRange');
		SLICER.Sliders.fanRandomize = fanGUI.add(SLICER.Params, 'fanRandomize').name('RANDOMIZE');

		SLICER.Sliders.dropSpeed = dropletGUI.add(SLICER.Params, 'dropSpeed', -0.0125, 0.0125).step(0.0005).name('speed');
		SLICER.Sliders.dropA = dropletGUI.add(SLICER.Params, 'dropA', 0.5, 20.0).step(0.0005).name('a');
		SLICER.Sliders.dropB = dropletGUI.add(SLICER.Params, 'dropB', 0.0, 1.0).step(0.0005).name('b');
		SLICER.Sliders.dropC = dropletGUI.add(SLICER.Params, 'dropC', 0.0, 1.0).step(0.0005).name('c');
		SLICER.Sliders.dropRandomize = dropletGUI.add(SLICER.Params, 'dropRandomize').name('RANDOMIZE GROUP');

		shapesGUI.close();
		gerneralGUI.close();
		meanderGUI.close();
		centerGUI.close();
		dropletGUI.close();
		fanGUI.close();
		viewGUI.close();

		this.guiContainer = document.getElementById('guiContainer');
		this.guiContainer.appendChild(this.gui.domElement);

		return this;

	};
	this.createListeners = function(arg){

		SLICER.Sliders.fanRange.onChange(function(value) {
			scope.slicer3D.updateFan();
		});

		SLICER.Sliders.meanderParticlesType.onChange(function(value) {
			if(value === 'unified') {
				scope.slicer3D.setMeanderLinesToUnified();
			} else if(value === 'random') {
				scope.slicer3D.setMeanderLinesToRandom();
			}
		});

		SLICER.Sliders.fanType.onChange(function(value) {
			if(value === 'unified') {
				scope.slicer3D.setFanToUnified();
			} else if(value === 'distributed') {
				scope.slicer3D.setFanToDistributed();
			} else if(value === 'random') {
				scope.slicer3D.setFanToRandom();
			}
		});

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

	this.randomizeAllValues = function() {
		// trace("randomizeAllValues");
		var tweens = [];
		var tween;

		function delayer (total){
			var order = UNCTRL.Utils.shuffleArray(total);
			var counter = 0;
			return function(e){
				return order[counter++]*SLICER.Params.delay;
			};
		};

		var getItemDelay = delayer(18);

		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.meanderParticlesSmoothness, param:SLICER.Params.meanderParticlesSmoothness}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.meanderParticlesSpeed, param:SLICER.Params.meanderParticlesSpeed}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.meanderParticlesRange, param:SLICER.Params.meanderParticlesRange}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.meanderParticlesOffset, param:SLICER.Params.meanderParticlesOffset}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.meanderParticlesRangeTwistiness, param:SLICER.Params.meanderParticlesRangeTwistiness}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.meanderParticlesRangeDistribution, param:SLICER.Params.meanderParticlesRangeDistribution}));

		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.centerLineSmoothness, param:SLICER.Params.centerLineSmoothness}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.centerLineSpeed, param:SLICER.Params.centerLineSpeed}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.centerLineRange, param:SLICER.Params.centerLineRange}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.centerLineDistance, param:SLICER.Params.centerLineDistance}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.centerLineXMultiplier, param:SLICER.Params.centerLineXMultiplier}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.centerLineYMultiplier, param:SLICER.Params.centerLineYMultiplier}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.centerLineZMultiplier, param:SLICER.Params.centerLineZMultiplier}));

		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.fanSpeed, param:SLICER.Params.fanSpeed}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.fanRange, param:SLICER.Params.fanRange}));

		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.dropA, param:SLICER.Params.dropA}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.dropB, param:SLICER.Params.dropB}));
		tweens.push(this.createTween({delay:getItemDelay(), slider:SLICER.Sliders.dropSpeed, param:SLICER.Params.dropSpeed}));

		tween = {
			time:0,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				scope.waiter();
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

	this.randomizeSomeValues = function(id) {

		var tweens = [];
		var tween;

		function delayer (total){
			var order = UNCTRL.Utils.shuffleArray(total);
			var counter = 0;
			return function(e){
				return order[counter++]*SLICER.Params.delay;
			};
		};

		switch(id){
			case 1:
				tweens.push(this.createTween({ slider:SLICER.Sliders.meanderParticlesSmoothness, param:SLICER.Params.meanderParticlesSmoothness}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.meanderParticlesSpeed, param:SLICER.Params.meanderParticlesSpeed}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.meanderParticlesRange, param:SLICER.Params.meanderParticlesRange}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.meanderParticlesOffset, param:SLICER.Params.meanderParticlesOffset}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.meanderParticlesRangeTwistiness, param:SLICER.Params.meanderParticlesRangeTwistiness}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.meanderParticlesRangeDistribution, param:SLICER.Params.meanderParticlesRangeDistribution}));
				break;
			case 0:
				tweens.push(this.createTween({ slider:SLICER.Sliders.centerLineSmoothness, param:SLICER.Params.centerLineSmoothness}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.centerLineSpeed, param:SLICER.Params.centerLineSpeed}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.centerLineRange, param:SLICER.Params.centerLineRange}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.centerLineDistance, param:SLICER.Params.centerLineDistance}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.centerLineXMultiplier, param:SLICER.Params.centerLineXMultiplier}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.centerLineYMultiplier, param:SLICER.Params.centerLineYMultiplier}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.centerLineZMultiplier, param:SLICER.Params.centerLineZMultiplier}));
				break;
			case 2:
				tweens.push(this.createTween({ slider:SLICER.Sliders.fanSpeed, param:SLICER.Params.fanSpeed}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.fanRange, param:SLICER.Params.fanRange}));
				break;
			case 3:
				tweens.push(this.createTween({ slider:SLICER.Sliders.dropA, param:SLICER.Params.dropA}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.dropB, param:SLICER.Params.dropB}));
				tweens.push(this.createTween({ slider:SLICER.Sliders.dropSpeed, param:SLICER.Params.dropSpeed}));
				break;
		}

		tween = {
			time:0,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){

			},
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();
		
		return this;

	};

	this.dropletsView = function() {
		SLICER.Sliders.displayFanBlade.setValue(false);
		SLICER.Sliders.displayFanBladeRim.setValue(false);
		SLICER.Sliders.displayMenderParticle.setValue(false);
		SLICER.Sliders.displayMeanderLines.setValue(true);
		SLICER.Sliders.displayMeanderLineSegments.setValue(false);
		SLICER.Sliders.displayMeanderLineHair.setValue(false);
		SLICER.Sliders.displayMeanderDroplet.setValue(true);
		SLICER.Sliders.displayCenterLine.setValue(true);
		SLICER.Sliders.displaySurface.setValue(false);
		SLICER.Sliders.fanType.setValue("random");
		SLICER.Sliders.meanderParticlesType.setValue("random");
		scope.slicer3D.showDroplets();

		var tweens = [];
		var tween;
		tweens.push(this.createTween({slider:SLICER.Sliders.explode, param:SLICER.Params.explode, endValue:.01}));
		tween = {
			time:.5,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				SLICER.Sliders.explode.setValue(0);
			},
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();

		return this;
	};

	this.dnaView = function() {
		var sliders = SLICER.Sliders;

		SLICER.Sliders.displayFanBlade.setValue(true);
		SLICER.Sliders.displayFanBladeRim.setValue(true);
		SLICER.Sliders.displayMenderParticle.setValue(false);
		SLICER.Sliders.displayMeanderLines.setValue(false);
		SLICER.Sliders.displayMeanderLineSegments.setValue(false);
		SLICER.Sliders.displayMeanderLineHair.setValue(false);
		SLICER.Sliders.displayMeanderDroplet.setValue(true);
		SLICER.Sliders.displayCenterLine.setValue(true);
		SLICER.Sliders.displaySurface.setValue(false);
		SLICER.Sliders.fanType.setValue("distributed");
		SLICER.Sliders.meanderParticlesType.setValue("unified");
		scope.slicer3D.hideDroplets();

		var tweens = [];
		var tween;
		tweens.push(this.createTween({slider:SLICER.Sliders.explode, param:SLICER.Params.explode, endValue:.01}));
		tween = {
			time:.5,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				SLICER.Sliders.explode.setValue(0);
			},
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();

		return this;
	};

	this.surfaceView = function() {

		SLICER.Sliders.displayFanBlade.setValue(false);
		SLICER.Sliders.displayFanBladeRim.setValue(false);
		SLICER.Sliders.displayMenderParticle.setValue(false);
		SLICER.Sliders.displayMeanderLines.setValue(false);
		SLICER.Sliders.displayMeanderLineSegments.setValue(false);
		SLICER.Sliders.displayMeanderLineHair.setValue(false);
		SLICER.Sliders.displayMeanderDroplet.setValue(true);
		SLICER.Sliders.displayCenterLine.setValue(true);
		SLICER.Sliders.displaySurface.setValue(true);
		SLICER.Sliders.fanType.setValue("distributed");
		SLICER.Sliders.meanderParticlesType.setValue("unified");
		scope.slicer3D.hideDroplets();

		var tweens = [];
		var tween;
		tweens.push(this.createTween({slider:SLICER.Sliders.explode, param:SLICER.Params.explode, endValue:.01}));
		tween = {
			time:.5,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				SLICER.Sliders.explode.setValue(0);
			},
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();

		return this;
	};


	this.wireView = function() {

		SLICER.Sliders.displayFanBlade.setValue(false);
		SLICER.Sliders.displayFanBladeRim.setValue(false);
		SLICER.Sliders.displayMenderParticle.setValue(true);
		SLICER.Sliders.displayMeanderLines.setValue(true);
		SLICER.Sliders.displayMeanderLineSegments.setValue(true);
		SLICER.Sliders.displayMeanderLineHair.setValue(true);
		SLICER.Sliders.displayMeanderDroplet.setValue(true);
		SLICER.Sliders.displayCenterLine.setValue(true);
		SLICER.Sliders.displaySurface.setValue(false);
		SLICER.Sliders.fanType.setValue("distributed");
		SLICER.Sliders.meanderParticlesType.setValue("unified");
		scope.slicer3D.hideDroplets();

		var tweens = [];
		var tween;
		tweens.push(this.createTween({slider:SLICER.Sliders.explode, param:SLICER.Params.explode, endValue:.01}));
		tween = {
			time:.5,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				SLICER.Sliders.explode.setValue(0);
			},
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();

		return this;
	};

	this.allView = function() {

		SLICER.Sliders.displayFanBlade.setValue(true);
		SLICER.Sliders.displayFanBladeRim.setValue(true);
		SLICER.Sliders.displayMenderParticle.setValue(true);
		SLICER.Sliders.displayMeanderLines.setValue(true);
		SLICER.Sliders.displayMeanderLineSegments.setValue(true);
		SLICER.Sliders.displayMeanderLineHair.setValue(true);
		SLICER.Sliders.displayMeanderDroplet.setValue(true);
		SLICER.Sliders.displayCenterLine.setValue(true);
		SLICER.Sliders.displaySurface.setValue(true);
		SLICER.Sliders.fanType.setValue("distributed");
		SLICER.Sliders.meanderParticlesType.setValue("unified");
		scope.slicer3D.showDroplets();

		var tweens = [];
		var tween;
		tweens.push(this.createTween({slider:SLICER.Sliders.explode, param:SLICER.Params.explode, endValue:.01}));
		tween = {
			time:.5,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				SLICER.Sliders.explode.setValue(0);
			},
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();

		return this;
	};



	this.explodeView = function() {
		SLICER.Sliders.displayFanBlade.setValue(true);
		SLICER.Sliders.displayFanBladeRim.setValue(true);
		SLICER.Sliders.displayMenderParticle.setValue(true);
		SLICER.Sliders.displayMeanderLines.setValue(true);
		SLICER.Sliders.displayMeanderLineSegments.setValue(true);
		SLICER.Sliders.displayMeanderLineHair.setValue(true);
		SLICER.Sliders.displayMeanderDroplet.setValue(true);
		SLICER.Sliders.displayCenterLine.setValue(true);
		SLICER.Sliders.displaySurface.setValue(true);
		SLICER.Sliders.fanType.setValue("distributed");
		SLICER.Sliders.meanderParticlesType.setValue("unified");
		scope.slicer3D.showDroplets();

		var tweens = [];
		var tween;
		tweens.push(this.createTween({slider:SLICER.Sliders.explode, param:SLICER.Params.explode, endValue:2000}));
		tween = {
			time:0,
			duration:SLICER.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){

			},
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