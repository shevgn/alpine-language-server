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
    const context = extractXDataProps(tag.xData);

    if (tag.parentDataProvider) {
        const parentContext = fullTagXData(tag.parentDataProvider);
        return [...context, ...parentContext];
    }

    return context;
}

export { extractXDataProps, fullTagXData };
