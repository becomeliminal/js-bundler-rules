// Two enums, and an application that uses one. Whether the other reaches a
// bundle is decided by how this file's JavaScript was written.
export enum Used {
  On = "on",
  Off = "off",
}

export enum Unused {
  Ghost = "TREESHAKE_UNUSED_ENUM",
}

export function label(state: Used): string {
  return `state:${state}`;
}
