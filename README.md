# show-ipa

A browser extension that allows you to highlight English text and get the IPA to assist in pronunciation.

## Install

1. Get the data from https://github.com/open-dict-data/ipa-dict
2. Unzip the data into `./data`
3. Load the extension into firefox

## Develop
1. Git clone
2. Install the dependencies (typescript, webpack) with `npm ci`
3. Build with `npm run build` for release or `npm run dev` for eval-source-map debugging

### Release
1. Bump version in `manifest.json`
2. `npm run clean`
3. `npm run build`
4. `npm run release`

## Privacy

- No tracking, does not send anything to anywhere
- No permissions required
- Free and open source.
