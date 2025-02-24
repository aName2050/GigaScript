import { Statement } from '../../ast/core.ast';
import { TokenType } from '../../lexer/tokens';
import { Token } from '../../types';
import Parser from '../parser';

export default function ParseDeclaration(parser: Parser): Statement {
	const startTokenPosition: Token['_GSC']['Position']['Start'] =
		parser.Util.currentToken()._GSC.Position.Start;

	parser.Util.expect(TokenType.A, 'Following "declare" keyword');

	switch (parser.Util.currentToken().id) {
		case TokenType.Constant:
		case TokenType.Mutable:
		// handle variables
		case TokenType.Function:
		// handle functions
	}
}

function ParseVariableDeclaration(parser: Parser): Statement {
	const isConstant: boolean = parser.Util.advance().id == TokenType.Constant;
	// const type = parser.Util.expect(TokenType.)
	// TODO:
}
