import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavController } from "ionic-angular";

// Import ThreeJS, and the FBX loader which is not actually a part of ThreeJS core
// In this example, the FBXLoader is installed via npm -i -save three-fbx-loader
// It can also be downloaded from the ThreeJS GitHub repository and loaded statically
import * as THREE from "three";
import * as FBXLoader from "three-fbx-loader";

// Load in the desired controls (which are also not a part of the ThreeJS core)
// Script source: https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/TrackballControls.js
// Implementation in vanilla JS/NodeJS apps: https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_trackball.html
import * as TrackballControls from "./trackball";

// See page "scene-vanilla" for verbose documentation on the class set-up below
@Component({
  selector: "scene-fbx-loader",
  templateUrl: "scene-fbx-loader.html"
})
export class ThreeFbxLoader {
  @ViewChild("domObj")
  canvasEl: ElementRef;

  private _ELEMENT: any;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private renderer: THREE.WebGLRenderer;
  private manager: THREE.LoadingManager;
  private fbxLoader: FBXLoader;
  private controls: THREE.TrackballControls;

  public windowHalfX = window.innerWidth / 2;
  public windowHalfY = window.innerHeight / 2;
  public mouseX = 0;
  public mouseY = 0;

  private createCamera(): THREE.PerspectiveCamera {
    var camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 250;

    return camera;
  }

  private createLights(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    scene.add(ambientLight);
    camera.add(pointLight);
  }

  private createTrackballControls(camera: THREE.PerspectiveCamera): THREE.TrackballControls {
    var controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68];
    controls.addEventListener("change", this._animate);

    return controls;
  }

  private loadFbx(scene: THREE.Scene): void{
    this.fbxLoader.load("/assets/chair.fbx", function (object3d) {
      scene.add(object3d);
    });
  }

  private onWindowResize(): void {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.handleResize();
  }

  public onDocumentMouseMove(event): void {
    this.mouseX = (event.clientX - this.windowHalfX) / 2;
    this.mouseY = (event.clientY - this.windowHalfY) / 2;
  }

  public onDocumentMouseWheel(event) {
    var fovMAX = 160;
    var fovMIN = 1;

    this.camera.fov -= event.wheelDeltaY * 0.05;
    this.camera.fov = Math.max(Math.min(this.camera.fov, fovMAX), fovMIN);
    this.camera.projectionMatrix = new THREE.Matrix4().makePerspective(
      this.camera.fov,
      window.innerWidth / window.innerHeight,
      this.camera.near,
      this.camera.far
    );
  }

  private _animate(): void {
    requestAnimationFrame(() => {
      this._animate();
      this.controls.update();
    });
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

  renderAnimation(): void {
    this._animate();
  }

  constructor(
    public navCtrl: NavController
  ) { }

  ionViewDidLoad(): void {
    this.initialiseWebGLEnvironment();
    this.renderAnimation();
  }

  initialiseWebGLEnvironment(): void {
    console.log("CONTROLS", TrackballControls)
    console.log("CONTROLS", THREE.TrackballControls)

    // Reference the DOM element that the WebGL generated object will be assigned to
    this._ELEMENT = this.canvasEl.nativeElement;

    // CAMERA
    this.scene = new THREE.Scene();
    this.camera = this.createCamera();

    // SCENE & LIGHTS
    this.createLights(this.scene, this.camera);
    this.scene.add(this.camera);

    // CONTROLS
    this.controls = this.createTrackballControls(this.camera);

    // MANAGER
    this.manager = new THREE.LoadingManager();

    // FBX IMPORT
    this.fbxLoader = new FBXLoader(this.manager);
    console.log("FBX LOADER MANAGER", this.fbxLoader);
    this.loadFbx(this.scene);

    // RENDER
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this._ELEMENT.appendChild(this.renderer.domElement);

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    window.addEventListener("resize", this.onWindowResize, false);
    //this.onDocumentMouseWheel = this.onDocumentMouseWheel.bind(this);
    //document.addEventListener("mousewheel", this.onDocumentMouseWheel, false);
  }
}
