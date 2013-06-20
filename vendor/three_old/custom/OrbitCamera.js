THREE.OrbitCamera = function (fov, aspect, near, far, domElement) {

  THREE.Camera.call(this, fov, aspect, near, far);

  var _this = this;
  var mouseX, mouseY, pmouseX, pmouseY;

  this.domElement = domElement || window;
  this.minDistance = 5;

  this.__defineSetter__('azimuth', function(azimuth) {
    var e = _this.elevation;
    var d = _this.distance;
    _this.position.x = Math.sin(azimuth) * Math.cos(e) * d + _this.target.position.x;
    _this.position.z = Math.cos(azimuth) * Math.cos(e) * d + _this.target.position.z;
  });

  this.__defineGetter__('azimuth', function() {
    var e = _this.elevation;
    var d = _this.distance;
    var x = _this.position.x - _this.target.position.x;
    return Math.asin(x/(Math.cos(e)*d));
  });

  this.__defineSetter__('elevation', function(elevation) {

    if (elevation > Math.PI/2) {
      elevation = Math.PI/2;
    } else if (elevation < -Math.PI/2) {
      elevation = -Math.PI/2;
    }
    
    var a = _this.azimuth;
    var d = _this.distance;
    console.log(a, d);
    _this.position.x = d * Math.sin(a) * Math.cos(elevation) + _this.target.position.x;
    _this.position.y = d * Math.sin(elevation) + _this.target.position.y;
    _this.position.z = d * Math.cos(a) * Math.cos(elevation) + _this.target.position.z;
  });

  this.__defineGetter__('elevation', function() {
    var d = _this.distance;
    return Math.asin((_this.position.y - _this.target.position.y)/d);
  });

  this.__defineSetter__('distance', function(distance) {
    if (distance < _this.minDistance) {
      distance = _this.minDistance;
    }
    var e = _this.elevation;
    var a = _this.azimuth;
    _this.position.x = distance * Math.sin(a) * Math.cos(e) + _this.target.position.x;
    _this.position.y = distance * Math.sin(e) + _this.target.position.y;
    _this.position.z = distance * Math.cos(a) * Math.cos(e) + _this.target.position.z;
  });

  this.__defineGetter__('distance', function() {
    var dx = _this.position.x - _this.target.position.x;
    var dy = _this.position.y - _this.target.position.y;
    var dz = _this.position.z - _this.target.position.z;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2) + Math.pow(dy, 2));
  });

  this.domElement.addEventListener('mousedown', onMouseDown, false);
  this.domElement.addEventListener('mousewheel', onMouseWheel, false);
  this.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false);

  function onMouseDown(e) {
    _this.domElement.addEventListener('mousemove', onMouseDrag, false);
    _this.domElement.addEventListener('mouseup', onMouseUp, false);
    pmouseX = mouseX = e.clientX;
    pmouseY = mouseY = e.clientY;
  }

  function onMouseDrag(e) {
    pmouseX = mouseX;
    pmouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    _this.azimuth -= (mouseX - pmouseX) / 180;
    _this.elevation -= (pmouseY - mouseY) / 180;
  }

  function onMouseUp() {
    _this.domElement.removeEventListener('mousemove', onMouseDrag, false);
    _this.domElement.removeEventListener('mouseup', onMouseUp, false);
  }

  function onMouseWheel(e) {
    _this.distance += e.wheelDelta/100;
  }


};

THREE.OrbitCamera.prototype = new THREE.Camera();
THREE.OrbitCamera.prototype.constructor = THREE.OrbitCamera;