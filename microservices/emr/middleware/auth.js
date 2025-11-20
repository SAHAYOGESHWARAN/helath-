const protect = (roles) => {
    return (req, res, next) => {
        console.log('Protect middleware called for roles:', roles);
        next();
    };
};

module.exports = { protect };
