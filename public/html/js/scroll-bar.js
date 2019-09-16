function ScrollBar() {}

/**
 * @param {0x01:横向， 0x02:纵向， 0x03:横向+纵向} _type 
 */
ScrollBar.prototype.init = function(_type, _box, _content) {
    this.box = _box;
    this.content = _content;
    this.vh = this.box.offsetWidth / this.content.offsetWidth;
    this.vv = this.box.offsetHeight / this.content.offsetHeight;
    this.bottomBarHeight = 0;
    this.rightBarWidth = 0;
    this.speed = 20;        //鼠标滚轮每次滚动的距离
    this.userSelect = getStyle(this.content, 'userSelect');     //记录content的原始“文本可选中”属性值
    this.browser = window.navigator.userAgent.toLowerCase().indexOf('firefox');
    
    if(_type & 0x01) {          //创建横向滚动条
        this.hslider = document.createElement('div');
        this.hslider.setAttribute('class', 'slider');

        this.bottomBar = document.createElement('div');
        this.bottomBar.setAttribute('class', 'scroll-bar scroll-bar-bottom');

        this.bottomBar.appendChild(this.hslider);
        this.box.appendChild(this.bottomBar);

        this.hslider.style.width = parseInt(this.vh * this.bottomBar.offsetWidth) + 'px';
        this.hScrollBar();          //判断横向滚动条是否显现
    }

    if(_type & 0x02) {          //创建纵向滚动条
        this.vslider = document.createElement('div');
        this.vslider.setAttribute('class', 'slider');

        this.rightBar = document.createElement('div');
        this.rightBar.setAttribute('class', 'scroll-bar scroll-bar-right');

        this.rightBar.appendChild(this.vslider);
        this.box.appendChild(this.rightBar);
        
        this.vslider.style.height = parseInt(this.vv * this.rightBar.offsetHeight) + 'px';
        this.vScrollBar();          //判断纵向滚动条是否显现
    }
	
	this.initEvent();
}

ScrollBar.prototype.uninit = function() {
    this.uninitEvent();
    this.bottomBar ? this.box.removeChild(this.bottomBar) : 0;
    this.rightBar ? this.box.removeChild(this.rightBar) : 0;
}

//判断纵向滚动条是否显现
ScrollBar.prototype.vScrollBar = function() {
    this.content.offsetHeight > this.box.offsetHeight ? this.rightBar.style.display = 'block' : (this.rightBar.style.display = 'none') | (this.vslider.style.top = 0) | (this.content.style.top = 0);
}

//判断横向滚动条是否显现
ScrollBar.prototype.hScrollBar = function() {
    this.content.offsetWidth > this.box.offsetWidth ? this.bottomBar.style.display = 'block' : (this.bottomBar.style.display = 'none') | (this.hslider.style.left = 0) | (this.content.style.left = 0);
}

//监听box、content宽高变化事件
// ScrollBar.prototype.listenBox = function() {
//     var scrollBar = this;
//     this.box.onresize = function() {
//         scrollBar.onContentBoxChange();
//     }

//     this.content.onresize = function() {
//         scrollBar.onContentBoxChange();
//     }
// }

// content、box宽高发生改变删除所有监听事件，添加新的监听，并判断是否显示滚动条
ScrollBar.prototype.onContentBoxChange = function() {
    if (this.box && this.content) {
        this.vh = this.box.offsetWidth / this.content.offsetWidth;
        this.vv = this.box.offsetHeight / this.content.offsetHeight;
        this.uninitEvent();     //删除旧的监听
    
        if(this.hslider) {
            this.hScrollBar();          //判断横向滚动条是否显现
            this.hslider.style.width = parseInt(this.vh * this.bottomBar.offsetWidth) + 'px';
            this.content.style.left = '-' + parseInt(this.hslider.offsetLeft / this.vh) + 'px';
        }
        
        if(this.vslider) {
            this.vScrollBar();          //判断纵向滚动条是否显现
            this.vslider.style.height = parseInt(this.vv * this.rightBar.offsetHeight) + 'px';
            this.content.style.top = '-' + parseInt(this.vslider.offsetTop / this.vv) + 'px';
        }
    }

    this.initEvent();       //添加新的监听
}

//添加各监听事件
ScrollBar.prototype.initEvent = function() {
    var scrollbar = this;
    if(this.hslider && getStyle(this.hslider, 'display') == 'block') {
        this.moveHslider();             //拖动滑块
        this.clickBottomBar();          //点击滚动栏
    }
    
    if(this.vslider && getStyle(this.vslider, 'display') == 'block') {
        this.moveVslider();             //拖动滑块
        this.clickRightBar();           //点击滚动栏
        this.browser == -1 ? this.onMouseWheel() : this.ffOnMouseWheel();       //前者兼容IE CHROME, 后者兼容FF
    }
}

//取消监听事件
ScrollBar.prototype.uninitEvent = function() {
    if(this.hslider) {
        this.hslider.onmousedown = null;
        this.bottomBar.onclick = null;
    }
    
    if(this.vslider) {
        this.vslider.onmousedown = null;
        this.rightBar.onclick = null;
        this.browser == -1 ? this.box.onmousewheel = null : this.box.removeEventListener('DOMMouseScroll', this.ffOnMouseWheel.ffmouseWheel);
    }
}

//纵向滚动条鼠标滚轮向上
ScrollBar.prototype.moveUp = function() {
    var vslider = this.vslider;
    if(getStyle(this.rightBar, 'display') != 'none') {
        if(vslider.offsetTop < this.speed) {
            vslider.style.top = this.content.style.top = 0;
        }else{
            vslider.style.top = vslider.offsetTop - this.speed + 'px';
            this.content.style.top = '-' + parseInt(vslider.offsetTop / this.vv) + 'px';
        }
    }
}

//纵向滚动条鼠标滚轮向下
ScrollBar.prototype.moveDown = function() {
    var vslider = this.vslider;
    if(getStyle(this.rightBar, 'display') != 'none') {
        if(vslider.offsetTop + vslider.offsetHeight > this.rightBar.offsetHeight - this.speed) {
            vslider.style.top = this.rightBar.offsetHeight - vslider.offsetHeight + 'px';
            this.content.style.top = this.box.offsetHeight - this.content.offsetHeight + 'px';
        }else{
            vslider.style.top = vslider.offsetTop + this.speed + 'px';
            this.content.style.top = '-' + parseInt(vslider.offsetTop / this.vv) + 'px';
        }
    }
}

//纵向滚动条鼠标滚轮事件  兼容IE、CHROME
ScrollBar.prototype.onMouseWheel = function() {
    var scrollbar = this;
    this.box.onmousewheel = function(e) {
        if(scrollbar.content.offsetHeight > scrollbar.box.offsetHeight) {
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            delta > 0 ? scrollbar.moveUp() : scrollbar.moveDown();
        }
        e.stopPropagation();
    }
}

//纵向滚动条鼠标滚轮事件  兼容FF
ScrollBar.prototype.ffOnMouseWheel = function(e) {
    var scrollbar = this;
    var ffmouseWheel = function(e) {
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        delta > 0 ? scrollbar.moveUp() : scrollbar.moveDown();
        e.stopPropagation();
    }
    this.box.addEventListener('DOMMouseScroll', ffmouseWheel);
}

//点击纵向滚动栏上的某一点，滑块向上、下移动
ScrollBar.prototype.clickRightBar = function() {
    var scrollbar = this;
    this.rightBar.onclick = function(e) {
        var mouseTop = e.pageY - scrollbar.box.offsetTop;           //鼠标相对于滚动条顶部的高度
        var v1 = this.offsetHeight / (scrollbar.content.offsetHeight - scrollbar.box.offsetHeight);        
        var v2 = (this.offsetHeight - scrollbar.vslider.offsetHeight) / this.offsetHeight;
        animate(scrollbar.content, {'top': '-' + parseInt(mouseTop / v1)});
        animate(scrollbar.vslider, {'top': parseInt(mouseTop * v2)});
    }

    for(var i = 0; i < this.rightBar.childNodes.length; i++) {
        this.rightBar.childNodes[i].onclick = function(e) {
            e.stopPropagation();
        }
    }
}

//拖动纵向滚动栏里的滑块
ScrollBar.prototype.moveVslider = function() {
    var scrollbar = this;
    this.vslider.onmousedown = function(e) {
        var vslider = this;
        var dis = e.pageY - scrollbar.box.offsetTop - vslider.offsetTop;
        scrollbar.content.style.userSelect = 'none';            //防止拖动滚动条的时候选中元素,ie不兼容

        document.onmousemove = function(e) {
            vslider.style.top = e.pageY - scrollbar.box.offsetTop - dis + 'px';
            scrollbar.content.style.top = '-' + vslider.offsetTop / scrollbar.vv + 'px';

            if(vslider.offsetTop < 0) {     //拖到最顶端
                vslider.style.top = scrollbar.content.style.top = 0;
            }else if(vslider.offsetTop + vslider.offsetHeight > scrollbar.rightBar.offsetHeight) {      //拖到最底端
                vslider.style.top = scrollbar.rightBar.offsetHeight - vslider.offsetHeight + 'px';
                scrollbar.content.style.top = scrollbar.box.offsetHeight - scrollbar.content.offsetHeight + 'px';
            }
            e.preventDefault();
        }

        document.onmouseup = function() {
            scrollbar.content.style.userSelect = scrollbar.userSelect;
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
}


//点击横向滚动栏中的一点，滑块向左、右移动
ScrollBar.prototype.clickBottomBar = function() {
    var scrollbar = this;
    this.bottomBar.onclick = function(e) {
        var mouseLeft = e.pageX - scrollbar.box.offsetLeft;
        var v1 = this.offsetWidth / (scrollbar.content.offsetWidth - scrollbar.box.offsetWidth);
        var v2 = (this.offsetWidth - scrollbar.hslider.offsetWidth) / this.offsetWidth;
        animate(scrollbar.content, {'left': '-' + parseInt(mouseLeft / v1)});
        animate(scrollbar.hslider, {'left': parseInt(mouseLeft * v2)});
    }

    for(var i = 0; i < this.bottomBar.childNodes.length; i++) {
        this.bottomBar.childNodes[i].onclick = function(e) {
            e.stopPropagation();
        }
    }
}

//拖动横向滚动条里的滑块
ScrollBar.prototype.moveHslider = function() {
    var scrollbar = this;
    this.hslider.onmousedown = function(e) {
        var hslider = this;
        var dis = e.pageX - scrollbar.box.offsetLeft - hslider.offsetLeft;
        scrollbar.content.style.userSelect = 'none';          //防止拖动滚动条的时候选中元素,ie不兼容

         document.onmousemove = function(e) {
             hslider.style.left = e.pageX - scrollbar.box.offsetLeft - dis + 'px';
             scrollbar.content.style.left = '-' + parseInt(hslider.offsetLeft / scrollbar.vh) + 'px';

             if(hslider.offsetLeft < 0) {       //拖到最左端
                 hslider.style.left = scrollbar.content.style.left = 0;
             }else if(hslider.offsetLeft + hslider.offsetWidth > scrollbar.bottomBar.offsetWidth) {     //拖到最右端
                 hslider.style.left = scrollbar.bottomBar.offsetWidth - hslider.offsetWidth + 'px';
                 scrollbar.content.style.left = scrollbar.box.offsetWidth - parseInt(getStyle(scrollbar.content, 'width')) + 'px';       //解决chrome下不知何原因scrollbar.content.offsetWidth不停变动的bug
             }
             e.preventDefault();
         }

         document.onmouseup = function() {
             scrollbar.content.style.userSelect = scrollbar.userSelect;
             document.onmousemove = null;
             document.onmouseup = null;
         }
     }
}

//是滚动条滑块回到最上、最左侧
ScrollBar.prototype.backToOrigin = function() {
    this.vslider ? this.vslider.style.top = this.content.style.top = 0: 0;
    this.hslider ? this.hslider.style.left = this.content.style.left = 0 : 0;
}