import assert from 'node:assert/strict'; import test from 'node:test'; import { unwrap } from '@sectile/core/result';
import { createCheckbox } from '../.verification-dist/checkbox.js'; import { createSwitch } from '../.verification-dist/switch.js'; import { createToggleButton } from '../.verification-dist/toggle-button.js';
test('terminal checked controls own enter and space dispatch', () => {
  const checkbox = createCheckbox({ defaultValue: 'mixed' }); checkbox.handleKeyboardInput({ key: 'space' }); assert.equal(checkbox.getSnapshot().state.checked, true);
  const control = createSwitch(); control.handleKeyboardInput({ key: 'enter' }); assert.equal(control.getSnapshot().state.checked, true);
  const toggle = createToggleButton(); toggle.handleKeyboardInput({ key: 'space' }); assert.equal(toggle.getSnapshot().state.pressed, true); assert.equal(toggle.handleKeyboardInput({ key: 'tab' }), false);
});
test('terminal checked controls enforce disabled and read-only policies', () => {
  const disabled = createSwitch({ disabled: true });
  assert.equal(disabled.handleKeyboardInput({ key: 'space' }), false);
  assert.equal(disabled.getSnapshot().state.checked, false);

  const readOnly = createCheckbox({ readOnly: true });
  assert.equal(readOnly.handleKeyboardInput({ key: 'space' }), false);
  assert.equal(readOnly.getSnapshot().state.checked, false);
});
test('terminal checked controls publish committed state after value callback errors', () => {
  const callbackError = new Error('value callback failed');
  const controls = [
    { create: createCheckbox, change: 'onValueChange', value: false, state: 'checked' },
    { create: createSwitch, change: 'onCheckedChange', value: false, state: 'checked' },
    { create: createToggleButton, change: 'onPressedChange', value: false, state: 'pressed' },
  ];

  for (const { create, change, value, state } of controls) {
    let updates = 0;
    const control = create({
      ...(change === 'onValueChange' ? { defaultValue: value } : change === 'onCheckedChange' ? { defaultChecked: value } : { defaultPressed: value }),
      [change]: () => { throw callbackError; },
      onUpdate: () => { updates += 1; throw new Error('secondary update callback failed'); },
    });

    assert.throws(() => control.handleKeyboardInput({ key: 'space' }), (error) => error === callbackError);
    assert.equal(control.getSnapshot().revision, 1);
    assert.equal(control.getSnapshot().state[state], true);
    assert.equal(updates, 1);
  }
});
