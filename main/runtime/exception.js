export class ASMDIException extends Error {
    constructor(message) {
        super(message);
    }
}

/**
 * 词法分析异常。
 * 
 */
export class ASMDILexException extends Error {
    constructor(message, content, index) {
        let start = Math.max(index - 10, 0);
        let end = Math.min(content.length, index + 10);
        let here = index - start;
        let head = content.substring(start, here);
        let c = content[here];
        let tail = content.substring(here + 1, end);
        super(`${message}: ${head} [${c}] ${tail}`);
    }
}

export class ASMDISyntaxException extends ASMDIException {}