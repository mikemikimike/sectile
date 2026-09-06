import type { Result, StableID } from '@sectile/core';
import { applyToastEvent, tryCreateToastState, type ToastCommand, type ToastEvent, type ToastInput, type ToastItem, type ToastPolicies, type ToastState } from '@sectile/core/toast';
import type { RevisionResult, RevisionSnapshot } from '@sectile/core/revision';
import { unwrap } from '@sectile/core/result';
import { createFacadeConnection, type FacadeConnection } from '@sectile/core/adapter-runtime';
import { createSemanticController, type SemanticController } from '@sectile/core/adapter-runtime';
import type { TerminalKeyboardInput } from './keyboard.js';

export interface ToastOptions<ID extends StableID = StableID> extends ToastPolicies { readonly initialToasts?: readonly ToastInput<ID>[]; readonly onItemsChange?: (items: readonly ToastItem<ID>[]) => void; readonly onAnnounce?: (item: ToastItem<ID>) => void; readonly onDismiss?: (id: ID, reason: 'manual' | 'timeout' | 'overflow') => void; readonly onUpdate?: () => void }

export type ToastItemsChangeHandler<ID extends StableID = StableID> = NonNullable<ToastOptions<ID>['onItemsChange']>;
export type ToastAnnounceHandler<ID extends StableID = StableID> = NonNullable<ToastOptions<ID>['onAnnounce']>;
export type ToastDismissHandler<ID extends StableID = StableID> = NonNullable<ToastOptions<ID>['onDismiss']>;
export type ToastUpdateHandler<ID extends StableID = StableID> = NonNullable<ToastOptions<ID>['onUpdate']>;
export interface ToastConnection<ID extends StableID = StableID> { getSnapshot(): RevisionSnapshot<ToastState<ID>>; handleEvent(event: ToastEvent<ID>): boolean; handleKeyboardInput(input: TerminalKeyboardInput): boolean; push(toast: ToastInput<ID>): boolean; updateToast(id: ID, toast: Partial<Omit<ToastInput<ID>, 'id'>>): boolean; dismiss(id: ID): boolean; dismissAll(): boolean; tick(elapsedMs: number): boolean }
export function createToast<ID extends StableID>(options: ToastOptions<ID> = {}): FacadeConnection<ToastConnection<ID>> { return unwrap(tryCreateToast(options)); }
export function tryCreateToast<ID extends StableID>(options: ToastOptions<ID> = {}): Result<FacadeConnection<ToastConnection<ID>>> { return createFacadeConnection(options, (normalized) => tryCreateToastConnection(normalized)); }
function tryCreateToastConnection<ID extends StableID>(options: ToastOptions<ID>): Result<ToastConnection<ID>> {
  let runtime: SemanticController<ToastState<ID>, ToastEvent<ID>, ToastCommand<ID>>;
  const created = createSemanticController<ToastState<ID>, ToastEvent<ID>, ToastCommand<ID>, ToastCommand<ID>>({ initial: tryCreateToastState(options.initialToasts ?? [], false, options), reducer: (state, event) => applyToastEvent(state, event, options), publishEffect: (command) => publishToastCommand(command, options, runtime), notify: (_previous, proposed) => options.onItemsChange?.(proposed.items), toEffect: (command) => command });
  if (!created.ok) return created;
  runtime = created.value;
  return { ok: true, value: new TerminalToast(options, runtime) };
}

function publishToastCommand<ID extends StableID>(command: ToastCommand<ID>, options: ToastOptions<ID>, runtime: SemanticController<ToastState<ID>, ToastEvent<ID>, ToastCommand<ID>>): void {
  if (command.type === 'announce-toast') {
    const item = runtime.getSnapshot().state.items.find((candidate) => candidate.id === command.id);
    if (item !== undefined) options.onAnnounce?.(item);
    return;
  }
  options.onDismiss?.(command.id, command.reason);
}

class TerminalToast<ID extends StableID> implements ToastConnection<ID> {
  readonly #options: ToastOptions<ID>; readonly #runtime: SemanticController<ToastState<ID>, ToastEvent<ID>, ToastCommand<ID>>; #lastPublishedRevision: number;
  public constructor(options: ToastOptions<ID>, runtime: SemanticController<ToastState<ID>, ToastEvent<ID>, ToastCommand<ID>>) { this.#options = options; this.#runtime = runtime; this.#lastPublishedRevision = runtime.getSnapshot().revision; }
  public getSnapshot(): RevisionSnapshot<ToastState<ID>> { return this.#runtime.getSnapshot(); }
  public handleEvent(event: ToastEvent<ID>): boolean {
    const previousRevision = this.#runtime.getSnapshot().revision;
    let result: RevisionResult<ToastState<ID>, ToastCommand<ID>>;
    try {
      result = this.#runtime.handle(event);
    } catch (error) {
      this.#completeCommittedThrow(previousRevision, error);
    }
    if (result.ok) this.#publishUpdate();
    return result.ok;
  }
  public handleKeyboardInput(input: TerminalKeyboardInput): boolean { if (input.key === 'escape') { const latest = this.getSnapshot().state.items.at(-1); return latest === undefined ? false : this.dismiss(latest.id); } if (input.key === 'pause') return this.handleEvent('pause'); if (input.key === 'resume') return this.handleEvent('resume'); return false; }
  public push(toast: ToastInput<ID>): boolean { return this.handleEvent({ type: 'push', toast }); }
  public updateToast(id: ID, toast: Partial<Omit<ToastInput<ID>, 'id'>>): boolean { return this.handleEvent({ type: 'update', id, toast }); }
  public dismiss(id: ID): boolean { return this.handleEvent({ type: 'dismiss', id }); }
  public dismissAll(): boolean { return this.handleEvent('dismiss-all'); }
  public tick(elapsedMs: number): boolean { return this.handleEvent({ type: 'tick', elapsedMs }); }

  #publishUpdate(): void {
    const revision = this.#runtime.getSnapshot().revision;
    if (revision <= this.#lastPublishedRevision) return;
    this.#lastPublishedRevision = revision;
    this.#options.onUpdate?.();
  }

  #completeCommittedThrow(previousRevision: number, error: unknown): never {
    if (this.#runtime.getSnapshot().revision !== previousRevision) {
      try { this.#publishUpdate(); }
      catch { /* Preserve the first publication error. */ }
    }
    throw error;
  }
}
