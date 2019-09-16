window.onload = function() {
    init();                     //进入页面的操作
    savePw();                   //记住密码
    onLoginBtnClick();          //点击登录按钮
}

//记住密码
function savePw() {
    var p = document.getElementsByClassName('savePw')[0];
    var box = p.children[0];
    p.onclick = function() {
        if(box.classList.contains('fa-check-square')) {
            box.classList.add('fa-square-o');
            box.classList.remove('fa-check-square');
        }else{
            box.classList.add('fa-check-square');
            box.classList.remove('fa-square-o');
        }
    }
}

//点击登录按钮
function onLoginBtnClick() {
    var btn = document.getElementsByClassName('login-btn')[0];

    function login() {
        var userid = document.getElementById('userid').value;
        var password = document.getElementById('password').value;
        if(userid && password) {
            WebService.login(userid, md5(password), function(_retcode, _data) {
                if(_retcode) {
                    //勾选了记住密码
                    if(document.getElementsByClassName('fa-check-square').length) {
                        localStorage.maintenanceUserid = userid;
                        localStorage.maintenancePassword = password;
                    }else{          //没勾选则取消保存
                        localStorage.maintenanceUserid = '';
                        localStorage.maintenancePassword = '';
                    }
                    localStorage.maintenanceUser = _data.name;
                    localStorage.maintenanceToken = _data.token;
                    (_data.roleid != "3") ? self.location = 'home.html' : self.location = 'repairer-index.html';
                    
                }else{
                    alert(_data.msg);
                }
            })
        }
    }

    btn.onclick = function() {
        login();
    }

    document.body.onkeydown = function(e) {
        if(e.keyCode == 13) {
            login();
        }
    }
}

//进入页面的操作
function init() {
    //若之前有保存密码则自动填充用户名密码
    if(localStorage.maintenanceUserid && localStorage.maintenancePassword) {
        document.getElementById('userid').value = localStorage.maintenanceUserid;
        document.getElementById('password').value = localStorage.maintenancePassword;
        var box = document.getElementsByClassName('savePw')[0].children[0];
        box.classList.add('fa-check-square');
        box.classList.remove('fa-square-o');
    }

    //清除token，防止注销后点击回退再次进入页面
    localStorage.maintenanceToken = '';
}