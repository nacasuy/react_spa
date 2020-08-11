// Naive Curry implementation
const curry = (fn, ...args) =>
    args.length >= fn.length ? fn(...args) : (...partialArgs) => curry(fn, ...args, ...partialArgs);

module.exports = curry;
