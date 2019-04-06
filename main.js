window.addEventListener('load', function () {
    const uploadEle = document.querySelector('.file_upload') // 元素别名
    const backEle = document.querySelector('.img_back')
    const realEle = document.querySelector('.img_real')

    function putImgOnBack(e) {
        if (!e.target.files || !e.target.files.length) {
            return console.log('没有文件')
        }
        const file = e.target.files[0]
        fileToBase64(file)
            .then(ret => {
                backEle.src = ret
                backEle.onload = function () {
                    realEle.style.backgroundImage = `url('${ret}')`
                    realEle.style.backgroundSize = `${backEle.width}px ${backEle.height}px`
                    realEle.style.width = (backEle.width < backEle.height ? backEle.width : backEle.height) + 'px'
                    realEle.style.height = (backEle.width < backEle.height ? backEle.width : backEle.height) + 'px'
                }
            })
    }

    function fileToBase64(file) {
        return new Promise(resolve => {
            const fr = new FileReader()
            fr.onload = function () {
                resolve(fr.result)
            }
            fr.readAsDataURL(file)
        })
    }

    // 获取元素相对于屏幕左边的距离 offsetLeft，offsetTop
    function getPosition(node) {
        let left = node.offsetLeft;
        let top = node.offsetTop;
        let parent = node.offsetParent;
        while (parent != null) {
            left += parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return { "left": left, "top": top };
    }

    let xInit = 0
    let yInit = 0
    let status = false
    let time = false
    uploadEle.addEventListener('change', putImgOnBack)
    realEle.addEventListener('mousedown', function (e) {
        status = true
        xInit = getPosition(e.target).left
        yInit = getPosition(e.target).top
        console.log(e)
    })
    realEle.addEventListener('mousemove', function (e) {
        if (!status) {
            return
        }
        if (!time) {
            time = true
            setTimeout(() => {
                time = false
                const offX = xInit - e.x
                const offY = yInit - e.y
                Object.assign(realEle.style, {
                    left: -offX + 'px',
                    top: -offY + 'px',
                    backgroundPosition: `${offX}px ${offY}px`,
                })
            }, 20)
        }

    })
    realEle.addEventListener('mouseup', function () {
        status = false
    })
})

