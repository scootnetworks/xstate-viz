var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from "react";
import styled from "styled-components";
import { getEdges } from "xstate/lib/graph";
import { StateChartNode } from "./StateChartNode";
import { serializeEdge, initialStateNodes } from "./utils";
import { Edge } from "./Edge";
import { Editor } from "./Editor";
import { InitialEdge } from "./InitialEdge";
var StyledViewTab = styled.li(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 0 1rem;\n  border-bottom: 2px solid transparent;\n  list-style: none;\n  text-transform: uppercase;\n  user-select: none;\n  cursor: pointer;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  &:not([data-active]):hover {\n    border-color: var(--color-secondary-light);\n  }\n\n  &[data-active] {\n    border-color: var(--color-secondary);\n  }\n"], ["\n  padding: 0 1rem;\n  border-bottom: 2px solid transparent;\n  list-style: none;\n  text-transform: uppercase;\n  user-select: none;\n  cursor: pointer;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  &:not([data-active]):hover {\n    border-color: var(--color-secondary-light);\n  }\n\n  &[data-active] {\n    border-color: var(--color-secondary);\n  }\n"])));
var StyledViewTabs = styled.ul(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  width: 100%;\n  height: 100%;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: stretch;\n  margin: 0;\n  padding: 0;\n  flex-grow: 0;\n  flex-shrink: 0;\n"], ["\n  display: flex;\n  width: 100%;\n  height: 100%;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: stretch;\n  margin: 0;\n  padding: 0;\n  flex-grow: 0;\n  flex-shrink: 0;\n"])));
var StyledSidebar = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  background-color: var(--color-sidebar);\n  color: white;\n  overflow: hidden;\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: 2rem 1fr;\n  border-radius: 0.5rem;\n  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);\n"], ["\n  background-color: var(--color-sidebar);\n  color: white;\n  overflow: hidden;\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: 2rem 1fr;\n  border-radius: 0.5rem;\n  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);\n"])));
var StyledView = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: stretch;\n  overflow: hidden;\n"], ["\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: stretch;\n  overflow: hidden;\n"])));
var StyledStateChart = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: grid;\n  grid-template-columns: 1fr 25rem;\n  grid-template-rows: auto;\n  font-family: sans-serif;\n  font-size: 12px;\n  overflow: hidden;\n  max-height: inherit;\n  padding: 1rem;\n\n  > * {\n    max-height: inherit;\n    overflow-y: auto;\n  }\n"], ["\n  display: grid;\n  grid-template-columns: 1fr 25rem;\n  grid-template-rows: auto;\n  font-family: sans-serif;\n  font-size: 12px;\n  overflow: hidden;\n  max-height: inherit;\n  padding: 1rem;\n\n  > * {\n    max-height: inherit;\n    overflow-y: auto;\n  }\n"])));
var StyledField = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  padding: 0.5rem 1rem;\n  width: 100%;\n  overflow: hidden;\n\n  > label {\n    text-transform: uppercase;\n    display: block;\n    margin-bottom: 0.5em;\n    font-weight: bold;\n  }\n"], ["\n  padding: 0.5rem 1rem;\n  width: 100%;\n  overflow: hidden;\n\n  > label {\n    text-transform: uppercase;\n    display: block;\n    margin-bottom: 0.5em;\n    font-weight: bold;\n  }\n"])));
var StyledPre = styled.pre(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  overflow: auto;\n"], ["\n  overflow: auto;\n"])));
function Field(_a) {
    var label = _a.label, children = _a.children, disabled = _a.disabled, style = _a.style;
    return (React.createElement(StyledField, { style: __assign({}, style, (disabled ? { opacity: 0.5 } : undefined)) },
        React.createElement("label", null, label),
        children));
}
var StyledVisualization = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  position: relative;\n  max-height: inherit;\n  overflow-y: auto;\n"], ["\n  position: relative;\n  max-height: inherit;\n  overflow-y: auto;\n"])));
var StyledStateViewActions = styled.ul(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  margin: 0;\n  padding: 0;\n  list-style: none;\n"], ["\n  margin: 0;\n  padding: 0;\n  list-style: none;\n"])));
var StyledStateViewAction = styled.li(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  white-space: nowrap;\n  overflow-x: auto;\n"], ["\n  white-space: nowrap;\n  overflow-x: auto;\n"])));
var StateChart = /** @class */ (function (_super) {
    __extends(StateChart, _super);
    function StateChart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = (function () {
            // const machine = toMachine(this.props.machine);
            var _a = _this.props, machine = _a.machine, context = _a.context;
            return {
                preview: undefined,
                previewEvent: undefined,
                view: "context",
                machine: machine,
                context: context,
                toggledStates: {}
            };
        })();
        _this.svgRef = React.createRef();
        return _this;
    }
    StateChart.prototype.renderView = function () {
        var _this = this;
        var view = this.state.view;
        var currentState = this.props.currentState;
        var onContextChange = this.props.onContextChange;
        switch (view) {
            case "context":
                return (React.createElement(Editor, { code: JSON.stringify(this.props.context, null, 2), onChange: function (context) {
                        // send up
                        var newContext = JSON.parse(context);
                        return onContextChange(newContext);
                    } }));
            case "state":
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { overflowY: "auto" } },
                        React.createElement(Field, { label: "Value" },
                            React.createElement(StyledPre, null, JSON.stringify(currentState.value, null, 2))),
                        React.createElement(Field, { label: "Context", disabled: !currentState.context }, currentState.context !== undefined ? (React.createElement(StyledPre, null, JSON.stringify(currentState.context, null, 2))) : null),
                        React.createElement(Field, { label: "Actions", disabled: !currentState.actions.length }, !!currentState.actions.length && (React.createElement(StyledPre, null, JSON.stringify(currentState.actions, null, 2))))),
                    React.createElement(Field, { label: "Event", style: {
                            marginTop: "auto",
                            borderTop: "1px solid #777",
                            flexShrink: 0,
                            background: "var(--color-sidebar)"
                        } },
                        React.createElement(Editor, { height: "5rem", code: '{type: ""}', changeText: "Send event", onChange: function (code) {
                                try {
                                    var eventData = eval("(" + code + ")");
                                    _this.props.sendTransition(eventData);
                                }
                                catch (e) {
                                    console.error(e);
                                    alert("Unable to send event.\nCheck the console for more info.");
                                }
                            } }))));
            default:
                return null;
        }
    };
    StateChart.prototype.render = function () {
        var _this = this;
        var _a = this.state, preview = _a.preview, previewEvent = _a.previewEvent, machine = _a.machine;
        var currentState = this.props.currentState;
        var edges = getEdges(machine);
        var stateNodes = machine.getStateNodes(currentState);
        var events = new Set();
        stateNodes.forEach(function (stateNode) {
            var potentialEvents = Object.keys(stateNode.on);
            potentialEvents.forEach(function (event) {
                var transitions = stateNode.on[event];
                transitions.forEach(function (transition) {
                    if (transition.target !== undefined) {
                        events.add(event);
                    }
                });
            });
        });
        return (React.createElement(StyledStateChart, { className: this.props.className, style: {
                height: this.props.height || "100%",
                background: "var(--color-app-background)",
                // @ts-ignore
                "--color-app-background": "#FFF",
                "--color-border": "#dedede",
                "--color-primary": "rgba(87, 176, 234, 1)",
                "--color-primary-faded": "rgba(87, 176, 234, 0.5)",
                "--color-primary-shadow": "rgba(87, 176, 234, 0.1)",
                "--color-link": "rgba(87, 176, 234, 1)",
                "--color-disabled": "#c7c5c5",
                "--color-edge": "rgba(0, 0, 0, 0.2)",
                "--color-secondary": "rgba(255,152,0,1)",
                "--color-secondary-light": "rgba(255,152,0,.5)",
                "--color-sidebar": "#272722",
                "--radius": "0.2rem",
                "--border-width": "2px"
            } },
            React.createElement(StyledVisualization, null,
                React.createElement(StateChartNode, { stateNode: this.state.machine, current: currentState, preview: preview, onReset: this.props.onReset.bind(this), onEvent: this.props.sendTransition.bind(this), onPreEvent: function (event) {
                        return _this.setState({
                            preview: _this.props.getNextState(event),
                            previewEvent: event
                        });
                    }, onExitPreEvent: function () {
                        return _this.setState({ preview: undefined, previewEvent: undefined });
                    }, toggledStates: this.state.toggledStates }),
                React.createElement("svg", { width: "100%", height: "100%", style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        // @ts-ignore
                        "--color": "gray",
                        overflow: "visible",
                        pointerEvents: "none"
                    }, ref: this.svgRef, key: JSON.stringify(this.state.toggledStates) },
                    React.createElement("defs", null,
                        React.createElement("marker", { id: "marker", markerWidth: "4", markerHeight: "4", refX: "2", refY: "2", markerUnits: "strokeWidth", orient: "auto" },
                            React.createElement("path", { d: "M0,0 L0,4 L4,2 z", fill: "var(--color-edge)" })),
                        React.createElement("marker", { id: "marker-preview", markerWidth: "4", markerHeight: "4", refX: "2", refY: "2", markerUnits: "strokeWidth", orient: "auto" },
                            React.createElement("path", { d: "M0,0 L0,4 L4,2 z", fill: "gray" }))),
                    edges.map(function (edge) {
                        if (!_this.svgRef.current) {
                            return;
                        }
                        // const svgRect = this.svgRef.current.getBoundingClientRect();
                        return (React.createElement(Edge, { key: serializeEdge(edge), svg: _this.svgRef.current, edge: edge, preview: edge.event === previewEvent &&
                                currentState.matches(edge.source.path.join(".")) &&
                                !!preview &&
                                preview.matches(edge.target.path.join(".")) }));
                    }),
                    initialStateNodes(machine).map(function (initialStateNode, i) {
                        if (!_this.svgRef.current) {
                            return;
                        }
                        // const svgRect = this.svgRef.current.getBoundingClientRect();
                        return (React.createElement(InitialEdge, { key: initialStateNode.id + "_" + i, source: initialStateNode, svgRef: _this.svgRef.current, preview: currentState.matches(initialStateNode.path.join(".")) ||
                                (!!preview &&
                                    preview.matches(initialStateNode.path.join("."))) }));
                    }))),
            React.createElement(StyledSidebar, null,
                React.createElement(StyledViewTabs, null, ["context", "state"].map(function (view) {
                    return (React.createElement(StyledViewTab, { onClick: function () { return _this.setState({ view: view }); }, key: view, "data-active": _this.state.view === view || undefined }, view));
                })),
                React.createElement(StyledView, null, this.renderView()))));
    };
    return StateChart;
}(React.Component));
export { StateChart };
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
