import { Files } from "../store/PlaygroundContext"
import { fileName2Language } from "./fileName2Language"

// import模块时加?raw，代表直接以文本方式引入模块内容
import main from '../template/main.tsx?raw'
import App from '../template/App.tsx?raw'
import AppCss from '../template/App.css?raw'
import importMap from '../template/import-map.json?raw'

// app 文件名
export const APP_COMPONENT_FILE_NAME = 'App.tsx'
// esm 模块映射文件名
export const IMPORT_MAP_FILE_NAME = 'import-map.json'
// app 入口文件名
export const ENTRY_FILE_NAME = 'main.tsx'

/**
 * 初始化文件区
 */
export const initFiles: Files = {
    [ENTRY_FILE_NAME]: {
      name: ENTRY_FILE_NAME,
      language: fileName2Language(ENTRY_FILE_NAME),
      value: main,
    },
    [APP_COMPONENT_FILE_NAME]: {
      name: APP_COMPONENT_FILE_NAME,
      language: fileName2Language(APP_COMPONENT_FILE_NAME),
      value: App,
    },
    'App.css': {
      name: 'App.css',
      language: 'css',
      value: AppCss,
    },
    [IMPORT_MAP_FILE_NAME]: {
      name: IMPORT_MAP_FILE_NAME,
      language: fileName2Language(IMPORT_MAP_FILE_NAME),
      value: importMap,
    },
  }