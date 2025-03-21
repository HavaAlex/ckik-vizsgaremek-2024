const userService = require("../services/userService");

const groupService = require("../services/csoportService");

const userRepository  = require("../repositories/userRepository"); 

const bcrypt = require("bcrypt");

const salt = 10;

const jwt = require("jsonwebtoken");
const roleService = require("../services/roleService");
const { stubTrue } = require("lodash");

exports.getUser = async (req, res, next) => 
{
    res.status(200).send(await userService.getUser(req.userID));
}

exports.getUserWithAdditionalAttributes = async (req, res, next ) =>{
    const userID = JSON.parse(req.params.userID);
    console.log("user a headerből: ", userID)
    const role = await userRepository.getUserByID(userID)
    console.log("nagyjából ", role)
    const truerole = role.role
    console.log("pontosan ",truerole)
    const finalUser = {
        userSide: userID,
        userRole: truerole,
        roleSide: await userService.getUserWithAdditionalAttributes(role.ID,truerole)
    }
    console.log("ez lett: ", finalUser)
    console.log("KAKAÁSS A GAYTYA : ",finalUser.userRole)
    res.status(201).json(finalUser)
}

exports.createUser = async (req, res, next) =>
{
    const { ID, name, password } = req.body;

    const newUser =
    {
        ID: ID,
        name: name,
        password: await bcrypt.hash(password, salt),
    }

    const result = await userService.createUser(newUser);

    if(result)
    {
        res.status(201).json(result);
    }
    else
    {
        res.status(400).send("Fail");
    }
}

exports.loginUser = async (req, res, next) =>
{
    console.log("LOGIN KÉRELEM")
    const { username, password } = req.body;

    if(username == undefined || password == undefined)
    {
        res.status(400).send("Nincs megadva az egyik paraméter!");
        return
    }
    //console.log(password);
    
    const user = await userService.getUser(username);
    //console.log(user)

    if(user == undefined)
    {
        res.status(404).send("Nincs ilyen felhasználó!");
        return
    }

    let userData = null;
    if(user.role=="szulo")
    {
        const role = await roleService.getRole(user.ID,user.role)
        userData = {
            ID:user.ID,
            username:user.username,
            role:user.role,
            children: await userService.getGuardiansChildren(role.ID)
        }
    }
    else
    {
        userData = {
            ID:user.ID,
            username:user.username,
            role:user.role
        }
    }

    if(await bcrypt.compare(password, user.password))
    {
        const token = jwt.sign({ userData }, process.env.JWT_KEY, { expiresIn: "20m" });

        res.status(200).json(token);
    }
    else
    {
        res.status(401).send("Helytelen jelszó!");
    }
}

exports.getGuardiansChildren = async (req, res, next) =>{
    const children = await userService.getGuardiansChildren(req.role.ID);
    res.status(200).send(children);
}

