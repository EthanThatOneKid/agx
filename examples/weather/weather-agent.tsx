import { google } from "@ai-sdk/google";
import { z } from "zod";
import { Agent, Tool } from "../../src/mod.ts";

export function WeatherAgent() {
  return (
    <Agent model={google("gemini-2.5-flash")}>
      <WeatherTool />
      <ConvertFahrenheitToCelsiusTool />
    </Agent>
  );
}

function WeatherTool() {
  return (
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
  );
}

function ConvertFahrenheitToCelsiusTool() {
  return (
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
  );
}
