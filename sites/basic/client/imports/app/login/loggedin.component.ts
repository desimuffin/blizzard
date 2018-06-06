import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import template from "./loggedin.component.html";
import style from "./login.scss";


@Component({
    selector: 'loggedin',
    template,
    styles: [style]
})

export class LoggedinComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    ngOnInit() {

    }

    logout() {
        Meteor.logout();
        this.router.navigate(['']);
    }

}