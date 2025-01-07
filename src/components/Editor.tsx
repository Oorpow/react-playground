import MonacoEditor, { OnMount } from '@monaco-editor/react';

{
	/* 编辑器 */
}
function Editor() {
	const code = `
    export default function App() {
        return <div>hahahah</div>
    }
    `;

	const editorOnMount: OnMount = (editor, monaco) => {
		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			jsx: monaco.languages.typescript.JsxEmit.Preserve, // 处理tsconfig对jsx的报错
			esModuleInterop: true,
		});
	};

	return (
		<MonacoEditor
			height="100%"
			path="test.tsx"
			language="typescript"
			value={code}
            onMount={editorOnMount}
		/>
	);
}

export default Editor;
