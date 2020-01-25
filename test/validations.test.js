const { validate } = require('../src');
const {
  correctCases,
  errorCases,
  methodErrorCases,
  multipleCases,
} = require('./test-cases');
const { throws, doesNotThrow, strictEqual } = require('assert');

describe('passing validations', () => {
  correctCases.forEach(([title, validation, func, funcArgs, expected]) => {
    it(title, () => {
      doesNotThrow(() => {
        const validatedFunc = validate(validation)(func);
        const result = validatedFunc(...funcArgs);

        strictEqual(result, expected);
      });
    });
  });
});

describe('failing validations', () => {
  errorCases.forEach(([title, validation, func, expected]) => {
    it(title, () => {
      throws(
        () => {
          const validatedFunc = validate(validation)(func);
          validatedFunc();
        },
        err => err.message === expected,
      );
    });
  });
});

describe('failing object method validations', () => {
  methodErrorCases.forEach(([title, validation, func, thisArg, expected]) => {
    it(title, () => {
      throws(
        () => {
          const validatedFunc = validate.call(thisArg, validation)(func);
          validatedFunc();
        },
        err => err.message === expected,
      );
    });
  });
});

describe('failing multiple validations', () => {
  multipleCases.forEach(([title, validations, func, funcArgs, expected]) => {
    it(title, () => {
      throws(
        () => {
          const validatedFunc = validate(...validations)(func);
          validatedFunc(...funcArgs);
        },
        err => err.message === expected,
      );
    });
  });
});
