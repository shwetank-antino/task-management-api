import User from '../../../models/user.model.js';

export async function getAllUsers(req,res){
    try{
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

export async function getMe(req,res){
    try{
        const id = req.user.id;
        const user = await User.findById(id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

export async function updateUserRole(req,res){
    const { id } = req.params;
    const { role } = req.body;

    if(!['user','admin'].includes(role)){
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    if(id === req.user.id){
        return res.status(400).json({ 
            message: 'Users cannot change their own role' 
        });
    }

    try{
        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        user.role = role;;
        await user.save();

        res.status(200).json({ 
            message: 'User role updated successfully', 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

export async function deleteUser(req,res){
    const { id } = req.params;

    if(id === req.user.id){
        return res.status(400).json({ 
            message: 'Users cannot delete their own account' 
        });
    }

    try{
        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        await user.deleteOne();

        res.status(200).json({ 
            message: 'User deleted successfully' 
        });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}