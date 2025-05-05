import {
    CompletionItem,
    CompletionItemKind,
    InsertTextFormat,
    MarkupContent,
} from "vscode-languageserver";
import { directives } from "./directives.js";
import { events } from "./events.js";
import { modifiers } from "./modifiers.js";
import { attributes } from "./attributes.js";

function getDirectiveCompletions(): CompletionItem[] {
    return directives().map((item) => ({
        ...item,
        data: { source: "alpine", incomplete: true },
    }));
}

function getShorthandCompletions(): CompletionItem[] {
    return events().map((event) => ({
        label: `@${event.label}`,
        kind: CompletionItemKind.Event,
        insertText: "@" + event.label + '="${1}"',
        insertTextFormat: InsertTextFormat.Snippet,
        documentation:
            event.documentation + `\nShorthand for x-on:${event.label}`,
        data: { source: "alpine", incomplete: true },
    }));
}

function getEventCompletions(): CompletionItem[] {
    return events().map((event) => ({
        ...event,
        data: { source: "alpine", incomplete: true },
    }));
}

function getModifierCompletions(): CompletionItem[] {
    return modifiers().map((modifier) => ({
        ...modifier,
        data: { source: "alpine", incomplete: true },
    }));
}

function getAttributesCompletions(): CompletionItem[] {
    return attributes().map((attribute) => ({
        ...attribute,
        data: { source: "alpine", incomplete: true },
    }));
}

function getAttributeShorthandCompletions(): CompletionItem[] {
    return attributes().map((attribute) => ({
        label: `:${attribute.label}`,
        kind: CompletionItemKind.Value,
        insertText: ":" + attribute.label + '="${1}"',
        insertTextFormat: InsertTextFormat.Snippet,
        documentation: {
            kind: "markdown",
            value:
                (attribute.documentation as MarkupContent).value +
                `\nShorthand for x-bind:${attribute.label}`,
        } as MarkupContent,
        data: { source: "alpine", incomplete: true },
    }));
}

export {
    getDirectiveCompletions,
    getShorthandCompletions,
    getEventCompletions,
    getModifierCompletions,
    getAttributesCompletions,
    getAttributeShorthandCompletions,
};
