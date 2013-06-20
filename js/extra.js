/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 8/22/11
 */


FOLD.Fold3D = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Fold3D';

	// 3d vars
	this.container = null;
	this.projector = null;
	this.camera = null;
	this.scene = null;
	this.trackball = null;
	this.cube = null;

	this.stageWidth = 0;
	this.stageHeight = 0;
	this.stageOffsetX = 0;
	this.stageOffsetY = 0;

	this.line = null;
	this.vectorLine = null;
	this.lerpLine = null;
	this.cube = null;
	this.plane = null;



	this.totalRots = 100;
	this.startRList = null;
	this.endRList = null;

	this.pA = null;
	this.pB = null;

	this.count = 0;
	this.soundFreqData = null;

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

		// this.camera = new THREE.CombinedCamera(this.stageWidth / 2, this.stageHeight / 2, 70, 1, 2000, -2000, 2000, 2000);
		// this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000 );
		this.camera = new THREE.CombinedCamera(this.stageWidth / 2, this.stageHeight / 2, 70, 1, 2000, -2000, 2000, 2000);
		this.camera.position.x = 400;
		this.camera.position.y = 200;
		this.camera.position.z = 400;
		this.camera.toPerspective();
		this.scene.add(this.camera);

		// create a point light
		var pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.set(200,200,200);

		// add to the scene
		this.scene.add(pointLight);

/*
		// create a point light
		var pointLight2 = new THREE.PointLight(0xFFFFFF);
		pointLight2.intensity = 0.35;
		pointLight2.position.set(200,-200, -200);

		// add to the scene
		this.scene.add(pointLight2);
		*/
		

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
/*
		this.renderer = new THREE.CanvasRenderer({
			antialias: false
		});
*/
		this.renderer.setClearColorHex(0xEEEEEE, 1);
		this.renderer.setSize(this.stageWidth, this.stageHeight);

		this.container = document.getElementById('container3D');
		this.container.appendChild(this.renderer.domElement);

		// controls
		this.trackball = new THREE.TrackballControls(this.camera, this.container);
		this.trackball.rotateSpeed = 1.0;
		this.trackball.noZoom = true;
		this.trackball.noPan = true;
		this.trackball.staticMoving = false;
		this.trackball.dynamicDampingFactor = 0.2;
		// this.trackball.keys = [65, 83, 68];
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
			new THREE.Vertex(new THREE.Vector3(-200, 0, 0)), new THREE.Vertex(new THREE.Vector3(200, 0, 0))
		);
		this.base.remove(this.line);
		var line = new THREE.Line(geometry, material);
		line.type = THREE.Lines;
		this.base.add(line);

	};

	this.createForegroundElements = function() {

		// var startRList = [this.rA,this.rB,this.rC,this.rD];
		// var endRList = [this.rAA,this.rBB,this.rCC,this.rDD];

		var geometry,
			material;

		geometry = new THREE.PlaneGeometry( 1000, 1000, 20, 20 );
		material = new THREE.MeshBasicMaterial( { wireframe: true , opacity:0.125 } );
		material.color.setHSV( 0, 0.0, 0.5 );


		this.plane = new THREE.Mesh( geometry, material  );
		this.plane.rotation.x = - 90 * Math.PI / 180;
		this.scene.add( this.plane );


		this.startRList = [];
		this.endRList = [];
		var i,
			particle;
		for(i=0;i<this.totalRots;i++){
			geometry = new THREE.Geometry();
			geometry.vertices.push( new THREE.Vertex( new THREE.Vector3() ) );
			material = new THREE.ParticleBasicMaterial( { size: 4 } );
			material.color.setHSV( 0, 1.0, 0.5 );
			particle = new THREE.ParticleSystem( geometry, material );
			this.startRList.push(particle);
			this.base.add(particle);
/*
			particle.position.x = Math.random()*100 + 75;
			particle.position.y = Math.random()*100 + 120;
			particle.position.z = Math.random()*100 + 75;
*/
			particle.position.x = Math.random()*200;
			particle.position.y = Math.random()*200;
			particle.position.z = Math.random()*200;

			geometry = new THREE.Geometry();
			geometry.vertices.push( new THREE.Vertex( new THREE.Vector3() ) );
			material = new THREE.ParticleBasicMaterial( { size: 8, opacity:0.25 } );
			material.color.setHSV( 0, 1.0, 0.5 );
			particle = new THREE.ParticleSystem( geometry, material );
			this.endRList.push(particle);
			this.base.add(particle);
		}


		geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3() ) );
		material = new THREE.ParticleBasicMaterial( { size: 4 } );
		material.color.setHSV( 0, 1.0, 0.5 );
		this.rA = new THREE.ParticleSystem( geometry, material );
		this.base.add(this.rA);

		geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3() ) );
		material = new THREE.ParticleBasicMaterial( { size: 8, opacity:0.25 } );
		material.color.setHSV( 0, 1.0, 1.0 );
		this.rAA = new THREE.ParticleSystem( geometry, material );
		this.base.add(this.rAA);

		geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3() ) );
		material = new THREE.ParticleBasicMaterial( { size: 8 } );
		material.color.setHSV( 0.33, 1.0, 0.5 );
		this.pA = new THREE.ParticleSystem( geometry, material );
		this.base.add(this.pA);

		geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3() ) );
		material = new THREE.ParticleBasicMaterial( { size: 8 } );
		material.color.setHSV( 0.66, 1.0, 0.5 );
		this.pB = new THREE.ParticleSystem( geometry, material );
		this.base.add(this.pB);


		// vectorLine
		geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vertex(new THREE.Vector3()),
			new THREE.Vertex(new THREE.Vector3()),
			new THREE.Vertex(new THREE.Vector3()),
			new THREE.Vertex(new THREE.Vector3()),
			new THREE.Vertex(new THREE.Vector3()),
			new THREE.Vertex(new THREE.Vector3()),
			new THREE.Vertex(new THREE.Vector3()),
			new THREE.Vertex(new THREE.Vector3())
			);
		this.vectorLine = new THREE.Line(geometry, material);
		this.base.add(this.vectorLine);


		geometry = new THREE.Geometry();
		material = new THREE.ParticleBasicMaterial( );
		material.color.setHSV( 1.0, 0.5, 1.0 );
		for(i=0; i<30; i++){
			geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(Math.random()*50,Math.random()*50,Math.random()*50)));
		}
		this.lerpLine = new THREE.Line(geometry, material);
		this.base.add(this.lerpLine);

	};

	this.createListeners = function() {
		this.container.addEventListener('mousedown', function(event) {
			scope.mouseDown(event);
		}, false);
	};


	this.rotateAroundAxis = function(currentVector, vectorAxis, theta){
		var ax = vectorAxis.x,
			ay = vectorAxis.y,
			az = vectorAxis.z,

			ux = ax * currentVector.x,
			uy = ax * currentVector.y,
			uz = ax * currentVector.z,

			vx = ay * currentVector.x,
			vy = ay * currentVector.y,
			vz = ay * currentVector.z,

			wx = az * currentVector.x,
			wy = az * currentVector.y,
			wz = az * currentVector.z;

			si = Math.sin(theta);
			co = Math.cos(theta);

			var xx = (ax * (ux + vy + wz) + (currentVector.x * (ay * ay + az * az) - ax * (vy + wz)) * co + (-wy + vz) * si);
			var yy = (ay * (ux + vy + wz) + (currentVector.y * (ax * ax + az * az) - ay * (ux + wz)) * co + (wx - uz) * si);
			var zz = (az * (ux + vy + wz) + (currentVector.z * (ax * ax + ay * ay) - az * (ux + vy)) * co + (-vx + uy) * si);

		return (new THREE.Vector3(xx,yy,zz));

	};

	this.parse = function() {
		// this.base.rotation.z += FOLD.Params.orbitSpeed;

		this.pA.position.x = 75;
		this.pA.position.y = 120;
		this.pA.position.z = 75;

		this.pB.position.x = 0 + Math.cos(this.count*10)*10;
		this.pB.position.y = 150 + Math.sin(this.count*10)*10;
		this.pB.position.z = 50;

		this.rA.position.x = 50;
		this.rA.position.y = 100;
		this.rA.position.z = 150;

		var directionVector,
			tVector,
			start,
			end,
			i,
			vector;
			
		// convert ray data to vector by
		// offsetting postions (BC) to 0,0,0;
		this.pB.position.subSelf(this.pA.position);
		this.rA.position.subSelf(this.pA.position);

		// get axis by normalizing the array
		directionVector = this.pB.position.clone();
		directionVector.normalize();

		// use rotation conversion helper via toxiclibs
		for(i=0; i<30; i++){
			tVector = this.rotateAroundAxis(this.rA.position, directionVector, FOLD.Params.osc*Math.PI);
			tVector.addSelf(this.pA.position);
			this.lerpLine.geometry.vertices[i].position.copy(tVector);
		}

		for(i=0; i<this.totalRots; i++){
			start = this.startRList[i];
			end = this.endRList[i];
			start.position.subSelf(this.pA.position);
			tVector = this.rotateAroundAxis(start.position, directionVector, FOLD.Params.osc*Math.PI);
			tVector.addSelf(this.pA.position);

			end.position.copy(tVector);
			start.position.addSelf(this.pA.position);
		}

		vector = this.rotateAroundAxis(this.rA.position, directionVector, FOLD.Params.osc*Math.PI);
		this.rAA.position.x = vector.x;
		this.rAA.position.y = vector.y;
		this.rAA.position.z = vector.z;
		this.rAA.position.addSelf(this.pA.position);

		// make sure to add offset back
		this.rA.position.addSelf(this.pA.position);
		this.pB.position.addSelf(this.pA.position);


		this.count+=0.0125;

	};

	this.draw = function() {

		for(var i=0;i<this.totalRots;i++){
			this.startRList[i].geometry.__dirtyVertices = true;
			this.endRList[i].geometry.__dirtyVertices = true;
		}
				// draw data
		this.vectorLine.geometry.vertices[0].position.copy(this.rA.position);
		this.vectorLine.geometry.vertices[1].position.copy(this.pA.position);
		this.vectorLine.geometry.vertices[2].position.copy(this.pB.position);
		this.vectorLine.geometry.vertices[3].position.copy(this.rA.position);
		this.vectorLine.geometry.vertices[4].position.copy(this.pB.position);
		this.vectorLine.geometry.vertices[5].position.copy(this.rAA.position);
		this.vectorLine.geometry.vertices[6].position.copy(this.pA.position);
		this.vectorLine.geometry.vertices[7].position.copy(this.pB.position);

		this.rA.geometry.__dirtyVertices = true;
		this.rAA.geometry.__dirtyVertices = true;
		this.pA.geometry.__dirtyVertices = true;
		this.pB.geometry.__dirtyVertices = true;

		this.lerpLine.geometry.__dirtyVertices = true;
		this.vectorLine.geometry.__dirtyVertices = true;

		this.trackball.update();
		this.renderer.render(this.scene, this.camera);
	};

	this.mouseDown = function(event) {

		if (event.target === this.renderer.domElement) {
			// this.traceFunction("mouseDown");
			// created a ray that has the same vector as the camera and position of the cursor
			var x = event.clientX - this.stageOffsetX;
			var y = event.clientY - this.stageOffsetY;
			var v = new THREE.Vector3((x / this.stageWidth) * 2 - 1, -(y / this.stageHeight) * 2 + 1, 0.5);

			this.projector.unprojectVector(v, this.camera);
			var ray = new THREE.Ray(this.camera.position, v.subSelf(this.camera.position).normalize());
			var isNotTouching = (ray.intersectObject(this.base).length < 1);

			if (!isNotTouching) {
				// trace("isTouching");
			}
		}
	};

	this.hideElements = function(){

	};

	this.enableTrackBall = function() {
		this.trackball.enabled = true;
	};

	this.disableTrackBall = function() {
		this.trackball.enabled = false;
	};

	this.setDimensions = function(w, h) {
		this.stageWidth = w || 600;
		this.stageHeight = h || 600;

	};

	this.toPerspective = function() {
		this.camera.toPerspective();
	};

	this.toOrthographic = function() {
		this.camera.toOrthographic();
	};

	this.resize = function(width, height) {

		this.container.style.left = 0 + 'px';
		this.container.style.top = 0 + 'px';

		// this.fold3D.setDimensions(this.stageWidth,this.stageHeight);

		// this.renderer.setSize( this.stageWidth,this.stageHeight );
		// this.renderer.setViewport( 0, 0, this.stageWidth, this.stageHeight );
		this.camera.aspect	= this.stageHeight/this.stageWidth;
		this.container.appendChild(this.renderer.domElement);
		// this.camera.updateProjectionMatrix();

	};

};

FOLD.Fold3D.prototype = new UNCTRL.BoilerPlate();
FOLD.Fold3D.prototype.constructor = FOLD.Fold3D;