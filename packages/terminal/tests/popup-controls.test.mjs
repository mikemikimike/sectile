import assert from'node:assert/strict';import test from'node:test';import{unwrap}from'@sectile/core/result';import{createDialog}from'../.verification-dist/dialog.js';import{createDrawer}from'../.verification-dist/drawer.js';import{createPopover}from'../.verification-dist/popover.js';import{createAlertDialog}from'../.verification-dist/alert-dialog.js';import{createTooltip}from'../.verification-dist/tooltip.js';test('terminal popup facades own escape and command delivery',()=>{let restored=0;const d=createDialog({defaultOpen:true,onFocusRestore:()=>restored++});d.handleKeyboardInput({key:'escape'});assert.equal(restored,1);const p=createPopover({defaultOpen:true});p.handleKeyboardInput({key:'escape'});assert.equal(p.getSnapshot().state.open,false);let announced=0;const a=createAlertDialog({onAnnounce:()=>announced++});a.handleEvent('open');assert.equal(announced,1);const t=createTooltip();t.handleEvent('open');t.handleKeyboardInput({key:'escape'});assert.equal(t.getSnapshot().state.open,false)});test('terminal drawer preserves its side through open reconciliation',()=>{const drawer=createDrawer({defaultOpen:true,side:'left'});assert.equal(drawer.getSnapshot().state.side,'left');drawer.handleEvent({type:'set-side',side:'right'});drawer.handleKeyboardInput({key:'escape'});assert.deepEqual(drawer.getSnapshot().state,{open:false,side:'right'})});

test('terminal popups publish committed state before command errors escape', () => {
  const trace = [];
  const callbackError = new Error('focus callback failed');
  const connection = createPopover({
    onInitialFocus: () => { trace.push('focus'); throw callbackError; },
    onUpdate: () => { trace.push('update'); throw new Error('secondary update callback failed'); },
  });
  connection.subscribe((snapshot) => trace.push(`observer:${snapshot.revision}`));

  assert.throws(() => connection.send('open'), (error) => error === callbackError);
  assert.deepEqual(connection.getSnapshot().state, { open: true });
  assert.equal(connection.getSnapshot().revision, 1);
  assert.deepEqual(trace, ['focus', 'observer:1', 'update']);
});

test('terminal popups drain every command before the first command error escapes', () => {
  const trace = [];
  const callbackError = new Error('focus callback failed');
  const connection = createAlertDialog({
    onInitialFocus: () => { trace.push('focus'); throw callbackError; },
    onAnnounce: () => { trace.push('announce'); },
    onUpdate: () => { trace.push('update'); },
  });
  connection.subscribe((snapshot) => trace.push(`observer:${snapshot.revision}`));

  assert.throws(() => connection.send('open'), (error) => error === callbackError);
  assert.equal(connection.getSnapshot().state.open, true);
  assert.deepEqual(trace, ['focus', 'announce', 'observer:1', 'update']);
});

test('terminal popups complete publication when open-change callbacks throw', () => {
  const trace = [];
  const callbackError = new Error('open callback failed');
  const connection = createDialog({
    onOpenChange: (open) => { trace.push(`open:${open}`); throw callbackError; },
    onInitialFocus: () => { trace.push('focus'); },
    onUpdate: () => { trace.push('update'); },
  });
  connection.subscribe((snapshot) => trace.push(`observer:${snapshot.revision}`));

  assert.throws(() => connection.send('open'), (error) => error === callbackError);
  assert.equal(connection.getSnapshot().state.open, true);
  assert.deepEqual(trace, ['focus', 'open:true', 'observer:1', 'update']);
});

test('terminal popups do not publish rejected transitions', () => {
  const trace = [];
  const connection = createPopover({ onUpdate: () => trace.push('update') });
  connection.subscribe((snapshot) => trace.push(`observer:${snapshot.revision}`));

  assert.equal(connection.send('invalid'), false);
  assert.equal(connection.getSnapshot().revision, 0);
  assert.equal(connection.getSnapshot().state.open, false);
  assert.deepEqual(trace, []);
});
