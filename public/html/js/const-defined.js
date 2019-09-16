var CONST_URL = 'http://192.168.42.27:8005/p2/';
var CONST_API_USER = CONST_URL + 'user/';
var CONST_API_AREA = CONST_URL + 'area/';
var CONST_API_DEV = CONST_URL + 'dev/';
var CONST_API_ALARM = CONST_URL + 'breakdown/';
var CONST_API_ORDER = CONST_URL + 'order/';
var CONST_API_TIMETEMP = CONST_URL + 'timetemplate/';
var CONST_API_CHECKDEVPLAN = CONST_URL + 'checkdevplan/';
var CONST_API_OTHER = CONST_URL + 'other/';
var CONST_API_SYS = CONST_URL + 'sys/';
var CONST_API_PROJECT = CONST_URL + 'project/';
var CONST_ALARM_IMAGE_URL = 'http://192.168.42.27:8005/p/image';

//页码
var CONST_PAGE_SIZE = '25'; //每页显示条数
var CONST_PAGE_SHOW_NUM = '5'; //显示页码数

//首页数据更新时间间隔
var CONST_REFRESH_TIME = '60000';

//颜色
var CONST_YELLOW_COLOR = 'rgb(255, 206, 66)';
var CONST_RED_COLOR = 'rgb(216, 0, 0)';
var CONST_GREEN_COLOR = 'rgb(81, 220, 46)';
var CONST_ACTIVE_COLOR = 'rgb(83, 187, 235)';

//页眉
var CONST_TITLE = '运维管理系统';
var CONST_REAL_TIME_DATA = '实时数据';
var CONST_ALARM_MANAGE = '告警管理';
var CONST_SHEET_MANAGE = '工单管理';
var CONST_DEV_FILE = '设备档案';
var CONST_OPERATION_DATA = '运维数据';
var CONST_SYSTEM_SETTING = '系统设置';
var CONST_CHECK_LOG = '检测日志';

//视频设备参数
var CONST_LAST_LOGIN_TIME = '最后上线时间';
var CONST_LAST_LOGIN_GPS = '最后上线地点';
var CONST_LAST_USE_TIME = '最后使用时长';
var CONST_WEEK_ONLINE = '本周在线时长/次数';
var CONST_SIGNAL_LOST = '信号丢失';
var CONST_LIGHT_ABNORMAL = '亮度异常';
var CONST_COLOR_CAST = '偏色';
var CONST_CLEAR_ABNORMAL = '清晰度异常';
var CONST_COVER = '遮挡';
var CONST_SCROLLING = '滚屏';
var CONST_NOISE = '噪声干扰';
var CONST_STREAK = '条纹干扰';
var CONST_FREEZING = '画面冻结';
var CONST_SHAKE = '抖动';
var CONST_STREAM_CUT = '视频流中断';
var CONST_SERVER_ERROR = '服务链路故障';

//设备参数
var CONST_ONLINE = '在线';
var CONST_NETWORK = '网络';
var CONST_RAM = '内存占用率';

//设备状态
var CONST_ABNORMAL = '0';
var CONST_NORMAL = '1';

//确认、清除、修改、信息按钮
var CONST_CONFIRM = '确认';
var CONST_CLEAN = '清除';
var CONST_MODIFY = '更改信息';
var CONST_INFO = '详细信息';
var CONST_DELETE = '删除';
var CONST_MODIFY_ELE = '修改';
var CONST_IGNORE = '忽略';

//筛选条件不限
var CONST_ALL = '全部';

//未知信息
var CONST_UNKNOWN = '未知';

//无最新告警信息
var CONST_NO_ALARM = '此设备当前没有未处理的告警信息';

//设备类型
var CONST_MOVING_DEV = 'gpscheck';
var CONST_VIDEO_DEV = 'videodignosis';

//设备类型下拉列表控件
var CONST_DEV_TYPE = '设备类型';
var CONST_SERVER_DEV = '服务器设备';
var CONST_VIDEO_DEV = '视频设备';
var CONST_STORAGE_DEV = '存储设备';
var CONST_APP_DEV = '应用设备';
var CONST_AVCON_MOVING_DEV = '移动视频设备';


//告警来源
var CONST_ALARM_FROM = '告警来源';
// var CONST_STATUS_NORMAL = '正常';
// var CONST_STATUS_ABNORMAL = '异常';


//设备状态下拉列表控件
var CONST_DEV_STATUS = '设备状态';
var CONST_STATUS_NORMAL = '正常';
var CONST_STATUS_ABNORMAL = '异常';

//告警等级下拉列表控件
var CONST_ALARM_LEVEL = '告警等级';
var CONST_LEVEL_NOTICE = '提醒';
var CONST_LEVEL_IMPORT = '重要';
var CONST_LEVEL_URGENCY = '紧急';

//告警确认状态
var CONST_CONFIRM_STATUS = '确认状态';
var CONST_ALARM_CHECKED = '已确认';
var CONST_ALARM_UNCHECKED = '待确认';
var CONST_HAS_IGNORED = '已忽略';

//厂家
var CONST_MANUFACTURER = '厂商';
var CONST_HAIKANG = 'hikvsion';
var CONST_DAHUA = 'Dahua';
var CONST_TIANDI = 'tiandy';
var CONST_AVCON = 'avcon';

//工期
var CONST_STAGE = '工期';
var CONST_STAGE1 = '一期';
var CONST_STAGE2 = '二期';
var CONST_STAGE3 = '三期';


//实时数据页面表格
var CONST_DEV_NAME = '设备名称';
var CONST_DEV_IP = '设备IP';
var CONST_DEV_TYPE = '设备类型';
var CONST_CHECK_TIME = '检测时间';
var CONST_MARK = '备注';
var CONST_DETAIL_INFO = '详情';

//告警管理页面表格
var CONST_ALARM_ID = '告警ID';
var CONST_ALARM_TYPE = '设备类型';
var CONST_ALARM_GRADE = '告警等级';
var CONST_ALARM_TIME = '告警时间';
var CONST_ALARM_INFO = '告警信息';
var CONST_ALARM_STATE = '告警状态';
var CONST_ALARM_IMAGE = '图片';
var CONST_ALARM_HANDLE = '操作';

//新建工单表格
var CONST_SELECT_ALL = '全选';
var CONST_CONFIRM_PERSON = '确认人员';

//待办工单表格
var CONST_SHEET_NUM = '单号';
var CONST_SHEET_STATUS = '状态';
var CONST_WORKER = '维修人员';
var CONST_CREATE_TIME = '生成时间';
var CONST_DEADLINE = '限定时间';
var CONST_SHEET_HANDLE = '操作';
var CONST_SUBMIT_PERSON = '报修人员';
var CONST_FINISH_TIME = '完成时间';
var CONST_CREATE_ORDER = '生成工单';

//设备档案表格
var CONST_BUILD_TIME = '建设时间';
var CONST_HISTORY = '维修历史';
var CONST_SEE_DETAIL = '查看';

//设备维修状态
var CONST_TO_REPAIR = '待维修员确认';
var CONST_REJECTREPAIR = '拒绝维修';
var CONST_REPAIRING = '维修中';
var CONST_TO_CLOSE = '已维修';
var CONST_CLOSED = '已关闭';

//设备维修操作
var CONST_OPERATE = '操作';
var CONST_CLOSE_ORDER = '关闭工单';
var CONST_RESTART_ORDER = '重启工单';

//查看修改记录对话框
var CONST_MODIFY_TIME = '修改时间';
var CONST_MODIFY_PRESON = '操作人员';
var CONST_OLD_STATUS = '原状态';
var CONST_NEW_STATUS = '新状态';

//维修历史对话框表格
var CONST_TROUBLE_DES = '故障描述';
var CONST_BREAKDOWN_DATE = '故障时间';
var CONST_REPAIR_DATE = '维修完成时间';

//用户
var CONST_ADD_USER = '添加用户';
var CONST_MODIFY_USER = '修改用户';
var CONST_DELETE_USER = '删除用户';
var CONST_USER_INFO = '用户信息';
var COSNT_USER_ROLE = '用户角色';
var CONST_PW_PLACEHOLDER = '选填，不填则不修改';
var CONST_EMPTY_OK = '选填';
var CONST_DELETE_USER_INFO = '是否确认删除此用户？';
var CONST_AREA_PLACEHOLDER = '点击左侧区域选择';

//数据字典表格
var CONST_ELE_NAME = '元素名称';
var CONST_ELE_VALUE = '元素值';
var CONST_ELE_RULE = '规则';
var CONST_ELE_HANDLE = '操作';

//数据字典数据类型
var CONST_DATA_DEFAULT = '默认值';
var CONST_DATA_REGEXP = '正则';
var CONST_DATA_NUMBER = '仅限数字';
var CONST_DATA_NONE = '无';

//删除告警对话框
var CONST_IGNORE_ALARM_TITLE = '忽略告警';
var CONST_IGNORE_ALARM_INFO = '是否确认忽略该条报警信息？';
var CONST_IGNORE_BTN = '忽 略';

//删除元素对话框
var CONST_DELETE_ELE_TITLE = '删除元素';
var CONST_DELETE_ELE_INFO = '是否确认删除此元素？';

//数据字典添加、修改元素对话框title
var CONST_MODIFY_ELEMENT = '修改元素';
var CONST_ADD_ELEMENT = '添加元素';
var CONST_ADD_BTN = '添 加';
var CONST_MODIFY_BTN = '修 改';
var CONST_DELETE_BTN = '删 除';

//资源管理
var CONST_ADD_AREA = '添加区域';
var CONST_MODIFY_AREA = '修改区域';
var CONST_AREA_INFO = '区域信息';
var CONST_MODIFY_AREA_TIP = '上级区域不能为该区域的下级区域或该区域本身';
var CONST_DELETE_AREA_TITLE = '删除区域';
var CONST_DELETE_AREA_INFO = '区域删除后该区域下的设备也会被删除，是否确认删除此区域？';
var CONST_ADD_DEV = '添加设备';
var CONST_MODIFY_DEV = '修改设备';
var CONST_DEV_INFO = '设备信息';
var CONST_DELETE_DEV_TITLE = '删除设备';
var CONST_DELETE_DEV_INFO = '是否确认删除此设备？';

//模板
var CONST_ADD_TEM = '添加模板';
var CONST_MODIFY_TEM = '修改模板';
var CONST_DELETE_TEM = '删除模板';
var CONST_TEM_INFO = '模板信息';
var CONST_DELETE_TEM_INFO = '删除是时间模板后，已关联该模板的巡检计划将无法正常执行，<br/>是否确认删除此模板？';

//巡检组
var CONST_CHECK_GROUP_INFO = '巡检组信息';
var CONST_ADD_CHECK_GROUP = '添加巡检组';
var CONST_MODIFY_CHECK_GROUP = '修改巡检组';
var CONST_DELETE_CHECK_GROUP = '删除巡检组';
var CONST_DELETE_GROUP_INFO = '删除巡检组后，已关联该巡检组的巡检计划将无法正常执行，<br/>是否确认删除此巡检组？';

//计划
var CONST_CHECK_GROUP = '巡检组';
var CONST_TIME_TEMP = '时间模板';
var CONST_PLAN_INFO = '计划信息';
var CONST_ADD_PLAN = '添加计划';
var CONST_MOFIDY_PLAN = '修改计划';
var CONST_DELETE_PLAN = '删除计划';
var CONST_DELETE_PLAN_INFO = '是否确认删除此巡检计划？';
var CONST_NO_GROUP = '请先添加巡检组';
var CONST_NO_TIME_TEMP = '请先添加时间模板';
var CONST_NEED_ADD_GROUP_TEMP = '请先添加巡检组和时间模板';

//时间选择错误提示
var CONST_TIME_TIP1 = '必须大于当前时间';
var CONST_TIME_TIP2 = '所选时间段不能有重叠部分';
var CONST_TIME_TIP3 = '请选择时间段';
var CONST_TIME_TIP4 = '结束时间必须大于开始时间';
var CONST_TIME_TIP5 = '请选择执行操作';

//MCU
var CONST_MCU_INFO = 'MCU信息';
var CONST_ADD_MCU = '添加MCU';
var CONST_MODIFY_MCU = '修改MCU';
var CONST_DELETE_MCU = '删除MCU';
var CONST_DELETE_MCU_INFO = '是否确认删除此MCU？';