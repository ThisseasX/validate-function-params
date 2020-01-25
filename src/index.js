const getNumericSuffix = n =>
  ({
    1: 'st',
    2: 'nd',
    3: 'rd',
  }[n] || 'th');

const nthParamMustBe = (n, type) => (...args) => {
  if (n < 1) throw new Error('Parameter index is 1-based and must be higher than 0');

  const result = {};
  result.type = { [n - 1]: type };

  if (typeof args[n - 1] !== type) {
    const suffix = getNumericSuffix(n);
    const message = `${n}${suffix} parameter must be of type ${type}`;

    result.error = message;
  }

  return result;
};

function validate(...validations) {
  return func => (...args) => {
    const types = {};
    const errors = [];

    validations.forEach(validation => {
      const result = validation(...args);
      Object.assign(types, result.type);
      result.error && errors.push(result.error);
    });

    if (errors.length > 0) {
      const constructor = Object.getPrototypeOf(this).constructor.name;
      const constructorName = constructor !== 'Object' ? constructor + '.' : '';
      const maxValidatedArgIndex = Math.max(...Object.keys(types));

      const funcSignature =
        func.name +
        '(' +
        Array(maxValidatedArgIndex + 1)
          .fill()
          .map((_, i) => types[i] || 'any')
          .join(', ') +
        ')';

      const message =
        `Function ${constructorName}${funcSignature}\nError: ` + errors.join('\nError: ');

      throw new Error(message);
    }

    return func(...args);
  };
}

module.exports = {
  validate,
  validations: {
    firstParam: {
      mustBe: {
        string: nthParamMustBe(1, 'string'),
        number: nthParamMustBe(1, 'number'),
        boolean: nthParamMustBe(1, 'boolean'),
        function: nthParamMustBe(1, 'function'),
        object: nthParamMustBe(1, 'object'),
        undefined: nthParamMustBe(1, 'undefined'),
      },
    },
    secondParam: {
      mustBe: {
        string: nthParamMustBe(2, 'string'),
        number: nthParamMustBe(2, 'number'),
        boolean: nthParamMustBe(2, 'boolean'),
        function: nthParamMustBe(2, 'function'),
        object: nthParamMustBe(2, 'object'),
        undefined: nthParamMustBe(2, 'undefined'),
      },
    },
    thirdParam: {
      mustBe: {
        string: nthParamMustBe(3, 'string'),
        number: nthParamMustBe(3, 'number'),
        boolean: nthParamMustBe(3, 'boolean'),
        function: nthParamMustBe(3, 'function'),
        object: nthParamMustBe(3, 'object'),
        undefined: nthParamMustBe(3, 'undefined'),
      },
    },
    nthParam: n => ({
      mustBe: {
        string: nthParamMustBe(n, 'string'),
        number: nthParamMustBe(n, 'number'),
        boolean: nthParamMustBe(n, 'boolean'),
        function: nthParamMustBe(n, 'function'),
        object: nthParamMustBe(n, 'object'),
        undefined: nthParamMustBe(n, 'undefined'),
      },
    }),
  },
};
