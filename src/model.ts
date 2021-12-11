export const SVG_NS = 'http://www.w3.org/2000/svg';

export const DEFAULT_ANIMATION_DURATION = 800;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type RoughAnnotationType = 'underline' | 'box';
export type FullPadding = [number, number, number, number];
export type RoughPadding = number | [number, number] | FullPadding;

export interface RoughAnnotationConfig extends RoughAnnotationConfigBase {
  type: RoughAnnotationType;
  className?: string|undefined
  commentId?: string|undefined
  rootId?: string|undefined
}

export interface RoughAnnotationConfigBase {
  animate?: boolean; // defaults to true
  animationDuration?: number; // defaulst to 1000ms
  color?: string; // defaults to currentColor
  strokeWidth?: number; // default based on type
  padding?: RoughPadding; // defaults to 5px
  iterations?: number; // defaults to 1
}

export interface RoughAnnotation extends RoughAnnotationConfigBase {
  show(): void;
  remove(): void;
  refresh(): void;
}

export interface RoughAnnotationGroup {
  add(e: HTMLElement, config: RoughAnnotationConfig): string;
  remove(id: string): void;
}