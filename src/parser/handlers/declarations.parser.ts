import { SOURCE_FILE } from '../..';
import { Statement } from '../../ast/core.ast';
import { VariableDeclaration } from '../../ast/statements/declarations.ast';
import { GSType } from '../../ast/types.ast';
import { TokenType } from '../../lexer/tokens';
import { GSError, SpecialError, Token } from '../../types';
import Parser from '../parser';
import { formatErrorLocation } from '../util';

export default function ParseDeclaration(parser: Parser): Statement {
	const startTokenPosition: Token['_GSC']['Position']['Start'] =
		parser.Util.currentToken()._GSC.Position.Start;

	parser.Util.expect(TokenType.A, 'Following "declare" keyword');

	switch (parser.Util.currentToken().id) {
		case TokenType.Constant:
		case TokenType.Mutable:
			// handle variables
			return ParseVariableDeclaration(parser, startTokenPosition);
		case TokenType.Function:
		// handle functions
		default:
			throw new GSError(
				SpecialError.SyntaxError,
				'Invalid declaration',
				formatErrorLocation(parser.Util.currentToken())
			);
	}
}

function ParseVariableDeclaration(
	parser: Parser,
	start: Token['_GSC']['Position']['Start']
): Statement {
	const isConstant: boolean = parser.Util.advance().id == TokenType.Constant;
	let type: GSType;
	switch (parser.Util.currentToken().id) {
		case TokenType.__Any__:
			type = 'any';
			break;
		case TokenType.__Number:
			type = 'number';
			break;
		case TokenType.__String__:
			type = 'string';
			break;
		case TokenType.__Boolean__:
			type = 'boolean';
			break;
		case TokenType.__Object__:
			type = 'object';
			break;
		case TokenType.__None__:
			type = 'none';
			break;
		default:
			throw new GSError(
				SpecialError.SyntaxError,
				'Invalid type',
				`${SOURCE_FILE}:${formatErrorLocation(
					parser.Util.currentToken()
				)}`
			);
	}

	parser.Util.advance(); // advance by type

	parser.Util.expect(TokenType.Called, 'in variable declaration');

	const identifier = parser.Util.expect(
		TokenType.__Identifier,
		`following "called" keyword`
	).raw;

	if (parser.Util.currentToken().id == TokenType.Period) {
		const endPos = parser.Util.advance()._GSC.Position.End;
		if (isConstant) {
			throw new GSError(
				SpecialError.ParseError,
				'Constant variables must be declared with a value',
				`${SOURCE_FILE}:${formatErrorLocation(
					parser.Util.currentToken()
				)}`
			);
		}

		return {
			kind: 'VariableDeclaration',
			constant: isConstant,
			identifier,
			valueType: type,
			start: start,
			end: endPos,
		} as VariableDeclaration;
	}

	parser.Util.expect(TokenType.Set, 'following variable identifier');
	parser.Util.expect(TokenType.To, 'following "set" keyword');

	const declaration = {
		kind: 'VariableDeclaration',
		value: parser.parseExpression(),
		constant: isConstant,
		valueType: type,
		identifier,
		start: start,
		end: parser.Util.nextToken()._GSC.Position.End,
	} as VariableDeclaration;

	parser.Util.expect(TokenType.Period, 'following variable declaration');

	return declaration;
}
