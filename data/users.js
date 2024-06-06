import bcrypt from "bcryptjs";

const users = [
  {
    firstName: "Deji",
    lastName: "Fowowe",
    email: "admin@dejifowowe.com",
    tel: '07587262933',
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    firstName: "Taiwo",
    lastName: "User",
    email: "user@dejifowowe.com",
    tel: "07771230606",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;