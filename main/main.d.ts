/// <reference types="node" />
export function copyTemplateFiles(options: any): Promise<any>;
export function initGit(options: any): Promise<never>;
export function bootstart(options: any): Promise<boolean>;
/**
 * access
 * @internal
 */
export const access: typeof fs.access.__promisify__;
/**
 * copy
 * @internal
 */
export const copy: Function;
import fs from "fs";
