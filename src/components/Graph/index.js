import React, { Component } from 'react';
import { Row, Col } from 'antd';

var dagre = require("dagre");
var echarts = require('echarts');

class Graph extends Component {
    createLocation = () => {
        const { graph } = this.props;
        if (graph.length === 0) return;

        var g = new dagre.graphlib.Graph();

        g.setGraph({ height: 700, width: 1000 });

        g.setDefaultEdgeLabel(function () { return {}; });

        graph.map((item, index) => {
            const { edges } = item;
            g.setNode('I' + index, {
                label: 'I' + index,
                width: 150,
                height: 150,
            });
            edges.map((edge) => {
                g.setEdge('I' + index, 'I' + edge.target);
            })
        })

        dagre.layout(g);

        const links = [];
        g.edges().forEach(function (e) {
            const { edges } = graph[Number(e.v.slice(1))];
            const target = Number(e.w.slice(1));
            var formatter = '';
            for (let i = 0; i < edges.length; i++) {
                if (edges[i].target === target) {
                    formatter = edges[i].transferSymbol;
                }
            }
            links.push({
                source: e.v,
                target: e.w,
                label: {
                    normal: {
                        show: true,
                        formatter: formatter
                    }
                }
            })
        });

        const data = [];
        const eData = [];
        g.nodes().forEach(function (v) {
            const index = Number(v.slice(1));
            const { fomula } = graph[index];
            var formatter = v;
            for (let i = 0; i < fomula.length; i++) {
                formatter += '<p style={{padding:0}}>' + fomula[i].join(' ') + '</p>';
            }

            data.push({
                name: v,
                formatter,
            })
            eData.push({
                name: v,
                x: g.node(v).y,
                y: g.node(v).x,
                formatter
            })
        });

        var myChart = echarts.init(document.getElementById('myGraph'));
        const options = {
            title: {
                text: '项目集规范族'
            },
            tooltip: {},
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            color: '#40a9ff',
            focusNodeAdjacency: true,
            tooltip: {
                formatter: function (x) {
                    return x.data.formatter;
                }
            },
            series: [
                {
                    type: 'graph',
                    layout: 'circular',
                    symbolSize: 30,
                    roam: true,
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        normal: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },
                    data: data,
                    links: links,
                    lineStyle: {
                        normal: {
                            opacity: 0.9,
                            width: 2,
                            curveness: 0.1
                        }
                    }
                }
            ]
        }

        var myeChart = echarts.init(document.getElementById('myGraph2'));
        const eOptions = {
            title: {
                text: '项目集规范族'
            },
            tooltip: {},
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            color: '#40a9ff',
            focusNodeAdjacency: true,
            tooltip: {
                formatter: function (x) {
                    return x.data.formatter;
                }
            },
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 30,
                    roam: true,
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        normal: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },
                    data: eData,
                    links: links,
                    lineStyle: {
                        normal: {
                            opacity: 0.9,
                            width: 2,
                            curveness: 0.1
                        }
                    }
                }
            ]
        }

        myChart.setOption(options);
        myeChart.setOption(eOptions)
    }

    componentDidMount() {
        this.createLocation();
    }

    componentDidUpdate() {
        this.createLocation();
    }

    render() {
        return (
            <Row>
                <Col span={1}></Col>
                <Col span={10}>
                    <div id='myGraph' style={{ width: 600, height: 600 }}></div>
                </Col>
                <Col span={13}>
                    <div id='myGraph2' style={{ width: 800, height: 600 }}></div>
                </Col>
            </Row>
        );
    }
}

export default Graph;