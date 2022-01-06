import pixel from "pixel-art";

export function draw({
  context,
  image,
  x,
  y,
  scale,
  palette,
}: {
  context: CanvasRenderingContext2D;
  x?: number;
  y?: number;
  scale?: number;
  image: string[];
  palette?: {
    [index: string]: string | CanvasPattern;
  };
}) {
  pixel
    .art(image)
    .palette(
      palette || {
        r: "red",
        o: "orange",
        y: "yellow",
        g: "#0f0",
        b: "#55f",
        m: "#909",
        B: "black",
        ".": "#ddd",
        "-": "#ffa",
        "*": "#f8e",
        "@": "#b09",
        "^": "white",
      }
    )
    .pos({ x: x || 0, y: y || 0 })
    .scale(scale || 10)
    .draw(context);
}
