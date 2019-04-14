window.addEventListener('load', function () {
    const uploadEle = document.querySelector('.file_upload') // 元素别名
    const backEle = document.querySelector('.img_back') // 背景
    const realEle = document.querySelector('.img_real') // 选择框

    function putImgOnBack(e) {
        if (!e.target.files || !e.target.files.length) {
            return console.log('没有文件')
        }
        const file = e.target.files[0]
        fileToBase64(file)
            .then(ret => {
                backEle.src = ret
                realEle.src = ret
                realEle.onload = function () {
                    const length = getMin(realEle.width, realEle.height)
                    changeClip(realEle, 0, 0, length, length)
                }
            })
    }

    function getMin(a, b) {
        return a < b ? a : b
    }

    function changeClip(dom, left, top, width, height) {
        dom.style.clip = `rect(${+top}px,${+left + width}px,${+top + height}px,${+left}px)`
    }

    function getClip(dom) {
        const str = dom.style.clip.match(/\((.+)\)/)[1]
        const arr = str.split(',')
        return {
            top: +arr[0].replace(/[px ]/g, ''),
            width: +arr[1].replace(/[px ]/g, '') - arr[3].replace(/[px ]/g, ''),
            height: +arr[2].replace(/[px ]/g, '') - arr[0].replace(/[px ]/g, ''),
            left: +arr[3].replace(/[px ]/g, '')
        }
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

    let status = false
    uploadEle.addEventListener('change', putImgOnBack)
    realEle.addEventListener('mousedown', function (e) {
        status = true
    })
    realEle.addEventListener('mousemove', function (e) {
        if (!status) {
            return
        }
        time = false
        const clip = getClip(realEle)
        changeClip(realEle, +clip.left + e.movementX, +clip.top + e.movementY, clip.width, clip.height)
    })
    realEle.addEventListener('mouseup', function () {
        status = false
    })
})

