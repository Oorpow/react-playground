import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate';

/**
 * URL内容压缩
 * @param data
 * @returns ASC码
 */
export function urlCompress(data: string): string {
	// 字符串转字节数组
	const buffer = strToU8(data);
	// zlibSync压缩
	const zipped = zlibSync(buffer, { level: 9 });
	// strFromU8转字符串
	const binary = strFromU8(zipped, true);
	// btoa将base64编码后的字符串转ASC码
	return btoa(binary);
}

/**
 * URL内容解压缩
 * @param base64
 * @returns
 */
export function urlUncompressed(base64: string): string {
	const binary = atob(base64);
	const buffer = strToU8(binary, true);
	const unzipped = unzlibSync(buffer);
	return strFromU8(unzipped);
}
