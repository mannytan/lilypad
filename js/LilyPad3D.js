/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 8/22/11
 */


LILYPAD.LilyPad3D = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'LilyPad3D';

	// 3d vars
	this.container = null;
	this.projector = null;
	this.camera = null;
	this.scene = null;
	this.raycaster = null;
	this.intersected = null;
	this.controls = null;
	this.cube = null;

	this.stageWidth = 0;
	this.stageHeight = 0;
	this.stageOffsetX = 0;
	this.stageOffsetY = 0;

	this.count = 0;
	this.centerCount = 0;

	this.pointLightA = null;

	this.customPlanes = null;
	this.customWirePlanes = null;
	this.water = null;
	this.ground = null;

	this.particles = null;

	this.totalPlanesH = getUrlVars()["totalWidth"] ? getUrlVars()["totalWidth"] : 28;
	this.totalPlanesV = getUrlVars()["totalDepth"] ? getUrlVars()["totalDepth"] : 12;
	this.totalVerticesH = this.totalPlanesH*2 + 1;
	this.totalVerticesV = this.totalPlanesV*2 + 1;
	this.totalVertices = this.totalVerticesH * this.totalVerticesV;

	this.maxHeightCache = null;
	this.maxHeightCacheSize = 20;

	this.colorOffset = .5;

	this.stirLine = null;

	this.halo = null;
	this.sphereTop = null;
	this.sphereBottom = null;

	this.init = function() {
		this.traceFunction("init");

		// this.perlin = new ClassicalNoise();
		this.perlin = new SimplexNoise();

		return this;
	};

	this.createEnvironment = function() {
		// this.traceFunction("createEnvironment");

		this.projector = new THREE.Projector(); // used for mouse position in 3d space
		this.scene = new THREE.Scene();
		this.base = new THREE.Object3D();
		this.scene.add(this.base);

		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 3000 );
		this.camera.position.x = 0;
		this.camera.position.y = 300;
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

		this.scene.add( new THREE.AmbientLight( 0xCCCCCC ) );

		var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 300, 0 );
		this.scene.add( hemiLight );

		this.dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
		// this.dirLight.color.setHSL( 0.1, 1, 0.95 );
		this.dirLight.position.set( -1, 1.75, 1 );
		this.dirLight.position.multiplyScalar( 100 );
		this.scene.add( this.dirLight );

		this.dirLight.castShadow = true;
		this.dirLight.shadowMapWidth = 3500;
		this.dirLight.shadowMapHeight = 3500;

		var d = 800;

		this.dirLight.shadowCameraLeft = -d;
		this.dirLight.shadowCameraRight = d;
		this.dirLight.shadowCameraTop = d;
		this.dirLight.shadowCameraBottom = -d;

		this.dirLight.shadowCameraFar = 3500;
		this.dirLight.shadowBias = -0.0001;
		this.dirLight.shadowDarkness = 0.35;
		// this.dirLight.shadowCameraVisible = true;

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});

		this.renderer.setClearColor(0xEEEEEE, 1);
		this.renderer.setSize(this.stageWidth, this.stageHeight);

		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.physicallyBasedShading = true;

		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapCullFace = THREE.CullFaceBack;

		this.container = document.getElementById('container3D');
		this.container.appendChild(this.renderer.domElement);

		// this.container.addEventListener('mousedown', this.element_mouseDown);

	};

	this.createListeners = function() {
		this.container.addEventListener('mousedown', function(event) {
			scope.onDocumentMouseDown(event);
		}, false);
		
	};

	this.onDocumentMouseDown = function(event) {
		event.preventDefault();

		var mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / (window.innerWidth-LILYPAD.Params.guiWidth) ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
		this.projector.unprojectVector( vector, this.camera );
		var raycaster = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
		var intersects = raycaster.intersectObjects( [this.water] );
		if ( intersects.length > 0 ) {
			this.dispatchEvent("MORPH_SHAPE",[]);
		} else {

		}
	};


	this.createBackgroundElements = function() {
		// create box
		var color = 0x000000;
		var width = 1000;
		var height = 600;
		var depth = 1000;
		var geometry, 
			material;

		var colorSpeed = LILYPAD.Params.colorSpeed;
		var colorRange = LILYPAD.Params.colorRange;

		//  -------------------------------------
		//  draw cube
		//  -------------------------------------
		this.base.remove(this.cube);
		material = new THREE.MeshBasicMaterial({
			color: 0x000000,
			transparent: true,
			opacity: 0.05,
			wireframe:true
		});
		geometry = new THREE.CubeGeometry(width, height, depth);
		this.cube = new THREE.Mesh(geometry, material);
		// this.base.add(this.cube);

		// water
		material = new THREE.MeshPhongMaterial( { 
			ambient: 0x333333, 
			color: new THREE.Color().setHSL( (1*colorRange + colorSpeed)%1 , 1, .5), 
			side:THREE.DoubleSide,
			transparent: true,
			opacity: .9,
			specular: 0x050505
			 } );
		geometry = new THREE.PlaneGeometry( width*10, depth*10 ,100,100);

		this.water = new THREE.Mesh( geometry, material );
		this.water.rotation.x = -Math.PI/2;
		this.water.position.y = -100;
		this.base.add( this.water );
		this.water.receiveShadow = true;

		// ground
		material = new THREE.MeshPhongMaterial( { 
			ambient: 0x333333, 
			color: new THREE.Color().setHSL( (1*colorRange + colorSpeed)%1 , .5, .125), 
			side:THREE.DoubleSide,
			transparent: true,
			opacity: .9,
			specular: 0x050505 } );
		geometry = new THREE.PlaneGeometry( width*10, depth*10 );

		this.ground = new THREE.Mesh( geometry, material );
		this.ground.rotation.x = -Math.PI/2;
		this.ground.position.y = -height*0.5;
		this.base.add( this.ground );

		this.ground.receiveShadow = true;


	};

	this.createForegroundElements = function() {

		var i,j,k,id,
			particle,
			faceNormal, 
			geometry, 
			material;

		var percentage;

		// backbone dots
		material = new THREE.ParticleBasicMaterial( { color: 0xFFFFFF, size: 1} );
		geometry = new THREE.Geometry();
		for(i = 0; i < this.totalVertices; i++) {
			geometry.vertices.push(new THREE.Vector3());
		}
		
		this.particles = new THREE.ParticleSystem( geometry, material );
		this.base.add(this.particles);
		this.particles.visible = false;

		var colorSpeed = LILYPAD.Params.colorSpeed;
		var colorRange = LILYPAD.Params.colorRange;

		this.customPlanes = [];
		for(i = 0; i < this.totalPlanesV; i++) {
			geometry = this.getCustomGeometry(this.totalPlanesH, i, i*30, 30);
			// main plane
			material = new THREE.MeshLambertMaterial( { 
				ambient: 0x000000, 
				color: new THREE.Color().setHSL( (i/this.totalPlanesV*colorRange + colorSpeed)%1 , 1, .5), 
				specular: 0x336699, 
				shininess: 30, 
				shading: THREE.SmoothShading,
				side:THREE.DoubleSide
			});

			customPlane = new THREE.Mesh( geometry, material );
			customPlane.castShadow = true;
			customPlane.receiveShadow = true;
			this.base.add(customPlane);
			this.customPlanes.push(customPlane);
		}

		var cache = [];
		for(i = 0; i < this.maxHeightCacheSize; i++) {
			cache.push(0);
		};
		this.maxHeightCache = [];
		var id = 0;
		for(j = 0; j < this.totalVerticesV; j++) {
			for(i = 0; i < this.totalVerticesH; i++) {
				this.maxHeightCache.push(cache.slice());
				id++;
			}
		}

		// wireframe plane
		material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe:true, transparent:true, opacity:0.05 } )
		material.side = THREE.DoubleSide;
		this.customWirePlanes = [];
		for(i = 0; i < this.totalPlanesV; i++) {
			geometry = this.getCustomGeometry(this.totalPlanesH, i, i*30, 30);
			customPlane = new THREE.Mesh( geometry, material );
			this.base.add(customPlane);
			customPlane.visible = false;
			this.customWirePlanes.push(customPlane);
		}

		//  -------------------------------------
		//  draw stir line
		//  -------------------------------------
		material = new THREE.LineBasicMaterial({ color: 0xFFFFFF, wireframe:true, linewidth:.5 });
		geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3(0, 100, 0), 
			new THREE.Vector3(0, 0, 0 )
		);
		this.stirLine = new THREE.Line(geometry, material);
		this.stirLine.type = THREE.Lines;
		this.base.add(this.stirLine);

		material = new THREE.LineBasicMaterial({ color: 0xFFFFFF, wireframe:true, linewidth:.5});
		geometry = new THREE.Geometry();
		for(i = 0; i < this.totalVerticesH; i++) {
			geometry.vertices.push(new THREE.Vector3(Math.random()*100-50, Math.random()*100-50, Math.random()*100-50 ));
		}

		this.halo = new THREE.Line( geometry, material );
		this.halo.type = THREE.LineStrip;
		this.base.add(this.halo);

		//  -------------------------------------
		//  sphere
		//  -------------------------------------
		geometry = new THREE.SphereGeometry( 1, 5, 5 );
		material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe:true, linewidth:.5 } )
		
		this.sphereBottom = new THREE.Mesh( geometry, material );
		this.base.add(this.sphereBottom);

		this.sphereTop = new THREE.Mesh( geometry, material );
		// this.base.add(this.sphereTop);

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

	this.toggleWireFrame = function(){

		var i,total = this.customPlanes.length;
		if (this.particles.visible===false){
			this.particles.visible = true;
			this.water.visible = false;
			for(i=0;i<total;i++){
				this.customWirePlanes[i].visible = true;
				this.customPlanes[i].visible = false;
			}
		} else {
			this.particles.visible = false;
			this.water.visible = true;
			for(i=0;i<total;i++){
				this.customWirePlanes[i].visible = false;
				this.customPlanes[i].visible = true;
			}
		}

	};

	this.parse = function() {
		var i,j,k,id,
			particle,
			faceNormal, 
			geometry, 
			material;

		this.base.rotation.y += LILYPAD.Params.orbitSpeed;

		var centerSpeed = LILYPAD.Params.centerSpeed*.1;
		var noiseSpeed = LILYPAD.Params.noiseSpeed;
		var noiseAmount = LILYPAD.Params.noiseAmount;
		var noiseIntensity = LILYPAD.Params.noiseIntensity;
		var multiplier = LILYPAD.Params.multiplier;
		var centerRadius = LILYPAD.Params.centerRadius;
		var centerOffset = LILYPAD.Params.centerOffset;

		var waterHeight = LILYPAD.Params.waterHeight;
		var outerRadius = LILYPAD.Params.radius;
		var radiusRange = LILYPAD.Params.radiusRange;
		var wrapAmount = LILYPAD.Params.wrapAmount;
		var spikes = 0;
		var maxHeight = 0;

		var heightCountIncrement = (multiplier*2-multiplier)

		var heightOffset = LILYPAD.Params.heightOffset;
		var maxHeightRange = LILYPAD.Params.maxHeightRange;
		var heightCounter = -(this.totalVerticesV-1)*.5 * heightCountIncrement;

		var heightExtra = 0;
		var isOdd = null;
		var isEven = null;

		var centerX, centerY, centerZ;

		var wrappOffset = (1-wrapAmount)*TWO_PI*.5;
		var wrappMultiplier = (wrapAmount);
		var a, b;

		geometry = this.particles.geometry;
		id = 0;

		for(j = 0; j < this.totalVerticesV; j++) {
			for(i = 0; i < this.totalVerticesH; i++) {

				// fold specifically meant to account for tiling along a polar/clynidrical map
				// http://www.sjeiti.com/creating-tileable-noise-maps/
				percentage = ((i+this.count)/(this.totalVerticesH-1))*TWO_PI;
				fold = this.perlin.noise3d( Math.cos(percentage)*noiseAmount, Math.sin(percentage)*noiseAmount, (j/this.totalVerticesV+this.count));
				fold *= noiseIntensity;

				// spikes calculation
				outerRadius = LILYPAD.Params.radius - j/(this.totalVerticesV-1)*radiusRange * LILYPAD.Params.radius;
				spikes = outerRadius - fold*outerRadius;
				maxHeight = fold*multiplier*10;
				heightCountIncrement = (multiplier*2-multiplier)

				isOdd = i%2==1;
				isEven = i%2==0;

				// center radius motion
				percentage = (j/this.totalVerticesV+this.centerCount)*TWO_PI;
				centerX = Math.cos(percentage)*centerRadius*(j/this.totalVerticesV*2-1 + centerOffset);
				centerZ = Math.sin(percentage)*centerRadius*(j/this.totalVerticesV*2-1 + centerOffset);

				heightExtra = 0;
				if(isEven && j%4==0){
					heightExtra += maxHeight;
				} else if(isEven && j%4==2){
					heightExtra -= maxHeight;
				} else if(isOdd && j%4==2){
					heightExtra += maxHeight;
				} else if(isOdd && j%4==0){
					heightExtra -= maxHeight;
				}

				percentage = i/(this.totalVerticesH-1.0) * TWO_PI * wrappMultiplier + wrappOffset;

				if(isEven && j%4==1 || isOdd && j%4==3){
					geometry.vertices[id].x = Math.sin(percentage)*outerRadius + centerX;
					// geometry.vertices[id].y = maxHeight; //heightCounter+heightExtra;
					geometry.vertices[id].y = maxHeight + this.maxHeightCache[id][0]; //heightCounter+heightExtra;
					geometry.vertices[id].z = Math.cos(percentage)*outerRadius + centerZ;

				} else {
					geometry.vertices[id].x = Math.sin(percentage)*outerRadius + centerX;
					// geometry.vertices[id].y = this.maxHeightCache[id][this.maxHeightCacheSize-1]; //heightCounter+heightExtra;
					geometry.vertices[id].y = maxHeight*maxHeightRange + heightOffset; //heightCounter+heightExtra;
					geometry.vertices[id].z = Math.cos(percentage)*outerRadius + centerZ;
				}

				id++;
			}

			heightCounter += heightCountIncrement;
		}

		percentage = (this.centerCount)*TWO_PI;
		centerX = Math.cos(percentage)*centerRadius*(j/this.totalVerticesV*2-1 + centerOffset);
		centerZ = Math.sin(percentage)*centerRadius*(j/this.totalVerticesV*2-1 + centerOffset);

		// adjusts color
		this.colorOffset += LILYPAD.Params.colorSpeed;
		var colorRange = LILYPAD.Params.colorRange;

		for(i = 0; i < this.totalPlanesV; i++) {
			this.customPlanes[i].material.color = new THREE.Color().setHSL( (i/this.totalPlanesV*colorRange + this.colorOffset)%1 , .75, .5);
		}
		this.water.material.color =  new THREE.Color().setHSL( (1*(colorRange) + this.colorOffset+.125)%1 , 1, .25);
		this.ground.material.color =  new THREE.Color().setHSL( (1*(colorRange) + this.colorOffset+.125)%1 , .5, .05);

		var clearColor =  new THREE.Color().setHSL( (1*(colorRange) + this.colorOffset+.15)%1 , 1.0, .75);
		this.renderer.setClearColor(clearColor);


		// assigns vertices from particles to planes
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
					this.customPlanes[k].geometry.vertices[id].copy( this.particles.geometry.vertices[kOffset + jOffset + iOffset]);
					this.customWirePlanes[k].geometry.vertices[id].copy( this.particles.geometry.vertices[kOffset + jOffset + iOffset]);
					id++;
				}
			}
		}

		var scalar = 4;//centerRadius*centerOffset;

		// waterHeight = maxHeight*maxHeightRange + heightOffset; //heightCounter+heightExtra;
		// waterHeight = heightCounter+heightExtra; 


		outerRadius = LILYPAD.Params.radius - LILYPAD.Params.radius*radiusRange;
		for(j = 0; j < this.totalVerticesH; j++) {
			percentage = j/(this.totalVerticesH-1)*TWO_PI;


			// percentage = ((i+this.count)/(this.totalVerticesH-1))*TWO_PI;
			fold = this.perlin.noise3d( Math.cos(percentage)*noiseAmount, Math.sin(percentage)*noiseAmount, (this.count));
			fold *= noiseIntensity*.5;

			// spikes calculation
			outerRadius = LILYPAD.Params.radius*1.125 - radiusRange * LILYPAD.Params.radius;
			spikes = outerRadius - fold*outerRadius;
			maxHeight = fold*multiplier;

			this.halo.geometry.vertices[j].x = Math.cos(percentage)*outerRadius + 0;
			this.halo.geometry.vertices[j].y = 200 + maxHeight;//200 + waterHeight;
			this.halo.geometry.vertices[j].z = Math.sin(percentage)*outerRadius + 0;
		}

		percentage = (this.centerCount)*TWO_PI;

		fold = this.perlin.noise3d( Math.cos(percentage)*noiseAmount, Math.sin(percentage)*noiseAmount, (this.count));
		fold *= noiseIntensity;
		outerRadius = LILYPAD.Params.radius*1.125 - radiusRange * LILYPAD.Params.radius;
		spikes = outerRadius - fold*outerRadius;
		maxHeight = fold*multiplier*.5;

		this.sphereTop.position.x = Math.cos(percentage)*outerRadius + 0;
		this.sphereTop.position.y = 200 + maxHeight;//200+waterHeight;
		this.sphereTop.position.z = Math.sin(percentage)*outerRadius + 0;

		this.stirLine.geometry.vertices[0].x = centerX;
		this.stirLine.geometry.vertices[0].y = 200 + maxHeight;
		this.stirLine.geometry.vertices[0].z = centerZ;

		this.stirLine.geometry.vertices[1].x = this.sphereTop.position.x;
		this.stirLine.geometry.vertices[1].y = this.sphereTop.position.y;
		this.stirLine.geometry.vertices[1].z = this.sphereTop.position.z;

		this.sphereBottom.position.x = centerX;
		this.sphereBottom.position.y = 200 + maxHeight;
		this.sphereBottom.position.z = centerZ;


		this.centerCount+= centerSpeed;
		this.count+=noiseSpeed*.1;

		// changes the y position of the ground relative to shape
		this.water.position.y = waterHeight;

		// this.particles.position.y = 100;
	};

	this.draw = function() {

		// updates light postion
		var percentage = this.count*.01*TWO_PI;
		this.dirLight.position.x = Math.cos(percentage)*100;
		this.dirLight.position.z = Math.sin(percentage)*100;

		// update particles
		this.particles.geometry.verticesNeedUpdate = true;
		
		this.halo.geometry.verticesNeedUpdate = true;
		this.stirLine.geometry.verticesNeedUpdate = true;

		// update shapes
		for(i = 0; i < this.customPlanes.length; i++) {
			this.customPlanes[i].geometry.verticesNeedUpdate = true;
			this.customWirePlanes[i].geometry.verticesNeedUpdate = true;
		}
		
		this.controls.update();
		this.renderer.render( this.scene , this.camera );
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

LILYPAD.LilyPad3D.prototype = new UNCTRL.BoilerPlate();
LILYPAD.LilyPad3D.prototype.constructor = LILYPAD.LilyPad3D;