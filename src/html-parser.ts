import { HTMLElement, parse } from "node-html-parser";
import { XDataTag } from "./types.js";

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
        };
    });
}

export { tagsWithXData };
