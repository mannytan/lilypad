/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 03/20/12
 */

var SLICER = SLICER || {};

SLICER.Params = {};

SLICER.Main = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Main';
	this.isPaused = false;

	// dat.gui
	this.gui = null;
	this.guiWidth = 300;
	this.guiContainer = null;

	// stage
	this.stageWidth = window.innerWidth - this.guiWidth;
	this.stageHeight = window.innerHeight;
	this.stageOffsetX = ((window.innerWidth - this.stageWidth) * 0.5) | 0;
	this.stageOffsetY = ((window.innerHeight - this.stageHeight) * 0.5) | 0;

	// stats
	this.stats = new Stats();

	// 3d
	this.slicer3D = null;

	this.init = function() {
		this.traceFunction("init");
		this.createListeners();
		this.createGui();

		this.slicer3D = new SLICER.Slicer3D("Slicer3D");
		this.slicer3D.init();
		this.slicer3D.setDimensions(this.stageWidth,this.stageHeight);
		this.slicer3D.createEnvironment();

		this.slicer3D.createBackgroundElements();
		this.slicer3D.createForegroundElements();

		this.slicer3D.hideElements();
		this.slicer3D.createListeners();

		this.loader = document.getElementById('loader');

		document.body.appendChild(this.stats.domElement);

		// stop the user getting a text cursor
		document.onselectStart = function() {
			return false;
		};

		this.resize();
		this.play();
		return this;
	};

	this.createGui = function() {
		SLICER.Params = {
			speed: 4.0,
			orbitSpeed: 0.0001,
			osc: 0,

			resetTrackBall: function(){
				scope.slicer3D.resetTrackBall();
			}

		};

		this.gui = new dat.GUI({
			width: this.guiWidth,
			autoPlace: false
		});
		this.guiContainer = this.gui.domElement;

		this.gui.add(SLICER.Params, 'osc', 0.0, 0.1).step(0.0005);
		this.gui.add(SLICER.Params, 'resetTrackBall');


		this.guiContainer = document.getElementById('guiContainer');
		this.guiContainer.appendChild(this.gui.domElement);
	};


	this.update = function() {

		this.slicer3D.parse();
		this.slicer3D.draw();

	};

	this.loop = function() {
		this.stats.update();
		this.update();
		if (this.isPaused) {
			return this;
		}
		requestAnimationFrame(function() {
			scope.loop();
		});
		return this;
	};

	this.slider = function(gui, startValue, endValue, delayer) {
		var obj = {
			time: delayer,
			duration: SLICER.Params.speed,
			effect: 'easeOut',
			start: startValue,
			stop: endValue,
			onFrame: function(element, state) {
				gui.setValue(state.value);
			}
		};
		return obj;
	};

	this.perspectiveToggle = function() {
		if (SLICER.Params.perspective === false) {
			SLICER.Params.perspective = true;
			this.slicer3D.toPerspective();
		} else {
			SLICER.Params.perspective = false;
			this.slicer3D.toOrthographic();
		}
	};

	this.pausePlayToggle = function() {
		if (scope.isPaused) {
			this.play();
		} else {
			this.pause();
		}
	};

	this.play = function() {
		this.isPaused = false;
		this.slicer3D.enableTrackBall();
		this.loop();
		return this;
	};

	this.pause = function() {
		this.isPaused = true;
		this.slicer3D.disableTrackBall();
		if (this.source) this.source.disconnect();

	};

	this.createListeners = function() {
		window.addEventListener('keydown', function() {
			scope.keyDown(event);
		}, false);

		window.addEventListener('resize', function() {
			scope.resize(event);
		}, false);

	};

	this.keyDown = function(event) {
		if (event.keyCode === 32) {
			this.pausePlayToggle();
		}
	};

	this.resize = function() {
		this.stageWidth = window.innerWidth - this.guiWidth;
		this.stageHeight = window.innerHeight;

		this.slicer3D.setDimensions(this.stageWidth,this.stageHeight);
		this.slicer3D.resize();


	};

};

SLICER.Main.prototype = new UNCTRL.BoilerPlate();
SLICER.Main.prototype.constructor = SLICER.Main;