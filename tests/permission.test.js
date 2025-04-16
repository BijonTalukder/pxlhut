const permission = require("../src/middlewares/permission");

describe("Permission Tests", () => {
    const getMockReqResNext = (user = null) => {
        const req = { user };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        return { req, res, next };
    };


    test("Permission check with out token data", () => {

        const { req, res, next } = getMockReqResNext();
        const permissiCallback = permission("admin")
        permissiCallback(req, res, next)

        //    console.log(res.status,res)
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Unauthorized: No user found",
        });
        expect(next).not.toHaveBeenCalled();

    });


    test("Permission check with valid user and role",()=>{
        const { req, res, next } = getMockReqResNext({ role: "admin" });
        const permissiCallback = permission("admin")
        permissiCallback(req, res, next)

        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    })




})