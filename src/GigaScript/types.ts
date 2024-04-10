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

export interface Class {
	name: string;
	properties: Array<string>;
	methods: Array<string>;
}
