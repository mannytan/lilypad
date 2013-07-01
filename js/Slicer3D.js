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

	// vars specific to slicer3D
	this.totalVSegments = 5;
	this.totalHSegments = 11; // must be odd

	this.cylinder = null;
	this.customPlane = null;

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

		var i,j,id,
			particle,
			faceNormal, 
			geometry, 
			material;
/*
		// backbone dots
		material = new THREE.ParticleBasicMaterial( { color: 0x660066, size: 3} );
		geometry = new THREE.Geometry();
		for(i = 0; i < this.totalVSegments; i++) {
			geometry.vertices.push(new THREE.Vector3());
		}
		for(i = 0; i < this.totalVSegments; i++) {
			geometry.vertices[i].x = 0;
			geometry.vertices[i].y = i/this.totalVSegments * 200 - 100;
			geometry.vertices[i].z = 0;
		}
		particles = new THREE.ParticleSystem( geometry, material );
		this.base.add(particles);

		// backbone line
		geometry = new THREE.Geometry();
		for(i = 0; i < this.totalVSegments; i++) {
			geometry.vertices.push(particles.geometry.vertices[i].clone());
		}
		material = new THREE.LineBasicMaterial({ color: 0x660000, transparent:true, opacity: 0.25 });
		line = new THREE.Line(geometry, material);
		this.base.add(line);

		var tri = new THREE.Mesh( geometry, material);
		this.base.add(tri);
*/
		// this.totalHSegments accounts for duplicate wrap around
		geometry = new THREE.CylinderGeometry( 40, 40, 100, this.totalHSegments-1, this.totalVSegments-1, true);
		material = new THREE.MeshLambertMaterial( { color: 0x996633, shading:THREE.SmoothShading, wireframe:false} );
		material.side = THREE.DoubleSide;
		this.cylinder = new THREE.Mesh( geometry, material );
		// this.base.add(this.cylinder);

		// custom cylinder

		material = new THREE.MeshBasicMaterial( { color: 0x6699FF, wireframe:true,transparent:false,opacity:.25} );
		
		geometry = new THREE.Geometry()
		geometry.vertices.push( new THREE.Vector3( -50,  50, 0 ) );
		geometry.vertices.push( new THREE.Vector3( -50, -50, 0 ) );
		geometry.vertices.push( new THREE.Vector3(  50, -50, 0 ) );
		geometry.vertices.push( new THREE.Vector3(  50, 50, 0 ) );
		geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
		geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
		// geometry.computeBoundingSphere();
		// customPlane = new THREE.Mesh( geometry, material );
		// this.base.add(customPlane);


		// strip order 1
		// 0 - 3 - 6
		// | \ | / |
		// 1 - 4 - 7
		// | / | \ |
		// 2 - 5 - 8

		// strip order 2
		// 0 - 3 - 6
		// | / | \ |
		// 1 - 4 - 7
		// | \ | / |
		// 2 - 5 - 8

		// 1 plane = 3 + 6
		// 2 plane = 3 + 6 + 6
		// 3 plane = 3 + 6 + 6 + 6

		this.getCustomGeometry = function(totalPlanesH, orderId, offset){
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
					percentage = j/(incH-1)*TWO_PI;
					geometry.vertices[id].x = Math.sin(percentage)*100;
					geometry.vertices[id].y = i*10 + offset;
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

			// geometry.computeBoundingSphere();
			geometry.computeFaceNormals(); 
			geometry.computeVertexNormals();
			return geometry;
		}

		var totalPlanesH = 40;
		var totalPlanesV = 6;
		var ODD = 1;
		var EVEN = 2;

		// material = new THREE.ParticleBasicMaterial( { color: 0x6699FF, size: 10, wireframe:true} );
		// material = new THREE.MeshBasicMaterial( { color: 0x6699FF, wireframe:true} );
		// material = new THREE.MeshDepthMaterial( );
		// material = new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } )
		material = new THREE.MeshNormalMaterial( { color: 0x996633, shading:THREE.SmoothShading, wireframe:false} );
		material.side = THREE.DoubleSide;
		for(i = 0; i < totalPlanesV; i++) {
			geometry = this.getCustomGeometry(totalPlanesH, i,i*20);
			this.customPlane = new THREE.Mesh( geometry, material );
			this.base.add(this.customPlane);
		}

/*
		geometry = new THREE.Geometry();

		for(i = 0; i < totalVertices; i++) {
			geometry.vertices.push(new THREE.Vector3());
		}

		var id = 0;
		var percentage = 0;
		for(j = 0; j < incH; j++) {
			for(i = 0; i < incV; i++) {
				percentage = j/(incH-.9)*TWO_PI;
				geometry.vertices[id].x = Math.sin(percentage)*100;
				geometry.vertices[id].y = i*20;
				geometry.vertices[id].z = Math.cos(percentage)*100;
				id++;
			}
		}

		for(j = 0; j < totalPlanesH; j++) {
			id = j*6;
			geometry.faces.push( new THREE.Face3( id+3, id+0, id+1 ) );
			geometry.faces.push( new THREE.Face3( id+3, id+1, id+4 ) );
			geometry.faces.push( new THREE.Face3( id+3, id+4, id+7 ) );
			geometry.faces.push( new THREE.Face3( id+3, id+7, id+6 ) );
			geometry.faces.push( new THREE.Face3( id+5, id+8, id+7 ) );
			geometry.faces.push( new THREE.Face3( id+5, id+7, id+4 ) );
			geometry.faces.push( new THREE.Face3( id+5, id+4, id+1 ) );
			geometry.faces.push( new THREE.Face3( id+5, id+1, id+2 ) );
		}
		/*
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
		*/
		/*
		// particles = new THREE.ParticleSystem( geometry, material );
		this.customPlane = new THREE.Mesh( geometry, material );
		this.base.add(this.customPlane);
		*/
	};






	this.createListeners = function() {
		// this.container.addEventListener('mousedown', function(event) {
		// 	scope.mouseDown(event);
		// }, false);
	};

	this.parse = function() {
		this.base.rotation.z += SLICER.Params.orbitSpeed;

		var percentage;
		var xPos, ypos, zPos;
		id = 0;

		var radius = 100 - SLICER.Params.explode;
		var radiusVertical = SLICER.Params.explodeVertical;

		// calculates for every other totalHSegments
		// using peaks and valley analogy
		// peaks are the flat plateau part, valleys are the dynamic element 
		var ifEvenVertValley;
		var ifOddVertValley;
		var vertCounter = 0;
		var vertCounterIncement = 1/(this.totalHSegments-1)*300;
		for(j = 0; j < this.totalVSegments; j++) {
			for(i = 0; i < this.totalHSegments; i++) {
				percentage = i/(this.totalHSegments-1);
				xPos =  Math.cos(percentage*Math.PI*2) *100;
				yPos = vertCounter
				zPos =  Math.sin(percentage*Math.PI*2) *100;

				ifEvenVertValley = i%2==1 && j%4==0;
				ifOddVertValley = i%2==0 && j%4==2;

				if(ifEvenVertValley){
					xPos =  Math.cos(percentage*Math.PI*2) *radius;
					zPos =  Math.sin(percentage*Math.PI*2) *radius;
				}


				if(ifOddVertValley){
					xPos =  Math.cos(percentage*Math.PI*2) *radius;
					zPos =  Math.sin(percentage*Math.PI*2) *radius;
				}

				this.cylinder.geometry.vertices[id].x = xPos;
				this.cylinder.geometry.vertices[id].y = yPos;
				this.cylinder.geometry.vertices[id].z = zPos;
				id++;
			}

			if(j == 3){
				vertCounter += vertCounterIncement;
			} else {
				vertCounter += vertCounterIncement;
			}
		}

		this.count+=0.0125;

	};

	this.draw = function() {
/*
		var i,
			particle,
			pointsTotal = this.points.length;

		var total = (this.cylinder.geometry.vertices.length);
		var inc = .5;
		var incHalf = inc*.5;
		for(i=0;i<total;i++){
			this.cylinder.geometry.vertices[i].x += Math.random()*inc-incHalf;
			this.cylinder.geometry.vertices[i].y += Math.random()*inc-incHalf;
			this.cylinder.geometry.vertices[i].z += Math.random()*inc-incHalf;
		}
*/
		this.cylinder.geometry.verticesNeedUpdate = true;
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