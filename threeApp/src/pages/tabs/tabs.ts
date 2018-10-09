import { Component } from "@angular/core";

import { AboutPage } from "../about/about";
import { ContactPage } from "../contact/contact";
import { HomePage } from "../home/home";

import { ThreeVanillaCube } from "../scene-vanilla/scene-vanilla";
import { ThreeObjLoader } from "../scene-obj-loader/scene-obj-loader";
import { ThreeFbxLoader } from "../scene-fbx-loader/scene-fbx-loader";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab6Root = ThreeVanillaCube;
  tab7Root = ThreeObjLoader;
  tab8Root = ThreeFbxLoader;

  constructor() {}
}
