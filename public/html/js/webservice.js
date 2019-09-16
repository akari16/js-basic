var WebService = window.WebService = WebService || {};

//post JSON请求
function _PostRequest(_path, _params, _func, _udata, _sync) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var retJson = JSON.parse(xmlhttp.responseText);
            console.log(retJson);
            _func ? _func(retJson.ret, retJson.ret ? retJson.data : retJson.msg, _udata) : 0;
        } else if (xmlhttp.readyState == 4) {
            //出错
            JSON.parse(xmlhttp.responseText).msg == 'token error.' ?
                // self.location = 'login.html' :
                console.log(JSON.parse(xmlhttp.responseText).msg) :
                alert(JSON.parse(xmlhttp.responseText).msg);
        }
    }
    xmlhttp.open("POST", _path, !_sync);
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xmlhttp.send(JSON.stringify(_params));
}

//登录
WebService.login = function (_userid, _password, _func, _udata) {
    _PostRequest(CONST_API_USER + 'login', {
        user: _userid,
        pwd: _password,
        type: ""
    }, _func, _udata, false);
}

//获取区域下的区域和设备
WebService.getAreaAndDev = function (_token, _parentid, _recursive, _type, _func, _udata) {
    console.log(_token);
    _PostRequest(CONST_API_AREA + 'getlist', {
        token: _token,
        parentid: _parentid,
        recursive: _recursive,
        type: _type
    }, _func, _udata, false);
}

//根据区域id查询设备
WebService.getDevByArea = function (_token, _parentid, _recursive, _type, _func, _udata) {
    _PostRequest(CONST_API_DEV + 'getbyarea', {
        token: _token,
        parentid: _parentid,
        recursive: _recursive,
        type: _type
    }, _func, _udata, false);
}

//根据区域id查询下级区域
WebService.getChildrenAreaById = function (_token, _parentid, _recursive, _func, _udata) {
    _PostRequest(CONST_API_AREA + 'getlist', {
        token: _token,
        parentid: _parentid,
        recursive: _recursive
    }, _func, _udata, false);
}

//根据区域id获取区域信息
WebService.getAreaById = function (_token, _areaid, _func, _udata) {
    _PostRequest(CONST_API_AREA + 'get', {
        token: _token,
        areaid: _areaid
    }, _func, _udata, false);
}

//添加区域
WebService.addArea = function (_token, _parentid, _name, _func, _udata) {
    _PostRequest(CONST_API_AREA + 'add', {
        token: _token,
        parentid: _parentid,
        name: _name
    }, _func, _udata, false);
}

//修改区域
WebService.modityArea = function (_token, _areaid, _parentid, _name, _func, _udata) {
    _PostRequest(CONST_API_AREA + 'modify', {
        token: _token,
        areaid: _areaid,
        parentid: _parentid,
        name: _name
    }, _func, _udata, false);
}

//删除区域
WebService.deleteArea = function (_token, _areaid, _func, _udata) {
    _PostRequest(CONST_API_AREA + 'del', {
        token: _token,
        areaid: _areaid
    }, _func, _udata, false);
}

//根据设备id查询设备信息
WebService.getDevInfo = function (_token, _devid, _func, _udata) {
    _PostRequest(CONST_API_DEV + 'get', {
        token: _token,
        devid: _devid
    }, _func, _udata, true);
}

//添加设备
WebService.addDev = function (
    _token,
    _name,
    _areaid,
    _type,
    _devno,
    _modelid,
    _projectid,
    _lng,
    _lat,
    _address,
    _propertystatus,
    _checkparams,
    _dictparams,
    _thresholdtemp,
    _devid,
    _func,
    _udata
) {
    console.log({
        token: _token,
        name: _name,
        areaid: _areaid,
        devtype: _type,
        devno: _devno,
        modelid: _modelid,
        projectid: _projectid,
        lng: _lng,
        lat: _lat,
        address: _address,
        propertystatus: _propertystatus,
        checkparams: _checkparams,
        dictparams: _dictparams,
        thresholdtemp: _thresholdtemp,
        devid: _devid,
    });
    _PostRequest(CONST_API_DEV + 'add', {
        token: _token,
        name: _name,
        areaid: _areaid,
        devtype: _type,
        devno: _devno,
        modelid: _modelid,
        projectid: _projectid,
        lng: _lng,
        lat: _lat,
        address: _address,
        propertystatus: _propertystatus,
        checkparams: _checkparams,
        dictparams: _dictparams,
        thresholdtemp: _thresholdtemp,
        devid: _devid,
    }, _func, _udata, false);
}

//修改设备
WebService.modifyDev = function (_token, _devid, _name, _areaid, _ip, _port, _linkparam, _producer, _builder, _buildtime, _model, _type, _describe, _func, _udata) {
    _PostRequest(CONST_API_DEV + 'modify', {
        token: _token,
        devid: _devid,
        name: _name,
        areaid: _areaid,
        ip: _ip,
        port: _port,
        linkparam: _linkparam,
        producer: _producer,
        builder: _builder,
        buildtime: _buildtime,
        model: _model,
        type: _type,
        describe: _describe
    }, _func, _udata, false);
}

//删除设备
WebService.deleteDev = function (_token, _devid, _func, _udata) {
    _PostRequest(CONST_API_DEV + 'del', {
        token: _token,
        devid: _devid
    }, _func, _udata, false)
}

//告警列表
WebService.getAlarmList = function (_token, _page, _pagesize, _status, _begintime, _endtime, _type, _devid, _level, _func, _udata) {
    _PostRequest(CONST_API_ALARM + 'getlist', {
        token: _token,
        page: _page,
        pagesize: _pagesize,
        status: _status,
        begintime: _begintime,
        endtime: _endtime,
        type: _type,
        devid: _devid,
        level: _level
    }, _func, _udata, false)
}

//确认告警
WebService.confirmAlarm = function (_token, _breakdownid, _func, _udata) {
    _PostRequest(CONST_API_ALARM + 'sure', {
        token: _token,
        breakdownid: _breakdownid
    }, _func, _udata, false)
}

//忽略告警
WebService.ignoreAlarm = function (_token, _breakdownid, _func, _udata) {
    _PostRequest(CONST_API_ALARM + 'ignore', {
        token: _token,
        breakdownid: _breakdownid
    }, _func, _udata, false)
}

//生成工单
WebService.createOrder = function (_token, _executor, _term, _content, _breakdownids, _devids, _udata, _func, _udata1) {
    _PostRequest(CONST_API_ORDER + 'add', {
        token: _token,
        executor: _executor,
        term: _term,
        content: _content,
        breakdownids: _breakdownids,
        devids: _devids,
        udata: _udata
    }, _func, _udata1, false)
}

//获取工单列表接口
WebService.getOrderList = function (_token, _page, _pagesize, _status, _allocator, _executor, _func, _udata) {
    _PostRequest(CONST_API_ORDER + 'getlist', {
        token: _token,
        page: _page,
        pagesize: _pagesize,
        status: _status,
        allocator: _allocator,
        executor: _executor
    }, _func, _udata, false)
}

//重启工单
WebService.RestartOrder = function (_token, _orderid, _executor, _term, _content, _udata, _func, _udata1) {
    _PostRequest(CONST_API_ORDER + 'resure', {
        token: _token,
        orderid: _orderid,
        executor: _executor,
        term: _term,
        content: _content,
        udata: _udata
    }, _func, _udata, false)
}

//关闭工单
WebService.CloseOrder = function (_token, _orderid, _content, _udata, _func, _udata1) {
    _PostRequest(CONST_API_ORDER + 'close', {
        token: _token,
        orderid: _orderid,
        content: _content,
        udata: _udata
    }, _func, _udata, false)
}

//获取工单记录
WebService.getOrderRecord = function (_token, _orderid, _func, _udata) {
    _PostRequest(CONST_API_ORDER + 'getlog', {
        token: _token,
        orderid: _orderid
    }, _func, _udata, false)
}

//获取巡检时间模板
WebService.getTimeTemp = function (_token, _func, _udata) {
    _PostRequest(CONST_API_TIMETEMP + 'get', {
        token: _token
    }, _func, _udata, false)
}

//添加时间模板
WebService.addTimeTemp = function (_token, _name, _week, _times, _func, _udata) {
    _PostRequest(CONST_API_TIMETEMP + 'add', {
        token: _token,
        name: _name,
        week: _week,
        times: _times
    }, _func, _udata, false)
}

//修改时间模板
WebService.modifyTimeTemp = function (_token, _id, _name, _week, _times, _func, _udata) {
    _PostRequest(CONST_API_TIMETEMP + 'modify', {
        token: _token,
        id: _id,
        name: _name,
        week: _week,
        times: _times
    }, _func, _udata, false)
}

//删除时间模板
WebService.deleteTimeTemp = function (_token, _id, _func, _udata) {
    _PostRequest(CONST_API_TIMETEMP + 'del', {
        token: _token,
        id: _id
    }, _func, _udata, false)
}

//获取巡检组
WebService.getCheckGroup = function (_token, _id, _func, _udata) {
    _PostRequest(CONST_API_CHECKDEVPLAN + 'getgroup', {
        token: _token,
        id: _id
    }, _func, _udata, false)
}

//添加巡检组
WebService.addCheckGroup = function (_token, _name, _devids, _func, _udata) {
    _PostRequest(CONST_API_CHECKDEVPLAN + 'addgroup', {
        token: _token,
        name: _name,
        devids: _devids
    }, _func, _udata, false)
}

//修改巡检组
WebService.modifyCheckGroup = function (_token, _id, _name, _devids, _func, _udata) {
    _PostRequest(CONST_API_CHECKDEVPLAN + 'modifygroup', {
        token: _token,
        id: _id,
        name: _name,
        devids: _devids
    }, _func, _udata, false)
}

//删除巡检组
WebService.deleteCheckGroup = function (_token, _id, _func, _udata) {
    _PostRequest(CONST_API_CHECKDEVPLAN + 'delgroup', {
        token: _token,
        id: _id
    }, _func, _udata, false)
}

//获取巡检计划
WebService.getCheckPlan = function (_token, _func, _udata) {
    _PostRequest(CONST_API_CHECKDEVPLAN + 'getplan', {
        token: _token
    }, _func, _udata, false)
}

//添加巡检计划
WebService.addCheckPlan = function (_token, _name, _timetemplateid, _checkdevgroups, _enable, _func, _udata) {
    _PostRequest(CONST_API_CHECKDEVPLAN + 'addplan', {
        token: _token,
        name: _name,
        timetemplateid: _timetemplateid,
        checkdevgroups: _checkdevgroups,
        enable: _enable
    }, _func, _udata, false)
}

//修改巡检计划
WebService.modifyCheckPlan = function (_token, _id, _name, _timetemplateid, _checkdevgroups, _enable, _func, _udata) {
    _PostRequest(CONST_API_CHECKDEVPLAN + 'modifyplan', {
        token: _token,
        id: _id,
        name: _name,
        timetemplateid: _timetemplateid,
        checkdevgroups: _checkdevgroups,
        enable: _enable
    }, _func, _udata, false)
}

//删除巡检计划
WebService.deleteCheckPlan = function (_token, _id, _func, _udata) {
    _PostRequest(CONST_API_CHECKDEVPLAN + 'delplan', {
        token: _token,
        id: _id
    }, _func, _udata, false)
}

//获取角色列表
WebService.getRoleList = function (_token, _func, _udata) {
    _PostRequest(CONST_API_USER + 'getrolelist', {
        token: _token
    }, _func, _udata, false)
}

//获取用户列表
WebService.getUserList = function (_token, _page, _pagesize, _areaid, _roleid, _recursive, _func, _udata) {
    _PostRequest(CONST_API_USER + 'getlist', {
        token: _token,
        page: _page,
        pagesize: _pagesize,
        areaid: _areaid,
        recursive: _recursive,
        roleid: _roleid
    }, _func, _udata, false)
}

//添加用户
WebService.addUser = function (_token, _userid, _username, _pwd, _tel, _email, _wechat, _postition, _roleid, _areaid, _func, _udata) {
    _PostRequest(CONST_API_USER + 'adduser', {
        token: _token,
        userid: _userid,
        username: _username,
        pwd: _pwd,
        tel: _tel,
        email: _email,
        wechat: _wechat,
        position: _postition,
        roleid: _roleid,
        areaid: _areaid
    }, _func, _udata, false)
}

//修改用户
WebService.modifyUser = function (_token, _userid, _username, _pwd, _tel, _email, _wechat, _postition, _roleid, _areaid, _func, _udata) {
    _PostRequest(CONST_API_USER + 'modifyuser', {
        token: _token,
        userid: _userid,
        username: _username,
        pwd: _pwd,
        tel: _tel,
        email: _email,
        wechat: _wechat,
        position: _postition,
        roleid: _roleid,
        areaid: _areaid
    }, _func, _udata, false)
}

//删除用户
WebService.deleteUser = function (_token, _userid, _func, _udata) {
    _PostRequest(CONST_API_USER + 'deluser', {
        token: _token,
        userid: _userid
    }, _func, _udata, false)
}

//获取mcu
WebService.getMcuList = function (_token, _func, _udata) {
    _PostRequest(CONST_API_OTHER + 'getmcu', {
        token: _token
    }, _func, _udata, false)
}

//添加MCU
WebService.addMcu = function (_token, _mcuid, _name, _uri, _func, _udata) {
    _PostRequest(CONST_API_OTHER + 'addmcu', {
        token: _token,
        mcuid: _mcuid,
        mcuname: _name,
        uri: _uri
    }, _func, _udata, false)
}

//修改MCU
WebService.modifyMcu = function (_token, _id, _mcuid, _name, _uri, _func, _udata) {
    _PostRequest(CONST_API_OTHER + 'modifymcu', {
        token: _token,
        id: _id,
        mcuid: _mcuid,
        mcuname: _name,
        uri: _uri
    }, _func, _udata, false)
}

//删除MCU
WebService.deleteMcu = function (_token, _id, _func, _udata) {
    _PostRequest(CONST_API_OTHER + 'deletemcu', {
        token: _token,
        id: _id
    }, _func, _udata, false)
}

//查询设备类型
WebService.getDevType = function (_token, _func, _udata) {
    _PostRequest(CONST_API_DEV + 'gettypelist', {
        token: _token
    }, _func, _udata, false)
}

//获取检测模块
WebService.getCheckModule = function (_token, _func, _udata) {
    _PostRequest(CONST_API_SYS + 'getcheckmodule', {
        token: _token
    }, _func, _udata, false)
}
//品牌型号
WebService.getBrandList = function (_token, _func, _udata) {
    _PostRequest(CONST_URL + 'dev/getbrandlist', {
        token: _token
    }, _func, _udata, false)
}
//添加设备品牌
WebService.addBrand = function (_token, _brandid, _brandname, _func, _udata) {
    _PostRequest(CONST_URL + 'dev/addbrand', {
        token: _token,
        brandid: _brandid,
        brandname: _brandname,
    }, _func, _udata, false)
}
//添加设备品牌型号
WebService.addBrandModel = function (_token, _model, _brandid, _func, _udata) {
    _PostRequest(CONST_URL + 'dev/addbrandmodel', {
        token: _token,
        model: _model,
        brandid: _brandid,
    }, _func, _udata, false)
}

//设备分类列表
WebService.getClassTypeList = function (_token, _func, _udata) {
    _PostRequest(CONST_URL + 'dev/getclasslist', {
        token: _token
    }, _func, _udata, false)
}

//设备类型列表
WebService.getTypeList = function (_token, classid, _func, _udata) {
    _PostRequest(CONST_URL + 'dev/gettypelist', {
        token: _token,
        classid: classid
    }, _func, _udata, false)
}

//设备品牌型号列表
WebService.getBrandModelList = function (_token, _brandid, _func, _udata) {
    _PostRequest(CONST_URL + 'dev/getbrandmodellist', {
        token: _token,
        brandid: _brandid
    }, _func, _udata, false)
}
//删除设备品牌
WebService.delBrandmodel = function (_token, _brandid, _func, _udata) {
    _PostRequest(CONST_URL + 'dev/delbrand', {
        token: _token,
        brandid: _brandid
    }, _func, _udata, false)
}

//建设工期
WebService.getProjectList = function (_token, _func, _udata) {
    _PostRequest(CONST_API_PROJECT + 'getlist', {
        token: _token
    }, _func, _udata, false)
}

//新增建设工期
WebService.addProject = function (_token, _params,
    _func, _udata) {
    console.log(_params)
    _PostRequest(CONST_API_PROJECT + 'add', {
        token: _token,
        projectname: _params._projectname,
        contactor: _params.contactor,
        buildtime: _params.buildtime,
        maintainer: _params.maintainer,
        mobile: _params.mobile,
        maintenacebegin: _params.maintenacebegin,
        maintenaceend: _params.maintenaceend
    }, _func, _udata, false)
}
//修改工期
WebService.editProjectModify = function (
    _token,
    _params,
    _func,
    _udata,
) {
    console.log(_params);
    _PostRequest(CONST_API_PROJECT + 'modify', {
        token: _token,
        projectid: _params.projectid,
        projectname: _params.projectname,
        contactor: _params.contactor,
        buildtime: _params.buildtime,
        maintainer: _params.maintainer,
        mobile: _params.mobile,
        maintenacebegin: _params.maintenacebegin,
        maintenaceend: _params.maintenaceend
    }, _func, _udata, false)
}
//删除工期
WebService.delProject = function (_token, _projectid, _func, _udata) {
    _PostRequest(CONST_API_PROJECT + 'del', {
        token: _token,
        projectid: _projectid
    }, _func, _udata, false)
}