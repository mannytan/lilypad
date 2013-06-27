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

		this.controls = new THREE.TrackballControls( this.camera, document.getElementById('container3D'));
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



		var i,j,id,
			particle,
			faceNormal;
		var totalVSegments = 11;
		var totalHSegments = 31;

		// backbone dots
		material = new THREE.ParticleBasicMaterial( { color: 0x660066, size: 3} );
		geometry = new THREE.Geometry();
		for(i = 0; i < totalVSegments; i++) {
			geometry.vertices.push(new THREE.Vector3());
		}
		for(i = 0; i < totalVSegments; i++) {
			geometry.vertices[i].x = 0;
			geometry.vertices[i].y = i/totalVSegments * 200 - 100;
			geometry.vertices[i].z = 0;
		}
		particles = new THREE.ParticleSystem( geometry, material );
		this.base.add(particles);

		// backbone line
		geometry = new THREE.Geometry();
		for(i = 0; i < totalVSegments; i++) {
			geometry.vertices.push(particles.geometry.vertices[i].clone());
		}
		material = new THREE.LineBasicMaterial({ color: 0x660000, transparent:true, opacity: 0.25 });
		line = new THREE.Line(geometry, material);
		this.base.add(line);

		var tri = new THREE.Mesh( geometry, material);
		this.base.add(tri);

		// totalHSegments accounts for duplicate wrap around
		geometry02 = new THREE.CylinderGeometry( 40, 40, 100, totalHSegments-1, totalVSegments-1, true);
		material02 = new THREE.MeshLambertMaterial( { color: 0x996633, shading:THREE.FlatShading, wireframe:false,transparent:false,opacity:.25} );
		material02.side = THREE.DoubleSide;
		cylinder02 = new THREE.Mesh( geometry02, material02 );
		this.base.add(cylinder02);

	};

	this.createListeners = function() {
		// this.container.addEventListener('mousedown', function(event) {
		// 	scope.mouseDown(event);
		// }, false);
	};

	this.parse = function() {
		this.base.rotation.z += SLICER.Params.orbitSpeed;

		var totalVSegments = 11;
		var totalHSegments = 31;

		var percentage;
		var xPos, ypos, zPos;
		id = 0;

		var radius = 100 - SLICER.Params.explode;
		for(j = 0; j < totalVSegments; j++) {
			for(i = 0; i < totalHSegments; i++) {
				percentage = i/(totalHSegments-1);
				xPos =  Math.cos(percentage*Math.PI*2) *100;
				yPos = j/totalVSegments * 200 - 100;
				zPos =  Math.sin(percentage*Math.PI*2) *100;

				if(i%2==1 && j%4==0){
					xPos =  Math.cos(percentage*Math.PI*2) *radius;
					zPos =  Math.sin(percentage*Math.PI*2) *radius;
				}

				if(i%2==0 && j%4==2){
					xPos =  Math.cos(percentage*Math.PI*2) *radius;
					zPos =  Math.sin(percentage*Math.PI*2) *radius;
				}

				cylinder02.geometry.vertices[id].x = xPos;
				cylinder02.geometry.vertices[id].y = yPos;
				cylinder02.geometry.vertices[id].z = zPos;
				id++;
			}
		}




		this.count+=0.0125;

	};

	this.draw = function() {
/*
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
*/
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