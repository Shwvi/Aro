import { FaceDrawer, faceDrawer } from ".";
import {
  faceNorm,
  faceBlink1,
  faceBlink2,
  mouseSpeak1,
  mouseSpeak2,
  mouseSpeak3,
  mouseNorm,
} from "./assets/face";
export function faceStop() {
  faceDrawer.animateStopFace();
}
export function naturalBlink() {
  const nextTime = Math.random() * 10000;
  const currentInterval = Math.random() * 200 + 100;

  blink(currentInterval * 4, () => {
    setTimeout(() => {
      naturalBlink();
    }, nextTime);
  });
}
export function blink(end?: number, onEnd?: (self: FaceDrawer) => void) {
  faceDrawer.animateFace({
    faces: [faceNorm, faceBlink1, faceBlink2, faceBlink1],
    interval: 150,
    end,
    onEnd,
    entire: true,
  });
}

export function mouseStop() {
  faceDrawer.animateStopMouse();
}
export function mouseSpeak(end?: number, onEnd?: (self: FaceDrawer) => void) {
  faceDrawer.animateMouse({
    faces: [
      mouseSpeak1,
      mouseSpeak3,
      mouseSpeak2,
      mouseSpeak1,
      mouseSpeak2,
      mouseSpeak3,
    ],
    interval: 100,
    end,
    onEnd,
  });
}
