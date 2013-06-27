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
			guiWidth: 250,
			explode: 20,
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

		this.gui.add(SLICER.Params, 'explode', -100, 100).step(0.0005).name('explode');

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