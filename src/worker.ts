import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type CreateOptions, createCodecImpl } from './worker.impl.js';

export type { CreateOptions };

export const createCodec = (options?: Omit<CreateOptions, 'filename'>) =>
  createCodecImpl(path.dirname(fileURLToPath(import.meta.url)), options);
