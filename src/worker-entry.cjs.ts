import { type CreateOptions, createCodecImpl } from './worker.impl.js';

export type { CreateOptions };

export const createCodec = (options?: Omit<CreateOptions, 'filename'>) => createCodecImpl(__dirname, options);
