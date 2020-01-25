# validate-function-params

JavaScript library that assists with function parameter validation at runtime, through an easy-to-use Fluent API.

## Installation

    $ npm install validate-function-params

## Usage

The following examples demonstrate how to use this library.

### Basic Usage

The simplest way to validate a function:

```js
const { validate, validations } = require('validate-function-params');

const add = (a, b) => a + b;

const validAdd = validate(
  validations.firstParam.mustBe.number,
  validations.secondParam.mustBe.number,
)(add);

// This call will produce the following error
// Error: Function add(number, number)
// Error: 1st parameter must be of type number
// Error: 2nd parameter must be of type number
validAdd();

// This call will produce the following error
// Error: Function add(number, number)
// Error: 2nd parameter must be of type number
validAdd(1);

// This call will successfully return 3
validAdd(1, 2);
```

### Object Method Validation

Similarly you can validate object methods the following way:

```js
const { validate, validations } = require('validate-function-params');

class Dog {
  constructor() {
    const validBark = validate(
      validations.firstParam.mustBe.string,
      validations.secondParam.mustBe.number,
    )(this.bark);

    this.bark = validBark;
  }

  bark(sound, times) {
    for (let i = 0; i < times; i++) {
      console.log(sound);
    }
  }
}

const dog = new Dog();

// This call will produce the following error
// Error: Function bark(string, number)
// Error: 1st parameter must be of type string
// Error: 2nd parameter must be of type number
dog.bark();
```

You can optionally bind `validate` to a `this` context to have its constructor name appear
in the error log:

```js
const { validate, validations } = require('validate-function-params');

class Dog {
  constructor() {
    const boundValidate = validate.bind(this);

    const validBarkWithThis = boundValidate(
      validations.firstParam.mustBe.string,
      validations.secondParam.mustBe.number,
    )(this.bark);

    this.bark = validBarkWithThis;
  }

  bark(sound, times) {
    for (let i = 0; i < times; i++) {
      console.log(sound);
    }
  }
}

const dog = new Dog();

// This call will produce the following error
// Error: Function Dog.bark(string, number)  <-- Notice 'Dog.' appearing before the method name
// Error: 1st parameter must be of type string
// Error: 2nd parameter must be of type number
dog.bark();
```

### Complex Validations

You can validate any number of specific parameters without listing the ones you do not care about:

```js
const { validate, validations } = require('validate-function-params');

const complex = (...args) => {
  /*...*/
};

const validComplex = validate(
  validations.nthParam(1).mustBe.undefined,
  validations.nthParam(5).mustBe.object,
  validations.nthParam(7).mustBe.function,
  validations.nthParam(9).mustBe.boolean,
)(complex);

// This call will produce the following error
// Error: Function complex(undefined, any, any, any, object, any, function, any, boolean)
// Error: 1st parameter must be of type undefined
// Error: 5th parameter must be of type object
// Error: 7th parameter must be of type function
// Error: 9th parameter must be of type boolean
validComplex('Not Undefined');
```

## API

| export      | type     | params                     | description                                             |
| ----------- | -------- | -------------------------- | ------------------------------------------------------- |
| validate    | function | ...validations: Function[] | any number of validation functions described below      |
| validations | object   |                            | namespace object containing validations described below |

---

### validations

| namespace   | type     | params    | description                                                                          |
| ----------- | -------- | --------- | ------------------------------------------------------------------------------------ |
| firstParam  | object   |           | namespace object containing validations described below                              |
| secondParam | object   |           | namespace object containing validations described below                              |
| thirdParam  | object   |           | namespace object containing validations described below                              |
| nthParam    | function | n: number | function that accepts a number and returns corresponding validations described below |

---

### `firstParam.mustBe` | `secondParam.mustBe` | `thirdParam.mustBe` | `nthParam(n).mustBe`

The following validation functions are provided under the above namespaces, with similar behaviour differing only in the parameter index (1-based) and the expected type.

| validation name | description        |
| --------------- | ------------------ |
| string          | expects a string   |
| number          | expects a number   |
| boolean         | expects a boolean  |
| function        | expects a function |
| object          | expects an object  |
| undefined       | expects undefined  |

## Notes

The intermediate `mustBe` namespace exists only to add to the fluency of the API, containing the actual validation functions.

## Examples

To validate the:

**1st param as string** you would need:

```
validations.firstParam.mustBe.string
```

**2nd param as number** you would need:

```
validations.secondParam.mustBe.number
```

**3rd param as boolean** you would need:

```
validations.thirdParam.mustBe.boolean
```

**4th param as object** you would need:

```
validations.nthParam(4).mustBe.object
```

**5th param as function** you would need:

```
validations.nthParam(5).mustBe.function
```

**6th param as undefined** you would need:

```
validations.nthParam(6).mustBe.undefined
```

To use the validations you would need something like:

```js
const func = () => {};

const validFunc = validate(
  validations.secondParam.mustBe.number,
  validations.nthParam(4).mustBe.object,
)(func);
```

## License

[MIT](https://github.com/ThisseasX/prefs.js/blob/master/LICENSE)
