/**
 * Shape Masker (compatibility shim)
 *
 * Shape masking moved into `svg-composer.ts` where it's tightly coupled
 * with final SVG assembly. This file is kept only for backward-compat imports.
 * Prefer importing directly from `./svg-composer`.
 */

export { compose1DSVG, composeQRSVG } from "./svg-composer";
export type { ComposeOptions } from "./svg-composer";
