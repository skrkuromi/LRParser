import React, { Component, Fragment } from 'react';
import { Table, Row, Col } from 'antd';

class ResultTable extends Component {
    render() {
        const dataSource = JSON.parse(JSON.stringify(this.props.dataSource));
        if (dataSource.length === 0) return (<Fragment></Fragment>)

        const columns = [
            {
                title: 'step',
                dataIndex: 'step',
                width: 100,
                align: 'center'
            },
            {
                title: 'stack',
                width: 400,
                align: 'center',
                children: [
                    {
                        title: 'statusStack',
                        dataIndex: 'statusStack',
                        width: 200,
                        key: 'statusStack',
                        align: 'center'
                    },
                    {
                        title: 'symbolStack',
                        dataIndex: 'symbolStack',
                        width: 200,
                        key: 'symbolStack',
                        align: 'center'
                    }
                ]
            },
            {
                title: 'inputString',
                dataIndex: 'inputString',
                width: 150,
                align: 'center'
            },
            {
                title: 'analysisAction',
                dataIndex: 'analysisAction',
                width: 150,
                align: 'center'
            },
        ];

        for (let i = 0; i < dataSource.length; i++) {
            dataSource[i]['step'] = i;
        }
        const width = 800;

        return (
            <Row>
                <Col span={2}></Col>
                <Col span={20} style={{ textAlign: 'center' }}>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        scroll={{ x: width }}
                        size='small'
                        style={{ width, display: 'inline-block' }}
                        pagination={false}
                    />
                </Col>
                <Col span={2}></Col>
            </Row>
        );
    }
}

export default ResultTable;