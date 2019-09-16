window.onload = function() {
    checkToken();               //判断token，如为空则跳转到登录页面
    addHeader();                //添加页眉
}

function addHeader() {
    var pageHeader = new PageHeader();
    pageHeader.init(document.getElementsByClassName('out-box')[0], 4);
}