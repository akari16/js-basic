var timeTemInfoScroll = new ScrollBar();
var timeTemListScroll = new ScrollBar();

//时间模板功能
function timeTemplateFunc() {
    cycle();                        //执行周期
    selectTimes();                  //勾选时间段
    onAddTimeTemBtnClick();         //点击添加模板按钮
    timeTemScroll();                //滚动条
    timeTemLayout();
    addTimeTem();                   //点击添加模板确定按钮、取消按钮
    onModifyTimeTemMenuClick();     //点击修改、删除模板菜单
}

function timeTemScroll() {
    timeTemListScroll.init(3, document.getElementById('time-tem-list').getElementsByClassName('ul-box')[0], document.getElementById('time-tem-list').getElementsByTagName('ul')[0]);
    timeTemInfoScroll.init(2, document.getElementById('edit-time-tem'), document.getElementById('edit-time-tem').getElementsByClassName('content-box')[0]);
}

function timeTemLayout() {
    var editDiv = document.getElementById('edit-time-tem');
    var div = editDiv.getElementsByClassName('content-box')[0];
    div.style.left = (editDiv.offsetWidth - div.offsetWidth) / 2 + 'px';
}

//刷新时间模板列表
function timeTemGetList(_id, _func) {
    var div = document.getElementById('time-tem-list');
    var ul = div.getElementsByTagName('ul')[0];
    for(var i = ul.children.length - 1; i >= 0; i--) {
        deleteEle(ul.children[i]);
    }

    WebService.getTimeTemp(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {
            for(var i = 0; i < _data.length; i++) {
                var li = document.createElement('li');
                li.innerHTML = '<i class="fa fa-clock-o"></i>' + _data[i].name;
                li.data = _data[i];
                if(_id) {
                    if(_data[i].id == _id) {
                        li.classList.add('active');
                    }
                }
                ul.appendChild(li);
                li.onclick = function() {
                    onTimeTemClick(this);
                }
                onTimeTemRclick(li);
            }
            _func ? _func() : 0;
        }else{
            alert(_data.msg);
        }
    })
}

//左键点击模板名称
function onTimeTemClick(_node) {
    var list = document.getElementById('time-tem-list');
    var ul = list.getElementsByTagName('ul')[0];
    var div = document.getElementById('edit-time-tem');
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var title = div.getElementsByClassName('title')[0];
    var name = document.getElementById('time-tem-name');
    var chkBoxes = div.getElementsByClassName('cycle')[0].getElementsByClassName('fa');
    var times = div.getElementsByClassName('time-div')[0].getElementsByClassName('time-picker');
    var shade = div.getElementsByClassName('shade')[0];

    shade.style.display = 'block';
    ul.getElementsByClassName('active').length ? ul.getElementsByClassName('active')[0].classList.remove('active') : 0;
    for(var i = 0; i < times.length; i++) {
        times[i].getElementsByTagName('i')[0].classList.add('fa-square-o');
        times[i].getElementsByTagName('i')[0].classList.remove('fa-check-square');
        times[i].getElementsByTagName('input')[0].value = times[i].getElementsByTagName('input')[1].value = '00:00:00';
    }
    addBtn.style.display = clearBtn.style.display = 'none';
    _node.classList.add('active');
    title.innerText = CONST_TEM_INFO;
    name.value = _node.data.name;
    var str = parseInt(_node.data.week).toString(2);
    for(var i = str.length; i < 7; i++) {
        str = '0' + str;
    }
    for(var i = 0; i < str.length; i++) {
        if(str[i] == '1') {
            chkBoxes[chkBoxes.length - i - 1].classList.add('fa-check-square');
            chkBoxes[chkBoxes.length - i - 1].classList.remove('fa-square-o');
        }else{
            chkBoxes[chkBoxes.length - i - 1].classList.add('fa-square-o');
            chkBoxes[chkBoxes.length - i - 1].classList.remove('fa-check-square');
        }
    }
    _node.data.week == '1111111' ? chkBoxes[0].classList.add('fa-check-square') | chkBoxes[0].classList.remove('fa-square-o') : chkBoxes[0].classList.add('fa-square-o') | chkBoxes[0].classList.remove('fa-check-square');
    for(var i = 0; i < _node.data.times.length; i++) {
        var arr = _node.data.times[i].split('-');
        times[i].getElementsByTagName('input')[0].value = arr[0];
        times[i].getElementsByTagName('input')[1].value = arr[1];
        times[i].getElementsByTagName('i')[0].classList.add('fa-check-square');
        times[i].getElementsByTagName('i')[0].classList.remove('fa-square-o');
    }
}

//右键点击模板名称
function onTimeTemRclick(_node) {
    var menu = document.getElementById('time-tem-menu');
    _node.oncontextmenu = function(e) {
        onTimeTemClick(this);
        menu.style.display = 'block';
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';

        document.onclick = function() {
            menu.style.display = 'none';
            document.onclick = null;
        }
    }
}

//执行周期
function cycle() {
    var editTem = document.getElementById('edit-time-tem');
    var box = editTem.getElementsByClassName('cycle')[0].getElementsByTagName('span');
    //全选
    box[0].onclick = function() {
        if(this.children[0].classList.contains('fa-square-o')) {
            for(var i = 0; i < box.length; i++) {
                box[i].children[0].setAttribute('class', 'fa fa-check-square fa-fw');
            }
            this.children[0].classList.add('select-all');
        }else{
            for(var i = 0; i < box.length; i++) {
                box[i].children[0].setAttribute('class', 'fa fa-square-o fa-fw');
            }
            this.children[0].classList.add('select-all');
        }
    }
    //周一到周日
    for(var i = 1; i < box.length; i++) {
        box[i].onclick = function() {
            if(this.children[0].classList.contains('fa-square-o')) {
                this.children[0].setAttribute('class', 'fa fa-check-square fa-fw');
                editTem.getElementsByClassName('fa-check-square').length == 7 ? box[0].children[0].setAttribute('class', 'fa fa-check-square fa-fw select-all') : 0;
            }else{
                this.children[0].setAttribute('class', 'fa fa-square-o fa-fw');
                box[0].children[0].setAttribute('class', 'fa fa-square-o fa-fw select-all');
            }
        }
    }
}

//勾选时间段
function selectTimes() {
    var editTem = document.getElementById('edit-time-tem');
    var picker = editTem.getElementsByClassName('time-picker');
    for(var i = 0; i < picker.length; i++) {
        picker[i].children[0].onclick = function() {
            this.children[0].classList.contains('fa-square-o') ? this.children[0].setAttribute('class', 'fa fa-check-square') : this.children[0].setAttribute('class', 'fa fa-square-o');
        }
    }
}

//点击添加模板按钮
function onAddTimeTemBtnClick() {
    var list = document.getElementById('time-tem-list');
    var ul = list.getElementsByTagName('ul')[0];
    var btn = list.getElementsByClassName('fa-plus-circle')[0];
    var div = document.getElementById('edit-time-tem');
    var title = div.getElementsByClassName('title')[0];
    var name = document.getElementById('time-tem-name');
    var checkIcons = div.getElementsByClassName('fa-check-square');
    var timePicker = div.getElementsByClassName('time-picker');
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var shade = div.getElementsByClassName('shade')[0];
    
    btn.onclick = function() {
        shade.style.display = 'none';
        ul.getElementsByClassName('active').length ? ul.getElementsByClassName('active')[0].classList.remove('active') : 0;
        title.innerText = CONST_ADD_TEM;
        name.value = '';
        addBtn.style.display = clearBtn.style.display = 'inline-block';
        addBtn.innerText = CONST_ADD_BTN;
        for(var i = checkIcons.length- 1; i >= 0; i--) {
            checkIcons[i].classList.add('fa-square-o');
            checkIcons[i].classList.remove('fa-check-square');
        }
        for(var i = 0; i < timePicker.length; i++) {
            var inputs = timePicker[i].getElementsByTagName('input');
            for(var j = 0; j < inputs.length; j++) {
                inputs[j].value = '00:00:00';
            }
        }
    }
}

//点击修改、删除模板菜单
function onModifyTimeTemMenuClick() {
    var menu = document.getElementById('time-tem-menu');
    var list = document.getElementById('time-tem-list');
    var ul = list.getElementsByTagName('ul')[0];
    var div = document.getElementById('edit-time-tem');
    var title = div.getElementsByClassName('title')[0];
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var shade = div.getElementsByClassName('shade')[0];

    menu.children[0].onclick = function() {
        title.innerText = CONST_MODIFY_TEM;
        addBtn.style.display = clearBtn.style.display = 'inline-block';
        addBtn.innerText = CONST_MODIFY_BTN;
        shade.style.display = 'none';
    }

    menu.children[1].onclick = function() {
        var node = ul.getElementsByClassName('active')[0];
        onDeleteTimeTemMenuClick(node);
    }
}

//删除模板
function onDeleteTimeTemMenuClick(_node) {
    var deleteBox = new AlertBox();
    var data = {
        title: CONST_DELETE_TEM,
        info: CONST_DELETE_TEM_INFO,
        btn: CONST_DELETE_BTN,
        closebtn: 'fa fa-close',
        parentNode: document.body,
        data:_node.data.id
    };
    deleteBox.init(deleteFunc, data);
    function deleteFunc(_data) {
        WebService.deleteTimeTemp(localStorage.maintenanceToken, _data, function(_retcode, _data) {
            if(_retcode) {
                timeTemGetList('', timeTemEditDivRefresh);       //刷新列表
                deleteBox.uninit();
            }else{
                alert(_data.msg);
            }
        })
    }
}

//点击添加模板确定按钮、取消按钮
function addTimeTem() {
    var div = document.getElementById('edit-time-tem');
    var list = document.getElementById('time-tem-list');
    var title = div.getElementsByClassName('title')[0];
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var name = document.getElementById('time-tem-name');
    var cycle = div.getElementsByClassName('cycle')[0];
    var cycleChkBoxes = cycle.getElementsByTagName('i');
    var timeDiv = div.getElementsByClassName('time-div')[0];
    var cycleError = div.getElementsByClassName('cycle-error')[0];
    var timeError = div.getElementsByClassName('time-error')[0];

    addBtn.onclick = function() {
        var flag = true;
        var days = '';
        name.value = name.value.replace(/(^\s+)|(\s+$)/g,"");
        name.value ? (name.classList.remove('error')) | (flag = true) : (name.classList.add('error')) | (flag = false);
        cycle.getElementsByClassName('fa-check-square').length ? (cycleError.style.display = 'none') | (flag = true) : (cycleError.style.display = 'block') | (flag = false);
        flag = checkTime();
        
        if(flag) {
            //周期
            for(var i = cycleChkBoxes.length - 1; i > 0 ; i--) {
                var s = cycleChkBoxes[i].classList.contains('fa-check-square') ? '1' : '0';
                days = days + s;
            }
            if(title.innerText == CONST_ADD_TEM) {      //添加模板
                WebService.addTimeTemp(localStorage.maintenanceToken, name.value, parseInt(days, 2).toString(), checkTime(), function(_retcode, _data) {
                    if(_retcode) {
                        timeTemGetList('', timeTemEditDivRefresh);       //刷新列表
                    }else{
                        alert(_data.msg);
                    }
                })
            }else if(title.innerText == CONST_MODIFY_TEM) {             //修改模板
                var node = document.getElementById('time-tem-list').getElementsByClassName('active')[0]; 
                WebService.modifyTimeTemp(localStorage.maintenanceToken, node.data.id, name.value, parseInt(days, 2).toString(), checkTime(), function(_retcode, _data) {
                    if(_retcode) {
                        timeTemGetList(node.data.id, timeTemEditDivRefresh);       //刷新列表
                    }else{
                        alert(_data.msg);
                    }
                })
            }  
        }
    }

    clearBtn.onclick = function() {
        timeTemEditDivRefresh();
    }
}

//编辑区域还原初始状态
function timeTemEditDivRefresh() {
    var div = document.getElementById('edit-time-tem');
    var title = div.getElementsByClassName('title')[0];
    var name = document.getElementById('time-tem-name');
    var cycleError = div.getElementsByClassName('cycle-error')[0];
    var timeError = div.getElementsByClassName('time-error')[0];
    var timeDiv = div.getElementsByClassName('time-div')[0];
    var list = document.getElementById('time-tem-list');
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var shade = div.getElementsByClassName('shade')[0];
    
    if(title.innerText == CONST_MODIFY_TEM) {
        var node = list.getElementsByClassName('active')[0];
        onTimeTemClick(node);
    }else{
        shade.style.display = 'block';
        title.innerText = CONST_TEM_INFO;
        addBtn.style.display = clearBtn.style.display = 'none';
        name.value = '';
        name.classList.remove('error');
        cycleError.style.display = timeError.style.display = 'none';
        var checkedBoxes = div.getElementsByClassName('fa-check-square'); 
        for(var i = checkedBoxes.length - 1; i >= 0; i--) {
            checkedBoxes[i].classList.add('fa-square-o');
            checkedBoxes[i].classList.remove('fa-check-square');
        }
        var inputs = timeDiv.getElementsByTagName('input');
        for(var i = 0; i < inputs.length; i++) {
            inputs[i].value = '00:00:00';
        }
    }
} 

//判断时间段
function checkTime() {
    var div = document.getElementById('edit-time-tem');
    var timeDiv = div.getElementsByClassName('time-div')[0];
    var timeError = div.getElementsByClassName('time-error')[0];
    var timeChkBoxes = timeDiv.getElementsByClassName('fa-check-square');
    var times = [];
    var times1 = [];
    var flag = true;
    
    if(timeDiv.getElementsByClassName('fa-check-square').length) {
        timeError.style.display = 'none';
        flag = true;
    }else{
        timeError.innerText = CONST_TIME_TIP3;
        timeError.style.display = 'block';
        return false;
    }
    
    for(var i = 0; i < timeChkBoxes.length; i++) {
        var time = timeChkBoxes[i].parentNode.parentNode.getElementsByTagName('input')[0].value.split(':');
        var startTime = time[0] * 3600 + time[1] * 60 + time[2] * 1;
        time = timeChkBoxes[i].parentNode.parentNode.getElementsByTagName('input')[1].value.split(':');
        var endTime = time[0] * 3600 + time[1] * 60 + time[2] * 1;
        if(endTime <= startTime) {
            timeError.innerText = CONST_TIME_TIP4;
            timeError.style.display = 'block';
            return false;
        }
        times.push({startTime: startTime, endTime: endTime});
        var str = timeChkBoxes[i].parentNode.parentNode.getElementsByTagName('input')[0].value + '-' + timeChkBoxes[i].parentNode.parentNode.getElementsByTagName('input')[1].value;
        times1.push(str);
    }
    
    for(var i = 0; i < times.length; i++) {
        for(var j = 0; j < times.length; j++) {
            if(j != i) {
                if((times[j].startTime >= times[i].startTime && times[j].startTime <= times[i].endTime) ||  (times[j].endTime >= times[i].startTime && times[j].endTime <= times[i].endTime)) {
                    flag = false;
                    break;
                }
            }
        }
    }
    flag ? timeError.style.display = 'none': (timeError.innerText = CONST_TIME_TIP2) | (timeError.style.display = 'block');
    if(!flag) {
        timeError.innerText = CONST_TIME_TIP2;
        timeError.style.display = 'block';
        return false;
    }else{
        timeError.style.display = 'none';
    }
    return times1;
}