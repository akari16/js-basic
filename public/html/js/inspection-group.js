var selectedListScroll = new ScrollBar();
var devGroupListScroll = new ScrollBar();
var devGroupInfoScroll = new ScrollBar();
var devGroupTree = new DevTree();
var devArray = [];           //记录设备树中被选择的设备
var areaArray = [];          //记录设备树中被选择的区域
var selectedDev = [];        //记录已选设备中的设备

//巡检组功能
function inspectionGroupFunc() {
    inspectionGroupScroll();                //滚动条
    inspectionGroupLayout();
    onAddInspectionGroupBtnClick();         //点击添加按钮
    onGroupRmenuClick();                    //点击修改、删除右键菜单
    clickSelectDevBtn();                    //点击添加设备按钮
    addModifyGroupFunc();                   //添加、修改巡检组
}

//滚动条
function inspectionGroupScroll() {
    selectedListScroll.init(3, document.getElementById('selected-dev').getElementsByClassName('ul-box')[0], document.getElementById('selected-dev').getElementsByTagName('ul')[0]);
    devGroupListScroll.init(3, document.getElementById('dev-group-list').getElementsByClassName('ul-box')[0], document.getElementById('dev-group-list').getElementsByTagName('ul')[0]);
    devGroupInfoScroll.init(2, document.getElementById('edit-dev-group'), document.getElementById('edit-dev-group').getElementsByClassName('content-box')[0]);
}

function inspectionGroupLayout() {
    var editDiv = document.getElementById('edit-dev-group');
    var div = editDiv.getElementsByClassName('content-box')[0];
    div.style.left = (editDiv.offsetWidth - div.offsetWidth) / 2 + 'px';
}

//巡检组列表
function inspectionGroupList(_id, _func) {
    var div = document.getElementById('dev-group-list');
    var ul = div.getElementsByTagName('ul')[0];
    for(var i = ul.children.length - 1; i >= 0; i--) {
        deleteEle(ul.children[i]);
    }
    WebService.getCheckGroup(localStorage.maintenanceToken, '', function(_retcode, _data) {
        if(_retcode) {
            for(var i = 0; i < _data.length; i++) {
                var li = document.createElement('li');
                li.innerHTML = '<i class="fa fa-sitemap"></i>' + _data[i].name;
                li.data = _data[i];
                ul.appendChild(li);
                if(_id && _id == _data[i].id) {
                    li.classList.add('active');
                    _func(li);
                }
                li.onclick = function() {
                    onInspectionGroupClick(this);
                }
                onGroupRclick(li);
            }
        }else{
            alert(_data.msg);
        }
    })
}

//左键点击巡检组名称
function onInspectionGroupClick(_node) {
    var list = document.getElementById('dev-group-list');
    var ul = list.getElementsByTagName('ul')[0];
    var div = document.getElementById('edit-dev-group');
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var title = div.getElementsByClassName('title')[0];
    var name = document.getElementById('dev-group-name');
    var shade = div.getElementsByClassName('shade')[0];
    var devUl = document.getElementById('selected-dev').getElementsByTagName('ul')[0];

    shade.style.display = 'block';
    for(var i = devUl.children.length - 1; i >= 0; i--) {
        deleteEle(devUl.children[i]);
    }
    ul.getElementsByClassName('active').length ? ul.getElementsByClassName('active')[0].classList.remove('active') : 0;
    addBtn.style.display = clearBtn.style.display = 'none';
    _node.classList.add('active');
    title.innerText = CONST_CHECK_GROUP_INFO;
    name.value = _node.data.name;
    if(_node.data.devs) {
        for(var i = 0; i < _node.data.devs.length; i++) {
            var li = document.createElement('li');
            li.innerHTML = '<i class="fa fa-square-o fa-fw"></i> ' + _node.data.devs[i].name;
            li.data = _node.data.devs[i];
            devUl.appendChild(li);
            li.onclick = function() {
                var chkBox = this.getElementsByClassName('fa')[0];
                if(chkBox.classList.contains('fa-square-o')) {
                    chkBox.classList.add('fa-check-square');
                    chkBox.classList.remove('fa-square-o');
                }else{
                    chkBox.classList.add('fa-square-o');
                    chkBox.classList.remove('fa-check-square');
                }
            }
        }
    }
    devArray = [];
    areaArray = [];
    devGroupTree.uninit();
    unselectedDev();
}

//右键点击巡检组名称
function onGroupRclick(_node) {
    var menu = document.getElementById('check-group-menu');
    _node.oncontextmenu = function(e) {
        menu.style.display = 'block';
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
        onInspectionGroupClick(_node);
        document.onclick = function() {
            menu.style.display = 'none';
            document.onclick = null;
        }
    }
}

//点击修改、删除右键菜单
function onGroupRmenuClick() {
    var menu = document.getElementById('check-group-menu');
    var list = document.getElementById('dev-group-list');
    var ul = list.getElementsByTagName('ul')[0];
    var div = document.getElementById('edit-dev-group');
    var title = div.getElementsByClassName('title')[0];
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var shade = div.getElementsByClassName('shade')[0];

    menu.children[0].onclick = function() {
        title.innerText = CONST_MODIFY_CHECK_GROUP;
        addBtn.style.display = clearBtn.style.display = 'inline-block';
        addBtn.innerText = CONST_MODIFY_BTN;
        shade.style.display = 'none';
    }

    menu.children[1].onclick = function() {
        var node = ul.getElementsByClassName('active')[0];
        onDeleteGroupMenuClick(node);
    }
}

//删除模板
function onDeleteGroupMenuClick(_node) {
    var deleteBox = new AlertBox();
    var data = {
        title: CONST_DELETE_CHECK_GROUP,
        info: CONST_DELETE_GROUP_INFO,
        btn: CONST_DELETE_BTN,
        closebtn: 'fa fa-close',
        parentNode: document.body,
        data: _node.data.id
    };
    deleteBox.init(deleteFunc, data);
    function deleteFunc(_data) {
        WebService.deleteCheckGroup(localStorage.maintenanceToken, _data, function(_retcode, _data) {
            if(_retcode) {
                inspectionGroupList();      //刷新列表
                groupDivRefresh();
                deleteBox.uninit();
            }else{
                alert(_data.msg);
            }
        })
    }
}

//点击添加按钮
function onAddInspectionGroupBtnClick() {
    var list = document.getElementById('dev-group-list');
    var btn = list.getElementsByClassName('fa-plus-circle')[0];
    var div = document.getElementById('edit-dev-group');
    var title = div.getElementsByClassName('title')[0];
    var name = document.getElementById('dev-group-name');
    var shade = div.getElementsByClassName('shade')[0];
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var devUl = document.getElementById('selected-dev').getElementsByTagName('ul')[0];

    btn.onclick = function() {
        groupDivRefresh();
        title.innerText = CONST_ADD_CHECK_GROUP;
        shade.style.display = 'none';
        addBtn.style.display = clearBtn.style.display = 'inline-block';
        addBtn.innerText = CONST_ADD_BTN;
    }
}

//填充设备树
function unselectedDev() {
    var treeBox = document.getElementById('unselected-dev').getElementsByClassName('tree-box')[0];
    devGroupTree.init(treeBox, true, devGroupTree.clickCheckBox, false, true);
    devGroupTree.search.style.display = 'none';
    devGroupTree.treeBox.style.top = devGroupTree.treeBox.style.right = devGroupTree.treeBox.style.bottom = devGroupTree.treeBox.style.left = 0;
}

devGroupTree.clickCheckBox = function(_node) {
    var chkBoxes = devGroupTree.treeBox.getElementsByClassName('chkbox');
    var areaNodes = devGroupTree.treeBox.getElementsByClassName('area');

    _node.getElementsByClassName('chkbox')[0].onclick = null;
    _node.getElementsByClassName('chkbox')[0].onclick = function(e) {
        if(this.classList.contains('fa-square-o')) {
            this.classList.add('fa-check-square');
            this.classList.remove('fa-square-o');
            areaArray.push(_node.data.areaid);
            if(_node.classList.contains('area')) {          //勾选区域节点，则选中该区域下所有设备
                WebService.getAreaAndDev(localStorage.maintenanceToken, _node.data.areaid, true, '', function(_retcode, _data) {
                    if(_retcode) {
                        for(var i = 0; i < _data.areas.length; i++) {
                            var flag = true;
                            for(var j = 0; j < areaArray.length; j++) {
                                if(_data.areas[i].areaid == areaArray[j]) {
                                    flag = false;
                                    break;
                                }
                            }
                            flag ? areaArray.push(_data.areas[i].areaid) : 0;
                        }
                        for(var i = 0; i < _data.devices.length; i++) {
                            var flag = true;
                            for(var j = 0; j < devArray.length; j++) { 
                                if(_data.devices[i].devid == devArray[j].devid) {
                                    flag = false;
                                    break;
                                }
                            }
                            if(flag) {
                                for(var k = 0; k < selectedDev.length; k++) {
                                    if(_data.devices[i].devid == selectedDev[k].id) {
                                        flag = false;
                                        break;
                                    }
                                }
                                flag ? devArray.push({devid: _data.devices[i].devid, name: _data.devices[i].name}) : 0;
                            }
                        }
                        for(var i = 0; i < _node.getElementsByClassName('chkbox').length; i++) {
                            _node.getElementsByClassName('chkbox')[i].classList.add('fa-check-square');
                            _node.getElementsByClassName('chkbox')[i].classList.remove('fa-square-o');
                        }
                        selectUpLevel(_node);
                    }else{
                        alert(_data.msg);
                    }
                })
            }else{              //勾选设备
                var flag = true;
                for(var i = 0; i < devArray.length; i++) {
                    if(devArray[i].devid == _node.data.devid) {
                        flag = false;
                        break;
                    }
                }
                flag ? devArray.push({devid: _node.data.devid, name: _node.data.name}) : 0;
                selectUpLevel(_node);
            }
        }else{
            this.classList.add('fa-square-o');
            this.classList.remove('fa-check-square');
            if(_node.classList.contains('area')) {          //取消勾选区域，则取消区域下所有的设备
                for(var i = 0; i < areaArray.length; i++) {
                    if(_node.data.areaid == areaArray[i]) {
                        areaArray.splice(i, 1);
                        break;
                    }
                }
                WebService.getAreaAndDev(localStorage.maintenanceToken, _node.data.areaid, true, '', function(_retcode, _data) {
                    if(_retcode) {
                        for(var i = 0; i < _data.areas.length; i++) {
                            for(var j = 0; j < areaArray.length; j++) {
                                if(_data.areas[i].areaid == areaArray[j]) {
                                    areaArray.splice(j, 1);
                                    break;
                                }
                            }
                        }
                        for(var i = 0; i < _data.devices.length; i++) {
                            for(var j = 0; j < devArray.length; j++) {
                                if(_data.devices[i].devid == devArray[j].devid) {
                                    devArray.splice(j, 1);
                                    break;
                                }
                            }
                        }
                    }else{
                        alert(_data.msg);
                    }
                })
                for(var i = 0; i < _node.getElementsByClassName('chkbox').length; i++) {
                    _node.getElementsByClassName('chkbox')[i].classList.add('fa-square-o');
                    _node.getElementsByClassName('chkbox')[i].classList.remove('fa-check-square');
                }
            }else{
                for(var i = 0; i < devArray.length; i++) {
                    if(devArray[i].devid == _node.data.devid) {
                        devArray.splice(i, 1);
                        break;
                    }
                }
            }
            var parents = getParentsNode(_node, 'class', 'area');
            for(var i = 0; i < parents.length; i++) {
                parents[i].getElementsByClassName('chkbox')[0].classList.add('fa-square-o');
                parents[i].getElementsByClassName('chkbox')[0].classList.remove('fa-check-square');
                for(var j = 0; j < areaArray.length; j++) {
                    if(parents[i].data.areaid == areaArray[j]) {
                        areaArray.splice(j, 1);
                        break;
                    }
                }
            }
        }
        e.stopPropagation();
    }

    //勾选区域或设备时判断是否也勾选上级区域
    function selectUpLevel(_node) {
        var parents = getParentsNode(_node, 'class', 'area');
        for(var i = 0; i < parents.length; i++) {
            if((parents[i].getElementsByClassName('chkbox').length - 1) == parents[i].getElementsByClassName('fa-check-square').length) {
                parents[i].getElementsByClassName('chkbox')[0].classList.add('fa-check-square');
                parents[i].getElementsByClassName('chkbox')[0].classList.remove('fa-square-o');
                var flag = true;
                for(var j = 0; j < areaArray.length; j++) {
                    parents[i].data.areaid == areaArray[j] ? flag = false : 0;
                }
                flag ? areaArray.push(parents[i].data.areaid) : 0;
            }
        }
    }
    _node.children[0].style.color = '#fff';
    _node.classList.remove('active');
}

//点击添加、删除设备按钮
function clickSelectDevBtn() {
    var div = document.getElementById('edit-dev-group');
    var addBtn = div.getElementsByClassName('add-dev-btn')[0];
    var delBtn = div.getElementsByClassName('delete-dev-btn')[0];
    var leftDiv = document.getElementById('selected-dev');
    var rightDiv = document.getElementById('unselected-dev');

    function addDev(_data) {
        var ul = leftDiv.getElementsByTagName('ul')[0];
        var li = document.createElement('li');
        li.innerHTML = '<i class="fa fa-square-o fa-fw"></i> ' + _data.name;
        li.data = _data;
        ul.appendChild(li);
        li.onclick = function() {
            var chkBox = this.getElementsByClassName('fa')[0];
            if(chkBox.classList.contains('fa-square-o')) {
                chkBox.classList.add('fa-check-square');
                chkBox.classList.remove('fa-square-o');
            }else{
                chkBox.classList.add('fa-square-o');
                chkBox.classList.remove('fa-check-square');
            }
        }
    }
    addBtn.onclick = function() {
        for(var i = 0; i < devArray.length; i++) {
            selectedDev.push(devArray[i]);
            addDev(devArray[i]);
        }
        devArray = [];
        areaArray = [];
        devGroupTree.refresh();
    }

    delBtn.onclick = function() {
        var ul = leftDiv.getElementsByTagName('ul')[0]
        var checkedBox = leftDiv.getElementsByClassName('fa-check-square');
        var deleteDev = [];
        for(var i = 0; i < checkedBox.length; i++) {
            for(var j = 0; j < selectedDev.length; j++) {
                if(checkedBox[i].parentNode.data.id == selectedDev[j].id) {
                    selectedDev.splice(j, 1);
                    break;
                }
            }
        }
        deleteEle(ul);
        leftDiv.getElementsByClassName('ul-box')[0].innerHTML = '<ul></ul>';
        for(var i = 0; i < selectedDev.length; i++) {
            addDev(selectedDev[i]);
        }
        devArray = [];
        areaArray = [];
        devGroupTree.refresh();
    }
}

//添加、修改巡检组
function addModifyGroupFunc() {
    var div = document.getElementById('edit-dev-group');
    var leftDiv = document.getElementById('selected-dev');
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var name = document.getElementById('dev-group-name');
    var devError = div.getElementsByClassName('dev-error')[0];
    var list = document.getElementById('dev-group-list');

    addBtn.onclick = function() {
        name.value = name.value.replace(/(^\s+)|(\s+$)/g,"");
        name.value ? name.classList.remove('error') : name.classList.add('error');
        var devs = [];
        for(var i = 0; i < leftDiv.getElementsByTagName('li').length; i++) {
            devs.push(leftDiv.getElementsByTagName('li')[i].data.devid);
        }
        devs.length ? devError.style.display = 'none' : devError.style.display = 'inline-block';
        if(name.value && devs.length) {
            if(list.getElementsByClassName('active').length) {      //修改
                WebService.modifyCheckGroup(localStorage.maintenanceToken, list.getElementsByClassName('active')[0].data.id, name.value, devs, function(_retcode, _data) {
                    if(_retcode) {
                        inspectionGroupList(list.getElementsByClassName('active')[0].data.id, onInspectionGroupClick);      //重新获取巡检组列表
                        devArray = [];
                        areaArray = [];
                        devGroupTree.uninit();
                        unselectedDev();
                    }else{
                        alert(_data.msg);
                    }
                })
            }else{          //添加
                WebService.addCheckGroup (localStorage.maintenanceToken, name.value, devs, function(_retcode, _data) {
                    if(_retcode) {
                        groupDivRefresh();          
                        inspectionGroupList();      //重新获取巡检组列表
                    }else{
                        alert(_data.msg);
                    }
                })
            }
        }
    }

    clearBtn.onclick = function() {
        list.getElementsByClassName('active').length ? onInspectionGroupClick(list.getElementsByClassName('active')[0]) : groupDivRefresh();
    }
}

function groupDivRefresh() {
    var div = document.getElementById('edit-dev-group');
    var leftDiv = document.getElementById('selected-dev');
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var name = document.getElementById('dev-group-name');
    var devError = div.getElementsByClassName('dev-error')[0];
    var title = div.getElementsByClassName('title')[0];
    var shade = div.getElementsByClassName('shade')[0];
    var list = document.getElementById('dev-group-list');

    title.innerText = CONST_CHECK_GROUP_INFO;
    addBtn.style.display = clearBtn.style.display = 'none';
    devArray = [];
    areaArray = [];
    devGroupTree.uninit();
    unselectedDev();
    deleteEle(leftDiv.getElementsByTagName('ul')[0]);
    leftDiv.getElementsByClassName('ul-box')[0].innerHTML = '<ul></ul>';
    name.value = '';
    name.classList.remove('error');
    devError.style.display = 'none';
    shade.style.display = 'block';
    list.getElementsByClassName('active').length ? list.getElementsByClassName('active')[0].classList.remove('active') : 0;
}