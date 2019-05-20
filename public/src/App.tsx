import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { StateChart } from "@statecharts/xstate-viz";
import { Machine, StateNode, MachineOptions, assign } from "xstate";
import styled from "styled-components";

import navMachine from "../../../../scoot/src/state/Navigation.machine";
import { isMajorContextChange } from "../../../../scoot/src/state/Navigation.machine.helpers";

const StyledApp = styled.main`
  height: 100%;
  display: grid;
  grid-template-areas:
    "header"
    "content";
  grid-template-rows: 3rem auto;
  grid-template-columns: 100%;
`;

const StyledHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  grid-area: header;
  padding: 0.5rem 1rem;
`;

const StyledLogo = styled.img`
  height: 100%;
`;

const StyledLinks = styled.nav`
  display: flex;
  flex-direction: row;
  margin-left: auto;

  &,
  &:visited {
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: #57b0ea;
  text-transform: uppercase;
  display: block;
  font-size: 75%;
  font-weight: bold;
  margin: 0 0.25rem;
`;

class Header extends Component {
  render() {
    return (
      <StyledHeader>
        <StyledLogo src={logo} />
        <StyledLinks>
          <StyledLink
            href="https://github.com/davidkpiano/xstate"
            target="_xstate-github"
          >
            GitHub
          </StyledLink>
          <StyledLink href="https://xstate.js.org/docs" target="_xstate-docs">
            Docs
          </StyledLink>
          <StyledLink
            href="https://spectrum.chat/statecharts"
            target="_statecharts-community"
          >
            Community
          </StyledLink>
        </StyledLinks>
      </StyledHeader>
    );
  }
}

const defaults = {
  isAuthenticated: true,
  isVehicleWithinRange: true,
  vehicleRequiresLocking: true,
  shouldShowOrientation: true
};

const vehicle = {
  ignitionCode: 3
};

const ride = {
  id: 1
};

const reservation = {
  id: 1
};

const contextSelected = {
  ...defaults,
  selectedVehicle: vehicle
};

const vehicleAndRes = {
  ...defaults,
  heartbeatVehicle: vehicle,
  reservation
};
const vehicleAndRide = {
  ...defaults,
  ride,
  heartbeatVehicle: vehicle
};
const logTag = "ScootNavViz";

class App extends Component {
  statePrevious = null;
  machine: any;

  constructor(props: any) {
    super(props);

    this.machine = navMachine;
    const initialContext = vehicleAndRide;

    this.state = {
      currentState: this.machine.withContext(initialContext).initialState,
      context: initialContext
    };
  }

  onContextChange = (context: any) => {
    console.log(`${logTag} context changed`, context);
    //@ts-ignore
    const prevContext = this.state.context;

    this.setState({ context }, () => {
      //@ts-ignore
      if (isMajorContextChange(prevContext, this.state.context)) {
        //@ts-ignore
        console.log(`${logTag} is Major context change`, this.state.context);
        this.transition("HEARTBEAT_CHANGED");
      }
    });
  };

  getNextState = (event: any) => {
    const nextEvent = this.machine.transition(
      //@ts-ignore
      this.state.currentState,
      event,
      //@ts-ignore
      this.state.context
    );
    console.log(`${logTag} - next event == `, nextEvent);
    return nextEvent;
  };

  transition = (event: any) => {
    const nextState = this.machine.transition(
      //@ts-ignore
      this.state.currentState,
      event,
      //@ts-ignore
      this.state.context
    );
    console.log(
      `${logTag} - transition() event ==  ${event} nextEVent == ${JSON.stringify(
        nextState
      )}`
    );

    if (nextState === this.statePrevious) {
      console.log(`${logTag} - no state change`);
      return;
    }
    this.statePrevious = nextState;

    // currentState = stateNext;
    this.setState({ currentState: nextState });
  };

  render() {
    return (
      <StyledApp>
        <Header />
        <StateChart machine={navMachine} />
      </StyledApp>
    );
  }
}

export default App;
