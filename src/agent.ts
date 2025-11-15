import type { Experimental_AgentSettings, ToolSet } from "ai";
import { Experimental_Agent } from "ai";

/**
 * AgentProps is the props for the Agent component.
 */
export interface AgentProps
  extends Experimental_AgentSettings<ToolSet, never, never> {
  children?: FunctionalAgentSettings[];
}

/**
 * FunctionalAgentSettings is a function that modifies the agent's settings.
 */
export type FunctionalAgentSettings = (
  settings: Experimental_AgentSettings<ToolSet, never, never>,
) => Experimental_AgentSettings<ToolSet, never, never>;

/**
 * Agent is a component that creates an agent with the given settings.
 * The Agent component provides a structured way to encapsulate LLM configuration,
 * tools, and behavior into reusable components. It handles the agent loop for you,
 * allowing the LLM to call tools multiple times in sequence to accomplish complex
 * tasks. Define agents once and use them across your application.
 */
export function Agent(
  props: AgentProps,
): InstanceType<typeof Experimental_Agent> {
  const { children, ...initialSettings } = props;

  let agentSettings: Experimental_AgentSettings<ToolSet, never, never> =
    initialSettings;
  if (children) {
    const childrenArray = Array.isArray(children) ? children : [children];
    childrenArray.forEach((child) => {
      if (typeof child !== "function") {
        throw new Error(
          "Agent child must be a function that modifies the agent's settings",
        );
      }

      agentSettings = child(agentSettings);
    });
  }

  return new Experimental_Agent(agentSettings);
}
