export const NAME_RE = /^\p{L}[\p{L}\p{M} .'-]{1,59}$/u; // letters, space . ' -
export const CITY_RE = /^\p{L}[\p{L}\p{M} .'-]{1,59}$/u;
export const EMAIL_RE =
  /^[A-Za-z0-9][A-Za-z0-9._%+-]{0,63}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,24}$/;
export const PHONE_RE = /^[0-9]{7,12}$/;
export const IN_PHONE_RE = /^[4-9][0-9]{9}$/; // Indian mobile numbers
export const CUSTOM_CODE_RE = /^\+[0-9]{1,4}$/;