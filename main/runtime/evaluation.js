import { Lexer } from "../grammar/lexeme";
import { Parser } from "../grammar/syntax";

/**
 * 解释器
 * 
 */
export class Evaluator {
    /**
     * 
     * @param {*} formula 
     */
    evaluate(formula) {
        let lexer = new Lexer();
        let lexemes = lexer.lex(formula);
        let parser = new Parser();
        let tree = parser.parse(lexemes);
        console.log(tree.toJSON());
    }
}