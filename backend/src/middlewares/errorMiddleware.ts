import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/index';

export const errorMiddleware = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('X Erro capturado:', err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: true,
            message: err.message,
            details: err.details || null
        });
        return;
    }

    if (err.name === 'ValidationError') {
        res.status(err.statusCode).json({
            error: true,
            message: err.message,
            details: err.details || null
        });
        return;
    }

    if ('code' in err && err.code === 'SQLITE_CONSTRAINT') {
        res.status(409).json({
            error: true,
            message: 'Conflito de dados no banco',
            details: 'Operação violou restrições de integridade no banco de dados.'
        });
        return;
    }

    res.status(500).json({
        error: true,
        message: 'Erro interno no servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : null
    })
}