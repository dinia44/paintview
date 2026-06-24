export type Point = { x: number; y: number };

/** Euclidean distance between two normalised (0–1) points. */
export function dist(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Order four points into top-left, top-right, bottom-right, bottom-left. */
export function orderCorners(points: Point[]): [Point, Point, Point, Point] {
  if (points.length < 4) {
    const p = points[0] ?? { x: 0.5, y: 0.5 };
    return [p, p, p, p];
  }
  const sorted = [...points].sort((a, b) => a.y - b.y);
  const top = sorted.slice(0, 2).sort((a, b) => a.x - b.x);
  const bottom = sorted.slice(2, 4).sort((a, b) => a.x - b.x);
  return [top[0], top[1], bottom[1], bottom[0]];
}

/** Average pixel width & height of the wall quad in normalised space. */
export function wallPixelDimensions(points: Point[]) {
  const [tl, tr, br, bl] = orderCorners(points);
  const widthPx = (dist(tl, tr) + dist(bl, br)) / 2;
  const heightPx = (dist(tl, bl) + dist(tr, br)) / 2;
  return { widthPx, heightPx, corners: { tl, tr, br, bl } };
}

/** Derive both dimensions when the user supplies one known edge length. */
export function calcDimensionsFromReference(
  points: Point[],
  reference: "width" | "height",
  meters: number
) {
  const { widthPx, heightPx } = wallPixelDimensions(points);
  if (widthPx <= 0 || heightPx <= 0) {
    return { widthM: meters, heightM: meters };
  }
  if (reference === "width") {
    return { widthM: meters, heightM: meters * (heightPx / widthPx) };
  }
  return { widthM: meters * (widthPx / heightPx), heightM: meters };
}

/** Midpoint between two points (for label placement). */
export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** Format metres for on-screen labels. */
export function formatM(m: number) {
  return `${m.toFixed(2)}m`;
}
