import { assertEquals } from "@std/assert";
import { Agent } from "./agent.ts";
import { Tool } from "./tool.ts";
import { z } from "zod";

Deno.test("Tool component returns a function", () => {
  const toolFn = (
    <Tool
      name="test-tool"
      description="A test tool"
      inputSchema={z.object({ input: z.string() })}
      execute={({ input }) => ({ result: input })}
    />
  );

  assertEquals(typeof toolFn, "function");
});

Deno.test("Tool component with all required props", () => {
  const executeFn = ({ value }: { value: number }) => value * 2;

  const toolFn = (
    <Tool
      name="multiply"
      description="Multiply a number by 2"
      inputSchema={z.object({ value: z.number() })}
      execute={executeFn}
    />
  );

  assertEquals(typeof toolFn, "function");
});

Deno.test("Tool integration with Agent component", () => {
  const weatherAgent = (
    <Agent model="openai/gpt-4o">
      <Tool
        name="weather"
        description="Get the weather in a location"
        inputSchema={z.object({
          location: z.string().describe("The location to get the weather for"),
        })}
        execute={({ location }) => ({
          location,
          temperature: 72,
        })}
      />
    </Agent>
  );

  // Verify agent was created
  assertEquals(weatherAgent.settings.model, "openai/gpt-4o");

  // Verify tool was registered
  const tools = weatherAgent.settings.tools;
  assertEquals(tools !== undefined, true);
  if (tools) {
    assertEquals("weather" in tools, true);
  }
});

Deno.test("Agent with multiple Tool children", () => {
  const agent = (
    <Agent model="openai/gpt-4o">
      <Tool
        name="tool1"
        description="First tool"
        inputSchema={z.object({})}
        execute={() => ({})}
      />
      <Tool
        name="tool2"
        description="Second tool"
        inputSchema={z.object({})}
        execute={() => ({})}
      />
    </Agent>
  );

  const tools = agent.settings.tools;
  assertEquals(tools !== undefined, true);
  if (tools) {
    assertEquals("tool1" in tools, true);
    assertEquals("tool2" in tools, true);
  }
});
