import { parseExpression } from "@babel/parser";
import * as t from "@babel/types";
import { CompletionItemKind, CompletionParams } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { XDataProps } from "./types.js";

async function extractXDataProps(xDataString: string): Promise<XDataProps[]> {
    const names: XDataProps[] = [];
    const ast = parseExpression(xDataString, {
        plugins: ["objectRestSpread", "classProperties"],
    });
    t.traverse(ast, {
        enter(path) {
            if (t.isObjectExpression(path)) {
                path.properties.forEach((prop) => {
                    if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
                        names.push({
                            name: prop.key.name,
                            kind: CompletionItemKind.Variable,
                        });
                    }
                    if (t.isObjectMethod(prop) && t.isIdentifier(prop.key)) {
                        names.push({
                            name: prop.key.name + "()",
                            kind: CompletionItemKind.Method,
                        });
                    }
                });
            }
        },
    });
    return names;
}

async function getFragments(
    document: TextDocument,
    params: CompletionParams,
    maxLines: number
): Promise<{ fragmentBefore: string; fragmentAfter: string }> {
    const startLine = Math.max(0, params.position.line - maxLines);
    const fragmentBefore = document.getText({
        start: { line: startLine, character: 0 },
        end: params.position,
    });
    const fragmentAfter = document.getText({
        start: params.position,
        end: { line: params.position.line + maxLines, character: 0 },
    });
    return { fragmentBefore, fragmentAfter };
}

function isInHtmlTag(fragmentBefore: string): boolean {
    const lastLt = fragmentBefore.lastIndexOf("<");
    const lastGt = fragmentBefore.lastIndexOf(">");
    const lastSlash = fragmentBefore.lastIndexOf("/");
    if (lastLt <= lastGt || lastLt <= lastSlash) {
        return false;
    }
    return true;
}

export { extractXDataProps, getFragments, isInHtmlTag };
