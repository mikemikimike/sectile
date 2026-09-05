import type { Host } from './host-preference.js';

function humanize(value: string): string {
  return value
    .split('-')
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join(' ');
}

const sourceKinds: Readonly<Record<Host, string>> = Object.freeze({
  vue: 'Vue composition snippet',
  dom: 'DOM connection snippet',
  core: 'Core state-transition snippet',
  terminal: 'Terminal integration snippet',
});

export function prepareExampleSource(
  source: string,
  host: Host,
  component: string,
  scenario: string,
): string {
  const label = `${humanize(component)} / ${humanize(scenario)} — ${sourceKinds[host]}`;
  const prefix = host === 'vue' ? `<!-- ${label} -->` : `// ${label}`;
  return `${prefix}\n${source.replaceAll('\r\n', '\n').trim()}`;
}
