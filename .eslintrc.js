module.exports = {
  extends: [
    'airbnb-base',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended'
  ],
  env: {
    node: true,
    jest: true,
    browser: true
  },
  plugins: ['jest', 'prettier', 'promise'],
  rules: {
    'no-unused-vars': ['error', { varsIgnorePattern: '_' }],
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        arrowParens: 'always'
      }
    ]
  }
}
