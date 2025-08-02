// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Set token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

// Remove token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem("token");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && token !== undefined;
};
