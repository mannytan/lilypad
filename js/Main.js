/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 03/20/12
 */

var LILYPAD = LILYPAD || {};


LILYPAD.Main = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Main';
	this.isPaused = false;

	// stage
	this.stageWidth = window.innerWidth - this.guiWidth;
	this.stageHeight = window.innerHeight;
	this.stageOffsetX = ((window.innerWidth - this.stageWidth) * 0.5) | 0;
	this.stageOffsetY = ((window.innerHeight - this.stageHeight) * 0.5) | 0;

	// dat.gui
	this.gui = null;

	// stats
	// this.stats = new Stats();
	// this.stats.domElement.style.position = 'absolute';

	// 3d
	this.lilyPad3D = null;

	this.init = function() {
		this.traceFunction("init");
		this.createListeners();


		this.gui = new LILYPAD.Params("Params");
		this.gui.addEventListener("TOGGLE_VIEW", function() {
			scope.lilyPad3D.toggleWireFrame();
		});
		this.gui.createGui();

		this.lilyPad3D = new LILYPAD.LilyPad3D("LilyPad3D");
		this.lilyPad3D.addEventListener("MORPH_SHAPE", function() {
			// scope.gui.randomizeAllValues();
		});
		this.lilyPad3D.init();
		this.lilyPad3D.setDimensions(this.stageWidth,this.stageHeight);
		this.lilyPad3D.createEnvironment();
		this.lilyPad3D.createBackgroundElements();
		this.lilyPad3D.createForegroundElements();
		this.lilyPad3D.createListeners();
		

		this.gui.set3DScope(this.lilyPad3D);
		// this.gui.createListeners();

		this.loader = document.getElementById('loader');
		// document.body.appendChild(this.stats.domElement);

		// stop the user getting a text cursor
		document.onselectStart = function() {
			return false;
		};

		this.resize();
		this.play();
		return this;
	};


	this.update = function() {

		this.lilyPad3D.parse();
		this.lilyPad3D.draw();
		return this;
	};

	this.loop = function() {
		// this.stats.update();
		this.update();
		if (this.isPaused) {
			return this;
		}
		requestAnimationFrame(function() {
			scope.loop();
		});
		return this;
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
		this.lilyPad3D.enableTrackBall();
		this.loop();
		return this;
	};

	this.pause = function() {
		this.isPaused = true;
		this.lilyPad3D.disableTrackBall();
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
		this.stageWidth = window.innerWidth - LILYPAD.Params.guiWidth;
		this.stageHeight = window.innerHeight;

		this.lilyPad3D.setDimensions(this.stageWidth,this.stageHeight);
		this.lilyPad3D.resize();

		// this.stats.domElement.style.top = (10) + 'px';
		// this.stats.domElement.style.right = (LILYPAD.Params.guiWidth + 10) + 'px';

	};

};

LILYPAD.Main.prototype = new UNCTRL.BoilerPlate();
LILYPAD.Main.prototype.constructor = LILYPAD.Main;