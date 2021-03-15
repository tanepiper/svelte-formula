import { createValidationChecker } from './errors';

describe('Formula Field Validation', () => {
  let validationChecker;
  let element;
  let elGroup;

  beforeEach(() => {
    element = document.createElement('input');
    element.type = 'text';
    element.setAttribute('data-value-missing', 'You must provide a value');
    element.setAttribute('name', 'testing');
    element.setAttribute('required', 'required');
    element.setAttribute('pattern', '.{5,}');

    elGroup = [element];

    document.body.appendChild(element);

    validationChecker = createValidationChecker('testing', elGroup, {
      messages: {
        testing: {
          patternMismatch: 'You have not matched the pattern',
        },
      },
      validators: {
        testing: {
          startsWithCapital: (value: string) => {
            const firstLetterCode = value.charCodeAt(0);
            return firstLetterCode >= 65 && firstLetterCode <= 90
              ? null
              : 'The first character must be a capital letter';
          },
        },
      },
    });
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should return an error if there is no value', () => {
    element.value = '';
    const result = validationChecker(element, '');
    expect(result.valid).toBeFalsy();
  });

  it('should return a message defined as on element data', () => {
    element.value = '';
    const result = validationChecker(element, '');
    expect(result.message).toBe('You must provide a value');
  });

  it('should return invalid if it does not match the pattern', () => {
    element.value = 'test';
    const result = validationChecker(element, 'test');
    expect(result.valid).toBeFalsy();
  });

  it('should return a custom message', () => {
    element.value = 'test';
    const result = validationChecker(element, 'test');
    expect(result.message).toBe('You have not matched the pattern');
  });

  it('should return custom validation', () => {
    element.value = 'testing';
    const result = validationChecker(element, 'testing');
    expect(result.message).toBe('The first character must be a capital letter');
  });

  it('should return valid if all conditions pass', () => {
    element.value = 'Testing';
    const result = validationChecker(element, 'Testing');
    expect(result.valid).toBeTruthy();
  });
});
