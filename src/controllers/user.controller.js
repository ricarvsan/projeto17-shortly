import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import { db } from '../database/database.connection.js';

export async function signup(req, res) {
    const {name, email, password, confirmPassword} = req.body;

    if(password !== confirmPassword) return res.status(422).send({message: 'Os passwords não são iguais!'})

    try {
        //const emailInUse = await db.collection('users').findOne({email});
        const emailInUse = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if(emailInUse.rowCount) return res.status(409).send({message: 'Já existe um usuário com este email cadastrado!'})


        const hash = bcrypt.hashSync(password, 10)
        //await db.collection('users').insertOne({name, email, password: hash})
        await db.query(`
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3);
        `, [name, email, hash]);

        res.status(201).send('Usuário criado com sucesso!')
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function signin(req, res) {
    const {email, password} = req.body;

    try {
        //const user = await db.collection('users').findOne({email});
        const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if(!(user.rowCount)) return res.status(401).send({message: 'Usuário não encontrado!'});
        
        const correctPassword = bcrypt.compareSync(password, user.rows[0].password);
        if(!correctPassword) return res.status(401).send({message: 'Senha incorreta!'});

        const token = uuid();

        //await db.collection('session').deleteMany({userId: user._id});
        await db.query(`DELETE FROM session WHERE "userId" = $1`, [user.rows[0].id])
        
        //await db.collection('session').insertOne({token, userId: user._id});
        await db.query(`INSERT INTO session ("userId", token) VALUES ($1, $2)`, [user.rows[0].id, token])

        res.status(200).send({token})
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function logout(req, res) {
    const {token} = res.locals.session;

    try {
        await db.collection('session').deleteOne({token});
        res.status(200).send('Usuário deslogado com sucesso!')

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function logged(req, res) {
    const {token} = res.locals.session;

    try {
        const logged = await db.collection('session').findOne({token});
        if(!logged) res.status(401).send('Usuário não logado!')
        res.status(200).send('Usuário está logado!')

    } catch (err) {
        res.status(500).send(err.message)
    }
}