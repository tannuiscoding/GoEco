document.addEventListener("DOMContentLoaded", () => {
    // Create mobile menu elements
    const header = document.querySelector("header")
    const mobileMenuBtn = document.createElement("button")
    mobileMenuBtn.className = "mobile-menu-btn"
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
  
    const mobileMenu = document.createElement("div")
    mobileMenu.className = "mobile-menu"
  
    const closeMenuBtn = document.createElement("button")
    closeMenuBtn.className = "close-menu"
    closeMenuBtn.innerHTML = '<i class="fas fa-times"></i>'
  
    // Clone the navigation for mobile menu
    const navClone = document.querySelector("nav ul").cloneNode(true)
  
    // Add CTA button to mobile menu if it exists
    const ctaButton = document.querySelector(".cta-button")
    let ctaClone = null
    if (ctaButton) {
      ctaClone = ctaButton.cloneNode(true)
    }
  
    // Append elements to mobile menu
    mobileMenu.appendChild(closeMenuBtn)
    mobileMenu.appendChild(navClone)
    if (ctaClone) {
      mobileMenu.appendChild(ctaClone)
    }
  
    // Add mobile menu to the document
    document.body.appendChild(mobileMenu)
  
    // Add mobile menu button to header
    const headerContainer = header.querySelector(".container")
    headerContainer.appendChild(mobileMenuBtn)
  
    // Toggle mobile menu
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.add("active")
      document.body.style.overflow = "hidden" // Prevent scrolling when menu is open
    })
  
    closeMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("active")
      document.body.style.overflow = "" // Restore scrolling
    })
  
    // Close menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll("a")
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active")
        document.body.style.overflow = "" // Restore scrolling
      })
    })
  
    // Close menu on window resize (if screen becomes large enough)
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        mobileMenu.classList.remove("active")
        document.body.style.overflow = "" // Restore scrolling
      }
    })
  
    // Handle touch events for mobile devices
    let touchStartY = 0
  
    document.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY
      },
      false,
    )
  
    document.addEventListener(
      "touchmove",
      (e) => {
        if (!mobileMenu.classList.contains("active")) return
  
        const touchY = e.touches[0].clientY
        const diff = touchStartY - touchY
  
        // If swiping down, close the menu
        if (diff < -50) {
          mobileMenu.classList.remove("active")
          document.body.style.overflow = ""
        }
      },
      false,
    )
  
    // Enhance form responsiveness for touch devices
    const formControls = document.querySelectorAll(".form-control")
    if (formControls) {
      formControls.forEach((control) => {
        control.addEventListener("focus", function () {
          this.style.fontSize = "16px" // Prevent iOS zoom on input focus
        })
      })
    }
  })
  
  