import { spawn, ChildProcess } from "child_process";
import {
    createConnection,
    TextDocuments,
    InitializeParams,
    CompletionItem,
    TextDocumentSyncKind,
    TextDocumentChangeEvent,
    createProtocolConnection,
    StreamMessageReader,
    StreamMessageWriter,
    CompletionParams,
    InitializeRequest,
    InitializedNotification,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
    getDirectiveCompletions,
    getEventCompletions,
    getModifierCompletions,
    getShorthandCompletions,
} from "./completions.js";

const tsProcess: ChildProcess = spawn("typescript-language-server", [
    "--stdio",
]);
const tsConnection = createProtocolConnection(
    new StreamMessageReader(tsProcess.stdout!),
    new StreamMessageWriter(tsProcess.stdin!)
);

tsConnection.listen();

const initResult = await tsConnection.sendRequest(InitializeRequest.method, {
    processId: process.pid,
    rootUri: null,
    capabilities: {},
});

tsConnection.sendNotification(InitializedNotification.method);

tsConnection.onNotification("window/logMessage", (msg) => {
    connection.console.log(`[ts-ls] ${msg.message}`);
});
tsConnection.onNotification("textDocument/publishDiagnostics", (diag) => {
    connection.console.log(`[ts-ls diagnostics] ${JSON.stringify(diag)}`);
});

const connection = createConnection();
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

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

connection.onInitialized(() => {
    connection.console.log("Alpine.js Language Server is running.");
});

connection.onHover(() => {
    return {
        contents: ["# Alpine.js Language Server"],
    };
});

documents.onDidChangeContent(
    (change: TextDocumentChangeEvent<TextDocument>) => {}
);

documents.onDidClose((e) => {});

connection.onCompletion(async (params): Promise<CompletionItem[]> => {
    const doc = documents.get(params.textDocument.uri)!;

    const maxLines = 20;
    const startLine = Math.max(0, params.position.line - maxLines);
    const fragmentBefore = doc.getText({
        start: { line: startLine, character: 0 },
        end: params.position,
    });
    const fragmentAfter = doc.getText({
        start: params.position,
        end: { line: params.position.line + maxLines, character: 0 },
    });

    const lastLt = fragmentBefore.lastIndexOf("<");
    const lastGt = fragmentBefore.lastIndexOf(">");
    const lastSlash = fragmentBefore.lastIndexOf("/");
    if (lastLt <= lastGt || lastLt <= lastSlash) {
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
        jsSnippet = fragmentAfter.slice(0, closeQuoteIdx);
    }

    const jsText = fragmentBefore.slice(openQuoteIdx + 1) + jsSnippet;

    const jsParams: CompletionParams = {
        textDocument: {
            uri: `inmemory://model/${params.textDocument.uri}.js`,
        },
        position: { line: 0, character: jsText.length },
        context: params.context,
    };

    tsConnection.sendNotification("textDocument/didOpen", {
        textDocument: {
            uri: jsParams.textDocument.uri,
            languageId: "javascript",
            version: 1,
            text: jsText,
        },
    });

    const tsCompletions = await tsConnection.sendRequest(
        "textDocument/completion",
        jsParams
    );

    tsConnection.sendNotification("textDocument/didClose", {
        textDocument: { uri: jsParams.textDocument.uri },
    });

    return tsCompletions as CompletionItem[];
});

documents.listen(connection);
connection.listen();
