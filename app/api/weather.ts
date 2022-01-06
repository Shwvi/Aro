import axios from "axios";
import url from "url";
import querystring from "query-string";
import crypto from "crypto";
import tokens from "../../token.json";
import { dispatchWeather, WeatherData } from "../ui/state/weather";
const LASTUPDATEWEATHER = "ARO_LASTUPDATEWEATHER";
const LASTWEATHER = "ARO_LASTWEATHER";
const locationInfo: { latitude?: number; longitude?: number; city?: string } = {
  city: tokens.city,
};
export function initLocationInfo() {
  return new Promise((resolve, reject) => {
    const lastWeather = localStorage.getItem(LASTWEATHER);
    const lastUpdateWeather = localStorage.getItem(LASTUPDATEWEATHER);
    if (lastUpdateWeather && lastWeather) {
      const lastUpdateDate = new Date(lastUpdateWeather);
      if (+new Date() - +lastUpdateDate <= 1000 * 60 * 60) {
        const weather = JSON.parse(lastWeather);
        dispatchWeather(weather);
        resolve("location");
        return;
      }
    }
    getCurrentWeather().then((d) => {
      localStorage.setItem(LASTUPDATEWEATHER, "" + new Date());
      localStorage.setItem(LASTWEATHER, JSON.stringify(d.now));
      console.log(d.now);
      dispatchWeather(d.now);
      resolve("location");
    });
  });
}
const weatherRequest = axios.create({
  baseURL: `https://api.seniverse.com/v3/`,
});
weatherRequest.interceptors.response.use(
  (value) => {
    return value?.data?.results?.[0];
  },
  (err) => {
    return Promise.reject(err);
  }
);
const secret = tokens.weather_token; // 秘钥

function signature(urlString: string, paramsObj: { [index: string]: string }) {
  if (!urlString) {
    return;
  }
  const obj = url.parse(urlString, true, true);
  const params = Object.assign({}, paramsObj, obj.query);
  let result = querystring.stringify(params, { encode: false });
  const sig = crypto
    .createHmac("sha1", secret)
    .update(result, "utf8")
    .digest("base64");

  result += `&sig=${encodeURIComponent(sig)}`;

  return result;
}
export const getCurrentCity = () =>
  weatherRequest.get<any, { name: string }>("/location/search.json", {
    params: {
      key: secret,
      q: `${114.4}:${32.1}`,
      language: "en",
      unit: "c",
    },
  });
export const getCurrentWeather = () =>
  weatherRequest.get<any, { now: WeatherData }>("/weather/now.json", {
    params: {
      key: secret,
      location: locationInfo.city,
      language: "en",
      unit: "c",
    },
  });
export async function precipMinutely() {
  const url = `https://api.seniverse.com/v3/weather/now.json?key=${secret}&location=${locationInfo.city}&language=en`;

  const rsp = await axios.get(url);

  console.log("success:", rsp);
}
