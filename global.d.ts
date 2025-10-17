// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      alt?: string;
      ar?: boolean | string;
      "auto-rotate"?: boolean | string;
      "camera-controls"?: boolean | string;
      "shadow-intensity"?: string | number;
      "exposure"?: string | number;
      style?: React.CSSProperties;
    };
  }
}
