import {
    ASTNode,
    AST_IDENTIFIER,
    AST_NUMBER,
    AST_ADDITION,
    AST_SUBTRACTION,
    AST_MULTIPLICATION,
    AST_DIVISION,
    AST_MINUS,
    AST_PRIOR,
    AST_LV1,
    AST_LV2,
} from "../runtime/ast";

import {
    ASMDISyntaxException
} from "../runtime/exception";

import {
    LT_PLUS,
    LT_MINUS,
    LT_STAR,
    LT_SLASH,
    LT_NUMBER,
    LT_IDENTIFIER,
    LT_LEFT_PARENTHESIS,
    LT_RIGHT_PARENTHESIS,
} from './lexeme';

/**
 * 语法分析器。
 * 
 */
export class Parser {
    index; // 当前词素索引

    constructor() {
        this.index = 0;
    }

    /**
     * 解析成抽象语法数。
     * 
     * @param {*} lexemes 
     */
    parse(lexemes) {
        this.index = 0;
        this.lexemes = lexemes;
        return this.asOperationLv1();
    }

    /**
     * 一级运算符解析。
     * 
     */
    asOperationLv1() {
        let lv2 = this.asOperationLv2();
        let tail = this.asOperationLv1Tail();
        if (tail == null) return lv2;

        // 直接代入
        tail.left = lv2;
        let right = tail.right;
        if (AST_LV1.indexOf(right.type) < 0) return tail;

        // 左结合
        this.asLeftAssociative(tail, AST_LV1);
        return right;
    }

    /**
     * 一级运算符左公因子。
     * 
     */
    asOperationLv1Tail() {
        if (this.index >= this.lexemes.length) {
            return null;
        }
        let lexeme = this.lexemes[this.index++];
        let node = null;
        if (lexeme.type == LT_PLUS) {
            node = new ASTNode(AST_ADDITION);
        } else if (lexeme.type == LT_MINUS) {
            node = new ASTNode(AST_SUBTRACTION);
        }
        if (node != null) {
            node.right = this.asOperationLv1();
        }

        return node;
    }

    /**
     * 二级运算符。
     * 
     */
    asOperationLv2() {
        let lv3 = this.asOperationLv3();
        let tail = this.asOperationLv2Tail();
        if (tail == null) return lv3;

        tail.left = lv3;
        let right = tail.right;
        if (AST_LV2.indexOf(right.type) < 0) return tail;

        this.asLeftAssociative(tail, AST_LV2);
        return right;
    }

    /**
     * 二级运算符左公因子。
     * 
     */
    asOperationLv2Tail() {
        if (this.index >= this.lexemes.length) {
            return null;
        }
        let lexeme = this.lexemes[this.index++];
        let node = null;
        if (lexeme.type == LT_STAR) {
            node = new ASTNode(AST_MULTIPLICATION);
        } else if (lexeme.type == LT_SLASH) {
            node = new ASTNode(AST_DIVISION);
        }
        if (node != null) {
            node.right = this.asOperationLv2();
        }
        return node;
    }

    /**
     * 三级运算符。
     * 
     */
    asOperationLv3() {
        let lexeme = this.lexemes[this.index];

        // 正号
        if (lexeme.type == LT_PLUS) {
            ++this.index;
            return this.asOperand();
        }

        // 负号
        if (lexeme.type == LT_MINUS) {
            ++this.index;
            let node = new ASTNode(AST_MINUS);
            node.main = this.asOperand();
            return node;
        }

        // 括号
        if (lexeme.type == LT_LEFT_PARENTHESIS) {
            ++this.index;
            let lv1 = this.asOperationLv1();
            let pr = this.lexemes[this.index];
            if (pr.type != LT_RIGHT_PARENTHESIS) {
                throw new ASMDISyntaxException('非正常闭合括号');
            }
            ++this.index;
            let node = new ASTNode(AST_PRIOR);
            node.main = lv1;
            return node;
        }

        // 操作数
        return this.asOperand();
    }

    /**
     * 操作数。
     * 
     */
    asOperand() {
        let lexeme = this.lexemes[this.index];

        // 数字
        if (lexeme.type == LT_NUMBER) {
            ++this.index;
            let node = new ASTNode(AST_NUMBER);
            node.value = lexeme.data;
            return node;
        }

        // 标识符
        if (lexeme.type == LT_IDENTIFIER) {
            ++this.index;
            let node = new ASTNode(AST_IDENTIFIER);
            node.identifier = lexeme.data;
            return node;
        }
        throw new ASMDISyntaxException('非预期操作数类型');
    }

    /**
     * 左结合
     * 
     * @param {*} node 
     * @param {*} types 
     */
    asLeftAssociative(node, types) {
        let arrow = node.right;
        while (types.indexOf(arrow.type) >= 0) {
            let left = arrow.left;
            if (types.indexOf(left.type) < 0) break;
            arrow = left;
        }
        node.right = arrow.left;
        arrow.left = node;
    }
}