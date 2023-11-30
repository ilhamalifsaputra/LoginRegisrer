import { createUser, getUsersByEmail } from '../db/users';
import express from 'express';
import { authentication, random } from '../helpers';

// Fungsi untuk melakukan login
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        // Memeriksa apakah email dan password ada
        if (!email || !password) {
            return res.sendStatus(400);
        }

        // Mendapatkan pengguna berdasarkan email
        const user = await getUsersByEmail(email).select('+authentication.salt +authentication.password')

        // Jika pengguna tidak ditemukan, kirim status 400
        if (!user) {
            return res.sendStatus(400);
        }

        // Memeriksa apakah password cocok
        const expectedHash = authentication(user.authentication.salt, password);

        // Jika password tidak cocok, kirim status 403
        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403)
        }

        // Jika password cocok, buat token sesi baru
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        // Simpan pengguna dengan token sesi baru
        await user.save();

        // Mengatur cookie dengan token sesi
        res.cookie('LOGIN-AUTH', user.authentication.sessionToken, { domain : 'localhost', path: '/' });

        // Mengirim status 200 dan data pengguna
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

// Fungsi untuk melakukan registrasi
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        // Memeriksa apakah email, password, dan username ada
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        // Memeriksa apakah pengguna sudah ada
        const existingUser = await getUsersByEmail(email);

        // Jika pengguna sudah ada, kirim status 200 dan data pengguna
        if (existingUser) {
            return res.status(200).json(existingUser);
        }

        // Jika pengguna belum ada, buat pengguna baru
        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        // Mengirim status 200 dan data pengguna baru
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}
