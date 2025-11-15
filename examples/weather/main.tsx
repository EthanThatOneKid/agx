import { WeatherAgent } from "./weather-agent.tsx";

if (import.meta.main) {
  const weatherAgent = <WeatherAgent />;
  const result = await weatherAgent.generate({
    prompt: "What is the weather in San Francisco in celsius?",
  });

  console.log(result.text); // agent's final answer
  console.log(result.steps); // steps taken by the agent
}
