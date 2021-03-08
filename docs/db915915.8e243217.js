(window.webpackJsonp = window.webpackJsonp || []).push([
  [18],
  {
    88: function (e, n, t) {
      'use strict';
      t.r(n),
        t.d(n, 'frontMatter', function () {
          return i;
        }),
        t.d(n, 'metadata', function () {
          return s;
        }),
        t.d(n, 'toc', function () {
          return u;
        }),
        t.d(n, 'default', function () {
          return c;
        });
      var r = t(3),
        o = t(7),
        a = (t(0), t(95)),
        i = { id: 'customer-rows', title: 'Example - Customer Rows', sidebar_label: 'Row Data' },
        s = {
          unversionedId: 'examples/customer-rows',
          id: 'examples/customer-rows',
          isDocsHomePage: !1,
          title: 'Example - Customer Rows',
          description: '`svelte',
          source: '@site/docs/examples/customer-rows.md',
          slug: '/examples/customer-rows',
          permalink: '/docs/examples/customer-rows',
          version: 'current',
          sidebar_label: 'Row Data',
          sidebar: 'someSidebar',
          previous: { title: 'Example - Signup Form', permalink: '/docs/examples/signup' },
        },
        u = [],
        l = { toc: u };
      function c(e) {
        var n = e.components,
          t = Object(o.a)(e, ['components']);
        return Object(a.b)(
          'wrapper',
          Object(r.a)({}, l, t, { components: n, mdxType: 'MDXLayout' }),
          Object(a.b)(
            'pre',
            null,
            Object(a.b)(
              'code',
              { parentName: 'pre', className: 'language-svelte' },
              "<script>\n  import { createEventDispatcher } from 'svelte';\n  import { get } from 'svelte/store';\n  import { beaker, formula } from 'svelte-formula@0.8.1';\n\n  const dispatch = createEventDispatcher();\n\n  const { form, formValues, updateForm } = formula();\n\n  // This creates a contact group - you can now bind `contacts.group` to the subgroup\n  const customers = beaker();\n  const customersValues = customers.formValues;\n\n  export let productData = {\n    productName: '',\n  };\n\n  // Set the store with any existing data\n  export let contactData = [{\n    firstName: 'Foo',\n    lastName: 'McBar',\n    email: 'foo@svelte.code',\n    subscriptionLevel: 'partial',\n    signups: ['daily', 'news'],\n  }];\n\n  customers.init(contactData);\n\n  // Add a row to the store\n  function addCustomer() {\n    customers.add({\n      firstName: '',\n      lastName: '',\n      email: '',\n      subscriptionLevel: 'none',\n      signups: [],\n    });\n  }\n\n  // Remove a row from the store\n  function deleteCustomer(index) {\n    customers.delete(index);\n  }\n\n  function submit() {\n    const mainForm = get(formValues);\n    const contactValues = get(customersValues);\n    //Do something with the data here\n\n    dispatch('signup', {\n      form: mainForm,\n      contacts: contactValues\n    });\n  }\n</script>\n\n\n<form use:form on:submit|preventDefault={submit}>\n  <label for='productName'>ProductName</label>\n  <input type='text' id='productName' name='productName' required bind:value={productData.productName} />\n\n  <button type='submit'>Submit Form</button>\n  <button on:click|preventDefault={addCustomer}>Add Customer</button>\n    <button on:click|preventDefault={() => customers.init(contactData)}>Reset Fields</button>\n    <button on:click|preventDefault={() => customers.clear()}>Clear Fields</button>\n\n  <table role=\"grid\">\n    <thead>\n    <tr>\n      <th colspan=3>Customer Data</th>\n      <th>Subscription Level</th>\n      <th>Subscriptions</th>\n      <th></th>\n    </tr>\n    </thead>\n    <tbody use:customers.group role=\"rowgroup\">\n    {#each $customersValues as row, i}\n      <tr role=\"row\">\n        <td>\n          <label for='firstName-{i}'>First Name</label>\n          <input type='text' id='firstName-{i}' name='firstName' required bind:value={row.firstName} />\n        </td>\n        <td>\n          <label for='lastName-{i}'>Last Name</label>\n          <input type='text' id='lastName-{i}' name='lastName' bind:value={row.lastName} required />\n        </td>\n        <td>\n          <label for='email-{i}'>Email Name</label>\n          <input type='email' id='email-{i}' name='email' bind:value={row.email} required />\n        </td>\n        <td>\n          \x3c!-- In multi-group forms, radio groups require a unique name in the DOM - her you can provide 'data-beaker-key' to specify the data key --\x3e\n          <label for='subscriptionLevel-{i}-1'>None\n            <input type='radio' id='subscriptionLevel-{i}-1'\n                   name='subscriptionLevel-{i}'\n                   data-beaker-key='subscriptionLevel' value='none'\n                   bind:group={row.subscriptionLevel} />\n          </label>\n\n          <label for='subscriptionLevel-{i}-1'>Partial\n            <input type='radio' id='subscriptionLevel-{i}-2'\n                   name='subscriptionLevel-{i}'\n                   data-beaker-key='subscriptionLevel' value='partial'\n                   bind:group={row.subscriptionLevel} />\n          </label>\n\n          <label for='subscriptionLevel-{i}-1'>Full\n            <input type='radio' id='subscriptionLevel-{i}-3'\n                   name='subscriptionLevel-{i}'\n                   data-beaker-key='subscriptionLevel' value='full'\n                   bind:group={row.subscriptionLevel} />\n          </label>\n\n        </td>\n        <label for='signups-{i}-1'>Daily <input type='checkbox' id='signups-{i}-1' name='signups' value='daily'\n                                                bind:group={row.signups} /></label>\n\n        <label for='signups-{i}-2'>Weekly\n          <input type='checkbox' id='signups-{i}-2' name='signups' value='weekly'\n                 bind:group={row.signups} />\n        </label>\n        <label for='signups-{i}-3'>News\n          <input type='checkbox' id='signups-{i}-3' name='signups' value='news'\n                 bind:group={row.signups} />\n        </label>\n        <label for='signups-{i}-4'>Product\n          <input type='checkbox' id='signups-{i}-4' name='signups' value='product'\n                 bind:group={row.signups} />\n        </label>\n        <td>\n          <button on:click|preventDefault={() => deleteCustomer(i)}>X</button>\n        </td>\n      </tr>\n    {/each}\n    </tbody>\n  </table>\n</form>\n\n\n",
            ),
          ),
        );
      }
      c.isMDXComponent = !0;
    },
    95: function (e, n, t) {
      'use strict';
      t.d(n, 'a', function () {
        return p;
      }),
        t.d(n, 'b', function () {
          return b;
        });
      var r = t(0),
        o = t.n(r);
      function a(e, n, t) {
        return (
          n in e
            ? Object.defineProperty(e, n, { value: t, enumerable: !0, configurable: !0, writable: !0 })
            : (e[n] = t),
          e
        );
      }
      function i(e, n) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          n &&
            (r = r.filter(function (n) {
              return Object.getOwnPropertyDescriptor(e, n).enumerable;
            })),
            t.push.apply(t, r);
        }
        return t;
      }
      function s(e) {
        for (var n = 1; n < arguments.length; n++) {
          var t = null != arguments[n] ? arguments[n] : {};
          n % 2
            ? i(Object(t), !0).forEach(function (n) {
                a(e, n, t[n]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
            : i(Object(t)).forEach(function (n) {
                Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(t, n));
              });
        }
        return e;
      }
      function u(e, n) {
        if (null == e) return {};
        var t,
          r,
          o = (function (e, n) {
            if (null == e) return {};
            var t,
              r,
              o = {},
              a = Object.keys(e);
            for (r = 0; r < a.length; r++) (t = a[r]), n.indexOf(t) >= 0 || (o[t] = e[t]);
            return o;
          })(e, n);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          for (r = 0; r < a.length; r++)
            (t = a[r]), n.indexOf(t) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, t) && (o[t] = e[t]));
        }
        return o;
      }
      var l = o.a.createContext({}),
        c = function (e) {
          var n = o.a.useContext(l),
            t = n;
          return e && (t = 'function' == typeof e ? e(n) : s(s({}, n), e)), t;
        },
        p = function (e) {
          var n = c(e.components);
          return o.a.createElement(l.Provider, { value: n }, e.children);
        },
        m = {
          inlineCode: 'code',
          wrapper: function (e) {
            var n = e.children;
            return o.a.createElement(o.a.Fragment, {}, n);
          },
        },
        d = o.a.forwardRef(function (e, n) {
          var t = e.components,
            r = e.mdxType,
            a = e.originalType,
            i = e.parentName,
            l = u(e, ['components', 'mdxType', 'originalType', 'parentName']),
            p = c(t),
            d = r,
            b = p[''.concat(i, '.').concat(d)] || p[d] || m[d] || a;
          return t
            ? o.a.createElement(b, s(s({ ref: n }, l), {}, { components: t }))
            : o.a.createElement(b, s({ ref: n }, l));
        });
      function b(e, n) {
        var t = arguments,
          r = n && n.mdxType;
        if ('string' == typeof e || r) {
          var a = t.length,
            i = new Array(a);
          i[0] = d;
          var s = {};
          for (var u in n) hasOwnProperty.call(n, u) && (s[u] = n[u]);
          (s.originalType = e), (s.mdxType = 'string' == typeof e ? e : r), (i[1] = s);
          for (var l = 2; l < a; l++) i[l] = t[l];
          return o.a.createElement.apply(null, i);
        }
        return o.a.createElement.apply(null, t);
      }
      d.displayName = 'MDXCreateElement';
    },
  },
]);
