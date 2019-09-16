var dataManageTables = new Table();

function brandModel() {
  // console.log("brandModel");
  tableBrand();
  brandTypeList();
}

//设备品牌类型列表
function brandTypeList() {
  WebService.getClassTypeList(localStorage.maintenanceToken, function (_retcode, _data) {
    console.log(_data);
    var html = "";
    if (_retcode) {
      for (var i = 0; i < _data.length; i++) {
        html += "<option value=" + _data[i].classid + ">" + _data[i].classname + "</option>"
      }
      // console.log(html);
      // document.getElementById("brand-typeList").innerHTML = html;
    }
  });
}

//品牌型号列表
function tableBrand() {
  var json = {
    tBodyTrHeight: '30px',
    item: [{
        text: "品牌ID",
        width: '33%',
      }, {
        text: "品牌名称",
        width: '30%'
      },
      {
        text: CONST_ELE_HANDLE,
        width: '43%'
      },
    ]
  }

  dataManageTables.init(document.getElementById('brand-table'), json);
  var data = [{
      brandid: "0001",
      brandname: "dev111",
    },
    {
      brandid: "0001",
      brandname: "dev111",
    },
  ]
  WebService.getBrandList(localStorage.maintenanceToken, function (_retcode, _data) {
    if (_retcode) {
      dataManageTables.insertData(_data, settIcon);
      var hideTrs = dataManageTables.tBody.getElementsByTagName("tr");
      for (var i = 0; i < hideTrs.length; i++) {
        hideTrs[i].getElementsByTagName("td")[2].style.display = "none";
      }
    } else {
      alert(_data.msg);
    }
  })
}

function settIcon(_parentNode) {
  var td = document.createElement('td');
  var _brandid = _parentNode.getElementsByTagName("td")[0].innerHTML;
  td.style.width = "300px";
  td.innerHTML = '<button class="btn add-model-btn" id="add-ele-btn">' +
    '<i class="fa fa-plus"></i> 添加设备品牌型号</button>' +
    '<i class="fa fa-chevron-circle-down" style="cursor: pointer;"></i>' +
    '<i class="fa fa-trash" style="cursor: pointer; margin-left: 30px" title="' + CONST_DELETE + '"></i>';
  _parentNode.append(td);
  // console.log(td.children);
  //查看详情
  td.children[0].onclick = function () {
    showBrandModel(_brandid);
  }
  td.children[1].onclick = function () {
    detailInfoFunc(this, _parentNode);
  }
  //删除
  td.children[2].onclick = function () {
    var data = {
      title: CONST_DELETE_ELE_TITLE,
      info: CONST_DELETE_ELE_INFO,
      btn: CONST_DELETE_BTN,
      closebtn: 'fa fa-close',
      parentNode: document.body,
    };
    var deleteBox = new AlertBox();
    deleteBox.init(function () {
      //删除设备品牌
      WebService.delBrandmodel(localStorage.maintenanceToken, _brandid, function (_retcode, _data) {
        if (_retcode) {
          console.log(_data);
        } else {
          alert(_data.msg);
        }
      })
    }, data);
  }
}
//点击详情按钮
function detailInfoFunc(_this, _parentNode) {
  console.log(_this.classList.contains('fa-chevron-circle-down'));
  if (_this.classList.contains('fa-chevron-circle-down')) { //展开
    _this.classList.add('fa-chevron-circle-up');
    _this.classList.remove('fa-chevron-circle-down');
    var tr = document.createElement('div');
    var td = document.createElement('td');
    var normal = '<br/><i class="normal-light"></i>';
    var abnormal = '<br/><i class="abnormal-light"></i>';

    //插入div
    function insertDiv(_width, _content) {
      var div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.textAlign = 'center';
      div.style.width = _width;
      div.style.lineHeight = '30px';
      div.style.height = '90px';
      div.style.verticalAlign = 'top';
      div.style.overflow = 'hidden';
      div.innerHTML = _content;
      td.style.height = '90px';
      td.appendChild(div);
    }
    console.log(_this.parentNode.parentNode.getElementsByTagName("td")[0].innerHTML);
    var _brandid = _this.parentNode.parentNode.getElementsByTagName("td")[0].innerHTML;
    WebService.getBrandModelList(localStorage.maintenanceToken, _brandid, function (_retcode, _data) {
      if (_retcode) {
        console.log(_data);
        var light = "<div>111111111111</div>";
        insertDiv('1000px', light);
        tr.style.height = '70px';
        tr.style.width = '1000px';
        tr.style.borderTop = '1px solid #aaa';
        tr.style.background = _parentNode.style.background = 'rgba(0, 0, 0, 0.6)';
        tr.style.color = _parentNode.style.color = CONST_ACTIVE_COLOR;
        tr.innerHTML = _data[0] ? _data[0].model : "暂无设备品牌型号";
        tr.onmouseover = _parentNode.onmouseover = function () {
          tr.style.background = _parentNode.style.background = 'rgba(0, 0, 0, 0.5)';
        }
        tr.onmouseout = _parentNode.onmouseout = function () {
          tr.style.background = _parentNode.style.background = 'rgba(0, 0, 0, 0.6)';
        }
        dataManageTables.tBodyBody.insertBefore(tr, _parentNode.nextSibling);
        dataManageTables.tableScrollBar.onContentBoxChange();
      } else {
        alert(_data.msg);
      }
    })
  } else {
    _this.classList.add('fa-chevron-circle-down');
    _this.classList.remove('fa-chevron-circle-up');
    console.log(_parentNode.nextSibling);
    deleteEle(_parentNode.nextSibling);
    _parentNode.onmouseover = function () {
      this.style.background = 'rgba(255, 255, 255, 0.1)';
      this.style.color = CONST_ACTIVE_COLOR;
    }
    _parentNode.onmouseout = function () {
      this.style.background = this.bg;
      this.style.color = '#fff';
    }
    // table.tableScrollBar.onContentBoxChange();
  }
}

//显示添加设备
function showBrandType() {
  document.getElementById('body-shade').style.display = 'block';
  document.getElementById('add-brand').style.display = 'block';
}
//隐藏添加设备
function hideBrandType() {
  document.getElementById('body-shade').style.display = 'none';
  document.getElementById('add-brand').style.display = 'none';
}

//显示添加设备型号
function showBrandModel() {
  document.getElementById('body-shade').style.display = 'block';
  document.getElementById('add-brand-Model').style.display = 'block';
}
//隐藏添加设备型号
function hideBrandModel() {
  document.getElementById('body-shade').style.display = 'none';
  document.getElementById('add-brand-Model').style.display = 'none';
}

//添加设备品牌
function addBrand() {
  var brandid = document.getElementById("brandid").value;
  var brandname = document.getElementById("brandname").value;
  WebService.addBrand(localStorage.maintenanceToken, brandid, brandname, function (_retcode, _data) {
    console.log(_retcode, _data);
  });
}
//添加设备品牌型号
function addBrandModel() {
  var model = document.getElementById("model").value;
  var brandid = document.getElementById("modelBrandid").value;
  WebService.addBrandModel(localStorage.maintenanceToken, model, brandid, function (_retcode, _data) {
    console.log(_retcode, _data);
  });
}