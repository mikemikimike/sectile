import { createMeterState } from '@sectile/core/meter';
import { createProgressState } from '@sectile/core/progress';
import { createMeterGroupState } from '@sectile/core/meter-group';
import * as Meter from '@sectile/dom/meter';
import * as Progress from '@sectile/dom/progress';
import * as Group from '@sectile/dom/meter-group';

const meterOptions: Meter.MeterRootAttributesOptions = { label: 'Quota' };
const meterIndicator: Meter.MeterIndicatorAttributesOptions = {};
const meterAttributes: Meter.MeterAttributeRecord = Meter.getMeterRootAttributes(createMeterState({ value: '25' }), meterOptions);
const meterFormatter: Meter.MeterValueFormatter = (value) => value;
const meterValues: Meter.MeterControlledValues = { value: '25' };
declare const meterConnection: Meter.MeterConnection;
declare const meterFactoryOptions: Meter.MeterOptions;

const progressOptions: Progress.ProgressRootAttributesOptions = { label: 'Upload' };
const progressIndicator: Progress.ProgressIndicatorAttributesOptions = {};
const progressAttributes: Progress.ProgressAttributeRecord = Progress.getProgressRootAttributes(createProgressState({ value: null, max: '100' }), progressOptions);
const progressFormatter: Progress.ProgressValueFormatter = (value) => value;
const progressValues: Progress.ProgressControlledValues = { value: null, max: '100' };
declare const progressConnection: Progress.ProgressConnection;
declare const progressFactoryOptions: Progress.ProgressOptions;

const groupOptions: Group.MeterGroupRootAttributesOptions = { label: 'Capacity' };
const groupSegment: Group.MeterGroupSegmentAttributesOptions = { label: 'Used' };
const groupAttributes: Group.MeterGroupAttributeRecord = Group.getMeterGroupRootAttributes(createMeterGroupState({ max: '100', items: [{ id: 'used', value: '25' }] }), groupOptions);
const groupFormatter: Group.MeterGroupValueFormatter = (value, id) => `${id}: ${value}`;
const groupValues: Group.MeterGroupControlledValues = { max: '100', items: [{ id: 'used', value: '25' }] };
declare const groupConnection: Group.MeterGroupConnection;
declare const groupFactoryOptions: Group.MeterGroupOptions;

void [Meter.createMeter, Meter.tryCreateMeter, Meter.getMeterIndicatorAttributes, Meter.getMeterNativeAttributes,
  meterIndicator, meterAttributes, meterFormatter, meterValues, meterConnection, meterFactoryOptions,
  Progress.createProgress, Progress.tryCreateProgress, Progress.getProgressIndicatorAttributes, Progress.getProgressNativeAttributes,
  progressIndicator, progressAttributes, progressFormatter, progressValues, progressConnection, progressFactoryOptions,
  Group.createMeterGroup, Group.tryCreateMeterGroup, Group.getMeterGroupSegmentAttributes, Group.getMeterGroupTrackAttributes,
  groupSegment, groupAttributes, groupFormatter, groupValues, groupConnection, groupFactoryOptions];

// @ts-expect-error Core state types belong to their Core subpaths.
import type { MeterState } from '@sectile/dom/meter';
// @ts-expect-error Core state types belong to their Core subpaths.
import type { ProgressState } from '@sectile/dom/progress';
// @ts-expect-error Core state types belong to their Core subpaths.
import type { MeterGroupState } from '@sectile/dom/meter-group';
type CoreStateLeaks = [MeterState, ProgressState, MeterGroupState];
