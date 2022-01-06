const { logger } = require("./log");
const {
  app,
  BrowserWindow,
  screen,
  protocol,
  MessageChannelMain,
  ipcMain,
} = require("electron");
const isDev = process.env.APPENV === "DEV";
const indexFile = "index.html";

const path = require("path");
const createWindow = () => {
  process.env.GOOGLE_API_KEY = "AIzaSyALss5tdAjQJ8Hs8wrwXRPp9b0EAvqlVSw";
  const win = new BrowserWindow({
    width: 400,
    height: 400,
    x: screen.getPrimaryDisplay().workAreaSize.width - 400,
    y: screen.getPrimaryDisplay().workAreaSize.height - 300,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });
  if (isDev) win.loadURL("http://localhost:3000/");
  else {
    const url = require("url").format({
      protocol: "file",
      slashes: true,
      pathname: require("path").join(__dirname, "../dist/index.html"),
    });

    win.loadURL(url);
  }
  win.webContents.openDevTools();
  const { port1, port2 } = new MessageChannelMain();
  port2.postMessage("ARO_MAIN_CHANNEL");
  port2.on("message", (event) => {
    const { data } = event;
    const { key, message } = data;
    if (key && message) {
      if (message.type === "ARO-Change-Top") {
        win.setAlwaysOnTop(message.data);
        port2.postMessage({ key, message: message.data });
        return;
      }
    }
  });
  port2.start();
  win.webContents.postMessage("main-world-port", null, [port1]);
};

app
  .whenReady()
  .then(() => {
    protocol.interceptFileProtocol(
      "file",
      (request, callback) => {
        const url = request.url.substr(7); // strip "file://" out of all urls
        if (request.url.endsWith(indexFile)) {
          callback({ path: url });
        } else {
          // callback({ path: path.normalize(`${__dirname}/${htmlRootDir}/${url}`) })
          callback({ path: path.join(__dirname, "../dist", url) });
        }
      },
      (error) => console.error(error)
    );
  })
  .then(createWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });
module.exports = {
  isDev,
};
