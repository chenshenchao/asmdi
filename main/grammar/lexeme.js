import {
    ASMDILexException
} from "../runtime/exception";

export const LT_IDENTIFIER = 1;
export const LT_NUMBER = 2;
export const LT_PLUS = 10;
export const LT_MINUS = 11;
export const LT_STAR = 12;
export const LT_SLASH = 13;
export const LT_LEFT_PARENTHESIS = 15;
export const LT_RIGHT_PARENTHESIS = 16;


/**
 * 词素
 * 
 */
export class Lexeme {
    type; // 词素类型
    data; // 词素数据

    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}

/**
 * 词法分析器
 * 
 */
export class Lexer {
    index; // 当前分析索引
    content; // 表达式内容

    /**
     * 初始化。
     * 
     */
    constructor() {
        this.index = 0;
        this.content = null;
    }

    /**
     * 词法分析。
     * 
     * @param {*} content 
     */
    lex(content) {
        let result = [];
        this.index = 0;
        this.content = content;
        while (this.index < this.content.length) {
            let c = this.content[this.index];
            if (/[0-9]/.test(c)) {
                result.push(this.asNumber());
            } else if (/[A-Za-z]/.test(c)) {
                result.push(this.asIdentifier());
            } else if (/[\(\)+-]|\/\*/.test(c)) {
                result.push(this.asOperation());
            } else if (/\s+/.test(c)) {
                ++this.index;
            } else {
                throw this.asError(`未知字符 ${c}`);
            }
        }
        return result;
    }

    /**
     * 判定为标识符。
     * 
     */
    asIdentifier() {
        let buffer = [this.content[this.index++]];
        while (this.index < this.content.length) {
            let c = this.content[this.index];
            if (/[0-9A-Za-z_]/.test(c)) {
                buffer.push(c);
            } else {
                break;
            }
            ++this.index;
        }
        return new Lexeme(
            LT_IDENTIFIER,
            buffer.join(''),
        );
    }

    /**
     * 判定为运算符。
     * 
     */
    asOperation() {
        let c = this.content[this.index];
        let type = 0;
        switch (c) {
            case '+':
                type = LT_PLUS;
                break;
            case '-':
                type = LT_MINUS;
                break;
            case '*':
                type = LT_STAR;
                break;
            case '/':
                type = LT_SLASH;
                break;
            case '(':
                type = LT_LEFT_PARENTHESIS;
                break;
            case ')':
                type = LT_RIGHT_PARENTHESIS;
                break;
            default:
                throw this.asError(`未知运算符 ${c}`);
        }
        ++this.index;
        return new Lexeme(type, c);
    }

    /**
     * 判定为数字。
     * 
     */
    asNumber() {
        let buffer = this.asInteger();
        if (this.content[this.index] == '.') {
            buffer.push('.');
            ++this.index;
        }
        this.asInteger().forEach(i => buffer.push(i));
        return new Lexeme(
            LT_NUMBER,
            Number(buffer.join('.'))
        )
    }

    /**
     * 判定为整数。
     * 
     */
    asInteger() {
        let buffer = [];
        while (this.index < this.content.length) {
            let c = this.content[this.index];
            if (/[0-9]/.test(c)) {
                buffer.push(c);
            } else {
                break;
            }
            ++this.index;
        }
        return buffer;
    }

    /**
     * 判定为词法错误。
     * 
     * @param {*} message 
     */
    asError(message) {
        return new ASMDILexException(
            message,
            this.content,
            this.index
        );
    }
}