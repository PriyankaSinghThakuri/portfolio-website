/*===== THEME TOGGLE =====*/
const themeToggle = document.getElementById('theme-toggle')
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null
const storedTheme = localStorage.getItem('theme')

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon'
    }
}

if (storedTheme) {
    applyTheme(storedTheme)
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark')
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
        const next = current === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        localStorage.setItem('theme', next)
    })
}

/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId)
    const nav = document.getElementById(navId)

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle', 'nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK + HEADER SHADOW ====================*/
const sections = document.querySelectorAll('section[id]')
const header = document.getElementById('header')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 80
        const sectionId = current.getAttribute('id')
        const link = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (!link) return

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            link.classList.add('active')
        } else {
            link.classList.remove('active')
        }
    })

    if (header) {
        header.classList.toggle('l-header--scrolled', scrollY > 20)
    }
}

let scrollTicking = false
window.addEventListener('scroll', () => {
    if (scrollTicking) return
    scrollTicking = true
    requestAnimationFrame(() => {
        scrollActive()
        scrollTicking = false
    })
})

/*===== SCROLL REVEAL (IntersectionObserver) =====*/
const revealEls = document.querySelectorAll('[data-reveal]')

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible')
                observer.unobserve(entry.target)
            }
        })
    }, { threshold: 0.15 })

    revealEls.forEach(el => observer.observe(el))
} else {
    revealEls.forEach(el => el.classList.add('is-visible'))
}

/*===== FOOTER YEAR =====*/
const yearEl = document.getElementById('year')
if (yearEl) {
    yearEl.textContent = new Date().getFullYear()
}

/*===== FOLLOW CURSOR (fine-pointer devices only) =====*/
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const cursorDot = document.querySelector('.cursor-dot')
const cursorRing = document.querySelector('.cursor-ring')

if (finePointer.matches && !reduceMotionQuery.matches && cursorDot && cursorRing) {
    document.body.classList.add('has-follow-cursor')

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: pointer.x, y: pointer.y }
    const RING_EASE = 0.18

    window.addEventListener('mousemove', (e) => {
        pointer.x = e.clientX
        pointer.y = e.clientY
        cursorDot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`
        document.body.classList.add('cursor-visible')
    })

    document.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-visible')
    })

    // Short text labels: the ring morphs into a glass pill and shows the
    // hovered word itself, enlarged - a magnifying-lens read of the label
    // rather than a blob covering it.
    const TEXT_TARGETS = '.nav__link, .nav__logo, .project__title, .tag'
    // Pill/icon/card surfaces: large enough for the ring to bloom over
    // without hiding any text underneath it.
    const HOVER_TARGETS = '.button, .theme-toggle, .home__social-icon, .footer__icon, .project__link, .skills__card, .experience__card, .contact__card, .project__row, .cert__row, [data-cursor-hover]'
    const lensTextEl = cursorRing.querySelector('.cursor-lens-text')

    function setCursorMode(target) {
        const textEl = target && target.closest(TEXT_TARGETS)
        const hoverEl = !textEl && target && target.closest(HOVER_TARGETS)

        cursorRing.classList.toggle('is-lens', !!textEl)
        cursorRing.classList.toggle('is-hover', !!hoverEl)
        lensTextEl.textContent = textEl ? textEl.textContent.trim() : ''
    }

    document.addEventListener('mouseover', (e) => setCursorMode(e.target))

    document.addEventListener('mouseout', (e) => {
        const stillInsideZone = e.relatedTarget &&
            (e.relatedTarget.closest(TEXT_TARGETS) || e.relatedTarget.closest(HOVER_TARGETS))
        if (!stillInsideZone) {
            setCursorMode(null)
        }
    })

    document.addEventListener('mousedown', () => cursorRing.classList.add('is-down'))
    document.addEventListener('mouseup', () => cursorRing.classList.remove('is-down'))

    function animateRing() {
        ring.x += (pointer.x - ring.x) * RING_EASE
        ring.y += (pointer.y - ring.y) * RING_EASE
        cursorRing.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
        requestAnimationFrame(animateRing)
    }
    requestAnimationFrame(animateRing)
}
