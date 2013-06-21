/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 03/20/12
 */

var SLICER = SLICER || {};


SLICER.Main = function(name) {
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
	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';

	// 3d
	this.slicer3D = null;

	this.init = function() {
		this.traceFunction("init");
		this.createListeners();

		this.gui = new SLICER.Params("Params");
		this.gui.createGui();

		this.slicer3D = new SLICER.Slicer3D("Slicer3D");
		this.slicer3D.init();
		this.slicer3D.setDimensions(this.stageWidth,this.stageHeight);
		this.slicer3D.createEnvironment();
		this.slicer3D.createBackgroundElements();
		this.slicer3D.createForegroundElements();
		this.slicer3D.createListeners();

		this.gui.set3DScope(this.slicer3D);
		this.gui.createListeners();

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


	this.update = function() {

		this.slicer3D.parse();
		this.slicer3D.draw();
		return this;
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
		this.stageWidth = window.innerWidth - SLICER.Params.guiWidth;
		this.stageHeight = window.innerHeight;

		this.slicer3D.setDimensions(this.stageWidth,this.stageHeight);
		this.slicer3D.resize();

		this.stats.domElement.style.top = (10) + 'px';
		this.stats.domElement.style.right = (SLICER.Params.guiWidth + 10) + 'px';

	};

};

SLICER.Main.prototype = new UNCTRL.BoilerPlate();
SLICER.Main.prototype.constructor = SLICER.Main;