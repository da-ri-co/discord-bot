import globals from "globals";
import tseslint from "typescript-eslint";


export default [
    {files: ["**/*.{js,mjs,cjs,ts}"]},
    {languageOptions: { globals: globals.node }},
    ...tseslint.configs.recommended,
    {rules: {
        "indent": ["error", 4],
        "no-console": "off",
    }},
    {extends: ["eslint:recommended", "prettier"]},
    ,
];