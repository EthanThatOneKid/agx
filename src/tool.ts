import type { z } from "zod";
import type { Experimental_AgentSettings, ToolSet } from "ai";
import { tool } from "ai";

/**
 * ToolProps is the props for the Tool component.
 * The execute function is automatically typed based on the inputSchema.
 */
export interface ToolProps<TSchema extends z.ZodTypeAny> {
  name: string;
  description: string;
  inputSchema: TSchema;
  execute: (args: z.infer<TSchema>) => Promise<unknown> | unknown;
}

/**
 * Tool is a component that defines a tool for use with an Agent.
 * It returns a function that modifies the agent settings by registering the tool.
 * The execute function is type-safe based on the inputSchema - TypeScript will
 * automatically infer the correct parameter type from the inputSchema prop.
 */
export function Tool<TSchema extends z.ZodTypeAny>(
  props: ToolProps<TSchema>,
): (
  settings: Experimental_AgentSettings<ToolSet, never, never>,
) => Experimental_AgentSettings<ToolSet, never, never> {
  // Create the tool instance once
  const toolInstance = tool({
    description: props.description,
    inputSchema: props.inputSchema as never,
    execute: props.execute as never,
  }) as ReturnType<typeof tool>;

  return (settings) => {
    // Get existing tools or create empty object
    const existingTools = (settings.tools || {}) as Record<string, unknown>;

    // Add the new tool to the existing tools
    const updatedTools = {
      ...existingTools,
      [props.name]: toolInstance,
    };

    // Return updated settings with the new tools
    return {
      ...settings,
      tools: updatedTools as ToolSet,
    };
  };
}
