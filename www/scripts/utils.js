
function makeTable(container, data) {
    var table = $("<table/>").addClass('CSSTableGenerator');
    $.each(data, function(rowIndex, r) {
        var row = $("<tr/>");
        $.each(r, function(colIndex, c) {
            row.append($("<t"+(rowIndex == 0 ?  "h" : "d")+"/>").text(c));
        });
        table.append(row);
    });
    return container.append(table);
}


//////////////////////////////////////////////////

function switchForm(val) {
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



function openDeletePopup(val2) {
    var myPopupDialog = document.getElementById("btn-DeleteOk");
    myPopupDialog.setAttribute('val', val2);
    $('#myPopupDialog').popup( 'open');
}

function GetPictureFromPhotoLib() {
    var option = { 
        quality: 1,
        width:60,
        height:60,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
   };
   navigator.camera.getPicture(onSuccess, onFail, option);

   function onSuccess(imageURL) {
        var image = document.getElementById('img-photo');
        var srcData = "data:image/jpeg;base64," + imageURL;
        console.log(srcData);
        image.src = srcData;
        //image.value = imageURL;
        image.value = srcData;
   }

   function onFail(message) {
      alert('Failed because: ' + message);
   }

}
//////////////////////////////////////////////////
// CreateContact
function CreateContact(data) {

   var myContact = navigator.contacts.create({"displayName": data.displayName});

    var name = new ContactName();
    name.givenName = "Jane";
    name.familyName = "Doe";
    myContact.name = name;

    var emails = [];
    emails[0] = new ContactField('work', data.email, false);
    myContact.emails = emails;


    if(data.photoUrl.length > 0) {
        var photos = [];
        //photos[0] = new ContactField('url', data.photoUrl,true);
        photos[0] = new ContactField('base64', data.photoUrl,true); 

        myContact.photos = photos; 

        alert(myContact.photos[0].value);
    }

    myContact.save(onSuccessCallBack, onErrorCallBack);


   function onSuccessCallBack() {
      alert("Contact is saved!")
   }

   function onErrorCallBack(message) {
      alert('Failed because: ' + message);
   }

}

//////////////////////////////////////////////////
// FindContacts
function FindContacts() {
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    //options.desiredFields = [navigator.contacts.fieldType.id];
    options.hasPhoneNumber = true;
    var fields = [
            navigator.contacts.fieldType.displayName,
            navigator.contacts.fieldType.emails,
            navigator.contacts.fieldType.photos,
    ];
    navigator.contacts.find(fields, contactfindSuccess, contactfindError, options);

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
            alert(contactPhoto);
        }
        img.setAttribute('src',contactPhoto);
        var h2 = document.createElement('h2');
        h2.innerHTML = contact.displayName;

        var p = document.createElement('p');
        if (contact.emails) {
            for (var j = 0; j < contact.emails.length; j++)
                if (contact.emails[j].value) {
                    p.innerHTML = contact.emails[j].value;
                    break;
                }
        }        

        a.appendChild(img);
        a.appendChild(h2);
        a.appendChild(p);

        objItem.appendChild(a);
        // link popup
        var va = document.createElement('a');
        va.setAttribute('href','javascript:openDeletePopup("'+contact.rawId+'")');
        va.setAttribute('data-rel','popup');
        va.setAttribute('data-position-to','window');
        va.setAttribute('data-transition','fade');
        va.setAttribute('name',contact.displayName);
        va.innerHTML = 'Delete';
        objItem.innerHTML += va.outerHTML;
        return objItem;
    }

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

}
//////////////////////////////////////////////////
function PickContact() {

    navigator.contacts.pickContact(function(contact){
            alert(JSON.stringify(contact));
            console.log('The following contact has been selected:' + JSON.stringify(contact));
        },function(err){
            console.log('Error: ' + err);
        });
}
//////////////////////////////////////////////////
// FindContacts
function DeleteContact(rawId) {
    var options = new ContactFindOptions();
    options.filter = '1';
    options.multiple = false;
    //options.desiredFields = [navigator.contacts.fieldType.id];
    //options.hasPhoneNumber = true;
    var fields = [
            navigator.contacts.fieldType.rawId,
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
                FindContacts();
            }

            function contactRemoveError(message) {
                alert('Failed because: ' + message);
            }
        
    }
    function contactfindError(message) {
        alert('Failed because: ' + message);
    }
}


/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

/**
 * Create a Image file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
 */
function savebase64AsImageFile(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);
    
    console.log("Starting to write the file :3");
    
    window.resolveLocalFileSystemURL(folderpath, function(dir) {
        console.log("Access to the directory granted succesfully");
		dir.getFile(filename, {create:true}, function(file) {
            console.log("File created succesfully.");
            file.createWriter(function(fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function(){
                alert('Unable to save file in path '+ folderpath);
            });
		});
    });
}

function example_Savebase64ToFile() {
    // Remember to execute this after the onDeviceReady event

    // If your base64 string contains "data:image/png;base64,"" at the beginning, keep reading.
    var myBase64 = "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";
    // To define the type of the Blob
    var contentType = "image/png";
    // if cordova.file is not available use instead :
    // var folderpath = "file:///storage/emulated/0/";
    var folderpath = cordova.file.externalRootDirectory;
    var filename = "ourcodeworld.png";

    savebase64AsImageFile(folderpath,filename,myBase64,contentType);


    // This type is common when using toDataUrl() on a canvas.
    var type1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkYAAAD.................";
    // The plain base64 content of a file, maybe retrieven from a server ?
    var type2 = "iVBORw0KGgoAAAANSUhEUgAAAkYAAAD.................";

    /** Process the type1 base64 string **/
var myBaseString = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkYAAA.....";

// Split the base64 string in data and contentType
var block = myBaseString.split(";");
// Get the content type
var dataType = block[0].split(":")[1];// In this case "image/png"
// get the real base64 content of the file
var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

// The path where the file will be created
var folderpath = "file:///storage/emulated/0/";
// The name of your file, note that you need to know if is .png,.jpeg etc
var filename = "myimage.png";

savebase64AsImageFile(folderpath,filename,realData,dataType);

// The base64 content
var myBase64 = "iVBORw0KGgoAAAANSUhEUgAAANIAAAD......";
// To define the type of the Blob, you need to get this value by yourself (maybe according to the file extension)
var contentType = "image/png";
// The path where the file will be saved
var folderpath = "file:///storage/emulated/0/";
// The name of your file
var filename = "myphoto.png";

savebase64AsImageFile(folderpath,filename,myBase64,contentType);
}