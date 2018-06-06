import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { EmailValidator } from '../validators/validators';

import template from './register.component.html';
import style from './register.scss';

@Component({
    selector: 'register',
    template,
    styles: [style]
})

export class RegisterComponent implements OnInit {

    registerForm: FormGroup;
    regError: boolean = false;
    regMsg: string;


    constructor(
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {

        this.regError = false;
        this.regMsg = '';

        this.registerForm = this.formBuilder.group({
            username: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(3),
                Validators.pattern('[A-Za-z]{3}')
            ])),
            password: new FormControl('', Validators.compose([
                Validators.required
            ])),
            passwordRepeat: new FormControl('', Validators.compose([
                Validators.required
            ])),
            email: new FormControl('', Validators.compose([
                Validators.required,
                EmailValidator.isValidMailFormat,
            ])),
        })
    }

    register(): void {

        this.regError = false;
        this.regMsg = '';

        let username = this.registerForm.value.username.toLowerCase();
        let password = this.registerForm.value.password;
        let passwordRepeat = this.registerForm.value.passwordRepeat;
        let email = this.registerForm.value.email;

        if(this.registerForm.valid) {
            if(password == passwordRepeat) {
                Accounts.createUser({
                    email: email,
                    username: username,
                    password: password
                }, function (error) {
                    if ( error ) {
                        console.log("error");
                    }
                });
            }
            else {
                this.regError = true;
                this.regMsg = 'Passwörter stimmen nicht überein';
            }
        }
        else {
            this.regError = true;
            this.regMsg = 'Eingaben falsch';
        }
    }

}