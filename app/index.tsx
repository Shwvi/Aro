import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "react-dom";
import { useSnackbar, SnackbarProvider } from "notistack";
import { Main } from "./ui/main";
import "./index.css";
import { dispatchInitLoading, useSubScribeInitLoading } from "./ui/state";
import LinearIndeterminate from "./ui/component/LineLoading";
import { setSpeech, Speak } from "./ui/lib/speech";
import { getNowDayState, lifeCycler } from "./ui/lib/lifecycle/emitter";
import { initLocationInfo } from "./api/weather";
import { MessageChannelBuild } from "./message";

const App = () => {
  const { value: loading } = useSubScribeInitLoading();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    lifeCycler.registerStart(setSpeech);
    lifeCycler.registerStart(initLocationInfo);
    lifeCycler.registerStart(MessageChannelBuild);
    lifeCycler.start().then(() => {
      enqueueSnackbar("ARO system started", {
        variant: "success",
      });
      new Speak([
        { text: "aro system started", afterWait: 100 },
        {
          text: `Good ${getNowDayState()},,,,, My master`,
        },
      ]).play();
      dispatchInitLoading(false);
    });
  }, []);
  return (
    <div className="w-screen h-screen dark:bg-gray-700 relative font-mono">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center text-blue-300 dark:text-blue-500">
          <div className=" w-4/5">
            Aro is loading...
            <LinearIndeterminate />
          </div>
        </div>
      ) : (
        <Router>
          <Main />
        </Router>
      )}
    </div>
  );
};

render(
  <SnackbarProvider maxSnack={5}>
    <App />
  </SnackbarProvider>,
  document.getElementById("root")
);
