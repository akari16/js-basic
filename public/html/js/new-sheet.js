var alarmPageFlag = true;
var typeList = [];                       //设备类型

function newSheet() {
    newSheetTableFunc();                //表格
    createSheetDiv();                   //生成工单对话框
    onCreateSheetBtnClick();            //点击生成工单
}

//查询设备类型
function getDevType() {
    WebService.getDevType(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {
            for(var i = 0; i < _data.length; i++) {
                typeList.push(_data[i]);
            }
        }else{
            alert(_data);
        }
    }) 
}

//获取待建工单列表
function getAlarmList() {
    var json = {
        page: '1',
        pagesize: CONST_PAGE_SIZE,
        status: '1',
        begintime: '',
        endtime: '',
        type: '',
        devis: '',
        level: ''
    }
    getAlarmFunc(json);
}

//获取报警列表
function getAlarmFunc(_json) {
    for(var i = newSheetTable.tBodyBody.children.length - 1; i >= 0; i--) {
        deleteEle(newSheetTable.tBodyBody.children[i]);
    }
    typeList = [];
    //查询设备类型
    WebService.getDevType(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {
            for(var i = 0; i < _data.length; i++) {
                typeList.push(_data[i]);
            }
            //获取告警列表
            WebService.getAlarmList(localStorage.maintenanceToken, _json.page, _json.pagesize, _json.status, _json.begintime, _json.endtime, _json.type, _json.devid, _json.level, function(_retcode, _data) {
                if(_retcode) {
                    if(_data.list) {
                        if(alarmPageFlag) {
                            alarmPage(Math.ceil(_data.count / CONST_PAGE_SIZE), getAlarmFunc, _json);
                            alarmPageFlag = false;
                        }
                        
                        var data = [];
                        for(var i = 0; i < _data.list.length; i++) {
                            var devName = getDevInfo(_data.list[i].devid);
                            data.push({
                                checkbox: '',
                                id: _data.list[i].breakdownid,
                                name: devName,
                                type: _data.list[i].type,
                                level: _data.list[i].level,
                                time: format(_data.list[i].time * 1000),
                                info: _data.list[i].describe,
                                person: _data.list[i].validator
                            })
                        }
                        newSheetTable.insertData(data);
                        var trs = newSheetTable.tBody.getElementsByTagName('tr');
                        
                        for(var i = 0; i < trs.length; i++) {
                            trs[i].devid = _data.list[i].devid;
                            trs[i].cells[0].innerHTML = '<i class="fa fa-square-o fa-fw" style="font-size: 15px; vertical-align: middle;"></i>';
                            trs[i].cells[0].removeAttribute('title');
                            if(data[i].type - typeList.length < 0) {
                                trs[i].children[3].title = trs[i].children[3].innerText = typeList[parseInt(data[i].type)].devtypename;
                            }else{
                                trs[i].children[3].title = trs[i].children[3].innerText = CONST_UNKNOWN;
                            }
                            var levelInfo = alarmLevelExchange(data[i].level);
                            trs[i].cells[4].title = trs[i].cells[4].innerText = levelInfo.level;
                            trs[i].children[4].style.color = levelInfo.color;
                        }
                        newSheetTable.initEvent();
                        newSheetTable.setCenter([0, 1, 3, 4, 5, 7]);
                        newSheetTable.tableScrollBar.onContentBoxChange();
                        checkBoxFunc();         
                    }
                }else{
                    alert(_data.msg);
                }
            })
        }else{
            alert(_data);
        }
    }) 
}

//表格
function newSheetTableFunc() {
    var json = {tBodyTrHeight: '36px', 
        item: [{text: CONST_SELECT_ALL, width: '5%'}, {text: CONST_ALARM_ID, width: '7%'}, {text: CONST_DEV_NAME, width: '20%'}, {text: CONST_DEV_TYPE, width: '8%'}, {text: CONST_ALARM_LEVEL, width: '8%'}, {text: CONST_ALARM_TIME, width: '14%'}, {text: CONST_ALARM_INFO, width: '31%'}, {text: CONST_CONFIRM_PERSON, width: '7%'}]
    }

    newSheetTable.init(document.getElementById('new-sheet').getElementsByClassName('data-box')[0], json);
    newSheetTable.tHeadTr.cells[0].innerHTML = '<i class="fa fa-square-o fa-fw"></i>' + newSheetTable.tHeadTr.cells[0].innerText;
    getAlarmList();
}

//勾选复选框
function checkBoxFunc() {
    var selectAll = newSheetTable.tHeadTr.cells[0].getElementsByTagName('i')[0];
    //全选
    selectAll.parentNode.onclick = function() {
        if(selectAll.classList.contains('fa-square-o')) {
            selectAll.classList.add('fa-check-square');
            selectAll.classList.remove('fa-square-o');
            for(var i = 0; i < newSheetTable.tBody.rows.length; i++) {
                newSheetTable.tBody.rows[i].cells[0].children[0].classList.add('fa-check-square');
                newSheetTable.tBody.rows[i].cells[0].children[0].classList.remove('fa-square-o');
            }
        }else{
            selectAll.classList.add('fa-square-o');
            selectAll.classList.remove('fa-check-square');
            for(var i = 0; i < newSheetTable.tBody.rows.length; i++) {
                newSheetTable.tBody.rows[i].cells[0].children[0].classList.add('fa-square-o');
                newSheetTable.tBody.rows[i].cells[0].children[0].classList.remove('fa-check-square');
            }
        }
    }

    //勾选单条
    for(var i = 0; i < newSheetTable.tBody.rows.length; i++) {
        newSheetTable.tBody.rows[i].cells[0].onclick = function() {
            if(this.children[0].classList.contains('fa-square-o')) {
                this.children[0].classList.add('fa-check-square');
                this.children[0].classList.remove('fa-square-o');
                newSheetTable.tBody.getElementsByClassName('fa-square-o').length ? 0 : newSheetTable.tHeadTr.cells[0].getElementsByTagName('i')[0].setAttribute('class', 'fa fa-check-square fa-fw');
            }else{
                this.children[0].classList.add('fa-square-o');
                this.children[0].classList.remove('fa-check-square');
                newSheetTable.tHeadTr.cells[0].getElementsByTagName('i')[0].classList.contains('fa-check-square') ? newSheetTable.tHeadTr.cells[0].getElementsByTagName('i')[0].setAttribute('class', 'fa fa-square-o fa-fw') : 0;
            }
        }
    }
}

//生成工单框
function createSheetDiv() {
    var div = document.getElementById('create-sheet-div');
    var json = {tBodyTrHeight: '30px', 
        item: [{text: CONST_DEV_NAME, width: '50%'}, {text: CONST_ALARM_INFO, width: '50%'}]
    }

    createSheetTable.init(div.getElementsByClassName('basic-info')[0], json);
    createSheetTable.tHeadTr.style.height = '30px';
    createSheetTable.tBodyBox.style.top = '30px';
    createSheetTable.tBodyBox.style.bottom = 0;
    executorListFunc();             //工单执行者列表
    onCreateBtnClick();             //点击确认生成工单按钮
}

//点击关闭生成对话框
function closecreateSheetDiv() {
    var div = document.getElementById('create-sheet-div');
    div.style.display = 'none';
    document.getElementById('body-shade').style.display = 'none';
    createSheetTable.uninitEvent();
    createSheetTable.tBodyBody.innerHTML = '';
    createSheetTable.tableScrollBar.uninit();
  
    var inputs = div.getElementsByTagName('input');
    for(var i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove('error');
        inputs[i].value = '';
    }
    var describe = document.getElementById('sheet-des');
    describe.classList.remove('error');
    describe.value = '';
}

//点击生成工单
function onCreateSheetBtnClick() {
    var btn = document.getElementById('new-sheet').getElementsByClassName('toolbar')[0].getElementsByClassName('btn')[0];
    btn.onclick = function() {
        var checkedBox = newSheetTable.tBody.getElementsByClassName('fa-check-square');
        var div = document.getElementById('create-sheet-div');
        if(checkedBox.length > 0) {
            document.getElementById('body-shade').style.display = 'block';
            div.style.display = 'block';
            div.style.left = (window.innerWidth - div.offsetWidth) / 2 + 'px';
            div.style.top = (window.innerHeight - div.offsetHeight) / 2 + 'px';
            var data = [];
            for(var i = 0; i < checkedBox.length; i++) {
                var tr = checkedBox[i].parentNode.parentNode;
                data.push({name: tr.cells[2].innerText, info: tr.cells[6].innerText});
            }
            createSheetTable.insertData(data);
            createSheetTable.initEvent();
            createSheetTable.tBody.style.top = 0;
        }
    }
}

//点击确认生成工单按钮
function onCreateBtnClick() {
    var div = document.getElementById('create-sheet-div');
    var btn = div.getElementsByClassName('btn')[0];
    var inputs = div.getElementsByTagName('input');
    var describe = document.getElementById('sheet-des');
    var term = document.getElementById('term');
    var time = '';
    btn.onclick = function() {
        for(var i = 0; i < inputs.length; i++) {
            inputs[i].value ? inputs[i].classList.remove('error') : inputs[i].classList.add('error');
        }
        time = new Date(term.value).getTime() / 1000 + '';
        if(time > (Date.parse(new Date()) / 1000)) {
            term.classList.remove('error');
        }else{
            term.classList.add('error');
            term.value = CONST_TIME_TIP1;
        }
        
        describe.value ? describe.classList.remove('error') : describe.classList.add('error');
        if(!div.getElementsByClassName('error').length) {
            var ids= [], devids = [];
            var checkboxs = newSheetTable.tBody.getElementsByClassName('fa-check-square');
            for(var j = 0; j < checkboxs.length; j++) {
                ids.push(checkboxs[j].parentNode.parentNode.cells[1].innerText);
                devids.push(checkboxs[j].parentNode.parentNode.devid);
            }

            //生成工单
            WebService.createOrder(localStorage.maintenanceToken, executorList.input.data.userid, time, describe.value, ids, devids, '', function(_retcode, _data) {
                if(_retcode) {
                    getAlarmList();         //重新获取待建工单列表
                    closecreateSheetDiv();
                }else{
                    alert(_data.msg);
                }
            })
        }
    }
}

//工单执行者列表
function executorListFunc() {
    WebService.getUserList(localStorage.maintenanceToken, '', '', '', '3', true, function(_retcode, _data) {
        if(_retcode) {
            //console.log(_data.list);
            for(var i = 0; i < _data.list.length; i++) {
                _data.list[i].text = _data.list[i].username;
            }

            var json = {
                divMarginLeft: '20px', label: CONST_WORKER, defaultValue: '', boxW: '120px', readonly: true, 
                item: _data.list
            }

            executorList.init(document.getElementById('create-sheet-div').getElementsByClassName('system-defined')[0], json);
            executorList.div.style.marginTop = '10px';
            executorList.list.style.marginTop = '26px';
            executorList.input.style.width = '118px';
        }else{
            alert(_data.msg);
        }
    })
}

//插入页码
function alarmPage(_totalPage, _func, _udata) {
    createSheetPage.div ? createSheetPage.uninit() : 0;
    createSheetPage.init(document.getElementById('new-sheet').getElementsByClassName('data-box')[0], {totalPage: _totalPage, showNum: CONST_PAGE_SHOW_NUM}, _func, _udata);
}