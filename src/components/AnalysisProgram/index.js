import React, { Component } from 'react';
import { Button, Row, Col, Input, Select } from 'antd';
import Graph from '../Graph';
import AnalysisTable from '../AnalysisTable';

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

const { TextArea } = Input;
const { Option } = Select;

class AnalysisProgram extends Component {
    state = {
        terminalSymbols: [],
        nonTerminalSymbols: [],
        initSymbol: '',
        profomula: [],
        normativeFamily: [],
        value: null,
        selectValue: 0,
    }

    selectGrammar = () => {
        const currentGrammar = grammar[Number(this.state.selectValue)];

        const { terminalSymbols, nonTerminalSymbols, initSymbol, profomula } = currentGrammar;

        var value = '';

        value += '非终结符：' + nonTerminalSymbols.join(', ') + '\n';
        value += '初始符号： ' + initSymbol + '\n';
        value += '终结符：' + terminalSymbols.join(', ') + '\n';
        value += '文法：';

        profomula.map((fomula) => {
            value += '\n' + "\t" + fomula.join(' ');
        })

        this.setState({
            terminalSymbols,
            nonTerminalSymbols,
            initSymbol,
            profomula,
            value
        })
    }

    generateSelect = () => {
        var children = [];
        for (let i = 0; i < grammar.length; i++) {
            children.push(<Option value={i}>第{i + 1}个文法</Option>)
        }

        return children;
    }

    changeSelect = (value) => {
        this.setState({
            selectValue: value
        }, () => {
            this.selectGrammar()
        })
    }

    componentWillMount() {
        this.selectGrammar();
    }

    isBeenFomula = (fomula, tails, followString, newItem, tail, newTail) => {

        // 拿到first集
        const first = this.getFirst(followString || [], tail);

        // 遍历项目，如果已经存在项目集中，检测小尾巴是否一致，不一致则继续递归，
        for (let i = 0; i < fomula.length; i++) {
            if (fomula[i].join('') !== newItem.join('')) continue;

            // 小尾巴完全一致则返回真，否则返回假

            const same = this.addTails(tails[i], first);
            newTail.push(tails[i]);
            return same;
        }

        fomula.push(newItem);
        tails.push(first);
        newTail.push(first);
        return false;
    }

    addTails = (tails, first) => {
        var same = true;

        for (let i = 0; i < first.length; i++) {

            if (tails.indexOf(first[i]) !== -1) continue;

            same = false;
            tails.push(first[i]);
        }

        return same;
    }

    getFirst = (str, tails) => {
        var first = [];

        if (str.length === 0) {
            tails.map((symbol) => {
                this.addFirst(first, symbol);
            })

            return first;
        }

        const symbol = str[0];

        if (this.isNonTerminalSymbol(symbol)) {
            const flag = {};
            flag[symbol] = true;
            this.getTerminalFirst(symbol, first, flag);
        }
        else {
            this.addFirst(first, symbol);
        }

        return first;
    }

    addFirst = (first, symbol) => {
        for (let i = 0; i < first.length; i++) {
            if (symbol === first[i]) {
                return;
            }
        }
        first.push(symbol);
    }

    getTerminalFirst = (symbol, first, flag) => {
        const { profomula } = this.state;

        for (let i = 0; i < profomula.length; i++) {
            if (profomula[i][0] !== symbol) continue;

            if (this.isNonTerminalSymbol(profomula[i][2])) {
                if (flag[profomula[i][2]]) return;

                flag[profomula[i][2]] = true;
                this.getTerminalFirst(profomula[i][2], first, flag);
            } else {
                this.addFirst(first, profomula[i][2]);
            }
        }
    }

    isNonTerminalSymbol = (symbol) => {
        const { nonTerminalSymbols } = this.state;

        for (let i = 0; i < nonTerminalSymbols.length; i++) {
            if (nonTerminalSymbols[i] === symbol) {
                return true;
            }
        }

        return false;
    }

    // 由一个非终结符号构造项目集
    getProjects = (fomula, tails, symbol, followString, tail) => {
        var { profomula } = this.state;
        profomula = profomula || [];
        var newSymbols = [];

        // 遍历产生式集合
        profomula.map((item) => {

            // 找到当前符号有的产生式
            if (item[0] === symbol) {
                var newItem = [...item];
                newItem.splice(2, 0, '·');
                var newTail = [];

                // 已经存在的item将不再放入项目集中,否则对小尾巴进行合并，如果不存在合并，则不再进行下去
                if (this.isBeenFomula(fomula, tails, followString, newItem, tail, newTail)) {
                    return item;
                }

                // 若'·'后为非终结符，则加入newSymbols数组，递归调用getProjects
                if (this.isNonTerminalSymbol(newItem[3])) {

                    // newSymbols数组存放，接下来遍历的终结符号，终结符号之后符号串，终结符号对应的小尾巴
                    newSymbols.push([newItem[3], [...newItem.slice(4)], newTail[0]]);
                }
            }

            return item;
        })

        newSymbols.map((item) => {
            this.getProjects(fomula, tails, item[0], item[1], item[2]);
            return item;
        })
    }

    getTransferSymbols = (transferSymbols, fomula) => {
        fomula.map((item) => {
            const index = item.indexOf('·');

            if (item.length - 1 === index) {
                return item;
            }

            const symbol = item[index + 1];

            for (let i = 0; i < transferSymbols.length; i++) {
                if (transferSymbols[i] === symbol) {
                    return item;
                }
            }

            transferSymbols.push(symbol);
            return item;
        })
    }

    getNewFomula = (item, index) => {
        var fomula = [...item];
        fomula.splice(index - 1, 1);
        fomula.splice(index, 0, '·');
        return fomula;
    }

    addSymbols = (symbols, item, index) => {
        if (item.length - 1 === index) return;

        const symbol = item[index + 1];

        if (this.isNonTerminalSymbol(symbol)) {
            for (let i = 0; i < symbols.length; i++) {
                if (symbols[i] === symbol) {
                    return;
                }
            }

            symbols.push(symbol);
        }
    }

    compareFomula = (fomula, currentFomula) => {
        if (fomula.length !== currentFomula.length) return false;

        for (let i = 0; i < fomula.length; i++) {
            const item = fomula[i];

            var j;
            for (j = 0; j < currentFomula.length; j++) {
                if (item.join('') === currentFomula[j].join('')) {
                    break;
                }
            }

            if (j === currentFomula.length) return false;
        }

        return true;
    }

    compareTails = (tails, currentTails) => {
        if (tails.length !== currentTails.length) return false;

        for (let i = 0; i < tails.length; i++) {
            const item = tails[i];

            var j;
            for (j = 0; j < currentTails.length; j++) {
                if (item.join('') === currentTails[j].join('')) {
                    break;
                }
            }

            if (j === currentTails.length) return false;
        }

        return true;
    }

    isBeenNormativeFamily = (normativeFamily, currentFomula, currentTails) => {
        for (let i = 0; i < normativeFamily.length; i++) {
            const { fomula, tails } = normativeFamily[i];
            if (this.compareFomula(fomula, currentFomula)
                && this.compareTails(tails, currentTails)) {
                return i;
            }
        }

        return -1;
    }

    generateNormativeFamily = () => {
        let tail = 1;
        let head = 0;
        var fomula = [];
        var tails = [];

        // fomula表示最终项目，tails表示最终与项目对应的小尾巴，
        // 'S'表示当前符号，[]表示跳过当前符号后的符号集合，tails[0]表示当前符号的所在项目的小尾巴
        this.getProjects(fomula, tails, this.state.initSymbol, ['$'], tails[0]);

        var first = {
            status: 0,
            fomula,
            tails,
            edges: []
        }
        var normativeFamily = [];
        normativeFamily.push(first);

        console.log(normativeFamily)

        while (head < tail) {
            const current = normativeFamily[head];

            // 转换符号，可转移到新的状态的符号
            var transferSymbols = [];

            this.getTransferSymbols(transferSymbols, current.fomula);

            transferSymbols.map((symbol) => {
                var fomula = [];
                var tails = [];

                // 项目闭包用于增加的符号，非终结符组成
                var symbols = [];

                for (let i = 0; i < current.fomula.length; i++) {
                    const item = current.fomula[i];
                    const tail = current.tails[i];
                    const index = item.indexOf('·') + 1;

                    if (index === item.length || item[index] !== symbol) continue;

                    fomula.push(this.getNewFomula(item, index));
                    tails.push([...tail]);

                    // 如果存在非终结符号则加入
                    if (index + 1 < item.length && this.isNonTerminalSymbol(item[index + 1])) {
                        symbols.push([item[index + 1], [...item.slice(index + 2)], tail]);
                    }
                }

                symbols.map((item) => {
                    this.getProjects(fomula, tails, item[0], item[1], item[2]);
                    return item;
                })

                const family = {
                    status: tail,
                    fomula,
                    tails,
                    edges: []
                }
                const status = this.isBeenNormativeFamily(normativeFamily, fomula, tails);

                if (status === -1) {
                    normativeFamily[tail] = family;

                    // 转移符号推入
                    current.edges.push({
                        target: tail++,
                        transferSymbol: symbol
                    });
                } else {
                    current.edges.push({
                        target: status,
                        transferSymbol: symbol
                    });
                }

                return symbol;
            })

            head++;
        }

        this.setState({ normativeFamily });

        console.log(normativeFamily)
    }

    onClick = () => {
        this.generateNormativeFamily();
    }

    onChange = (e) => {
        console.log(JSON.stringify(e.target.value));
    }

    render() {

        return (
            <div style={{ paddingTop: 50 }}>
                <Row>
                    <Col span={2}></Col>
                    <Col span={10}>
                        <TextArea value={this.state.value} onChange={this.onChange} autoSize />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={3}>
                        <Select value={this.state.selectValue} onChange={this.changeSelect}>
                            {this.generateSelect()}
                        </Select>
                    </Col>
                    <Col span={7}>
                        <Button type="primary" onClick={this.onClick}>分析此文法</Button>
                    </Col>
                </Row>
                <Graph graph={this.state.normativeFamily}></Graph>
                <AnalysisTable {...this.state} />

            </div>
        );
    }
}

export default AnalysisProgram;