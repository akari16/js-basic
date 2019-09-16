var devTypeList = new PullDownList(); //设备类型下拉列表
var producerList = new PullDownList(); //厂商下拉列表
var builderList = new PullDownList(); //承建方下拉列表
var devTree = new DevTree(); //资产管理设备树
var devInfoScroll = new ScrollBar(); //设备信息编辑框滚动条
var typeList = []; //设备类型

function assetManage() {
    addDevTree(); //添加设备树
    areaMenuFunc(); //区域菜单功能
    hpMcuFunc(); //勾选华平mcu
    devTypeListFunc(); //设备类型下拉列表
    producerListFunc(); //厂商下拉列表
    builderListFunc(); //承建方下拉列表
    assetScroll(); //滚动条
    assetLayout();
}

function assetScroll() {
    devInfoScroll.init(2, document.getElementById('edit-dev'), document.getElementById('edit-dev').getElementsByClassName('content-box')[0]);
}

function assetLayout() {
    var editArea = document.getElementById('edit-area');
    var div = editArea.getElementsByClassName('content-box')[0];
    var editDev = document.getElementById('edit-dev');
    var div1 = editDev.getElementsByClassName('content-box')[0];
    // div.style.left = (editArea.offsetWidth - div.offsetWidth) / 2 + 'px';
    // div1.style.left = (editDev.offsetWidth - div1.offsetWidth) / 2 + 'px';
    div.style.left = "280px";
    div1.style.left = "280px";
}

function addDevTree() {
    devTree.init(document.getElementById('area-dev'), true, devTree.clickNode, devTree.contextMenu);
}

//根据区域id查询区域信息
function getAreaInfo(_areaid, _func) {
    WebService.getAreaById(localStorage.maintenanceToken, _areaid, function (_retcode, _data) {
        if (_retcode) {
            _func ? _func(_data) : 0;
        } else {
            alert(_data.msg);
        }
    })
}

//勾选华平mcu
function hpMcuFunc() {
    var editDev = document.getElementById('edit-dev');
    var hpMcu = editDev.getElementsByClassName('hp-mcu')[0].children[0];
    var apiUrl = document.getElementById('api-url');
    var channelid = document.getElementById('channel-id');
    var title = editDev.getElementsByClassName('title')[0];
    hpMcu.parentNode.style.cursor = 'default';

    hpMcu.parentNode.onclick = function () {
        if (title.innerText != CONST_DEV_INFO) {
            if (hpMcu.classList.contains('fa-check-square')) {
                hpMcu.classList.add('fa-square-o');
                hpMcu.classList.remove('fa-check-square');
                apiUrl.parentNode.classList.add('inactive');
                apiUrl.readOnly = true;
                channelid.parentNode.classList.add('inactive');
                channelid.readOnly = true;
            } else {
                hpMcu.classList.add('fa-check-square');
                hpMcu.classList.remove('fa-square-o');
                apiUrl.parentNode.classList.remove('inactive');
                apiUrl.readOnly = false;
                channelid.parentNode.classList.remove('inactive');
                channelid.readOnly = false;
            }
        }
    }
}

//设备类型下拉列表
function devTypeListFunc() {
    var devType = document.getElementById('dev-type');
    WebService.getDevType(localStorage.maintenanceToken, function (_retcode, _data) {
        if (_retcode) {
            var item = [];
            for (var i = 0; i < _data.length; i++) {
                typeList.push(_data[i]);
                item.push({
                    text: _data[i].devtypename,
                    type: i
                });
            }
            var json = {
                divMarginLeft: '342px',
                label: '',
                defaultValue: _data[0].devtypename,
                boxW: '230px',
                readonly: true,
                item: item
            }
            // devTypeList.init(devType.parentNode, json, fill);
            devTypeList.div.style.marginTop = '-70px';
            devTypeList.list.style.marginTop = '49px';
            devTypeList.input.style.opacity = 0;

            function fill(_node) {
                devType.value = _node.innerText;
                devType.devtype = _node.data.type;
            }
        } else {
            alert(_data);
        }
    })
}

//厂商下拉列表
function producerListFunc() {
    // var producer = document.getElementById('producer');
    // var json = {
    //     divMarginLeft: '-6px', label: '', defaultValue: CONST_AVCON, boxW: '230px', readonly: true,
    //     item: [{text: CONST_AVCON}, {text: CONST_HAIKANG}, {text: CONST_DAHUA}, {text: CONST_TIANDI}]
    // }
    // producerList.init(producer.parentNode, json, fill);
    // producerList.div.style.marginTop = '-70px';
    // producerList.list.style.marginTop = '49px';
    // producerList.input.style.opacity = 0;
    // function fill(_node) {
    //     producer.value = _node.innerText;
    // }
}

//承建方下拉列表
function builderListFunc() {
    // var builder = document.getElementById('builder');
    // var json = {
    //     divMarginLeft: '-6px', label: '', defaultValue: CONST_AVCON, boxW: '230px', readonly: true,
    //     item: [{text: CONST_AVCON}, {text: CONST_HAIKANG}, {text: CONST_DAHUA}, {text: CONST_TIANDI}]
    // }
    // builderList.init(builder.parentNode, json, fill);
    // builderList.div.style.marginTop = '-140px';
    // builderList.list.style.marginTop = '49px';
    // builderList.input.style.opacity = 0;
    // function fill(_node) {
    //     builder.value = _node.innerText;
    // }
}

//点击区域、设备
devTree.clickNode = function (_node) {
    //设备节点
    if (_node.classList.contains('dev')) {
        clickDev(_node);
    } else { //区域节点
        clickArea(_node);
    }
}

//点击设备节点
function clickDev(_node) {
    var editDev = document.getElementById('edit-dev');
    var editArea = document.getElementById('edit-area');
    var areaTitle = editArea.getElementsByClassName('title')[0];
    var devTitle = editDev.getElementsByClassName('title')[0];

    //区域信息切换设备信息
    if (getStyle(editArea, 'display') == 'block' && areaTitle.innerText == CONST_AREA_INFO) {
        editDev.style.display = 'block';
        editArea.style.display = 'none';
        devTitle.innerText = CONST_DEV_INFO;
    }

    //查看设备信息
    if (getStyle(editDev, 'display') == 'block' && devTitle.innerText == CONST_DEV_INFO) {
        showDevInfo(_node);
    }
    devInfoScroll ? devInfoScroll.onContentBoxChange() : 0;
    assetLayout();
}

//点击区域节点
function clickArea(_node) {
    var editDev = document.getElementById('edit-dev');
    var editArea = document.getElementById('edit-area');
    var areaTitle = editArea.getElementsByClassName('title')[0];
    var devTitle = editDev.getElementsByClassName('title')[0];
    var areaName = document.getElementById('area-name');
    var parentArea = document.getElementById('parent-area');
    var devArea = document.getElementById('dev-area');

    //切换设备、区域
    if (getStyle(editDev, 'display') == 'block' && devTitle.innerText == CONST_DEV_INFO) {
        editDev.style.display = 'none';
        editArea.style.display = 'block';
        devTitle.innerText = CONST_AREA_INFO;
    }

    //区域信息
    if (getStyle(editArea, 'display') == 'block' && areaTitle.innerText == CONST_AREA_INFO) {
        showAreaInfo(_node)
    }

    //添加、修改区域
    if (getStyle(editArea, 'display') == 'block' && (areaTitle.innerText == CONST_ADD_AREA || areaTitle.innerText == CONST_MODIFY_AREA)) {
        parentArea.value = _node.data.name;
        parentArea.areaid = _node.data.areaid;
    }

    //添加、修改设备
    if (getStyle(editDev, 'display') == 'block' && (devTitle.innerText == CONST_ADD_DEV || devTitle.innerText == CONST_MODIFY_DEV)) {
        devArea.value = _node.data.name;
        devArea.areaid = _node.data.areaid;
    }
    assetLayout();
}

//展示设备信息
function showDevInfo(_node) {
    var editDev = document.getElementById('edit-dev');
    var inputs = editDev.getElementsByTagName('input');
    var devName = document.getElementById('dev-name');
    var devIp = document.getElementById('dev-ip');
    var devPort = document.getElementById('dev-port');
    var devType = document.getElementById('dev-type');
    var model = document.getElementById('model');
    var devArea = document.getElementById('dev-area');
    var producer = document.getElementById('producer');
    var builder = document.getElementById('builder');
    var bulidTime = document.getElementById('bulid-time');
    var hpMcu = document.getElementsByClassName('hp-mcu')[0].children[0];
    var apiUrl = document.getElementById('api-url');
    var channelid = document.getElementById('channel-id');
    var describe = document.getElementById('describe');
    var addBtn = editDev.getElementsByClassName('add-btn')[0];
    var clearBtn = editDev.getElementsByClassName('clear-btn')[0];
    var data = _node.data;

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].readOnly = true;
    }
    document.getElementById('describe').readOnly = true;
    devName.value = data.name;
    devIp.value = data.ip;
    devPort.value = data.port;
    model.value = data.model;
    producer.value = data.producer;
    builder.value = data.builder;
    bulidTime.value = format(data.buildtime * 1000);
    bulidTime.disabled = true;
    describe.value = data.describe;
    devType.value = typeList[data.type].devtypename;
    devType.devtype = data.type;

    getAreaInfo(data.areaid, getArea);

    function getArea(_data) {
        devArea.value = _data.name;
        devArea.areaid = data.areaid;
    }
    if (JSON.parse(data.linkparam).type == 'avcon') {
        hpMcu.classList.add('fa-check-square');
        hpMcu.classList.remove('fa-square-o');
        apiUrl.parentNode.classList.remove('inactive');
        apiUrl.value = JSON.parse(data.linkparam).mcuid;
        channelid.parentNode.classList.remove('inactive');
        channelid.value = JSON.parse(data.linkparam).channelid;
    } else {
        hpMcu.classList.add('fa-square-o');
        hpMcu.classList.remove('fa-check-square');
        apiUrl.parentNode.classList.add('inactive');
        apiUrl.value = '';
        channelid.parentNode.classList.add('inactive');
        channelid.value = '';
    }
    addBtn.style.display = clearBtn.style.display = 'none';
    builderList.div.style.display = devTypeList.div.style.display = producerList.div.style.display = 'none';
}

//展示区域信息
function showAreaInfo(_node) {
    var editArea = document.getElementById('edit-area');
    var areaName = document.getElementById('area-name');
    var parentArea = document.getElementById('parent-area');
    var addBtn = editArea.getElementsByClassName('add-btn')[0];
    var clearBtn = editArea.getElementsByClassName('clear-btn')[0];

    addBtn.style.display = clearBtn.style.display = 'none';
    areaName.readOnly = true;
    areaName.value = _node.data.name;
    getAreaInfo(_node.data.parentid, fillParent);

    function fillParent(_data) {
        parentArea.value = _data.name;
    }
    editArea.getElementsByClassName('title')[0].innerText = CONST_AREA_INFO;
    assetLayout();
}

//右键菜单
devTree.contextMenu = function (_node) {
    // console.log(_node);
    var areaMenu = document.getElementById('area-menu');
    var devMenu = document.getElementById('dev-menu');
    var editDev = document.getElementById('edit-dev');
    var editArea = document.getElementById('edit-area');

    _node.oncontextmenu = function (e) {
        if (getStyle(editDev, 'display') == 'block' && editDev.getElementsByClassName('title')[0].innerText != CONST_DEV_INFO) {
            return;
        }

        if (getStyle(editArea, 'display') == 'block' && editArea.getElementsByClassName('title')[0].innerText != CONST_AREA_INFO) {
            return;
        }
        if (devTree.treeBox.getElementsByClassName('active').length) {
            devTree.treeBox.getElementsByClassName('active')[0].children[0].style.color = '#fff';
            devTree.treeBox.getElementsByClassName('active')[0].classList.remove('active');
        }
        this.classList.add('active');
        this.children[0].style.color = CONST_ACTIVE_COLOR;

        if (_node.data.devid) { //设备
            devMenu.style.left = e.pageX + 'px';
            devMenu.style.top = e.pageY + 'px';
            devMenu.style.display = 'block';
            areaMenu.style.display = 'none';
            clickDev(_node);
        } else { //区域
            areaMenu.style.left = e.pageX + 'px';
            areaMenu.style.top = e.pageY + 'px';
            areaMenu.style.display = 'block';
            devMenu.style.display = 'none';
            clickArea(_node);
        }

        document.onclick = function () {
            devMenu.style.display = 'none';
            areaMenu.style.display = 'none';
            this.onclick = null;
        }
        e.stopPropagation();
        return false;
    }
}

//区域、设备菜单功能
function areaMenuFunc() {
    addArea(); //添加区域
    modifyArea(); //修改区域
    deleteArea(); //删除区域
    addDev(); //添加设备
    quickAdd(); //快速添加
    modifyDev(); //修改设备
    deleteDev(); //删除设备
}

//添加、修改区域、设备后恢复到区域信息页面，刷新树
function returnAreaInfo() {
    var editArea = document.getElementById('edit-area');
    var editDev = document.getElementById('edit-dev');
    var areaName = document.getElementById('area-name');
    var title = editArea.getElementsByClassName('title')[0];
    var addBtn = editArea.getElementsByClassName('add-btn')[0];
    var clearBtn = editArea.getElementsByClassName('clear-btn')[0];
    var parentArea = document.getElementById('parent-area');
    var areaName = document.getElementById('area-name');

    devTree.refresh();
    editArea.style.display = 'block';
    editDev.style.display = 'none';
    areaName.value = parentArea.value = '';
    title.innerText = CONST_AREA_INFO;
    addBtn.style.display = clearBtn.style.display = 'none';
    areaName.readOnly = true;
    assetLayout();
}

//添加区域
function addArea() {
    var areaMenu = document.getElementById('area-menu');
    var editArea = document.getElementById('edit-area');
    var editDev = document.getElementById('edit-dev');
    var addBtn = editArea.getElementsByClassName('add-btn')[0];
    var clearBtn = editArea.getElementsByClassName('clear-btn')[0];
    var areaName = document.getElementById('area-name');
    var parentArea = document.getElementById('parent-area');
    var title = editArea.getElementsByClassName('title')[0];

    areaMenu.children[0].onclick = function () {
        var node = devTree.treeBox.getElementsByClassName('active')[0];
        editArea.style.display = 'block';
        editDev.style.display = 'none';
        title.innerText = CONST_ADD_AREA;
        addBtn.innerText = CONST_ADD_BTN;
        addBtn.style.display = clearBtn.style.display = 'inline-block';
        areaName.value = '';
        parentArea.value = node.data.name;
        parentArea.areaid = node.data.areaid;
        areaName.readOnly = false;

        addBtn.onclick = function () {
            areaName.value ? areaName.classList.remove('error') : areaName.classList.add('error');
            if (areaName.value && parentArea.value) {
                WebService.addArea(localStorage.maintenanceToken, parentArea.areaid, areaName.value, function (_retcode, _data) {
                    if (_retcode) {
                        returnAreaInfo();
                    } else {
                        alert(_data.msg);
                    }
                })
            }
        }

        clearBtn.onclick = function () {
            var node = devTree.treeBox.getElementsByClassName('active')[0];
            areaName.classList.remove('error');
            showAreaInfo(node);
        }
    }
}

//修改区域
function modifyArea() {
    var areaMenu = document.getElementById('area-menu');
    var editArea = document.getElementById('edit-area');
    var editDev = document.getElementById('edit-dev');
    var addBtn = editArea.getElementsByClassName('add-btn')[0];
    var clearBtn = editArea.getElementsByClassName('clear-btn')[0];
    var areaName = document.getElementById('area-name');
    var parentArea = document.getElementById('parent-area');
    var title = editArea.getElementsByClassName('title')[0];

    areaMenu.children[1].onclick = function () {
        var node = devTree.treeBox.getElementsByClassName('active')[0];
        editArea.style.display = 'block';
        editDev.style.display = 'none';
        title.innerText = CONST_MODIFY_AREA;
        addBtn.style.display = clearBtn.style.display = 'inline-block';
        addBtn.innerText = CONST_MODIFY_BTN;
        areaName.readOnly = false;
        areaName.value = node.data.name;
        parentArea.areaid = node.data.parentid;
        getAreaInfo(node.data.parentid, fillParent);

        function fillParent(_data) {
            parentArea.value = _data.name;
        }

        addBtn.onclick = function () {
            if (areaName.value && parentArea.value) {
                //查询区域下的所有子区域节点，如果上级区域选择为自己的下级区域或者自己本身是不可以修改的
                WebService.getChildrenAreaById(localStorage.maintenanceToken, node.data.areaid, true, function (_retcode, _data) {
                    if (_retcode) {
                        for (var i = 0; i < _data.length; i++) {
                            if (_data[i].areaid == parentArea.areaid) {
                                alert(CONST_MODIFY_AREA_TIP);
                                return;
                            }
                        }
                        if (parentArea.areaid == node.data.areaid) {
                            alert(CONST_MODIFY_AREA_TIP);
                            return;
                        }

                        WebService.modityArea(localStorage.maintenanceToken, node.data.areaid, parentArea.areaid, areaName.value, function (_retcode, _data) {
                            if (_retcode) {
                                returnAreaInfo();
                            } else {
                                alert(_data.msg);
                            }
                        })
                    } else {
                        alert(_data.msg);
                    }
                })
            }
        }

        clearBtn.onclick = function () {
            var node = devTree.treeBox.getElementsByClassName('active')[0];
            title.innerText = CONST_AREA_INFO;
            areaName.readOnly = true;
            areaName.value = node.data.name;
            addBtn.style.display = clearBtn.style.display = 'none';
            getAreaInfo(node.data.parentid, fillParent);

            function fillParent(_data) {
                parentArea.value = _data.name;
            }
        }
    }
}

//删除区域
function deleteArea() {
    var areaMenu = document.getElementById('area-menu');
    var editArea = document.getElementById('edit-area');
    var editDev = document.getElementById('edit-dev');
    var addBtn = editArea.getElementsByClassName('add-btn')[0];
    var clearBtn = editArea.getElementsByClassName('clear-btn')[0];
    var areaName = document.getElementById('area-name');
    var parentArea = document.getElementById('parent-area');
    var title = editArea.getElementsByClassName('title')[0];

    areaMenu.children[2].onclick = function () {
        var node = devTree.treeBox.getElementsByClassName('active')[0];
        var data = {
            title: CONST_DELETE_AREA_TITLE,
            closebtn: 'fa fa-times',
            info: CONST_DELETE_AREA_INFO,
            btn: CONST_DELETE_BTN,
            parentNode: document.body,
            data: node
        }
        var alertBox = new AlertBox();
        alertBox.init(deleteFunc, data);

        function deleteFunc(_node) {
            WebService.deleteArea(localStorage.maintenanceToken, node.data.areaid, function (_retcode, _data) {
                if (_retcode) {
                    alertBox.uninit();
                    returnAreaInfo();
                } else {
                    alert(_data.msg);
                }
            })
        }
    }
}
//添加设备    -------->测试提交
function addBrandMsg() {
    var name = "设备001";
    var areaid = "2";
    var devtype = "001";
    var devno = "设备001";
    var modelid = "1";
    var projectid = "001";
    var lng = "112.33";
    var lat = "112.33";
    var address = "设备001";
    var propertystatus = "设备001";
    var checkparams = "设备001";
    var dictparams = "设备001";
    var thresholdtemp = "001";
    var devid = "123";
    WebService.addDev(
        localStorage.maintenanceToken,
        name,
        areaid,
        devtype,
        devno,
        modelid,
        projectid,
        lng,
        lat,
        address,
        propertystatus,
        checkparams,
        dictparams,
        thresholdtemp,
        devid,
        function (_retcode, _data) {
            if (_retcode) {
                returnAreaInfo();
            } else {
                alert(_data.msg);
            }
        })

}
//添加、修改设备功能，传参为修改，不传为添加
function addModifyDevFunc(_devid) {
    var editArea = document.getElementById('edit-area');
    var editDev = document.getElementById('edit-dev');
    var addBtn = editDev.getElementsByClassName('add-btn')[0];
    var clearBtn = editDev.getElementsByClassName('clear-btn')[0];
    var title = editDev.getElementsByClassName('title')[0];
    var devName = document.getElementById('dev-name');
    var devIp = document.getElementById('dev-ip');
    var devPort = document.getElementById('dev-port');
    var devType = document.getElementById('dev-type');
    var model = document.getElementById('model');
    var devArea = document.getElementById('dev-area');
    var producer = document.getElementById('producer');
    var builder = document.getElementById('builder');
    var bulidTime = document.getElementById('bulid-time');
    var hpMcu = editDev.getElementsByClassName('hp-mcu')[0].children[0];
    var apiUrl = document.getElementById('api-url');
    var channelid = document.getElementById('channel-id');
    var describe = document.getElementById('describe');
    var activeNode = devTree.treeBox.getElementsByClassName('active')[0];

    editArea.style.display = 'none';
    editDev.style.display = 'block';
    console.log(editDev);
    assetLayout();
    if (_devid) {
        title.innerText = CONST_MODIFY_DEV;
        addBtn.innerText = CONST_MODIFY_BTN;
    } else {
        title.innerText = CONST_ADD_DEV;
        addBtn.innerText = CONST_ADD_BTN;
    }
    addBtn.style.display = clearBtn.style.display = 'inline-block';
    devName.readOnly = devIp.readOnly = devPort.readOnly = model.readOnly = describe.readOnly = false;
    apiUrl.readOnly = hpMcu.classList.contains('fa-check-square') ? false : true;
    channelid.readOnly = hpMcu.classList.contains('fa-check-square') ? false : true;
    if (activeNode.classList.contains('area')) {
        devArea.value = devTree.treeBox.getElementsByClassName('active')[0].data.name;
        devArea.areaid = devTree.treeBox.getElementsByClassName('active')[0].data.areaid;
    }
    bulidTime.disabled = false;
    builderList.div.style.display = devTypeList.div.style.display = producerList.div.style.display = 'block';

    //取消
    clearBtn.onclick = function () {
        var node = devTree.treeBox.getElementsByClassName('active')[0];
        if (node.classList.contains('dev')) {
            showDevInfo(node); //展示设备信息
            editDev.getElementsByClassName('title')[0].innerText = CONST_DEV_INFO;
        } else {
            editArea.style.display = 'block';
            editDev.style.display = 'none';
            showAreaInfo(node); //展示区域信息
        }
        var errors = editDev.getElementsByClassName('error');
        for (var i = errors.length - 1; i >= 0; i--) {
            errors[i].classList.remove('error');
        }
    }

    addBtn.onclick = function () {
        var requireds = editDev.getElementsByClassName('required');
        var time = new Date(bulidTime.value).getTime() / 1000 + '';
        var type = devType.devtype + '';
        var param = {};
        for (var i = 0; i < requireds.length; i++) {
            requireds[i].value ? requireds[i].classList.remove('error') : requireds[i].classList.add('error');
        }

        if (hpMcu.classList.contains('fa-check-square')) {
            apiUrl.value ? apiUrl.classList.remove('error') : apiUrl.classList.add('error');
            channelid.value ? channelid.classList.remove('error') : channelid.classList.add('error');
            param.type = 'avcon';
            param.mcuid = apiUrl.value;
            param.channelid = channelid.value;
        }
        if (!editDev.getElementsByClassName('error').length) {
            if (_devid) {
                WebService.modifyDev(localStorage.maintenanceToken, _devid, devName.value, devArea.areaid, devIp.value, devPort.value, JSON.stringify(param), producer.value, builder.value, time, model.value, type, describe.value, function (_retcode, _data) {
                    if (_retcode) {
                        returnAreaInfo();
                    } else {
                        alert(_data.msg);
                    }
                })
            } else {
                WebService.addDev(localStorage.maintenanceToken, devName.value, devArea.areaid, devIp.value, devPort.value, JSON.stringify(param), producer.value, builder.value, time, model.value, type, describe.value, function (_retcode, _data) {
                    if (_retcode) {
                        returnAreaInfo();
                    } else {
                        alert(_data.msg);
                    }
                })
            }
        }
    }
}

//添加设备
function addDev() {
    var areaMenu = document.getElementById('area-menu');
    var editDev = document.getElementById('edit-dev');
    var hpMcu = editDev.getElementsByClassName('hp-mcu')[0].children[0];
    var apiUrl = document.getElementById('api-url');
    var channelid = document.getElementById('channel-id');

    areaMenu.children[3].onclick = function () {
        var inputs = editDev.getElementsByTagName('input');
        // for (var i = 0; i < inputs.length; i++) {
        //     inputs[i].value = '';
        //     hpMcu.classList.add('fa-square-o');
        //     hpMcu.classList.remove('fa-check-square');
        //     apiUrl.parentNode.classList.add('inactive');
        //     apiUrl.readOnly = true;
        //     channelid.parentNode.classList.add('inactive');
        //     channelid.readOnly = true;
        // }
        addModifyDevFunc();
    }
}

//快速添加
function quickAdd() {
    var devMenu = document.getElementById('dev-menu');
    devMenu.children[0].onclick = function () {
        var node = devTree.treeBox.getElementsByClassName('active')[0];
        showDevInfo(node);
        addModifyDevFunc();
    }
}

//修改设备
function modifyDev() {
    var devMenu = document.getElementById('dev-menu');
    devMenu.children[1].onclick = function () {
        var node = devTree.treeBox.getElementsByClassName('active')[0];
        showDevInfo(node);
        addModifyDevFunc(node.data.devid);
    }
}

//删除设备
function deleteDev() {
    var devMenu = document.getElementById('dev-menu');
    devMenu.children[2].onclick = function () {
        var node = devTree.treeBox.getElementsByClassName('active')[0];
        var data = {
            title: CONST_DELETE_DEV_TITLE,
            closebtn: 'fa fa-times',
            info: CONST_DELETE_DEV_INFO,
            btn: CONST_DELETE_BTN,
            parentNode: document.body,
            data: node
        }
        var alertBox = new AlertBox();
        alertBox.init(deleteFunc, data);

        function deleteFunc(_node) {
            WebService.deleteDev(localStorage.maintenanceToken, node.data.devid, function (_retcode, _data) {
                if (_retcode) {
                    alertBox.uninit();
                    returnAreaInfo();
                } else {
                    alert(_data.msg);
                }
            })
        }
    }
}