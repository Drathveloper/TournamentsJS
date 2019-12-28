/* Register form validation */

$(function () {
    $.getJSON('/users/userlist', function (data) {

        document.getElementById('register-form').addEventListener('submit', function (evt) {
            var username = document.getElementById('username').value;
            var firstName = document.getElementById('first_name').value;
            var lastName = document.getElementById('last_name').value;
            var birth = document.getElementById('birth_date').value;
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            var repassword = document.getElementById('rePassword').value;

            if (!validateUsername(username, 0, 15, data) || !checkLength(firstName, 0, 15) || !checkLength(lastName, 0, 15) ||
                !moment(birth).isSameOrAfter(new Date('1-1-1900')) || !validateMail(email, data) || !validatePassword(password) || !validatePassword(repassword) || password!=repassword) {
                evt.preventDefault();
                evt.stopPropagation();
                clearErrors();
                if (!validateUsername(username, 0, 15, data)) {
                    addError('El nombre de usuario no es válido o ya está en uso');
                }
                if (!checkLength(firstName, 0, 15)) {
                    addError('El nombre no puede quedar en blanco o ser tan largo');
                }
                if (!checkLength(lastName, 0, 30)) {
                    addError('Los apellidos no pueden quedar en blanco o ser tan largos');
                }
                if (!moment(birth).isSameOrAfter(new Date('1-1-1900')) || !moment(birth).isSameOrBefore(new Date())) {
                    addError('La fecha no es válida');
                }
                if (!validateMail(email, data)) {
                    addError('El email no es válido o ya está en uso');
                }
                if (!validatePassword(password) && !validatePassword(repassword)) {
                    addError('Las contraseñas no son válidas. 1 mayúscula, 1 minúscula, 1 carácter especial y una letra');
                }
                if(password!==repassword){
                    addError('Las contraseñas no coinciden.');
                }
                showErrors();
            }
        });

        $('#username').blur(function (evt) {
            if (!validateUsername(evt.target.value, 0, 15, data)) {
                clearErrors();
                addError('El nombre de usuario no es válido o ya está en uso');
                evt.target.classList.add('is-invalid');
                showErrors();
            } else {
                evt.target.classList.remove('is-invalid');
                evt.target.classList.add('is-valid');
                hideErrors();
            }
        });

        $('#first_name').blur(function (evt) {
            if (!checkLength(evt.target.value, 0, 15)) {
                clearErrors();
                addError('El nombre no puede quedar en blanco o ser tan largo');
                evt.target.classList.add('is-invalid');
                showErrors();
            } else {
                evt.target.classList.remove('is-invalid');
                evt.target.classList.add('is-valid');
                hideErrors();
            }
        });

        $('#last_name').blur(function (evt) {
            if (!checkLength(evt.target.value, 0, 30)) {
                clearErrors();
                addError('Los apellidos no pueden quedar en blanco o ser tan largos');
                evt.target.classList.add('is-invalid');
                showErrors();
            } else {
                evt.target.classList.remove('is-invalid');
                evt.target.classList.add('is-valid');
                hideErrors();
            }
        });

        $('#birth_date').blur(function (evt) {
            if (!moment(evt.target.value).isSameOrAfter(new Date('1-1-1900')) || !moment(evt.target.value).isSameOrBefore(new Date())) {
                clearErrors();
                addError('La fecha de nacimiento no es válida');
                evt.target.classList.add('is-invalid');
                showErrors();
            } else {
                evt.target.classList.remove('is-invalid');
                evt.target.classList.add('is-valid');
                hideErrors();
            }
        });

        $('#email').blur(function (evt) {
            if (!validateMail(evt.target.value, data)) {
                clearErrors();
                addError('El email no es válido o ya está en uso');
                evt.target.classList.add('is-invalid');
                showErrors();
            } else {
                evt.target.classList.remove('is-invalid');
                evt.target.classList.add('is-valid');
                hideErrors();
            }
        });

        $('#password').blur(function (evt) {
            if(!validatePassword(evt.target.value)){
                clearErrors();
                addError('La contraseña no es válida. 1 mayúscula, 1 minúscula, 1 carácter especial y una letra');
                evt.target.classList.add('is-invalid');
                showErrors();
            } else {
                evt.target.classList.remove('is-invalid');
                evt.target.classList.add('is-valid');
                hideErrors();
            }
        });

        $('#rePassword').blur(function (evt) {
            if(!validatePassword(evt.target.value) || evt.target.value !== document.getElementById('password').value){
                clearErrors();
                addError('Las contraseñas no coinciden');
                evt.target.classList.add('is-invalid');
                showErrors();
            } else {
                evt.target.classList.remove('is-invalid');
                evt.target.classList.add('is-valid');
                hideErrors();
            }
        });
    });
});

function checkLength(element, minlength, maxlength) {
    if (maxlength) {
        return checkMinLength(element, minlength) && checkMaxLength(element, maxlength);
    } else {
        return checkMinLength(element, minlength);
    }
}

function checkMinLength(element, length) {
    return element.length > length;
}

function checkMaxLength(element, length) {
    return element.length <= length;
}

function validateUsername(username, minlength, maxlength, list) {
    if (checkLength(username, minlength, maxlength)) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].username === username) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function validatePassword(password) {
    var regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\.\\,\\;\\:\\_\\-\\?\\$%\\^&\\*])(?=.{8,})";
    if (password.match(regex)) {
        return true;
    }
    return false;
}

function validateMail(mail, data) {
    var regex = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])";
    if (mail.match(regex)) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].email === mail) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function clearErrors() {
    var errors = document.getElementById('errors');
    while (errors.firstElementChild) {
        errors.removeChild(errors.firstElementChild);
    }
}

function showErrors() {
    var errors = document.getElementById('errors');
    errors.classList.remove('hidden');
    errors.classList.add('alert');
    errors.classList.add('alert-danger');
}

function hideErrors() {
    var errors = document.getElementById('errors');
    errors.classList.add('hidden');
    errors.classList.remove('alert');
    errors.classList.remove('alert-danger');
}

function addError(message) {
    var errors = document.getElementById('errors');
    var error = document.createElement('p');
    if (errors.children.length === 0) {
        error.classList.add('mt-3');
    }
    error.innerHTML = message;
    errors.appendChild(error);
}