var __defProp = Object.defineProperty
var __name = (target, value) =>
    __defProp(target, 'name', { value, configurable: true })
import {
    z as reactExports,
    aK as getDefaultExportFromCjs
} from './iframe-dd92afcf.js'
var reactDomExports = {}
var reactDom = {
    get exports() {
        return reactDomExports
    },
    set exports(v) {
        reactDomExports = v
    }
}
var reactDom_production_min = {}
var schedulerExports = {}
var scheduler = {
    get exports() {
        return schedulerExports
    },
    set exports(v) {
        schedulerExports = v
    }
}
var scheduler_production_min = {}
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
;(function (exports) {
    function f(a, b) {
        var c = a.length
        a.push(b)
        a: for (; 0 < c; ) {
            var d = (c - 1) >>> 1,
                e = a[d]
            if (0 < g(e, b)) (a[d] = b), (a[c] = e), (c = d)
            else break a
        }
    }
    __name(f, 'f')
    function h(a) {
        return 0 === a.length ? null : a[0]
    }
    __name(h, 'h')
    function k(a) {
        if (0 === a.length) return null
        var b = a[0],
            c = a.pop()
        if (c !== b) {
            a[0] = c
            a: for (var d = 0, e = a.length, w = e >>> 1; d < w; ) {
                var m = 2 * (d + 1) - 1,
                    C2 = a[m],
                    n = m + 1,
                    x = a[n]
                if (0 > g(C2, c))
                    n < e && 0 > g(x, C2)
                        ? ((a[d] = x), (a[n] = c), (d = n))
                        : ((a[d] = C2), (a[m] = c), (d = m))
                else if (n < e && 0 > g(x, c)) (a[d] = x), (a[n] = c), (d = n)
                else break a
            }
        }
        return b
    }
    __name(k, 'k')
    function g(a, b) {
        var c = a.sortIndex - b.sortIndex
        return 0 !== c ? c : a.id - b.id
    }
    __name(g, 'g')
    if (
        'object' === typeof performance &&
        'function' === typeof performance.now
    ) {
        var l = performance
        exports.unstable_now = function () {
            return l.now()
        }
    } else {
        var p2 = Date,
            q = p2.now()
        exports.unstable_now = function () {
            return p2.now() - q
        }
    }
    var r = [],
        t2 = [],
        u = 1,
        v = null,
        y = 3,
        z2 = false,
        A2 = false,
        B2 = false,
        D2 = 'function' === typeof setTimeout ? setTimeout : null,
        E2 = 'function' === typeof clearTimeout ? clearTimeout : null,
        F = 'undefined' !== typeof setImmediate ? setImmediate : null
    'undefined' !== typeof navigator &&
        void 0 !== navigator.scheduling &&
        void 0 !== navigator.scheduling.isInputPending &&
        navigator.scheduling.isInputPending.bind(navigator.scheduling)
    function G2(a) {
        for (var b = h(t2); null !== b; ) {
            if (null === b.callback) k(t2)
            else if (b.startTime <= a)
                k(t2), (b.sortIndex = b.expirationTime), f(r, b)
            else break
            b = h(t2)
        }
    }
    __name(G2, 'G')
    function H2(a) {
        B2 = false
        G2(a)
        if (!A2)
            if (null !== h(r)) (A2 = true), I2(J)
            else {
                var b = h(t2)
                null !== b && K2(H2, b.startTime - a)
            }
    }
    __name(H2, 'H')
    function J(a, b) {
        A2 = false
        B2 && ((B2 = false), E2(L2), (L2 = -1))
        z2 = true
        var c = y
        try {
            G2(b)
            for (
                v = h(r);
                null !== v && (!(v.expirationTime > b) || (a && !M2()));

            ) {
                var d = v.callback
                if ('function' === typeof d) {
                    v.callback = null
                    y = v.priorityLevel
                    var e = d(v.expirationTime <= b)
                    b = exports.unstable_now()
                    'function' === typeof e
                        ? (v.callback = e)
                        : v === h(r) && k(r)
                    G2(b)
                } else k(r)
                v = h(r)
            }
            if (null !== v) var w = true
            else {
                var m = h(t2)
                null !== m && K2(H2, m.startTime - b)
                w = false
            }
            return w
        } finally {
            ;(v = null), (y = c), (z2 = false)
        }
    }
    __name(J, 'J')
    var N2 = false,
        O2 = null,
        L2 = -1,
        P2 = 5,
        Q2 = -1
    function M2() {
        return exports.unstable_now() - Q2 < P2 ? false : true
    }
    __name(M2, 'M')
    function R2() {
        if (null !== O2) {
            var a = exports.unstable_now()
            Q2 = a
            var b = true
            try {
                b = O2(true, a)
            } finally {
                b ? S2() : ((N2 = false), (O2 = null))
            }
        } else N2 = false
    }
    __name(R2, 'R')
    var S2
    if ('function' === typeof F)
        S2 = /* @__PURE__ */ __name(function () {
            F(R2)
        }, 'S')
    else if ('undefined' !== typeof MessageChannel) {
        var T2 = new MessageChannel(),
            U2 = T2.port2
        T2.port1.onmessage = R2
        S2 = /* @__PURE__ */ __name(function () {
            U2.postMessage(null)
        }, 'S')
    } else
        S2 = /* @__PURE__ */ __name(function () {
            D2(R2, 0)
        }, 'S')
    function I2(a) {
        O2 = a
        N2 || ((N2 = true), S2())
    }
    __name(I2, 'I')
    function K2(a, b) {
        L2 = D2(function () {
            a(exports.unstable_now())
        }, b)
    }
    __name(K2, 'K')
    exports.unstable_IdlePriority = 5
    exports.unstable_ImmediatePriority = 1
    exports.unstable_LowPriority = 4
    exports.unstable_NormalPriority = 3
    exports.unstable_Profiling = null
    exports.unstable_UserBlockingPriority = 2
    exports.unstable_cancelCallback = function (a) {
        a.callback = null
    }
    exports.unstable_continueExecution = function () {
        A2 || z2 || ((A2 = true), I2(J))
    }
    exports.unstable_forceFrameRate = function (a) {
        0 > a || 125 < a
            ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported'
              )
            : (P2 = 0 < a ? Math.floor(1e3 / a) : 5)
    }
    exports.unstable_getCurrentPriorityLevel = function () {
        return y
    }
    exports.unstable_getFirstCallbackNode = function () {
        return h(r)
    }
    exports.unstable_next = function (a) {
        switch (y) {
            case 1:
            case 2:
            case 3:
                var b = 3
                break
            default:
                b = y
        }
        var c = y
        y = b
        try {
            return a()
        } finally {
            y = c
        }
    }
    exports.unstable_pauseExecution = function () {}
    exports.unstable_requestPaint = function () {}
    exports.unstable_runWithPriority = function (a, b) {
        switch (a) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break
            default:
                a = 3
        }
        var c = y
        y = a
        try {
            return b()
        } finally {
            y = c
        }
    }
    exports.unstable_scheduleCallback = function (a, b, c) {
        var d = exports.unstable_now()
        'object' === typeof c && null !== c
            ? ((c = c.delay), (c = 'number' === typeof c && 0 < c ? d + c : d))
            : (c = d)
        switch (a) {
            case 1:
                var e = -1
                break
            case 2:
                e = 250
                break
            case 5:
                e = 1073741823
                break
            case 4:
                e = 1e4
                break
            default:
                e = 5e3
        }
        e = c + e
        a = {
            id: u++,
            callback: b,
            priorityLevel: a,
            startTime: c,
            expirationTime: e,
            sortIndex: -1
        }
        c > d
            ? ((a.sortIndex = c),
              f(t2, a),
              null === h(r) &&
                  a === h(t2) &&
                  (B2 ? (E2(L2), (L2 = -1)) : (B2 = true), K2(H2, c - d)))
            : ((a.sortIndex = e), f(r, a), A2 || z2 || ((A2 = true), I2(J)))
        return a
    }
    exports.unstable_shouldYield = M2
    exports.unstable_wrapCallback = function (a) {
        var b = y
        return function () {
            var c = y
            y = b
            try {
                return a.apply(this, arguments)
            } finally {
                y = c
            }
        }
    }
})(scheduler_production_min)
;(function (module) {
    {
        module.exports = scheduler_production_min
    }
})(scheduler)
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports,
    ba = schedulerExports
function p(a) {
    for (
        var b = 'https://reactjs.org/docs/error-decoder.html?invariant=' + a,
            c = 1;
        c < arguments.length;
        c++
    )
        b += '&args[]=' + encodeURIComponent(arguments[c])
    return (
        'Minified React error #' +
        a +
        '; visit ' +
        b +
        ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    )
}
__name(p, 'p')
var da = /* @__PURE__ */ new Set(),
    ea = {}
function fa(a, b) {
    ha(a, b)
    ha(a + 'Capture', b)
}
__name(fa, 'fa')
function ha(a, b) {
    ea[a] = b
    for (a = 0; a < b.length; a++) da.add(b[a])
}
__name(ha, 'ha')
var ia = !(
        'undefined' === typeof window ||
        'undefined' === typeof window.document ||
        'undefined' === typeof window.document.createElement
    ),
    ja = Object.prototype.hasOwnProperty,
    ka =
        /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    la = {},
    ma = {}
function na(a) {
    if (ja.call(ma, a)) return true
    if (ja.call(la, a)) return false
    if (ka.test(a)) return (ma[a] = true)
    la[a] = true
    return false
}
__name(na, 'na')
function oa(a, b, c, d) {
    if (null !== c && 0 === c.type) return false
    switch (typeof b) {
        case 'function':
        case 'symbol':
            return true
        case 'boolean':
            if (d) return false
            if (null !== c) return !c.acceptsBooleans
            a = a.toLowerCase().slice(0, 5)
            return 'data-' !== a && 'aria-' !== a
        default:
            return false
    }
}
__name(oa, 'oa')
function pa(a, b, c, d) {
    if (null === b || 'undefined' === typeof b || oa(a, b, c, d)) return true
    if (d) return false
    if (null !== c)
        switch (c.type) {
            case 3:
                return !b
            case 4:
                return false === b
            case 5:
                return isNaN(b)
            case 6:
                return isNaN(b) || 1 > b
        }
    return false
}
__name(pa, 'pa')
function t(a, b, c, d, e, f, g) {
    this.acceptsBooleans = 2 === b || 3 === b || 4 === b
    this.attributeName = d
    this.attributeNamespace = e
    this.mustUseProperty = c
    this.propertyName = a
    this.type = b
    this.sanitizeURL = f
    this.removeEmptyString = g
}
__name(t, 't')
var z = {}
'children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style'
    .split(' ')
    .forEach(function (a) {
        z[a] = new t(a, 0, false, a, null, false, false)
    })
;[
    ['acceptCharset', 'accept-charset'],
    ['className', 'class'],
    ['htmlFor', 'for'],
    ['httpEquiv', 'http-equiv']
].forEach(function (a) {
    var b = a[0]
    z[b] = new t(b, 1, false, a[1], null, false, false)
})
;['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (a) {
    z[a] = new t(a, 2, false, a.toLowerCase(), null, false, false)
})
;[
    'autoReverse',
    'externalResourcesRequired',
    'focusable',
    'preserveAlpha'
].forEach(function (a) {
    z[a] = new t(a, 2, false, a, null, false, false)
})
'allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope'
    .split(' ')
    .forEach(function (a) {
        z[a] = new t(a, 3, false, a.toLowerCase(), null, false, false)
    })
;['checked', 'multiple', 'muted', 'selected'].forEach(function (a) {
    z[a] = new t(a, 3, true, a, null, false, false)
})
;['capture', 'download'].forEach(function (a) {
    z[a] = new t(a, 4, false, a, null, false, false)
})
;['cols', 'rows', 'size', 'span'].forEach(function (a) {
    z[a] = new t(a, 6, false, a, null, false, false)
})
;['rowSpan', 'start'].forEach(function (a) {
    z[a] = new t(a, 5, false, a.toLowerCase(), null, false, false)
})
var qa = /[\-:]([a-z])/g
function ra(a) {
    return a[1].toUpperCase()
}
__name(ra, 'ra')
'accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height'
    .split(' ')
    .forEach(function (a) {
        var b = a.replace(qa, ra)
        z[b] = new t(b, 1, false, a, null, false, false)
    })
'xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type'
    .split(' ')
    .forEach(function (a) {
        var b = a.replace(qa, ra)
        z[b] = new t(
            b,
            1,
            false,
            a,
            'http://www.w3.org/1999/xlink',
            false,
            false
        )
    })
;['xml:base', 'xml:lang', 'xml:space'].forEach(function (a) {
    var b = a.replace(qa, ra)
    z[b] = new t(
        b,
        1,
        false,
        a,
        'http://www.w3.org/XML/1998/namespace',
        false,
        false
    )
})
;['tabIndex', 'crossOrigin'].forEach(function (a) {
    z[a] = new t(a, 1, false, a.toLowerCase(), null, false, false)
})
z.xlinkHref = new t(
    'xlinkHref',
    1,
    false,
    'xlink:href',
    'http://www.w3.org/1999/xlink',
    true,
    false
)
;['src', 'href', 'action', 'formAction'].forEach(function (a) {
    z[a] = new t(a, 1, false, a.toLowerCase(), null, true, true)
})
function sa(a, b, c, d) {
    var e = z.hasOwnProperty(b) ? z[b] : null
    if (
        null !== e
            ? 0 !== e.type
            : d ||
              !(2 < b.length) ||
              ('o' !== b[0] && 'O' !== b[0]) ||
              ('n' !== b[1] && 'N' !== b[1])
    )
        pa(b, c, e, d) && (c = null),
            d || null === e
                ? na(b) &&
                  (null === c
                      ? a.removeAttribute(b)
                      : a.setAttribute(b, '' + c))
                : e.mustUseProperty
                ? (a[e.propertyName] =
                      null === c ? (3 === e.type ? false : '') : c)
                : ((b = e.attributeName),
                  (d = e.attributeNamespace),
                  null === c
                      ? a.removeAttribute(b)
                      : ((e = e.type),
                        (c = 3 === e || (4 === e && true === c) ? '' : '' + c),
                        d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)))
}
__name(sa, 'sa')
var ta = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    ua = Symbol.for('react.element'),
    va = Symbol.for('react.portal'),
    wa = Symbol.for('react.fragment'),
    xa = Symbol.for('react.strict_mode'),
    za = Symbol.for('react.profiler'),
    Aa = Symbol.for('react.provider'),
    Ba = Symbol.for('react.context'),
    Ca = Symbol.for('react.forward_ref'),
    Da = Symbol.for('react.suspense'),
    Ea = Symbol.for('react.suspense_list'),
    Fa = Symbol.for('react.memo'),
    Ga = Symbol.for('react.lazy')
var Ha = Symbol.for('react.offscreen')
var Ia = Symbol.iterator
function Ja(a) {
    if (null === a || 'object' !== typeof a) return null
    a = (Ia && a[Ia]) || a['@@iterator']
    return 'function' === typeof a ? a : null
}
__name(Ja, 'Ja')
var A = Object.assign,
    Ka
function La(a) {
    if (void 0 === Ka)
        try {
            throw Error()
        } catch (c) {
            var b = c.stack.trim().match(/\n( *(at )?)/)
            Ka = (b && b[1]) || ''
        }
    return '\n' + Ka + a
}
__name(La, 'La')
var Ma = false
function Na(a, b) {
    if (!a || Ma) return ''
    Ma = true
    var c = Error.prepareStackTrace
    Error.prepareStackTrace = void 0
    try {
        if (b)
            if (
                ((b = /* @__PURE__ */ __name(function () {
                    throw Error()
                }, 'b')),
                Object.defineProperty(b.prototype, 'props', {
                    set: function () {
                        throw Error()
                    }
                }),
                'object' === typeof Reflect && Reflect.construct)
            ) {
                try {
                    Reflect.construct(b, [])
                } catch (l) {
                    var d = l
                }
                Reflect.construct(a, [], b)
            } else {
                try {
                    b.call()
                } catch (l) {
                    d = l
                }
                a.call(b.prototype)
            }
        else {
            try {
                throw Error()
            } catch (l) {
                d = l
            }
            a()
        }
    } catch (l) {
        if (l && d && 'string' === typeof l.stack) {
            for (
                var e = l.stack.split('\n'),
                    f = d.stack.split('\n'),
                    g = e.length - 1,
                    h = f.length - 1;
                1 <= g && 0 <= h && e[g] !== f[h];

            )
                h--
            for (; 1 <= g && 0 <= h; g--, h--)
                if (e[g] !== f[h]) {
                    if (1 !== g || 1 !== h) {
                        do
                            if ((g--, h--, 0 > h || e[g] !== f[h])) {
                                var k = '\n' + e[g].replace(' at new ', ' at ')
                                a.displayName &&
                                    k.includes('<anonymous>') &&
                                    (k = k.replace(
                                        '<anonymous>',
                                        a.displayName
                                    ))
                                return k
                            }
                        while (1 <= g && 0 <= h)
                    }
                    break
                }
        }
    } finally {
        ;(Ma = false), (Error.prepareStackTrace = c)
    }
    return (a = a ? a.displayName || a.name : '') ? La(a) : ''
}
__name(Na, 'Na')
function Oa(a) {
    switch (a.tag) {
        case 5:
            return La(a.type)
        case 16:
            return La('Lazy')
        case 13:
            return La('Suspense')
        case 19:
            return La('SuspenseList')
        case 0:
        case 2:
        case 15:
            return (a = Na(a.type, false)), a
        case 11:
            return (a = Na(a.type.render, false)), a
        case 1:
            return (a = Na(a.type, true)), a
        default:
            return ''
    }
}
__name(Oa, 'Oa')
function Pa(a) {
    if (null == a) return null
    if ('function' === typeof a) return a.displayName || a.name || null
    if ('string' === typeof a) return a
    switch (a) {
        case wa:
            return 'Fragment'
        case va:
            return 'Portal'
        case za:
            return 'Profiler'
        case xa:
            return 'StrictMode'
        case Da:
            return 'Suspense'
        case Ea:
            return 'SuspenseList'
    }
    if ('object' === typeof a)
        switch (a.$$typeof) {
            case Ba:
                return (a.displayName || 'Context') + '.Consumer'
            case Aa:
                return (a._context.displayName || 'Context') + '.Provider'
            case Ca:
                var b = a.render
                a = a.displayName
                a ||
                    ((a = b.displayName || b.name || ''),
                    (a = '' !== a ? 'ForwardRef(' + a + ')' : 'ForwardRef'))
                return a
            case Fa:
                return (
                    (b = a.displayName || null),
                    null !== b ? b : Pa(a.type) || 'Memo'
                )
            case Ga:
                b = a._payload
                a = a._init
                try {
                    return Pa(a(b))
                } catch (c) {}
        }
    return null
}
__name(Pa, 'Pa')
function Qa(a) {
    var b = a.type
    switch (a.tag) {
        case 24:
            return 'Cache'
        case 9:
            return (b.displayName || 'Context') + '.Consumer'
        case 10:
            return (b._context.displayName || 'Context') + '.Provider'
        case 18:
            return 'DehydratedFragment'
        case 11:
            return (
                (a = b.render),
                (a = a.displayName || a.name || ''),
                b.displayName ||
                    ('' !== a ? 'ForwardRef(' + a + ')' : 'ForwardRef')
            )
        case 7:
            return 'Fragment'
        case 5:
            return b
        case 4:
            return 'Portal'
        case 3:
            return 'Root'
        case 6:
            return 'Text'
        case 16:
            return Pa(b)
        case 8:
            return b === xa ? 'StrictMode' : 'Mode'
        case 22:
            return 'Offscreen'
        case 12:
            return 'Profiler'
        case 21:
            return 'Scope'
        case 13:
            return 'Suspense'
        case 19:
            return 'SuspenseList'
        case 25:
            return 'TracingMarker'
        case 1:
        case 0:
        case 17:
        case 2:
        case 14:
        case 15:
            if ('function' === typeof b) return b.displayName || b.name || null
            if ('string' === typeof b) return b
    }
    return null
}
__name(Qa, 'Qa')
function Ra(a) {
    switch (typeof a) {
        case 'boolean':
        case 'number':
        case 'string':
        case 'undefined':
            return a
        case 'object':
            return a
        default:
            return ''
    }
}
__name(Ra, 'Ra')
function Sa(a) {
    var b = a.type
    return (
        (a = a.nodeName) &&
        'input' === a.toLowerCase() &&
        ('checkbox' === b || 'radio' === b)
    )
}
__name(Sa, 'Sa')
function Ta(a) {
    var b = Sa(a) ? 'checked' : 'value',
        c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b),
        d = '' + a[b]
    if (
        !a.hasOwnProperty(b) &&
        'undefined' !== typeof c &&
        'function' === typeof c.get &&
        'function' === typeof c.set
    ) {
        var e = c.get,
            f = c.set
        Object.defineProperty(a, b, {
            configurable: true,
            get: function () {
                return e.call(this)
            },
            set: function (a2) {
                d = '' + a2
                f.call(this, a2)
            }
        })
        Object.defineProperty(a, b, { enumerable: c.enumerable })
        return {
            getValue: function () {
                return d
            },
            setValue: function (a2) {
                d = '' + a2
            },
            stopTracking: function () {
                a._valueTracker = null
                delete a[b]
            }
        }
    }
}
__name(Ta, 'Ta')
function Ua(a) {
    a._valueTracker || (a._valueTracker = Ta(a))
}
__name(Ua, 'Ua')
function Va(a) {
    if (!a) return false
    var b = a._valueTracker
    if (!b) return true
    var c = b.getValue()
    var d = ''
    a && (d = Sa(a) ? (a.checked ? 'true' : 'false') : a.value)
    a = d
    return a !== c ? (b.setValue(a), true) : false
}
__name(Va, 'Va')
function Wa(a) {
    a = a || ('undefined' !== typeof document ? document : void 0)
    if ('undefined' === typeof a) return null
    try {
        return a.activeElement || a.body
    } catch (b) {
        return a.body
    }
}
__name(Wa, 'Wa')
function Xa(a, b) {
    var c = b.checked
    return A({}, b, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: null != c ? c : a._wrapperState.initialChecked
    })
}
__name(Xa, 'Xa')
function Ya(a, b) {
    var c = null == b.defaultValue ? '' : b.defaultValue,
        d = null != b.checked ? b.checked : b.defaultChecked
    c = Ra(null != b.value ? b.value : c)
    a._wrapperState = {
        initialChecked: d,
        initialValue: c,
        controlled:
            'checkbox' === b.type || 'radio' === b.type
                ? null != b.checked
                : null != b.value
    }
}
__name(Ya, 'Ya')
function Za(a, b) {
    b = b.checked
    null != b && sa(a, 'checked', b, false)
}
__name(Za, 'Za')
function $a(a, b) {
    Za(a, b)
    var c = Ra(b.value),
        d = b.type
    if (null != c)
        if ('number' === d) {
            if ((0 === c && '' === a.value) || a.value != c) a.value = '' + c
        } else a.value !== '' + c && (a.value = '' + c)
    else if ('submit' === d || 'reset' === d) {
        a.removeAttribute('value')
        return
    }
    b.hasOwnProperty('value')
        ? bb(a, b.type, c)
        : b.hasOwnProperty('defaultValue') && bb(a, b.type, Ra(b.defaultValue))
    null == b.checked &&
        null != b.defaultChecked &&
        (a.defaultChecked = !!b.defaultChecked)
}
__name($a, '$a')
function cb(a, b, c) {
    if (b.hasOwnProperty('value') || b.hasOwnProperty('defaultValue')) {
        var d = b.type
        if (
            !(
                ('submit' !== d && 'reset' !== d) ||
                (void 0 !== b.value && null !== b.value)
            )
        )
            return
        b = '' + a._wrapperState.initialValue
        c || b === a.value || (a.value = b)
        a.defaultValue = b
    }
    c = a.name
    '' !== c && (a.name = '')
    a.defaultChecked = !!a._wrapperState.initialChecked
    '' !== c && (a.name = c)
}
__name(cb, 'cb')
function bb(a, b, c) {
    if ('number' !== b || Wa(a.ownerDocument) !== a)
        null == c
            ? (a.defaultValue = '' + a._wrapperState.initialValue)
            : a.defaultValue !== '' + c && (a.defaultValue = '' + c)
}
__name(bb, 'bb')
var db = Array.isArray
function eb(a, b, c, d) {
    a = a.options
    if (b) {
        b = {}
        for (var e = 0; e < c.length; e++) b['$' + c[e]] = true
        for (c = 0; c < a.length; c++)
            (e = b.hasOwnProperty('$' + a[c].value)),
                a[c].selected !== e && (a[c].selected = e),
                e && d && (a[c].defaultSelected = true)
    } else {
        c = '' + Ra(c)
        b = null
        for (e = 0; e < a.length; e++) {
            if (a[e].value === c) {
                a[e].selected = true
                d && (a[e].defaultSelected = true)
                return
            }
            null !== b || a[e].disabled || (b = a[e])
        }
        null !== b && (b.selected = true)
    }
}
__name(eb, 'eb')
function fb(a, b) {
    if (null != b.dangerouslySetInnerHTML) throw Error(p(91))
    return A({}, b, {
        value: void 0,
        defaultValue: void 0,
        children: '' + a._wrapperState.initialValue
    })
}
__name(fb, 'fb')
function gb(a, b) {
    var c = b.value
    if (null == c) {
        c = b.children
        b = b.defaultValue
        if (null != c) {
            if (null != b) throw Error(p(92))
            if (db(c)) {
                if (1 < c.length) throw Error(p(93))
                c = c[0]
            }
            b = c
        }
        null == b && (b = '')
        c = b
    }
    a._wrapperState = { initialValue: Ra(c) }
}
__name(gb, 'gb')
function hb(a, b) {
    var c = Ra(b.value),
        d = Ra(b.defaultValue)
    null != c &&
        ((c = '' + c),
        c !== a.value && (a.value = c),
        null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c))
    null != d && (a.defaultValue = '' + d)
}
__name(hb, 'hb')
function ib(a) {
    var b = a.textContent
    b === a._wrapperState.initialValue &&
        '' !== b &&
        null !== b &&
        (a.value = b)
}
__name(ib, 'ib')
function jb(a) {
    switch (a) {
        case 'svg':
            return 'http://www.w3.org/2000/svg'
        case 'math':
            return 'http://www.w3.org/1998/Math/MathML'
        default:
            return 'http://www.w3.org/1999/xhtml'
    }
}
__name(jb, 'jb')
function kb(a, b) {
    return null == a || 'http://www.w3.org/1999/xhtml' === a
        ? jb(b)
        : 'http://www.w3.org/2000/svg' === a && 'foreignObject' === b
        ? 'http://www.w3.org/1999/xhtml'
        : a
}
__name(kb, 'kb')
var lb,
    mb = (function (a) {
        return 'undefined' !== typeof MSApp && MSApp.execUnsafeLocalFunction
            ? function (b, c, d, e) {
                  MSApp.execUnsafeLocalFunction(function () {
                      return a(b, c, d, e)
                  })
              }
            : a
    })(function (a, b) {
        if ('http://www.w3.org/2000/svg' !== a.namespaceURI || 'innerHTML' in a)
            a.innerHTML = b
        else {
            lb = lb || document.createElement('div')
            lb.innerHTML = '<svg>' + b.valueOf().toString() + '</svg>'
            for (b = lb.firstChild; a.firstChild; ) a.removeChild(a.firstChild)
            for (; b.firstChild; ) a.appendChild(b.firstChild)
        }
    })
function nb(a, b) {
    if (b) {
        var c = a.firstChild
        if (c && c === a.lastChild && 3 === c.nodeType) {
            c.nodeValue = b
            return
        }
    }
    a.textContent = b
}
__name(nb, 'nb')
var ob = {
        animationIterationCount: true,
        aspectRatio: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        columns: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridArea: true,
        gridRow: true,
        gridRowEnd: true,
        gridRowSpan: true,
        gridRowStart: true,
        gridColumn: true,
        gridColumnEnd: true,
        gridColumnSpan: true,
        gridColumnStart: true,
        fontWeight: true,
        lineClamp: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        fillOpacity: true,
        floodOpacity: true,
        stopOpacity: true,
        strokeDasharray: true,
        strokeDashoffset: true,
        strokeMiterlimit: true,
        strokeOpacity: true,
        strokeWidth: true
    },
    pb = ['Webkit', 'ms', 'Moz', 'O']
Object.keys(ob).forEach(function (a) {
    pb.forEach(function (b) {
        b = b + a.charAt(0).toUpperCase() + a.substring(1)
        ob[b] = ob[a]
    })
})
function qb(a, b, c) {
    return null == b || 'boolean' === typeof b || '' === b
        ? ''
        : c ||
          'number' !== typeof b ||
          0 === b ||
          (ob.hasOwnProperty(a) && ob[a])
        ? ('' + b).trim()
        : b + 'px'
}
__name(qb, 'qb')
function rb(a, b) {
    a = a.style
    for (var c in b)
        if (b.hasOwnProperty(c)) {
            var d = 0 === c.indexOf('--'),
                e = qb(c, b[c], d)
            'float' === c && (c = 'cssFloat')
            d ? a.setProperty(c, e) : (a[c] = e)
        }
}
__name(rb, 'rb')
var sb = A(
    { menuitem: true },
    {
        area: true,
        base: true,
        br: true,
        col: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        keygen: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
    }
)
function tb(a, b) {
    if (b) {
        if (sb[a] && (null != b.children || null != b.dangerouslySetInnerHTML))
            throw Error(p(137, a))
        if (null != b.dangerouslySetInnerHTML) {
            if (null != b.children) throw Error(p(60))
            if (
                'object' !== typeof b.dangerouslySetInnerHTML ||
                !('__html' in b.dangerouslySetInnerHTML)
            )
                throw Error(p(61))
        }
        if (null != b.style && 'object' !== typeof b.style) throw Error(p(62))
    }
}
__name(tb, 'tb')
function ub(a, b) {
    if (-1 === a.indexOf('-')) return 'string' === typeof b.is
    switch (a) {
        case 'annotation-xml':
        case 'color-profile':
        case 'font-face':
        case 'font-face-src':
        case 'font-face-uri':
        case 'font-face-format':
        case 'font-face-name':
        case 'missing-glyph':
            return false
        default:
            return true
    }
}
__name(ub, 'ub')
var vb = null
function wb(a) {
    a = a.target || a.srcElement || window
    a.correspondingUseElement && (a = a.correspondingUseElement)
    return 3 === a.nodeType ? a.parentNode : a
}
__name(wb, 'wb')
var xb = null,
    yb = null,
    zb = null
function Ab(a) {
    if ((a = Bb(a))) {
        if ('function' !== typeof xb) throw Error(p(280))
        var b = a.stateNode
        b && ((b = Cb(b)), xb(a.stateNode, a.type, b))
    }
}
__name(Ab, 'Ab')
function Db(a) {
    yb ? (zb ? zb.push(a) : (zb = [a])) : (yb = a)
}
__name(Db, 'Db')
function Eb() {
    if (yb) {
        var a = yb,
            b = zb
        zb = yb = null
        Ab(a)
        if (b) for (a = 0; a < b.length; a++) Ab(b[a])
    }
}
__name(Eb, 'Eb')
function Fb(a, b) {
    return a(b)
}
__name(Fb, 'Fb')
function Gb() {}
__name(Gb, 'Gb')
var Hb = false
function Ib(a, b, c) {
    if (Hb) return a(b, c)
    Hb = true
    try {
        return Fb(a, b, c)
    } finally {
        if (((Hb = false), null !== yb || null !== zb)) Gb(), Eb()
    }
}
__name(Ib, 'Ib')
function Jb(a, b) {
    var c = a.stateNode
    if (null === c) return null
    var d = Cb(c)
    if (null === d) return null
    c = d[b]
    a: switch (b) {
        case 'onClick':
        case 'onClickCapture':
        case 'onDoubleClick':
        case 'onDoubleClickCapture':
        case 'onMouseDown':
        case 'onMouseDownCapture':
        case 'onMouseMove':
        case 'onMouseMoveCapture':
        case 'onMouseUp':
        case 'onMouseUpCapture':
        case 'onMouseEnter':
            ;(d = !d.disabled) ||
                ((a = a.type),
                (d = !(
                    'button' === a ||
                    'input' === a ||
                    'select' === a ||
                    'textarea' === a
                )))
            a = !d
            break a
        default:
            a = false
    }
    if (a) return null
    if (c && 'function' !== typeof c) throw Error(p(231, b, typeof c))
    return c
}
__name(Jb, 'Jb')
var Kb = false
if (ia)
    try {
        var Lb = {}
        Object.defineProperty(Lb, 'passive', {
            get: function () {
                Kb = true
            }
        })
        window.addEventListener('test', Lb, Lb)
        window.removeEventListener('test', Lb, Lb)
    } catch (a) {
        Kb = false
    }
function Mb(a, b, c, d, e, f, g, h, k) {
    var l = Array.prototype.slice.call(arguments, 3)
    try {
        b.apply(c, l)
    } catch (n) {
        this.onError(n)
    }
}
__name(Mb, 'Mb')
var Nb = false,
    Ob = null,
    Pb = false,
    Qb = null,
    Rb = {
        onError: function (a) {
            Nb = true
            Ob = a
        }
    }
function Sb(a, b, c, d, e, f, g, h, k) {
    Nb = false
    Ob = null
    Mb.apply(Rb, arguments)
}
__name(Sb, 'Sb')
function Tb(a, b, c, d, e, f, g, h, k) {
    Sb.apply(this, arguments)
    if (Nb) {
        if (Nb) {
            var l = Ob
            Nb = false
            Ob = null
        } else throw Error(p(198))
        Pb || ((Pb = true), (Qb = l))
    }
}
__name(Tb, 'Tb')
function Ub(a) {
    var b = a,
        c = a
    if (a.alternate) for (; b.return; ) b = b.return
    else {
        a = b
        do (b = a), 0 !== (b.flags & 4098) && (c = b.return), (a = b.return)
        while (a)
    }
    return 3 === b.tag ? c : null
}
__name(Ub, 'Ub')
function Vb(a) {
    if (13 === a.tag) {
        var b = a.memoizedState
        null === b && ((a = a.alternate), null !== a && (b = a.memoizedState))
        if (null !== b) return b.dehydrated
    }
    return null
}
__name(Vb, 'Vb')
function Wb(a) {
    if (Ub(a) !== a) throw Error(p(188))
}
__name(Wb, 'Wb')
function Xb(a) {
    var b = a.alternate
    if (!b) {
        b = Ub(a)
        if (null === b) throw Error(p(188))
        return b !== a ? null : a
    }
    for (var c = a, d = b; ; ) {
        var e = c.return
        if (null === e) break
        var f = e.alternate
        if (null === f) {
            d = e.return
            if (null !== d) {
                c = d
                continue
            }
            break
        }
        if (e.child === f.child) {
            for (f = e.child; f; ) {
                if (f === c) return Wb(e), a
                if (f === d) return Wb(e), b
                f = f.sibling
            }
            throw Error(p(188))
        }
        if (c.return !== d.return) (c = e), (d = f)
        else {
            for (var g = false, h = e.child; h; ) {
                if (h === c) {
                    g = true
                    c = e
                    d = f
                    break
                }
                if (h === d) {
                    g = true
                    d = e
                    c = f
                    break
                }
                h = h.sibling
            }
            if (!g) {
                for (h = f.child; h; ) {
                    if (h === c) {
                        g = true
                        c = f
                        d = e
                        break
                    }
                    if (h === d) {
                        g = true
                        d = f
                        c = e
                        break
                    }
                    h = h.sibling
                }
                if (!g) throw Error(p(189))
            }
        }
        if (c.alternate !== d) throw Error(p(190))
    }
    if (3 !== c.tag) throw Error(p(188))
    return c.stateNode.current === c ? a : b
}
__name(Xb, 'Xb')
function Yb(a) {
    a = Xb(a)
    return null !== a ? Zb(a) : null
}
__name(Yb, 'Yb')
function Zb(a) {
    if (5 === a.tag || 6 === a.tag) return a
    for (a = a.child; null !== a; ) {
        var b = Zb(a)
        if (null !== b) return b
        a = a.sibling
    }
    return null
}
__name(Zb, 'Zb')
var $b = ba.unstable_scheduleCallback,
    ac = ba.unstable_cancelCallback,
    bc = ba.unstable_shouldYield,
    cc = ba.unstable_requestPaint,
    B = ba.unstable_now,
    dc = ba.unstable_getCurrentPriorityLevel,
    ec = ba.unstable_ImmediatePriority,
    fc = ba.unstable_UserBlockingPriority,
    gc = ba.unstable_NormalPriority,
    hc = ba.unstable_LowPriority,
    ic = ba.unstable_IdlePriority,
    jc = null,
    kc = null
function lc(a) {
    if (kc && 'function' === typeof kc.onCommitFiberRoot)
        try {
            kc.onCommitFiberRoot(jc, a, void 0, 128 === (a.current.flags & 128))
        } catch (b) {}
}
__name(lc, 'lc')
var nc = Math.clz32 ? Math.clz32 : mc,
    oc = Math.log,
    pc = Math.LN2
function mc(a) {
    a >>>= 0
    return 0 === a ? 32 : (31 - ((oc(a) / pc) | 0)) | 0
}
__name(mc, 'mc')
var qc = 64,
    rc = 4194304
function sc(a) {
    switch (a & -a) {
        case 1:
            return 1
        case 2:
            return 2
        case 4:
            return 4
        case 8:
            return 8
        case 16:
            return 16
        case 32:
            return 32
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return a & 4194240
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
            return a & 130023424
        case 134217728:
            return 134217728
        case 268435456:
            return 268435456
        case 536870912:
            return 536870912
        case 1073741824:
            return 1073741824
        default:
            return a
    }
}
__name(sc, 'sc')
function tc(a, b) {
    var c = a.pendingLanes
    if (0 === c) return 0
    var d = 0,
        e = a.suspendedLanes,
        f = a.pingedLanes,
        g = c & 268435455
    if (0 !== g) {
        var h = g & ~e
        0 !== h ? (d = sc(h)) : ((f &= g), 0 !== f && (d = sc(f)))
    } else (g = c & ~e), 0 !== g ? (d = sc(g)) : 0 !== f && (d = sc(f))
    if (0 === d) return 0
    if (
        0 !== b &&
        b !== d &&
        0 === (b & e) &&
        ((e = d & -d),
        (f = b & -b),
        e >= f || (16 === e && 0 !== (f & 4194240)))
    )
        return b
    0 !== (d & 4) && (d |= c & 16)
    b = a.entangledLanes
    if (0 !== b)
        for (a = a.entanglements, b &= d; 0 < b; )
            (c = 31 - nc(b)), (e = 1 << c), (d |= a[c]), (b &= ~e)
    return d
}
__name(tc, 'tc')
function uc(a, b) {
    switch (a) {
        case 1:
        case 2:
        case 4:
            return b + 250
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return b + 5e3
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
            return -1
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
            return -1
        default:
            return -1
    }
}
__name(uc, 'uc')
function vc(a, b) {
    for (
        var c = a.suspendedLanes,
            d = a.pingedLanes,
            e = a.expirationTimes,
            f = a.pendingLanes;
        0 < f;

    ) {
        var g = 31 - nc(f),
            h = 1 << g,
            k = e[g]
        if (-1 === k) {
            if (0 === (h & c) || 0 !== (h & d)) e[g] = uc(h, b)
        } else k <= b && (a.expiredLanes |= h)
        f &= ~h
    }
}
__name(vc, 'vc')
function wc(a) {
    a = a.pendingLanes & -1073741825
    return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0
}
__name(wc, 'wc')
function xc() {
    var a = qc
    qc <<= 1
    0 === (qc & 4194240) && (qc = 64)
    return a
}
__name(xc, 'xc')
function yc(a) {
    for (var b = [], c = 0; 31 > c; c++) b.push(a)
    return b
}
__name(yc, 'yc')
function zc(a, b, c) {
    a.pendingLanes |= b
    536870912 !== b && ((a.suspendedLanes = 0), (a.pingedLanes = 0))
    a = a.eventTimes
    b = 31 - nc(b)
    a[b] = c
}
__name(zc, 'zc')
function Ac(a, b) {
    var c = a.pendingLanes & ~b
    a.pendingLanes = b
    a.suspendedLanes = 0
    a.pingedLanes = 0
    a.expiredLanes &= b
    a.mutableReadLanes &= b
    a.entangledLanes &= b
    b = a.entanglements
    var d = a.eventTimes
    for (a = a.expirationTimes; 0 < c; ) {
        var e = 31 - nc(c),
            f = 1 << e
        b[e] = 0
        d[e] = -1
        a[e] = -1
        c &= ~f
    }
}
__name(Ac, 'Ac')
function Bc(a, b) {
    var c = (a.entangledLanes |= b)
    for (a = a.entanglements; c; ) {
        var d = 31 - nc(c),
            e = 1 << d
        ;(e & b) | (a[d] & b) && (a[d] |= b)
        c &= ~e
    }
}
__name(Bc, 'Bc')
var C = 0
function Cc(a) {
    a &= -a
    return 1 < a ? (4 < a ? (0 !== (a & 268435455) ? 16 : 536870912) : 4) : 1
}
__name(Cc, 'Cc')
var Dc,
    Ec,
    Fc,
    Gc,
    Hc,
    Ic = false,
    Jc = [],
    Kc = null,
    Lc = null,
    Mc = null,
    Nc = /* @__PURE__ */ new Map(),
    Oc = /* @__PURE__ */ new Map(),
    Pc = [],
    Qc =
        'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit'.split(
            ' '
        )
function Rc(a, b) {
    switch (a) {
        case 'focusin':
        case 'focusout':
            Kc = null
            break
        case 'dragenter':
        case 'dragleave':
            Lc = null
            break
        case 'mouseover':
        case 'mouseout':
            Mc = null
            break
        case 'pointerover':
        case 'pointerout':
            Nc.delete(b.pointerId)
            break
        case 'gotpointercapture':
        case 'lostpointercapture':
            Oc.delete(b.pointerId)
    }
}
__name(Rc, 'Rc')
function Sc(a, b, c, d, e, f) {
    if (null === a || a.nativeEvent !== f)
        return (
            (a = {
                blockedOn: b,
                domEventName: c,
                eventSystemFlags: d,
                nativeEvent: f,
                targetContainers: [e]
            }),
            null !== b && ((b = Bb(b)), null !== b && Ec(b)),
            a
        )
    a.eventSystemFlags |= d
    b = a.targetContainers
    null !== e && -1 === b.indexOf(e) && b.push(e)
    return a
}
__name(Sc, 'Sc')
function Tc(a, b, c, d, e) {
    switch (b) {
        case 'focusin':
            return (Kc = Sc(Kc, a, b, c, d, e)), true
        case 'dragenter':
            return (Lc = Sc(Lc, a, b, c, d, e)), true
        case 'mouseover':
            return (Mc = Sc(Mc, a, b, c, d, e)), true
        case 'pointerover':
            var f = e.pointerId
            Nc.set(f, Sc(Nc.get(f) || null, a, b, c, d, e))
            return true
        case 'gotpointercapture':
            return (
                (f = e.pointerId),
                Oc.set(f, Sc(Oc.get(f) || null, a, b, c, d, e)),
                true
            )
    }
    return false
}
__name(Tc, 'Tc')
function Uc(a) {
    var b = Vc(a.target)
    if (null !== b) {
        var c = Ub(b)
        if (null !== c) {
            if (((b = c.tag), 13 === b)) {
                if (((b = Vb(c)), null !== b)) {
                    a.blockedOn = b
                    Hc(a.priority, function () {
                        Fc(c)
                    })
                    return
                }
            } else if (
                3 === b &&
                c.stateNode.current.memoizedState.isDehydrated
            ) {
                a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null
                return
            }
        }
    }
    a.blockedOn = null
}
__name(Uc, 'Uc')
function Wc(a) {
    if (null !== a.blockedOn) return false
    for (var b = a.targetContainers; 0 < b.length; ) {
        var c = Xc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent)
        if (null === c) {
            c = a.nativeEvent
            var d = new c.constructor(c.type, c)
            vb = d
            c.target.dispatchEvent(d)
            vb = null
        } else return (b = Bb(c)), null !== b && Ec(b), (a.blockedOn = c), false
        b.shift()
    }
    return true
}
__name(Wc, 'Wc')
function Yc(a, b, c) {
    Wc(a) && c.delete(b)
}
__name(Yc, 'Yc')
function Zc() {
    Ic = false
    null !== Kc && Wc(Kc) && (Kc = null)
    null !== Lc && Wc(Lc) && (Lc = null)
    null !== Mc && Wc(Mc) && (Mc = null)
    Nc.forEach(Yc)
    Oc.forEach(Yc)
}
__name(Zc, 'Zc')
function $c(a, b) {
    a.blockedOn === b &&
        ((a.blockedOn = null),
        Ic ||
            ((Ic = true),
            ba.unstable_scheduleCallback(ba.unstable_NormalPriority, Zc)))
}
__name($c, '$c')
function ad(a) {
    function b(b2) {
        return $c(b2, a)
    }
    __name(b, 'b')
    if (0 < Jc.length) {
        $c(Jc[0], a)
        for (var c = 1; c < Jc.length; c++) {
            var d = Jc[c]
            d.blockedOn === a && (d.blockedOn = null)
        }
    }
    null !== Kc && $c(Kc, a)
    null !== Lc && $c(Lc, a)
    null !== Mc && $c(Mc, a)
    Nc.forEach(b)
    Oc.forEach(b)
    for (c = 0; c < Pc.length; c++)
        (d = Pc[c]), d.blockedOn === a && (d.blockedOn = null)
    for (; 0 < Pc.length && ((c = Pc[0]), null === c.blockedOn); )
        Uc(c), null === c.blockedOn && Pc.shift()
}
__name(ad, 'ad')
var bd = ta.ReactCurrentBatchConfig,
    cd = true
function dd(a, b, c, d) {
    var e = C,
        f = bd.transition
    bd.transition = null
    try {
        ;(C = 1), ed(a, b, c, d)
    } finally {
        ;(C = e), (bd.transition = f)
    }
}
__name(dd, 'dd')
function fd(a, b, c, d) {
    var e = C,
        f = bd.transition
    bd.transition = null
    try {
        ;(C = 4), ed(a, b, c, d)
    } finally {
        ;(C = e), (bd.transition = f)
    }
}
__name(fd, 'fd')
function ed(a, b, c, d) {
    if (cd) {
        var e = Xc(a, b, c, d)
        if (null === e) gd(a, b, d, hd, c), Rc(a, d)
        else if (Tc(e, a, b, c, d)) d.stopPropagation()
        else if ((Rc(a, d), b & 4 && -1 < Qc.indexOf(a))) {
            for (; null !== e; ) {
                var f = Bb(e)
                null !== f && Dc(f)
                f = Xc(a, b, c, d)
                null === f && gd(a, b, d, hd, c)
                if (f === e) break
                e = f
            }
            null !== e && d.stopPropagation()
        } else gd(a, b, d, null, c)
    }
}
__name(ed, 'ed')
var hd = null
function Xc(a, b, c, d) {
    hd = null
    a = wb(d)
    a = Vc(a)
    if (null !== a)
        if (((b = Ub(a)), null === b)) a = null
        else if (((c = b.tag), 13 === c)) {
            a = Vb(b)
            if (null !== a) return a
            a = null
        } else if (3 === c) {
            if (b.stateNode.current.memoizedState.isDehydrated)
                return 3 === b.tag ? b.stateNode.containerInfo : null
            a = null
        } else b !== a && (a = null)
    hd = a
    return null
}
__name(Xc, 'Xc')
function id(a) {
    switch (a) {
        case 'cancel':
        case 'click':
        case 'close':
        case 'contextmenu':
        case 'copy':
        case 'cut':
        case 'auxclick':
        case 'dblclick':
        case 'dragend':
        case 'dragstart':
        case 'drop':
        case 'focusin':
        case 'focusout':
        case 'input':
        case 'invalid':
        case 'keydown':
        case 'keypress':
        case 'keyup':
        case 'mousedown':
        case 'mouseup':
        case 'paste':
        case 'pause':
        case 'play':
        case 'pointercancel':
        case 'pointerdown':
        case 'pointerup':
        case 'ratechange':
        case 'reset':
        case 'resize':
        case 'seeked':
        case 'submit':
        case 'touchcancel':
        case 'touchend':
        case 'touchstart':
        case 'volumechange':
        case 'change':
        case 'selectionchange':
        case 'textInput':
        case 'compositionstart':
        case 'compositionend':
        case 'compositionupdate':
        case 'beforeblur':
        case 'afterblur':
        case 'beforeinput':
        case 'blur':
        case 'fullscreenchange':
        case 'focus':
        case 'hashchange':
        case 'popstate':
        case 'select':
        case 'selectstart':
            return 1
        case 'drag':
        case 'dragenter':
        case 'dragexit':
        case 'dragleave':
        case 'dragover':
        case 'mousemove':
        case 'mouseout':
        case 'mouseover':
        case 'pointermove':
        case 'pointerout':
        case 'pointerover':
        case 'scroll':
        case 'toggle':
        case 'touchmove':
        case 'wheel':
        case 'mouseenter':
        case 'mouseleave':
        case 'pointerenter':
        case 'pointerleave':
            return 4
        case 'message':
            switch (dc()) {
                case ec:
                    return 1
                case fc:
                    return 4
                case gc:
                case hc:
                    return 16
                case ic:
                    return 536870912
                default:
                    return 16
            }
        default:
            return 16
    }
}
__name(id, 'id')
var jd = null,
    kd = null,
    ld = null
function md() {
    if (ld) return ld
    var a,
        b = kd,
        c = b.length,
        d,
        e = 'value' in jd ? jd.value : jd.textContent,
        f = e.length
    for (a = 0; a < c && b[a] === e[a]; a++);
    var g = c - a
    for (d = 1; d <= g && b[c - d] === e[f - d]; d++);
    return (ld = e.slice(a, 1 < d ? 1 - d : void 0))
}
__name(md, 'md')
function nd(a) {
    var b = a.keyCode
    'charCode' in a
        ? ((a = a.charCode), 0 === a && 13 === b && (a = 13))
        : (a = b)
    10 === a && (a = 13)
    return 32 <= a || 13 === a ? a : 0
}
__name(nd, 'nd')
function od() {
    return true
}
__name(od, 'od')
function pd() {
    return false
}
__name(pd, 'pd')
function qd(a) {
    function b(b2, d, e, f, g) {
        this._reactName = b2
        this._targetInst = e
        this.type = d
        this.nativeEvent = f
        this.target = g
        this.currentTarget = null
        for (var c in a)
            a.hasOwnProperty(c) && ((b2 = a[c]), (this[c] = b2 ? b2(f) : f[c]))
        this.isDefaultPrevented = (
            null != f.defaultPrevented
                ? f.defaultPrevented
                : false === f.returnValue
        )
            ? od
            : pd
        this.isPropagationStopped = pd
        return this
    }
    __name(b, 'b')
    A(b.prototype, {
        preventDefault: function () {
            this.defaultPrevented = true
            var a2 = this.nativeEvent
            a2 &&
                (a2.preventDefault
                    ? a2.preventDefault()
                    : 'unknown' !== typeof a2.returnValue &&
                      (a2.returnValue = false),
                (this.isDefaultPrevented = od))
        },
        stopPropagation: function () {
            var a2 = this.nativeEvent
            a2 &&
                (a2.stopPropagation
                    ? a2.stopPropagation()
                    : 'unknown' !== typeof a2.cancelBubble &&
                      (a2.cancelBubble = true),
                (this.isPropagationStopped = od))
        },
        persist: function () {},
        isPersistent: od
    })
    return b
}
__name(qd, 'qd')
var rd = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (a) {
            return a.timeStamp || Date.now()
        },
        defaultPrevented: 0,
        isTrusted: 0
    },
    sd = qd(rd),
    td = A({}, rd, { view: 0, detail: 0 }),
    ud = qd(td),
    vd,
    wd,
    xd,
    zd = A({}, td, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: yd,
        button: 0,
        buttons: 0,
        relatedTarget: function (a) {
            return void 0 === a.relatedTarget
                ? a.fromElement === a.srcElement
                    ? a.toElement
                    : a.fromElement
                : a.relatedTarget
        },
        movementX: function (a) {
            if ('movementX' in a) return a.movementX
            a !== xd &&
                (xd && 'mousemove' === a.type
                    ? ((vd = a.screenX - xd.screenX),
                      (wd = a.screenY - xd.screenY))
                    : (wd = vd = 0),
                (xd = a))
            return vd
        },
        movementY: function (a) {
            return 'movementY' in a ? a.movementY : wd
        }
    }),
    Ad = qd(zd),
    Bd = A({}, zd, { dataTransfer: 0 }),
    Cd = qd(Bd),
    Dd = A({}, td, { relatedTarget: 0 }),
    Ed = qd(Dd),
    Fd = A({}, rd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Gd = qd(Fd),
    Hd = A({}, rd, {
        clipboardData: function (a) {
            return 'clipboardData' in a ? a.clipboardData : window.clipboardData
        }
    }),
    Id = qd(Hd),
    Jd = A({}, rd, { data: 0 }),
    Kd = qd(Jd),
    Ld = {
        Esc: 'Escape',
        Spacebar: ' ',
        Left: 'ArrowLeft',
        Up: 'ArrowUp',
        Right: 'ArrowRight',
        Down: 'ArrowDown',
        Del: 'Delete',
        Win: 'OS',
        Menu: 'ContextMenu',
        Apps: 'ContextMenu',
        Scroll: 'ScrollLock',
        MozPrintableKey: 'Unidentified'
    },
    Md = {
        8: 'Backspace',
        9: 'Tab',
        12: 'Clear',
        13: 'Enter',
        16: 'Shift',
        17: 'Control',
        18: 'Alt',
        19: 'Pause',
        20: 'CapsLock',
        27: 'Escape',
        32: ' ',
        33: 'PageUp',
        34: 'PageDown',
        35: 'End',
        36: 'Home',
        37: 'ArrowLeft',
        38: 'ArrowUp',
        39: 'ArrowRight',
        40: 'ArrowDown',
        45: 'Insert',
        46: 'Delete',
        112: 'F1',
        113: 'F2',
        114: 'F3',
        115: 'F4',
        116: 'F5',
        117: 'F6',
        118: 'F7',
        119: 'F8',
        120: 'F9',
        121: 'F10',
        122: 'F11',
        123: 'F12',
        144: 'NumLock',
        145: 'ScrollLock',
        224: 'Meta'
    },
    Nd = {
        Alt: 'altKey',
        Control: 'ctrlKey',
        Meta: 'metaKey',
        Shift: 'shiftKey'
    }
function Od(a) {
    var b = this.nativeEvent
    return b.getModifierState
        ? b.getModifierState(a)
        : (a = Nd[a])
        ? !!b[a]
        : false
}
__name(Od, 'Od')
function yd() {
    return Od
}
__name(yd, 'yd')
var Pd = A({}, td, {
        key: function (a) {
            if (a.key) {
                var b = Ld[a.key] || a.key
                if ('Unidentified' !== b) return b
            }
            return 'keypress' === a.type
                ? ((a = nd(a)), 13 === a ? 'Enter' : String.fromCharCode(a))
                : 'keydown' === a.type || 'keyup' === a.type
                ? Md[a.keyCode] || 'Unidentified'
                : ''
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: yd,
        charCode: function (a) {
            return 'keypress' === a.type ? nd(a) : 0
        },
        keyCode: function (a) {
            return 'keydown' === a.type || 'keyup' === a.type ? a.keyCode : 0
        },
        which: function (a) {
            return 'keypress' === a.type
                ? nd(a)
                : 'keydown' === a.type || 'keyup' === a.type
                ? a.keyCode
                : 0
        }
    }),
    Qd = qd(Pd),
    Rd = A({}, zd, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0
    }),
    Sd = qd(Rd),
    Td = A({}, td, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: yd
    }),
    Ud = qd(Td),
    Vd = A({}, rd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Wd = qd(Vd),
    Xd = A({}, zd, {
        deltaX: function (a) {
            return 'deltaX' in a
                ? a.deltaX
                : 'wheelDeltaX' in a
                ? -a.wheelDeltaX
                : 0
        },
        deltaY: function (a) {
            return 'deltaY' in a
                ? a.deltaY
                : 'wheelDeltaY' in a
                ? -a.wheelDeltaY
                : 'wheelDelta' in a
                ? -a.wheelDelta
                : 0
        },
        deltaZ: 0,
        deltaMode: 0
    }),
    Yd = qd(Xd),
    Zd = [9, 13, 27, 32],
    $d = ia && 'CompositionEvent' in window,
    ae = null
ia && 'documentMode' in document && (ae = document.documentMode)
var be = ia && 'TextEvent' in window && !ae,
    ce = ia && (!$d || (ae && 8 < ae && 11 >= ae)),
    de = String.fromCharCode(32),
    ee = false
function fe(a, b) {
    switch (a) {
        case 'keyup':
            return -1 !== Zd.indexOf(b.keyCode)
        case 'keydown':
            return 229 !== b.keyCode
        case 'keypress':
        case 'mousedown':
        case 'focusout':
            return true
        default:
            return false
    }
}
__name(fe, 'fe')
function ge(a) {
    a = a.detail
    return 'object' === typeof a && 'data' in a ? a.data : null
}
__name(ge, 'ge')
var he = false
function ie(a, b) {
    switch (a) {
        case 'compositionend':
            return ge(b)
        case 'keypress':
            if (32 !== b.which) return null
            ee = true
            return de
        case 'textInput':
            return (a = b.data), a === de && ee ? null : a
        default:
            return null
    }
}
__name(ie, 'ie')
function je(a, b) {
    if (he)
        return 'compositionend' === a || (!$d && fe(a, b))
            ? ((a = md()), (ld = kd = jd = null), (he = false), a)
            : null
    switch (a) {
        case 'paste':
            return null
        case 'keypress':
            if (
                !(b.ctrlKey || b.altKey || b.metaKey) ||
                (b.ctrlKey && b.altKey)
            ) {
                if (b.char && 1 < b.char.length) return b.char
                if (b.which) return String.fromCharCode(b.which)
            }
            return null
        case 'compositionend':
            return ce && 'ko' !== b.locale ? null : b.data
        default:
            return null
    }
}
__name(je, 'je')
var ke = {
    color: true,
    date: true,
    datetime: true,
    'datetime-local': true,
    email: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true
}
function le(a) {
    var b = a && a.nodeName && a.nodeName.toLowerCase()
    return 'input' === b ? !!ke[a.type] : 'textarea' === b ? true : false
}
__name(le, 'le')
function me(a, b, c, d) {
    Db(d)
    b = ne(b, 'onChange')
    0 < b.length &&
        ((c = new sd('onChange', 'change', null, c, d)),
        a.push({ event: c, listeners: b }))
}
__name(me, 'me')
var oe = null,
    pe = null
function qe(a) {
    re(a, 0)
}
__name(qe, 'qe')
function se(a) {
    var b = te(a)
    if (Va(b)) return a
}
__name(se, 'se')
function ue(a, b) {
    if ('change' === a) return b
}
__name(ue, 'ue')
var ve = false
if (ia) {
    var we
    if (ia) {
        var xe = 'oninput' in document
        if (!xe) {
            var ye = document.createElement('div')
            ye.setAttribute('oninput', 'return;')
            xe = 'function' === typeof ye.oninput
        }
        we = xe
    } else we = false
    ve = we && (!document.documentMode || 9 < document.documentMode)
}
function ze() {
    oe && (oe.detachEvent('onpropertychange', Ae), (pe = oe = null))
}
__name(ze, 'ze')
function Ae(a) {
    if ('value' === a.propertyName && se(pe)) {
        var b = []
        me(b, pe, a, wb(a))
        Ib(qe, b)
    }
}
__name(Ae, 'Ae')
function Be(a, b, c) {
    'focusin' === a
        ? (ze(), (oe = b), (pe = c), oe.attachEvent('onpropertychange', Ae))
        : 'focusout' === a && ze()
}
__name(Be, 'Be')
function Ce(a) {
    if ('selectionchange' === a || 'keyup' === a || 'keydown' === a)
        return se(pe)
}
__name(Ce, 'Ce')
function De(a, b) {
    if ('click' === a) return se(b)
}
__name(De, 'De')
function Ee(a, b) {
    if ('input' === a || 'change' === a) return se(b)
}
__name(Ee, 'Ee')
function Fe(a, b) {
    return (a === b && (0 !== a || 1 / a === 1 / b)) || (a !== a && b !== b)
}
__name(Fe, 'Fe')
var Ge = 'function' === typeof Object.is ? Object.is : Fe
function He(a, b) {
    if (Ge(a, b)) return true
    if (
        'object' !== typeof a ||
        null === a ||
        'object' !== typeof b ||
        null === b
    )
        return false
    var c = Object.keys(a),
        d = Object.keys(b)
    if (c.length !== d.length) return false
    for (d = 0; d < c.length; d++) {
        var e = c[d]
        if (!ja.call(b, e) || !Ge(a[e], b[e])) return false
    }
    return true
}
__name(He, 'He')
function Ie(a) {
    for (; a && a.firstChild; ) a = a.firstChild
    return a
}
__name(Ie, 'Ie')
function Je(a, b) {
    var c = Ie(a)
    a = 0
    for (var d; c; ) {
        if (3 === c.nodeType) {
            d = a + c.textContent.length
            if (a <= b && d >= b) return { node: c, offset: b - a }
            a = d
        }
        a: {
            for (; c; ) {
                if (c.nextSibling) {
                    c = c.nextSibling
                    break a
                }
                c = c.parentNode
            }
            c = void 0
        }
        c = Ie(c)
    }
}
__name(Je, 'Je')
function Ke(a, b) {
    return a && b
        ? a === b
            ? true
            : a && 3 === a.nodeType
            ? false
            : b && 3 === b.nodeType
            ? Ke(a, b.parentNode)
            : 'contains' in a
            ? a.contains(b)
            : a.compareDocumentPosition
            ? !!(a.compareDocumentPosition(b) & 16)
            : false
        : false
}
__name(Ke, 'Ke')
function Le() {
    for (var a = window, b = Wa(); b instanceof a.HTMLIFrameElement; ) {
        try {
            var c = 'string' === typeof b.contentWindow.location.href
        } catch (d) {
            c = false
        }
        if (c) a = b.contentWindow
        else break
        b = Wa(a.document)
    }
    return b
}
__name(Le, 'Le')
function Me(a) {
    var b = a && a.nodeName && a.nodeName.toLowerCase()
    return (
        b &&
        (('input' === b &&
            ('text' === a.type ||
                'search' === a.type ||
                'tel' === a.type ||
                'url' === a.type ||
                'password' === a.type)) ||
            'textarea' === b ||
            'true' === a.contentEditable)
    )
}
__name(Me, 'Me')
function Ne(a) {
    var b = Le(),
        c = a.focusedElem,
        d = a.selectionRange
    if (
        b !== c &&
        c &&
        c.ownerDocument &&
        Ke(c.ownerDocument.documentElement, c)
    ) {
        if (null !== d && Me(c)) {
            if (
                ((b = d.start),
                (a = d.end),
                void 0 === a && (a = b),
                'selectionStart' in c)
            )
                (c.selectionStart = b),
                    (c.selectionEnd = Math.min(a, c.value.length))
            else if (
                ((a =
                    ((b = c.ownerDocument || document) && b.defaultView) ||
                    window),
                a.getSelection)
            ) {
                a = a.getSelection()
                var e = c.textContent.length,
                    f = Math.min(d.start, e)
                d = void 0 === d.end ? f : Math.min(d.end, e)
                !a.extend && f > d && ((e = d), (d = f), (f = e))
                e = Je(c, f)
                var g = Je(c, d)
                e &&
                    g &&
                    (1 !== a.rangeCount ||
                        a.anchorNode !== e.node ||
                        a.anchorOffset !== e.offset ||
                        a.focusNode !== g.node ||
                        a.focusOffset !== g.offset) &&
                    ((b = b.createRange()),
                    b.setStart(e.node, e.offset),
                    a.removeAllRanges(),
                    f > d
                        ? (a.addRange(b), a.extend(g.node, g.offset))
                        : (b.setEnd(g.node, g.offset), a.addRange(b)))
            }
        }
        b = []
        for (a = c; (a = a.parentNode); )
            1 === a.nodeType &&
                b.push({ element: a, left: a.scrollLeft, top: a.scrollTop })
        'function' === typeof c.focus && c.focus()
        for (c = 0; c < b.length; c++)
            (a = b[c]),
                (a.element.scrollLeft = a.left),
                (a.element.scrollTop = a.top)
    }
}
__name(Ne, 'Ne')
var Oe = ia && 'documentMode' in document && 11 >= document.documentMode,
    Pe = null,
    Qe = null,
    Re = null,
    Se = false
function Te(a, b, c) {
    var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument
    Se ||
        null == Pe ||
        Pe !== Wa(d) ||
        ((d = Pe),
        'selectionStart' in d && Me(d)
            ? (d = { start: d.selectionStart, end: d.selectionEnd })
            : ((d = (
                  (d.ownerDocument && d.ownerDocument.defaultView) ||
                  window
              ).getSelection()),
              (d = {
                  anchorNode: d.anchorNode,
                  anchorOffset: d.anchorOffset,
                  focusNode: d.focusNode,
                  focusOffset: d.focusOffset
              })),
        (Re && He(Re, d)) ||
            ((Re = d),
            (d = ne(Qe, 'onSelect')),
            0 < d.length &&
                ((b = new sd('onSelect', 'select', null, b, c)),
                a.push({ event: b, listeners: d }),
                (b.target = Pe))))
}
__name(Te, 'Te')
function Ue(a, b) {
    var c = {}
    c[a.toLowerCase()] = b.toLowerCase()
    c['Webkit' + a] = 'webkit' + b
    c['Moz' + a] = 'moz' + b
    return c
}
__name(Ue, 'Ue')
var Ve = {
        animationend: Ue('Animation', 'AnimationEnd'),
        animationiteration: Ue('Animation', 'AnimationIteration'),
        animationstart: Ue('Animation', 'AnimationStart'),
        transitionend: Ue('Transition', 'TransitionEnd')
    },
    We = {},
    Xe = {}
ia &&
    ((Xe = document.createElement('div').style),
    'AnimationEvent' in window ||
        (delete Ve.animationend.animation,
        delete Ve.animationiteration.animation,
        delete Ve.animationstart.animation),
    'TransitionEvent' in window || delete Ve.transitionend.transition)
function Ye(a) {
    if (We[a]) return We[a]
    if (!Ve[a]) return a
    var b = Ve[a],
        c
    for (c in b) if (b.hasOwnProperty(c) && c in Xe) return (We[a] = b[c])
    return a
}
__name(Ye, 'Ye')
var Ze = Ye('animationend'),
    $e = Ye('animationiteration'),
    af = Ye('animationstart'),
    bf = Ye('transitionend'),
    cf = /* @__PURE__ */ new Map(),
    df =
        'abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
            ' '
        )
function ef(a, b) {
    cf.set(a, b)
    fa(b, [a])
}
__name(ef, 'ef')
for (var ff = 0; ff < df.length; ff++) {
    var gf = df[ff],
        hf = gf.toLowerCase(),
        jf = gf[0].toUpperCase() + gf.slice(1)
    ef(hf, 'on' + jf)
}
ef(Ze, 'onAnimationEnd')
ef($e, 'onAnimationIteration')
ef(af, 'onAnimationStart')
ef('dblclick', 'onDoubleClick')
ef('focusin', 'onFocus')
ef('focusout', 'onBlur')
ef(bf, 'onTransitionEnd')
ha('onMouseEnter', ['mouseout', 'mouseover'])
ha('onMouseLeave', ['mouseout', 'mouseover'])
ha('onPointerEnter', ['pointerout', 'pointerover'])
ha('onPointerLeave', ['pointerout', 'pointerover'])
fa(
    'onChange',
    'change click focusin focusout input keydown keyup selectionchange'.split(
        ' '
    )
)
fa(
    'onSelect',
    'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' '
    )
)
fa('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste'])
fa(
    'onCompositionEnd',
    'compositionend focusout keydown keypress keyup mousedown'.split(' ')
)
fa(
    'onCompositionStart',
    'compositionstart focusout keydown keypress keyup mousedown'.split(' ')
)
fa(
    'onCompositionUpdate',
    'compositionupdate focusout keydown keypress keyup mousedown'.split(' ')
)
var kf =
        'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
            ' '
        ),
    lf = new Set(
        'cancel close invalid load scroll toggle'.split(' ').concat(kf)
    )
function mf(a, b, c) {
    var d = a.type || 'unknown-event'
    a.currentTarget = c
    Tb(d, b, void 0, a)
    a.currentTarget = null
}
__name(mf, 'mf')
function re(a, b) {
    b = 0 !== (b & 4)
    for (var c = 0; c < a.length; c++) {
        var d = a[c],
            e = d.event
        d = d.listeners
        a: {
            var f = void 0
            if (b)
                for (var g = d.length - 1; 0 <= g; g--) {
                    var h = d[g],
                        k = h.instance,
                        l = h.currentTarget
                    h = h.listener
                    if (k !== f && e.isPropagationStopped()) break a
                    mf(e, h, l)
                    f = k
                }
            else
                for (g = 0; g < d.length; g++) {
                    h = d[g]
                    k = h.instance
                    l = h.currentTarget
                    h = h.listener
                    if (k !== f && e.isPropagationStopped()) break a
                    mf(e, h, l)
                    f = k
                }
        }
    }
    if (Pb) throw ((a = Qb), (Pb = false), (Qb = null), a)
}
__name(re, 're')
function D(a, b) {
    var c = b[nf]
    void 0 === c && (c = b[nf] = /* @__PURE__ */ new Set())
    var d = a + '__bubble'
    c.has(d) || (of(b, a, 2, false), c.add(d))
}
__name(D, 'D')
function pf(a, b, c) {
    var d = 0
    b && (d |= 4)
    of(c, a, d, b)
}
__name(pf, 'pf')
var qf = '_reactListening' + Math.random().toString(36).slice(2)
function rf(a) {
    if (!a[qf]) {
        a[qf] = true
        da.forEach(function (b2) {
            'selectionchange' !== b2 &&
                (lf.has(b2) || pf(b2, false, a), pf(b2, true, a))
        })
        var b = 9 === a.nodeType ? a : a.ownerDocument
        null === b || b[qf] || ((b[qf] = true), pf('selectionchange', false, b))
    }
}
__name(rf, 'rf')
function of(a, b, c, d) {
    switch (id(b)) {
        case 1:
            var e = dd
            break
        case 4:
            e = fd
            break
        default:
            e = ed
    }
    c = e.bind(null, b, c, a)
    e = void 0
    !Kb ||
        ('touchstart' !== b && 'touchmove' !== b && 'wheel' !== b) ||
        (e = true)
    d
        ? void 0 !== e
            ? a.addEventListener(b, c, { capture: true, passive: e })
            : a.addEventListener(b, c, true)
        : void 0 !== e
        ? a.addEventListener(b, c, { passive: e })
        : a.addEventListener(b, c, false)
}
__name(of, 'of')
function gd(a, b, c, d, e) {
    var f = d
    if (0 === (b & 1) && 0 === (b & 2) && null !== d)
        a: for (;;) {
            if (null === d) return
            var g = d.tag
            if (3 === g || 4 === g) {
                var h = d.stateNode.containerInfo
                if (h === e || (8 === h.nodeType && h.parentNode === e)) break
                if (4 === g)
                    for (g = d.return; null !== g; ) {
                        var k = g.tag
                        if (3 === k || 4 === k) {
                            if (
                                ((k = g.stateNode.containerInfo),
                                k === e ||
                                    (8 === k.nodeType && k.parentNode === e))
                            )
                                return
                        }
                        g = g.return
                    }
                for (; null !== h; ) {
                    g = Vc(h)
                    if (null === g) return
                    k = g.tag
                    if (5 === k || 6 === k) {
                        d = f = g
                        continue a
                    }
                    h = h.parentNode
                }
            }
            d = d.return
        }
    Ib(function () {
        var d2 = f,
            e2 = wb(c),
            g2 = []
        a: {
            var h2 = cf.get(a)
            if (void 0 !== h2) {
                var k2 = sd,
                    m = a
                switch (a) {
                    case 'keypress':
                        if (0 === nd(c)) break a
                    case 'keydown':
                    case 'keyup':
                        k2 = Qd
                        break
                    case 'focusin':
                        m = 'focus'
                        k2 = Ed
                        break
                    case 'focusout':
                        m = 'blur'
                        k2 = Ed
                        break
                    case 'beforeblur':
                    case 'afterblur':
                        k2 = Ed
                        break
                    case 'click':
                        if (2 === c.button) break a
                    case 'auxclick':
                    case 'dblclick':
                    case 'mousedown':
                    case 'mousemove':
                    case 'mouseup':
                    case 'mouseout':
                    case 'mouseover':
                    case 'contextmenu':
                        k2 = Ad
                        break
                    case 'drag':
                    case 'dragend':
                    case 'dragenter':
                    case 'dragexit':
                    case 'dragleave':
                    case 'dragover':
                    case 'dragstart':
                    case 'drop':
                        k2 = Cd
                        break
                    case 'touchcancel':
                    case 'touchend':
                    case 'touchmove':
                    case 'touchstart':
                        k2 = Ud
                        break
                    case Ze:
                    case $e:
                    case af:
                        k2 = Gd
                        break
                    case bf:
                        k2 = Wd
                        break
                    case 'scroll':
                        k2 = ud
                        break
                    case 'wheel':
                        k2 = Yd
                        break
                    case 'copy':
                    case 'cut':
                    case 'paste':
                        k2 = Id
                        break
                    case 'gotpointercapture':
                    case 'lostpointercapture':
                    case 'pointercancel':
                    case 'pointerdown':
                    case 'pointermove':
                    case 'pointerout':
                    case 'pointerover':
                    case 'pointerup':
                        k2 = Sd
                }
                var w = 0 !== (b & 4),
                    J = !w && 'scroll' === a,
                    v = w ? (null !== h2 ? h2 + 'Capture' : null) : h2
                w = []
                for (var x = d2, r; null !== x; ) {
                    r = x
                    var F = r.stateNode
                    5 === r.tag &&
                        null !== F &&
                        ((r = F),
                        null !== v &&
                            ((F = Jb(x, v)), null != F && w.push(sf(x, F, r))))
                    if (J) break
                    x = x.return
                }
                0 < w.length &&
                    ((h2 = new k2(h2, m, null, c, e2)),
                    g2.push({ event: h2, listeners: w }))
            }
        }
        if (0 === (b & 7)) {
            a: {
                h2 = 'mouseover' === a || 'pointerover' === a
                k2 = 'mouseout' === a || 'pointerout' === a
                if (
                    h2 &&
                    c !== vb &&
                    (m = c.relatedTarget || c.fromElement) &&
                    (Vc(m) || m[tf])
                )
                    break a
                if (k2 || h2) {
                    h2 =
                        e2.window === e2
                            ? e2
                            : (h2 = e2.ownerDocument)
                            ? h2.defaultView || h2.parentWindow
                            : window
                    if (k2) {
                        if (
                            ((m = c.relatedTarget || c.toElement),
                            (k2 = d2),
                            (m = m ? Vc(m) : null),
                            null !== m &&
                                ((J = Ub(m)),
                                m !== J || (5 !== m.tag && 6 !== m.tag)))
                        )
                            m = null
                    } else (k2 = null), (m = d2)
                    if (k2 !== m) {
                        w = Ad
                        F = 'onMouseLeave'
                        v = 'onMouseEnter'
                        x = 'mouse'
                        if ('pointerout' === a || 'pointerover' === a)
                            (w = Sd),
                                (F = 'onPointerLeave'),
                                (v = 'onPointerEnter'),
                                (x = 'pointer')
                        J = null == k2 ? h2 : te(k2)
                        r = null == m ? h2 : te(m)
                        h2 = new w(F, x + 'leave', k2, c, e2)
                        h2.target = J
                        h2.relatedTarget = r
                        F = null
                        Vc(e2) === d2 &&
                            ((w = new w(v, x + 'enter', m, c, e2)),
                            (w.target = r),
                            (w.relatedTarget = J),
                            (F = w))
                        J = F
                        if (k2 && m)
                            b: {
                                w = k2
                                v = m
                                x = 0
                                for (r = w; r; r = uf(r)) x++
                                r = 0
                                for (F = v; F; F = uf(F)) r++
                                for (; 0 < x - r; ) (w = uf(w)), x--
                                for (; 0 < r - x; ) (v = uf(v)), r--
                                for (; x--; ) {
                                    if (
                                        w === v ||
                                        (null !== v && w === v.alternate)
                                    )
                                        break b
                                    w = uf(w)
                                    v = uf(v)
                                }
                                w = null
                            }
                        else w = null
                        null !== k2 && vf(g2, h2, k2, w, false)
                        null !== m && null !== J && vf(g2, J, m, w, true)
                    }
                }
            }
            a: {
                h2 = d2 ? te(d2) : window
                k2 = h2.nodeName && h2.nodeName.toLowerCase()
                if ('select' === k2 || ('input' === k2 && 'file' === h2.type))
                    var Z = ue
                else if (le(h2))
                    if (ve) Z = Ee
                    else {
                        Z = Ce
                        var ya = Be
                    }
                else
                    (k2 = h2.nodeName) &&
                        'input' === k2.toLowerCase() &&
                        ('checkbox' === h2.type || 'radio' === h2.type) &&
                        (Z = De)
                if (Z && (Z = Z(a, d2))) {
                    me(g2, Z, c, e2)
                    break a
                }
                ya && ya(a, h2, d2)
                'focusout' === a &&
                    (ya = h2._wrapperState) &&
                    ya.controlled &&
                    'number' === h2.type &&
                    bb(h2, 'number', h2.value)
            }
            ya = d2 ? te(d2) : window
            switch (a) {
                case 'focusin':
                    if (le(ya) || 'true' === ya.contentEditable)
                        (Pe = ya), (Qe = d2), (Re = null)
                    break
                case 'focusout':
                    Re = Qe = Pe = null
                    break
                case 'mousedown':
                    Se = true
                    break
                case 'contextmenu':
                case 'mouseup':
                case 'dragend':
                    Se = false
                    Te(g2, c, e2)
                    break
                case 'selectionchange':
                    if (Oe) break
                case 'keydown':
                case 'keyup':
                    Te(g2, c, e2)
            }
            var ab
            if ($d)
                b: {
                    switch (a) {
                        case 'compositionstart':
                            var ca = 'onCompositionStart'
                            break b
                        case 'compositionend':
                            ca = 'onCompositionEnd'
                            break b
                        case 'compositionupdate':
                            ca = 'onCompositionUpdate'
                            break b
                    }
                    ca = void 0
                }
            else
                he
                    ? fe(a, c) && (ca = 'onCompositionEnd')
                    : 'keydown' === a &&
                      229 === c.keyCode &&
                      (ca = 'onCompositionStart')
            ca &&
                (ce &&
                    'ko' !== c.locale &&
                    (he || 'onCompositionStart' !== ca
                        ? 'onCompositionEnd' === ca && he && (ab = md())
                        : ((jd = e2),
                          (kd = 'value' in jd ? jd.value : jd.textContent),
                          (he = true))),
                (ya = ne(d2, ca)),
                0 < ya.length &&
                    ((ca = new Kd(ca, a, null, c, e2)),
                    g2.push({ event: ca, listeners: ya }),
                    ab
                        ? (ca.data = ab)
                        : ((ab = ge(c)), null !== ab && (ca.data = ab))))
            if ((ab = be ? ie(a, c) : je(a, c)))
                (d2 = ne(d2, 'onBeforeInput')),
                    0 < d2.length &&
                        ((e2 = new Kd(
                            'onBeforeInput',
                            'beforeinput',
                            null,
                            c,
                            e2
                        )),
                        g2.push({ event: e2, listeners: d2 }),
                        (e2.data = ab))
        }
        re(g2, b)
    })
}
__name(gd, 'gd')
function sf(a, b, c) {
    return { instance: a, listener: b, currentTarget: c }
}
__name(sf, 'sf')
function ne(a, b) {
    for (var c = b + 'Capture', d = []; null !== a; ) {
        var e = a,
            f = e.stateNode
        5 === e.tag &&
            null !== f &&
            ((e = f),
            (f = Jb(a, c)),
            null != f && d.unshift(sf(a, f, e)),
            (f = Jb(a, b)),
            null != f && d.push(sf(a, f, e)))
        a = a.return
    }
    return d
}
__name(ne, 'ne')
function uf(a) {
    if (null === a) return null
    do a = a.return
    while (a && 5 !== a.tag)
    return a ? a : null
}
__name(uf, 'uf')
function vf(a, b, c, d, e) {
    for (var f = b._reactName, g = []; null !== c && c !== d; ) {
        var h = c,
            k = h.alternate,
            l = h.stateNode
        if (null !== k && k === d) break
        5 === h.tag &&
            null !== l &&
            ((h = l),
            e
                ? ((k = Jb(c, f)), null != k && g.unshift(sf(c, k, h)))
                : e || ((k = Jb(c, f)), null != k && g.push(sf(c, k, h))))
        c = c.return
    }
    0 !== g.length && a.push({ event: b, listeners: g })
}
__name(vf, 'vf')
var wf = /\r\n?/g,
    xf = /\u0000|\uFFFD/g
function yf(a) {
    return ('string' === typeof a ? a : '' + a)
        .replace(wf, '\n')
        .replace(xf, '')
}
__name(yf, 'yf')
function zf(a, b, c) {
    b = yf(b)
    if (yf(a) !== b && c) throw Error(p(425))
}
__name(zf, 'zf')
function Af() {}
__name(Af, 'Af')
var Bf = null,
    Cf = null
function Df(a, b) {
    return (
        'textarea' === a ||
        'noscript' === a ||
        'string' === typeof b.children ||
        'number' === typeof b.children ||
        ('object' === typeof b.dangerouslySetInnerHTML &&
            null !== b.dangerouslySetInnerHTML &&
            null != b.dangerouslySetInnerHTML.__html)
    )
}
__name(Df, 'Df')
var Ef = 'function' === typeof setTimeout ? setTimeout : void 0,
    Ff = 'function' === typeof clearTimeout ? clearTimeout : void 0,
    Gf = 'function' === typeof Promise ? Promise : void 0,
    If =
        'function' === typeof queueMicrotask
            ? queueMicrotask
            : 'undefined' !== typeof Gf
            ? function (a) {
                  return Gf.resolve(null).then(a).catch(Hf)
              }
            : Ef
function Hf(a) {
    setTimeout(function () {
        throw a
    })
}
__name(Hf, 'Hf')
function Jf(a, b) {
    var c = b,
        d = 0
    do {
        var e = c.nextSibling
        a.removeChild(c)
        if (e && 8 === e.nodeType)
            if (((c = e.data), '/$' === c)) {
                if (0 === d) {
                    a.removeChild(e)
                    ad(b)
                    return
                }
                d--
            } else ('$' !== c && '$?' !== c && '$!' !== c) || d++
        c = e
    } while (c)
    ad(b)
}
__name(Jf, 'Jf')
function Kf(a) {
    for (; null != a; a = a.nextSibling) {
        var b = a.nodeType
        if (1 === b || 3 === b) break
        if (8 === b) {
            b = a.data
            if ('$' === b || '$!' === b || '$?' === b) break
            if ('/$' === b) return null
        }
    }
    return a
}
__name(Kf, 'Kf')
function Lf(a) {
    a = a.previousSibling
    for (var b = 0; a; ) {
        if (8 === a.nodeType) {
            var c = a.data
            if ('$' === c || '$!' === c || '$?' === c) {
                if (0 === b) return a
                b--
            } else '/$' === c && b++
        }
        a = a.previousSibling
    }
    return null
}
__name(Lf, 'Lf')
var Mf = Math.random().toString(36).slice(2),
    Nf = '__reactFiber$' + Mf,
    Of = '__reactProps$' + Mf,
    tf = '__reactContainer$' + Mf,
    nf = '__reactEvents$' + Mf,
    Pf = '__reactListeners$' + Mf,
    Qf = '__reactHandles$' + Mf
function Vc(a) {
    var b = a[Nf]
    if (b) return b
    for (var c = a.parentNode; c; ) {
        if ((b = c[tf] || c[Nf])) {
            c = b.alternate
            if (null !== b.child || (null !== c && null !== c.child))
                for (a = Lf(a); null !== a; ) {
                    if ((c = a[Nf])) return c
                    a = Lf(a)
                }
            return b
        }
        a = c
        c = a.parentNode
    }
    return null
}
__name(Vc, 'Vc')
function Bb(a) {
    a = a[Nf] || a[tf]
    return !a || (5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag)
        ? null
        : a
}
__name(Bb, 'Bb')
function te(a) {
    if (5 === a.tag || 6 === a.tag) return a.stateNode
    throw Error(p(33))
}
__name(te, 'te')
function Cb(a) {
    return a[Of] || null
}
__name(Cb, 'Cb')
var Rf = [],
    Sf = -1
function Tf(a) {
    return { current: a }
}
__name(Tf, 'Tf')
function E(a) {
    0 > Sf || ((a.current = Rf[Sf]), (Rf[Sf] = null), Sf--)
}
__name(E, 'E')
function G(a, b) {
    Sf++
    Rf[Sf] = a.current
    a.current = b
}
__name(G, 'G')
var Uf = {},
    H = Tf(Uf),
    Vf = Tf(false),
    Wf = Uf
function Xf(a, b) {
    var c = a.type.contextTypes
    if (!c) return Uf
    var d = a.stateNode
    if (d && d.__reactInternalMemoizedUnmaskedChildContext === b)
        return d.__reactInternalMemoizedMaskedChildContext
    var e = {},
        f
    for (f in c) e[f] = b[f]
    d &&
        ((a = a.stateNode),
        (a.__reactInternalMemoizedUnmaskedChildContext = b),
        (a.__reactInternalMemoizedMaskedChildContext = e))
    return e
}
__name(Xf, 'Xf')
function Yf(a) {
    a = a.childContextTypes
    return null !== a && void 0 !== a
}
__name(Yf, 'Yf')
function Zf() {
    E(Vf)
    E(H)
}
__name(Zf, 'Zf')
function $f(a, b, c) {
    if (H.current !== Uf) throw Error(p(168))
    G(H, b)
    G(Vf, c)
}
__name($f, '$f')
function ag(a, b, c) {
    var d = a.stateNode
    b = b.childContextTypes
    if ('function' !== typeof d.getChildContext) return c
    d = d.getChildContext()
    for (var e in d) if (!(e in b)) throw Error(p(108, Qa(a) || 'Unknown', e))
    return A({}, c, d)
}
__name(ag, 'ag')
function bg(a) {
    a = ((a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext) || Uf
    Wf = H.current
    G(H, a)
    G(Vf, Vf.current)
    return true
}
__name(bg, 'bg')
function cg(a, b, c) {
    var d = a.stateNode
    if (!d) throw Error(p(169))
    c
        ? ((a = ag(a, b, Wf)),
          (d.__reactInternalMemoizedMergedChildContext = a),
          E(Vf),
          E(H),
          G(H, a))
        : E(Vf)
    G(Vf, c)
}
__name(cg, 'cg')
var dg = null,
    eg = false,
    fg = false
function gg(a) {
    null === dg ? (dg = [a]) : dg.push(a)
}
__name(gg, 'gg')
function hg(a) {
    eg = true
    gg(a)
}
__name(hg, 'hg')
function ig() {
    if (!fg && null !== dg) {
        fg = true
        var a = 0,
            b = C
        try {
            var c = dg
            for (C = 1; a < c.length; a++) {
                var d = c[a]
                do d = d(true)
                while (null !== d)
            }
            dg = null
            eg = false
        } catch (e) {
            throw (null !== dg && (dg = dg.slice(a + 1)), $b(ec, ig), e)
        } finally {
            ;(C = b), (fg = false)
        }
    }
    return null
}
__name(ig, 'ig')
var jg = ta.ReactCurrentBatchConfig
function kg(a, b) {
    if (a && a.defaultProps) {
        b = A({}, b)
        a = a.defaultProps
        for (var c in a) void 0 === b[c] && (b[c] = a[c])
        return b
    }
    return b
}
__name(kg, 'kg')
var lg = Tf(null),
    mg = null,
    ng = null,
    og = null
function pg() {
    og = ng = mg = null
}
__name(pg, 'pg')
function qg(a) {
    var b = lg.current
    E(lg)
    a._currentValue = b
}
__name(qg, 'qg')
function rg(a, b, c) {
    for (; null !== a; ) {
        var d = a.alternate
        ;(a.childLanes & b) !== b
            ? ((a.childLanes |= b), null !== d && (d.childLanes |= b))
            : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b)
        if (a === c) break
        a = a.return
    }
}
__name(rg, 'rg')
function sg(a, b) {
    mg = a
    og = ng = null
    a = a.dependencies
    null !== a &&
        null !== a.firstContext &&
        (0 !== (a.lanes & b) && (tg = true), (a.firstContext = null))
}
__name(sg, 'sg')
function ug(a) {
    var b = a._currentValue
    if (og !== a)
        if (((a = { context: a, memoizedValue: b, next: null }), null === ng)) {
            if (null === mg) throw Error(p(308))
            ng = a
            mg.dependencies = { lanes: 0, firstContext: a }
        } else ng = ng.next = a
    return b
}
__name(ug, 'ug')
var vg = null,
    wg = false
function xg(a) {
    a.updateQueue = {
        baseState: a.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, interleaved: null, lanes: 0 },
        effects: null
    }
}
__name(xg, 'xg')
function yg(a, b) {
    a = a.updateQueue
    b.updateQueue === a &&
        (b.updateQueue = {
            baseState: a.baseState,
            firstBaseUpdate: a.firstBaseUpdate,
            lastBaseUpdate: a.lastBaseUpdate,
            shared: a.shared,
            effects: a.effects
        })
}
__name(yg, 'yg')
function zg(a, b) {
    return {
        eventTime: a,
        lane: b,
        tag: 0,
        payload: null,
        callback: null,
        next: null
    }
}
__name(zg, 'zg')
function Ag(a, b) {
    var c = a.updateQueue
    null !== c &&
        ((c = c.shared),
        Bg(a)
            ? ((a = c.interleaved),
              null === a
                  ? ((b.next = b), null === vg ? (vg = [c]) : vg.push(c))
                  : ((b.next = a.next), (a.next = b)),
              (c.interleaved = b))
            : ((a = c.pending),
              null === a ? (b.next = b) : ((b.next = a.next), (a.next = b)),
              (c.pending = b)))
}
__name(Ag, 'Ag')
function Cg(a, b, c) {
    b = b.updateQueue
    if (null !== b && ((b = b.shared), 0 !== (c & 4194240))) {
        var d = b.lanes
        d &= a.pendingLanes
        c |= d
        b.lanes = c
        Bc(a, c)
    }
}
__name(Cg, 'Cg')
function Dg(a, b) {
    var c = a.updateQueue,
        d = a.alternate
    if (null !== d && ((d = d.updateQueue), c === d)) {
        var e = null,
            f = null
        c = c.firstBaseUpdate
        if (null !== c) {
            do {
                var g = {
                    eventTime: c.eventTime,
                    lane: c.lane,
                    tag: c.tag,
                    payload: c.payload,
                    callback: c.callback,
                    next: null
                }
                null === f ? (e = f = g) : (f = f.next = g)
                c = c.next
            } while (null !== c)
            null === f ? (e = f = b) : (f = f.next = b)
        } else e = f = b
        c = {
            baseState: d.baseState,
            firstBaseUpdate: e,
            lastBaseUpdate: f,
            shared: d.shared,
            effects: d.effects
        }
        a.updateQueue = c
        return
    }
    a = c.lastBaseUpdate
    null === a ? (c.firstBaseUpdate = b) : (a.next = b)
    c.lastBaseUpdate = b
}
__name(Dg, 'Dg')
function Eg(a, b, c, d) {
    var e = a.updateQueue
    wg = false
    var f = e.firstBaseUpdate,
        g = e.lastBaseUpdate,
        h = e.shared.pending
    if (null !== h) {
        e.shared.pending = null
        var k = h,
            l = k.next
        k.next = null
        null === g ? (f = l) : (g.next = l)
        g = k
        var n = a.alternate
        null !== n &&
            ((n = n.updateQueue),
            (h = n.lastBaseUpdate),
            h !== g &&
                (null === h ? (n.firstBaseUpdate = l) : (h.next = l),
                (n.lastBaseUpdate = k)))
    }
    if (null !== f) {
        var u = e.baseState
        g = 0
        n = l = k = null
        h = f
        do {
            var q = h.lane,
                y = h.eventTime
            if ((d & q) === q) {
                null !== n &&
                    (n = n.next =
                        {
                            eventTime: y,
                            lane: 0,
                            tag: h.tag,
                            payload: h.payload,
                            callback: h.callback,
                            next: null
                        })
                a: {
                    var m = a,
                        w = h
                    q = b
                    y = c
                    switch (w.tag) {
                        case 1:
                            m = w.payload
                            if ('function' === typeof m) {
                                u = m.call(y, u, q)
                                break a
                            }
                            u = m
                            break a
                        case 3:
                            m.flags = (m.flags & -65537) | 128
                        case 0:
                            m = w.payload
                            q = 'function' === typeof m ? m.call(y, u, q) : m
                            if (null === q || void 0 === q) break a
                            u = A({}, u, q)
                            break a
                        case 2:
                            wg = true
                    }
                }
                null !== h.callback &&
                    0 !== h.lane &&
                    ((a.flags |= 64),
                    (q = e.effects),
                    null === q ? (e.effects = [h]) : q.push(h))
            } else
                (y = {
                    eventTime: y,
                    lane: q,
                    tag: h.tag,
                    payload: h.payload,
                    callback: h.callback,
                    next: null
                }),
                    null === n ? ((l = n = y), (k = u)) : (n = n.next = y),
                    (g |= q)
            h = h.next
            if (null === h)
                if (((h = e.shared.pending), null === h)) break
                else
                    (q = h),
                        (h = q.next),
                        (q.next = null),
                        (e.lastBaseUpdate = q),
                        (e.shared.pending = null)
        } while (1)
        null === n && (k = u)
        e.baseState = k
        e.firstBaseUpdate = l
        e.lastBaseUpdate = n
        b = e.shared.interleaved
        if (null !== b) {
            e = b
            do (g |= e.lane), (e = e.next)
            while (e !== b)
        } else null === f && (e.shared.lanes = 0)
        Fg |= g
        a.lanes = g
        a.memoizedState = u
    }
}
__name(Eg, 'Eg')
function Gg(a, b, c) {
    a = b.effects
    b.effects = null
    if (null !== a)
        for (b = 0; b < a.length; b++) {
            var d = a[b],
                e = d.callback
            if (null !== e) {
                d.callback = null
                d = c
                if ('function' !== typeof e) throw Error(p(191, e))
                e.call(d)
            }
        }
}
__name(Gg, 'Gg')
var Hg = new aa.Component().refs
function Ig(a, b, c, d) {
    b = a.memoizedState
    c = c(d, b)
    c = null === c || void 0 === c ? b : A({}, b, c)
    a.memoizedState = c
    0 === a.lanes && (a.updateQueue.baseState = c)
}
__name(Ig, 'Ig')
var Mg = {
    isMounted: function (a) {
        return (a = a._reactInternals) ? Ub(a) === a : false
    },
    enqueueSetState: function (a, b, c) {
        a = a._reactInternals
        var d = Jg(),
            e = Kg(a),
            f = zg(d, e)
        f.payload = b
        void 0 !== c && null !== c && (f.callback = c)
        Ag(a, f)
        b = Lg(a, e, d)
        null !== b && Cg(b, a, e)
    },
    enqueueReplaceState: function (a, b, c) {
        a = a._reactInternals
        var d = Jg(),
            e = Kg(a),
            f = zg(d, e)
        f.tag = 1
        f.payload = b
        void 0 !== c && null !== c && (f.callback = c)
        Ag(a, f)
        b = Lg(a, e, d)
        null !== b && Cg(b, a, e)
    },
    enqueueForceUpdate: function (a, b) {
        a = a._reactInternals
        var c = Jg(),
            d = Kg(a),
            e = zg(c, d)
        e.tag = 2
        void 0 !== b && null !== b && (e.callback = b)
        Ag(a, e)
        b = Lg(a, d, c)
        null !== b && Cg(b, a, d)
    }
}
function Ng(a, b, c, d, e, f, g) {
    a = a.stateNode
    return 'function' === typeof a.shouldComponentUpdate
        ? a.shouldComponentUpdate(d, f, g)
        : b.prototype && b.prototype.isPureReactComponent
        ? !He(c, d) || !He(e, f)
        : true
}
__name(Ng, 'Ng')
function Og(a, b, c) {
    var d = false,
        e = Uf
    var f = b.contextType
    'object' === typeof f && null !== f
        ? (f = ug(f))
        : ((e = Yf(b) ? Wf : H.current),
          (d = b.contextTypes),
          (f = (d = null !== d && void 0 !== d) ? Xf(a, e) : Uf))
    b = new b(c, f)
    a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null
    b.updater = Mg
    a.stateNode = b
    b._reactInternals = a
    d &&
        ((a = a.stateNode),
        (a.__reactInternalMemoizedUnmaskedChildContext = e),
        (a.__reactInternalMemoizedMaskedChildContext = f))
    return b
}
__name(Og, 'Og')
function Pg(a, b, c, d) {
    a = b.state
    'function' === typeof b.componentWillReceiveProps &&
        b.componentWillReceiveProps(c, d)
    'function' === typeof b.UNSAFE_componentWillReceiveProps &&
        b.UNSAFE_componentWillReceiveProps(c, d)
    b.state !== a && Mg.enqueueReplaceState(b, b.state, null)
}
__name(Pg, 'Pg')
function Qg(a, b, c, d) {
    var e = a.stateNode
    e.props = c
    e.state = a.memoizedState
    e.refs = Hg
    xg(a)
    var f = b.contextType
    'object' === typeof f && null !== f
        ? (e.context = ug(f))
        : ((f = Yf(b) ? Wf : H.current), (e.context = Xf(a, f)))
    e.state = a.memoizedState
    f = b.getDerivedStateFromProps
    'function' === typeof f && (Ig(a, b, f, c), (e.state = a.memoizedState))
    'function' === typeof b.getDerivedStateFromProps ||
        'function' === typeof e.getSnapshotBeforeUpdate ||
        ('function' !== typeof e.UNSAFE_componentWillMount &&
            'function' !== typeof e.componentWillMount) ||
        ((b = e.state),
        'function' === typeof e.componentWillMount && e.componentWillMount(),
        'function' === typeof e.UNSAFE_componentWillMount &&
            e.UNSAFE_componentWillMount(),
        b !== e.state && Mg.enqueueReplaceState(e, e.state, null),
        Eg(a, c, e, d),
        (e.state = a.memoizedState))
    'function' === typeof e.componentDidMount && (a.flags |= 4194308)
}
__name(Qg, 'Qg')
var Rg = [],
    Sg = 0,
    Tg = null,
    Ug = 0,
    Vg = [],
    Wg = 0,
    Xg = null,
    Yg = 1,
    Zg = ''
function $g(a, b) {
    Rg[Sg++] = Ug
    Rg[Sg++] = Tg
    Tg = a
    Ug = b
}
__name($g, '$g')
function ah(a, b, c) {
    Vg[Wg++] = Yg
    Vg[Wg++] = Zg
    Vg[Wg++] = Xg
    Xg = a
    var d = Yg
    a = Zg
    var e = 32 - nc(d) - 1
    d &= ~(1 << e)
    c += 1
    var f = 32 - nc(b) + e
    if (30 < f) {
        var g = e - (e % 5)
        f = (d & ((1 << g) - 1)).toString(32)
        d >>= g
        e -= g
        Yg = (1 << (32 - nc(b) + e)) | (c << e) | d
        Zg = f + a
    } else (Yg = (1 << f) | (c << e) | d), (Zg = a)
}
__name(ah, 'ah')
function bh(a) {
    null !== a.return && ($g(a, 1), ah(a, 1, 0))
}
__name(bh, 'bh')
function ch(a) {
    for (; a === Tg; )
        (Tg = Rg[--Sg]), (Rg[Sg] = null), (Ug = Rg[--Sg]), (Rg[Sg] = null)
    for (; a === Xg; )
        (Xg = Vg[--Wg]),
            (Vg[Wg] = null),
            (Zg = Vg[--Wg]),
            (Vg[Wg] = null),
            (Yg = Vg[--Wg]),
            (Vg[Wg] = null)
}
__name(ch, 'ch')
var dh = null,
    eh = null,
    I = false,
    fh = null
function gh(a, b) {
    var c = hh(5, null, null, 0)
    c.elementType = 'DELETED'
    c.stateNode = b
    c.return = a
    b = a.deletions
    null === b ? ((a.deletions = [c]), (a.flags |= 16)) : b.push(c)
}
__name(gh, 'gh')
function ih(a, b) {
    switch (a.tag) {
        case 5:
            var c = a.type
            b =
                1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase()
                    ? null
                    : b
            return null !== b
                ? ((a.stateNode = b), (dh = a), (eh = Kf(b.firstChild)), true)
                : false
        case 6:
            return (
                (b = '' === a.pendingProps || 3 !== b.nodeType ? null : b),
                null !== b
                    ? ((a.stateNode = b), (dh = a), (eh = null), true)
                    : false
            )
        case 13:
            return (
                (b = 8 !== b.nodeType ? null : b),
                null !== b
                    ? ((c = null !== Xg ? { id: Yg, overflow: Zg } : null),
                      (a.memoizedState = {
                          dehydrated: b,
                          treeContext: c,
                          retryLane: 1073741824
                      }),
                      (c = hh(18, null, null, 0)),
                      (c.stateNode = b),
                      (c.return = a),
                      (a.child = c),
                      (dh = a),
                      (eh = null),
                      true)
                    : false
            )
        default:
            return false
    }
}
__name(ih, 'ih')
function jh(a) {
    return 0 !== (a.mode & 1) && 0 === (a.flags & 128)
}
__name(jh, 'jh')
function kh(a) {
    if (I) {
        var b = eh
        if (b) {
            var c = b
            if (!ih(a, b)) {
                if (jh(a)) throw Error(p(418))
                b = Kf(c.nextSibling)
                var d = dh
                b && ih(a, b)
                    ? gh(d, c)
                    : ((a.flags = (a.flags & -4097) | 2), (I = false), (dh = a))
            }
        } else {
            if (jh(a)) throw Error(p(418))
            a.flags = (a.flags & -4097) | 2
            I = false
            dh = a
        }
    }
}
__name(kh, 'kh')
function lh(a) {
    for (
        a = a.return;
        null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag;

    )
        a = a.return
    dh = a
}
__name(lh, 'lh')
function mh(a) {
    if (a !== dh) return false
    if (!I) return lh(a), (I = true), false
    var b
    ;(b = 3 !== a.tag) &&
        !(b = 5 !== a.tag) &&
        ((b = a.type),
        (b = 'head' !== b && 'body' !== b && !Df(a.type, a.memoizedProps)))
    if (b && (b = eh)) {
        if (jh(a)) {
            for (a = eh; a; ) a = Kf(a.nextSibling)
            throw Error(p(418))
        }
        for (; b; ) gh(a, b), (b = Kf(b.nextSibling))
    }
    lh(a)
    if (13 === a.tag) {
        a = a.memoizedState
        a = null !== a ? a.dehydrated : null
        if (!a) throw Error(p(317))
        a: {
            a = a.nextSibling
            for (b = 0; a; ) {
                if (8 === a.nodeType) {
                    var c = a.data
                    if ('/$' === c) {
                        if (0 === b) {
                            eh = Kf(a.nextSibling)
                            break a
                        }
                        b--
                    } else ('$' !== c && '$!' !== c && '$?' !== c) || b++
                }
                a = a.nextSibling
            }
            eh = null
        }
    } else eh = dh ? Kf(a.stateNode.nextSibling) : null
    return true
}
__name(mh, 'mh')
function nh() {
    eh = dh = null
    I = false
}
__name(nh, 'nh')
function oh(a) {
    null === fh ? (fh = [a]) : fh.push(a)
}
__name(oh, 'oh')
function ph(a, b, c) {
    a = c.ref
    if (null !== a && 'function' !== typeof a && 'object' !== typeof a) {
        if (c._owner) {
            c = c._owner
            if (c) {
                if (1 !== c.tag) throw Error(p(309))
                var d = c.stateNode
            }
            if (!d) throw Error(p(147, a))
            var e = d,
                f = '' + a
            if (
                null !== b &&
                null !== b.ref &&
                'function' === typeof b.ref &&
                b.ref._stringRef === f
            )
                return b.ref
            b = /* @__PURE__ */ __name(function (a2) {
                var b2 = e.refs
                b2 === Hg && (b2 = e.refs = {})
                null === a2 ? delete b2[f] : (b2[f] = a2)
            }, 'b')
            b._stringRef = f
            return b
        }
        if ('string' !== typeof a) throw Error(p(284))
        if (!c._owner) throw Error(p(290, a))
    }
    return a
}
__name(ph, 'ph')
function qh(a, b) {
    a = Object.prototype.toString.call(b)
    throw Error(
        p(
            31,
            '[object Object]' === a
                ? 'object with keys {' + Object.keys(b).join(', ') + '}'
                : a
        )
    )
}
__name(qh, 'qh')
function rh(a) {
    var b = a._init
    return b(a._payload)
}
__name(rh, 'rh')
function sh(a) {
    function b(b2, c2) {
        if (a) {
            var d2 = b2.deletions
            null === d2
                ? ((b2.deletions = [c2]), (b2.flags |= 16))
                : d2.push(c2)
        }
    }
    __name(b, 'b')
    function c(c2, d2) {
        if (!a) return null
        for (; null !== d2; ) b(c2, d2), (d2 = d2.sibling)
        return null
    }
    __name(c, 'c')
    function d(a2, b2) {
        for (a2 = /* @__PURE__ */ new Map(); null !== b2; )
            null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2),
                (b2 = b2.sibling)
        return a2
    }
    __name(d, 'd')
    function e(a2, b2) {
        a2 = th(a2, b2)
        a2.index = 0
        a2.sibling = null
        return a2
    }
    __name(e, 'e')
    function f(b2, c2, d2) {
        b2.index = d2
        if (!a) return (b2.flags |= 1048576), c2
        d2 = b2.alternate
        if (null !== d2)
            return (d2 = d2.index), d2 < c2 ? ((b2.flags |= 2), c2) : d2
        b2.flags |= 2
        return c2
    }
    __name(f, 'f')
    function g(b2) {
        a && null === b2.alternate && (b2.flags |= 2)
        return b2
    }
    __name(g, 'g')
    function h(a2, b2, c2, d2) {
        if (null === b2 || 6 !== b2.tag)
            return (b2 = uh(c2, a2.mode, d2)), (b2.return = a2), b2
        b2 = e(b2, c2)
        b2.return = a2
        return b2
    }
    __name(h, 'h')
    function k(a2, b2, c2, d2) {
        var f2 = c2.type
        if (f2 === wa) return n(a2, b2, c2.props.children, d2, c2.key)
        if (
            null !== b2 &&
            (b2.elementType === f2 ||
                ('object' === typeof f2 &&
                    null !== f2 &&
                    f2.$$typeof === Ga &&
                    rh(f2) === b2.type))
        )
            return (
                (d2 = e(b2, c2.props)),
                (d2.ref = ph(a2, b2, c2)),
                (d2.return = a2),
                d2
            )
        d2 = vh(c2.type, c2.key, c2.props, null, a2.mode, d2)
        d2.ref = ph(a2, b2, c2)
        d2.return = a2
        return d2
    }
    __name(k, 'k')
    function l(a2, b2, c2, d2) {
        if (
            null === b2 ||
            4 !== b2.tag ||
            b2.stateNode.containerInfo !== c2.containerInfo ||
            b2.stateNode.implementation !== c2.implementation
        )
            return (b2 = wh(c2, a2.mode, d2)), (b2.return = a2), b2
        b2 = e(b2, c2.children || [])
        b2.return = a2
        return b2
    }
    __name(l, 'l')
    function n(a2, b2, c2, d2, f2) {
        if (null === b2 || 7 !== b2.tag)
            return (b2 = xh(c2, a2.mode, d2, f2)), (b2.return = a2), b2
        b2 = e(b2, c2)
        b2.return = a2
        return b2
    }
    __name(n, 'n')
    function u(a2, b2, c2) {
        if (('string' === typeof b2 && '' !== b2) || 'number' === typeof b2)
            return (b2 = uh('' + b2, a2.mode, c2)), (b2.return = a2), b2
        if ('object' === typeof b2 && null !== b2) {
            switch (b2.$$typeof) {
                case ua:
                    return (
                        (c2 = vh(b2.type, b2.key, b2.props, null, a2.mode, c2)),
                        (c2.ref = ph(a2, null, b2)),
                        (c2.return = a2),
                        c2
                    )
                case va:
                    return (b2 = wh(b2, a2.mode, c2)), (b2.return = a2), b2
                case Ga:
                    var d2 = b2._init
                    return u(a2, d2(b2._payload), c2)
            }
            if (db(b2) || Ja(b2))
                return (b2 = xh(b2, a2.mode, c2, null)), (b2.return = a2), b2
            qh(a2, b2)
        }
        return null
    }
    __name(u, 'u')
    function q(a2, b2, c2, d2) {
        var e2 = null !== b2 ? b2.key : null
        if (('string' === typeof c2 && '' !== c2) || 'number' === typeof c2)
            return null !== e2 ? null : h(a2, b2, '' + c2, d2)
        if ('object' === typeof c2 && null !== c2) {
            switch (c2.$$typeof) {
                case ua:
                    return c2.key === e2 ? k(a2, b2, c2, d2) : null
                case va:
                    return c2.key === e2 ? l(a2, b2, c2, d2) : null
                case Ga:
                    return (e2 = c2._init), q(a2, b2, e2(c2._payload), d2)
            }
            if (db(c2) || Ja(c2))
                return null !== e2 ? null : n(a2, b2, c2, d2, null)
            qh(a2, c2)
        }
        return null
    }
    __name(q, 'q')
    function y(a2, b2, c2, d2, e2) {
        if (('string' === typeof d2 && '' !== d2) || 'number' === typeof d2)
            return (a2 = a2.get(c2) || null), h(b2, a2, '' + d2, e2)
        if ('object' === typeof d2 && null !== d2) {
            switch (d2.$$typeof) {
                case ua:
                    return (
                        (a2 = a2.get(null === d2.key ? c2 : d2.key) || null),
                        k(b2, a2, d2, e2)
                    )
                case va:
                    return (
                        (a2 = a2.get(null === d2.key ? c2 : d2.key) || null),
                        l(b2, a2, d2, e2)
                    )
                case Ga:
                    var f2 = d2._init
                    return y(a2, b2, c2, f2(d2._payload), e2)
            }
            if (db(d2) || Ja(d2))
                return (a2 = a2.get(c2) || null), n(b2, a2, d2, e2, null)
            qh(b2, d2)
        }
        return null
    }
    __name(y, 'y')
    function m(e2, g2, h2, k2) {
        for (
            var l2 = null, n2 = null, r = g2, m2 = (g2 = 0), x = null;
            null !== r && m2 < h2.length;
            m2++
        ) {
            r.index > m2 ? ((x = r), (r = null)) : (x = r.sibling)
            var v = q(e2, r, h2[m2], k2)
            if (null === v) {
                null === r && (r = x)
                break
            }
            a && r && null === v.alternate && b(e2, r)
            g2 = f(v, g2, m2)
            null === n2 ? (l2 = v) : (n2.sibling = v)
            n2 = v
            r = x
        }
        if (m2 === h2.length) return c(e2, r), I && $g(e2, m2), l2
        if (null === r) {
            for (; m2 < h2.length; m2++)
                (r = u(e2, h2[m2], k2)),
                    null !== r &&
                        ((g2 = f(r, g2, m2)),
                        null === n2 ? (l2 = r) : (n2.sibling = r),
                        (n2 = r))
            I && $g(e2, m2)
            return l2
        }
        for (r = d(e2, r); m2 < h2.length; m2++)
            (x = y(r, e2, m2, h2[m2], k2)),
                null !== x &&
                    (a &&
                        null !== x.alternate &&
                        r.delete(null === x.key ? m2 : x.key),
                    (g2 = f(x, g2, m2)),
                    null === n2 ? (l2 = x) : (n2.sibling = x),
                    (n2 = x))
        a &&
            r.forEach(function (a2) {
                return b(e2, a2)
            })
        I && $g(e2, m2)
        return l2
    }
    __name(m, 'm')
    function w(e2, g2, h2, k2) {
        var l2 = Ja(h2)
        if ('function' !== typeof l2) throw Error(p(150))
        h2 = l2.call(h2)
        if (null == h2) throw Error(p(151))
        for (
            var n2 = (l2 = null),
                m2 = g2,
                r = (g2 = 0),
                x = null,
                v = h2.next();
            null !== m2 && !v.done;
            r++, v = h2.next()
        ) {
            m2.index > r ? ((x = m2), (m2 = null)) : (x = m2.sibling)
            var w2 = q(e2, m2, v.value, k2)
            if (null === w2) {
                null === m2 && (m2 = x)
                break
            }
            a && m2 && null === w2.alternate && b(e2, m2)
            g2 = f(w2, g2, r)
            null === n2 ? (l2 = w2) : (n2.sibling = w2)
            n2 = w2
            m2 = x
        }
        if (v.done) return c(e2, m2), I && $g(e2, r), l2
        if (null === m2) {
            for (; !v.done; r++, v = h2.next())
                (v = u(e2, v.value, k2)),
                    null !== v &&
                        ((g2 = f(v, g2, r)),
                        null === n2 ? (l2 = v) : (n2.sibling = v),
                        (n2 = v))
            I && $g(e2, r)
            return l2
        }
        for (m2 = d(e2, m2); !v.done; r++, v = h2.next())
            (v = y(m2, e2, r, v.value, k2)),
                null !== v &&
                    (a &&
                        null !== v.alternate &&
                        m2.delete(null === v.key ? r : v.key),
                    (g2 = f(v, g2, r)),
                    null === n2 ? (l2 = v) : (n2.sibling = v),
                    (n2 = v))
        a &&
            m2.forEach(function (a2) {
                return b(e2, a2)
            })
        I && $g(e2, r)
        return l2
    }
    __name(w, 'w')
    function J(a2, d2, f2, h2) {
        'object' === typeof f2 &&
            null !== f2 &&
            f2.type === wa &&
            null === f2.key &&
            (f2 = f2.props.children)
        if ('object' === typeof f2 && null !== f2) {
            switch (f2.$$typeof) {
                case ua:
                    a: {
                        for (var k2 = f2.key, l2 = d2; null !== l2; ) {
                            if (l2.key === k2) {
                                k2 = f2.type
                                if (k2 === wa) {
                                    if (7 === l2.tag) {
                                        c(a2, l2.sibling)
                                        d2 = e(l2, f2.props.children)
                                        d2.return = a2
                                        a2 = d2
                                        break a
                                    }
                                } else if (
                                    l2.elementType === k2 ||
                                    ('object' === typeof k2 &&
                                        null !== k2 &&
                                        k2.$$typeof === Ga &&
                                        rh(k2) === l2.type)
                                ) {
                                    c(a2, l2.sibling)
                                    d2 = e(l2, f2.props)
                                    d2.ref = ph(a2, l2, f2)
                                    d2.return = a2
                                    a2 = d2
                                    break a
                                }
                                c(a2, l2)
                                break
                            } else b(a2, l2)
                            l2 = l2.sibling
                        }
                        f2.type === wa
                            ? ((d2 = xh(
                                  f2.props.children,
                                  a2.mode,
                                  h2,
                                  f2.key
                              )),
                              (d2.return = a2),
                              (a2 = d2))
                            : ((h2 = vh(
                                  f2.type,
                                  f2.key,
                                  f2.props,
                                  null,
                                  a2.mode,
                                  h2
                              )),
                              (h2.ref = ph(a2, d2, f2)),
                              (h2.return = a2),
                              (a2 = h2))
                    }
                    return g(a2)
                case va:
                    a: {
                        for (l2 = f2.key; null !== d2; ) {
                            if (d2.key === l2)
                                if (
                                    4 === d2.tag &&
                                    d2.stateNode.containerInfo ===
                                        f2.containerInfo &&
                                    d2.stateNode.implementation ===
                                        f2.implementation
                                ) {
                                    c(a2, d2.sibling)
                                    d2 = e(d2, f2.children || [])
                                    d2.return = a2
                                    a2 = d2
                                    break a
                                } else {
                                    c(a2, d2)
                                    break
                                }
                            else b(a2, d2)
                            d2 = d2.sibling
                        }
                        d2 = wh(f2, a2.mode, h2)
                        d2.return = a2
                        a2 = d2
                    }
                    return g(a2)
                case Ga:
                    return (l2 = f2._init), J(a2, d2, l2(f2._payload), h2)
            }
            if (db(f2)) return m(a2, d2, f2, h2)
            if (Ja(f2)) return w(a2, d2, f2, h2)
            qh(a2, f2)
        }
        return ('string' === typeof f2 && '' !== f2) || 'number' === typeof f2
            ? ((f2 = '' + f2),
              null !== d2 && 6 === d2.tag
                  ? (c(a2, d2.sibling),
                    (d2 = e(d2, f2)),
                    (d2.return = a2),
                    (a2 = d2))
                  : (c(a2, d2),
                    (d2 = uh(f2, a2.mode, h2)),
                    (d2.return = a2),
                    (a2 = d2)),
              g(a2))
            : c(a2, d2)
    }
    __name(J, 'J')
    return J
}
__name(sh, 'sh')
var yh = sh(true),
    zh = sh(false),
    Ah = {},
    Bh = Tf(Ah),
    Ch = Tf(Ah),
    Dh = Tf(Ah)
function Eh(a) {
    if (a === Ah) throw Error(p(174))
    return a
}
__name(Eh, 'Eh')
function Fh(a, b) {
    G(Dh, b)
    G(Ch, a)
    G(Bh, Ah)
    a = b.nodeType
    switch (a) {
        case 9:
        case 11:
            b = (b = b.documentElement) ? b.namespaceURI : kb(null, '')
            break
        default:
            ;(a = 8 === a ? b.parentNode : b),
                (b = a.namespaceURI || null),
                (a = a.tagName),
                (b = kb(b, a))
    }
    E(Bh)
    G(Bh, b)
}
__name(Fh, 'Fh')
function Gh() {
    E(Bh)
    E(Ch)
    E(Dh)
}
__name(Gh, 'Gh')
function Hh(a) {
    Eh(Dh.current)
    var b = Eh(Bh.current)
    var c = kb(b, a.type)
    b !== c && (G(Ch, a), G(Bh, c))
}
__name(Hh, 'Hh')
function Ih(a) {
    Ch.current === a && (E(Bh), E(Ch))
}
__name(Ih, 'Ih')
var K = Tf(0)
function Jh(a) {
    for (var b = a; null !== b; ) {
        if (13 === b.tag) {
            var c = b.memoizedState
            if (
                null !== c &&
                ((c = c.dehydrated),
                null === c || '$?' === c.data || '$!' === c.data)
            )
                return b
        } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
            if (0 !== (b.flags & 128)) return b
        } else if (null !== b.child) {
            b.child.return = b
            b = b.child
            continue
        }
        if (b === a) break
        for (; null === b.sibling; ) {
            if (null === b.return || b.return === a) return null
            b = b.return
        }
        b.sibling.return = b.return
        b = b.sibling
    }
    return null
}
__name(Jh, 'Jh')
var Kh = []
function Lh() {
    for (var a = 0; a < Kh.length; a++)
        Kh[a]._workInProgressVersionPrimary = null
    Kh.length = 0
}
__name(Lh, 'Lh')
var Mh = ta.ReactCurrentDispatcher,
    Nh = ta.ReactCurrentBatchConfig,
    Oh = 0,
    L = null,
    M = null,
    N = null,
    Ph = false,
    Qh = false,
    Rh = 0,
    Sh = 0
function O() {
    throw Error(p(321))
}
__name(O, 'O')
function Th(a, b) {
    if (null === b) return false
    for (var c = 0; c < b.length && c < a.length; c++)
        if (!Ge(a[c], b[c])) return false
    return true
}
__name(Th, 'Th')
function Uh(a, b, c, d, e, f) {
    Oh = f
    L = b
    b.memoizedState = null
    b.updateQueue = null
    b.lanes = 0
    Mh.current = null === a || null === a.memoizedState ? Vh : Wh
    a = c(d, e)
    if (Qh) {
        f = 0
        do {
            Qh = false
            Rh = 0
            if (25 <= f) throw Error(p(301))
            f += 1
            N = M = null
            b.updateQueue = null
            Mh.current = Xh
            a = c(d, e)
        } while (Qh)
    }
    Mh.current = Yh
    b = null !== M && null !== M.next
    Oh = 0
    N = M = L = null
    Ph = false
    if (b) throw Error(p(300))
    return a
}
__name(Uh, 'Uh')
function Zh() {
    var a = 0 !== Rh
    Rh = 0
    return a
}
__name(Zh, 'Zh')
function $h() {
    var a = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
    }
    null === N ? (L.memoizedState = N = a) : (N = N.next = a)
    return N
}
__name($h, '$h')
function ai() {
    if (null === M) {
        var a = L.alternate
        a = null !== a ? a.memoizedState : null
    } else a = M.next
    var b = null === N ? L.memoizedState : N.next
    if (null !== b) (N = b), (M = a)
    else {
        if (null === a) throw Error(p(310))
        M = a
        a = {
            memoizedState: M.memoizedState,
            baseState: M.baseState,
            baseQueue: M.baseQueue,
            queue: M.queue,
            next: null
        }
        null === N ? (L.memoizedState = N = a) : (N = N.next = a)
    }
    return N
}
__name(ai, 'ai')
function bi(a, b) {
    return 'function' === typeof b ? b(a) : b
}
__name(bi, 'bi')
function ci(a) {
    var b = ai(),
        c = b.queue
    if (null === c) throw Error(p(311))
    c.lastRenderedReducer = a
    var d = M,
        e = d.baseQueue,
        f = c.pending
    if (null !== f) {
        if (null !== e) {
            var g = e.next
            e.next = f.next
            f.next = g
        }
        d.baseQueue = e = f
        c.pending = null
    }
    if (null !== e) {
        f = e.next
        d = d.baseState
        var h = (g = null),
            k = null,
            l = f
        do {
            var n = l.lane
            if ((Oh & n) === n)
                null !== k &&
                    (k = k.next =
                        {
                            lane: 0,
                            action: l.action,
                            hasEagerState: l.hasEagerState,
                            eagerState: l.eagerState,
                            next: null
                        }),
                    (d = l.hasEagerState ? l.eagerState : a(d, l.action))
            else {
                var u = {
                    lane: n,
                    action: l.action,
                    hasEagerState: l.hasEagerState,
                    eagerState: l.eagerState,
                    next: null
                }
                null === k ? ((h = k = u), (g = d)) : (k = k.next = u)
                L.lanes |= n
                Fg |= n
            }
            l = l.next
        } while (null !== l && l !== f)
        null === k ? (g = d) : (k.next = h)
        Ge(d, b.memoizedState) || (tg = true)
        b.memoizedState = d
        b.baseState = g
        b.baseQueue = k
        c.lastRenderedState = d
    }
    a = c.interleaved
    if (null !== a) {
        e = a
        do (f = e.lane), (L.lanes |= f), (Fg |= f), (e = e.next)
        while (e !== a)
    } else null === e && (c.lanes = 0)
    return [b.memoizedState, c.dispatch]
}
__name(ci, 'ci')
function di(a) {
    var b = ai(),
        c = b.queue
    if (null === c) throw Error(p(311))
    c.lastRenderedReducer = a
    var d = c.dispatch,
        e = c.pending,
        f = b.memoizedState
    if (null !== e) {
        c.pending = null
        var g = (e = e.next)
        do (f = a(f, g.action)), (g = g.next)
        while (g !== e)
        Ge(f, b.memoizedState) || (tg = true)
        b.memoizedState = f
        null === b.baseQueue && (b.baseState = f)
        c.lastRenderedState = f
    }
    return [f, d]
}
__name(di, 'di')
function ei() {}
__name(ei, 'ei')
function fi(a, b) {
    var c = L,
        d = ai(),
        e = b(),
        f = !Ge(d.memoizedState, e)
    f && ((d.memoizedState = e), (tg = true))
    d = d.queue
    gi(hi.bind(null, c, d, a), [a])
    if (d.getSnapshot !== b || f || (null !== N && N.memoizedState.tag & 1)) {
        c.flags |= 2048
        ii(9, ji.bind(null, c, d, e, b), void 0, null)
        if (null === P) throw Error(p(349))
        0 !== (Oh & 30) || ki(c, b, e)
    }
    return e
}
__name(fi, 'fi')
function ki(a, b, c) {
    a.flags |= 16384
    a = { getSnapshot: b, value: c }
    b = L.updateQueue
    null === b
        ? ((b = { lastEffect: null, stores: null }),
          (L.updateQueue = b),
          (b.stores = [a]))
        : ((c = b.stores), null === c ? (b.stores = [a]) : c.push(a))
}
__name(ki, 'ki')
function ji(a, b, c, d) {
    b.value = c
    b.getSnapshot = d
    li(b) && Lg(a, 1, -1)
}
__name(ji, 'ji')
function hi(a, b, c) {
    return c(function () {
        li(b) && Lg(a, 1, -1)
    })
}
__name(hi, 'hi')
function li(a) {
    var b = a.getSnapshot
    a = a.value
    try {
        var c = b()
        return !Ge(a, c)
    } catch (d) {
        return true
    }
}
__name(li, 'li')
function mi(a) {
    var b = $h()
    'function' === typeof a && (a = a())
    b.memoizedState = b.baseState = a
    a = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: bi,
        lastRenderedState: a
    }
    b.queue = a
    a = a.dispatch = ni.bind(null, L, a)
    return [b.memoizedState, a]
}
__name(mi, 'mi')
function ii(a, b, c, d) {
    a = { tag: a, create: b, destroy: c, deps: d, next: null }
    b = L.updateQueue
    null === b
        ? ((b = { lastEffect: null, stores: null }),
          (L.updateQueue = b),
          (b.lastEffect = a.next = a))
        : ((c = b.lastEffect),
          null === c
              ? (b.lastEffect = a.next = a)
              : ((d = c.next), (c.next = a), (a.next = d), (b.lastEffect = a)))
    return a
}
__name(ii, 'ii')
function oi() {
    return ai().memoizedState
}
__name(oi, 'oi')
function pi(a, b, c, d) {
    var e = $h()
    L.flags |= a
    e.memoizedState = ii(1 | b, c, void 0, void 0 === d ? null : d)
}
__name(pi, 'pi')
function qi(a, b, c, d) {
    var e = ai()
    d = void 0 === d ? null : d
    var f = void 0
    if (null !== M) {
        var g = M.memoizedState
        f = g.destroy
        if (null !== d && Th(d, g.deps)) {
            e.memoizedState = ii(b, c, f, d)
            return
        }
    }
    L.flags |= a
    e.memoizedState = ii(1 | b, c, f, d)
}
__name(qi, 'qi')
function ri(a, b) {
    return pi(8390656, 8, a, b)
}
__name(ri, 'ri')
function gi(a, b) {
    return qi(2048, 8, a, b)
}
__name(gi, 'gi')
function si(a, b) {
    return qi(4, 2, a, b)
}
__name(si, 'si')
function ti(a, b) {
    return qi(4, 4, a, b)
}
__name(ti, 'ti')
function ui(a, b) {
    if ('function' === typeof b)
        return (
            (a = a()),
            b(a),
            function () {
                b(null)
            }
        )
    if (null !== b && void 0 !== b)
        return (
            (a = a()),
            (b.current = a),
            function () {
                b.current = null
            }
        )
}
__name(ui, 'ui')
function vi(a, b, c) {
    c = null !== c && void 0 !== c ? c.concat([a]) : null
    return qi(4, 4, ui.bind(null, b, a), c)
}
__name(vi, 'vi')
function wi() {}
__name(wi, 'wi')
function xi(a, b) {
    var c = ai()
    b = void 0 === b ? null : b
    var d = c.memoizedState
    if (null !== d && null !== b && Th(b, d[1])) return d[0]
    c.memoizedState = [a, b]
    return a
}
__name(xi, 'xi')
function yi(a, b) {
    var c = ai()
    b = void 0 === b ? null : b
    var d = c.memoizedState
    if (null !== d && null !== b && Th(b, d[1])) return d[0]
    a = a()
    c.memoizedState = [a, b]
    return a
}
__name(yi, 'yi')
function zi(a, b, c) {
    if (0 === (Oh & 21))
        return (
            a.baseState && ((a.baseState = false), (tg = true)),
            (a.memoizedState = c)
        )
    Ge(c, b) || ((c = xc()), (L.lanes |= c), (Fg |= c), (a.baseState = true))
    return b
}
__name(zi, 'zi')
function Ai(a, b) {
    var c = C
    C = 0 !== c && 4 > c ? c : 4
    a(true)
    var d = Nh.transition
    Nh.transition = {}
    try {
        a(false), b()
    } finally {
        ;(C = c), (Nh.transition = d)
    }
}
__name(Ai, 'Ai')
function Bi() {
    return ai().memoizedState
}
__name(Bi, 'Bi')
function Ci(a, b, c) {
    var d = Kg(a)
    c = {
        lane: d,
        action: c,
        hasEagerState: false,
        eagerState: null,
        next: null
    }
    Di(a)
        ? Ei(b, c)
        : (Fi(a, b, c),
          (c = Jg()),
          (a = Lg(a, d, c)),
          null !== a && Gi(a, b, d))
}
__name(Ci, 'Ci')
function ni(a, b, c) {
    var d = Kg(a),
        e = {
            lane: d,
            action: c,
            hasEagerState: false,
            eagerState: null,
            next: null
        }
    if (Di(a)) Ei(b, e)
    else {
        Fi(a, b, e)
        var f = a.alternate
        if (
            0 === a.lanes &&
            (null === f || 0 === f.lanes) &&
            ((f = b.lastRenderedReducer), null !== f)
        )
            try {
                var g = b.lastRenderedState,
                    h = f(g, c)
                e.hasEagerState = true
                e.eagerState = h
                if (Ge(h, g)) return
            } catch (k) {
            } finally {
            }
        c = Jg()
        a = Lg(a, d, c)
        null !== a && Gi(a, b, d)
    }
}
__name(ni, 'ni')
function Di(a) {
    var b = a.alternate
    return a === L || (null !== b && b === L)
}
__name(Di, 'Di')
function Ei(a, b) {
    Qh = Ph = true
    var c = a.pending
    null === c ? (b.next = b) : ((b.next = c.next), (c.next = b))
    a.pending = b
}
__name(Ei, 'Ei')
function Fi(a, b, c) {
    Bg(a)
        ? ((a = b.interleaved),
          null === a
              ? ((c.next = c), null === vg ? (vg = [b]) : vg.push(b))
              : ((c.next = a.next), (a.next = c)),
          (b.interleaved = c))
        : ((a = b.pending),
          null === a ? (c.next = c) : ((c.next = a.next), (a.next = c)),
          (b.pending = c))
}
__name(Fi, 'Fi')
function Gi(a, b, c) {
    if (0 !== (c & 4194240)) {
        var d = b.lanes
        d &= a.pendingLanes
        c |= d
        b.lanes = c
        Bc(a, c)
    }
}
__name(Gi, 'Gi')
var Yh = {
        readContext: ug,
        useCallback: O,
        useContext: O,
        useEffect: O,
        useImperativeHandle: O,
        useInsertionEffect: O,
        useLayoutEffect: O,
        useMemo: O,
        useReducer: O,
        useRef: O,
        useState: O,
        useDebugValue: O,
        useDeferredValue: O,
        useTransition: O,
        useMutableSource: O,
        useSyncExternalStore: O,
        useId: O,
        unstable_isNewReconciler: false
    },
    Vh = {
        readContext: ug,
        useCallback: function (a, b) {
            $h().memoizedState = [a, void 0 === b ? null : b]
            return a
        },
        useContext: ug,
        useEffect: ri,
        useImperativeHandle: function (a, b, c) {
            c = null !== c && void 0 !== c ? c.concat([a]) : null
            return pi(4194308, 4, ui.bind(null, b, a), c)
        },
        useLayoutEffect: function (a, b) {
            return pi(4194308, 4, a, b)
        },
        useInsertionEffect: function (a, b) {
            return pi(4, 2, a, b)
        },
        useMemo: function (a, b) {
            var c = $h()
            b = void 0 === b ? null : b
            a = a()
            c.memoizedState = [a, b]
            return a
        },
        useReducer: function (a, b, c) {
            var d = $h()
            b = void 0 !== c ? c(b) : b
            d.memoizedState = d.baseState = b
            a = {
                pending: null,
                interleaved: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: a,
                lastRenderedState: b
            }
            d.queue = a
            a = a.dispatch = Ci.bind(null, L, a)
            return [d.memoizedState, a]
        },
        useRef: function (a) {
            var b = $h()
            a = { current: a }
            return (b.memoizedState = a)
        },
        useState: mi,
        useDebugValue: wi,
        useDeferredValue: function (a) {
            return ($h().memoizedState = a)
        },
        useTransition: function () {
            var a = mi(false),
                b = a[0]
            a = Ai.bind(null, a[1])
            $h().memoizedState = a
            return [b, a]
        },
        useMutableSource: function () {},
        useSyncExternalStore: function (a, b, c) {
            var d = L,
                e = $h()
            if (I) {
                if (void 0 === c) throw Error(p(407))
                c = c()
            } else {
                c = b()
                if (null === P) throw Error(p(349))
                0 !== (Oh & 30) || ki(d, b, c)
            }
            e.memoizedState = c
            var f = { value: c, getSnapshot: b }
            e.queue = f
            ri(hi.bind(null, d, f, a), [a])
            d.flags |= 2048
            ii(9, ji.bind(null, d, f, c, b), void 0, null)
            return c
        },
        useId: function () {
            var a = $h(),
                b = P.identifierPrefix
            if (I) {
                var c = Zg
                var d = Yg
                c = (d & ~(1 << (32 - nc(d) - 1))).toString(32) + c
                b = ':' + b + 'R' + c
                c = Rh++
                0 < c && (b += 'H' + c.toString(32))
                b += ':'
            } else (c = Sh++), (b = ':' + b + 'r' + c.toString(32) + ':')
            return (a.memoizedState = b)
        },
        unstable_isNewReconciler: false
    },
    Wh = {
        readContext: ug,
        useCallback: xi,
        useContext: ug,
        useEffect: gi,
        useImperativeHandle: vi,
        useInsertionEffect: si,
        useLayoutEffect: ti,
        useMemo: yi,
        useReducer: ci,
        useRef: oi,
        useState: function () {
            return ci(bi)
        },
        useDebugValue: wi,
        useDeferredValue: function (a) {
            var b = ai()
            return zi(b, M.memoizedState, a)
        },
        useTransition: function () {
            var a = ci(bi)[0],
                b = ai().memoizedState
            return [a, b]
        },
        useMutableSource: ei,
        useSyncExternalStore: fi,
        useId: Bi,
        unstable_isNewReconciler: false
    },
    Xh = {
        readContext: ug,
        useCallback: xi,
        useContext: ug,
        useEffect: gi,
        useImperativeHandle: vi,
        useInsertionEffect: si,
        useLayoutEffect: ti,
        useMemo: yi,
        useReducer: di,
        useRef: oi,
        useState: function () {
            return di(bi)
        },
        useDebugValue: wi,
        useDeferredValue: function (a) {
            var b = ai()
            return null === M
                ? (b.memoizedState = a)
                : zi(b, M.memoizedState, a)
        },
        useTransition: function () {
            var a = di(bi)[0],
                b = ai().memoizedState
            return [a, b]
        },
        useMutableSource: ei,
        useSyncExternalStore: fi,
        useId: Bi,
        unstable_isNewReconciler: false
    }
function Hi(a, b) {
    try {
        var c = '',
            d = b
        do (c += Oa(d)), (d = d.return)
        while (d)
        var e = c
    } catch (f) {
        e = '\nError generating stack: ' + f.message + '\n' + f.stack
    }
    return { value: a, source: b, stack: e }
}
__name(Hi, 'Hi')
function Ii(a, b) {
    try {
        console.error(b.value)
    } catch (c) {
        setTimeout(function () {
            throw c
        })
    }
}
__name(Ii, 'Ii')
var Ji = 'function' === typeof WeakMap ? WeakMap : Map
function Ki(a, b, c) {
    c = zg(-1, c)
    c.tag = 3
    c.payload = { element: null }
    var d = b.value
    c.callback = function () {
        Li || ((Li = true), (Mi = d))
        Ii(a, b)
    }
    return c
}
__name(Ki, 'Ki')
function Ni(a, b, c) {
    c = zg(-1, c)
    c.tag = 3
    var d = a.type.getDerivedStateFromError
    if ('function' === typeof d) {
        var e = b.value
        c.payload = function () {
            return d(e)
        }
        c.callback = function () {
            Ii(a, b)
        }
    }
    var f = a.stateNode
    null !== f &&
        'function' === typeof f.componentDidCatch &&
        (c.callback = function () {
            Ii(a, b)
            'function' !== typeof d &&
                (null === Oi
                    ? (Oi = /* @__PURE__ */ new Set([this]))
                    : Oi.add(this))
            var c2 = b.stack
            this.componentDidCatch(b.value, {
                componentStack: null !== c2 ? c2 : ''
            })
        })
    return c
}
__name(Ni, 'Ni')
function Pi(a, b, c) {
    var d = a.pingCache
    if (null === d) {
        d = a.pingCache = new Ji()
        var e = /* @__PURE__ */ new Set()
        d.set(b, e)
    } else
        (e = d.get(b)),
            void 0 === e && ((e = /* @__PURE__ */ new Set()), d.set(b, e))
    e.has(c) || (e.add(c), (a = Qi.bind(null, a, b, c)), b.then(a, a))
}
__name(Pi, 'Pi')
function Ri(a) {
    do {
        var b
        if ((b = 13 === a.tag))
            (b = a.memoizedState),
                (b = null !== b ? (null !== b.dehydrated ? true : false) : true)
        if (b) return a
        a = a.return
    } while (null !== a)
    return null
}
__name(Ri, 'Ri')
function Si(a, b, c, d, e) {
    if (0 === (a.mode & 1))
        return (
            a === b
                ? (a.flags |= 65536)
                : ((a.flags |= 128),
                  (c.flags |= 131072),
                  (c.flags &= -52805),
                  1 === c.tag &&
                      (null === c.alternate
                          ? (c.tag = 17)
                          : ((b = zg(-1, 1)), (b.tag = 2), Ag(c, b))),
                  (c.lanes |= 1)),
            a
        )
    a.flags |= 65536
    a.lanes = e
    return a
}
__name(Si, 'Si')
var Ti, Ui, Vi, Wi
Ti = /* @__PURE__ */ __name(function (a, b) {
    for (var c = b.child; null !== c; ) {
        if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode)
        else if (4 !== c.tag && null !== c.child) {
            c.child.return = c
            c = c.child
            continue
        }
        if (c === b) break
        for (; null === c.sibling; ) {
            if (null === c.return || c.return === b) return
            c = c.return
        }
        c.sibling.return = c.return
        c = c.sibling
    }
}, 'Ti')
Ui = /* @__PURE__ */ __name(function () {}, 'Ui')
Vi = /* @__PURE__ */ __name(function (a, b, c, d) {
    var e = a.memoizedProps
    if (e !== d) {
        a = b.stateNode
        Eh(Bh.current)
        var f = null
        switch (c) {
            case 'input':
                e = Xa(a, e)
                d = Xa(a, d)
                f = []
                break
            case 'select':
                e = A({}, e, { value: void 0 })
                d = A({}, d, { value: void 0 })
                f = []
                break
            case 'textarea':
                e = fb(a, e)
                d = fb(a, d)
                f = []
                break
            default:
                'function' !== typeof e.onClick &&
                    'function' === typeof d.onClick &&
                    (a.onclick = Af)
        }
        tb(c, d)
        var g
        c = null
        for (l in e)
            if (!d.hasOwnProperty(l) && e.hasOwnProperty(l) && null != e[l])
                if ('style' === l) {
                    var h = e[l]
                    for (g in h)
                        h.hasOwnProperty(g) && (c || (c = {}), (c[g] = ''))
                } else
                    'dangerouslySetInnerHTML' !== l &&
                        'children' !== l &&
                        'suppressContentEditableWarning' !== l &&
                        'suppressHydrationWarning' !== l &&
                        'autoFocus' !== l &&
                        (ea.hasOwnProperty(l)
                            ? f || (f = [])
                            : (f = f || []).push(l, null))
        for (l in d) {
            var k = d[l]
            h = null != e ? e[l] : void 0
            if (d.hasOwnProperty(l) && k !== h && (null != k || null != h))
                if ('style' === l)
                    if (h) {
                        for (g in h)
                            !h.hasOwnProperty(g) ||
                                (k && k.hasOwnProperty(g)) ||
                                (c || (c = {}), (c[g] = ''))
                        for (g in k)
                            k.hasOwnProperty(g) &&
                                h[g] !== k[g] &&
                                (c || (c = {}), (c[g] = k[g]))
                    } else c || (f || (f = []), f.push(l, c)), (c = k)
                else
                    'dangerouslySetInnerHTML' === l
                        ? ((k = k ? k.__html : void 0),
                          (h = h ? h.__html : void 0),
                          null != k && h !== k && (f = f || []).push(l, k))
                        : 'children' === l
                        ? ('string' !== typeof k && 'number' !== typeof k) ||
                          (f = f || []).push(l, '' + k)
                        : 'suppressContentEditableWarning' !== l &&
                          'suppressHydrationWarning' !== l &&
                          (ea.hasOwnProperty(l)
                              ? (null != k &&
                                    'onScroll' === l &&
                                    D('scroll', a),
                                f || h === k || (f = []))
                              : (f = f || []).push(l, k))
        }
        c && (f = f || []).push('style', c)
        var l = f
        if ((b.updateQueue = l)) b.flags |= 4
    }
}, 'Vi')
Wi = /* @__PURE__ */ __name(function (a, b, c, d) {
    c !== d && (b.flags |= 4)
}, 'Wi')
function Xi(a, b) {
    if (!I)
        switch (a.tailMode) {
            case 'hidden':
                b = a.tail
                for (var c = null; null !== b; )
                    null !== b.alternate && (c = b), (b = b.sibling)
                null === c ? (a.tail = null) : (c.sibling = null)
                break
            case 'collapsed':
                c = a.tail
                for (var d = null; null !== c; )
                    null !== c.alternate && (d = c), (c = c.sibling)
                null === d
                    ? b || null === a.tail
                        ? (a.tail = null)
                        : (a.tail.sibling = null)
                    : (d.sibling = null)
        }
}
__name(Xi, 'Xi')
function Q(a) {
    var b = null !== a.alternate && a.alternate.child === a.child,
        c = 0,
        d = 0
    if (b)
        for (var e = a.child; null !== e; )
            (c |= e.lanes | e.childLanes),
                (d |= e.subtreeFlags & 14680064),
                (d |= e.flags & 14680064),
                (e.return = a),
                (e = e.sibling)
    else
        for (e = a.child; null !== e; )
            (c |= e.lanes | e.childLanes),
                (d |= e.subtreeFlags),
                (d |= e.flags),
                (e.return = a),
                (e = e.sibling)
    a.subtreeFlags |= d
    a.childLanes = c
    return b
}
__name(Q, 'Q')
function Yi(a, b, c) {
    var d = b.pendingProps
    ch(b)
    switch (b.tag) {
        case 2:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
            return Q(b), null
        case 1:
            return Yf(b.type) && Zf(), Q(b), null
        case 3:
            d = b.stateNode
            Gh()
            E(Vf)
            E(H)
            Lh()
            d.pendingContext &&
                ((d.context = d.pendingContext), (d.pendingContext = null))
            if (null === a || null === a.child)
                mh(b)
                    ? (b.flags |= 4)
                    : null === a ||
                      (a.memoizedState.isDehydrated && 0 === (b.flags & 256)) ||
                      ((b.flags |= 1024), null !== fh && (Zi(fh), (fh = null)))
            Ui(a, b)
            Q(b)
            return null
        case 5:
            Ih(b)
            var e = Eh(Dh.current)
            c = b.type
            if (null !== a && null != b.stateNode)
                Vi(a, b, c, d, e),
                    a.ref !== b.ref && ((b.flags |= 512), (b.flags |= 2097152))
            else {
                if (!d) {
                    if (null === b.stateNode) throw Error(p(166))
                    Q(b)
                    return null
                }
                a = Eh(Bh.current)
                if (mh(b)) {
                    d = b.stateNode
                    c = b.type
                    var f = b.memoizedProps
                    d[Nf] = b
                    d[Of] = f
                    a = 0 !== (b.mode & 1)
                    switch (c) {
                        case 'dialog':
                            D('cancel', d)
                            D('close', d)
                            break
                        case 'iframe':
                        case 'object':
                        case 'embed':
                            D('load', d)
                            break
                        case 'video':
                        case 'audio':
                            for (e = 0; e < kf.length; e++) D(kf[e], d)
                            break
                        case 'source':
                            D('error', d)
                            break
                        case 'img':
                        case 'image':
                        case 'link':
                            D('error', d)
                            D('load', d)
                            break
                        case 'details':
                            D('toggle', d)
                            break
                        case 'input':
                            Ya(d, f)
                            D('invalid', d)
                            break
                        case 'select':
                            d._wrapperState = { wasMultiple: !!f.multiple }
                            D('invalid', d)
                            break
                        case 'textarea':
                            gb(d, f), D('invalid', d)
                    }
                    tb(c, f)
                    e = null
                    for (var g in f)
                        if (f.hasOwnProperty(g)) {
                            var h = f[g]
                            'children' === g
                                ? 'string' === typeof h
                                    ? d.textContent !== h &&
                                      (true !== f.suppressHydrationWarning &&
                                          zf(d.textContent, h, a),
                                      (e = ['children', h]))
                                    : 'number' === typeof h &&
                                      d.textContent !== '' + h &&
                                      (true !== f.suppressHydrationWarning &&
                                          zf(d.textContent, h, a),
                                      (e = ['children', '' + h]))
                                : ea.hasOwnProperty(g) &&
                                  null != h &&
                                  'onScroll' === g &&
                                  D('scroll', d)
                        }
                    switch (c) {
                        case 'input':
                            Ua(d)
                            cb(d, f, true)
                            break
                        case 'textarea':
                            Ua(d)
                            ib(d)
                            break
                        case 'select':
                        case 'option':
                            break
                        default:
                            'function' === typeof f.onClick && (d.onclick = Af)
                    }
                    d = e
                    b.updateQueue = d
                    null !== d && (b.flags |= 4)
                } else {
                    g = 9 === e.nodeType ? e : e.ownerDocument
                    'http://www.w3.org/1999/xhtml' === a && (a = jb(c))
                    'http://www.w3.org/1999/xhtml' === a
                        ? 'script' === c
                            ? ((a = g.createElement('div')),
                              (a.innerHTML = '<script></script>'),
                              (a = a.removeChild(a.firstChild)))
                            : 'string' === typeof d.is
                            ? (a = g.createElement(c, { is: d.is }))
                            : ((a = g.createElement(c)),
                              'select' === c &&
                                  ((g = a),
                                  d.multiple
                                      ? (g.multiple = true)
                                      : d.size && (g.size = d.size)))
                        : (a = g.createElementNS(a, c))
                    a[Nf] = b
                    a[Of] = d
                    Ti(a, b, false, false)
                    b.stateNode = a
                    a: {
                        g = ub(c, d)
                        switch (c) {
                            case 'dialog':
                                D('cancel', a)
                                D('close', a)
                                e = d
                                break
                            case 'iframe':
                            case 'object':
                            case 'embed':
                                D('load', a)
                                e = d
                                break
                            case 'video':
                            case 'audio':
                                for (e = 0; e < kf.length; e++) D(kf[e], a)
                                e = d
                                break
                            case 'source':
                                D('error', a)
                                e = d
                                break
                            case 'img':
                            case 'image':
                            case 'link':
                                D('error', a)
                                D('load', a)
                                e = d
                                break
                            case 'details':
                                D('toggle', a)
                                e = d
                                break
                            case 'input':
                                Ya(a, d)
                                e = Xa(a, d)
                                D('invalid', a)
                                break
                            case 'option':
                                e = d
                                break
                            case 'select':
                                a._wrapperState = { wasMultiple: !!d.multiple }
                                e = A({}, d, { value: void 0 })
                                D('invalid', a)
                                break
                            case 'textarea':
                                gb(a, d)
                                e = fb(a, d)
                                D('invalid', a)
                                break
                            default:
                                e = d
                        }
                        tb(c, e)
                        h = e
                        for (f in h)
                            if (h.hasOwnProperty(f)) {
                                var k = h[f]
                                'style' === f
                                    ? rb(a, k)
                                    : 'dangerouslySetInnerHTML' === f
                                    ? ((k = k ? k.__html : void 0),
                                      null != k && mb(a, k))
                                    : 'children' === f
                                    ? 'string' === typeof k
                                        ? ('textarea' !== c || '' !== k) &&
                                          nb(a, k)
                                        : 'number' === typeof k && nb(a, '' + k)
                                    : 'suppressContentEditableWarning' !== f &&
                                      'suppressHydrationWarning' !== f &&
                                      'autoFocus' !== f &&
                                      (ea.hasOwnProperty(f)
                                          ? null != k &&
                                            'onScroll' === f &&
                                            D('scroll', a)
                                          : null != k && sa(a, f, k, g))
                            }
                        switch (c) {
                            case 'input':
                                Ua(a)
                                cb(a, d, false)
                                break
                            case 'textarea':
                                Ua(a)
                                ib(a)
                                break
                            case 'option':
                                null != d.value &&
                                    a.setAttribute('value', '' + Ra(d.value))
                                break
                            case 'select':
                                a.multiple = !!d.multiple
                                f = d.value
                                null != f
                                    ? eb(a, !!d.multiple, f, false)
                                    : null != d.defaultValue &&
                                      eb(a, !!d.multiple, d.defaultValue, true)
                                break
                            default:
                                'function' === typeof e.onClick &&
                                    (a.onclick = Af)
                        }
                        switch (c) {
                            case 'button':
                            case 'input':
                            case 'select':
                            case 'textarea':
                                d = !!d.autoFocus
                                break a
                            case 'img':
                                d = true
                                break a
                            default:
                                d = false
                        }
                    }
                    d && (b.flags |= 4)
                }
                null !== b.ref && ((b.flags |= 512), (b.flags |= 2097152))
            }
            Q(b)
            return null
        case 6:
            if (a && null != b.stateNode) Wi(a, b, a.memoizedProps, d)
            else {
                if ('string' !== typeof d && null === b.stateNode)
                    throw Error(p(166))
                c = Eh(Dh.current)
                Eh(Bh.current)
                if (mh(b)) {
                    d = b.stateNode
                    c = b.memoizedProps
                    d[Nf] = b
                    if ((f = d.nodeValue !== c)) {
                        if (((a = dh), null !== a))
                            switch (a.tag) {
                                case 3:
                                    zf(d.nodeValue, c, 0 !== (a.mode & 1))
                                    break
                                case 5:
                                    true !==
                                        a.memoizedProps
                                            .suppressHydrationWarning &&
                                        zf(d.nodeValue, c, 0 !== (a.mode & 1))
                            }
                    }
                    f && (b.flags |= 4)
                } else
                    (d = (
                        9 === c.nodeType ? c : c.ownerDocument
                    ).createTextNode(d)),
                        (d[Nf] = b),
                        (b.stateNode = d)
            }
            Q(b)
            return null
        case 13:
            E(K)
            d = b.memoizedState
            if (
                I &&
                null !== eh &&
                0 !== (b.mode & 1) &&
                0 === (b.flags & 128)
            ) {
                for (d = eh; d; ) d = Kf(d.nextSibling)
                nh()
                b.flags |= 98560
                return b
            }
            if (null !== d && null !== d.dehydrated) {
                d = mh(b)
                if (null === a) {
                    if (!d) throw Error(p(318))
                    d = b.memoizedState
                    d = null !== d ? d.dehydrated : null
                    if (!d) throw Error(p(317))
                    d[Nf] = b
                } else
                    nh(),
                        0 === (b.flags & 128) && (b.memoizedState = null),
                        (b.flags |= 4)
                Q(b)
                return null
            }
            null !== fh && (Zi(fh), (fh = null))
            if (0 !== (b.flags & 128)) return (b.lanes = c), b
            d = null !== d
            c = false
            null === a ? mh(b) : (c = null !== a.memoizedState)
            d !== c &&
                d &&
                ((b.child.flags |= 8192),
                0 !== (b.mode & 1) &&
                    (null === a || 0 !== (K.current & 1)
                        ? 0 === R && (R = 3)
                        : $i()))
            null !== b.updateQueue && (b.flags |= 4)
            Q(b)
            return null
        case 4:
            return (
                Gh(),
                Ui(a, b),
                null === a && rf(b.stateNode.containerInfo),
                Q(b),
                null
            )
        case 10:
            return qg(b.type._context), Q(b), null
        case 17:
            return Yf(b.type) && Zf(), Q(b), null
        case 19:
            E(K)
            f = b.memoizedState
            if (null === f) return Q(b), null
            d = 0 !== (b.flags & 128)
            g = f.rendering
            if (null === g)
                if (d) Xi(f, false)
                else {
                    if (0 !== R || (null !== a && 0 !== (a.flags & 128)))
                        for (a = b.child; null !== a; ) {
                            g = Jh(a)
                            if (null !== g) {
                                b.flags |= 128
                                Xi(f, false)
                                d = g.updateQueue
                                null !== d &&
                                    ((b.updateQueue = d), (b.flags |= 4))
                                b.subtreeFlags = 0
                                d = c
                                for (c = b.child; null !== c; )
                                    (f = c),
                                        (a = d),
                                        (f.flags &= 14680066),
                                        (g = f.alternate),
                                        null === g
                                            ? ((f.childLanes = 0),
                                              (f.lanes = a),
                                              (f.child = null),
                                              (f.subtreeFlags = 0),
                                              (f.memoizedProps = null),
                                              (f.memoizedState = null),
                                              (f.updateQueue = null),
                                              (f.dependencies = null),
                                              (f.stateNode = null))
                                            : ((f.childLanes = g.childLanes),
                                              (f.lanes = g.lanes),
                                              (f.child = g.child),
                                              (f.subtreeFlags = 0),
                                              (f.deletions = null),
                                              (f.memoizedProps =
                                                  g.memoizedProps),
                                              (f.memoizedState =
                                                  g.memoizedState),
                                              (f.updateQueue = g.updateQueue),
                                              (f.type = g.type),
                                              (a = g.dependencies),
                                              (f.dependencies =
                                                  null === a
                                                      ? null
                                                      : {
                                                            lanes: a.lanes,
                                                            firstContext:
                                                                a.firstContext
                                                        })),
                                        (c = c.sibling)
                                G(K, (K.current & 1) | 2)
                                return b.child
                            }
                            a = a.sibling
                        }
                    null !== f.tail &&
                        B() > aj &&
                        ((b.flags |= 128),
                        (d = true),
                        Xi(f, false),
                        (b.lanes = 4194304))
                }
            else {
                if (!d)
                    if (((a = Jh(g)), null !== a)) {
                        if (
                            ((b.flags |= 128),
                            (d = true),
                            (c = a.updateQueue),
                            null !== c && ((b.updateQueue = c), (b.flags |= 4)),
                            Xi(f, true),
                            null === f.tail &&
                                'hidden' === f.tailMode &&
                                !g.alternate &&
                                !I)
                        )
                            return Q(b), null
                    } else
                        2 * B() - f.renderingStartTime > aj &&
                            1073741824 !== c &&
                            ((b.flags |= 128),
                            (d = true),
                            Xi(f, false),
                            (b.lanes = 4194304))
                f.isBackwards
                    ? ((g.sibling = b.child), (b.child = g))
                    : ((c = f.last),
                      null !== c ? (c.sibling = g) : (b.child = g),
                      (f.last = g))
            }
            if (null !== f.tail)
                return (
                    (b = f.tail),
                    (f.rendering = b),
                    (f.tail = b.sibling),
                    (f.renderingStartTime = B()),
                    (b.sibling = null),
                    (c = K.current),
                    G(K, d ? (c & 1) | 2 : c & 1),
                    b
                )
            Q(b)
            return null
        case 22:
        case 23:
            return (
                bj(),
                (d = null !== b.memoizedState),
                null !== a &&
                    (null !== a.memoizedState) !== d &&
                    (b.flags |= 8192),
                d && 0 !== (b.mode & 1)
                    ? 0 !== (cj & 1073741824) &&
                      (Q(b), b.subtreeFlags & 6 && (b.flags |= 8192))
                    : Q(b),
                null
            )
        case 24:
            return null
        case 25:
            return null
    }
    throw Error(p(156, b.tag))
}
__name(Yi, 'Yi')
var dj = ta.ReactCurrentOwner,
    tg = false
function ej(a, b, c, d) {
    b.child = null === a ? zh(b, null, c, d) : yh(b, a.child, c, d)
}
__name(ej, 'ej')
function fj(a, b, c, d, e) {
    c = c.render
    var f = b.ref
    sg(b, e)
    d = Uh(a, b, c, d, f, e)
    c = Zh()
    if (null !== a && !tg)
        return (
            (b.updateQueue = a.updateQueue),
            (b.flags &= -2053),
            (a.lanes &= ~e),
            gj(a, b, e)
        )
    I && c && bh(b)
    b.flags |= 1
    ej(a, b, d, e)
    return b.child
}
__name(fj, 'fj')
function hj(a, b, c, d, e) {
    if (null === a) {
        var f = c.type
        if (
            'function' === typeof f &&
            !ij(f) &&
            void 0 === f.defaultProps &&
            null === c.compare &&
            void 0 === c.defaultProps
        )
            return (b.tag = 15), (b.type = f), jj(a, b, f, d, e)
        a = vh(c.type, null, d, b, b.mode, e)
        a.ref = b.ref
        a.return = b
        return (b.child = a)
    }
    f = a.child
    if (0 === (a.lanes & e)) {
        var g = f.memoizedProps
        c = c.compare
        c = null !== c ? c : He
        if (c(g, d) && a.ref === b.ref) return gj(a, b, e)
    }
    b.flags |= 1
    a = th(f, d)
    a.ref = b.ref
    a.return = b
    return (b.child = a)
}
__name(hj, 'hj')
function jj(a, b, c, d, e) {
    if (null !== a) {
        var f = a.memoizedProps
        if (He(f, d) && a.ref === b.ref)
            if (((tg = false), (b.pendingProps = d = f), 0 !== (a.lanes & e)))
                0 !== (a.flags & 131072) && (tg = true)
            else return (b.lanes = a.lanes), gj(a, b, e)
    }
    return kj(a, b, c, d, e)
}
__name(jj, 'jj')
function lj(a, b, c) {
    var d = b.pendingProps,
        e = d.children,
        f = null !== a ? a.memoizedState : null
    if ('hidden' === d.mode)
        if (0 === (b.mode & 1))
            (b.memoizedState = {
                baseLanes: 0,
                cachePool: null,
                transitions: null
            }),
                G(mj, cj),
                (cj |= c)
        else if (0 !== (c & 1073741824))
            (b.memoizedState = {
                baseLanes: 0,
                cachePool: null,
                transitions: null
            }),
                (d = null !== f ? f.baseLanes : c),
                G(mj, cj),
                (cj |= d)
        else
            return (
                (a = null !== f ? f.baseLanes | c : c),
                (b.lanes = b.childLanes = 1073741824),
                (b.memoizedState = {
                    baseLanes: a,
                    cachePool: null,
                    transitions: null
                }),
                (b.updateQueue = null),
                G(mj, cj),
                (cj |= a),
                null
            )
    else
        null !== f
            ? ((d = f.baseLanes | c), (b.memoizedState = null))
            : (d = c),
            G(mj, cj),
            (cj |= d)
    ej(a, b, e, c)
    return b.child
}
__name(lj, 'lj')
function nj(a, b) {
    var c = b.ref
    if ((null === a && null !== c) || (null !== a && a.ref !== c))
        (b.flags |= 512), (b.flags |= 2097152)
}
__name(nj, 'nj')
function kj(a, b, c, d, e) {
    var f = Yf(c) ? Wf : H.current
    f = Xf(b, f)
    sg(b, e)
    c = Uh(a, b, c, d, f, e)
    d = Zh()
    if (null !== a && !tg)
        return (
            (b.updateQueue = a.updateQueue),
            (b.flags &= -2053),
            (a.lanes &= ~e),
            gj(a, b, e)
        )
    I && d && bh(b)
    b.flags |= 1
    ej(a, b, c, e)
    return b.child
}
__name(kj, 'kj')
function oj(a, b, c, d, e) {
    if (Yf(c)) {
        var f = true
        bg(b)
    } else f = false
    sg(b, e)
    if (null === b.stateNode)
        null !== a &&
            ((a.alternate = null), (b.alternate = null), (b.flags |= 2)),
            Og(b, c, d),
            Qg(b, c, d, e),
            (d = true)
    else if (null === a) {
        var g = b.stateNode,
            h = b.memoizedProps
        g.props = h
        var k = g.context,
            l = c.contextType
        'object' === typeof l && null !== l
            ? (l = ug(l))
            : ((l = Yf(c) ? Wf : H.current), (l = Xf(b, l)))
        var n = c.getDerivedStateFromProps,
            u =
                'function' === typeof n ||
                'function' === typeof g.getSnapshotBeforeUpdate
        u ||
            ('function' !== typeof g.UNSAFE_componentWillReceiveProps &&
                'function' !== typeof g.componentWillReceiveProps) ||
            ((h !== d || k !== l) && Pg(b, g, d, l))
        wg = false
        var q = b.memoizedState
        g.state = q
        Eg(b, d, g, e)
        k = b.memoizedState
        h !== d || q !== k || Vf.current || wg
            ? ('function' === typeof n &&
                  (Ig(b, c, n, d), (k = b.memoizedState)),
              (h = wg || Ng(b, c, h, d, q, k, l))
                  ? (u ||
                        ('function' !== typeof g.UNSAFE_componentWillMount &&
                            'function' !== typeof g.componentWillMount) ||
                        ('function' === typeof g.componentWillMount &&
                            g.componentWillMount(),
                        'function' === typeof g.UNSAFE_componentWillMount &&
                            g.UNSAFE_componentWillMount()),
                    'function' === typeof g.componentDidMount &&
                        (b.flags |= 4194308))
                  : ('function' === typeof g.componentDidMount &&
                        (b.flags |= 4194308),
                    (b.memoizedProps = d),
                    (b.memoizedState = k)),
              (g.props = d),
              (g.state = k),
              (g.context = l),
              (d = h))
            : ('function' === typeof g.componentDidMount &&
                  (b.flags |= 4194308),
              (d = false))
    } else {
        g = b.stateNode
        yg(a, b)
        h = b.memoizedProps
        l = b.type === b.elementType ? h : kg(b.type, h)
        g.props = l
        u = b.pendingProps
        q = g.context
        k = c.contextType
        'object' === typeof k && null !== k
            ? (k = ug(k))
            : ((k = Yf(c) ? Wf : H.current), (k = Xf(b, k)))
        var y = c.getDerivedStateFromProps
        ;(n =
            'function' === typeof y ||
            'function' === typeof g.getSnapshotBeforeUpdate) ||
            ('function' !== typeof g.UNSAFE_componentWillReceiveProps &&
                'function' !== typeof g.componentWillReceiveProps) ||
            ((h !== u || q !== k) && Pg(b, g, d, k))
        wg = false
        q = b.memoizedState
        g.state = q
        Eg(b, d, g, e)
        var m = b.memoizedState
        h !== u || q !== m || Vf.current || wg
            ? ('function' === typeof y &&
                  (Ig(b, c, y, d), (m = b.memoizedState)),
              (l = wg || Ng(b, c, l, d, q, m, k) || false)
                  ? (n ||
                        ('function' !== typeof g.UNSAFE_componentWillUpdate &&
                            'function' !== typeof g.componentWillUpdate) ||
                        ('function' === typeof g.componentWillUpdate &&
                            g.componentWillUpdate(d, m, k),
                        'function' === typeof g.UNSAFE_componentWillUpdate &&
                            g.UNSAFE_componentWillUpdate(d, m, k)),
                    'function' === typeof g.componentDidUpdate &&
                        (b.flags |= 4),
                    'function' === typeof g.getSnapshotBeforeUpdate &&
                        (b.flags |= 1024))
                  : ('function' !== typeof g.componentDidUpdate ||
                        (h === a.memoizedProps && q === a.memoizedState) ||
                        (b.flags |= 4),
                    'function' !== typeof g.getSnapshotBeforeUpdate ||
                        (h === a.memoizedProps && q === a.memoizedState) ||
                        (b.flags |= 1024),
                    (b.memoizedProps = d),
                    (b.memoizedState = m)),
              (g.props = d),
              (g.state = m),
              (g.context = k),
              (d = l))
            : ('function' !== typeof g.componentDidUpdate ||
                  (h === a.memoizedProps && q === a.memoizedState) ||
                  (b.flags |= 4),
              'function' !== typeof g.getSnapshotBeforeUpdate ||
                  (h === a.memoizedProps && q === a.memoizedState) ||
                  (b.flags |= 1024),
              (d = false))
    }
    return pj(a, b, c, d, f, e)
}
__name(oj, 'oj')
function pj(a, b, c, d, e, f) {
    nj(a, b)
    var g = 0 !== (b.flags & 128)
    if (!d && !g) return e && cg(b, c, false), gj(a, b, f)
    d = b.stateNode
    dj.current = b
    var h =
        g && 'function' !== typeof c.getDerivedStateFromError
            ? null
            : d.render()
    b.flags |= 1
    null !== a && g
        ? ((b.child = yh(b, a.child, null, f)), (b.child = yh(b, null, h, f)))
        : ej(a, b, h, f)
    b.memoizedState = d.state
    e && cg(b, c, true)
    return b.child
}
__name(pj, 'pj')
function qj(a) {
    var b = a.stateNode
    b.pendingContext
        ? $f(a, b.pendingContext, b.pendingContext !== b.context)
        : b.context && $f(a, b.context, false)
    Fh(a, b.containerInfo)
}
__name(qj, 'qj')
function rj(a, b, c, d, e) {
    nh()
    oh(e)
    b.flags |= 256
    ej(a, b, c, d)
    return b.child
}
__name(rj, 'rj')
var sj = { dehydrated: null, treeContext: null, retryLane: 0 }
function tj(a) {
    return { baseLanes: a, cachePool: null, transitions: null }
}
__name(tj, 'tj')
function uj(a, b) {
    return {
        baseLanes: a.baseLanes | b,
        cachePool: null,
        transitions: a.transitions
    }
}
__name(uj, 'uj')
function vj(a, b, c) {
    var d = b.pendingProps,
        e = K.current,
        f = false,
        g = 0 !== (b.flags & 128),
        h
    ;(h = g) ||
        (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2))
    if (h) (f = true), (b.flags &= -129)
    else if (null === a || null !== a.memoizedState) e |= 1
    G(K, e & 1)
    if (null === a) {
        kh(b)
        a = b.memoizedState
        if (null !== a && ((a = a.dehydrated), null !== a))
            return (
                0 === (b.mode & 1)
                    ? (b.lanes = 1)
                    : '$!' === a.data
                    ? (b.lanes = 8)
                    : (b.lanes = 1073741824),
                null
            )
        e = d.children
        a = d.fallback
        return f
            ? ((d = b.mode),
              (f = b.child),
              (e = { mode: 'hidden', children: e }),
              0 === (d & 1) && null !== f
                  ? ((f.childLanes = 0), (f.pendingProps = e))
                  : (f = wj(e, d, 0, null)),
              (a = xh(a, d, c, null)),
              (f.return = b),
              (a.return = b),
              (f.sibling = a),
              (b.child = f),
              (b.child.memoizedState = tj(c)),
              (b.memoizedState = sj),
              a)
            : xj(b, e)
    }
    e = a.memoizedState
    if (null !== e) {
        h = e.dehydrated
        if (null !== h) {
            if (g) {
                if (b.flags & 256)
                    return (b.flags &= -257), yj(a, b, c, Error(p(422)))
                if (null !== b.memoizedState)
                    return (b.child = a.child), (b.flags |= 128), null
                f = d.fallback
                e = b.mode
                d = wj({ mode: 'visible', children: d.children }, e, 0, null)
                f = xh(f, e, c, null)
                f.flags |= 2
                d.return = b
                f.return = b
                d.sibling = f
                b.child = d
                0 !== (b.mode & 1) && yh(b, a.child, null, c)
                b.child.memoizedState = tj(c)
                b.memoizedState = sj
                return f
            }
            if (0 === (b.mode & 1)) b = yj(a, b, c, null)
            else if ('$!' === h.data) b = yj(a, b, c, Error(p(419)))
            else if (((d = 0 !== (c & a.childLanes)), tg || d)) {
                d = P
                if (null !== d) {
                    switch (c & -c) {
                        case 4:
                            f = 2
                            break
                        case 16:
                            f = 8
                            break
                        case 64:
                        case 128:
                        case 256:
                        case 512:
                        case 1024:
                        case 2048:
                        case 4096:
                        case 8192:
                        case 16384:
                        case 32768:
                        case 65536:
                        case 131072:
                        case 262144:
                        case 524288:
                        case 1048576:
                        case 2097152:
                        case 4194304:
                        case 8388608:
                        case 16777216:
                        case 33554432:
                        case 67108864:
                            f = 32
                            break
                        case 536870912:
                            f = 268435456
                            break
                        default:
                            f = 0
                    }
                    d = 0 !== (f & (d.suspendedLanes | c)) ? 0 : f
                    0 !== d &&
                        d !== e.retryLane &&
                        ((e.retryLane = d), Lg(a, d, -1))
                }
                $i()
                b = yj(a, b, c, Error(p(421)))
            } else
                '$?' === h.data
                    ? ((b.flags |= 128),
                      (b.child = a.child),
                      (b = zj.bind(null, a)),
                      (h._reactRetry = b),
                      (b = null))
                    : ((c = e.treeContext),
                      (eh = Kf(h.nextSibling)),
                      (dh = b),
                      (I = true),
                      (fh = null),
                      null !== c &&
                          ((Vg[Wg++] = Yg),
                          (Vg[Wg++] = Zg),
                          (Vg[Wg++] = Xg),
                          (Yg = c.id),
                          (Zg = c.overflow),
                          (Xg = b)),
                      (b = xj(b, b.pendingProps.children)),
                      (b.flags |= 4096))
            return b
        }
        if (f)
            return (
                (d = Aj(a, b, d.children, d.fallback, c)),
                (f = b.child),
                (e = a.child.memoizedState),
                (f.memoizedState = null === e ? tj(c) : uj(e, c)),
                (f.childLanes = a.childLanes & ~c),
                (b.memoizedState = sj),
                d
            )
        c = Bj(a, b, d.children, c)
        b.memoizedState = null
        return c
    }
    if (f)
        return (
            (d = Aj(a, b, d.children, d.fallback, c)),
            (f = b.child),
            (e = a.child.memoizedState),
            (f.memoizedState = null === e ? tj(c) : uj(e, c)),
            (f.childLanes = a.childLanes & ~c),
            (b.memoizedState = sj),
            d
        )
    c = Bj(a, b, d.children, c)
    b.memoizedState = null
    return c
}
__name(vj, 'vj')
function xj(a, b) {
    b = wj({ mode: 'visible', children: b }, a.mode, 0, null)
    b.return = a
    return (a.child = b)
}
__name(xj, 'xj')
function Bj(a, b, c, d) {
    var e = a.child
    a = e.sibling
    c = th(e, { mode: 'visible', children: c })
    0 === (b.mode & 1) && (c.lanes = d)
    c.return = b
    c.sibling = null
    null !== a &&
        ((d = b.deletions),
        null === d ? ((b.deletions = [a]), (b.flags |= 16)) : d.push(a))
    return (b.child = c)
}
__name(Bj, 'Bj')
function Aj(a, b, c, d, e) {
    var f = b.mode
    a = a.child
    var g = a.sibling,
        h = { mode: 'hidden', children: c }
    0 === (f & 1) && b.child !== a
        ? ((c = b.child),
          (c.childLanes = 0),
          (c.pendingProps = h),
          (b.deletions = null))
        : ((c = th(a, h)), (c.subtreeFlags = a.subtreeFlags & 14680064))
    null !== g ? (d = th(g, d)) : ((d = xh(d, f, e, null)), (d.flags |= 2))
    d.return = b
    c.return = b
    c.sibling = d
    b.child = c
    return d
}
__name(Aj, 'Aj')
function yj(a, b, c, d) {
    null !== d && oh(d)
    yh(b, a.child, null, c)
    a = xj(b, b.pendingProps.children)
    a.flags |= 2
    b.memoizedState = null
    return a
}
__name(yj, 'yj')
function Cj(a, b, c) {
    a.lanes |= b
    var d = a.alternate
    null !== d && (d.lanes |= b)
    rg(a.return, b, c)
}
__name(Cj, 'Cj')
function Dj(a, b, c, d, e) {
    var f = a.memoizedState
    null === f
        ? (a.memoizedState = {
              isBackwards: b,
              rendering: null,
              renderingStartTime: 0,
              last: d,
              tail: c,
              tailMode: e
          })
        : ((f.isBackwards = b),
          (f.rendering = null),
          (f.renderingStartTime = 0),
          (f.last = d),
          (f.tail = c),
          (f.tailMode = e))
}
__name(Dj, 'Dj')
function Ej(a, b, c) {
    var d = b.pendingProps,
        e = d.revealOrder,
        f = d.tail
    ej(a, b, d.children, c)
    d = K.current
    if (0 !== (d & 2)) (d = (d & 1) | 2), (b.flags |= 128)
    else {
        if (null !== a && 0 !== (a.flags & 128))
            a: for (a = b.child; null !== a; ) {
                if (13 === a.tag) null !== a.memoizedState && Cj(a, c, b)
                else if (19 === a.tag) Cj(a, c, b)
                else if (null !== a.child) {
                    a.child.return = a
                    a = a.child
                    continue
                }
                if (a === b) break a
                for (; null === a.sibling; ) {
                    if (null === a.return || a.return === b) break a
                    a = a.return
                }
                a.sibling.return = a.return
                a = a.sibling
            }
        d &= 1
    }
    G(K, d)
    if (0 === (b.mode & 1)) b.memoizedState = null
    else
        switch (e) {
            case 'forwards':
                c = b.child
                for (e = null; null !== c; )
                    (a = c.alternate),
                        null !== a && null === Jh(a) && (e = c),
                        (c = c.sibling)
                c = e
                null === c
                    ? ((e = b.child), (b.child = null))
                    : ((e = c.sibling), (c.sibling = null))
                Dj(b, false, e, c, f)
                break
            case 'backwards':
                c = null
                e = b.child
                for (b.child = null; null !== e; ) {
                    a = e.alternate
                    if (null !== a && null === Jh(a)) {
                        b.child = e
                        break
                    }
                    a = e.sibling
                    e.sibling = c
                    c = e
                    e = a
                }
                Dj(b, true, c, null, f)
                break
            case 'together':
                Dj(b, false, null, null, void 0)
                break
            default:
                b.memoizedState = null
        }
    return b.child
}
__name(Ej, 'Ej')
function gj(a, b, c) {
    null !== a && (b.dependencies = a.dependencies)
    Fg |= b.lanes
    if (0 === (c & b.childLanes)) return null
    if (null !== a && b.child !== a.child) throw Error(p(153))
    if (null !== b.child) {
        a = b.child
        c = th(a, a.pendingProps)
        b.child = c
        for (c.return = b; null !== a.sibling; )
            (a = a.sibling),
                (c = c.sibling = th(a, a.pendingProps)),
                (c.return = b)
        c.sibling = null
    }
    return b.child
}
__name(gj, 'gj')
function Fj(a, b, c) {
    switch (b.tag) {
        case 3:
            qj(b)
            nh()
            break
        case 5:
            Hh(b)
            break
        case 1:
            Yf(b.type) && bg(b)
            break
        case 4:
            Fh(b, b.stateNode.containerInfo)
            break
        case 10:
            var d = b.type._context,
                e = b.memoizedProps.value
            G(lg, d._currentValue)
            d._currentValue = e
            break
        case 13:
            d = b.memoizedState
            if (null !== d) {
                if (null !== d.dehydrated)
                    return G(K, K.current & 1), (b.flags |= 128), null
                if (0 !== (c & b.child.childLanes)) return vj(a, b, c)
                G(K, K.current & 1)
                a = gj(a, b, c)
                return null !== a ? a.sibling : null
            }
            G(K, K.current & 1)
            break
        case 19:
            d = 0 !== (c & b.childLanes)
            if (0 !== (a.flags & 128)) {
                if (d) return Ej(a, b, c)
                b.flags |= 128
            }
            e = b.memoizedState
            null !== e &&
                ((e.rendering = null), (e.tail = null), (e.lastEffect = null))
            G(K, K.current)
            if (d) break
            else return null
        case 22:
        case 23:
            return (b.lanes = 0), lj(a, b, c)
    }
    return gj(a, b, c)
}
__name(Fj, 'Fj')
function Gj(a, b) {
    ch(b)
    switch (b.tag) {
        case 1:
            return (
                Yf(b.type) && Zf(),
                (a = b.flags),
                a & 65536 ? ((b.flags = (a & -65537) | 128), b) : null
            )
        case 3:
            return (
                Gh(),
                E(Vf),
                E(H),
                Lh(),
                (a = b.flags),
                0 !== (a & 65536) && 0 === (a & 128)
                    ? ((b.flags = (a & -65537) | 128), b)
                    : null
            )
        case 5:
            return Ih(b), null
        case 13:
            E(K)
            a = b.memoizedState
            if (null !== a && null !== a.dehydrated) {
                if (null === b.alternate) throw Error(p(340))
                nh()
            }
            a = b.flags
            return a & 65536 ? ((b.flags = (a & -65537) | 128), b) : null
        case 19:
            return E(K), null
        case 4:
            return Gh(), null
        case 10:
            return qg(b.type._context), null
        case 22:
        case 23:
            return bj(), null
        case 24:
            return null
        default:
            return null
    }
}
__name(Gj, 'Gj')
var Hj = false,
    S = false,
    Ij = 'function' === typeof WeakSet ? WeakSet : Set,
    T = null
function Jj(a, b) {
    var c = a.ref
    if (null !== c)
        if ('function' === typeof c)
            try {
                c(null)
            } catch (d) {
                U(a, b, d)
            }
        else c.current = null
}
__name(Jj, 'Jj')
function Kj(a, b, c) {
    try {
        c()
    } catch (d) {
        U(a, b, d)
    }
}
__name(Kj, 'Kj')
var Lj = false
function Mj(a, b) {
    Bf = cd
    a = Le()
    if (Me(a)) {
        if ('selectionStart' in a)
            var c = { start: a.selectionStart, end: a.selectionEnd }
        else
            a: {
                c = ((c = a.ownerDocument) && c.defaultView) || window
                var d = c.getSelection && c.getSelection()
                if (d && 0 !== d.rangeCount) {
                    c = d.anchorNode
                    var e = d.anchorOffset,
                        f = d.focusNode
                    d = d.focusOffset
                    try {
                        c.nodeType, f.nodeType
                    } catch (Z) {
                        c = null
                        break a
                    }
                    var g = 0,
                        h = -1,
                        k = -1,
                        l = 0,
                        n = 0,
                        u = a,
                        q = null
                    b: for (;;) {
                        for (var y; ; ) {
                            u !== c ||
                                (0 !== e && 3 !== u.nodeType) ||
                                (h = g + e)
                            u !== f ||
                                (0 !== d && 3 !== u.nodeType) ||
                                (k = g + d)
                            3 === u.nodeType && (g += u.nodeValue.length)
                            if (null === (y = u.firstChild)) break
                            q = u
                            u = y
                        }
                        for (;;) {
                            if (u === a) break b
                            q === c && ++l === e && (h = g)
                            q === f && ++n === d && (k = g)
                            if (null !== (y = u.nextSibling)) break
                            u = q
                            q = u.parentNode
                        }
                        u = y
                    }
                    c = -1 === h || -1 === k ? null : { start: h, end: k }
                } else c = null
            }
        c = c || { start: 0, end: 0 }
    } else c = null
    Cf = { focusedElem: a, selectionRange: c }
    cd = false
    for (T = b; null !== T; )
        if (
            ((b = T),
            (a = b.child),
            0 !== (b.subtreeFlags & 1028) && null !== a)
        )
            (a.return = b), (T = a)
        else
            for (; null !== T; ) {
                b = T
                try {
                    var m = b.alternate
                    if (0 !== (b.flags & 1024))
                        switch (b.tag) {
                            case 0:
                            case 11:
                            case 15:
                                break
                            case 1:
                                if (null !== m) {
                                    var w = m.memoizedProps,
                                        J = m.memoizedState,
                                        v = b.stateNode,
                                        x = v.getSnapshotBeforeUpdate(
                                            b.elementType === b.type
                                                ? w
                                                : kg(b.type, w),
                                            J
                                        )
                                    v.__reactInternalSnapshotBeforeUpdate = x
                                }
                                break
                            case 3:
                                var r = b.stateNode.containerInfo
                                if (1 === r.nodeType) r.textContent = ''
                                else if (9 === r.nodeType) {
                                    var F = r.body
                                    null != F && (F.textContent = '')
                                }
                                break
                            case 5:
                            case 6:
                            case 4:
                            case 17:
                                break
                            default:
                                throw Error(p(163))
                        }
                } catch (Z) {
                    U(b, b.return, Z)
                }
                a = b.sibling
                if (null !== a) {
                    a.return = b.return
                    T = a
                    break
                }
                T = b.return
            }
    m = Lj
    Lj = false
    return m
}
__name(Mj, 'Mj')
function Nj(a, b, c) {
    var d = b.updateQueue
    d = null !== d ? d.lastEffect : null
    if (null !== d) {
        var e = (d = d.next)
        do {
            if ((e.tag & a) === a) {
                var f = e.destroy
                e.destroy = void 0
                void 0 !== f && Kj(b, c, f)
            }
            e = e.next
        } while (e !== d)
    }
}
__name(Nj, 'Nj')
function Oj(a, b) {
    b = b.updateQueue
    b = null !== b ? b.lastEffect : null
    if (null !== b) {
        var c = (b = b.next)
        do {
            if ((c.tag & a) === a) {
                var d = c.create
                c.destroy = d()
            }
            c = c.next
        } while (c !== b)
    }
}
__name(Oj, 'Oj')
function Pj(a) {
    var b = a.ref
    if (null !== b) {
        var c = a.stateNode
        switch (a.tag) {
            case 5:
                a = c
                break
            default:
                a = c
        }
        'function' === typeof b ? b(a) : (b.current = a)
    }
}
__name(Pj, 'Pj')
function Qj(a) {
    var b = a.alternate
    null !== b && ((a.alternate = null), Qj(b))
    a.child = null
    a.deletions = null
    a.sibling = null
    5 === a.tag &&
        ((b = a.stateNode),
        null !== b &&
            (delete b[Nf],
            delete b[Of],
            delete b[nf],
            delete b[Pf],
            delete b[Qf]))
    a.stateNode = null
    a.return = null
    a.dependencies = null
    a.memoizedProps = null
    a.memoizedState = null
    a.pendingProps = null
    a.stateNode = null
    a.updateQueue = null
}
__name(Qj, 'Qj')
function Rj(a) {
    return 5 === a.tag || 3 === a.tag || 4 === a.tag
}
__name(Rj, 'Rj')
function Sj(a) {
    a: for (;;) {
        for (; null === a.sibling; ) {
            if (null === a.return || Rj(a.return)) return null
            a = a.return
        }
        a.sibling.return = a.return
        for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
            if (a.flags & 2) continue a
            if (null === a.child || 4 === a.tag) continue a
            else (a.child.return = a), (a = a.child)
        }
        if (!(a.flags & 2)) return a.stateNode
    }
}
__name(Sj, 'Sj')
function Tj(a, b, c) {
    var d = a.tag
    if (5 === d || 6 === d)
        (a = a.stateNode),
            b
                ? 8 === c.nodeType
                    ? c.parentNode.insertBefore(a, b)
                    : c.insertBefore(a, b)
                : (8 === c.nodeType
                      ? ((b = c.parentNode), b.insertBefore(a, c))
                      : ((b = c), b.appendChild(a)),
                  (c = c._reactRootContainer),
                  (null !== c && void 0 !== c) ||
                      null !== b.onclick ||
                      (b.onclick = Af))
    else if (4 !== d && ((a = a.child), null !== a))
        for (Tj(a, b, c), a = a.sibling; null !== a; )
            Tj(a, b, c), (a = a.sibling)
}
__name(Tj, 'Tj')
function Uj(a, b, c) {
    var d = a.tag
    if (5 === d || 6 === d)
        (a = a.stateNode), b ? c.insertBefore(a, b) : c.appendChild(a)
    else if (4 !== d && ((a = a.child), null !== a))
        for (Uj(a, b, c), a = a.sibling; null !== a; )
            Uj(a, b, c), (a = a.sibling)
}
__name(Uj, 'Uj')
var V = null,
    Vj = false
function Wj(a, b, c) {
    for (c = c.child; null !== c; ) Xj(a, b, c), (c = c.sibling)
}
__name(Wj, 'Wj')
function Xj(a, b, c) {
    if (kc && 'function' === typeof kc.onCommitFiberUnmount)
        try {
            kc.onCommitFiberUnmount(jc, c)
        } catch (h) {}
    switch (c.tag) {
        case 5:
            S || Jj(c, b)
        case 6:
            var d = V,
                e = Vj
            V = null
            Wj(a, b, c)
            V = d
            Vj = e
            null !== V &&
                (Vj
                    ? ((a = V),
                      (c = c.stateNode),
                      8 === a.nodeType
                          ? a.parentNode.removeChild(c)
                          : a.removeChild(c))
                    : V.removeChild(c.stateNode))
            break
        case 18:
            null !== V &&
                (Vj
                    ? ((a = V),
                      (c = c.stateNode),
                      8 === a.nodeType
                          ? Jf(a.parentNode, c)
                          : 1 === a.nodeType && Jf(a, c),
                      ad(a))
                    : Jf(V, c.stateNode))
            break
        case 4:
            d = V
            e = Vj
            V = c.stateNode.containerInfo
            Vj = true
            Wj(a, b, c)
            V = d
            Vj = e
            break
        case 0:
        case 11:
        case 14:
        case 15:
            if (
                !S &&
                ((d = c.updateQueue),
                null !== d && ((d = d.lastEffect), null !== d))
            ) {
                e = d = d.next
                do {
                    var f = e,
                        g = f.destroy
                    f = f.tag
                    void 0 !== g &&
                        (0 !== (f & 2)
                            ? Kj(c, b, g)
                            : 0 !== (f & 4) && Kj(c, b, g))
                    e = e.next
                } while (e !== d)
            }
            Wj(a, b, c)
            break
        case 1:
            if (
                !S &&
                (Jj(c, b),
                (d = c.stateNode),
                'function' === typeof d.componentWillUnmount)
            )
                try {
                    ;(d.props = c.memoizedProps),
                        (d.state = c.memoizedState),
                        d.componentWillUnmount()
                } catch (h) {
                    U(c, b, h)
                }
            Wj(a, b, c)
            break
        case 21:
            Wj(a, b, c)
            break
        case 22:
            c.mode & 1
                ? ((S = (d = S) || null !== c.memoizedState),
                  Wj(a, b, c),
                  (S = d))
                : Wj(a, b, c)
            break
        default:
            Wj(a, b, c)
    }
}
__name(Xj, 'Xj')
function Yj(a) {
    var b = a.updateQueue
    if (null !== b) {
        a.updateQueue = null
        var c = a.stateNode
        null === c && (c = a.stateNode = new Ij())
        b.forEach(function (b2) {
            var d = Zj.bind(null, a, b2)
            c.has(b2) || (c.add(b2), b2.then(d, d))
        })
    }
}
__name(Yj, 'Yj')
function ak(a, b) {
    var c = b.deletions
    if (null !== c)
        for (var d = 0; d < c.length; d++) {
            var e = c[d]
            try {
                var f = a,
                    g = b,
                    h = g
                a: for (; null !== h; ) {
                    switch (h.tag) {
                        case 5:
                            V = h.stateNode
                            Vj = false
                            break a
                        case 3:
                            V = h.stateNode.containerInfo
                            Vj = true
                            break a
                        case 4:
                            V = h.stateNode.containerInfo
                            Vj = true
                            break a
                    }
                    h = h.return
                }
                if (null === V) throw Error(p(160))
                Xj(f, g, e)
                V = null
                Vj = false
                var k = e.alternate
                null !== k && (k.return = null)
                e.return = null
            } catch (l) {
                U(e, b, l)
            }
        }
    if (b.subtreeFlags & 12854)
        for (b = b.child; null !== b; ) bk(b, a), (b = b.sibling)
}
__name(ak, 'ak')
function bk(a, b) {
    var c = a.alternate,
        d = a.flags
    switch (a.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
            ak(b, a)
            ck(a)
            if (d & 4) {
                try {
                    Nj(3, a, a.return), Oj(3, a)
                } catch (m) {
                    U(a, a.return, m)
                }
                try {
                    Nj(5, a, a.return)
                } catch (m) {
                    U(a, a.return, m)
                }
            }
            break
        case 1:
            ak(b, a)
            ck(a)
            d & 512 && null !== c && Jj(c, c.return)
            break
        case 5:
            ak(b, a)
            ck(a)
            d & 512 && null !== c && Jj(c, c.return)
            if (a.flags & 32) {
                var e = a.stateNode
                try {
                    nb(e, '')
                } catch (m) {
                    U(a, a.return, m)
                }
            }
            if (d & 4 && ((e = a.stateNode), null != e)) {
                var f = a.memoizedProps,
                    g = null !== c ? c.memoizedProps : f,
                    h = a.type,
                    k = a.updateQueue
                a.updateQueue = null
                if (null !== k)
                    try {
                        'input' === h &&
                            'radio' === f.type &&
                            null != f.name &&
                            Za(e, f)
                        ub(h, g)
                        var l = ub(h, f)
                        for (g = 0; g < k.length; g += 2) {
                            var n = k[g],
                                u = k[g + 1]
                            'style' === n
                                ? rb(e, u)
                                : 'dangerouslySetInnerHTML' === n
                                ? mb(e, u)
                                : 'children' === n
                                ? nb(e, u)
                                : sa(e, n, u, l)
                        }
                        switch (h) {
                            case 'input':
                                $a(e, f)
                                break
                            case 'textarea':
                                hb(e, f)
                                break
                            case 'select':
                                var q = e._wrapperState.wasMultiple
                                e._wrapperState.wasMultiple = !!f.multiple
                                var y = f.value
                                null != y
                                    ? eb(e, !!f.multiple, y, false)
                                    : q !== !!f.multiple &&
                                      (null != f.defaultValue
                                          ? eb(
                                                e,
                                                !!f.multiple,
                                                f.defaultValue,
                                                true
                                            )
                                          : eb(
                                                e,
                                                !!f.multiple,
                                                f.multiple ? [] : '',
                                                false
                                            ))
                        }
                        e[Of] = f
                    } catch (m) {
                        U(a, a.return, m)
                    }
            }
            break
        case 6:
            ak(b, a)
            ck(a)
            if (d & 4) {
                if (null === a.stateNode) throw Error(p(162))
                l = a.stateNode
                n = a.memoizedProps
                try {
                    l.nodeValue = n
                } catch (m) {
                    U(a, a.return, m)
                }
            }
            break
        case 3:
            ak(b, a)
            ck(a)
            if (d & 4 && null !== c && c.memoizedState.isDehydrated)
                try {
                    ad(b.containerInfo)
                } catch (m) {
                    U(a, a.return, m)
                }
            break
        case 4:
            ak(b, a)
            ck(a)
            break
        case 13:
            ak(b, a)
            ck(a)
            l = a.child
            l.flags & 8192 &&
                null !== l.memoizedState &&
                (null === l.alternate || null === l.alternate.memoizedState) &&
                (dk = B())
            d & 4 && Yj(a)
            break
        case 22:
            l = null !== c && null !== c.memoizedState
            a.mode & 1 ? ((S = (n = S) || l), ak(b, a), (S = n)) : ak(b, a)
            ck(a)
            if (d & 8192) {
                n = null !== a.memoizedState
                a: for (u = null, q = a; ; ) {
                    if (5 === q.tag) {
                        if (null === u) {
                            u = q
                            try {
                                ;(e = q.stateNode),
                                    n
                                        ? ((f = e.style),
                                          'function' === typeof f.setProperty
                                              ? f.setProperty(
                                                    'display',
                                                    'none',
                                                    'important'
                                                )
                                              : (f.display = 'none'))
                                        : ((h = q.stateNode),
                                          (k = q.memoizedProps.style),
                                          (g =
                                              void 0 !== k &&
                                              null !== k &&
                                              k.hasOwnProperty('display')
                                                  ? k.display
                                                  : null),
                                          (h.style.display = qb('display', g)))
                            } catch (m) {
                                U(a, a.return, m)
                            }
                        }
                    } else if (6 === q.tag) {
                        if (null === u)
                            try {
                                q.stateNode.nodeValue = n ? '' : q.memoizedProps
                            } catch (m) {
                                U(a, a.return, m)
                            }
                    } else if (
                        ((22 !== q.tag && 23 !== q.tag) ||
                            null === q.memoizedState ||
                            q === a) &&
                        null !== q.child
                    ) {
                        q.child.return = q
                        q = q.child
                        continue
                    }
                    if (q === a) break a
                    for (; null === q.sibling; ) {
                        if (null === q.return || q.return === a) break a
                        u === q && (u = null)
                        q = q.return
                    }
                    u === q && (u = null)
                    q.sibling.return = q.return
                    q = q.sibling
                }
                if (n && !l && 0 !== (a.mode & 1))
                    for (T = a, a = a.child; null !== a; ) {
                        for (l = T = a; null !== T; ) {
                            n = T
                            u = n.child
                            switch (n.tag) {
                                case 0:
                                case 11:
                                case 14:
                                case 15:
                                    Nj(4, n, n.return)
                                    break
                                case 1:
                                    Jj(n, n.return)
                                    f = n.stateNode
                                    if (
                                        'function' ===
                                        typeof f.componentWillUnmount
                                    ) {
                                        q = n
                                        y = n.return
                                        try {
                                            ;(e = q),
                                                (f.props = e.memoizedProps),
                                                (f.state = e.memoizedState),
                                                f.componentWillUnmount()
                                        } catch (m) {
                                            U(q, y, m)
                                        }
                                    }
                                    break
                                case 5:
                                    Jj(n, n.return)
                                    break
                                case 22:
                                    if (null !== n.memoizedState) {
                                        ek(l)
                                        continue
                                    }
                            }
                            null !== u ? ((u.return = n), (T = u)) : ek(l)
                        }
                        a = a.sibling
                    }
            }
            break
        case 19:
            ak(b, a)
            ck(a)
            d & 4 && Yj(a)
            break
        case 21:
            break
        default:
            ak(b, a), ck(a)
    }
}
__name(bk, 'bk')
function ck(a) {
    var b = a.flags
    if (b & 2) {
        try {
            a: {
                for (var c = a.return; null !== c; ) {
                    if (Rj(c)) {
                        var d = c
                        break a
                    }
                    c = c.return
                }
                throw Error(p(160))
            }
            switch (d.tag) {
                case 5:
                    var e = d.stateNode
                    d.flags & 32 && (nb(e, ''), (d.flags &= -33))
                    var f = Sj(a)
                    Uj(a, f, e)
                    break
                case 3:
                case 4:
                    var g = d.stateNode.containerInfo,
                        h = Sj(a)
                    Tj(a, h, g)
                    break
                default:
                    throw Error(p(161))
            }
        } catch (k) {
            U(a, a.return, k)
        }
        a.flags &= -3
    }
    b & 4096 && (a.flags &= -4097)
}
__name(ck, 'ck')
function fk(a, b, c) {
    T = a
    gk(a)
}
__name(fk, 'fk')
function gk(a, b, c) {
    for (var d = 0 !== (a.mode & 1); null !== T; ) {
        var e = T,
            f = e.child
        if (22 === e.tag && d) {
            var g = null !== e.memoizedState || Hj
            if (!g) {
                var h = e.alternate,
                    k = (null !== h && null !== h.memoizedState) || S
                h = Hj
                var l = S
                Hj = g
                if ((S = k) && !l)
                    for (T = e; null !== T; )
                        (g = T),
                            (k = g.child),
                            22 === g.tag && null !== g.memoizedState
                                ? hk(e)
                                : null !== k
                                ? ((k.return = g), (T = k))
                                : hk(e)
                for (; null !== f; ) (T = f), gk(f), (f = f.sibling)
                T = e
                Hj = h
                S = l
            }
            ik(a)
        } else
            0 !== (e.subtreeFlags & 8772) && null !== f
                ? ((f.return = e), (T = f))
                : ik(a)
    }
}
__name(gk, 'gk')
function ik(a) {
    for (; null !== T; ) {
        var b = T
        if (0 !== (b.flags & 8772)) {
            var c = b.alternate
            try {
                if (0 !== (b.flags & 8772))
                    switch (b.tag) {
                        case 0:
                        case 11:
                        case 15:
                            S || Oj(5, b)
                            break
                        case 1:
                            var d = b.stateNode
                            if (b.flags & 4 && !S)
                                if (null === c) d.componentDidMount()
                                else {
                                    var e =
                                        b.elementType === b.type
                                            ? c.memoizedProps
                                            : kg(b.type, c.memoizedProps)
                                    d.componentDidUpdate(
                                        e,
                                        c.memoizedState,
                                        d.__reactInternalSnapshotBeforeUpdate
                                    )
                                }
                            var f = b.updateQueue
                            null !== f && Gg(b, f, d)
                            break
                        case 3:
                            var g = b.updateQueue
                            if (null !== g) {
                                c = null
                                if (null !== b.child)
                                    switch (b.child.tag) {
                                        case 5:
                                            c = b.child.stateNode
                                            break
                                        case 1:
                                            c = b.child.stateNode
                                    }
                                Gg(b, g, c)
                            }
                            break
                        case 5:
                            var h = b.stateNode
                            if (null === c && b.flags & 4) {
                                c = h
                                var k = b.memoizedProps
                                switch (b.type) {
                                    case 'button':
                                    case 'input':
                                    case 'select':
                                    case 'textarea':
                                        k.autoFocus && c.focus()
                                        break
                                    case 'img':
                                        k.src && (c.src = k.src)
                                }
                            }
                            break
                        case 6:
                            break
                        case 4:
                            break
                        case 12:
                            break
                        case 13:
                            if (null === b.memoizedState) {
                                var l = b.alternate
                                if (null !== l) {
                                    var n = l.memoizedState
                                    if (null !== n) {
                                        var u = n.dehydrated
                                        null !== u && ad(u)
                                    }
                                }
                            }
                            break
                        case 19:
                        case 17:
                        case 21:
                        case 22:
                        case 23:
                            break
                        default:
                            throw Error(p(163))
                    }
                S || (b.flags & 512 && Pj(b))
            } catch (q) {
                U(b, b.return, q)
            }
        }
        if (b === a) {
            T = null
            break
        }
        c = b.sibling
        if (null !== c) {
            c.return = b.return
            T = c
            break
        }
        T = b.return
    }
}
__name(ik, 'ik')
function ek(a) {
    for (; null !== T; ) {
        var b = T
        if (b === a) {
            T = null
            break
        }
        var c = b.sibling
        if (null !== c) {
            c.return = b.return
            T = c
            break
        }
        T = b.return
    }
}
__name(ek, 'ek')
function hk(a) {
    for (; null !== T; ) {
        var b = T
        try {
            switch (b.tag) {
                case 0:
                case 11:
                case 15:
                    var c = b.return
                    try {
                        Oj(4, b)
                    } catch (k) {
                        U(b, c, k)
                    }
                    break
                case 1:
                    var d = b.stateNode
                    if ('function' === typeof d.componentDidMount) {
                        var e = b.return
                        try {
                            d.componentDidMount()
                        } catch (k) {
                            U(b, e, k)
                        }
                    }
                    var f = b.return
                    try {
                        Pj(b)
                    } catch (k) {
                        U(b, f, k)
                    }
                    break
                case 5:
                    var g = b.return
                    try {
                        Pj(b)
                    } catch (k) {
                        U(b, g, k)
                    }
            }
        } catch (k) {
            U(b, b.return, k)
        }
        if (b === a) {
            T = null
            break
        }
        var h = b.sibling
        if (null !== h) {
            h.return = b.return
            T = h
            break
        }
        T = b.return
    }
}
__name(hk, 'hk')
var jk = Math.ceil,
    kk = ta.ReactCurrentDispatcher,
    lk = ta.ReactCurrentOwner,
    mk = ta.ReactCurrentBatchConfig,
    W = 0,
    P = null,
    X = null,
    Y = 0,
    cj = 0,
    mj = Tf(0),
    R = 0,
    nk = null,
    Fg = 0,
    ok = 0,
    pk = 0,
    qk = null,
    rk = null,
    dk = 0,
    aj = Infinity,
    sk = null,
    Li = false,
    Mi = null,
    Oi = null,
    tk = false,
    uk = null,
    vk = 0,
    wk = 0,
    xk = null,
    yk = -1,
    zk = 0
function Jg() {
    return 0 !== (W & 6) ? B() : -1 !== yk ? yk : (yk = B())
}
__name(Jg, 'Jg')
function Kg(a) {
    if (0 === (a.mode & 1)) return 1
    if (0 !== (W & 2) && 0 !== Y) return Y & -Y
    if (null !== jg.transition) return 0 === zk && (zk = xc()), zk
    a = C
    if (0 !== a) return a
    a = window.event
    a = void 0 === a ? 16 : id(a.type)
    return a
}
__name(Kg, 'Kg')
function Lg(a, b, c) {
    if (50 < wk) throw ((wk = 0), (xk = null), Error(p(185)))
    var d = Ak(a, b)
    if (null === d) return null
    zc(d, b, c)
    if (0 === (W & 2) || d !== P)
        d === P && (0 === (W & 2) && (ok |= b), 4 === R && Bk(d, Y)),
            Ck(d, c),
            1 === b &&
                0 === W &&
                0 === (a.mode & 1) &&
                ((aj = B() + 500), eg && ig())
    return d
}
__name(Lg, 'Lg')
function Ak(a, b) {
    a.lanes |= b
    var c = a.alternate
    null !== c && (c.lanes |= b)
    c = a
    for (a = a.return; null !== a; )
        (a.childLanes |= b),
            (c = a.alternate),
            null !== c && (c.childLanes |= b),
            (c = a),
            (a = a.return)
    return 3 === c.tag ? c.stateNode : null
}
__name(Ak, 'Ak')
function Bg(a) {
    return (null !== P || null !== vg) && 0 !== (a.mode & 1) && 0 === (W & 2)
}
__name(Bg, 'Bg')
function Ck(a, b) {
    var c = a.callbackNode
    vc(a, b)
    var d = tc(a, a === P ? Y : 0)
    if (0 === d)
        null !== c && ac(c), (a.callbackNode = null), (a.callbackPriority = 0)
    else if (((b = d & -d), a.callbackPriority !== b)) {
        null != c && ac(c)
        if (1 === b)
            0 === a.tag ? hg(Dk.bind(null, a)) : gg(Dk.bind(null, a)),
                If(function () {
                    0 === W && ig()
                }),
                (c = null)
        else {
            switch (Cc(d)) {
                case 1:
                    c = ec
                    break
                case 4:
                    c = fc
                    break
                case 16:
                    c = gc
                    break
                case 536870912:
                    c = ic
                    break
                default:
                    c = gc
            }
            c = Ek(c, Fk.bind(null, a))
        }
        a.callbackPriority = b
        a.callbackNode = c
    }
}
__name(Ck, 'Ck')
function Fk(a, b) {
    yk = -1
    zk = 0
    if (0 !== (W & 6)) throw Error(p(327))
    var c = a.callbackNode
    if (Gk() && a.callbackNode !== c) return null
    var d = tc(a, a === P ? Y : 0)
    if (0 === d) return null
    if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Hk(a, d)
    else {
        b = d
        var e = W
        W |= 2
        var f = Ik()
        if (P !== a || Y !== b) (sk = null), (aj = B() + 500), Jk(a, b)
        do
            try {
                Kk()
                break
            } catch (h) {
                Lk(a, h)
            }
        while (1)
        pg()
        kk.current = f
        W = e
        null !== X ? (b = 0) : ((P = null), (Y = 0), (b = R))
    }
    if (0 !== b) {
        2 === b && ((e = wc(a)), 0 !== e && ((d = e), (b = Mk(a, e))))
        if (1 === b) throw ((c = nk), Jk(a, 0), Bk(a, d), Ck(a, B()), c)
        if (6 === b) Bk(a, d)
        else {
            e = a.current.alternate
            if (
                0 === (d & 30) &&
                !Nk(e) &&
                ((b = Hk(a, d)),
                2 === b && ((f = wc(a)), 0 !== f && ((d = f), (b = Mk(a, f)))),
                1 === b)
            )
                throw ((c = nk), Jk(a, 0), Bk(a, d), Ck(a, B()), c)
            a.finishedWork = e
            a.finishedLanes = d
            switch (b) {
                case 0:
                case 1:
                    throw Error(p(345))
                case 2:
                    Ok(a, rk, sk)
                    break
                case 3:
                    Bk(a, d)
                    if (
                        (d & 130023424) === d &&
                        ((b = dk + 500 - B()), 10 < b)
                    ) {
                        if (0 !== tc(a, 0)) break
                        e = a.suspendedLanes
                        if ((e & d) !== d) {
                            Jg()
                            a.pingedLanes |= a.suspendedLanes & e
                            break
                        }
                        a.timeoutHandle = Ef(Ok.bind(null, a, rk, sk), b)
                        break
                    }
                    Ok(a, rk, sk)
                    break
                case 4:
                    Bk(a, d)
                    if ((d & 4194240) === d) break
                    b = a.eventTimes
                    for (e = -1; 0 < d; ) {
                        var g = 31 - nc(d)
                        f = 1 << g
                        g = b[g]
                        g > e && (e = g)
                        d &= ~f
                    }
                    d = e
                    d = B() - d
                    d =
                        (120 > d
                            ? 120
                            : 480 > d
                            ? 480
                            : 1080 > d
                            ? 1080
                            : 1920 > d
                            ? 1920
                            : 3e3 > d
                            ? 3e3
                            : 4320 > d
                            ? 4320
                            : 1960 * jk(d / 1960)) - d
                    if (10 < d) {
                        a.timeoutHandle = Ef(Ok.bind(null, a, rk, sk), d)
                        break
                    }
                    Ok(a, rk, sk)
                    break
                case 5:
                    Ok(a, rk, sk)
                    break
                default:
                    throw Error(p(329))
            }
        }
    }
    Ck(a, B())
    return a.callbackNode === c ? Fk.bind(null, a) : null
}
__name(Fk, 'Fk')
function Mk(a, b) {
    var c = qk
    a.current.memoizedState.isDehydrated && (Jk(a, b).flags |= 256)
    a = Hk(a, b)
    2 !== a && ((b = rk), (rk = c), null !== b && Zi(b))
    return a
}
__name(Mk, 'Mk')
function Zi(a) {
    null === rk ? (rk = a) : rk.push.apply(rk, a)
}
__name(Zi, 'Zi')
function Nk(a) {
    for (var b = a; ; ) {
        if (b.flags & 16384) {
            var c = b.updateQueue
            if (null !== c && ((c = c.stores), null !== c))
                for (var d = 0; d < c.length; d++) {
                    var e = c[d],
                        f = e.getSnapshot
                    e = e.value
                    try {
                        if (!Ge(f(), e)) return false
                    } catch (g) {
                        return false
                    }
                }
        }
        c = b.child
        if (b.subtreeFlags & 16384 && null !== c) (c.return = b), (b = c)
        else {
            if (b === a) break
            for (; null === b.sibling; ) {
                if (null === b.return || b.return === a) return true
                b = b.return
            }
            b.sibling.return = b.return
            b = b.sibling
        }
    }
    return true
}
__name(Nk, 'Nk')
function Bk(a, b) {
    b &= ~pk
    b &= ~ok
    a.suspendedLanes |= b
    a.pingedLanes &= ~b
    for (a = a.expirationTimes; 0 < b; ) {
        var c = 31 - nc(b),
            d = 1 << c
        a[c] = -1
        b &= ~d
    }
}
__name(Bk, 'Bk')
function Dk(a) {
    if (0 !== (W & 6)) throw Error(p(327))
    Gk()
    var b = tc(a, 0)
    if (0 === (b & 1)) return Ck(a, B()), null
    var c = Hk(a, b)
    if (0 !== a.tag && 2 === c) {
        var d = wc(a)
        0 !== d && ((b = d), (c = Mk(a, d)))
    }
    if (1 === c) throw ((c = nk), Jk(a, 0), Bk(a, b), Ck(a, B()), c)
    if (6 === c) throw Error(p(345))
    a.finishedWork = a.current.alternate
    a.finishedLanes = b
    Ok(a, rk, sk)
    Ck(a, B())
    return null
}
__name(Dk, 'Dk')
function Pk(a, b) {
    var c = W
    W |= 1
    try {
        return a(b)
    } finally {
        ;(W = c), 0 === W && ((aj = B() + 500), eg && ig())
    }
}
__name(Pk, 'Pk')
function Qk(a) {
    null !== uk && 0 === uk.tag && 0 === (W & 6) && Gk()
    var b = W
    W |= 1
    var c = mk.transition,
        d = C
    try {
        if (((mk.transition = null), (C = 1), a)) return a()
    } finally {
        ;(C = d), (mk.transition = c), (W = b), 0 === (W & 6) && ig()
    }
}
__name(Qk, 'Qk')
function bj() {
    cj = mj.current
    E(mj)
}
__name(bj, 'bj')
function Jk(a, b) {
    a.finishedWork = null
    a.finishedLanes = 0
    var c = a.timeoutHandle
    ;-1 !== c && ((a.timeoutHandle = -1), Ff(c))
    if (null !== X)
        for (c = X.return; null !== c; ) {
            var d = c
            ch(d)
            switch (d.tag) {
                case 1:
                    d = d.type.childContextTypes
                    null !== d && void 0 !== d && Zf()
                    break
                case 3:
                    Gh()
                    E(Vf)
                    E(H)
                    Lh()
                    break
                case 5:
                    Ih(d)
                    break
                case 4:
                    Gh()
                    break
                case 13:
                    E(K)
                    break
                case 19:
                    E(K)
                    break
                case 10:
                    qg(d.type._context)
                    break
                case 22:
                case 23:
                    bj()
            }
            c = c.return
        }
    P = a
    X = a = th(a.current, null)
    Y = cj = b
    R = 0
    nk = null
    pk = ok = Fg = 0
    rk = qk = null
    if (null !== vg) {
        for (b = 0; b < vg.length; b++)
            if (((c = vg[b]), (d = c.interleaved), null !== d)) {
                c.interleaved = null
                var e = d.next,
                    f = c.pending
                if (null !== f) {
                    var g = f.next
                    f.next = e
                    d.next = g
                }
                c.pending = d
            }
        vg = null
    }
    return a
}
__name(Jk, 'Jk')
function Lk(a, b) {
    do {
        var c = X
        try {
            pg()
            Mh.current = Yh
            if (Ph) {
                for (var d = L.memoizedState; null !== d; ) {
                    var e = d.queue
                    null !== e && (e.pending = null)
                    d = d.next
                }
                Ph = false
            }
            Oh = 0
            N = M = L = null
            Qh = false
            Rh = 0
            lk.current = null
            if (null === c || null === c.return) {
                R = 1
                nk = b
                X = null
                break
            }
            a: {
                var f = a,
                    g = c.return,
                    h = c,
                    k = b
                b = Y
                h.flags |= 32768
                if (
                    null !== k &&
                    'object' === typeof k &&
                    'function' === typeof k.then
                ) {
                    var l = k,
                        n = h,
                        u = n.tag
                    if (
                        0 === (n.mode & 1) &&
                        (0 === u || 11 === u || 15 === u)
                    ) {
                        var q = n.alternate
                        q
                            ? ((n.updateQueue = q.updateQueue),
                              (n.memoizedState = q.memoizedState),
                              (n.lanes = q.lanes))
                            : ((n.updateQueue = null), (n.memoizedState = null))
                    }
                    var y = Ri(g)
                    if (null !== y) {
                        y.flags &= -257
                        Si(y, g, h, f, b)
                        y.mode & 1 && Pi(f, l, b)
                        b = y
                        k = l
                        var m = b.updateQueue
                        if (null === m) {
                            var w = /* @__PURE__ */ new Set()
                            w.add(k)
                            b.updateQueue = w
                        } else m.add(k)
                        break a
                    } else {
                        if (0 === (b & 1)) {
                            Pi(f, l, b)
                            $i()
                            break a
                        }
                        k = Error(p(426))
                    }
                } else if (I && h.mode & 1) {
                    var J = Ri(g)
                    if (null !== J) {
                        0 === (J.flags & 65536) && (J.flags |= 256)
                        Si(J, g, h, f, b)
                        oh(k)
                        break a
                    }
                }
                f = k
                4 !== R && (R = 2)
                null === qk ? (qk = [f]) : qk.push(f)
                k = Hi(k, h)
                h = g
                do {
                    switch (h.tag) {
                        case 3:
                            h.flags |= 65536
                            b &= -b
                            h.lanes |= b
                            var v = Ki(h, k, b)
                            Dg(h, v)
                            break a
                        case 1:
                            f = k
                            var x = h.type,
                                r = h.stateNode
                            if (
                                0 === (h.flags & 128) &&
                                ('function' ===
                                    typeof x.getDerivedStateFromError ||
                                    (null !== r &&
                                        'function' ===
                                            typeof r.componentDidCatch &&
                                        (null === Oi || !Oi.has(r))))
                            ) {
                                h.flags |= 65536
                                b &= -b
                                h.lanes |= b
                                var F = Ni(h, f, b)
                                Dg(h, F)
                                break a
                            }
                    }
                    h = h.return
                } while (null !== h)
            }
            Rk(c)
        } catch (Z) {
            b = Z
            X === c && null !== c && (X = c = c.return)
            continue
        }
        break
    } while (1)
}
__name(Lk, 'Lk')
function Ik() {
    var a = kk.current
    kk.current = Yh
    return null === a ? Yh : a
}
__name(Ik, 'Ik')
function $i() {
    if (0 === R || 3 === R || 2 === R) R = 4
    null === P || (0 === (Fg & 268435455) && 0 === (ok & 268435455)) || Bk(P, Y)
}
__name($i, '$i')
function Hk(a, b) {
    var c = W
    W |= 2
    var d = Ik()
    if (P !== a || Y !== b) (sk = null), Jk(a, b)
    do
        try {
            Sk()
            break
        } catch (e) {
            Lk(a, e)
        }
    while (1)
    pg()
    W = c
    kk.current = d
    if (null !== X) throw Error(p(261))
    P = null
    Y = 0
    return R
}
__name(Hk, 'Hk')
function Sk() {
    for (; null !== X; ) Tk(X)
}
__name(Sk, 'Sk')
function Kk() {
    for (; null !== X && !bc(); ) Tk(X)
}
__name(Kk, 'Kk')
function Tk(a) {
    var b = Uk(a.alternate, a, cj)
    a.memoizedProps = a.pendingProps
    null === b ? Rk(a) : (X = b)
    lk.current = null
}
__name(Tk, 'Tk')
function Rk(a) {
    var b = a
    do {
        var c = b.alternate
        a = b.return
        if (0 === (b.flags & 32768)) {
            if (((c = Yi(c, b, cj)), null !== c)) {
                X = c
                return
            }
        } else {
            c = Gj(c, b)
            if (null !== c) {
                c.flags &= 32767
                X = c
                return
            }
            if (null !== a)
                (a.flags |= 32768), (a.subtreeFlags = 0), (a.deletions = null)
            else {
                R = 6
                X = null
                return
            }
        }
        b = b.sibling
        if (null !== b) {
            X = b
            return
        }
        X = b = a
    } while (null !== b)
    0 === R && (R = 5)
}
__name(Rk, 'Rk')
function Ok(a, b, c) {
    var d = C,
        e = mk.transition
    try {
        ;(mk.transition = null), (C = 1), Vk(a, b, c, d)
    } finally {
        ;(mk.transition = e), (C = d)
    }
    return null
}
__name(Ok, 'Ok')
function Vk(a, b, c, d) {
    do Gk()
    while (null !== uk)
    if (0 !== (W & 6)) throw Error(p(327))
    c = a.finishedWork
    var e = a.finishedLanes
    if (null === c) return null
    a.finishedWork = null
    a.finishedLanes = 0
    if (c === a.current) throw Error(p(177))
    a.callbackNode = null
    a.callbackPriority = 0
    var f = c.lanes | c.childLanes
    Ac(a, f)
    a === P && ((X = P = null), (Y = 0))
    ;(0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064)) ||
        tk ||
        ((tk = true),
        Ek(gc, function () {
            Gk()
            return null
        }))
    f = 0 !== (c.flags & 15990)
    if (0 !== (c.subtreeFlags & 15990) || f) {
        f = mk.transition
        mk.transition = null
        var g = C
        C = 1
        var h = W
        W |= 4
        lk.current = null
        Mj(a, c)
        bk(c, a)
        Ne(Cf)
        cd = !!Bf
        Cf = Bf = null
        a.current = c
        fk(c)
        cc()
        W = h
        C = g
        mk.transition = f
    } else a.current = c
    tk && ((tk = false), (uk = a), (vk = e))
    f = a.pendingLanes
    0 === f && (Oi = null)
    lc(c.stateNode)
    Ck(a, B())
    if (null !== b)
        for (d = a.onRecoverableError, c = 0; c < b.length; c++) d(b[c])
    if (Li) throw ((Li = false), (a = Mi), (Mi = null), a)
    0 !== (vk & 1) && 0 !== a.tag && Gk()
    f = a.pendingLanes
    0 !== (f & 1) ? (a === xk ? wk++ : ((wk = 0), (xk = a))) : (wk = 0)
    ig()
    return null
}
__name(Vk, 'Vk')
function Gk() {
    if (null !== uk) {
        var a = Cc(vk),
            b = mk.transition,
            c = C
        try {
            mk.transition = null
            C = 16 > a ? 16 : a
            if (null === uk) var d = false
            else {
                a = uk
                uk = null
                vk = 0
                if (0 !== (W & 6)) throw Error(p(331))
                var e = W
                W |= 4
                for (T = a.current; null !== T; ) {
                    var f = T,
                        g = f.child
                    if (0 !== (T.flags & 16)) {
                        var h = f.deletions
                        if (null !== h) {
                            for (var k = 0; k < h.length; k++) {
                                var l = h[k]
                                for (T = l; null !== T; ) {
                                    var n = T
                                    switch (n.tag) {
                                        case 0:
                                        case 11:
                                        case 15:
                                            Nj(8, n, f)
                                    }
                                    var u = n.child
                                    if (null !== u) (u.return = n), (T = u)
                                    else
                                        for (; null !== T; ) {
                                            n = T
                                            var q = n.sibling,
                                                y = n.return
                                            Qj(n)
                                            if (n === l) {
                                                T = null
                                                break
                                            }
                                            if (null !== q) {
                                                q.return = y
                                                T = q
                                                break
                                            }
                                            T = y
                                        }
                                }
                            }
                            var m = f.alternate
                            if (null !== m) {
                                var w = m.child
                                if (null !== w) {
                                    m.child = null
                                    do {
                                        var J = w.sibling
                                        w.sibling = null
                                        w = J
                                    } while (null !== w)
                                }
                            }
                            T = f
                        }
                    }
                    if (0 !== (f.subtreeFlags & 2064) && null !== g)
                        (g.return = f), (T = g)
                    else
                        b: for (; null !== T; ) {
                            f = T
                            if (0 !== (f.flags & 2048))
                                switch (f.tag) {
                                    case 0:
                                    case 11:
                                    case 15:
                                        Nj(9, f, f.return)
                                }
                            var v = f.sibling
                            if (null !== v) {
                                v.return = f.return
                                T = v
                                break b
                            }
                            T = f.return
                        }
                }
                var x = a.current
                for (T = x; null !== T; ) {
                    g = T
                    var r = g.child
                    if (0 !== (g.subtreeFlags & 2064) && null !== r)
                        (r.return = g), (T = r)
                    else
                        b: for (g = x; null !== T; ) {
                            h = T
                            if (0 !== (h.flags & 2048))
                                try {
                                    switch (h.tag) {
                                        case 0:
                                        case 11:
                                        case 15:
                                            Oj(9, h)
                                    }
                                } catch (Z) {
                                    U(h, h.return, Z)
                                }
                            if (h === g) {
                                T = null
                                break b
                            }
                            var F = h.sibling
                            if (null !== F) {
                                F.return = h.return
                                T = F
                                break b
                            }
                            T = h.return
                        }
                }
                W = e
                ig()
                if (kc && 'function' === typeof kc.onPostCommitFiberRoot)
                    try {
                        kc.onPostCommitFiberRoot(jc, a)
                    } catch (Z) {}
                d = true
            }
            return d
        } finally {
            ;(C = c), (mk.transition = b)
        }
    }
    return false
}
__name(Gk, 'Gk')
function Wk(a, b, c) {
    b = Hi(c, b)
    b = Ki(a, b, 1)
    Ag(a, b)
    b = Jg()
    a = Ak(a, 1)
    null !== a && (zc(a, 1, b), Ck(a, b))
}
__name(Wk, 'Wk')
function U(a, b, c) {
    if (3 === a.tag) Wk(a, a, c)
    else
        for (; null !== b; ) {
            if (3 === b.tag) {
                Wk(b, a, c)
                break
            } else if (1 === b.tag) {
                var d = b.stateNode
                if (
                    'function' === typeof b.type.getDerivedStateFromError ||
                    ('function' === typeof d.componentDidCatch &&
                        (null === Oi || !Oi.has(d)))
                ) {
                    a = Hi(c, a)
                    a = Ni(b, a, 1)
                    Ag(b, a)
                    a = Jg()
                    b = Ak(b, 1)
                    null !== b && (zc(b, 1, a), Ck(b, a))
                    break
                }
            }
            b = b.return
        }
}
__name(U, 'U')
function Qi(a, b, c) {
    var d = a.pingCache
    null !== d && d.delete(b)
    b = Jg()
    a.pingedLanes |= a.suspendedLanes & c
    P === a &&
        (Y & c) === c &&
        (4 === R || (3 === R && (Y & 130023424) === Y && 500 > B() - dk)
            ? Jk(a, 0)
            : (pk |= c))
    Ck(a, b)
}
__name(Qi, 'Qi')
function Xk(a, b) {
    0 === b &&
        (0 === (a.mode & 1)
            ? (b = 1)
            : ((b = rc), (rc <<= 1), 0 === (rc & 130023424) && (rc = 4194304)))
    var c = Jg()
    a = Ak(a, b)
    null !== a && (zc(a, b, c), Ck(a, c))
}
__name(Xk, 'Xk')
function zj(a) {
    var b = a.memoizedState,
        c = 0
    null !== b && (c = b.retryLane)
    Xk(a, c)
}
__name(zj, 'zj')
function Zj(a, b) {
    var c = 0
    switch (a.tag) {
        case 13:
            var d = a.stateNode
            var e = a.memoizedState
            null !== e && (c = e.retryLane)
            break
        case 19:
            d = a.stateNode
            break
        default:
            throw Error(p(314))
    }
    null !== d && d.delete(b)
    Xk(a, c)
}
__name(Zj, 'Zj')
var Uk
Uk = /* @__PURE__ */ __name(function (a, b, c) {
    if (null !== a)
        if (a.memoizedProps !== b.pendingProps || Vf.current) tg = true
        else {
            if (0 === (a.lanes & c) && 0 === (b.flags & 128))
                return (tg = false), Fj(a, b, c)
            tg = 0 !== (a.flags & 131072) ? true : false
        }
    else (tg = false), I && 0 !== (b.flags & 1048576) && ah(b, Ug, b.index)
    b.lanes = 0
    switch (b.tag) {
        case 2:
            var d = b.type
            null !== a &&
                ((a.alternate = null), (b.alternate = null), (b.flags |= 2))
            a = b.pendingProps
            var e = Xf(b, H.current)
            sg(b, c)
            e = Uh(null, b, d, a, e, c)
            var f = Zh()
            b.flags |= 1
            'object' === typeof e &&
            null !== e &&
            'function' === typeof e.render &&
            void 0 === e.$$typeof
                ? ((b.tag = 1),
                  (b.memoizedState = null),
                  (b.updateQueue = null),
                  Yf(d) ? ((f = true), bg(b)) : (f = false),
                  (b.memoizedState =
                      null !== e.state && void 0 !== e.state ? e.state : null),
                  xg(b),
                  (e.updater = Mg),
                  (b.stateNode = e),
                  (e._reactInternals = b),
                  Qg(b, d, a, c),
                  (b = pj(null, b, d, true, f, c)))
                : ((b.tag = 0),
                  I && f && bh(b),
                  ej(null, b, e, c),
                  (b = b.child))
            return b
        case 16:
            d = b.elementType
            a: {
                null !== a &&
                    ((a.alternate = null), (b.alternate = null), (b.flags |= 2))
                a = b.pendingProps
                e = d._init
                d = e(d._payload)
                b.type = d
                e = b.tag = Yk(d)
                a = kg(d, a)
                switch (e) {
                    case 0:
                        b = kj(null, b, d, a, c)
                        break a
                    case 1:
                        b = oj(null, b, d, a, c)
                        break a
                    case 11:
                        b = fj(null, b, d, a, c)
                        break a
                    case 14:
                        b = hj(null, b, d, kg(d.type, a), c)
                        break a
                }
                throw Error(p(306, d, ''))
            }
            return b
        case 0:
            return (
                (d = b.type),
                (e = b.pendingProps),
                (e = b.elementType === d ? e : kg(d, e)),
                kj(a, b, d, e, c)
            )
        case 1:
            return (
                (d = b.type),
                (e = b.pendingProps),
                (e = b.elementType === d ? e : kg(d, e)),
                oj(a, b, d, e, c)
            )
        case 3:
            a: {
                qj(b)
                if (null === a) throw Error(p(387))
                d = b.pendingProps
                f = b.memoizedState
                e = f.element
                yg(a, b)
                Eg(b, d, null, c)
                var g = b.memoizedState
                d = g.element
                if (f.isDehydrated)
                    if (
                        ((f = {
                            element: d,
                            isDehydrated: false,
                            cache: g.cache,
                            pendingSuspenseBoundaries:
                                g.pendingSuspenseBoundaries,
                            transitions: g.transitions
                        }),
                        (b.updateQueue.baseState = f),
                        (b.memoizedState = f),
                        b.flags & 256)
                    ) {
                        e = Error(p(423))
                        b = rj(a, b, d, c, e)
                        break a
                    } else if (d !== e) {
                        e = Error(p(424))
                        b = rj(a, b, d, c, e)
                        break a
                    } else
                        for (
                            eh = Kf(b.stateNode.containerInfo.firstChild),
                                dh = b,
                                I = true,
                                fh = null,
                                c = zh(b, null, d, c),
                                b.child = c;
                            c;

                        )
                            (c.flags = (c.flags & -3) | 4096), (c = c.sibling)
                else {
                    nh()
                    if (d === e) {
                        b = gj(a, b, c)
                        break a
                    }
                    ej(a, b, d, c)
                }
                b = b.child
            }
            return b
        case 5:
            return (
                Hh(b),
                null === a && kh(b),
                (d = b.type),
                (e = b.pendingProps),
                (f = null !== a ? a.memoizedProps : null),
                (g = e.children),
                Df(d, e)
                    ? (g = null)
                    : null !== f && Df(d, f) && (b.flags |= 32),
                nj(a, b),
                ej(a, b, g, c),
                b.child
            )
        case 6:
            return null === a && kh(b), null
        case 13:
            return vj(a, b, c)
        case 4:
            return (
                Fh(b, b.stateNode.containerInfo),
                (d = b.pendingProps),
                null === a ? (b.child = yh(b, null, d, c)) : ej(a, b, d, c),
                b.child
            )
        case 11:
            return (
                (d = b.type),
                (e = b.pendingProps),
                (e = b.elementType === d ? e : kg(d, e)),
                fj(a, b, d, e, c)
            )
        case 7:
            return ej(a, b, b.pendingProps, c), b.child
        case 8:
            return ej(a, b, b.pendingProps.children, c), b.child
        case 12:
            return ej(a, b, b.pendingProps.children, c), b.child
        case 10:
            a: {
                d = b.type._context
                e = b.pendingProps
                f = b.memoizedProps
                g = e.value
                G(lg, d._currentValue)
                d._currentValue = g
                if (null !== f)
                    if (Ge(f.value, g)) {
                        if (f.children === e.children && !Vf.current) {
                            b = gj(a, b, c)
                            break a
                        }
                    } else
                        for (
                            f = b.child, null !== f && (f.return = b);
                            null !== f;

                        ) {
                            var h = f.dependencies
                            if (null !== h) {
                                g = f.child
                                for (var k = h.firstContext; null !== k; ) {
                                    if (k.context === d) {
                                        if (1 === f.tag) {
                                            k = zg(-1, c & -c)
                                            k.tag = 2
                                            var l = f.updateQueue
                                            if (null !== l) {
                                                l = l.shared
                                                var n = l.pending
                                                null === n
                                                    ? (k.next = k)
                                                    : ((k.next = n.next),
                                                      (n.next = k))
                                                l.pending = k
                                            }
                                        }
                                        f.lanes |= c
                                        k = f.alternate
                                        null !== k && (k.lanes |= c)
                                        rg(f.return, c, b)
                                        h.lanes |= c
                                        break
                                    }
                                    k = k.next
                                }
                            } else if (10 === f.tag)
                                g = f.type === b.type ? null : f.child
                            else if (18 === f.tag) {
                                g = f.return
                                if (null === g) throw Error(p(341))
                                g.lanes |= c
                                h = g.alternate
                                null !== h && (h.lanes |= c)
                                rg(g, c, b)
                                g = f.sibling
                            } else g = f.child
                            if (null !== g) g.return = f
                            else
                                for (g = f; null !== g; ) {
                                    if (g === b) {
                                        g = null
                                        break
                                    }
                                    f = g.sibling
                                    if (null !== f) {
                                        f.return = g.return
                                        g = f
                                        break
                                    }
                                    g = g.return
                                }
                            f = g
                        }
                ej(a, b, e.children, c)
                b = b.child
            }
            return b
        case 9:
            return (
                (e = b.type),
                (d = b.pendingProps.children),
                sg(b, c),
                (e = ug(e)),
                (d = d(e)),
                (b.flags |= 1),
                ej(a, b, d, c),
                b.child
            )
        case 14:
            return (
                (d = b.type),
                (e = kg(d, b.pendingProps)),
                (e = kg(d.type, e)),
                hj(a, b, d, e, c)
            )
        case 15:
            return jj(a, b, b.type, b.pendingProps, c)
        case 17:
            return (
                (d = b.type),
                (e = b.pendingProps),
                (e = b.elementType === d ? e : kg(d, e)),
                null !== a &&
                    ((a.alternate = null),
                    (b.alternate = null),
                    (b.flags |= 2)),
                (b.tag = 1),
                Yf(d) ? ((a = true), bg(b)) : (a = false),
                sg(b, c),
                Og(b, d, e),
                Qg(b, d, e, c),
                pj(null, b, d, true, a, c)
            )
        case 19:
            return Ej(a, b, c)
        case 22:
            return lj(a, b, c)
    }
    throw Error(p(156, b.tag))
}, 'Uk')
function Ek(a, b) {
    return $b(a, b)
}
__name(Ek, 'Ek')
function Zk(a, b, c, d) {
    this.tag = a
    this.key = c
    this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
            null
    this.index = 0
    this.ref = null
    this.pendingProps = b
    this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
            null
    this.mode = d
    this.subtreeFlags = this.flags = 0
    this.deletions = null
    this.childLanes = this.lanes = 0
    this.alternate = null
}
__name(Zk, 'Zk')
function hh(a, b, c, d) {
    return new Zk(a, b, c, d)
}
__name(hh, 'hh')
function ij(a) {
    a = a.prototype
    return !(!a || !a.isReactComponent)
}
__name(ij, 'ij')
function Yk(a) {
    if ('function' === typeof a) return ij(a) ? 1 : 0
    if (void 0 !== a && null !== a) {
        a = a.$$typeof
        if (a === Ca) return 11
        if (a === Fa) return 14
    }
    return 2
}
__name(Yk, 'Yk')
function th(a, b) {
    var c = a.alternate
    null === c
        ? ((c = hh(a.tag, b, a.key, a.mode)),
          (c.elementType = a.elementType),
          (c.type = a.type),
          (c.stateNode = a.stateNode),
          (c.alternate = a),
          (a.alternate = c))
        : ((c.pendingProps = b),
          (c.type = a.type),
          (c.flags = 0),
          (c.subtreeFlags = 0),
          (c.deletions = null))
    c.flags = a.flags & 14680064
    c.childLanes = a.childLanes
    c.lanes = a.lanes
    c.child = a.child
    c.memoizedProps = a.memoizedProps
    c.memoizedState = a.memoizedState
    c.updateQueue = a.updateQueue
    b = a.dependencies
    c.dependencies =
        null === b ? null : { lanes: b.lanes, firstContext: b.firstContext }
    c.sibling = a.sibling
    c.index = a.index
    c.ref = a.ref
    return c
}
__name(th, 'th')
function vh(a, b, c, d, e, f) {
    var g = 2
    d = a
    if ('function' === typeof a) ij(a) && (g = 1)
    else if ('string' === typeof a) g = 5
    else
        a: switch (a) {
            case wa:
                return xh(c.children, e, f, b)
            case xa:
                g = 8
                e |= 8
                break
            case za:
                return (
                    (a = hh(12, c, b, e | 2)),
                    (a.elementType = za),
                    (a.lanes = f),
                    a
                )
            case Da:
                return (
                    (a = hh(13, c, b, e)),
                    (a.elementType = Da),
                    (a.lanes = f),
                    a
                )
            case Ea:
                return (
                    (a = hh(19, c, b, e)),
                    (a.elementType = Ea),
                    (a.lanes = f),
                    a
                )
            case Ha:
                return wj(c, e, f, b)
            default:
                if ('object' === typeof a && null !== a)
                    switch (a.$$typeof) {
                        case Aa:
                            g = 10
                            break a
                        case Ba:
                            g = 9
                            break a
                        case Ca:
                            g = 11
                            break a
                        case Fa:
                            g = 14
                            break a
                        case Ga:
                            g = 16
                            d = null
                            break a
                    }
                throw Error(p(130, null == a ? a : typeof a, ''))
        }
    b = hh(g, c, b, e)
    b.elementType = a
    b.type = d
    b.lanes = f
    return b
}
__name(vh, 'vh')
function xh(a, b, c, d) {
    a = hh(7, a, d, b)
    a.lanes = c
    return a
}
__name(xh, 'xh')
function wj(a, b, c, d) {
    a = hh(22, a, d, b)
    a.elementType = Ha
    a.lanes = c
    a.stateNode = {}
    return a
}
__name(wj, 'wj')
function uh(a, b, c) {
    a = hh(6, a, null, b)
    a.lanes = c
    return a
}
__name(uh, 'uh')
function wh(a, b, c) {
    b = hh(4, null !== a.children ? a.children : [], a.key, b)
    b.lanes = c
    b.stateNode = {
        containerInfo: a.containerInfo,
        pendingChildren: null,
        implementation: a.implementation
    }
    return b
}
__name(wh, 'wh')
function $k(a, b, c, d, e) {
    this.tag = b
    this.containerInfo = a
    this.finishedWork =
        this.pingCache =
        this.current =
        this.pendingChildren =
            null
    this.timeoutHandle = -1
    this.callbackNode = this.pendingContext = this.context = null
    this.callbackPriority = 0
    this.eventTimes = yc(0)
    this.expirationTimes = yc(-1)
    this.entangledLanes =
        this.finishedLanes =
        this.mutableReadLanes =
        this.expiredLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
            0
    this.entanglements = yc(0)
    this.identifierPrefix = d
    this.onRecoverableError = e
    this.mutableSourceEagerHydrationData = null
}
__name($k, '$k')
function al(a, b, c, d, e, f, g, h, k) {
    a = new $k(a, b, c, h, k)
    1 === b ? ((b = 1), true === f && (b |= 8)) : (b = 0)
    f = hh(3, null, null, b)
    a.current = f
    f.stateNode = a
    f.memoizedState = {
        element: d,
        isDehydrated: c,
        cache: null,
        transitions: null,
        pendingSuspenseBoundaries: null
    }
    xg(f)
    return a
}
__name(al, 'al')
function bl(a, b, c) {
    var d =
        3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null
    return {
        $$typeof: va,
        key: null == d ? null : '' + d,
        children: a,
        containerInfo: b,
        implementation: c
    }
}
__name(bl, 'bl')
function cl(a) {
    if (!a) return Uf
    a = a._reactInternals
    a: {
        if (Ub(a) !== a || 1 !== a.tag) throw Error(p(170))
        var b = a
        do {
            switch (b.tag) {
                case 3:
                    b = b.stateNode.context
                    break a
                case 1:
                    if (Yf(b.type)) {
                        b =
                            b.stateNode
                                .__reactInternalMemoizedMergedChildContext
                        break a
                    }
            }
            b = b.return
        } while (null !== b)
        throw Error(p(171))
    }
    if (1 === a.tag) {
        var c = a.type
        if (Yf(c)) return ag(a, c, b)
    }
    return b
}
__name(cl, 'cl')
function dl(a, b, c, d, e, f, g, h, k) {
    a = al(c, d, true, a, e, f, g, h, k)
    a.context = cl(null)
    c = a.current
    d = Jg()
    e = Kg(c)
    f = zg(d, e)
    f.callback = void 0 !== b && null !== b ? b : null
    Ag(c, f)
    a.current.lanes = e
    zc(a, e, d)
    Ck(a, d)
    return a
}
__name(dl, 'dl')
function el(a, b, c, d) {
    var e = b.current,
        f = Jg(),
        g = Kg(e)
    c = cl(c)
    null === b.context ? (b.context = c) : (b.pendingContext = c)
    b = zg(f, g)
    b.payload = { element: a }
    d = void 0 === d ? null : d
    null !== d && (b.callback = d)
    Ag(e, b)
    a = Lg(e, g, f)
    null !== a && Cg(a, e, g)
    return g
}
__name(el, 'el')
function fl(a) {
    a = a.current
    if (!a.child) return null
    switch (a.child.tag) {
        case 5:
            return a.child.stateNode
        default:
            return a.child.stateNode
    }
}
__name(fl, 'fl')
function gl(a, b) {
    a = a.memoizedState
    if (null !== a && null !== a.dehydrated) {
        var c = a.retryLane
        a.retryLane = 0 !== c && c < b ? c : b
    }
}
__name(gl, 'gl')
function hl(a, b) {
    gl(a, b)
    ;(a = a.alternate) && gl(a, b)
}
__name(hl, 'hl')
function il() {
    return null
}
__name(il, 'il')
var jl =
    'function' === typeof reportError
        ? reportError
        : function (a) {
              console.error(a)
          }
function kl(a) {
    this._internalRoot = a
}
__name(kl, 'kl')
ll.prototype.render = kl.prototype.render = function (a) {
    var b = this._internalRoot
    if (null === b) throw Error(p(409))
    el(a, b, null, null)
}
ll.prototype.unmount = kl.prototype.unmount = function () {
    var a = this._internalRoot
    if (null !== a) {
        this._internalRoot = null
        var b = a.containerInfo
        Qk(function () {
            el(null, a, null, null)
        })
        b[tf] = null
    }
}
function ll(a) {
    this._internalRoot = a
}
__name(ll, 'll')
ll.prototype.unstable_scheduleHydration = function (a) {
    if (a) {
        var b = Gc()
        a = { blockedOn: null, target: a, priority: b }
        for (var c = 0; c < Pc.length && 0 !== b && b < Pc[c].priority; c++);
        Pc.splice(c, 0, a)
        0 === c && Uc(a)
    }
}
function ml(a) {
    return !(!a || (1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType))
}
__name(ml, 'ml')
function nl(a) {
    return !(
        !a ||
        (1 !== a.nodeType &&
            9 !== a.nodeType &&
            11 !== a.nodeType &&
            (8 !== a.nodeType ||
                ' react-mount-point-unstable ' !== a.nodeValue))
    )
}
__name(nl, 'nl')
function ol() {}
__name(ol, 'ol')
function pl(a, b, c, d, e) {
    if (e) {
        if ('function' === typeof d) {
            var f = d
            d = /* @__PURE__ */ __name(function () {
                var a2 = fl(g)
                f.call(a2)
            }, 'd')
        }
        var g = dl(b, d, a, 0, null, false, false, '', ol)
        a._reactRootContainer = g
        a[tf] = g.current
        rf(8 === a.nodeType ? a.parentNode : a)
        Qk()
        return g
    }
    for (; (e = a.lastChild); ) a.removeChild(e)
    if ('function' === typeof d) {
        var h = d
        d = /* @__PURE__ */ __name(function () {
            var a2 = fl(k)
            h.call(a2)
        }, 'd')
    }
    var k = al(a, 0, false, null, null, false, false, '', ol)
    a._reactRootContainer = k
    a[tf] = k.current
    rf(8 === a.nodeType ? a.parentNode : a)
    Qk(function () {
        el(b, k, c, d)
    })
    return k
}
__name(pl, 'pl')
function ql(a, b, c, d, e) {
    var f = c._reactRootContainer
    if (f) {
        var g = f
        if ('function' === typeof e) {
            var h = e
            e = /* @__PURE__ */ __name(function () {
                var a2 = fl(g)
                h.call(a2)
            }, 'e')
        }
        el(b, g, a, e)
    } else g = pl(c, b, a, e, d)
    return fl(g)
}
__name(ql, 'ql')
Dc = /* @__PURE__ */ __name(function (a) {
    switch (a.tag) {
        case 3:
            var b = a.stateNode
            if (b.current.memoizedState.isDehydrated) {
                var c = sc(b.pendingLanes)
                0 !== c &&
                    (Bc(b, c | 1),
                    Ck(b, B()),
                    0 === (W & 6) && ((aj = B() + 500), ig()))
            }
            break
        case 13:
            var d = Jg()
            Qk(function () {
                return Lg(a, 1, d)
            })
            hl(a, 1)
    }
}, 'Dc')
Ec = /* @__PURE__ */ __name(function (a) {
    if (13 === a.tag) {
        var b = Jg()
        Lg(a, 134217728, b)
        hl(a, 134217728)
    }
}, 'Ec')
Fc = /* @__PURE__ */ __name(function (a) {
    if (13 === a.tag) {
        var b = Jg(),
            c = Kg(a)
        Lg(a, c, b)
        hl(a, c)
    }
}, 'Fc')
Gc = /* @__PURE__ */ __name(function () {
    return C
}, 'Gc')
Hc = /* @__PURE__ */ __name(function (a, b) {
    var c = C
    try {
        return (C = a), b()
    } finally {
        C = c
    }
}, 'Hc')
xb = /* @__PURE__ */ __name(function (a, b, c) {
    switch (b) {
        case 'input':
            $a(a, c)
            b = c.name
            if ('radio' === c.type && null != b) {
                for (c = a; c.parentNode; ) c = c.parentNode
                c = c.querySelectorAll(
                    'input[name=' + JSON.stringify('' + b) + '][type="radio"]'
                )
                for (b = 0; b < c.length; b++) {
                    var d = c[b]
                    if (d !== a && d.form === a.form) {
                        var e = Cb(d)
                        if (!e) throw Error(p(90))
                        Va(d)
                        $a(d, e)
                    }
                }
            }
            break
        case 'textarea':
            hb(a, c)
            break
        case 'select':
            ;(b = c.value), null != b && eb(a, !!c.multiple, b, false)
    }
}, 'xb')
Fb = Pk
Gb = Qk
var rl = { usingClientEntryPoint: false, Events: [Bb, te, Cb, Db, Eb, Pk] },
    sl = {
        findFiberByHostInstance: Vc,
        bundleType: 0,
        version: '18.1.0',
        rendererPackageName: 'react-dom'
    }
var tl = {
    bundleType: sl.bundleType,
    version: sl.version,
    rendererPackageName: sl.rendererPackageName,
    rendererConfig: sl.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: ta.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (a) {
        a = Yb(a)
        return null === a ? null : a.stateNode
    },
    findFiberByHostInstance: sl.findFiberByHostInstance || il,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: '18.1.0-next-22edb9f77-20220426'
}
if ('undefined' !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var ul = __REACT_DEVTOOLS_GLOBAL_HOOK__
    if (!ul.isDisabled && ul.supportsFiber)
        try {
            ;(jc = ul.inject(tl)), (kc = ul)
        } catch (a) {}
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = rl
reactDom_production_min.createPortal = function (a, b) {
    var c =
        2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null
    if (!ml(b)) throw Error(p(200))
    return bl(a, b, null, c)
}
reactDom_production_min.createRoot = function (a, b) {
    if (!ml(a)) throw Error(p(299))
    var c = false,
        d = '',
        e = jl
    null !== b &&
        void 0 !== b &&
        (true === b.unstable_strictMode && (c = true),
        void 0 !== b.identifierPrefix && (d = b.identifierPrefix),
        void 0 !== b.onRecoverableError && (e = b.onRecoverableError))
    b = al(a, 1, false, null, null, c, false, d, e)
    a[tf] = b.current
    rf(8 === a.nodeType ? a.parentNode : a)
    return new kl(b)
}
reactDom_production_min.findDOMNode = function (a) {
    if (null == a) return null
    if (1 === a.nodeType) return a
    var b = a._reactInternals
    if (void 0 === b) {
        if ('function' === typeof a.render) throw Error(p(188))
        a = Object.keys(a).join(',')
        throw Error(p(268, a))
    }
    a = Yb(b)
    a = null === a ? null : a.stateNode
    return a
}
reactDom_production_min.flushSync = function (a) {
    return Qk(a)
}
reactDom_production_min.hydrate = function (a, b, c) {
    if (!nl(b)) throw Error(p(200))
    return ql(null, a, b, true, c)
}
reactDom_production_min.hydrateRoot = function (a, b, c) {
    if (!ml(a)) throw Error(p(405))
    var d = (null != c && c.hydratedSources) || null,
        e = false,
        f = '',
        g = jl
    null !== c &&
        void 0 !== c &&
        (true === c.unstable_strictMode && (e = true),
        void 0 !== c.identifierPrefix && (f = c.identifierPrefix),
        void 0 !== c.onRecoverableError && (g = c.onRecoverableError))
    b = dl(b, null, a, 1, null != c ? c : null, e, false, f, g)
    a[tf] = b.current
    rf(a)
    if (d)
        for (a = 0; a < d.length; a++)
            (c = d[a]),
                (e = c._getVersion),
                (e = e(c._source)),
                null == b.mutableSourceEagerHydrationData
                    ? (b.mutableSourceEagerHydrationData = [c, e])
                    : b.mutableSourceEagerHydrationData.push(c, e)
    return new ll(b)
}
reactDom_production_min.render = function (a, b, c) {
    if (!nl(b)) throw Error(p(200))
    return ql(null, a, b, false, c)
}
reactDom_production_min.unmountComponentAtNode = function (a) {
    if (!nl(a)) throw Error(p(40))
    return a._reactRootContainer
        ? (Qk(function () {
              ql(null, null, a, false, function () {
                  a._reactRootContainer = null
                  a[tf] = null
              })
          }),
          true)
        : false
}
reactDom_production_min.unstable_batchedUpdates = Pk
reactDom_production_min.unstable_renderSubtreeIntoContainer = function (
    a,
    b,
    c,
    d
) {
    if (!nl(c)) throw Error(p(200))
    if (null == a || void 0 === a._reactInternals) throw Error(p(38))
    return ql(a, b, c, false, d)
}
reactDom_production_min.version = '18.1.0-next-22edb9f77-20220426'
;(function (module) {
    function checkDCE() {
        if (
            typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
            typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
        ) {
            return
        }
        try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE)
        } catch (err) {
            console.error(err)
        }
    }
    __name(checkDCE, 'checkDCE')
    {
        checkDCE()
        module.exports = reactDom_production_min
    }
})(reactDom)
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports)
export { ReactDOM as R, reactDomExports as r }
