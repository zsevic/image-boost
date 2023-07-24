import { atom } from 'jotai';

export type TModelsList = Array<{
  label: string;
  value: string;
}>;

export const defaultModelsList = [
  { label: 'Digital Art', value: 'realesrgan-x4plus-anime' },
];

export const modelsListAtom = atom<TModelsList>(defaultModelsList);
