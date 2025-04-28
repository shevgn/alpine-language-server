import {
    CompletionItem,
    CompletionItemKind,
    InsertTextFormat,
} from "vscode-languageserver";
import { AlpineEvent, keyboardEvents, mouseEvents } from "./events.js";

const shorthands = (): CompletionItem[] => {
    return [...keyboardEvents, ...mouseEvents].map((event: AlpineEvent) => ({
        label: `@${event.name}`,
        kind: CompletionItemKind.Event,
        insertText: "@" + event.name + '="${1}"',
        insertTextFormat: InsertTextFormat.Snippet,
        documentation:
            event.documentation + `\nShorthand for x-on:${event.name}`,
    }));
};

const directives = (): CompletionItem[] => {
    return [
        {
            label: "x-data",
            kind: CompletionItemKind.Keyword,
            insertText: 'x-data="${1}"',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Defines a chunk of HTML as an Alpine component and provides the reactive data for that component to reference.
`,
        },
        {
            label: "x-on:",
            kind: CompletionItemKind.Keyword,
            insertText: "x-on:${1}",
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Allows you to easily run code on dispatched DOM events.
`,
        },
    ];
};

export { shorthands, directives };
