# LRParser
进入界面后首先展示
![image.png](https://github.com/skrkuromi/LRParser/blob/master/images/1.png#align=left&display=inline&height=155&name=image.png&originHeight=295&originWidth=1372&size=15170&status=done&style=none&width=720)
左边文本框内文字暂不能修改，右侧首先选择文法，共内置了三个文法：

```javascript
const grammar = [
    {
        nonTerminalSymbols: ["S'", 'S', 'C'],
        initSymbol: "S'",
        terminalSymbols: ['c', 'd'],
        profomula: [
            ["S'", '->', 'S'],
            ['S', '->', 'C', 'C'],
            ['C', '->', 'c', 'C'],
            ['C', '->', 'd'],
        ]
    },
    {
        nonTerminalSymbols: ["S'", 'S', 'L', 'R'],
        initSymbol: "S'",
        terminalSymbols: ['=', '*', 'id'],
        profomula: [
            ["S'", '->', 'S'],
            ['S', '->', 'L', '=', 'R'],
            ['S', '->', 'R'],
            ['L', '->', '*', 'R'],
            ['L', '->', 'id'],
            ['R', '->', 'L'],
        ]
    },
    
    {
        nonTerminalSymbols: ['S', 'E', 'T', 'F'],
        initSymbol: "S",
        terminalSymbols: ['+', '-', '*', '/', '(', ')', 'num'],
        profomula: [
            ['S', '->', 'E'],
            ['E', '->', 'E', '+', 'T'],
            ['E', '->', 'E', '-', 'T'],
            ['E', '->', 'T'],
            ['T', '->', 'T', '*', 'F'],
            ['T', '->', 'T', '/', 'F'],
            ['T', '->', 'F'],
            ['F', '->', '(', 'E', ')'],
            ['F', '->', 'num'],
        ]
    },
  ]
```
选择其中某一个文法后，点击分析此文法的按钮，即可在页面上生成改文法的项目集规范族的流程图，及预测分析表，以第一个文法为例:
![image.png](https://github.com/skrkuromi/LRParser/blob/master/images/2.png#align=left&display=inline&height=318&name=image.png&originHeight=773&originWidth=1812&size=102233&status=done&style=none&width=746)

其中左侧为圆形画法，右侧为树形画法，由于使用的库存在缺陷，自环的线无法表示，只能在节点附近显示出转移符号：
![image.png](https://github.com/skrkuromi/LRParser/blob/master/images/3.png#align=left&display=inline&height=342&name=image.png&originHeight=603&originWidth=613&size=55839&status=done&style=none&width=348)

将鼠标移动至节点上可显示此节点表示的项目集的项目：
![image.png](https://github.com/skrkuromi/LRParser/blob/master/images/4.png#align=left&display=inline&height=356&name=image.png&originHeight=712&originWidth=805&size=54801&status=done&style=none&width=402.5)

预测分析表：
![image.png](https://github.com/skrkuromi/LRParser/blob/master/images/5.png#align=left&display=inline&height=322&name=image.png&originHeight=644&originWidth=1236&size=36452&status=done&style=none&width=618)
最后，在底部的input框中输入字符串（输入字符串为非终结符组成,且暂不允许有空格）可进行语法检测：
![image.png](https://github.com/skrkuromi/LRParser/blob/master/images/6.png#align=left&display=inline&height=55&name=image.png&originHeight=91&originWidth=1122&size=4025&status=done&style=none&width=682)
匹配情况：
![image.png](https://github.com/skrkuromi/LRParser/blob/master/images/7.png#align=left&display=inline&height=335&name=image.png&originHeight=670&originWidth=1211&size=43446&status=done&style=none&width=605.5)
不匹配情况：
![image.png](https://github.com/skrkuromi/LRParser/blob/master/images/8.png#align=left&display=inline&height=250&name=image.png&originHeight=499&originWidth=1203&size=31270&status=done&style=none&width=602)
无法识别的非终结符（error或不检测）：
![image.png](https://github.com/skrkuromi/LRParser/blob/master/images/9.png#align=left&display=inline&height=119&name=image.png&originHeight=238&originWidth=1044&size=12682&status=done&style=none&width=522)
