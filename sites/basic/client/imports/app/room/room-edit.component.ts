import { Component, OnInit, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { UrlValidator } from '../validators/validators';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs/Observable";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';

import { Room } from "../../../../both/models/room.model";
import { Rooms } from "../../../../both/collections/room.collection";

import template from './room-edit.component.html';
import style from './room.scss';

@Component({
    selector: 'roomedit',
    template,
    styles: [style]
})

export class RoomEditComponent implements OnInit {

    roomId: string;
    paramsSub: Subscription;
    roomSub: Subscription;
    editRoomForm: FormGroup;
    rooms: Observable<Room[]>;
    room: Room;
    loadForm: boolean = false;
    error: boolean = false;
    errMsg: string;
    success: boolean = false;
    successMsg: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private zone: NgZone,
    ) {}

    ngOnInit() {

        this.success = false;
        this.successMsg = '';
        this.error = false;
        this.errMsg = '';

        this.loadForm = false;

        this.editRoomForm = this.formBuilder.group({
            name: new FormControl('', Validators.compose([
                Validators.required
            ])),
            password: new FormControl(''),
            imgURL: new FormControl('', Validators.compose([
                Validators.required,
                UrlValidator.isValidUrlFormat
            ])),
        })


        this.paramsSub = this.route.params
            .map(params => params['roomId'])
            .subscribe(roomId => {
                this.roomId = roomId;

                this.roomSub = MeteorObservable.subscribe('rooms').subscribe(() =>{
                   Tracker.autorun(() => {
                       this.zone.run(() => {
                          this.room = Rooms.findOne(this.roomId);

                          if(typeof this.room !== typeof undefined) {

                              this.editRoomForm.setControl('name', new FormControl(this.room.name));
                              this.editRoomForm.setControl('password', new FormControl(this.room.password));
                              this.editRoomForm.setControl('imgURL', new FormControl(this.room.imgurl));

                              this.loadForm = true;
                          }
                          else {
                              this.loadForm = false;
                          }
                       });
                   });
                });
            })
    }

    saveChanges(): void {

        this.room.name = this.editRoomForm.value.name;
        this.room.password = this.editRoomForm.value.password;
        this.room.imgurl = this.editRoomForm.value.imgURL;
        this.room.editedAt = new Date();

        if(this.editRoomForm.valid) {
            MeteorObservable.call('updateRoom', this.room).subscribe((data) => {
                if(data == true) {
                    this.success = true;
                    this.successMsg = 'Changes has been saved';
                }
                else { }
            });
        }
        else {
            this.error = true;
            this.errMsg = 'Input wrong';
        }
    }
}