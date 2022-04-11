console.log('connected');
const menuBtn = document.querySelector('i');
const container = document.getElementsByClassName('chat__main')
const sidebar = document.getElementsByClassName('chat__sidebar')

var sideBarOpen = false

menuBtn.addEventListener('click', (e) => {
    container[0].style.setProperty("--selection-background", "block");
    e.stopPropagation()
    sidebar[0].style.left = '0'
    sidebar[0].style.boxShadow = 'rgb(0 0 0 / 50%) 0px 7px 29px 0px'
    sideBarOpen = true
})
container[0].addEventListener('click', () => {
    if (sideBarOpen) {
        sidebar[0].style.left = '-225px'
        sidebar[0].style.boxShadow = 'none'
        container[0].style.setProperty("--selection-background", "none");
        sideBarOpen = false
    }
})