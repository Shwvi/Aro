import { getCurDark } from "../../state/dark";

export function AroBaseColor(color: string, size = 10) {
  const base = size > 2 ? size : 3;
  const patternCanvas = document.createElement("canvas");
  const patternContext = patternCanvas.getContext("2d")!;

  patternCanvas.width = base;
  patternCanvas.height = base;

  patternContext.fillStyle = color;
  patternContext.fillRect(
    1,
    1,
    patternCanvas.width - 2,
    patternCanvas.height - 2
  );
  patternContext.stroke();
  return patternContext.createPattern(patternCanvas, null)!;
}
export function AroColor(size?: number) {
  return AroBaseColor(getCurDark() === "light" ? "#CDDEFF" : "#676FA3", size);
}
