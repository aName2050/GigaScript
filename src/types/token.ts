import { OperatorOrder } from './OperatorOrder';
import { TokenID } from './token.symbol';
import { NodeType } from './token.node';

/** Represents a single token */
export interface Token {
	/** Token ID */
	id: TokenID;
	/** Token structure */
	type: NodeType;
	/** Raw value as seen in the source file */
	value: string;
	/** GigaScript Token Data */
	__GSC: {
		_OPC: OperatorOrder;
		_POS: {
			start: {
				Line: number | null;
				Column: number | null;
			};
			end: {
				Line: number | null;
				Column: number | null;
			};
		};
	};
}
