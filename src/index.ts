import {
    createConnection,
    TextDocuments,
    InitializeParams,
    CompletionItem,
    TextDocumentSyncKind,
    CompletionList,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
    getAttributesCompletions,
    getAttributeShorthandCompletions,
    getDirectiveCompletions,
    getEventCompletions,
    getModifierCompletions,
    getShorthandCompletions,
} from "./completions.js";
import {
    getAlpineUri,
    openAlpineContext,
    setupTypescriptServer,
    updateAlpineContext,
} from "./typescript-server.js";
import {
    extractJSSnippet,
    extractXDataProps,
    fullTagXData,
} from "./js-parser.js";
import {
    existingAttributes,
    getFragments,
    isInHtmlTag,
    tagsWithXData,
} from "./html-parser.js";
import { XDataProps } from "./types.js";
import { magics } from "./magics.js";

const tsConnection = await setupTypescriptServer();

const connection = createConnection();
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

documents.listen(connection);
connection.listen();

connection.onInitialize((_params: InitializeParams) => ({
    capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: {
            triggerCharacters: [".", "@", ":", "$"],
            resolveProvider: true,
        },
    },
}));

connection.onCompletion(async (params): Promise<CompletionItem[]> => {
    const doc = documents.get(params.textDocument.uri)!;
    const offset = doc.offsetAt(params.position);
    const text = doc.getText();

    const { fragmentBefore, fragmentAfter } = getFragments(doc, params, 20);

    if (!isInHtmlTag(fragmentBefore)) {
        return [];
    }

    const inQuotes = (fragmentBefore.split('"').length - 1) % 2 === 1;

    if (!inQuotes) {
        const existingAttrs = existingAttributes(text, offset);
        let completions: CompletionItem[] = [];

        if (fragmentBefore.endsWith("x-on:")) {
            completions = getEventCompletions();
        } else if (fragmentBefore.endsWith("x-bind:")) {
            completions = getAttributesCompletions();
        } else if (fragmentBefore.endsWith(" :")) {
            completions = getAttributeShorthandCompletions();
        } else if (fragmentBefore.endsWith("@")) {
            completions = getShorthandCompletions();
        } else if (fragmentBefore.endsWith(".")) {
            completions = getModifierCompletions();
        } else {
            completions = getDirectiveCompletions();
        }

        return completions.filter(
            (c) => !existingAttrs.includes(c.label.toLowerCase())
        );
    }

    const xDataTags = tagsWithXData(text);

    const activeTag = xDataTags.findLast((tag) => {
        return offset >= tag.range.start && offset <= tag.range.end;
    });

    if (!activeTag) return [];

    let props: XDataProps[] = [];

    if (fragmentBefore.endsWith("$")) {
        return magics();
    }

    if (/x-data="[^"]*$/.test(fragmentBefore)) {
        props = fullTagXData(activeTag);
    } else {
        props = extractXDataProps(activeTag.xData);
    }
    const xDataProps: CompletionItem[] = props.map((prop) => ({
        label: prop.name,
        kind: prop.kind,
        data: {
            source: "x-data",
        },
        detail: `x-data: ${prop.name}`,
    }));

    if (!getAlpineUri()) {
        openAlpineContext(params);
    }

    const jsSnippet = extractJSSnippet(fragmentBefore, fragmentAfter);

    updateAlpineContext(jsSnippet);

    const rawTsCompletions = await tsConnection.sendRequest(
        "textDocument/completion",
        {
            textDocument: { uri: getAlpineUri() },
            position: { line: 1, character: jsSnippet.length },
            context: params.context,
        }
    );

    const tsCompletions: CompletionItem[] = Array.isArray(rawTsCompletions)
        ? rawTsCompletions
        : (rawTsCompletions as CompletionList).items;

    return [...tsCompletions, ...xDataProps];
});
