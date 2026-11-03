/** Headless Chromium for this sandbox (no browser binary preinstalled).
 *  @sparticuz/chromium ships a compressed Chromium + AL2023 shared libs; we inflate
 *  the libs once into /tmp and point Playwright at the executable.
 *  Never reaches any network host: the npm package is installed from registry.npmjs.org.
 */
import chromium from '@sparticuz/chromium';
import { chromium as playwright } from 'playwright-core';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import zlib from 'node:zlib';

const LIB = join(tmpdir(), 'al2023', 'lib');

export async function launchBrowser() {
  if (!existsSync(join(LIB, 'libnss3.so'))) {
    const br = readFileSync('node_modules/@sparticuz/chromium/bin/al2023.tar.br');
    const tarPath = join(tmpdir(), 'al2023.tar');
    writeFileSync(tarPath, zlib.brotliDecompressSync(br));
    mkdirSync(join(tmpdir(), 'al2023'), { recursive: true });
    execFileSync('tar', ['-xf', tarPath, '-C', join(tmpdir(), 'al2023')]);
  }
  const executablePath = await chromium.executablePath();
  const browser = await playwright.launch({
    executablePath,
    headless: true,
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
    env: {
      ...process.env,
      LD_LIBRARY_PATH: LIB,
      FONTCONFIG_PATH: join(tmpdir(), 'fonts'),
      HOME: tmpdir(),
    },
  });
  return browser;
}

export async function addVirtualAuthenticator(context, page) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  });
  return { cdp, authenticatorId };
}
