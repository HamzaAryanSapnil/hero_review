export type FieldErrors = Record<string, string[] | undefined>;

export type ActionState = {
  ok: boolean;
  formError?: string;
  fields?: FieldErrors;
};

export const initialActionState: ActionState = {
  ok: false,
};

export const fieldError = (state: ActionState, name: string): string | undefined => {
  return state.fields?.[name]?.[0];
};
