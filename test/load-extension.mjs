import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const extensionPath = path.join(repoRoot, 'extensions', 'pi-voice.ts');

const piBin = execSync('which pi', { encoding: 'utf-8' }).trim();
const piCli = fs.realpathSync(piBin);
const piRoot = path.resolve(path.dirname(piCli), '..');
const loaderPath = path.join(piRoot, 'dist', 'core', 'extensions', 'loader.js');

const { loadExtensions } = await import(pathToFileURL(loaderPath).href);
const result = await loadExtensions([extensionPath], repoRoot);

assert.equal(result.errors.length, 0, JSON.stringify(result.errors, null, 2));
assert.equal(result.extensions.length, 1, 'expected one extension to load');

const extension = result.extensions[0];
assert.ok(extension.commands.has('voice'), 'voice command should be registered');
assert.ok(extension.tools.has('voice_capture'), 'voice_capture tool should be registered');

console.log('ok');
