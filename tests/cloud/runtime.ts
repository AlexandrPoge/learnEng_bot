import assert from 'node:assert/strict';
import { mkdtemp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

/** Настоящий Workers/SQLite runtime с подменённым только Telegram API. */
export async function createCloudRuntime() {
  const directory = await mkdtemp(join(tmpdir(), 'learneng-cloud-'));
  const calls: { method: string; payload: any }[] = [];
  let photoBytes: Uint8Array | undefined;
  const assets = (await readdir('.cloud-build')).filter((p) => p.endsWith('.wasm') || p.endsWith('.ttf'));
  const options = {
    modulesRoot: resolve('.cloud-build'),
    modules: [
      { type: 'ESModule' as const, path: resolve('.cloud-build/worker.js') },
      ...assets.map((path) => ({
        type: path.endsWith('.wasm') ? ('CompiledWasm' as const) : ('Data' as const),
        path: resolve('.cloud-build', path),
      })),
    ],
    compatibilityDate: '2026-11-08',
    compatibilityFlags: ['nodejs_compat'],
    durableObjects: { BOT: { className: 'LearningBot', useSQLite: true } },
    resourcePersistencePath: directory,
    bindings: {
      TELEGRAM_BOT_TOKEN: '12345:fake-test-token',
      ADMIN_IDS: '99',
      TEACHER_IDS: '10',
      WEBHOOK_SECRET: 'webhook-secret',
      CLOUD_ADMIN_KEY: 'admin-secret',
    },
    outboundService: async (request: Request) => {
      assert.equal(new URL(request.url).hostname, 'api.telegram.org');
      const method = new URL(request.url).pathname.split('/').at(-1)!;
      let payload: any;
      if (request.headers.get('content-type')?.startsWith('multipart/')) {
        const form = await request.formData();
        const photo = form.get('photo');
        if (photo instanceof Blob) photoBytes = new Uint8Array(await photo.arrayBuffer());
        payload = { photo: typeof photo === 'string' ? photo : 'uploaded' };
      } else payload = await request.json();
      calls.push({ method, payload });
      return Response.json({
        ok: true,
        result: {
          chat: { id: 99, type: 'private' },
          message_id: calls.length,
          photo: [{ file_id: 'cached-png', width: 1080, height: 1200 }],
        },
      });
    },
  };
  const makeRuntime = () => new Miniflare(convertV4MiniflareOptions(options));
  return { directory, calls, makeRuntime, getPhoto: () => photoBytes };
}
