import { Rect, RoughAnnotationConfig, SVG_NS, FullPadding } from './model';
import { ResolvedOptions, OpSet } from 'roughjs/bin/core';
import { line, rectangle } from 'roughjs/bin/renderer';

type RoughOptionsType = 'highlight' | 'single' | 'double';

function getOptions(type: RoughOptionsType, seed: number): ResolvedOptions {
  return {
    maxRandomnessOffset: 2,
    roughness: type === 'highlight' ? 3 : 1.5,
    bowing: 1,
    stroke: '#000',
    strokeWidth: 1.5,
    curveTightness: 0,
    curveFitting: 0.95,
    curveStepCount: 9,
    fillStyle: 'hachure',
    fillWeight: -1,
    hachureAngle: -41,
    hachureGap: -1,
    dashOffset: -1,
    dashGap: -1,
    zigzagOffset: -1,
    preserveVertices: false,
    disableMultiStroke: type !== 'double',
    disableMultiStrokeFill: false,
    seed
  };
}

function parsePadding(config: RoughAnnotationConfig): FullPadding {
  const p = config.padding;
  if (p || (p === 0)) {
    if (typeof p === 'number') {
      return [p, p, p, p];
    } else if (Array.isArray(p)) {
      const pa = p as number[];
      if (pa.length) {
        switch (pa.length) {
          case 4:
            return [...pa] as FullPadding;
          case 1:
            return [pa[0], pa[0], pa[0], pa[0]];
          case 2:
            return [...pa, ...pa] as FullPadding;
          case 3:
            return [...pa, pa[1]] as FullPadding;
          default:
            return [pa[0], pa[1], pa[2], pa[3]];
        }
      }
    }
  }
  return [5, 5, 5, 5];
}

export function renderAnnotation(svg: SVGSVGElement, rect: Rect, config: RoughAnnotationConfig, animationGroupDelay: number, animationDuration: number, seed: number) {
  const opList: OpSet[] = [];
  let strokeWidth = config.strokeWidth || 2;
  const padding = parsePadding(config);
  const animate = (config.animate === undefined) ? true : (!!config.animate);
  const iterations = config.iterations || 1;
  const rtl = config.rtl ? 1 : 0;
  const o = getOptions('single', seed);

  switch (config.type) {
    case 'underline': {
      const y = rect.y + rect.h + padding[2];
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          opList.push(line(rect.x + rect.w, y, rect.x, y, o));
        } else {
          opList.push(line(rect.x, y, rect.x + rect.w, y, o));
        }
      }
      break;
    }
    case 'box': {
      const x = rect.x - padding[3];
      const y = rect.y - padding[0];
      const width = rect.w + (padding[1] + padding[3]);
      const height = rect.h + (padding[0] + padding[2]);
      for (let i = 0; i < iterations; i++) {
        opList.push(rectangle(x, y, width, height, o));
      }
      break;
    }
  }

  if (opList.length) {
    const pathStrings = opsToPath(opList);
    const lengths: number[] = [];
    const pathElements: SVGPathElement[] = [];
    let totalLength = 0;
    const setAttr = (p: SVGPathElement, an: string, av: string) => p.setAttribute(an, av);

    for (const d of pathStrings) {
      const path = document.createElementNS(SVG_NS, 'path');
      setAttr(path, 'd', d);
      setAttr(path, 'fill', 'none');
      setAttr(path, 'stroke', config.color || 'currentColor');
      setAttr(path, 'stroke-width', `${strokeWidth}`);
      if (animate) {
        const length = path.getTotalLength();
        lengths.push(length);
        totalLength += length;
      }
      svg.appendChild(path);
      pathElements.push(path);
    }

    if (animate) {
      let durationOffset = 0;
      for (let i = 0; i < pathElements.length; i++) {
        const path = pathElements[i];
        const length = lengths[i];
        const duration = totalLength ? (animationDuration * (length / totalLength)) : 0;
        const delay = animationGroupDelay + durationOffset;
        const style = path.style;
        style.strokeDashoffset = `${length}`;
        style.strokeDasharray = `${length}`;
        style.animation = `rough-notation-dash ${duration}ms ease-out ${delay}ms forwards`;
        durationOffset += duration;
      }
    }
  }
}

function opsToPath(opList: OpSet[]): string[] {
  const paths: string[] = [];
  for (const drawing of opList) {
    let path = '';
    for (const item of drawing.ops) {
      const data = item.data;
      switch (item.op) {
        case 'move':
          if (path.trim()) {
            paths.push(path.trim());
          }
          path = `M${data[0]} ${data[1]} `;
          break;
        case 'bcurveTo':
          path += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `;
          break;
        case 'lineTo':
          path += `L${data[0]} ${data[1]} `;
          break;
      }
    }
    if (path.trim()) {
      paths.push(path.trim());
    }
  }
  return paths;
}