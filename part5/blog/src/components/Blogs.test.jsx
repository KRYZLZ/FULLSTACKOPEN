import { render, screen } from '@testing-library/react'
import Blogs from './Blogs'
import userEvent from '@testing-library/user-event'

describe('Blogs component', () => {
  const buttonLabel = 'view'
  const mockBlogs = {
    id: '1',
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5,
  }

  const mockProps = {
    blogs: [mockBlogs],
    onDeleteBlog: vi.fn(),
    onLikeBlog: vi.fn(),
  }

  const user = userEvent.setup()

  test('renders blog initial content', () => {
    render(<Blogs {...mockProps} />)

    expect(
      screen.getAllByText(
        'Component testing is done with react-testing-library'
      )
    ).toHaveLength(2)
    expect(screen.queryByText('John Doe')).not.toBeVisible()
    expect(screen.queryByText('http://example.com')).not.toBeVisible()
    expect(screen.queryByText(/likes.*5/)).not.toBeVisible()

    screen.debug()
  })

  test('renders blog detailed content after clicking the button', async () => {
    render(<Blogs {...mockProps} />)

    const hideButton = screen.getByText(buttonLabel)
    await user.click(hideButton)

    expect(
      screen.getAllByText(
        'Component testing is done with react-testing-library'
      )
    ).toHaveLength(2)
    expect(screen.queryByText('John Doe')).toBeVisible()
    expect(screen.queryByText('http://example.com')).toBeVisible()
    expect(screen.queryByText(/likes.*5/)).toBeVisible()
  })

  test('clicking the button like', async () => {
    render(<Blogs {...mockProps} />)

    const viewButton = screen.getByText(buttonLabel)
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockProps.onLikeBlog).toHaveBeenCalledTimes(2)
  })

  test('clicking the button delete', async () => {
    render(<Blogs {...mockProps} />)

    const viewButton = screen.getByText(buttonLabel)
    await user.click(viewButton)

    const deleteButton = screen.getByText('delete')
    await user.click(deleteButton)

    expect(mockProps.onDeleteBlog).toHaveBeenCalledTimes(1)
  })
})
