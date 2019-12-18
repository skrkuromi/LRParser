import React, { Component, Fragment } from 'react';
import { Table, Row, Col } from 'antd';

class MyTable extends Component {

    render() {
        const dataSource = JSON.parse(JSON.stringify(this.props.dataSource));
        if (dataSource.length === 0) return (<Fragment></Fragment>)

        const { nonTerminalSymbols, terminalSymbols, initSymbol } = this.props;
        const rowWidth = 100;
        const columns = [
            {
                title: 'Status',
                dataIndex: 'status',
                fixed: 'left',
                width: rowWidth,
                align: 'center'
            },
            {
                title: 'action',
                children: [],
                width: terminalSymbols.length * rowWidth,
                align: 'center'
            },
            {
                title: 'goto',
                children: [],
                width: nonTerminalSymbols.length * rowWidth - rowWidth,
                align: 'center'
            },
        ];

        terminalSymbols.map((symbol) => {
            columns[1].children.push({
                title: symbol,
                dataIndex: symbol,
                key: symbol,
                width: rowWidth,
                align: 'center'
            });
        })

        columns[1].children.push({
            title: '$',
            dataIndex: '$',
            key: '$',
            width: rowWidth,
            align: 'center'
        });

        nonTerminalSymbols.map((symbol) => {
            if (symbol === initSymbol) return symbol;
            columns[2].children.push({
                title: symbol,
                dataIndex: symbol,
                key: symbol,
                width: rowWidth,
                align: 'center'
            });
        })

        for (let i = 0; i < dataSource.length; i++) {
            dataSource[i]['status'] = i;
            if (dataSource[i]['$'] === 'R0') {
                dataSource[i]['$'] = 'ACC';
            }
        }

        const width = nonTerminalSymbols.length * rowWidth + terminalSymbols.length * rowWidth + rowWidth;

        return (
            <Row>
                <Col span={2}></Col>
                <Col span={20} style={{ textAlign: 'center' }}>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        scroll={{ x: width < 1200 ? width : 1200 }}
                        size='small'
                        style={{ width: width + 5, maxWidth: 1200, display: 'inline-block' }}
                        pagination={false}
                    />
                </Col>
                <Col span={2}></Col>
            </Row>

        );
    }
}

export default MyTable;