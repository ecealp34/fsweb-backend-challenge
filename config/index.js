PORT = process.env.PORT || 9001
NODE_ENV = process.env.NODE_ENV || 'development'
HASH_ROUND = process.env.HASH_ROUND || 8
JWT_SECRET = process.env.JWT_SECRET || "Twitter"

module.exports = { PORT, NODE_ENV, HASH_ROUND, JWT_SECRET }