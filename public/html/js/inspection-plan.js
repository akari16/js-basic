var planListScroll = new ScrollBar();
var planInfoScroll = new ScrollBar();
var groupList = new PullDownList();
var timeList = new PullDownList();

//巡检计划功能
function inspectionPlanFunc() {
    planScroll();
    planLayout();   
    enablePlan();                       //勾选开启
    onAddPlanBtnClick();                //点击添加计划按钮
    addModifyPlanFunc();                //添加、修改计划
    onPlanMenuClick();                  //点击修改、删除计划
}

function planScroll() {
    planListScroll.init(3, document.getElementById('plan-list').getElementsByClassName('ul-box')[0], document.getElementById('plan-list').getElementsByTagName('ul')[0]);
    planInfoScroll.init(2, document.getElementById('edit-plan'), document.getElementById('edit-plan').getElementsByClassName('content-box')[0])
}

function planLayout() {
    var editDiv = document.getElementById('edit-plan');
    var div = editDiv.getElementsByClassName('content-box')[0];
    div.style.left = (editDiv.offsetWidth - div.offsetWidth) / 2 + 'px';
}

//刷新计划列表
function planGetList(_id, _func) {
    var div = document.getElementById('plan-list');
    var ul = div.getElementsByTagName('ul')[0];
    for(var i = ul.children.length - 1; i >= 0; i--) {
        deleteEle(ul.children[i]);
    }
    WebService.getCheckPlan(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {
            for(var i = 0; i < _data.length; i++) {
                var li = document.createElement('li');
                li.innerHTML = '<i class="fa fa-file-text-o"></i>' + _data[i].name;
                li.data = _data[i];
                if(_id) {
                    if(_data[i].id == _id) {
                        li.classList.add('active');
                    }
                }
                ul.appendChild(li);
                li.onclick = function() {
                    onPlanNameClick(this);
                }
                onPlanNameRclick(li);
            }
            _func ? _func() : 0;
        }else{
            alert(_data.msg);
        }
    })
}

//点击计划展示计划信息
function onPlanNameClick(_node) {
    var list = document.getElementById('plan-list');
    var div = document.getElementById('edit-plan');
    var title = div.getElementsByClassName('title')[0];
    var shade = div.getElementsByClassName('shade')[0];
    var name = document.getElementById('plan-name');
    var group = groupList.input;
    var timeTemp = timeList.input;
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var chkBox = div.getElementsByClassName('enable-plan')[0].getElementsByClassName('fa')[0];
    var noTempTip = div.getElementsByClassName('no-temp-tip')[0];
    var noGroupTip = div.getElementsByClassName('no-group-tip')[0];

    clearPlanErrors();
    list.getElementsByClassName('active').length ? list.getElementsByClassName('active')[0].classList.remove('active') : 0;
    _node.classList.add('active');
    title.innerText = CONST_PLAN_INFO;
    name.value = _node.data.name;
    _node.data.times ? (timeTemp.value = _node.data.timetemplatename) | (timeTemp.timeId = _node.data.timetemplateid) | (noTempTip.style.display = 'none') : (timeTemp.value = '') | (timeTemp.timeId = '') | (noTempTip.style.display = 'block');
    _node.data.checkdevgroupids ? (group.groupId = _node.data.checkdevgroupids[0]) | (noGroupTip.style.display = 'none') : (group.groupId = '') | (noGroupTip.style.display = 'block');
    shade.style.display = 'block';
    addBtn.style.display = clearBtn.style.display = 'none';
    _node.data.enable ? (chkBox.classList.add('fa-check-square')) | (chkBox.classList.remove('fa-square-o')) : (chkBox.classList.add('fa-square-o')) | (chkBox.classList.remove('fa-check-square'));
    if(_node.data.checkdevgroupids) {
        WebService.getCheckGroup(localStorage.maintenanceToken, _node.data.checkdevgroupids[0], function(_retcode, _data) {
            if(_retcode) {
                group.value = _data[0].name;
            }else{
                alert(_data.msg);
            }
        })
    }else{
        group.value = '';
    }
}

//弹出右键菜单
function onPlanNameRclick(_node) {
    var menu = document.getElementById('plan-menu');
    _node.oncontextmenu = function(e) {
        onPlanNameClick(_node);
        menu.style.display = 'block';
        menu.style.top = e.pageY + 'px';
        menu.style.left = e.pageX + 'px';

        document.onclick = function() {
            menu.style.display = 'none';
            document.onclick = null;
        }
    }
}

//选择巡检组列表
function planDevGroupList() {
    var div = document.getElementById('edit-plan');
    var items = [];
    WebService.getCheckGroup(localStorage.maintenanceToken, '', function(_retcode, _data) {
        if(_retcode) {
            groupList.div ? groupList.uninit() : 0;
            var defaultValue = '';
            var disabled = false;
            _data.length ? (defaultValue = '') | (disabled = false) : (defaultValue = CONST_NO_GROUP) | (disabled = true);
            for(var i = 0; i < _data.length; i++) {
                items.push({text: _data[i].name, id: _data[i].id});
            }
            var json = {
                divMarginLeft: '0', label: CONST_CHECK_GROUP, defaultValue: defaultValue, boxW: '228px', readonly: true, disabled: disabled, item: items, maxLiNum: '6'
            }
            groupList.init(div.getElementsByClassName('dev-group')[0], json, getId);
        
            groupList.box.style.marginLeft = '4px';
            groupList.list.style.marginTop = '49px';
            groupList.list.style.width = '228px';
            groupList.input.style.height = groupList.input.style.lineHeight = '26px';

            function getId(_node) {
                groupList.input.groupId = _node.data.id;
            }
        }else{
            alert(_data.msg);
        }
    })
}

//选择时间模板列表
function planTimeTemList() {
    var div = document.getElementById('edit-plan');
    var items = [];
    WebService.getTimeTemp(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {
            timeList.div ? timeList.uninit() : 0;
            var defaultValue = '';
            var disabled = false;
            _data.length ? (defaultValue = '') | (disabled = false) : (defaultValue = CONST_NO_TIME_TEMP) | (disabled = true);
            for(var i = 0; i < _data.length; i++) {
                items.push({text: _data[i].name, id: _data[i].id});
            }
            var json = {
                divMarginLeft: '0', label: CONST_TIME_TEMP, defaultValue: defaultValue, boxW: '228px', readonly: true, disabled: disabled, item:items, maxLiNum: '6'
            }
            timeList.init(div.getElementsByClassName('select-cycle')[0], json, getId);
        
            timeList.box.style.marginLeft = '4px';
            timeList.list.style.marginTop = '49px';
            timeList.list.style.width = '228px';
            timeList.input.style.height = timeList.input.style.lineHeight = '26px';

            function getId(_node) {
                timeList.input.timeId = _node.data.id;
            }
        }else{
            alert(_data.msg);
        }
    })
}

//勾选开启
function enablePlan() {
    var div = document.getElementById('edit-plan');
    var enable = div.getElementsByClassName('enable-plan')[0];
    var chkBox = enable.getElementsByTagName('i')[0];
    enable.onclick = function() {
        if(chkBox.classList.contains('fa-square-o')) {
            chkBox.classList.add('fa-check-square');
            chkBox.classList.remove('fa-square-o');
        }else{
            chkBox.classList.add('fa-square-o');
            chkBox.classList.remove('fa-check-square');
        }
    }
}

//清除错误提示
function clearPlanErrors() {
    var div = document.getElementById('edit-plan');
    var errors = div.getElementsByClassName('error');
    var noTempTip = div.getElementsByClassName('no-temp-tip')[0];
    var noGroupTip = div.getElementsByClassName('no-group-tip')[0];

    for(var i = errors.length - 1; i >= 0; i--) {
        errors[i].classList.remove('error');
    }
    noTempTip.style.display = noGroupTip.style.display = 'none';
}

//点击添加计划按钮
function onAddPlanBtnClick() {
    var list = document.getElementById('plan-list');
    var btn = list.getElementsByClassName('fa-plus-circle')[0];
    var div = document.getElementById('edit-plan');
    var title = div.getElementsByClassName('title')[0];
    var shade = div.getElementsByClassName('shade')[0];
    var btns = div.getElementsByClassName('btn');
    var name = document.getElementById('plan-name');
    var chkBox = div.getElementsByClassName('enable-plan')[0].getElementsByClassName('fa')[0];

    btn.onclick = function() {
        if((timeList.input.value != CONST_NO_TIME_TEMP) && (groupList.input.value != CONST_NO_GROUP)) {
            title.innerText = CONST_ADD_PLAN;
            name.value = '';
            shade.style.display = 'none';
            btns[0].style.display = btns[1].style.display = 'inline-block';
            btns[0].innerText = CONST_ADD_BTN;
            chkBox.classList.add('fa-check-square');
            chkBox.classList.remove('fa-square-o');
            timeList.input.value = '';
            groupList.input.value = '';
            clearPlanErrors();
        }else{
            alert(CONST_NEED_ADD_GROUP_TEMP);
        }
    }
}

//添加、修改计划
function addModifyPlanFunc() {
    var list = document.getElementById('plan-list');
    var div = document.getElementById('edit-plan');
    var name = document.getElementById('plan-name');
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var chkBox = div.getElementsByClassName('enable-plan')[0].getElementsByClassName('fa')[0];
    var title = div.getElementsByClassName('title')[0];
    
    addBtn.onclick = function() {
        name.value = name.value.replace(/(^\s+)|(\s+$)/g,"");
        name.value ? name.classList.remove('error') : name.classList.add('error');
        var timeTemp = timeList.input.timeId;
        timeList.input.value ? timeList.input.classList.remove('error') : timeList.input.classList.add('error');
        var groups = [];
        groups.push(groupList.input.groupId);
        groupList.input.value ? groupList.input.classList.remove('error') : groupList.input.classList.add('error');
        var enable = chkBox.classList.contains('fa-check-square') ? true : false;
        
        if(!div.getElementsByClassName('error').length) {
            if(title.innerText == CONST_MOFIDY_PLAN) {                  //修改
                var node = list.getElementsByClassName('active')[0];
                WebService.modifyCheckPlan(localStorage.maintenanceToken, node.data.id, name.value, timeTemp, groups, enable, function(_retcode, _data) {
                    if(_retcode) {
                        planGetList(node.data.id, editPlanRefresh);              //刷新列表
                    }else{
                        alert(_data.msg);
                    }
                })
            }else if(title.innerText == CONST_ADD_PLAN){                //添加
                WebService.addCheckPlan(localStorage.maintenanceToken, name.value, timeTemp, groups, enable, function(_retcode, _data) {
                    if(_retcode) {
                        planGetList('', editPlanRefresh);              //刷新列表
                    }else{
                        alert(_data.msg);
                    }
                })
            }   
        }
    }

    clearBtn.onclick = function() {
        editPlanRefresh();
    }
} 

//编辑区域还原初始状态
function editPlanRefresh() {
    var div = document.getElementById('edit-plan');
    var name = document.getElementById('plan-name');
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var chkBox = div.getElementsByClassName('enable-plan')[0].getElementsByClassName('fa')[0];
    var title = div.getElementsByClassName('title')[0];
    var list = document.getElementById('plan-list');

    if(title.innerText == CONST_ADD_PLAN) {
        name.value = timeList.input.value = groupList.input.value = '';
        chkBox.classList.add('fa-check-square');
        chkBox.classList.remove('fa-square-o');
        addBtn.style.display = clearBtn.style.display = 'none';
        name.classList.remove('error');
        timeList.input.classList.remove('error');
        groupList.input.classList.remove('error');
        title.innerText = CONST_PLAN_INFO;
    }else{
        var node = list.getElementsByClassName('active')[0];
        onPlanNameClick(node);
    }
}

//点击修改、删除计划
function onPlanMenuClick() {
    var menu = document.getElementById('plan-menu');
    var list = document.getElementById('plan-list');
    var ul = list.getElementsByTagName('ul')[0];
    var div = document.getElementById('edit-plan');
    var title = div.getElementsByClassName('title')[0];
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var shade = div.getElementsByClassName('shade')[0];

    menu.children[0].onclick = function() {
        title.innerText = CONST_MOFIDY_PLAN;
        addBtn.style.display = clearBtn.style.display = 'inline-block';
        addBtn.innerText = CONST_MODIFY_BTN;
        shade.style.display = 'none';
    }

    menu.children[1].onclick = function() {
        var node = ul.getElementsByClassName('active')[0];
        onDeletePlanMenuClick(node);
    } 
}

//删除计划
function onDeletePlanMenuClick(_node) {
    var deleteBox = new AlertBox();
    var data = {
        title: CONST_DELETE_PLAN,
        info: CONST_DELETE_PLAN_INFO,
        btn: CONST_DELETE_BTN,
        closebtn: 'fa fa-close',
        parentNode: document.body,
        data:_node.data.id
    };
    deleteBox.init(deleteFunc, data);
    function deleteFunc(_data) {
        WebService.deleteCheckPlan(localStorage.maintenanceToken, _data, function(_retcode, _data) {
            if(_retcode) {
                timeTemGetList('', planGetList);       //刷新列表
                deleteBox.uninit();
                clearPlanErrors();
            }else{
                alert(_data.msg);
            }
        })
    }
}