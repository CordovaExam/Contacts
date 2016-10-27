
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );

        onInitial();
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();

function onInitial() {
    // var element = document.getElementById("deviceready");
    // element.innerHTML = 'Device Ready';
    // element.className += ' ready';

    switchForm(0);

    // basic usage
    // TTS
    //     .speak('hello, world!', function () {
    //        // console.log('success');
    //     }, function (reason) {
    //         alert(reason);
    //     });

    // or with more options
    // TTS
    //     .speak({
    //         text: 'hello, benjamin!',
    //         locale: 'en-GB',
    //         rate: 1.25
    //     }, function () {
    //         //console.log('success');
    //     }, function (reason) {
    //         alert(reason);
    //     });

    document.getElementById("tab-Add").addEventListener("click", function() {
        switchForm(0);
    });

    document.getElementById("tab-Find").addEventListener("click", function() {
        switchForm(1);
        FindContacts();
    });

    document.getElementById("tab-Pick").addEventListener("click", function() {
        PickContact();
    });

    $("#btn-photo").click(function() {
        GetPictureFromPhotoLib();
    });
    // add submit
    document.getElementById("btn-Add").addEventListener("click", function() {
        var data = {
            "displayName": document.getElementById("text-name").value,
            "email": document.getElementById("text-email").value,
            "photoUrl": document.getElementById("img-photo").value,
        };
        CreateContact(data);
    });

    const btn_Delete_ok = "btn-DeleteOk";
    // delete contact
    document.getElementById(btn_Delete_ok).addEventListener("click", function(){
        var rawId = document.getElementById(btn_Delete_ok).getAttribute('val');
        DeleteContact(rawId);
    });

};





