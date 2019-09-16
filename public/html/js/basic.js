/**
 * author  zcy
 */

document.oncontextmenu = function () {
    return false;
}

//获取元素属性值
function getStyle(_obj, _attr) {
    if (_obj.currentStyle) {
        return _obj.currentStyle[_attr];
    } else {
        return getComputedStyle(_obj, false)[_attr];
    }
}

/*
 * _func1为动画结束后需要执行的函数
 * _func0为动画执行期间需要执行的函数
 */
function animate(_obj, _json, _speed, _func0, _func1) { //_json格式为{'width' : 200, 'height' : 100}
    var mSpeed = 8;
    if (_speed == 'slow') {
        mSpeed = 10;
    } else if (_speed = 'fast') {
        mSpeed = 6;
    }

    clearInterval(_obj.timer);
    _obj.timer = setInterval(function () {
        var stop = true; //判断同时运动标志
        for (var attr in _json) {
            var cur = 0;
            if (attr == 'opacity') {
                cur = Math.round(parseFloat(getStyle(_obj, attr)) * 100);
            } else {
                cur = parseInt(getStyle(_obj, attr));
            }

            var speed = (_json[attr] - cur) / mSpeed;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

            if (cur != _json[attr]) {
                stop = false;
            }

            if (attr == 'opacity') {
                cur += speed;
                _obj.style.filter = 'alpha(opacity:' + cur + ')';
                _obj.style.opacity = cur / 100;
            } else {
                _obj.style[attr] = cur + speed + 'px';
            }
        }
        _func0 ? _func0() : 0;
        //检测停止
        if (stop) {
            clearInterval(_obj.timer);
            _func1 ? _func1() : 0;
        }
    }, 20);
}

//判断token，如为空则跳转到登录页面
function checkToken() {
    // if (!localStorage.maintenanceToken) {
    //     // self.location = 'login.html';
    // }
}

//页眉
function PageHeader() {}

PageHeader.prototype.init = function (_parentNode, _active) {
    this.parent = _parentNode;
    this.header = document.createElement('header');
    this.title = document.createElement('p');
    this.title.innerText = CONST_TITLE;
    this.title.setAttribute('class', 'title');
    // this.title.style.cursor = 'pointer';
    this.menu = document.createElement('ul');
    this.menu.innerHTML = '<li><a href="../page/real-time-data.html">' + CONST_REAL_TIME_DATA + '</a></li><li><a href="../page/alarm-manage.html">' + CONST_ALARM_MANAGE + '</a></li>' +
        '<li><a href="../page/sheet-manage.html">' + CONST_SHEET_MANAGE + '</a></li><li><a href="../page/dev-file.html">' + CONST_DEV_FILE + '</a></li>' +
        '<li><a href="../page/operation-data.html">' + CONST_OPERATION_DATA + '</a></li><li><a href="../page/check-log.html">' + CONST_CHECK_LOG + '</a></li>' +
        '<li><a href="../page/system-setting.html">' + CONST_SYSTEM_SETTING + '</a></li>';
    this.user = document.createElement('p');
    this.user.innerHTML = '<a href="home.html"><i class="fa fa-bar-chart"></i></a><i class="fa fa-user-circle" style="margin-left: 20px"></i> <span>' + localStorage.maintenanceUser + '</span><a href="login.html" style="margin-left: 20px;"><i class="fa fa-sign-out"></i> 注销</a>';
    this.user.setAttribute('class', 'user');
    this.header.appendChild(this.title);
    this.header.appendChild(this.menu);
    this.header.appendChild(this.user);
    this.parent.appendChild(this.header);
    this.menu.children[_active].setAttribute('class', 'active');

    // this.initEvent();
}

PageHeader.prototype.initEvent = function () {
    this.title.onclick = function () {
        self.location = 'home.html';
    }
    this.title.onmouseover = function () {
        this.style.color = CONST_ACTIVE_COLOR;
        this.onmouseout = function () {
            this.style.color = '#fff';
        }
    }
}

//清除事件绑定，删除元素
function deleteEle(_ele) {
    if (_ele) {
        for (var i = _ele.children.length - 1; i >= 0; i--) {
            deleteEle(_ele.children[i]);
        }
    }
    _ele.onclick = null;
    _ele.oncontextmenu = null;
    _ele.ondblclick = null;
    _ele.onmousedown = null;
    _ele.onmousemove = null;
    _ele.onmouseover = null;
    _ele.onmouseup = null;
    _ele.onmouseout = null;

    _ele.parentNode.removeChild(_ele);
}

//下拉列表控件
function PullDownList() {}

PullDownList.prototype.init = function (_parentNode, _json, _func) {
    this.parent = _parentNode;
    this.json = _json;
    this.func = _func;
    this.div = document.createElement('div');
    this.div.style.position = 'relative';
    this.div.style.height = 0;
    this.div.style.marginLeft = this.json.divMarginLeft;
    this.div.setAttribute('class', 'pull-down-list');

    this.label = document.createElement('label');
    this.label.innerText = this.json.label;

    this.box = document.createElement('div');
    this.box.style.position = 'relative';
    this.box.style.width = this.json.boxW;
    this.box.style.display = 'inline-block';
    this.box.style.marginLeft = '10px';

    this.input = document.createElement('input');
    this.input.value = this.json.defaultValue;
    this.input.style.width = '100%';
    this.input.style.textIndent = '10px';
    this.input.readOnly = this.json.readonly ? this.json.readonly : false;
    this.input.style.padding = 0;

    this.arrow = document.createElement('i');
    this.arrow.setAttribute('class', 'fa fa-caret-down');
    this.arrow.style.marginLeft = '-14px';

    this.list = document.createElement('div');
    this.list.setAttribute('class', 'ul-box');
    this.list.style.position = 'absolute';
    this.list.style.borderWidth = '1px';
    this.list.style.borderStyle = 'solid';
    this.list.style.borderColor = 'rgb(83, 187, 235)';
    this.list.style.width = parseInt(this.json.boxW) - 2 + 'px';
    this.list.style.top = '0';
    this.list.style.background = 'rgba(0, 0, 0, 0.9)';
    this.list.style.display = 'none';
    this.list.style.overflow = 'hidden';
    this.list.style.zIndex = this.json.ulZindex ? this.json.ulZindex : '9';

    this.ul = document.createElement('ul');
    for (var i = 0; i < this.json.item.length; i++) {
        var li = document.createElement('li');
        li.innerText = this.json.item[i].text;
        li.style.height = li.style.lineHeight = this.json.liHeight ? this.json.liHeight : '30px';
        li.style.textIndent = '10px';
        li.style.cursor = 'default';
        li.data = this.json.item[i];
        this.ul.appendChild(li);
    }
    this.ul.style.position = 'absolute';
    this.ul.style.top = '0';
    this.ul.style.width = '100%';

    this.div.appendChild(this.label);
    this.box.appendChild(this.input);
    this.box.appendChild(this.arrow);
    this.box.appendChild(this.list);
    this.list.appendChild(this.ul);
    this.div.appendChild(this.box);
    this.parent.appendChild(this.div);
    this.list.style.marginTop = this.input.offsetHeight + this.input.offsetTop - parseInt(getStyle(this.input, 'borderBottomWidth')) + 'px';
    if (this.json.maxLiNum && (this.json.item.length > this.json.maxLiNum)) {
        this.list.style.height = this.json.maxLiNum * parseInt(getStyle(this.ul.children[0], 'height')) + 'px';
        this.listScroll = new ScrollBar();
        this.listScroll.init(3, this.list, this.ul);
    } else {
        this.list.style.height = this.json.item.length ? this.json.item.length * parseInt(getStyle(this.ul.children[0], 'height')) + 'px' : 0;
    }
    this.initEvent();
}

PullDownList.prototype.uninit = function () {
    deleteEle(this.div);
    this.div = null;
}

PullDownList.prototype.initEvent = function () {
    this.clickInput();
    this.clickLi();
}

PullDownList.prototype.uninitEvent = function () {
    this.input.onclick = null;
    for (var i = 0; i < this.json.item.length; i++) {
        this.ul.children[i].onmouseover = null;
        this.ul.children[i].onclick = null;
    }
}

PullDownList.prototype.clickInput = function () {
    var that = this;
    var pullDownLists = document.getElementsByClassName('pull-down-list');
    this.arrow.onclick = this.input.onclick = function (e) {
        if (!that.json.disabled) {
            for (var i = 0; i < pullDownLists.length; i++) {
                pullDownLists[i].getElementsByClassName('ul-box')[0].style.display = 'none';
                pullDownLists[i].getElementsByTagName('i')[0].setAttribute('class', 'fa fa-caret-down');
            }

            that.list.style.display = 'block';
            that.listScroll ? (that.listScroll.onContentBoxChange()) | (that.listScroll.backToOrigin()) : 0;
            that.arrow.setAttribute('class', 'fa fa-caret-up');
            document.onclick = function () {
                that.list.style.display = 'none';
                that.arrow.setAttribute('class', 'fa fa-caret-down');
                this.onclick = null;
            }
        }
        e.stopPropagation();
    }
}

PullDownList.prototype.clickLi = function () {
    var that = this;
    var oldColor = this.ul.children.length ? getStyle(this.ul.children[0], 'color') : '#fff';
    for (var i = 0; i < this.json.item.length; i++) {
        this.ul.children[i].onmouseover = function () {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.color = 'rgb(83, 187, 235)';
            this.onmouseout = function () {
                this.style.background = 'transparent';
                this.style.color = oldColor;
            }
        }
        this.ul.children[i].onclick = function () {
            that.input.value = this.innerText;
            that.input.data = this.data;
            that.func ? that.func(this) : 0;
        }
    }
}


//表格
function Table() {}

Table.prototype.init = function (_parentNode, _json) {
    this.parent = _parentNode;
    this.json = _json;

    this.tHead = document.createElement('table');
    this.tHead.style.position = 'absolute';
    this.tHead.style.width = '100%';
    this.tHead.style.color = '#000';
    this.tHead.style.background = 'rgb(68, 114, 166)';
    this.tHead.style.borderCollapse = 'collapse';

    this.tHeadHead = document.createElement('thead');

    this.tHeadTr = document.createElement('tr');
    this.tHeadTr.style.height = '36px';
    for (var i = 0; i < this.json.item.length; i++) {
        var th = document.createElement('th');
        th.innerText = this.json.item[i].text;
        th.style.width = this.json.item[i].width;
        this.tHeadTr.appendChild(th);
    }

    this.tBodyBox = document.createElement('div');
    this.tBodyBox.style.position = 'absolute';
    this.tBodyBox.style.top = '102px';
    this.tBodyBox.style.left = this.tBodyBox.style.right = 0;
    this.tBodyBox.style.bottom = '30px';
    this.tBodyBox.style.overflow = 'hidden';

    this.tBody = document.createElement('table');
    this.tBody.style.borderCollapse = 'collapse';
    this.tBody.style.position = 'absolute';
    this.tBody.style.top = this.tBody.style.left = this.tBody.style.right = 0;
    this.tBody.style.width = '100%';
    this.tBody.style.tableLayout = 'fixed';

    this.tBodyBody = document.createElement('tbody');

    this.tHeadHead.appendChild(this.tHeadTr);
    this.tHead.appendChild(this.tHeadHead);
    this.parent.appendChild(this.tHead);
    this.tBody.appendChild(this.tBodyBody);
    this.tBodyBox.appendChild(this.tBody);
    this.parent.appendChild(this.tBodyBox);

    this.tableScrollBar = new ScrollBar();
    this.tableScrollBar.init(3, this.tBodyBox, this.tBody);
    this.initEvent();
}

Table.prototype.uninit = function () {
    deleteEle(this.tHead);
    deleteEle(this.tBodyBox);
    this.tHead = null;
    this.tBodyBox = null;
}

Table.prototype.initEvent = function () {
    this.mouseOver();
}

Table.prototype.uninitEvent = function () {
    for (var i = 0; i < this.tBodyBody.children.length; i++) {
        this.tBodyBody.children[i].onmouseover = null;
    }
}

Table.prototype.insertData = function (_data, _func) {
    console.log(this.json);
    for (var i = 0; i < _data.length; i++) {
        var tr = document.createElement('tr');
        tr.style.height = this.json.tBodyTrHeight;
        tr.style.cursor = 'default';
        i % 2 == 1 ? tr.bg = tr.style.background = 'rgba(0, 0, 0, 0.2)' : tr.bg = 'transparent';
        var counter = 0;
        for (var x in _data[i]) {
            var td = document.createElement('td');
            td.title = td.innerText = _data[i][x] ? _data[i][x] : '--';
            td.style.width = this.json.item[counter++].width;
            td.style.padding = '0';
            td.style.textIndent = '4px';
            td.style.overflow = 'hidden';
            td.style.textOverflow = 'ellipsis';
            td.style.whiteSpace = 'nowrap';
            tr.appendChild(td);
        }
        _func ? _func(tr) : 0;
        this.tBodyBody.appendChild(tr);
    }
    this.tableScrollBar.onContentBoxChange();
}

Table.prototype.setCenter = function (_index) {
    for (var i = 0; i < this.tBodyBody.children.length; i++) {
        for (var j = 0; j < _index.length; j++) {
            this.tBodyBody.children[i].children[_index[j]].style.textAlign = 'center';
        }
    }
}

Table.prototype.mouseOver = function () {
    var that = this;
    for (var i = 0; i < this.tBodyBody.children.length; i++) {
        this.tBodyBody.children[i].onmouseover = function () {
            var oldBg = getStyle(this, 'background');
            var oldColor = getStyle(this, 'color');
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.color = 'rgb(83, 187, 235)';
            this.onmouseout = function () {
                this.style.background = oldBg;
                this.style.color = oldColor;
            }
        }
    }
}


//页码
function Page() {}

Page.prototype.init = function (_parentNode, _json, _func, _udata) {
    this.parent = _parentNode;
    this.json = _json;
    this.func = _func; //页面跳转功能
    this.udata = _udata; //用户自定义参数

    this.currentPage = 1;
    this.activeColor = 'rgb(90, 255, 188)';
    this.inActiveColor = 'rgb(183, 194, 232)';

    this.preBtn = document.createElement('a');
    this.preBtn.innerText = '上一页';
    this.preBtn.style.cursor = 'pointer';
    this.preBtn.style.color = this.inActiveColor;

    this.nextBtn = document.createElement('a');
    this.nextBtn.innerText = '下一页';
    this.nextBtn.style.cursor = 'pointer';
    this.nextBtn.style.color = this.inActiveColor;

    this.ul = document.createElement('ul');
    this.ul.style.display = 'inline-block';
    this.ul.style.marginLeft = this.ul.style.marginRight = '30px';
    this.pageCounts = this.json.totalPage >= this.json.showNum ? this.json.showNum : this.json.totalPage;
    for (var i = 0; i < this.pageCounts;) {
        var li = document.createElement('li');
        li.innerText = ++i;
        if (i == this.currentPage) {
            li.style.color = this.activeColor;
            li.setAttribute('class', 'active');
        }
        li.style.display = 'inline-block';
        li.style.minWidth = '20px';
        li.style.height = li.style.lineHeight = '30px';
        li.style.textAlign = 'center';
        li.style.cursor = 'pointer';
        li.style.marginLeft = li.style.marginRight = '2px';
        this.ul.appendChild(li);
    }

    this.totalPage = document.createElement('a');
    this.totalPage.innerText = '共' + this.json.totalPage + '页';
    this.totalPage.style.marginLeft = '30px';
    this.totalPage.style.color = this.inActiveColor;

    this.toPage = document.createElement('input');
    this.toPage.style.width = '32px';
    this.toPage.style.height = '18px';
    this.toPage.style.borderWidth = '1px';
    this.toPage.style.borderStyle = 'solid';
    this.toPage.style.borderColor = this.inActiveColor;
    this.toPage.style.marginLeft = '50px';
    this.toPage.style.marginRight = '10px';
    this.toPage.style.padding = '0';
    this.toPage.style.textAlign = 'center';
    this.toPage.style.color = this.inActiveColor;

    this.jumpBtn = document.createElement('a');
    this.jumpBtn.innerText = '跳转';
    this.jumpBtn.style.cursor = 'pointer';
    this.jumpBtn.style.color = this.inActiveColor;

    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.bottom = 0;
    this.div.style.left = '50%';
    this.div.style.whiteSpace = 'nowrap';
    this.div.style.color = this.inActiveColor;

    this.div.appendChild(this.preBtn);
    this.div.appendChild(this.ul);
    this.div.appendChild(this.nextBtn);
    this.div.appendChild(this.totalPage);
    this.div.appendChild(this.toPage);
    this.div.appendChild(this.jumpBtn);
    this.parent.appendChild(this.div);
    this.div.style.marginLeft = -this.div.offsetWidth / 2 + 'px';

    this.initEvent();
}

Page.prototype.uninit = function () {
    deleteEle(this.div);
}

Page.prototype.initEvent = function () {
    this.pageNumFunc(); //点击页码
    this.prePageFunc(); //点击上一页
    this.nextPageFunc(); //点击下一页
    this.jumpTo(); //跳转页码
}

Page.prototype.uninitEvent = function () {
    for (var i = 0; i < this.ul.children.length; i++) {
        this.ul.children[i].onmouseover = this.ul.children[i].onclick = null;
    }
    this.preBtn.onmouseover = this.preBtn.onclick = null;
    this.nextBtn.onmouseover = this.nextBtn.onclick = null;
    this.toPage.onkeydown = this.jumpBtn.onclick = this.jumpBtn.onmouseover = null;
}

//页码跳转功能
Page.prototype.jumpToPage = function (_toPage) {
    this.toPage.value = '';
    var mid = Math.ceil(this.pageCounts / 2) - 1;
    this.currentPage = _toPage;
    for (var i = 0; i < this.ul.children.length;) {
        this.ul.children[i].style.color = this.inActiveColor;
        this.ul.children[i].setAttribute('class', '');

        if (this.currentPage <= mid) {
            this.ul.children[i].innerText = ++i;
        } else if (this.currentPage >= this.json.totalPage - mid) {
            this.ul.children[i].innerText = this.json.totalPage - this.pageCounts + 1 + i++;
        } else {
            this.ul.children[i].innerText = this.currentPage - mid + i++;
        }

        if (this.ul.children[i - 1].innerText == this.currentPage) {
            this.ul.children[i - 1].setAttribute('class', 'active');
            this.ul.children[i - 1].style.color = this.activeColor;
        }
    }

    var data = this.udata;
    data.page = this.currentPage + '';
    this.func ? this.func(data) : 0;
}

//点击页码
Page.prototype.pageNumFunc = function () {
    var that = this;
    for (var i = 0; i < this.ul.children.length; i++) {
        this.ul.children[i].onmouseover = function () {
            this.style.color = that.activeColor;
            this.onmouseout = function () {
                this.style.color = this.classList.contains('active') ? that.activeColor : that.inActiveColor;
            }
        }
        this.ul.children[i].onclick = function () {
            that.jumpToPage(this.innerText);
        }
    }
}

//点击上一页
Page.prototype.prePageFunc = function () {
    var that = this;
    this.preBtn.onmouseover = function () {
        this.style.color = that.activeColor;
        this.onmouseout = function () {
            this.style.color = that.inActiveColor;
        }
    }

    this.preBtn.onclick = function () {
        if (that.currentPage > 1) {
            that.jumpToPage(that.currentPage - 1);
        }
    }
}

//点击下一页
Page.prototype.nextPageFunc = function () {
    var that = this;
    this.nextBtn.onmouseover = function () {
        this.style.color = that.activeColor;
        this.onmouseout = function () {
            this.style.color = that.inActiveColor;
        }
    }

    this.nextBtn.onclick = function () {
        if (that.currentPage < that.json.totalPage) {
            that.jumpToPage(++that.currentPage);
        }
        that.toPage.value = '';
    }
}

//跳转页码
Page.prototype.jumpTo = function () {
    var that = this;

    function jump() {
        if (that.toPage.value < 1) {
            that.toPage.value = 1;
        } else if (that.toPage.value > that.json.totalPage) {
            that.toPage.value = that.json.totalPage;
        }
        that.jumpToPage(that.toPage.value);
    }

    this.toPage.onkeydown = function (e) {
        if (e.keyCode == 13) {
            that.jumpBtn.style.color = that.activeColor;
            that.jumpBtn.style.textDecoration = 'underline';
            jump();
            this.onkeyup = function () {
                that.jumpBtn.style.color = that.inActiveColor;
                that.jumpBtn.style.textDecoration = 'none';
            }
        }
    }

    this.jumpBtn.onclick = function () {
        jump();
    }

    this.jumpBtn.onmouseover = function () {
        this.style.color = that.activeColor;
        this.style.textDecoration = 'underline';
        this.onmouseout = function () {
            this.style.color = that.inActiveColor;
            this.style.textDecoration = 'none';
        }
    }
}

//警告、确认框
function AlertBox() {}

/**
 * 初始化
 * @param {*} _func 回调函数
 * @param {*} _udata 参数，包括标题、内容、按钮内容、父元素
 */
AlertBox.prototype.init = function (_func, _udata) {
    this.udata = _udata;
    this.func = _func;
    this.data = this.udata.data ? this.udata.data : {};

    this.box = document.createElement('div');
    this.box.innerHTML = '<p class="title"><span>' + this.udata.title + '</span><i class="' + this.udata.closebtn + '"></i></p><p class="info">' + this.udata.info + '</p><button>' + this.udata.btn + '</button>';
    this.udata.parentNode.appendChild(this.box);

    this.shade = document.createElement('div');
    document.body.appendChild(this.shade);

    this.initEvent();
    this.style();
}

//样式
AlertBox.prototype.style = function () {
    this.box.style.position = 'absolute';
    this.box.style.top = this.box.style.left = '50%';
    this.box.style.width = '460px';
    this.box.style.height = '200px';
    this.box.style.marginLeft = '-230px';
    this.box.style.marginTop = '-100px';
    this.box.style.border = '1px solid rgb(83, 187, 235)';
    this.box.style.background = 'rgba(0, 0, 0, 0.8)';
    this.box.style.zIndex = '99';

    var title = this.box.getElementsByClassName('title')[0];
    title.style.marginTop = '0';
    title.style.height = title.style.lineHeight = '30px';
    title.style.borderBottom = '1px solid rgb(83, 187, 235)';
    title.style.textIndent = '10px';
    title.style.background = 'rgb(83, 187, 235)';
    title.style.color = '#000';
    title.style.fontWeight = 'bold';

    var closeBtn = title.children[1];
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '8px';
    closeBtn.style.right = '8px';
    closeBtn.style.color = '#000';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onmouseover = function () {
        this.style.color = '#333';
        this.onmouseout = function () {
            this.style.color = '#000';
            this.onmouseout = null;
        }
    }

    var info = this.box.getElementsByClassName('info')[0];
    info.style.textAlign = 'center';
    info.style.marginTop = info.style.lineHeight = '30px';

    var button = this.box.getElementsByTagName('button')[0];
    button.style.border = '1px solid rgb(83, 187, 235)';
    button.style.background = 'transparent';
    button.style.color = '#eee';
    button.style.width = '80px';
    button.style.height = button.style.lineHeight = '26px';
    button.style.padding = '0';
    button.style.marginLeft = '190px';
    button.style.marginTop = '20px';
    button.style.borderRadius = '2px';
    button.onmouseover = function () {
        this.style.color = 'rgb(83, 187, 235)';
        this.style.boxShadow = '0 0 4px rgb(83, 187, 235)';
        this.onmouseout = function () {
            this.style.color = '#eee';
            this.style.boxShadow = 'none';
            this.onmouseout = null;
        }
    }

    this.shade.style.position = 'fixed';
    this.shade.style.top = this.shade.style.bottom = this.shade.style.left = this.shade.style.right = '0';
    this.shade.style.background = 'rgba(0, 0, 0, 0.5)';
    this.shade.style.zIndex = '98';
}

AlertBox.prototype.initEvent = function () {
    var alertBox = this;

    //点击关闭按钮
    this.box.getElementsByTagName('i')[0].onclick = function () {
        alertBox.uninit();
    }

    //点击按钮
    this.box.getElementsByTagName('button')[0].onclick = function () {
        alertBox.func ? alertBox.func(alertBox.data) : 0;
    }
}

AlertBox.prototype.uninitEvent = function () {
    this.box.getElementsByTagName('i')[0].onclick = null;
    this.box.getElementsByTagName('button')[0].onclick = null;
}

AlertBox.prototype.uninit = function () {
    deleteEle(this.box);
    document.body.removeChild(this.shade);
    this.box = null;
    this.shade = null;
}


//区域设备树
function DevTree() {}

DevTree.prototype.init = function (_parentNode, _showDev, _func, _rClickfunc, _checkbox) {
    this.parent = _parentNode;
    _checkbox ? this.showCheckBox = _checkbox : 0;
    _func ? this.func = _func : 0; //左键点击执行的操作
    _rClickfunc ? this.rClickFunc = _rClickfunc : 0; //右键点击执行的操作
    _showDev ? this.showDev = _showDev : 0; //是否展示设备
    this.openList = []; //用于记录展开的节点

    this.div = document.createElement('section');
    this.div.style.position = 'absolute';
    this.div.style.top = this.div.style.left = this.div.style.bottom = this.div.style.right = 0;

    this.search = document.createElement('p');
    this.search.style.position = 'absolute';
    this.search.style.left = this.search.style.right = '40px';
    this.search.style.top = '10px';
    this.search.innerHTML = '<input type="text" style="position: absolute; left: 0; width: 90%;"><i class="fa fa-search" style="font-size: 14px; position: absolute; right: 0;"></i>';
    this.div.appendChild(this.search);

    this.treeBox = document.createElement('div');
    this.treeBox.style.position = 'absolute';
    this.treeBox.style.top = '50px';
    this.treeBox.style.left = this.treeBox.style.right = this.treeBox.style.bottom = '10px';
    this.treeBox.style.overflow = 'hidden';
    this.treeBox.style.whiteSpace = 'nowrap';
    this.treeBox.style.textOverflow = 'ellipsis';
    this.div.appendChild(this.treeBox);
    this.parent.appendChild(this.div);
    this.scrollBar = new ScrollBar();
    var that = this;
    this.getData('0', that.treeBox);
}

DevTree.prototype.uninit = function () {
    deleteEle(this.div);
}

DevTree.prototype.initEvent = function () {
    var that = this;
    this.getData('0', that.treeBox);
}

DevTree.prototype.uninitEvent = function () {

}
DevTree.prototype.getData = function (_areaid, _parentNode) {
    var that = this;
    var indent = _areaid == '0' ? -24 : parseInt(getStyle(_parentNode, 'textIndent'));
    var type = [];
    WebService.getAreaAndDev(localStorage.maintenanceToken, _areaid, false, '', function (_retcode, _data) {
        console.log(_data);
        if (_retcode) {
            if (_data.length || _data.length) {
                var ul = document.createElement('ul');
                _parentNode.appendChild(ul);
                if (_areaid == '0') {
                    ul.style.position = 'absolute';
                    ul.style.minWidth = '100%';
                    ul.style.zIndex = "999";
                    that.scrollBar.init('3', that.treeBox, that.treeBox.children[0]);
                }
                ul.style.position = 'absolute';
                ul.style.minWidth = '100%';
                that.scrollBar.init('3', that.treeBox, that.treeBox.children[0]);
            }
            for (var i = 0; i < _data.length; i++) {
                var li = document.createElement('li');
                li.setAttribute('class', 'area');
                li.data = _data[i];
                if (that.showCheckBox) {
                    li.innerHTML = '<p style="margin: 0; height: 36px; line-height: 36px;"><i class="fa fa-caret-right fa-fw fa-lg" style="text-indent: 0;"></i><i class="fa fa-square-o fa-fw chkbox" style="text-indent: 0;"></i> ' + _data.areas[i].name + '</p>';
                    that.func ? that.func(li) : 0;
                    if (areaArray) { //复选框功能
                        for (var j = 0; j < areaArray.length; j++) {
                            if (li.data.areaid == areaArray[j]) {
                                li.getElementsByClassName('chkbox')[0].classList.add('fa-check-square');
                                li.getElementsByClassName('chkbox')[0].classList.remove('fa-square-o');
                                break;
                            }
                        }
                    }
                } else {
                    li.innerHTML = '<p style="margin: 0; height: 36px; line-height: 36px;"><i class="fa fa-caret-right fa-fw fa-lg" style="text-indent: 0;"></i><i class="fa fa-sitemap fa-fw" style="text-indent: 0; margin-left: 4px;"></i> ' + _data[i].name + '</p>';
                }
                ul.appendChild(li);
                that.onAreaClick(li);
                that.rClickFunc ? that.rClickFunc(li) : 0;
                for (var j = 0; j < that.openList.length; j++) {
                    if (_data.areas[i].areaid == that.openList[j]) {
                        li.getElementsByTagName('i')[0].classList.add('fa-caret-down');
                        li.getElementsByTagName('i')[0].classList.remove('fa-caret-right');
                        that.getData(_data.areas[i].areaid, li);
                        that.openList.splice(j, 1);
                        break;
                    }
                }
            }

            if (that.showDev) {
                for (var i = 0; i < _data.length; i++) {
                    var li = document.createElement('li');
                    li.setAttribute('class', 'dev');
                    var icon = 'fa-desktop';
                    li.data = _data[i];
                    if (that.showCheckBox) {
                        var flag = true;
                        for (var k = 0; k < selectedDev.length; k++) {
                            if (selectedDev[k].id == _data.devices[i].devid) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            li.innerHTML = '<p style="margin: 0; height: 36px; line-height: 36px;"><i class="fa fa-square-o fa-fw chkbox" style="text-indent: 0;"></i> ' + _data.devices[i].name + '</p>';
                            that.func ? that.func(li) : 0;
                            for (var j = 0; j < devArray.length; j++) {
                                if (li.data.devid == devArray[j].devid) {
                                    li.getElementsByClassName('chkbox')[0].classList.add('fa-check-square');
                                    li.getElementsByClassName('chkbox')[0].classList.remove('fa-square-o');
                                    break;
                                }
                            }
                            li.style.textIndent = indent + 27 + 'px';
                            ul.appendChild(li);
                            that.rClickFunc ? that.rClickFunc(li) : 0;
                            that.onDevClick(li);
                        }
                    } else {
                        li.innerHTML = '<p style="margin: 0; height: 36px; line-height: 36px;"><i class="fa ' + icon + ' fa-fw" style="text-indent:0; font-size: 12px;"></i> ' + _data[i].name + '</p>';
                        li.style.textIndent = indent + 27 + 'px';
                        ul.appendChild(li);
                        that.rClickFunc ? that.rClickFunc(li) : 0;
                        that.onDevClick(li);
                    }
                }
            }
            that.scrollBar.onContentBoxChange();

            /*
                        for(var i = 0; i < _data.devices.length; i++) {
                            var flag = true;
                            for(var j = 0; j < type.length; j++) {
                                if(_data.devices[i].type == type[j]) {
                                    flag = false;
                                    break;
                                }
                            }
                            if(flag) {
                                type.push(_data.devices[i].type);
                                var li = document.createElement('li');
                                li.setAttribute('class', 'type');
                                li.setAttribute('devtype', _data.devices[i].type);
                                li.innerHTML = '<p><i class="fa fa-caret-right fa-fw fa-lg" style="text-indent: 0;"></i>' + _data.devices[i].type + '</p><ul class="' + _data.devices[i].type + '"></ul>';
                                li.style.textIndent = indent + 20 + 'px';
                                ul.appendChild(li);
                                that.onTypeClick(li, _data.devices, (indent + 20));
                            }
                        }
                        */
        } else {
            alert(_data.msg);
        }
    })
}

DevTree.prototype.onAreaClick = function (_node) {
    var that = this;
    _node.children[0].onclick = function () {
        if (that.treeBox.getElementsByClassName('active').length) {
            that.treeBox.getElementsByClassName('active')[0].children[0].style.color = '#fff';
            that.treeBox.getElementsByClassName('active')[0].classList.remove('active');
        }
        _node.classList.add('active');
        _node.children[0].style.color = CONST_ACTIVE_COLOR;

        if (this.children[0].classList.contains('fa-caret-down')) {
            this.children[0].classList.add('fa-caret-right');
            this.children[0].classList.remove('fa-caret-down');
            if (_node.getElementsByTagName('ul').length) {
                deleteEle(_node.getElementsByTagName('ul')[0]);
            }
            that.scrollBar.onContentBoxChange();
        } else {
            this.children[0].classList.add('fa-caret-down');
            this.children[0].classList.remove('fa-caret-right');
            that.getData(_node.data.areaid, _node);
        }
        that.func ? that.func(_node) : 0;
    }
}

DevTree.prototype.onDevClick = function (_node) {
    var that = this;
    _node.children[0].onclick = function () {
        if (that.treeBox.getElementsByClassName('active').length) {
            that.treeBox.getElementsByClassName('active')[0].children[0].style.color = '#fff';
            that.treeBox.getElementsByClassName('active')[0].classList.remove('active');
        }
        _node.classList.add('active');
        _node.children[0].style.color = CONST_ACTIVE_COLOR;
        that.func ? that.func(_node) : 0;
    }
}

DevTree.prototype.refresh = function () {
    var areas = this.treeBox.getElementsByClassName('area');
    var that = this;
    for (var i = 0; i < areas.length; i++) {
        if (areas[i].getElementsByTagName('i')[0].classList.contains('fa-caret-down')) {
            this.openList.push(areas[i].data.areaid);
        }
    }
    deleteEle(that.treeBox.getElementsByTagName('ul')[0]);
    this.getData('0', that.treeBox);
}

DevTree.prototype.onTypeClick = function(_node, _data, _indent) {
    var that = this;
    _node.children[0].onclick = function() {
        if(this.children[0].classList.contains('fa-caret-right')) {
            this.children[0].classList.add('fa-caret-down');
            this.children[0].classList.remove('fa-caret-right');
            for(var i = 0; i < _data.length; i++) {
                if(_data[i].type == _node.getAttribute('devtype')) {
                    var li = document.createElement('li');
                    li.setAttribute('class', 'dev');
                    li.innerHTML = '<p>' + _data[i].name + '</p>';
                    li.data = _data[i];
                    li.style.textIndent = _indent + 20 + 'px';
                    _node.children[1].appendChild(li);
                }
            }
        }else{
            this.children[0].classList.add('fa-caret-right');
            this.children[0].classList.remove('fa-caret-down');
            for(var j = _node.getElementsByClassName('dev').length - 1; j >= 0; j--) {
                deleteEle(_node.getElementsByClassName('dev')[j]);
            }
        }
        that.scrollBar.onContentBoxChange();
    }
}

//时间戳转换成日期格式
function add0(_m) {
    return _m < 10 ? '0' + _m : _m;
}

function format(_timestamp, _formate) {
    var time = new Date(_timestamp); //_timestamp要int型
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    if (_formate == 'date') {
        return y + '-' + add0(m) + '-' + add0(d);
    } else if (_formate == 'time') {
        return add0(h) + ':' + add0(mm) + ':' + add0(s);
    } else {
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }
}

//工单类型换算
function orderTypeExchange(_type, _data) {
    var data = '';
    if (_type == '0') {
        switch (_data) {
            case '0':
                data = CONST_TO_REPAIR;
                break;
            case '1':
                data = CONST_REJECTREPAIR;
                break;
            case '2':
                data = CONST_REPAIRING;
                break;
            case '3':
                data = CONST_TO_CLOSE;
                break;
            case '4':
                data = CONST_CLOSED;
                break;
        }
    } else {
        return null;
    }
    return data;
}

//设备类型转换
function devTypeExchange(_type, _data) {
    var data = '';
    if (_type == '0') {
        switch (_data) {
            case '0':
                data = CONST_VIDEO_DEV;
                break;
            case '1':
                data = CONST_AVCON_MOVING_DEV;
                break;
            case '2':
                data = CONST_SERVER_DEV;
                break;
            case '3':
                data = CONST_STORAGE_DEV;
                break;
            case '4':
                data = CONST_APP_DEV;
                break;
        }
    } else if (_type == '1') {
        switch (_data) {
            case CONST_VIDEO_DEV:
                data = '0';
                break;
            case CONST_AVCON_MOVING_DEV:
                data = '1';
                break;
            case CONST_SERVER_DEV:
                data = '2';
                break;
            case CONST_STORAGE_DEV:
                data = '3';
                break;
            case CONST_APP_DEV:
                data = '4';
                break;
        }
    }
    return data;
}

//报警等级转换
function alarmLevelExchange(_data) {
    var data = {};
    switch (_data) {
        case '1':
            data.level = CONST_LEVEL_NOTICE;
            data.color = CONST_GREEN_COLOR;
            break;
        case '2':
            data.level = CONST_LEVEL_IMPORT;
            data.color = CONST_YELLOW_COLOR;
            break;
        case '3':
            data.level = CONST_LEVEL_URGENCY;
            data.color = CONST_RED_COLOR;
            break;
    }
    return data;
}

//可拖动窗口
function moveDiv(_oDiv) {
    _oDiv.getElementsByClassName('title')[0].onmousedown = function (e) {
        var oldX = e.pageX;
        var oldY = e.pageY;

        document.onmousemove = function (e) {
            if (_oDiv.offsetLeft + e.pageX - oldX < 0) {
                _oDiv.style.left = 0;
            } else if (_oDiv.offsetLeft + e.pageX - oldX + _oDiv.offsetWidth > window.innerWidth) {
                _oDiv.style.left = window.innerWidth - _oDiv.offsetWidth + 'px';
            } else {
                _oDiv.style.left = _oDiv.offsetLeft + e.pageX - oldX + 'px';
            }

            if (_oDiv.offsetTop + e.pageY - oldY < 0) {
                _oDiv.style.top = 0;
            } else if (_oDiv.offsetTop + e.pageY - oldY + _oDiv.offsetHeight > window.innerHeight) {
                _oDiv.style.top = window.innerHeight - _oDiv.offsetHeight + 'px';
            } else {
                _oDiv.style.top = _oDiv.offsetTop + e.pageY - oldY + 'px';
            }
            oldX = e.pageX;
            oldY = e.pageY;
        }

        document.onmouseup = function () {
            this.onmousemove = null;
            this.onmouseup = null;
        }
    }
}

//找到指定祖先节点
function getParentsNode(_node, _attr, _value) {
    var result = [];
    var node = _node;
    while (node.tagName != 'BODY') {
        if (node.getAttribute(_attr) == _value) {
            result.push(node);
        }
        node = node.parentNode;
    }
    return result;
}