import { response } from "express";
import {hash, verify} from "argon2";
import User from './user.model.js';

export const updateUser = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, password, email, ...data} = req.body;

        if (password || email) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update password or email directly',
            });
        }   

        const user = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'User updated successfully',
            user
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: 'Error updating user',
            error: error.message
        })
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { passwordOld, passwordNew } = req.body;
        const user = await User.findById(id);

        const validPassword = await verify(user.password, passwordOld);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: 'The current password is incorrect'
            });
        }

        if(passwordNew){
            const passwordUpdate = await hash(passwordNew)
            await User.findByIdAndUpdate(id, { password: passwordUpdate });
        };


        res.status(200).json({
            success: true,
            msg: 'Password updating successfully'
        });

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({
            success: false,
            msg: 'Failed to update password',
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { password, confirmDeletion} = req.body;

    const authenticatedUserId = req.usuario.id; 
    if (id !== authenticatedUserId) {
        return res.status(403).json({
            success: false,
            msg: 'You can only delete your own account'
        });
    }

    const user = await User.findById(id);
    try {
        if (!confirmDeletion) {
            return res.status(400).json({
                success: false,
                msg: 'Please confirm the deletion action'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: 'The current password is incorrect'
            });
        } else {
            await User.findByIdAndUpdate(id, { state: false });
        };

        res.status(200).json({
            success: true,
            message: 'User disabled.',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deleting User',
            error: error.message,
        });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        const validRoles = ['ADMIN_ROLE', 'NORMAL_ROLE'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid role. Allowed roles: ADMIN_ROLE, NORMAL_ROLE'
            });
        }

        await User.findByIdAndUpdate(id, { role });

        res.status(200).json({
            success: true,
            msg: 'User role updated successfully'
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({
            success: false,
            msg: 'Failed to update user role',
            error: error.message
        });
    }
};
