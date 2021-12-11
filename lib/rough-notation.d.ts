import { RoughAnnotationConfig, RoughAnnotationGroup } from './model';
declare class RoughAnnotationGroupImpl implements RoughAnnotationGroup {
    private _ro;
    private _annotations;
    constructor();
    add(e: HTMLElement, config: RoughAnnotationConfig): string;
    remove(id: string): void;
}
export default RoughAnnotationGroupImpl;
