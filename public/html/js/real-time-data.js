var table = new Table();                    //表格
var page = new Page();                      //页码
var devTree = new DevTree();                //设备树
var devType = new PullDownList();           //选择设备类型下拉列表控件
var devStatus = new PullDownList();         //选择设备状态下拉列表控件
var executorList = new PullDownList();      //工单执行者列表
var typeList = [];                       //设备类型

window.onload = function() {
    checkToken();               //判断token，如为空则跳转到登录页面
    addHeader();                //添加页眉
    addDevTree();               //添加设备树
    chooseDevType();            //选择设备类型下拉列表
    chooseDevStatus();          //选择设备状态下拉列表
    tableFunc();                //表格
    executorListFunc();         //工单执行者列表
    selectShowAll();            //勾选显示子区域设备
    confirmOrder();             //生成工单
    moveDiv(document.getElementById('confirm-alarm'));          //可拖动窗口
}

window.onresize = function() {
    table.tableScrollBar ? table.tableScrollBar.onContentBoxChange() : 0;
    devTree.scrollBar ? devTree.scrollBar.onContentBoxChange() : 0;
}

function addHeader() {
    var pageHeader = new PageHeader();
    pageHeader.init(document.getElementsByClassName('out-box')[0], 0);
}

function addDevTree() {
    devTree.init(document.getElementById('area-dev'), false, devTree.clickArea);
}

//勾选显示子区域设备
function selectShowAll() {
    var list = document.getElementById('area-dev');
    var showAll = document.getElementsByClassName('show-all')[0];
    var chkbox = showAll.getElementsByClassName('fa')[0];

    showAll.onclick = function() {
        var area = list.getElementsByClassName('active')[0];
        if(chkbox.classList.contains('fa-check-square')) {
            chkbox.classList.add('fa-square-o');
            chkbox.classList.remove('fa-check-square');
        }else{
            chkbox.classList.add('fa-check-square');
            chkbox.classList.remove('fa-square-o');
        }
        devTree.clickArea(area);
    }
}

//点击区域节点，表格里填入区域下的设备
devTree.clickArea = function(_node) {
    var chkbox = document.getElementsByClassName('show-all')[0].getElementsByClassName('fa')[0];
    var recursive = chkbox.classList.contains('fa-check-square') ? true : false;
    for(var i = table.tBodyBody.children.length - 1; i >= 0; i--) {
        deleteEle(table.tBodyBody.children[i]);
    }
    var areaid = _node.data.areaid;
    WebService.getDevByArea(localStorage.maintenanceToken, areaid, recursive, '', function(_retcode, _data) {
        if(_retcode) {
            var data = [];
            for(var i = 0; i < _data.length; i++) {
                data.push({name: _data[i].name, ip: _data[i].ip, type: _data[i].type, status: _data[i].status, time: _data[i].updatetime, mark: _data[i].describe.split('\n').join(' ')});
            }
            
            table.insertData(data, detailIcon);
            var trs = table.tBody.getElementsByTagName('tr');
            for(var i = 0; i < trs.length; i++) {
                if(trs[i].cells[3].innerText == 'normal') {
                    trs[i].cells[3].innerHTML = '<div class="normal-light"></div>';
                    trs[i].cells[3].title = CONST_STATUS_ABNORMAL;
                }else if(trs[i].cells[3].innerText == 'abnormal') {
                    trs[i].cells[3].innerHTML = '<div class="abnormal-light"></div>';
                    trs[i].cells[3].title = CONST_STATUS_NORMAL;
                }

                trs[i].cells[4].title = trs[i].cells[4].innerText = format(trs[i].cells[4].innerText * 1000);
                if(typeList[data[i].type]) {
                    trs[i].cells[2].title = trs[i].cells[2].innerText = typeList[data[i].type].devtypename;
                    trs[i].cells[2].typegroup = typeList[data[i].type].checkmodules;
                }else{
                    trs[i].cells[2].title = trs[i].cells[2].innerText = CONST_UNKNOWN;
                }
                trs[i].data = _data[i];
            }
            table.initEvent();
            table.setCenter([1, 2, 3, 4, 6]);
        }else{
            alert(_data.msg);
        }
    })
}

//选择设备类型下拉列表
function chooseDevType() {
    WebService.getDevType(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {
            for(var i = 0; i < _data.length; i++) {
                typeList.push(_data[i]);
            }
            var item = [{text: CONST_ALL}];
            for(var i = 0; i < typeList.length; i++) {
                item.push({text: typeList[i].devtypename, typeId: typeList[i].devtypeid});
            }
            var json = {
                divMarginLeft: '60px', label: CONST_DEV_TYPE, defaultValue: CONST_ALL, boxW: '120px', readonly: true, item: item
            }
            devType.init(document.getElementsByClassName('toolbar')[0], json, func);
        }else{
            alert(_data);
        }
    }) 

    //按设备类型筛选(后面让后台提供接口)
    function func(_data) {
        var node = devTree.treeBox.getElementsByClassName('active')[0];
        var type = _data.innerText;
        var trs = table.tBody.rows;
        if(type == CONST_ALL) {
            for(var i = 0; i < trs.length; i++) {
                trs[i].style.display = 'table-row';
            }
        }else{
            for(var i = 0; i < trs.length; i++) {
                trs[i].style.display = trs[i].cells[2].innerText == type ? 'table-row' : 'none';
            }
        }
    }
}

//选择设备状态下拉列表
function chooseDevStatus() {
    var json = {
        divMarginLeft: '60px', label: CONST_DEV_STATUS, defaultValue: CONST_ALL, boxW: '120px', readonly: true,
        item: [{text: CONST_ALL}, {text: CONST_STATUS_NORMAL}, {text: CONST_STATUS_ABNORMAL}]
    }
    devStatus.init(document.getElementsByClassName('toolbar')[0], json);
}

//表格
function tableFunc() {
    var json = {tBodyTrHeight: '36px',
        item: [{text: CONST_DEV_NAME, width: '20%'}, {text: CONST_DEV_IP, width: '15%'}, {text: CONST_DEV_TYPE, width: '10%'}, {text: CONST_DEV_STATUS, width: '10%'}, {text: CONST_CHECK_TIME, width: '20%'}, {text: CONST_MARK, width: '20%'}, {text: CONST_ALARM_HANDLE, width: '5%'}]
    }

    table.init(document.getElementsByClassName('data-box')[0], json);
}

//插入详细信息、生成工单按钮，以及点击按钮的操作
function detailIcon(_parentNode) {
    var td = document.createElement('td');
    td.innerHTML = '<i class="fa fa-chevron-circle-down" style="vertical-align: -1px; cursor: pointer; font-size: 16px;" title="' + CONST_INFO + '"></i><i class="fa fa-file-text-o" style="margin-left: 20px; font-size: 13px; cursor: pointer;" title="' + CONST_CREATE_ORDER + '"></i>';
    _parentNode.append(td);
    td.children[0].onclick = function() {
        detailInfoFunc(this, _parentNode);
    }
    td.children[1].onclick = function() {
        createOrderFunc(this);
    }
}

var breakType = [CONST_SIGNAL_LOST, CONST_LIGHT_ABNORMAL, CONST_COLOR_CAST, CONST_CLEAR_ABNORMAL, CONST_COVER, CONST_SCROLLING, CONST_NOISE, CONST_STREAK, CONST_FREEZING, CONST_SHAKE, 
                CONST_STREAM_CUT, CONST_LAST_LOGIN_TIME, CONST_LAST_LOGIN_GPS, CONST_LAST_USE_TIME, CONST_WEEK_ONLINE];


//点击详情按钮
function detailInfoFunc(_this, _parentNode) {
    if(_this.classList.contains('fa-chevron-circle-down')) {
        _this.classList.add('fa-chevron-circle-up');
        _this.classList.remove('fa-chevron-circle-down');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        var moving = false, video = false;
        var normal = '<br/><i class="normal-light"></i>';
        var abnormal = '<br/><i class="abnormal-light"></i>';

        //插入div
        function insertDiv(_width, _content) {
            var div = document.createElement('div');
            div.style.display = 'inline-block';
            div.style.textAlign = 'center';
            div.style.width = _width;
            div.style.lineHeight = '30px';
            div.style.height = '90px';
            div.style.verticalAlign = 'top';
            div.style.overflow = 'hidden';
            div.innerHTML = breakType[i] + _content;
            td.style.height = '90px';
            td.appendChild(div);
        }

        for(var i = 0; i < _this.parentNode.parentNode.cells[2].typegroup.length; i++) {
            if(_this.parentNode.parentNode.cells[2].typegroup[i] == CONST_MOVING_DEV) {
                moving = true;
            }
            if(_this.parentNode.parentNode.cells[2].typegroup[i] == CONST_VIDEO_DEV) {
                video = true;
            }
        }

        var light = _this.parentNode.parentNode.cells[3].children[0].classList.contains('normal-light') ? normal : '<br/>--';

        if(moving && video) {               //华平移动设备     
            //包含使用时间等信息时的设置  
        /*    for(var i = 0; i < 15; i++) {
                var div = document.createElement('div');
                div.style.display = 'inline-block';
                div.style.textAlign = 'center';
                div.style.width = '6%';
                div.style.lineHeight = '30px';
                div.style.height = '90px';
                div.style.verticalAlign = 'top';
                div.style.overflow = 'hidden';
                td.style.height = '90px';
                td.appendChild(div);
            }
            td.colSpan = _parentNode.cells.length;
            tr.appendChild(td);
            for(var i = 11; i < 14; i++) {
                tr.cells[0].children[i].style.width = '8.5%';
            }
            tr.cells[0].children[11].innerHTML = CONST_LAST_LOGIN_TIME + '<br/>2018-01-09<br/>12:30:17';
            tr.cells[0].children[12].innerHTML = CONST_LAST_LOGIN_GPS + '<br/>N29.552719°<br/>E106.55823°';
            tr.cells[0].children[13].innerHTML = CONST_LAST_USE_TIME + '<br/>3.5小时';
            tr.cells[0].children[14].innerHTML = CONST_WEEK_ONLINE + '<br/>19小时/3次';    
        */
            for(var i = 0; i < 11; i++) {
                insertDiv('9%', light)
            }
            td.colSpan = _parentNode.cells.length;
            tr.appendChild(td);
        }else if(video) {                   //视频设备
            for(var i = 0; i < 11; i++) {
                insertDiv('9%', light)
            }
            td.colSpan = _parentNode.cells.length;
            tr.appendChild(td);
        }else{                              //非视频设备
            for(var i = 0; i < 4; i++) {
                var div = document.createElement('div');
                div.style.display = 'inline-block';
                div.style.textAlign = 'center';
                div.style.width = '10%';
                div.style.lineHeight = '30px';
                td.appendChild(div);
            }
            td.colSpan = _parentNode.cells.length;
            tr.appendChild(td);
            if(_this.parentNode.parentNode.cells[3].children[0].classList.contains('normal-light')) {
                tr.cells[0].children[0].innerHTML = 'CPU<br/>50%';
                tr.cells[0].children[1].innerHTML = CONST_NETWORK + '<br/>100MB/S';
                tr.cells[0].children[2].innerHTML = CONST_RAM + '<br/>32%';
                tr.cells[0].children[3].innerHTML = '';
            }else{
                tr.cells[0].children[0].innerHTML = 'CPU<br/>--';
                tr.cells[0].children[1].innerHTML = CONST_NETWORK + '<br/>--';
                tr.cells[0].children[2].innerHTML = CONST_RAM + '<br/>--';
                tr.cells[0].children[3].innerHTML = '';
            }
        }

        WebService.getAlarmList(localStorage.maintenanceToken, '1', '1', '', '', '', '', _this.parentNode.parentNode.data.devid, '', function(_retcode, _data) {
            if(_retcode) {
                if(_data.count > 0) {
                    //_data.list[0].type = 4096时是平台中设备离线，暂时先不管这种状态;
                    var singalError = false;
                    for(var i = 0; i < 3; i++) {
                        if(_data.list[0].type & (0x01 << i)) {
                            singalError = true;
                            break;
                        } 
                    }
                    singalError ? tr.cells[0].children[0].getElementsByTagName('i')[0].setAttribute('class', 'abnormal-light') : 0;

                    for(var i = 3; i < 12; i++) {
                        _data.list[0].type & (0x01 << i) ? tr.cells[0].children[i - 2].getElementsByTagName('i')[0].setAttribute('class', 'abnormal-light') : 0;
                    } 

                    _data.list[0].type & 8192 ? tr.cells[0].children[10].getElementsByTagName('i')[0].setAttribute('class', 'abnormal-light') : 0;  

                    if(_data.list[0].type == 0xFFFFFFFF){
                        td.innerHTML = CONST_SERVER_ERROR;      //服务链路故障
                    }
                }
            }else{
                alert(_data.msg);
            }
        })

        tr.style.height = '70px';
        tr.style.borderTop = '1px solid #aaa';
        tr.style.background = _parentNode.style.background = 'rgba(0, 0, 0, 0.6)';
        tr.style.color = _parentNode.style.color = CONST_ACTIVE_COLOR;
        tr.onmouseover = _parentNode.onmouseover = function() {
            tr.style.background = _parentNode.style.background = 'rgba(0, 0, 0, 0.5)';
        }
        tr.onmouseout = _parentNode.onmouseout = function() {
            tr.style.background = _parentNode.style.background = 'rgba(0, 0, 0, 0.6)';
        }
        // table.tBodyBody.insertBefore(tr, _parentNode.nextSibling);
        table.tableScrollBar.onContentBoxChange();
    }else{
        _this.classList.add('fa-chevron-circle-down');
        _this.classList.remove('fa-chevron-circle-up');
        deleteEle(_parentNode.nextSibling);
        _parentNode.onmouseover = function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.color = CONST_ACTIVE_COLOR;
        }
        _parentNode.onmouseout = function() {
            this.style.background = this.bg;
            this.style.color = '#fff';
        }
        table.tableScrollBar.onContentBoxChange();
    }
}

//点击生成工单按钮
function createOrderFunc(_btn) {
    var tr = _btn.parentNode.parentNode;
    var div = document.getElementById('confirm-alarm');
    var shade = document.getElementById('body-shade');

    WebService.getAlarmList(localStorage.maintenanceToken, '1', '1', '', '', '', '', tr.data.devid, '', function(_retcode, _data) {
        if(_retcode) {
            if(_data.count > 0 && _data.list[0].status == '0') {
                div.style.display = 'block';
                shade.style.display = 'block';
                div.style.top = (window.innerHeight - div.offsetHeight) / 2 + 'px';
                div.style.left = (window.innerWidth - div.offsetWidth) / 2 + 'px';

                div.breakdownid = _data.list[0].breakdownid;
                div.devid = _data.list[0].devid;
                div.getElementsByClassName('dev-name')[0].getElementsByTagName('span')[0].innerText = _data.list[0].devname == '' ? CONST_UNKNOWN : _data.list[0].devname;
                div.getElementsByClassName('dev-type')[0].getElementsByTagName('span')[0].innerText = tr.cells[2].innerText;
                div.getElementsByClassName('alarm-level')[0].getElementsByTagName('span')[0].innerText = _data.list[0].level;
                div.getElementsByClassName('alarm-time')[0].getElementsByTagName('span')[0].innerText = format(_data.list[0].time * 1000);
                div.getElementsByClassName('alarm-info')[0].getElementsByTagName('span')[0].innerText = _data.list[0].describe;
                if(_data.list[0].img) {
                    div.getElementsByTagName('img')[0].setAttribute('src', _data.list[0].img);
                    div.getElementsByTagName('img')[0].style.display = 'inline-block';
                    div.getElementsByClassName('fa-picture-o')[0].style.display = 'none';
                }else{  
                    div.getElementsByTagName('img')[0].setAttribute('src', '');
                    div.getElementsByTagName('img')[0].style.display = 'none';
                    div.getElementsByClassName('fa-picture-o')[0].style.display = 'inline-block';
                }
            }else{
                alert(CONST_NO_ALARM);
            }
        }else{
            alert(_data.msg);
        }
    })
}

//工单执行者列表
function executorListFunc() {
    var json = {
        divMarginLeft: '20px', label: CONST_WORKER, defaultValue: '', boxW: '120px', readonly: true, 
        item: [{text: '王小明'}, {text: '张大帅'}, {text: '李小美'}, {text: '赵州桥'}]
    }
    executorList.init(document.getElementById('confirm-alarm').getElementsByClassName('system-defined')[0], json);
    executorList.div.style.marginTop = '10px';
    executorList.list.style.marginTop = '25px';
    executorList.input.style.width = '118px';
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
    var executor = executorList.input;
    var describe = document.getElementById('sheet-des');
    var term = document.getElementById('term');
    var time = '';
    btn.onclick = function() {
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

        if(!confirmDiv.getElementsByClassName('error').length) {
            //确认警情
            WebService.confirmAlarm(localStorage.maintenanceToken, confirmDiv.breakdownid, function(_retcode, _data) {
                if(_retcode) {

                }else{
                    alert(_data.msg);
                }
            })

            var ids= [], devids = [];
            ids.push(confirmDiv.breakdownid);
            devids.push(confirmDiv.devid);

            //生成工单
            WebService.createOrder(localStorage.maintenanceToken, executor.value, time, describe.value, ids, devids, '', function(_retcode, _data) {
                if(_retcode) {
                    closeConfirmDiv();
                }else{
                    alert(_data.msg);
                }
            })
        }
    }
}