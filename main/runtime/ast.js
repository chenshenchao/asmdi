export const AST_IDENTIFIER = 1;
export const AST_NUMBER = 2;
export const AST_ADDITION = 10;
export const AST_SUBTRACTION = 11;
export const AST_MULTIPLICATION = 12;
export const AST_DIVISION = 13;
export const AST_MINUS = 14;
export const AST_PRIOR = 15;

export const AST_LV1 = [
    AST_ADDITION,
    AST_SUBTRACTION,
];

export const AST_LV2 = [
    AST_MULTIPLICATION,
    AST_DIVISION,
]

export class ASTNode {
    type; // 节点类型

    constructor(type) {
        this.type = type;
    }

    toObject() {
        let r = {};
        for (let k of Object.keys(this)) {
            let v = this[k];
            if (v instanceof ASTNode) {
                r[k] = v.toObject();
            } else {
                r[k] = v;
            }
        }
        return r;
    }

    toJSON() {
        let v = this.toObject();
        return JSON.stringify(v, null, 2);
    }
}