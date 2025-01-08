/**
 * 根据不同文件的后缀名，返回不同的language
 * @param fileName 
 * @returns 
 */
export const fileName2Language = (fileName: string) => {
    const suffix = fileName.split('.').pop() || ''
    if (['js', 'jsx'].includes(suffix)) {
        return 'javascript'
    }
    if (['ts', 'tsx'].includes(suffix)) {
        return 'typescript'
    }
    if (['json'].includes(suffix)) {
        return 'json'
    }
    if (['css'].includes(suffix)) {
        return 'css'
    }
    return 'javascript'
}