import { Rect, RoughAnnotationConfig, RoughAnnotation, RoughAnnotationGroup, SVG_NS, DEFAULT_ANIMATION_DURATION, RoughAnnotationType } from './model';
import { renderAnnotation } from './render';
import { ensureKeyframes } from './keyframes';
import { uid } from 'uid';

type AnnotationState = 'unattached' | 'not-showing' | 'showing';

function randomSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}

class RoughAnnotationImpl implements RoughAnnotation {
  private _state: AnnotationState = 'unattached';
  private _config: RoughAnnotationConfig;

  private _e: HTMLElement;
  private _svg?: SVGSVGElement;
  private _lastSizes: Rect[] = [];

  constructor(e: HTMLElement, config: RoughAnnotationConfig) {
    this._e = e;
    this._config = config;
    this.attach();
  }

  get className() {
    return this._config.className ? this._config.className : 'rough-annotation';
  }

  private attach() {
    if (this._state === 'unattached' && this._e.parentElement) {
      ensureKeyframes();
      const svg = this._svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('class', this.className);
      if (this._config.commentId) svg.dataset.forComment = this._config.commentId
      const style = svg.style;
      style.position = 'absolute';
      style.top = '0';
      style.left = '0';
      style.overflow = 'visible';
      style.pointerEvents = 'none';
      style.width = '100px';
      style.height = '100px';

      if (this._config.rootId) {
        const root = document.getElementById(this._config.rootId);
        if (root) root.appendChild(svg);
        else this._e.parentElement!.appendChild(svg);
      } else
        this._e.parentElement!.appendChild(svg);
      this._state = 'not-showing';
    }
  }

  show() {
    switch (this._state) {
      case 'unattached':
        break;
      case 'showing':
        this.hide();
        if (this._svg) {
          this.render(this._svg, true);
        }
        break;
      case 'not-showing':
        this.attach();
        if (this._svg) {
          this.render(this._svg, false);
        }
        break;
    }
  }

  remove() {
    if (this._svg && this._svg.parentElement) {
      this._svg.parentElement.removeChild(this._svg);
    }
  }

  refresh() {
    if (this.haveRectsChanged()) this.show();
  }

  private hide(): void {
    if (this._svg) {
      while (this._svg.lastChild) {
        this._svg.removeChild(this._svg.lastChild);
      }
    }
    this._state = 'not-showing';
  }

  private haveRectsChanged(): boolean {
    if (this._lastSizes.length) {
      const newRects = this.rects();
      if (newRects.length === this._lastSizes.length) {
        for (let i = 0; i < newRects.length; i++) {
          if (!this.isSameRect(newRects[i], this._lastSizes[i])) {
            return true;
          }
        }
      } else {
        return true;
      }
    }
    return false;
  }

  private si(a: number, b: number): boolean {
    return Math.round(a) === Math.round(b);
  }

  private isSameRect(rect1: Rect, rect2: Rect): boolean {
    return (
      this.si(rect1.x, rect2.x) &&
      this.si(rect1.y, rect2.y) &&
      this.si(rect1.w, rect2.w) &&
      this.si(rect1.h, rect2.h)
    );
  }

  private render(svg: SVGSVGElement, ensureNoAnimation: boolean) {
    let config = this._config;
    if (ensureNoAnimation) config.animate = false;
    const rects = this.rects();
    let totalWidth = 0;
    rects.forEach((rect) => totalWidth += rect.w);
    const totalDuration = (config.animationDuration || DEFAULT_ANIMATION_DURATION);
    let delay = 0;
    let type: RoughAnnotationType = 'underline'
    if (rects.length === 1 && totalWidth < 140) type = 'box'
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      const ad = totalDuration * (rect.w / totalWidth);
      renderAnnotation(svg, rects[i], config, type, delay, ad, randomSeed());
      delay += ad;
    }
    this._lastSizes = rects;
    this._state = 'showing';
  }

  private rects(): Rect[] {
    const ret: Rect[] = []
    let tmp = undefined
    if (this._svg) {
      const elementRects = this._e.getClientRects();
      for (let i = 0; i < elementRects.length; i++) {
        const n = elementRects[i];
        if (tmp === undefined)
          tmp = n;
        else if (this.si(n.left, tmp.right) && this.si(n.top, tmp.top))
          tmp.width += n.width;
        else {
          ret.push(this.svgRect(tmp));
          tmp = n;
        }
      }
      ret.push(this.svgRect(tmp!));
    }
    return ret;
  }

  private svgRect(bounds: DOMRect | DOMRectReadOnly): Rect {
    const rect1 = this._svg!.getBoundingClientRect();
    const rect2 = bounds;
    return {
      x: (rect2.x || rect2.left) - (rect1.x || rect1.left),
      y: (rect2.y || rect2.top) - (rect1.y || rect1.top),
      w: rect2.width,
      h: rect2.height
    };
  }
}

function debounce(func: () => void, timeout = 300){
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => func(), timeout);
  };
}

class RoughAnnotationGroupImpl implements RoughAnnotationGroup {
  private _ro: ResizeObserver;
  private _annotations: Map<string, RoughAnnotation>

  constructor() {
    this._annotations = new Map();
    this._ro = new ResizeObserver(debounce(() => {
      Array.from(this._annotations.values())
        .forEach((a) => a.refresh());
    }));
    this._ro.observe(document.body);
  }

  add(e: HTMLElement, config: RoughAnnotationConfig): string {
    const annotation = new RoughAnnotationImpl(e, config);
    annotation.show();
    const id = uid(16);
    this._annotations.set(id, annotation);
    return id;
  }

  remove(id: string) {
    const annotation = this._annotations.get(id);
    if (!annotation) return
    annotation.remove();
    this._annotations.delete(id);
  }
}

function main(): RoughAnnotationGroup {
  return new RoughAnnotationGroupImpl();
}

export default main