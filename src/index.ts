import {
    createConnection,
    TextDocuments,
    InitializeParams,
    CompletionItem,
    TextDocumentSyncKind,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
    getDirectiveCompletions,
    getEventCompletions,
    getModifierCompletions,
    getShorthandCompletions,
} from "./completions.js";
import {
    getAlpineUri,
    openAlpineContext,
    setupTypescriptServer,
} from "./typescript-server.js";
import { fullTagXData } from "./js-parser.js";
import { getFragments, isInHtmlTag, tagsWithXData } from "./html-parser.js";
import { XDataProps } from "./types.js";

const tsConnection = await setupTypescriptServer();

const connection = createConnection();
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

documents.listen(connection);
connection.listen();

connection.onInitialize((_params: InitializeParams) => ({
    capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: {
            triggerCharacters: [".", "@", ":"],
            resolveProvider: true,
        },
        hoverProvider: true,
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
        if (fragmentBefore.endsWith("x-on:")) {
            return getEventCompletions();
        }

        if (fragmentBefore.endsWith("@")) {
            return getShorthandCompletions();
        }

        if (fragmentBefore.endsWith(".")) {
            return getModifierCompletions();
        }

        return getDirectiveCompletions();
    }

    const xDataTags = tagsWithXData(text);

    const activeTag = xDataTags.findLast((tag) => {
        return offset >= tag.range.start && offset <= tag.range.end;
    });

    if (!activeTag) return [];

    const props: XDataProps[] = fullTagXData(activeTag);

    return props.map((prop) => ({
        label: prop.name,
        kind: prop.kind,
    }));

    const openQuoteIdx = fragmentBefore.lastIndexOf('"');
    if (openQuoteIdx === -1) {
        return [];
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

    if (!getAlpineUri()) {
        openAlpineContext(params);
    }

    const tsCompletions = await tsConnection.sendRequest(
        "textDocument/completion",
        {
            textDocument: { uri: getAlpineUri() },
            position: { line: 1, character: jsSnippet.length },
            context: params.context,
        }
    );

    return tsCompletions as CompletionItem[];
});
