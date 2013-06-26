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

function generateTexture() {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 256;
		canvas.height = 256;

		var context = canvas.getContext( '2d' );
		var image = context.getImageData( 0, 0, 256, 256 );

		var x = 0, y = 0;

		for ( var i = 0, j = 0, l = image.data.length; i < l; i += 4, j ++ ) {

			x = j % 256;
			y = x == 0 ? y + 1 : y;

			image.data[ i ] = 255;
			image.data[ i + 1 ] = 255;
			image.data[ i + 2 ] = 255;
			image.data[ i + 3 ] = Math.floor( x ^ y );

		}

		context.putImageData( image, 0, 0 );

		return canvas;

	}

	this.createForegroundElements = function() {



		var i,
			particle,
			faceNormal;

		this.points = [];
		this.total = (this.totalVInc+1)*(this.totalHInc+1);
		
		// topPlane
		geometry =  new THREE.PlaneGeometry( 200, 200 ,this.totalHInc,this.totalVInc);
		geometry.dynamic = true;
		material = new THREE.MeshBasicMaterial({color:0x000000, transparent: true, opacity:0.1, wireframe:true});
		this.topPlane = new THREE.Mesh( geometry, material);
		this.topPlane.doubleSided = false;
		this.topPlane.flipSided = true;
		this.base.add(this.topPlane);

		//  -------------------------------------
		//  draw center line
		//  -------------------------------------
		var directionVector = new THREE.Vector3(-50, 100, -20);
		var offsetVector = new THREE.Vector3(-10, 20, 10);

		material = new THREE.LineBasicMaterial({
			color: 0x006600,
			lineWidth: 1
		});
		geometry = new THREE.Geometry();
		geometry.vertices.push(
			offsetVector, 
			directionVector
		);
		var line = new THREE.Line(geometry, material);
		line.type = THREE.Lines;
		this.base.add(line);


		// planar
		geometry =  new THREE.PlaneGeometry( 100, 100 ,this.totalHInc,this.totalVInc);
		geometry.dynamic = true;
		material = new THREE.MeshBasicMaterial({color:0x006600, transparent: true, opacity:0.5, wireframe:true});
		var planar = null;
		planar = new THREE.Mesh( geometry, material);
		planar.doubleSided = false;
		planar.flipSided = true;
		this.base.add(planar);

		planar.position = (offsetVector);
		planar.lookAt(directionVector);



		// custom mesh created
		geometry = new THREE.Geometry()
		geometry.vertices.push( new THREE.Vector3( -50,  50, 30 ) ); // 0
		geometry.vertices.push( new THREE.Vector3( -100, -50, -50 ) ); // 1
		geometry.vertices.push( new THREE.Vector3(  50, -50, 50 ) ); // 2
		geometry.vertices.push( new THREE.Vector3(  100, -100, 20 ) ); // 3
		geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
		// geometry.computeBoundingSphere();

		material = new THREE.MeshBasicMaterial({color:0xFF0000, transparent: true, opacity:1.0, wireframe:true});


		var texture = new THREE.Texture( generateTexture() );
		texture.needsUpdate = true;

		var materials = [];

		materials.push( new THREE.MeshLambertMaterial( { map: texture, transparent: true } ) );
		materials.push( new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } ) );
		materials.push( new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } ) );
		materials.push( new THREE.MeshNormalMaterial( ) );
		materials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } ) );

		materials.push( new THREE.MeshBasicMaterial( { color: 0xff0000, blending: THREE.SubtractiveBlending } ) );
		materials.push( new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading } ) );
		materials.push( new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.SmoothShading, map: texture, transparent: true } ) );
		materials.push( new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading } ) );
		materials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ) );

		materials.push( new THREE.MeshDepthMaterial() );
		materials.push( new THREE.MeshDepthMaterial( { shading: THREE.SmoothShading } ) );
		materials.push( new THREE.MeshLambertMaterial( { color: 0x666666, emissive: 0xff0000, ambient: 0x000000, shading: THREE.SmoothShading } ) );
		materials.push( new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0xff0000, ambient: 0x000000, shininess: 10, shading: THREE.SmoothShading, opacity: 0.9, transparent: true } ) );
		materials.push( new THREE.MeshBasicMaterial( { map: texture, transparent: true } ) );


		var tri = new THREE.Mesh( geometry, material);
		this.base.add(tri);

		geometry02 = new THREE.CylinderGeometry( 150, 200, 75, 100, 20, true);
		material02 = new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } );		
		material02.side = THREE.DoubleSide;
		cylinder02 = new THREE.Mesh( geometry02, material02 );
		this.base.add(cylinder02);

		trace(		cylinder02.material.needsUpdate)
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

		var total = (cylinder02.geometry.vertices.length);
		var inc = .5;
		var incHalf = inc*.5;
		for(i=0;i<total;i++){
			cylinder02.geometry.vertices[i].x += Math.random()*inc-incHalf;
			cylinder02.geometry.vertices[i].y += Math.random()*inc-incHalf;
			cylinder02.geometry.vertices[i].z += Math.random()*inc-incHalf;
		}
		cylinder02.geometry.verticesNeedUpdate = true;

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