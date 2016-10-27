
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

//////////////////////////////////////////////////
var util = {

    GetPictureFromPhotoLib : function () {
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
   
}



