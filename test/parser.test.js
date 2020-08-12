import assert from 'assert'
import { parseHTML } from '../src/parser.js'

it('element', () => {
    let doc = parseHTML('<div></div>'),
        div = doc.children[0]
    assert.equal(div.type, 'element')
    assert.equal(div.tagName, 'div')
    assert.equal(div.children.length, 0)
    assert.equal(div.attributes.length, 2)
})

it('self closing start tag', () => {
    let doc = parseHTML('<img/>'),
        el = doc.children[0]
    assert(el.tagName, 'img')
})

it('Uppercase tagName', () => {
    let doc = parseHTML('<DIV></DIV>'),
        el = doc.children[0]
    assert(el.tagName, 'DIV')
})

it('< not tagOpen', () => {
    let doc = parseHTML('<div>a< b</div>'),
        el = doc.children[0]
    assert(el.children[0].content, 'a< b')
})

it('tag not match ', () => {
    try {
        let doc = parseHTML('<div>hello</dvi>')
    } catch (err) {
        assert(err.message === "Tag start end doesn't match!")
    }
})

it('text ', () => {
    let doc = parseHTML('<div>hello</div>'),
        text = doc.children[0].children[0]
    assert(text.type, 'text')
    assert(text.content, 'hello')
})

it('attribute ', () => {
    let doc = parseHTML('<div id=a class = b>hello</div>'),
        el = doc.children[0]
    let count = 0
    for (let attr of el.attributes) {
        if (attr.name === 'id') {
            count++
            assert.equal(attr.value, 'a')
        }
        if (attr.name === 'class') {
            count++
            assert.equal(attr.value, 'b')
        }
    }
    assert.equal(count, 2)
})

it('quoted attribute', () => {
    let doc = parseHTML(`<div id='a' class="b">hello</div>`),
        el = doc.children[0]
    let count = 0
    for (let attr of el.attributes) {
        if (attr.name === 'id') {
            count++
            assert.equal(attr.value, 'a')
        }
        if (attr.name === 'class') {
            count++
            assert.equal(attr.value, 'b')
        }
    }
    assert.equal(count, 2)
})

it('attr in self closing tag', () => {
    let doc = parseHTML(`<div id=a />`),
        el = doc.children[0]
    let count = 0
    for (let attr of el.attributes) {
        if (attr.name === 'id') {
            count++
            assert.equal(attr.value, 'a')
        }
    }
    assert.equal(count, 1)
})

it('attr no value', () => {
    let doc = parseHTML(`<div id ></div>`),
        el = doc.children[0]
    let count = 0
    for (let attr of el.attributes) {
        if (attr.name === 'id') {
            count++
            assert.equal(attr.value, '')
        }
    }
    assert.equal(count, 1)
})

it('script ', () => {
    let content = `<span></span>
    <div></div>
    <pans
    let a = "abc"
    b = 'abc'
    <
    <s
    <sc
    <scr
    <scri
    <scrip
    <script
    <
    </s
    </sc
    </scr
    </scri
    </scrip
    </script  `
    let doc = parseHTML(`<script>${content}</script>`),
        el = doc.children[0]
    assert(el.children[0].content, content)
})
