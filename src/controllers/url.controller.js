import { db } from '../database/database.connection.js';
import { nanoid } from 'nanoid';

export async function shorten(req, res) {
    const {url} = req.body;
    const shortUrl = nanoid(6);

    try {
        await db.query(`
            INSERT INTO urls (url, "shortUrl") 
            VALUES ($1, $2);
        `, [url, shortUrl]);

        const urls = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl]);

        await db.query(`
            INSERT INTO "middleUrls" ("userId", "urlsId")
            VALUES ($1, $2);
        `, [res.locals.session.rows[0].userId, urls.rows[0].id]);

        res.status(201).send({id: urls.rows[0].id, shortUrl});
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUrl(req, res) {
    const {id} = req.params;

    try {
        const url = await db.query(`SELECT * FROM urls WHERE id = $1`, [id]);

        if(!(url.rowCount)) return res.status(404).send({message: 'Url não encontrada!'});

        res.status(201).send({id: url.rows[0].id, shortUrl: url.rows[0].shortUrl, url: url.rows[0].url});
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function shortUrl(req, res) {
    const {shortUrl} = req.params;

    try {
        const url = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl]);

        if(!(url.rowCount)) return res.status(404).send({message: 'Url não encontrada!'});

        await db.query(`
            UPDATE urls SET visitants = $1 WHERE id = $2;
        `, [url.rows[0].visitants + 1, url.rows[0].id])

        res.redirect(url.rows[0].url);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteUrl(req, res) {
    const {id} = req.params;

    try {
        const url = await db.query(`SELECT * FROM "middleUrls" WHERE "urlsId" = $1`, [id]);

        if(!(url.rowCount)) return res.status(404).send({message: 'Url não encontrada!'});

        if(url.rows[0].userId !== res.locals.session.rows[0].userId) return res.status(401).send({message: 'Url não pertence ao usuário!'});
        
        await db.query(`DELETE FROM "middleUrls" WHERE "urlsId" = $1`, [id]);
        await db.query(`DELETE FROM urls WHERE id = $1`, [id]);

        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message)
    }
}