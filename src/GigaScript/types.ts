/**
 * types.ts
 *
 * GigaScript typings
 */

export interface CLIArguments {
	file: string;
	useCUDA: boolean | undefined;
	ASTOnly: boolean | undefined;
	debug: boolean | undefined;
}
