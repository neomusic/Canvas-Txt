var canvasTxt = {
  debug: false,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: 14,
  font: 'Arial',
  lineHeight: null,
  drawText: function(ctx, mytext, x, y, width, height) {
    // Parse all to integers
    ;[x, y, width, height] = [x, y, width, height].map(el => parseInt(el))

    // End points
    const xEnd = x + width
    const yEnd = y + height

    if (this.textSize) {
      console.error(
        '%cCanvas-Txt:',
        'font-weight: bold;',
        'textSize is depricated and has been renamed to fontSize'
      )
    }

    const style = this.fontSize + 'px ' + this.font
    ctx.font = style

    let txtY = y + height / 2 + parseInt(this.fontSize) / 2

    let textanchor

    if (this.align === 'right') {
      textanchor = xEnd
      ctx.textAlign = 'right'
    } else if (this.align === 'left') {
      textanchor = x
      ctx.textAlign = 'left'
    } else {
      textanchor = x + width / 2
      ctx.textAlign = 'center'
    }

    //added one-line only auto linebreak feature
    let textarray = []
    let temptextarray = mytext.split('\n')

    temptextarray.forEach(txtt => {
      let textwidth = ctx.measureText(txtt).width
      if (textwidth <= width) {
        textarray.push(txtt)
      } else {
        let temptext = txtt
        let linelen = width
        let textlen
        let textpixlen
        let texttoprint
        textwidth = ctx.measureText(temptext).width
        while (textwidth > linelen) {
          textlen = 0
          textpixlen = 0
          texttoprint = ''
          while (textpixlen < linelen) {
            textlen++
            texttoprint = temptext.substr(0, textlen)
            textpixlen = ctx.measureText(temptext.substr(0, textlen)).width
          }
          //if statement ensures a new line only happens at a space, and not amidst a word
          const backup = textlen
          if (temptext.substr(textlen, 1) != ' ') {
            while (temptext.substr(textlen, 1) != ' ' && textlen != 0) {
              textlen--
            }
            if (textlen == 0) {
              textlen = backup
            }
            texttoprint = temptext.substr(0, textlen)
          }

          temptext = temptext.substr(textlen)
          textwidth = ctx.measureText(temptext).width
          textarray.push(texttoprint)
        }
        if (textwidth > 0) {
          textarray.push(temptext)
        }
      }
      // end foreach temptextarray
    })
    const charHeight = this.lineHeight
      ? this.lineHeight
      : this.getTextHeight(mytext, this.font, this.fontSize) //close approximation of height with width
    const vheight = charHeight * (textarray.length - 1)
    const negoffset = vheight / 2

    let debugY = y
    // Vertical Align
    if (this.verticalAlign === 'top') {
      txtY = y + this.fontSize
    } else if (this.verticalAlign === 'bottom') {
      txtY = yEnd - vheight
      debugY = yEnd
    } else {
      //defaults to center
      debugY = y + height / 2
      txtY -= negoffset
    }
    //print all lines of text
    textarray.forEach(txtline => {
      ctx.fillText(txtline, textanchor, txtY)
      txtY += charHeight
    })

    if (this.debug) {
      // Text box
      ctx.lineWidth = 3
      ctx.strokeStyle = '#00909e'
      ctx.strokeRect(x, y, width, height)

      ctx.lineWidth = 2
      // Horizontal Center
      ctx.strokeStyle = '#f6d743'
      ctx.beginPath()
      ctx.moveTo(textanchor, y)
      ctx.lineTo(textanchor, yEnd)
      ctx.stroke()
      // Vertical Center
      ctx.strokeStyle = '#ff6363'
      ctx.beginPath()
      ctx.moveTo(x, debugY)
      ctx.lineTo(xEnd, debugY)
      ctx.stroke()
    }
  },
  // Calculate Height of the font
  getTextHeight: function(txt, font, size) {
    const el = document.createElement('div')

    el.style.cssText =
      'position:fixed;padding:0;left:-9999px;top:-9999px;font:' +
      font +
      ';font-size:' +
      size +
      'px'
    el.textContent = txt

    document.body.appendChild(el)
    const height = parseInt(getComputedStyle(el).getPropertyValue('height'), 10)
    document.body.removeChild(el)

    return height
  }
}

export default canvasTxt
