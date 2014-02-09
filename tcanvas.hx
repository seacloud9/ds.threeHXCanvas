import three.THREE;
import three.cameras.Camera;
import three.cameras.PerspectiveCamera;
import three.extras.GeometryUtils;
import three.renderers.CanvasRenderer;
import three.renderers.DebugRenderer;
import three.extras.geometries.CubeGeometry;
import three.extras.geometries.PlaneGeometry;
import three.scenes.Scene;
import three.math.Matrix4;
import three.objects.Mesh;
import three.materials.MeshBasicMaterial;
import js.Browser;
import js.html.Element;
import js.html.CSSStyleDeclaration;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import js.html.Element;
import js.html.BodyElement;
import js.html.ImageElement;
import js.Lib;


class Tcanvas {
	public var surface:CanvasRenderingContext2D;
	public var dom:Element;
	public var doc:Element;
	public var image:ImageElement;
	public var canvas:CanvasElement;
	public var style:CSSStyleDeclaration;
	public var body:Element;
    public var container:Element;
    public var div:Element;
    public var camera:PerspectiveCamera;
    public var scene:Scene;
    public var renderer:DebugRenderer;
    public var cube:Mesh;
    public var plane:Mesh;
    public var targetRotation:Float = 0;
    public var targetRotationOnMouseDown:Float = 0;
    public var mouseX:Float = 0;
    public var mouseXOnMouseDown:Float = 0;
    public var windowHalfX:Float;
    public var windowHalfY:Float;


    function new():Void{
    	container = Browser.document.createElement("div");
    }

    static function main():Void {
    	trace("Hello World !");
    	var t:Tcanvas = new Tcanvas();
    	var body = Browser.document.body;
    	body.appendChild( t.container );

    	t.init();
    	t.animate();
    }



    public function init():Void{
    	windowHalfX = js.Browser.window.innerWidth / 2;
    	windowHalfY = js.Browser.window.innerHeight / 2;
    	camera = new PerspectiveCamera( 70, js.Browser.window.innerWidth / js.Browser.window.innerHeight, 1, 1000 );
    	camera.position.y = 150;
    	camera.position.z = 500;
    	scene = new Scene();
		// Cube
		var geometry:CubeGeometry = new CubeGeometry( 200, 200, 200 );

		var i:Int = 0;
		var hex:Dynamic = Math.random() * 0xffffff;
		//var hex:Dynamic = 0x7db9e8;
		while(i < geometry.faces.length){
			geometry.faces[ i ].color.setHex( hex );
			geometry.faces[ i + 1 ].color.setHex( hex );

			i+=2;
		}
		var material:MeshBasicMaterial = new MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
		cube = new Mesh( geometry, material );
		cube.position.y = 150;
		scene.add( cube );
		// Plane
		var geometry:PlaneGeometry = new PlaneGeometry( 200, 200 );
		geometry.applyMatrix( new Matrix4().makeRotationX( - Math.PI / 2 ) );
		var material = new MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );
		plane = new Mesh( geometry, material );
		scene.add( plane );
		renderer = new DebugRenderer();
		renderer.setSize( js.Browser.window.innerWidth, js.Browser.window.innerHeight );

		doc = Browser.document.body;
		doc.addEventListener( 'mousedown', onDocumentMouseDown, false );
		doc.addEventListener( 'touchstart', onDocumentTouchStart, false );
		doc.addEventListener( 'touchmove', onDocumentTouchMove, false );
		
	}

	public function animate():Void {
		untyped __js__ ("requestAnimationFrame") (animate);
		this.render();
	}

	public function render():Void {
		plane.rotation.y = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;
		renderer.render( scene, camera );
	}

	public function onDocumentMouseDown( event:Dynamic ):Void {
				event.preventDefault();
				doc.addEventListener( 'mousemove', onDocumentMouseMove, false );
				doc.addEventListener( 'mouseup', onDocumentMouseUp, false );
				doc.addEventListener( 'mouseout', onDocumentMouseOut, false );
				mouseXOnMouseDown = event.clientX - windowHalfX;
				targetRotationOnMouseDown = targetRotation;
	}

	public function onDocumentMouseMove( event:Dynamic ):Void {
				mouseX = event.clientX - windowHalfX;
				targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
	}

	public function onDocumentMouseUp( event:Dynamic ):Void {
				doc.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				doc.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				doc.removeEventListener( 'mouseout', onDocumentMouseOut, false );
	}

	public function onDocumentMouseOut( event:Dynamic ):Void {
				doc.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				doc.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				doc.removeEventListener( 'mouseout', onDocumentMouseOut, false );
	}

	public function onDocumentTouchStart( event:Dynamic ):Void {
			var etl:Int = event.touches.length;
				if ( etl == 1 ) {
					event.preventDefault();
					mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
					targetRotationOnMouseDown = targetRotation;
				}
	}

	public function onDocumentTouchMove( event:Dynamic ):Void {
				if ( event.touches.length == 1 ) {
					event.preventDefault();
					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
				}
	}

}