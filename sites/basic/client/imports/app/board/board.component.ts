import { Component, NgZone, OnInit } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { FormArray, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { User } from '../../../../both/models/user.model';
import { Room } from "../../../../both/models/room.model";
import { Rooms } from "../../../../both/collections/room.collection";
import { Userboard } from "../../../../both/models/userboard.model";
import { Userboards } from '../../../../both/collections/userboard.collection';

import template from './board.component.html';
import style from './board.scss';

@Component({
    selector: 'board',
    template,
    styles: [style]
})

export class BoardComponent implements OnInit {

    userId: string;
    loadUser: boolean;
    hasRoom: boolean;
    loadBoard: boolean;
    user: User;
    userSub: Subscription;
    room: Room;
    roomSub: Subscription;
    userBoard: Userboard;
    userBoardSub: Subscription;
    newEntryForm: FormGroup;
    editEntryForm: FormGroup;

    constructor(
        private zone: NgZone,
        private fb: FormBuilder
    ){}

    ngOnInit() {

        /*
         * Form
         */
        this.newEntryForm = this.fb.group({
            entry: new FormControl()
        });

        /*
         * Userdata
         */

        this.userId = Meteor.userId();

        if(this.userId) {
            /*
             * User- and Roomdata
             */
            this.userSub = MeteorObservable.subscribe("userdata", this.userId).subscribe(() => {
                Tracker.autorun(() => {
                    this.zone.run(() => {

                        this.loadUser = false;
                        this.hasRoom = false;

                        this.user = Meteor.users.findOne(this.userId);
                        if (typeof this.user !== typeof undefined) {

                            this.loadUser = true;

                            if (this.user.room) {
                                this.roomSub = MeteorObservable.subscribe("rooms").subscribe(() => {
                                    Tracker.autorun(() => {
                                       this.zone.run(() => {
                                           this.room = Rooms.findOne({_id: this.user.room.roomId});

                                           if(typeof this.room !== typeof undefined) {
                                               this.hasRoom = true;
                                           }
                                       });
                                    });
                                });
                            }
                        }
                    })
                });
            });
            /*
             * Userboard Data
             */
            this.userBoardSub = MeteorObservable.subscribe("userboards").subscribe(() => {
                Tracker.autorun(() => {
                    this.zone.run(() => {

                        this.loadBoard = false;
                        this.userBoard = Userboards.findOne({userId: this.userId});

                        if(typeof this.userBoard !== typeof undefined) {

                            let entriesFGs = []
                            this.userBoard.entries.forEach(entry => {
                                entriesFGs.push(this.fb.group({
                                    createdAt: entry.createdAt,
                                    public: entry.public,
                                    content: entry.content
                                }));
                            });

                            this.editEntryForm = this.fb.group({
                                entries: this.fb.array(entriesFGs)
                            });

                            this.loadBoard = true;
                        }
                    });
                });
            });
        }
    }

    get entries(): FormArray  {
            return this.editEntryForm.get('entries') as FormArray;
    }

    addEntry(): void {
        if(!this.userBoard) {
            this.userBoard = {
                userId: this.userId,
                entries: [{
                    createdAt: new Date(),
                    public: true,
                    content: this.newEntryForm.value.entry
                }]
            }
        }
        else {
            this.userBoard.entries.unshift({
                createdAt: new Date(),
                public: true,
                content: this.newEntryForm.value.entry
            });
        }
        Meteor.call('addEntry', this.userBoard);
        this.newEntryForm.reset();
    }

    deleteEntry(index: number): void {
        this.userBoard.entries.splice(index,1);
        Meteor.call('editEntry', this.userBoard);
    }

    changeEntry(): void {
        this.userBoard.entries = this.editEntryForm.value.entries;
        Meteor.call('editEntry', this.userBoard);
    }
}