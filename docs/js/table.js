
var socket = io();
class MoveAbleProp {
    constructor(table, id, option, x, y) {
        this.optionSetting(option)
        this._id = id

        this.x = x || 0
        this.y = y || 0

        this.active = false

        this.table = table

        this.centerX = this.option.width / 2
        this.centerY = this.option.height / 2

        this.contextMenuContent = [
            {
                text: "삭제",
                color: "red",
                onClick: () => { this.removeThis() }
            },
            {
                text: () => "고정 " + (this.isStatic() ? "OFF" : "ON"),
                color: "blue",
                onClick: () => { this.toggleStatic() }
            },
            {
                text: "맨 앞으로",
                color: "blue",
                onClick: () => {
                    this.setZindex(1000)
                    this.changeProp()
                }
            },
            {
                text: "맨 뒤로",
                color: "blue",
                onClick: () => {
                    this.setZindex(0)
                    this.changeProp()
                }
            },
        ]
    }
    static defaultOptionFilter(option) {
        option = option || { style: {} }
        option.style = option.style || {}
        return {
            class: option.class || 'card',
            width: option.width || 200,
            height: option.height || 300,
            reverse: option.reverse || false,
            static: option.static || false,
            zIndex: option.zIndex || 1000,
            front: option.front || {
                image: './assets/cards/back.png'
            },
            back: option.back || {
                image: './assets/cards/back.png'
            },
            style: {
                cursor: "grab",
                boxShadow: "drop-shadow(0px 1px 1px #00000055)",
                backgroundColor: option.style.backgroundColor || "",
                borderRadius: option.style.borderRadius || 0,
            },
            transform: {
                translateY: 0,
                scale: 1,
            }
        }
    }
    optionSetting(option) {
        this.option = MoveAbleProp.defaultOptionFilter(option)
        if (option) {
            this.x = option.x || this.x
            this.y = option.y || this.y
        }
    }
    render() {
        if (this.active) this.attach()
        else this.detach()

        this.setZindex(this.option.zIndex)
        this.setPosition()
        this.setStyle()
        this.setTransform()
    }
    init() {
        this.render()
        this.detach()
    }
    attach() {
        this.active = true

        this.option.style.boxShadow = "drop-shadow(0px 20px 1px #00000055)"
        this.option.style.cursor = "grabbing"

        this.option.transform.translateY = 20
        this.setZindex(1000)
        this.setStyle()
        this.setTransform()
    }
    detach() {
        this.active = false

        this.option.style.boxShadow = "drop-shadow(0px 1px 1px #00000055)"
        this.option.style.cursor = "grab"

        this.option.transform.translateY = 0
        this.setStyle()
        this.setTransform()
    }
    setPosition() {
        this.prop.style.left = (this.x - this.centerX) + "px"
        this.prop.style.top = (this.y - this.centerY) + "px"
    }
    setPos(x, y) {
        this.x = x
        this.y = y
        this.setPosition()
    }
    setZindex(num) {
        this.option.zIndex = num
        this.prop.style.zIndex = this.option.zIndex
    }
    decreaseZindex() {
        if (this.option.zIndex > 0) this.option.zIndex--
        this.prop.style.zIndex = this.option.zIndex
    }
    setStyle() {
        this.prop.style.filter = this.option.style.boxShadow
        this.prop.style.cursor = this.option.style.cursor
        this.prop.style.backgroundColor = this.option.style.backgroundColor
        this.prop.style.borderRadius = this.option.style.borderRadius + "px"
    }
    setTransform() {
        this.prop.style.transform = `
            translateY(-${this.option.transform.translateY}px) 
            scale(${this.option.transform.scale}) 
            rotateY(${this.option.reverse ? 180 : 0}deg) 
            scaleX(${this.option.reverse ? -1 : 1})`
    }
    toggleStatic() {
        this.option.static = !this.option.static
        this.changeProp()
    }
    removeThis() {
        this.table.removeTable(this.prop)
    }

    changeProp() {
        socket.emit('changeProp', TableTop.compressPropData(this.prop.controller))
    }

    getContextMenu() {
        return this.contextMenuContent
    }
    getElement() {
        return this.prop
    }
    isActive() {
        return this.active
    }
    isStatic() {
        return this.option.static
    }
}
class Prop extends MoveAbleProp {
    constructor(table, id, option, x, y) {
        super(table, id, option, x, y)

        this.prop = document.createElement('div')
        this.prop.className = 'prop'
        this.prop.draggable = false
        this.prop.controller = this

        this.prop.style.width = this.option.width + "px"
        this.prop.style.height = this.option.height + "px"
        this.prop.style.backgroundImage = `url('${this.option.reverse ? this.option.back.image : this.option.front.image}')`
        this.prop.style.backgroundPosition = 'center'
        this.prop.style.backgroundSize = 'contain'

        this.prop.addEventListener('contextmenu', () => {
            if (!this.isStatic()) {
                this.reverse()
            }
        })

        this.prop.style.left = this.x
        this.prop.style.top = this.y

        this.init()
    }
    optionSetting(option) {
        super.optionSetting(option)
        if (option) {
            this.option.reverse = option.reverse
        }
        else {
        }
    }
    reverse() {
        socket.emit('reverse', {
            _id: this._id,
            reverse: !this.option.reverse
        })
        this.reverseToClient()
    }
    reverseToClient(arg) {
        if (arg) this.option.reverse = arg
        else this.option.reverse = !this.option.reverse
        this.prop.style.backgroundImage = `url('${this.option.reverse ? this.option.back.image : this.option.front.image}')`
        this.setTransform()
    }
}
class Props extends MoveAbleProp {
    constructor(table, id, option, count, x, y) {
        super(table, id, option, x, y)
        option.stack = option.stack || []
        this.option.stack = (option.stack.length > 0 ? option.stack.map((e, idx) => MoveAbleProp.defaultOptionFilter(e)) : null)
            || [...Array(count).keys()].map((e, idx) => MoveAbleProp.defaultOptionFilter(option))


        this.prop = document.createElement('div')
        this.prop.className = 'props'
        this.prop.draggable = false
        this.prop.controller = this

        this.prop.style.left = this.x
        this.prop.style.top = this.y

        this.prop.style.width = this.option.width + "px"
        this.prop.style.height = this.option.height + "px"
        this.prop.style.backgroundPosition = 'center'
        this.prop.style.backgroundSize = 'contain'

        this.childNumber = 0;

        this.contextMenuContent.push(
            {
                text: "섞기",
                color: "black",
                onClick: () => { this.shuffleStack() }
            },
            {
                text: "전개",
                color: "black",
                onClick: () => { this.unfoldStack() }
            },
            {
                text: "전부 뒤집기",
                color: "black",
                onClick: () => { this.reverseAll() }
            })

        this.setState()
        this.init()
    }
    setStack(stack) {
        this.option.stack = stack
        this.chkStack()
        this.setState()
    }
    setState() {
        if (!this.option.stack.length) return;
        var con = this.option.stack[this.option.stack.length - 1]
        this.prop.style.backgroundImage = `url('${con.reverse ? con.back.image : con.front.image}')`
        this.option.style.backgroundColor = `${con.style.backgroundColor}`
        this.prop.innerText = ` x${this.option.stack.length}`
        this.prop.style.borderRadius = con.style.borderRadius + "px"
    }
    popProp(isAttach, x, y) {
        var data = this.option.stack.pop()
        data.isAttach = isAttach || 0;
        this.table.createProp(data, x || this.x, y || this.y)
        this.setState()

        //return prop
        return data
    }
    pushProp(prop) {
        this.option.stack.push(prop)
    }
    shuffleStack() {
        var len = this.option.stack.length
        this.option.stack.forEach((x, idx) => {
            var rand = Math.floor(Math.random() * (len))
            var tmp = this.option.stack[idx]
            this.option.stack[idx] = this.option.stack[rand]
            this.option.stack[rand] = tmp
        })
        this.setState()
        socket.emit('changeProp', TableTop.compressPropData(this))
    }
    unfoldStack() {
        var len = this.option.stack.length
        this.option.stack.reverse()
        for (let i = 0; i < len; i++) {
            this.popProp(0, this.x + i * 20, this.y)
        }
        this.removeThis()
    }
    reverseAll() {
        this.option.stack.forEach(x => {
            x.reverse = !x.reverse
        })
        this.option.stack.reverse()
        this.setState()
        this.changeProp()
    }
    chkStack() {
        if (this.option.stack.length <= 1) {
            this.popProp()
            this.removeThis()
        }
    }
}

class TableTop {
    constructor(table) {
        table.controller = this
        this.table = table

        this.props = []
        this.prop = null

        this.cursorX;
        this.cursorY;


        this.contextmenu = null
        this.isContextMenu = false
        this.serverProps = []
        this.contextMenuContent = [
            {
                text: "모두 삭제",
                color: "red",
                onClick: () => { this.clearTable() }
            },
        ]

        this.networtInit()
    }
    init() {
        this.table.addEventListener('wheel', (e) => {
            this.showContextMenu(e.target)
        })
        this.table.addEventListener('mousedown', (e) => {
            this.closeContextMenu()

            var target = e.target
            if (target.classList.contains('props')) {
                switch (e.which) {
                    case 3:
                        this.moveProp(target)
                        break;
                    case 1:
                        target.controller.popProp(1)
                        target.controller.detach()
                        target.controller.changeProp()
                        break;
                }
            }
            else if (target.classList.contains('prop')) {
                this.moveProp(target)
            }
        })
        this.table.addEventListener('mouseup', (e) => {
            if (this.prop) {
                this.prop.controller.detach()
                this.prop.controller.changeProp()
                this.prop = null
            }
        })
        this.table.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX - this.table.offsetLeft
            this.cursorY = e.clientY - this.table.offsetTop
            if (this.prop) {
                this.prop.controller.setPos(this.cursorX, this.cursorY)
                this.prop.controller.changeProp()
            }
        })
    }
    moveProp(prop) {
        if (!prop.controller.isActive() && !prop.controller.isStatic()) {
            this.prop = prop
            this.decreaseZindexAll()
            this.prop.controller.attach()
            socket.emit('decreaseZindexAll', true)
            this.prop.controller.changeProp()
        }
    }
    findPropByID(_id) {
        return this.props.filter(x => x._id == _id)[0]
    }
    getContextMenu() {
        return this.contextMenuContent
    }
    clearTable() {
        socket.emit('clearTable', true)
        return this.clearTableToClient()
    }
    clearTableToClient() {
        this.props = []
        this.table.innerHTML = '';
        this.isContextMenu = false
        this.contextmenu = null
        return true
    }
    decreaseZindexAll() {
        this.props.forEach((x, idx) => {
            x.decreaseZindex()
        })
    }
    autoCreate(data, x, y) {
        if (data.isProps) {
            this.createProps(data.option, data.count, x || this.cursorX, y || this.cursorY)
        }
        else {
            this.createProp(data.option, x || this.cursorX, y || this.cursorY)
        }
    }
    createProp(option, x, y) {
        socket.emit('createProp', { option, x, y, isAttach: option.isAttach })
    }
    createPropToClient(_id, option, x, y) {
        var prop = new Prop(this, _id, option, x, y)
        this.appendTable(prop.getElement())
        return prop
    }
    createProps(option, count, x, y) {
        socket.emit('createProps', { option, count, x, y })
    }
    createPropsToClient(_id, option, count, x, y) {
        var prop = new Props(this, _id, option, count, x, y)
        this.appendTable(prop.getElement())
        return prop
    }
    appendTable(ele) {
        var con = ele.controller
        this.props.push(con)
        this.table.appendChild(ele)
    }
    removeTable(ele) {
        socket.emit('removeProp', { _id: ele.controller._id })
    }
    removeTableToClient(con) {
        this.table.removeChild(this.props.splice(this.props.findIndex(x => x._id == con._id), 1)[0].prop)
    }

    showContextMenu(t) {
        if (!this.isContextMenu) {
            var target = t.controller
            this.isContextMenu = true
            var contextMenuX = this.cursorX
            var contextMenuY = this.cursorY
            var contextmenu = document.createElement('div')
            contextmenu.classList.add('contextMenu')
            contextmenu.style.top = contextMenuY + "px"
            contextmenu.style.left = contextMenuX + "px"

            target.getContextMenu().forEach(x => {
                var content = document.createElement('p')
                content.innerText = (x.text instanceof Function ? x.text() : x.text)
                content.style.color = x.color
                content.addEventListener('mousedown', (e) => {
                    x.onClick(contextMenuX, contextMenuY)
                    this.closeContextMenu()
                })
                contextmenu.appendChild(content)
            })
            this.contextmenu = contextmenu
            this.table.appendChild(contextmenu)

        }
    }
    closeContextMenu() {
        if (this.contextmenu && this.isContextMenu) {
            this.table.removeChild(this.contextmenu)
            this.contextmenu = null
            this.isContextMenu = false
        }
    }

    static compressPropData(prop) {
        var out = {
            _id: prop._id,
            active: prop.active,
            x: prop.x,
            y: prop.y,
            option: prop.option,
        }
        out.option.stack = prop.option.stack || null
        return out
    }
    networtInit() {
        var getTarget = (id) => this.props[this.props.findIndex(x => x._id == id)]
        socket.on('clearTable', data => {
            this.clearTableToClient()
        })
        socket.on('decreaseZindexAll', data => {
            this.decreaseZindexAll()
        })
        socket.on('createProp', data => {
            table.createPropToClient(data._id, data.option, data.x, data.y)
        })
        socket.on('createProps', data => {
            table.createPropsToClient(data._id, data.option, data.count || null, data.x, data.y)
        })
        socket.on('reverse', data => {
            var target = getTarget(data._id)
            if (!target) return
            target.reverseToClient()
        })
        socket.on('changeProp', data => {
            var target = getTarget(data._id)
            if (!target) return
            target.active = data.active
            data.option.x = data.x
            data.option.y = data.y
            target.optionSetting(data.option)
            if (target instanceof Props) {
                target.setStack(data.option.stack)
            }
            target.render()
        })
        socket.on('removeProp', data => {
            this.removeTableToClient(data)
        })
        socket.on('serverProps', data => {
            this.serverProps = data
            this.serverProps.forEach(x => {
                this.contextMenuContent.push(
                    {
                        text: `생성 : ${x.primalName}`,
                        color: "green",
                        onClick: (cx, cy) => { this.autoCreate(x, cx, cy) }
                    }
                )
            })
        })
        socket.on('attachProp', data => {
            this.prop = this.findPropByID(data).prop
            this.moveProp(this.prop)
        })
    }
}