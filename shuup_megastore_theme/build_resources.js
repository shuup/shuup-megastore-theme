/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2018, Shuup Inc. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
const { getParcelBuildCommand, runBuildCommands } = require("shuup-static-build-tools");

runBuildCommands([
    getParcelBuildCommand({
        cacheDir: "shuup-megastore-theme",
        outputDir: "static/shuup_megastore_theme/css",
        outputFileName: "shuup_megastore_theme.css",
        entryFile: "static_src/less/style.less"
    }),
    getParcelBuildCommand({
        cacheDir: "shuup-megastore-theme",
        outputDir: "static/shuup_megastore_theme/js",
        outputFileName: "shuup_megastore_theme.js",
        entryFile: "static_src/js/custom.js"
    }),
]);
