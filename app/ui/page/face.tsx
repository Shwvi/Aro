import React, { useEffect, useRef } from "react";
import { faceDrawer } from "../lib/draw";
import { naturalBlink, mouseSpeak, mouseStop } from "../lib/draw/actions";
import { useSubScribeSpeaking } from "../state/speak";

export function FacePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { value: speaking } = useSubScribeSpeaking();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      faceDrawer.registerCanvas(canvas);
      faceDrawer.drawWholeFace(2);
      naturalBlink();
    }
  }, []);
  useEffect(() => {
    if (speaking) {
      mouseSpeak();
    } else {
      mouseStop();
    }
  }, [speaking]);
  return <canvas width={400} height={400} ref={canvasRef} />;
}
