const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = data?.error || data?.message || 'Server error';
    throw new Error(error);
  }

  return data;
}
