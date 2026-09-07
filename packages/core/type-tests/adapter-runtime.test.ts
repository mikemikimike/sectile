import {
  createControlledComponentController,
  type ControlledComponentControllerOptions,
} from '@sectile/core/adapter-runtime';

type Command = { readonly amount: number };
type Options = ControlledComponentControllerOptions<number, number, Command, number>;

const options: Options = {
  controlled: false,
  initial: { ok: true, value: 0 },
  reducer: (state, amount) => ({ ok: true, value: { state: state + amount, commands: [{ amount }] } }),
  create: (value) => ({ ok: true, value }),
  read: (state) => state,
};

// The existing options remain valid when effects are returned to the caller.
createControlledComponentController(options);
createControlledComponentController({
  ...options,
  publishEffect: (command) => {
    const amount: number = command.amount;
    void amount;
    // @ts-expect-error Only the reducer's command shape is published.
    command.missing;
  },
});

const incompatible: Options = {
  ...options,
  // @ts-expect-error Publishers must accept the controller's command type.
  publishEffect: (_command: { readonly amount: string }) => undefined,
};
void incompatible;
