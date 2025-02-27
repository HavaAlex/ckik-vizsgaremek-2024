const userService = require("../services/userService");

const groupService = require("../services/groupService");

const bcrypt = require("bcrypt");

const salt = 10;

const jwt = require("jsonwebtoken");
const roleService = require("../services/roleService");

exports.getUser = async (req, res, next) => 
{
    res.status(200).send(await userService.getUser(req.userID));
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

    const userData = {
        ID:user.ID,
        username:user.username,
        role:user.role
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

exports.getTeacherGroupMembers = async (req, res, next) => 
{
    //console.log("CSOPORT")
    //console.log(req.role.ID)
    const groups = await groupService.getTeacherGroups(req.role.ID);
    //console.log(groups)
    //console.log("CSOPORT VÉG")
    const members = []
    for(const element of groups){
        //console.log(groups)
        //console.log("CSOPORTELEM KEZD")
        //console.log(element)
        //console.log(element.ID)
        //console.log("CSOPORTELEM VÉG")
        members.push({groupName:element.name,members: await roleService.getGroupMembers(element.ID)})
    }
    res.status(200).send(members);
}

exports.getGuardiansChildren = async (req, res, next) =>{
    const children = await userService.getGuardiansChildren(req.role.ID);
    res.status(200).send(children);
}