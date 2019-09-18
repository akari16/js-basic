var menuList = [
  {
    id: "1",
    name: "javascript简介",
    href: "depart1.html"
  },
  {
    id: "2",
    name: "在HTML中使用javaScript",
    href: "depart1.html"
  },
  {
    id: "3",
    name: "基本概念",
    href: "depart1.html"
  },
  {
    id: "4",
    name: "简介",
    href: "depart1.html"
  },
  {
    id: "5",
    name: "操作符",
    href: "depart1.html"
  },
]


function initMenu() {
  var listItem = $("#listItem");
  var len = menuList.length;
  console.log(listItem);
  var listHtml = "";
  for (var i = 0; i < len; i++) {
    listHtml += "<li><a href='/page/" + menuList[i].href + "'>" + menuList[i].name + "</a></li>"
  }
  listItem.html(listHtml);
}





window.onload = function () {
  initMenu();
}