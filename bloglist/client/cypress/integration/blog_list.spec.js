describe('Blog list', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Test name',
      username: 'Testusername',
      password: 'Testpassword'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is visible after clicking login-button', function () {
    cy.contains('login').click()
    cy.contains('username').should('be.visible')
    cy.contains('password').should('be.visible')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('Testusername')
      cy.get('#password').type('Testpassword')
      cy.get('#login-button').click()
      cy.contains('Test name logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('jaaboldi')
      cy.get('#password').type('kuuboldi')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
      cy.get('.error').should('contain', 'wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'Testusername', password: 'Testpassword' })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('Test title')
      cy.get('#author').type('Test author')
      cy.get('#url').type('test.url')
      cy.get('#create-blog-button').click()
      cy.get('.notification').should('contain', 'added')
      cy.contains('Test title')
      cy.contains('Test author')
    })

    it('A blog can be liked', function () {
      cy.createBlog({ title: 'Blog to be liked', author: 'Test author', url: 'test.url', likes: 0 })
      cy.contains('Blog to be liked').parent().as('divOfTheBlog')
      cy.get('@divOfTheBlog').contains('view').click()
      cy.get('@divOfTheBlog').find('#like-button').click()
      cy.get('@divOfTheBlog').should('contain', 'likes 1')
    })

    it('A blog can be removed by its creator', function () {
      cy.createBlog({ title: 'Blog to be removed', author: 'Test author', url: 'test.url', likes: 0 })
      cy.contains('Blog to be removed').parent().as('divOfTheBlog')
      cy.get('@divOfTheBlog').contains('view').click()
      cy.get('@divOfTheBlog').find('#remove-button').click()

      cy.get('html').should('not.contain', 'Blog to be removed')
    })

    it('Remove-button can only be seen by blogs creator', function () {
      cy.createBlog({ title: 'Blog not to be removed', author: 'Test author', url: 'test.url', likes: 0 })

      const secondUser = {
        name: 'Second testname',
        username: 'secondTestname',
        password: 'secondTestpassword'
      }
      cy.request('POST', 'http://localhost:3001/api/users/', secondUser)
      cy.visit('http://localhost:3000')

      cy.login({ username: 'secondTestname', password: 'secondTestpassword' })

      cy.contains('Blog not to be removed').parent().as('divOfTheBlog')
      cy.get('@divOfTheBlog').contains('view').click()
      cy.get('@divOfTheBlog').find('#remove-button').should('not.be.visible')
    })

    it('Blogs are arranged from highest to lowest in number of likes', function () {
      cy.createBlog({ title: 'One like', author: 'Test author', url: 'test.url', likes: 1 })
      cy.createBlog({ title: 'Three likes', author: 'Test author', url: 'test.url', likes: 3 })
      cy.createBlog({ title: 'Two likes', author: 'Test author', url: 'test.url', likes: 2 })

      cy.get('#blog')
        .first().should('contain', 'likes 3')
        .next().should('contain', 'likes 2')
        .next().should('contain', 'likes 1')
    })
  })
})