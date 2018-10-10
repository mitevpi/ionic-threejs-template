# Ionic (v3) three.js Template

![Ionic Logo](/assets/logo.png "Ionic Logo")

Template for integrating three.js with a Typescript framework like Ionic (v3).

## Running the Template

Clone the respository, and open up a terminal/command prompt within the threeApp directory. Afterwards, run the npm & ionic commands in the terminal to install node modules and to build the ionic app. On successful build, the Ionic application should start in the OS' preferred browser.

**Clone Repository**
```
$ git clone https://github.com/mitevpi/ionic-threejs-template
$ cd threeApp
```

**Download Packages & Start Web App**
```
npm install
ionic serve
```

## Injecting three.js Into Views
As seen on [masteringionic.com](http://masteringionic.com/blog/2017-11-21-creating-webgl-animations-within-an-ionic-application-using-threejs/), getting the scene to render and be visible can be a roundabout process. 

**Inside the main [scene.ts file](threeApp/src/pages/scene-fbx-loader/scene-fbx-loader.ts)**
```ts
import { ElementRef, ViewChild } from "@angular/core";

export class ThreeFbxLoader {
  @ViewChild("domObj")
  canvasEl: ElementRef;

  private _ELEMENT: any;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  // and so on and so forth for class set up...

  // In the main void, reference the DOM element that the WebGL generated object will be assigned to.
    this._ELEMENT = this.canvasEl.nativeElement;
```

**Inside the [scene.html file](threeApp/src/pages/scene-fbx-loader/scene-fbx-loader.html)**
```html
<!-- somewhere outside of the header -->
<ion-content class="no-scroll">
  <div #domObj></div>
</ion-content>
```

**Inside the [scene.scss file](threeApp/src/pages/scene-fbx-loader/scene-fbx-loader.scss)**
```scss
scene-fbx-loader {
    .no-scroll .scroll-content{
        overflow: hidden;
   }
}
```

## Dealing with TypeScript Errors

Due to the generally sloppy nature of javascript development, you're going to encounter typescript errors when you try to run this template. This is because the three.js package relies on external modules, and although three.js has a corresponding @types/three npm package you can install, the external modules may or may not have corresponding @types packages.

Pay attention to typescript errors in the console, and try to go directly to the source in the node_modules/@types/three directory. For me, the error was on the VRDisplay module which is a part of [Mozilla's WebVR Api](https://developer.mozilla.org/en-US/docs/Web/API/VRDisplay), but also referenced in three.js.

There are a number of ways to get around these errors (which I'll try to document here), but the one I chose was to edit the offending .d.ts files. First, install available types by running the command:

```cmd
npm i --save @types/three
```

If you run the application as-is, you'll likely get typescript errors without a successful build due to modules with missing types.

In the offending files, change any offending occurances (such as VRDisplay) from this:
```ts
setVRDisplay(display: VRDisplay): void;
```
To this:
```ts
setVRDisplay(display: any): void;
```


## Dealing with three.js Modules which aren't in the Core Library

There's a good deal of three.js modules which are not part of the core library, even though intellisense will autocomplete them, and you'll find people using them on other code samples through the typical THREE namespace. There are a number of ways to inject these modules into your app.

### Option 1 - Use Pre-Packaged npm Builds
Some of the more popular modules exist on npm for convenience.

Install via npm if available (see [three-obj-loader](https://www.npmjs.com/package/three-obj-loader)).

**OBJ Loader**

```cmd
npm i --save three-obj-loader
```

```ts
import * as THREE from "three";
import * as OBJLoader from "three-obj-loader";

// create loading manager
this.manager = new THREE.LoadingManager();

// create the obj loader object
private createObjLoader(): THREE.OBJLoader {
    new OBJLoader(THREE);
    var objLoader = new THREE.OBJLoader(this.manager);

    return objLoader;
}

// load an obj file
public loadObj(scene: THREE.Scene): void {
    this.objLoader.load("/assets/dishwasher.obj", function(object) {
        scene.add(object);
        object.position.y -= 60;
    });
}
```

**FBX Loader**

```cmd
npm i --save three-fbx-loader
```

```ts
import * as THREE from "three";
import * as FBXLoader from "three-fbx-loader";

// create loading manager and fbx loader
this.manager = new THREE.LoadingManager();
this.fbxLoader = new FBXLoader(this.manager);

// load a fbx scene file
private loadFbx(scene: THREE.Scene): void{
    this.fbxLoader.load("/assets/chair.fbx", function (object3d) {
        scene.add(object3d);
    });
}
```

### Option 2 - Download the Source .js From the three.js Repository
As the three.js example files show, you can reference the additonal modules directly from the .js files included in the original three.js repository.

```ts
// Script source: https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/TrackballControls.js
import * as TrackballControls from "./trackball";

private controls: THREE.TrackballControls;

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
```

## npm packages
Installed using the ```npm i --save``` command

1. three
2. @types/three
3. three-obj-loader
4. three-fbx-loader

## Other Useful Resources

### HttpModule
I've personally found this module useful in debugging and working with local content. In order to use it, it must be imported through the [app.module.ts file](threeApp/src/app/app.module.ts)

```ts
import { HttpModule } from "@angular/http";
@NgModule({
    declarations: [
    MyApp,
    ThreeVanillaCube,
    ThreeObjLoader,
    ThreeFbxLoader
],
    imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
],
```
