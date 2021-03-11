---
id: attributes

title: Formula Attributes

sidebar_label: Formula Attributes
---

Formula has several `data-formula-*` attributes that can be read and applied to forms

## Writable

### `data-formula-name`

This attribute is used when you want to provide a custom name for your data group - this is required when using Radio
groups with [beaker](groups/groups.md) as each group requires a unique `<input name="...">` value. It is optional for
any other field - if used all stores will use this key.

```html
<input type='text' name='dataValue' data-formula-name='message' maxlength='250' />
<span>{$enrichment?.message?.length} / 250</span>
```

### `data-formula-bind`

This attribute is used when you want to bind different, or custom events to an input - for example when writing a custom
component, or when you want to bind other events to a component. When using this attribute the default binding won't
happen, so it must also be passed if you want to use this.

Multiple events can be bound by using the pipe (`|`) separator.

See [example](examples/custom-event.md)

```html
<!-- Use other browser event types to bind to -->
<input type='text' name='myValue' data-formula-bind='mouseover' />
<!-- Bind to more than one event type, such as including the original event  -->
<input type='text' name='myValue' data-formula-bind='mouseover|keyup' />
<!-- You can also emit your own custom events via elements inside custom components -->
<input type='number' name='myValue' data-formula-bind='customEvent' bind:this='{el}' />
<button on:click|preventDefault='{()' => el.dispatchEvent(new Event('customEvent'))}>Click Me</button>
```

## Readable

### `data-formula-touched`

Set if the form field or group has been touched

### `data-formula-dirty`

Set if the form field or group is a dirty value

### `data-formula-invalid`

Set if the form field or group is invalid

## Custom Messages

While custom messages for errors can be passed via the `formula` options they can also be set on any element using a
Kebab-case version of the error name.

For example if you want to override the default `typeMismatch` error use `data-type-mismatch` and provide the message.
These will always override any custom option messages.

You can override any [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) messages, or custom
validation messages
