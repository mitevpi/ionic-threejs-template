import { Component, ViewChild, ElementRef } from "@angular/core";
import { Http } from "@angular/http";

import { NavController } from "ionic-angular";

import * as THREE from "three";
import * as OBJLoader from "three-obj-loader";

@Component({
  selector: "scene-obj-loader",
  templateUrl: "scene-obj-loader.html"
})
export class ThreeObjLoader {
  @ViewChild("domObj")
  canvasEl: ElementRef;

  private element: any;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private renderer: THREE.WebGLRenderer;
  private texture: THREE.Texture;
  private manager: THREE.LoadingManager;
  private textureLoader: THREE.TextureLoader;
  private objLoader: THREE.OBJLoader;

  public windowHalfX = window.innerWidth / 2;
  public windowHalfY = window.innerHeight / 2;
  public mouseX = 0;
  public mouseY = 0;

  public rawObjData: string;
  public objPath: string;
  public texturePath: string;

  private readObjData(): void {
    this.http.get("assets/dishwasher.obj").subscribe(
      // data => this.extractData(data),
      data => this.extractObjData(data),
      err => this.handleObjError(err)
    );
  }

  private handleObjError(err): void {
    console.log("OBJ PARSING ERROR ", err);
  }

  private extractObjData(res): void {
    console.log("OBJ RESPONSE", res);
    this.rawObjData = res["_body"] || "";
    this.objPath = res["url"] || "";
    //console.log("OBJ DATA", this.rawData)
    console.log("OBJ PATH", this.objPath);
  }

  public createObjLoader(): THREE.OBJLoader {
    new OBJLoader(THREE);
    var objLoader = new THREE.OBJLoader(this.manager);
    console.log("OBJ Loader Successfully Instantiated", this.objLoader);

    return objLoader;
  }

  public loadObj(scene: THREE.Scene): void {
    this.objLoader.load("/assets/dishwasher.obj", function(object) {
      scene.add(object);
      object.position.y -= 60;
    });
  }

  private readTextureData(): void {
    this.http.get("assets/UV_Grid_Sm.jpg").subscribe(
      // data => this.extractData(data),
      data => this.extractTextureData(data),
      err => this.handleTextureError(err)
    );
  }

  private handleTextureError(err): void {
    console.log("TEXTURE PARSING ERROR ", err);
  }

  private extractTextureData(res): void {
    console.log("TEXTURE RESPONSE", res);
    this.texturePath = res["url"] || "";
    console.log("TEXTURE PATH", this.texturePath);
  }

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

  private createLights(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
  ): void {
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    scene.add(ambientLight);
    camera.add(pointLight);
  }

  private loadModelasMesh(object): void {
    object.traverse(function(child) {
      if (child.isMesh) child.material.map = this.texture;
    });
    object.position.y = -95;
    this.scene.add(object);
  }

  private onWindowResize(): void {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public onDocumentMouseMove(event): void {
    this.mouseX = (event.clientX - this.windowHalfX) / 2;
    this.mouseY = (event.clientY - this.windowHalfY) / 2;
  }

  private _animate(): void {
    requestAnimationFrame(() => {
      this._animate();
    });
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

  renderAnimation(): void {
    this._animate();
  }

  //private managerCustom = new THREE.LoadingManager(this.loadModel );

  constructor(
    public navCtrl: NavController,
    private http: Http
  ) {}

  ionViewDidLoad(): void {
    this.initialiseWebGLEnvironment();
    this.renderAnimation();
  }

  initialiseWebGLEnvironment(): void {
    // READ EXTERNAL DATA
    this.readObjData();
    this.readTextureData();

    // Reference the DOM element that the WebGL generated object will be assigned to
    this.element = this.canvasEl.nativeElement;

    // CAMERA
    this.camera = this.createCamera();

    // SCENE & LIGHTS
    this.scene = new THREE.Scene();
    this.createLights(this.scene, this.camera);
    this.scene.add(this.camera);

    // MANAGER
    this.manager = new THREE.LoadingManager();

    // TEXTURE LOADER
    this.textureLoader = new THREE.TextureLoader(this.manager);
    this.texture = this.textureLoader.load(this.texturePath);

    // OBJ LOADER
    this.objLoader = this.createObjLoader();

    // LOAD 3D MODEL
    this.loadObj(this.scene);

    // RENDERER
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.element.appendChild(this.renderer.domElement);

    // EVENT LISTENERS FOR INTERACTIVITY
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    window.addEventListener("resize", this.onWindowResize, false);
  }
}
