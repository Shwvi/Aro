import { draw } from "./core";
import { FaceConfig, faceNorm, mouseNorm } from "./assets/face";
import { AroColor } from "./pattern";
import { wheel } from "./utils";

export class FaceDrawer {
  faceTimer?: NodeJS.Timer;
  mouseTimer?: NodeJS.Timer;
  context?: CanvasRenderingContext2D;
  canvas?: HTMLCanvasElement;
  pattern: CanvasPattern;
  constructor() {
    this.pattern = AroColor();
  }
  changePattern() {
    this.pattern = AroColor();
  }
  registerCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
  }
  drawWholeFace(mode: 0 | 1 | 2 | 3) {
    if (this.context) {
      if (mode & 1)
        draw({
          palette: { r: this.pattern },
          ...faceNorm,
          context: this.context,
        });
      if (mode & 2)
        draw({
          palette: { r: this.pattern },
          ...mouseNorm,
          context: this.context,
        });
    }
  }
  animateStopFace() {
    if (this.faceTimer) clearInterval(this.faceTimer);
  }
  animateFace({
    faces,
    interval = 100,
    end,
    onEnd,
    entire,
  }: {
    faces: FaceConfig[];
    interval?: number;
    end?: number;
    onEnd?: (self: FaceDrawer) => void;
    entire?: boolean;
  }) {
    if (this.faceTimer) clearInterval(this.faceTimer);
    let total = 0;
    const self = this;
    const { canvas, context } = this;
    let currentInterval: NodeJS.Timer;
    if (context && canvas) {
      const next = wheel(faces);
      const nextFrame = () => {
        this.context?.clearRect(0, 0, canvas.width, canvas.height / 2);
        const currentFace = next();
        draw({
          palette: { r: this.pattern! },
          ...currentFace,
          context,
        });
        total += interval;
        if (end && total >= end && (entire ? currentFace === faces[0] : true)) {
          onEnd?.(self);
          clearInterval(currentInterval);
        }
      };
      this.faceTimer = currentInterval = setInterval(nextFrame, interval);
    }
  }
  animateStopMouse() {
    if (this.mouseTimer) clearInterval(this.mouseTimer);
  }
  animateMouse({
    faces,
    interval = 100,
    end,
    onEnd,
  }: {
    faces: FaceConfig[];
    interval?: number;
    end?: number;
    onEnd?: (self: FaceDrawer) => void;
  }) {
    if (this.mouseTimer) clearInterval(this.mouseTimer);
    let total = 0;
    const self = this;
    const { canvas, context } = this;
    let currentInterval: NodeJS.Timer;
    if (context && canvas) {
      const next = wheel(faces);
      const nextFrame = () => {
        this.context?.clearRect(
          0,
          canvas.height / 2,
          canvas.width,
          canvas.height / 2
        );
        const nextFace = next();

        draw({
          palette: { r: this.pattern! },
          ...nextFace,
          context,
        });
        total += interval;
        if (end && total >= end) {
          onEnd?.(self);
          clearInterval(currentInterval);
        }
      };
      this.mouseTimer = currentInterval = setInterval(nextFrame, interval);
    }
  }
}

export const faceDrawer = new FaceDrawer();
