const { validations } = require('../src');
const { firstParam, secondParam, thirdParam, nthParam } = validations;

class Dog {
  bark = () => {};
}

const dog = new Dog();

const func1 = x => x;
const func2 = (_, x) => x;
const func3 = (_, __, x) => x;
const func7 = (_one, _two, _three, _four, _five, _six, x) => x;

const testFunc = () => {};
const testObj = {};

const getFuncArg = type =>
  ({
    string: '',
    number: 1,
    boolean: true,
    function: testFunc,
    object: testObj,
    undefined: undefined,
  }[type]);

const correctCases = [
  ...Object.entries(firstParam.mustBe).map(([validationName, validation]) => [
    `Correctly validates first param for ${validationName} and returns it`,
    validation,
    func1,
    [getFuncArg(validationName)],
    getFuncArg(validationName),
  ]),
  ...Object.entries(secondParam.mustBe).map(([validationName, validation]) => [
    `Correctly validates second param for ${validationName} and returns it`,
    validation,
    func2,
    [, getFuncArg(validationName)],
    getFuncArg(validationName),
  ]),
  ...Object.entries(thirdParam.mustBe).map(([validationName, validation]) => [
    `Correctly validates third param for ${validationName} and returns it`,
    validation,
    func3,
    [, , getFuncArg(validationName)],
    getFuncArg(validationName),
  ]),
  ...Object.entries(nthParam(7).mustBe).map(([validationName, validation]) => [
    `Correctly validates seventh param for ${validationName} and returns it`,
    validation,
    func7,
    [, , , , , , getFuncArg(validationName)],
    getFuncArg(validationName),
  ]),
];

const errorCases = [
  [
    `Display correct error message when first param is invalid`,
    firstParam.mustBe.string,
    func1,
    'Function func1(string)\nError: 1st parameter must be of type string',
  ],
  [
    `Display correct error message when second param is invalid`,
    secondParam.mustBe.string,
    func2,
    'Function func2(any, string)\nError: 2nd parameter must be of type string',
  ],
  [
    `Display correct error message when third param is invalid`,
    thirdParam.mustBe.string,
    func3,
    'Function func3(any, any, string)\nError: 3rd parameter must be of type string',
  ],
  [
    `Display correct error message when 15th param is invalid`,
    nthParam(15).mustBe.string,
    func1,
    'Function func1(any, any, any, any, any, any, any, any, any, any, any, any, any, any, string)\nError: 15th parameter must be of type string',
  ],
];

const methodErrorCases = [
  [
    `Display constructor name if validate has its 'this' bound with Function.prototype.call`,
    firstParam.mustBe.string,
    dog.bark,
    dog,
    'Function Dog.bark(string)\nError: 1st parameter must be of type string',
  ],
  [
    `Display constructor name if validate has its 'this' bound with Function.prototype.call`,
    secondParam.mustBe.string,
    dog.bark,
    dog,
    'Function Dog.bark(any, string)\nError: 2nd parameter must be of type string',
  ],
  [
    `Display constructor name if validate has its 'this' bound with Function.prototype.call`,
    thirdParam.mustBe.string,
    dog.bark,
    dog,
    'Function Dog.bark(any, any, string)\nError: 3rd parameter must be of type string',
  ],
];

const multipleCases = [
  [
    `Display correct error message when first and third params are not string and number`,
    [firstParam.mustBe.string, thirdParam.mustBe.number],
    func1,
    [],
    'Function func1(string, any, number)\nError: 1st parameter must be of type string\nError: 3rd parameter must be of type number',
  ],
  [
    `Display correct error message when second, fourth and sixth params are not boolean, function, and object`,
    [
      secondParam.mustBe.string,
      nthParam(4).mustBe.boolean,
      nthParam(6).mustBe.function,
    ],
    func1,
    [],
    'Function func1(any, string, any, boolean, any, function)\nError: 2nd parameter must be of type string\nError: 4th parameter must be of type boolean\nError: 6th parameter must be of type function',
  ],
  [
    `Display correct error message when seventh and tenth are not undefined and object`,
    [nthParam(7).mustBe.undefined, nthParam(10).mustBe.object],
    func1,
    [, , , , , , 1],
    'Function func1(any, any, any, any, any, any, undefined, any, any, object)\nError: 7th parameter must be of type undefined\nError: 10th parameter must be of type object',
  ],
];

module.exports = { correctCases, errorCases, methodErrorCases, multipleCases };
