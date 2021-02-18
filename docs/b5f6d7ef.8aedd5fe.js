(window.webpackJsonp = window.webpackJsonp || []).push([
  [10],
  {
    79: function (e, r, t) {
      'use strict';
      t.r(r),
        t.d(r, 'frontMatter', function () {
          return i;
        }),
        t.d(r, 'metadata', function () {
          return s;
        }),
        t.d(r, 'toc', function () {
          return c;
        }),
        t.d(r, 'default', function () {
          return l;
        });
      var n = t(3),
        o = t(7),
        a = (t(0), t(90)),
        i = { id: 'stores-enrichment', title: 'enrichment', sidebar_label: 'enrichment' },
        s = {
          unversionedId: 'stores/stores-enrichment',
          id: 'stores/stores-enrichment',
          isDocsHomePage: !1,
          title: 'enrichment',
          description: 'Description',
          source: '@site/docs/stores/enrichment.mdx',
          slug: '/stores/stores-enrichment',
          permalink: '/docs/stores/stores-enrichment',
          version: 'current',
          sidebar_label: 'enrichment',
          sidebar: 'someSidebar',
          previous: { title: 'dirty', permalink: '/docs/stores/stores-dirty' },
          next: { title: 'formValidity', permalink: '/docs/stores/stores-form-validity' },
        },
        c = [
          { value: 'Description', id: 'description', children: [] },
          { value: 'Example', id: 'example', children: [] },
        ],
        p = { toc: c };
      function l(e) {
        var r = e.components,
          t = Object(o.a)(e, ['components']);
        return Object(a.b)(
          'wrapper',
          Object(n.a)({}, p, t, { components: r, mdxType: 'MDXLayout' }),
          Object(a.b)('h2', { id: 'description' }, 'Description'),
          Object(a.b)(
            'p',
            null,
            'This store provides the results of any method passed to the ',
            Object(a.b)('inlineCode', { parentName: 'p' }, 'enrich'),
            ' object for a group ',
            Object(a.b)('inlineCode', { parentName: 'p' }, 'name'),
            '. Each group contains a key and value based on the available methods.',
          ),
          Object(a.b)('p', null, 'It emits on every value change, where the value group has available methods'),
          Object(a.b)('h2', { id: 'example' }, 'Example'),
          Object(a.b)(
            'pre',
            null,
            Object(a.b)(
              'code',
              { parentName: 'pre', className: 'language-svelte' },
              "<script>\n  import { formula } from 'svelte-formula';\n  import {passwordScore} from '../libs/password'\n\n  const { form, enrichment } = formula({\n    enrich: {\n      password: {\n        passwordStrength: (value) => passwordScore(value)\n      }\n    }\n  })\n</script>\n\n<label for='password'>Password</label>\n<input type='password' id='password' name='password' />\n<meter value={$enrichment?.password?.passwordStrength || 0} min='0' max='100' low='33' high='66' optimum='80' />\n",
            ),
          ),
        );
      }
      l.isMDXComponent = !0;
    },
    90: function (e, r, t) {
      'use strict';
      t.d(r, 'a', function () {
        return u;
      }),
        t.d(r, 'b', function () {
          return f;
        });
      var n = t(0),
        o = t.n(n);
      function a(e, r, t) {
        return (
          r in e
            ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 })
            : (e[r] = t),
          e
        );
      }
      function i(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          r &&
            (n = n.filter(function (r) {
              return Object.getOwnPropertyDescriptor(e, r).enumerable;
            })),
            t.push.apply(t, n);
        }
        return t;
      }
      function s(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2
            ? i(Object(t), !0).forEach(function (r) {
                a(e, r, t[r]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
            : i(Object(t)).forEach(function (r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
              });
        }
        return e;
      }
      function c(e, r) {
        if (null == e) return {};
        var t,
          n,
          o = (function (e, r) {
            if (null == e) return {};
            var t,
              n,
              o = {},
              a = Object.keys(e);
            for (n = 0; n < a.length; n++) (t = a[n]), r.indexOf(t) >= 0 || (o[t] = e[t]);
            return o;
          })(e, r);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          for (n = 0; n < a.length; n++)
            (t = a[n]), r.indexOf(t) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, t) && (o[t] = e[t]));
        }
        return o;
      }
      var p = o.a.createContext({}),
        l = function (e) {
          var r = o.a.useContext(p),
            t = r;
          return e && (t = 'function' == typeof e ? e(r) : s(s({}, r), e)), t;
        },
        u = function (e) {
          var r = l(e.components);
          return o.a.createElement(p.Provider, { value: r }, e.children);
        },
        m = {
          inlineCode: 'code',
          wrapper: function (e) {
            var r = e.children;
            return o.a.createElement(o.a.Fragment, {}, r);
          },
        },
        d = o.a.forwardRef(function (e, r) {
          var t = e.components,
            n = e.mdxType,
            a = e.originalType,
            i = e.parentName,
            p = c(e, ['components', 'mdxType', 'originalType', 'parentName']),
            u = l(t),
            d = n,
            f = u[''.concat(i, '.').concat(d)] || u[d] || m[d] || a;
          return t
            ? o.a.createElement(f, s(s({ ref: r }, p), {}, { components: t }))
            : o.a.createElement(f, s({ ref: r }, p));
        });
      function f(e, r) {
        var t = arguments,
          n = r && r.mdxType;
        if ('string' == typeof e || n) {
          var a = t.length,
            i = new Array(a);
          i[0] = d;
          var s = {};
          for (var c in r) hasOwnProperty.call(r, c) && (s[c] = r[c]);
          (s.originalType = e), (s.mdxType = 'string' == typeof e ? e : n), (i[1] = s);
          for (var p = 2; p < a; p++) i[p] = t[p];
          return o.a.createElement.apply(null, i);
        }
        return o.a.createElement.apply(null, t);
      }
      d.displayName = 'MDXCreateElement';
    },
  },
]);
