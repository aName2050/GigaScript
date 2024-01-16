// translate .gsx to .g
// TODO:

import { TokenType } from "../types";

const TOKENS: Record<string, TokenType> = {
    'lit': TokenType.Let,
    'bro': TokenType.Const,

    'bruh': TokenType.Func,

    'sus': TokenType.If,
    'imposter': TokenType.Else,

    'yall': TokenType.For,

    'big': TokenType.GreaterThan,
    'lil': TokenType.LessThan,
    'frfr': TokenType.IsEqual,
    'nah': TokenType.NotEquals,
    'btw': TokenType.And,
    'carenot': TokenType.Or,

    'with': TokenType.BinOp, // +
    'without': TokenType.BinOp, // -
    'by': TokenType.BinOp, // *
    'some': TokenType.BinOp, // /
    'left': TokenType.BinOp, // %

    'be': TokenType.Equals
}
