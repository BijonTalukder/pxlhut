const ApiError = require("../error/handleApiError");
const catchAsync = require("../shared/catchAsync");
const jwtHelpers = require("../shared/jwtHandaler");
const ResponseHandler = require("../shared/response.handaler");

class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    createUser = catchAsync(async (req, res, next) => {

        const { name, email, password } = req.body;
        const user = await this.userService.createUser({ name, email, password });

        if (!user) {
            throw new ApiError(400, "user can not create!");
        }
        ResponseHandler.success(res, "User registered  successfully", user, 201)


    })

    loginUser = catchAsync(async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Please provide email and password!");
        }
        const user = await this.userService.loginUser({ email, password });

        if (!user) {
            throw new ApiError(400, "Invalid email or password!");
        }


        const accessToken = jwtHelpers.createToken({ id: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
     '1h');
        const refreshToken = jwtHelpers.createToken({ id: user._id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
         '30d' );

        await user.updateOne({ refreshToken });


        ResponseHandler.success(
            res,
            "User logged in successfully",
            { user, accessToken, refreshToken },
            200
        );
    })




    getUserProfile = catchAsync(async (req, res) => {
        const user = await this.userService.getUserById(req.user._id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        ResponseHandler.success(res, 'User profile fetched successfully', user);
      });
    
}

module.exports = UserController;