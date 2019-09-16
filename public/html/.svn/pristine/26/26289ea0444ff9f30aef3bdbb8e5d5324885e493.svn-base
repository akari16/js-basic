window.onload = function() {
    addHeader();
    WebService.getCheckModule(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {

        }else{
            alert(_data.msg);
        }
    })
}

function addHeader() {
    var pageHeader = new PageHeader();
    pageHeader.init(document.getElementsByClassName('out-box')[0], 5);
}