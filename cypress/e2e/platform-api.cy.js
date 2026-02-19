// Platform API — CRUD Tests (Lab 5)
// These 8 tests verify basic blog post CRUD operations.

let postId;

describe('Platform API — CRUD', () => {
  it('GET /api returns a welcome message', () => {
    cy.request('GET', '/api').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.be.a('string');
    });
  });

  it('POST /api/posts creates a new post', () => {
    cy.request('POST', '/api/posts', {
      title: 'first post',
      tags: 'test',
      content: 'this is a test post',
      coverUrl: 'https://media.giphy.com/media/uscuTAPrWqmqI/giphy.gif',
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('id');
      expect(res.body.title).to.eq('first post');
      postId = res.body.id;
    });
  });

  it('GET /api/posts returns an array including the created post', () => {
    cy.request('GET', '/api/posts').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      const titles = res.body.map((p) => p.title);
      expect(titles).to.include('first post');
    });
  });

  it('GET /api/posts/:id returns the full post with content', () => {
    cy.request('GET', `/api/posts/${postId}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.title).to.eq('first post');
      expect(res.body.content).to.eq('this is a test post');
    });
  });

  it('PUT /api/posts/:id updates the post title', () => {
    cy.request('PUT', `/api/posts/${postId}`, {
      title: 'updated post',
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.title).to.eq('updated post');
    });
  });

  it('DELETE /api/posts/:id removes the post', () => {
    cy.request('DELETE', `/api/posts/${postId}`).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('GET /api/posts/:id for a deleted post returns 404', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `/api/posts/${postId}`,
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });

  it('GET /api/posts/nonexistent returns 404', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: '/api/posts/nonexistent',
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });
});
