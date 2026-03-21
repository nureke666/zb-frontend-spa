export const isValidIin = (iin: string) => /^\d{12}$/.test(iin.trim());

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const getPasswordMismatchError = (
  password: string,
  confirmPassword: string,
) => {
  if (!confirmPassword) {
    return '';
  }

  return password === confirmPassword ? '' : 'Пароли не совпадают.';
};
