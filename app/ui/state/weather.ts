import { generateSubScribe } from "../../hook";
export type WeatherData = {
  text: string;
  code: string;
  temperature: string;
};
export const { useSubScribe: useSubScribeWeather, dispatch: dispatchWeather } =
  generateSubScribe<WeatherData>({
    temperature: "unknown",
    code: "unknown",
    text: "unknown",
  });
