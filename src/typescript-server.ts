import { spawn, ChildProcess } from "child_process";
import {
    CompletionParams,
    createProtocolConnection,
    InitializedNotification,
    InitializeRequest,
    ProtocolConnection,
    StreamMessageReader,
    StreamMessageWriter,
} from "vscode-languageserver/node.js";

let tsConnection: ProtocolConnection | null = null;
let alpineUri: string | null = null;
let alpineVersion: number = 0;

async function setupTypescriptServer(): Promise<ProtocolConnection> {
    const tsProcess: ChildProcess = spawn("typescript-language-server", [
        "--stdio",
    ]);

    tsConnection = createProtocolConnection(
        new StreamMessageReader(tsProcess.stdout!),
        new StreamMessageWriter(tsProcess.stdin!)
    );

    tsConnection.listen();

    const initResult = await tsConnection.sendRequest(
        InitializeRequest.method,
        {
            processId: process.pid,
            rootUri: null,
            capabilities: {},
        }
    );

    tsConnection.sendNotification(InitializedNotification.method);

    return tsConnection;
}

function openAlpineContext(params: CompletionParams): void {
    const fileUri = params.textDocument.uri;
    alpineUri = `inmemory://model/${fileUri}.alpine.js`;

    tsConnection!.sendNotification("textDocument/didOpen", {
        textDocument: {
            uri: alpineUri,
            languageId: "javascript",
            version: alpineVersion,
            text: "",
        },
    });
}

function updateAlpineContext(text: string): void {
    tsConnection!.sendNotification("textDocument/didChange", {
        textDocument: {
            uri: alpineUri,
            version: ++alpineVersion,
            text: text,
        },
    });
}

function getAlpineUri(): string {
    return alpineUri ?? "";
}

export {
    setupTypescriptServer,
    getAlpineUri,
    openAlpineContext,
    updateAlpineContext,
};
