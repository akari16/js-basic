var mcuListScroll = new ScrollBar();               //MCU列表滚动条
var mcuInfoScroll = new ScrollBar();                //编辑区域滚动条

//MCU配置功能
function mcuFunc() {
    mcuLayout();
    mcuScroll();
    onAddMcuBtnClick();             //点击添加按钮
    addModifyMcu();                 //添加、修改MCU
    mcuRmenuFunc();                 //右键菜单功能
}

function mcuLayout() {
    var editMcu = document.getElementById('edit-mcu');
    var div = editMcu.getElementsByClassName('content-box')[0];
    div.style.left = (editMcu.offsetWidth - div.offsetWidth) / 2 + 'px';
}

//mcu滚动条
function mcuScroll() {
    mcuListScroll.init(3, document.getElementById('mcu-list').getElementsByClassName('ul-box')[0], document.getElementById('mcu-list').getElementsByTagName('ul')[0]);
    mcuInfoScroll.init(2, document.getElementById('edit-mcu'), document.getElementById('edit-mcu').getElementsByClassName('content-box')[0])
}

//获取MCU列表
function getMcuList() {
    var list = document.getElementById('mcu-list');
    var ul = list.getElementsByTagName('ul')[0];
    for(var i = ul.children.length - 1; i >= 0; i--) {
        deleteEle(ul.children[i]);
    }
    WebService.getMcuList(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {
            for(var i = 0; i < _data.length; i++) {
                var li = document.createElement('li');
                li.innerHTML = '<i class="fa fa-server"></i> ' + _data[i].name;
                li.data = _data[i];
                ul.appendChild(li);
                li.onclick = function() {
                    clickMcuName(this);
                }
                mcuRmenu(li);
            }
        }else{
            alert(_data.msg);
        }
    })
}

//点击mcu名称显示mcu信息
function clickMcuName(_node) {
    var list = document.getElementById('mcu-list');
    var div = document.getElementById('edit-mcu');
    var mcuid = document.getElementById('mcu-id');
    var name = document.getElementById('mcu-name');
    var uri = document.getElementById('mcu-uri');
    var title = div.getElementsByClassName('title')[0];
    var shade = div.getElementsByClassName('shade')[0];
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];

    list.getElementsByClassName('active').length ? list.getElementsByClassName('active')[0].classList.remove('active') : 0;
    _node.classList.add('active');
    title.innerText = CONST_MCU_INFO;
    shade.style.display = 'block';
    addBtn.style.display = clearBtn.style.display = 'none';
    mcuid.value = _node.data.mcuid;
    name.value = _node.data.name;
    uri.value = _node.data.uri;
}

//右键菜单
function mcuRmenu(_node) {
    var menu = document.getElementById('mcu-menu');
    _node.oncontextmenu = function(e) { 
        menu.style.display = 'block';
        menu.style.top = e.pageY + 'px';
        menu.style.left = e.pageX + 'px';
        clickMcuName(_node);

        document.onclick = function() {
            menu.style.display = 'none';
            document.onclick = null;
        }
    }
}

//右键菜单功能
function mcuRmenuFunc() {
    var menu = document.getElementById('mcu-menu');
    var div = document.getElementById('edit-mcu');
    var title = div.getElementsByClassName('title')[0];
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var shade = div.getElementsByClassName('shade')[0];
    var list = document.getElementById('mcu-list');
    //修改
    menu.children[0].onclick = function() {
        title.innerText = CONST_MODIFY_MCU;
        shade.style.display = 'none';
        addBtn.innerText = CONST_MODIFY_BTN;
        shade.style.display = 'none';
        addBtn.style.display = clearBtn.style.display = 'inline-block';
        document.getElementById('mcu-id').readOnly = true;
    }

    //删除
    menu.children[1].onclick = function() {
        deleteMcu(list.getElementsByClassName('active')[0]);
    }
}


//点击添加按钮
function onAddMcuBtnClick() {
    var btn = document.getElementById('mcu-list').getElementsByClassName('fa-plus-circle')[0];
    var div = document.getElementById('edit-mcu');
    var title = div.getElementsByClassName('title')[0];
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var inputs = div.getElementsByTagName('input');
    var shade = div.getElementsByClassName('shade')[0];

    btn.onclick = function() {
        title.innerText = CONST_ADD_MCU;
        addBtn.innerText = CONST_ADD_BTN;
        shade.style.display = 'none';
        addBtn.style.display = clearBtn.style.display = 'inline-block';
        document.getElementById('mcu-id').readOnly = false;
        for(var i = 0; i < inputs.length; i++) {
            inputs[i].value = [];
        }
    }
}

//添加、修改MCU
function addModifyMcu() {
    var div = document.getElementById('edit-mcu');
    var mcuid = document.getElementById('mcu-id');
    var name = document.getElementById('mcu-name');
    var uri = document.getElementById('mcu-uri');
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var title = div.getElementsByClassName('title')[0];
    var list = document.getElementById('mcu-list');

    addBtn.onclick = function() {
        mcuid.value ? mcuid.classList.remove('error') : mcuid.classList.add('error');
        name.value ? name.classList.remove('error') : name.classList.add('error');
        uri.value ? uri.classList.remove('error') : uri.classList.add('error');
        if(!div.getElementsByClassName('error').length) {
            if(title.innerText == CONST_ADD_MCU) {          //添加
                WebService.addMcu(localStorage.maintenanceToken, mcuid.value, name.value, uri.value, function(_retcode, _data) {
                    if(_retcode) {
                        getMcuList();
                        editMcuRefresh();
                    }else{
                        alert(_data.msg);
                    }
                })
            }else if(title.innerText == CONST_MODIFY_MCU) {
                WebService.modifyMcu(localStorage.maintenanceToken, list.getElementsByClassName('active')[0].data.id, mcuid.value, name.value, uri.value, function(_retcode, _data) {
                    if(_retcode) {
                        getMcuList();
                        editMcuRefresh();
                    }else{
                        alert(_data.msg);
                    }
                })
            }
        }
    }

    clearBtn.onclick = function() {
        editMcuRefresh();
    }
}

function editMcuRefresh() {
    var div = document.getElementById('edit-mcu');
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var title = div.getElementsByClassName('title')[0];
    var inputs = div.getElementsByTagName('input');
    var errors = div.getElementsByClassName('error');
    var shade = div.getElementsByClassName('shade')[0];

    title.innerText = CONST_MCU_INFO;
    shade.style.display = 'block';
    addBtn.style.display = clearBtn.style.display = 'none';
    for(var i = 0; i < inputs.length; i++) {
        inputs[i].value = [];
    }
    for(var i = errors.length - 1; i >= 0; i--) {
        errors[i].classList.remove('error');
    }
}

//删除mcu
function deleteMcu(_node) {
    var deleteBox = new AlertBox();
    var data = {
        title: CONST_DELETE_MCU,
        info: CONST_DELETE_MCU_INFO,
        btn: CONST_DELETE_BTN,
        closebtn: 'fa fa-close',
        parentNode: document.body,
        data: _node.data.id
    };
    deleteBox.init(deleteFunc, data);
    function deleteFunc(_data) {
        WebService.deleteMcu(localStorage.maintenanceToken, _data, function(_retcode, _data) {
            if(_retcode) {
                editMcuRefresh()
                getMcuList();
                deleteBox.uninit();
            }else{
                alert(_data);
            }
        })
    }
}