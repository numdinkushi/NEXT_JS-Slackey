export function validatePassword(password: string) {
    const hasUpperCase = /[A-Z]/.test(password);  // Checks for at least one uppercase letter
    const hasNumber = /[0-9]/.test(password);     // Checks for at least one number
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);  // Checks for at least one special character
    const isLongEnough = password.length > 8;     // Checks if password length is greater than 8 characters

    if (!isLongEnough) {
        return 'Password must be longer than 8 characters.';
    }

    if (!hasUpperCase) {
        return 'Password must contain at least one uppercase letter.';
    }
    if (!hasNumber) {
        return 'Password must contain at least one number.';
    }
    if (!hasSpecialChar) {
        return 'Password must contain at least one special character.';
    }

    // return true;  // Password is valid
}
