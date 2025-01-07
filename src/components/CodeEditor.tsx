import Editor from "./Editor";

{/* 正在编辑的文件列表 */}
function EditFileList() {
    return <div>
        filelist
    </div>
}

function CodeEditor() {
    return <div className="flex flex-col h-full">
        <EditFileList />
        <Editor />
    </div>;
}

export default CodeEditor;