import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('BlogForm component', () => {
  const buttonLabelNew = 'new blog'
  const buttonLabelCreate = 'Create'

  const mockCreateBlog = vi.fn()

  const user = userEvent.setup()

  test('Calls onCreateBlog with correct arguments', async () => {
    render(<BlogForm onCreateBlog={mockCreateBlog} />)

    await user.click(screen.getByText(buttonLabelNew))

    const inputs = screen.getAllByRole('textbox')
    const titleInput = inputs[0]
    const authorInput = inputs[1]
    const urlInput = inputs[2]
    const likesInput = inputs[3]

    await user.type(
      titleInput,
      'Component testing is done with react-testing-library'
    )
    await user.type(authorInput, 'John Doe')
    await user.type(urlInput, 'http://example.com')
    await user.type(likesInput, '5')

    await user.click(screen.getByText(buttonLabelCreate))

    // expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Component testing is done with react-testing-library',
      author: 'John Doe',
      url: 'http://example.com',
      likes: '5',
    })

    screen.debug()
  })
})
