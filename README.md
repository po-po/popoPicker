## 项目简介 [在线预览](https://po-po.github.io/popoPicker/ "Demo")

- popoPicker是一个仿iOS的3D滚轮选择器，支持无限循环滚动，采用原生js，不依赖任何第三方库，速度更快；

- popoDatetime是建立在popoPicker之上的3D日期时间选择器，可自定义滚动循环，背景主题、位置等信息，具备时间选择、日期选择、日期时间同时选择的功能，具体配置请阅读参数文档。

## 滚轮样式
[![demo](https://po-po.github.io/popoPicker/img/pic-1.png "1")](https://po-po.github.io/popoPicker/img/pic-1.png "1")

## 如何使用
```html
<!-- 引入样式 -->
<link href="popoPicker.css" rel="stylesheet">

<!-- 引入脚本 -->
<script src='popodatetime.js'></script>
```

```javascript
//Picker
new popoPicker('.js-picker',{
    container:'.screen',
    wheels: [{
        infinite: false,
        selected: 3,
        data:[
            {value:0,display:'选项一'},
            {value:1,display:'选项二'},
            {value:2,display:'选项三'},
            {value:3,display:'选项四'},
            {value:4,display:'选项五'},
            {value:5,display:'选项六'},
            {value:6,display:'选项七'}
        ]
    }],
    background:'dark'
});

//Date
new popoDateTime('.js-date',{
   container:'.screen',
   time: false
});

//Time
new popoDateTime('.js-time',{
   container:'.screen',
   date: false
});

//DateTime
new popoDateTime('.js-datetime',{
   container:'.screen',
});
```

### popoPicker
|属性property|类型type|默认default|描述description|
| ------------ | ------------ | ------------ | ------------ |
|wheels|Array|[]|wheels为滚轮的数据内容,例如：wheels: [{ infinite: false, selected: 3, data:[ {value:0,display:'选项一'}]}] infinit: bool 是否无限循环滚轮；selected: Number 选中的value；data: Array 滚轮数据|
|container|String|'body'|选择器所在的父级|
|scrollType|String|'3d'|滚轮的显示模式，分2d,和3d||
|background|String|'light'|主题背景颜色'light'和'dark'|
|display|String	'bottom'|滚轮显示位置|
|headTitle|String|''|滚轮顶部标题|
|init|Function|*|初始加载完成后执行|
|getResult|Function|*|返回滚动时的结果|
|save|Function|*|点击确定|
|cancel|Function|*|点击取消|


### popoDatetime
|属性property|类型type|默认default|描述description|
| ------------ | ------------ | ------------ | ------------ |
|container|String|'body'|选择器所在的父级|
|scrollType|String|'3d'|滚轮的显示模式，分2d,和3d|
|background|String|'light'|主题背景颜色'light'和'dark'|
|labelType|String|'symbol'|滚轮label 类型有symbol符号，text文字，split分割线(需date和time同时存在)|
|display|String|'bottom'|滚轮显示位置|
|headResult|Bool|false|滚轮顶部栏目显示结果|
|date|Bool|true|是否显示日期|
|time|Bool|true|是否显示时间|
|beginYear|Number|new Date().getFullYear()-100|开始年份|
|endYear|Number|new Date().getFullYear()+100|结束年份|
|save|Function|*|点击确定|
|cancel|Function|*|点击取消|

### License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018, popo

