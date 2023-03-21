var __defProp = Object.defineProperty
var __name = (target, value) =>
    __defProp(target, 'name', { value, configurable: true })
import { R as React__default } from './iframe-dd92afcf.js'
import { R as ReactDOM } from './index-265fe75c.js'
var wrapper = {
    fontSize: '14px',
    letterSpacing: '0.2px',
    margin: '10px 0'
}
var main = {
    margin: 'auto',
    padding: 30,
    borderRadius: 10,
    background: 'rgba(0,0,0,0.03)'
}
var heading = {
    textAlign: 'center'
}
var NoDocs = /* @__PURE__ */ __name(function NoDocs2() {
    return /* @__PURE__ */ React__default.createElement(
        'div',
        {
            style: wrapper,
            className: 'sb-nodocs sb-wrapper'
        },
        /* @__PURE__ */ React__default.createElement(
            'div',
            {
                style: main
            },
            /* @__PURE__ */ React__default.createElement(
                'h1',
                {
                    style: heading
                },
                'No Docs'
            ),
            /* @__PURE__ */ React__default.createElement(
                'p',
                null,
                "Sorry, but there are no docs for the selected story. To add them, set the story's ",
                /* @__PURE__ */ React__default.createElement(
                    'code',
                    null,
                    'docs'
                ),
                ' parameter. If you think this is an error:'
            ),
            /* @__PURE__ */ React__default.createElement(
                'ul',
                null,
                /* @__PURE__ */ React__default.createElement(
                    'li',
                    null,
                    'Please check the story definition.'
                ),
                /* @__PURE__ */ React__default.createElement(
                    'li',
                    null,
                    'Please check the Storybook config.'
                ),
                /* @__PURE__ */ React__default.createElement(
                    'li',
                    null,
                    'Try reloading the page.'
                )
            ),
            /* @__PURE__ */ React__default.createElement(
                'p',
                null,
                "If the problem persists, check the browser console, or the terminal you've run Storybook from."
            )
        )
    )
}, 'NoDocs')
NoDocs.displayName = 'NoDocs'
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg)
        var value = info.value
    } catch (error) {
        reject(error)
        return
    }
    if (info.done) {
        resolve(value)
    } else {
        Promise.resolve(value).then(_next, _throw)
    }
}
__name(asyncGeneratorStep, 'asyncGeneratorStep')
function _asyncToGenerator(fn) {
    return function () {
        var self = this,
            args = arguments
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args)
            function _next(value) {
                asyncGeneratorStep(
                    gen,
                    resolve,
                    reject,
                    _next,
                    _throw,
                    'next',
                    value
                )
            }
            __name(_next, '_next')
            function _throw(err) {
                asyncGeneratorStep(
                    gen,
                    resolve,
                    reject,
                    _next,
                    _throw,
                    'throw',
                    err
                )
            }
            __name(_throw, '_throw')
            _next(void 0)
        })
    }
}
__name(_asyncToGenerator, '_asyncToGenerator')
function renderDocs(story, docsContext, element, callback) {
    return renderDocsAsync(story, docsContext, element).then(callback)
}
__name(renderDocs, 'renderDocs')
function renderDocsAsync(_x, _x2, _x3) {
    return _renderDocsAsync.apply(this, arguments)
}
__name(renderDocsAsync, 'renderDocsAsync')
function _renderDocsAsync() {
    _renderDocsAsync = _asyncToGenerator(
        /* @__PURE__ */ regeneratorRuntime.mark(
            /* @__PURE__ */ __name(function _callee(
                story,
                docsContext,
                element
            ) {
                var _docs$getContainer, _docs$getPage
                var docs, DocsContainer, Page, docsElement
                return regeneratorRuntime.wrap(
                    /* @__PURE__ */ __name(function _callee$(_context) {
                        while (1) {
                            switch ((_context.prev = _context.next)) {
                                case 0:
                                    docs = story.parameters.docs
                                    if (
                                        !(
                                            ((docs !== null &&
                                                docs !== void 0 &&
                                                docs.getPage) ||
                                                (docs !== null &&
                                                    docs !== void 0 &&
                                                    docs.page)) &&
                                            !(
                                                (docs !== null &&
                                                    docs !== void 0 &&
                                                    docs.getContainer) ||
                                                (docs !== null &&
                                                    docs !== void 0 &&
                                                    docs.container)
                                            )
                                        )
                                    ) {
                                        _context.next = 3
                                        break
                                    }
                                    throw new Error(
                                        'No `docs.container` set, did you run `addon-docs/preset`?'
                                    )
                                case 3:
                                    _context.t1 = docs.container
                                    if (_context.t1) {
                                        _context.next = 8
                                        break
                                    }
                                    _context.next = 7
                                    return (_docs$getContainer =
                                        docs.getContainer) === null ||
                                        _docs$getContainer === void 0
                                        ? void 0
                                        : _docs$getContainer.call(docs)
                                case 7:
                                    _context.t1 = _context.sent
                                case 8:
                                    _context.t0 = _context.t1
                                    if (_context.t0) {
                                        _context.next = 11
                                        break
                                    }
                                    _context.t0 = function (_ref) {
                                        var children = _ref.children
                                        return /* @__PURE__ */ React__default.createElement(
                                            React__default.Fragment,
                                            null,
                                            children
                                        )
                                    }
                                case 11:
                                    DocsContainer = _context.t0
                                    _context.t3 = docs.page
                                    if (_context.t3) {
                                        _context.next = 17
                                        break
                                    }
                                    _context.next = 16
                                    return (_docs$getPage = docs.getPage) ===
                                        null || _docs$getPage === void 0
                                        ? void 0
                                        : _docs$getPage.call(docs)
                                case 16:
                                    _context.t3 = _context.sent
                                case 17:
                                    _context.t2 = _context.t3
                                    if (_context.t2) {
                                        _context.next = 20
                                        break
                                    }
                                    _context.t2 = NoDocs
                                case 20:
                                    Page = _context.t2
                                    docsElement =
                                        /* @__PURE__ */ React__default.createElement(
                                            DocsContainer,
                                            {
                                                key: story.componentId,
                                                context: docsContext
                                            },
                                            /* @__PURE__ */ React__default.createElement(
                                                Page,
                                                null
                                            )
                                        )
                                    _context.next = 24
                                    return new Promise(function (resolve) {
                                        ReactDOM.render(
                                            docsElement,
                                            element,
                                            resolve
                                        )
                                    })
                                case 24:
                                case 'end':
                                    return _context.stop()
                            }
                        }
                    }, '_callee$'),
                    _callee
                )
            },
            '_callee')
        )
    )
    return _renderDocsAsync.apply(this, arguments)
}
__name(_renderDocsAsync, '_renderDocsAsync')
function unmountDocs(element) {
    ReactDOM.unmountComponentAtNode(element)
}
__name(unmountDocs, 'unmountDocs')
export { renderDocs, unmountDocs }
