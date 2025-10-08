import { render, screen } from '@testing-library/react'
import Togglable from './Togglable'
import i18n from '../i18n'
import userEvent from '@testing-library/user-event'

describe('Togglable component', () => {
  const buttonLabel = 'show'
  const user = userEvent.setup()

  beforeEach(() => {
    render(
      <Togglable buttonLabel={buttonLabel}>
        <div>toggled content</div>
      </Togglable>
    )
  })

  test('renders its children', () => {
    screen.getByText('toggled content')
    screen.debug()
  })

  test('style at start', () => {
    const el = screen.getByText('toggled content')

    expect(el.parentNode).toHaveStyle('display: none')
  })

  test('Clicking the button toggles the content', async () => {
    const button = screen.getByText(buttonLabel)
    await user.click(button)

    const el = screen.getByText('toggled content')
    expect(el.parentNode).not.toHaveStyle('display: none')
  })

  test('Clicking the button hide toggles the content', async () => {
    const hideButton = screen.getByText(i18n.TOGGLABLE.HIDE_BUTTON_LABEL)
    await user.click(hideButton)

    const el = screen.getByText('toggled content')
    expect(el.parentNode).toHaveStyle('display: block')
  })
})
