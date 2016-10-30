# Contacts
Using JQuery mobile, implements Add, Find and delete contact including photo

install plugin

        cordova plugin add cordova-plugin-contacts

Create Contacts inclue photos

In android platform, If you want to handle with photos, you should update some source code in  android project src folder that file is ContactAccessorSdk5.java in org folder.

        // add import lib
        import android.util.Base64;
        import android.util.Base64InputStream;
        import android.util.Log;

// update getPathFromUri function to like below 

        private InputStream getPathFromUri(String path) throws IOException {

                if (path.startsWith("data:")) { // data:image/png;base64,[ENCODED_IMAGE]
                    String dataInfos = path.substring(0, path.indexOf(',')); // data:image/png;base64
                    dataInfos = dataInfos.substring(dataInfos.indexOf(':') + 1); // image/png;base64
                    String baseEncoding = dataInfos.substring(dataInfos.indexOf(';') + 1); // base64
                    if("base64".equalsIgnoreCase(baseEncoding)) {
                        String img = path.substring(path.indexOf(',') + 1); // [ENCODED_IMAGE]
                        byte[] encodedData = img.getBytes();
                        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(encodedData, 0, encodedData.length);
                        Base64InputStream base64InputStream = new Base64InputStream(byteArrayInputStream, Base64.DEFAULT);
                        return base64InputStream;
                    } else {
                        Log.w(LOG_TAG, "Could not decode image. The found base encoding is " + baseEncoding);

                    }
                }
                if (path.startsWith("content:")) {
                    Uri uri = Uri.parse(path);
                    return mApp.getActivity().getContentResolver().openInputStream(uri);
                }

                if (path.startsWith("http:") || path.startsWith("https:") || path.startsWith("file:")) {

                    URL url = new URL(path);
                    return url.openStream();
                }
                else {
                    return new FileInputStream(path);
                }
            }
            
example create contact

    // CreateContact
    function CreateContact(data) {

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
            photos[0] = new ContactField('base64', data.photoUrl, true); 
            myContact.photos = photos; 
        }

        myContact.save(onSuccessCallBack, onErrorCallBack);

        function onSuccessCallBack() {
            alert("Contact is saved!");
        }

        function onErrorCallBack(message) {
            alert('Failed because: ' + message);
        }
    }
