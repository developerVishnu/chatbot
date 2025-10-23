import type { Request, Response, NextFunction } from "express";

export default function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	// Basic error normalization - expand as needed
	if (err instanceof Error) {
		// eslint-disable-next-line no-console
		console.error(err.stack || err.message);
		return res.status(500).json({ error: err.message });
	}

	// eslint-disable-next-line no-console
	console.error("Unknown error", err);
	return res.status(500).json({ error: "Internal Server Error" });
}
