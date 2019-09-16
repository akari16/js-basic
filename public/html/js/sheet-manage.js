var newSheetTable = new Table();                      //新建工单页面表格
var createSheetTable = new Table();                   //生成工单对话框里的表格
var toDoSheetTable = new Table();                     //待办工单页面表格
var maintenanceTable = new Table();                   //维护工单页面表格
var detailInfoTable = new Table();                    //查看详细记录表格
var createSheetPage = new Page();                     //生成工单页码
var toDoSheetPage = new Page();                       //待办工单页码
var maintenancePage = new Page();                     //工单维护页码
var executorList = new PullDownList();                //工单执行者列表

window.onload = function() {
    checkToken();               //判断token，如为空则跳转到登录页面
    addHeader();                //添加页眉
    onMenuClick();              //点击菜单栏选项
    pullDownLists();            //下拉菜单
    newSheet();                 //新建工单
    toDoSheet();                //待办工单
    maintenanceSheet();         //维护工单
    divMove();                  //窗口可拖拽
}

window.onresize = function() {
    newSheetTable.tableScrollBar ? newSheetTable.tableScrollBar.onContentBoxChange() : 0;
    toDoSheetTable.tableScrollBar ? toDoSheetTable.tableScrollBar.onContentBoxChange() : 0;
    maintenanceTable.tableScrollBar ? maintenanceTable.tableScrollBar.onContentBoxChange() : 0;
}
 
function addHeader() {
    var pageHeader = new PageHeader();
    pageHeader.init(document.getElementsByClassName('out-box')[0], 2);
}

function onMenuClick() {
    var leftMenu = document.getElementById('left-menu');
    var lis = leftMenu.getElementsByTagName('li');
    var newSheet = document.getElementById('new-sheet');
    var toDoSheet = document.getElementById('to-do-sheet');
    var maintenance = document.getElementById('maintenance');
    for(var i = 0; i < lis.length; i++) {
        lis[i].index = i;
        lis[i].onclick = function() {
            leftMenu.getElementsByClassName('active')[0].classList.remove('active');
            this.classList.add('active');
            if(this.index == 0) {
                getAlarmList();
                newSheet.style.display = 'block';
                toDoSheet.style.display = maintenance.style.display = 'none';
            }else if(this.index == 1) {
                getAllToDoList();                           //查询待办列表
                toDoSheet.style.display = 'block';
                newSheet.style.display = maintenance.style.display = 'none';
            }else if(this.index == 2) {
                getAllOrderList();                                  //获取全部列表 
                maintenance.style.display = 'block';
                newSheet.style.display = toDoSheet.style.display = 'none';
            }
        }
    }
}

//下拉菜单
function pullDownLists() {
    manufacturer();             //选择厂家下拉列表
    workStage();                //选择建设工期
    selectStatus();             //修改信息框选择状态
    selectPerson();             //修改信息框选择人员
    document.getElementById('to-do-sheet').style.display = 'none';
    document.getElementById('maintenance').style.display = 'none';
    document.getElementById('create-sheet-div').style.display = 'none';
    document.getElementById('create-sheet-div').style.opacity = '1';
    document.getElementById('modify-status').style.display = 'none';
    document.getElementById('modify-status').style.opacity = '1';
}

//选择厂家下拉列表
function manufacturer() {
    var json = {
        divMarginLeft: '60px', label: CONST_MANUFACTURER, defaultValue: CONST_ALL, boxW: '120px', readonly: true,
        item: [{text: CONST_ALL}, {text: CONST_HAIKANG}, {text: CONST_DAHUA}, {text: CONST_TIANDI}, {text: CONST_AVCON}]
    }
    var manufacturerList = new PullDownList();
    manufacturerList.init(document.getElementById('new-sheet').getElementsByClassName('toolbar')[0], json);
    var manufacturerList1 = new PullDownList();
    manufacturerList1.init(document.getElementById('to-do-sheet').getElementsByClassName('toolbar')[0], json);
    var manufacturerList2 = new PullDownList();
    manufacturerList2.init(document.getElementById('maintenance').getElementsByClassName('toolbar')[0], json);
}

//选择建设工期
function workStage() {
    var json = {
        divMarginLeft: '60px', label: CONST_STAGE, defaultValue: CONST_ALL, boxW: '120px', readonly: true,
        item: [{text: CONST_ALL}, {text: CONST_STAGE1}, {text: CONST_STAGE2}, {text: CONST_STAGE3}]
    }
    var workStageList = new PullDownList();
    workStageList.init(document.getElementById('new-sheet').getElementsByClassName('toolbar')[0], json);
    var workStageList1 = new PullDownList();
    workStageList1.init(document.getElementById('to-do-sheet').getElementsByClassName('toolbar')[0], json);
    var workStageList2 = new PullDownList();
    workStageList2.init(document.getElementById('maintenance').getElementsByClassName('toolbar')[0], json);
}

//修改信息框选择状态
function selectStatus() {
    var json = {
        label: CONST_OPERATE, defaultValue: '', boxW: '179px', readonly: true,
        item: [{text: CONST_RESTART_ORDER, data : '0'}, {text: CONST_CLOSE_ORDER, data:'4'}]
    }
    var statusList = new PullDownList();
    statusList.init(document.getElementById('status-list'), json);
    statusList.input.style.width = '177px';
}

//修改信息框选择人员
function selectPerson() {
    WebService.getUserList(localStorage.maintenanceToken, '', '', '', '3', true, function(_retcode, _data) {
        if(_retcode) {
            //console.log(_data.list);
            for(var i = 0; i < _data.list.length; i++) {
                _data.list[i].text = _data.list[i].username;
            }

            var json = {
                label: CONST_WORKER, defaultValue: '', boxW: '179px', readonly: true,
                item: _data.list
            }

            var personList = new PullDownList();
            personList.init(document.getElementById('person-list'), json);
            personList.input.style.width = '177px';
            personList.list.style.top = '27px';
        }else{
            alert(_data.msg);
        }
    })

    // var json = {
    //     label: CONST_WORKER, defaultValue: '', boxW: '179px', readonly: true,
    //     item: [{text: '王小明'}, {text: '白月初'}, {text: '王富贵'}, {text: '梵云飞'}]
    // }
    // var personList = new PullDownList();
    // personList.init(document.getElementById('person-list'), json);
    // personList.input.style.width = '177px';
}

//根据设备id查询设备信息
function getDevInfo(_devid) {
    var data;
    WebService.getDevInfo(localStorage.maintenanceToken, _devid, function(_retcode, _data) {
        if(_retcode) {
            data = _data.name;
        }else{
            _data.msg ? alert(_data.msg) : data = '';       //如果返回undefined说明设备已经被删除了
        }
    })
    return data;
}

//插入操作按钮，以及点击按钮的操作
function handleIcon(_parentNode) {
    console.log(_parentNode.cells[2].innerText);

    if(_parentNode.cells[2].innerText == '1' || _parentNode.cells[2].innerText == '3') {
        //可操作状态
        var td = document.createElement('td');
        td.innerHTML = '<i class="fa fa-pencil" style="cursor: pointer" title="' + CONST_MODIFY + '"></i><i class="fa fa-info-circle" style="margin-left: 30px; cursor: pointer" title="' + CONST_INFO + '"></i>';
        _parentNode.append(td);

        //修改状态
        td.children[0].onclick = function() {
            modifyStatus(this);
        }

        //查看记录
        td.children[1].onclick = function() {
            getRecord(this);
        }
    } else {
        //不可操作状态
        var td = document.createElement('td');
        td.innerHTML = '<i class="fa fa-info-circle" style="margin-left: 42px; cursor: pointer" title="' + CONST_INFO + '"></i>';
        _parentNode.append(td);

        //查看记录
        td.children[0].onclick = function() {
            getRecord(this);
        }
    }

    
}

//修改状态功能
function modifyStatus(_this) {
    var toDo = document.getElementById('to-do-sheet');
    var div = document.getElementById('modify-status');
    var btn = div.getElementsByClassName('btn')[0];
    var status = document.getElementById('status-list').getElementsByTagName('input')[0];
    var person = document.getElementById('person-list').getElementsByTagName('input')[0];
    var describe = document.getElementById('modify-des');
    var term = document.getElementById('term1');
    var tr = _this.parentNode.parentNode;
    var orderid = tr.cells[0].innerText;
    var time = '';

    div.style.display = 'block';
    document.getElementById('body-shade').style.display = 'block';
    div.style.left = (window.innerWidth - div.offsetWidth) / 2 + 'px';
    div.style.top = (window.innerHeight - div.offsetHeight) / 2 + 'px';
    status.value = CONST_TIME_TIP5; //tr.cells[2].innerText;
    person.value = tr.cells[4].innerText;
    person.data = {'userid':tr.data.executor};
    term.value = tr.cells[6].innerText;
    btn.onclick = function() {
        if (!status.data) {
            status.classList.add('error');
            status.value = CONST_TIME_TIP5;
            return;
        } else {
            status.classList.remove('error');
        }

        if (status.data.data != 4) {
            time = new Date(term1.value).getTime() / 1000 + '';
            if(time > (Date.parse(new Date()) / 1000)) {
                term.classList.remove('error');
            }else{
                term.classList.add('error');
                term.value = CONST_TIME_TIP1;
            }
        }
        
        describe.value ? describe.classList.remove('error') : describe.classList.add('error');
        if(!div.getElementsByClassName('error').length) {
            if (status.data.data == 0) {
                WebService.RestartOrder(localStorage.maintenanceToken, orderid, person.data.userid, time, describe.value, '', function(_retcode, _data) {
                    if(_retcode) {
                        closeModifyStatusDiv();         //关闭修改对话框
                        getStyle(toDo, 'display') == 'block' ? getAllToDoList() : getAllOrderList();        /////////如果是带筛选条件的 则还按筛选条件获取列表
                    }else{
                        alert(_data.msg);
                    }
                })
            } else if(status.data.data == 4) {
                WebService.CloseOrder(localStorage.maintenanceToken, orderid, describe.value, '', function(_retcode, _data) {
                    if(_retcode) {
                        closeModifyStatusDiv();         //关闭修改对话框
                        getStyle(toDo, 'display') == 'block' ? getAllToDoList() : getAllOrderList();        /////////如果是带筛选条件的 则还按筛选条件获取列表
                    }else{
                        alert(_data.msg);
                    }
                })
            }
        }
    }
}

//查看记录功能
function getRecord(_this) {
    var div = document.getElementById('record');
    var tr = _this.parentNode.parentNode;
    div.style.display = 'block';
    document.getElementById('body-shade').style.display = 'block';
    div.style.left = (window.innerWidth - div.offsetWidth) / 2 + 'px';
    div.style.top = (window.innerHeight - div.offsetHeight) / 2 + 'px';

    WebService.getOrderRecord(localStorage.maintenanceToken, tr.cells[0].innerText, function(_retcode, _data) {
        if(_retcode) {
            var data = [];
            for(var i = 0; i < _data.length; i++) {
                data.push({time: format(_data[i].time * 1000), person: _data[i].userid, oldStatus: orderTypeExchange('0', _data[i].oldstatus), newStatus: orderTypeExchange('0', _data[i].status), mark: _data[i].content.split('\n').join(' ')});
            }
            detailInfoTable.insertData(data);
            detailInfoTable.initEvent();
            detailInfoTable.tBody.style.top = 0;
            detailInfoTable.setCenter([0, 1, 2, 3]);
        }else{
            alert(_data.msg);
        }
    })
}

//点击关闭修改对话框
function closeModifyStatusDiv() {
    document.getElementById('modify-status').style.display = 'none';
    document.getElementById('body-shade').style.display = 'none';
    document.getElementById('modify-des').value = '';
    document.getElementById('modify-des').classList.remove('error');
    document.getElementById('term1').classList.remove('error');
}

//查看详情框
function detailInfoDiv() {
    var div = document.getElementById('record').getElementsByClassName('record-box')[0];
    var json = {tBodyTrHeight: '30px', 
        item: [{text: CONST_MODIFY_TIME, width: '16%'}, {text: CONST_MODIFY_PRESON, width: '10%'}, {text: CONST_OLD_STATUS, width: '12%'}, {text: CONST_NEW_STATUS, width: '12%'}, {text: CONST_MARK, width: '50%'}]
    }

    detailInfoTable.init(div, json);
    detailInfoTable.tHeadTr.style.height = '30px';
    detailInfoTable.tBodyBox.style.top = '30px';
    detailInfoTable.tBodyBox.style.bottom = 0;
}

//点击关闭详情框
function closeDetailInfoDiv() {
    document.getElementById('record').style.display = 'none';
    document.getElementById('body-shade').style.display = 'none';
    detailInfoTable.uninitEvent();
    detailInfoTable.tBodyBody.innerHTML = '';
    detailInfoTable.tableScrollBar.uninit();
}

//可拖动窗口
function divMove() {
    moveDiv(document.getElementById('create-sheet-div'));
    moveDiv(document.getElementById('modify-status'));
    moveDiv(document.getElementById('record'));
}