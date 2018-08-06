/*!
 * popoPicker.js v1.0
 * https://po-po.github.io/popoPicker
 * Released under the MIT License.
 */

;(function (window,document) {
    'use strict';

    function extend() {
        var name, options, src, copy;
        var length = arguments.length;
        var target = arguments[0];
        for (var i = 1; i < length; i++) {
            options = arguments[i];
            if (options != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }

    var popoPicker = function (el, option) {
        //触摸移动
        var self = this;
        var option = extend({
            wheels: [],
            container:'body',
            scrollType: '3d',
            background: 'light',
            display: "bottom",
            headTitle: '',
            init: function () {},
            getResult: function () {},
            save: function () {},
            cancel: function () {}
        }, option);

        var clickTarget =  document.querySelectorAll(el);
        var rows = 5;
        var itemHeight = 34;
        var itemSize2d = 9;
        var itemSize3d = 9;
        var scroll3dAngle = 360 / (itemSize3d * 2);
        var rs = {
            result: [],
            scrollIdx: null,
            scrollEvt: []
        };

        function getselectedIdx(wheel) {
            var index = 0;
            for (var i = 0; i < wheel.data.length; i++) {
                if (wheel.data[i].value == wheel.selected) {
                    index = i;
                    break;
                } else {
                    index = 0;
                }
            }
            return index;
        }

        function generateItems(wheel, start, end, is3d) {
            var data = wheel.data;
            var html = '',
                value,
                display,
                len = data.length,
                infinite = wheel.infinite,
                selectedIdx = getselectedIdx(wheel);

            //选中的位置
            start += selectedIdx;
            end += selectedIdx;

            for (var i = start; i <= end; i++) {
                var idx = (i < 0 ? len + (i % len) : i) % len;
                value = data[idx].value;
                display = data[idx].display;

                if (is3d) {
                    var deg = 0;
                    var show = "list-item";
                    deg = -(i - selectedIdx) * scroll3dAngle % 360;

                    if (!infinite) {
                        if (i < 0 || i > (len - 1)) {
                            show = "none"
                        } else {
                            show = "list-item"
                        }
                    }
                    html += '<li data-index="' + i + '" data-val="' + value + '" style="transform:rotateX(' + deg + 'deg) translateZ(' + (itemHeight * rows / 2) + 'px); display: ' + show + '">' + display + '</li>';
                } else {
                    var opacity = 1;
                    if (!infinite) {
                        if (i < 0 || i > (len - 1)) {
                            opacity = 0
                        } else {
                            opacity = 1
                        }
                    }
                    html += '<li data-index="' + i + '" data-val="' + value + '" style="opacity: ' + opacity + '">' + display + '</li>';
                }
            }
            return html;
        }

        function createEl(wheels) {
            var html = '';
            html += '<div class="p-select-wrap '+ (option.scrollType == '3d' ? 'p-3d' : '') + (option.display == 'center' ? ' p-center' : '') +(option.background == 'dark' ? ' dark' : '')+'">';
            html += '<div class="p-select-main">';
            html += '<div class="p-select-head">';
            if (option.display != 'center') {
                html += '<a href="javascript:void(0)" class="p-select-cancel-btn">取消</a>';
            }
            if (option.headTitle != '') {
                html += '<div class="p-select-title">' + option.headTitle + '</div>';
            }
            if (option.display != 'center') {
                html += '<a href="javascript:void(0)" class="p-select-submit-btn">确认</a>';
            }
            html += '</div>';
            html += '<div class="p-select-body">';
            html += '<div class="p-select-line" '+ (option.scrollType=='3d' ? 'style="transform: translateZ(' + (itemHeight * rows / 2 + 4) + 'px)"':'') +'></div>';
            for (var i = 0; i < wheels.length; i++) {
                var label = wheels[i].label;
                html += '<div class="p-select-item">';
                html += '<div class="p-select-col">';
                html += '<div class="p-select-list" '+ (option.scrollType=='3d' ? 'style="transform: translateZ(' + (itemHeight * rows / 2 +3) + 'px)"':'') +'>';
                html += '<ul class="p-select-ul">';
                html += generateItems(wheels[i], -itemSize2d, itemSize2d, false);
                html += '</ul>';
                html += '</div>';
                if (option.scrollType == '3d') {
                    html += '<ul class="p-select-wheel">';
                    html += generateItems(wheels[i], -itemSize3d, itemSize3d, true);
                    html += '</ul>';
                }
                html += '</div>';
                if (label) {
                    html += '<div class="p-select-col p-select-label" '+ (option.scrollType=='3d' ? 'style="transform: translateZ(' + (itemHeight * rows / 2 + 4) + 'px)"':'') +'>' + label + '</div>';
                }
                html += '</div>';
            }
            html += '</div>';
            if (option.display == 'center') {
                html += '<div class="p-select-foot">';
                html += '<a href="javascript:void(0)" class="p-select-cancel-btn">取消</a>';
                html += '<a href="javascript:void(0)" class="p-select-submit-btn">确认</a>';
                html += '</div>';
            }
            html += '</div>';
            html += '<div class="p-select-mask"></div>';
            html += '</div>';

            var node = document.createElement("div");
            node.className = "p-scroll";
            node.innerHTML = html;
            document.querySelector(option.container).appendChild(node)
        }

        function snap(pos) {
            var pos = Math.round(pos),
                n1 = Math.round(pos % itemHeight),
                n2 = itemHeight / 2;

            if (Math.abs(n1) < n2) {
                return pos - n1;
            } else {
                return pos - n1 + (pos > 0 ? itemHeight : -itemHeight);
            }
        }

        function getVal(pos, data, infinite, selectedIdx) {
            var len = data.length,
                index = (Math.round(-pos / itemHeight) - itemSize2d + selectedIdx) % len,
                index = index < 0 ? len + index : index,
                dataIndex = Math.round(-pos / itemHeight) - itemSize2d + selectedIdx,
                result = {
                    value: data[index].value,
                    display: data[index].display,
                    dataIndex: dataIndex
                };
            return result;
        }

        function getPosition(el) {
            var style = getComputedStyle(el),
                matrix,
                pref = ['t', 'webkitT', 'MozT', 'OT', 'msT'],
                px;
            for (var i = 0; i < pref.length; i++) {
                var v = pref[i];
                if (style[v + 'ransform'] !== undefined) {
                    matrix = style[v + 'ransform'];
                    break;
                }
            }

            matrix = matrix.split(')')[0].split(', ');
            px = Number(matrix[13] || matrix[5]);
            return px;
        }

        function isPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            var flag = true;
            for (var i = 0; i < Agents.length; i++) {
                if (userAgentInfo.indexOf(Agents[i]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }

        function destroy() {
            rs = {
                result: [],
                scrollIdx: 0,
                scrollEvt :[],
            };
            var box = document.querySelector('.p-scroll');
            box.className += ' hide';
            setTimeout(function () {
                box.remove();
            }, 300)
        }

        this.Scroll = function (el, wheel, index, opt) {
            this.el = el;
            this.wheel = wheel;
            this.index = index;
            this.opt = extend({
                data: this.wheel.data,
                scrollEl2d: el.querySelector('.p-select-ul'),
                item2d: el.querySelectorAll('.p-select-ul li'),
                scrollY: -itemHeight * itemSize2d,
                marginTop: 0,
                dataLen: this.wheel.data.length,
                lastY: 1,
                moveY: 0,
                current: 0,
                infinite: this.wheel.infinite,
                rotateX: 0,
                selectedIdx: getselectedIdx(wheel),
                transTimer: null,
                scrollTimer: null,
                clickDown: false,
                inertia: true
            }, opt);
            if (option.scrollType == "3d") {
                this.opt.scrollEl3d = el.querySelector('.p-select-wheel');
                this.opt.item3d = el.querySelectorAll('.p-select-wheel li');
            }
            this.defaultScrollY = this.opt.scrollY;
            this.init();
        };

        this.Scroll.prototype = {
            init: function () {
                this.Run(0, this.opt.scrollY);
                if (isPC()) {
                    this.el.addEventListener('mousedown', this.touchStart.bind(this), false);
                    document.addEventListener('mousemove', this.touchMove.bind(this), false);
                    document.addEventListener('mouseup', this.touchEnd.bind(this), false);
                } else {
                    this.el.addEventListener('touchstart', this.touchStart.bind(this), false);
                    this.el.addEventListener('touchmove', this.touchMove.bind(this), false);
                    this.el.addEventListener('touchend', this.touchEnd.bind(this), false);
                    this.el.addEventListener('touchcancel', this.touchEnd.bind(this), false);
                }

                var self = this;
                if (option.scrollType == '3d') {
                    //3d点击事件
                    this.itemClick(this.opt.item3d);
                } else {
                    //2d点击事件
                    this.itemClick(this.opt.item2d);
                }
            },
            itemClick: function (itemObj) {
                var self = this;
                for (var i = 0; i < itemObj.length; i++) {
                    itemObj[i].addEventListener('click', function (e) {
                        self.opt.inertia = false;
                        var curIdx = Number(e.target.dataset.index);
                        var lastIdx = rs.result[self.index].dataIndex;
                        var diff = curIdx - lastIdx;
                        self.cusTouch(diff);
                    }, false)
                }
            },
            Run: function (interval, pos) {
                if (interval == 0) {
                    this.opt.scrollEl2d.style.webkitTransition = "none";
                    if (option.scrollType == "3d") {
                        this.opt.scrollEl3d.style.webkitTransition = "none";
                    }
                } else {
                    this.opt.scrollEl2d.style.webkitTransition = "transform cubic-bezier(0.190, 1.000, 0.220, 1.000) " + interval + "ms";
                    if (option.scrollType == "3d") {
                        this.opt.scrollEl3d.style.webkitTransition = "transform cubic-bezier(0.190, 1.000, 0.220, 1.000) " + interval + "ms";
                    }
                }
                this.opt.scrollEl2d.style.webkitTransform = "translate3d(0," + pos + "px, 0)";
                if (option.scrollType == "3d") {
                    pos = Math.round(-(pos * (scroll3dAngle / itemHeight)) - 180);
                    this.opt.scrollEl3d.style.webkitTransform = "rotateX(" + pos + "deg) translate3d(0,0,0)";
                }
            },
            scrollDone: function () {
                clearInterval(this.opt.scrollTimer);
                clearTimeout(this.opt.transTimer);
            },
            onMove: function (pos, cusDiff) {
                var self = this,
                    pos = pos || getPosition(this.opt.scrollEl2d),
                    index = Math.round(-pos / itemHeight) - itemSize2d,
                    diff = index - this.opt.current;

                if (cusDiff != undefined || diff) {
                    this.opt.current = index;

                    //2D
                    for (var i = 0; i < this.opt.item2d.length; i++) {
                        var item = this.opt.item2d[i];
                        var index = Number(item.getAttribute("data-index")) + diff,
                            len = self.opt.dataLen,
                            idx = (index < 0 ? len + (index % len) : index) % len,
                            val = self.opt.data[idx].value,
                            display = self.opt.data[idx].display;

                        if (!self.opt.infinite) {
                            if (index < 0 || index > (len - 1)) {
                                item.style.opacity = "0"
                            } else {
                                item.style.opacity = "1"
                            }
                        }

                        item.setAttribute("data-index", index);
                        item.setAttribute("data-val", val);
                        item.innerText = display;
                    }

                    if (option.scrollType == "3d") {
                        //3D
                        for (var i = 0; i < this.opt.item3d.length; i++) {
                            var item = this.opt.item3d[i];
                            var index = Number(item.getAttribute("data-index")) + diff,
                                len = self.opt.dataLen,
                                idx = (index < 0 ? len + (index % len) : index) % len,
                                val = self.opt.data[idx].value,
                                deg = -(index - self.opt.selectedIdx) * scroll3dAngle,
                                display = self.opt.data[idx].display;
                            if (!self.opt.infinite) {
                                if (index < 0 || index > (len - 1)) {
                                    item.style.display = "none"
                                } else {
                                    item.style.display = "list-item"
                                }
                            }
                            item.setAttribute("data-index", index);
                            item.setAttribute("data-val", val);
                            item.setAttribute("data-idx", idx);
                            item.innerText = display;
                            item.style.webkitTransform = "rotateX(" + deg + "deg) translateZ(" + (itemHeight * rows / 2) + "px)";
                        }
                    }

                    //2d margin-top
                    this.opt.marginTop += diff * itemHeight;
                    this.opt.scrollEl2d.style.marginTop = this.opt.marginTop + "px";
                }
            },
            touchStart: function (e) {
                if (e.type == 'touchstart') {
                    this.opt.startY = e.targetTouches["0"].clientY;
                } else {
                    this.opt.startY = e.clientY;
                    this.opt.clickDown = true;
                }
                this.opt.startTime = new Date();
            },
            touchMove: function (e) {
                if (e.type == 'touchmove') {
                    e.preventDefault();
                    for (var i = 0; i < e.targetTouches.length; i++) {
                        this.opt.curY = e.targetTouches[i].clientY;
                    }
                } else {
                    if (this.opt.clickDown) {
                        this.opt.curY = e.clientY;
                    } else {
                        return false;
                    }
                }

                this.opt.moveY = this.opt.curY - this.opt.startY;
                this.opt.distance = this.opt.scrollY + this.opt.moveY;

                if (this.opt.curY < this.opt.lastY) {
                    //move up
                    this.opt.direction = 1;
                } else if (this.opt.curY > this.opt.lastY) {
                    //move down
                    this.opt.direction = -1;
                }

                if (this.opt.direction) {
                    this.onMove();
                    this.opt.lastY = this.opt.curY;
                    this.Run(0, this.opt.distance);
                }
            },
            touchEnd: function (e) {
                if (e.type == 'touchend') {
                    this.opt.lastY = e.changedTouches["0"].clientY;
                } else {
                    if (this.opt.clickDown) {
                        this.opt.lastY = e.clientY;
                        this.opt.clickDown = false;
                    } else {
                        return false;
                    }
                }
                this.opt.endTime = new Date();

                var self = this,
                    interval = this.opt.endTime - this.opt.startTime,
                    speed = 500,
                    addPos = 0;

                //模拟惯性
                if (this.opt.inertia && interval < 300) {
                    speed = Math.abs(this.opt.moveY / interval);
                    speed = Math.round(speed * 1000);
                    addPos = speed / 3 * (this.opt.moveY < 0 ? -1 : 1);
                    speed = speed < 500 ? 500 : speed;
                } else {
                    addPos = this.opt.moveY;
                    this.opt.inertia = true
                }

                this.opt.scrollY += snap(addPos);
                this.opt.moveY = 0;

                clearInterval(this.opt.scrollTimer);
                this.opt.scrollTimer = setInterval(function () {
                    self.onMove();
                }, 100);


                clearTimeout(this.opt.transTimer);
                this.opt.transTimer = setTimeout(function () {
                    self.onMove();
                    self.scrollDone();
                }, speed);

                //非无限滚动阈值
                if (!this.opt.infinite) {
                    var maxScroll = this.opt.selectedIdx * itemHeight - itemHeight * itemSize2d;
                    var minScroll = this.opt.selectedIdx * itemHeight - itemHeight * (this.opt.dataLen - 1) - itemHeight * itemSize2d;
                    if (this.opt.scrollY > maxScroll) {
                        this.opt.scrollY = maxScroll;
                    } else if (this.opt.scrollY < minScroll) {
                        this.opt.scrollY = minScroll;
                    }
                }

                this.Run(speed, this.opt.scrollY);

                var res = getVal(this.opt.scrollY, this.opt.data, this.opt.infinite, this.opt.selectedIdx);
                rs.result[this.index] = res;
                rs.scrollIdx = this.index;
                option.getResult(rs);
            },
            cusTouch: function (diff) {
                var e1 = {
                    clientY: 0,
                    targetTouches: [{clientY: 0}],
                    type: "click"
                };
                var e2 = {
                    clientY: -itemHeight * diff,
                    targetTouches: [{clientY: -itemHeight * diff}],
                    type: "click"
                };
                var e3 = {
                    clientY: -itemHeight * diff,
                    changedTouches: [{clientY: -itemHeight * diff}],
                    type: "click"
                };
                this.touchStart(e1)
                this.touchMove(e2);
                this.touchEnd(e3);
            },
            scrollTo: function (val, interval) {
                this.wheel.selected = val;
                var selectedIdx = getselectedIdx(this.wheel);
                var diff = this.opt.selectedIdx - selectedIdx;
                this.opt.scrollY = this.defaultScrollY + diff * itemHeight;
                this.Run(interval, this.opt.scrollY);
                this.onMove(this.opt.scrollY, true);
            },
            removeItem: function (valArr) {
                var data = this.opt.data,
                    resultVal = rs.result[this.index].value,
                    removeLen = 0,
                    moveEnd = false;

                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < valArr.length; j++) {
                        if (data[i].value == valArr[j]) {
                            //移除
                            data.splice(i--, 1);
                            removeLen++;
                        } else {
                            if (valArr[j] == resultVal) {
                                moveEnd = true;
                            }
                        }
                    }
                }

                if (moveEnd) {
                    rs.result[this.index] = {
                        value: data[data.length - 1].value,
                        display: data[data.length - 1].display
                    }

                }
                this.opt.dataLen = data.length;
                this.scrollTo(rs.result[this.index].value, 0);
            },
            appendItem: function (valArr) {
                var data = this.opt.data;

                //去重
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < valArr.length; j++) {
                        if (data[i].value == valArr[j].value) {
                            valArr.splice(j--, 1)
                        }
                    }
                }

                //添加
                for (var i = 0; i < valArr.length; i++) {
                    data.push(valArr[i]);
                }

                this.opt.dataLen = data.length;
                this.scrollTo(rs.result[this.index].value, 0);
            }
        };

        function init(wheels, target) {
            //创建DOM
            createEl(wheels);
            var el = document.querySelectorAll(".p-select-item");
            for (var i = 0; i < el.length; i++) {
                //滚动事件
                var scroll = new self.Scroll(el[i], wheels[i], i);

                //初始结果
                var res = getVal(scroll.opt.scrollY, scroll.opt.data, scroll.opt.infinite, scroll.opt.selectedIdx);
                rs.result.push(res);
                rs.scrollEvt.push(scroll);
                rs.scrollIdx = 0;
            }
            //传出初始结果
            option.init(rs);

            var submitBtn = document.querySelector('.p-select-submit-btn'),
                cancelBtn = document.querySelector('.p-select-cancel-btn'),
                mask = document.querySelector('.p-select-mask');
            submitBtn.addEventListener('click', function () {
                var attr_rs = [],
                    display = [];
                for (var i = 0; i < rs.result.length; i++) {
                    attr_rs.push(rs.result[i].value);
                    display.push(rs.result[i].display)
                }
                target.setAttribute('data-value', attr_rs);

                if(target.isInput){
                    target.value = display;
                }else{
                    target.innerText = display;
                }

                option.getResult(rs);
                option.save(rs, target);
                self.target = target;
                destroy()
            }, false);
            cancelBtn.addEventListener('click', function () {
                option.cancel();
                destroy()
            }, false);
            mask.addEventListener('click', function () {
                option.cancel();
                destroy()
            }, false);
            document.querySelector('.p-scroll').addEventListener('touchmove', function (e) {
                e.preventDefault()
            }, false);
        }

        for (var i = 0; i < clickTarget.length; i++) {
            var item = clickTarget[i],
                wheels =  option.wheels,
                isInput = item.localName == 'input' || item.localName == 'textarea',
                attr_rs = item.getAttribute('data-value');
            if(attr_rs){
                attr_rs = attr_rs.split(',');
                var display = [];
                for (var j=0;j<attr_rs.length;j++){
                    wheels[j].selected = attr_rs[j];
                    var idx = getselectedIdx(wheels[j])
                    display.push(wheels[j].data[idx].display)
                }
                if(isInput){
                    item.value = display;
                }else{
                    item.innerText = display;
                }
            }
            if(isInput){
                item.setAttribute('readonly',"readonly");
                item.setAttribute('unselectable','on');
            }
            item.addEventListener('click', function () {
                var target = this,
                    wheelsCopy = JSON.parse(JSON.stringify(wheels)),
                    attr_rs = target.getAttribute('data-value');
                target.isInput = isInput;
                if(isInput){
                    target.blur();
                }
                if (attr_rs) {
                    attr_rs = attr_rs.split(',');
                    for (var j = 0; j < attr_rs.length; j++) {
                        wheelsCopy[j].selected = attr_rs[j];
                    }
                    init(wheelsCopy, target ,isInput);
                }else{
                    init(wheels, target, isInput);
                }
            }, false)
        }
    };

    var popoDateTime = function(el,opt){
        var opt = extend({
            container:'body',
            scrollType: "3d",
            background:'light',
            showLabel: true, //显示label
            labelType:'symbol', //symbol符号 text文字 split分割(需date和time同时存在)
            display:"bottom",
            headResult: false,
            date:true,
            time:true,
            beginYear: new Date().getFullYear()-100,
            endYear:new Date().getFullYear()+100,
            startDate: '',
            save:function(){},
            cancel:function(){}
        },opt);

        function addZero(num){
            return num<10?"0"+num:String(num);
        }

        var d = new Date(),
            year = d.getFullYear(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            hour = d.getHours(),
            minute = d.getMinutes(),
            beginYear = opt.beginYear,
            endYear = opt.endYear,
            yearData = [],
            monthData = [],
            dayData = [],
            hourData = [],
            minuteData = [],
            lastValue = '',
            wheels = [
                {
                    infinite: false,
                    selected: addZero(year),
                    label:"<span>-</span>",
                    data: yearData
                },
                {
                    infinite: true,
                    selected: addZero(month),
                    label:"<span>-</span>",
                    data: monthData
                },
                {
                    infinite: true,
                    selected: addZero(day),
                    label:"",
                    data: dayData
                },
                {
                    infinite: true,
                    selected: addZero(hour),
                    label:"<span>:</span>",
                    data: hourData
                },
                {
                    infinite: true,
                    selected: addZero(minute),
                    label:"",
                    data: minuteData
                },
            ];

        for(var i=beginYear;i<=endYear;i++){
            yearData.push({value:addZero(i),display:addZero(i)});
        }
        //月
        for(var i=1;i<=12;i++){
            monthData.push({value:addZero(i),display:addZero(i)});
        }
        //日
        for(var i=1;i<=31;i++){
            dayData.push({value:addZero(i),display:addZero(i)});
        }
        //时
        for(var i=0;i<=23;i++){
            hourData.push({value:addZero(i),display:addZero(i)});
        }
        //分
        for(var i=0;i<=59;i++){
            minuteData.push({value:addZero(i),display:addZero(i)});
        }

        //判断显示日期/时间
        if(!opt.date){
            wheels.splice(0,3);
        }
        if(!opt.time){
            wheels.splice(3,5);
            wheels[2].label = " ";
        }


        //Label控制
        if(!opt.showLabel){
            for(var i=0;i<wheels.length;i++){
                delete wheels[i].label;
            }
        }else{
            if(opt.labelType == 'text'){
                var text = ['年','月','日','时','分','秒']
                for(var i=0;i<wheels.length;i++){
                    wheels[i].label = text[i];
                }
            }
            if(opt.labelType == 'split' && opt.date && opt.time){
                for(var i=0;i<wheels.length;i++){
                    delete wheels[i].label;
                }
                wheels[2].label='<div class="p-select-time-split-1"></div>';
            }
        }

        //判断闰年
        function isLeapYear(year) {
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                return true;
            } else {
                return false;
            }
        }

        //判断大小月
        function bigSmallMonth(dayObj,year,month){
            var smallMonth = (month=="04" || month=="06" || month=="09" || month=="11");
            dayObj.appendItem(
                [
                    {value:"29",display:"29"},
                    {value:"30",display:"30"},
                    {value:"31",display:"31"}
                ]
            );
            if(smallMonth){
                dayObj.removeItem(["31"]);
            }else if(month=="02"){
                if(isLeapYear(year)){
                    dayObj.removeItem(["30","31"]);
                }else{
                    dayObj.removeItem(["29","30","31"]);
                }
            }
        }

        //获取结果
        function getLastVal(result) {
            if(result.length==5){
                lastValue = result[0].display+'-'+result[1].display+'-'+result[2].display+' '+result[3].display+':'+result[4].display;
            }else if (result.length==3){
                lastValue = result[0].display+'-'+result[1].display+'-'+result[2].display;
            } else{
                lastValue = result[0].display+':'+result[1].display;
            }
            if(opt.headResult){
                var title = document.querySelector('.p-select-title');
                title.innerText = lastValue;
            }
        }

        //日期滚轮
        var p = new popoPicker(el,{
            wheels: wheels,
            scrollType:opt.scrollType,
            background: opt.background,
            display:opt.display,
            headTitle:opt.headResult?1:'',
            container:opt.container,
            init:function(rs){
                if(opt.date){
                    var year = rs.result[0].value;
                    var month = rs.result[1].value;
                    bigSmallMonth(rs.scrollEvt[2],year,month);
                }
                getLastVal(rs.result)
            },
            getResult:function(rs){
                var n1 = opt.date && (rs.scrollIdx== 0 || rs.scrollIdx== 1);
                year = rs.result[0].value,
                    month = rs.result[1].value;
                if(n1){
                    bigSmallMonth(rs.scrollEvt[2],year,month);
                }
                getLastVal(rs.result)
            },
            save:function(rs, target){
                if(target.isInput){
                    target.value = lastValue;
                }else{
                    target.innerText = lastValue;
                }

                opt.save(lastValue, target);
            },
            cancel:function(){
                opt.cancel();
            }
        });

        //判断是否有自定义初始值
        var target = document.querySelectorAll(el);
        for(var i=0;i<target.length;i++){
            var item = target[i],
                isInput = item.localName == 'input' || item.localName == 'textarea',
                val = isInput?item.value:item.innerText;
            if(val){
                val = val.match(/\d+/g);
                item.setAttribute('data-value',val);
            }
        }
    };

    window.popoPicker = popoPicker;
    window.popoDateTime = popoDateTime;
})(window,document);
