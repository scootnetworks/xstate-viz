import React from "react";
import { StateNode, State } from "xstate";
interface StateChartProps {
    className?: string;
    machine: StateNode<any>;
    currentState: State<any, any>;
    context: any;
    onContextChange: Function;
    sendTransition: Function;
    getNextState: Function;
    onReset: Function;
    height?: number | string;
}
interface StateChartState {
    machine: StateNode<any>;
    context: StateNode<any>;
    preview?: State<any, any>;
    previewEvent?: string;
    view: string;
    toggledStates: Record<string, boolean>;
    error?: any;
}
export declare class StateChart extends React.Component<StateChartProps, StateChartState> {
    state: StateChartState;
    svgRef: React.RefObject<SVGSVGElement>;
    renderView(): JSX.Element | null;
    render(): JSX.Element;
}
export {};
