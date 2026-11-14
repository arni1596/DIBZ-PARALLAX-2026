import tseslint from 'typescript-eslint';
export default tseslint.config({ignores:['dist/**','node_modules/**','public/**']},...tseslint.configs.recommended,{files:['src/investigation/**/*.{ts,tsx}'],rules:{'@typescript-eslint/no-explicit-any':'error','no-eval':'error','no-debugger':'error','no-constant-binary-expression':'error'}});
