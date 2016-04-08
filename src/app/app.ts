/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';
import {ViewEncapsulation} from 'angular2/core';

import {RouterActive} from './directives/router-active';
import {Home} from './home/home';
import {NotesComponent} from './notes/NotesComponent';
import {Toast2Component} from './toast2/Toast2Component';
import {AuthPrompt} from './auth/AuthPrompt';
import {Spinner} from './util/Spinner.ts';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [ FORM_PROVIDERS ],
  directives: [ ROUTER_DIRECTIVES, RouterActive, Toast2Component, AuthPrompt, Spinner ],
  pipes: [],
  styles: [require('./app.scss')],
  encapsulation: ViewEncapsulation.None,
  template: `
    <header>
      <nav>
        <h1>Hello {{ name }}</h1>
        <ul>
          <li>
            <a [routerLink]=" ['Index'] ">Index</a>
          </li>
          <li>
            <a [routerLink]=" ['Home'] ">Home</a>
          </li>
          <li>
            <a [routerLink]=" ['Notes'] ">Notes</a>
          </li>
          <li>
            <a [routerLink]=" ['About'] ">About</a>
          </li>
        </ul>
      </nav>
    </header>

    <main style="border:1px solid red">
      <auth-prompt></auth-prompt>
      <toast2></toast2>
      <spinner></spinner>
      <router-outlet></router-outlet>
    </main>

    <footer>
      WebPack Angular 2 Starter by <a [href]="url">@AngularClass</a>
      <div>
        <img [src]="angularclassLogo" width="10%">
      </div>
    </footer>
  `
})
@RouteConfig([
  { path: '/', component: Home, name: 'Index' },
  { path: '/home', component: Home, name: 'Home' },
  // Async load a component using Webpack's require with es6-promise-loader and webpack `require`
  { path: '/about', loader: () => require('es6-promise!./about/about')('About'), name: 'About' },
  { path: '/notes', component: NotesComponent, name: 'Notes'},
  { path: '/**', redirectTo: ['Index'] }
])
export class App {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';
  constructor() {

  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
