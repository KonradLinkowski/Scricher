const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));

router.get('/', (req, res) => {
    res.redirect('https://github.com/Kon1997/Scricher');
});

module.exports = router;