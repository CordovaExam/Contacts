//////////////////////////////////////////////////
// Class of Contact
var Contacts = {

    //////////////////////////////////////////////////
    // CreateContact
    CreateContact : function (data) {

        if(data.displayName.length < 1)
            return false;

        var initData = {
            'displayName': data.displayName,
        };

        var myContact = navigator.contacts.create(initData);
        var name = new ContactName();
        name.givenName = data.givenName;
        name.familyName = data.familyName;
        myContact.name = name;

        if(data.email.length > 0) {
            var emails = [];
            emails[0] = new ContactField('work', data.email, false);
            myContact.emails = emails;
        }

        if(data.mobile.length > 0) {
            var phoneNumbers = [];
            phoneNumbers[0] = new ContactField('mobile', data.mobile, false); 
            myContact.phoneNumbers = phoneNumbers; 
        }

        if(data.photoUrl.length > 0 && data.photoUrl != 'images/person_blank.png') {
            var photos = [];
            //photos[0] = new ContactField('url', data.photoUrl,true);
            photos[0] = new ContactField('base64', data.photoUrl, true); 
            myContact.photos = photos; 
        }

        myContact.save(onSuccessCallBack, onErrorCallBack);


        function onSuccessCallBack() {
            alert("Contact is saved!");
            resetInputFields();
        }

        function onErrorCallBack(message) {
            alert('Failed because: ' + message);
        }

        return true;

    },
    //////////////////////////////////////////////////
    // FindContacts
    FindContacts : function () {
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        //options.desiredFields = [navigator.contacts.fieldType.id];
        options.hasPhoneNumber = true;
        var fields = [
                navigator.contacts.fieldType.displayName,
                navigator.contacts.fieldType.phoneNumbers,
                navigator.contacts.fieldType.emails,
                navigator.contacts.fieldType.photos,
        ];
        navigator.contacts.find(fields, contactfindSuccess, contactfindError, options);

        function contactfindSuccess(contacts) {

            //alert(var_dump(contacts));
            var div = document.getElementById("total-contacts");
            div.innerHTML = "Total : "+contacts.length;

            var divListview = document.getElementById("find-list-body");

            // clear the existing list
            $('#find-list-body li').remove();

            // add list items
            for (var i = 0; i < contacts.length; i++) {
                if(contacts[i].displayName) {
                divListview.appendChild(createFormElement(contacts[i]));
                }
            }

            $(divListview).listview("refresh");


        }

        function contactfindError(message) {
            alert('Failed because: ' + message);
        }

        function createFormElement(contact) {

            var objItem = document.createElement('li');
            objItem.setAttribute('id','listitem');
            //objItem.setAttribute('data-role','list-divider');

            var a = document.createElement('a');
            a.setAttribute('href','#');


            var contactPhoto = 'images/person_blank.png';
            var img = document.createElement('img');
            if (contact.photos && contact.photos.length > 0) {
                contactPhoto = contact.photos[0].value;
                //alert(contactPhoto);
            }
            img.setAttribute('src',contactPhoto);
            var h2 = document.createElement('h2');
            h2.innerHTML = contact.displayName;

            var p = document.createElement('p');
            if (contact.phoneNumbers) {
                for (var j = 0; j < contact.phoneNumbers.length; j++)
                    if (contact.phoneNumbers[j].value) {
                        p.innerHTML = contact.phoneNumbers[j].value;
                        break;
                    }
            }        

            a.appendChild(img);
            a.appendChild(h2);
            a.appendChild(p);

            objItem.appendChild(a);
            // link popup
            var va = document.createElement('a');
            va.setAttribute('href','javascript:openDeletePopup("'+contact.id+'")');
            va.setAttribute('data-rel','popup');
            va.setAttribute('data-position-to','window');
            va.setAttribute('data-transition','fade');
            va.setAttribute('name',contact.displayName);
            va.innerHTML = 'Delete';
            objItem.innerHTML += va.outerHTML;
            return objItem;
        }
    },
    //////////////////////////////////////////////////
    // DeleteContact
    DeleteContact : function (searchTerm) {
        var options = new ContactFindOptions();
        options.filter = searchTerm;
        options.multiple = false;
        //options.desiredFields = [navigator.contacts.fieldType.id];
        //options.hasPhoneNumber = true;
        var fields = [
            navigator.contacts.fieldType.id,
        ];

        navigator.contacts.find(fields, contactfindSuccess, contactfindError, options);
        
        function contactfindSuccess(contacts) {
            if(contacts.length < 1) {
                alert('not found info');
                return;
            }
            var contact = contacts[0];
            contact.remove(contactRemoveSuccess, contactRemoveError);

            function contactRemoveSuccess(contact) {
                alert("Contact Deleted");
                Contacts.FindContacts();
            }

            function contactRemoveError(message) {
                alert('Failed because: ' + message);
            }
            
        }
        function contactfindError(message) {
            alert('Failed because: ' + message);
        }
    },

    
    //////////////////////////////////////////////////
    PickContact : function () {

        navigator.contacts.pickContact(function(contact){
                alert(JSON.stringify(contact));
                console.log('The following contact has been selected:' + JSON.stringify(contact));
            },function(err){
                console.log('Error: ' + err);
            });
    }

};

