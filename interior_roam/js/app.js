/**
 * @author mrdoob / http://mrdoob.com/
 */

var APP = {

	Player: function () {
		var _this=this;

		var loader = new THREE.ObjectLoader();
		var camera, scene, renderer;

		var tween;
		var controls;

		var cameraGroup;
		var cameraTarget;

		var events = {};

		var dom = document.createElement( 'div' );

		this.dom = dom;

		this.width = 500;
		this.height = 500;

		this.load = function ( json ) {

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setClearColor( 0x000000 );
			renderer.setPixelRatio( window.devicePixelRatio );

			var project = json.project;

			if ( project.gammaInput ) renderer.gammaInput = true;
			if ( project.gammaOutput ) renderer.gammaOutput = true;
			if ( project.shadows ) renderer.shadowMap.enabled = true;
			if ( project.vr ) renderer.vr.enabled = true;

			dom.appendChild( renderer.domElement );

			this.setScene( loader.parse( json.scene ) );
			this.setCamera( loader.parse( json.camera ) );

			cameraTarget=new THREE.Object3D();
			cameraTarget.name="cameraTarget";
			cameraTarget.position.x=1;
			// camera.lookAt(cameraTarget.position)
			cameraGroup=new THREE.Group();
			cameraGroup.name="cameraGroup";
			cameraGroup.add(camera);
			cameraGroup.add(cameraTarget);

			scene.add(cameraGroup);

			this.addFloor();
			this.connectStick();
			// this.connectOrbitControl();

			events = {
				init: [],
				start: [],
				stop: [],
				keydown: [],
				keyup: [],
				mousedown: [],
				mouseup: [],
				mousemove: [],
				touchstart: [],
				touchend: [],
				touchmove: [],
				update: []
			};

			var scriptWrapParams = 'player,renderer,scene,camera';
			var scriptWrapResultObj = {};

			for ( var eventKey in events ) {

				scriptWrapParams += ',' + eventKey;
				scriptWrapResultObj[ eventKey ] = eventKey;

			}

			var scriptWrapResult = JSON.stringify( scriptWrapResultObj ).replace( /\"/g, '' );

			for ( var uuid in json.scripts ) {

				var object = scene.getObjectByProperty( 'uuid', uuid, true );

				if ( object === undefined ) {

					console.warn( 'APP.Player: Script without object.', uuid );
					continue;

				}

				var scripts = json.scripts[ uuid ];

				for ( var i = 0; i < scripts.length; i ++ ) {

					var script = scripts[ i ];

					var functions = ( new Function( scriptWrapParams, script.source + '\nreturn ' + scriptWrapResult + ';' ).bind( object ) )( this, renderer, scene, camera );

					for ( var name in functions ) {

						if ( functions[ name ] === undefined ) continue;

						if ( events[ name ] === undefined ) {

							console.warn( 'APP.Player: Event type not supported (', name, ')' );
							continue;

						}

						events[ name ].push( functions[ name ].bind( object ) );

					}

				}

			}

			dispatch( events.init, arguments );

		};

		this.addFloor=function(){
			var plane, floor;
			plane = new THREE.PlaneGeometry( 17, 16);
			floor=new THREE.Mesh(plane);
			floor.position.x=5.212;
			floor.position.y=-0.05;
			floor.position.z=3.075;
			floor.rotateX(util.degToRad(-90));
			floor.name='floorClick'
			scene.add(floor);
		}


		this.connectStick=function(){
			var stickConfig = {
				type:'droneRCRight',
				zoneSize:160,//外部尺寸
				stickSize: 40,//内部尺寸
				position: [null, 30, 30, null],//位置
				target: camera,//控制目标：DOM或THREE.Object3D
				moveFactor: 0.0004,//移动因数
			}
			var a = new Stick(stickConfig);

			var stickConfig2 = {
				type:'rotateY',
				zoneSize:160,//外部尺寸
				stickSize: 40,//内部尺寸
				position: [null, null, 30, 30],//位置
				target: camera,//控制目标：DOM或THREE.Object3D
				moveFactor: 0.005,//移动因数
			}
			var a2 = new Stick(stickConfig2);
		};

		this.setCamera = function ( value ) {

			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

			if ( renderer.vr.enabled ) {

				dom.appendChild( WEBVR.createButton( renderer ) );

			}
			

		};

		this.setScene = function ( value ) {

			scene = value;
			window.scene=scene;

		};

		this.setSize = function ( width, height ) {

			this.width = width;
			this.height = height;

			if ( camera ) {

				camera.aspect = this.width / this.height;

				camera.updateProjectionMatrix();

			}

			if ( renderer ) {

				renderer.setSize( width, height );

			}

		};

		function dispatch( array, event ) {

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				array[ i ]( event );

			}

		}

		var time, prevTime;

		function animate() {

			time = performance.now();

			try {

				dispatch( events.update, { time: time, delta: time - prevTime } );

			} catch ( e ) {

				console.error( ( e.message || e ), ( e.stack || "" ) );

			}


			var cameraTargetWorldPosition=new THREE.Vector3(cameraTarget.matrixWorld.elements[12],cameraTarget.matrixWorld.elements[13],cameraTarget.matrixWorld.elements[14])
			// camera.lookAt(cameraTargetWorldPosition);


			renderer.render( scene, camera );

			// tween.start();

			prevTime = time;

		}

		this.play = function () {

			prevTime = performance.now();

			document.addEventListener( 'click', pointHandler );

			document.addEventListener( 'keydown', onDocumentKeyDown );
			document.addEventListener( 'keyup', onDocumentKeyUp );
			document.addEventListener( 'mousedown', onDocumentMouseDown );
			document.addEventListener( 'mouseup', onDocumentMouseUp );
			document.addEventListener( 'mousemove', onDocumentMouseMove );
			document.addEventListener( 'touchstart', onDocumentTouchStart );
			document.addEventListener( 'touchend', onDocumentTouchEnd );
			document.addEventListener( 'touchmove', onDocumentTouchMove );

			dispatch( events.start, arguments );

			renderer.setAnimationLoop( animate );

		};

		this.stop = function () {

			document.removeEventListener( 'click', pointHandler );

			document.removeEventListener( 'keydown', onDocumentKeyDown );
			document.removeEventListener( 'keyup', onDocumentKeyUp );
			document.removeEventListener( 'mousedown', onDocumentMouseDown );
			document.removeEventListener( 'mouseup', onDocumentMouseUp );
			document.removeEventListener( 'mousemove', onDocumentMouseMove );
			document.removeEventListener( 'touchstart', onDocumentTouchStart );
			document.removeEventListener( 'touchend', onDocumentTouchEnd );
			document.removeEventListener( 'touchmove', onDocumentTouchMove );

			dispatch( events.stop, arguments );

			renderer.setAnimationLoop( null );

		};

		this.dispose = function () {

			while ( dom.children.length ) {

				dom.removeChild( dom.firstChild );

			}

			renderer.dispose();

			camera = undefined;
			scene = undefined;
			renderer = undefined;

		};

		//

		function onDocumentKeyDown( event ) {

			dispatch( events.keydown, event );

		}

		function onDocumentKeyUp( event ) {

			dispatch( events.keyup, event );

		}

		//处理鼠标或者触摸屏事件
		function pointHandler(e) {

			var e=event;
			// if (e.type.match('mouse') || e.type == 'click') {
			// 	//如果按下的按键为鼠标左键则不进行光线投射
			// 	if (e.button == 0) {
			// 		return;
			// 	}
			// }
			// console.log(e.target.tagName.toLowerCase());

			if(e.target.tagName.toLowerCase()!=='canvas'){
				return;
			}

			var mouse = new THREE.Vector2();
			// console.log(event);
			var raycaster = new THREE.Raycaster();

			e.preventDefault();
			//将浏览器坐标转换到Threejs坐标
			mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
			mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);
			// console.log(camera);

			//一个数组，用于保存与射线相交叉的对象
			//数组下标按照物体远近来进行排序，下标越大越远
			var intersects = raycaster.intersectObjects(scene.children);
			// console.log(intersects);
			// console.log(raycaster);
			//尝试把射线选中的除了交互地板以外的元素删去
			//似乎可以用.filter(function(obj3d){return ...});来替换？
			var realIntersects = [];
			for (var i = 0; i < intersects.length; i++) {
				// console.log(intersects);
				if (intersects[i].object.name==='floorClick') {
					realIntersects.push(intersects[i]);
				}
			}
			console.log(realIntersects);

			if(realIntersects.length!==0){
				var intersectPoint = realIntersects[0].point;
				console.log(intersectPoint);

				// TWEENJS补间
				cameraMoveTransition(intersectPoint);

				var originCameraPosition={
					x:camera.position.x,
					z:camera.position.z
				}
				var afterCameraPosition={
					x:intersectPoint.x,
					z:intersectPoint.z
				}

				camera.position.x=afterCameraPosition.x;
				camera.position.z=afterCameraPosition.z

				// camera.position.z=intersectPoint.z;
				// camera.updateProjectionMatrix();

			}




			// //鼠标拖动全景球事件由鼠标左键来触发
			// if (e.type.match('mouse') || e.type == 'click') {
			// 	if (e.button != 0) {
			// 		return;
			// 	}
			// }

			// var evtType = e.type;

			// // e.preventDefault();

			// if (e.type.match('touch')) {
			// 	e = e.touches[0];
			// }

			// //事件处理函数中this指向的是addEventListener的元素
			// // console.log(this);

			// switch (evtType) {
			// 	case "touchstart":
			// 	case "mousedown": {
			// 		renderer.domElement.style.cursor = 'grab';

			// 		this.userInteract = true;
			// 		//得到鼠标点击位置
			// 		this.pointData.originX = e.clientX;
			// 		this.pointData.originY = e.clientY;

			// 		//
			// 		this.pointData.originTheta = this.targetSphereCood.theta;
			// 		this.pointData.originPhi = this.targetSphereCood.phi;
			// 		//

			// 		this.panoWrap.addEventListener("mousemove", this.eventBind.pointHandler, false);
			// 		this.panoWrap.addEventListener("mouseup", this.eventBind.pointHandler, false);

			// 		this.panoWrap.addEventListener("touchmove", this.eventBind.pointHandler, false);
			// 		this.panoWrap.addEventListener("touchend", this.eventBind.pointHandler, false);

			// 		break;
			// 	}
			// 	case "touchmove":
			// 	case "mousemove": {
			// 		renderer.domElement.style.cursor = 'grabbing';

			// 		if (this.userInteract) {

			// 			//鼠标移动时计算鼠标的偏移量
			// 			this.pointData.offsetX = e.clientX - this.pointData.originX;
			// 			this.pointData.offsetY = e.clientY - this.pointData.originY;

			// 			//
			// 			this.targetSphereCood.theta = this.pointData.offsetX * 0.005 + this.pointData.originTheta;
			// 			// console.log(util.radToDeg(sphereCood.phi))

			// 			var phi = this.pointData.offsetY * 0.005 + this.pointData.originPhi;
			// 			//限制上下俯仰角度，以防万向锁。来自THREEJS
			// 			this.targetSphereCood.phi = util.clamp(phi, util.degToRad(181), util.degToRad(359));

			// 			// console.log(sphereCood.theta + ' ' + sphereCood.phi)

			// 			this.cameraTarget.position.setFromSpherical(this.targetSphereCood);
			// 			this.camera.lookAt(this.cameraTarget.position);

			// 		}
			// 		break;
			// 	}

			// 	case "touchend":
			// 	case "mouseup": {
			// 		renderer.domElement.style.cursor = 'grab';
			// 		this.userInteract = false;

			// 		this.panoWrap.removeEventListener("mouseup", this.eventBind.pointHandler, false);
			// 		this.panoWrap.removeEventListener("touchend", this.eventBind.pointHandler, false);

			// 		this.panoWrap.removeEventListener("mousemove", this.eventBind.pointHandler, false);
			// 		this.panoWrap.removeEventListener("touchmove", this.eventBind.pointHandler, false);


			// 		break;
			// 	}
			// }
		}

		function cameraMoveTransition(targetPoint){

			//TWEENJS补间
			var originPosition={
				x:camera.position.x,
				z:camera.position.z
			}
			var endPosition={
				x:targetPoint.x,
				z:targetPoint.z
			}

			tween=new TWEEN.Tween(originPosition);
			tween.to(endPosition,1000);
			tween.onUpdate(
				function(){
					camera.updateProjectionMatrix();
					console.log(this.x)
				}
			)
			tween.start();

			console.log(tween)

		}

		function onDocumentMouseDown( event ) {
			// pointHandler(event).bind(this);

			dispatch( events.mousedown, event );
		}

		function onDocumentMouseUp( event ) {
			// pointHandler(event).bind(this);
			
			dispatch( events.mouseup, event );

		}

		function onDocumentMouseMove( event ) {


			dispatch( events.mousemove, event );

		}

		function onDocumentTouchStart( event ) {

			dispatch( events.touchstart, event );

		}

		function onDocumentTouchEnd( event ) {

			dispatch( events.touchend, event );

		}

		function onDocumentTouchMove( event ) {

			dispatch( events.touchmove, event );

		}

		console.log(this)


	}

};
