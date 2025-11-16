# `@fartlabs/agx`

[![GitHub Actions](https://github.com/FartLabs/agx/actions/workflows/check.yaml/badge.svg)](https://github.com/FartLabs/agx/actions/workflows/check.yaml)
[![JSR](https://jsr.io/badges/@fartlabs/agx)](https://jsr.io/@fartlabs/agx)
[![JSR score](https://jsr.io/badges/@fartlabs/agx/score)](https://jsr.io/@fartlabs/agx/score)

agx is a JSX agent development system.

## What are Agents?

Agents are **large language models (LLMs)** that use **tools** until the task is
complete.

## Why use the Agent component?

agx provides a declarative way to build AI agents using JSX syntax and AI SDK
primitives.

- **LLMs** process input and decide the next action
- **Tools** extend capabilities beyond text generation (reading files, calling
  APIs, writing to databases)
- **Loop** orchestrates execution through:
  - **Context management** - Maintaining conversation history and deciding what
    the model sees (input) at each step
  - **Stopping conditions** - Determining when the loop (task) is complete

## Creating an Agent

Define an agent by declaring a new component using the `Agent` component with
your desired configuration.

```tsx
import { Agent, Tool } from "@fartlabs/agx";
import { stepCountIs } from "ai";
import { z } from "zod";

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
```

## Using an Agent

Once defined, you can integrate the agent into your application.

```tsx
const result = await weatherAgent.generate({
  prompt: "What is the weather in San Francisco in celsius?",
});

console.log(result.text); // agent's final answer
console.log(result.steps); // steps taken by the agent
```

For more information on using an instance of the Agent component, see the
[AI SDK documentation](https://ai-sdk.dev/docs/agents/building-agents#using-an-agent).

## Examples

See the [examples](./examples) directory for more examples.

Run the weather example:

```
deno --env -A examples/weather/main.tsx
```

---

Developed with 🧪 [**@FartLabs**](https://fartlabs.org)
