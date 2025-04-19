const JWT = require('jsonwebtoken');

const  secret = "SuperMan@123";


// take user object and create a token for the user
function createTokenForUser(user){
    const payload = {
        id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role : user.role,
    };
    const token  = JWT.sign(payload, secret);
    return token;
}

// verify the token and return the user object
function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
};

module.exports = {
    createTokenForUser,
    validateToken,
};