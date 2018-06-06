import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MeteorObservable } from "meteor-rxjs";
import { Roles } from 'meteor/alanning:roles';

import style from './navi.scss';
import template  from './navi.component.html';

import { NaviEntry } from '../../../../both/models/navi.model';

@Component({
    selector: 'navi',
    template,
    styles: [style]
})

export class NaviComponent implements OnInit {

    toggleNav: boolean = false;

    naviEntries: NaviEntry[];
    visitor: boolean = true;
    user: boolean = false;
    admin: boolean = false;

    constructor(
        private router: Router
    ) {}

    ngOnInit() {
        /*
         * Push Items to the Navigation
         */
        MeteorObservable.autorun().subscribe(() => {
            this.user = !!Meteor.userId();
            this.admin = Roles.userIsInRole(Meteor.userId(), 'admin');

            this.naviEntries = [];
            this.naviEntries.push({name: 'Home', link: '', role: 'visitor'});
            this.naviEntries.push({name: 'Board', link: 'board', role: 'user'});
            this.naviEntries.push({name: 'Rooms', link: 'rooms', role: 'user'});

        });
    }

    allowItem(restriction: string){
        switch(restriction) {
            case 'visitor':
                return true;
            case 'user':
                return !!Meteor.userId();
            case 'admin':
                return Roles.userIsInRole(Meteor.userId(), 'admin');
            default:
                return false;
        }
    }

    navigateTo(link: string) {
        this.router.navigate(['/'+link]);
    }

    toggleNavbar() {
        this.toggleNav = !this.toggleNav;
    }
}