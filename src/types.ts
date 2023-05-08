export interface Candle {
	metadata: { period: string };
	timeframe: string;
	timestamp: Date;
	open: number;
	high: number;
	low: number;
	close: number;
}
