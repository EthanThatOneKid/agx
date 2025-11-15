import { assertEquals } from "@std/assert";
import { Agent, Tool } from "./mod.ts";
import { stepCountIs } from "ai";
import { z } from "zod";

Deno.test("Agent component instantiates successfully", () => {
  const agent = <Agent model="openai/gpt-4o" />;
  assertEquals(agent.settings.model, "openai/gpt-4o");
});

Deno.test("README example: WeatherAgent", () => {
  function WeatherAgent() {
    return (
      <Agent model="openai/gpt-4o" stopWhen={stepCountIs(20)}>
        <Tool
          name="weather"
          description="Get the weather in a location (in Fahrenheit)"
          inputSchema={z.object({
            location: z.string().describe(
              "The location to get the weather for",
            ),
          })}
          execute={(args) => ({
            location: args.location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          })}
        />
        <Tool
          name="convertFahrenheitToCelsius"
          description="Convert temperature from Fahrenheit to Celsius"
          inputSchema={z.object({
            temperature: z.number().describe(
              "Temperature in Fahrenheit",
            ),
          })}
          execute={(args) => {
            const celsius = Math.round((args.temperature - 32) * (5 / 9));
            return { celsius };
          }}
        />
      </Agent>
    );
  }

  const weatherAgent = <WeatherAgent />;

  // Verify agent was created
  assertEquals(weatherAgent.settings.model, "openai/gpt-4o");

  // Verify tools were registered
  const tools = weatherAgent.settings.tools;
  assertEquals(tools !== undefined, true);
  if (tools) {
    assertEquals("weather" in tools, true);
    assertEquals("convertFahrenheitToCelsius" in tools, true);
  }
});
