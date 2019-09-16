window.onload = function () {
    checkToken(); //判断token，如为空则跳转到登录页面
    addHeader(); //添加页眉
    onMenuClick(); //点击左边菜单栏切换页面
    assetManage(); //资产管理
    dataManage(); //数据字典 
    userManage(); //用户管理
    brandModel();   //品牌型号
    buildCycle();   //建设周期
    timeTemplateFunc(); //时间模板
    inspectionGroupFunc(); //巡检组
    inspectionPlanFunc(); //巡检计划
    divMove(); //可拖动窗口    
    mcuFunc(); //MCU配置功能
}

window.onresize = function () {
    scrollBarRefresh();
    layoutRefresh();
}

function scrollBarRefresh() {
    devTree.scrollBar ? devTree.scrollBar.onContentBoxChange() : 0;
    dataManageTable.tableScrollBar ? dataManageTable.tableScrollBar.onContentBoxChange() : 0;
    userScroll ? userScroll.onContentBoxChange() : 0;
    userInfoScroll ? userInfoScroll.onContentBoxChange() : 0;
    devGroupListScroll ? devGroupListScroll.onContentBoxChange() : 0;
    devInfoScroll ? devInfoScroll.onContentBoxChange() : 0;
    devGroupInfoScroll ? devGroupInfoScroll.onContentBoxChange() : 0;
    timeTemInfoScroll ? timeTemInfoScroll.onContentBoxChange() : 0;
    timeTemListScroll ? timeTemListScroll.onContentBoxChange() : 0;
    planListScroll ? planListScroll.onContentBoxChange() : 0;
    planInfoScroll ? planInfoScroll.onContentBoxChange() : 0;
    userAreaTree.scrollBar ? userAreaTree.scrollBar.onContentBoxChange() : 0;
    mcuListScroll ? mcuListScroll.onContentBoxChange() : 0;
    mcuInfoScroll ? mcuInfoScroll.onContentBoxChange() : 0;
}

function layoutRefresh() {
    assetLayout();
    userLayout();
    timeTemLayout();
    inspectionGroupLayout();
    planLayout();
    mcuLayout();
}

function addHeader() {
    var pageHeader = new PageHeader();
    pageHeader.init(document.getElementsByClassName('out-box')[0], 6);
}

function onMenuClick() {
    var leftMenu = document.getElementById('left-menu');
    var items = leftMenu.getElementsByTagName('ul')[0].children;
    var dataContent = document.getElementById('data-content');
    var secLevel = leftMenu.getElementsByClassName('sec-level');
    for (var i = 0; i < items.length; i++) {
        items[i].index = i;
        items[i].children[0].onclick = function () {
            leftMenu.getElementsByClassName('active')[0].classList.remove('active');
            this.parentNode.classList.add('active');
            var status = 'open';
            if (this.parentNode.getElementsByClassName('sec-level').length && getStyle(this.parentNode.getElementsByClassName('sec-level')[0], 'display') == 'none') {
                status = 'closed';
            }
            for (var j = 0; j < secLevel.length; j++) {
                secLevel[j].style.display = 'none';
            }
            if (status == 'closed') {
                this.parentNode.getElementsByClassName('sec-level')[0].style.display = 'block';
            }


            for (var j = 0; j < dataContent.children.length; j++) {
                dataContent.children[j].style.display = 'none';
            }

            switch (this.parentNode.index) {
                case 0:
                    document.getElementById('assets-manage').style.display = 'block';
                    returnAreaInfo();
                    devTree.scrollBar ? devTree.scrollBar.onContentBoxChange() : 0;
                    break;
                case 1:
                    document.getElementById('user-manage').style.display = 'block';
                    userScroll ? userScroll.onContentBoxChange() : 0;
                    userAreaTree.refresh(); //刷新树
                    getRoleList(); //获取角色列表
                    break;
                case 2:
                    document.getElementById('data-manage').style.display = 'block';
                    dataManageTable.tableScrollBar ? dataManageTable.tableScrollBar.onContentBoxChange() : 0;
                    break;
                case 5:
                    document.getElementById('inspection-setting').style.display = 'block';
                    if (getStyle(document.getElementById('time-tem'), 'display') == 'block') { //时间模板
                        timeTemGetList(); //刷新时间模板列表
                    }
                    break;
                case 6:
                    document.getElementById('other-setting').style.display = 'block';
                    if (getStyle(document.getElementById('mcu-setting'), 'display') == 'block') { //MCU配置
                        getMcuList(); //刷新mcu列表
                        mcuListScroll ? mcuListScroll.onContentBoxChange() : 0;
                    }
                    break;
                case 7:
                    document.getElementById('brand-model').style.display = 'block';
                    break;
                case 8:
                    document.getElementById('build-cycle').style.display = 'block';
                    break;
            }
            scrollBarRefresh();
            layoutRefresh();
        }

        if (items[i].getElementsByClassName('sec-level').length) {
            onSecLevelClick(items[i]); //点击二级菜单
        }
    }
}

//点击二级菜单
function onSecLevelClick(_node) {
    var ul = _node.getElementsByClassName('sec-level')[0];
    for (var i = 0; i < ul.children.length; i++) {
        ul.children[i].index = i;
        ul.children[i].onclick = function () {
            ul.getElementsByClassName('sec-active')[0].classList.remove('sec-active');
            this.classList.add('sec-active');
            var divs = document.getElementById('data-content').children[_node.index].getElementsByClassName('box')[0].children;
            for (var j = 0; j < divs.length; j++) {
                divs[j].style.display = 'none';
            }
            divs[this.index].style.display = 'block';
            switch (this.getElementsByTagName('span')[0].innerText) {
                case '时间模板':
                    timeTemGetList(); //刷新时间模板列表
                    break;
                case '巡检组':
                    devGroupListScroll ? devGroupListScroll.onContentBoxChange() : 0;
                    selectedListScroll ? selectedListScroll.onContentBoxChange() : 0;
                    unselectedDev(); //填充设备树
                    inspectionGroupList(); //刷新巡检组列表
                    break;
                case '巡检计划':
                    planGetList(); //刷新计划列表
                    planDevGroupList(); //刷新巡检组列表
                    planTimeTemList(); //刷新时间模板列表
                    break;
                case '账号管理':
                    userAreaTree.refresh(); //刷新树
                    getRoleList(); //获取角色列表
                    break;
                case 'MCU配置':
                    getMcuList(); //刷新mcu列表
            }
            scrollBarRefresh();
            layoutRefresh();
        }
    }
}

//可拖动窗口
function divMove() {
    moveDiv(document.getElementById('add-ele'));
}