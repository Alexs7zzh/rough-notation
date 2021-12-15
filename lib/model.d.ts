export declare const SVG_NS = "http://www.w3.org/2000/svg";
export declare const DEFAULT_ANIMATION_DURATION = 800;
export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}
export declare type RoughAnnotationType = 'underline' | 'box';
export declare type FullPadding = [number, number, number, number];
export declare type RoughPadding = number | [number, number] | FullPadding;
export interface RoughAnnotationConfig extends RoughAnnotationConfigBase {
    type: RoughAnnotationType;
    className?: string | undefined;
    commentId?: string | undefined;
    rootId?: string | undefined;
}
export interface RoughAnnotationConfigBase {
    animate?: boolean;
    animationDuration?: number;
    color?: string;
    strokeWidth?: number;
    padding?: RoughPadding;
    iterations?: number;
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
declare type OpType = 'move' | 'bcurveTo' | 'lineTo';
declare type OpSetType = 'path' | 'fillPath' | 'fillSketch';
export interface Op {
    op: OpType;
    data: number[];
}
declare type Point = [number, number];
export interface OpSet {
    type: OpSetType;
    ops: Op[];
    size?: Point;
    path?: string;
}
export {};
