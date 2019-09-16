var todoSheetPageFlag = true;

function toDoSheet() {
    toDoTableFunc();                            //表格
    detailInfoDiv();                            //查看详情框
}

//获取全部待办列表
function getAllToDoList() {
    var json = {
        page: '1',
        pagesize: CONST_PAGE_SIZE,
        status: ['1', '3'],
        allocator: '',
        executor: ''
    }
    getToDoList(json);
}

//查询待办列表
function getToDoList(_json) {
    for(var i = toDoSheetTable.tBodyBody.children.length - 1; i >= 0; i--) {
        deleteEle(toDoSheetTable.tBodyBody.children[i]);
    }
    WebService.getOrderList(localStorage.maintenanceToken, _json.page, _json.pagesize, _json.status, _json.allocator, _json.executor, function(_recode, _data) {
        if(_recode) {
            if(todoSheetPageFlag) {
                todoSheetPage(Math.ceil(_data.count / CONST_PAGE_SIZE), getToDoList, _json);
                todoSheetPageFlag = false;
            }
            
            var data = [];
            for(var i = 0; i < _data.list.length; i++) {
                data.push({orderid: _data.list[i].orderid, name: _data.list[i].devids, status: _data.list[i].status, alloctor: _data.list[i].alloctorname, executor: _data.list[i].executorname, createTime: _data.list[i].time, term: _data.list[i].term});
            }
            toDoSheetTable.insertData(data, handleIcon);
            var trs = toDoSheetTable.tBody.getElementsByTagName('tr');
            for(var i = 0; i < trs.length; i++) {
                var names = '';
                for(var j = 0; j < _data.list[i].devids.length; j++) {
                    var name = getDevInfo(_data.list[i].devids[j]) ? getDevInfo(_data.list[i].devids[j]) : _data.list[i].devids[j];     //如果设备已经被删除了则直接显示设备名称
                    j == 0 ? names += name : names += ', ' + name;
                }
                trs[i].data = _data.list[i];
                trs[i].cells[1].title = trs[i].cells[1].innerText = names;
                trs[i].children[2].title = trs[i].children[2].innerText = orderTypeExchange('0', data[i].status);
                trs[i].cells[5].title = trs[i].cells[5].innerText = format(trs[i].cells[5].innerText * 1000);
                trs[i].cells[6].title = trs[i].cells[6].innerText = format(trs[i].cells[6].innerText * 1000);
            } 
            
            toDoSheetTable.initEvent();
            toDoSheetTable.setCenter([0, 2, 3, 4, 5, 6, 7]);
            toDoSheetTable.tableScrollBar.onContentBoxChange();
        }else{
            alert(_data.msg);
        }
    })
}

//表格
function toDoTableFunc() {
    var json = {tBodyTrHeight: '36px', 
        item: [{text: CONST_SHEET_NUM, width: '20%'}, {text: CONST_DEV_NAME, width: '26%'}, {text: CONST_SHEET_STATUS, width: '8%'}, {text: CONST_SUBMIT_PERSON, width: '8%'}, {text: CONST_WORKER, width: '8%'}, {text: CONST_CREATE_TIME, width: '12%'}, {text: CONST_DEADLINE, width: '12%'}, {text: CONST_SHEET_HANDLE, width: '6%'}]
    }
    toDoSheetTable.init(document.getElementById('to-do-sheet').getElementsByClassName('data-box')[0], json);
}

//插入页码
function todoSheetPage(_totalPage, _func, _udata) {
    toDoSheetPage.div ? toDoSheetPage.uninit() : 0;
    toDoSheetPage.init(document.getElementById('to-do-sheet').getElementsByClassName('data-box')[0], {totalPage: _totalPage, showNum: CONST_PAGE_SHOW_NUM}, _func, _udata);
}