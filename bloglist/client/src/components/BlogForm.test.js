import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<NoteForm /> calls the callback function the right way when a blog is created', () => {
  const createBlog = jest.fn()
  const component = render(
    <BlogForm createBlog={createBlog} />
  )
  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const submitButton = component.getByText('create')

  fireEvent.change(title, {
    target: { value: 'Test title' }
  })
  fireEvent.change(author, {
    target: { value: 'Test author' }
  })
  fireEvent.change(url, {
    target: { value: 'Test url' }
  })
  fireEvent.click(submitButton)

  expect(createBlog.mock.calls[0][0].title).toBe('Test title' )
  expect(createBlog.mock.calls[0][0].author).toBe('Test author' )
  expect(createBlog.mock.calls[0][0].url).toBe('Test url' )
})