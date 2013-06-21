/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 8/22/11
 */


SLICER.Slicer3D = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Slicer3D';

	// 3d vars
	this.container = null;
	this.projector = null;
	this.camera = null;
	this.scene = null;
	this.controls = null;
	this.cube = null;

	this.stageWidth = 0;
	this.stageHeight = 0;
	this.stageOffsetX = 0;
	this.stageOffsetY = 0;

	this.count = 0;

	// vars specific to plane
	this.total = 0;
	this.totalVInc = 10;
	this.totalHInc = 10;
	this.points = null;


	this.init = function() {
		this.traceFunction("init");
		return this;
	};

	this.createEnvironment = function() {
		// this.traceFunction("createEnvironment");

		this.projector = new THREE.Projector(); // used for mouse position in 3d space
		this.scene = new THREE.Scene();
		this.base = new THREE.Object3D();
		this.scene.add(this.base);

		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
		this.camera.position.x = 100;
		this.camera.position.y = 50;
		this.camera.position.z = 400;

		this.controls = new THREE.TrackballControls( this.camera );
		this.controls.rotateSpeed = 1.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = true;
		this.controls.dynamicDampingFactor = 0.3;
		this.controls.keys = [ 65, 83, 68 ];


		// create a point light
		var pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.set(200,200,200);

		// add to the scene
		this.scene.add(pointLight);

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});

		this.renderer.setClearColor(0xEEEEEE, 1);
		this.renderer.setSize(this.stageWidth, this.stageHeight);

		this.container = document.getElementById('container3D');
		this.container.appendChild(this.renderer.domElement);

		trace(this.controls);
		trace(this.container);
		trace(document.body)

		// this.container.addEventListener('mousedown', this.element_mouseDown);

	};
	this.element_mouseDown = function(e){
		trace("element_mouseDown")
	};
	this.resetTrackBall = function(){

	};
	this.createBackgroundElements = function() {
		// create box
		var color = 0x000000;
		var width = 600;
		var height = 600;
		var depth = 600;
		//  -------------------------------------
		//  draw cube
		//  -------------------------------------
		this.base.remove(this.cube);
		material = new THREE.MeshBasicMaterial({
			color: color,
 			transparent: true,
 			opacity: 0.05,
			wireframe:true
		});
		geometry = new THREE.CubeGeometry(width, height, depth);
		this.cube = new THREE.Mesh(geometry, material);

		this.base.add(this.cube);


		//  -------------------------------------
		//  draw center line
		//  -------------------------------------
		material = new THREE.LineBasicMaterial({
			color: 0x000000,
			lineWidth: 1
		});
		geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3(0, 0, 200), 
			new THREE.Vector3(0, 0, -200)
		);
		this.base.remove(this.line);
		var line = new THREE.Line(geometry, material);
		line.type = THREE.Lines;
		this.base.add(line);

	};

	this.createForegroundElements = function() {

		var i,
			particle,
			faceNormal;

		this.points = [];
		this.total = (this.totalVInc+1)*(this.totalHInc+1);
		
		// plane
		geometry =  new THREE.PlaneGeometry( 200, 200 ,this.totalHInc,this.totalVInc);
		geometry.dynamic = true;
		material = new THREE.MeshBasicMaterial({color:0x000000, transparent: true, opacity:0.1, wireframe:true});
		this.topPlane = new THREE.Mesh( geometry, material);
		this.topPlane.doubleSided = false;
		this.topPlane.flipSided = true;
		this.base.add(this.topPlane);

	};

	this.createListeners = function() {
		// this.container.addEventListener('mousedown', function(event) {
		// 	scope.mouseDown(event);
		// }, false);
	};

	this.parse = function() {
		this.base.rotation.z += SLICER.Params.orbitSpeed;

		this.count+=0.0125;

	};

	this.draw = function() {

		var i,
			particle,
			pointsTotal = this.points.length;

		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	};

	this.enableTrackBall = function() {
		this.controls.enabled = true;
	};

	this.disableTrackBall = function() {
		this.controls.enabled = false;
	};

	this.setDimensions = function(w, h) {
		this.stageWidth = w || 600;
		this.stageHeight = h || 600;
	};


	this.resize = function() {

		this.camera.aspect = this.stageWidth / this.stageHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.stageWidth, this.stageHeight );
		this.controls.handleResize();

	};

};

SLICER.Slicer3D.prototype = new UNCTRL.BoilerPlate();
SLICER.Slicer3D.prototype.constructor = SLICER.Slicer3D;