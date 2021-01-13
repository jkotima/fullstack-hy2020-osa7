import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog, user, likeBlogMockHandler, removeBlogMockHandler, component

  beforeEach(() => {
    blog = {
      title: 'Test title',
      author: 'Test author',
      url: 'Test url',
      likes: '12345',
      user: {
        username: 'Test user'
      }
    }
    user = {
      username: 'Test user'
    }

    likeBlogMockHandler = jest.fn()
    removeBlogMockHandler = jest.fn()

    component = render(
      <Blog blog={blog} likeBlog={likeBlogMockHandler} removeBlog={removeBlogMockHandler} user={user} />
    )
  })

  test('renders blog title and author on default (without showing url and likes)', () => {
    expect(component.container).toHaveTextContent('Test title')
    expect(component.container).toHaveTextContent('Test author')

    const divWithUrl = component.getByText('Test url', { exact: false })
    const divWithLikes = component.getByText('12345', { exact: false })

    expect(divWithUrl).toHaveStyle('display: none')
    expect(divWithLikes).toHaveStyle('display: none')

  })

  test('after clicking view-button, url and likes are visible', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const divWithUrl = component.getByText('Test url', { exact: false })
    const divWithLikes = component.getByText('12345', { exact: false })

    expect(divWithUrl).not.toHaveStyle('display: none')
    expect(divWithLikes).not.toHaveStyle('display: none')
  })

  test('after clicking like-button twice, its event handler function is also called twice', () => {
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(likeBlogMockHandler.mock.calls).toHaveLength(2)
  })

})