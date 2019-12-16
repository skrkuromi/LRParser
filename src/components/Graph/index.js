import React, { Component } from 'react';

var dagre = require("dagre");

class Graph extends Component {
    createLocation = () => {
        var g = new dagre.graphlib.Graph();

        g.setGraph({});

        g.setDefaultEdgeLabel(function () { return {}; });

        g.setNode("kspacey", { label: "Kevin Spacey", width: 144, height: 100 });
        g.setNode("swilliams", { label: "Saul Williams", width: 160, height: 100 });
        g.setNode("bpitt", { label: "Brad Pitt", width: 108, height: 100 });
        g.setNode("hford", { label: "Harrison Ford", width: 168, height: 100 });
        g.setNode("lwilson", { label: "Luke Wilson", width: 144, height: 100 });
        g.setNode("kbacon", { label: "Kevin Bacon", width: 121, height: 100 });

        g.setEdge("kspacey", "swilliams");
        g.setEdge("swilliams", "kbacon");
        g.setEdge("bpitt", "kbacon");
        g.setEdge("hford", "lwilson");
        g.setEdge("lwilson", "kbacon");
        dagre.layout(g);
        console.log(g.nodes(), g.edges())

        g.nodes().forEach(function (v) {
            console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
        });
        g.edges().forEach(function (e) {
            console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
        });
    }
    render() {
        return (
            <div>

            </div>
        );
    }
}

export default Graph;