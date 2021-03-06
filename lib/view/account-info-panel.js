const gui = require('gui')

const accountManager = require('../controller/account-manager')

const ACCOUNT_NAME_COLOR = '#FFFFFF'
const HOVER_BACKGROUND = '#2B2E3B'
const PADDING = 5

class AccountInfoPanel {
  constructor(account) {
    this.account = null

    const defaultFontName = gui.Font.default().getName()
    this.font = gui.Font.create(defaultFontName, 25, 'semi-bold', 'normal')
    this.hover = false

    // Toggle the menu when clicking on the panel.
    this.canShowMenu = false

    this.menu = gui.Menu.create([
      { label: 'Logout', onClick: this.logout.bind(this) },
    ])

    this.view = gui.Container.create()
    this.view.setStyle({
      width: '100%',
      height: 40,
    })
    this.view.onDraw = this.draw.bind(this)
    this.view.onMouseEnter = () => {
      this.hover = true
      this.canShowMenu = true
      this.view.schedulePaint()
    }
    this.view.onMouseLeave = () => {
      this.hover = false
      this.canShowMenu = true
      this.view.schedulePaint()
    }
    this.view.onMouseUp = () => {
      if (!this.hover)
        return
      if (!this.canShowMenu) {
        this.canShowMenu = true
        return
      }
      this.canShowMenu = false
      this.menu.popup()
    }
  }

  loadAccount(account) {
    this.account = account
    this.view.schedulePaint()
  }

  logout() {
    accountManager.removeAccount(this.account)
  }

  draw(view, painter, dirty) {
    if (!this.account)
      return
    const bounds = Object.assign(view.getBounds(), {x: 0, y: 0})
    if (this.hover) {
      painter.setFillColor(HOVER_BACKGROUND)
      painter.fillRect(bounds)
    }
    const attributes = { font: this.font, color: ACCOUNT_NAME_COLOR }
    bounds.x = PADDING
    bounds.height -= PADDING
    painter.drawText(this.account.name, bounds, attributes)
  }
}

module.exports = AccountInfoPanel
