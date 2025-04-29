import {
    CompletionItem,
    CompletionItemKind,
    InsertTextFormat,
} from "vscode-languageserver";
import { directives } from "./directives.js";
import { events } from "./events.js";
import { modifiers } from "./modifiers.js";

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

export {
    getDirectiveCompletions,
    getShorthandCompletions,
    getEventCompletions,
    getModifierCompletions,
};
