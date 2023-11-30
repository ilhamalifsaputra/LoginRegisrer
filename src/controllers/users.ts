import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../db/users';

// Fungsi untuk mendapatkan semua pengguna
export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        // Mengambil semua pengguna dari database
        const user = await getUsers();

        // Mengirimkan respon dengan status 200 dan data pengguna
        return res.status(200).json(user);
    } catch (error) {
        // Menangani kesalahan dan mengirimkan respon dengan status 400
        console.log(error);
        return res.sendStatus(400);
    }
};

// Fungsi untuk menghapus pengguna berdasarkan ID
export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        // Mengambil ID dari parameter request
        const { id } = req.params;

        // Menghapus pengguna berdasarkan ID
        const deletedUser = await deleteUserById(id);

        // Mengirimkan respon dengan data pengguna yang dihapus
        return res.json(deletedUser);
    } catch (error) {
        // Menangani kesalahan dan mengirimkan respon dengan status 400
        console.log(error);
        return res.sendStatus(400);
    }
};

// Fungsi untuk memperbarui pengguna
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        // Mengambil ID dan username dari request
        const { id } = req.params;
        const { username } = req.body;

        // Memeriksa apakah username ada
        if (!username) {
            return res.sendStatus(400);
        }

        // Mengambil pengguna berdasarkan ID
        const user = await getUserById(id);

        // Memperbarui username pengguna
        user.username = username;

        // Menyimpan perubahan ke database
        await user.save();

        // Mengirimkan respon dengan status 200 dan data pengguna
        return res.status(200).json(user).end();
    } catch (error) {
        // Menangani kesalahan dan mengirimkan respon dengan status 400
        console.log(error);
        return res.sendStatus(400);
    }
};
