var table = new Table();                    //表格
var page = new Page();                      //页码
var executorList = new PullDownList();      //工单执行者列表
var pageFlag = true;                        //控制只调用一次页码函数
var typeList = [];                       //设备类型

window.onload = function() {
    checkToken();               //判断token，如为空则跳转到登录页面
    addHeader();                //添加页眉
    chooseLevel();              //选择等级类型下拉列表
    chooseDevStatus();          //选择设备状态下拉列表
    chooseConfirmStatus();      //选择确认状态下拉列表
    tableFunc();                //表格
    getAlarmList();             //获取报警列表
    createSheet();              //勾选生成工单
    confirmOrder();             //确认对话框点击确认按钮
    divMove();                  //窗口可拖拽
}

window.onresize = function() {
    table.tableScrollBar ? table.tableScrollBar.onContentBoxChange() : 0;
}

function addHeader() {
    var pageHeader = new PageHeader();
    pageHeader.init(document.getElementsByClassName('out-box')[0], 1);
}

//选择等级类型下拉列表
function chooseLevel() {
    var json = {
        divMarginLeft: '60px', label: CONST_ALARM_LEVEL, defaultValue: CONST_ALL, boxW: '100px', readonly: true,
        item: [{text: CONST_ALL}, {text: CONST_LEVEL_URGENCY}, {text: CONST_LEVEL_IMPORT}, {text: CONST_LEVEL_NOTICE}]
    }
    var devType = new PullDownList();
    devType.init(document.getElementsByClassName('toolbar')[0], json);
}

//选择设备状态下拉列表
function chooseDevStatus() {
    var json = {
        divMarginLeft: '60px', label: CONST_DEV_STATUS, defaultValue: CONST_ALL, boxW: '100px', readonly: true, 
        item: [{text: CONST_ALL}, {text: CONST_STATUS_NORMAL}, {text: CONST_STATUS_ABNORMAL}]
    }
    var devStatus = new PullDownList();
    devStatus.init(document.getElementsByClassName('toolbar')[0], json);
}

//选择确认状态下拉列表
function chooseConfirmStatus() {
    var json = {
        divMarginLeft: '60px', label: CONST_CONFIRM_STATUS, defaultValue: CONST_ALL, boxW: '100px', readonly: true, 
        item: [{text: CONST_ALL}, {text: CONST_ALARM_CHECKED}, {text: CONST_ALARM_UNCHECKED}, {text: CONST_HAS_IGNORED}]
    }
    var devStatus = new PullDownList();
    devStatus.init(document.getElementsByClassName('toolbar')[0], json);
}

//根据设备id查询设备信息
function getDevInfo(_devid) {
    var data;
    WebService.getDevInfo(localStorage.maintenanceToken, _devid, function(_retcode, _data) {
        if(_retcode) {
            data = _data.name;
        }else{
            alert(_data.msg);
        }
    })
    return data;
}

//可拖动窗口
function divMove() {
    moveDiv(document.getElementById('confirm-alarm'));
}
 
//获取报警信息
function getAlarmFunc(_json) {
    for(var i = table.tBodyBody.children.length - 1; i >= 0; i--) {
        deleteEle(table.tBodyBody.children[i]);
    }
    typeList = [];
    //获取设备类型
    WebService.getDevType(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {
            for(var i = 0; i < _data.length; i++) {
                typeList.push(_data[i]);
            }
            //获取告警列表
            WebService.getAlarmList(localStorage.maintenanceToken, _json.page, _json.pagesize, _json.status, _json.begintime, _json.endtime, _json.type, _json.devid, _json.level, function(_retcode, _data) {
                if(_retcode) {
                    if(_data.list) {
                        if(pageFlag) {
                            insertPage(Math.ceil(_data.count / CONST_PAGE_SIZE), getAlarmFunc, _json);           //插入页码
                            pageFlag = false;
                        }
                      
                        var data = [];
                        for(var i = 0; i < _data.list.length; i++) {
                            data.push({
                                id: _data.list[i].breakdownid,
                                name: _data.list[i].devname,
                                type: _data.list[i].type,
                                level: _data.list[i].level,
                                time: format(_data.list[i].time * 1000),
                                info: _data.list[i].describe,
                                img: CONST_ALARM_IMAGE_URL + _data.list[i].image,
                                status: _data.list[i].status
                            })
                        }
                        table.insertData(data);
                        var trs = table.tBody.getElementsByTagName('tr');
                        for(var i = 0; i < trs.length; i++) {
                            trs[i].devid = _data.list[i].devid;
                            if(data[i].type - typeList.length < 0) {
                                trs[i].children[2].title = trs[i].children[2].innerText = typeList[parseInt(data[i].type)].devtypename;
                            }else{
                                trs[i].children[2].title = trs[i].children[2].innerText = CONST_UNKNOWN;
                            }
                            
                            var levelInfo = alarmLevelExchange(data[i].level);
                            trs[i].children[3].title = trs[i].children[3].innerText = levelInfo.level;
                            trs[i].children[3].style.color = levelInfo.color;
        
                            if(data[i].img != CONST_ALARM_IMAGE_URL) {
                                trs[i].children[6].innerHTML = '<img src="' + data[i].img + '" style="width: 26px; cursor: pointer; vertical-align: middle;">';
                            }else{
                                trs[i].children[6].innerHTML = '--';
                            }
                            trs[i].children[6].removeAttribute('title');
                            
        
                            if(data[i].status == '2') {
                                trs[i].children[7].innerHTML = '<i class="fa fa-times fa-fw"></i> ' + CONST_HAS_IGNORED;
                            }else if(data[i].status == '1' || data[i].status == '3') {
                                trs[i].children[7].innerHTML = '<i class="fa fa-check fa-fw"></i> ' + CONST_ALARM_CHECKED;
                            }else{
                                trs[i].children[7].innerHTML = '<i class="fa fa-check-circle fa-lg" style="cursor: pointer;" title="' + CONST_CONFIRM + '"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-times-circle fa-lg" style="cursor: pointer;" title="' + CONST_IGNORE + '"></i>'
                            }
                            trs[i].children[7].removeAttribute('title');
                        }
                        table.initEvent();
                        table.setCenter([0, 2, 3, 4, 6, 7]);
                        onImageClick();             //点击放大图片
                        onIgnoreBtnClick();         //点击忽略按钮
                        onConfirmBtnClick();        //点击确认按钮
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

//获取报警列表
function getAlarmList() {
    var json = {
        page: '1',
        pagesize: CONST_PAGE_SIZE,
        status: '',
        begintime: '',
        endtime: '',
        type: '',
        devis: '',
        level: ''
    }
    getAlarmFunc(json);
}

//表格
function tableFunc() {
    var json = {tBodyTrHeight: '36px', 
        item: [{text: CONST_ALARM_ID, width: '7%'}, {text: CONST_DEV_NAME, width: '18%'}, {text: CONST_DEV_TYPE, width: '10%'}, {text: CONST_ALARM_LEVEL, width: '10%'}, {text: CONST_ALARM_TIME, width: '20%'}, {text: CONST_ALARM_INFO, width: '20%'}, {text: CONST_ALARM_IMAGE, width: '5%'}, {text: CONST_ALARM_HANDLE, width: '10%'}]
    }
    table.init(document.getElementsByClassName('data-box')[0], json);
}

//点击放大图片
function onImageClick() {
    var imgs = table.tBody.getElementsByTagName('img');
    var shade = document.getElementById('body-shade');

    for(var i = 0; i < imgs.length; i++) {
        imgs[i].onclick = null;
        imgs[i].onclick = function() {
            shade.style.display = 'block';
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.zIndex = '99';
            var img = document.createElement('img');
            img.setAttribute('src', this.getAttribute('src'));
            img.style.position = 'absolute';
            img.style.top = img.style.left = '50%';
            var closeBtn = document.createElement('i');
            closeBtn.setAttribute('class', 'fa fa-times-circle fa-2x');
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = closeBtn.style.left = '50%';
            closeBtn.style.color = '#ddd';
            closeBtn.onmouseover = function() {
                this.style.color = 'red';
                this.onmouseout = function() {
                    this.style.color = '#ddd';
                }
            }
        
            div.appendChild(img);
            div.appendChild(closeBtn);
            document.body.appendChild(div);
            
            img.style.marginLeft = -img.offsetWidth / 2 + 'px';
            img.style.marginTop = -img.offsetHeight / 2 + 'px';
            closeBtn.style.marginLeft = img.offsetWidth / 2 - closeBtn.offsetWidth / 2 + 'px';
            closeBtn.style.marginTop = -img.offsetHeight / 2 - closeBtn.offsetHeight / 2 + 'px';

            div.onclick = function() {
                shade.style.display = 'none';
                this.onclick = null;
                document.body.removeChild(div);
            }

            img.onclick = function(e) {
                e.stopPropagation();
            }
        }
    }
}


//点击忽略按钮
function onIgnoreBtnClick() {
    var btns = table.tBody.getElementsByClassName('fa-times-circle');
    for(var i = 0; i < btns.length; i++) {
        btns[i].onclick = null;
        btns[i].onclick = function() {
            var data = {
                title: CONST_IGNORE_ALARM_TITLE,
                info: CONST_IGNORE_ALARM_INFO,
                btn: CONST_IGNORE_BTN,
                closebtn: 'fa fa-close',
                parentNode: document.body,
                data: this.parentNode.parentNode.cells[0].innerText
            };
            var deleteBox = new AlertBox();
            deleteBox.init(ignore, data);
            
            function ignore(_breakdownid) {
                WebService.ignoreAlarm(localStorage.maintenanceToken, _breakdownid, function(_retcode, _data) {
                    if(_retcode) {
                        deleteBox.uninit();
                        getAlarmList();
                    }else{
                        alert(_data.msg);
                    }
                })
            }
        }
    }
}

//点击确认按钮
function onConfirmBtnClick() {
    var btns = table.tBody.getElementsByClassName('fa-check-circle');
    var confirmDiv = document.getElementById('confirm-alarm');
    var shade = document.getElementById('body-shade');
    
    for(var i = 0; i < btns.length; i++) {
        btns[i].onclick = null;
        btns[i].onclick = function() {
            confirmDiv.style.display = 'block';
            shade.style.display = 'block';
            confirmDiv.style.top = (window.innerHeight - confirmDiv.offsetHeight) / 2 + 'px';
            confirmDiv.style.left = (window.innerWidth - confirmDiv.offsetWidth) / 2 + 'px';
            
            var tr = this.parentNode.parentNode;
            confirmDiv.breakdownid = tr.cells[0].innerText;
            confirmDiv.devid = tr.devid;
            confirmDiv.getElementsByClassName('dev-name')[0].getElementsByTagName('span')[0].innerText = tr.cells[1].innerText;
            confirmDiv.getElementsByClassName('dev-type')[0].getElementsByTagName('span')[0].innerText = tr.cells[2].innerText;
            confirmDiv.getElementsByClassName('alarm-level')[0].getElementsByTagName('span')[0].innerText = tr.cells[3].innerText;
            confirmDiv.getElementsByClassName('alarm-time')[0].getElementsByTagName('span')[0].innerText = tr.cells[4].innerText;
            confirmDiv.getElementsByClassName('alarm-info')[0].getElementsByTagName('span')[0].innerText = tr.cells[5].innerText;
            if(tr.cells[6].getElementsByTagName('img').length) {
                confirmDiv.getElementsByTagName('img')[0].setAttribute('src', tr.cells[6].getElementsByTagName('img')[0].getAttribute('src'));
                confirmDiv.getElementsByTagName('img')[0].style.display = 'inline-block';
                confirmDiv.getElementsByClassName('fa-picture-o')[0].style.display = 'none';
            }else{  
                confirmDiv.getElementsByTagName('img')[0].setAttribute('src', '');
                confirmDiv.getElementsByTagName('img')[0].style.display = 'none';
                confirmDiv.getElementsByClassName('fa-picture-o')[0].style.display = 'inline-block';
            }
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
            executorList.init(document.getElementById('confirm-alarm').getElementsByClassName('system-defined')[0], json);
            executorList.div.style.marginTop = '10px';
            executorList.list.style.marginTop = '25px';
            executorList.input.style.width = '118px';
        }else{
            alert(_data.msg);
        }
    })
}

//勾选生成工单、工单表单
function createSheet() {
    var confirmDiv = document.getElementById('confirm-alarm');
    var sheetInfo = confirmDiv.getElementsByClassName('sheet-info')[0];
    var checkBox = sheetInfo.getElementsByTagName('i')[0];

    executorListFunc();         //工单执行者列表
    checkBox.parentNode.onclick = function() {
        if(checkBox.classList.contains('fa-square-o')) {
            checkBox.setAttribute('class', 'fa fa-check-square fa-fw');
            sheetInfo.classList.remove('inactive');
        }else{
            checkBox.setAttribute('class', 'fa fa-square-o fa-fw');
            sheetInfo.classList.add('inactive');
        }
    }

    ///////////////////////////////////////调接口查询额外要显示的数据
}

//点击关闭确认对话框
function closeConfirmDiv() {
    var confirmDiv = document.getElementById('confirm-alarm');
    var inputs = confirmDiv.getElementsByTagName('input');
    var describe = document.getElementById('sheet-des');
    for(var j = 0; j < inputs.length; j++) {
        inputs[j].value = '';
        inputs[j].classList.remove('error');
    }
    describe.value = '';
    describe.classList.remove('error');
    document.getElementById('confirm-alarm').style.display = 'none';
    document.getElementById('body-shade').style.display = 'none';
}

//确认对话框点击确认按钮
function confirmOrder() {
    var confirmDiv = document.getElementById('confirm-alarm');
    var btn = confirmDiv.getElementsByClassName('btn')[0];
    var sheetInfo = confirmDiv.getElementsByClassName('sheet-info')[0];
    var inputs = confirmDiv.getElementsByTagName('input');
    var checkBox = sheetInfo.getElementsByTagName('i')[0];
    var describe = document.getElementById('sheet-des');
    var term = document.getElementById('term');
    var time = '';
    btn.onclick = function() {
        if(checkBox.classList.contains('fa-check-square')) {
            for(var i = 0; i < inputs.length; i++) {
                inputs[i].value ? inputs[i].classList.remove('error') : inputs[i].classList.add('error');
            }
            time = new Date(term.value).getTime() / 1000 + '';  
            if (time > (Date.parse(new Date()) / 1000)) {
                term.classList.remove('error');
            }else{
                term.classList.add('error');
                term.value = CONST_TIME_TIP1;
            } 
            describe.value ? describe.classList.remove('error') : describe.classList.add('error');
        }
        
        if(checkBox.classList.contains('fa-check-square') && !confirmDiv.getElementsByClassName('error').length) {
            //确认警情
            WebService.confirmAlarm(localStorage.maintenanceToken, confirmDiv.breakdownid, function(_retcode, _data) {
                if(_retcode) {
                    closeConfirmDiv();
                    getAlarmList();
                }else{
                    alert(_data.msg);
                }
            })

            var ids= [], devids = [];
            ids.push(confirmDiv.breakdownid);
            devids.push(confirmDiv.devid);

            //生成工单
            WebService.createOrder(localStorage.maintenanceToken, executorList.input.data.userid, time, describe.value, ids, devids, '', function(_retcode, _data) {
                if(_retcode) {

                }else{
                    alert(_data.msg);
                }
            })
        }else if(checkBox.classList.contains('fa-square-o')) {
            //确认警情
            WebService.confirmAlarm(localStorage.maintenanceToken, confirmDiv.breakdownid, function(_retcode, _data) {
                if(_retcode) {
                    closeConfirmDiv();
                    getAlarmList();
                }else{
                    alert(_data.msg);
                }
            })
        }
    }
}

//插入页码
function insertPage(_totalPage, _func, _udata) {
    page.div ? page.uninit() : 0;
    page.init(document.getElementsByClassName('data-box')[0], {totalPage: _totalPage, showNum: CONST_PAGE_SHOW_NUM}, _func, _udata);
}