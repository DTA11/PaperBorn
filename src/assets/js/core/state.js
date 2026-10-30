/* Shared singletons. `state` is mutated in place so every module that imports it stays current. */
export const state = { theme: '', format: '', fontMode: '', bleed: false, page: 0, photo: {}, toggles: {}, data: {} };
export const ctx = { def: null };
export const fmt = () => ctx.def.formats[state.format];
export const theme = () => ctx.def.themes[state.theme];
