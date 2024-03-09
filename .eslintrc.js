
module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: ['plugin:@typescript-eslint/recommended'],
	root: true,
	ignorePatterns: ['.eslintrc.js', 'src/utils/graphql-build.js'],
	rules: {
		"semi": ["warn", "never"],
		"quotes": ["warn", "single"],
		"indent": ["error", "tab"]
	}
}
