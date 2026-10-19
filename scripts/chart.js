(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const colors = ['#1479b8', '#d95f02', '#009e73', '#7a8b9e'];

  function node(name, attributes, text) {
    const element = document.createElementNS(NS, name);
    Object.entries(attributes || {}).forEach(function (entry) { element.setAttribute(entry[0], entry[1]); });
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function render(root) {
    const spec = JSON.parse(root.querySelector('script[type="application/json"]').textContent);
    const width = spec.width || 820;
    const height = spec.height || 410;
    const margin = { top: 28, right: 28, bottom: 58, left: 76 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const x = function (value) { return margin.left + (value - spec.xMin) / (spec.xMax - spec.xMin) * plotWidth; };
    const y = function (value) { return margin.top + plotHeight - (value - spec.yMin) / (spec.yMax - spec.yMin) * plotHeight; };
    const svg = node('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': spec.ariaLabel || spec.yLabel });
    svg.classList.add('native-chart');

    spec.yTicks.forEach(function (tick) {
      svg.appendChild(node('line', { x1: margin.left, x2: width - margin.right, y1: y(tick), y2: y(tick), class: 'chart-grid' }));
      svg.appendChild(node('text', { x: margin.left - 14, y: y(tick) + 6, class: 'chart-tick', 'text-anchor': 'end' }, String(tick)));
    });
    spec.xTicks.forEach(function (tick) {
      svg.appendChild(node('line', { x1: x(tick.value), x2: x(tick.value), y1: margin.top, y2: margin.top + plotHeight, class: 'chart-grid vertical' }));
      svg.appendChild(node('text', { x: x(tick.value), y: height - 23, class: 'chart-tick', 'text-anchor': 'middle' }, tick.label));
    });
    svg.appendChild(node('line', { x1: margin.left, x2: margin.left, y1: margin.top, y2: margin.top + plotHeight, class: 'chart-axis' }));
    svg.appendChild(node('line', { x1: margin.left, x2: width - margin.right, y1: margin.top + plotHeight, y2: margin.top + plotHeight, class: 'chart-axis' }));
    svg.appendChild(node('text', { x: 18, y: margin.top + plotHeight / 2, class: 'chart-label', transform: `rotate(-90 18 ${margin.top + plotHeight / 2})`, 'text-anchor': 'middle' }, spec.yLabel));
    svg.appendChild(node('text', { x: margin.left + plotWidth / 2, y: height - 2, class: 'chart-label', 'text-anchor': 'middle' }, spec.xLabel));

    if (spec.baseline) {
      const base = node('line', { x1: margin.left, x2: width - margin.right, y1: y(spec.baseline.value), y2: y(spec.baseline.value), class: 'chart-baseline' });
      svg.appendChild(base);
      svg.appendChild(node('text', { x: width - margin.right - 6, y: y(spec.baseline.value) - 10, class: 'chart-baseline-label', 'text-anchor': 'end' }, spec.baseline.label));
    }

    const legend = node('g', { class: 'chart-legend' });
    spec.series.forEach(function (series, index) {
      const color = series.color || colors[index % colors.length];
      const d = series.values.map(function (point, pointIndex) { return `${pointIndex ? 'L' : 'M'} ${x(point[0])} ${y(point[1])}`; }).join(' ');
      const path = node('path', { d, fill: 'none', stroke: color, class: 'chart-series', pathLength: 1 });
      path.style.setProperty('--series-delay', `${index * 120}ms`);
      svg.appendChild(path);
      series.values.forEach(function (point, pointIndex) {
        const marker = node('circle', { cx: x(point[0]), cy: y(point[1]), r: 5.4, fill: color, class: 'chart-marker' });
        marker.style.setProperty('--marker-delay', `${340 + index * 120 + pointIndex * 35}ms`);
        svg.appendChild(marker);
      });
      const lx = margin.left + index * 112;
      legend.appendChild(node('line', { x1: lx, x2: lx + 25, y1: 13, y2: 13, stroke: color, 'stroke-width': 4 }));
      legend.appendChild(node('text', { x: lx + 34, y: 19, fill: color }, series.name));
    });
    legend.setAttribute('transform', `translate(${width - margin.right - spec.series.length * 112}, 0)`);
    svg.appendChild(legend);
    root.prepend(svg);
  }

  document.querySelectorAll('[data-line-chart]').forEach(render);
})();
