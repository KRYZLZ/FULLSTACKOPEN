import { forwardRef, useImperativeHandle, useState } from 'react'
import Proptypes from 'prop-types'
import i18n from '../i18n'

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
    <div>
      <div style={hideWhenVisible}>
        {text && <span style={{ marginRight: '0.5rem' }}>{text}</span>}
        <button onClick={() => toggleVisibility()}>{buttonLabel}</button>
      </div>

      <div style={showWhenVisible}>
        {text && <span style={{ marginRight: '0.5rem' }}>{text}</span>}
        <button onClick={() => toggleVisibility()}>
          {i18n.TOGGLABLE.HIDE_BUTTON_LABEL}
        </button>
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
