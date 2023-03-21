var __defProp = Object.defineProperty
var __name = (target, value) =>
    __defProp(target, 'name', { value, configurable: true })
import {
    R as React__default,
    Y as commonjsGlobal,
    y as styled,
    z as reactExports,
    J as logger
} from './iframe-dd92afcf.js'
import {
    w as window_1,
    m as memoizerific,
    _ as __awaiter,
    S as ScrollArea,
    a as __rest,
    A as ActionBar
} from './index-e3a020a3.js'
var jsx_1 = jsx
jsx.displayName = 'jsx'
jsx.aliases = []
function jsx(Prism2) {
    ;(function (Prism3) {
        var javascript2 = Prism3.util.clone(Prism3.languages.javascript)
        var space2 = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source
        var braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source
        var spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source
        function re(source, flags) {
            source = source
                .replace(/<S>/g, function () {
                    return space2
                })
                .replace(/<BRACES>/g, function () {
                    return braces
                })
                .replace(/<SPREAD>/g, function () {
                    return spread
                })
            return RegExp(source, flags)
        }
        __name(re, 're')
        spread = re(spread).source
        Prism3.languages.jsx = Prism3.languages.extend('markup', javascript2)
        Prism3.languages.jsx.tag.pattern = re(
            /<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/
                .source
        )
        Prism3.languages.jsx.tag.inside['tag'].pattern = /^<\/?[^\s>\/]*/
        Prism3.languages.jsx.tag.inside['attr-value'].pattern =
            /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/
        Prism3.languages.jsx.tag.inside['tag'].inside['class-name'] =
            /^[A-Z]\w*(?:\.[A-Z]\w*)*$/
        Prism3.languages.jsx.tag.inside['comment'] = javascript2['comment']
        Prism3.languages.insertBefore(
            'inside',
            'attr-name',
            {
                spread: {
                    pattern: re(/<SPREAD>/.source),
                    inside: Prism3.languages.jsx
                }
            },
            Prism3.languages.jsx.tag
        )
        Prism3.languages.insertBefore(
            'inside',
            'special-attr',
            {
                script: {
                    // Allow for two levels of nesting
                    pattern: re(/=<BRACES>/.source),
                    alias: 'language-javascript',
                    inside: {
                        'script-punctuation': {
                            pattern: /^=(?=\{)/,
                            alias: 'punctuation'
                        },
                        rest: Prism3.languages.jsx
                    }
                }
            },
            Prism3.languages.jsx.tag
        )
        var stringifyToken = /* @__PURE__ */ __name(function (token) {
            if (!token) {
                return ''
            }
            if (typeof token === 'string') {
                return token
            }
            if (typeof token.content === 'string') {
                return token.content
            }
            return token.content.map(stringifyToken).join('')
        }, 'stringifyToken')
        var walkTokens = /* @__PURE__ */ __name(function (tokens) {
            var openedTags = []
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i]
                var notTagNorBrace = false
                if (typeof token !== 'string') {
                    if (
                        token.type === 'tag' &&
                        token.content[0] &&
                        token.content[0].type === 'tag'
                    ) {
                        if (token.content[0].content[0].content === '</') {
                            if (
                                openedTags.length > 0 &&
                                openedTags[openedTags.length - 1].tagName ===
                                    stringifyToken(token.content[0].content[1])
                            ) {
                                openedTags.pop()
                            }
                        } else {
                            if (
                                token.content[token.content.length - 1]
                                    .content === '/>'
                            );
                            else {
                                openedTags.push({
                                    tagName: stringifyToken(
                                        token.content[0].content[1]
                                    ),
                                    openedBraces: 0
                                })
                            }
                        }
                    } else if (
                        openedTags.length > 0 &&
                        token.type === 'punctuation' &&
                        token.content === '{'
                    ) {
                        openedTags[openedTags.length - 1].openedBraces++
                    } else if (
                        openedTags.length > 0 &&
                        openedTags[openedTags.length - 1].openedBraces > 0 &&
                        token.type === 'punctuation' &&
                        token.content === '}'
                    ) {
                        openedTags[openedTags.length - 1].openedBraces--
                    } else {
                        notTagNorBrace = true
                    }
                }
                if (notTagNorBrace || typeof token === 'string') {
                    if (
                        openedTags.length > 0 &&
                        openedTags[openedTags.length - 1].openedBraces === 0
                    ) {
                        var plainText = stringifyToken(token)
                        if (
                            i < tokens.length - 1 &&
                            (typeof tokens[i + 1] === 'string' ||
                                tokens[i + 1].type === 'plain-text')
                        ) {
                            plainText += stringifyToken(tokens[i + 1])
                            tokens.splice(i + 1, 1)
                        }
                        if (
                            i > 0 &&
                            (typeof tokens[i - 1] === 'string' ||
                                tokens[i - 1].type === 'plain-text')
                        ) {
                            plainText =
                                stringifyToken(tokens[i - 1]) + plainText
                            tokens.splice(i - 1, 1)
                            i--
                        }
                        tokens[i] = new Prism3.Token(
                            'plain-text',
                            plainText,
                            null,
                            plainText
                        )
                    }
                }
                if (token.content && typeof token.content !== 'string') {
                    walkTokens(token.content)
                }
            }
        }, 'walkTokens')
        Prism3.hooks.add('after-tokenize', function (env) {
            if (env.language !== 'jsx' && env.language !== 'tsx') {
                return
            }
            walkTokens(env.tokens)
        })
    })(Prism2)
}
__name(jsx, 'jsx')
const jsx$1 = jsx_1
var bash_1 = bash
bash.displayName = 'bash'
bash.aliases = ['shell']
function bash(Prism2) {
    ;(function (Prism3) {
        var envVars =
            '\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b'
        var commandAfterHeredoc = {
            pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
            lookbehind: true,
            alias: 'punctuation',
            // this looks reasonably well in all themes
            inside: null
            // see below
        }
        var insideString = {
            bash: commandAfterHeredoc,
            environment: {
                pattern: RegExp('\\$' + envVars),
                alias: 'constant'
            },
            variable: [
                // [0]: Arithmetic Environment
                {
                    pattern: /\$?\(\([\s\S]+?\)\)/,
                    greedy: true,
                    inside: {
                        // If there is a $ sign at the beginning highlight $(( and )) as variable
                        variable: [
                            {
                                pattern: /(^\$\(\([\s\S]+)\)\)/,
                                lookbehind: true
                            },
                            /^\$\(\(/
                        ],
                        number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
                        // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
                        operator:
                            /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
                        // If there is no $ sign at the beginning highlight (( and )) as punctuation
                        punctuation: /\(\(?|\)\)?|,|;/
                    }
                },
                // [1]: Command Substitution
                {
                    pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
                    greedy: true,
                    inside: {
                        variable: /^\$\(|^`|\)$|`$/
                    }
                },
                // [2]: Brace expansion
                {
                    pattern: /\$\{[^}]+\}/,
                    greedy: true,
                    inside: {
                        operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
                        punctuation: /[\[\]]/,
                        environment: {
                            pattern: RegExp('(\\{)' + envVars),
                            lookbehind: true,
                            alias: 'constant'
                        }
                    }
                },
                /\$(?:\w+|[#?*!@$])/
            ],
            // Escape sequences from echo and printf's manuals, and escaped quotes.
            entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/
        }
        Prism3.languages.bash = {
            shebang: {
                pattern: /^#!\s*\/.*/,
                alias: 'important'
            },
            comment: {
                pattern: /(^|[^"{\\$])#.*/,
                lookbehind: true
            },
            'function-name': [
                // a) function foo {
                // b) foo() {
                // c) function foo() {
                // but not “foo {”
                {
                    // a) and c)
                    pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
                    lookbehind: true,
                    alias: 'function'
                },
                {
                    // b)
                    pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/,
                    alias: 'function'
                }
            ],
            // Highlight variable names as variables in for and select beginnings.
            'for-or-select': {
                pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
                alias: 'variable',
                lookbehind: true
            },
            // Highlight variable names as variables in the left-hand part
            // of assignments (“=” and “+=”).
            'assign-left': {
                pattern: /(^|[\s;|&]|[<>]\()\w+(?=\+?=)/,
                inside: {
                    environment: {
                        pattern: RegExp('(^|[\\s;|&]|[<>]\\()' + envVars),
                        lookbehind: true,
                        alias: 'constant'
                    }
                },
                alias: 'variable',
                lookbehind: true
            },
            string: [
                // Support for Here-documents https://en.wikipedia.org/wiki/Here_document
                {
                    pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
                    lookbehind: true,
                    greedy: true,
                    inside: insideString
                },
                // Here-document with quotes around the tag
                // → No expansion (so no “inside”).
                {
                    pattern:
                        /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
                    lookbehind: true,
                    greedy: true,
                    inside: {
                        bash: commandAfterHeredoc
                    }
                },
                // “Normal” string
                {
                    // https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html
                    pattern:
                        /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
                    lookbehind: true,
                    greedy: true,
                    inside: insideString
                },
                {
                    // https://www.gnu.org/software/bash/manual/html_node/Single-Quotes.html
                    pattern: /(^|[^$\\])'[^']*'/,
                    lookbehind: true,
                    greedy: true
                },
                {
                    // https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html
                    pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
                    greedy: true,
                    inside: {
                        entity: insideString.entity
                    }
                }
            ],
            environment: {
                pattern: RegExp('\\$?' + envVars),
                alias: 'constant'
            },
            variable: insideString.variable,
            function: {
                pattern:
                    /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
                lookbehind: true
            },
            keyword: {
                pattern:
                    /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
                lookbehind: true
            },
            // https://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
            builtin: {
                pattern:
                    /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
                lookbehind: true,
                // Alias added to make those easier to distinguish from strings.
                alias: 'class-name'
            },
            boolean: {
                pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
                lookbehind: true
            },
            'file-descriptor': {
                pattern: /\B&\d\b/,
                alias: 'important'
            },
            operator: {
                // Lots of redirections here, but not just that.
                pattern:
                    /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
                inside: {
                    'file-descriptor': {
                        pattern: /^\d/,
                        alias: 'important'
                    }
                }
            },
            punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
            number: {
                pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
                lookbehind: true
            }
        }
        commandAfterHeredoc.inside = Prism3.languages.bash
        var toBeCopied = [
            'comment',
            'function-name',
            'for-or-select',
            'assign-left',
            'string',
            'environment',
            'function',
            'keyword',
            'builtin',
            'boolean',
            'file-descriptor',
            'operator',
            'punctuation',
            'number'
        ]
        var inside = insideString.variable[1].inside
        for (var i = 0; i < toBeCopied.length; i++) {
            inside[toBeCopied[i]] = Prism3.languages.bash[toBeCopied[i]]
        }
        Prism3.languages.shell = Prism3.languages.bash
    })(Prism2)
}
__name(bash, 'bash')
const bash$1 = bash_1
var css_1 = css$1
css$1.displayName = 'css'
css$1.aliases = []
function css$1(Prism2) {
    ;(function (Prism3) {
        var string =
            /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/
        Prism3.languages.css = {
            comment: /\/\*[\s\S]*?\*\//,
            atrule: {
                pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
                inside: {
                    rule: /^@[\w-]+/,
                    'selector-function-argument': {
                        pattern:
                            /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                        lookbehind: true,
                        alias: 'selector'
                    },
                    keyword: {
                        pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                        lookbehind: true
                    }
                    // See rest below
                }
            },
            url: {
                // https://drafts.csswg.org/css-values-3/#urls
                pattern: RegExp(
                    '\\burl\\((?:' +
                        string.source +
                        '|' +
                        /(?:[^\\\r\n()"']|\\[\s\S])*/.source +
                        ')\\)',
                    'i'
                ),
                greedy: true,
                inside: {
                    function: /^url/i,
                    punctuation: /^\(|\)$/,
                    string: {
                        pattern: RegExp('^' + string.source + '$'),
                        alias: 'url'
                    }
                }
            },
            selector: {
                pattern: RegExp(
                    `(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` +
                        string.source +
                        ')*(?=\\s*\\{)'
                ),
                lookbehind: true
            },
            string: {
                pattern: string,
                greedy: true
            },
            property: {
                pattern:
                    /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
                lookbehind: true
            },
            important: /!important\b/i,
            function: {
                pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
                lookbehind: true
            },
            punctuation: /[(){};:,]/
        }
        Prism3.languages.css['atrule'].inside.rest = Prism3.languages.css
        var markup2 = Prism3.languages.markup
        if (markup2) {
            markup2.tag.addInlined('style', 'css')
            markup2.tag.addAttribute('style', 'css')
        }
    })(Prism2)
}
__name(css$1, 'css$1')
const css$2 = css_1
var jsExtras_1 = jsExtras
jsExtras.displayName = 'jsExtras'
jsExtras.aliases = []
function jsExtras(Prism2) {
    ;(function (Prism3) {
        Prism3.languages.insertBefore('javascript', 'function-variable', {
            'method-variable': {
                pattern: RegExp(
                    '(\\.\\s*)' +
                        Prism3.languages.javascript['function-variable'].pattern
                            .source
                ),
                lookbehind: true,
                alias: [
                    'function-variable',
                    'method',
                    'function',
                    'property-access'
                ]
            }
        })
        Prism3.languages.insertBefore('javascript', 'function', {
            method: {
                pattern: RegExp(
                    '(\\.\\s*)' + Prism3.languages.javascript['function'].source
                ),
                lookbehind: true,
                alias: ['function', 'property-access']
            }
        })
        Prism3.languages.insertBefore('javascript', 'constant', {
            'known-class-name': [
                {
                    // standard built-ins
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
                    pattern:
                        /\b(?:(?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|(?:Weak)?(?:Map|Set)|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|WebAssembly)\b/,
                    alias: 'class-name'
                },
                {
                    // errors
                    pattern: /\b(?:[A-Z]\w*)Error\b/,
                    alias: 'class-name'
                }
            ]
        })
        function withId(source, flags) {
            return RegExp(
                source.replace(/<ID>/g, function () {
                    return /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/
                        .source
                }),
                flags
            )
        }
        __name(withId, 'withId')
        Prism3.languages.insertBefore('javascript', 'keyword', {
            imports: {
                // https://tc39.es/ecma262/#sec-imports
                pattern: withId(
                    /(\bimport\b\s*)(?:<ID>(?:\s*,\s*(?:\*\s*as\s+<ID>|\{[^{}]*\}))?|\*\s*as\s+<ID>|\{[^{}]*\})(?=\s*\bfrom\b)/
                        .source
                ),
                lookbehind: true,
                inside: Prism3.languages.javascript
            },
            exports: {
                // https://tc39.es/ecma262/#sec-exports
                pattern: withId(
                    /(\bexport\b\s*)(?:\*(?:\s*as\s+<ID>)?(?=\s*\bfrom\b)|\{[^{}]*\})/
                        .source
                ),
                lookbehind: true,
                inside: Prism3.languages.javascript
            }
        })
        Prism3.languages.javascript['keyword'].unshift(
            {
                pattern: /\b(?:as|default|export|from|import)\b/,
                alias: 'module'
            },
            {
                pattern:
                    /\b(?:await|break|catch|continue|do|else|finally|for|if|return|switch|throw|try|while|yield)\b/,
                alias: 'control-flow'
            },
            {
                pattern: /\bnull\b/,
                alias: ['null', 'nil']
            },
            {
                pattern: /\bundefined\b/,
                alias: 'nil'
            }
        )
        Prism3.languages.insertBefore('javascript', 'operator', {
            spread: {
                pattern: /\.{3}/,
                alias: 'operator'
            },
            arrow: {
                pattern: /=>/,
                alias: 'operator'
            }
        })
        Prism3.languages.insertBefore('javascript', 'punctuation', {
            'property-access': {
                pattern: withId(/(\.\s*)#?<ID>/.source),
                lookbehind: true
            },
            'maybe-class-name': {
                pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
                lookbehind: true
            },
            dom: {
                // this contains only a few commonly used DOM variables
                pattern:
                    /\b(?:document|(?:local|session)Storage|location|navigator|performance|window)\b/,
                alias: 'variable'
            },
            console: {
                pattern: /\bconsole(?=\s*\.)/,
                alias: 'class-name'
            }
        })
        var maybeClassNameTokens = [
            'function',
            'function-variable',
            'method',
            'method-variable',
            'property-access'
        ]
        for (var i = 0; i < maybeClassNameTokens.length; i++) {
            var token = maybeClassNameTokens[i]
            var value = Prism3.languages.javascript[token]
            if (Prism3.util.type(value) === 'RegExp') {
                value = Prism3.languages.javascript[token] = {
                    pattern: value
                }
            }
            var inside = value.inside || {}
            value.inside = inside
            inside['maybe-class-name'] = /^[A-Z][\s\S]*/
        }
    })(Prism2)
}
__name(jsExtras, 'jsExtras')
const jsExtras$1 = jsExtras_1
var json_1 = json
json.displayName = 'json'
json.aliases = ['webmanifest']
function json(Prism2) {
    Prism2.languages.json = {
        property: {
            pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
            lookbehind: true,
            greedy: true
        },
        string: {
            pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
            lookbehind: true,
            greedy: true
        },
        comment: {
            pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
            greedy: true
        },
        number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
        punctuation: /[{}[\],]/,
        operator: /:/,
        boolean: /\b(?:false|true)\b/,
        null: {
            pattern: /\bnull\b/,
            alias: 'keyword'
        }
    }
    Prism2.languages.webmanifest = Prism2.languages.json
}
__name(json, 'json')
const json$1 = json_1
var graphql_1 = graphql
graphql.displayName = 'graphql'
graphql.aliases = []
function graphql(Prism2) {
    Prism2.languages.graphql = {
        comment: /#.*/,
        description: {
            pattern:
                /(?:"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*")(?=\s*[a-z_])/i,
            greedy: true,
            alias: 'string',
            inside: {
                'language-markdown': {
                    pattern: /(^"(?:"")?)(?!\1)[\s\S]+(?=\1$)/,
                    lookbehind: true,
                    inside: Prism2.languages.markdown
                }
            }
        },
        string: {
            pattern: /"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*"/,
            greedy: true
        },
        number: /(?:\B-|\b)\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
        boolean: /\b(?:false|true)\b/,
        variable: /\$[a-z_]\w*/i,
        directive: {
            pattern: /@[a-z_]\w*/i,
            alias: 'function'
        },
        'attr-name': {
            pattern:
                /\b[a-z_]\w*(?=\s*(?:\((?:[^()"]|"(?:\\.|[^\\"\r\n])*")*\))?:)/i,
            greedy: true
        },
        'atom-input': {
            pattern: /\b[A-Z]\w*Input\b/,
            alias: 'class-name'
        },
        scalar: /\b(?:Boolean|Float|ID|Int|String)\b/,
        constant: /\b[A-Z][A-Z_\d]*\b/,
        'class-name': {
            pattern:
                /(\b(?:enum|implements|interface|on|scalar|type|union)\s+|&\s*|:\s*|\[)[A-Z_]\w*/,
            lookbehind: true
        },
        fragment: {
            pattern: /(\bfragment\s+|\.{3}\s*(?!on\b))[a-zA-Z_]\w*/,
            lookbehind: true,
            alias: 'function'
        },
        'definition-mutation': {
            pattern: /(\bmutation\s+)[a-zA-Z_]\w*/,
            lookbehind: true,
            alias: 'function'
        },
        'definition-query': {
            pattern: /(\bquery\s+)[a-zA-Z_]\w*/,
            lookbehind: true,
            alias: 'function'
        },
        keyword:
            /\b(?:directive|enum|extend|fragment|implements|input|interface|mutation|on|query|repeatable|scalar|schema|subscription|type|union)\b/,
        operator: /[!=|&]|\.{3}/,
        'property-query': /\w+(?=\s*\()/,
        object: /\w+(?=\s*\{)/,
        punctuation: /[!(){}\[\]:=,]/,
        property: /\w+/
    }
    Prism2.hooks.add(
        'after-tokenize',
        /* @__PURE__ */ __name(function afterTokenizeGraphql(env) {
            if (env.language !== 'graphql') {
                return
            }
            var validTokens = env.tokens.filter(function (token) {
                return (
                    typeof token !== 'string' &&
                    token.type !== 'comment' &&
                    token.type !== 'scalar'
                )
            })
            var currentIndex = 0
            function getToken(offset) {
                return validTokens[currentIndex + offset]
            }
            __name(getToken, 'getToken')
            function isTokenType(types2, offset) {
                offset = offset || 0
                for (var i2 = 0; i2 < types2.length; i2++) {
                    var token = getToken(i2 + offset)
                    if (!token || token.type !== types2[i2]) {
                        return false
                    }
                }
                return true
            }
            __name(isTokenType, 'isTokenType')
            function findClosingBracket(open, close) {
                var stackHeight = 1
                for (var i2 = currentIndex; i2 < validTokens.length; i2++) {
                    var token = validTokens[i2]
                    var content = token.content
                    if (
                        token.type === 'punctuation' &&
                        typeof content === 'string'
                    ) {
                        if (open.test(content)) {
                            stackHeight++
                        } else if (close.test(content)) {
                            stackHeight--
                            if (stackHeight === 0) {
                                return i2
                            }
                        }
                    }
                }
                return -1
            }
            __name(findClosingBracket, 'findClosingBracket')
            function addAlias(token, alias2) {
                var aliases = token.alias
                if (!aliases) {
                    token.alias = aliases = []
                } else if (!Array.isArray(aliases)) {
                    token.alias = aliases = [aliases]
                }
                aliases.push(alias2)
            }
            __name(addAlias, 'addAlias')
            for (; currentIndex < validTokens.length; ) {
                var startToken = validTokens[currentIndex++]
                if (
                    startToken.type === 'keyword' &&
                    startToken.content === 'mutation'
                ) {
                    var inputVariables = []
                    if (
                        isTokenType(['definition-mutation', 'punctuation']) &&
                        getToken(1).content === '('
                    ) {
                        currentIndex += 2
                        var definitionEnd = findClosingBracket(/^\($/, /^\)$/)
                        if (definitionEnd === -1) {
                            continue
                        }
                        for (; currentIndex < definitionEnd; currentIndex++) {
                            var t = getToken(0)
                            if (t.type === 'variable') {
                                addAlias(t, 'variable-input')
                                inputVariables.push(t.content)
                            }
                        }
                        currentIndex = definitionEnd + 1
                    }
                    if (
                        isTokenType(['punctuation', 'property-query']) &&
                        getToken(0).content === '{'
                    ) {
                        currentIndex++
                        addAlias(getToken(0), 'property-mutation')
                        if (inputVariables.length > 0) {
                            var mutationEnd = findClosingBracket(/^\{$/, /^\}$/)
                            if (mutationEnd === -1) {
                                continue
                            }
                            for (var i = currentIndex; i < mutationEnd; i++) {
                                var varToken = validTokens[i]
                                if (
                                    varToken.type === 'variable' &&
                                    inputVariables.indexOf(varToken.content) >=
                                        0
                                ) {
                                    addAlias(varToken, 'variable-input')
                                }
                            }
                        }
                    }
                }
            }
        }, 'afterTokenizeGraphql')
    )
}
__name(graphql, 'graphql')
const graphql$1 = graphql_1
var markup_1 = markup$1
markup$1.displayName = 'markup'
markup$1.aliases = ['html', 'mathml', 'svg', 'xml', 'ssml', 'atom', 'rss']
function markup$1(Prism2) {
    Prism2.languages.markup = {
        comment: {
            pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
            greedy: true
        },
        prolog: {
            pattern: /<\?[\s\S]+?\?>/,
            greedy: true
        },
        doctype: {
            // https://www.w3.org/TR/xml/#NT-doctypedecl
            pattern:
                /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
            greedy: true,
            inside: {
                'internal-subset': {
                    pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
                    lookbehind: true,
                    greedy: true,
                    inside: null
                    // see below
                },
                string: {
                    pattern: /"[^"]*"|'[^']*'/,
                    greedy: true
                },
                punctuation: /^<!|>$|[[\]]/,
                'doctype-tag': /^DOCTYPE/i,
                name: /[^\s<>'"]+/
            }
        },
        cdata: {
            pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
            greedy: true
        },
        tag: {
            pattern:
                /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
            greedy: true,
            inside: {
                tag: {
                    pattern: /^<\/?[^\s>\/]+/,
                    inside: {
                        punctuation: /^<\/?/,
                        namespace: /^[^\s>\/:]+:/
                    }
                },
                'special-attr': [],
                'attr-value': {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        punctuation: [
                            {
                                pattern: /^=/,
                                alias: 'attr-equals'
                            },
                            /"|'/
                        ]
                    }
                },
                punctuation: /\/?>/,
                'attr-name': {
                    pattern: /[^\s>\/]+/,
                    inside: {
                        namespace: /^[^\s>\/:]+:/
                    }
                }
            }
        },
        entity: [
            {
                pattern: /&[\da-z]{1,8};/i,
                alias: 'named-entity'
            },
            /&#x?[\da-f]{1,8};/i
        ]
    }
    Prism2.languages.markup['tag'].inside['attr-value'].inside['entity'] =
        Prism2.languages.markup['entity']
    Prism2.languages.markup['doctype'].inside['internal-subset'].inside =
        Prism2.languages.markup
    Prism2.hooks.add('wrap', function (env) {
        if (env.type === 'entity') {
            env.attributes['title'] = env.content.value.replace(/&amp;/, '&')
        }
    })
    Object.defineProperty(Prism2.languages.markup.tag, 'addInlined', {
        /**
         * Adds an inlined language to markup.
         *
         * An example of an inlined language is CSS with `<style>` tags.
         *
         * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
         * case insensitive.
         * @param {string} lang The language key.
         * @example
         * addInlined('style', 'css');
         */
        value: /* @__PURE__ */ __name(function addInlined(tagName, lang) {
            var includedCdataInside = {}
            includedCdataInside['language-' + lang] = {
                pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                lookbehind: true,
                inside: Prism2.languages[lang]
            }
            includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i
            var inside = {
                'included-cdata': {
                    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                    inside: includedCdataInside
                }
            }
            inside['language-' + lang] = {
                pattern: /[\s\S]+/,
                inside: Prism2.languages[lang]
            }
            var def = {}
            def[tagName] = {
                pattern: RegExp(
                    /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
                        /__/g,
                        function () {
                            return tagName
                        }
                    ),
                    'i'
                ),
                lookbehind: true,
                greedy: true,
                inside
            }
            Prism2.languages.insertBefore('markup', 'cdata', def)
        }, 'addInlined')
    })
    Object.defineProperty(Prism2.languages.markup.tag, 'addAttribute', {
        /**
         * Adds an pattern to highlight languages embedded in HTML attributes.
         *
         * An example of an inlined language is CSS with `style` attributes.
         *
         * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
         * case insensitive.
         * @param {string} lang The language key.
         * @example
         * addAttribute('style', 'css');
         */
        value: function (attrName, lang) {
            Prism2.languages.markup.tag.inside['special-attr'].push({
                pattern: RegExp(
                    /(^|["'\s])/.source +
                        '(?:' +
                        attrName +
                        ')' +
                        /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
                    'i'
                ),
                lookbehind: true,
                inside: {
                    'attr-name': /^[^\s=]+/,
                    'attr-value': {
                        pattern: /=[\s\S]+/,
                        inside: {
                            value: {
                                pattern:
                                    /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                                lookbehind: true,
                                alias: [lang, 'language-' + lang],
                                inside: Prism2.languages[lang]
                            },
                            punctuation: [
                                {
                                    pattern: /^=/,
                                    alias: 'attr-equals'
                                },
                                /"|'/
                            ]
                        }
                    }
                }
            })
        }
    })
    Prism2.languages.html = Prism2.languages.markup
    Prism2.languages.mathml = Prism2.languages.markup
    Prism2.languages.svg = Prism2.languages.markup
    Prism2.languages.xml = Prism2.languages.extend('markup', {})
    Prism2.languages.ssml = Prism2.languages.xml
    Prism2.languages.atom = Prism2.languages.xml
    Prism2.languages.rss = Prism2.languages.xml
}
__name(markup$1, 'markup$1')
const markup$2 = markup_1
var markdown_1 = markdown
markdown.displayName = 'markdown'
markdown.aliases = ['md']
function markdown(Prism2) {
    ;(function (Prism3) {
        var inner = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source
        function createInline(pattern) {
            pattern = pattern.replace(/<inner>/g, function () {
                return inner
            })
            return RegExp(
                /((?:^|[^\\])(?:\\{2})*)/.source + '(?:' + pattern + ')'
            )
        }
        __name(createInline, 'createInline')
        var tableCell =
            /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source
        var tableRow =
            /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(
                /__/g,
                function () {
                    return tableCell
                }
            )
        var tableLine =
            /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/
                .source
        Prism3.languages.markdown = Prism3.languages.extend('markup', {})
        Prism3.languages.insertBefore('markdown', 'prolog', {
            'front-matter-block': {
                pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
                lookbehind: true,
                greedy: true,
                inside: {
                    punctuation: /^---|---$/,
                    'front-matter': {
                        pattern: /\S+(?:\s+\S+)*/,
                        alias: ['yaml', 'language-yaml'],
                        inside: Prism3.languages.yaml
                    }
                }
            },
            blockquote: {
                // > ...
                pattern: /^>(?:[\t ]*>)*/m,
                alias: 'punctuation'
            },
            table: {
                pattern: RegExp(
                    '^' + tableRow + tableLine + '(?:' + tableRow + ')*',
                    'm'
                ),
                inside: {
                    'table-data-rows': {
                        pattern: RegExp(
                            '^(' +
                                tableRow +
                                tableLine +
                                ')(?:' +
                                tableRow +
                                ')*$'
                        ),
                        lookbehind: true,
                        inside: {
                            'table-data': {
                                pattern: RegExp(tableCell),
                                inside: Prism3.languages.markdown
                            },
                            punctuation: /\|/
                        }
                    },
                    'table-line': {
                        pattern: RegExp(
                            '^(' + tableRow + ')' + tableLine + '$'
                        ),
                        lookbehind: true,
                        inside: {
                            punctuation: /\||:?-{3,}:?/
                        }
                    },
                    'table-header-row': {
                        pattern: RegExp('^' + tableRow + '$'),
                        inside: {
                            'table-header': {
                                pattern: RegExp(tableCell),
                                alias: 'important',
                                inside: Prism3.languages.markdown
                            },
                            punctuation: /\|/
                        }
                    }
                }
            },
            code: [
                {
                    // Prefixed by 4 spaces or 1 tab and preceded by an empty line
                    pattern:
                        /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
                    lookbehind: true,
                    alias: 'keyword'
                },
                {
                    // ```optional language
                    // code block
                    // ```
                    pattern: /^```[\s\S]*?^```$/m,
                    greedy: true,
                    inside: {
                        'code-block': {
                            pattern:
                                /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
                            lookbehind: true
                        },
                        'code-language': {
                            pattern: /^(```).+/,
                            lookbehind: true
                        },
                        punctuation: /```/
                    }
                }
            ],
            title: [
                {
                    // title 1
                    // =======
                    // title 2
                    // -------
                    pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
                    alias: 'important',
                    inside: {
                        punctuation: /==+$|--+$/
                    }
                },
                {
                    // # title 1
                    // ###### title 6
                    pattern: /(^\s*)#.+/m,
                    lookbehind: true,
                    alias: 'important',
                    inside: {
                        punctuation: /^#+|#+$/
                    }
                }
            ],
            hr: {
                // ***
                // ---
                // * * *
                // -----------
                pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
                lookbehind: true,
                alias: 'punctuation'
            },
            list: {
                // * item
                // + item
                // - item
                // 1. item
                pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
                lookbehind: true,
                alias: 'punctuation'
            },
            'url-reference': {
                // [id]: http://example.com "Optional title"
                // [id]: http://example.com 'Optional title'
                // [id]: http://example.com (Optional title)
                // [id]: <http://example.com> "Optional title"
                pattern:
                    /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
                inside: {
                    variable: {
                        pattern: /^(!?\[)[^\]]+/,
                        lookbehind: true
                    },
                    string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
                    punctuation: /^[\[\]!:]|[<>]/
                },
                alias: 'url'
            },
            bold: {
                // **strong**
                // __strong__
                // allow one nested instance of italic text using the same delimiter
                pattern: createInline(
                    /\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/
                        .source
                ),
                lookbehind: true,
                greedy: true,
                inside: {
                    content: {
                        pattern: /(^..)[\s\S]+(?=..$)/,
                        lookbehind: true,
                        inside: {}
                        // see below
                    },
                    punctuation: /\*\*|__/
                }
            },
            italic: {
                // *em*
                // _em_
                // allow one nested instance of bold text using the same delimiter
                pattern: createInline(
                    /\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/
                        .source
                ),
                lookbehind: true,
                greedy: true,
                inside: {
                    content: {
                        pattern: /(^.)[\s\S]+(?=.$)/,
                        lookbehind: true,
                        inside: {}
                        // see below
                    },
                    punctuation: /[*_]/
                }
            },
            strike: {
                // ~~strike through~~
                // ~strike~
                // eslint-disable-next-line regexp/strict
                pattern: createInline(/(~~?)(?:(?!~)<inner>)+\2/.source),
                lookbehind: true,
                greedy: true,
                inside: {
                    content: {
                        pattern: /(^~~?)[\s\S]+(?=\1$)/,
                        lookbehind: true,
                        inside: {}
                        // see below
                    },
                    punctuation: /~~?/
                }
            },
            'code-snippet': {
                // `code`
                // ``code``
                pattern:
                    /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
                lookbehind: true,
                greedy: true,
                alias: ['code', 'keyword']
            },
            url: {
                // [example](http://example.com "Optional title")
                // [example][id]
                // [example] [id]
                pattern: createInline(
                    /!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/
                        .source
                ),
                lookbehind: true,
                greedy: true,
                inside: {
                    operator: /^!/,
                    content: {
                        pattern: /(^\[)[^\]]+(?=\])/,
                        lookbehind: true,
                        inside: {}
                        // see below
                    },
                    variable: {
                        pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
                        lookbehind: true
                    },
                    url: {
                        pattern: /(^\]\()[^\s)]+/,
                        lookbehind: true
                    },
                    string: {
                        pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
                        lookbehind: true
                    }
                }
            }
        })
        ;['url', 'bold', 'italic', 'strike'].forEach(function (token) {
            ;['url', 'bold', 'italic', 'strike', 'code-snippet'].forEach(
                function (inside) {
                    if (token !== inside) {
                        Prism3.languages.markdown[token].inside.content.inside[
                            inside
                        ] = Prism3.languages.markdown[inside]
                    }
                }
            )
        })
        Prism3.hooks.add('after-tokenize', function (env) {
            if (env.language !== 'markdown' && env.language !== 'md') {
                return
            }
            function walkTokens(tokens) {
                if (!tokens || typeof tokens === 'string') {
                    return
                }
                for (var i = 0, l = tokens.length; i < l; i++) {
                    var token = tokens[i]
                    if (token.type !== 'code') {
                        walkTokens(token.content)
                        continue
                    }
                    var codeLang = token.content[1]
                    var codeBlock = token.content[3]
                    if (
                        codeLang &&
                        codeBlock &&
                        codeLang.type === 'code-language' &&
                        codeBlock.type === 'code-block' &&
                        typeof codeLang.content === 'string'
                    ) {
                        var lang = codeLang.content
                            .replace(/\b#/g, 'sharp')
                            .replace(/\b\+\+/g, 'pp')
                        lang = (/[a-z][\w-]*/i.exec(lang) || [
                            ''
                        ])[0].toLowerCase()
                        var alias2 = 'language-' + lang
                        if (!codeBlock.alias) {
                            codeBlock.alias = [alias2]
                        } else if (typeof codeBlock.alias === 'string') {
                            codeBlock.alias = [codeBlock.alias, alias2]
                        } else {
                            codeBlock.alias.push(alias2)
                        }
                    }
                }
            }
            __name(walkTokens, 'walkTokens')
            walkTokens(env.tokens)
        })
        Prism3.hooks.add('wrap', function (env) {
            if (env.type !== 'code-block') {
                return
            }
            var codeLang = ''
            for (var i = 0, l = env.classes.length; i < l; i++) {
                var cls = env.classes[i]
                var match = /language-(.+)/.exec(cls)
                if (match) {
                    codeLang = match[1]
                    break
                }
            }
            var grammar = Prism3.languages[codeLang]
            if (!grammar) {
                if (
                    codeLang &&
                    codeLang !== 'none' &&
                    Prism3.plugins.autoloader
                ) {
                    var id =
                        'md-' +
                        new Date().valueOf() +
                        '-' +
                        Math.floor(Math.random() * 1e16)
                    env.attributes['id'] = id
                    Prism3.plugins.autoloader.loadLanguages(
                        codeLang,
                        function () {
                            var ele = document.getElementById(id)
                            if (ele) {
                                ele.innerHTML = Prism3.highlight(
                                    ele.textContent,
                                    Prism3.languages[codeLang],
                                    codeLang
                                )
                            }
                        }
                    )
                }
            } else {
                env.content = Prism3.highlight(
                    textContent(env.content.value),
                    grammar,
                    codeLang
                )
            }
        })
        var tagPattern = RegExp(
            Prism3.languages.markup.tag.pattern.source,
            'gi'
        )
        var KNOWN_ENTITY_NAMES = {
            amp: '&',
            lt: '<',
            gt: '>',
            quot: '"'
        }
        var fromCodePoint = String.fromCodePoint || String.fromCharCode
        function textContent(html2) {
            var text = html2.replace(tagPattern, '')
            text = text.replace(
                /&(\w{1,8}|#x?[\da-f]{1,8});/gi,
                function (m, code) {
                    code = code.toLowerCase()
                    if (code[0] === '#') {
                        var value
                        if (code[1] === 'x') {
                            value = parseInt(code.slice(2), 16)
                        } else {
                            value = Number(code.slice(1))
                        }
                        return fromCodePoint(value)
                    } else {
                        var known = KNOWN_ENTITY_NAMES[code]
                        if (known) {
                            return known
                        }
                        return m
                    }
                }
            )
            return text
        }
        __name(textContent, 'textContent')
        Prism3.languages.md = Prism3.languages.markdown
    })(Prism2)
}
__name(markdown, 'markdown')
const markdown$1 = markdown_1
var yaml_1 = yaml
yaml.displayName = 'yaml'
yaml.aliases = ['yml']
function yaml(Prism2) {
    ;(function (Prism3) {
        var anchorOrAlias = /[*&][^\s[\]{},]+/
        var tag =
            /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/
        var properties =
            '(?:' +
            tag.source +
            '(?:[ 	]+' +
            anchorOrAlias.source +
            ')?|' +
            anchorOrAlias.source +
            '(?:[ 	]+' +
            tag.source +
            ')?)'
        var plainKey =
            /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(
                /<PLAIN>/g,
                function () {
                    return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/
                        .source
                }
            )
        var string = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source
        function createValuePattern(value, flags) {
            flags = (flags || '').replace(/m/g, '') + 'm'
            var pattern =
                /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source
                    .replace(/<<prop>>/g, function () {
                        return properties
                    })
                    .replace(/<<value>>/g, function () {
                        return value
                    })
            return RegExp(pattern, flags)
        }
        __name(createValuePattern, 'createValuePattern')
        Prism3.languages.yaml = {
            scalar: {
                pattern: RegExp(
                    /([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(
                        /<<prop>>/g,
                        function () {
                            return properties
                        }
                    )
                ),
                lookbehind: true,
                alias: 'string'
            },
            comment: /#.*/,
            key: {
                pattern: RegExp(
                    /((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source
                        .replace(/<<prop>>/g, function () {
                            return properties
                        })
                        .replace(/<<key>>/g, function () {
                            return '(?:' + plainKey + '|' + string + ')'
                        })
                ),
                lookbehind: true,
                greedy: true,
                alias: 'atrule'
            },
            directive: {
                pattern: /(^[ \t]*)%.+/m,
                lookbehind: true,
                alias: 'important'
            },
            datetime: {
                pattern: createValuePattern(
                    /\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/
                        .source
                ),
                lookbehind: true,
                alias: 'number'
            },
            boolean: {
                pattern: createValuePattern(/false|true/.source, 'i'),
                lookbehind: true,
                alias: 'important'
            },
            null: {
                pattern: createValuePattern(/null|~/.source, 'i'),
                lookbehind: true,
                alias: 'important'
            },
            string: {
                pattern: createValuePattern(string),
                lookbehind: true,
                greedy: true
            },
            number: {
                pattern: createValuePattern(
                    /[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/
                        .source,
                    'i'
                ),
                lookbehind: true
            },
            tag,
            important: anchorOrAlias,
            punctuation: /---|[:[\]{}\-,|>?]|\.\.\./
        }
        Prism3.languages.yml = Prism3.languages.yaml
    })(Prism2)
}
__name(yaml, 'yaml')
const yaml$1 = yaml_1
var typescript_1 = typescript
typescript.displayName = 'typescript'
typescript.aliases = ['ts']
function typescript(Prism2) {
    ;(function (Prism3) {
        Prism3.languages.typescript = Prism3.languages.extend('javascript', {
            'class-name': {
                pattern:
                    /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
                lookbehind: true,
                greedy: true,
                inside: null
                // see below
            },
            builtin:
                /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
        })
        Prism3.languages.typescript.keyword.push(
            /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
            // keywords that have to be followed by an identifier
            /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
            // This is for `import type *, {}`
            /\btype\b(?=\s*(?:[\{*]|$))/
        )
        delete Prism3.languages.typescript['parameter']
        delete Prism3.languages.typescript['literal-property']
        var typeInside = Prism3.languages.extend('typescript', {})
        delete typeInside['class-name']
        Prism3.languages.typescript['class-name'].inside = typeInside
        Prism3.languages.insertBefore('typescript', 'function', {
            decorator: {
                pattern: /@[$\w\xA0-\uFFFF]+/,
                inside: {
                    at: {
                        pattern: /^@/,
                        alias: 'operator'
                    },
                    function: /^[\s\S]+/
                }
            },
            'generic-function': {
                // e.g. foo<T extends "bar" | "baz">( ...
                pattern:
                    /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
                greedy: true,
                inside: {
                    function:
                        /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
                    generic: {
                        pattern: /<[\s\S]+/,
                        // everything after the first <
                        alias: 'class-name',
                        inside: typeInside
                    }
                }
            }
        })
        Prism3.languages.ts = Prism3.languages.typescript
    })(Prism2)
}
__name(typescript, 'typescript')
const typescript$1 = typescript_1
var refractorJsx = jsx_1
var refractorTypescript = typescript_1
var tsx_1 = tsx
tsx.displayName = 'tsx'
tsx.aliases = []
function tsx(Prism2) {
    Prism2.register(refractorJsx)
    Prism2.register(refractorTypescript)
    ;(function (Prism3) {
        var typescript2 = Prism3.util.clone(Prism3.languages.typescript)
        Prism3.languages.tsx = Prism3.languages.extend('jsx', typescript2)
        delete Prism3.languages.tsx['parameter']
        delete Prism3.languages.tsx['literal-property']
        var tag = Prism3.languages.tsx.tag
        tag.pattern = RegExp(
            /(^|[^\w$]|(?=<\/))/.source + '(?:' + tag.pattern.source + ')',
            tag.pattern.flags
        )
        tag.lookbehind = true
    })(Prism2)
}
__name(tsx, 'tsx')
const tsx$1 = tsx_1
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {}
    var target = {}
    var sourceKeys = Object.keys(source)
    var key, i
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i]
        if (excluded.indexOf(key) >= 0) continue
        target[key] = source[key]
    }
    return target
}
__name(_objectWithoutPropertiesLoose, '_objectWithoutPropertiesLoose')
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {}
    var target = _objectWithoutPropertiesLoose(source, excluded)
    var key, i
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source)
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i]
            if (excluded.indexOf(key) >= 0) continue
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue
            target[key] = source[key]
        }
    }
    return target
}
__name(_objectWithoutProperties, '_objectWithoutProperties')
function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i]
    }
    return arr2
}
__name(_arrayLikeToArray$1, '_arrayLikeToArray$1')
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray$1(arr)
}
__name(_arrayWithoutHoles, '_arrayWithoutHoles')
function _iterableToArray(iter) {
    if (
        (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null) ||
        iter['@@iterator'] != null
    )
        return Array.from(iter)
}
__name(_iterableToArray, '_iterableToArray')
function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return
    if (typeof o === 'string') return _arrayLikeToArray$1(o, minLen)
    var n = Object.prototype.toString.call(o).slice(8, -1)
    if (n === 'Object' && o.constructor) n = o.constructor.name
    if (n === 'Map' || n === 'Set') return Array.from(o)
    if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray$1(o, minLen)
}
__name(_unsupportedIterableToArray$1, '_unsupportedIterableToArray$1')
function _nonIterableSpread() {
    throw new TypeError(
        'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    )
}
__name(_nonIterableSpread, '_nonIterableSpread')
function _toConsumableArray(arr) {
    return (
        _arrayWithoutHoles(arr) ||
        _iterableToArray(arr) ||
        _unsupportedIterableToArray$1(arr) ||
        _nonIterableSpread()
    )
}
__name(_toConsumableArray, '_toConsumableArray')
function _defineProperty$1(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}
__name(_defineProperty$1, '_defineProperty$1')
function _extends() {
    _extends = Object.assign
        ? Object.assign.bind()
        : function (target) {
              for (var i = 1; i < arguments.length; i++) {
                  var source = arguments[i]
                  for (var key in source) {
                      if (Object.prototype.hasOwnProperty.call(source, key)) {
                          target[key] = source[key]
                      }
                  }
              }
              return target
          }
    return _extends.apply(this, arguments)
}
__name(_extends, '_extends')
function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object)
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object)
        enumerableOnly &&
            (symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable
            })),
            keys.push.apply(keys, symbols)
    }
    return keys
}
__name(ownKeys$1, 'ownKeys$1')
function _objectSpread$1(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {}
        i % 2
            ? ownKeys$1(Object(source), true).forEach(function (key) {
                  _defineProperty$1(target, key, source[key])
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(
                  target,
                  Object.getOwnPropertyDescriptors(source)
              )
            : ownKeys$1(Object(source)).forEach(function (key) {
                  Object.defineProperty(
                      target,
                      key,
                      Object.getOwnPropertyDescriptor(source, key)
                  )
              })
    }
    return target
}
__name(_objectSpread$1, '_objectSpread$1')
function powerSetPermutations(arr) {
    var arrLength = arr.length
    if (arrLength === 0 || arrLength === 1) return arr
    if (arrLength === 2) {
        return [
            arr[0],
            arr[1],
            ''.concat(arr[0], '.').concat(arr[1]),
            ''.concat(arr[1], '.').concat(arr[0])
        ]
    }
    if (arrLength === 3) {
        return [
            arr[0],
            arr[1],
            arr[2],
            ''.concat(arr[0], '.').concat(arr[1]),
            ''.concat(arr[0], '.').concat(arr[2]),
            ''.concat(arr[1], '.').concat(arr[0]),
            ''.concat(arr[1], '.').concat(arr[2]),
            ''.concat(arr[2], '.').concat(arr[0]),
            ''.concat(arr[2], '.').concat(arr[1]),
            ''.concat(arr[0], '.').concat(arr[1], '.').concat(arr[2]),
            ''.concat(arr[0], '.').concat(arr[2], '.').concat(arr[1]),
            ''.concat(arr[1], '.').concat(arr[0], '.').concat(arr[2]),
            ''.concat(arr[1], '.').concat(arr[2], '.').concat(arr[0]),
            ''.concat(arr[2], '.').concat(arr[0], '.').concat(arr[1]),
            ''.concat(arr[2], '.').concat(arr[1], '.').concat(arr[0])
        ]
    }
    if (arrLength >= 4) {
        return [
            arr[0],
            arr[1],
            arr[2],
            arr[3],
            ''.concat(arr[0], '.').concat(arr[1]),
            ''.concat(arr[0], '.').concat(arr[2]),
            ''.concat(arr[0], '.').concat(arr[3]),
            ''.concat(arr[1], '.').concat(arr[0]),
            ''.concat(arr[1], '.').concat(arr[2]),
            ''.concat(arr[1], '.').concat(arr[3]),
            ''.concat(arr[2], '.').concat(arr[0]),
            ''.concat(arr[2], '.').concat(arr[1]),
            ''.concat(arr[2], '.').concat(arr[3]),
            ''.concat(arr[3], '.').concat(arr[0]),
            ''.concat(arr[3], '.').concat(arr[1]),
            ''.concat(arr[3], '.').concat(arr[2]),
            ''.concat(arr[0], '.').concat(arr[1], '.').concat(arr[2]),
            ''.concat(arr[0], '.').concat(arr[1], '.').concat(arr[3]),
            ''.concat(arr[0], '.').concat(arr[2], '.').concat(arr[1]),
            ''.concat(arr[0], '.').concat(arr[2], '.').concat(arr[3]),
            ''.concat(arr[0], '.').concat(arr[3], '.').concat(arr[1]),
            ''.concat(arr[0], '.').concat(arr[3], '.').concat(arr[2]),
            ''.concat(arr[1], '.').concat(arr[0], '.').concat(arr[2]),
            ''.concat(arr[1], '.').concat(arr[0], '.').concat(arr[3]),
            ''.concat(arr[1], '.').concat(arr[2], '.').concat(arr[0]),
            ''.concat(arr[1], '.').concat(arr[2], '.').concat(arr[3]),
            ''.concat(arr[1], '.').concat(arr[3], '.').concat(arr[0]),
            ''.concat(arr[1], '.').concat(arr[3], '.').concat(arr[2]),
            ''.concat(arr[2], '.').concat(arr[0], '.').concat(arr[1]),
            ''.concat(arr[2], '.').concat(arr[0], '.').concat(arr[3]),
            ''.concat(arr[2], '.').concat(arr[1], '.').concat(arr[0]),
            ''.concat(arr[2], '.').concat(arr[1], '.').concat(arr[3]),
            ''.concat(arr[2], '.').concat(arr[3], '.').concat(arr[0]),
            ''.concat(arr[2], '.').concat(arr[3], '.').concat(arr[1]),
            ''.concat(arr[3], '.').concat(arr[0], '.').concat(arr[1]),
            ''.concat(arr[3], '.').concat(arr[0], '.').concat(arr[2]),
            ''.concat(arr[3], '.').concat(arr[1], '.').concat(arr[0]),
            ''.concat(arr[3], '.').concat(arr[1], '.').concat(arr[2]),
            ''.concat(arr[3], '.').concat(arr[2], '.').concat(arr[0]),
            ''.concat(arr[3], '.').concat(arr[2], '.').concat(arr[1]),
            ''
                .concat(arr[0], '.')
                .concat(arr[1], '.')
                .concat(arr[2], '.')
                .concat(arr[3]),
            ''
                .concat(arr[0], '.')
                .concat(arr[1], '.')
                .concat(arr[3], '.')
                .concat(arr[2]),
            ''
                .concat(arr[0], '.')
                .concat(arr[2], '.')
                .concat(arr[1], '.')
                .concat(arr[3]),
            ''
                .concat(arr[0], '.')
                .concat(arr[2], '.')
                .concat(arr[3], '.')
                .concat(arr[1]),
            ''
                .concat(arr[0], '.')
                .concat(arr[3], '.')
                .concat(arr[1], '.')
                .concat(arr[2]),
            ''
                .concat(arr[0], '.')
                .concat(arr[3], '.')
                .concat(arr[2], '.')
                .concat(arr[1]),
            ''
                .concat(arr[1], '.')
                .concat(arr[0], '.')
                .concat(arr[2], '.')
                .concat(arr[3]),
            ''
                .concat(arr[1], '.')
                .concat(arr[0], '.')
                .concat(arr[3], '.')
                .concat(arr[2]),
            ''
                .concat(arr[1], '.')
                .concat(arr[2], '.')
                .concat(arr[0], '.')
                .concat(arr[3]),
            ''
                .concat(arr[1], '.')
                .concat(arr[2], '.')
                .concat(arr[3], '.')
                .concat(arr[0]),
            ''
                .concat(arr[1], '.')
                .concat(arr[3], '.')
                .concat(arr[0], '.')
                .concat(arr[2]),
            ''
                .concat(arr[1], '.')
                .concat(arr[3], '.')
                .concat(arr[2], '.')
                .concat(arr[0]),
            ''
                .concat(arr[2], '.')
                .concat(arr[0], '.')
                .concat(arr[1], '.')
                .concat(arr[3]),
            ''
                .concat(arr[2], '.')
                .concat(arr[0], '.')
                .concat(arr[3], '.')
                .concat(arr[1]),
            ''
                .concat(arr[2], '.')
                .concat(arr[1], '.')
                .concat(arr[0], '.')
                .concat(arr[3]),
            ''
                .concat(arr[2], '.')
                .concat(arr[1], '.')
                .concat(arr[3], '.')
                .concat(arr[0]),
            ''
                .concat(arr[2], '.')
                .concat(arr[3], '.')
                .concat(arr[0], '.')
                .concat(arr[1]),
            ''
                .concat(arr[2], '.')
                .concat(arr[3], '.')
                .concat(arr[1], '.')
                .concat(arr[0]),
            ''
                .concat(arr[3], '.')
                .concat(arr[0], '.')
                .concat(arr[1], '.')
                .concat(arr[2]),
            ''
                .concat(arr[3], '.')
                .concat(arr[0], '.')
                .concat(arr[2], '.')
                .concat(arr[1]),
            ''
                .concat(arr[3], '.')
                .concat(arr[1], '.')
                .concat(arr[0], '.')
                .concat(arr[2]),
            ''
                .concat(arr[3], '.')
                .concat(arr[1], '.')
                .concat(arr[2], '.')
                .concat(arr[0]),
            ''
                .concat(arr[3], '.')
                .concat(arr[2], '.')
                .concat(arr[0], '.')
                .concat(arr[1]),
            ''
                .concat(arr[3], '.')
                .concat(arr[2], '.')
                .concat(arr[1], '.')
                .concat(arr[0])
        ]
    }
}
__name(powerSetPermutations, 'powerSetPermutations')
var classNameCombinations = {}
function getClassNameCombinations(classNames) {
    if (classNames.length === 0 || classNames.length === 1) return classNames
    var key = classNames.join('.')
    if (!classNameCombinations[key]) {
        classNameCombinations[key] = powerSetPermutations(classNames)
    }
    return classNameCombinations[key]
}
__name(getClassNameCombinations, 'getClassNameCombinations')
function createStyleObject(classNames) {
    var elementStyle =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
    var stylesheet = arguments.length > 2 ? arguments[2] : void 0
    var nonTokenClassNames = classNames.filter(function (className) {
        return className !== 'token'
    })
    var classNamesCombinations = getClassNameCombinations(nonTokenClassNames)
    return classNamesCombinations.reduce(function (styleObject, className) {
        return _objectSpread$1(
            _objectSpread$1({}, styleObject),
            stylesheet[className]
        )
    }, elementStyle)
}
__name(createStyleObject, 'createStyleObject')
function createClassNameString(classNames) {
    return classNames.join(' ')
}
__name(createClassNameString, 'createClassNameString')
function createChildren(stylesheet, useInlineStyles) {
    var childrenCount = 0
    return function (children) {
        childrenCount += 1
        return children.map(function (child, i) {
            return createElement({
                node: child,
                stylesheet,
                useInlineStyles,
                key: 'code-segment-'.concat(childrenCount, '-').concat(i)
            })
        })
    }
}
__name(createChildren, 'createChildren')
function createElement(_ref) {
    var node = _ref.node,
        stylesheet = _ref.stylesheet,
        _ref$style = _ref.style,
        style2 = _ref$style === void 0 ? {} : _ref$style,
        useInlineStyles = _ref.useInlineStyles,
        key = _ref.key
    var properties = node.properties,
        type = node.type,
        TagName = node.tagName,
        value = node.value
    if (type === 'text') {
        return value
    } else if (TagName) {
        var childrenCreator = createChildren(stylesheet, useInlineStyles)
        var props
        if (!useInlineStyles) {
            props = _objectSpread$1(
                _objectSpread$1({}, properties),
                {},
                {
                    className: createClassNameString(properties.className)
                }
            )
        } else {
            var allStylesheetSelectors = Object.keys(stylesheet).reduce(
                function (classes, selector) {
                    selector.split('.').forEach(function (className2) {
                        if (!classes.includes(className2))
                            classes.push(className2)
                    })
                    return classes
                },
                []
            )
            var startingClassName =
                properties.className && properties.className.includes('token')
                    ? ['token']
                    : []
            var className =
                properties.className &&
                startingClassName.concat(
                    properties.className.filter(function (className2) {
                        return !allStylesheetSelectors.includes(className2)
                    })
                )
            props = _objectSpread$1(
                _objectSpread$1({}, properties),
                {},
                {
                    className: createClassNameString(className) || void 0,
                    style: createStyleObject(
                        properties.className,
                        Object.assign({}, properties.style, style2),
                        stylesheet
                    )
                }
            )
        }
        var children = childrenCreator(node.children)
        return /* @__PURE__ */ React__default.createElement(
            TagName,
            _extends(
                {
                    key
                },
                props
            ),
            children
        )
    }
}
__name(createElement, 'createElement')
const checkForListedLanguage = /* @__PURE__ */ __name(function (
    astGenerator,
    language
) {
    var langs = astGenerator.listLanguages()
    return langs.indexOf(language) !== -1
},
'checkForListedLanguage')
var _excluded = [
    'language',
    'children',
    'style',
    'customStyle',
    'codeTagProps',
    'useInlineStyles',
    'showLineNumbers',
    'showInlineLineNumbers',
    'startingLineNumber',
    'lineNumberContainerStyle',
    'lineNumberStyle',
    'wrapLines',
    'wrapLongLines',
    'lineProps',
    'renderer',
    'PreTag',
    'CodeTag',
    'code',
    'astGenerator'
]
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object)
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object)
        enumerableOnly &&
            (symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable
            })),
            keys.push.apply(keys, symbols)
    }
    return keys
}
__name(ownKeys, 'ownKeys')
function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {}
        i % 2
            ? ownKeys(Object(source), true).forEach(function (key) {
                  _defineProperty$1(target, key, source[key])
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(
                  target,
                  Object.getOwnPropertyDescriptors(source)
              )
            : ownKeys(Object(source)).forEach(function (key) {
                  Object.defineProperty(
                      target,
                      key,
                      Object.getOwnPropertyDescriptor(source, key)
                  )
              })
    }
    return target
}
__name(_objectSpread, '_objectSpread')
var newLineRegex = /\n/g
function getNewLines(str) {
    return str.match(newLineRegex)
}
__name(getNewLines, 'getNewLines')
function getAllLineNumbers(_ref) {
    var lines = _ref.lines,
        startingLineNumber = _ref.startingLineNumber,
        style2 = _ref.style
    return lines.map(function (_, i) {
        var number2 = i + startingLineNumber
        return /* @__PURE__ */ React__default.createElement(
            'span',
            {
                key: 'line-'.concat(i),
                className: 'react-syntax-highlighter-line-number',
                style: typeof style2 === 'function' ? style2(number2) : style2
            },
            ''.concat(number2, '\n')
        )
    })
}
__name(getAllLineNumbers, 'getAllLineNumbers')
function AllLineNumbers(_ref2) {
    var codeString = _ref2.codeString,
        codeStyle = _ref2.codeStyle,
        _ref2$containerStyle = _ref2.containerStyle,
        containerStyle =
            _ref2$containerStyle === void 0
                ? {
                      float: 'left',
                      paddingRight: '10px'
                  }
                : _ref2$containerStyle,
        _ref2$numberStyle = _ref2.numberStyle,
        numberStyle = _ref2$numberStyle === void 0 ? {} : _ref2$numberStyle,
        startingLineNumber = _ref2.startingLineNumber
    return /* @__PURE__ */ React__default.createElement(
        'code',
        {
            style: Object.assign({}, codeStyle, containerStyle)
        },
        getAllLineNumbers({
            lines: codeString.replace(/\n$/, '').split('\n'),
            style: numberStyle,
            startingLineNumber
        })
    )
}
__name(AllLineNumbers, 'AllLineNumbers')
function getEmWidthOfNumber(num) {
    return ''.concat(num.toString().length, '.25em')
}
__name(getEmWidthOfNumber, 'getEmWidthOfNumber')
function getInlineLineNumber(lineNumber, inlineLineNumberStyle) {
    return {
        type: 'element',
        tagName: 'span',
        properties: {
            key: 'line-number--'.concat(lineNumber),
            className: [
                'comment',
                'linenumber',
                'react-syntax-highlighter-line-number'
            ],
            style: inlineLineNumberStyle
        },
        children: [
            {
                type: 'text',
                value: lineNumber
            }
        ]
    }
}
__name(getInlineLineNumber, 'getInlineLineNumber')
function assembleLineNumberStyles(
    lineNumberStyle,
    lineNumber,
    largestLineNumber
) {
    var defaultLineNumberStyle = {
        display: 'inline-block',
        minWidth: getEmWidthOfNumber(largestLineNumber),
        paddingRight: '1em',
        textAlign: 'right',
        userSelect: 'none'
    }
    var customLineNumberStyle =
        typeof lineNumberStyle === 'function'
            ? lineNumberStyle(lineNumber)
            : lineNumberStyle
    var assembledStyle = _objectSpread(
        _objectSpread({}, defaultLineNumberStyle),
        customLineNumberStyle
    )
    return assembledStyle
}
__name(assembleLineNumberStyles, 'assembleLineNumberStyles')
function createLineElement(_ref3) {
    var children = _ref3.children,
        lineNumber = _ref3.lineNumber,
        lineNumberStyle = _ref3.lineNumberStyle,
        largestLineNumber = _ref3.largestLineNumber,
        showInlineLineNumbers = _ref3.showInlineLineNumbers,
        _ref3$lineProps = _ref3.lineProps,
        lineProps = _ref3$lineProps === void 0 ? {} : _ref3$lineProps,
        _ref3$className = _ref3.className,
        className = _ref3$className === void 0 ? [] : _ref3$className,
        showLineNumbers = _ref3.showLineNumbers,
        wrapLongLines = _ref3.wrapLongLines
    var properties =
        typeof lineProps === 'function' ? lineProps(lineNumber) : lineProps
    properties['className'] = className
    if (lineNumber && showInlineLineNumbers) {
        var inlineLineNumberStyle = assembleLineNumberStyles(
            lineNumberStyle,
            lineNumber,
            largestLineNumber
        )
        children.unshift(getInlineLineNumber(lineNumber, inlineLineNumberStyle))
    }
    if (wrapLongLines & showLineNumbers) {
        properties.style = _objectSpread(
            _objectSpread({}, properties.style),
            {},
            {
                display: 'flex'
            }
        )
    }
    return {
        type: 'element',
        tagName: 'span',
        properties,
        children
    }
}
__name(createLineElement, 'createLineElement')
function flattenCodeTree(tree) {
    var className =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : []
    var newTree =
        arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : []
    for (var i = 0; i < tree.length; i++) {
        var node = tree[i]
        if (node.type === 'text') {
            newTree.push(
                createLineElement({
                    children: [node],
                    className: _toConsumableArray(new Set(className))
                })
            )
        } else if (node.children) {
            var classNames = className.concat(node.properties.className)
            flattenCodeTree(node.children, classNames).forEach(function (i2) {
                return newTree.push(i2)
            })
        }
    }
    return newTree
}
__name(flattenCodeTree, 'flattenCodeTree')
function processLines(
    codeTree,
    wrapLines,
    lineProps,
    showLineNumbers,
    showInlineLineNumbers,
    startingLineNumber,
    largestLineNumber,
    lineNumberStyle,
    wrapLongLines
) {
    var _ref4
    var tree = flattenCodeTree(codeTree.value)
    var newTree = []
    var lastLineBreakIndex = -1
    var index = 0
    function createWrappedLine(children2, lineNumber2) {
        var className =
            arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : []
        return createLineElement({
            children: children2,
            lineNumber: lineNumber2,
            lineNumberStyle,
            largestLineNumber,
            showInlineLineNumbers,
            lineProps,
            className,
            showLineNumbers,
            wrapLongLines
        })
    }
    __name(createWrappedLine, 'createWrappedLine')
    function createUnwrappedLine(children2, lineNumber2) {
        if (showLineNumbers && lineNumber2 && showInlineLineNumbers) {
            var inlineLineNumberStyle = assembleLineNumberStyles(
                lineNumberStyle,
                lineNumber2,
                largestLineNumber
            )
            children2.unshift(
                getInlineLineNumber(lineNumber2, inlineLineNumberStyle)
            )
        }
        return children2
    }
    __name(createUnwrappedLine, 'createUnwrappedLine')
    function createLine(children2, lineNumber2) {
        var className =
            arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : []
        return wrapLines || className.length > 0
            ? createWrappedLine(children2, lineNumber2, className)
            : createUnwrappedLine(children2, lineNumber2)
    }
    __name(createLine, 'createLine')
    var _loop = /* @__PURE__ */ __name(function _loop2() {
        var node = tree[index]
        var value = node.children[0].value
        var newLines = getNewLines(value)
        if (newLines) {
            var splitValue = value.split('\n')
            splitValue.forEach(function (text, i) {
                var lineNumber2 =
                    showLineNumbers && newTree.length + startingLineNumber
                var newChild = {
                    type: 'text',
                    value: ''.concat(text, '\n')
                }
                if (i === 0) {
                    var _children = tree
                        .slice(lastLineBreakIndex + 1, index)
                        .concat(
                            createLineElement({
                                children: [newChild],
                                className: node.properties.className
                            })
                        )
                    var _line = createLine(_children, lineNumber2)
                    newTree.push(_line)
                } else if (i === splitValue.length - 1) {
                    var stringChild =
                        tree[index + 1] &&
                        tree[index + 1].children &&
                        tree[index + 1].children[0]
                    var lastLineInPreviousSpan = {
                        type: 'text',
                        value: ''.concat(text)
                    }
                    if (stringChild) {
                        var newElem = createLineElement({
                            children: [lastLineInPreviousSpan],
                            className: node.properties.className
                        })
                        tree.splice(index + 1, 0, newElem)
                    } else {
                        var _children2 = [lastLineInPreviousSpan]
                        var _line2 = createLine(
                            _children2,
                            lineNumber2,
                            node.properties.className
                        )
                        newTree.push(_line2)
                    }
                } else {
                    var _children3 = [newChild]
                    var _line3 = createLine(
                        _children3,
                        lineNumber2,
                        node.properties.className
                    )
                    newTree.push(_line3)
                }
            })
            lastLineBreakIndex = index
        }
        index++
    }, '_loop')
    while (index < tree.length) {
        _loop()
    }
    if (lastLineBreakIndex !== tree.length - 1) {
        var children = tree.slice(lastLineBreakIndex + 1, tree.length)
        if (children && children.length) {
            var lineNumber =
                showLineNumbers && newTree.length + startingLineNumber
            var line = createLine(children, lineNumber)
            newTree.push(line)
        }
    }
    return wrapLines ? newTree : (_ref4 = []).concat.apply(_ref4, newTree)
}
__name(processLines, 'processLines')
function defaultRenderer(_ref5) {
    var rows = _ref5.rows,
        stylesheet = _ref5.stylesheet,
        useInlineStyles = _ref5.useInlineStyles
    return rows.map(function (node, i) {
        return createElement({
            node,
            stylesheet,
            useInlineStyles,
            key: 'code-segement'.concat(i)
        })
    })
}
__name(defaultRenderer, 'defaultRenderer')
function isHighlightJs(astGenerator) {
    return astGenerator && typeof astGenerator.highlightAuto !== 'undefined'
}
__name(isHighlightJs, 'isHighlightJs')
function getCodeTree(_ref6) {
    var astGenerator = _ref6.astGenerator,
        language = _ref6.language,
        code = _ref6.code,
        defaultCodeValue = _ref6.defaultCodeValue
    if (isHighlightJs(astGenerator)) {
        var hasLanguage = checkForListedLanguage(astGenerator, language)
        if (language === 'text') {
            return {
                value: defaultCodeValue,
                language: 'text'
            }
        } else if (hasLanguage) {
            return astGenerator.highlight(language, code)
        } else {
            return astGenerator.highlightAuto(code)
        }
    }
    try {
        return language && language !== 'text'
            ? {
                  value: astGenerator.highlight(code, language)
              }
            : {
                  value: defaultCodeValue
              }
    } catch (e) {
        return {
            value: defaultCodeValue
        }
    }
}
__name(getCodeTree, 'getCodeTree')
function highlight$1(defaultAstGenerator, defaultStyle) {
    return /* @__PURE__ */ __name(function SyntaxHighlighter3(_ref7) {
        var language = _ref7.language,
            children = _ref7.children,
            _ref7$style = _ref7.style,
            style2 = _ref7$style === void 0 ? defaultStyle : _ref7$style,
            _ref7$customStyle = _ref7.customStyle,
            customStyle = _ref7$customStyle === void 0 ? {} : _ref7$customStyle,
            _ref7$codeTagProps = _ref7.codeTagProps,
            codeTagProps =
                _ref7$codeTagProps === void 0
                    ? {
                          className: language
                              ? 'language-'.concat(language)
                              : void 0,
                          style: _objectSpread(
                              _objectSpread(
                                  {},
                                  style2['code[class*="language-"]']
                              ),
                              style2[
                                  'code[class*="language-'.concat(
                                      language,
                                      '"]'
                                  )
                              ]
                          )
                      }
                    : _ref7$codeTagProps,
            _ref7$useInlineStyles = _ref7.useInlineStyles,
            useInlineStyles =
                _ref7$useInlineStyles === void 0 ? true : _ref7$useInlineStyles,
            _ref7$showLineNumbers = _ref7.showLineNumbers,
            showLineNumbers =
                _ref7$showLineNumbers === void 0
                    ? false
                    : _ref7$showLineNumbers,
            _ref7$showInlineLineN = _ref7.showInlineLineNumbers,
            showInlineLineNumbers =
                _ref7$showInlineLineN === void 0 ? true : _ref7$showInlineLineN,
            _ref7$startingLineNum = _ref7.startingLineNumber,
            startingLineNumber =
                _ref7$startingLineNum === void 0 ? 1 : _ref7$startingLineNum,
            lineNumberContainerStyle = _ref7.lineNumberContainerStyle,
            _ref7$lineNumberStyle = _ref7.lineNumberStyle,
            lineNumberStyle =
                _ref7$lineNumberStyle === void 0 ? {} : _ref7$lineNumberStyle,
            wrapLines = _ref7.wrapLines,
            _ref7$wrapLongLines = _ref7.wrapLongLines,
            wrapLongLines =
                _ref7$wrapLongLines === void 0 ? false : _ref7$wrapLongLines,
            _ref7$lineProps = _ref7.lineProps,
            lineProps = _ref7$lineProps === void 0 ? {} : _ref7$lineProps,
            renderer = _ref7.renderer,
            _ref7$PreTag = _ref7.PreTag,
            PreTag = _ref7$PreTag === void 0 ? 'pre' : _ref7$PreTag,
            _ref7$CodeTag = _ref7.CodeTag,
            CodeTag = _ref7$CodeTag === void 0 ? 'code' : _ref7$CodeTag,
            _ref7$code = _ref7.code,
            code =
                _ref7$code === void 0
                    ? (Array.isArray(children) ? children[0] : children) || ''
                    : _ref7$code,
            astGenerator = _ref7.astGenerator,
            rest = _objectWithoutProperties(_ref7, _excluded)
        astGenerator = astGenerator || defaultAstGenerator
        var allLineNumbers = showLineNumbers
            ? /* @__PURE__ */ React__default.createElement(AllLineNumbers, {
                  containerStyle: lineNumberContainerStyle,
                  codeStyle: codeTagProps.style || {},
                  numberStyle: lineNumberStyle,
                  startingLineNumber,
                  codeString: code
              })
            : null
        var defaultPreStyle = style2.hljs ||
            style2['pre[class*="language-"]'] || {
                backgroundColor: '#fff'
            }
        var generatorClassName = isHighlightJs(astGenerator)
            ? 'hljs'
            : 'prismjs'
        var preProps = useInlineStyles
            ? Object.assign({}, rest, {
                  style: Object.assign({}, defaultPreStyle, customStyle)
              })
            : Object.assign({}, rest, {
                  className: rest.className
                      ? ''
                            .concat(generatorClassName, ' ')
                            .concat(rest.className)
                      : generatorClassName,
                  style: Object.assign({}, customStyle)
              })
        if (wrapLongLines) {
            codeTagProps.style = _objectSpread(
                _objectSpread({}, codeTagProps.style),
                {},
                {
                    whiteSpace: 'pre-wrap'
                }
            )
        } else {
            codeTagProps.style = _objectSpread(
                _objectSpread({}, codeTagProps.style),
                {},
                {
                    whiteSpace: 'pre'
                }
            )
        }
        if (!astGenerator) {
            return /* @__PURE__ */ React__default.createElement(
                PreTag,
                preProps,
                allLineNumbers,
                /* @__PURE__ */ React__default.createElement(
                    CodeTag,
                    codeTagProps,
                    code
                )
            )
        }
        if ((wrapLines === void 0 && renderer) || wrapLongLines)
            wrapLines = true
        renderer = renderer || defaultRenderer
        var defaultCodeValue = [
            {
                type: 'text',
                value: code
            }
        ]
        var codeTree = getCodeTree({
            astGenerator,
            language,
            code,
            defaultCodeValue
        })
        if (codeTree.language === null) {
            codeTree.value = defaultCodeValue
        }
        var largestLineNumber = codeTree.value.length + startingLineNumber
        var rows = processLines(
            codeTree,
            wrapLines,
            lineProps,
            showLineNumbers,
            showInlineLineNumbers,
            startingLineNumber,
            largestLineNumber,
            lineNumberStyle,
            wrapLongLines
        )
        return /* @__PURE__ */ React__default.createElement(
            PreTag,
            preProps,
            /* @__PURE__ */ React__default.createElement(
                CodeTag,
                codeTagProps,
                !showInlineLineNumbers && allLineNumbers,
                renderer({
                    rows,
                    stylesheet: style2,
                    useInlineStyles
                })
            )
        )
    }, 'SyntaxHighlighter')
}
__name(highlight$1, 'highlight$1')
var hastscriptExports = {}
var hastscript = {
    get exports() {
        return hastscriptExports
    },
    set exports(v) {
        hastscriptExports = v
    }
}
var immutable = extend
var hasOwnProperty = Object.prototype.hasOwnProperty
function extend() {
    var target = {}
    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]
        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }
    return target
}
__name(extend, 'extend')
var schema$1 = Schema$2
var proto$1 = Schema$2.prototype
proto$1.space = null
proto$1.normal = {}
proto$1.property = {}
function Schema$2(property, normal, space2) {
    this.property = property
    this.normal = normal
    if (space2) {
        this.space = space2
    }
}
__name(Schema$2, 'Schema$2')
var xtend = immutable
var Schema$1 = schema$1
var merge_1 = merge$1
function merge$1(definitions) {
    var length = definitions.length
    var property = []
    var normal = []
    var index = -1
    var info2
    var space2
    while (++index < length) {
        info2 = definitions[index]
        property.push(info2.property)
        normal.push(info2.normal)
        space2 = info2.space
    }
    return new Schema$1(
        xtend.apply(null, property),
        xtend.apply(null, normal),
        space2
    )
}
__name(merge$1, 'merge$1')
var normalize_1 = normalize$3
function normalize$3(value) {
    return value.toLowerCase()
}
__name(normalize$3, 'normalize$3')
var info = Info$2
var proto = Info$2.prototype
proto.space = null
proto.attribute = null
proto.property = null
proto.boolean = false
proto.booleanish = false
proto.overloadedBoolean = false
proto.number = false
proto.commaSeparated = false
proto.spaceSeparated = false
proto.commaOrSpaceSeparated = false
proto.mustUseProperty = false
proto.defined = false
function Info$2(property, attribute) {
    this.property = property
    this.attribute = attribute
}
__name(Info$2, 'Info$2')
var types$3 = {}
var powers = 0
types$3.boolean = increment()
types$3.booleanish = increment()
types$3.overloadedBoolean = increment()
types$3.number = increment()
types$3.spaceSeparated = increment()
types$3.commaSeparated = increment()
types$3.commaOrSpaceSeparated = increment()
function increment() {
    return Math.pow(2, ++powers)
}
__name(increment, 'increment')
var Info$1 = info
var types$2 = types$3
var definedInfo = DefinedInfo$2
DefinedInfo$2.prototype = new Info$1()
DefinedInfo$2.prototype.defined = true
var checks = [
    'boolean',
    'booleanish',
    'overloadedBoolean',
    'number',
    'commaSeparated',
    'spaceSeparated',
    'commaOrSpaceSeparated'
]
var checksLength = checks.length
function DefinedInfo$2(property, attribute, mask, space2) {
    var index = -1
    var check
    mark(this, 'space', space2)
    Info$1.call(this, property, attribute)
    while (++index < checksLength) {
        check = checks[index]
        mark(this, check, (mask & types$2[check]) === types$2[check])
    }
}
__name(DefinedInfo$2, 'DefinedInfo$2')
function mark(values, key, value) {
    if (value) {
        values[key] = value
    }
}
__name(mark, 'mark')
var normalize$2 = normalize_1
var Schema = schema$1
var DefinedInfo$1 = definedInfo
var create_1 = create$5
function create$5(definition) {
    var space2 = definition.space
    var mustUseProperty = definition.mustUseProperty || []
    var attributes2 = definition.attributes || {}
    var props = definition.properties
    var transform = definition.transform
    var property = {}
    var normal = {}
    var prop
    var info2
    for (prop in props) {
        info2 = new DefinedInfo$1(
            prop,
            transform(attributes2, prop),
            props[prop],
            space2
        )
        if (mustUseProperty.indexOf(prop) !== -1) {
            info2.mustUseProperty = true
        }
        property[prop] = info2
        normal[normalize$2(prop)] = prop
        normal[normalize$2(info2.attribute)] = prop
    }
    return new Schema(property, normal, space2)
}
__name(create$5, 'create$5')
var create$4 = create_1
var xlink$1 = create$4({
    space: 'xlink',
    transform: xlinkTransform,
    properties: {
        xLinkActuate: null,
        xLinkArcRole: null,
        xLinkHref: null,
        xLinkRole: null,
        xLinkShow: null,
        xLinkTitle: null,
        xLinkType: null
    }
})
function xlinkTransform(_, prop) {
    return 'xlink:' + prop.slice(5).toLowerCase()
}
__name(xlinkTransform, 'xlinkTransform')
var create$3 = create_1
var xml$1 = create$3({
    space: 'xml',
    transform: xmlTransform,
    properties: {
        xmlLang: null,
        xmlBase: null,
        xmlSpace: null
    }
})
function xmlTransform(_, prop) {
    return 'xml:' + prop.slice(3).toLowerCase()
}
__name(xmlTransform, 'xmlTransform')
var caseSensitiveTransform_1 = caseSensitiveTransform$1
function caseSensitiveTransform$1(attributes2, attribute) {
    return attribute in attributes2 ? attributes2[attribute] : attribute
}
__name(caseSensitiveTransform$1, 'caseSensitiveTransform$1')
var caseSensitiveTransform = caseSensitiveTransform_1
var caseInsensitiveTransform_1 = caseInsensitiveTransform$2
function caseInsensitiveTransform$2(attributes2, property) {
    return caseSensitiveTransform(attributes2, property.toLowerCase())
}
__name(caseInsensitiveTransform$2, 'caseInsensitiveTransform$2')
var create$2 = create_1
var caseInsensitiveTransform$1 = caseInsensitiveTransform_1
var xmlns$1 = create$2({
    space: 'xmlns',
    attributes: {
        xmlnsxlink: 'xmlns:xlink'
    },
    transform: caseInsensitiveTransform$1,
    properties: {
        xmlns: null,
        xmlnsXLink: null
    }
})
var types$1 = types$3
var create$1 = create_1
var booleanish$1 = types$1.booleanish
var number$1 = types$1.number
var spaceSeparated$1 = types$1.spaceSeparated
var aria$1 = create$1({
    transform: ariaTransform,
    properties: {
        ariaActiveDescendant: null,
        ariaAtomic: booleanish$1,
        ariaAutoComplete: null,
        ariaBusy: booleanish$1,
        ariaChecked: booleanish$1,
        ariaColCount: number$1,
        ariaColIndex: number$1,
        ariaColSpan: number$1,
        ariaControls: spaceSeparated$1,
        ariaCurrent: null,
        ariaDescribedBy: spaceSeparated$1,
        ariaDetails: null,
        ariaDisabled: booleanish$1,
        ariaDropEffect: spaceSeparated$1,
        ariaErrorMessage: null,
        ariaExpanded: booleanish$1,
        ariaFlowTo: spaceSeparated$1,
        ariaGrabbed: booleanish$1,
        ariaHasPopup: null,
        ariaHidden: booleanish$1,
        ariaInvalid: null,
        ariaKeyShortcuts: null,
        ariaLabel: null,
        ariaLabelledBy: spaceSeparated$1,
        ariaLevel: number$1,
        ariaLive: null,
        ariaModal: booleanish$1,
        ariaMultiLine: booleanish$1,
        ariaMultiSelectable: booleanish$1,
        ariaOrientation: null,
        ariaOwns: spaceSeparated$1,
        ariaPlaceholder: null,
        ariaPosInSet: number$1,
        ariaPressed: booleanish$1,
        ariaReadOnly: booleanish$1,
        ariaRelevant: null,
        ariaRequired: booleanish$1,
        ariaRoleDescription: spaceSeparated$1,
        ariaRowCount: number$1,
        ariaRowIndex: number$1,
        ariaRowSpan: number$1,
        ariaSelected: booleanish$1,
        ariaSetSize: number$1,
        ariaSort: null,
        ariaValueMax: number$1,
        ariaValueMin: number$1,
        ariaValueNow: number$1,
        ariaValueText: null,
        role: null
    }
})
function ariaTransform(_, prop) {
    return prop === 'role' ? prop : 'aria-' + prop.slice(4).toLowerCase()
}
__name(ariaTransform, 'ariaTransform')
var types = types$3
var create = create_1
var caseInsensitiveTransform = caseInsensitiveTransform_1
var boolean = types.boolean
var overloadedBoolean = types.overloadedBoolean
var booleanish = types.booleanish
var number = types.number
var spaceSeparated = types.spaceSeparated
var commaSeparated = types.commaSeparated
var html$2 = create({
    space: 'html',
    attributes: {
        acceptcharset: 'accept-charset',
        classname: 'class',
        htmlfor: 'for',
        httpequiv: 'http-equiv'
    },
    transform: caseInsensitiveTransform,
    mustUseProperty: ['checked', 'multiple', 'muted', 'selected'],
    properties: {
        // Standard Properties.
        abbr: null,
        accept: commaSeparated,
        acceptCharset: spaceSeparated,
        accessKey: spaceSeparated,
        action: null,
        allow: null,
        allowFullScreen: boolean,
        allowPaymentRequest: boolean,
        allowUserMedia: boolean,
        alt: null,
        as: null,
        async: boolean,
        autoCapitalize: null,
        autoComplete: spaceSeparated,
        autoFocus: boolean,
        autoPlay: boolean,
        capture: boolean,
        charSet: null,
        checked: boolean,
        cite: null,
        className: spaceSeparated,
        cols: number,
        colSpan: null,
        content: null,
        contentEditable: booleanish,
        controls: boolean,
        controlsList: spaceSeparated,
        coords: number | commaSeparated,
        crossOrigin: null,
        data: null,
        dateTime: null,
        decoding: null,
        default: boolean,
        defer: boolean,
        dir: null,
        dirName: null,
        disabled: boolean,
        download: overloadedBoolean,
        draggable: booleanish,
        encType: null,
        enterKeyHint: null,
        form: null,
        formAction: null,
        formEncType: null,
        formMethod: null,
        formNoValidate: boolean,
        formTarget: null,
        headers: spaceSeparated,
        height: number,
        hidden: boolean,
        high: number,
        href: null,
        hrefLang: null,
        htmlFor: spaceSeparated,
        httpEquiv: spaceSeparated,
        id: null,
        imageSizes: null,
        imageSrcSet: commaSeparated,
        inputMode: null,
        integrity: null,
        is: null,
        isMap: boolean,
        itemId: null,
        itemProp: spaceSeparated,
        itemRef: spaceSeparated,
        itemScope: boolean,
        itemType: spaceSeparated,
        kind: null,
        label: null,
        lang: null,
        language: null,
        list: null,
        loading: null,
        loop: boolean,
        low: number,
        manifest: null,
        max: null,
        maxLength: number,
        media: null,
        method: null,
        min: null,
        minLength: number,
        multiple: boolean,
        muted: boolean,
        name: null,
        nonce: null,
        noModule: boolean,
        noValidate: boolean,
        onAbort: null,
        onAfterPrint: null,
        onAuxClick: null,
        onBeforePrint: null,
        onBeforeUnload: null,
        onBlur: null,
        onCancel: null,
        onCanPlay: null,
        onCanPlayThrough: null,
        onChange: null,
        onClick: null,
        onClose: null,
        onContextMenu: null,
        onCopy: null,
        onCueChange: null,
        onCut: null,
        onDblClick: null,
        onDrag: null,
        onDragEnd: null,
        onDragEnter: null,
        onDragExit: null,
        onDragLeave: null,
        onDragOver: null,
        onDragStart: null,
        onDrop: null,
        onDurationChange: null,
        onEmptied: null,
        onEnded: null,
        onError: null,
        onFocus: null,
        onFormData: null,
        onHashChange: null,
        onInput: null,
        onInvalid: null,
        onKeyDown: null,
        onKeyPress: null,
        onKeyUp: null,
        onLanguageChange: null,
        onLoad: null,
        onLoadedData: null,
        onLoadedMetadata: null,
        onLoadEnd: null,
        onLoadStart: null,
        onMessage: null,
        onMessageError: null,
        onMouseDown: null,
        onMouseEnter: null,
        onMouseLeave: null,
        onMouseMove: null,
        onMouseOut: null,
        onMouseOver: null,
        onMouseUp: null,
        onOffline: null,
        onOnline: null,
        onPageHide: null,
        onPageShow: null,
        onPaste: null,
        onPause: null,
        onPlay: null,
        onPlaying: null,
        onPopState: null,
        onProgress: null,
        onRateChange: null,
        onRejectionHandled: null,
        onReset: null,
        onResize: null,
        onScroll: null,
        onSecurityPolicyViolation: null,
        onSeeked: null,
        onSeeking: null,
        onSelect: null,
        onSlotChange: null,
        onStalled: null,
        onStorage: null,
        onSubmit: null,
        onSuspend: null,
        onTimeUpdate: null,
        onToggle: null,
        onUnhandledRejection: null,
        onUnload: null,
        onVolumeChange: null,
        onWaiting: null,
        onWheel: null,
        open: boolean,
        optimum: number,
        pattern: null,
        ping: spaceSeparated,
        placeholder: null,
        playsInline: boolean,
        poster: null,
        preload: null,
        readOnly: boolean,
        referrerPolicy: null,
        rel: spaceSeparated,
        required: boolean,
        reversed: boolean,
        rows: number,
        rowSpan: number,
        sandbox: spaceSeparated,
        scope: null,
        scoped: boolean,
        seamless: boolean,
        selected: boolean,
        shape: null,
        size: number,
        sizes: null,
        slot: null,
        span: number,
        spellCheck: booleanish,
        src: null,
        srcDoc: null,
        srcLang: null,
        srcSet: commaSeparated,
        start: number,
        step: null,
        style: null,
        tabIndex: number,
        target: null,
        title: null,
        translate: null,
        type: null,
        typeMustMatch: boolean,
        useMap: null,
        value: booleanish,
        width: number,
        wrap: null,
        // Legacy.
        // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
        align: null,
        // Several. Use CSS `text-align` instead,
        aLink: null,
        // `<body>`. Use CSS `a:active {color}` instead
        archive: spaceSeparated,
        // `<object>`. List of URIs to archives
        axis: null,
        // `<td>` and `<th>`. Use `scope` on `<th>`
        background: null,
        // `<body>`. Use CSS `background-image` instead
        bgColor: null,
        // `<body>` and table elements. Use CSS `background-color` instead
        border: number,
        // `<table>`. Use CSS `border-width` instead,
        borderColor: null,
        // `<table>`. Use CSS `border-color` instead,
        bottomMargin: number,
        // `<body>`
        cellPadding: null,
        // `<table>`
        cellSpacing: null,
        // `<table>`
        char: null,
        // Several table elements. When `align=char`, sets the character to align on
        charOff: null,
        // Several table elements. When `char`, offsets the alignment
        classId: null,
        // `<object>`
        clear: null,
        // `<br>`. Use CSS `clear` instead
        code: null,
        // `<object>`
        codeBase: null,
        // `<object>`
        codeType: null,
        // `<object>`
        color: null,
        // `<font>` and `<hr>`. Use CSS instead
        compact: boolean,
        // Lists. Use CSS to reduce space between items instead
        declare: boolean,
        // `<object>`
        event: null,
        // `<script>`
        face: null,
        // `<font>`. Use CSS instead
        frame: null,
        // `<table>`
        frameBorder: null,
        // `<iframe>`. Use CSS `border` instead
        hSpace: number,
        // `<img>` and `<object>`
        leftMargin: number,
        // `<body>`
        link: null,
        // `<body>`. Use CSS `a:link {color: *}` instead
        longDesc: null,
        // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
        lowSrc: null,
        // `<img>`. Use a `<picture>`
        marginHeight: number,
        // `<body>`
        marginWidth: number,
        // `<body>`
        noResize: boolean,
        // `<frame>`
        noHref: boolean,
        // `<area>`. Use no href instead of an explicit `nohref`
        noShade: boolean,
        // `<hr>`. Use background-color and height instead of borders
        noWrap: boolean,
        // `<td>` and `<th>`
        object: null,
        // `<applet>`
        profile: null,
        // `<head>`
        prompt: null,
        // `<isindex>`
        rev: null,
        // `<link>`
        rightMargin: number,
        // `<body>`
        rules: null,
        // `<table>`
        scheme: null,
        // `<meta>`
        scrolling: booleanish,
        // `<frame>`. Use overflow in the child context
        standby: null,
        // `<object>`
        summary: null,
        // `<table>`
        text: null,
        // `<body>`. Use CSS `color` instead
        topMargin: number,
        // `<body>`
        valueType: null,
        // `<param>`
        version: null,
        // `<html>`. Use a doctype.
        vAlign: null,
        // Several. Use CSS `vertical-align` instead
        vLink: null,
        // `<body>`. Use CSS `a:visited {color}` instead
        vSpace: number,
        // `<img>` and `<object>`
        // Non-standard Properties.
        allowTransparency: null,
        autoCorrect: null,
        autoSave: null,
        disablePictureInPicture: boolean,
        disableRemotePlayback: boolean,
        prefix: null,
        property: null,
        results: number,
        security: null,
        unselectable: null
    }
})
var merge = merge_1
var xlink = xlink$1
var xml = xml$1
var xmlns = xmlns$1
var aria = aria$1
var html$1 = html$2
var html_1$1 = merge([xml, xlink, xmlns, aria, html$1])
var normalize$1 = normalize_1
var DefinedInfo = definedInfo
var Info = info
var data = 'data'
var find_1 = find$1
var valid = /^data[-\w.:]+$/i
var dash = /-[a-z]/g
var cap = /[A-Z]/g
function find$1(schema2, value) {
    var normal = normalize$1(value)
    var prop = value
    var Type = Info
    if (normal in schema2.normal) {
        return schema2.property[schema2.normal[normal]]
    }
    if (normal.length > 4 && normal.slice(0, 4) === data && valid.test(value)) {
        if (value.charAt(4) === '-') {
            prop = datasetToProperty(value)
        } else {
            value = datasetToAttribute(value)
        }
        Type = DefinedInfo
    }
    return new Type(prop, value)
}
__name(find$1, 'find$1')
function datasetToProperty(attribute) {
    var value = attribute.slice(5).replace(dash, camelcase)
    return data + value.charAt(0).toUpperCase() + value.slice(1)
}
__name(datasetToProperty, 'datasetToProperty')
function datasetToAttribute(property) {
    var value = property.slice(4)
    if (dash.test(value)) {
        return property
    }
    value = value.replace(cap, kebab)
    if (value.charAt(0) !== '-') {
        value = '-' + value
    }
    return data + value
}
__name(datasetToAttribute, 'datasetToAttribute')
function kebab($0) {
    return '-' + $0.toLowerCase()
}
__name(kebab, 'kebab')
function camelcase($0) {
    return $0.charAt(1).toUpperCase()
}
__name(camelcase, 'camelcase')
var hastUtilParseSelector = parse$3
var search = /[#.]/g
function parse$3(selector, defaultTagName) {
    var value = selector || ''
    var name2 = defaultTagName || 'div'
    var props = {}
    var start = 0
    var subvalue
    var previous
    var match
    while (start < value.length) {
        search.lastIndex = start
        match = search.exec(value)
        subvalue = value.slice(start, match ? match.index : value.length)
        if (subvalue) {
            if (!previous) {
                name2 = subvalue
            } else if (previous === '#') {
                props.id = subvalue
            } else if (props.className) {
                props.className.push(subvalue)
            } else {
                props.className = [subvalue]
            }
            start += subvalue.length
        }
        if (match) {
            previous = match[0]
            start++
        }
    }
    return { type: 'element', tagName: name2, properties: props, children: [] }
}
__name(parse$3, 'parse$3')
var spaceSeparatedTokens = {}
spaceSeparatedTokens.parse = parse$2
spaceSeparatedTokens.stringify = stringify$2
var empty$1 = ''
var space$2 = ' '
var whiteSpace = /[ \t\n\r\f]+/g
function parse$2(value) {
    var input = String(value || empty$1).trim()
    return input === empty$1 ? [] : input.split(whiteSpace)
}
__name(parse$2, 'parse$2')
function stringify$2(values) {
    return values.join(space$2).trim()
}
__name(stringify$2, 'stringify$2')
var commaSeparatedTokens = {}
commaSeparatedTokens.parse = parse$1
commaSeparatedTokens.stringify = stringify$1
var comma = ','
var space$1 = ' '
var empty = ''
function parse$1(value) {
    var values = []
    var input = String(value || empty)
    var index = input.indexOf(comma)
    var lastIndex = 0
    var end = false
    var val
    while (!end) {
        if (index === -1) {
            index = input.length
            end = true
        }
        val = input.slice(lastIndex, index).trim()
        if (val || !end) {
            values.push(val)
        }
        lastIndex = index + 1
        index = input.indexOf(comma, lastIndex)
    }
    return values
}
__name(parse$1, 'parse$1')
function stringify$1(values, options) {
    var settings = options || {}
    var left = settings.padLeft === false ? empty : space$1
    var right = settings.padRight ? space$1 : empty
    if (values[values.length - 1] === empty) {
        values = values.concat(empty)
    }
    return values.join(right + comma + left).trim()
}
__name(stringify$1, 'stringify$1')
var find = find_1
var normalize = normalize_1
var parseSelector = hastUtilParseSelector
var spaces = spaceSeparatedTokens.parse
var commas = commaSeparatedTokens.parse
var factory_1 = factory$1
var own$2 = {}.hasOwnProperty
function factory$1(schema2, defaultTagName, caseSensitive) {
    var adjust = caseSensitive ? createAdjustMap(caseSensitive) : null
    return h2
    function h2(selector, properties) {
        var node = parseSelector(selector, defaultTagName)
        var children = Array.prototype.slice.call(arguments, 2)
        var name2 = node.tagName.toLowerCase()
        var property
        node.tagName =
            adjust && own$2.call(adjust, name2) ? adjust[name2] : name2
        if (properties && isChildren(properties, node)) {
            children.unshift(properties)
            properties = null
        }
        if (properties) {
            for (property in properties) {
                addProperty(node.properties, property, properties[property])
            }
        }
        addChild(node.children, children)
        if (node.tagName === 'template') {
            node.content = { type: 'root', children: node.children }
            node.children = []
        }
        return node
    }
    __name(h2, 'h')
    function addProperty(properties, key, value) {
        var info2
        var property
        var result
        if (value === null || value === void 0 || value !== value) {
            return
        }
        info2 = find(schema2, key)
        property = info2.property
        result = value
        if (typeof result === 'string') {
            if (info2.spaceSeparated) {
                result = spaces(result)
            } else if (info2.commaSeparated) {
                result = commas(result)
            } else if (info2.commaOrSpaceSeparated) {
                result = spaces(commas(result).join(' '))
            }
        }
        if (property === 'style' && typeof value !== 'string') {
            result = style(result)
        }
        if (property === 'className' && properties.className) {
            result = properties.className.concat(result)
        }
        properties[property] = parsePrimitives(info2, property, result)
    }
    __name(addProperty, 'addProperty')
}
__name(factory$1, 'factory$1')
function isChildren(value, node) {
    return (
        typeof value === 'string' ||
        'length' in value ||
        isNode(node.tagName, value)
    )
}
__name(isChildren, 'isChildren')
function isNode(tagName, value) {
    var type = value.type
    if (tagName === 'input' || !type || typeof type !== 'string') {
        return false
    }
    if (typeof value.children === 'object' && 'length' in value.children) {
        return true
    }
    type = type.toLowerCase()
    if (tagName === 'button') {
        return (
            type !== 'menu' &&
            type !== 'submit' &&
            type !== 'reset' &&
            type !== 'button'
        )
    }
    return 'value' in value
}
__name(isNode, 'isNode')
function addChild(nodes, value) {
    var index
    var length
    if (typeof value === 'string' || typeof value === 'number') {
        nodes.push({ type: 'text', value: String(value) })
        return
    }
    if (typeof value === 'object' && 'length' in value) {
        index = -1
        length = value.length
        while (++index < length) {
            addChild(nodes, value[index])
        }
        return
    }
    if (typeof value !== 'object' || !('type' in value)) {
        throw new Error('Expected node, nodes, or string, got `' + value + '`')
    }
    nodes.push(value)
}
__name(addChild, 'addChild')
function parsePrimitives(info2, name2, value) {
    var index
    var length
    var result
    if (typeof value !== 'object' || !('length' in value)) {
        return parsePrimitive(info2, name2, value)
    }
    length = value.length
    index = -1
    result = []
    while (++index < length) {
        result[index] = parsePrimitive(info2, name2, value[index])
    }
    return result
}
__name(parsePrimitives, 'parsePrimitives')
function parsePrimitive(info2, name2, value) {
    var result = value
    if (info2.number || info2.positiveNumber) {
        if (!isNaN(result) && result !== '') {
            result = Number(result)
        }
    } else if (info2.boolean || info2.overloadedBoolean) {
        if (
            typeof result === 'string' &&
            (result === '' || normalize(value) === normalize(name2))
        ) {
            result = true
        }
    }
    return result
}
__name(parsePrimitive, 'parsePrimitive')
function style(value) {
    var result = []
    var key
    for (key in value) {
        result.push([key, value[key]].join(': '))
    }
    return result.join('; ')
}
__name(style, 'style')
function createAdjustMap(values) {
    var length = values.length
    var index = -1
    var result = {}
    var value
    while (++index < length) {
        value = values[index]
        result[value.toLowerCase()] = value
    }
    return result
}
__name(createAdjustMap, 'createAdjustMap')
var schema = html_1$1
var factory = factory_1
var html = factory(schema, 'div')
html.displayName = 'html'
var html_1 = html
;(function (module) {
    module.exports = html_1
})(hastscript)
const AElig = 'Æ'
const AMP = '&'
const Aacute = 'Á'
const Acirc = 'Â'
const Agrave = 'À'
const Aring = 'Å'
const Atilde = 'Ã'
const Auml = 'Ä'
const COPY = '©'
const Ccedil = 'Ç'
const ETH = 'Ð'
const Eacute = 'É'
const Ecirc = 'Ê'
const Egrave = 'È'
const Euml = 'Ë'
const GT = '>'
const Iacute = 'Í'
const Icirc = 'Î'
const Igrave = 'Ì'
const Iuml = 'Ï'
const LT = '<'
const Ntilde = 'Ñ'
const Oacute = 'Ó'
const Ocirc = 'Ô'
const Ograve = 'Ò'
const Oslash = 'Ø'
const Otilde = 'Õ'
const Ouml = 'Ö'
const QUOT = '"'
const REG = '®'
const THORN = 'Þ'
const Uacute = 'Ú'
const Ucirc = 'Û'
const Ugrave = 'Ù'
const Uuml = 'Ü'
const Yacute = 'Ý'
const aacute = 'á'
const acirc = 'â'
const acute = '´'
const aelig = 'æ'
const agrave = 'à'
const amp = '&'
const aring = 'å'
const atilde = 'ã'
const auml = 'ä'
const brvbar = '¦'
const ccedil = 'ç'
const cedil = '¸'
const cent = '¢'
const copy = '©'
const curren = '¤'
const deg = '°'
const divide = '÷'
const eacute = 'é'
const ecirc = 'ê'
const egrave = 'è'
const eth = 'ð'
const euml = 'ë'
const frac12 = '½'
const frac14 = '¼'
const frac34 = '¾'
const gt = '>'
const iacute = 'í'
const icirc = 'î'
const iexcl = '¡'
const igrave = 'ì'
const iquest = '¿'
const iuml = 'ï'
const laquo = '«'
const lt = '<'
const macr = '¯'
const micro = 'µ'
const middot = '·'
const nbsp = ' '
const not = '¬'
const ntilde = 'ñ'
const oacute = 'ó'
const ocirc = 'ô'
const ograve = 'ò'
const ordf = 'ª'
const ordm = 'º'
const oslash = 'ø'
const otilde = 'õ'
const ouml = 'ö'
const para = '¶'
const plusmn = '±'
const pound = '£'
const quot = '"'
const raquo = '»'
const reg = '®'
const sect = '§'
const shy = '­'
const sup1 = '¹'
const sup2 = '²'
const sup3 = '³'
const szlig = 'ß'
const thorn = 'þ'
const times = '×'
const uacute = 'ú'
const ucirc = 'û'
const ugrave = 'ù'
const uml = '¨'
const uuml = 'ü'
const yacute = 'ý'
const yen = '¥'
const yuml = 'ÿ'
const require$$0 = {
    AElig,
    AMP,
    Aacute,
    Acirc,
    Agrave,
    Aring,
    Atilde,
    Auml,
    COPY,
    Ccedil,
    ETH,
    Eacute,
    Ecirc,
    Egrave,
    Euml,
    GT,
    Iacute,
    Icirc,
    Igrave,
    Iuml,
    LT,
    Ntilde,
    Oacute,
    Ocirc,
    Ograve,
    Oslash,
    Otilde,
    Ouml,
    QUOT,
    REG,
    THORN,
    Uacute,
    Ucirc,
    Ugrave,
    Uuml,
    Yacute,
    aacute,
    acirc,
    acute,
    aelig,
    agrave,
    amp,
    aring,
    atilde,
    auml,
    brvbar,
    ccedil,
    cedil,
    cent,
    copy,
    curren,
    deg,
    divide,
    eacute,
    ecirc,
    egrave,
    eth,
    euml,
    frac12,
    frac14,
    frac34,
    gt,
    iacute,
    icirc,
    iexcl,
    igrave,
    iquest,
    iuml,
    laquo,
    lt,
    macr,
    micro,
    middot,
    nbsp,
    not,
    ntilde,
    oacute,
    ocirc,
    ograve,
    ordf,
    ordm,
    oslash,
    otilde,
    ouml,
    para,
    plusmn,
    pound,
    quot,
    raquo,
    reg,
    sect,
    shy,
    sup1,
    sup2,
    sup3,
    szlig,
    thorn,
    times,
    uacute,
    ucirc,
    ugrave,
    uml,
    uuml,
    yacute,
    yen,
    yuml
}
const require$$1 = {
    0: '�',
    128: '€',
    130: '‚',
    131: 'ƒ',
    132: '„',
    133: '…',
    134: '†',
    135: '‡',
    136: 'ˆ',
    137: '‰',
    138: 'Š',
    139: '‹',
    140: 'Œ',
    142: 'Ž',
    145: '‘',
    146: '’',
    147: '“',
    148: '”',
    149: '•',
    150: '–',
    151: '—',
    152: '˜',
    153: '™',
    154: 'š',
    155: '›',
    156: 'œ',
    158: 'ž',
    159: 'Ÿ'
}
var isDecimal = decimal$2
function decimal$2(character) {
    var code =
        typeof character === 'string' ? character.charCodeAt(0) : character
    return code >= 48 && code <= 57
}
__name(decimal$2, 'decimal$2')
var isHexadecimal = hexadecimal$1
function hexadecimal$1(character) {
    var code =
        typeof character === 'string' ? character.charCodeAt(0) : character
    return (
        (code >= 97 && code <= 102) ||
        (code >= 65 && code <= 70) ||
        (code >= 48 && code <= 57)
    )
}
__name(hexadecimal$1, 'hexadecimal$1')
var isAlphabetical = alphabetical$1
function alphabetical$1(character) {
    var code =
        typeof character === 'string' ? character.charCodeAt(0) : character
    return (code >= 97 && code <= 122) || (code >= 65 && code <= 90)
}
__name(alphabetical$1, 'alphabetical$1')
var alphabetical = isAlphabetical
var decimal$1 = isDecimal
var isAlphanumerical = alphanumerical$1
function alphanumerical$1(character) {
    return alphabetical(character) || decimal$1(character)
}
__name(alphanumerical$1, 'alphanumerical$1')
var el
var semicolon$1 = 59
var decodeEntity_browser = decodeEntity$1
function decodeEntity$1(characters) {
    var entity = '&' + characters + ';'
    var char
    el = el || document.createElement('i')
    el.innerHTML = entity
    char = el.textContent
    if (
        char.charCodeAt(char.length - 1) === semicolon$1 &&
        characters !== 'semi'
    ) {
        return false
    }
    return char === entity ? false : char
}
__name(decodeEntity$1, 'decodeEntity$1')
var legacy = require$$0
var invalid = require$$1
var decimal = isDecimal
var hexadecimal = isHexadecimal
var alphanumerical = isAlphanumerical
var decodeEntity = decodeEntity_browser
var parseEntities_1 = parseEntities
var own$1 = {}.hasOwnProperty
var fromCharCode = String.fromCharCode
var noop = Function.prototype
var defaults = {
    warning: null,
    reference: null,
    text: null,
    warningContext: null,
    referenceContext: null,
    textContext: null,
    position: {},
    additional: null,
    attribute: false,
    nonTerminated: true
}
var tab = 9
var lineFeed = 10
var formFeed = 12
var space = 32
var ampersand = 38
var semicolon = 59
var lessThan = 60
var equalsTo = 61
var numberSign = 35
var uppercaseX = 88
var lowercaseX = 120
var replacementCharacter = 65533
var name = 'named'
var hexa = 'hexadecimal'
var deci = 'decimal'
var bases = {}
bases[hexa] = 16
bases[deci] = 10
var tests = {}
tests[name] = alphanumerical
tests[deci] = decimal
tests[hexa] = hexadecimal
var namedNotTerminated = 1
var numericNotTerminated = 2
var namedEmpty = 3
var numericEmpty = 4
var namedUnknown = 5
var numericDisallowed = 6
var numericProhibited = 7
var messages = {}
messages[namedNotTerminated] =
    'Named character references must be terminated by a semicolon'
messages[numericNotTerminated] =
    'Numeric character references must be terminated by a semicolon'
messages[namedEmpty] = 'Named character references cannot be empty'
messages[numericEmpty] = 'Numeric character references cannot be empty'
messages[namedUnknown] = 'Named character references must be known'
messages[numericDisallowed] =
    'Numeric character references cannot be disallowed'
messages[numericProhibited] =
    'Numeric character references cannot be outside the permissible Unicode range'
function parseEntities(value, options) {
    var settings = {}
    var option
    var key
    if (!options) {
        options = {}
    }
    for (key in defaults) {
        option = options[key]
        settings[key] =
            option === null || option === void 0 ? defaults[key] : option
    }
    if (settings.position.indent || settings.position.start) {
        settings.indent = settings.position.indent || []
        settings.position = settings.position.start
    }
    return parse(value, settings)
}
__name(parseEntities, 'parseEntities')
function parse(value, settings) {
    var additional = settings.additional
    var nonTerminated = settings.nonTerminated
    var handleText = settings.text
    var handleReference = settings.reference
    var handleWarning = settings.warning
    var textContext = settings.textContext
    var referenceContext = settings.referenceContext
    var warningContext = settings.warningContext
    var pos = settings.position
    var indent = settings.indent || []
    var length = value.length
    var index = 0
    var lines = -1
    var column = pos.column || 1
    var line = pos.line || 1
    var queue = ''
    var result = []
    var entityCharacters
    var namedEntity
    var terminated
    var characters
    var character
    var reference
    var following
    var warning
    var reason
    var output
    var entity
    var begin
    var start
    var type
    var test
    var prev
    var next
    var diff
    var end
    if (typeof additional === 'string') {
        additional = additional.charCodeAt(0)
    }
    prev = now()
    warning = handleWarning ? parseError : noop
    index--
    length++
    while (++index < length) {
        if (character === lineFeed) {
            column = indent[lines] || 1
        }
        character = value.charCodeAt(index)
        if (character === ampersand) {
            following = value.charCodeAt(index + 1)
            if (
                following === tab ||
                following === lineFeed ||
                following === formFeed ||
                following === space ||
                following === ampersand ||
                following === lessThan ||
                following !== following ||
                (additional && following === additional)
            ) {
                queue += fromCharCode(character)
                column++
                continue
            }
            start = index + 1
            begin = start
            end = start
            if (following === numberSign) {
                end = ++begin
                following = value.charCodeAt(end)
                if (following === uppercaseX || following === lowercaseX) {
                    type = hexa
                    end = ++begin
                } else {
                    type = deci
                }
            } else {
                type = name
            }
            entityCharacters = ''
            entity = ''
            characters = ''
            test = tests[type]
            end--
            while (++end < length) {
                following = value.charCodeAt(end)
                if (!test(following)) {
                    break
                }
                characters += fromCharCode(following)
                if (type === name && own$1.call(legacy, characters)) {
                    entityCharacters = characters
                    entity = legacy[characters]
                }
            }
            terminated = value.charCodeAt(end) === semicolon
            if (terminated) {
                end++
                namedEntity = type === name ? decodeEntity(characters) : false
                if (namedEntity) {
                    entityCharacters = characters
                    entity = namedEntity
                }
            }
            diff = 1 + end - start
            if (!terminated && !nonTerminated);
            else if (!characters) {
                if (type !== name) {
                    warning(numericEmpty, diff)
                }
            } else if (type === name) {
                if (terminated && !entity) {
                    warning(namedUnknown, 1)
                } else {
                    if (entityCharacters !== characters) {
                        end = begin + entityCharacters.length
                        diff = 1 + end - begin
                        terminated = false
                    }
                    if (!terminated) {
                        reason = entityCharacters
                            ? namedNotTerminated
                            : namedEmpty
                        if (settings.attribute) {
                            following = value.charCodeAt(end)
                            if (following === equalsTo) {
                                warning(reason, diff)
                                entity = null
                            } else if (alphanumerical(following)) {
                                entity = null
                            } else {
                                warning(reason, diff)
                            }
                        } else {
                            warning(reason, diff)
                        }
                    }
                }
                reference = entity
            } else {
                if (!terminated) {
                    warning(numericNotTerminated, diff)
                }
                reference = parseInt(characters, bases[type])
                if (prohibited(reference)) {
                    warning(numericProhibited, diff)
                    reference = fromCharCode(replacementCharacter)
                } else if (reference in invalid) {
                    warning(numericDisallowed, diff)
                    reference = invalid[reference]
                } else {
                    output = ''
                    if (disallowed(reference)) {
                        warning(numericDisallowed, diff)
                    }
                    if (reference > 65535) {
                        reference -= 65536
                        output += fromCharCode(
                            (reference >>> (10 & 1023)) | 55296
                        )
                        reference = 56320 | (reference & 1023)
                    }
                    reference = output + fromCharCode(reference)
                }
            }
            if (reference) {
                flush()
                prev = now()
                index = end - 1
                column += end - start + 1
                result.push(reference)
                next = now()
                next.offset++
                if (handleReference) {
                    handleReference.call(
                        referenceContext,
                        reference,
                        { start: prev, end: next },
                        value.slice(start - 1, end)
                    )
                }
                prev = next
            } else {
                characters = value.slice(start - 1, end)
                queue += characters
                column += characters.length
                index = end - 1
            }
        } else {
            if (character === 10) {
                line++
                lines++
                column = 0
            }
            if (character === character) {
                queue += fromCharCode(character)
                column++
            } else {
                flush()
            }
        }
    }
    return result.join('')
    function now() {
        return {
            line,
            column,
            offset: index + (pos.offset || 0)
        }
    }
    __name(now, 'now')
    function parseError(code, offset) {
        var position = now()
        position.column += offset
        position.offset += offset
        handleWarning.call(warningContext, messages[code], position, code)
    }
    __name(parseError, 'parseError')
    function flush() {
        if (queue) {
            result.push(queue)
            if (handleText) {
                handleText.call(textContext, queue, { start: prev, end: now() })
            }
            queue = ''
        }
    }
    __name(flush, 'flush')
}
__name(parse, 'parse')
function prohibited(code) {
    return (code >= 55296 && code <= 57343) || code > 1114111
}
__name(prohibited, 'prohibited')
function disallowed(code) {
    return (
        (code >= 1 && code <= 8) ||
        code === 11 ||
        (code >= 13 && code <= 31) ||
        (code >= 127 && code <= 159) ||
        (code >= 64976 && code <= 65007) ||
        (code & 65535) === 65535 ||
        (code & 65535) === 65534
    )
}
__name(disallowed, 'disallowed')
var prismCoreExports = {}
var prismCore = {
    get exports() {
        return prismCoreExports
    },
    set exports(v) {
        prismCoreExports = v
    }
}
;(function (module) {
    var _self =
        typeof window !== 'undefined'
            ? window
            : typeof WorkerGlobalScope !== 'undefined' &&
              self instanceof WorkerGlobalScope
            ? self
            : {}
    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     *
     * @license MIT <https://opensource.org/licenses/MIT>
     * @author Lea Verou <https://lea.verou.me>
     * @namespace
     * @public
     */
    var Prism2 = (function (_self2) {
        var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i
        var uniqueId = 0
        var plainTextGrammar = {}
        var _ = {
            /**
             * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
             * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
             * additional languages or plugins yourself.
             *
             * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
             *
             * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
             * empty Prism object into the global scope before loading the Prism script like this:
             *
             * ```js
             * window.Prism = window.Prism || {};
             * Prism.manual = true;
             * // add a new <script> to load Prism's script
             * ```
             *
             * @default false
             * @type {boolean}
             * @memberof Prism
             * @public
             */
            manual: _self2.Prism && _self2.Prism.manual,
            /**
             * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
             * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
             * own worker, you don't want it to do this.
             *
             * By setting this value to `true`, Prism will not add its own listeners to the worker.
             *
             * You obviously have to change this value before Prism executes. To do this, you can add an
             * empty Prism object into the global scope before loading the Prism script like this:
             *
             * ```js
             * window.Prism = window.Prism || {};
             * Prism.disableWorkerMessageHandler = true;
             * // Load Prism's script
             * ```
             *
             * @default false
             * @type {boolean}
             * @memberof Prism
             * @public
             */
            disableWorkerMessageHandler:
                _self2.Prism && _self2.Prism.disableWorkerMessageHandler,
            /**
             * A namespace for utility methods.
             *
             * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
             * change or disappear at any time.
             *
             * @namespace
             * @memberof Prism
             */
            util: {
                encode: /* @__PURE__ */ __name(function encode2(tokens) {
                    if (tokens instanceof Token) {
                        return new Token(
                            tokens.type,
                            encode2(tokens.content),
                            tokens.alias
                        )
                    } else if (Array.isArray(tokens)) {
                        return tokens.map(encode2)
                    } else {
                        return tokens
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/\u00a0/g, ' ')
                    }
                }, 'encode'),
                /**
                 * Returns the name of the type of the given value.
                 *
                 * @param {any} o
                 * @returns {string}
                 * @example
                 * type(null)      === 'Null'
                 * type(undefined) === 'Undefined'
                 * type(123)       === 'Number'
                 * type('foo')     === 'String'
                 * type(true)      === 'Boolean'
                 * type([1, 2])    === 'Array'
                 * type({})        === 'Object'
                 * type(String)    === 'Function'
                 * type(/abc+/)    === 'RegExp'
                 */
                type: function (o) {
                    return Object.prototype.toString.call(o).slice(8, -1)
                },
                /**
                 * Returns a unique number for the given object. Later calls will still return the same number.
                 *
                 * @param {Object} obj
                 * @returns {number}
                 */
                objId: function (obj) {
                    if (!obj['__id']) {
                        Object.defineProperty(obj, '__id', {
                            value: ++uniqueId
                        })
                    }
                    return obj['__id']
                },
                /**
                 * Creates a deep clone of the given object.
                 *
                 * The main intended use of this function is to clone language definitions.
                 *
                 * @param {T} o
                 * @param {Record<number, any>} [visited]
                 * @returns {T}
                 * @template T
                 */
                clone: /* @__PURE__ */ __name(function deepClone(o, visited) {
                    visited = visited || {}
                    var clone
                    var id
                    switch (_.util.type(o)) {
                        case 'Object':
                            id = _.util.objId(o)
                            if (visited[id]) {
                                return visited[id]
                            }
                            clone = /** @type {Record<string, any>} */ {}
                            visited[id] = clone
                            for (var key in o) {
                                if (o.hasOwnProperty(key)) {
                                    clone[key] = deepClone(o[key], visited)
                                }
                            }
                            return (
                                /** @type {any} */
                                clone
                            )
                        case 'Array':
                            id = _.util.objId(o)
                            if (visited[id]) {
                                return visited[id]
                            }
                            clone = []
                            visited[id] = clone
                            /** @type {Array} */
                            /** @type {any} */
                            o.forEach(function (v, i) {
                                clone[i] = deepClone(v, visited)
                            })
                            return (
                                /** @type {any} */
                                clone
                            )
                        default:
                            return o
                    }
                }, 'deepClone'),
                /**
                 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
                 *
                 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
                 *
                 * @param {Element} element
                 * @returns {string}
                 */
                getLanguage: function (element) {
                    while (element) {
                        var m = lang.exec(element.className)
                        if (m) {
                            return m[1].toLowerCase()
                        }
                        element = element.parentElement
                    }
                    return 'none'
                },
                /**
                 * Sets the Prism `language-xxxx` class of the given element.
                 *
                 * @param {Element} element
                 * @param {string} language
                 * @returns {void}
                 */
                setLanguage: function (element, language) {
                    element.className = element.className.replace(
                        RegExp(lang, 'gi'),
                        ''
                    )
                    element.classList.add('language-' + language)
                },
                /**
                 * Returns the script element that is currently executing.
                 *
                 * This does __not__ work for line script element.
                 *
                 * @returns {HTMLScriptElement | null}
                 */
                currentScript: function () {
                    if (typeof document === 'undefined') {
                        return null
                    }
                    if ('currentScript' in document && 1 < 2) {
                        return (
                            /** @type {any} */
                            document.currentScript
                        )
                    }
                    try {
                        throw new Error()
                    } catch (err) {
                        var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(
                            err.stack
                        ) || [])[1]
                        if (src) {
                            var scripts =
                                document.getElementsByTagName('script')
                            for (var i in scripts) {
                                if (scripts[i].src == src) {
                                    return scripts[i]
                                }
                            }
                        }
                        return null
                    }
                },
                /**
                 * Returns whether a given class is active for `element`.
                 *
                 * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
                 * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
                 * given class is just the given class with a `no-` prefix.
                 *
                 * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
                 * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
                 * ancestors have the given class or the negated version of it, then the default activation will be returned.
                 *
                 * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
                 * version of it, the class is considered active.
                 *
                 * @param {Element} element
                 * @param {string} className
                 * @param {boolean} [defaultActivation=false]
                 * @returns {boolean}
                 */
                isActive: function (element, className, defaultActivation) {
                    var no = 'no-' + className
                    while (element) {
                        var classList = element.classList
                        if (classList.contains(className)) {
                            return true
                        }
                        if (classList.contains(no)) {
                            return false
                        }
                        element = element.parentElement
                    }
                    return !!defaultActivation
                }
            },
            /**
             * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
             *
             * @namespace
             * @memberof Prism
             * @public
             */
            languages: {
                /**
                 * The grammar for plain, unformatted text.
                 */
                plain: plainTextGrammar,
                plaintext: plainTextGrammar,
                text: plainTextGrammar,
                txt: plainTextGrammar,
                /**
                 * Creates a deep copy of the language with the given id and appends the given tokens.
                 *
                 * If a token in `redef` also appears in the copied language, then the existing token in the copied language
                 * will be overwritten at its original position.
                 *
                 * ## Best practices
                 *
                 * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
                 * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
                 * understand the language definition because, normally, the order of tokens matters in Prism grammars.
                 *
                 * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
                 * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
                 *
                 * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
                 * @param {Grammar} redef The new tokens to append.
                 * @returns {Grammar} The new language created.
                 * @public
                 * @example
                 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
                 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
                 *     // at its original position
                 *     'comment': { ... },
                 *     // CSS doesn't have a 'color' token, so this token will be appended
                 *     'color': /\b(?:red|green|blue)\b/
                 * });
                 */
                extend: function (id, redef) {
                    var lang2 = _.util.clone(_.languages[id])
                    for (var key in redef) {
                        lang2[key] = redef[key]
                    }
                    return lang2
                },
                /**
                 * Inserts tokens _before_ another token in a language definition or any other grammar.
                 *
                 * ## Usage
                 *
                 * This helper method makes it easy to modify existing languages. For example, the CSS language definition
                 * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
                 * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
                 * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
                 * this:
                 *
                 * ```js
                 * Prism.languages.markup.style = {
                 *     // token
                 * };
                 * ```
                 *
                 * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
                 * before existing tokens. For the CSS example above, you would use it like this:
                 *
                 * ```js
                 * Prism.languages.insertBefore('markup', 'cdata', {
                 *     'style': {
                 *         // token
                 *     }
                 * });
                 * ```
                 *
                 * ## Special cases
                 *
                 * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
                 * will be ignored.
                 *
                 * This behavior can be used to insert tokens after `before`:
                 *
                 * ```js
                 * Prism.languages.insertBefore('markup', 'comment', {
                 *     'comment': Prism.languages.markup.comment,
                 *     // tokens after 'comment'
                 * });
                 * ```
                 *
                 * ## Limitations
                 *
                 * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
                 * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
                 * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
                 * deleting properties which is necessary to insert at arbitrary positions.
                 *
                 * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
                 * Instead, it will create a new object and replace all references to the target object with the new one. This
                 * can be done without temporarily deleting properties, so the iteration order is well-defined.
                 *
                 * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
                 * you hold the target object in a variable, then the value of the variable will not change.
                 *
                 * ```js
                 * var oldMarkup = Prism.languages.markup;
                 * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
                 *
                 * assert(oldMarkup !== Prism.languages.markup);
                 * assert(newMarkup === Prism.languages.markup);
                 * ```
                 *
                 * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
                 * object to be modified.
                 * @param {string} before The key to insert before.
                 * @param {Grammar} insert An object containing the key-value pairs to be inserted.
                 * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
                 * object to be modified.
                 *
                 * Defaults to `Prism.languages`.
                 * @returns {Grammar} The new grammar object.
                 * @public
                 */
                insertBefore: function (inside, before, insert, root) {
                    root = root || /** @type {any} */ _.languages
                    var grammar = root[inside]
                    var ret = {}
                    for (var token in grammar) {
                        if (grammar.hasOwnProperty(token)) {
                            if (token == before) {
                                for (var newToken in insert) {
                                    if (insert.hasOwnProperty(newToken)) {
                                        ret[newToken] = insert[newToken]
                                    }
                                }
                            }
                            if (!insert.hasOwnProperty(token)) {
                                ret[token] = grammar[token]
                            }
                        }
                    }
                    var old = root[inside]
                    root[inside] = ret
                    _.languages.DFS(_.languages, function (key, value) {
                        if (value === old && key != inside) {
                            this[key] = ret
                        }
                    })
                    return ret
                },
                // Traverse a language definition with Depth First Search
                DFS: /* @__PURE__ */ __name(function DFS(
                    o,
                    callback,
                    type,
                    visited
                ) {
                    visited = visited || {}
                    var objId = _.util.objId
                    for (var i in o) {
                        if (o.hasOwnProperty(i)) {
                            callback.call(o, i, o[i], type || i)
                            var property = o[i]
                            var propertyType = _.util.type(property)
                            if (
                                propertyType === 'Object' &&
                                !visited[objId(property)]
                            ) {
                                visited[objId(property)] = true
                                DFS(property, callback, null, visited)
                            } else if (
                                propertyType === 'Array' &&
                                !visited[objId(property)]
                            ) {
                                visited[objId(property)] = true
                                DFS(property, callback, i, visited)
                            }
                        }
                    }
                },
                'DFS')
            },
            plugins: {},
            /**
             * This is the most high-level function in Prism’s API.
             * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
             * each one of them.
             *
             * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
             *
             * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
             * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
             * @memberof Prism
             * @public
             */
            highlightAll: function (async, callback) {
                _.highlightAllUnder(document, async, callback)
            },
            /**
             * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
             * {@link Prism.highlightElement} on each one of them.
             *
             * The following hooks will be run:
             * 1. `before-highlightall`
             * 2. `before-all-elements-highlight`
             * 3. All hooks of {@link Prism.highlightElement} for each element.
             *
             * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
             * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
             * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
             * @memberof Prism
             * @public
             */
            highlightAllUnder: function (container, async, callback) {
                var env = {
                    callback,
                    container,
                    selector:
                        'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
                }
                _.hooks.run('before-highlightall', env)
                env.elements = Array.prototype.slice.apply(
                    env.container.querySelectorAll(env.selector)
                )
                _.hooks.run('before-all-elements-highlight', env)
                for (var i = 0, element; (element = env.elements[i++]); ) {
                    _.highlightElement(element, async === true, env.callback)
                }
            },
            /**
             * Highlights the code inside a single element.
             *
             * The following hooks will be run:
             * 1. `before-sanity-check`
             * 2. `before-highlight`
             * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
             * 4. `before-insert`
             * 5. `after-highlight`
             * 6. `complete`
             *
             * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
             * the element's language.
             *
             * @param {Element} element The element containing the code.
             * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
             * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
             * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
             * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
             *
             * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
             * asynchronous highlighting to work. You can build your own bundle on the
             * [Download page](https://prismjs.com/download.html).
             * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
             * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
             * @memberof Prism
             * @public
             */
            highlightElement: function (element, async, callback) {
                var language = _.util.getLanguage(element)
                var grammar = _.languages[language]
                _.util.setLanguage(element, language)
                var parent = element.parentElement
                if (parent && parent.nodeName.toLowerCase() === 'pre') {
                    _.util.setLanguage(parent, language)
                }
                var code = element.textContent
                var env = {
                    element,
                    language,
                    grammar,
                    code
                }
                function insertHighlightedCode(highlightedCode) {
                    env.highlightedCode = highlightedCode
                    _.hooks.run('before-insert', env)
                    env.element.innerHTML = env.highlightedCode
                    _.hooks.run('after-highlight', env)
                    _.hooks.run('complete', env)
                    callback && callback.call(env.element)
                }
                __name(insertHighlightedCode, 'insertHighlightedCode')
                _.hooks.run('before-sanity-check', env)
                parent = env.element.parentElement
                if (
                    parent &&
                    parent.nodeName.toLowerCase() === 'pre' &&
                    !parent.hasAttribute('tabindex')
                ) {
                    parent.setAttribute('tabindex', '0')
                }
                if (!env.code) {
                    _.hooks.run('complete', env)
                    callback && callback.call(env.element)
                    return
                }
                _.hooks.run('before-highlight', env)
                if (!env.grammar) {
                    insertHighlightedCode(_.util.encode(env.code))
                    return
                }
                if (async && _self2.Worker) {
                    var worker = new Worker(_.filename)
                    worker.onmessage = function (evt) {
                        insertHighlightedCode(evt.data)
                    }
                    worker.postMessage(
                        JSON.stringify({
                            language: env.language,
                            code: env.code,
                            immediateClose: true
                        })
                    )
                } else {
                    insertHighlightedCode(
                        _.highlight(env.code, env.grammar, env.language)
                    )
                }
            },
            /**
             * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
             * and the language definitions to use, and returns a string with the HTML produced.
             *
             * The following hooks will be run:
             * 1. `before-tokenize`
             * 2. `after-tokenize`
             * 3. `wrap`: On each {@link Token}.
             *
             * @param {string} text A string with the code to be highlighted.
             * @param {Grammar} grammar An object containing the tokens to use.
             *
             * Usually a language definition like `Prism.languages.markup`.
             * @param {string} language The name of the language definition passed to `grammar`.
             * @returns {string} The highlighted HTML.
             * @memberof Prism
             * @public
             * @example
             * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
             */
            highlight: function (text, grammar, language) {
                var env = {
                    code: text,
                    grammar,
                    language
                }
                _.hooks.run('before-tokenize', env)
                if (!env.grammar) {
                    throw new Error(
                        'The language "' + env.language + '" has no grammar.'
                    )
                }
                env.tokens = _.tokenize(env.code, env.grammar)
                _.hooks.run('after-tokenize', env)
                return Token.stringify(_.util.encode(env.tokens), env.language)
            },
            /**
             * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
             * and the language definitions to use, and returns an array with the tokenized code.
             *
             * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
             *
             * This method could be useful in other contexts as well, as a very crude parser.
             *
             * @param {string} text A string with the code to be highlighted.
             * @param {Grammar} grammar An object containing the tokens to use.
             *
             * Usually a language definition like `Prism.languages.markup`.
             * @returns {TokenStream} An array of strings and tokens, a token stream.
             * @memberof Prism
             * @public
             * @example
             * let code = `var foo = 0;`;
             * let tokens = Prism.tokenize(code, Prism.languages.javascript);
             * tokens.forEach(token => {
             *     if (token instanceof Prism.Token && token.type === 'number') {
             *         console.log(`Found numeric literal: ${token.content}`);
             *     }
             * });
             */
            tokenize: function (text, grammar) {
                var rest = grammar.rest
                if (rest) {
                    for (var token in rest) {
                        grammar[token] = rest[token]
                    }
                    delete grammar.rest
                }
                var tokenList = new LinkedList()
                addAfter(tokenList, tokenList.head, text)
                matchGrammar(text, tokenList, grammar, tokenList.head, 0)
                return toArray(tokenList)
            },
            /**
             * @namespace
             * @memberof Prism
             * @public
             */
            hooks: {
                all: {},
                /**
                 * Adds the given callback to the list of callbacks for the given hook.
                 *
                 * The callback will be invoked when the hook it is registered for is run.
                 * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
                 *
                 * One callback function can be registered to multiple hooks and the same hook multiple times.
                 *
                 * @param {string} name The name of the hook.
                 * @param {HookCallback} callback The callback function which is given environment variables.
                 * @public
                 */
                add: function (name2, callback) {
                    var hooks = _.hooks.all
                    hooks[name2] = hooks[name2] || []
                    hooks[name2].push(callback)
                },
                /**
                 * Runs a hook invoking all registered callbacks with the given environment variables.
                 *
                 * Callbacks will be invoked synchronously and in the order in which they were registered.
                 *
                 * @param {string} name The name of the hook.
                 * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
                 * @public
                 */
                run: function (name2, env) {
                    var callbacks = _.hooks.all[name2]
                    if (!callbacks || !callbacks.length) {
                        return
                    }
                    for (var i = 0, callback; (callback = callbacks[i++]); ) {
                        callback(env)
                    }
                }
            },
            Token
        }
        _self2.Prism = _
        function Token(type, content, alias2, matchedStr) {
            this.type = type
            this.content = content
            this.alias = alias2
            this.length = (matchedStr || '').length | 0
        }
        __name(Token, 'Token')
        Token.stringify = /* @__PURE__ */ __name(function stringify2(
            o,
            language
        ) {
            if (typeof o == 'string') {
                return o
            }
            if (Array.isArray(o)) {
                var s = ''
                o.forEach(function (e) {
                    s += stringify2(e, language)
                })
                return s
            }
            var env = {
                type: o.type,
                content: stringify2(o.content, language),
                tag: 'span',
                classes: ['token', o.type],
                attributes: {},
                language
            }
            var aliases = o.alias
            if (aliases) {
                if (Array.isArray(aliases)) {
                    Array.prototype.push.apply(env.classes, aliases)
                } else {
                    env.classes.push(aliases)
                }
            }
            _.hooks.run('wrap', env)
            var attributes2 = ''
            for (var name2 in env.attributes) {
                attributes2 +=
                    ' ' +
                    name2 +
                    '="' +
                    (env.attributes[name2] || '').replace(/"/g, '&quot;') +
                    '"'
            }
            return (
                '<' +
                env.tag +
                ' class="' +
                env.classes.join(' ') +
                '"' +
                attributes2 +
                '>' +
                env.content +
                '</' +
                env.tag +
                '>'
            )
        },
        'stringify')
        function matchPattern(pattern, pos, text, lookbehind) {
            pattern.lastIndex = pos
            var match = pattern.exec(text)
            if (match && lookbehind && match[1]) {
                var lookbehindLength = match[1].length
                match.index += lookbehindLength
                match[0] = match[0].slice(lookbehindLength)
            }
            return match
        }
        __name(matchPattern, 'matchPattern')
        function matchGrammar(
            text,
            tokenList,
            grammar,
            startNode,
            startPos,
            rematch
        ) {
            for (var token in grammar) {
                if (!grammar.hasOwnProperty(token) || !grammar[token]) {
                    continue
                }
                var patterns = grammar[token]
                patterns = Array.isArray(patterns) ? patterns : [patterns]
                for (var j = 0; j < patterns.length; ++j) {
                    if (rematch && rematch.cause == token + ',' + j) {
                        return
                    }
                    var patternObj = patterns[j]
                    var inside = patternObj.inside
                    var lookbehind = !!patternObj.lookbehind
                    var greedy = !!patternObj.greedy
                    var alias2 = patternObj.alias
                    if (greedy && !patternObj.pattern.global) {
                        var flags = patternObj.pattern
                            .toString()
                            .match(/[imsuy]*$/)[0]
                        patternObj.pattern = RegExp(
                            patternObj.pattern.source,
                            flags + 'g'
                        )
                    }
                    var pattern = patternObj.pattern || patternObj
                    for (
                        var currentNode = startNode.next, pos = startPos;
                        currentNode !== tokenList.tail;
                        pos += currentNode.value.length,
                            currentNode = currentNode.next
                    ) {
                        if (rematch && pos >= rematch.reach) {
                            break
                        }
                        var str = currentNode.value
                        if (tokenList.length > text.length) {
                            return
                        }
                        if (str instanceof Token) {
                            continue
                        }
                        var removeCount = 1
                        var match
                        if (greedy) {
                            match = matchPattern(pattern, pos, text, lookbehind)
                            if (!match || match.index >= text.length) {
                                break
                            }
                            var from = match.index
                            var to = match.index + match[0].length
                            var p = pos
                            p += currentNode.value.length
                            while (from >= p) {
                                currentNode = currentNode.next
                                p += currentNode.value.length
                            }
                            p -= currentNode.value.length
                            pos = p
                            if (currentNode.value instanceof Token) {
                                continue
                            }
                            for (
                                var k = currentNode;
                                k !== tokenList.tail &&
                                (p < to || typeof k.value === 'string');
                                k = k.next
                            ) {
                                removeCount++
                                p += k.value.length
                            }
                            removeCount--
                            str = text.slice(pos, p)
                            match.index -= pos
                        } else {
                            match = matchPattern(pattern, 0, str, lookbehind)
                            if (!match) {
                                continue
                            }
                        }
                        var from = match.index
                        var matchStr = match[0]
                        var before = str.slice(0, from)
                        var after = str.slice(from + matchStr.length)
                        var reach = pos + str.length
                        if (rematch && reach > rematch.reach) {
                            rematch.reach = reach
                        }
                        var removeFrom = currentNode.prev
                        if (before) {
                            removeFrom = addAfter(tokenList, removeFrom, before)
                            pos += before.length
                        }
                        removeRange(tokenList, removeFrom, removeCount)
                        var wrapped = new Token(
                            token,
                            inside ? _.tokenize(matchStr, inside) : matchStr,
                            alias2,
                            matchStr
                        )
                        currentNode = addAfter(tokenList, removeFrom, wrapped)
                        if (after) {
                            addAfter(tokenList, currentNode, after)
                        }
                        if (removeCount > 1) {
                            var nestedRematch = {
                                cause: token + ',' + j,
                                reach
                            }
                            matchGrammar(
                                text,
                                tokenList,
                                grammar,
                                currentNode.prev,
                                pos,
                                nestedRematch
                            )
                            if (
                                rematch &&
                                nestedRematch.reach > rematch.reach
                            ) {
                                rematch.reach = nestedRematch.reach
                            }
                        }
                    }
                }
            }
        }
        __name(matchGrammar, 'matchGrammar')
        function LinkedList() {
            var head = { value: null, prev: null, next: null }
            var tail = { value: null, prev: head, next: null }
            head.next = tail
            this.head = head
            this.tail = tail
            this.length = 0
        }
        __name(LinkedList, 'LinkedList')
        function addAfter(list, node, value) {
            var next = node.next
            var newNode = { value, prev: node, next }
            node.next = newNode
            next.prev = newNode
            list.length++
            return newNode
        }
        __name(addAfter, 'addAfter')
        function removeRange(list, node, count) {
            var next = node.next
            for (var i = 0; i < count && next !== list.tail; i++) {
                next = next.next
            }
            node.next = next
            next.prev = node
            list.length -= i
        }
        __name(removeRange, 'removeRange')
        function toArray(list) {
            var array = []
            var node = list.head.next
            while (node !== list.tail) {
                array.push(node.value)
                node = node.next
            }
            return array
        }
        __name(toArray, 'toArray')
        if (!_self2.document) {
            if (!_self2.addEventListener) {
                return _
            }
            if (!_.disableWorkerMessageHandler) {
                _self2.addEventListener(
                    'message',
                    function (evt) {
                        var message = JSON.parse(evt.data)
                        var lang2 = message.language
                        var code = message.code
                        var immediateClose = message.immediateClose
                        _self2.postMessage(
                            _.highlight(code, _.languages[lang2], lang2)
                        )
                        if (immediateClose) {
                            _self2.close()
                        }
                    },
                    false
                )
            }
            return _
        }
        var script = _.util.currentScript()
        if (script) {
            _.filename = script.src
            if (script.hasAttribute('data-manual')) {
                _.manual = true
            }
        }
        function highlightAutomaticallyCallback() {
            if (!_.manual) {
                _.highlightAll()
            }
        }
        __name(highlightAutomaticallyCallback, 'highlightAutomaticallyCallback')
        if (!_.manual) {
            var readyState = document.readyState
            if (
                readyState === 'loading' ||
                (readyState === 'interactive' && script && script.defer)
            ) {
                document.addEventListener(
                    'DOMContentLoaded',
                    highlightAutomaticallyCallback
                )
            } else {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(highlightAutomaticallyCallback)
                } else {
                    window.setTimeout(highlightAutomaticallyCallback, 16)
                }
            }
        }
        return _
    })(_self)
    if (module.exports) {
        module.exports = Prism2
    }
    if (typeof commonjsGlobal !== 'undefined') {
        commonjsGlobal.Prism = Prism2
    }
})(prismCore)
var clike_1 = clike$1
clike$1.displayName = 'clike'
clike$1.aliases = []
function clike$1(Prism2) {
    Prism2.languages.clike = {
        comment: [
            {
                pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
                lookbehind: true,
                greedy: true
            },
            {
                pattern: /(^|[^\\:])\/\/.*/,
                lookbehind: true,
                greedy: true
            }
        ],
        string: {
            pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            greedy: true
        },
        'class-name': {
            pattern:
                /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
            lookbehind: true,
            inside: {
                punctuation: /[.\\]/
            }
        },
        keyword:
            /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
        boolean: /\b(?:false|true)\b/,
        function: /\b\w+(?=\()/,
        number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
        operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
        punctuation: /[{}[\];(),.:]/
    }
}
__name(clike$1, 'clike$1')
var javascript_1 = javascript
javascript.displayName = 'javascript'
javascript.aliases = ['js']
function javascript(Prism2) {
    Prism2.languages.javascript = Prism2.languages.extend('clike', {
        'class-name': [
            Prism2.languages.clike['class-name'],
            {
                pattern:
                    /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
                lookbehind: true
            }
        ],
        keyword: [
            {
                pattern: /((?:^|\})\s*)catch\b/,
                lookbehind: true
            },
            {
                pattern:
                    /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
                lookbehind: true
            }
        ],
        // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
        function:
            /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        number: {
            pattern: RegExp(
                /(^|[^\w$])/.source +
                    '(?:' + // constant
                    (/NaN|Infinity/.source +
                        '|' + // binary integer
                        /0[bB][01]+(?:_[01]+)*n?/.source +
                        '|' + // octal integer
                        /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
                        '|' + // hexadecimal integer
                        /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
                        '|' + // decimal bigint
                        /\d+(?:_\d+)*n/.source +
                        '|' + // decimal number (integer or float) but no bigint
                        /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
                            .source) +
                    ')' +
                    /(?![\w$])/.source
            ),
            lookbehind: true
        },
        operator:
            /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    })
    Prism2.languages.javascript['class-name'][0].pattern =
        /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/
    Prism2.languages.insertBefore('javascript', 'keyword', {
        regex: {
            // eslint-disable-next-line regexp/no-dupe-characters-character-class
            pattern:
                /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
            lookbehind: true,
            greedy: true,
            inside: {
                'regex-source': {
                    pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                    lookbehind: true,
                    alias: 'language-regex',
                    inside: Prism2.languages.regex
                },
                'regex-delimiter': /^\/|\/$/,
                'regex-flags': /^[a-z]+$/
            }
        },
        // This must be declared before keyword because we use "function" inside the look-forward
        'function-variable': {
            pattern:
                /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
            alias: 'function'
        },
        parameter: [
            {
                pattern:
                    /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
                lookbehind: true,
                inside: Prism2.languages.javascript
            },
            {
                pattern:
                    /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
                lookbehind: true,
                inside: Prism2.languages.javascript
            },
            {
                pattern:
                    /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
                lookbehind: true,
                inside: Prism2.languages.javascript
            },
            {
                pattern:
                    /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
                lookbehind: true,
                inside: Prism2.languages.javascript
            }
        ],
        constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    })
    Prism2.languages.insertBefore('javascript', 'string', {
        hashbang: {
            pattern: /^#!.*/,
            greedy: true,
            alias: 'comment'
        },
        'template-string': {
            pattern:
                /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
            greedy: true,
            inside: {
                'template-punctuation': {
                    pattern: /^`|`$/,
                    alias: 'string'
                },
                interpolation: {
                    pattern:
                        /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                    lookbehind: true,
                    inside: {
                        'interpolation-punctuation': {
                            pattern: /^\$\{|\}$/,
                            alias: 'punctuation'
                        },
                        rest: Prism2.languages.javascript
                    }
                },
                string: /[\s\S]+/
            }
        },
        'string-property': {
            pattern:
                /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
            lookbehind: true,
            greedy: true,
            alias: 'property'
        }
    })
    Prism2.languages.insertBefore('javascript', 'operator', {
        'literal-property': {
            pattern:
                /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
            lookbehind: true,
            alias: 'property'
        }
    })
    if (Prism2.languages.markup) {
        Prism2.languages.markup.tag.addInlined('script', 'javascript')
        Prism2.languages.markup.tag.addAttribute(
            /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
                .source,
            'javascript'
        )
    }
    Prism2.languages.js = Prism2.languages.javascript
}
__name(javascript, 'javascript')
var ctx =
    typeof globalThis === 'object'
        ? globalThis
        : typeof self === 'object'
        ? self
        : typeof window === 'object'
        ? window
        : typeof commonjsGlobal === 'object'
        ? commonjsGlobal
        : {}
var restore = capture()
ctx.Prism = { manual: true, disableWorkerMessageHandler: true }
var h = hastscriptExports
var decode = parseEntities_1
var Prism = prismCoreExports
var markup = markup_1
var css = css_1
var clike = clike_1
var js = javascript_1
restore()
var own = {}.hasOwnProperty
function Refractor() {}
__name(Refractor, 'Refractor')
Refractor.prototype = Prism
var refract = new Refractor()
var core = refract
refract.highlight = highlight
refract.register = register
refract.alias = alias
refract.registered = registered
refract.listLanguages = listLanguages
register(markup)
register(css)
register(clike)
register(js)
refract.util.encode = encode
refract.Token.stringify = stringify
function register(grammar) {
    if (typeof grammar !== 'function' || !grammar.displayName) {
        throw new Error(
            'Expected `function` for `grammar`, got `' + grammar + '`'
        )
    }
    if (refract.languages[grammar.displayName] === void 0) {
        grammar(refract)
    }
}
__name(register, 'register')
function alias(name2, alias2) {
    var languages = refract.languages
    var map = name2
    var key
    var list
    var length
    var index
    if (alias2) {
        map = {}
        map[name2] = alias2
    }
    for (key in map) {
        list = map[key]
        list = typeof list === 'string' ? [list] : list
        length = list.length
        index = -1
        while (++index < length) {
            languages[list[index]] = languages[key]
        }
    }
}
__name(alias, 'alias')
function highlight(value, name2) {
    var sup = Prism.highlight
    var grammar
    if (typeof value !== 'string') {
        throw new Error('Expected `string` for `value`, got `' + value + '`')
    }
    if (refract.util.type(name2) === 'Object') {
        grammar = name2
        name2 = null
    } else {
        if (typeof name2 !== 'string') {
            throw new Error('Expected `string` for `name`, got `' + name2 + '`')
        }
        if (own.call(refract.languages, name2)) {
            grammar = refract.languages[name2]
        } else {
            throw new Error(
                'Unknown language: `' + name2 + '` is not registered'
            )
        }
    }
    return sup.call(this, value, grammar, name2)
}
__name(highlight, 'highlight')
function registered(language) {
    if (typeof language !== 'string') {
        throw new Error(
            'Expected `string` for `language`, got `' + language + '`'
        )
    }
    return own.call(refract.languages, language)
}
__name(registered, 'registered')
function listLanguages() {
    var languages = refract.languages
    var list = []
    var language
    for (language in languages) {
        if (
            own.call(languages, language) &&
            typeof languages[language] === 'object'
        ) {
            list.push(language)
        }
    }
    return list
}
__name(listLanguages, 'listLanguages')
function stringify(value, language, parent) {
    var env
    if (typeof value === 'string') {
        return { type: 'text', value }
    }
    if (refract.util.type(value) === 'Array') {
        return stringifyAll(value, language)
    }
    env = {
        type: value.type,
        content: refract.Token.stringify(value.content, language, parent),
        tag: 'span',
        classes: ['token', value.type],
        attributes: {},
        language,
        parent
    }
    if (value.alias) {
        env.classes = env.classes.concat(value.alias)
    }
    refract.hooks.run('wrap', env)
    return h(
        env.tag + '.' + env.classes.join('.'),
        attributes(env.attributes),
        env.content
    )
}
__name(stringify, 'stringify')
function stringifyAll(values, language) {
    var result = []
    var length = values.length
    var index = -1
    var value
    while (++index < length) {
        value = values[index]
        if (value !== '' && value !== null && value !== void 0) {
            result.push(value)
        }
    }
    index = -1
    length = result.length
    while (++index < length) {
        value = result[index]
        result[index] = refract.Token.stringify(value, language, result)
    }
    return result
}
__name(stringifyAll, 'stringifyAll')
function encode(tokens) {
    return tokens
}
__name(encode, 'encode')
function attributes(attrs) {
    var key
    for (key in attrs) {
        attrs[key] = decode(attrs[key])
    }
    return attrs
}
__name(attributes, 'attributes')
function capture() {
    var defined = 'Prism' in ctx
    var current = defined ? ctx.Prism : void 0
    return restore2
    function restore2() {
        if (defined) {
            ctx.Prism = current
        } else {
            delete ctx.Prism
        }
        defined = void 0
        current = void 0
    }
    __name(restore2, 'restore')
}
__name(capture, 'capture')
var SyntaxHighlighter$1 = highlight$1(core, {})
SyntaxHighlighter$1.registerLanguage = function (_, language) {
    return core.register(language)
}
SyntaxHighlighter$1.alias = function (name2, aliases) {
    return core.alias(name2, aliases)
}
const ReactSyntaxHighlighter = SyntaxHighlighter$1
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}
__name(_defineProperty, '_defineProperty')
function _slicedToArray(arr, i) {
    return (
        _arrayWithHoles(arr) ||
        _iterableToArrayLimit(arr, i) ||
        _unsupportedIterableToArray(arr, i) ||
        _nonIterableRest()
    )
}
__name(_slicedToArray, '_slicedToArray')
function _nonIterableRest() {
    throw new TypeError(
        'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    )
}
__name(_nonIterableRest, '_nonIterableRest')
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return
    if (typeof o === 'string') return _arrayLikeToArray(o, minLen)
    var n = Object.prototype.toString.call(o).slice(8, -1)
    if (n === 'Object' && o.constructor) n = o.constructor.name
    if (n === 'Map' || n === 'Set') return Array.from(o)
    if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen)
}
__name(_unsupportedIterableToArray, '_unsupportedIterableToArray')
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i]
    }
    return arr2
}
__name(_arrayLikeToArray, '_arrayLikeToArray')
function _iterableToArrayLimit(arr, i) {
    var _i =
        arr == null
            ? null
            : (typeof Symbol !== 'undefined' && arr[Symbol.iterator]) ||
              arr['@@iterator']
    if (_i == null) return
    var _arr = []
    var _n = true
    var _d = false
    var _s, _e
    try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value)
            if (i && _arr.length === i) break
        }
    } catch (err) {
        _d = true
        _e = err
    } finally {
        try {
            if (!_n && _i['return'] != null) _i['return']()
        } finally {
            if (_d) throw _e
        }
    }
    return _arr
}
__name(_iterableToArrayLimit, '_iterableToArrayLimit')
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr
}
__name(_arrayWithHoles, '_arrayWithHoles')
var navigator = window_1.navigator,
    document$1 = window_1.document,
    globalWindow = window_1.window
ReactSyntaxHighlighter.registerLanguage('jsextra', jsExtras$1)
ReactSyntaxHighlighter.registerLanguage('jsx', jsx$1)
ReactSyntaxHighlighter.registerLanguage('json', json$1)
ReactSyntaxHighlighter.registerLanguage('yml', yaml$1)
ReactSyntaxHighlighter.registerLanguage('md', markdown$1)
ReactSyntaxHighlighter.registerLanguage('bash', bash$1)
ReactSyntaxHighlighter.registerLanguage('css', css$2)
ReactSyntaxHighlighter.registerLanguage('html', markup$2)
ReactSyntaxHighlighter.registerLanguage('tsx', tsx$1)
ReactSyntaxHighlighter.registerLanguage('typescript', typescript$1)
ReactSyntaxHighlighter.registerLanguage('graphql', graphql$1)
var themedSyntax = memoizerific(2)(function (theme) {
    return Object.entries(theme.code || {}).reduce(function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            val = _ref2[1]
        return Object.assign(
            Object.assign({}, acc),
            _defineProperty({}, '* .'.concat(key), val)
        )
    }, {})
})
var copyToClipboard = createCopyToClipboardFunction()
function createCopyToClipboardFunction() {
    var _this = this
    if (
        navigator === null || navigator === void 0
            ? void 0
            : navigator.clipboard
    ) {
        return function (text) {
            return navigator.clipboard.writeText(text)
        }
    }
    return function (text) {
        return __awaiter(
            _this,
            void 0,
            void 0,
            /* @__PURE__ */ regeneratorRuntime.mark(
                /* @__PURE__ */ __name(function _callee() {
                    var tmp, focus
                    return regeneratorRuntime.wrap(
                        /* @__PURE__ */ __name(function _callee$(_context) {
                            while (1) {
                                switch ((_context.prev = _context.next)) {
                                    case 0:
                                        tmp =
                                            document$1.createElement('TEXTAREA')
                                        focus = document$1.activeElement
                                        tmp.value = text
                                        document$1.body.appendChild(tmp)
                                        tmp.select()
                                        document$1.execCommand('copy')
                                        document$1.body.removeChild(tmp)
                                        focus.focus()
                                    case 8:
                                    case 'end':
                                        return _context.stop()
                                }
                            }
                        }, '_callee$'),
                        _callee
                    )
                }, '_callee')
            )
        )
    }
}
__name(createCopyToClipboardFunction, 'createCopyToClipboardFunction')
var Wrapper = styled.div(
    function (_ref3) {
        var theme = _ref3.theme
        return {
            position: 'relative',
            overflow: 'hidden',
            color: theme.color.defaultText
        }
    },
    function (_ref4) {
        var theme = _ref4.theme,
            bordered = _ref4.bordered
        return bordered
            ? {
                  border: '1px solid '.concat(theme.appBorderColor),
                  borderRadius: theme.borderRadius,
                  background: theme.background.content
              }
            : {}
    }
)
var Scroller = styled(function (_ref5) {
    var children = _ref5.children,
        className = _ref5.className
    return React__default.createElement(
        ScrollArea,
        {
            horizontal: true,
            vertical: true,
            className
        },
        children
    )
})(
    {
        position: 'relative'
    },
    function (_ref6) {
        var theme = _ref6.theme
        return themedSyntax(theme)
    }
)
var Pre = styled.pre(function (_ref7) {
    var theme = _ref7.theme,
        padded = _ref7.padded
    return {
        display: 'flex',
        justifyContent: 'flex-start',
        margin: 0,
        padding: padded ? theme.layoutMargin : 0
    }
})
var Code = styled.div(function (_ref8) {
    var theme = _ref8.theme
    return {
        flex: 1,
        paddingLeft: 2,
        paddingRight: theme.layoutMargin,
        opacity: 1
    }
})
var SyntaxHighlighter = /* @__PURE__ */ __name(function SyntaxHighlighter2(_a) {
    var children = _a.children,
        _a$language = _a.language,
        language = _a$language === void 0 ? 'jsx' : _a$language,
        _a$copyable = _a.copyable,
        copyable = _a$copyable === void 0 ? false : _a$copyable,
        _a$bordered = _a.bordered,
        bordered = _a$bordered === void 0 ? false : _a$bordered,
        _a$padded = _a.padded,
        padded = _a$padded === void 0 ? false : _a$padded,
        _a$format = _a.format,
        format = _a$format === void 0 ? true : _a$format,
        _a$formatter = _a.formatter,
        formatter = _a$formatter === void 0 ? null : _a$formatter,
        _a$className = _a.className,
        className = _a$className === void 0 ? null : _a$className,
        _a$showLineNumbers = _a.showLineNumbers,
        showLineNumbers =
            _a$showLineNumbers === void 0 ? false : _a$showLineNumbers,
        rest = __rest(_a, [
            'children',
            'language',
            'copyable',
            'bordered',
            'padded',
            'format',
            'formatter',
            'className',
            'showLineNumbers'
        ])
    if (typeof children !== 'string' || !children.trim()) {
        return null
    }
    var highlightableCode = formatter
        ? formatter(format, children)
        : children.trim()
    var _useState = reactExports.useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        copied = _useState2[0],
        setCopied = _useState2[1]
    var onClick = reactExports.useCallback(function (e) {
        e.preventDefault()
        var selectedText = globalWindow.getSelection().toString()
        var textToCopy =
            e.type !== 'click' && selectedText
                ? selectedText
                : highlightableCode
        copyToClipboard(textToCopy)
            .then(function () {
                setCopied(true)
                globalWindow.setTimeout(function () {
                    return setCopied(false)
                }, 1500)
            })
            .catch(logger.error)
    }, [])
    return React__default.createElement(
        Wrapper,
        {
            bordered,
            padded,
            className,
            onCopyCapture: onClick
        },
        React__default.createElement(
            Scroller,
            null,
            React__default.createElement(
                ReactSyntaxHighlighter,
                Object.assign(
                    {
                        padded: padded || bordered,
                        language,
                        showLineNumbers,
                        showInlineLineNumbers: showLineNumbers,
                        useInlineStyles: false,
                        PreTag: Pre,
                        CodeTag: Code,
                        lineNumberContainerStyle: {}
                    },
                    rest
                ),
                highlightableCode
            )
        ),
        copyable
            ? React__default.createElement(ActionBar, {
                  actionItems: [
                      {
                          title: copied ? 'Copied' : 'Copy',
                          onClick
                      }
                  ]
              })
            : null
    )
}, 'SyntaxHighlighter')
export {
    SyntaxHighlighter,
    createCopyToClipboardFunction,
    SyntaxHighlighter as default
}
