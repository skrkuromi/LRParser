import React, { Component, Fragment } from 'react';
import { Input } from 'antd';
import ResultTable from './ResultTable';

class AnalysisStack extends Component {
    state = {
        value: null,
        resultStep: []
    }

    onChange = (e) => {
        this.setState({
            value: e.target.value
        })
        const inputString = this.divideWords(e.target.value);

        if (inputString[inputString.length - 1] === -1) {
            console.log('存在无法识别终结符', inputString)
            return;
        }
        this.analysis(inputString);
    }

    divideWords = (value) => {
        var { terminalSymbols } = this.props;
        var inputString = [];
        while (value && value.length !== 0) {
            let i;

            for (i = 0; i < terminalSymbols.length; i++) {
                const terminalSymbol = terminalSymbols[i];
                if (terminalSymbol.length <= value.length &&
                    terminalSymbol === value.slice(0, terminalSymbol.length)) {
                    inputString.push(terminalSymbol);
                    value = value.substring(terminalSymbol.length);
                    break;
                }
            }

            if (i === terminalSymbols.length) {
                inputString.push(-1);
                break;
            }
        }

        return inputString;
    }

    addResultStep = (resultStep, statusStack, symbolStack, inputString, info) => {
        resultStep.push({
            statusStack: statusStack.join(''),
            symbolStack: symbolStack.join(''),
            inputString: inputString.join(''),
            analysisAction: info
        });
    }

    analysis = (inputString) => {
        const { analysisTable, profomula } = this.props;
        const resultStep = [];
        inputString.push('$');
        var statusStack = [0];
        var symbolStack = ['$'];
        var top = 0;

        while (true) {
            const status = statusStack[top];
            const currentChar = inputString[0];

            const step = analysisTable[status][currentChar];

            if (step === 'R0') {
                console.log('匹配成功');
                this.addResultStep(resultStep, statusStack, symbolStack, inputString, 'accept');
                break;
            }
            else if (step === undefined) {
                console.log('error');
                this.addResultStep(resultStep, statusStack, symbolStack, inputString, 'error');
                break;
            }

            const transferNumber = Number(step.substring(1));
            if (step[0] === 'S') {
                this.addResultStep(resultStep, statusStack, symbolStack, inputString, step);

                statusStack[++top] = transferNumber;
                symbolStack[top] = currentChar;
                inputString.splice(0, 1);
            } else {
                var fomula = profomula[transferNumber];

                this.addResultStep(resultStep, statusStack, symbolStack, inputString, step + ' ' + fomula.join(''));

                for (let i = 2; i < fomula.length; i++) {
                    top--;
                }
                statusStack[top + 1] = analysisTable[statusStack[top]][fomula[0]];
                symbolStack[++top] = fomula[0];
            }
        }

        this.setState({
            resultStep
        })
    }

    render() {
        const { analysisTable } = this.props;
        if (analysisTable.length === 0) return <Fragment></Fragment>;

        return (
            <div>
                <Input value={this.state.value} onChange={this.onChange}></Input>
                <ResultTable></ResultTable>
            </div>
        );
    }
}

export default AnalysisStack;