import { Allotment } from "allotment"
import 'allotment/dist/style.css'

import PlaygroundHeader from "../components/PlaygroundHeader";
import EditorWrapper from "../components/EditorWrapper";
import CodePreview from "../components/CodePreview";

function ReactPlayground() {
    return <div className="min-h-screen h-screen">
        <PlaygroundHeader />
        {/* 100 100，即1:1的比例展示 */}
        <Allotment defaultSizes={[100, 100]}>
            <Allotment.Pane minSize={500}>
                <EditorWrapper />
            </Allotment.Pane>
            <Allotment.Pane minSize={0}>
                <CodePreview />
            </Allotment.Pane>
        </Allotment>
    </div>;
}

export default ReactPlayground;