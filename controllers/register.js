const handleRegister = (db, bcrypt) => (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    var hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx('login')
            .returning('email')
            .insert({
                hash: hash,
                email: email
            })
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Unable to register'));
}

module.exports = {
    handleRegister: handleRegister
}