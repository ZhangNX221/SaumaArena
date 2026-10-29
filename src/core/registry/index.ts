import { SportModule } from '../types/sport';

const modules = new Map<string, SportModule<any, any>>();

export const sportRegistry = {
  register: (m: SportModule<any, any>) => modules.set(m.code.toLowerCase(), m),
  get: (code: string) => modules.get(code.toLowerCase()),
  has: (code: string) => modules.has(code.toLowerCase()),
  list: () => Array.from(modules.values()),
};
