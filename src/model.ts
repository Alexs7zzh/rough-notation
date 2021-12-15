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

interface Options {
    maxRandomnessOffset?: number;
    roughness?: number;
    bowing?: number;
    stroke?: string;
    strokeWidth?: number;
    curveFitting?: number;
    curveTightness?: number;
    curveStepCount?: number;
    fill?: string;
    fillStyle?: string;
    fillWeight?: number;
    hachureAngle?: number;
    hachureGap?: number;
    simplification?: number;
    dashOffset?: number;
    dashGap?: number;
    zigzagOffset?: number;
    seed?: number;
    strokeLineDash?: number[];
    strokeLineDashOffset?: number;
    fillLineDash?: number[];
    fillLineDashOffset?: number;
    disableMultiStroke?: boolean;
    disableMultiStrokeFill?: boolean;
    preserveVertices?: boolean;
    fixedDecimalPlaceDigits?: number;
}
export interface ResolvedOptions extends Options {
    maxRandomnessOffset: number;
    roughness: number;
    bowing: number;
    stroke: string;
    strokeWidth: number;
    curveFitting: number;
    curveTightness: number;
    curveStepCount: number;
    fillStyle: string;
    fillWeight: number;
    hachureAngle: number;
    hachureGap: number;
    dashOffset: number;
    dashGap: number;
    zigzagOffset: number;
    seed: number;
    disableMultiStroke: boolean;
    disableMultiStrokeFill: boolean;
    preserveVertices: boolean;
}
type OpType = 'move' | 'bcurveTo' | 'lineTo';
type OpSetType = 'path' | 'fillPath' | 'fillSketch';
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