import React, { Component } from 'react';
import MyTable from './MyTable';
import AnalysisStack from '../AnalysisStack';

class AnalysisTable extends Component {

    isNonTerminalSymbol = (symbol) => {
        const { nonTerminalSymbols } = this.props;

        for (let i = 0; i < nonTerminalSymbols.length; i++) {
            if (nonTerminalSymbols[i] === symbol) {
                return true;
            }
        }

        return false;
    }

    createTableData = () => {
        const { normativeFamily, profomula } = this.props;

        var dataSource = [];

        normativeFamily.map((family) => {
            const { fomula, edges, tails } = family;
            var statusStep = {};

            for (let i = 0; i < fomula.length; i++) {
                const item = fomula[i];
                const tail = tails[i];
                const index = item.indexOf('·');

                if (index !== item.length - 1) break;

                const newItem = [...item];
                newItem.pop();

                for (let i = 0; i < profomula.length; i++) {
                    if (newItem.join('') === profomula[i].join('')) {
                        tail.map((symbol) => {
                            statusStep[symbol] = 'R' + i;
                            return symbol;
                        })
                        break;
                    }
                }
            }

            edges.map((edge) => {
                if (this.isNonTerminalSymbol(edge.transferSymbol)) {
                    statusStep[edge.transferSymbol] = edge.target;
                } else {
                    statusStep[edge.transferSymbol] = 'S' + edge.target;
                }
                return edge;
            })

            dataSource.push(statusStep);
            return family;
        })

        return dataSource;
    }

    render() {
        const dataSource = this.createTableData();
        return (
            <div>
                <MyTable
                    dataSource={dataSource}
                    nonTerminalSymbols={this.props.nonTerminalSymbols}
                    terminalSymbols={this.props.terminalSymbols}
                    initSymbol={this.props.initSymbol}
                ></MyTable>

                <AnalysisStack
                    analysisTable={dataSource}
                    nonTerminalSymbols={this.props.nonTerminalSymbols}
                    terminalSymbols={this.props.terminalSymbols}
                    profomula={this.props.profomula}
                ></AnalysisStack>
            </div>
        );
    }
}

export default AnalysisTable;