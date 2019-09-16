var userScroll = new ScrollBar();               //用户列表滚动条
var userInfoScroll = new ScrollBar();           //用户信息滚动条
var userAreaTree = new DevTree();               //区域树
var roleList = new PullDownList();              //角色列表

//用户管理功能
function userManage() {
    userListScroll();           //用户列表滚动条
    roleListFunc();             //用户信息选择角色列表
    userLayout();
    userAreaTreeFunc();         //区域树
    userMenu();                 //右键菜单
    reTypePw();                 //判断重复密码
}

//用户列表滚动条
function userListScroll() {
    userScroll.init(3, document.getElementById('user-manage').getElementsByClassName('ul-box')[0], document.getElementById('user-list'));
    userInfoScroll.init(2, document.getElementById('edit-user'), document.getElementById('edit-user').getElementsByClassName('content-box')[0]);
}

function userLayout() {
    var editUser = document.getElementById('edit-user');
    var div = editUser.getElementsByClassName('content-box')[0];
    div.style.left = (editUser.offsetWidth - div.offsetWidth) / 2 + 'px';
}

//用户信息选择角色列表
function roleListFunc() {
    var div = document.getElementById('edit-user');
    WebService.getRoleList(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {
            var item = [];
            for(var i = 0; i < _data.length; i++) {
                item.push({text: _data[i].rolename, id: _data[i].roleid});
            }
            var json = {
                divMarginLeft: '0', label: COSNT_USER_ROLE, defaultValue: '', boxW: '228px', readonly: true, item: item
            }
            roleList.init(div.getElementsByClassName('role')[0], json, clickLi);
            roleList.div.style.display = 'inline-block';
            roleList.box.style.marginLeft = '4px';
            roleList.list.style.marginTop = '49px';
            roleList.list.style.width = '228px';
            roleList.input.style.height = roleList.input.style.lineHeight = '26px';
        }else{
            alert(_data.msg);
        }
    })
    function clickLi(_node) {
        roleList.input.data = _node.data;
    }
}

//区域树
function userAreaTreeFunc() {
    userAreaTree.init(document.getElementById('area-list'), false, userAreaTree.clickNode);
    userAreaTree.search.style.display = 'none';
}

userAreaTree.clickNode = function(_node) {
    var userArea = document.getElementById('user-area');
    userArea.value = _node.data.name;
    userArea.areaid = _node.data.areaid;
}

//获取角色列表
function getRoleList() {
    var ul = document.getElementById('user-list');
    var openList = [];
    for(var i = ul.children.length - 1; i >= 0; i--) {
        ul.children[i].getElementsByClassName('fa')[0].classList.contains('fa-caret-down') ? openList.push(ul.children[i].data.roleid) : 0;
        deleteEle(ul.children[i]);
    }
    WebService.getRoleList(localStorage.maintenanceToken, function(_retcode, _data) {
        if(_retcode) {
            for(var i = 0; i < _data.length; i++) {
                var li = document.createElement('li');
                li.innerHTML = '<p><i class="fa fa-caret-right fa-fw fa-lg"></i> ' + _data[i].rolename + '</p><ul></ul>';
                li.data = _data[i];
                li.classList.add('group');
                ul.appendChild(li);
                for(var j = 0; j < openList.length; j++) {
                    if(_data[i].roleid == openList[j]) {
                        onRoleClick(li);
                        openList.splice(j, 1);
                        break;
                    }
                }
                li.children[0].onclick = function() {
                    onRoleClick(this.parentNode);
                }
                RoleUserRclick(li.children[0], document.getElementById('role-menu'));
            }
        }else{
            alert(_data.msg);
        }
    })
}

//角色、用户右键菜单
function RoleUserRclick(_node, _menu, _isuser) {
    _node.oncontextmenu = function(e) {
        document.getElementById('role-menu').style.display = document.getElementById('user-menu').style.display = 'none';
        _menu.style.top = e.pageY + 'px';
        _menu.style.left = e.pageX + 'px';
        _menu.style.display = 'block';
        _isuser ? onUserClick(_node) : 0;
        document.onclick = function() {
            _menu.style.display = 'none';
            document.onclick = null;
        }
    }
}

//点击展开、收起角色
function onRoleClick(_node) {
    var ul = _node.getElementsByTagName('ul')[0];
    var caret = _node.children[0].children[0];
    if(caret.classList.contains('fa-caret-right')) {            //展开
        caret.classList.add('fa-caret-down');
        caret.classList.remove('fa-caret-right');
        WebService.getUserList(localStorage.maintenanceToken, '', '', '', '', true, function(_retcode, _data) {
            if(_retcode) {
                for(var i = 0; i < _data.list.length; i++) {
                    if(_data.list[i].roleid == _node.data.roleid) {
                        var li = document.createElement('li');
                        li.innerHTML = '<i class="fa fa-user-o fa-fw"></i> <span>' + _data.list[i].username + '</span>';
                        li.data = _data.list[i];
                        ul.appendChild(li);
                        li.onclick = function() {
                            onUserClick(this);
                        }
                        RoleUserRclick(li, document.getElementById('user-menu'), true);
                    }
                }
            }else{
                alert(_data.msg);
            }
        })
    }else{              //收起
        caret.classList.add('fa-caret-right');
        caret.classList.remove('fa-caret-down');
        for(var i = ul.children.length - 1; i >= 0; i--) {
            deleteEle(ul.children[i]);
        }
    }
}

//点击用户展现用户信息
function onUserClick(_node) {
    var list = document.getElementById('user-list-div');
    var div = document.getElementById('edit-user');
    document.getElementById('password').value = document.getElementById('re-password').value = '************';
    list.getElementsByClassName('active').length ? list.getElementsByClassName('active')[0].classList.remove('active') : 0;
    _node.classList.add('active');
    document.getElementById('user-id').value = _node.data.userid;
    document.getElementById('user-name').value = _node.data.username;
    roleList.input.value = _node.data.rolename;
    roleList.input.data = {text: _node.data.rolename, id: _node.data.roleid};
    document.getElementById('user-area').value = _node.data.areaname;
    document.getElementById('user-area').areaid = _node.data.areaid;
    document.getElementById('phone').value = _node.data.tel;
    document.getElementById('email').value = _node.data.email;
    document.getElementById('position').value = _node.data.position;
    document.getElementById('wechat').value = _node.data.wechat;
}

//右键菜单
function userMenu() {
    var div = document.getElementById('edit-user');
    var title = div.getElementsByClassName('title')[0];
    var btns = div.getElementsByClassName('btn');
    var pw = document.getElementById('password');
    var rePw = document.getElementById('re-password');
    var list = document.getElementById('user-list');
    var userid = document.getElementById('user-id');

    //添加用户
    document.getElementById('role-menu').children[0].onclick = function() {
        title.innerText = CONST_ADD_USER;
        btns[0].innerText = CONST_ADD_BTN;
        userid.readOnly = false;
        addModifyUser();
    }
    var menu = document.getElementById('user-menu');
    //修改用户
    menu.children[0].onclick = function() {
        title.innerText = CONST_MODIFY_USER;
        btns[0].innerText = CONST_MODIFY_BTN;
        userid.readOnly = true;
        addModifyUser();
    }
    //删除用户
    menu.children[1].onclick = function() {
        deleteUser(list.getElementsByClassName('active')[0]);
    }
}

//重复密码功能
function reTypePw() {
    var div = document.getElementById('edit-user');
    var pw = document.getElementById('password');
    var rePw = document.getElementById('re-password');
    var tip = div.getElementsByClassName('re-pw-error')[0];
    pw.onblur = rePw.onblur = function() {
        pw.value == rePw.value ? tip.style.display = 'none': tip.style.display = 'inline-block';
    }
}

//添加、修改用户
function addModifyUser() {
    var areaList = document.getElementById('area-list');
    var userList = document.getElementById('user-list-div');
    var div = document.getElementById('edit-user');
    var title = div.getElementsByClassName('title')[0];
    var shade = div.getElementsByClassName('shade')[0];
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var account = document.getElementById('user-id');
    var name = document.getElementById('user-name');
    var pw = document.getElementById('password');
    var rePw = document.getElementById('re-password');
    var userArea = document.getElementById('user-area');
    var role = roleList.input;
    var position = document.getElementById('position');
    var phone = document.getElementById('phone');
    var wechat = document.getElementById('wechat');
    var email = document.getElementById('email');
    var errorTip = div.getElementsByClassName('re-pw-error')[0];

    addBtn.style.display = clearBtn.style.display = 'inline-block';
    shade.style.display = userList.style.display = 'none';
    areaList.style.display = 'block';

    userArea.setAttribute('placeholder', CONST_AREA_PLACEHOLDER);
    position.setAttribute('placeholder', CONST_EMPTY_OK);
    phone.setAttribute('placeholder', CONST_EMPTY_OK);
    wechat.setAttribute('placeholder', CONST_EMPTY_OK);
    email.setAttribute('placeholder', CONST_EMPTY_OK);

    addBtn.onclick = function() {
        account.value ? account.classList.remove('error') : account.classList.add('error');
        name.value ? name.classList.remove('error') : name.classList.add('error');
        pw.value ? pw.classList.remove('error') : pw.classList.add('error');
        rePw.value ? rePw.classList.remove('error') : rePw.classList.add('error');
        userArea.value ? userArea.classList.remove('error') : userArea.classList.add('error');
        role.value ? role.classList.remove('error') : role.classList.add('error');

        if(!div.getElementsByClassName('error').length && (getStyle(errorTip, 'display') == 'none')) {
            if(title.innerText == CONST_ADD_USER) {             //添加用户
                WebService.addUser(localStorage.maintenanceToken, account.value, name.value, md5(pw.value), phone.value, email.value, wechat.value, position.value, role.data.id, userArea.areaid, function(_retcode, _data) {
                    if(_retcode) {
                        getRoleList();
                        userDivRefresh();
                    }else{
                        alert(_data.msg);
                    }
                })
            }else if(title.innerText == CONST_MODIFY_USER) {            //修改用户                   
                WebService.modifyUser(localStorage.maintenanceToken, account.value, name.value, md5(pw.value), phone.value, email.value, wechat.value, position.value, role.data.id, userArea.areaid, function(_retcode, _data) {
                    if(_retcode) {
                        getRoleList();
                        userDivRefresh();
                    }else{
                        alert(_data.msg);
                    }
                })
            }
        }
    }
    clearBtn.onclick = function() {
        userDivRefresh();
    }
}

function userDivRefresh() {
    var div = document.getElementById('edit-user');
    var title = div.getElementsByClassName('title')[0];
    var addBtn = div.getElementsByClassName('add-btn')[0];
    var clearBtn = div.getElementsByClassName('clear-btn')[0];
    var inputs = div.getElementsByTagName('input');
    var areaList = document.getElementById('area-list');
    var userList = document.getElementById('user-list-div');
    var shade = div.getElementsByClassName('shade')[0];
    var errorTip = div.getElementsByClassName('re-pw-error')[0];

    title.innerText = CONST_USER_INFO;
    addBtn.style.display = clearBtn.style.display = 'none';
    for(var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
    for(var i = div.getElementsByClassName('error').length - 1; i >= 0; i--) {
        div.getElementsByClassName('error')[i].classList.remove('error');
    }
    for(var i = 0; i < inputs.length; i++) {
        inputs[i].removeAttribute('placeholder');
    }
    areaList.style.display = errorTip.style.display = 'none';
    userList.style.display = shade.style.display = 'block';
    userAreaTree.uninit();
    userAreaTreeFunc();
}

//删除用户
function deleteUser(_node) {
    var deleteBox = new AlertBox();
    var data = {
        title: CONST_DELETE_USER,
        info: CONST_DELETE_USER_INFO,
        btn: CONST_DELETE_BTN,
        closebtn: 'fa fa-close',
        parentNode: document.body,
        data: _node.data.userid
    };
    deleteBox.init(deleteFunc, data);
    function deleteFunc(_data) {
        WebService.deleteUser(localStorage.maintenanceToken, _data, function(_retcode, _data) {
            if(_retcode) {
                userDivRefresh();
                getRoleList();
                deleteBox.uninit();
            }else{
                alert(_data);
            }
        })
    }
}