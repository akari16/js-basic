var myDeviceChart = {};
var myCapacityChart = {};
var myWorkChart = {};
var myAlarmChart = {};
var myCameraChart = {};
var myMoveChart = {};
var myNetChart = {};
var myServerChart = {};
var CONST_CLOSE_ANIMATION = '1';
var alarmValue = [37, 81, 10];        ///////记录当前选择告警类型的数据

window.onload = function() {
    checkToken();               //判断token，如为空则跳转到登录页面
    layout();
    deviceBarChart();           //设备总览柱形图
    serviceCapacityChart();     //运维服务能力统计图
    workSheetChart();           //工单性质统计图       
    alarmOverviewChart(alarmValue);       //告警一览 
    cameraChart(50, 30, document.getElementById('camera-chart'));              //资源运行--摄像机图表
    moveChart(136, 99, document.getElementById('move-chart'));                //资源运行--移动设备图表
    netChart(75, 60, document.getElementById('net-chart'));                 //资源运行总览--网络设备
    serverChart(30, 27, document.getElementById('server-chart'));              //资源运行总览--服务器
    // alarmMove();                //最新告警自动滚动播放
    getAlarmList();             //获取最新告警信息
    choseAlarmType();           //告警一览选择类型
}

window.onresize = function() {
    layout();
    myDeviceChart.dispose();
    myCapacityChart.dispose();
    myWorkChart.dispose();
    myAlarmChart.dispose();
    myCameraChart.dispose();
    myMoveChart.dispose();
    myNetChart.dispose();
    myServerChart.dispose();
    deviceBarChart(CONST_CLOSE_ANIMATION);           //设备总览柱形图
    serviceCapacityChart(CONST_CLOSE_ANIMATION);     //运维服务能力统计图
    workSheetChart(CONST_CLOSE_ANIMATION);           //工单性质统计图       
    alarmOverviewChart(alarmValue, CONST_CLOSE_ANIMATION);       //告警一览 
    cameraChart(50, 30, document.getElementById('camera-chart'), CONST_CLOSE_ANIMATION);              //资源运行--摄像机图表
    moveChart(136, 99, document.getElementById('move-chart'), CONST_CLOSE_ANIMATION);                //资源运行--移动设备图表
    netChart(75, 60, document.getElementById('net-chart'), CONST_CLOSE_ANIMATION);                 //资源运行总览--网络设备
    serverChart(30, 27, document.getElementById('server-chart'), CONST_CLOSE_ANIMATION);              //资源运行总览--服务器
}

//页面布局
function layout() {
    var col1Top = document.getElementsByClassName('col1-top')[0];
    var col3Top = document.getElementsByClassName('col3-top')[0];
    var col1Bottom = document.getElementsByClassName('col1-bottom')[0];
    var col3Bottom = document.getElementsByClassName('col3-bottom')[0];
    var col2 = document.getElementsByClassName('col2')[0];
    var cameraCount = document.getElementById('camera-count');
    var onlineRate = document.getElementById('online-rate');
    var intactRate = document.getElementById('intact-rate');

    col1Bottom.style.top = col1Top.offsetHeight + 16 + 'px';
    col3Bottom.style.top = col1Top.offsetHeight + 16 + 'px';
    col2.style.marginLeft = -col2.offsetWidth / 2 + 'px';
    col1Top.style.marginLeft = col1Bottom.style.marginLeft = -(col2.offsetWidth / 2 + col1Top.offsetWidth + 20) + 'px';
    col3Top.style.marginLeft = col3Bottom.style.marginLeft = col2.offsetWidth / 2 + 20 + 'px';
    cameraCount.style.marginLeft = onlineRate.style.marginLeft = intactRate.style.marginLeft = (col2.offsetWidth -300) / 4 + 'px';
}

//设备总览柱形图
function deviceBarChart(_animation) {
    myDeviceChart = echarts.init(document.getElementById('device-bar-chart'));
    _animation ? myDeviceChart.setOption({animation: false}) : myDeviceChart.setOption({animation: true});
    var option = {
        tooltip: {
            trigger: 'axis',
            textStyle: {
                fontSize: 12
            }
        },
        grid:{
            y: 30
        },
        legend: {
            data: [
                {
                    name: '在线率',
                    textStyle: {
                        color: '#fff'
                    }
                },
                {
                    name: '完好率',
                    textStyle: {
                        color: '#fff'
                    }
                }
            ]
        },
        xAxis: [
            {
                type: 'category',
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                data: ['区域A', '区域B', '区域C', '区域D', '区域E', '区域F']
            }
        ],
        yAxis:[
            {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        series: [
            {
                name: '在线率',
                type: 'bar',
                barWidth: '20',
                data: [50, 70, 56, 69, 88, 90],
                itemStyle: {
                    normal: {
                        color: 'rgb(211, 230, 105)'
                    }
                }
            },
            {
                name: '完好率',
                type: 'bar',
                barWidth: '20',
                data: [52, 69, 70, 80, 77, 60],
                itemStyle: {
                    normal: {
                        color: 'rgb(68, 114, 166)'
                    }
                }
            }
        ]
    }
    myDeviceChart.setOption(option);
}

//运维服务能力统计图
function serviceCapacityChart(_animation) {
    myCapacityChart = echarts.init(document.getElementById('service-capacity'));
    _animation ? myCapacityChart.setOption({animation: false}) : myCapacityChart.setOption({animation: true});
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: 'rgb(229, 171, 8)'
                }
            }
        },
        legend: {
            data: [
                {
                    name: '生成工单', 
                    textStyle: {
                        color: '#fff'
                    }
                },
                {
                    name: '解决工单',
                    textStyle: {
                        color: '#fff'
                    }
                }
                    
            ]
        },
        xAxis: [
            {
                type: 'category',
                data: ['极高', '高', '中', '低'],
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '生成工单',
                min: 0,
                interval: 1,
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
            },
            {
                type: 'value',
                name: '解决工单',
                min: 0,
                max: 5,
                interval: 1,
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
            }
        ],
        axisPointer: {          //坐标轴指示器
            label: {
                backgroundColor: '#333'     
            }
        },
        series: [
            {
                name: '生成工单',
                type: 'bar',
                barWidth: '20',
                data: [1, 2, 2, 5],
                itemStyle: {
                    normal: {
                        color: 'rgb(100, 255, 255)'
                    }
                }
            },
            {
                name: '解决工单',
                type: 'line',
                data: [1, 3, 3, 4],
                itemStyle: {
                    normal: {
                        color: 'rgb(211, 230, 105)'
                    }
                }
            }
        ]
    }
    myCapacityChart.setOption(option);
}

//工单性质统计图
function workSheetChart(_animation) {
    myWorkChart = echarts.init(document.getElementById('work-sheet-type'));
    _animation ? myWorkChart.setOption({animation: false}) : myWorkChart.setOption({animation: true});
    option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            data: [
                {
                    name: '故障',
                    textStyle: {
                        color: '#fff'
                    }
                },
                {
                    name: '咨询',
                    textStyle: {
                        color: '#fff'
                    }
                },
                {
                    name: '建议', 
                    textStyle: {
                        color: '#fff'
                    }
                },{
                    name: '其他',
                    textStyle: {
                        color: '#fff'
                    }
                }
            ]
        },
        color: ['rgb(255, 73, 1)', 'rgb(68, 114, 166)', 'rgb(211, 230, 105)', 'rgb(128, 80, 153)'],
        series: [
            {
                name: '工单性质',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: [
                    {value: 40, name: '故障', hoverAnimation: false,},
                    {value: 25, name: '咨询', hoverAnimation: false,},
                    {value: 50, name: '建议', hoverAnimation: false,},
                    {value: 10, name: '其他', hoverAnimation: false,}
                ]
            }
        ]
    }
    myWorkChart.setOption(option);
}

//告警一览
function alarmOverviewChart(_value, _animation) {
    myAlarmChart = echarts.init(document.getElementById('alarm-overview'));
    _animation ? myAlarmChart.setOption({animation: false}) : myAlarmChart.setOption({animation: true});
    var value = _value;
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: '50',
            y: 'middle',
            data: [
                {
                    name: '紧急',
                    textStyle: {
                        color: '#fff'
                    }
                },
                {
                    name: '重要',
                    textStyle: {
                        color: '#fff'
                    }
                },
                {
                    name: '提醒', 
                    textStyle: {
                        color: '#fff'
                    }
                }
            ]
        },
        color: ['rgb(255, 73, 1)', 'rgb(68, 114, 166)', 'rgb(211, 230, 105)'],
        series: [
            {
                name:'告警等级',
                type:'pie',
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        formatter: function() {
                            return value[0] + value[1] + value[2];
                        },
                        textStyle: {
                            fontSize: '26',
                            color: '#fff'
                        }
                    }
                },
                avoidLabelOverlap: false,
                center: ['60%', '50%'],
                radius: ['50%', '70%'],
                data: [
                    {value: value[0], name: '紧急', hoverAnimation: false,},
                    {value: value[1], name: '重要', hoverAnimation: false,},
                    {value: value[2], name: '提醒', hoverAnimation: false,}
                ]
            }
        ]
    };
    myAlarmChart.setOption(option);
}

//资源运行总览中的图表
function createChart(_total, _online, _parentNode, _animation) {
    var myChart = echarts.init(_parentNode);
    var total = _total;        //摄像机总数，该值是动态获取的
    var online = _online;        //在线设备数量
    var titleSize = 20, subTitleSize = 16, gap = 20;
    _animation ? myChart.setOption({animation: false}) : myChart.setOption({animation: true});
    if(window.innerWidth <= 1600) {
        titleSize = 16;
        subTitleSize = 12;
        gap = 10;
    }
    option = {
        title: {
            text: total,
            x: '48%',
            y: '35%',
            textAlign: "center",
            itemGap: gap,
            textStyle: {
                fontWeight: 'bold',
                fontSize: titleSize,
                color: '#eea807'
            },
            subtextStyle: {
                fontWeight: 'bold',
                fontSize: subTitleSize,
                color: '#eea807'
            },
            subtext: parseInt(online / total * 100) + '%',
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                startAngle: 225,
                color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#00a2ff'
                }, {
                    offset: 1,
                    color: '#70ffac'
                }]), 'rgba(68, 114, 166, 0.3)', 'transparent'],
                hoverAnimation: false,
                legendHoverLink: false,
                itemStyle: {
                    normal: {
                        borderColor: 'transparent',
                        borderWidth: '10'
                    },
                    emphasis: {
                        borderColor: 'transparent',
                        borderWidth: '10'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {
                        value: online
                    },
                    {
                        value: total - online
                    },
                    {
                        value: total / 3       //这个值需要占圆周的1/4
                    }
                ]
            }
        ]
    };
    myChart.setOption(option);
    return myChart;
}

//资源运行总览--摄像机图表
function cameraChart(_total, _online, _parentNode, _animation) {
    myCameraChart = createChart(_total, _online, _parentNode, _animation);
}

//资源运行总览--移动设备
function moveChart(_total, _online, _parentNode, _animation) {
    myMoveChart = createChart(_total, _online, _parentNode, _animation);
}

//资源运行总览--网络设备
function netChart(_total, _online, _parentNode, _animation) {
    myNetChart = createChart(_total, _online, _parentNode, _animation);
}

//资源运行总览--服务器
function serverChart(_total, _online, _parentNode, _animation) {
    myServerChart = createChart(_total, _online, _parentNode, _animation);
}

//最新告警自动滚动播放
function alarmMove() {
    var list = document.getElementById('alarm-list');
    var li = list.getElementsByTagName('li');
    if(list.offsetHeight > list.parentNode.offsetHeight) {
        setInterval(function() {
            list.style.top = list.offsetTop - 1 + 'px';
            if(Math.abs(list.offsetTop) > li[0].offsetHeight) {
                list.appendChild(li[0]);
                list.style.top = list.offsetTop + li[0].offsetHeight + 'px';
            }
        }, 50);
    }
}

//获取告警信息
function getAlarmList() {
    var ul = document.getElementById('alarm-list');
    getList();
    function getList() {
        ul.innerHTML = '';
        WebService.getAlarmList(localStorage.maintenanceToken, '1', CONST_PAGE_SIZE, '', '', '', '', '', '', function(_retcode, _data) {
            if(_retcode) {
                for(var i = 0; i < _data.list.length; i++) {
                    var level = '', color = '';
                    if(_data.list[i].level == 3) {
                        level = '紧急';
                        color = 'urgent';
                    }else if(_data.list[i].level == 2) {
                        level = '重要';
                        color = 'important';
                    }else if(_data.list[i].level == 1) {
                        level = '提醒';
                        color = 'notice';
                    }
                    var li = document.createElement('li');
                    li.innerHTML = '<span class="level ' + color + '">【' + level + '】</span><span class="device">【' + _data.list[i].devname + '】</span><span class="alarm-content">' + _data.list[i].describe + '</span>';
                    ul.appendChild(li);
                }
            }else{
                alert(_data);
            }
        })
    }
    setInterval(getList, CONST_REFRESH_TIME)
}

//告警一览选择类型
function choseAlarmType() {
    var tab = document.getElementById('alarm-type');
    var type = tab.getElementsByTagName('a');

    for(var i = 0; i < type.length; i++) {
        type[i].index = i;
        type[i].onclick = function() {
            for(var j = 0; j < type.length; j++) {
                if(type[j].classList.contains('active')) {
                    type[j].classList.remove('active');
                    break;
                }
            }
            this.classList.add('active');
            myAlarmChart.dispose();
            //////////模拟
            var value = [];
            switch(this.index) {
                case 0:
                    value = [37, 81, 10];
                    break;
                case 1:
                    value = [25, 17, 5];
                    break;
                case 2:
                    value = [10, 35, 26];
                    break;
                case 3:
                    value = [35, 21, 6];
                    break;
                case 4:
                    value = [12, 34, 16];
            }
            alarmOverviewChart(value);
            alarmValue = value;
        }
    }
}