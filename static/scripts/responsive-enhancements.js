document.addEventListener("DOMContentLoaded", () => {
  // Responsive image loading
  function handleResponsiveImages() {
    const images = document.querySelectorAll("img:not(.memImg)")
    const windowWidth = window.innerWidth

    images.forEach((img) => {
      const src = img.getAttribute("src")
      if (src && src.includes("/placeholder.svg")) {
        // Adjust image dimensions based on screen size
        let newSrc = src

        if (windowWidth <= 480) {
          newSrc = src.replace(/width=\d+/, "width=300").replace(/height=\d+/, "height=200")
        } else if (windowWidth <= 768) {
          newSrc = src.replace(/width=\d+/, "width=500").replace(/height=\d+/, "height=300")
        }

        if (newSrc !== src) {
          img.setAttribute("src", newSrc)
        }
      }
    })
  }

  // Handle responsive tables if they exist
  function makeTablesResponsive() {
    const tables = document.querySelectorAll("table")
    tables.forEach((table) => {
      const wrapper = document.createElement("div")
      wrapper.style.overflowX = "auto"
      table.parentNode.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    })
  }

  // Enhance form elements for better mobile experience
  function enhanceFormElements() {
    // Make select elements more touch-friendly
    const selects = document.querySelectorAll("select")
    selects.forEach((select) => {
      select.style.paddingTop = "12px"
      select.style.paddingBottom = "12px"
      select.style.fontSize = "16px" // Prevent iOS zoom
    })

    // Enhance checkboxes for touch
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach((checkbox) => {
      checkbox.style.width = "20px"
      checkbox.style.height = "20px"
    })
  }

  // Adjust hero section height for mobile
  function adjustHeroHeight() {
    const hero = document.querySelector(".hero")
    if (hero) {
      if (window.innerWidth <= 768) {
        hero.style.height = "auto"
        hero.style.minHeight = "70vh"
        hero.style.padding = "100px 0 50px"
      } else {
        hero.style.height = "100vh"
        hero.style.padding = ""
      }
    }
  }

  // Run enhancements
  handleResponsiveImages()
  makeTablesResponsive()
  enhanceFormElements()
  adjustHeroHeight()

  // Re-run on window resize
  window.addEventListener("resize", () => {
    handleResponsiveImages()
    adjustHeroHeight()
  })

  // Enhance scrolling for touch devices
  let isScrolling
  window.addEventListener(
    "scroll",
    () => {
      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling)

      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(() => {
        // Run code after scrolling ends
        const scrollButtons = document.querySelectorAll(".nav-btn")
        scrollButtons.forEach((btn) => {
          btn.style.opacity = "1"
        })
      }, 66)

      // Hide buttons while scrolling on mobile
      if (window.innerWidth <= 768) {
        const scrollButtons = document.querySelectorAll(".nav-btn")
        scrollButtons.forEach((btn) => {
          btn.style.opacity = "0.5"
        })
      }
    },
    false,
  )
})

