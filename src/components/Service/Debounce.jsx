export function debounce(func, delay) {
  let timeout;
  const cancel = () => {
    clearTimeout(timeout);
  };

  const debounced = (...args) => {
    cancel();
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };

  debounced.cancel = cancel;

  return debounced;
}
