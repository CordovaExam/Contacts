
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
function openDeletePopup(val2) {
    var myPopupDialog = document.getElementById("btn-DeleteOk");
    myPopupDialog.setAttribute('val', val2);
    $('#myPopupDialog').popup( 'open');
}

// reset input fields
function resetInputFields() {
    document.getElementById("text-name").value = '';
    document.getElementById("text-mobile").value = '';
    document.getElementById("text-email").value = '';
    document.getElementById("img-photo").src = 'images/person_blank.png';
}
//////////////////////////////////////////////////
var util = {

    GetPictureFrom : function (srcType) {

        //var destType = Camera.DestinationType.FILE_URI;
        var destType = Camera.DestinationType.DATA_URL;
        navigator.camera.getPicture(onSuccess, onFail,  { 
            quality: 90,
            targetWidth:80,
            targetHeight:100,
            destinationType: destType,
            sourceType: srcType,
            cameraDirection : Camera.Direction.FRONT ,
        });

        function onSuccess(imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:            
            var image = document.getElementById('img-photo');
            if(destType == Camera.DestinationType.FILE_URI) {
                image.src = imageURL;
            }
            else {
                var base64Image  = "data:image/jpeg;base64," + imageData;
                image.src = base64Image ;
            }
            //console.log(srcData);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    }
   
}



