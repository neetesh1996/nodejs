module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    "semi": ["error", "always"],
        "quotes": ["error", "double"],
         "eslint-disable no-unused-vars" :0,
"eslint-disable no-trailing-spaces" :0,
"eslint-disable space-before-blocks":0, 
"eslint-disable no-use-before-define":0,
 "eslint-disable lines-between-class-members ":0,
 "eslint-disable space-before-function-paren":0,
 "eslint-disable indent":0,
 "eslint-disable no-undef":0,
  }
}
