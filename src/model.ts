export const SVG_NS = 'http://www.w3.org/2000/svg';

export const DEFAULT_ANIMATION_DURATION = 800;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type RoughAnnotationType = 'underline' | 'box';

export interface RoughAnnotationConfig extends RoughAnnotationConfigBase {
  className?: string|undefined
  commentId?: string|undefined
  rootId?: string|undefined
}

export interface RoughAnnotationConfigBase {
  animate?: boolean; // defaults to true
  animationDuration?: number; // defaulst to 1000ms
  color?: string; // defaults to currentColor
  strokeWidth?: number; // default based on type
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

export interface ResolvedOptions {
    maxRandomnessOffset: number;
    roughness: number;
    bowing: number;
    strokeWidth: number;
    seed: number;
}

type OpType = 'move' | 'bcurveTo';
type OpSetType = 'path';
export interface Op {
    op: OpType;
    data: number[];
}
type Point = [number, number];
export interface OpSet {
    type: OpSetType;
    ops: Op[];
    size?: Point;
    path?: string;
}