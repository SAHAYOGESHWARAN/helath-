const { checkAuth } = require('../auth');

const protect = (roles) => {
    return checkAuth(roles);
};

module.exports = { protect };
