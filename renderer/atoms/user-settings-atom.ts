import { atomWithStorage } from 'jotai/utils';

export const scaleAtom = atomWithStorage<'2' | '3' | '4'>('scale', '4');
