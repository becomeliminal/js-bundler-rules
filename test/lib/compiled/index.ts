// react/compiler-runtime is CommonJS, and nothing in test/ts/vite/app imports
// it but this. Its declarations export nothing (it is not meant to be called
// directly), hence the namespace import.
import * as runtime from "react/compiler-runtime";

export const hasCompilerRuntime: boolean = Object.keys(runtime).length > 0;
