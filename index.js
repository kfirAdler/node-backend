import express from 'express';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';

const app = express();
const PORT = 3000;

app.use(express.json());

let users = [];
let tokens = [];
let articles = [];


const findUserByLogin = (login) => {
    return users.find(user => user.login === login);
};

const findUserByToken = (token) => {
    return tokens.find(t => t.token === token && !t.loggedOut);
};

const findArticlesByVisibility = (visibility, userId) => {
    if (visibility === 'public') {
        return articles.filter(article => article.visibility === 'public');
    } else if (visibility === 'logged_in') {
        return articles.filter(article =>
            article.visibility === 'logged_in' || article.userId === userId
        );
    } else {
        return articles.filter(article => article.userId === userId);
    }
};


app.post('/api/user', (req, res) => {
    const { user_id, login, password } = req.body;

    if (!user_id || !login || !password) {
        return res.status(400).send();
    }

    if (findUserByLogin(login)) {
        return res.status(409).send();
    }

    users.push({ user_id, login, password });

    res.status(201).send();
});

app.post('/api/authenticate', (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).send();
    }

    const user = findUserByLogin(login);

    if (!user) {
        return res.status(404).send();
    }

    if (user.password !== password) {
        return res.status(401).send();
    }

    const token = uuid();
    tokens.push({ token, userId: user.user_id, loggedOut: false });

    res.status(200).json({ token });
});

app.post('/api/logout', (req, res) => {
    const token = req.headers['authenticator-header'];

    const tokenIndex = tokens.findIndex(t => t.token === token && !t.loggedOut);

    if (tokenIndex === -1) {
        return res.status(401).send();
    }

    tokens[tokenIndex].loggedOut = true;

    res.status(200).send();
});

app.post('/api/articles', (req, res) => {
    const { article_id, title, content, visibility } = req.body;
    const token = req.headers['authenticator-header'];

    if (!article_id || !title || !content || !visibility) {
        return res.status(400).send();
    }

    const tokenInfo = findUserByToken(token);

    if (!tokenInfo) {
        return res.status(401).send();
    }

    articles.push({ article_id, title, content, visibility, userId: tokenInfo.userId });

    res.status(201).send();
});

app.get('/api/articles', (req, res) => {
    const token = req.headers['authenticator-header'];

    const tokenInfo = findUserByToken(token);

    if (!tokenInfo) {
        const publicArticles = articles.filter(article => article.visibility === 'public');
        return res.status(200).json(publicArticles);
    }

    const userId = tokenInfo.userId;
    const userArticles = findArticlesByVisibility('private', userId);
    const loggedInArticles = findArticlesByVisibility('logged_in', userId);
    const publicArticles = articles.filter(article => article.visibility === 'public');

    const result = _.union(userArticles, loggedInArticles, publicArticles);

    res.status(200).json(result);
});

export const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});