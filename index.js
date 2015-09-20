var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
    include: "*",
    contentScriptFile: self.data.url("lg.js"),
    contentStyleFile: self.data.url('lg.css')
});
