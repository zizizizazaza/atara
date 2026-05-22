const KEY = 'atara_authed'

export const isAuthed = () => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export const setAuthed = (v: boolean) => {
  try {
    if (v) sessionStorage.setItem(KEY, '1')
    else sessionStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
  window.dispatchEvent(new Event('atara-auth-changed'))
}
