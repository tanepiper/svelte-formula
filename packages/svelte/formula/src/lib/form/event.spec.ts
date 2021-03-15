import { writable } from 'svelte/store';
import { createHandler } from './event';

describe('Formula Event Handlers', () => {
  const storeMock: any = {
    formValues: writable({}),
    validity: writable({}),
    isFormValid: writable(true),
  };

  afterEach(() => {
    storeMock.formValues.set({});
    storeMock.validity.set({});
    storeMock.validity.set(true);
  });

  describe('Select Field', () => {
    let el;
    let opts;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('select');
      el.setAttribute('name', 'testing');

      const opt1 = document.createElement('option');
      opt1.value = 'A';
      opt1.innerText = 'A';
      const opt2 = document.createElement('option');
      opt2.value = 'B';
      opt2.innerText = 'B';

      opts = [opt1, opt2];

      el.appendChild(opt1);
      el.appendChild(opt2);

      document.body.appendChild(el);

      destroyHandler = createHandler('testing', 'change', el, [el], storeMock, {}, new Map());
    });

    afterEach(() => {
      document.body.removeChild(el);
      destroyHandler();
    });

    it('should create a handler for a select field', () => {
      expect(destroyHandler).toBeInstanceOf(Function);
    });

    it('should update the value when there is a change event', (done) => {
      opts[1].selected = true;
      el.dispatchEvent(new Event('change'));
      setTimeout(() => {
        storeMock.formValues.subscribe((value) => {
          expect(value).toStrictEqual({ testing: 'B' });
          done();
        })();
      }, 0);
    });

    it('should update the value when its a multiple change event', (done) => {
      el.setAttribute('multiple', 'multiple');
      opts[0].selected = true;
      opts[1].selected = true;
      el.dispatchEvent(new Event('change'));
      setTimeout(() => {
        storeMock.formValues.subscribe((value) => {
          expect(value).toStrictEqual({ testing: ['A', 'B'] });
          done();
        })();
      }, 0);
    });
  });

  describe('Checkbox', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('input');
      el.id = 'test1';
      el.type = 'checkbox';
      el.value = 'test1';
      el.checked = false;
      el.setAttribute('name', 'testing');
      document.body.appendChild(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
      destroyHandler();
    });

    it('should create a handler for a single checkbox', (done) => {
      destroyHandler = createHandler('testing', 'change', el, [el], storeMock, {}, new Map());

      el.click();
      el.dispatchEvent(new Event('change'));
      setTimeout(() => {
        storeMock.formValues.subscribe((value) => {
          expect(value).toStrictEqual({ testing: true });
          done();
        })();
      }, 0);
    });

    it('should create a handler for a multiple checkbox', (done) => {
      const el2 = document.createElement('input');
      el2.id = 'test2';
      el2.type = 'checkbox';
      el2.value = 'test2';
      el2.checked = false;
      el2.setAttribute('name', 'testing');
      document.body.appendChild(el2);

      destroyHandler = createHandler('testing', 'change', el, [el, el2], storeMock, {}, new Map());

      el.click();
      el.dispatchEvent(new Event('change'));
      setTimeout(() => {
        storeMock.formValues.subscribe((value) => {
          expect(value).toStrictEqual({ testing: ['test1'] });
          done();
        })();
      }, 0);
      document.body.removeChild(el2);
    });
  });

  describe('Radio Group', () => {
    let elements;
    let destroyHandlers;

    beforeEach(() => {
      const el1 = document.createElement('input');
      el1.type = 'radio';
      el1.value = 'A';
      el1.name = 'testing';
      el1.id = 'test1';

      const el2 = document.createElement('input');
      el2.type = 'radio';
      el2.value = 'B';
      el2.name = 'testing';
      el2.id = 'test2';

      elements = [el1, el2];

      const handler1 = createHandler('testing', 'change', el1, elements, storeMock, {}, new Map());
      const handler2 = createHandler('testing', 'change', el2, elements, storeMock, {}, new Map());
      destroyHandlers = [handler1, handler2];
      document.body.appendChild(el1);
      document.body.appendChild(el2);
    });

    afterEach(() => {
      elements.forEach((el) => document.body.removeChild(el));
      destroyHandlers.forEach((fn) => fn());
    });

    it('should set the value when selecting a radio', (done) => {
      elements[0].click();
      elements[0].dispatchEvent(new Event('change'));
      setTimeout(() => {
        storeMock.formValues.subscribe((value) => {
          expect(value).toStrictEqual({ testing: 'A' });
          done();
        })();
      }, 0);
    });

    it('should set the value when changing a radio', (done) => {
      elements[0].click();
      elements[0].dispatchEvent(new Event('change'));
      elements[1].click();
      elements[1].dispatchEvent(new Event('change'));
      setTimeout(() => {
        storeMock.formValues.subscribe((value) => {
          expect(value).toStrictEqual({ testing: 'B' });
          done();
        })();
      }, 0);
    });
  });

  describe('Text Fields', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('input');
      el.id = 'test1';
      el.type = 'text';
      el.setAttribute('name', 'testing');
      document.body.appendChild(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
      destroyHandler();
    });

    it('should create a handler for a single text boxes', (done) => {
      destroyHandler = createHandler('testing', 'keyup', el, [el], storeMock, {}, new Map());

      el.value = 'A';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'A' }));
      setTimeout(() => {
        storeMock.formValues.subscribe((value) => {
          expect(value).toStrictEqual({ testing: 'A' });
          done();
        })();
      }, 0);
    });

    it('should create a handler for a multiple text boxes', (done) => {
      const el2 = document.createElement('input');
      el2.id = 'test2';
      el2.type = 'text';
      el2.setAttribute('name', 'testing');
      document.body.appendChild(el2);

      destroyHandler = createHandler('testing', 'keyup', el, [el, el2], storeMock, {}, new Map());
      const secondHandler = createHandler('testing', 'keyup', el2, [el, el2], storeMock, {}, new Map());

      el.value = 'A';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'A' }));
      el2.value = 'B';
      el2.dispatchEvent(new KeyboardEvent('keyup', { key: 'B' }));
      setTimeout(() => {
        storeMock.formValues.subscribe((value) => {
          expect(value).toStrictEqual({ testing: ['A', 'B'] });
          done();
        })();
      }, 0);
      secondHandler();
      document.body.removeChild(el2);
    });
  });

  describe('Number Fields', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('input');
      el.id = 'test1';
      el.type = 'number';
      el.setAttribute('name', 'testing');
      document.body.appendChild(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
      destroyHandler();
    });

    it('should create a handler for a single number boxes', (done) => {
      destroyHandler = createHandler('testing', 'keyup', el, [el], storeMock, {}, new Map());

      el.value = '5';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: '5' }));
      setTimeout(() => {
        storeMock.formValues.subscribe((value) => {
          expect(value).toStrictEqual({ testing: 5 });
          done();
        })();
      }, 0);
    });

    it('should create a handler for a multiple number boxes', (done) => {
      const el2 = document.createElement('input');
      el2.id = 'test2';
      el2.type = 'number';
      el2.setAttribute('name', 'testing');
      document.body.appendChild(el2);

      destroyHandler = createHandler('testing', 'keyup', el, [el, el2], storeMock, {}, new Map());
      const secondHandler = createHandler('testing', 'keyup', el2, [el, el2], storeMock, {}, new Map());

      el.value = '1';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: '1' }));
      el2.value = '2';
      el2.dispatchEvent(new KeyboardEvent('keyup', { key: '2' }));
      setTimeout(() => {
        storeMock.formValues.subscribe((value) => {
          expect(value).toStrictEqual({ testing: [1, 2] });
          done();
        })();
      }, 0);
      secondHandler();
      document.body.removeChild(el2);
    });
  });
});
