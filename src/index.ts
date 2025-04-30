import {
    createConnection,
    TextDocuments,
    InitializeParams,
    CompletionItem,
    TextDocumentSyncKind,
    createProtocolConnection,
    StreamMessageReader,
    StreamMessageWriter,
    InitializeRequest,
    InitializedNotification,
    CompletionParams,
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

async function getFragments(
    params: CompletionParams,
    maxLines: number
): Promise<{ fragmentBefore: string; fragmentAfter: string }> {
    const doc = documents.get(params.textDocument.uri)!;
    const startLine = Math.max(0, params.position.line - maxLines);
    const fragmentBefore = doc.getText({
        start: { line: startLine, character: 0 },
        end: params.position,
    });
    const fragmentAfter = doc.getText({
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

connection.onCompletion(async (params): Promise<CompletionItem[]> => {
    const { fragmentBefore, fragmentAfter } = await getFragments(params, 20);

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
