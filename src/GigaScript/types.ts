import {
	ClassMethod,
	ClassProperty,
	ConstructorStatement,
} from './ast/class.ast';

export interface CLIArguments {
	file: string;
	useCUDA: boolean | undefined;
	ASTOnly: boolean | undefined;
	debug: boolean | undefined;
}

export interface ClassBody {
	properties: Array<ClassProperty>;
	methods: Array<ClassMethod>;
	constructor: ConstructorStatement | undefined;
}
