
//Root page for ?Users
router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

//Page to register a new user
router.get('/register', function(req, res) {
    res.render('register', { });
});

//Handle registration of a new user
router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        //Check if ther ewas an error registering the account
        if (err) {
            return res.status(422).render('register', {info: 'That username already exists.'});
        }
        //Redirect the user to the root user page
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

//Page to login as a user
router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

//Handle users logging in to the system
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

//Handle users logging out of the system
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
