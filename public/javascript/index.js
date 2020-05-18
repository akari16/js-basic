var menuList = [
  {
    id: "1",
    name: "javascript简介",
    href: "index.html"
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