$(function () {
    if (window.indexedDB) {
        populateSelect();

        $("#rapid-form").hide();
        $("#rapid-select").hide();

        $("#rapid-form-show").click(function (evt) {
            $("#rapid-form").show();
            $("#rapid-form-show").hide();
            $("#rapid-form-hide").show();
        });

        $("#rapid-form-hide").click(function (evt) {
            $("#rapid-form").hide();
            $("#rapid-form-hide").hide();
            $("#rapid-form-show").show();
        });

        $("#rapid-select-show").click(function (evt) {
            $("#rapid-select").show();
            $("#rapid-select-show").hide();
            $("#rapid-select-hide").show();
        });

        $("#rapid-select-hide").click(function (evt) {
            $("#rapid-select").hide();
            $("#rapid-select-hide").hide();
            $("#rapid-select-show").show();
        });

        $("#rapid-form-submit").click(function (evt) {
            var db = indexedDB.open('rapid-session');
            db.onupgradeneeded = function (evt) {
                var thisDB = evt.target.result;
                if (!thisDB.objectStoreNames.contains("users")) {
                    thisDB.createObjectStore("users", {keyPath: "username"}); // crear tabla
                }
            };
            db.onsuccess = function (evt) {
                var transaction = evt.target.result.transaction(["users"], "readwrite");
                var store = transaction.objectStore("users");

                var user = {
                    username: $('#rapid-form-user').val(),
                    password: $('#rapid-form-password').val(),
                };
                store.put(user);
                populateSelect();
                alert('Usuario añadido correctamente');
            }
        });

        $("#rapid-select-remove").click(rapidRemove);

        $("#rapid-select-use").click(rapidLogin);

    } else {
        $("#rapid").hide();
    }

});

function rapidRemove(){
    var db = indexedDB.open('rapid-session');
    db.onsuccess = function(evt){
        var transaction = evt.target.result.transaction(["users"], "readwrite");
        var store = transaction.objectStore("users");
        var result = store.delete($("#rapid-session").val());
        result.onsuccess = function(evt){
            populateSelect();
        }
        result.onerror = function (evt) {
            console.log('Esta todo mal');
        }
    };
}

function rapidLogin(){
    var db = indexedDB.open('rapid-session');
    db.onsuccess = function(evt){
        var transaction = evt.target.result.transaction(["users"], "readonly");
        var store = transaction.objectStore("users");
        var result = store.get($('#rapid-session').val());
        result.onsuccess = function (evt) {
            var usr = evt.target.result;
            $("#username").val(usr.username);
            $("#password").val(usr.password);
            $("#thesubmit").trigger('click');
        };
        result.onerror = function (evt) {
            alert('Error sano');
        }
    }
}

function populateSelect() {
    var db = indexedDB.open('rapid-session');
    db.onupgradeneeded = function (evt) {
        var thisDB = evt.target.result;
        if (!thisDB.objectStoreNames.contains("users")) {
            thisDB.createObjectStore("users", {keyPath: "username"});
        }
    };
    db.onsuccess = function (evt) {
        var transaction = evt.target.result.transaction(["users"], "readonly");
        var store = transaction.objectStore("users");
        while(document.getElementById('rapid-session').firstChild){
            document.getElementById('rapid-session').removeChild(document.getElementById('rapid-session').firstChild);
        }
        store.getAll().onsuccess = function (evt) {
            for (let i = 0; i < evt.target.result.length; i++) {
                var usr = evt.target.result[i].username;
                $("#rapid-session").append($("<option value='" + usr + "'>" + usr + "</option>"));
            }
        };
    }
}

