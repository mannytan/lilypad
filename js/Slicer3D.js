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


	this.customPlanes = null;
	this.customWirePlanes = null;


	this.particles = null;
	this.totalPlanesH = 32;
	this.totalPlanesV = 6;
	this.totalVerticesH = this.totalPlanesH*2 + 1;
	this.totalVerticesV = this.totalPlanesV*2 + 1;
	this.totalVertices = this.totalVerticesH * this.totalVerticesV;


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


		this.scene.add( new THREE.AmbientLight( 0xFF0000 ) );

		// create a point light
		var pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.set(300,300,300);
		this.scene.add(pointLight);

		pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.set(-300,300,-300);
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
		var geometry, 
			material;
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

		var i,j,k,id,
			particle,
			faceNormal, 
			geometry, 
			material;

		var percentage;

		// backbone dots
		material = new THREE.ParticleBasicMaterial( { color: 0x660066, size: 5} );
		geometry = new THREE.Geometry();
		for(i = 0; i < this.totalVertices; i++) {
			geometry.vertices.push(new THREE.Vector3());
		}
		
		this.particles = new THREE.ParticleSystem( geometry, material );
		// this.base.add(this.particles);


		// material = new THREE.ParticleBasicMaterial( { color: 0x6699FF, size: 10, wireframe:true} );
		// material = new THREE.MeshBasicMaterial( { color: 0x6699FF, wireframe:true} );
		// material = new THREE.MeshDepthMaterial( );
		// material = new THREE.MeshNormalMaterial( { color: 0x996633, shading:THREE.SmoothShading, wireframe:false} );
		// material = new THREE.MeshNormalMaterial( { color: 0x6699FF, wireframe:false, transparent:true, opacity:0.75, shading: THREE.FlatShading } )
		material = new THREE.MeshLambertMaterial( { 
			ambient: 0x030303, 
			color: 0x6699FF, 
			specular: 0x009900, 
			shininess: 30, 
			shading: THREE.FlatShading 
		} );

		// material = new THREE.MeshLambertMaterial( { color: 0x6699FF, wireframe:false, transparent:true, opacity:1.00, shading: THREE.FlatShading } );
		material.side = THREE.DoubleSide;
		this.customPlanes = [];
		for(i = 0; i < this.totalPlanesV; i++) {
			geometry = this.getCustomGeometry(this.totalPlanesH, i, i*30, 30);
			customPlane = new THREE.Mesh( geometry, material );
			this.base.add(customPlane);
			this.customPlanes.push(customPlane);
		}

		material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe:true, transparent:true, opacity:0.05, shading: THREE.FlatShading } )
		material.side = THREE.DoubleSide;
		this.customWirePlanes = [];
		for(i = 0; i < this.totalPlanesV; i++) {
			geometry = this.getCustomGeometry(this.totalPlanesH, i, i*30, 30);
			customPlane = new THREE.Mesh( geometry, material );
			this.base.add(customPlane);
			this.customWirePlanes.push(customPlane);
		}


	};


	// strip order is based on fold direction
	// 
	// strip order 1 	strip order 2 		totalPlanesH distribution
	// 0 - 3 - 6 		0 - 3 - 6 			1 plane = 3 + 6
	// | \ | / |		| / | \ | 			2 plane = 3 + 6 + 6
	// 1 - 4 - 7 		1 - 4 - 7 			3 plane = 3 + 6 + 6 + 6
	// | / | \ | 		| \ | / | 
	// 2 - 5 - 8 		2 - 5 - 8 
	this.getCustomGeometry = function(totalPlanesH, orderId, offset, height){
		var geometry = new THREE.Geometry();
		var id = 0;
		var percentage = 0;
		var i,j;
		var totalVertices = 3+(6)*totalPlanesH;
		var incV = 3;
		var incH = 1 + (2)*totalPlanesH;

		for(i = 0; i < totalVertices; i++) {
			geometry.vertices.push(new THREE.Vector3());
		}

		for(j = 0; j < incH; j++) {
			for(i = 0; i < incV; i++) {
				percentage = j/(incH-1.0)*TWO_PI;
				geometry.vertices[id].x = Math.sin(percentage)*100;
				geometry.vertices[id].y = i/(incV-1)*height + offset;
				geometry.vertices[id].z = Math.cos(percentage)*100;
				id++;
			}
		}

		if(orderId%2===0){
			for(j = 0; j < totalPlanesH; j++) {
				id = j*6;
				geometry.faces.push( new THREE.Face3( id+3, id+6, id+7 ) );
				geometry.faces.push( new THREE.Face3( id+3, id+7, id+4 ) );
				geometry.faces.push( new THREE.Face3( id+3, id+4, id+1 ) );
				geometry.faces.push( new THREE.Face3( id+3, id+1, id+0 ) );
				geometry.faces.push( new THREE.Face3( id+5, id+2, id+1 ) );
				geometry.faces.push( new THREE.Face3( id+5, id+1, id+4 ) );
				geometry.faces.push( new THREE.Face3( id+5, id+4, id+7 ) );
				geometry.faces.push( new THREE.Face3( id+5, id+7, id+8 ) );
			}
		} else {
			for(j = 0; j < totalPlanesH; j++) {
				id = j*6;
				geometry.faces.push( new THREE.Face3( id+4, id+1, id+0 ) );
				geometry.faces.push( new THREE.Face3( id+4, id+0, id+3 ) );
				geometry.faces.push( new THREE.Face3( id+4, id+3, id+6 ) );
				geometry.faces.push( new THREE.Face3( id+4, id+6, id+7 ) );

				geometry.faces.push( new THREE.Face3( id+4, id+7, id+8 ) );
				geometry.faces.push( new THREE.Face3( id+4, id+8, id+5 ) );
				geometry.faces.push( new THREE.Face3( id+4, id+5, id+2 ) );
				geometry.faces.push( new THREE.Face3( id+4, id+2, id+1 ) );
			}
		}

		geometry.computeFaceNormals(); 
		geometry.computeVertexNormals();
		return geometry;
	};


	this.createListeners = function() {
		// this.container.addEventListener('mousedown', function(event) {
		// 	scope.mouseDown(event);
		// }, false);
	};

	this.parse = function() {
		var i,j,k,id,
			particle,
			faceNormal, 
			geometry, 
			material;

		this.base.rotation.y += SLICER.Params.orbitSpeed;
		var multiplier = 10;
		var explode = 200 - SLICER.Params.explode*200;
		var explodeVertical = SLICER.Params.explode*multiplier;

		geometry = this.particles.geometry;
		id = 0;
		var heightCounter = -100;
		var heightExtra = 0;
		var ifOdd = null;
		var ifEven = null;
		for(j = 0; j < this.totalVerticesV; j++) {
			for(i = 0; i < this.totalVerticesH; i++) {
				// percentage = i/(this.totalVerticesH-1.0)*TWO_PI * ((1-SLICER.Params.explode) * 1.0 + 0.0 );
				percentage = i/(this.totalVerticesH-1.0)*TWO_PI;

				ifOdd = i%2==1;
				ifEven = i%2==0;

				heightExtra = 0;
				if(ifEven && j%4==0){
					heightExtra += explodeVertical;
				} else if(ifEven && j%4==2){
					heightExtra -= explodeVertical;
				} else if(ifOdd && j%4==2){
					heightExtra += explodeVertical;
				} else if(ifOdd && j%4==0){
					heightExtra -= explodeVertical;
				}
				
				if(ifEven && j%4==1 ){
					geometry.vertices[id].x = Math.sin(percentage)*explode;
					geometry.vertices[id].y = heightCounter+heightExtra;
					geometry.vertices[id].z = Math.cos(percentage)*explode;
				} else if(ifOdd && j%4==3){
					geometry.vertices[id].x = Math.sin(percentage)*explode;
					geometry.vertices[id].y = heightCounter+heightExtra;
					geometry.vertices[id].z = Math.cos(percentage)*explode;
				} else {
					geometry.vertices[id].x = Math.sin(percentage)*200;
					geometry.vertices[id].y = heightCounter+heightExtra;
					geometry.vertices[id].z = Math.cos(percentage)*200;
				}

				id++;
			}

			heightCounter += (multiplier*2-SLICER.Params.explode*multiplier);
		}

		// redraw
		// order is refactored to traverse from x -> y to y -> x
		var vertice;
		var particle;
		var kOffset, jOffset, iOffset;
		var verticesPerPlane = this.totalPlanesH*4+2;

		for(k = 0; k < this.totalPlanesV; k++) {
			id = 0;
			for(j = 0; j < this.totalVerticesH; j++) {
				for(i = 0; i < 3; i++) {
					kOffset = k * (verticesPerPlane);
					jOffset = i * this.totalVerticesH;
					iOffset = j;
					this.customPlanes[k].geometry.vertices[id].copy(
						this.particles.geometry.vertices[kOffset + jOffset + iOffset]);
					this.customWirePlanes[k].geometry.vertices[id].copy(
						this.particles.geometry.vertices[kOffset + jOffset + iOffset]);
					id++;
				}
			}
		}
		this.count+=0.0125;

	};

	this.draw = function() {

		this.particles.geometry.verticesNeedUpdate = true;
		// update shapes
		for(i = 0; i < this.customPlanes.length; i++) {
			this.customPlanes[i].geometry.verticesNeedUpdate = true;
			this.customWirePlanes[i].geometry.verticesNeedUpdate = true;

		}
		
		
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