function buildCycle() {
  // console.log("buildCycle")
  tableProjectList();
  showAdd();
}

//建设工期列表
function tableProjectList() {
  var json = {
    tBodyTrHeight: '36px',
    item: [{
      text: "工期名称",
      width: '12%'
    }, {
      text: "承建商",
      width: '12%'
    }, {
      text: '建设时间',
      width: '12%'
    }, {
      text: '维护者',
      width: '12%'
    }, {
      text: '手机号',
      width: '12%'
    }, {
      text: '维护开始时间',
      width: '12%'
    }, {
      text: '维护结束时间',
      width: '12%'
    }, {
      text: CONST_ELE_HANDLE,
      width: '22%'
    }]
  }

  dataManageTable.init(document.getElementById('project-table'), json);
  var data = [{
    name: '维修人员00',
    builder: '华平',
    buildTime: '2019-05-17',
    author: '测试人员001',
    phone: '13714703604',
    startTime: '2019-05-17 00:02:00',
    stopTime: '2019-05-19 00:02:00',
  }, ]
  WebService.getProjectList(localStorage.maintenanceToken, function (_retcode, _data) {
    console.log(_retcode, _data);
    if (_retcode) {
      dataManageTable.insertData(_data, editIcon);
    } else {
      alert(_data.msg);
    }
  });
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

function editIcon(_parentNode) {
  console.log(_parentNode)
  var td = document.createElement('td');
  //表格数据
  var _projectid = _parentNode.getElementsByTagName("td")[0].innerHTML;
  var _projectname = _parentNode.getElementsByTagName("td")[1].innerHTML;
  var _contactor = _parentNode.getElementsByTagName("td")[2].innerHTML;
  var _buildtime = _parentNode.getElementsByTagName("td")[3].innerHTML;
  var _maintainer = _parentNode.getElementsByTagName("td")[4].innerHTML;
  var _mobile = _parentNode.getElementsByTagName("td")[5].innerHTML;
  var _maintenacebegin = _parentNode.getElementsByTagName("td")[6].innerHTML;
  var _maintenaceend = _parentNode.getElementsByTagName("td")[7].innerHTML;
  td.style.width = "100px";
  td.innerHTML = '<i class="fa fa-info-circle" style="cursor: pointer;"></i><i class="fa fa-pencil" style="cursor: pointer; margin-left: 30px" title="' + CONST_MODIFY_ELE + '"></i>' +
    '<i class="fa fa-trash" style="cursor: pointer; margin-left: 30px" title="' + CONST_DELETE + '"></i>';
  _parentNode.append(td);
  //修改
  td.children[1].onclick = function () {
    //显示修改工期模态框
    document.getElementById('body-shade').style.display = 'block';
    document.getElementById('edit-build').style.display = 'block';
    var addProjectBtn = document.getElementById("add-project-btn");
    addProjectBtn.setAttribute("editType", 1);

    //设置值回显到表单当中
    document.getElementById("project-id").value = _projectid;
    document.getElementById("project-name").value = _projectname;
    document.getElementById("project-contactor").value = _contactor;
    document.getElementById("project-buildtime").value = _buildtime;
    document.getElementById("project-maintainer").value = _maintainer;
    document.getElementById("project-mobile").value = _mobile;
    document.getElementById("project-maintenacebegin").value = _maintenacebegin;
    document.getElementById("project-maintenaceend").value = _maintenaceend;

  }
  //删除
  td.children[2].onclick = function () {
    var data = {
      title: CONST_DELETE_ELE_TITLE,
      info: CONST_DELETE_ELE_INFO,
      btn: CONST_DELETE_BTN,
      closebtn: 'fa fa-close',
      parentNode: document.body
    };
    var deleteBox = new AlertBox();
    deleteBox.init(function () {
      //删除设备品牌
      WebService.delProject(localStorage.maintenanceToken, _projectid, function (_retcode, _data) {
        if (_retcode) {
          console.log(_data);
          deleteBox.uninit();
          dataManageTable.initEvent();
        } else {
          alert(_data.msg);
        }
      })
    }, data);
  }
}

function showAdd() {
  var addProjectBtn = document.getElementById("add-project-btn");
  var addProject = document.getElementById("add-project");
  addProjectBtn.onclick = function () {
    addProjectBtn.setAttribute("editType", 0);
    document.getElementById('body-shade').style.display = 'block';
    document.getElementById('edit-build').style.display = 'block';
  }
}

function addProject() {
  //添加，取消
  var data = {};
  data.projectid = document.getElementById("project-id").value;
  data.projectname = document.getElementById("project-name").value;
  data.contactor = document.getElementById("project-contactor").value;
  data.buildtime = document.getElementById("project-buildtime").value;
  data.maintainer = document.getElementById("project-maintainer").value;
  data.mobile = document.getElementById("project-mobile").value;
  data.maintenacebegin = document.getElementById("project-maintenacebegin").value;
  data.maintenaceend = document.getElementById("project-maintenaceend").value;
  //提交表单，编辑或者新增
  var editType = document.getElementById("add-project-btn").getAttribute("editType");
  console.log(data);
  if (editType == 0) { //0为新增
    WebService.addProject(localStorage.maintenanceToken, data, function (_retcode, _data) {
      console.log(_retcode, _data);
    });
  } else {
    WebService.editProjectModify(localStorage.maintenanceToken, data, function (_retcode, _data) {
      console.log(_retcode, _data);
    });
  }

}

function cancelProject() {
  document.getElementById('body-shade').style.display = 'none';
  document.getElementById('edit-build').style.display = 'none';
}