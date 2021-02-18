(window.webpackJsonp = window.webpackJsonp || []).push([
  [9],
  {
    79: function (e, t, a) {
      'use strict';
      a.r(t),
        a.d(t, 'frontMatter', function () {
          return i;
        }),
        a.d(t, 'metadata', function () {
          return l;
        }),
        a.d(t, 'toc', function () {
          return s;
        }),
        a.d(t, 'default', function () {
          return p;
        });
      var n = a(3),
        r = a(7),
        o = (a(0), a(89)),
        i = { id: 'formula', title: 'The Formula API', sidebar_label: 'Formula API' },
        l = {
          unversionedId: 'formula',
          id: 'formula',
          isDocsHomePage: !1,
          title: 'The Formula API',
          description: 'The Svelte Formula Logo',
          source: '@site/docs/formula.md',
          slug: '/formula',
          permalink: '/docs/formula',
          version: 'current',
          sidebar_label: 'Formula API',
          sidebar: 'someSidebar',
          next: { title: 'Formula Options', permalink: '/docs/options' },
        },
        s = [
          { value: 'What is Formula?', id: 'what-is-formula', children: [] },
          { value: 'Creating your first reactive form', id: 'creating-your-first-reactive-form', children: [] },
        ],
        m = { toc: s };
      function p(e) {
        var t = e.components,
          a = Object(r.a)(e, ['components']);
        return Object(o.b)(
          'wrapper',
          Object(n.a)({}, m, a, { components: t, mdxType: 'MDXLayout' }),
          Object(o.b)(
            'p',
            null,
            Object(o.b)('img', {
              parentName: 'p',
              src: 'https://raw.githubusercontent.com/tanepiper/svelte-plugins/main/packages/svelte/formula/logo.png',
              alt: 'The Svelte Formula Logo',
            }),
          ),
          Object(o.b)('h2', { id: 'what-is-formula' }, 'What is Formula?'),
          Object(o.b)(
            'p',
            null,
            Object(o.b)(
              'a',
              { parentName: 'p', href: 'https://www.npmjs.com/package/svelte-formula' },
              Object(o.b)('img', {
                parentName: 'a',
                src: 'https://img.shields.io/npm/v/svelte-formula?label=svelte-formula',
                alt: 'svelte-formula',
              }),
            ),
          ),
          Object(o.b)(
            'p',
            null,
            Object(o.b)('strong', { parentName: 'p' }, 'This documentation is currently in development'),
          ),
          Object(o.b)(
            'p',
            null,
            'Formula is a library for use with ',
            Object(o.b)('a', { parentName: 'p', href: 'https://svelte.dev' }, 'Svelte'),
            ' that allows for ',
            Object(o.b)('strong', { parentName: 'p' }, 'Zero Configuration'),
            ' reactive forms.',
          ),
          Object(o.b)(
            'p',
            null,
            "The library's design philosophy is to work with HTML5 forms, allowing most of the configuration to happen in your HTML.",
          ),
          Object(o.b)(
            'p',
            null,
            'Formula uses validation attributes on form elements such as ',
            Object(o.b)('inlineCode', { parentName: 'p' }, '<input required>'),
            ' or ',
            Object(o.b)('inlineCode', { parentName: 'p' }, '<input minlength="8">'),
            ', and provides\nfeedback to your application through a set of ',
            Object(o.b)('a', { parentName: 'p', href: 'https://svelte.dev' }, 'Svelte Stores'),
            '.',
          ),
          Object(o.b)(
            'p',
            null,
            'To make a field available in your Svelte app, it only requires a ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'name'),
            ' property.',
          ),
          Object(o.b)(
            'p',
            null,
            "While you don't need a configuration to get started, the library allows for powerful custom validations at field level,\nand across the form",
          ),
          Object(o.b)('h2', { id: 'creating-your-first-reactive-form' }, 'Creating your first reactive form'),
          Object(o.b)(
            'p',
            null,
            'To create a reactive form, you need to bind the ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'form'),
            ' action to any element using the ',
            Object(o.b)('a', { parentName: 'p', href: 'http://svelte.dev' }, 'use'),
            '\ndirective in Svelte, you can then access several form states via the exported stores:',
          ),
          Object(o.b)(
            'pre',
            null,
            Object(o.b)(
              'code',
              { parentName: 'pre', className: 'language-svelte' },
              "<script>\n  import { formula } from 'svelte-formula';\n  const { form, formValues, touched, validity, isFormValid } = formula();\n\n  $: console.log($formValues);\n</script>\n\n<form use:form>\n  <label for='username'>Username</label>\n  <input type='email' required id='username' name='username'\n         class:error={$touched?.username && $validity?.username?.invalid} />\n  <span hidden={$validity?.username?.valid}>{$validity?.username?.message}</span>\n  <label for='password'>Password</label>\n  <input type='password' required minlength='8' id='password' name='password'\n         class:error={$touched?.username && $validity?.username?.invalid} />\n  <span hidden={$validity?.password?.valid}>{$validity?.password?.message}</span>\n  <button disabled='{!$isFormValid}'>Login</button>\n</form>\n",
            ),
          ),
          Object(o.b)(
            'p',
            null,
            'In this example there are two fields: ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'username'),
            ' and ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'password'),
            ' - taking the ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'name'),
            ' property from the input,\nthe value is now available in ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'formValues'),
            ', the ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'touched'),
            ' status (when the form field is focused) and both\nfield level ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'validity'),
            ' and overall form validity with ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'isFormValid'),
            '.',
          ),
          Object(o.b)(
            'p',
            null,
            'There are additional stores: ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'submitValues'),
            ', ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'dirty'),
            ' and ',
            Object(o.b)('inlineCode', { parentName: 'p' }, 'formValidity'),
            '.',
          ),
        );
      }
      p.isMDXComponent = !0;
    },
  },
]);
