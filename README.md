## initialize a project

```bash
$ npm init
$ npm install --save-dev typescript tslint @types/node

$ vim tsconfig.json

{
  "compilerOptions": {
    "lib": ["es2015"],
    "module": "commonjs",
    "outDir": "dist",
    "sourceMap": true,
    "strict": true,
    "target": "es2015"
  },
  "include": ["src"]
}


$ ./node_modules/.bin/tslint --init

# generates tslint.json

$ mkdir src
$ vim src/index.ts

console.log('hello')

$ ./node_modules/.bin/tsc

# generates ./dist/index.js 

$ node ./dist/index.js

> hello
```
