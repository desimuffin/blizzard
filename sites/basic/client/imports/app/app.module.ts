import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes, ROUTES_PROVIDERS } from './app.routes';
import { AppComponent } from './app.component';

import { NaviComponent } from './navi/navi.component';
import { HomeComponent } from './home/home.component';
import { BoardComponent } from './board/board.component';
import { RegisterComponent } from './register/register.component';
import { LOGIN_DECLARATIONS } from './login/login.export';
import { ROOM_DECLARATIONS } from './room/room.export';

@NgModule({
    // Components, Pipes, Directive
    declarations: [
        AppComponent,
        NaviComponent,
        HomeComponent,
        BoardComponent,
        ...LOGIN_DECLARATIONS,
        ...ROOM_DECLARATIONS,
        RegisterComponent
    ],
    // Providers
    providers: [
        ...ROUTES_PROVIDERS
    ],
    // Modules
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes)
    ],
    // Main Component
    bootstrap: [ AppComponent ]
})

export class AppModule {
    constructor() {

    }
}