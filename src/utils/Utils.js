const emailRegex = /.+@.+\..+/

export const validEmail = email => {
  if (!emailRegex.test(email)) {
    return false
  }
  return true
}
