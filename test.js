import { server } from './index.js';
import { use, expect } from 'chai'
import chaiHttp from 'chai-http'
const chai = use(chaiHttp)


describe('API Tests', () => {
    let token;

    it('should add a new user', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({ user_id: '1', login: 'testuser', password: 'testpass' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should authenticate user and return a token', (done) => {
        chai.request(server)
            .post('/api/authenticate')
            .send({ login: 'testuser', password: 'testpass' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                token = res.body.token;
                done();
            });
    });

    it('should create a new article', (done) => {
        chai.request(server)
            .post('/api/articles')
            .set('authenticator-header', token)
            .send({ article_id: '1', title: 'Test Article', content: 'Content', visibility: 'public' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should get public articles without authentication', (done) => {
        chai.request(server)
            .get('/api/articles')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should logout user', (done) => {
        chai.request(server)
            .post('/api/logout')
            .set('authenticator-header', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should not authenticate with invalid token', (done) => {
        chai.request(server)
            .post('/api/articles')
            .set('authenticator-header', 'invalidtoken')
            .send({ article_id: '2', title: 'Another Article', content: 'Content', visibility: 'public' })
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });
});

after(() => {
    server.close();
});
