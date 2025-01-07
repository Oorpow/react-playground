import Editor, { EditorFile } from "./Editor";

{/* 正在编辑的文件列表 */}
function EditFileList() {
    return <div>
        filelist
    </div>
}

function EditorWrapper() {
    const file: EditorFile = {
        name: 'index.tsx',
        value: 'import lodash from "lodash";\n\nconst a = <div>guang</div>',
        language: 'typescript'
    }

    function onEditorValueChange() {
        // eslint-disable-next-line prefer-rest-params
        console.log(...arguments)
    }

    return <div className="flex flex-col h-full">
        <EditFileList />
        <Editor file={file} onChange={onEditorValueChange} />
    </div>;
}

export default EditorWrapper;