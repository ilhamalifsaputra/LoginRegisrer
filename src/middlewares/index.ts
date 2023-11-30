import express from 'express';
import { get, merge } from 'lodash';

import { getUsersBySessionToken } from '../db/users';

//Check Autentikasi
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['LOGIN-AUTH'];

        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUsersBySessionToken(sessionToken);

        if (!existingUser)  {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

//Ini kode untuk memvalidasi akun sendiri fungsinya agar tidak bisa menghapus akun lain kalo login pake akun sendiri
export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {id} = req.params
        const currenUserId = get(req, 'identity._id') as string

        if (!currenUserId) {
            return res.sendStatus(403);
        }

        if (currenUserId.toString() !== id) {
            return res.sendStatus(403);
        }

        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}