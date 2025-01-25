import { EXPRESSION, STATEMENT } from './ast';

export interface ImportStatement extends STATEMENT {
	kind: 'ImportStatement';
	imports: Map<string, string>;
	source: string;
}

export interface ExportStatement extends STATEMENT {
	kind: 'ExportStatement';
	value: STATEMENT | EXPRESSION;
}
