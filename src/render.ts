import { Rect, RoughAnnotationConfig, SVG_NS, RoughAnnotationType, ResolvedOptions, OpSet, Op } from './model';

function getOptions(type: RoughAnnotationType, seed: number): ResolvedOptions {
  return {
    maxRandomnessOffset: 2,
    roughness: type === 'underline' ? 2 : 1.5,
    bowing: 1,
    strokeWidth: 1.5,
    seed
  };
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
      }
    }
    if (path.trim()) {
      paths.push(path.trim());
    }
  }
  return paths;
}

function line(x1: number, y1: number, x2: number, y2: number, o: ResolvedOptions): Op[] {
    const random = () => ((2 ** 31 - 1) & (o.seed = Math.imul(48271, o.seed))) / 2 ** 31;
    const _offset = (x: number, roughnessGain = 1) => o.roughness * roughnessGain * ((random() * x * 2) - x);

    const lengthSq = Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
    const length = Math.sqrt(lengthSq);
    let roughnessGain = 1;
    if (length < 200) roughnessGain = 1;
    else if (length > 500) roughnessGain = 0.4;
    else roughnessGain = (-0.0016668) * length + 1.233334;

    let offset = o.maxRandomnessOffset || 0;
    if ((offset * offset * 100) > lengthSq) offset = length / 10;
    const divergePoint = 0.2 + random() * 0.2;
    let midDispX = o.bowing * o.maxRandomnessOffset * (y2 - y1) / 200;
    let midDispY = o.bowing * o.maxRandomnessOffset * (x1 - x2) / 200;
    midDispX = _offset(midDispX, roughnessGain);
    midDispY = _offset(midDispY, roughnessGain);
    const ops: Op[] = [];
    const randomFull = () => _offset(offset, roughnessGain);
    ops.push({
        op: 'move', data: [
            x1 +  _offset(offset, roughnessGain),
            y1 + _offset(offset, roughnessGain),
        ],
    });
    ops.push({
        op: 'bcurveTo',
        data: [
            midDispX + x1 + (x2 - x1) * divergePoint + randomFull(),
            midDispY + y1 + (y2 - y1) * divergePoint + randomFull(),
            midDispX + x1 + 2 * (x2 - x1) * divergePoint + randomFull(),
            midDispY + y1 + 2 * (y2 - y1) * divergePoint + randomFull(),
            x2 + randomFull(),
            y2 + randomFull(),
        ],
    });
    return ops
}

function rectangle(x: number, y: number, width: number, height: number, o: ResolvedOptions): Op[] {
    const points = [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
    ];
    const len = points.length;
    
    const ops = [];
    for (let i = 0; i < (len - 1); i++) {
      ops.push(...line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], o));
    }
    
    ops.push(...line(points[len - 1][0], points[len - 1][1], points[0][0], points[0][1], o));
    return ops;
}

export function renderAnnotation(svg: SVGSVGElement, rect: Rect, config: RoughAnnotationConfig, animationGroupDelay: number, animationDuration: number, seed: number) {
  const opList: OpSet[] = [];
  let strokeWidth = config.strokeWidth || 2;
  const padding = [5, 5, 5, 5];
  const animate = (config.animate === undefined) ? true : (!!config.animate);
  const o = getOptions(config.type, seed);

  switch (config.type) {
    case 'underline': {
      const y = rect.y + rect.h + padding[2];
      opList.push({ type: 'path', ops: line(rect.x, y, rect.x + rect.w, y, o) });
      break;
    }
    case 'box': {
      const x = rect.x - padding[3];
      const y = rect.y - padding[0];
      const width = rect.w + (padding[1] + padding[3]);
      const height = rect.h + (padding[0] + padding[2]);
      opList.push({ type: 'path', ops: rectangle(x, y, width, height, o) });
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
      setAttr(path, 'stroke', 'currentColor');
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
