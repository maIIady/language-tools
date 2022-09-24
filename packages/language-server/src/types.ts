import * as embeddedLS from '@volar/language-service';
import * as embedded from '@volar/language-core';
import type { FileSystemProvider } from 'vscode-html-languageservice';
import type * as ts from 'typescript/lib/tsserverlibrary';
import * as vscode from 'vscode-languageserver';
import type * as Requests from './requests';
import { URI } from 'vscode-uri';

export declare let __requests: typeof Requests; // keep this code for jsdoc link

export type FileSystemHost = {
	ready(connection: vscode.Connection): void,
	clearCache(): void,
	getWorkspaceFileSystem(rootUri: URI): FileSystem,
	onDidChangeWatchedFiles(cb: (params: vscode.DidChangeWatchedFilesParams, reason: 'lsp' | 'web-cache-updated') => void): () => void,
};

export type FileSystem = Pick<ts.System,
	'newLine'
	| 'useCaseSensitiveFileNames'
	| 'fileExists'
	| 'readFile'
	| 'readDirectory'
	| 'getCurrentDirectory'
	| 'realpath'
	| 'resolvePath'
> & Partial<ts.System>;

export interface RuntimeEnvironment {
	loadTypescript: (initOptions: ServerInitializationOptions) => typeof import('typescript/lib/tsserverlibrary'),
	loadTypescriptLocalized: (initOptions: ServerInitializationOptions) => any,
	schemaRequestHandlers: { [schema: string]: (uri: string, encoding?: BufferEncoding) => Promise<string>; },
	onDidChangeConfiguration?: (settings: any) => void,
	fileSystemProvide: FileSystemProvider | undefined,
	createFileSystemHost: (
		ts: typeof import('typescript/lib/tsserverlibrary'),
		capabilities: vscode.ClientCapabilities,
	) => FileSystemHost,
}

export type LanguageServerPlugin<
	A extends ServerInitializationOptions = ServerInitializationOptions,
	B extends embedded.LanguageServiceHost = embedded.LanguageServiceHost,
	C = embeddedLS.LanguageService
> = (initOptions: A) => {

	extensions: string[],

	languageService?: {

		semanticTokenLegend?: vscode.SemanticTokensLegend,

		resolveLanguageServiceHost?(
			ts: typeof import('typescript/lib/tsserverlibrary'),
			sys: FileSystem,
			tsConfig: string | ts.CompilerOptions,
			host: embedded.LanguageServiceHost,
		): B,

		getLanguageModules?(host: B): embedded.EmbeddedLanguageModule[],

		getServicePlugins?(
			host: B,
			service: embeddedLS.LanguageService,
		): embeddedLS.EmbeddedLanguageServicePlugin[],

		onInitialize?(
			connection: vscode.Connection,
			getLangaugeService: (uri: string) => Promise<C>,
		): void,
	},

	documentService?: {

		getLanguageModules?(
			ts: typeof import('typescript/lib/tsserverlibrary'),
			env: embeddedLS.PluginContext['env'],
		): embedded.EmbeddedLanguageModule[],

		getServicePlugins?(
			context: embeddedLS.DocumentServiceRuntimeContext,
		): embeddedLS.EmbeddedLanguageServicePlugin[],
	};
};

export interface ServerInitializationOptions {
	textDocumentSync?: vscode.TextDocumentSyncKind | number;
	typescript: {
		/**
		 * Path to tsserverlibrary.js / tsserver.js / typescript.js
		 * @example
		 * '/usr/local/lib/node_modules/typescript/lib/tsserverlibrary.js' // use global typescript install
		 * 'typescript/lib/tsserverlibrary.js' // if `typescript` exist in `@volar/vue-lannguage-server` itself node_modules directory
		 * '../../../typescript/lib/tsserverlibrary.js' // relative path to @volar/vue-language-server/out/index.js
		 */
		serverPath: string;
		/**
		 * Path to lib/xxx/diagnosticMessages.generated.json
		 * @example
		 * '/usr/local/lib/node_modules/typescript/lib/ja/diagnosticMessages.generated.json' // use global typescript install
		 * 'typescript/lib/ja/diagnosticMessages.generated.json' // if `typescript` exist in `@volar/vue-lannguage-server` itself node_modules directory
		 * '../../../typescript/lib/ja/diagnosticMessages.generated.json' // relative path to @volar/vue-language-server/out/index.js
		 */
		localizedPath?: string;
	};
	/**
	 * typescript, html, css... language service will be create in server if this option is not null
	 */
	languageFeatures?: {
		references?: boolean;
		implementation?: boolean;
		definition?: boolean;
		typeDefinition?: boolean;
		callHierarchy?: boolean;
		hover?: boolean;
		rename?: boolean;
		renameFileRefactoring?: boolean;
		signatureHelp?: boolean;
		completion?: boolean | {
			/**
			 * {@link __requests.GetDocumentSelectionRequest}
			 * */
			getDocumentSelectionRequest?: boolean,
			// for resolve https://github.com/sublimelsp/LSP-volar/issues/114
			ignoreTriggerCharacters?: string,
		};
		documentHighlight?: boolean;
		documentLink?: boolean;
		workspaceSymbol?: boolean;
		codeLens?: boolean | {
			/**
			 * {@link __requests.ShowReferencesNotification}
			 * */
			showReferencesNotification?: boolean,
		};
		semanticTokens?: boolean;
		codeAction?: boolean;
		inlayHints?: boolean;
		diagnostics?: boolean;
		schemaRequestService?: boolean | {
			/**
			 * {@link __requests.GetDocumentContentRequest}
			 * */
			getDocumentContentRequest?: boolean,
		};
	};
	/**
	 * html language service will be create in server if this option is not null
	 */
	documentFeatures?: {
		selectionRange?: boolean;
		foldingRange?: boolean;
		linkedEditingRange?: boolean;
		documentSymbol?: boolean;
		documentColor?: boolean;
		documentFormatting?: boolean,
	};
}