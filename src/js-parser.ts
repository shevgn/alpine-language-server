import { parseExpression } from "@babel/parser";
import * as t from "@babel/types";
import { CompletionItemKind } from "vscode-languageserver";
import { XDataProps, XDataTag } from "./types.js";

function extractXDataProps(xDataString: string): XDataProps[] {
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

function fullTagXData(tag: XDataTag): XDataProps[] {
    const context: XDataProps[] = [];
    let current: XDataTag | null = tag;

    while (current) {
        context.push(...extractXDataProps(current.xData));
        current = current.parentDataProvider;
    }

    return context;
}

function extractJSSnippet(
    fragmentBefore: string,
    fragmentAfter: string
): string {
    const openQuoteIdx = fragmentBefore.lastIndexOf('"');
    if (openQuoteIdx === -1) {
        return "";
    }

    let jsSnippet = "";
    const closeQuoteIdx = fragmentAfter.indexOf('"');

    if (closeQuoteIdx === -1) {
        jsSnippet = fragmentAfter;
    } else {
        jsSnippet =
            fragmentBefore.slice(openQuoteIdx + 1) +
            fragmentAfter.slice(0, closeQuoteIdx);
    }

    return jsSnippet;
}

export { extractXDataProps, fullTagXData, extractJSSnippet };
