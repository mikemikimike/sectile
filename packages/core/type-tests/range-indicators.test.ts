import * as Meter from '@sectile/core/meter';
import * as Progress from '@sectile/core/progress';
import * as Group from '@sectile/core/meter-group';

const meterInput: Meter.MeterInput = { value: '25' };
const meterState: Meter.MeterState = Meter.createMeterState(meterInput);
const meterZone: Meter.MeterZone = meterState.zone;
const progressInput: Progress.ProgressInput = { value: null, max: '100' };
const progressState: Progress.ProgressState = Progress.createProgressState(progressInput);
const progressStatus: Progress.ProgressStatus = progressState.status;
const groupItem: Group.MeterGroupItemInput = { id: 'used', value: '25' };
const groupInput: Group.MeterGroupInput = { max: '100', items: [groupItem] };
const groupState: Group.MeterGroupState = Group.createMeterGroupState(groupInput);
declare const groupSegment: Group.MeterGroupSegment;
void [Meter.tryCreateMeterState, Progress.tryCreateProgressState, Group.tryCreateMeterGroupState,
  meterZone, progressStatus, groupState, groupSegment];

// @ts-expect-error Component runtime belongs to the focused Core subpath.
import { createMeterState } from '@sectile/core';
// @ts-expect-error Component runtime belongs to the focused Core subpath.
import { createProgressState } from '@sectile/core';
// @ts-expect-error Component runtime belongs to the focused Core subpath.
import { createMeterGroupState } from '@sectile/core';
// @ts-expect-error Public component subpaths expose named exports.
import meterDefault from '@sectile/core/meter';
// @ts-expect-error Public component subpaths expose named exports.
import progressDefault from '@sectile/core/progress';
// @ts-expect-error Public component subpaths expose named exports.
import groupDefault from '@sectile/core/meter-group';
void [createMeterState, createProgressState, createMeterGroupState, meterDefault, progressDefault, groupDefault];
