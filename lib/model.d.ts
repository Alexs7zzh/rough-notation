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
export declare type BracketType = 'left' | 'right' | 'top' | 'bottom';
export interface RoughAnnotationConfig extends RoughAnnotationConfigBase {
    type: RoughAnnotationType;
    multiline?: boolean;
    rtl?: boolean;
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
    brackets?: BracketType | BracketType[];
}
export interface RoughAnnotation extends RoughAnnotationConfigBase {
    isShowing(): boolean;
    show(): void;
    hide(): void;
    remove(): void;
}
export interface RoughAnnotationGroup {
    show(): void;
    hide(): void;
}
