import { db } from '../database/database.connection.js';
import { nanoid } from 'nanoid';

export async function shorten(req, res) {
    const {url} = req.body;
    const userId = res.locals.session.rows[0].userId;
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