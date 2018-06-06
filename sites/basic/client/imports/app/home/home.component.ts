import { Component, NgZone, OnInit } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";

import { User } from '../../../../both/models/user.model';
import { Room } from "../../../../both/models/room.model";
import { Rooms } from "../../../../both/collections/room.collection";
import { Userboard } from "../../../../both/models/userboard.model";
import { Userboards } from '../../../../both/collections/userboard.collection';

import style from './home.scss';
import template  from './home.component.html';

@Component({
    selector: 'home',
    template,
    styles: [style]
})

export class HomeComponent implements OnInit {

    loadUser: boolean;
    hasRoom: boolean;
    loggedIn: boolean;
    loadUserBoard: boolean;

    userSub: Subscription;
    roomSub: Subscription;
    userBoardSub: Subscription;

    userId: string;
    userBoards: Userboard[];
    user: User;
    room: Room;
    usernames: Object;

    constructor(
        private zone: NgZone
    ) {}

    ngOnInit() {

        this.loggedIn = false;
        this.userId = Meteor.userId();

        if(this.userId) {
            this.loggedIn = true;

            this.userSub = MeteorObservable.subscribe("userdata", this.userId).subscribe(() => {
                Tracker.autorun(() => {
                    this.zone.run(() => {

                        this.loadUser = false;
                        this.hasRoom = false;
                        this.loadUserBoard = false;
                        this.usernames = {};

                        this.user = Meteor.users.findOne(this.userId);
                        if (typeof this.user !== typeof undefined) {

                            if (this.user.room) {
                                this.roomSub = MeteorObservable.subscribe("rooms").subscribe(() => {
                                    Tracker.autorun(() => {
                                        this.zone.run(() => {
                                            this.room = Rooms.findOne({_id: this.user.room.roomId});

                                            if(typeof this.room !== typeof undefined) {
                                                this.hasRoom = true;

                                                let mates = [];
                                                this.room.roommates.forEach((mate) => {
                                                    mates.push(mate.userId);
                                                    Meteor.subscribe('username', mate.userId);
                                                    let usr = Meteor.users.findOne({_id: mate.userId});
                                                    if(typeof usr !== typeof undefined) {
                                                        this.usernames[mate.userId] = usr.username;
                                                    }
                                                });

                                                /*
                                                 * Userboardinformations
                                                 */

                                                this.userBoardSub = MeteorObservable.subscribe("userboards").subscribe(() => {
                                                    Tracker.autorun(() => {
                                                        this.zone.run(() =>{
                                                           this.userBoards = Userboards.find({userId: {$in: mates}}).fetch();
                                                           if(typeof this.userBoards !== typeof undefined) {
                                                               this.loadUserBoard = true;
                                                           }
                                                        });
                                                    });
                                                });
                                            }
                                        });
                                    });
                                });
                            }
                        }
                    });
                });
            });
        }
    }
}