# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] 2021-02-15

### Added

- Add support for `<input type="radio">` - allows multiple radios of the same name and returns a string of the currently
  selected value
- Add support for `<select>` fields for both single and multi-value select fields - if a single value returns a string,
  if set to `multiple` returns an array of strings
- Added support for `<input type="checkbox">` - if a single value returns a boolean value for the checked state, if
  there are multiple checkboxes of the same name it returns an array of the selected values
- Added `dirty` store that fires when a value is changed, and the selected field is blurred away from

### Changed

- Internal refactor of code to clean up and make it easier to add features

## [0.0.4] 2021-02-13

### Added

- Added support for `touched` elements

### Changed

- `values` becomes `formValues`
- `submit` becomes `submitValues`

## [0.0.1] 2021-02-12

### Added

- Initial release
