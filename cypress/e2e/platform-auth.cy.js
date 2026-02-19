// Platform API — Auth Tests (Auth Lab)
// These 7 tests verify signup, signin, and auth-gated CRUD.
// NOT run by default — add this file to specPattern when you reach the auth lab.

let token;
let postId;

const getUniqueId = () => Cypress._.uniqueId(Date.now().toString());
const email = `${getUniqueId()}@test.com`;

describe('Platform API — Authentication', () => {
  it('signup with email and password returns a token', () => {
    cy.request('POST', '/api/signup', {
      email,
      password: 'password123',
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('token');
      token = res.body.token;
    });
  });

  it('duplicate signup returns 422', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: '/api/signup',
      body: { email, password: 'password123' },
    }).then((res) => {
      expect(res.status).to.eq(422);
    });
  });

  it('signin with correct credentials returns a token', () => {
    cy.request('POST', '/api/signin', {
      email,
      password: 'password123',
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('token');
      token = res.body.token;
    });
  });

  it('create post without auth token returns 401', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: '/api/posts',
      body: {
        title: 'unauthorized post',
        tags: 'test',
        content: 'should fail',
        coverUrl: 'https://media.giphy.com/media/uscuTAPrWqmqI/giphy.gif',
      },
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });

  it('create post with auth token succeeds and includes author', () => {
    cy.request({
      method: 'POST',
      url: '/api/posts',
      headers: { authorization: token },
      body: {
        title: 'authenticated post',
        tags: 'test',
        content: 'this post has an author',
        coverUrl: 'https://media.giphy.com/media/uscuTAPrWqmqI/giphy.gif',
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.author).to.not.eq(undefined);
      postId = res.body.id;
    });
  });

  it('delete post with auth token succeeds', () => {
    cy.request({
      method: 'DELETE',
      url: `/api/posts/${postId}`,
      headers: { authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('signin with wrong password returns 401', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: '/api/signin',
      body: { email, password: 'wrongpassword' },
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });
});
