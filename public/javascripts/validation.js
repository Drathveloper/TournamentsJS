/* Tournament form validation */

document.getElementById('tournament-form').addEventListener('submit', function (evt) {
    var name = document.getElementById('name');
    var date = document.getElementById('date');
    var cap = document.getElementById('player_cap');
    var type = document.getElementById('type');

    if(name.value.length <= 0 || name.value.length > 30 || !moment(date.value).isSameOrAfter(new Date(), 'day') ||
        cap.value.length <= 0 || cap.value < 4 || type.value.length<=0 || type.value.length>4){
        evt.preventDefault();
        clearErrors();
        if(name.value.length <= 0){
            addError('El nombre no puede estar vacío');
        } else if(name.value.length > 30){
            addError('El nombre es demasiado largo');
        }
        if(!moment(date.value).isSameOrAfter(new Date(), 'day')){
            addError('La fecha debe ser igual o posterior a la actual');
        }
        if(cap.value.length <= 0){
            addError('El nº máximo de jugadores no puede estar vacío');
        } else if(cap.value < 4){
            addError('El nº máximo de jugadores no puede ser inferior a 4');
        }
        if(type.value.length<=0 || type.value.length > 4){
            addError('La opción seleccionada no existe');
        }
        showErrors();
    }
});

document.getElementById('name').addEventListener('blur', function (evt) {
    if(evt.target.value.length <= 0){
        clearErrors();
        addError('El nombre no puede estar vacío');
        evt.target.classList.add('is-invalid');
        showErrors();
    } else if(evt.target.value.length > 30){
        clearErrors();
        addError('El nombre es demasiado largo');
        evt.target.classList.add('is-invalid');
        showErrors();
    } else {
        evt.target.classList.remove('is-invalid');
        evt.target.classList.add('is-valid');
        hideErrors();
    }
});

document.getElementById('date').addEventListener('blur', function (evt) {
    if(!moment(evt.target.value).isSameOrAfter(new Date(), 'day')){
        clearErrors();
        addError('La fecha debe ser igual o posterior a la actual');
        evt.target.classList.add('is-invalid');
        showErrors();
    } else {
        evt.target.classList.remove('is-invalid');
        evt.target.classList.add('is-valid');
        hideErrors();
    }
});

document.getElementById('player_cap').addEventListener('blur', function (evt) {
    if(evt.target.value.length <= 0){
        clearErrors();
        addError('El nº máximo de jugadores no puede estar vacío');
        evt.target.classList.add('is-invalid');
        showErrors();
    } else if(evt.target.value < 4){
        clearErrors();
        addError('El nº máximo de jugadores no puede ser inferior a 4');
        evt.target.classList.add('is-invalid');
        showErrors();
    } else {
        evt.target.classList.remove('is-invalid');
        evt.target.classList.add('is-valid');
        hideErrors();
    }
});

function clearErrors() {
    var errors = document.getElementById('errors');
    while (errors.firstElementChild) {
        errors.removeChild(errors.firstElementChild);
    }
}

function showErrors(){
    var errors = document.getElementById('errors');
    errors.classList.remove('hidden');
    errors.classList.add('alert');
    errors.classList.add('alert-danger');
}

function hideErrors(){
    var errors = document.getElementById('errors');
    errors.classList.add('hidden');
    errors.classList.remove('alert');
    errors.classList.remove('alert-danger');
}

function addError(message){
    var errors = document.getElementById('errors');
    var error = document.createElement('p');
    if(errors.children.length === 0){
        error.classList.add('mt-3');
    }
    error.innerHTML = message;
    errors.appendChild(error);
}