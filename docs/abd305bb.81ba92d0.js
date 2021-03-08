(window.webpackJsonp = window.webpackJsonp || []).push([
  [12],
  {
    81: function (e, t, n) {
      'use strict';
      n.r(t),
        n.d(t, 'frontMatter', function () {
          return c;
        }),
        n.d(t, 'metadata', function () {
          return i;
        }),
        n.d(t, 'toc', function () {
          return s;
        }),
        n.d(t, 'default', function () {
          return d;
        });
      var a = n(3),
        r = n(7),
        o = (n(0), n(95)),
        c = { id: 'data', title: 'Data API', sidebar_label: 'Data API' },
        i = {
          unversionedId: 'groups/data',
          id: 'groups/data',
          isDocsHomePage: !1,
          title: 'Data API',
          description: 'Like Formula, beaker returns an instance of the Beaker stores which are have the same name as',
          source: '@site/docs/groups/data.md',
          slug: '/groups/data',
          permalink: '/docs/groups/data',
          version: 'current',
          sidebar_label: 'Data API',
          sidebar: 'someSidebar',
          previous: { title: 'Beaker API', permalink: '/docs/groups/beaker' },
          next: { title: 'Formula Stores', permalink: '/docs/stores/stores' },
        },
        s = [
          { value: '<code>init</code>', id: 'init', children: [] },
          { value: '<code>add</code>', id: 'add', children: [] },
          { value: '<code>set</code>', id: 'set', children: [] },
          { value: '<code>delete</code>', id: 'delete', children: [] },
          { value: '<code>clear</code>', id: 'clear', children: [] },
          { value: '<code>forms</code>', id: 'forms', children: [] },
        ],
        l = { toc: s };
      function d(e) {
        var t = e.components,
          n = Object(r.a)(e, ['components']);
        return Object(o.b)(
          'wrapper',
          Object(a.a)({}, l, n, { components: t, mdxType: 'MDXLayout' }),
          Object(o.b)(
            'p',
            null,
            'Like Formula, ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'beaker'),
            ' returns an instance of the Beaker stores which are have the same name as\nthe ',
            Object(o.b)('a', { parentName: 'p', href: '/docs/stores/stores' }, 'Formula store'),
            ', but container Array of form data as rows. The exceptions are\n',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'isFormReady'),
            ' and ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'isFormValid'),
            ' which are for the entire group and still a single value.',
          ),
          Object(o.b)(
            'p',
            null,
            'It also contains some additional properties and methods. The methods listed below allow for data to be added or removed\nfrom the groups ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'formValue'),
            ' store - this store can also be used with a ',
            Object(o.b)('inlineCode', { parentName: 'p' }, '{#each}'),
            ' block to render the rows in the\ntemplate.',
          ),
          Object(o.b)('h2', { id: 'init' }, Object(o.b)('inlineCode', { parentName: 'h2' }, 'init')),
          Object(o.b)(
            'p',
            null,
            'Pass initial data into the form group, or reset the form to initial data - this will the form store data with the\ncurrent items to render. Each key and value should match the fields in the group template (the exception\nis ',
            Object(o.b)('a', { parentName: 'p', href: '/docs/groups/beaker' }, 'radio fields'),
            ' which should be based on the ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'data-beaker-key'),
            ' attribute passed).',
          ),
          Object(o.b)(
            'pre',
            null,
            Object(o.b)(
              'code',
              { parentName: 'pre', className: 'language-svelte' },
              "\n<script>\n  import { beaker } from 'svelte-formula';\n\n  const contacts = beaker();\n\n  export let contactData = [];\n  contacts.init(contactData);\n\n  const items = contacts.formValues;\n</script>\n<div use:contacts.group>\n  {#each items as item, i}\n\n  {/each}\n</div>\n",
            ),
          ),
          Object(o.b)('h2', { id: 'add' }, Object(o.b)('inlineCode', { parentName: 'h2' }, 'add')),
          Object(o.b)(
            'p',
            null,
            'Add a row item to the store - this item should be a single object with the same key/value type for the form.',
          ),
          Object(o.b)(
            'pre',
            null,
            Object(o.b)(
              'code',
              { parentName: 'pre', className: 'language-svelte' },
              "\n<script>\n  import { beaker } from 'svelte-formula';\n\n  const contacts = beaker();\n\n  const items = contacts.formValues;\n\n  export let contactData = [];\n  contacts.init(contactData);\n</script>\n\n<button on:click|preventDefault={() => contacts.add({...item})}>Add Item</button>\n<div use:contacts.group>\n  {#each items as item, i}\n\n  {/each}\n</div>\n",
            ),
          ),
          Object(o.b)('h2', { id: 'set' }, Object(o.b)('inlineCode', { parentName: 'h2' }, 'set')),
          Object(o.b)('p', null, 'Update an existing row in the store at the passed index.'),
          Object(o.b)(
            'pre',
            null,
            Object(o.b)(
              'code',
              { parentName: 'pre', className: 'language-svelte' },
              "\n<script>\n  import { beaker } from 'svelte-formula';\n\n  const contacts = beaker();\n\n  const items = contacts.formValues;\n\n  export let contactData = [];\n  contacts.init(contactData);\n</script>\n\n<div use:contacts.group>\n  {#each items as item, i}\n    ...\n      <button on:click|preventDefault={() => contacts.set(i, {...newData})}>Save Item</button>\n\n    ...\n  {/each}\n</div>\n",
            ),
          ),
          Object(o.b)('h2', { id: 'delete' }, Object(o.b)('inlineCode', { parentName: 'h2' }, 'delete')),
          Object(o.b)('p', null, 'Deletes a row from the form - this method takes the index of the row to remove.'),
          Object(o.b)(
            'pre',
            null,
            Object(o.b)(
              'code',
              { parentName: 'pre', className: 'language-svelte' },
              "\n<script>\n  import { beaker } from 'svelte-formula';\n\n  const contacts = beaker();\n\n  const items = contacts.formValues;\n\n  export let contactData = [];\n  contacts.init(contactData);\n</script>\n\n<div use:contacts.group>\n  {#each items as item, i}\n    <button on:click|preventDefault={() => contacts.delete(i)}>Delete Item</button>\n  {/each}\n</div>\n",
            ),
          ),
          Object(o.b)('h2', { id: 'clear' }, Object(o.b)('inlineCode', { parentName: 'h2' }, 'clear')),
          Object(o.b)('p', null, 'Calling this will empty the group of all rows of data.'),
          Object(o.b)('h2', { id: 'forms' }, Object(o.b)('inlineCode', { parentName: 'h2' }, 'forms')),
          Object(o.b)(
            'p',
            null,
            'An ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'Map'),
            ' of all the underlying ',
            Object(o.b)('a', { parentName: 'p', href: '/docs/formula' }, 'Formula'),
            ' instances that allows for finer control, or access to the form\nstores',
          ),
        );
      }
      d.isMDXComponent = !0;
    },
    95: function (e, t, n) {
      'use strict';
      n.d(t, 'a', function () {
        return p;
      }),
        n.d(t, 'b', function () {
          return m;
        });
      var a = n(0),
        r = n.n(a);
      function o(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
            : (e[t] = n),
          e
        );
      }
      function c(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function i(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? c(Object(n), !0).forEach(function (t) {
                o(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : c(Object(n)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
              });
        }
        return e;
      }
      function s(e, t) {
        if (null == e) return {};
        var n,
          a,
          r = (function (e, t) {
            if (null == e) return {};
            var n,
              a,
              r = {},
              o = Object.keys(e);
            for (a = 0; a < o.length; a++) (n = o[a]), t.indexOf(n) >= 0 || (r[n] = e[n]);
            return r;
          })(e, t);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          for (a = 0; a < o.length; a++)
            (n = o[a]), t.indexOf(n) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
        }
        return r;
      }
      var l = r.a.createContext({}),
        d = function (e) {
          var t = r.a.useContext(l),
            n = t;
          return e && (n = 'function' == typeof e ? e(t) : i(i({}, t), e)), n;
        },
        p = function (e) {
          var t = d(e.components);
          return r.a.createElement(l.Provider, { value: t }, e.children);
        },
        u = {
          inlineCode: 'code',
          wrapper: function (e) {
            var t = e.children;
            return r.a.createElement(r.a.Fragment, {}, t);
          },
        },
        b = r.a.forwardRef(function (e, t) {
          var n = e.components,
            a = e.mdxType,
            o = e.originalType,
            c = e.parentName,
            l = s(e, ['components', 'mdxType', 'originalType', 'parentName']),
            p = d(n),
            b = a,
            m = p[''.concat(c, '.').concat(b)] || p[b] || u[b] || o;
          return n
            ? r.a.createElement(m, i(i({ ref: t }, l), {}, { components: n }))
            : r.a.createElement(m, i({ ref: t }, l));
        });
      function m(e, t) {
        var n = arguments,
          a = t && t.mdxType;
        if ('string' == typeof e || a) {
          var o = n.length,
            c = new Array(o);
          c[0] = b;
          var i = {};
          for (var s in t) hasOwnProperty.call(t, s) && (i[s] = t[s]);
          (i.originalType = e), (i.mdxType = 'string' == typeof e ? e : a), (c[1] = i);
          for (var l = 2; l < o; l++) c[l] = n[l];
          return r.a.createElement.apply(null, c);
        }
        return r.a.createElement.apply(null, n);
      }
      b.displayName = 'MDXCreateElement';
    },
  },
]);
