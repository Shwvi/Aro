import React, { useCallback, useEffect, useState } from "react";
import { Route, useHistory } from "react-router-dom";
import { AnimatedSwitch, spring } from "react-router-transition";
import { faceDrawer } from "./lib/draw";
import { HoverWindow } from "./component/HoverWindow";
import { Speak } from "./lib/speech";
import { dispatchDark } from "./state/dark";
import { FacePage } from "./page/face";
import { useSubScribeWeather } from "./state/weather";
import { Button } from "@mui/material";
import { StarBorder, StarOutlined } from "@mui/icons-material";
import { sendMessageToMainProcess } from "../message";
import { useSnackbar } from "notistack";

function glide(val: number) {
  return spring(val, {
    stiffness: 174,
    damping: 24,
  });
}
const pageTransitions = {
  atEnter: {
    opacity: 0,
    offset: 100,
  },
  atLeave: {
    opacity: 0,
    offset: glide(-100),
  },
  atActive: {
    opacity: 1,
    offset: glide(0),
  },
};
export function Main() {
  const { enqueueSnackbar } = useSnackbar();
  const { value: weather } = useSubScribeWeather();
  const history = useHistory();
  const [onTop, setOnTop] = useState(true);
  const toWeatherPage = useCallback(() => {
    history.push("/weather");
  }, [history]);
  const toHomePage = useCallback(() => {
    history.push("/");
  }, [history]);

  const speakHi = useCallback(() => {
    const hi = new Speak([
      {
        text: `The weather now is`,
      },
      {
        text: weather.text,
      },
      {
        text: `and the temperature is `,
      },
      {
        text: `${weather.temperature || "unknown"} ${
          Math.abs(Number(weather.temperature)) > 1 ? "degrees" : "degree"
        } centigrade.`,
      },
    ]);
    hi.play();
  }, [weather]);
  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkMode.matches) {
      dispatchDark("dark");
      faceDrawer.changePattern();
    }
    const onThemeChange = (e: MediaQueryListEvent) => {
      const newColorScheme = e.matches ? "dark" : "light";
      dispatchDark(newColorScheme);
    };
    darkMode.addEventListener("change", onThemeChange);
    return () => {
      darkMode.removeEventListener("change", onThemeChange);
    };
  }, []);
  return (
    <div className="w-screen h-screen dark:bg-gray-700 relative font-mono">
      <HoverWindow
        classname=" absolute left-1 top-1 h-8 w-8 flex justify-center items-center z-10 text-blue-400"
        onClick={() => {
          sendMessageToMainProcess<boolean>({
            type: "ARO-Change-Top",
            data: !onTop,
          })
            .then((d) => {
              enqueueSnackbar(`AlwaysOnTop state now is ${d}`, {
                variant: "success",
              });
              setOnTop(d);
            })
            .catch((e) => {
              enqueueSnackbar(
                e.message || `AlwaysOnTop state failed to change`,
                {
                  variant: "error",
                }
              );
            });
        }}
      >
        {onTop ? <StarOutlined /> : <StarBorder />}
      </HoverWindow>
      <HoverWindow classname="absolute right-2 top-1 w-2/3 h-8 bg-yellow-100 z-20">
        <Button onClick={speakHi}>Speak</Button>
        <Button onClick={toWeatherPage}> Weather</Button>
        <Button onClick={toHomePage}> Home</Button>
      </HoverWindow>
      <AnimatedSwitch
        {...pageTransitions}
        mapStyles={(styles) => ({
          transform: `translateX(${styles.offset}%)`,
        })}
        className="switch-wrapper"
      >
        <Route path={"/weather"}>Weather</Route>
        <Route path={"/"}>
          <FacePage />
        </Route>
      </AnimatedSwitch>
    </div>
  );
}
