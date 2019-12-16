import React, { Component } from 'react';
import { Button } from 'antd';

import AnalysisTable from '../AnalysisTable';

const nonTerminalSymbols = ['S', 'E', 'T', 'F'];
const initSymbol = "S";
const terminalSymbols = ['+', '-', '*', '/', '(', ')', 'num'];
const profomula = [
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

class AnalysisProgram extends Component {
    state = {
        terminalSymbols: [],
        nonTerminalSymbols: [],
        initSymbol: '',
        profomula: [],
        normativeFamily: [],
    }

    componentWillMount() {
        this.setState({
            terminalSymbols,
            nonTerminalSymbols,
            initSymbol,
            profomula
        })
    }

    isBeenFomula = (followString, newItem, items, tails, tail) => {
        var first = [];
        this.getFirst(followString || [], first, tail);

        for (let i = 0; i < items.length; i++) {
            if (items[i].join('') === newItem.join('')) {
                this.addTails(tails[i], first);
                return true;
            }
        }

        items.push(newItem);
        tails.push(first);
        return false;
    }

    addTails = (tails, first) => {
        for (let i = 0; i < first.length; i++) {
            if (tails.indexOf(first[i]) !== -1) continue;

            tails.push(first[i]);
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
    getProjects = (symbol, fomula, tails, followString, tail) => {
        var { profomula } = this.state;
        profomula = profomula || [];
        var newSymbols = [];

        // 遍历产生式集合
        profomula.map((item) => {
            if (item[0] === symbol) {
                var newItem = [...item];
                newItem.splice(2, 0, '·');

                // 已经存在的item将不再放入项目集中,否则进行合并
                if (this.isBeenFomula(followString, newItem, fomula, tails, tail)) {
                    return item;
                }

                // 若'·'后为非终结符，则加入newSymbols数组，递归调用getProjects
                if (this.isNonTerminalSymbol(newItem[3])) {
                    newSymbols.push([newItem[3], [...newItem.slice(4)], tail]);
                }
            }

            return item;
        })

        // console.log(newSymbols)

        newSymbols.map((item) => {
            this.getProjects(item[0], fomula, tails, item[1], item[2]);
            return symbol;
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

    isBeenNormativeFamily = (normativeFamily, currentFomula) => {
        for (let i = 0; i < normativeFamily.length; i++) {
            const { fomula } = normativeFamily[i];
            if (this.compareFomula(fomula, currentFomula)) {
                return i;
            }
        }

        return -1;
    }

    generateNormativeFamily = () => {
        let tail = 1;
        let head = 0;
        var fomula = [];
        var tails = [['$']];

        this.getProjects('S', fomula, tails, [], [...tails[0]]);

        var first = {
            status: 0,
            fomula,
            tails,
            edges: []
        }
        var normativeFamily = [];
        normativeFamily.push(first);

        console.log(first)

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

                    if (index === item.length) break;

                    if (item[index] === symbol) {
                        fomula.push(this.getNewFomula(item, index));
                        tails.push([...tail]);
                        this.addSymbols(symbols, item, index);
                    }
                }

                symbols.map((symbol) => {
                    this.getProjects(symbol, fomula, tails);
                    return symbol;
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
                    console.log('family:', family);

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

    getFirst = (str, tails, first) => {
        if (str.length === 0) {
            tails.map((symbol) => {
                this.addFirst(first, symbol);
            })

            return;
        }

        const symbol = str[0];

        if (this.isNonTerminalSymbol(symbol)) {
            this.getTerminalFirst(symbol, first, { symbol: true });
        }
        else {
            this.addFirst(first, symbol);
        }
    }

    addFirst = (first, symbol) => {
        for (let i = 0; i < first.length; i++) {
            if (symbol == first[i]) {
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
                if (flag[profomula[i][2]]) {
                    return;
                }

                flag[profomula[i][2]] = true;
                this.getTerminalFirst(profomula[i][2], first, flag);
            } else {
                this.addFirst(first, profomula[i][2]);
            }
        }
    }

    render() {

        return (
            <div>
                <Button type="primary" onClick={this.onClick}>Button</Button>
                <AnalysisTable {...this.state} />
            </div>
        );
    }
}

export default AnalysisProgram;