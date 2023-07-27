import { atomWithStorage } from 'jotai/utils';

export const isLoggedInAtom = atomWithStorage('isLoggedIn', false);
export const emailAtom = atomWithStorage('email', '');
export const licenseKeyAtom = atomWithStorage('licenseKey', '');
