import { getUserById, createUser, updateUser, deleteUser } from '../services/userService';

const userController = {
  async getUser(req, res) {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  },

  async createUser(req, res) {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  },

  async updateUser(req, res) {
    const updatedUser = await updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  },

  async deleteUser(req, res) {
    const result = await deleteUser(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  }
};

export default userController;
