import { createFormValidator, createValidationChecker } from 'packages/svelte/formula/src/lib/errors';
import { writable } from 'svelte/store';

describe('Formula Field Validation', () => {
  let validationChecker;
  let element;

  beforeEach(() => {
    element = document.createElement('input');
    element.type = 'text';
    element.setAttribute('data-value-missing', 'You must provide a value');
    element.setAttribute('name', 'testing');
    element.setAttribute('required', 'required');
    element.setAttribute('pattern', '.{5,}');

    document.body.appendChild(element);

    validationChecker = createValidationChecker('testing', {
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

describe('Formula Form Validation', () => {
  let validationChecker;

  const storeMock: any = {
    formValues: writable({}),
    formValidity: writable({}),
    isFormValid: writable(true),
  };

  beforeEach(() => {
    storeMock.isFormValid.set(true);
    validationChecker = createFormValidator(storeMock, {
      fieldsMatch: (values: Record<string, string>) =>
        values.test1 === values.test2 ? null : 'Your fields must match',
    });
  });

  afterEach(() => {
    validationChecker();
  });

  it('should create an unsub', () => {
    expect(validationChecker).toBeInstanceOf(Function);
  });

  it('should set the form validity when not matched', () => {
    storeMock.formValues.update(() => ({ test1: 'Testing', test2: 'Test' }));
    storeMock.formValidity.subscribe((errors) => {
      expect(errors.fieldsMatch).toBe('Your fields must match');
    })();
  });

  it('should set the form to not when not matched', () => {
    storeMock.formValues.update(() => ({ test1: 'Testing', test2: 'Test' }));
    storeMock.isFormValid.subscribe((errors) => {
      expect(errors).toBeFalsy();
    })();
  });

  it('should not set the form validity when matched', () => {
    storeMock.formValues.update(() => ({ test1: 'Testing', test2: 'Testing' }));
    storeMock.formValidity.subscribe((errors) => {
      expect(errors.fieldsMatch).toBeUndefined();
    })();
  });

  it('should not change the valid state when valid', () => {
    storeMock.formValues.update(() => ({ test1: 'Testing', test2: 'Testing' }));
    storeMock.isFormValid.subscribe((valid) => {
      expect(valid).toBeTruthy();
    })();
  });
});
