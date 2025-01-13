import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";

/**
 * URL内容压缩
 * @param data 
 * @returns 
 */
export function urlCompress(data: string): string {
    const buffer = strToU8(data)
    const zipped = zlibSync(buffer, { level: 9 })
    const binary = strFromU8(zipped, true)
    return btoa(binary)
}

/**
 * URL内容解压缩
 * @param base64 
 * @returns 
 */
export function urlUncompressed(base64: string): string {
    const binary = atob(base64)
    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
}