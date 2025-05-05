import { HTMLElement, parse } from "node-html-parser";
import { XDataTag } from "./types.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { CompletionParams } from "vscode-languageserver";

function parentXData(element: HTMLElement): string {
    let parent = element.parentNode as HTMLElement | null;

    if (!parent) {
        return "";
    }
    if (parent.tagName === "HTML") {
        return "";
    }
    if (parent.hasAttribute("x-data")) {
        return parent.getAttribute("x-data")!;
    }
    return "";
}

function tagsWithXData(html: string): XDataTag[] {
    const root = parse(html);
    const elements = root.querySelectorAll("[x-data]");

    return elements.map((element) => {
        const range = {
            start: element.range[0],
            end: element.range[1],
        };
        return {
            tag: element.tagName,
            xData: element.getAttribute("x-data")!,
            range,
            parentData: parentXData(element),
        };
    });
}

function existingAttributes(html: string, offset: number): string[] {
    const root = parse(html);
    const el = root
        .querySelectorAll("*")
        .findLast((e) => e.range[0] <= offset && offset <= e.range[1]);
    if (!el) return [];

    return Object.keys(el.attributes).map((name) => name.toLowerCase());
}

function getFragments(
    document: TextDocument,
    params: CompletionParams,
    maxLines: number
): { fragmentBefore: string; fragmentAfter: string } {
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

export {
    tagsWithXData,
    getFragments,
    isInHtmlTag,
    parentXData,
    existingAttributes,
};
