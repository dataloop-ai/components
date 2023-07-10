<template>
    <div>
        <dl-switch
            v-model="isDark"
            left-label="Dark Mode"
        />
        <dl-switch
            v-model="readonly"
            left-label="readonly"
        />
        <dl-code-editor
            v-model="codeEditorValue"
            width="45vw"
            height="75vh"
            :language="language"
            :theme="theme"
            :readonly="readonly"
            :options="options"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue-demi'
import { DlCodeEditor, DlSwitch } from '../../components'
import { DlCodeEditorOptions, DlCodeEditorTheme } from '../../components/types'

export default defineComponent({
    name: 'DlCodeEditorDemo',
    components: {
        DlSwitch,
        DlCodeEditor
    },
    setup() {
        const readonly = ref(false)
        const isDark = ref(false)

        const codeEditorValue = ref(
            'import urllib3\n' +
                'urllib3.disable_warnings()\n' +
                'from base64 import b64encode\n' +
                'import os\n' +
                'import sys\n' +
                'import json\n' +
                'import getpass\n' +
                'from optparse import OptionParser\n' +
                'from datetime import datetime, timedelta\n' +
                'import time\n' +
                'from time import gmtime, strftime, strptime\n' +
                'from operator import itemgetter, attrgetter\n' +
                'from purity_fb import PurityFb, FileSystem, FileSystemSnapshot, SnapshotSuffix, rest\n' +
                '\n' +
                '# Global Variables\n' +
                "VERSION = '2.0.0'\n" +
                "HEADER = 'Pure Storage Take FlashBlade Snapshot (' + VERSION + ')'\n" +
                "BANNER = ('=' * 132)\n" +
                'DEBUG_FLAG = False\n' +
                'VERBOSE_FLAG = False\n' +
                "COOKIE = ''\n" +
                '\n' +
                'def parsecl():\n' +
                "    usage = 'usage: %prog [options]'\n" +
                "    version = '%prog ' + VERSION\n" +
                '    description = "This application has been developed using Pure Storage v1.12 RESTful Web Service interfaces. Developed and tested using Python 3.9.5 Please contact ron@purestorage.com for assistance."\n' +
                '\n' +
                '    parser = OptionParser(usage=usage, version=version, description=description)\n' +
                '\n' +
                '\n' +
                "    parser.add_option('-d', '--debug',\n" +
                "                      action = 'store_true',\n" +
                "                      dest = 'DEBUG_FLAG',\n" +
                '                      default = False,\n' +
                "                      help = 'Debug [default: %default]')\n" +
                '    \n' +
                "    parser.add_option('-f', '--filesystem',\n" +
                "                      action = 'store',\n" +
                "                      type = 'string',\n" +
                "                      dest = 'fs',\n" +
                "                      help = 'FlashBlade File System')\n" +
                '        \n' +
                "    parser.add_option('-r', '--replicant',\n" +
                "                      action = 'store',\n" +
                "                      type = 'string',\n" +
                "                      dest = 'flashBladeRep',\n" +
                "                      help = 'FlashBlade Replicant array')\n" +
                '                      \n' +
                "    parser.add_option('-s', '--server',\n" +
                "                      action = 'store',\n" +
                "                      type = 'string',\n" +
                "                      dest = 'flashBlade',\n" +
                "                      help = 'FlashBlade array')\n" +
                '    \n' +
                "    parser.add_option('-t', '--token',\n" +
                "                      action = 'store',\n" +
                "                      type = 'string',\n" +
                "                      dest = 'API_TOKEN',\n" +
                "                      help = 'Pure API Token')\n" +
                '\n' +
                "    parser.add_option('-S', '--suffix',\n" +
                "                      action = 'store',\n" +
                "                      type = 'string',\n" +
                "                      dest = 'suffix',\n" +
                "                      help = 'File system snapshot suffix')\n" +
                '\n' +
                "    parser.add_option('-v', '--verbose',\n" +
                "                      action = 'store_true',\n" +
                "                      dest = 'VERBOSE_FLAG',\n" +
                '                      default = False,\n' +
                "                      help = 'Verbose [default: %default]')\n" +
                '\n' +
                '    (options, args) = parser.parse_args()\n' +
                '\n' +
                "    '''\n" +
                '    print("Options:", options)\n' +
                '    print("Args:", args)\n' +
                "    '''\n" +
                '    \n' +
                '    return(options)\n' +
                '\n' +
                'def main():\n' +
                '    # Setup variables\n' +
                '    global DEBUG_FLAG\n' +
                '    exit_code = 0\n' +
                '\n' +
                '    # Check for command line parameters\n' +
                '    options = parsecl()\n' +
                '    API_TOKEN = options.API_TOKEN\n' +
                '    flashBlade = options.flashBlade\n' +
                '    flashBladeRep = options.flashBladeRep\n' +
                '    fs = options.fs\n' +
                '    suffix = options.suffix\n' +
                '    DEBUG_FLAG = options.DEBUG_FLAG\n' +
                '    VERBOSE_FLAG = options.VERBOSE_FLAG\n' +
                '    \n' +
                '    if DEBUG_FLAG:\n' +
                "        print('API Token:', API_TOKEN)\n" +
                "        print('FlashBlade:', flashBlade)\n" +
                "        print('Relplicant:', flashBladeRep)\n" +
                "        print('File System:', fs)\n" +
                "        print('Suffix:', suffix)\n" +
                "        print('Debug Flag:', DEBUG_FLAG)\n" +
                "        print('Verbose Flag:', VERBOSE_FLAG)\n" +
                '\n' +
                '    if flashBlade == None:\n' +
                "        sys.exit('Exiting: You must provide FlashBlade details')\n" +
                '        \n' +
                '    if API_TOKEN == None:\n' +
                "        sys.exit('Exiting: You must provide FlashBlade API Token details')\n" +
                '\n' +
                '    if fs == None:\n' +
                "        sys.exit('Exiting: You must provide FlashBlade file system')\n" +
                '\n' +
                '    print(BANNER)\n' +
                "    print(HEADER + ' - ' + flashBlade)\n" +
                "    print(strftime('%d/%m/%Y %H:%M:%S %Z', gmtime()))\n" +
                '    print(BANNER)\n' +
                '\n' +
                '    # create PurityFb object for a certain array\n' +
                '    fb = PurityFb(flashBlade)\n' +
                '    # this is required for versions before Purity//FB 2.1.3 because they only supports self-signed\n' +
                '    # certificates. in later versions, this may be unnecessary if you have imported a certificate.\n' +
                '    fb.disable_verify_ssl()\n' +
                '    \n' +
                '    try:\n' +
                '        res= fb.login(API_TOKEN)\n' +
                '    except rest.ApiException as e:\n' +
                '        print("Exception when logging in to the array: %s\\n" % e)\n' +
                '\n' +
                '    if res:\n' +
                '        try:\n' +
                '            if flashBladeRep:\n' +
                '                if suffix:\n' +
                '                  # create a snapshot with suffix and replicate to target array\n' +
                '                  res = fb.file_system_snapshots.create_file_system_snapshots(sources=[fs],\n' +
                '                                                                              suffix=SnapshotSuffix(suffix),\n' +
                '                                                                              send=True,\n' +
                '                                                                              targets=[flashBladeRep])\n' +
                '                else:\n' +
                '                  # create a snapshot without suffix and replicate to target array\n' +
                '                  res = fb.file_system_snapshots.create_file_system_snapshots(sources=[fs],\n' +
                '                                                                              send=True,\n' +
                '                                                                              targets=[flashBladeRep])\n' +
                '            else:\n' +
                '                if suffix:\n' +
                '                  # create a snapshot with suffix for the file system\n' +
                '                  res = fb.file_system_snapshots.create_file_system_snapshots(sources=[fs],\n' +
                '                                                                             suffix=SnapshotSuffix(suffix))\n' +
                '                else:\n' +
                '                  # create a snapshot without suffix for the file system\n' +
                '                  res = fb.file_system_snapshots.create_file_system_snapshots(sources=[fs])\n' +
                '                \n' +
                '            if VERBOSE_FLAG:\n' +
                '                print(res)\n' +
                '            \n' +
                "            print('Snapshot created for', fs, 'suffix', res.items[0].suffix) \n" +
                '\n' +
                '        except rest.ApiException as e:\n' +
                '            print("Exception when creating file system snapshots: %s\\n" % e)        \n' +
                '\n' +
                '    fb.logout()\n' +
                '    print(BANNER)\n' +
                "    print(strftime('%d/%m/%Y %H:%M:%S %Z', gmtime()))\n" +
                '    print(BANNER)\n' +
                '    sys.exit(exit_code)\n' +
                '\n' +
                'main()'
        )
        const language = ref('python')

        const theme = computed(() => {
            return isDark.value
                ? DlCodeEditorTheme.Dark
                : DlCodeEditorTheme.Light
        })

        const options: DlCodeEditorOptions = {
            lineNumbers: true
        }

        watch(codeEditorValue, (val) => {
            console.log('@@@', val)
        })

        return {
            codeEditorValue,
            language,
            isDark,
            theme,
            readonly,
            options
        }
    }
})
</script>

<style scoped lang="scss">
.layout-empty-state {
    display: grid;
    width: 100%;
}
</style>
