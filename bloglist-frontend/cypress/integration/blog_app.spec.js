describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Tom',
      username: 'root2',
      password: 'pword'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log into application')
  })
  describe('Login',function() {
    it('fails with wrong credentials', function() {
      cy.get('#username').type('root2')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Tom logged in')
    })

    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root2')
      cy.get('#password').type('pword')
      cy.get('#login-button').click()

      cy.contains('Tom logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'root2', password: 'pword'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('a new blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Cypress testing')
      cy.get('#author').type('tester')
      cy.get('#url').type('www.google.com')
      cy.get('#submitBlog').click()
      cy.contains('Cypress testing')
    })

    it('a blog can be liked', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Cypress testing')
      cy.get('#author').type('tester')
      cy.get('#url').type('www.google.com')
      cy.get('#submitBlog').click()
      cy.contains('Cypress testing')
      cy.contains('view').click()
      cy.get('#likeButton').click()
      cy.contains('likes: 1')
    })

    it('a blog can be removed', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Cypress testing')
      cy.get('#author').type('tester')
      cy.get('#url').type('www.google.com')
      cy.get('#submitBlog').click()
      cy.contains('Cypress testing')
      cy.contains('view').click()
      cy.get('#removeButton').click()
      cy.get('html').should('not.contain', '#likeButton')
      cy.get('html').should('not.contain', '#removeButton')
    })
  })
})