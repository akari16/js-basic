var table = new Table(); //表格
var historyTable = new Table(); //维修历史表格
var page = new Page(); //页码
var devTree = new DevTree(); //设备树

window.onload = function () {
    checkToken(); //判断token，如为空则跳转到登录页面
    addHeader(); //页眉
    addDevTree(); //添加设备树
    manufacturer(); //选择厂家下拉列表
    workStage(); //选择建设工期
    tableFunc(); //表格
    insertPage(); //页码
    historyDiv(); //维修历史对话框
    divMove(); //窗口可拖动
}

window.onresize = function () {
    table.tableScrollBar ? table.tableScrollBar.onContentBoxChange() : 0;
    devTree.scrollBar ? devTree.scrollBar.onContentBoxChange() : 0;
}

function addHeader() {
    var pageHeader = new PageHeader();
    pageHeader.init(document.getElementsByClassName('out-box')[0], 3);
}

function addDevTree() {
    devTree.init(document.getElementById('area-dev'));
}

//选择厂家下拉列表
function manufacturer() {
    var json = {
        divMarginLeft: '60px',
        label: CONST_MANUFACTURER,
        defaultValue: CONST_ALL,
        boxW: '120px',
        readonly: true,
        item: [{
            text: CONST_ALL
        }, {
            text: CONST_HAIKANG
        }, {
            text: CONST_DAHUA
        }, {
            text: CONST_TIANDI
        }, {
            text: CONST_AVCON
        }]
    }
    var devType = new PullDownList();
    devType.init(document.getElementsByClassName('toolbar')[0], json);
}

//选择建设工期
function workStage() {
    var json = {
        divMarginLeft: '60px',
        label: CONST_STAGE,
        defaultValue: CONST_ALL,
        boxW: '120px',
        readonly: true,
        item: [{
            text: CONST_ALL
        }, {
            text: CONST_STAGE1
        }, {
            text: CONST_STAGE2
        }, {
            text: CONST_STAGE3
        }]
    }
    var devType = new PullDownList();
    devType.init(document.getElementsByClassName('toolbar')[0], json);
}

//表格
function tableFunc() {
    var json = {
        tBodyTrHeight: '36px',
        item: [{
            text: CONST_DEV_NAME,
            width: '25%'
        }, {
            text: CONST_DEV_IP,
            width: '20%'
        }, {
            text: CONST_DEV_TYPE,
            width: '10%'
        }, {
            text: CONST_MANUFACTURER,
            width: '10%'
        }, {
            text: CONST_BUILD_TIME,
            width: '15%'
        }, {
            text: CONST_STAGE,
            width: '10%'
        }, {
            text: CONST_SEE_DETAIL,
            width: '10%'
        }]
    }

    data = [{
            name: 'dev11',
            ip: '192.168.5.23',
            type: '0',
            manufacturer: '大华',
            time: '2017-12-31 09:16:10',
            schedule: '一期'
        },
        {
            name: 'dev09',
            ip: '192.168.5.23',
            type: '1',
            manufacturer: '海康',
            time: '2017-12-31 09:16:10',
            schedule: '二期'
        },
        {
            name: 'dev42',
            ip: '192.168.5.23',
            type: '2',
            manufacturer: '华平',
            time: '2017-12-31 09:16:10',
            schedule: '一期'
        },
        {
            name: 'dev64',
            ip: '192.168.5.23',
            type: '3',
            manufacturer: '天地伟业',
            time: '2017-12-31 09:16:10',
            schedule: '三期'
        },
        {
            name: 'dev11',
            ip: '192.168.5.23',
            type: '0',
            manufacturer: '大华',
            time: '2017-12-31 09:16:10',
            schedule: '一期'
        },
        {
            name: 'dev09',
            ip: '192.168.5.23',
            type: '1',
            manufacturer: '海康',
            time: '2017-12-31 09:16:10',
            schedule: '二期'
        },
        {
            name: 'dev42',
            ip: '192.168.5.23',
            type: '2',
            manufacturer: '华平',
            time: '2017-12-31 09:16:10',
            schedule: '一期'
        },
        {
            name: 'dev64',
            ip: '192.168.5.23',
            type: '3',
            manufacturer: '天地伟业',
            time: '2017-12-31 09:16:10',
            schedule: '三期'
        },
        {
            name: 'dev11',
            ip: '192.168.5.23',
            type: '0',
            manufacturer: '大华',
            time: '2017-12-31 09:16:10',
            schedule: '一期'
        },
        {
            name: 'dev09',
            ip: '192.168.5.23',
            type: '1',
            manufacturer: '海康',
            time: '2017-12-31 09:16:10',
            schedule: '二期'
        },
        {
            name: 'dev42',
            ip: '192.168.5.23',
            type: '2',
            manufacturer: '华平',
            time: '2017-12-31 09:16:10',
            schedule: '一期'
        },
        {
            name: 'dev64',
            ip: '192.168.5.23',
            type: '3',
            manufacturer: '天地伟业',
            time: '2017-12-31 09:16:10',
            schedule: '三期'
        },
        {
            name: 'dev11',
            ip: '192.168.5.23',
            type: '0',
            manufacturer: '大华',
            time: '2017-12-31 09:16:10',
            schedule: '一期'
        },
        {
            name: 'dev09',
            ip: '192.168.5.23',
            type: '1',
            manufacturer: '海康',
            time: '2017-12-31 09:16:10',
            schedule: '二期'
        },
        {
            name: 'dev42',
            ip: '192.168.5.23',
            type: '2',
            manufacturer: '华平',
            time: '2017-12-31 09:16:10',
            schedule: '一期'
        },
        {
            name: 'dev64',
            ip: '192.168.5.23',
            type: '3',
            manufacturer: '天地伟业',
            time: '2017-12-31 09:16:10',
            schedule: '三期'
        },
        {
            name: 'dev11',
            ip: '192.168.5.23',
            type: '0',
            manufacturer: '大华',
            time: '2017-12-31 09:16:10',
            schedule: '一期'
        },
        {
            name: 'dev09',
            ip: '192.168.5.23',
            type: '1',
            manufacturer: '海康',
            time: '2017-12-31 09:16:10',
            schedule: '二期'
        },
        {
            name: 'dev42',
            ip: '192.168.5.23',
            type: '2',
            manufacturer: '华平',
            time: '2017-12-31 09:16:10',
            schedule: '一期'
        },
        {
            name: 'dev64',
            ip: '192.168.5.23',
            type: '3',
            manufacturer: '天地伟业',
            time: '2017-12-31 09:16:10',
            schedule: '三期'
        }
    ]

    table.init(document.getElementsByClassName('data-box')[0], json);
    table.insertData(data, detailIcon);
    var trs = table.tBody.getElementsByTagName('tr');
    for (var i = 0; i < trs.length; i++) {
        trs[i].cells[2].title = trs[i].cells[2].innerText = devTypeExchange('0', data[i].type);
    }
    table.uninitEvent();
    table.initEvent();
    table.setCenter([1, 2, 3, 4, 5, 6]);
}

//插入详细信息按钮，以及点击按钮的操作
function detailIcon(_parentNode) {
    var td = document.createElement('td');
    td.innerHTML = '<i class="fa fa-wrench" title="' + CONST_HISTORY + '" style="cursor: pointer;"></i><i class="fa fa-info-circle" title="' + CONST_DETAIL_INFO + '" style="cursor: pointer; margin-left: 30px"></i>';
    _parentNode.append(td);
    //查看维修历史
    td.children[1].onclick = function(e){
        var div = document.getElementById('detail-div');
        div.style.display = 'block';
        document.getElementById('body-shade').style.display = 'block';
        div.style.left = (window.innerWidth - div.offsetWidth) / 2 + 'px';
        div.style.top = (window.innerHeight - div.offsetHeight) / 2 + 'px';
        


    }
    td.children[0].onclick = function (e) {
        var div = document.getElementById('history-div');
        div.style.display = 'block';
        document.getElementById('body-shade').style.display = 'block';
        // div.style.left = (window.innerWidth - div.offsetWidth) / 2 + 'px';
        // div.style.top = (window.innerHeight - div.offsetHeight) / 2 + 'px';
        // var data = [{
        //         des: '绿屏',
        //         breakdwonDate: '2017-12-30 15:30:15',
        //         repairDate: '2018-01-01 10:23:21',
        //         person: '王小明',
        //         mark: '输入线问题，已解决'
        //     },
        //     {
        //         des: '花屏',
        //         breakdwonDate: '2017-05-16 14:10:09',
        //         repairDate: '2017-05-20 09:34:07',
        //         person: '张全蛋',
        //         mark: '设备主板问题，已更换'
        //     },
        //     {
        //         des: '绿屏',
        //         breakdwonDate: '2017-12-30 15:30:15',
        //         repairDate: '2018-01-01 10:23:21',
        //         person: '王小明',
        //         mark: '输入线问题，已解决'
        //     },
        //     {
        //         des: '花屏',
        //         breakdwonDate: '2017-05-16 14:10:09',
        //         repairDate: '2017-05-20 09:34:07',
        //         person: '张全蛋',
        //         mark: '设备主板问题，已更换'
        //     }
        // ]
        // historyTable.insertData(data);
        // historyTable.initEvent();
        // historyTable.tBody.style.top = 0;
        // historyTable.setCenter([1, 2, 3]);
    }
}

//维修历史框
function historyDiv() {
    var div = document.getElementById('history-div').getElementsByClassName('box')[0];
    var json = {
        tBodyTrHeight: '30px',
        item: [{
            text: CONST_TROUBLE_DES,
            width: '25%'
        }, {
            text: CONST_BREAKDOWN_DATE,
            width: '15%'
        }, {
            text: CONST_REPAIR_DATE,
            width: '15%'
        }, {
            text: CONST_WORKER,
            width: '10%'
        }, {
            text: CONST_MARK,
            width: '35%'
        }]
    }

    // historyTable.init(div, json);
    // historyTable.tHeadTr.style.height = '30px';
    // historyTable.tBodyBox.style.top = '30px';
    // historyTable.tBodyBox.style.bottom = 0;
}

//关闭维修历史对话框
function closeRecordDiv() {
    document.getElementById('history-div').style.display = 'none';
    document.getElementById('body-shade').style.display = 'none';
    historyTable.uninitEvent();
    historyTable.tBodyBody.innerHTML = '';
    historyTable.tableScrollBar.uninit();
}

function closeDetailDiv(){
    document.getElementById('detail-div').style.display = 'none';
    document.getElementById('body-shade').style.display = 'none';
    historyTable.uninitEvent();
    historyTable.tBodyBody.innerHTML = '';
    historyTable.tableScrollBar.uninit();
}

//插入页码
function insertPage() {
    var json = {
        totalPage: 10,
        showNum: 5
    };
    page.init(document.getElementsByClassName('data-box')[0], json);
}

//可拖动窗口
function divMove() {
    moveDiv(document.getElementById('history-div'));
    // moveDiv(document.getElementById('dev-info'));
}