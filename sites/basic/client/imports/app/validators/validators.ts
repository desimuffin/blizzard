import {FormControl} from '@angular/forms';


export class EmailValidator {

    static isValidMailFormat(control: FormControl){
        let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { "Please provide a valid email": true };
        }

        return null;
    }

}

export class UrlValidator {

    static isValidUrlFormat(control: FormControl) {
        let URL_REGEXP = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

        if(control.value != "" && (control.value.length <= 8 || !URL_REGEXP.test(control.value))) {
            return { "Please provide a valid URL": true };
        }

        return null;
    }

}