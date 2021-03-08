import { getFormFields, getGroupFields } from 'packages/svelte/formula/src/lib/shared/fields';

describe('Formula Fields Methods', () => {
  let root;
  let groupEl;
  beforeAll(() => {
    root = document.createElement('form');
    const inputWithName1 = document.createElement('input');
    inputWithName1.setAttribute('type', 'text');
    inputWithName1.setAttribute('name', 'testing1');

    const inputWithName2 = document.createElement('input');
    inputWithName2.setAttribute('type', 'text');
    inputWithName2.setAttribute('name', 'testing2');

    const inputWithoutName = document.createElement('input');
    inputWithoutName.setAttribute('type', 'text');

    const subEl = document.createElement('div');
    const inputInSub = document.createElement('input');
    inputInSub.setAttribute('type', 'text');
    inputInSub.setAttribute('name', 'testing3');
    subEl.appendChild(inputInSub);

    groupEl = document.createElement('div');
    groupEl.id = 'group-test-1';
    const inputInGroup1 = document.createElement('input');
    inputInGroup1.setAttribute('type', 'text');
    inputInGroup1.setAttribute('name', 'testing4');
    inputInGroup1.setAttribute('data-in-group', 'group-test-1');
    groupEl.appendChild(inputInGroup1);

    const inputInGroup2 = document.createElement('input');
    inputInGroup2.setAttribute('type', 'text');
    inputInGroup2.setAttribute('name', 'testing5');
    inputInGroup2.setAttribute('data-in-group', 'group-test-1');
    groupEl.appendChild(inputInGroup2);

    root.appendChild(inputWithName1);
    root.appendChild(inputWithoutName);
    root.appendChild(subEl);
    root.appendChild(groupEl);
    root.appendChild(inputWithName2);

    document.body.appendChild(root);
  });

  afterAll(() => {
    document.body.removeChild(root);
  });

  describe('getFormFields', () => {
    it('should find elements only with name attribute and not in groups', () => {
      const elements = getFormFields(root);
      expect(elements.length).toBe(3);
    });
  });

  describe('getGroupFields', () => {
    it('should find elements any elements with name', () => {
      const elements = getGroupFields(groupEl);
      expect(elements.length).toBe(2);
    });
  });
});
