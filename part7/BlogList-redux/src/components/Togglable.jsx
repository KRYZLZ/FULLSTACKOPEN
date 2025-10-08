import { forwardRef, useImperativeHandle, useState } from 'react'
import Proptypes from 'prop-types'
import i18n from '../i18n'
import { Button } from 'react-bootstrap'

const Togglable = forwardRef(({ children, buttonLabel, text = '' }, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div className='mb-3'>
      <div style={hideWhenVisible}>
        {text && <span style={{ marginRight: '0.5rem' }}>{text}</span>}
        <Button variant='primary' onClick={() => toggleVisibility()}>
          {buttonLabel}
        </Button>
      </div>

      <div style={showWhenVisible}>
        {text && <span style={{ marginRight: '0.5rem' }}>{text}</span>}
        <Button variant='secondary' onClick={() => toggleVisibility()}>
          {i18n.TOGGLABLE.HIDE_BUTTON_LABEL}
        </Button>
        {children}
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: Proptypes.string.isRequired,
  children: Proptypes.node.isRequired,
  text: Proptypes.string,
}

export default Togglable
