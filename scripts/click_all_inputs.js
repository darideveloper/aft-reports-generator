(() => {
  // 1. Find all radio inputs
  const radios = Array.from(document.querySelectorAll('input[type="radio"]'))
  let clickedCount = 0

  console.log(`Found ${radios.length} radio buttons. Processing...`)

  radios.forEach(radio => {
    // 2. Check for visibility using dimensions or checkVisibility API
    const isVisible = radio.checkVisibility
      ? radio.checkVisibility()
      : (radio.offsetWidth > 0 || radio.offsetHeight > 0 || radio.getClientRects().length > 0)

    if (isVisible) {
      // Optional: Scroling to element ensures some 'lazy' handlers fire, 
      // but usually .click() is enough.
      // radio.scrollIntoView({ block: 'center' }); 

      radio.click()
      clickedCount++
    }
  })

  console.log(`Clicked ${clickedCount} visible radio buttons.`)

  // 3. Go down (Scroll to bottom)
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
})()