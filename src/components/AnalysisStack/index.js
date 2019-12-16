import React, { Component } from 'react';

class AnalysisStack extends Component {

    analysis = (inputString) => {
        const analysisTable = [];
        var stack = [[0, '$']];
        var top = 0;

        while (true) {
            const status = stack[top][0];
            const currentChar = inputString[0];

            const step = analysisTable[status][currentChar];

            if (step === 'ACC') {
                console.log('匹配成功');
                break;
            }

            const transferNumber = Number(step.substring(step.length - 1));
            if (step[0] === 'S') {
                stack[++top] = [transferNumber, currentChar];
            } else {
                fomula = profomula[transferNumber];
                for (let i = 2; i < fomula.length; i++) {
                    top--;
                    console.log(fomula)
                }
                stack[top + 1] = [analysisTable[stack[top][0]][fomula[0]], fomula[0]];
                top++;
            }
        }
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default AnalysisStack;