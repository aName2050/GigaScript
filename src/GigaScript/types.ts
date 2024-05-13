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
	NoCrashOnError: boolean | undefined;
	SilenceErrors: boolean | undefined;
}

export interface ClassBody {
	properties: Array<ClassProperty>;
	methods: Array<ClassMethod>;
	constructor: ConstructorStatement | undefined;
}
