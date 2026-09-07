import * as Meter from '@sectile/terminal/meter';
import * as Progress from '@sectile/terminal/progress';
import * as Group from '@sectile/terminal/meter-group';

const meterValues: Meter.MeterControlledValues = { value: '25' };
const meterOptions: Meter.MeterOptions = meterValues;
declare const meterConnection: Meter.MeterConnection;
declare const meterPlan: Meter.MeterRenderPlan;
const progressValues: Progress.ProgressControlledValues = { value: null, max: '100' };
const progressOptions: Progress.ProgressOptions = progressValues;
declare const progressConnection: Progress.ProgressConnection;
declare const progressPlan: Progress.ProgressRenderPlan;
const groupValues: Group.MeterGroupControlledValues = { max: '100', items: [{ id: 'used', value: '25' }] };
const groupOptions: Group.MeterGroupOptions = groupValues;
declare const groupConnection: Group.MeterGroupConnection;
declare const groupPlan: Group.MeterGroupRenderPlan;
declare const groupSegment: Group.MeterGroupRenderSegment;
void [Meter.createMeter, Meter.tryCreateMeter, meterOptions, meterConnection, meterPlan,
  Progress.createProgress, Progress.tryCreateProgress, progressOptions, progressConnection, progressPlan,
  Group.createMeterGroup, Group.tryCreateMeterGroup, groupOptions, groupConnection, groupPlan, groupSegment];

// @ts-expect-error Core factories belong to their Core subpaths.
import { tryCreateMeterState } from '@sectile/terminal/meter';
// @ts-expect-error Core factories belong to their Core subpaths.
import { tryCreateProgressState } from '@sectile/terminal/progress';
// @ts-expect-error Core factories belong to their Core subpaths.
import { tryCreateMeterGroupState } from '@sectile/terminal/meter-group';
void [tryCreateMeterState, tryCreateProgressState, tryCreateMeterGroupState];
