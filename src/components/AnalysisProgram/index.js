import React, { Component } from 'react';
import { Button } from 'antd';

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

    isBeenFomula = (newItem, items) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].join('') === newItem.join('')) {
                return true;
            }
        }

        return false;
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

    isBeenNewSymbols = (symbol, symbols) => {
        for (let i = 0; i < symbols.length; i++) {
            if (symbols[i] === symbol) return true;
        }

        return false;
    }

    // 由一个非终结符号构造项目集
    getProjects = (symbol, fomula) => {
        var { profomula } = this.state;
        profomula = profomula || [];
        var newSymbols = [];

        // 遍历产生式集合
        profomula.map((item) => {
            if (item[0] === symbol) {
                var newItem = [...item];
                newItem.splice(2, 0, '·');

                // 已经存在的item将不再放入项目集中
                if (this.isBeenFomula(newItem, fomula)) {
                    return item;
                }

                // console.log(newItem)

                fomula.push(newItem);

                // 若'·'后为非终结符，则加入newSymbols数组，递归调用getProjects
                if (this.isNonTerminalSymbol(newItem[3])
                    && this.isBeenNewSymbols(newItem[3], newSymbols) === false) {
                    newSymbols.push(newItem[3]);
                }
            }

            return item;
        })

        // console.log(newSymbols)

        newSymbols.map((symbol) => {
            this.getProjects(symbol, fomula);
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
        const fomula = [];

        this.getProjects('S', fomula);

        var first = {
            status: 0,
            fomula,
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

                // 项目闭包用于增加的符号，非终结符组成
                var symbols = [];

                current.fomula.map((item) => {
                    const index = item.indexOf('·') + 1;

                    if (index === item.length) return item;

                    if (item[index] === symbol) {
                        fomula.push(this.getNewFomula(item, index));
                        this.addSymbols(symbols, item, index);
                    }

                    return item;
                })

                symbols.map((symbol) => {
                    this.getProjects(symbol, fomula);
                    return symbol;
                })

                const family = {
                    status: tail,
                    fomula,
                    edges: []
                }
                const status = this.isBeenNormativeFamily(normativeFamily, fomula);

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

    render() {

        return (
            <div>
                <Button type="primary" onClick={this.onClick}>Button</Button>
            </div>
        );
    }
}

export default AnalysisProgram;