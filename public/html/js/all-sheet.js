var allSheetPageFlag = true;
function maintenanceSheet() {
    maintenanceTableFunc();                            //表格
}

//获取全部列表
function getAllOrderList() {
    var json = {
        page: '1',
        pagesize: CONST_PAGE_SIZE,
        status: [],
        allocator: '',
        executor: ''
    }
    getAllOrder(json);
}

function getAllOrder(_json) {
    for(var i = maintenanceTable.tBodyBody.children.length - 1; i >= 0; i--) {
        deleteEle(maintenanceTable.tBodyBody.children[i]);
    }

    WebService.getOrderList(localStorage.maintenanceToken, _json.page, _json.pagesize, _json.status, _json.allocator, _json.executor, function(_recode, _data) {
        if(_recode) {
            if(allSheetPageFlag) {
                allSheetPage(Math.ceil(_data.count / CONST_PAGE_SIZE), getAllOrder, _json);
                allSheetPageFlag = false;
            }
            
            var data = [];
            for(var i = 0; i < _data.list.length; i++) {
                data.push({orderid: _data.list[i].orderid, name: _data.list[i].devids, status: _data.list[i].status, alloctor: _data.list[i].alloctorname, executor: _data.list[i].executorname, createTime: _data.list[i].time, term: _data.list[i].term, finish: _data.list[i].finish});
            }
            maintenanceTable.insertData(data, handleIcon);
            var trs = maintenanceTable.tBody.getElementsByTagName('tr');
            for(var i = 0; i < trs.length; i++) {
                var names = '';
                for(var j = 0; j < _data.list[i].devids.length; j++) {
                    var name = getDevInfo(_data.list[i].devids[j]) ? getDevInfo(_data.list[i].devids[j]) : _data.list[i].devids[j];     //如果设备已经被删除了则直接显示设备名称
                    j == 0 ? names += name : names += ', ' + name;
                }
                trs[i].data = _data.list[i];
                trs[i].cells[1].title = trs[i].cells[1].innerText = names;
                trs[i].cells[2].title = trs[i].cells[2].innerText = orderTypeExchange('0', data[i].status);
                trs[i].cells[5].title = trs[i].cells[5].innerText = format(trs[i].cells[5].innerText * 1000);
                trs[i].cells[6].title = trs[i].cells[6].innerText = format(trs[i].cells[6].innerText * 1000);
                trs[i].cells[7].title = trs[i].cells[7].innerText = trs[i].cells[7].innerText == '0' ? '--' : format(trs[i].cells[7].innerText * 1000);
            } 
            
            maintenanceTable.initEvent();
            maintenanceTable.setCenter([0, 2, 3, 4, 5, 6, 7, 8]);
            maintenanceTable.tableScrollBar.onContentBoxChange();
        }else{
            alert(_data.msg);
        }
    })
}

//表格
function maintenanceTableFunc() {
    var json = {tBodyTrHeight: '36px', 
        item: [{text: CONST_SHEET_NUM, width: '16%'}, {text: CONST_DEV_NAME, width: '22%'}, {text: CONST_SHEET_STATUS, width: '8%'}, {text: CONST_SUBMIT_PERSON, width: '6%'}, {text: CONST_WORKER, width: '6%'}, {text: CONST_CREATE_TIME, width: '12%'}, {text: CONST_DEADLINE, width: '12%'}, {text: CONST_FINISH_TIME, width: '12%'}, {text: CONST_SHEET_HANDLE, width: '6%'}]
    }

    maintenanceTable.init(document.getElementById('maintenance').getElementsByClassName('data-box')[0], json);
}

//插入页码
function allSheetPage(_totalPage, _func, _udata) {
    maintenancePage.div ? maintenancePage.uninit() : 0;
    maintenancePage.init(document.getElementById('maintenance').getElementsByClassName('data-box')[0], {totalPage: _totalPage, showNum: CONST_PAGE_SHOW_NUM}, _func, _udata);
}