import { Component, NgZone, OnInit } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MeteorObservable } from "meteor-rxjs";
import { Roles } from 'meteor/alanning:roles';

import { User } from "../../../../both/models/user.model";
import { Room } from "../../../../both/models/room.model";
import { Rooms } from "../../../../both/collections/room.collection";

import template from './room-list.component.html';
import style from './room.scss';

@Component({
    selector: 'roomlist',
    template,
    styles: [style]
})

export class RoomListComponent implements OnInit {

    rooms: Observable<Room[]>;
    roomSub: Subscription;
    userId: string;
    user: User;
    hasRoom: boolean;
    userSub: Subscription;
    error: boolean;
    errorMsg: string;

    constructor(
        private zone: NgZone,
        private router: Router
    ) {}

    ngOnInit() {
        this.userId = Meteor.userId();

        this.userSub = MeteorObservable.subscribe("userdata", this.userId).subscribe(() => {
            Tracker.autorun(() => {
                this.zone.run(() => {
                    this.error = false;
                    this.errorMsg = '';
                    this.hasRoom = false;
                    this.user = Meteor.users.findOne(this.userId);

                    if(this.user.room) this.hasRoom = true;
                });
            });
        });

        this.roomSub = MeteorObservable.subscribe("rooms").subscribe(() => {
            this.rooms = Rooms.find({}).zone();
        });
    }

    addRoom(): void {
        this.router.navigate(['room/add']);
    }

    editRoom(roomId: string): void {
        this.router.navigate(['room/edit/', roomId]);
    }

    joinRoom(roomObj: Room): void {
            if(window.prompt('Password: ') == roomObj.password) {
                Meteor.call('joinRoom', roomObj, this.userId);
            }
            else {
                this.error = true;
                this.errorMsg = 'Wrong password!';

                setTimeout(() => {
                    this.error = false;
                    this.errorMsg = '';
                }, 2000);
            }
    }

    allowEdit(roomOwner: string): boolean {
        Meteor.subscribe("userdata");
        if(Meteor.userId() == roomOwner) return true
        if(Roles.userIsInRole(Meteor.userId(), 'admin')) return true

        return false
    }

    userInRoom(roomObj: Room): boolean {
        Meteor.subscribe("userdata");
        var user: User = Meteor.users.findOne(this.userId);
        if(user.room){
            if(user.room.roomId == roomObj._id) return true
        }

        return false
    }

    leaveRoom(roomObj: Room): void {
        Meteor.call('leaveRoom', roomObj, Meteor.userId());
    }
}