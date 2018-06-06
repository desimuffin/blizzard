import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { UrlValidator } from '../validators/validators';
import { MeteorObservable } from "meteor-rxjs";

import { Room } from "../../../../both/models/room.model";
import { Rooms } from "../../../../both/collections/room.collection";

import template from './room-add.component.html';
import style from './room.scss';

@Component({
    selector: 'roomadd',
    template,
    styles: [style]
})

export class RoomAddComponent implements OnInit {

    addRoomForm: FormGroup;
    room: Room;
    addError: boolean = false;
    errMsg: string;
    success: boolean = false;
    successMsg: string;

    constructor(
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {

        this.addError = false;
        this.errMsg = '';
        this.success = false;
        this.successMsg = '';

        this.addRoomForm = this.formBuilder.group({
            name: new FormControl('', Validators.compose([
                Validators.required
            ])),
            password: new FormControl(''),
            imgURL: new FormControl('', Validators.compose([
                Validators.required,
                UrlValidator.isValidUrlFormat
            ])),
        })
    }

    createRoom(): void {
        this.room = {
            name: this.addRoomForm.value.name,
            password: this.addRoomForm.value.password,
            imgurl: this.addRoomForm.value.imgURL,
            createdAt: new Date(),
            editedAt: new Date(),
            owner: Meteor.userId()
        }
        if(this.addRoomForm.valid) {
            MeteorObservable.call('addRoom', this.room).subscribe((data) => {
                console.log(data);
                if(data == false) {
                    this.addError = true;
                    this.errMsg = 'Raum konnte nicht gespeichert werden';
                }
                else {
                    this.addError = false;
                    this.success = true;
                    this.successMsg = 'Raum wurde gespeichert';
                }
            });
        }
        else {
            this.addError = true;
            this.errMsg = 'Eingabe falsch';
        }
    }
}