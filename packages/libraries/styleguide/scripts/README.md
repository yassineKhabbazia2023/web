# scripts

## compressImages

## feature

This script copies SVG files in `/src/assets/images-origin`,
then compresses them with the SVGO library,
and finally writes them to the `/src/assets/images` folder.

It also generates a file in `/src/atoms/PImage/imagesList.ts`
that contains the list of all svg images

(!) Do not write anything in `/src/assets/images`, this folder is entirely re-written each time the script is run.

## how to run it

```
npm run generate:image
```
