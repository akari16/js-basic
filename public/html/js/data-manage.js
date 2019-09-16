var ulScrollBar = new ScrollBar(); //默认值ul滚动条
var dataManageTable = new Table(); //数据字典表格

//数据字典
function dataManage() {
    checkToken(); //判断token，如为空则跳转到登录页面
    tableFunc(); //表格
    chooseRule(); //选择规则
    defaultValueFunc(); //默认值添加、删除
    onAddEleBtnClick(); //点击添加元素按钮
    onModifyBtnClick(); //点击修改元素按钮
    onTabClick(); //切换选项卡
}

//表格
function tableFunc() {
    var json = {
        tBodyTrHeight: '36px',
        item: [{
            text: CONST_ELE_NAME,
            width: '25%'
        }, {
            text: CONST_ELE_VALUE,
            width: '25%'
        }, {
            text: CONST_ELE_RULE,
            width: '25%'
        }, {
            text: CONST_ELE_HANDLE,
            width: '25%'
        }]
    }

    dataManageTable.init(document.getElementById('sheet-data-table').getElementsByClassName('data-box')[0], json);
    var data = [{
            name: '维修人员',
            value: 'person',
            rule: 'default'
        },
        {
            name: '限定时间',
            value: 'deadline',
            rule: 'regexp'
        }
    ]
    dataManageTable.insertData(data, insertIcon);
    var trs = dataManageTable.tBody.getElementsByTagName('tr');
    for (var i = 0; i < trs.length; i++) {
        switch (data[i].rule) {
            case 'default':
                trs[i].children[2].innerText = CONST_DATA_DEFAULT;
                break;
            case 'regexp':
                trs[i].children[2].innerText = CONST_DATA_REGEXP;
                break;
            case 'number':
                trs[i].children[2].innerText = CONST_DATA_NUMBER;
                break;
            case 'none':
                trs[i].children[2].innerText = CONST_DATA_NONE;
                break;
        }
    }
    dataManageTable.uninitEvent();
    dataManageTable.initEvent();
    dataManageTable.setCenter([3]);
}

function insertIcon(_parentNode) {
    var td = document.createElement('td');
    td.innerHTML = '<i class="fa fa-info-circle" style="cursor: pointer;"></i><i class="fa fa-pencil" style="cursor: pointer; margin-left: 30px" title="' + CONST_MODIFY_ELE + '"></i>' +
        '<i class="fa fa-trash" style="cursor: pointer; margin-left: 30px" title="' + CONST_DELETE + '"></i>';
    _parentNode.append(td);
    //修改
    td.children[1].onclick = function () {
        
    }

    //删除
    td.children[2].onclick = function () {
        ;
        var data = {
            title: CONST_DELETE_ELE_TITLE,
            info: CONST_DELETE_ELE_INFO,
            btn: CONST_DELETE_BTN,
            closebtn: 'fa fa-close',
            parentNode: document.body
        };
        var deleteBox = new AlertBox();
        deleteBox.init('', data);
    }
}

//选择规则
function chooseRule() {
    var div = document.getElementById('add-ele').getElementsByClassName('rule')[0];
    var p = div.getElementsByTagName('p');
    var regexp = document.getElementById('regexp');
    var inputValue = document.getElementById('input-value');
    var btn = div.getElementsByClassName('btn')[0];
    var ulBox = document.getElementById('add-ele').getElementsByClassName('ul-box')[0];
    ulScrollBar.init('2', ulBox, ulBox.children[0]);

    for (var i = 0; i < p.length; i++) {
        p[i].index = i;
        p[i].onclick = function () {
            div.getElementsByClassName('fa-dot-circle-o')[0].classList.add('fa-circle-o');
            div.getElementsByClassName('fa-dot-circle-o')[0].classList.remove('fa-dot-circle-o');
            div.getElementsByClassName('active')[0].classList.remove('active');
            this.children[0].classList.add('fa-dot-circle-o');
            this.children[0].classList.remove('fa-circle-o');
            this.classList.add('active');
            if (this.index == 2) { //正则
                regexp.style.display = 'inline-block';
                inputValue.style.display = btn.style.display = ulBox.style.display = 'none';
                div.parentNode.style.height = '330px';
            } else if (this.index == 3) { //默认值
                inputValue.style.display = btn.style.display = 'inline-block';
                ulBox.style.display = 'block';
                regexp.style.display = 'none';
                div.parentNode.style.height = '450px';
                ulScrollBar.onContentBoxChange();
            } else {
                inputValue.style.display = btn.style.display = regexp.style.display = ulBox.style.display = 'none';
                div.parentNode.style.height = '330px';
            }
        }
    }
}

//默认值添加、删除
function defaultValueFunc() {
    var div = document.getElementById('add-ele').getElementsByClassName('rule')[0];
    var btn = div.getElementsByClassName('btn')[0];
    var input = document.getElementById('input-value');
    var ul = document.getElementById('value-list');
    var closeBtns = ul.getElementsByTagName('i');

    function add() {
        if (input.value) {
            var li = document.createElement('li');
            li.innerHTML = input.value + '<i class="fa fa-times"></i>';
            ul.appendChild(li);
            input.value = '';
            ulScrollBar.onContentBoxChange();
            deleteLi();
        }
    }

    btn.onclick = function () {
        add();
    }

    input.onkeydown = function (e) {
        if (e.keyCode == 13) {
            add();
        }
    }

    function deleteLi() {
        for (var i = 0; i < closeBtns.length; i++) {
            closeBtns[i].onclick = null;
            closeBtns[i].onclick = function () {
                deleteEle(this.parentNode);
                ulScrollBar.onContentBoxChange();
            }
        }
    }
    deleteLi();
}

//关闭添加元素窗口
function closeAddEleDiv() {
    document.getElementById('add-ele').style.display = 'none';
    document.getElementById('body-shade').style.display = 'none';
}

//点击添加元素按钮
function onAddEleBtnClick() {
    var div = document.getElementById('add-ele');
    document.getElementById('add-ele-btn').onclick = function () {
        div.style.display = 'block';
        document.getElementById('body-shade').style.display = 'block';
        div.getElementsByClassName('title')[0].children[0].innerText = CONST_ADD_ELEMENT;
        div.getElementsByClassName('add-btn')[0].innerText = CONST_ADD_BTN;
        div.style.left = (window.innerWidth - div.offsetWidth) / 2 + 'px';
        div.style.top = (window.innerHeight - div.offsetHeight) / 2 + 'px';
    }
}

//点击修改按钮
function onModifyBtnClick() {
    var btns = document.getElementById('data-manage').getElementsByClassName('fa-pencil');
    var div = document.getElementById('add-ele');
    for (var i = 0; i < btns.length; i++) {
        btns[i].onclick = null;
        btns[i].onclick = function () {
            div.style.display = 'block';
            div.style.left = (window.innerWidth - div.offsetWidth) / 2 + 'px';
            div.style.top = (window.innerHeight - div.offsetHeight) / 2 + 'px';
            document.getElementById('body-shade').style.display = 'block';
            div.getElementsByClassName('title')[0].children[0].innerText = CONST_MODIFY_ELEMENT;
            div.getElementsByClassName('add-btn')[0].innerText = CONST_MODIFY_BTN;
        }
    }
}

//切换选项卡
function onTabClick() {
    var tab = document.getElementById('data-manage').getElementsByClassName('tab')[0];
    //点击“工单字典”
    tab.children[1].onclick = function () {
        if (!this.classList.contains('active')) {
            tab.children[2].classList.remove('active');
            this.classList.add('active');
            resetData();
        }
    }

    tab.children[2].onclick = function () {
        if (!this.classList.contains('active')) {
            tab.children[1].classList.remove('active');
            this.classList.add('active');
            resetData();
        }
    }

    function resetData() {
        dataManageTable.uninit();
        tableFunc();
    }
}