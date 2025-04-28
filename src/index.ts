import {
    createConnection,
    TextDocuments,
    InitializeParams,
    CompletionItem,
    TextDocumentSyncKind,
    CompletionParams,
    TextDocumentChangeEvent,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { match } from "./inputMatcher.js";

const connection = createConnection();
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((_params: InitializeParams) => ({
    capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: {
            triggerCharacters: ["x", "@", ".", ":"],
            resolveProvider: false,
        },
    },
}));

documents.onDidChangeContent(
    (change: TextDocumentChangeEvent<TextDocument>) => {}
);

connection.onCompletion((params: CompletionParams): CompletionItem[] => {
    const doc = documents.get(params.textDocument.uri)!;

    const maxLines = 20;
    const startLine = Math.max(0, params.position.line - maxLines);
    const fragment = doc.getText({
        start: { line: startLine, character: 0 },
        end: params.position,
    });

    const lastLt = fragment.lastIndexOf("<");
    const lastGt = fragment.lastIndexOf(">");
    const lastSlash = fragment.lastIndexOf("/");
    if (lastLt <= lastGt || lastLt <= lastSlash) {
        return [];
    }

    const trigger = params.context?.triggerCharacter || "";
    const beforeCursor = fragment.slice(lastLt);

    return match(beforeCursor, trigger);
});

documents.listen(connection);
connection.listen();
