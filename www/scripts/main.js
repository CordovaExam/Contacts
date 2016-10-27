(function () {
    "use strict";
    
    Include('scripts/utils.js');
    Include('scripts/contacts.js');

    function Include(path) {
        var imported = document.createElement('script');
        imported.src = path;
        document.head.appendChild(imported);
    }

    /*
    * Licensed to the Apache Software Foundation (ASF) under one
    * or more contributor license agreements.  See the NOTICE file
    * distributed with this work for additional information
    * regarding copyright ownership.  The ASF licenses this file
    * to you under the Apache License, Version 2.0 (the
    * "License"); you may not use this file except in compliance
    * with the License.  You may obtain a copy of the License at
    *
    * http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing,
    * software distributed under the License is distributed on an
    * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    * KIND, either express or implied.  See the License for the
    * specific language governing permissions and limitations
    * under the License.
    */
    var app = {
        // Application Constructor
        initialize: function() {
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function() {

            main.onInitial();

        },
    };
    app.initialize();


    var main = {

        // delcare constant
        btn_Delete_ok : '#btn-DeleteOk',

        onInitial : function() {

            main.switchForm(0);
            resetInputFields();

            $("#tab-Add").click(function() {
                main.switchForm(0);
            });

            $("#tab-Find").click(function() {
                main.switchForm(1);
                Contacts.FindContacts();
            });

            $("#tab-Pick").click(function() {
                Contacts.PickContact();
            });

            // open pick photos 
            $("#btn-photo").click(function() {
                util.GetPictureFrom(Camera.PictureSourceType.PHOTOLIBRARY);
            });
            $("#btn-camera").click(function() {
                util.GetPictureFrom(Camera.PictureSourceType.CAMERA );
            });

            // add submit
            $("#btn-Add").click(function() {
                var data = {
                    "displayName": document.getElementById("text-name").value,
                    "mobile": document.getElementById("text-mobile").value,
                    "email": document.getElementById("text-email").value,
                    "photoUrl": document.getElementById("img-photo").src,
                    "givenName" : document.getElementById("text-name").value,
                    "familyName" : ""
                };
               Contacts.CreateContact(data);
            });

            // delete contact
            $(this.btn_Delete_ok).click(function(){
                var rawId = document.getElementById("btn-DeleteOk").getAttribute('val');
                Contacts.DeleteContact(rawId);
            });

        },

        /////////////////////////////
        switchForm : function (val) {
            var divmain = document.getElementById("main-body");

            if(divmain.value == val)
                return;
            divmain.value = val;
            var v = new Array(
                document.getElementById("add-contacts"),
                document.getElementById("find-contacts"),
                document.getElementById("count-contacts")
            );
            for(var i=0;i<v.length;++i)
                v[i].setAttribute('style', (i == val)? "display:block;" : "display:none;");
        }

    };

} )();




