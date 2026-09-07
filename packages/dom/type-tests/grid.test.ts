import { createGridControl, type GridConnection } from '@sectile/dom/grid';

declare const root: HTMLElement;
declare const cell: HTMLElement;
const grid: GridConnection<'a' | 'b'> = createGridControl<'a' | 'b'>({ root, rows: [['a', 'b']] });
grid.setCellAttributes(cell, 'a');
grid.setCellAttributes(cell, 'b', { disabled: true });
grid.setCellAttributes(undefined, 'a');
// @ts-expect-error Cell release keeps the grid's stable identity type.
grid.setCellAttributes(undefined, 0);
// @ts-expect-error Attribute updates require a boolean disabled state.
grid.setCellAttributes(cell, 'a', { disabled: 'true' });
// @ts-expect-error Null is not an HTMLElement or the explicit release marker.
grid.setCellAttributes(null, 'a');
