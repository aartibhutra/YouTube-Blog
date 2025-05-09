const { createHmac , randomBytes } = require('crypto');
const { Schema , model} = require('mongoose');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL:{
        type: String,
        default: "/images/default.png",
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER',
    },
}, {
    timestamps: true
});

userSchema.pre("save", function (next){
    const user = this;

    if(!user.isModified("password")) return;
    
    // salt is a random string used to make the password more secure
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");
    this.password = hashedPassword;
    this.salt = salt;

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function(email , password){
    const user = await this.findOne({email});

    if(!user) throw new Error("User not found");
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if(userProvidedPassword !== hashedPassword) throw new Error("Invalid password");

    const token = createTokenForUser(user);
    return token;
});

const User = model('user', userSchema);

module.exports = User;