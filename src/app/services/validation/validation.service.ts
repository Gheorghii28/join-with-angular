import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    // The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
    isPasswordValid(password: string): boolean {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
        const isPasswordValid = (
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasDigit &&
            (hasSpecialChar || true)
        );
        return isPasswordValid;
    }

    isEmailValid(email: string): boolean {
        const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        return isEmailValid;
    }

    isNotEmpty(input: string): boolean {
        const isNotEmpty = input.trim().length > 0;
        return isNotEmpty;
    }

    isFieldEmpty(formular: any, field: string, value: string) {
        return formular.controls[field].errors && value.length == 0;
    }

    isInvalidEmail(emailValue: string) {
        return !this.isEmailValid(emailValue) && emailValue.length > 0;
    }
}
