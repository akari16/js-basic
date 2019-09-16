var WebService = window.WebService = WebService || {};

//post JSON请求
function _PostRequest(_path, _params, _func, _udata, _sync) {
    var xmlhttp = new XMLHttpRequest(); 
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var retJson = JSON.parse(xmlhttp.responseText); 
            _func ? _func(retJson.ret, retJson.ret ? retJson.data : retJson.msg, _udata) : 0;
        } else if (xmlhttp.readyState==4){
            //出错
            JSON.parse(xmlhttp.responseText).msg == 'token error.' ? self.location = 'login.html' : alert(JSON.parse(xmlhttp.responseText).msg);
		}
    }
    xmlhttp.open("POST", _path, !_sync);
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xmlhttp.send(JSON.stringify(_params));
}

//登录
WebService.login = function(_userid, _password, _func, _udata) {
    _PostRequest(CONST_API_USER + 'login', {user: _userid, pwd: _password}, _func, _udata, false);
}

//获取工单列表接口
WebService.getOrderList = function(_token, _page, _pagesize, _status, _func, _udata) {
    _PostRequest(CONST_API_ORDER + 'getrepairlist', { token: _token, 
                                                page: _page, 
                                                pagesize: _pagesize, 
                                                status: _status }, _func, _udata, false)
}

WebService.getDevinfos = function(_token, _devids, _func, _udata) {
    _PostRequest(CONST_API_DEV + 'gets', { token: _token, devids: _devids }, _func, _udata, false)
}

WebService.getOrderRecord = function(_token, _orderid, _func, _udata) {
    _PostRequest(CONST_API_ORDER + 'getlog', {token: _token, orderid: _orderid}, _func, _udata, false)
}

WebService.acceptRepair = function(_token, _orderid, _content, _dictdata, _func, _udata) {
    _PostRequest(CONST_API_ORDER + 'acceptrepair', {token: _token, 
                                                orderid: _orderid,
                                                content: _content,
                                                udata: _dictdata}, _func, _udata, true)
}

WebService.rejectRepair = function(_token, _orderid, _content, _dictdata, _func, _udata) {
    _PostRequest(CONST_API_ORDER + 'rejectrepair', {token: _token, 
                                                orderid: _orderid,
                                                content: _content,
                                                udata: _dictdata}, _func, _udata, true)
}

WebService.completeRepair = function(_token, _orderid, _content, _dictdata, _func, _udata) {
    _PostRequest(CONST_API_ORDER + 'repaired', {token: _token, 
                                                orderid: _orderid,
                                                content: _content,
                                                udata: _dictdata}, _func, _udata, true)
}