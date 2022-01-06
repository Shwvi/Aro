import { generateSubScribe } from "../../hook";
import { faceDrawer } from "../lib/draw";

const {
  useSubScribe: useSubScribeDark,
  dispatch,
  getCurValue: getCurDark,
} = generateSubScribe<"light" | "dark">("light");
export function dispatchDark(value: "light" | "dark") {
  dispatch(value);
  faceDrawer.changePattern();
  faceDrawer.drawWholeFace(3);
}
export { useSubScribeDark, getCurDark };
