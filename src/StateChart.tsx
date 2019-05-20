import React from "react";
import styled from "styled-components";
import { interpret, SimulatedClock, Interpreter } from "xstate/lib/interpreter";
import {
  Machine as _Machine,
  StateNode,
  State,
  EventObject,
  Machine,
  assign
} from "xstate";
import * as XState from "xstate";
import { getEdges } from "xstate/lib/graph";
import { StateChartNode } from "./StateChartNode";

import { serializeEdge, isHidden, initialStateNodes } from "./utils";
import { Edge } from "./Edge";
import { tracker } from "./tracker";
import { Editor } from "./Editor";
import { InitialEdge } from "./InitialEdge";

const StyledViewTab = styled.li`
  padding: 0 1rem;
  border-bottom: 2px solid transparent;
  list-style: none;
  text-transform: uppercase;
  user-select: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:not([data-active]):hover {
    border-color: var(--color-secondary-light);
  }

  &[data-active] {
    border-color: var(--color-secondary);
  }
`;

const StyledViewTabs = styled.ul`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  margin: 0;
  padding: 0;
  flex-grow: 0;
  flex-shrink: 0;
`;

const StyledSidebar = styled.div`
  background-color: var(--color-sidebar);
  color: white;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2rem 1fr;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
`;

const StyledView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  overflow: hidden;
`;

const StyledStateChart = styled.div`
  display: grid;
  grid-template-columns: 1fr 25rem;
  grid-template-rows: auto;
  font-family: sans-serif;
  font-size: 12px;
  overflow: hidden;
  max-height: inherit;
  padding: 1rem;

  > * {
    max-height: inherit;
    overflow-y: auto;
  }
`;

const StyledField = styled.div`
  padding: 0.5rem 1rem;
  width: 100%;
  overflow: hidden;

  > label {
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
  }
`;

const StyledPre = styled.pre`
  overflow: auto;
`;
interface FieldProps {
  label: string;
  children: any;
  disabled?: boolean;
  style?: any;
}
function Field({ label, children, disabled, style }: FieldProps) {
  return (
    <StyledField
      style={{ ...style, ...(disabled ? { opacity: 0.5 } : undefined) }}
    >
      <label>{label}</label>
      {children}
    </StyledField>
  );
}

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
  view: string; //"definition" | "state";
  toggledStates: Record<string, boolean>;
  error?: any;
}

const StyledVisualization = styled.div`
  position: relative;
  max-height: inherit;
  overflow-y: auto;
`;

const StyledStateViewActions = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const StyledStateViewAction = styled.li`
  white-space: nowrap;
  overflow-x: auto;
`;

export class StateChart extends React.Component<
  StateChartProps,
  StateChartState
> {
  state: StateChartState = (() => {
    // const machine = toMachine(this.props.machine);
    const { machine, context } = this.props;

    return {
      preview: undefined,
      previewEvent: undefined,
      view: "context", // or 'state'
      machine: machine,
      context: context,
      toggledStates: {}
    };
  })();
  svgRef = React.createRef<SVGSVGElement>();
  renderView() {
    const { view } = this.state;
    const { currentState } = this.props;

    const { onContextChange } = this.props;

    switch (view) {
      case "context":
        return (
          <Editor
            code={JSON.stringify(this.props.context, null, 2)}
            onChange={context => {
              // send up
              const newContext = JSON.parse(context);
              return onContextChange(newContext);
            }}
          />
        );
      case "state":
        return (
          <>
            <div style={{ overflowY: "auto" }}>
              <Field label="Value">
                <StyledPre>
                  {JSON.stringify(currentState.value, null, 2)}
                </StyledPre>
              </Field>
              <Field label="Context" disabled={!currentState.context}>
                {currentState.context !== undefined ? (
                  <StyledPre>
                    {JSON.stringify(currentState.context, null, 2)}
                  </StyledPre>
                ) : null}
              </Field>
              <Field label="Actions" disabled={!currentState.actions.length}>
                {!!currentState.actions.length && (
                  <StyledPre>
                    {JSON.stringify(currentState.actions, null, 2)}
                  </StyledPre>
                )}
              </Field>
            </div>
            <Field
              label="Event"
              style={{
                marginTop: "auto",
                borderTop: "1px solid #777",
                flexShrink: 0,
                background: "var(--color-sidebar)"
              }}
            >
              <Editor
                height="5rem"
                code={'{type: ""}'}
                changeText="Send event"
                onChange={code => {
                  try {
                    const eventData = eval(`(${code})`);

                    this.props.sendTransition(eventData);
                  } catch (e) {
                    console.error(e);
                    alert(
                      "Unable to send event.\nCheck the console for more info."
                    );
                  }
                }}
              />
            </Field>
          </>
        );
      default:
        return null;
    }
  }
  render() {
    const { preview, previewEvent, machine } = this.state;
    const { currentState } = this.props;

    const edges = getEdges(machine);

    const stateNodes = machine.getStateNodes(currentState);
    const events = new Set();

    stateNodes.forEach(stateNode => {
      const potentialEvents = Object.keys(stateNode.on);

      potentialEvents.forEach(event => {
        const transitions = stateNode.on[event];

        transitions.forEach(transition => {
          if (transition.target !== undefined) {
            events.add(event);
          }
        });
      });
    });

    return (
      <StyledStateChart
        className={this.props.className}
        style={{
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
        }}
      >
        <StyledVisualization>
          <StateChartNode
            stateNode={this.state.machine}
            current={currentState}
            preview={preview}
            onReset={this.props.onReset.bind(this)}
            onEvent={this.props.sendTransition.bind(this)}
            onPreEvent={event =>
              this.setState({
                preview: this.props.getNextState(event),
                previewEvent: event
              })
            }
            onExitPreEvent={() =>
              this.setState({ preview: undefined, previewEvent: undefined })
            }
            toggledStates={this.state.toggledStates}
          />
          <svg
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              // @ts-ignore
              "--color": "gray",
              overflow: "visible",
              pointerEvents: "none"
            }}
            ref={this.svgRef}
            key={JSON.stringify(this.state.toggledStates)}
          >
            <defs>
              <marker
                id="marker"
                markerWidth="4"
                markerHeight="4"
                refX="2"
                refY="2"
                markerUnits="strokeWidth"
                orient="auto"
              >
                <path d="M0,0 L0,4 L4,2 z" fill="var(--color-edge)" />
              </marker>
              <marker
                id="marker-preview"
                markerWidth="4"
                markerHeight="4"
                refX="2"
                refY="2"
                markerUnits="strokeWidth"
                orient="auto"
              >
                <path d="M0,0 L0,4 L4,2 z" fill="gray" />
              </marker>
            </defs>
            {edges.map(edge => {
              if (!this.svgRef.current) {
                return;
              }

              // const svgRect = this.svgRef.current.getBoundingClientRect();

              return (
                <Edge
                  key={serializeEdge(edge)}
                  svg={this.svgRef.current}
                  edge={edge}
                  preview={
                    edge.event === previewEvent &&
                    currentState.matches(edge.source.path.join(".")) &&
                    !!preview &&
                    preview.matches(edge.target.path.join("."))
                  }
                />
              );
            })}
            {initialStateNodes(machine).map((initialStateNode, i) => {
              if (!this.svgRef.current) {
                return;
              }

              // const svgRect = this.svgRef.current.getBoundingClientRect();

              return (
                <InitialEdge
                  key={`${initialStateNode.id}_${i}`}
                  source={initialStateNode}
                  svgRef={this.svgRef.current}
                  preview={
                    currentState.matches(initialStateNode.path.join(".")) ||
                    (!!preview &&
                      preview.matches(initialStateNode.path.join(".")))
                  }
                />
              );
            })}
          </svg>
        </StyledVisualization>
        <StyledSidebar>
          <StyledViewTabs>
            {["context", "state"].map(view => {
              return (
                <StyledViewTab
                  onClick={() => this.setState({ view })}
                  key={view}
                  data-active={this.state.view === view || undefined}
                >
                  {view}
                </StyledViewTab>
              );
            })}
          </StyledViewTabs>
          <StyledView>{this.renderView()}</StyledView>
        </StyledSidebar>
      </StyledStateChart>
    );
  }
}
