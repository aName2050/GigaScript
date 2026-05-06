export interface TokenPosition {
	start: {
		Line: number | null;
		Column: number | null;
	};
	end: {
		Line: number | null;
		Column: number | null;
	};
}
