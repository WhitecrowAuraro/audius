webpackJsonp([15],{108:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(321),i=r.n(n),o=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},a=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"youtube-player"},[r("iframe",{staticClass:"vimeo-player",attrs:{title:"Vimeo player",src:"https://player.vimeo.com/video/76979871",width:"100%",height:"100%",frameborder:"0",webkitallowfullscreen:"",mozallowfullscreen:"",allowfullscreen:""}})])}];o._withStripped=!0;var l={render:o,staticRenderFns:a},u=l,s=r(1),c=s(i.a,u,!1,null,null,null);c.options.__file="src/components/vimeo-player.vue",c.esModule&&Object.keys(c.esModule).some(function(e){return"default"!==e&&"__"!==e.substr(0,2)})&&console.error("named exports are not supported in *.vue files.");t.default=c.exports},321:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},i=r(0),o=r(4);t.default={created:function(){var e=this;this.subscriptions=[this.$store.watch(function(e){return e.currentMedia},function(){"vimeo"===e.currentMedia.type?e.player.loadVideo(e.currentMedia.id).then(function(){e.currentMedia.start&&e.player.setCurrentTime(e.currentMedia.start),e.player.play()}).catch(function(t){e.error("Could not load vimeo video: "+t)}):e.player&&(e.player.pause(),e.player.unload().then())}),this.$store.watch(function(e){return e.skipToTime},function(){"vimeo"===e.currentMedia.type&&e.player.setCurrentTime(e.skipToTime)}),this.$store.watch(function(e){return e.isPlaying},function(){"vimeo"===e.currentMedia.type&&e.isPlaying?e.player.play():e.player.pause()})]},beforeDestroy:function(){this.subscriptions.forEach(function(e){e()})},mounted:function(){this.initPlayer()},computed:(0,i.mapState)(["currentMedia","mute","skipToTime","isPlaying"]),methods:n({},(0,i.mapMutations)(["play","pause","setCurrentTime","videoError","error"]),(0,i.mapActions)(["nextVideo"]),{clearInterval:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){clearInterval(this.timeInterval),this.timeInterval=null}),initPlayer:function(){var e=this;this.player||(0,o.injectScript)("https://player.vimeo.com/api/player.js").then(function(){e.player=new window.Vimeo.Player(document.querySelector(".vimeo-player")),e.player.on("play",function(){e.timeInterval=setInterval(function(){e.player.getCurrentTime().then(function(t){e.setCurrentTime(t)})},1e3)}),e.player.on("pause",function(){e.clearInterval()}),e.player.on("ended",function(){e.clearInterval(),e.nextVideo()})}).catch(function(t){e.error(t)})}})}}});