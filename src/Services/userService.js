const userModel = require("../Models/userModel");

class UserService{

    constructor()
    {
        this.userModel = userModel
    }
    async createUser(userData)
    {
        const { name, email, password } = userData;
        const user = await this.userModel.create({ name, email, password });
        return user;
    }

    async loginUser(userData)
    {
        const { email, password } = userData;
        const user = await this.userModel.findOne({ email });
        if (!user) return null;
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return null;
        return user;
    }

    async getUserById(id) {
        const user = await this.userModel.findById(id).select('-password');
        return user;
      }
    

}

module.exports = UserService;