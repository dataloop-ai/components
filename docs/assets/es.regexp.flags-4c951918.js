import {
    h as descriptors,
    aL as defineBuiltInAccessor$1,
    aM as regexpFlags,
    k as fails$1
} from './iframe-dd92afcf.js'
var DESCRIPTORS = descriptors
var defineBuiltInAccessor = defineBuiltInAccessor$1
var regExpFlags = regexpFlags
var fails = fails$1
var RegExpPrototype = RegExp.prototype
var FORCED =
    DESCRIPTORS &&
    fails(function () {
        return (
            Object.getOwnPropertyDescriptor(RegExpPrototype, 'flags').get.call({
                dotAll: true,
                sticky: true
            }) !== 'sy'
        )
    })
if (FORCED)
    defineBuiltInAccessor(RegExpPrototype, 'flags', {
        configurable: true,
        get: regExpFlags
    })
