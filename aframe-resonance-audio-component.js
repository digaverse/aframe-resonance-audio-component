/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "b7f357f37d77a3e6279e"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/index.js")(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/resonance-audio/build/resonance-audio.js":
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file ResonanceAudio library common utilities, mathematical constants,
 * and default values.
 * @author Andrew Allen <bitllama@google.com>
 */




/**
 * @class Utils
 * @description A set of defaults, constants and utility functions.
 */
function Utils() {};


/**
 * Default input gain (linear).
 * @type {Number}
 */
Utils.DEFAULT_SOURCE_GAIN = 1;


/**
 * Maximum outside-the-room distance to attenuate far-field listener by.
 * @type {Number}
 */
Utils.LISTENER_MAX_OUTSIDE_ROOM_DISTANCE = 1;


/**
 * Maximum outside-the-room distance to attenuate far-field sources by.
 * @type {Number}
 */
Utils.SOURCE_MAX_OUTSIDE_ROOM_DISTANCE = 1;


/**
 * Default distance from listener when setting angle.
 * @type {Number}
 */
Utils.DEFAULT_SOURCE_DISTANCE = 1;


/** @type {Float32Array} */
Utils.DEFAULT_POSITION = [0, 0, 0];


/** @type {Float32Array} */
Utils.DEFAULT_FORWARD = [0, 0, -1];


/** @type {Float32Array} */
Utils.DEFAULT_UP = [0, 1, 0];


/** @type {Float32Array} */
Utils.DEFAULT_RIGHT = [1, 0, 0];


/**
 * @type {Number}
 */
Utils.DEFAULT_SPEED_OF_SOUND = 343;


/** Rolloff models (e.g. 'logarithmic', 'linear', or 'none').
 * @type {Array}
 */
Utils.ATTENUATION_ROLLOFFS = ['logarithmic', 'linear', 'none'];


/** Default rolloff model ('logarithmic').
 * @type {string}
 */
Utils.DEFAULT_ATTENUATION_ROLLOFF = 'logarithmic';


/** @type {Number} */
Utils.DEFAULT_MIN_DISTANCE = 1;


/** @type {Number} */
Utils.DEFAULT_MAX_DISTANCE = 1000;


/**
 * The default alpha (i.e. microphone pattern).
 * @type {Number}
 */
Utils.DEFAULT_DIRECTIVITY_ALPHA = 0;


/**
 * The default pattern sharpness (i.e. pattern exponent).
 * @type {Number}
 */
Utils.DEFAULT_DIRECTIVITY_SHARPNESS = 1;


/**
 * Default azimuth (in degrees). Suitable range is 0 to 360.
 * @type {Number}
 */
Utils.DEFAULT_AZIMUTH = 0;


/**
 * Default elevation (in degres).
 * Suitable range is from -90 (below) to 90 (above).
 * @type {Number}
 */
Utils.DEFAULT_ELEVATION = 0;


/**
 * The default ambisonic order.
 * @type {Number}
 */
Utils.DEFAULT_AMBISONIC_ORDER = 1;


/**
 * The default source width.
 * @type {Number}
 */
Utils.DEFAULT_SOURCE_WIDTH = 0;


/**
 * The maximum delay (in seconds) of a single wall reflection.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_MAX_DURATION = 0.5;


/**
 * The -12dB cutoff frequency (in Hertz) for the lowpass filter applied to
 * all reflections.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_CUTOFF_FREQUENCY = 6400; // Uses -12dB cutoff.


/**
 * The default reflection coefficients (where 0 = no reflection, 1 = perfect
 * reflection, -1 = mirrored reflection (180-degrees out of phase)).
 * @type {Object}
 */
Utils.DEFAULT_REFLECTION_COEFFICIENTS = {
  left: 0, right: 0, front: 0, back: 0, down: 0, up: 0,
};


/**
 * The minimum distance we consider the listener to be to any given wall.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_MIN_DISTANCE = 1;


/**
 * Default room dimensions (in meters).
 * @type {Object}
 */
Utils.DEFAULT_ROOM_DIMENSIONS = {
  width: 0, height: 0, depth: 0,
};


/**
 * The multiplier to apply to distances from the listener to each wall.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_MULTIPLIER = 1;


/** The default bandwidth (in octaves) of the center frequencies.
 * @type {Number}
 */
Utils.DEFAULT_REVERB_BANDWIDTH = 1;


/** The default multiplier applied when computing tail lengths.
 * @type {Number}
 */
Utils.DEFAULT_REVERB_DURATION_MULTIPLIER = 1;


/**
 * The late reflections pre-delay (in milliseconds).
 * @type {Number}
 */
Utils.DEFAULT_REVERB_PREDELAY = 1.5;


/**
 * The length of the beginning of the impulse response to apply a
 * half-Hann window to.
 * @type {Number}
 */
Utils.DEFAULT_REVERB_TAIL_ONSET = 3.8;


/**
 * The default gain (linear).
 * @type {Number}
 */
Utils.DEFAULT_REVERB_GAIN = 0.01;


/**
 * The maximum impulse response length (in seconds).
 * @type {Number}
 */
Utils.DEFAULT_REVERB_MAX_DURATION = 3;


/**
 * Center frequencies of the multiband late reflections.
 * Nine bands are computed by: 31.25 * 2^(0:8).
 * @type {Array}
 */
Utils.DEFAULT_REVERB_FREQUENCY_BANDS = [
  31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000,
];


/**
 * The number of frequency bands.
 */
Utils.NUMBER_REVERB_FREQUENCY_BANDS =
  Utils.DEFAULT_REVERB_FREQUENCY_BANDS.length;


/**
 * The default multiband RT60 durations (in seconds).
 * @type {Float32Array}
 */
Utils.DEFAULT_REVERB_DURATIONS =
  new Float32Array(Utils.NUMBER_REVERB_FREQUENCY_BANDS);


/**
 * Pre-defined frequency-dependent absorption coefficients for listed materials.
 * Currently supported materials are:
 * <ul>
 * <li>'transparent'</li>
 * <li>'acoustic-ceiling-tiles'</li>
 * <li>'brick-bare'</li>
 * <li>'brick-painted'</li>
 * <li>'concrete-block-coarse'</li>
 * <li>'concrete-block-painted'</li>
 * <li>'curtain-heavy'</li>
 * <li>'fiber-glass-insulation'</li>
 * <li>'glass-thin'</li>
 * <li>'glass-thick'</li>
 * <li>'grass'</li>
 * <li>'linoleum-on-concrete'</li>
 * <li>'marble'</li>
 * <li>'metal'</li>
 * <li>'parquet-on-concrete'</li>
 * <li>'plaster-smooth'</li>
 * <li>'plywood-panel'</li>
 * <li>'polished-concrete-or-tile'</li>
 * <li>'sheetrock'</li>
 * <li>'water-or-ice-surface'</li>
 * <li>'wood-ceiling'</li>
 * <li>'wood-panel'</li>
 * <li>'uniform'</li>
 * </ul>
 * @type {Object}
 */
Utils.ROOM_MATERIAL_COEFFICIENTS = {
  'transparent':
  [1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000],
  'acoustic-ceiling-tiles':
  [0.672, 0.675, 0.700, 0.660, 0.720, 0.920, 0.880, 0.750, 1.000],
  'brick-bare':
  [0.030, 0.030, 0.030, 0.030, 0.030, 0.040, 0.050, 0.070, 0.140],
  'brick-painted':
  [0.006, 0.007, 0.010, 0.010, 0.020, 0.020, 0.020, 0.030, 0.060],
  'concrete-block-coarse':
  [0.360, 0.360, 0.360, 0.440, 0.310, 0.290, 0.390, 0.250, 0.500],
  'concrete-block-painted':
  [0.092, 0.090, 0.100, 0.050, 0.060, 0.070, 0.090, 0.080, 0.160],
  'curtain-heavy':
  [0.073, 0.106, 0.140, 0.350, 0.550, 0.720, 0.700, 0.650, 1.000],
  'fiber-glass-insulation':
  [0.193, 0.220, 0.220, 0.820, 0.990, 0.990, 0.990, 0.990, 1.000],
  'glass-thin':
  [0.180, 0.169, 0.180, 0.060, 0.040, 0.030, 0.020, 0.020, 0.040],
  'glass-thick':
  [0.350, 0.350, 0.350, 0.250, 0.180, 0.120, 0.070, 0.040, 0.080],
  'grass':
  [0.050, 0.050, 0.150, 0.250, 0.400, 0.550, 0.600, 0.600, 0.600],
  'linoleum-on-concrete':
  [0.020, 0.020, 0.020, 0.030, 0.030, 0.030, 0.030, 0.020, 0.040],
  'marble':
  [0.010, 0.010, 0.010, 0.010, 0.010, 0.010, 0.020, 0.020, 0.040],
  'metal':
  [0.030, 0.035, 0.040, 0.040, 0.050, 0.050, 0.050, 0.070, 0.090],
  'parquet-on-concrete':
  [0.028, 0.030, 0.040, 0.040, 0.070, 0.060, 0.060, 0.070, 0.140],
  'plaster-rough':
  [0.017, 0.018, 0.020, 0.030, 0.040, 0.050, 0.040, 0.030, 0.060],
  'plaster-smooth':
  [0.011, 0.012, 0.013, 0.015, 0.020, 0.030, 0.040, 0.050, 0.100],
  'plywood-panel':
  [0.400, 0.340, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
  'polished-concrete-or-tile':
  [0.008, 0.008, 0.010, 0.010, 0.015, 0.020, 0.020, 0.020, 0.040],
  'sheet-rock':
  [0.290, 0.279, 0.290, 0.100, 0.050, 0.040, 0.070, 0.090, 0.180],
  'water-or-ice-surface':
  [0.006, 0.006, 0.008, 0.008, 0.013, 0.015, 0.020, 0.025, 0.050],
  'wood-ceiling':
  [0.150, 0.147, 0.150, 0.110, 0.100, 0.070, 0.060, 0.070, 0.140],
  'wood-panel':
  [0.280, 0.280, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
  'uniform':
  [0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500],
};


/**
 * Default materials that use strings from
 * {@linkcode Utils.MATERIAL_COEFFICIENTS MATERIAL_COEFFICIENTS}
 * @type {Object}
 */
Utils.DEFAULT_ROOM_MATERIALS = {
  left: 'transparent', right: 'transparent', front: 'transparent',
  back: 'transparent', down: 'transparent', up: 'transparent',
};


/**
 * The number of bands to average over when computing reflection coefficients.
 * @type {Number}
 */
Utils.NUMBER_REFLECTION_AVERAGING_BANDS = 3;


/**
 * The starting band to average over when computing reflection coefficients.
 * @type {Number}
 */
Utils.ROOM_STARTING_AVERAGING_BAND = 4;


/**
 * The minimum threshold for room volume.
 * Room model is disabled if volume is below this value.
 * @type {Number} */
Utils.ROOM_MIN_VOLUME = 1e-4;


/**
 * Air absorption coefficients per frequency band.
 * @type {Float32Array}
 */
Utils.ROOM_AIR_ABSORPTION_COEFFICIENTS =
  [0.0006, 0.0006, 0.0007, 0.0008, 0.0010, 0.0015, 0.0026, 0.0060, 0.0207];


/**
 * A scalar correction value to ensure Sabine and Eyring produce the same RT60
 * value at the cross-over threshold.
 * @type {Number}
 */
Utils.ROOM_EYRING_CORRECTION_COEFFICIENT = 1.38;


/**
 * @type {Number}
 * @private
 */
Utils.TWO_PI = 6.28318530717959;


/**
 * @type {Number}
 * @private
 */
Utils.TWENTY_FOUR_LOG10 = 55.2620422318571;


/**
 * @type {Number}
 * @private
 */
Utils.LOG1000 = 6.90775527898214;


/**
 * @type {Number}
 * @private
 */
Utils.LOG2_DIV2 = 0.346573590279973;


/**
 * @type {Number}
 * @private
 */
Utils.DEGREES_TO_RADIANS = 0.017453292519943;


/**
 * @type {Number}
 * @private
 */
Utils.RADIANS_TO_DEGREES = 57.295779513082323;


/**
 * @type {Number}
 * @private
 */
Utils.EPSILON_FLOAT = 1e-8;


/**
 * ResonanceAudio library logging function.
 * @type {Function}
 * @param {any} Message to be printed out.
 * @private
 */
Utils.log = function() {
  window.console.log.apply(window.console, [
    '%c[ResonanceAudio]%c '
      + Array.prototype.slice.call(arguments).join(' ') + ' %c(@'
      + performance.now().toFixed(2) + 'ms)',
    'background: #BBDEFB; color: #FF5722; font-weight: 700',
    'font-weight: 400',
    'color: #AAA',
  ]);
};


/**
 * Normalize a 3-d vector.
 * @param {Float32Array} v 3-element vector.
 * @return {Float32Array} 3-element vector.
 * @private
 */
Utils.normalizeVector = function(v) {
  let n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  if (n > exports.EPSILON_FLOAT) {
    n = 1 / n;
    v[0] *= n;
    v[1] *= n;
    v[2] *= n;
  }
  return v;
};


/**
 * Cross-product between two 3-d vectors.
 * @param {Float32Array} a 3-element vector.
 * @param {Float32Array} b 3-element vector.
 * @return {Float32Array}
 * @private
 */
Utils.crossProduct = function(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
};

module.exports = Utils;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Spatially encodes input using weighted spherical harmonics.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Tables = __webpack_require__(3);
const Utils = __webpack_require__(0);


/**
 * @class Encoder
 * @description Spatially encodes input using weighted spherical harmonics.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Number} options.azimuth
 * Azimuth (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
 * @param {Number} options.elevation
 * Elevation (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_ELEVATION DEFAULT_ELEVATION}.
 * @param {Number} options.sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 */
function Encoder(context, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Encoder
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Encoder
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.ambisonicOrder == undefined) {
    options.ambisonicOrder = Utils.DEFAULT_AMBISONIC_ORDER;
  }
  if (options.azimuth == undefined) {
    options.azimuth = Utils.DEFAULT_AZIMUTH;
  }
  if (options.elevation == undefined) {
    options.elevation = Utils.DEFAULT_ELEVATION;
  }
  if (options.sourceWidth == undefined) {
    options.sourceWidth = Utils.DEFAULT_SOURCE_WIDTH;
  }

  this._context = context;

  // Create I/O nodes.
  this.input = context.createGain();
  this._channelGain = [];
  this._merger = undefined;
  this.output = context.createGain();

  // Set initial order, angle and source width.
  this.setAmbisonicOrder(options.ambisonicOrder);
  this._azimuth = options.azimuth;
  this._elevation = options.elevation;
  this.setSourceWidth(options.sourceWidth);
}

/**
 * Set the desired ambisonic order.
 * @param {Number} ambisonicOrder Desired ambisonic order.
 */
Encoder.prototype.setAmbisonicOrder = function(ambisonicOrder) {
  this._ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);

  this.input.disconnect();
  for (let i = 0; i < this._channelGain.length; i++) {
    this._channelGain[i].disconnect();
  }
  if (this._merger != undefined) {
    this._merger.disconnect();
  }
  delete this._channelGain;
  delete this._merger;

  // Create audio graph.
  let numChannels = (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);
  this._merger = this._context.createChannelMerger(numChannels);
  this._channelGain = new Array(numChannels);
  for (let i = 0; i < numChannels; i++) {
    this._channelGain[i] = this._context.createGain();
    this.input.connect(this._channelGain[i]);
    this._channelGain[i].connect(this._merger, 0, i);
  }
  this._merger.connect(this.output);
};


/**
 * Set the direction of the encoded source signal.
 * @param {Number} azimuth
 * Azimuth (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
 * @param {Number} elevation
 * Elevation (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_ELEVATION DEFAULT_ELEVATION}.
 */
Encoder.prototype.setDirection = function(azimuth, elevation) {
  // Format input direction to nearest indices.
  if (azimuth == undefined || isNaN(azimuth)) {
    azimuth = Utils.DEFAULT_AZIMUTH;
  }
  if (elevation == undefined || isNaN(elevation)) {
    elevation = Utils.DEFAULT_ELEVATION;
  }

  // Store the formatted input (for updating source width).
  this._azimuth = azimuth;
  this._elevation = elevation;

  // Format direction for index lookups.
  azimuth = Math.round(azimuth % 360);
  if (azimuth < 0) {
    azimuth += 360;
  }
  elevation = Math.round(Math.min(90, Math.max(-90, elevation))) + 90;

  // Assign gains to each output.
  this._channelGain[0].gain.value = Tables.MAX_RE_WEIGHTS[this._spreadIndex][0];
  for (let i = 1; i <= this._ambisonicOrder; i++) {
    let degreeWeight = Tables.MAX_RE_WEIGHTS[this._spreadIndex][i];
    for (let j = -i; j <= i; j++) {
      let acnChannel = (i * i) + i + j;
      let elevationIndex = i * (i + 1) / 2 + Math.abs(j) - 1;
      let val = Tables.SPHERICAL_HARMONICS[1][elevation][elevationIndex];
      if (j != 0) {
        let azimuthIndex = Tables.SPHERICAL_HARMONICS_MAX_ORDER + j - 1;
        if (j < 0) {
          azimuthIndex = Tables.SPHERICAL_HARMONICS_MAX_ORDER + j;
        }
        val *= Tables.SPHERICAL_HARMONICS[0][azimuth][azimuthIndex];
      }
      this._channelGain[acnChannel].gain.value = val * degreeWeight;
    }
  }
};


/**
 * Set the source width (in degrees). Where 0 degrees is a point source and 360
 * degrees is an omnidirectional source.
 * @param {Number} sourceWidth (in degrees).
 */
Encoder.prototype.setSourceWidth = function(sourceWidth) {
  // The MAX_RE_WEIGHTS is a 360 x (Tables.SPHERICAL_HARMONICS_MAX_ORDER+1)
  // size table.
  this._spreadIndex = Math.min(359, Math.max(0, Math.round(sourceWidth)));
  this.setDirection(this._azimuth, this._elevation);
};


/**
 * Validate the provided ambisonic order.
 * @param {Number} ambisonicOrder Desired ambisonic order.
 * @return {Number} Validated/adjusted ambisonic order.
 * @private
 */
Encoder.validateAmbisonicOrder = function(ambisonicOrder) {
  if (isNaN(ambisonicOrder) || ambisonicOrder == undefined) {
    Utils.log('Error: Invalid ambisonic order',
    options.ambisonicOrder, '\nUsing ambisonicOrder=1 instead.');
    ambisonicOrder = 1;
  } else if (ambisonicOrder < 1) {
    Utils.log('Error: Unable to render ambisonic order',
    options.ambisonicOrder, '(Min order is 1)',
    '\nUsing min order instead.');
    ambisonicOrder = 1;
  } else if (ambisonicOrder > Tables.SPHERICAL_HARMONICS_MAX_ORDER) {
    Utils.log('Error: Unable to render ambisonic order',
    options.ambisonicOrder, '(Max order is',
    Tables.SPHERICAL_HARMONICS_MAX_ORDER, ')\nUsing max order instead.');
    options.ambisonicOrder = Tables.SPHERICAL_HARMONICS_MAX_ORDER;
  }
  return ambisonicOrder;
};


module.exports = Encoder;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Listener model to spatialize sources in an environment.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const Omnitone = __webpack_require__(12);
const Encoder = __webpack_require__(1);
const Utils = __webpack_require__(0);


/**
 * @class Listener
 * @description Listener model to spatialize sources in an environment.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Float32Array} options.position
 * Initial position (in meters), where origin is the center of
 * the room. Defaults to
 * {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.forward
 * The listener's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.up
 * The listener's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 */
function Listener(context, options) {
  // Public variables.
  /**
   * Position (in meters).
   * @member {Float32Array} position
   * @memberof Listener
   * @instance
   */
  /**
   * Ambisonic (multichannel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Listener
   * @instance
   */
  /**
   * Binaurally-rendered stereo (2-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Listener
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} ambisonicOutput
   * @memberof Listener
   * @instance
   */
  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.ambisonicOrder == undefined) {
    options.ambisonicOrder = Utils.DEFAULT_AMBISONIC_ORDER;
  }
  if (options.position == undefined) {
    options.position = Utils.DEFAULT_POSITION.slice();
  }
  if (options.forward == undefined) {
    options.forward = Utils.DEFAULT_FORWARD.slice();
  }
  if (options.up == undefined) {
    options.up = Utils.DEFAULT_UP.slice();
  }

  // Member variables.
  this.position = new Float32Array(3);
  this._tempMatrix3 = new Float32Array(9);

  // Select the appropriate HRIR filters using 2-channel chunks since
  // multichannel audio is not yet supported by a majority of browsers.
  this._ambisonicOrder =
    Encoder.validateAmbisonicOrder(options.ambisonicOrder);

    // Create audio nodes.
  this._context = context;
  if (this._ambisonicOrder == 1) {
    this._renderer = Omnitone.Omnitone.createFOARenderer(context, {});
  } else if (this._ambisonicOrder > 1) {
    this._renderer = Omnitone.Omnitone.createHOARenderer(context, {
      ambisonicOrder: this._ambisonicOrder,
    });
  }

  // These nodes are created in order to safely asynchronously load Omnitone
  // while the rest of the scene is being created.
  this.input = context.createGain();
  this.output = context.createGain();
  this.ambisonicOutput = context.createGain();

  // Initialize Omnitone (async) and connect to audio graph when complete.
  let that = this;
  this._renderer.initialize().then(function() {
    // Connect pre-rotated soundfield to renderer.
    that.input.connect(that._renderer.input);

    // Connect rotated soundfield to ambisonic output.
    if (that._ambisonicOrder > 1) {
      that._renderer._hoaRotator.output.connect(that.ambisonicOutput);
    } else {
      that._renderer._foaRotator.output.connect(that.ambisonicOutput);
    }

    // Connect binaurally-rendered soundfield to binaural output.
    that._renderer.output.connect(that.output);
  });

  // Set orientation and update rotation matrix accordingly.
  this.setOrientation(options.forward[0], options.forward[1],
    options.forward[2], options.up[0], options.up[1], options.up[2]);
};


/**
 * Set the source's orientation using forward and up vectors.
 * @param {Number} forwardX
 * @param {Number} forwardY
 * @param {Number} forwardZ
 * @param {Number} upX
 * @param {Number} upY
 * @param {Number} upZ
 */
Listener.prototype.setOrientation = function(forwardX, forwardY, forwardZ,
  upX, upY, upZ) {
  let right = Utils.crossProduct([forwardX, forwardY, forwardZ],
    [upX, upY, upZ]);
  this._tempMatrix3[0] = right[0];
  this._tempMatrix3[1] = right[1];
  this._tempMatrix3[2] = right[2];
  this._tempMatrix3[3] = upX;
  this._tempMatrix3[4] = upY;
  this._tempMatrix3[5] = upZ;
  this._tempMatrix3[6] = forwardX;
  this._tempMatrix3[7] = forwardY;
  this._tempMatrix3[8] = forwardZ;
  this._renderer.setRotationMatrix3(this._tempMatrix3);
};


/**
 * Set the listener's position and orientation using a Three.js Matrix4 object.
 * @param {Object} matrix4
 * The Three.js Matrix4 object representing the listener's world transform.
 */
Listener.prototype.setFromMatrix = function(matrix4) {
  // Update ambisonic rotation matrix internally.
  this._renderer.setRotationMatrix4(matrix4.elements);

  // Extract position from matrix.
  this.position[0] = matrix4.elements[12];
  this.position[1] = matrix4.elements[13];
  this.position[2] = matrix4.elements[14];
};


module.exports = Listener;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Pre-computed lookup tables for encoding ambisonic sources.
 * @author Andrew Allen <bitllama@google.com>
 */




/**
 * Pre-computed Spherical Harmonics Coefficients.
 *
 * This function generates an efficient lookup table of SH coefficients. It
 * exploits the way SHs are generated (i.e. Ylm = Nlm * Plm * Em). Since Nlm
 * & Plm coefficients only depend on theta, and Em only depends on phi, we
 * can separate the equation along these lines. Em does not depend on
 * degree, so we only need to compute (2 * l) per azimuth Em total and
 * Nlm * Plm is symmetrical across indexes, so only positive indexes are
 * computed ((l + 1) * (l + 2) / 2 - 1) per elevation.
 * @type {Float32Array}
 */
exports.SPHERICAL_HARMONICS =
[
  [
    [0.000000, 0.000000, 0.000000, 1.000000, 1.000000, 1.000000],
    [0.052336, 0.034899, 0.017452, 0.999848, 0.999391, 0.998630],
    [0.104528, 0.069756, 0.034899, 0.999391, 0.997564, 0.994522],
    [0.156434, 0.104528, 0.052336, 0.998630, 0.994522, 0.987688],
    [0.207912, 0.139173, 0.069756, 0.997564, 0.990268, 0.978148],
    [0.258819, 0.173648, 0.087156, 0.996195, 0.984808, 0.965926],
    [0.309017, 0.207912, 0.104528, 0.994522, 0.978148, 0.951057],
    [0.358368, 0.241922, 0.121869, 0.992546, 0.970296, 0.933580],
    [0.406737, 0.275637, 0.139173, 0.990268, 0.961262, 0.913545],
    [0.453990, 0.309017, 0.156434, 0.987688, 0.951057, 0.891007],
    [0.500000, 0.342020, 0.173648, 0.984808, 0.939693, 0.866025],
    [0.544639, 0.374607, 0.190809, 0.981627, 0.927184, 0.838671],
    [0.587785, 0.406737, 0.207912, 0.978148, 0.913545, 0.809017],
    [0.629320, 0.438371, 0.224951, 0.974370, 0.898794, 0.777146],
    [0.669131, 0.469472, 0.241922, 0.970296, 0.882948, 0.743145],
    [0.707107, 0.500000, 0.258819, 0.965926, 0.866025, 0.707107],
    [0.743145, 0.529919, 0.275637, 0.961262, 0.848048, 0.669131],
    [0.777146, 0.559193, 0.292372, 0.956305, 0.829038, 0.629320],
    [0.809017, 0.587785, 0.309017, 0.951057, 0.809017, 0.587785],
    [0.838671, 0.615661, 0.325568, 0.945519, 0.788011, 0.544639],
    [0.866025, 0.642788, 0.342020, 0.939693, 0.766044, 0.500000],
    [0.891007, 0.669131, 0.358368, 0.933580, 0.743145, 0.453990],
    [0.913545, 0.694658, 0.374607, 0.927184, 0.719340, 0.406737],
    [0.933580, 0.719340, 0.390731, 0.920505, 0.694658, 0.358368],
    [0.951057, 0.743145, 0.406737, 0.913545, 0.669131, 0.309017],
    [0.965926, 0.766044, 0.422618, 0.906308, 0.642788, 0.258819],
    [0.978148, 0.788011, 0.438371, 0.898794, 0.615661, 0.207912],
    [0.987688, 0.809017, 0.453990, 0.891007, 0.587785, 0.156434],
    [0.994522, 0.829038, 0.469472, 0.882948, 0.559193, 0.104528],
    [0.998630, 0.848048, 0.484810, 0.874620, 0.529919, 0.052336],
    [1.000000, 0.866025, 0.500000, 0.866025, 0.500000, 0.000000],
    [0.998630, 0.882948, 0.515038, 0.857167, 0.469472, -0.052336],
    [0.994522, 0.898794, 0.529919, 0.848048, 0.438371, -0.104528],
    [0.987688, 0.913545, 0.544639, 0.838671, 0.406737, -0.156434],
    [0.978148, 0.927184, 0.559193, 0.829038, 0.374607, -0.207912],
    [0.965926, 0.939693, 0.573576, 0.819152, 0.342020, -0.258819],
    [0.951057, 0.951057, 0.587785, 0.809017, 0.309017, -0.309017],
    [0.933580, 0.961262, 0.601815, 0.798636, 0.275637, -0.358368],
    [0.913545, 0.970296, 0.615661, 0.788011, 0.241922, -0.406737],
    [0.891007, 0.978148, 0.629320, 0.777146, 0.207912, -0.453990],
    [0.866025, 0.984808, 0.642788, 0.766044, 0.173648, -0.500000],
    [0.838671, 0.990268, 0.656059, 0.754710, 0.139173, -0.544639],
    [0.809017, 0.994522, 0.669131, 0.743145, 0.104528, -0.587785],
    [0.777146, 0.997564, 0.681998, 0.731354, 0.069756, -0.629320],
    [0.743145, 0.999391, 0.694658, 0.719340, 0.034899, -0.669131],
    [0.707107, 1.000000, 0.707107, 0.707107, 0.000000, -0.707107],
    [0.669131, 0.999391, 0.719340, 0.694658, -0.034899, -0.743145],
    [0.629320, 0.997564, 0.731354, 0.681998, -0.069756, -0.777146],
    [0.587785, 0.994522, 0.743145, 0.669131, -0.104528, -0.809017],
    [0.544639, 0.990268, 0.754710, 0.656059, -0.139173, -0.838671],
    [0.500000, 0.984808, 0.766044, 0.642788, -0.173648, -0.866025],
    [0.453990, 0.978148, 0.777146, 0.629320, -0.207912, -0.891007],
    [0.406737, 0.970296, 0.788011, 0.615661, -0.241922, -0.913545],
    [0.358368, 0.961262, 0.798636, 0.601815, -0.275637, -0.933580],
    [0.309017, 0.951057, 0.809017, 0.587785, -0.309017, -0.951057],
    [0.258819, 0.939693, 0.819152, 0.573576, -0.342020, -0.965926],
    [0.207912, 0.927184, 0.829038, 0.559193, -0.374607, -0.978148],
    [0.156434, 0.913545, 0.838671, 0.544639, -0.406737, -0.987688],
    [0.104528, 0.898794, 0.848048, 0.529919, -0.438371, -0.994522],
    [0.052336, 0.882948, 0.857167, 0.515038, -0.469472, -0.998630],
    [0.000000, 0.866025, 0.866025, 0.500000, -0.500000, -1.000000],
    [-0.052336, 0.848048, 0.874620, 0.484810, -0.529919, -0.998630],
    [-0.104528, 0.829038, 0.882948, 0.469472, -0.559193, -0.994522],
    [-0.156434, 0.809017, 0.891007, 0.453990, -0.587785, -0.987688],
    [-0.207912, 0.788011, 0.898794, 0.438371, -0.615661, -0.978148],
    [-0.258819, 0.766044, 0.906308, 0.422618, -0.642788, -0.965926],
    [-0.309017, 0.743145, 0.913545, 0.406737, -0.669131, -0.951057],
    [-0.358368, 0.719340, 0.920505, 0.390731, -0.694658, -0.933580],
    [-0.406737, 0.694658, 0.927184, 0.374607, -0.719340, -0.913545],
    [-0.453990, 0.669131, 0.933580, 0.358368, -0.743145, -0.891007],
    [-0.500000, 0.642788, 0.939693, 0.342020, -0.766044, -0.866025],
    [-0.544639, 0.615661, 0.945519, 0.325568, -0.788011, -0.838671],
    [-0.587785, 0.587785, 0.951057, 0.309017, -0.809017, -0.809017],
    [-0.629320, 0.559193, 0.956305, 0.292372, -0.829038, -0.777146],
    [-0.669131, 0.529919, 0.961262, 0.275637, -0.848048, -0.743145],
    [-0.707107, 0.500000, 0.965926, 0.258819, -0.866025, -0.707107],
    [-0.743145, 0.469472, 0.970296, 0.241922, -0.882948, -0.669131],
    [-0.777146, 0.438371, 0.974370, 0.224951, -0.898794, -0.629320],
    [-0.809017, 0.406737, 0.978148, 0.207912, -0.913545, -0.587785],
    [-0.838671, 0.374607, 0.981627, 0.190809, -0.927184, -0.544639],
    [-0.866025, 0.342020, 0.984808, 0.173648, -0.939693, -0.500000],
    [-0.891007, 0.309017, 0.987688, 0.156434, -0.951057, -0.453990],
    [-0.913545, 0.275637, 0.990268, 0.139173, -0.961262, -0.406737],
    [-0.933580, 0.241922, 0.992546, 0.121869, -0.970296, -0.358368],
    [-0.951057, 0.207912, 0.994522, 0.104528, -0.978148, -0.309017],
    [-0.965926, 0.173648, 0.996195, 0.087156, -0.984808, -0.258819],
    [-0.978148, 0.139173, 0.997564, 0.069756, -0.990268, -0.207912],
    [-0.987688, 0.104528, 0.998630, 0.052336, -0.994522, -0.156434],
    [-0.994522, 0.069756, 0.999391, 0.034899, -0.997564, -0.104528],
    [-0.998630, 0.034899, 0.999848, 0.017452, -0.999391, -0.052336],
    [-1.000000, 0.000000, 1.000000, 0.000000, -1.000000, -0.000000],
    [-0.998630, -0.034899, 0.999848, -0.017452, -0.999391, 0.052336],
    [-0.994522, -0.069756, 0.999391, -0.034899, -0.997564, 0.104528],
    [-0.987688, -0.104528, 0.998630, -0.052336, -0.994522, 0.156434],
    [-0.978148, -0.139173, 0.997564, -0.069756, -0.990268, 0.207912],
    [-0.965926, -0.173648, 0.996195, -0.087156, -0.984808, 0.258819],
    [-0.951057, -0.207912, 0.994522, -0.104528, -0.978148, 0.309017],
    [-0.933580, -0.241922, 0.992546, -0.121869, -0.970296, 0.358368],
    [-0.913545, -0.275637, 0.990268, -0.139173, -0.961262, 0.406737],
    [-0.891007, -0.309017, 0.987688, -0.156434, -0.951057, 0.453990],
    [-0.866025, -0.342020, 0.984808, -0.173648, -0.939693, 0.500000],
    [-0.838671, -0.374607, 0.981627, -0.190809, -0.927184, 0.544639],
    [-0.809017, -0.406737, 0.978148, -0.207912, -0.913545, 0.587785],
    [-0.777146, -0.438371, 0.974370, -0.224951, -0.898794, 0.629320],
    [-0.743145, -0.469472, 0.970296, -0.241922, -0.882948, 0.669131],
    [-0.707107, -0.500000, 0.965926, -0.258819, -0.866025, 0.707107],
    [-0.669131, -0.529919, 0.961262, -0.275637, -0.848048, 0.743145],
    [-0.629320, -0.559193, 0.956305, -0.292372, -0.829038, 0.777146],
    [-0.587785, -0.587785, 0.951057, -0.309017, -0.809017, 0.809017],
    [-0.544639, -0.615661, 0.945519, -0.325568, -0.788011, 0.838671],
    [-0.500000, -0.642788, 0.939693, -0.342020, -0.766044, 0.866025],
    [-0.453990, -0.669131, 0.933580, -0.358368, -0.743145, 0.891007],
    [-0.406737, -0.694658, 0.927184, -0.374607, -0.719340, 0.913545],
    [-0.358368, -0.719340, 0.920505, -0.390731, -0.694658, 0.933580],
    [-0.309017, -0.743145, 0.913545, -0.406737, -0.669131, 0.951057],
    [-0.258819, -0.766044, 0.906308, -0.422618, -0.642788, 0.965926],
    [-0.207912, -0.788011, 0.898794, -0.438371, -0.615661, 0.978148],
    [-0.156434, -0.809017, 0.891007, -0.453990, -0.587785, 0.987688],
    [-0.104528, -0.829038, 0.882948, -0.469472, -0.559193, 0.994522],
    [-0.052336, -0.848048, 0.874620, -0.484810, -0.529919, 0.998630],
    [-0.000000, -0.866025, 0.866025, -0.500000, -0.500000, 1.000000],
    [0.052336, -0.882948, 0.857167, -0.515038, -0.469472, 0.998630],
    [0.104528, -0.898794, 0.848048, -0.529919, -0.438371, 0.994522],
    [0.156434, -0.913545, 0.838671, -0.544639, -0.406737, 0.987688],
    [0.207912, -0.927184, 0.829038, -0.559193, -0.374607, 0.978148],
    [0.258819, -0.939693, 0.819152, -0.573576, -0.342020, 0.965926],
    [0.309017, -0.951057, 0.809017, -0.587785, -0.309017, 0.951057],
    [0.358368, -0.961262, 0.798636, -0.601815, -0.275637, 0.933580],
    [0.406737, -0.970296, 0.788011, -0.615661, -0.241922, 0.913545],
    [0.453990, -0.978148, 0.777146, -0.629320, -0.207912, 0.891007],
    [0.500000, -0.984808, 0.766044, -0.642788, -0.173648, 0.866025],
    [0.544639, -0.990268, 0.754710, -0.656059, -0.139173, 0.838671],
    [0.587785, -0.994522, 0.743145, -0.669131, -0.104528, 0.809017],
    [0.629320, -0.997564, 0.731354, -0.681998, -0.069756, 0.777146],
    [0.669131, -0.999391, 0.719340, -0.694658, -0.034899, 0.743145],
    [0.707107, -1.000000, 0.707107, -0.707107, -0.000000, 0.707107],
    [0.743145, -0.999391, 0.694658, -0.719340, 0.034899, 0.669131],
    [0.777146, -0.997564, 0.681998, -0.731354, 0.069756, 0.629320],
    [0.809017, -0.994522, 0.669131, -0.743145, 0.104528, 0.587785],
    [0.838671, -0.990268, 0.656059, -0.754710, 0.139173, 0.544639],
    [0.866025, -0.984808, 0.642788, -0.766044, 0.173648, 0.500000],
    [0.891007, -0.978148, 0.629320, -0.777146, 0.207912, 0.453990],
    [0.913545, -0.970296, 0.615661, -0.788011, 0.241922, 0.406737],
    [0.933580, -0.961262, 0.601815, -0.798636, 0.275637, 0.358368],
    [0.951057, -0.951057, 0.587785, -0.809017, 0.309017, 0.309017],
    [0.965926, -0.939693, 0.573576, -0.819152, 0.342020, 0.258819],
    [0.978148, -0.927184, 0.559193, -0.829038, 0.374607, 0.207912],
    [0.987688, -0.913545, 0.544639, -0.838671, 0.406737, 0.156434],
    [0.994522, -0.898794, 0.529919, -0.848048, 0.438371, 0.104528],
    [0.998630, -0.882948, 0.515038, -0.857167, 0.469472, 0.052336],
    [1.000000, -0.866025, 0.500000, -0.866025, 0.500000, 0.000000],
    [0.998630, -0.848048, 0.484810, -0.874620, 0.529919, -0.052336],
    [0.994522, -0.829038, 0.469472, -0.882948, 0.559193, -0.104528],
    [0.987688, -0.809017, 0.453990, -0.891007, 0.587785, -0.156434],
    [0.978148, -0.788011, 0.438371, -0.898794, 0.615661, -0.207912],
    [0.965926, -0.766044, 0.422618, -0.906308, 0.642788, -0.258819],
    [0.951057, -0.743145, 0.406737, -0.913545, 0.669131, -0.309017],
    [0.933580, -0.719340, 0.390731, -0.920505, 0.694658, -0.358368],
    [0.913545, -0.694658, 0.374607, -0.927184, 0.719340, -0.406737],
    [0.891007, -0.669131, 0.358368, -0.933580, 0.743145, -0.453990],
    [0.866025, -0.642788, 0.342020, -0.939693, 0.766044, -0.500000],
    [0.838671, -0.615661, 0.325568, -0.945519, 0.788011, -0.544639],
    [0.809017, -0.587785, 0.309017, -0.951057, 0.809017, -0.587785],
    [0.777146, -0.559193, 0.292372, -0.956305, 0.829038, -0.629320],
    [0.743145, -0.529919, 0.275637, -0.961262, 0.848048, -0.669131],
    [0.707107, -0.500000, 0.258819, -0.965926, 0.866025, -0.707107],
    [0.669131, -0.469472, 0.241922, -0.970296, 0.882948, -0.743145],
    [0.629320, -0.438371, 0.224951, -0.974370, 0.898794, -0.777146],
    [0.587785, -0.406737, 0.207912, -0.978148, 0.913545, -0.809017],
    [0.544639, -0.374607, 0.190809, -0.981627, 0.927184, -0.838671],
    [0.500000, -0.342020, 0.173648, -0.984808, 0.939693, -0.866025],
    [0.453990, -0.309017, 0.156434, -0.987688, 0.951057, -0.891007],
    [0.406737, -0.275637, 0.139173, -0.990268, 0.961262, -0.913545],
    [0.358368, -0.241922, 0.121869, -0.992546, 0.970296, -0.933580],
    [0.309017, -0.207912, 0.104528, -0.994522, 0.978148, -0.951057],
    [0.258819, -0.173648, 0.087156, -0.996195, 0.984808, -0.965926],
    [0.207912, -0.139173, 0.069756, -0.997564, 0.990268, -0.978148],
    [0.156434, -0.104528, 0.052336, -0.998630, 0.994522, -0.987688],
    [0.104528, -0.069756, 0.034899, -0.999391, 0.997564, -0.994522],
    [0.052336, -0.034899, 0.017452, -0.999848, 0.999391, -0.998630],
    [0.000000, -0.000000, 0.000000, -1.000000, 1.000000, -1.000000],
    [-0.052336, 0.034899, -0.017452, -0.999848, 0.999391, -0.998630],
    [-0.104528, 0.069756, -0.034899, -0.999391, 0.997564, -0.994522],
    [-0.156434, 0.104528, -0.052336, -0.998630, 0.994522, -0.987688],
    [-0.207912, 0.139173, -0.069756, -0.997564, 0.990268, -0.978148],
    [-0.258819, 0.173648, -0.087156, -0.996195, 0.984808, -0.965926],
    [-0.309017, 0.207912, -0.104528, -0.994522, 0.978148, -0.951057],
    [-0.358368, 0.241922, -0.121869, -0.992546, 0.970296, -0.933580],
    [-0.406737, 0.275637, -0.139173, -0.990268, 0.961262, -0.913545],
    [-0.453990, 0.309017, -0.156434, -0.987688, 0.951057, -0.891007],
    [-0.500000, 0.342020, -0.173648, -0.984808, 0.939693, -0.866025],
    [-0.544639, 0.374607, -0.190809, -0.981627, 0.927184, -0.838671],
    [-0.587785, 0.406737, -0.207912, -0.978148, 0.913545, -0.809017],
    [-0.629320, 0.438371, -0.224951, -0.974370, 0.898794, -0.777146],
    [-0.669131, 0.469472, -0.241922, -0.970296, 0.882948, -0.743145],
    [-0.707107, 0.500000, -0.258819, -0.965926, 0.866025, -0.707107],
    [-0.743145, 0.529919, -0.275637, -0.961262, 0.848048, -0.669131],
    [-0.777146, 0.559193, -0.292372, -0.956305, 0.829038, -0.629320],
    [-0.809017, 0.587785, -0.309017, -0.951057, 0.809017, -0.587785],
    [-0.838671, 0.615661, -0.325568, -0.945519, 0.788011, -0.544639],
    [-0.866025, 0.642788, -0.342020, -0.939693, 0.766044, -0.500000],
    [-0.891007, 0.669131, -0.358368, -0.933580, 0.743145, -0.453990],
    [-0.913545, 0.694658, -0.374607, -0.927184, 0.719340, -0.406737],
    [-0.933580, 0.719340, -0.390731, -0.920505, 0.694658, -0.358368],
    [-0.951057, 0.743145, -0.406737, -0.913545, 0.669131, -0.309017],
    [-0.965926, 0.766044, -0.422618, -0.906308, 0.642788, -0.258819],
    [-0.978148, 0.788011, -0.438371, -0.898794, 0.615661, -0.207912],
    [-0.987688, 0.809017, -0.453990, -0.891007, 0.587785, -0.156434],
    [-0.994522, 0.829038, -0.469472, -0.882948, 0.559193, -0.104528],
    [-0.998630, 0.848048, -0.484810, -0.874620, 0.529919, -0.052336],
    [-1.000000, 0.866025, -0.500000, -0.866025, 0.500000, 0.000000],
    [-0.998630, 0.882948, -0.515038, -0.857167, 0.469472, 0.052336],
    [-0.994522, 0.898794, -0.529919, -0.848048, 0.438371, 0.104528],
    [-0.987688, 0.913545, -0.544639, -0.838671, 0.406737, 0.156434],
    [-0.978148, 0.927184, -0.559193, -0.829038, 0.374607, 0.207912],
    [-0.965926, 0.939693, -0.573576, -0.819152, 0.342020, 0.258819],
    [-0.951057, 0.951057, -0.587785, -0.809017, 0.309017, 0.309017],
    [-0.933580, 0.961262, -0.601815, -0.798636, 0.275637, 0.358368],
    [-0.913545, 0.970296, -0.615661, -0.788011, 0.241922, 0.406737],
    [-0.891007, 0.978148, -0.629320, -0.777146, 0.207912, 0.453990],
    [-0.866025, 0.984808, -0.642788, -0.766044, 0.173648, 0.500000],
    [-0.838671, 0.990268, -0.656059, -0.754710, 0.139173, 0.544639],
    [-0.809017, 0.994522, -0.669131, -0.743145, 0.104528, 0.587785],
    [-0.777146, 0.997564, -0.681998, -0.731354, 0.069756, 0.629320],
    [-0.743145, 0.999391, -0.694658, -0.719340, 0.034899, 0.669131],
    [-0.707107, 1.000000, -0.707107, -0.707107, 0.000000, 0.707107],
    [-0.669131, 0.999391, -0.719340, -0.694658, -0.034899, 0.743145],
    [-0.629320, 0.997564, -0.731354, -0.681998, -0.069756, 0.777146],
    [-0.587785, 0.994522, -0.743145, -0.669131, -0.104528, 0.809017],
    [-0.544639, 0.990268, -0.754710, -0.656059, -0.139173, 0.838671],
    [-0.500000, 0.984808, -0.766044, -0.642788, -0.173648, 0.866025],
    [-0.453990, 0.978148, -0.777146, -0.629320, -0.207912, 0.891007],
    [-0.406737, 0.970296, -0.788011, -0.615661, -0.241922, 0.913545],
    [-0.358368, 0.961262, -0.798636, -0.601815, -0.275637, 0.933580],
    [-0.309017, 0.951057, -0.809017, -0.587785, -0.309017, 0.951057],
    [-0.258819, 0.939693, -0.819152, -0.573576, -0.342020, 0.965926],
    [-0.207912, 0.927184, -0.829038, -0.559193, -0.374607, 0.978148],
    [-0.156434, 0.913545, -0.838671, -0.544639, -0.406737, 0.987688],
    [-0.104528, 0.898794, -0.848048, -0.529919, -0.438371, 0.994522],
    [-0.052336, 0.882948, -0.857167, -0.515038, -0.469472, 0.998630],
    [-0.000000, 0.866025, -0.866025, -0.500000, -0.500000, 1.000000],
    [0.052336, 0.848048, -0.874620, -0.484810, -0.529919, 0.998630],
    [0.104528, 0.829038, -0.882948, -0.469472, -0.559193, 0.994522],
    [0.156434, 0.809017, -0.891007, -0.453990, -0.587785, 0.987688],
    [0.207912, 0.788011, -0.898794, -0.438371, -0.615661, 0.978148],
    [0.258819, 0.766044, -0.906308, -0.422618, -0.642788, 0.965926],
    [0.309017, 0.743145, -0.913545, -0.406737, -0.669131, 0.951057],
    [0.358368, 0.719340, -0.920505, -0.390731, -0.694658, 0.933580],
    [0.406737, 0.694658, -0.927184, -0.374607, -0.719340, 0.913545],
    [0.453990, 0.669131, -0.933580, -0.358368, -0.743145, 0.891007],
    [0.500000, 0.642788, -0.939693, -0.342020, -0.766044, 0.866025],
    [0.544639, 0.615661, -0.945519, -0.325568, -0.788011, 0.838671],
    [0.587785, 0.587785, -0.951057, -0.309017, -0.809017, 0.809017],
    [0.629320, 0.559193, -0.956305, -0.292372, -0.829038, 0.777146],
    [0.669131, 0.529919, -0.961262, -0.275637, -0.848048, 0.743145],
    [0.707107, 0.500000, -0.965926, -0.258819, -0.866025, 0.707107],
    [0.743145, 0.469472, -0.970296, -0.241922, -0.882948, 0.669131],
    [0.777146, 0.438371, -0.974370, -0.224951, -0.898794, 0.629320],
    [0.809017, 0.406737, -0.978148, -0.207912, -0.913545, 0.587785],
    [0.838671, 0.374607, -0.981627, -0.190809, -0.927184, 0.544639],
    [0.866025, 0.342020, -0.984808, -0.173648, -0.939693, 0.500000],
    [0.891007, 0.309017, -0.987688, -0.156434, -0.951057, 0.453990],
    [0.913545, 0.275637, -0.990268, -0.139173, -0.961262, 0.406737],
    [0.933580, 0.241922, -0.992546, -0.121869, -0.970296, 0.358368],
    [0.951057, 0.207912, -0.994522, -0.104528, -0.978148, 0.309017],
    [0.965926, 0.173648, -0.996195, -0.087156, -0.984808, 0.258819],
    [0.978148, 0.139173, -0.997564, -0.069756, -0.990268, 0.207912],
    [0.987688, 0.104528, -0.998630, -0.052336, -0.994522, 0.156434],
    [0.994522, 0.069756, -0.999391, -0.034899, -0.997564, 0.104528],
    [0.998630, 0.034899, -0.999848, -0.017452, -0.999391, 0.052336],
    [1.000000, 0.000000, -1.000000, -0.000000, -1.000000, 0.000000],
    [0.998630, -0.034899, -0.999848, 0.017452, -0.999391, -0.052336],
    [0.994522, -0.069756, -0.999391, 0.034899, -0.997564, -0.104528],
    [0.987688, -0.104528, -0.998630, 0.052336, -0.994522, -0.156434],
    [0.978148, -0.139173, -0.997564, 0.069756, -0.990268, -0.207912],
    [0.965926, -0.173648, -0.996195, 0.087156, -0.984808, -0.258819],
    [0.951057, -0.207912, -0.994522, 0.104528, -0.978148, -0.309017],
    [0.933580, -0.241922, -0.992546, 0.121869, -0.970296, -0.358368],
    [0.913545, -0.275637, -0.990268, 0.139173, -0.961262, -0.406737],
    [0.891007, -0.309017, -0.987688, 0.156434, -0.951057, -0.453990],
    [0.866025, -0.342020, -0.984808, 0.173648, -0.939693, -0.500000],
    [0.838671, -0.374607, -0.981627, 0.190809, -0.927184, -0.544639],
    [0.809017, -0.406737, -0.978148, 0.207912, -0.913545, -0.587785],
    [0.777146, -0.438371, -0.974370, 0.224951, -0.898794, -0.629320],
    [0.743145, -0.469472, -0.970296, 0.241922, -0.882948, -0.669131],
    [0.707107, -0.500000, -0.965926, 0.258819, -0.866025, -0.707107],
    [0.669131, -0.529919, -0.961262, 0.275637, -0.848048, -0.743145],
    [0.629320, -0.559193, -0.956305, 0.292372, -0.829038, -0.777146],
    [0.587785, -0.587785, -0.951057, 0.309017, -0.809017, -0.809017],
    [0.544639, -0.615661, -0.945519, 0.325568, -0.788011, -0.838671],
    [0.500000, -0.642788, -0.939693, 0.342020, -0.766044, -0.866025],
    [0.453990, -0.669131, -0.933580, 0.358368, -0.743145, -0.891007],
    [0.406737, -0.694658, -0.927184, 0.374607, -0.719340, -0.913545],
    [0.358368, -0.719340, -0.920505, 0.390731, -0.694658, -0.933580],
    [0.309017, -0.743145, -0.913545, 0.406737, -0.669131, -0.951057],
    [0.258819, -0.766044, -0.906308, 0.422618, -0.642788, -0.965926],
    [0.207912, -0.788011, -0.898794, 0.438371, -0.615661, -0.978148],
    [0.156434, -0.809017, -0.891007, 0.453990, -0.587785, -0.987688],
    [0.104528, -0.829038, -0.882948, 0.469472, -0.559193, -0.994522],
    [0.052336, -0.848048, -0.874620, 0.484810, -0.529919, -0.998630],
    [0.000000, -0.866025, -0.866025, 0.500000, -0.500000, -1.000000],
    [-0.052336, -0.882948, -0.857167, 0.515038, -0.469472, -0.998630],
    [-0.104528, -0.898794, -0.848048, 0.529919, -0.438371, -0.994522],
    [-0.156434, -0.913545, -0.838671, 0.544639, -0.406737, -0.987688],
    [-0.207912, -0.927184, -0.829038, 0.559193, -0.374607, -0.978148],
    [-0.258819, -0.939693, -0.819152, 0.573576, -0.342020, -0.965926],
    [-0.309017, -0.951057, -0.809017, 0.587785, -0.309017, -0.951057],
    [-0.358368, -0.961262, -0.798636, 0.601815, -0.275637, -0.933580],
    [-0.406737, -0.970296, -0.788011, 0.615661, -0.241922, -0.913545],
    [-0.453990, -0.978148, -0.777146, 0.629320, -0.207912, -0.891007],
    [-0.500000, -0.984808, -0.766044, 0.642788, -0.173648, -0.866025],
    [-0.544639, -0.990268, -0.754710, 0.656059, -0.139173, -0.838671],
    [-0.587785, -0.994522, -0.743145, 0.669131, -0.104528, -0.809017],
    [-0.629320, -0.997564, -0.731354, 0.681998, -0.069756, -0.777146],
    [-0.669131, -0.999391, -0.719340, 0.694658, -0.034899, -0.743145],
    [-0.707107, -1.000000, -0.707107, 0.707107, -0.000000, -0.707107],
    [-0.743145, -0.999391, -0.694658, 0.719340, 0.034899, -0.669131],
    [-0.777146, -0.997564, -0.681998, 0.731354, 0.069756, -0.629320],
    [-0.809017, -0.994522, -0.669131, 0.743145, 0.104528, -0.587785],
    [-0.838671, -0.990268, -0.656059, 0.754710, 0.139173, -0.544639],
    [-0.866025, -0.984808, -0.642788, 0.766044, 0.173648, -0.500000],
    [-0.891007, -0.978148, -0.629320, 0.777146, 0.207912, -0.453990],
    [-0.913545, -0.970296, -0.615661, 0.788011, 0.241922, -0.406737],
    [-0.933580, -0.961262, -0.601815, 0.798636, 0.275637, -0.358368],
    [-0.951057, -0.951057, -0.587785, 0.809017, 0.309017, -0.309017],
    [-0.965926, -0.939693, -0.573576, 0.819152, 0.342020, -0.258819],
    [-0.978148, -0.927184, -0.559193, 0.829038, 0.374607, -0.207912],
    [-0.987688, -0.913545, -0.544639, 0.838671, 0.406737, -0.156434],
    [-0.994522, -0.898794, -0.529919, 0.848048, 0.438371, -0.104528],
    [-0.998630, -0.882948, -0.515038, 0.857167, 0.469472, -0.052336],
    [-1.000000, -0.866025, -0.500000, 0.866025, 0.500000, -0.000000],
    [-0.998630, -0.848048, -0.484810, 0.874620, 0.529919, 0.052336],
    [-0.994522, -0.829038, -0.469472, 0.882948, 0.559193, 0.104528],
    [-0.987688, -0.809017, -0.453990, 0.891007, 0.587785, 0.156434],
    [-0.978148, -0.788011, -0.438371, 0.898794, 0.615661, 0.207912],
    [-0.965926, -0.766044, -0.422618, 0.906308, 0.642788, 0.258819],
    [-0.951057, -0.743145, -0.406737, 0.913545, 0.669131, 0.309017],
    [-0.933580, -0.719340, -0.390731, 0.920505, 0.694658, 0.358368],
    [-0.913545, -0.694658, -0.374607, 0.927184, 0.719340, 0.406737],
    [-0.891007, -0.669131, -0.358368, 0.933580, 0.743145, 0.453990],
    [-0.866025, -0.642788, -0.342020, 0.939693, 0.766044, 0.500000],
    [-0.838671, -0.615661, -0.325568, 0.945519, 0.788011, 0.544639],
    [-0.809017, -0.587785, -0.309017, 0.951057, 0.809017, 0.587785],
    [-0.777146, -0.559193, -0.292372, 0.956305, 0.829038, 0.629320],
    [-0.743145, -0.529919, -0.275637, 0.961262, 0.848048, 0.669131],
    [-0.707107, -0.500000, -0.258819, 0.965926, 0.866025, 0.707107],
    [-0.669131, -0.469472, -0.241922, 0.970296, 0.882948, 0.743145],
    [-0.629320, -0.438371, -0.224951, 0.974370, 0.898794, 0.777146],
    [-0.587785, -0.406737, -0.207912, 0.978148, 0.913545, 0.809017],
    [-0.544639, -0.374607, -0.190809, 0.981627, 0.927184, 0.838671],
    [-0.500000, -0.342020, -0.173648, 0.984808, 0.939693, 0.866025],
    [-0.453990, -0.309017, -0.156434, 0.987688, 0.951057, 0.891007],
    [-0.406737, -0.275637, -0.139173, 0.990268, 0.961262, 0.913545],
    [-0.358368, -0.241922, -0.121869, 0.992546, 0.970296, 0.933580],
    [-0.309017, -0.207912, -0.104528, 0.994522, 0.978148, 0.951057],
    [-0.258819, -0.173648, -0.087156, 0.996195, 0.984808, 0.965926],
    [-0.207912, -0.139173, -0.069756, 0.997564, 0.990268, 0.978148],
    [-0.156434, -0.104528, -0.052336, 0.998630, 0.994522, 0.987688],
    [-0.104528, -0.069756, -0.034899, 0.999391, 0.997564, 0.994522],
    [-0.052336, -0.034899, -0.017452, 0.999848, 0.999391, 0.998630],
  ],
  [
    [-1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
     -1.000000, -0.000000, 0.000000, -0.000000],
    [-0.999848, 0.017452, 0.999543, -0.030224, 0.000264,
     -0.999086, 0.042733, -0.000590, 0.000004],
    [-0.999391, 0.034899, 0.998173, -0.060411, 0.001055,
     -0.996348, 0.085356, -0.002357, 0.000034],
    [-0.998630, 0.052336, 0.995891, -0.090524, 0.002372,
     -0.991791, 0.127757, -0.005297, 0.000113],
    [-0.997564, 0.069756, 0.992701, -0.120527, 0.004214,
     -0.985429, 0.169828, -0.009400, 0.000268],
    [-0.996195, 0.087156, 0.988606, -0.150384, 0.006578,
     -0.977277, 0.211460, -0.014654, 0.000523],
    [-0.994522, 0.104528, 0.983611, -0.180057, 0.009462,
     -0.967356, 0.252544, -0.021043, 0.000903],
    [-0.992546, 0.121869, 0.977722, -0.209511, 0.012862,
     -0.955693, 0.292976, -0.028547, 0.001431],
    [-0.990268, 0.139173, 0.970946, -0.238709, 0.016774,
     -0.942316, 0.332649, -0.037143, 0.002131],
    [-0.987688, 0.156434, 0.963292, -0.267617, 0.021193,
     -0.927262, 0.371463, -0.046806, 0.003026],
    [-0.984808, 0.173648, 0.954769, -0.296198, 0.026114,
     -0.910569, 0.409317, -0.057505, 0.004140],
    [-0.981627, 0.190809, 0.945388, -0.324419, 0.031530,
     -0.892279, 0.446114, -0.069209, 0.005492],
    [-0.978148, 0.207912, 0.935159, -0.352244, 0.037436,
     -0.872441, 0.481759, -0.081880, 0.007105],
    [-0.974370, 0.224951, 0.924096, -0.379641, 0.043823,
     -0.851105, 0.516162, -0.095481, 0.008999],
    [-0.970296, 0.241922, 0.912211, -0.406574, 0.050685,
     -0.828326, 0.549233, -0.109969, 0.011193],
    [-0.965926, 0.258819, 0.899519, -0.433013, 0.058013,
     -0.804164, 0.580889, -0.125300, 0.013707],
    [-0.961262, 0.275637, 0.886036, -0.458924, 0.065797,
     -0.778680, 0.611050, -0.141427, 0.016556],
    [-0.956305, 0.292372, 0.871778, -0.484275, 0.074029,
     -0.751940, 0.639639, -0.158301, 0.019758],
    [-0.951057, 0.309017, 0.856763, -0.509037, 0.082698,
     -0.724012, 0.666583, -0.175868, 0.023329],
    [-0.945519, 0.325568, 0.841008, -0.533178, 0.091794,
     -0.694969, 0.691816, -0.194075, 0.027281],
    [-0.939693, 0.342020, 0.824533, -0.556670, 0.101306,
     -0.664885, 0.715274, -0.212865, 0.031630],
    [-0.933580, 0.358368, 0.807359, -0.579484, 0.111222,
     -0.633837, 0.736898, -0.232180, 0.036385],
    [-0.927184, 0.374607, 0.789505, -0.601592, 0.121529,
     -0.601904, 0.756637, -0.251960, 0.041559],
    [-0.920505, 0.390731, 0.770994, -0.622967, 0.132217,
     -0.569169, 0.774442, -0.272143, 0.047160],
    [-0.913545, 0.406737, 0.751848, -0.643582, 0.143271,
     -0.535715, 0.790270, -0.292666, 0.053196],
    [-0.906308, 0.422618, 0.732091, -0.663414, 0.154678,
     -0.501627, 0.804083, -0.313464, 0.059674],
    [-0.898794, 0.438371, 0.711746, -0.682437, 0.166423,
     -0.466993, 0.815850, -0.334472, 0.066599],
    [-0.891007, 0.453990, 0.690839, -0.700629, 0.178494,
     -0.431899, 0.825544, -0.355623, 0.073974],
    [-0.882948, 0.469472, 0.669395, -0.717968, 0.190875,
     -0.396436, 0.833145, -0.376851, 0.081803],
    [-0.874620, 0.484810, 0.647439, -0.734431, 0.203551,
     -0.360692, 0.838638, -0.398086, 0.090085],
    [-0.866025, 0.500000, 0.625000, -0.750000, 0.216506,
     -0.324760, 0.842012, -0.419263, 0.098821],
    [-0.857167, 0.515038, 0.602104, -0.764655, 0.229726,
     -0.288728, 0.843265, -0.440311, 0.108009],
    [-0.848048, 0.529919, 0.578778, -0.778378, 0.243192,
     -0.252688, 0.842399, -0.461164, 0.117644],
    [-0.838671, 0.544639, 0.555052, -0.791154, 0.256891,
     -0.216730, 0.839422, -0.481753, 0.127722],
    [-0.829038, 0.559193, 0.530955, -0.802965, 0.270803,
     -0.180944, 0.834347, -0.502011, 0.138237],
    [-0.819152, 0.573576, 0.506515, -0.813798, 0.284914,
     -0.145420, 0.827194, -0.521871, 0.149181],
    [-0.809017, 0.587785, 0.481763, -0.823639, 0.299204,
     -0.110246, 0.817987, -0.541266, 0.160545],
    [-0.798636, 0.601815, 0.456728, -0.832477, 0.313658,
     -0.075508, 0.806757, -0.560132, 0.172317],
    [-0.788011, 0.615661, 0.431441, -0.840301, 0.328257,
     -0.041294, 0.793541, -0.578405, 0.184487],
    [-0.777146, 0.629320, 0.405934, -0.847101, 0.342984,
     -0.007686, 0.778379, -0.596021, 0.197040],
    [-0.766044, 0.642788, 0.380236, -0.852869, 0.357821,
     0.025233, 0.761319, -0.612921, 0.209963],
    [-0.754710, 0.656059, 0.354380, -0.857597, 0.372749,
     0.057383, 0.742412, -0.629044, 0.223238],
    [-0.743145, 0.669131, 0.328396, -0.861281, 0.387751,
     0.088686, 0.721714, -0.644334, 0.236850],
    [-0.731354, 0.681998, 0.302317, -0.863916, 0.402807,
     0.119068, 0.699288, -0.658734, 0.250778],
    [-0.719340, 0.694658, 0.276175, -0.865498, 0.417901,
     0.148454, 0.675199, -0.672190, 0.265005],
    [-0.707107, 0.707107, 0.250000, -0.866025, 0.433013,
     0.176777, 0.649519, -0.684653, 0.279508],
    [-0.694658, 0.719340, 0.223825, -0.865498, 0.448125,
     0.203969, 0.622322, -0.696073, 0.294267],
    [-0.681998, 0.731354, 0.197683, -0.863916, 0.463218,
     0.229967, 0.593688, -0.706405, 0.309259],
    [-0.669131, 0.743145, 0.171604, -0.861281, 0.478275,
     0.254712, 0.563700, -0.715605, 0.324459],
    [-0.656059, 0.754710, 0.145620, -0.857597, 0.493276,
     0.278147, 0.532443, -0.723633, 0.339844],
    [-0.642788, 0.766044, 0.119764, -0.852869, 0.508205,
     0.300221, 0.500009, -0.730451, 0.355387],
    [-0.629320, 0.777146, 0.094066, -0.847101, 0.523041,
     0.320884, 0.466490, -0.736025, 0.371063],
    [-0.615661, 0.788011, 0.068559, -0.840301, 0.537768,
     0.340093, 0.431982, -0.740324, 0.386845],
    [-0.601815, 0.798636, 0.043272, -0.832477, 0.552367,
     0.357807, 0.396584, -0.743320, 0.402704],
    [-0.587785, 0.809017, 0.018237, -0.823639, 0.566821,
     0.373991, 0.360397, -0.744989, 0.418613],
    [-0.573576, 0.819152, -0.006515, -0.813798, 0.581112,
     0.388612, 0.323524, -0.745308, 0.434544],
    [-0.559193, 0.829038, -0.030955, -0.802965, 0.595222,
     0.401645, 0.286069, -0.744262, 0.450467],
    [-0.544639, 0.838671, -0.055052, -0.791154, 0.609135,
     0.413066, 0.248140, -0.741835, 0.466352],
    [-0.529919, 0.848048, -0.078778, -0.778378, 0.622833,
     0.422856, 0.209843, -0.738017, 0.482171],
    [-0.515038, 0.857167, -0.102104, -0.764655, 0.636300,
     0.431004, 0.171288, -0.732801, 0.497894],
    [-0.500000, 0.866025, -0.125000, -0.750000, 0.649519,
     0.437500, 0.132583, -0.726184, 0.513490],
    [-0.484810, 0.874620, -0.147439, -0.734431, 0.662474,
     0.442340, 0.093837, -0.718167, 0.528929],
    [-0.469472, 0.882948, -0.169395, -0.717968, 0.675150,
     0.445524, 0.055160, -0.708753, 0.544183],
    [-0.453990, 0.891007, -0.190839, -0.700629, 0.687531,
     0.447059, 0.016662, -0.697950, 0.559220],
    [-0.438371, 0.898794, -0.211746, -0.682437, 0.699602,
     0.446953, -0.021550, -0.685769, 0.574011],
    [-0.422618, 0.906308, -0.232091, -0.663414, 0.711348,
     0.445222, -0.059368, -0.672226, 0.588528],
    [-0.406737, 0.913545, -0.251848, -0.643582, 0.722755,
     0.441884, -0.096684, -0.657339, 0.602741],
    [-0.390731, 0.920505, -0.270994, -0.622967, 0.733809,
     0.436964, -0.133395, -0.641130, 0.616621],
    [-0.374607, 0.927184, -0.289505, -0.601592, 0.744496,
     0.430488, -0.169397, -0.623624, 0.630141],
    [-0.358368, 0.933580, -0.307359, -0.579484, 0.754804,
     0.422491, -0.204589, -0.604851, 0.643273],
    [-0.342020, 0.939693, -0.324533, -0.556670, 0.764720,
     0.413008, -0.238872, -0.584843, 0.655990],
    [-0.325568, 0.945519, -0.341008, -0.533178, 0.774231,
     0.402081, -0.272150, -0.563635, 0.668267],
    [-0.309017, 0.951057, -0.356763, -0.509037, 0.783327,
     0.389754, -0.304329, -0.541266, 0.680078],
    [-0.292372, 0.956305, -0.371778, -0.484275, 0.791997,
     0.376077, -0.335319, -0.517778, 0.691399],
    [-0.275637, 0.961262, -0.386036, -0.458924, 0.800228,
     0.361102, -0.365034, -0.493216, 0.702207],
    [-0.258819, 0.965926, -0.399519, -0.433013, 0.808013,
     0.344885, -0.393389, -0.467627, 0.712478],
    [-0.241922, 0.970296, -0.412211, -0.406574, 0.815340,
     0.327486, -0.420306, -0.441061, 0.722191],
    [-0.224951, 0.974370, -0.424096, -0.379641, 0.822202,
     0.308969, -0.445709, -0.413572, 0.731327],
    [-0.207912, 0.978148, -0.435159, -0.352244, 0.828589,
     0.289399, -0.469527, -0.385215, 0.739866],
    [-0.190809, 0.981627, -0.445388, -0.324419, 0.834495,
     0.268846, -0.491693, -0.356047, 0.747790],
    [-0.173648, 0.984808, -0.454769, -0.296198, 0.839912,
     0.247382, -0.512145, -0.326129, 0.755082],
    [-0.156434, 0.987688, -0.463292, -0.267617, 0.844832,
     0.225081, -0.530827, -0.295521, 0.761728],
    [-0.139173, 0.990268, -0.470946, -0.238709, 0.849251,
     0.202020, -0.547684, -0.264287, 0.767712],
    [-0.121869, 0.992546, -0.477722, -0.209511, 0.853163,
     0.178279, -0.562672, -0.232494, 0.773023],
    [-0.104528, 0.994522, -0.483611, -0.180057, 0.856563,
     0.153937, -0.575747, -0.200207, 0.777648],
    [-0.087156, 0.996195, -0.488606, -0.150384, 0.859447,
     0.129078, -0.586872, -0.167494, 0.781579],
    [-0.069756, 0.997564, -0.492701, -0.120527, 0.861811,
     0.103786, -0.596018, -0.134426, 0.784806],
    [-0.052336, 0.998630, -0.495891, -0.090524, 0.863653,
     0.078146, -0.603158, -0.101071, 0.787324],
    [-0.034899, 0.999391, -0.498173, -0.060411, 0.864971,
     0.052243, -0.608272, -0.067500, 0.789126],
    [-0.017452, 0.999848, -0.499543, -0.030224, 0.865762,
     0.026165, -0.611347, -0.033786, 0.790208],
    [0.000000, 1.000000, -0.500000, 0.000000, 0.866025,
     -0.000000, -0.612372, 0.000000, 0.790569],
    [0.017452, 0.999848, -0.499543, 0.030224, 0.865762,
     -0.026165, -0.611347, 0.033786, 0.790208],
    [0.034899, 0.999391, -0.498173, 0.060411, 0.864971,
     -0.052243, -0.608272, 0.067500, 0.789126],
    [0.052336, 0.998630, -0.495891, 0.090524, 0.863653,
     -0.078146, -0.603158, 0.101071, 0.787324],
    [0.069756, 0.997564, -0.492701, 0.120527, 0.861811,
     -0.103786, -0.596018, 0.134426, 0.784806],
    [0.087156, 0.996195, -0.488606, 0.150384, 0.859447,
     -0.129078, -0.586872, 0.167494, 0.781579],
    [0.104528, 0.994522, -0.483611, 0.180057, 0.856563,
     -0.153937, -0.575747, 0.200207, 0.777648],
    [0.121869, 0.992546, -0.477722, 0.209511, 0.853163,
     -0.178279, -0.562672, 0.232494, 0.773023],
    [0.139173, 0.990268, -0.470946, 0.238709, 0.849251,
     -0.202020, -0.547684, 0.264287, 0.767712],
    [0.156434, 0.987688, -0.463292, 0.267617, 0.844832,
     -0.225081, -0.530827, 0.295521, 0.761728],
    [0.173648, 0.984808, -0.454769, 0.296198, 0.839912,
     -0.247382, -0.512145, 0.326129, 0.755082],
    [0.190809, 0.981627, -0.445388, 0.324419, 0.834495,
     -0.268846, -0.491693, 0.356047, 0.747790],
    [0.207912, 0.978148, -0.435159, 0.352244, 0.828589,
     -0.289399, -0.469527, 0.385215, 0.739866],
    [0.224951, 0.974370, -0.424096, 0.379641, 0.822202,
     -0.308969, -0.445709, 0.413572, 0.731327],
    [0.241922, 0.970296, -0.412211, 0.406574, 0.815340,
     -0.327486, -0.420306, 0.441061, 0.722191],
    [0.258819, 0.965926, -0.399519, 0.433013, 0.808013,
     -0.344885, -0.393389, 0.467627, 0.712478],
    [0.275637, 0.961262, -0.386036, 0.458924, 0.800228,
     -0.361102, -0.365034, 0.493216, 0.702207],
    [0.292372, 0.956305, -0.371778, 0.484275, 0.791997,
     -0.376077, -0.335319, 0.517778, 0.691399],
    [0.309017, 0.951057, -0.356763, 0.509037, 0.783327,
     -0.389754, -0.304329, 0.541266, 0.680078],
    [0.325568, 0.945519, -0.341008, 0.533178, 0.774231,
     -0.402081, -0.272150, 0.563635, 0.668267],
    [0.342020, 0.939693, -0.324533, 0.556670, 0.764720,
     -0.413008, -0.238872, 0.584843, 0.655990],
    [0.358368, 0.933580, -0.307359, 0.579484, 0.754804,
     -0.422491, -0.204589, 0.604851, 0.643273],
    [0.374607, 0.927184, -0.289505, 0.601592, 0.744496,
     -0.430488, -0.169397, 0.623624, 0.630141],
    [0.390731, 0.920505, -0.270994, 0.622967, 0.733809,
     -0.436964, -0.133395, 0.641130, 0.616621],
    [0.406737, 0.913545, -0.251848, 0.643582, 0.722755,
     -0.441884, -0.096684, 0.657339, 0.602741],
    [0.422618, 0.906308, -0.232091, 0.663414, 0.711348,
     -0.445222, -0.059368, 0.672226, 0.588528],
    [0.438371, 0.898794, -0.211746, 0.682437, 0.699602,
     -0.446953, -0.021550, 0.685769, 0.574011],
    [0.453990, 0.891007, -0.190839, 0.700629, 0.687531,
     -0.447059, 0.016662, 0.697950, 0.559220],
    [0.469472, 0.882948, -0.169395, 0.717968, 0.675150,
     -0.445524, 0.055160, 0.708753, 0.544183],
    [0.484810, 0.874620, -0.147439, 0.734431, 0.662474,
     -0.442340, 0.093837, 0.718167, 0.528929],
    [0.500000, 0.866025, -0.125000, 0.750000, 0.649519,
     -0.437500, 0.132583, 0.726184, 0.513490],
    [0.515038, 0.857167, -0.102104, 0.764655, 0.636300,
     -0.431004, 0.171288, 0.732801, 0.497894],
    [0.529919, 0.848048, -0.078778, 0.778378, 0.622833,
     -0.422856, 0.209843, 0.738017, 0.482171],
    [0.544639, 0.838671, -0.055052, 0.791154, 0.609135,
     -0.413066, 0.248140, 0.741835, 0.466352],
    [0.559193, 0.829038, -0.030955, 0.802965, 0.595222,
     -0.401645, 0.286069, 0.744262, 0.450467],
    [0.573576, 0.819152, -0.006515, 0.813798, 0.581112,
     -0.388612, 0.323524, 0.745308, 0.434544],
    [0.587785, 0.809017, 0.018237, 0.823639, 0.566821,
     -0.373991, 0.360397, 0.744989, 0.418613],
    [0.601815, 0.798636, 0.043272, 0.832477, 0.552367,
     -0.357807, 0.396584, 0.743320, 0.402704],
    [0.615661, 0.788011, 0.068559, 0.840301, 0.537768,
     -0.340093, 0.431982, 0.740324, 0.386845],
    [0.629320, 0.777146, 0.094066, 0.847101, 0.523041,
     -0.320884, 0.466490, 0.736025, 0.371063],
    [0.642788, 0.766044, 0.119764, 0.852869, 0.508205,
     -0.300221, 0.500009, 0.730451, 0.355387],
    [0.656059, 0.754710, 0.145620, 0.857597, 0.493276,
     -0.278147, 0.532443, 0.723633, 0.339844],
    [0.669131, 0.743145, 0.171604, 0.861281, 0.478275,
     -0.254712, 0.563700, 0.715605, 0.324459],
    [0.681998, 0.731354, 0.197683, 0.863916, 0.463218,
     -0.229967, 0.593688, 0.706405, 0.309259],
    [0.694658, 0.719340, 0.223825, 0.865498, 0.448125,
     -0.203969, 0.622322, 0.696073, 0.294267],
    [0.707107, 0.707107, 0.250000, 0.866025, 0.433013,
     -0.176777, 0.649519, 0.684653, 0.279508],
    [0.719340, 0.694658, 0.276175, 0.865498, 0.417901,
     -0.148454, 0.675199, 0.672190, 0.265005],
    [0.731354, 0.681998, 0.302317, 0.863916, 0.402807,
     -0.119068, 0.699288, 0.658734, 0.250778],
    [0.743145, 0.669131, 0.328396, 0.861281, 0.387751,
     -0.088686, 0.721714, 0.644334, 0.236850],
    [0.754710, 0.656059, 0.354380, 0.857597, 0.372749,
     -0.057383, 0.742412, 0.629044, 0.223238],
    [0.766044, 0.642788, 0.380236, 0.852869, 0.357821,
     -0.025233, 0.761319, 0.612921, 0.209963],
    [0.777146, 0.629320, 0.405934, 0.847101, 0.342984,
     0.007686, 0.778379, 0.596021, 0.197040],
    [0.788011, 0.615661, 0.431441, 0.840301, 0.328257,
     0.041294, 0.793541, 0.578405, 0.184487],
    [0.798636, 0.601815, 0.456728, 0.832477, 0.313658,
     0.075508, 0.806757, 0.560132, 0.172317],
    [0.809017, 0.587785, 0.481763, 0.823639, 0.299204,
     0.110246, 0.817987, 0.541266, 0.160545],
    [0.819152, 0.573576, 0.506515, 0.813798, 0.284914,
     0.145420, 0.827194, 0.521871, 0.149181],
    [0.829038, 0.559193, 0.530955, 0.802965, 0.270803,
     0.180944, 0.834347, 0.502011, 0.138237],
    [0.838671, 0.544639, 0.555052, 0.791154, 0.256891,
     0.216730, 0.839422, 0.481753, 0.127722],
    [0.848048, 0.529919, 0.578778, 0.778378, 0.243192,
     0.252688, 0.842399, 0.461164, 0.117644],
    [0.857167, 0.515038, 0.602104, 0.764655, 0.229726,
     0.288728, 0.843265, 0.440311, 0.108009],
    [0.866025, 0.500000, 0.625000, 0.750000, 0.216506,
     0.324760, 0.842012, 0.419263, 0.098821],
    [0.874620, 0.484810, 0.647439, 0.734431, 0.203551,
     0.360692, 0.838638, 0.398086, 0.090085],
    [0.882948, 0.469472, 0.669395, 0.717968, 0.190875,
     0.396436, 0.833145, 0.376851, 0.081803],
    [0.891007, 0.453990, 0.690839, 0.700629, 0.178494,
     0.431899, 0.825544, 0.355623, 0.073974],
    [0.898794, 0.438371, 0.711746, 0.682437, 0.166423,
     0.466993, 0.815850, 0.334472, 0.066599],
    [0.906308, 0.422618, 0.732091, 0.663414, 0.154678,
     0.501627, 0.804083, 0.313464, 0.059674],
    [0.913545, 0.406737, 0.751848, 0.643582, 0.143271,
     0.535715, 0.790270, 0.292666, 0.053196],
    [0.920505, 0.390731, 0.770994, 0.622967, 0.132217,
     0.569169, 0.774442, 0.272143, 0.047160],
    [0.927184, 0.374607, 0.789505, 0.601592, 0.121529,
     0.601904, 0.756637, 0.251960, 0.041559],
    [0.933580, 0.358368, 0.807359, 0.579484, 0.111222,
     0.633837, 0.736898, 0.232180, 0.036385],
    [0.939693, 0.342020, 0.824533, 0.556670, 0.101306,
     0.664885, 0.715274, 0.212865, 0.031630],
    [0.945519, 0.325568, 0.841008, 0.533178, 0.091794,
     0.694969, 0.691816, 0.194075, 0.027281],
    [0.951057, 0.309017, 0.856763, 0.509037, 0.082698,
     0.724012, 0.666583, 0.175868, 0.023329],
    [0.956305, 0.292372, 0.871778, 0.484275, 0.074029,
     0.751940, 0.639639, 0.158301, 0.019758],
    [0.961262, 0.275637, 0.886036, 0.458924, 0.065797,
     0.778680, 0.611050, 0.141427, 0.016556],
    [0.965926, 0.258819, 0.899519, 0.433013, 0.058013,
     0.804164, 0.580889, 0.125300, 0.013707],
    [0.970296, 0.241922, 0.912211, 0.406574, 0.050685,
     0.828326, 0.549233, 0.109969, 0.011193],
    [0.974370, 0.224951, 0.924096, 0.379641, 0.043823,
     0.851105, 0.516162, 0.095481, 0.008999],
    [0.978148, 0.207912, 0.935159, 0.352244, 0.037436,
     0.872441, 0.481759, 0.081880, 0.007105],
    [0.981627, 0.190809, 0.945388, 0.324419, 0.031530,
     0.892279, 0.446114, 0.069209, 0.005492],
    [0.984808, 0.173648, 0.954769, 0.296198, 0.026114,
     0.910569, 0.409317, 0.057505, 0.004140],
    [0.987688, 0.156434, 0.963292, 0.267617, 0.021193,
     0.927262, 0.371463, 0.046806, 0.003026],
    [0.990268, 0.139173, 0.970946, 0.238709, 0.016774,
     0.942316, 0.332649, 0.037143, 0.002131],
    [0.992546, 0.121869, 0.977722, 0.209511, 0.012862,
     0.955693, 0.292976, 0.028547, 0.001431],
    [0.994522, 0.104528, 0.983611, 0.180057, 0.009462,
     0.967356, 0.252544, 0.021043, 0.000903],
    [0.996195, 0.087156, 0.988606, 0.150384, 0.006578,
     0.977277, 0.211460, 0.014654, 0.000523],
    [0.997564, 0.069756, 0.992701, 0.120527, 0.004214,
     0.985429, 0.169828, 0.009400, 0.000268],
    [0.998630, 0.052336, 0.995891, 0.090524, 0.002372,
     0.991791, 0.127757, 0.005297, 0.000113],
    [0.999391, 0.034899, 0.998173, 0.060411, 0.001055,
     0.996348, 0.085356, 0.002357, 0.000034],
    [0.999848, 0.017452, 0.999543, 0.030224, 0.000264,
     0.999086, 0.042733, 0.000590, 0.000004],
    [1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
     1.000000, -0.000000, 0.000000, -0.000000],
  ],
];


/** @type {Number} */
exports.SPHERICAL_HARMONICS_AZIMUTH_RESOLUTION =
  exports.SPHERICAL_HARMONICS[0].length;


/** @type {Number} */
exports.SPHERICAL_HARMONICS_ELEVATION_RESOLUTION =
  exports.SPHERICAL_HARMONICS[1].length;


/**
 * The maximum allowed ambisonic order.
 * @type {Number}
 */
exports.SPHERICAL_HARMONICS_MAX_ORDER =
  exports.SPHERICAL_HARMONICS[0][0].length / 2;


/**
 * Pre-computed per-band weighting coefficients for producing energy-preserving
 * Max-Re sources.
 */
exports.MAX_RE_WEIGHTS =
[
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.003236, 1.002156, 0.999152, 0.990038],
  [1.032370, 1.021194, 0.990433, 0.898572],
  [1.062694, 1.040231, 0.979161, 0.799806],
  [1.093999, 1.058954, 0.964976, 0.693603],
  [1.126003, 1.077006, 0.947526, 0.579890],
  [1.158345, 1.093982, 0.926474, 0.458690],
  [1.190590, 1.109437, 0.901512, 0.330158],
  [1.222228, 1.122890, 0.872370, 0.194621],
  [1.252684, 1.133837, 0.838839, 0.052614],
  [1.281987, 1.142358, 0.801199, 0.000000],
  [1.312073, 1.150207, 0.760839, 0.000000],
  [1.343011, 1.157424, 0.717799, 0.000000],
  [1.374649, 1.163859, 0.671999, 0.000000],
  [1.406809, 1.169354, 0.623371, 0.000000],
  [1.439286, 1.173739, 0.571868, 0.000000],
  [1.471846, 1.176837, 0.517465, 0.000000],
  [1.504226, 1.178465, 0.460174, 0.000000],
  [1.536133, 1.178438, 0.400043, 0.000000],
  [1.567253, 1.176573, 0.337165, 0.000000],
  [1.597247, 1.172695, 0.271688, 0.000000],
  [1.625766, 1.166645, 0.203815, 0.000000],
  [1.652455, 1.158285, 0.133806, 0.000000],
  [1.676966, 1.147506, 0.061983, 0.000000],
  [1.699006, 1.134261, 0.000000, 0.000000],
  [1.720224, 1.119789, 0.000000, 0.000000],
  [1.741631, 1.104810, 0.000000, 0.000000],
  [1.763183, 1.089330, 0.000000, 0.000000],
  [1.784837, 1.073356, 0.000000, 0.000000],
  [1.806548, 1.056898, 0.000000, 0.000000],
  [1.828269, 1.039968, 0.000000, 0.000000],
  [1.849952, 1.022580, 0.000000, 0.000000],
  [1.871552, 1.004752, 0.000000, 0.000000],
  [1.893018, 0.986504, 0.000000, 0.000000],
  [1.914305, 0.967857, 0.000000, 0.000000],
  [1.935366, 0.948837, 0.000000, 0.000000],
  [1.956154, 0.929471, 0.000000, 0.000000],
  [1.976625, 0.909790, 0.000000, 0.000000],
  [1.996736, 0.889823, 0.000000, 0.000000],
  [2.016448, 0.869607, 0.000000, 0.000000],
  [2.035721, 0.849175, 0.000000, 0.000000],
  [2.054522, 0.828565, 0.000000, 0.000000],
  [2.072818, 0.807816, 0.000000, 0.000000],
  [2.090581, 0.786964, 0.000000, 0.000000],
  [2.107785, 0.766051, 0.000000, 0.000000],
  [2.124411, 0.745115, 0.000000, 0.000000],
  [2.140439, 0.724196, 0.000000, 0.000000],
  [2.155856, 0.703332, 0.000000, 0.000000],
  [2.170653, 0.682561, 0.000000, 0.000000],
  [2.184823, 0.661921, 0.000000, 0.000000],
  [2.198364, 0.641445, 0.000000, 0.000000],
  [2.211275, 0.621169, 0.000000, 0.000000],
  [2.223562, 0.601125, 0.000000, 0.000000],
  [2.235230, 0.581341, 0.000000, 0.000000],
  [2.246289, 0.561847, 0.000000, 0.000000],
  [2.256751, 0.542667, 0.000000, 0.000000],
  [2.266631, 0.523826, 0.000000, 0.000000],
  [2.275943, 0.505344, 0.000000, 0.000000],
  [2.284707, 0.487239, 0.000000, 0.000000],
  [2.292939, 0.469528, 0.000000, 0.000000],
  [2.300661, 0.452225, 0.000000, 0.000000],
  [2.307892, 0.435342, 0.000000, 0.000000],
  [2.314654, 0.418888, 0.000000, 0.000000],
  [2.320969, 0.402870, 0.000000, 0.000000],
  [2.326858, 0.387294, 0.000000, 0.000000],
  [2.332343, 0.372164, 0.000000, 0.000000],
  [2.337445, 0.357481, 0.000000, 0.000000],
  [2.342186, 0.343246, 0.000000, 0.000000],
  [2.346585, 0.329458, 0.000000, 0.000000],
  [2.350664, 0.316113, 0.000000, 0.000000],
  [2.354442, 0.303208, 0.000000, 0.000000],
  [2.357937, 0.290738, 0.000000, 0.000000],
  [2.361168, 0.278698, 0.000000, 0.000000],
  [2.364152, 0.267080, 0.000000, 0.000000],
  [2.366906, 0.255878, 0.000000, 0.000000],
  [2.369446, 0.245082, 0.000000, 0.000000],
  [2.371786, 0.234685, 0.000000, 0.000000],
  [2.373940, 0.224677, 0.000000, 0.000000],
  [2.375923, 0.215048, 0.000000, 0.000000],
  [2.377745, 0.205790, 0.000000, 0.000000],
  [2.379421, 0.196891, 0.000000, 0.000000],
  [2.380959, 0.188342, 0.000000, 0.000000],
  [2.382372, 0.180132, 0.000000, 0.000000],
  [2.383667, 0.172251, 0.000000, 0.000000],
  [2.384856, 0.164689, 0.000000, 0.000000],
  [2.385945, 0.157435, 0.000000, 0.000000],
  [2.386943, 0.150479, 0.000000, 0.000000],
  [2.387857, 0.143811, 0.000000, 0.000000],
  [2.388694, 0.137421, 0.000000, 0.000000],
  [2.389460, 0.131299, 0.000000, 0.000000],
  [2.390160, 0.125435, 0.000000, 0.000000],
  [2.390801, 0.119820, 0.000000, 0.000000],
  [2.391386, 0.114445, 0.000000, 0.000000],
  [2.391921, 0.109300, 0.000000, 0.000000],
  [2.392410, 0.104376, 0.000000, 0.000000],
  [2.392857, 0.099666, 0.000000, 0.000000],
  [2.393265, 0.095160, 0.000000, 0.000000],
  [2.393637, 0.090851, 0.000000, 0.000000],
  [2.393977, 0.086731, 0.000000, 0.000000],
  [2.394288, 0.082791, 0.000000, 0.000000],
  [2.394571, 0.079025, 0.000000, 0.000000],
  [2.394829, 0.075426, 0.000000, 0.000000],
  [2.395064, 0.071986, 0.000000, 0.000000],
  [2.395279, 0.068699, 0.000000, 0.000000],
  [2.395475, 0.065558, 0.000000, 0.000000],
  [2.395653, 0.062558, 0.000000, 0.000000],
  [2.395816, 0.059693, 0.000000, 0.000000],
  [2.395964, 0.056955, 0.000000, 0.000000],
  [2.396099, 0.054341, 0.000000, 0.000000],
  [2.396222, 0.051845, 0.000000, 0.000000],
  [2.396334, 0.049462, 0.000000, 0.000000],
  [2.396436, 0.047186, 0.000000, 0.000000],
  [2.396529, 0.045013, 0.000000, 0.000000],
  [2.396613, 0.042939, 0.000000, 0.000000],
  [2.396691, 0.040959, 0.000000, 0.000000],
  [2.396761, 0.039069, 0.000000, 0.000000],
  [2.396825, 0.037266, 0.000000, 0.000000],
  [2.396883, 0.035544, 0.000000, 0.000000],
  [2.396936, 0.033901, 0.000000, 0.000000],
  [2.396984, 0.032334, 0.000000, 0.000000],
  [2.397028, 0.030838, 0.000000, 0.000000],
  [2.397068, 0.029410, 0.000000, 0.000000],
  [2.397104, 0.028048, 0.000000, 0.000000],
  [2.397137, 0.026749, 0.000000, 0.000000],
  [2.397167, 0.025509, 0.000000, 0.000000],
  [2.397194, 0.024326, 0.000000, 0.000000],
  [2.397219, 0.023198, 0.000000, 0.000000],
  [2.397242, 0.022122, 0.000000, 0.000000],
  [2.397262, 0.021095, 0.000000, 0.000000],
  [2.397281, 0.020116, 0.000000, 0.000000],
  [2.397298, 0.019181, 0.000000, 0.000000],
  [2.397314, 0.018290, 0.000000, 0.000000],
  [2.397328, 0.017441, 0.000000, 0.000000],
  [2.397341, 0.016630, 0.000000, 0.000000],
  [2.397352, 0.015857, 0.000000, 0.000000],
  [2.397363, 0.015119, 0.000000, 0.000000],
  [2.397372, 0.014416, 0.000000, 0.000000],
  [2.397381, 0.013745, 0.000000, 0.000000],
  [2.397389, 0.013106, 0.000000, 0.000000],
  [2.397396, 0.012496, 0.000000, 0.000000],
  [2.397403, 0.011914, 0.000000, 0.000000],
  [2.397409, 0.011360, 0.000000, 0.000000],
  [2.397414, 0.010831, 0.000000, 0.000000],
  [2.397419, 0.010326, 0.000000, 0.000000],
  [2.397424, 0.009845, 0.000000, 0.000000],
  [2.397428, 0.009387, 0.000000, 0.000000],
  [2.397432, 0.008949, 0.000000, 0.000000],
  [2.397435, 0.008532, 0.000000, 0.000000],
  [2.397438, 0.008135, 0.000000, 0.000000],
  [2.397441, 0.007755, 0.000000, 0.000000],
  [2.397443, 0.007394, 0.000000, 0.000000],
  [2.397446, 0.007049, 0.000000, 0.000000],
  [2.397448, 0.006721, 0.000000, 0.000000],
  [2.397450, 0.006407, 0.000000, 0.000000],
  [2.397451, 0.006108, 0.000000, 0.000000],
  [2.397453, 0.005824, 0.000000, 0.000000],
  [2.397454, 0.005552, 0.000000, 0.000000],
  [2.397456, 0.005293, 0.000000, 0.000000],
  [2.397457, 0.005046, 0.000000, 0.000000],
  [2.397458, 0.004811, 0.000000, 0.000000],
  [2.397459, 0.004586, 0.000000, 0.000000],
  [2.397460, 0.004372, 0.000000, 0.000000],
  [2.397461, 0.004168, 0.000000, 0.000000],
  [2.397461, 0.003974, 0.000000, 0.000000],
  [2.397462, 0.003788, 0.000000, 0.000000],
  [2.397463, 0.003611, 0.000000, 0.000000],
  [2.397463, 0.003443, 0.000000, 0.000000],
  [2.397464, 0.003282, 0.000000, 0.000000],
  [2.397464, 0.003129, 0.000000, 0.000000],
  [2.397465, 0.002983, 0.000000, 0.000000],
  [2.397465, 0.002844, 0.000000, 0.000000],
  [2.397465, 0.002711, 0.000000, 0.000000],
  [2.397466, 0.002584, 0.000000, 0.000000],
  [2.397466, 0.002464, 0.000000, 0.000000],
  [2.397466, 0.002349, 0.000000, 0.000000],
  [2.397466, 0.002239, 0.000000, 0.000000],
  [2.397467, 0.002135, 0.000000, 0.000000],
  [2.397467, 0.002035, 0.000000, 0.000000],
  [2.397467, 0.001940, 0.000000, 0.000000],
  [2.397467, 0.001849, 0.000000, 0.000000],
  [2.397467, 0.001763, 0.000000, 0.000000],
  [2.397467, 0.001681, 0.000000, 0.000000],
  [2.397468, 0.001602, 0.000000, 0.000000],
  [2.397468, 0.001527, 0.000000, 0.000000],
  [2.397468, 0.001456, 0.000000, 0.000000],
  [2.397468, 0.001388, 0.000000, 0.000000],
  [2.397468, 0.001323, 0.000000, 0.000000],
  [2.397468, 0.001261, 0.000000, 0.000000],
  [2.397468, 0.001202, 0.000000, 0.000000],
  [2.397468, 0.001146, 0.000000, 0.000000],
  [2.397468, 0.001093, 0.000000, 0.000000],
  [2.397468, 0.001042, 0.000000, 0.000000],
  [2.397468, 0.000993, 0.000000, 0.000000],
  [2.397468, 0.000947, 0.000000, 0.000000],
  [2.397468, 0.000902, 0.000000, 0.000000],
  [2.397468, 0.000860, 0.000000, 0.000000],
  [2.397468, 0.000820, 0.000000, 0.000000],
  [2.397469, 0.000782, 0.000000, 0.000000],
  [2.397469, 0.000745, 0.000000, 0.000000],
  [2.397469, 0.000710, 0.000000, 0.000000],
  [2.397469, 0.000677, 0.000000, 0.000000],
  [2.397469, 0.000646, 0.000000, 0.000000],
  [2.397469, 0.000616, 0.000000, 0.000000],
  [2.397469, 0.000587, 0.000000, 0.000000],
  [2.397469, 0.000559, 0.000000, 0.000000],
  [2.397469, 0.000533, 0.000000, 0.000000],
  [2.397469, 0.000508, 0.000000, 0.000000],
  [2.397469, 0.000485, 0.000000, 0.000000],
  [2.397469, 0.000462, 0.000000, 0.000000],
  [2.397469, 0.000440, 0.000000, 0.000000],
  [2.397469, 0.000420, 0.000000, 0.000000],
  [2.397469, 0.000400, 0.000000, 0.000000],
  [2.397469, 0.000381, 0.000000, 0.000000],
  [2.397469, 0.000364, 0.000000, 0.000000],
  [2.397469, 0.000347, 0.000000, 0.000000],
  [2.397469, 0.000330, 0.000000, 0.000000],
  [2.397469, 0.000315, 0.000000, 0.000000],
  [2.397469, 0.000300, 0.000000, 0.000000],
  [2.397469, 0.000286, 0.000000, 0.000000],
  [2.397469, 0.000273, 0.000000, 0.000000],
  [2.397469, 0.000260, 0.000000, 0.000000],
  [2.397469, 0.000248, 0.000000, 0.000000],
  [2.397469, 0.000236, 0.000000, 0.000000],
  [2.397469, 0.000225, 0.000000, 0.000000],
  [2.397469, 0.000215, 0.000000, 0.000000],
  [2.397469, 0.000205, 0.000000, 0.000000],
  [2.397469, 0.000195, 0.000000, 0.000000],
  [2.397469, 0.000186, 0.000000, 0.000000],
  [2.397469, 0.000177, 0.000000, 0.000000],
  [2.397469, 0.000169, 0.000000, 0.000000],
  [2.397469, 0.000161, 0.000000, 0.000000],
  [2.397469, 0.000154, 0.000000, 0.000000],
  [2.397469, 0.000147, 0.000000, 0.000000],
  [2.397469, 0.000140, 0.000000, 0.000000],
  [2.397469, 0.000133, 0.000000, 0.000000],
  [2.397469, 0.000127, 0.000000, 0.000000],
  [2.397469, 0.000121, 0.000000, 0.000000],
  [2.397469, 0.000115, 0.000000, 0.000000],
  [2.397469, 0.000110, 0.000000, 0.000000],
  [2.397469, 0.000105, 0.000000, 0.000000],
  [2.397469, 0.000100, 0.000000, 0.000000],
  [2.397469, 0.000095, 0.000000, 0.000000],
  [2.397469, 0.000091, 0.000000, 0.000000],
  [2.397469, 0.000087, 0.000000, 0.000000],
  [2.397469, 0.000083, 0.000000, 0.000000],
  [2.397469, 0.000079, 0.000000, 0.000000],
  [2.397469, 0.000075, 0.000000, 0.000000],
  [2.397469, 0.000071, 0.000000, 0.000000],
  [2.397469, 0.000068, 0.000000, 0.000000],
  [2.397469, 0.000065, 0.000000, 0.000000],
  [2.397469, 0.000062, 0.000000, 0.000000],
  [2.397469, 0.000059, 0.000000, 0.000000],
  [2.397469, 0.000056, 0.000000, 0.000000],
  [2.397469, 0.000054, 0.000000, 0.000000],
  [2.397469, 0.000051, 0.000000, 0.000000],
  [2.397469, 0.000049, 0.000000, 0.000000],
  [2.397469, 0.000046, 0.000000, 0.000000],
  [2.397469, 0.000044, 0.000000, 0.000000],
  [2.397469, 0.000042, 0.000000, 0.000000],
  [2.397469, 0.000040, 0.000000, 0.000000],
  [2.397469, 0.000038, 0.000000, 0.000000],
  [2.397469, 0.000037, 0.000000, 0.000000],
  [2.397469, 0.000035, 0.000000, 0.000000],
  [2.397469, 0.000033, 0.000000, 0.000000],
  [2.397469, 0.000032, 0.000000, 0.000000],
  [2.397469, 0.000030, 0.000000, 0.000000],
  [2.397469, 0.000029, 0.000000, 0.000000],
  [2.397469, 0.000027, 0.000000, 0.000000],
  [2.397469, 0.000026, 0.000000, 0.000000],
  [2.397469, 0.000025, 0.000000, 0.000000],
  [2.397469, 0.000024, 0.000000, 0.000000],
  [2.397469, 0.000023, 0.000000, 0.000000],
  [2.397469, 0.000022, 0.000000, 0.000000],
  [2.397469, 0.000021, 0.000000, 0.000000],
  [2.397469, 0.000020, 0.000000, 0.000000],
  [2.397469, 0.000019, 0.000000, 0.000000],
  [2.397469, 0.000018, 0.000000, 0.000000],
  [2.397469, 0.000017, 0.000000, 0.000000],
  [2.397469, 0.000016, 0.000000, 0.000000],
  [2.397469, 0.000015, 0.000000, 0.000000],
  [2.397469, 0.000015, 0.000000, 0.000000],
  [2.397469, 0.000014, 0.000000, 0.000000],
  [2.397469, 0.000013, 0.000000, 0.000000],
  [2.397469, 0.000013, 0.000000, 0.000000],
  [2.397469, 0.000012, 0.000000, 0.000000],
  [2.397469, 0.000012, 0.000000, 0.000000],
  [2.397469, 0.000011, 0.000000, 0.000000],
  [2.397469, 0.000011, 0.000000, 0.000000],
  [2.397469, 0.000010, 0.000000, 0.000000],
  [2.397469, 0.000010, 0.000000, 0.000000],
  [2.397469, 0.000009, 0.000000, 0.000000],
  [2.397469, 0.000009, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
];


/** @type {Number} */
exports.MAX_RE_WEIGHTS_RESOLUTION = exports.MAX_RE_WEIGHTS.length;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Source model to spatialize an audio buffer.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const Directivity = __webpack_require__(5);
const Attenuation = __webpack_require__(6);
const Encoder = __webpack_require__(1);
const Utils = __webpack_require__(0);


/**
 * @class Source
 * @description Source model to spatialize an audio buffer.
 * @param {ResonanceAudio} scene Associated {@link ResonanceAudio
 * ResonanceAudio} instance.
 * @param {Object} options
 * @param {Float32Array} options.position
 * The source's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.forward
 * The source's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.up
 * The source's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @param {Number} options.minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @param {Number} options.maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @param {string} options.rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 * @param {Number} options.gain Input gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_GAIN DEFAULT_SOURCE_GAIN}.
 * @param {Number} options.alpha Directivity alpha. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @param {Number} options.sharpness Directivity sharpness. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 * @param {Number} options.sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 */
function Source(scene, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Source
   * @instance
   */
  /**
   *
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.position == undefined) {
    options.position = Utils.DEFAULT_POSITION.slice();
  }
  if (options.forward == undefined) {
    options.forward = Utils.DEFAULT_FORWARD.slice();
  }
  if (options.up == undefined) {
    options.up = Utils.DEFAULT_UP.slice();
  }
  if (options.minDistance == undefined) {
    options.minDistance = Utils.DEFAULT_MIN_DISTANCE;
  }
  if (options.maxDistance == undefined) {
    options.maxDistance = Utils.DEFAULT_MAX_DISTANCE;
  }
  if (options.rolloff == undefined) {
    options.rolloff = Utils.DEFAULT_ROLLOFF;
  }
  if (options.gain == undefined) {
    options.gain = Utils.DEFAULT_SOURCE_GAIN;
  }
  if (options.alpha == undefined) {
    options.alpha = Utils.DEFAULT_DIRECTIVITY_ALPHA;
  }
  if (options.sharpness == undefined) {
    options.sharpness = Utils.DEFAULT_DIRECTIVITY_SHARPNESS;
  }
  if (options.sourceWidth == undefined) {
    options.sourceWidth = Utils.DEFAULT_SOURCE_WIDTH;
  }

  // Member variables.
  this._scene = scene;
  this._position = options.position;
  this._forward = options.forward;
  this._up = options.up;
  this._dx = new Float32Array(3);
  this._right = Utils.crossProduct(this._forward, this._up);

  // Create audio nodes.
  let context = scene._context;
  this.input = context.createGain();
  this._directivity = new Directivity(context, {
    alpha: options.alpha,
    sharpness: options.sharpness,
  });
  this._toEarly = context.createGain();
  this._toLate = context.createGain();
  this._attenuation = new Attenuation(context, {
    minDistance: options.minDistance,
    maxDistance: options.maxDistance,
    rolloff: options.rolloff,
  });
  this._encoder = new Encoder(context, {
    ambisonicOrder: scene._ambisonicOrder,
    sourceWidth: options.sourceWidth,
  });

  // Connect nodes.
  this.input.connect(this._toLate);
  this._toLate.connect(scene._room.late.input);

  this.input.connect(this._attenuation.input);
  this._attenuation.output.connect(this._toEarly);
  this._toEarly.connect(scene._room.early.input);

  this._attenuation.output.connect(this._directivity.input);
  this._directivity.output.connect(this._encoder.input);

  this._encoder.output.connect(scene._listener.input);

  // Assign initial conditions.
  this.setPosition(
    options.position[0], options.position[1], options.position[2]);
  this.input.gain.value = options.gain;
};


/**
 * Set source's position (in meters), where origin is the center of
 * the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
Source.prototype.setPosition = function(x, y, z) {
  // Assign new position.
  this._position[0] = x;
  this._position[1] = y;
  this._position[2] = z;

  // Handle far-field effect.
  let distance = this._scene._room.getDistanceOutsideRoom(
    this._position[0], this._position[1], this._position[2]);
    let gain = _computeDistanceOutsideRoom(distance);
  this._toLate.gain.value = gain;
  this._toEarly.gain.value = gain;

  this._update();
};


// Update the source when changing the listener's position.
Source.prototype._update = function() {
  // Compute distance to listener.
  for (let i = 0; i < 3; i++) {
    this._dx[i] = this._position[i] - this._scene._listener.position[i];
  }
  let distance = Math.sqrt(this._dx[0] * this._dx[0] +
    this._dx[1] * this._dx[1] + this._dx[2] * this._dx[2]);
  if (distance > 0) {
    // Normalize direction vector.
    this._dx[0] /= distance;
    this._dx[1] /= distance;
    this._dx[2] /= distance;
  }

  // Compuete angle of direction vector.
  let azimuth = Math.atan2(-this._dx[0], this._dx[2]) *
    Utils.RADIANS_TO_DEGREES;
  let elevation = Math.atan2(this._dx[1], Math.sqrt(this._dx[0] * this._dx[0] +
    this._dx[2] * this._dx[2])) * Utils.RADIANS_TO_DEGREES;

  // Set distance/directivity/direction values.
  this._attenuation.setDistance(distance);
  this._directivity.computeAngle(this._forward, this._dx);
  this._encoder.setDirection(azimuth, elevation);
};


/**
 * Set source's rolloff.
 * @param {string} rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
 */
Source.prototype.setRolloff = function(rolloff) {
  this._attenuation.setRolloff(rolloff);
};


/**
 * Set source's minimum distance (in meters).
 * @param {Number} minDistance
 */
Source.prototype.setMinDistance = function(minDistance) {
  this._attenuation.minDistance = minDistance;
};


/**
 * Set source's maximum distance (in meters).
 * @param {Number} maxDistance
 */
Source.prototype.setMaxDistance = function(maxDistance) {
  this._attenuation.maxDistance = maxDistance;
};


/**
 * Set source's gain (linear).
 * @param {Number} gain
 */
Source.prototype.setGain = function(gain) {
  this.input.gain.value = gain;
};


/**
 * Set the source's orientation using forward and up vectors.
 * @param {Number} forwardX
 * @param {Number} forwardY
 * @param {Number} forwardZ
 * @param {Number} upX
 * @param {Number} upY
 * @param {Number} upZ
 */
Source.prototype.setOrientation = function(forwardX, forwardY, forwardZ,
    upX, upY, upZ) {
  this._forward[0] = forwardX;
  this._forward[1] = forwardY;
  this._forward[2] = forwardZ;
  this._up[0] = upX;
  this._up[1] = upY;
  this._up[2] = upZ;
  this._right = Utils.crossProduct(this._forward, this._up);
};


// TODO(bitllama): Make sure this works with Three.js as intended.
/**
 * Set source's position and orientation using a
 * Three.js modelViewMatrix object.
 * @param {Float32Array} matrix4
 * The Matrix4 representing the object position and rotation in world space.
 */
Source.prototype.setFromMatrix = function(matrix4) {
  this._right[0] = matrix4.elements[0];
  this._right[1] = matrix4.elements[1];
  this._right[2] = matrix4.elements[2];
  this._up[0] = matrix4.elements[4];
  this._up[1] = matrix4.elements[5];
  this._up[2] = matrix4.elements[6];
  this._forward[0] = matrix4.elements[8];
  this._forward[1] = matrix4.elements[9];
  this._forward[2] = matrix4.elements[10];

  // Normalize to remove scaling.
  this._right = Utils.normalizeVector(this._right);
  this._up = Utils.normalizeVector(this._up);
  this._forward = Utils.normalizeVector(this._forward);

  // Update position.
  this.setPosition(
    matrix4.elements[12], matrix4.elements[13], matrix4.elements[14]);
};


/**
 * Set the source width (in degrees). Where 0 degrees is a point source and 360
 * degrees is an omnidirectional source.
 * @param {Number} sourceWidth (in degrees).
 */
Source.prototype.setSourceWidth = function(sourceWidth) {
  this._encoder.setSourceWidth(sourceWidth);
  this.setPosition(this._position[0], this._position[1], this._position[2]);
};


/**
 * Set source's directivity pattern (defined by alpha), where 0 is an
 * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
 * pattern. The sharpness of the pattern is increased exponentially.
 * @param {Number} alpha
 * Determines directivity pattern (0 to 1).
 * @param {Number} sharpness
 * Determines the sharpness of the directivity pattern (1 to Inf).
 */
Source.prototype.setDirectivityPattern = function(alpha, sharpness) {
  this._directivity.setPattern(alpha, sharpness);
  this.setPosition(this._position[0], this._position[1], this._position[2]);
};


/**
 * Determine the distance a source is outside of a room. Attenuate gain going
 * to the reflections and reverb when the source is outside of the room.
 * @param {Number} distance Distance in meters.
 * @return {Number} Gain (linear) of source.
 * @private
 */
function _computeDistanceOutsideRoom(distance) {
  // We apply a linear ramp from 1 to 0 as the source is up to 1m outside.
  let gain = 1;
  if (distance > Utils.EPSILON_FLOAT) {
    gain = 1 - distance / Utils.SOURCE_MAX_OUTSIDE_ROOM_DISTANCE;

    // Clamp gain between 0 and 1.
    gain = Math.max(0, Math.min(1, gain));
  }
  return gain;
}


module.exports = Source;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Directivity/occlusion filter.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class Directivity
 * @description Directivity/occlusion filter.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.alpha
 * Determines directivity pattern (0 to 1). See
 * {@link Directivity#setPattern setPattern} for more details. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @param {Number} options.sharpness
 * Determines the sharpness of the directivity pattern (1 to Inf). See
 * {@link Directivity#setPattern setPattern} for more details. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 */
function Directivity(context, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Directivity
   * @instance
   */
  /**
   * Mono (1-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Directivity
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.alpha == undefined) {
    options.alpha = Utils.DEFAULT_DIRECTIVITY_ALPHA;
  }
  if (options.sharpness == undefined) {
    options.sharpness = Utils.DEFAULT_DIRECTIVITY_SHARPNESS;
  }

  // Create audio node.
  this._context = context;
  this._lowpass = context.createBiquadFilter();

  // Initialize filter coefficients.
  this._lowpass.type = 'lowpass';
  this._lowpass.Q.value = 0;
  this._lowpass.frequency.value = context.sampleRate * 0.5;

  this._cosTheta = 0;
  this.setPattern(options.alpha, options.sharpness);

  // Input/Output proxy.
  this.input = this._lowpass;
  this.output = this._lowpass;
}


/**
 * Compute the filter using the source's forward orientation and the listener's
 * position.
 * @param {Float32Array} forward The source's forward vector.
 * @param {Float32Array} direction The direction from the source to the
 * listener.
 */
Directivity.prototype.computeAngle = function(forward, direction) {
  let forwardNorm = Utils.normalizeVector(forward);
  let directionNorm = Utils.normalizeVector(direction);
  let coeff = 1;
  if (this._alpha > Utils.EPSILON_FLOAT) {
    let cosTheta = forwardNorm[0] * directionNorm[0] +
      forwardNorm[1] * directionNorm[1] + forwardNorm[2] * directionNorm[2];
    coeff = (1 - this._alpha) + this._alpha * cosTheta;
    coeff = Math.pow(Math.abs(coeff), this._sharpness);
  }
  this._lowpass.frequency.value = this._context.sampleRate * 0.5 * coeff;
};


/**
 * Set source's directivity pattern (defined by alpha), where 0 is an
 * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
 * pattern. The sharpness of the pattern is increased exponenentially.
 * @param {Number} alpha
 * Determines directivity pattern (0 to 1).
 * @param {Number} sharpness
 * Determines the sharpness of the directivity pattern (1 to Inf).
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 */
Directivity.prototype.setPattern = function(alpha, sharpness) {
  // Clamp and set values.
  this._alpha = Math.min(1, Math.max(0, alpha));
  this._sharpness = Math.max(1, sharpness);

  // Update angle calculation using new values.
  this.computeAngle([this._cosTheta * this._cosTheta, 0, 0], [1, 0, 0]);
};


module.exports = Directivity;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Distance-based attenuation filter.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class Attenuation
 * @description Distance-based attenuation filter.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @param {Number} options.maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @param {string} options.rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 */
function Attenuation(context, options) {
  // Public variables.
  /**
   * Min. distance (in meters).
   * @member {Number} minDistance
   * @memberof Attenuation
   * @instance
   */
  /**
   * Max. distance (in meters).
   * @member {Number} maxDistance
   * @memberof Attenuation
   * @instance
   */
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Attenuation
   * @instance
   */
  /**
   * Mono (1-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Attenuation
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.minDistance == undefined) {
    options.minDistance = Utils.DEFAULT_MIN_DISTANCE;
  }
  if (options.maxDistance == undefined) {
    options.maxDistance = Utils.DEFAULT_MAX_DISTANCE;
  }
  if (options.rolloff == undefined) {
    options.rolloff = Utils.DEFAULT_ATTENUATION_ROLLOFF;
  }

  // Assign values.
  this.minDistance = options.minDistance;
  this.maxDistance = options.maxDistance;
  this.setRolloff(options.rolloff);

  // Create node.
  this._gainNode = context.createGain();

  // Initialize distance to max distance.
  this.setDistance(options.maxDistance);

  // Input/Output proxy.
  this.input = this._gainNode;
  this.output = this._gainNode;
}


/**
 * Set distance from the listener.
 * @param {Number} distance Distance (in meters).
 */
Attenuation.prototype.setDistance = function(distance) {
  let gain = 1;
  if (this._rolloff == 'logarithmic') {
    if (distance > this.maxDistance) {
      gain = 0;
    } else if (distance > this.minDistance) {
      let range = this.maxDistance - this.minDistance;
      if (range > Utils.EPSILON_FLOAT) {
        // Compute the distance attenuation value by the logarithmic curve
        // "1 / (d + 1)" with an offset of |minDistance|.
        let relativeDistance = distance - this.minDistance;
        let attenuation = 1 / (relativeDistance + 1);
        let attenuationMax = 1 / (range + 1);
        gain = (attenuation - attenuationMax) / (1 - attenuationMax);
      }
    }
  } else if (this._rolloff == 'linear') {
    if (distance > this.maxDistance) {
      gain = 0;
    } else if (distance > this.minDistance) {
      let range = this.maxDistance - this.minDistance;
      if (range > Utils.EPSILON_FLOAT) {
        gain = (this.maxDistance - distance) / range;
      }
    }
  }
  this._gainNode.gain.value = gain;
};


/**
 * Set rolloff.
 * @param {string} rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
 */
Attenuation.prototype.setRolloff = function(rolloff) {
  let isValidModel = ~Utils.ATTENUATION_ROLLOFFS.indexOf(rolloff);
  if (rolloff == undefined || !isValidModel) {
    if (!isValidModel) {
      Utils.log('Invalid rolloff model (\"' + rolloff +
        '\"). Using default: \"' + Utils.DEFAULT_ATTENUATION_ROLLOFF + '\".');
    }
    rolloff = Utils.DEFAULT_ATTENUATION_ROLLOFF;
  } else {
    rolloff = rolloff.toString().toLowerCase();
  }
  this._rolloff = rolloff;
};


module.exports = Attenuation;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Complete room model with early and late reflections.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const LateReflections = __webpack_require__(8);
const EarlyReflections = __webpack_require__(9);
const Utils = __webpack_require__(0);


/**
 * Generate absorption coefficients from material names.
 * @param {Object} materials
 * @return {Object}
 */
function _getCoefficientsFromMaterials(materials) {
  // Initialize coefficients to use defaults.
  let coefficients = {};
  for (let property in Utils.DEFAULT_ROOM_MATERIALS) {
    if (Utils.DEFAULT_ROOM_MATERIALS.hasOwnProperty(property)) {
      coefficients[property] = Utils.ROOM_MATERIAL_COEFFICIENTS[
        Utils.DEFAULT_ROOM_MATERIALS[property]];
    }
  }

  // Sanitize materials.
  if (materials == undefined) {
    materials = {};
    Object.assign(materials, Utils.DEFAULT_ROOM_MATERIALS);
  }

  // Assign coefficients using provided materials.
  for (let property in Utils.DEFAULT_ROOM_MATERIALS) {
    if (Utils.DEFAULT_ROOM_MATERIALS.hasOwnProperty(property) &&
        materials.hasOwnProperty(property)) {
      if (materials[property] in Utils.ROOM_MATERIAL_COEFFICIENTS) {
        coefficients[property] =
          Utils.ROOM_MATERIAL_COEFFICIENTS[materials[property]];
      } else {
        Utils.log('Material \"' + materials[property] + '\" on wall \"' +
          property + '\" not found. Using \"' +
          Utils.DEFAULT_ROOM_MATERIALS[property] + '\".');
      }
    } else {
      Utils.log('Wall \"' + property + '\" is not defined. Default used.');
    }
  }
  return coefficients;
}

/**
 * Sanitize coefficients.
 * @param {Object} coefficients
 * @return {Object}
 */
function _sanitizeCoefficients(coefficients) {
  if (coefficients == undefined) {
    coefficients = {};
  }
  for (let property in Utils.DEFAULT_ROOM_MATERIALS) {
    if (!(coefficients.hasOwnProperty(property))) {
      // If element is not present, use default coefficients.
      coefficients[property] = Utils.ROOM_MATERIAL_COEFFICIENTS[
        Utils.DEFAULT_ROOM_MATERIALS[property]];
    }
  }
  return coefficients;
}

/**
 * Sanitize dimensions.
 * @param {Object} dimensions
 * @return {Object}
 */
function _sanitizeDimensions(dimensions) {
  if (dimensions == undefined) {
    dimensions = {};
  }
  for (let property in Utils.DEFAULT_ROOM_DIMENSIONS) {
    if (!(dimensions.hasOwnProperty(property))) {
      dimensions[property] = Utils.DEFAULT_ROOM_DIMENSIONS[property];
    }
  }
  return dimensions;
}

/**
 * Compute frequency-dependent reverb durations.
 * @param {Object} dimensions
 * @param {Object} coefficients
 * @param {Number} speedOfSound
 * @return {Array}
 */
function _getDurationsFromProperties(dimensions, coefficients, speedOfSound) {
  let durations = new Float32Array(Utils.NUMBER_REVERB_FREQUENCY_BANDS);

  // Sanitize inputs.
  dimensions = _sanitizeDimensions(dimensions);
  coefficients = _sanitizeCoefficients(coefficients);
  if (speedOfSound == undefined) {
    speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }

  // Acoustic constant.
  let k = Utils.TWENTY_FOUR_LOG10 / speedOfSound;

  // Compute volume, skip if room is not present.
  let volume = dimensions.width * dimensions.height * dimensions.depth;
  if (volume < Utils.ROOM_MIN_VOLUME) {
    return durations;
  }

  // Room surface area.
  let leftRightArea = dimensions.width * dimensions.height;
  let floorCeilingArea = dimensions.width * dimensions.depth;
  let frontBackArea = dimensions.depth * dimensions.height;
  let totalArea = 2 * (leftRightArea + floorCeilingArea + frontBackArea);
  for (let i = 0; i < Utils.NUMBER_REVERB_FREQUENCY_BANDS; i++) {
    // Effective absorptive area.
    let absorbtionArea =
      (coefficients.left[i] + coefficients.right[i]) * leftRightArea +
      (coefficients.down[i] + coefficients.up[i]) * floorCeilingArea +
      (coefficients.front[i] + coefficients.back[i]) * frontBackArea;
    let meanAbsorbtionArea = absorbtionArea / totalArea;

    // Compute reverberation using Eyring equation [1].
    // [1] Beranek, Leo L. "Analysis of Sabine and Eyring equations and their
    //     application to concert hall audience and chair absorption." The
    //     Journal of the Acoustical Society of America, Vol. 120, No. 3.
    //     (2006), pp. 1399-1399.
    durations[i] = Utils.ROOM_EYRING_CORRECTION_COEFFICIENT * k * volume /
      (-totalArea * Math.log(1 - meanAbsorbtionArea) + 4 *
      Utils.ROOM_AIR_ABSORPTION_COEFFICIENTS[i] * volume);
  }
  return durations;
}


/**
 * Compute reflection coefficients from absorption coefficients.
 * @param {Object} absorptionCoefficients
 * @return {Object}
 */
function _computeReflectionCoefficients(absorptionCoefficients) {
  let reflectionCoefficients = [];
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      // Compute average absorption coefficient (per wall).
      reflectionCoefficients[property] = 0;
      for (let j = 0; j < Utils.NUMBER_REFLECTION_AVERAGING_BANDS; j++) {
        let bandIndex = j + Utils.ROOM_STARTING_AVERAGING_BAND;
        reflectionCoefficients[property] +=
          absorptionCoefficients[property][bandIndex];
      }
      reflectionCoefficients[property] /=
        Utils.NUMBER_REFLECTION_AVERAGING_BANDS;

      // Convert absorption coefficient to reflection coefficient.
      reflectionCoefficients[property] =
        Math.sqrt(1 - reflectionCoefficients[property]);
    }
  }
  return reflectionCoefficients;
}


/**
 * @class Room
 * @description Model that manages early and late reflections using acoustic
 * properties and listener position relative to a rectangular room.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Float32Array} options.listenerPosition
 * The listener's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Object} options.dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} options.materials Named acoustic materials per wall.
 * Defaults to {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 * @param {Number} options.speedOfSound
 * (in meters/second). Defaults to
 * {@linkcode Utils.DEFAULT_SPEED_OF_SOUND DEFAULT_SPEED_OF_SOUND}.
 */
function Room(context, options) {
  // Public variables.
  /**
   * EarlyReflections {@link EarlyReflections EarlyReflections} submodule.
   * @member {AudioNode} early
   * @memberof Room
   * @instance
   */
  /**
   * LateReflections {@link LateReflections LateReflections} submodule.
   * @member {AudioNode} late
   * @memberof Room
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Room
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.listenerPosition == undefined) {
    options.listenerPosition = Utils.DEFAULT_POSITION.slice();
  }
  if (options.dimensions == undefined) {
    options.dimensions = {};
    Object.assign(options.dimensions, Utils.DEFAULT_ROOM_DIMENSIONS);
  }
  if (options.materials == undefined) {
    options.materials = {};
    Object.assign(options.materials, Utils.DEFAULT_ROOM_MATERIALS);
  }
  if (options.speedOfSound == undefined) {
    options.speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }

  // Sanitize room-properties-related arguments.
  options.dimensions = _sanitizeDimensions(options.dimensions);
  let absorptionCoefficients = _getCoefficientsFromMaterials(options.materials);
  let reflectionCoefficients =
    _computeReflectionCoefficients(absorptionCoefficients);
  let durations = _getDurationsFromProperties(options.dimensions,
    absorptionCoefficients, options.speedOfSound);

  // Construct submodules for early and late reflections.
  this.early = new EarlyReflections(context, {
    dimensions: options.dimensions,
    coefficients: reflectionCoefficients,
    speedOfSound: options.speedOfSound,
    listenerPosition: options.listenerPosition,
  });
  this.late = new LateReflections(context, {
    durations: durations,
  });

  this.speedOfSound = options.speedOfSound;

  // Construct auxillary audio nodes.
  this.output = context.createGain();
  this.early.output.connect(this.output);
  this._merger = context.createChannelMerger(4);

  this.late.output.connect(this._merger, 0, 0);
  this._merger.connect(this.output);
}


/**
 * Set the room's dimensions and wall materials.
 * @param {Object} dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} materials Named acoustic materials per wall. Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 */
Room.prototype.setProperties = function(dimensions, materials) {
  // Compute late response.
  let absorptionCoefficients = _getCoefficientsFromMaterials(materials);
  let durations = _getDurationsFromProperties(dimensions,
    absorptionCoefficients, this.speedOfSound);
  this.late.setDurations(durations);

  // Compute early response.
  this.early.speedOfSound = this.speedOfSound;
  let reflectionCoefficients =
    _computeReflectionCoefficients(absorptionCoefficients);
  this.early.setRoomProperties(dimensions, reflectionCoefficients);
};


/**
 * Set the listener's position (in meters), where origin is the center of
 * the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
Room.prototype.setListenerPosition = function(x, y, z) {
  this.early.speedOfSound = this.speedOfSound;
  this.early.setListenerPosition(x, y, z);

  // Disable room effects if the listener is outside the room boundaries.
  let distance = this.getDistanceOutsideRoom(x, y, z);
  let gain = 1;
  if (distance > Utils.EPSILON_FLOAT) {
    gain = 1 - distance / Utils.LISTENER_MAX_OUTSIDE_ROOM_DISTANCE;

    // Clamp gain between 0 and 1.
    gain = Math.max(0, Math.min(1, gain));
  }
  this.output.gain.value = gain;
};


/**
 * Compute distance outside room of provided position (in meters).
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {Number}
 * Distance outside room (in meters). Returns 0 if inside room.
 */
Room.prototype.getDistanceOutsideRoom = function(x, y, z) {
  let dx = Math.max(0, -this.early._halfDimensions.width - x,
    x - this.early._halfDimensions.width);
    let dy = Math.max(0, -this.early._halfDimensions.height - y,
    y - this.early._halfDimensions.height);
    let dz = Math.max(0, -this.early._halfDimensions.depth - z,
    z - this.early._halfDimensions.depth);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};


module.exports = Room;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Late reverberation filter for Ambisonic content.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class LateReflections
 * @description Late-reflections reverberation filter for Ambisonic content.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Array} options.durations
 * Multiband RT60 durations (in seconds) for each frequency band, listed as
 * {@linkcode Utils.DEFAULT_REVERB_FREQUENCY_BANDS
 * FREQUDEFAULT_REVERB_FREQUENCY_BANDSENCY_BANDS}. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_DURATIONS DEFAULT_REVERB_DURATIONS}.
 * @param {Number} options.predelay Pre-delay (in milliseconds). Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_PREDELAY DEFAULT_REVERB_PREDELAY}.
 * @param {Number} options.gain Output gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_GAIN DEFAULT_REVERB_GAIN}.
 * @param {Number} options.bandwidth Bandwidth (in octaves) for each frequency
 * band. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_BANDWIDTH DEFAULT_REVERB_BANDWIDTH}.
 * @param {Number} options.tailonset Length (in milliseconds) of impulse
 * response to apply a half-Hann window. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_TAIL_ONSET DEFAULT_REVERB_TAIL_ONSET}.
 */
function LateReflections(context, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof LateReflections
   * @instance
   */
  /**
   * Mono (1-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof LateReflections
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.durations == undefined) {
    options.durations = Utils.DEFAULT_REVERB_DURATIONS.slice();
  }
  if (options.predelay == undefined) {
    options.predelay = Utils.DEFAULT_REVERB_PREDELAY;
  }
  if (options.gain == undefined) {
    options.gain = Utils.DEFAULT_REVERB_GAIN;
  }
  if (options.bandwidth == undefined) {
    options.bandwidth = Utils.DEFAULT_REVERB_BANDWIDTH;
  }
  if (options.tailonset == undefined) {
    options.tailonset = Utils.DEFAULT_REVERB_TAIL_ONSET;
  }

  // Assign pre-computed variables.
  let delaySecs = options.predelay / 1000;
  this._bandwidthCoeff = options.bandwidth * Utils.LOG2_DIV2;
  this._tailonsetSamples = options.tailonset / 1000;

  // Create nodes.
  this._context = context;
  this.input = context.createGain();
  this._predelay = context.createDelay(delaySecs);
  this._convolver = context.createConvolver();
  this.output = context.createGain();

  // Set reverb attenuation.
  this.output.gain.value = options.gain;

  // Disable normalization.
  this._convolver.normalize = false;

  // Connect nodes.
  this.input.connect(this._predelay);
  this._predelay.connect(this._convolver);
  this._convolver.connect(this.output);

  // Compute IR using RT60 values.
  this.setDurations(options.durations);
}


/**
 * Re-compute a new impulse response by providing Multiband RT60 durations.
 * @param {Array} durations
 * Multiband RT60 durations (in seconds) for each frequency band, listed as
 * {@linkcode Utils.DEFAULT_REVERB_FREQUENCY_BANDS
 * DEFAULT_REVERB_FREQUENCY_BANDS}.
 */
LateReflections.prototype.setDurations = function(durations) {
  if (durations.length !== Utils.NUMBER_REVERB_FREQUENCY_BANDS) {
    Utils.log('Warning: invalid number of RT60 values provided to reverb.');
    return;
  }

  // Compute impulse response.
  let durationsSamples =
    new Float32Array(Utils.NUMBER_REVERB_FREQUENCY_BANDS);
    let sampleRate = this._context.sampleRate;

  for (let i = 0; i < durations.length; i++) {
    // Clamp within suitable range.
    durations[i] =
      Math.max(0, Math.min(Utils.DEFAULT_REVERB_MAX_DURATION, durations[i]));

    // Convert seconds to samples.
    durationsSamples[i] = Math.round(durations[i] * sampleRate *
      Utils.DEFAULT_REVERB_DURATION_MULTIPLIER);
  };

  // Determine max RT60 length in samples.
  let durationsSamplesMax = 0;
  for (let i = 0; i < durationsSamples.length; i++) {
    if (durationsSamples[i] > durationsSamplesMax) {
      durationsSamplesMax = durationsSamples[i];
    }
  }

  // Skip this step if there is no reverberation to compute.
  if (durationsSamplesMax < 1) {
    durationsSamplesMax = 1;
  }

  // Create impulse response buffer.
  let buffer = this._context.createBuffer(1, durationsSamplesMax, sampleRate);
  let bufferData = buffer.getChannelData(0);

  // Create noise signal (computed once, referenced in each band's routine).
  let noiseSignal = new Float32Array(durationsSamplesMax);
  for (let i = 0; i < durationsSamplesMax; i++) {
    noiseSignal[i] = Math.random() * 2 - 1;
  }

  // Compute the decay rate per-band and filter the decaying noise signal.
  for (let i = 0; i < Utils.NUMBER_REVERB_FREQUENCY_BANDS; i++) {
    // Compute decay rate.
    let decayRate = -Utils.LOG1000 / durationsSamples[i];

    // Construct a standard one-zero, two-pole bandpass filter:
    // H(z) = (b0 * z^0 + b1 * z^-1 + b2 * z^-2) / (1 + a1 * z^-1 + a2 * z^-2)
    let omega = Utils.TWO_PI *
      Utils.DEFAULT_REVERB_FREQUENCY_BANDS[i] / sampleRate;
    let sinOmega = Math.sin(omega);
    let alpha = sinOmega * Math.sinh(this._bandwidthCoeff * omega / sinOmega);
    let a0CoeffReciprocal = 1 / (1 + alpha);
    let b0Coeff = alpha * a0CoeffReciprocal;
    let a1Coeff = -2 * Math.cos(omega) * a0CoeffReciprocal;
    let a2Coeff = (1 - alpha) * a0CoeffReciprocal;

    // We optimize since b2 = -b0, b1 = 0.
    // Update equation for two-pole bandpass filter:
    //   u[n] = x[n] - a1 * x[n-1] - a2 * x[n-2]
    //   y[n] = b0 * (u[n] - u[n-2])
    let um1 = 0;
    let um2 = 0;
    for (let j = 0; j < durationsSamples[i]; j++) {
      // Exponentially-decaying white noise.
      let x = noiseSignal[j] * Math.exp(decayRate * j);

      // Filter signal with bandpass filter and add to output.
      let u = x - a1Coeff * um1 - a2Coeff * um2;
      bufferData[j] += b0Coeff * (u - um2);

      // Update coefficients.
      um2 = um1;
      um1 = u;
    }
  }

  // Create and apply half of a Hann window to the beginning of the
  // impulse response.
  let halfHannLength =
    Math.round(this._tailonsetSamples);
  for (let i = 0; i < Math.min(bufferData.length, halfHannLength); i++) {
    let halfHann =
      0.5 * (1 - Math.cos(Utils.TWO_PI * i / (2 * halfHannLength - 1)));
      bufferData[i] *= halfHann;
  }
  this._convolver.buffer = buffer;
};


module.exports = LateReflections;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Ray-tracing-based early reflections model.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class EarlyReflections
 * @description Ray-tracing-based early reflections model.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Object} options.dimensions
 * Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} options.coefficients
 * Frequency-independent reflection coeffs per wall. Defaults to
 * {@linkcode Utils.DEFAULT_REFLECTION_COEFFICIENTS
 * DEFAULT_REFLECTION_COEFFICIENTS}.
 * @param {Number} options.speedOfSound
 * (in meters / second). Defaults to {@linkcode Utils.DEFAULT_SPEED_OF_SOUND
 * DEFAULT_SPEED_OF_SOUND}.
 * @param {Float32Array} options.listenerPosition
 * (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 */
function EarlyReflections(context, options) {
  // Public variables.
  /**
   * The room's speed of sound (in meters/second).
   * @member {Number} speedOfSound
   * @memberof EarlyReflections
   * @instance
   */
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof EarlyReflections
   * @instance
   */
  /**
   * First-order ambisonic (4-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof EarlyReflections
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.speedOfSound == undefined) {
    options.speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }
  if (options.listenerPosition == undefined) {
    options.listenerPosition = Utils.DEFAULT_POSITION.slice();
  }
  if (options.coefficients == undefined) {
    options.coefficients = {};
    Object.assign(options.coefficients, Utils.DEFAULT_REFLECTION_COEFFICIENTS);
  }

  // Assign room's speed of sound.
  this.speedOfSound = options.speedOfSound;

  // Create nodes.
  this.input = context.createGain();
  this.output = context.createGain();
  this._lowpass = context.createBiquadFilter();
  this._delays = {};
  this._gains = {}; // gainPerWall = (ReflectionCoeff / Attenuation)
  this._inverters = {}; // 3 of these are needed for right/back/down walls.
  this._merger = context.createChannelMerger(4); // First-order encoding only.

  // Connect audio graph for each wall reflection.
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      this._delays[property] =
        context.createDelay(Utils.MAX_DURATION);
      this._gains[property] = context.createGain();
    }
  }
  this._inverters.right = context.createGain();
  this._inverters.down = context.createGain();
  this._inverters.back = context.createGain();

  // Initialize lowpass filter.
  this._lowpass.type = 'lowpass';
  this._lowpass.frequency.value = Utils.DEFAULT_REFLECTION_CUTOFF_FREQUENCY;
  this._lowpass.Q.value = 0;

  // Initialize encoder directions, set delay times and gains to 0.
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      this._delays[property].delayTime.value = 0;
      this._gains[property].gain.value = 0;
    }
  }

  // Initialize inverters for opposite walls ('right', 'down', 'back' only).
  this._inverters.right.gain.value = -1;
  this._inverters.down.gain.value = -1;
  this._inverters.back.gain.value = -1;

  // Connect nodes.
  this.input.connect(this._lowpass);
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      this._lowpass.connect(this._delays[property]);
      this._delays[property].connect(this._gains[property]);
      this._gains[property].connect(this._merger, 0, 0);
    }
  }

  // Connect gains to ambisonic channel output.
  // Left: [1 1 0 0]
  // Right: [1 -1 0 0]
  // Up: [1 0 1 0]
  // Down: [1 0 -1 0]
  // Front: [1 0 0 1]
  // Back: [1 0 0 -1]
  this._gains.left.connect(this._merger, 0, 1);

  this._gains.right.connect(this._inverters.right);
  this._inverters.right.connect(this._merger, 0, 1);

  this._gains.up.connect(this._merger, 0, 2);

  this._gains.down.connect(this._inverters.down);
  this._inverters.down.connect(this._merger, 0, 2);

  this._gains.front.connect(this._merger, 0, 3);

  this._gains.back.connect(this._inverters.back);
  this._inverters.back.connect(this._merger, 0, 3);
  this._merger.connect(this.output);

  // Initialize.
  this._listenerPosition = options.listenerPosition;
  this.setRoomProperties(options.dimensions, options.coefficients);
}


/**
 * Set the listener's position (in meters),
 * where [0,0,0] is the center of the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
EarlyReflections.prototype.setListenerPosition = function(x, y, z) {
  // Assign listener position.
  this._listenerPosition = [x, y, z];

  // Determine distances to each wall.
  let distances = {
    left: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.width + x) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    right: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.width - x) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    front: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.depth + z) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    back: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.depth - z) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    down: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.height + y) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    up: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.height - y) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
  };

  // Assign delay & attenuation values using distances.
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      // Compute and assign delay (in seconds).
      let delayInSecs = distances[property] / this.speedOfSound;
      this._delays[property].delayTime.value = delayInSecs;

      // Compute and assign gain, uses logarithmic rolloff: "g = R / (d + 1)"
      let attenuation = this._coefficients[property] / distances[property];
      this._gains[property].gain.value = attenuation;
    }
  }
};


/**
 * Set the room's properties which determines the characteristics of
 * reflections.
 * @param {Object} dimensions
 * Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} coefficients
 * Frequency-independent reflection coeffs per wall. Defaults to
 * {@linkcode Utils.DEFAULT_REFLECTION_COEFFICIENTS
 * DEFAULT_REFLECTION_COEFFICIENTS}.
 */
EarlyReflections.prototype.setRoomProperties = function(dimensions,
                                                        coefficients) {
  if (dimensions == undefined) {
    dimensions = {};
    Object.assign(dimensions, Utils.DEFAULT_ROOM_DIMENSIONS);
  }
  if (coefficients == undefined) {
    coefficients = {};
    Object.assign(coefficients, Utils.DEFAULT_REFLECTION_COEFFICIENTS);
  }
  this._coefficients = coefficients;

  // Sanitize dimensions and store half-dimensions.
  this._halfDimensions = {};
  this._halfDimensions.width = dimensions.width * 0.5;
  this._halfDimensions.height = dimensions.height * 0.5;
  this._halfDimensions.depth = dimensions.depth * 0.5;

  // Update listener position with new room properties.
  this.setListenerPosition(this._listenerPosition[0],
    this._listenerPosition[1], this._listenerPosition[2]);
};


module.exports = EarlyReflections;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Primary namespace for ResonanceAudio library.
 * @author Andrew Allen <bitllama@google.com>
 */

 


// Main module.
exports.ResonanceAudio = __webpack_require__(11);


// Testable Submodules.
exports.ResonanceAudio.Attenuation = __webpack_require__(6);
exports.ResonanceAudio.Directivity = __webpack_require__(5);
exports.ResonanceAudio.EarlyReflections = __webpack_require__(9);
exports.ResonanceAudio.Encoder = __webpack_require__(1);
exports.ResonanceAudio.LateReflections = __webpack_require__(8);
exports.ResonanceAudio.Listener = __webpack_require__(2);
exports.ResonanceAudio.Room = __webpack_require__(7);
exports.ResonanceAudio.Source = __webpack_require__(4);
exports.ResonanceAudio.Tables = __webpack_require__(3);
exports.ResonanceAudio.Utils = __webpack_require__(0);
exports.ResonanceAudio.Version = __webpack_require__(13);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file ResonanceAudio library name space and common utilities.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const Listener = __webpack_require__(2);
const Source = __webpack_require__(4);
const Room = __webpack_require__(7);
const Encoder = __webpack_require__(1);
const Utils = __webpack_require__(0);


/**
 * @class ResonanceAudio
 * @description Main class for managing sources, room and listener models.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic Order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Float32Array} options.listenerPosition
 * The listener's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.listenerForward
 * The listener's initial forward vector.
 * Defaults to {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.listenerUp
 * The listener's initial up vector.
 * Defaults to {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @param {Object} options.dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} options.materials Named acoustic materials per wall.
 * Defaults to {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 * @param {Number} options.speedOfSound
 * (in meters/second). Defaults to
 * {@linkcode Utils.DEFAULT_SPEED_OF_SOUND DEFAULT_SPEED_OF_SOUND}.
 */
function ResonanceAudio(context, options) {
  // Public variables.
  /**
   * Binaurally-rendered stereo (2-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof ResonanceAudio
   * @instance
   */
  /**
   * Ambisonic (multichannel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}
   * (For rendering input soundfields).
   * @member {AudioNode} ambisonicInput
   * @memberof ResonanceAudio
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}
   * (For allowing external rendering / post-processing).
   * @member {AudioNode} ambisonicOutput
   * @memberof ResonanceAudio
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.ambisonicOrder == undefined) {
    options.ambisonicOrder = Utils.DEFAULT_AMBISONIC_ORDER;
  }
  if (options.listenerPosition == undefined) {
    options.listenerPosition = Utils.DEFAULT_POSITION.slice();
  }
  if (options.listenerForward == undefined) {
    options.listenerForward = Utils.DEFAULT_FORWARD.slice();
  }
  if (options.listenerUp == undefined) {
    options.listenerUp = Utils.DEFAULT_UP.slice();
  }
  if (options.dimensions == undefined) {
    options.dimensions = {};
    Object.assign(options.dimensions, Utils.DEFAULT_ROOM_DIMENSIONS);
  }
  if (options.materials == undefined) {
    options.materials = {};
    Object.assign(options.materials, Utils.DEFAULT_ROOM_MATERIALS);
  }
  if (options.speedOfSound == undefined) {
    options.speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }

  // Create member submodules.
  this._ambisonicOrder = Encoder.validateAmbisonicOrder(options.ambisonicOrder);
  this._sources = [];
  this._room = new Room(context, {
    listenerPosition: options.listenerPosition,
    dimensions: options.dimensions,
    materials: options.materials,
    speedOfSound: options.speedOfSound,
  });
  this._listener = new Listener(context, {
    ambisonicOrder: options.ambisonicOrder,
    position: options.listenerPosition,
    forward: options.listenerForward,
    up: options.listenerUp,
  });

  // Create auxillary audio nodes.
  this._context = context;
  this.output = context.createGain();
  this.ambisonicOutput = context.createGain();
  this.ambisonicInput = this._listener.input;

  // Connect audio graph.
  this._room.output.connect(this._listener.input);
  this._listener.output.connect(this.output);
  this._listener.ambisonicOutput.connect(this.ambisonicOutput);
}


/**
 * Create a new source for the scene.
 * @param {Object} options
 * @param {Float32Array} options.position
 * The source's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.forward
 * The source's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.up
 * The source's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @param {Number} options.minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @param {Number} options.maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @param {string} options.rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 * @param {Number} options.gain Input gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_GAIN DEFAULT_SOURCE_GAIN}.
 * @param {Number} options.alpha Directivity alpha. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @param {Number} options.sharpness Directivity sharpness. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 * @param {Number} options.sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 * @return {Source}
 */
ResonanceAudio.prototype.createSource = function(options) {
  // Create a source and push it to the internal sources array, returning
  // the object's reference to the user.
  let source = new Source(this, options);
  this._sources[this._sources.length] = source;
  return source;
};


/**
 * Set the scene's desired ambisonic order.
 * @param {Number} ambisonicOrder Desired ambisonic order.
 */
ResonanceAudio.prototype.setAmbisonicOrder = function(ambisonicOrder) {
  this._ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);
};


/**
 * Set the room's dimensions and wall materials.
 * @param {Object} dimensions Room dimensions (in meters).
 * @param {Object} materials Named acoustic materials per wall.
 */
ResonanceAudio.prototype.setRoomProperties = function(dimensions, materials) {
  this._room.setProperties(dimensions, materials);
};


/**
 * Set the listener's position (in meters), where origin is the center of
 * the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
ResonanceAudio.prototype.setListenerPosition = function(x, y, z) {
  // Update listener position.
  this._listener.position[0] = x;
  this._listener.position[1] = y;
  this._listener.position[2] = z;
  this._room.setListenerPosition(x, y, z);

  // Update sources with new listener position.
  this._sources.forEach(function(element) {
     element._update();
  });
};


/**
 * Set the source's orientation using forward and up vectors.
 * @param {Number} forwardX
 * @param {Number} forwardY
 * @param {Number} forwardZ
 * @param {Number} upX
 * @param {Number} upY
 * @param {Number} upZ
 */
ResonanceAudio.prototype.setListenerOrientation = function(forwardX, forwardY,
  forwardZ, upX, upY, upZ) {
  this._listener.setOrientation(forwardX, forwardY, forwardZ, upX, upY, upZ);
};


/**
 * Set the listener's position and orientation using a Three.js Matrix4 object.
 * @param {Object} matrix
 * The Three.js Matrix4 object representing the listener's world transform.
 */
ResonanceAudio.prototype.setListenerFromMatrix = function(matrix) {
  this._listener.setFromMatrix(matrix);

  // Update the rest of the scene using new listener position.
  this.setListenerPosition(this._listener.position[0],
    this._listener.position[1], this._listener.position[2]);
};


/**
 * Set the speed of sound.
 * @param {Number} speedOfSound
 */
ResonanceAudio.prototype.setSpeedOfSound = function(speedOfSound) {
  this._room.speedOfSound = speedOfSound;
};


module.exports = ResonanceAudio;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Omnitone library common utilities.
 */


/**
 * Omnitone library logging function.
 * @param {any} Message to be printed out.
 */
exports.log = function() {
  window.console.log.apply(window.console, [
    '%c[Omnitone]%c ' + Array.prototype.slice.call(arguments).join(' ') +
        ' %c(@' + performance.now().toFixed(2) + 'ms)',
    'background: #BBDEFB; color: #FF5722; font-weight: 500', 'font-weight: 300',
    'color: #AAA',
  ]);
};


/**
 * Omnitone library error-throwing function.
 * @param {any} Message to be printed out.
 */
exports.throw = function() {
  window.console.error.apply(window.console, [
    '%c[Omnitone]%c ' + Array.prototype.slice.call(arguments).join(' ') +
        ' %c(@' + performance.now().toFixed(2) + 'ms)',
    'background: #C62828; color: #FFEBEE; font-weight: 800', 'font-weight: 400',
    'color: #AAA',
  ]);

  throw new Error(false);
};


// Static temp storage for matrix inversion.
let a00;
let a01;
let a02;
let a03;
let a10;
let a11;
let a12;
let a13;
let a20;
let a21;
let a22;
let a23;
let a30;
let a31;
let a32;
let a33;
let b00;
let b01;
let b02;
let b03;
let b04;
let b05;
let b06;
let b07;
let b08;
let b09;
let b10;
let b11;
let det;


/**
 * A 4x4 matrix inversion utility. This does not handle the case when the
 * arguments are not proper 4x4 matrices.
 * @param {Float32Array} out   The inverted result.
 * @param {Float32Array} a     The source matrix.
 * @return {Float32Array} out
 */
exports.invertMatrix4 = function(out, a) {
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  a30 = a[12];
  a31 = a[13];
  a32 = a[14];
  a33 = a[15];
  b00 = a00 * a11 - a01 * a10;
  b01 = a00 * a12 - a02 * a10;
  b02 = a00 * a13 - a03 * a10;
  b03 = a01 * a12 - a02 * a11;
  b04 = a01 * a13 - a03 * a11;
  b05 = a02 * a13 - a03 * a12;
  b06 = a20 * a31 - a21 * a30;
  b07 = a20 * a32 - a22 * a30;
  b08 = a20 * a33 - a23 * a30;
  b09 = a21 * a32 - a22 * a31;
  b10 = a21 * a33 - a23 * a31;
  b11 = a22 * a33 - a23 * a32;
  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
};


/**
 * Check if a value is defined in the ENUM dictionary.
 * @param {Object} enumDictionary - ENUM dictionary.
 * @param {Number|String} entryValue - a value to probe.
 * @return {Boolean}
 */
exports.isDefinedENUMEntry = function(enumDictionary, entryValue) {
  for (let enumKey in enumDictionary) {
    if (entryValue === enumDictionary[enumKey]) {
      return true;
    }
  }
  return false;
};


/**
 * Check if the given object is an instance of BaseAudioContext.
 * @param {AudioContext} context - A context object to be checked.
 * @return {Boolean}
 */
exports.isAudioContext = function(context) {
  // TODO(hoch): Update this when BaseAudioContext is available for all
  // browsers.
  return context instanceof AudioContext ||
    context instanceof OfflineAudioContext;
};


/**
 * Check if the given object is a valid AudioBuffer.
 * @param {Object} audioBuffer An AudioBuffer object to be checked.
 * @return {Boolean}
 */
exports.isAudioBuffer = function(audioBuffer) {
  return audioBuffer instanceof AudioBuffer;
};


/**
 * Perform channel-wise merge on multiple AudioBuffers. The sample rate and
 * the length of buffers to be merged must be identical.
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer[]} bufferList - An array of AudioBuffers to be merged
 * channel-wise.
 * @return {AudioBuffer} - A single merged AudioBuffer.
 */
exports.mergeBufferListByChannel = function(context, bufferList) {
  const bufferLength = bufferList[0].length;
  const bufferSampleRate = bufferList[0].sampleRate;
  let bufferNumberOfChannel = 0;

  for (let i = 0; i < bufferList.length; ++i) {
    if (bufferNumberOfChannel > 32) {
      exports.throw('Utils.mergeBuffer: Number of channels cannot exceed 32.' +
          '(got ' + bufferNumberOfChannel + ')');
    }
    if (bufferLength !== bufferList[i].length) {
      exports.throw('Utils.mergeBuffer: AudioBuffer lengths are ' +
          'inconsistent. (expected ' + bufferLength + ' but got ' +
          bufferList[i].length + ')');
    }
    if (bufferSampleRate !== bufferList[i].sampleRate) {
      exports.throw('Utils.mergeBuffer: AudioBuffer sample rates are ' +
          'inconsistent. (expected ' + bufferSampleRate + ' but got ' +
          bufferList[i].sampleRate + ')');
    }
    bufferNumberOfChannel += bufferList[i].numberOfChannels;
  }

  const buffer = context.createBuffer(bufferNumberOfChannel,
                                      bufferLength,
                                      bufferSampleRate);
  let destinationChannelIndex = 0;
  for (let i = 0; i < bufferList.length; ++i) {
    for (let j = 0; j < bufferList[i].numberOfChannels; ++j) {
      buffer.getChannelData(destinationChannelIndex++).set(
          bufferList[i].getChannelData(j));
    }
  }

  return buffer;
};


/**
 * Perform channel-wise split by the given channel count. For example,
 * 1 x AudioBuffer(8) -> splitBuffer(context, buffer, 2) -> 4 x AudioBuffer(2).
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer} audioBuffer - An AudioBuffer to be splitted.
 * @param {Number} splitBy - Number of channels to be splitted.
 * @return {AudioBuffer[]} - An array of splitted AudioBuffers.
 */
exports.splitBufferbyChannel = function(context, audioBuffer, splitBy) {
  if (audioBuffer.numberOfChannels <= splitBy) {
    exports.throw('Utils.splitBuffer: Insufficient number of channels. (' +
        audioBuffer.numberOfChannels + ' splitted by ' + splitBy + ')');
  }

  let bufflerList = [];
  let sourceChannelIndex = 0;
  const numberOfSplittedBuffer =
      Math.ceil(audioBuffer.numberOfChannels / splitBy);
  for (let i = 0; i < numberOfSplittedBuffer; ++i) {
    let buffer = context.createBuffer(splitBy,
                                      audioBuffer.length,
                                      audioBuffer.sampleRate);
    for (let j = 0; j < splitBy; ++j) {
      if (sourceChannelIndex < audioBuffer.numberOfChannels) {
        buffer.getChannelData(j).set(
          audioBuffer.getChannelData(sourceChannelIndex++));
      }
    }
    bufflerList.push(buffer);
  }

  return bufferList;
};


/**
 * Converts Base64-encoded string to ArrayBuffer.
 * @param {string} base64String - Base64-encdoed string.
 * @return {ArrayByuffer} Converted ArrayBuffer object.
 */
exports.getArrayBufferFromBase64String = function(base64String) {
  let binaryString = window.atob(base64String);
  let byteArray = new Uint8Array(binaryString.length);
  byteArray.forEach(
    (value, index) => byteArray[index] = binaryString.charCodeAt(index));
  return byteArray.buffer;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Streamlined AudioBuffer loader.
 */




const Utils = __webpack_require__(0);

/**
 * @typedef {string} BufferDataType
 */

/**
 * Buffer data type for ENUM.
 * @enum {BufferDataType}
 */
const BufferDataType = {
  /** @type {string} The data contains Base64-encoded string.. */
  BASE64: 'base64',
  /** @type {string} The data is a URL for audio file. */
  URL: 'url',
};


/**
 * BufferList object mananges the async loading/decoding of multiple
 * AudioBuffers from multiple URLs.
 * @constructor
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {string[]} bufferData - An ordered list of URLs.
 * @param {Object} options - Options
 * @param {string} [options.dataType='base64'] - BufferDataType specifier.
 * @param {Boolean} [options.verbose=false] - Log verbosity. |true| prints the
 * individual message from each URL and AudioBuffer.
 */
function BufferList(context, bufferData, options) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('BufferList: Invalid BaseAudioContext.');

  this._options = {
    dataType: BufferDataType.BASE64,
    verbose: false,
  };

  if (options) {
    if (options.dataType &&
        Utils.isDefinedENUMEntry(BufferDataType, options.dataType)) {
      this._options.dataType = options.dataType;
    }
    if (options.verbose) {
      this._options.verbose = Boolean(options.verbose);
    }
  }

  this._bufferList = [];
  this._bufferData = this._options.dataType === BufferDataType.BASE64
      ? bufferData
      : bufferData.slice(0);
  this._numberOfTasks = this._bufferData.length;

  this._resolveHandler = null;
  this._rejectHandler = new Function();
}


/**
 * Starts AudioBuffer loading tasks.
 * @return {Promise<AudioBuffer[]>} The promise resolves with an array of
 * AudioBuffer.
 */
BufferList.prototype.load = function() {
  return new Promise(this._promiseGenerator.bind(this));
};


/**
 * Promise argument generator. Internally starts multiple async loading tasks.
 * @private
 * @param {function} resolve Promise resolver.
 * @param {function} reject Promise reject.
 */
BufferList.prototype._promiseGenerator = function(resolve, reject) {
  if (typeof resolve !== 'function') {
    Utils.throw('BufferList: Invalid Promise resolver.');
  } else {
    this._resolveHandler = resolve;
  }

  if (typeof reject === 'function') {
    this._rejectHandler = reject;
  }

  for (let i = 0; i < this._bufferData.length; ++i) {
    this._options.dataType === BufferDataType.BASE64
        ? this._launchAsyncLoadTask(i)
        : this._launchAsyncLoadTaskXHR(i);
  }
};


/**
 * Run async loading task for Base64-encoded string.
 * @private
 * @param {Number} taskId Task ID number from the ordered list |bufferData|.
 */
BufferList.prototype._launchAsyncLoadTask = function(taskId) {
  const that = this;
  this._context.decodeAudioData(
      Utils.getArrayBufferFromBase64String(this._bufferData[taskId]),
      function(audioBuffer) {
        that._updateProgress(taskId, audioBuffer);
      },
      function(errorMessage) {
        that._updateProgress(taskId, null);
        const message = 'BufferList: decoding ArrayByffer("' + taskId +
            '" from Base64-encoded data failed. (' + errorMessage + ')';
        Utils.throw(message);
        that._rejectHandler(message);
      });
};


/**
 * Run async loading task via XHR for audio file URLs.
 * @private
 * @param {Number} taskId Task ID number from the ordered list |bufferData|.
 */
BufferList.prototype._launchAsyncLoadTaskXHR = function(taskId) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', this._bufferData[taskId]);
  xhr.responseType = 'arraybuffer';

  const that = this;
  xhr.onload = function() {
    if (xhr.status === 200) {
      that._context.decodeAudioData(
          xhr.response,
          function(audioBuffer) {
            that._updateProgress(taskId, audioBuffer);
          },
          function(errorMessage) {
            that._updateProgress(taskId, null);
            const message = 'BufferList: decoding "' +
                that._bufferData[taskId] + '" failed. (' + errorMessage + ')';
            Utils.throw(message);
            that._rejectHandler(message);
          });
    } else {
      const message = 'BufferList: XHR error while loading "' +
          that._bufferData[taskId] + '(' + xhr.statusText + ')';
      Utils.throw(message);
      that._rejectHandler(message);
    }
  };

  xhr.onerror = function(event) {
    Utils.throw(
        'BufferList: XHR network failed on loading "' +
        that._bufferData[taskId] + '".');
    that._updateProgress(taskId, null);
    that._rejectHandler();
  };

  xhr.send();
};


/**
 * Updates the overall progress on loading tasks.
 * @param {Number} taskId Task ID number.
 * @param {AudioBuffer} audioBuffer Decoded AudioBuffer object.
 */
BufferList.prototype._updateProgress = function(taskId, audioBuffer) {
  this._bufferList[taskId] = audioBuffer;

  if (this._options.verbose) {
    let messageString = this._options.dataType === BufferDataType.BASE64
        ? 'ArrayBuffer(' + taskId + ') from Base64-encoded HRIR'
        : '"' + this._bufferData[taskId] + '"';
    Utils.log('BufferList: ' + messageString + ' successfully loaded.');
  }

  if (--this._numberOfTasks === 0) {
    let messageString = this._options.dataType === BufferDataType.BASE64
        ? this._bufferData.length + ' AudioBuffers from Base64-encoded HRIRs'
        : this._bufferData.length + ' files via XHR';
    Utils.log('BufferList: ' + messageString + ' loaded successfully.');
    this._resolveHandler(this._bufferList);
  }
};


module.exports = BufferList;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file An audio channel router to resolve different channel layouts between
 * browsers.
 */




/**
 * @typedef {Number[]} ChannelMap
 */

/**
 * Channel map dictionary ENUM.
 * @enum {ChannelMap}
 */
const ChannelMap = {
  /** @type {Number[]} - ACN channel map for Chrome and FireFox. (FFMPEG) */
  DEFAULT: [0, 1, 2, 3],
  /** @type {Number[]} - Safari's 4-channel map for AAC codec. */
  SAFARI: [2, 0, 1, 3],
  /** @type {Number[]} - ACN > FuMa conversion map. */
  FUMA: [0, 3, 1, 2],
};


/**
 * Channel router for FOA stream.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number[]} channelMap - Routing destination array.
 */
function FOARouter(context, channelMap) {
  this._context = context;

  this._splitter = this._context.createChannelSplitter(4);
  this._merger = this._context.createChannelMerger(4);

  // input/output proxy.
  this.input = this._splitter;
  this.output = this._merger;

  this.setChannelMap(channelMap || ChannelMap.DEFAULT);
}


/**
 * Sets channel map.
 * @param {Number[]} channelMap - A new channel map for FOA stream.
 */
FOARouter.prototype.setChannelMap = function(channelMap) {
  if (!Array.isArray(channelMap)) {
    return;
  }

  this._channelMap = channelMap;
  this._splitter.disconnect();
  this._splitter.connect(this._merger, 0, this._channelMap[0]);
  this._splitter.connect(this._merger, 1, this._channelMap[1]);
  this._splitter.connect(this._merger, 2, this._channelMap[2]);
  this._splitter.connect(this._merger, 3, this._channelMap[3]);
};


/**
 * Static channel map ENUM.
 * @static
 * @type {ChannelMap}
 */
FOARouter.ChannelMap = ChannelMap;


module.exports = FOARouter;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Sound field rotator for first-order-ambisonics decoding.
 */




/**
 * First-order-ambisonic decoder based on gain node network.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 */
function FOARotator(context) {
  this._context = context;

  this._splitter = this._context.createChannelSplitter(4);
  this._inY = this._context.createGain();
  this._inZ = this._context.createGain();
  this._inX = this._context.createGain();
  this._m0 = this._context.createGain();
  this._m1 = this._context.createGain();
  this._m2 = this._context.createGain();
  this._m3 = this._context.createGain();
  this._m4 = this._context.createGain();
  this._m5 = this._context.createGain();
  this._m6 = this._context.createGain();
  this._m7 = this._context.createGain();
  this._m8 = this._context.createGain();
  this._outY = this._context.createGain();
  this._outZ = this._context.createGain();
  this._outX = this._context.createGain();
  this._merger = this._context.createChannelMerger(4);

  // ACN channel ordering: [1, 2, 3] => [-Y, Z, -X]
  // Y (from channel 1)
  this._splitter.connect(this._inY, 1);
  // Z (from channel 2)
  this._splitter.connect(this._inZ, 2);
  // X (from channel 3)
  this._splitter.connect(this._inX, 3);
  this._inY.gain.value = -1;
  this._inX.gain.value = -1;

  // Apply the rotation in the world space.
  // |Y|   | m0  m3  m6 |   | Y * m0 + Z * m3 + X * m6 |   | Yr |
  // |Z| * | m1  m4  m7 | = | Y * m1 + Z * m4 + X * m7 | = | Zr |
  // |X|   | m2  m5  m8 |   | Y * m2 + Z * m5 + X * m8 |   | Xr |
  this._inY.connect(this._m0);
  this._inY.connect(this._m1);
  this._inY.connect(this._m2);
  this._inZ.connect(this._m3);
  this._inZ.connect(this._m4);
  this._inZ.connect(this._m5);
  this._inX.connect(this._m6);
  this._inX.connect(this._m7);
  this._inX.connect(this._m8);
  this._m0.connect(this._outY);
  this._m1.connect(this._outZ);
  this._m2.connect(this._outX);
  this._m3.connect(this._outY);
  this._m4.connect(this._outZ);
  this._m5.connect(this._outX);
  this._m6.connect(this._outY);
  this._m7.connect(this._outZ);
  this._m8.connect(this._outX);

  // Transform 3: world space to audio space.
  // W -> W (to channel 0)
  this._splitter.connect(this._merger, 0, 0);
  // Y (to channel 1)
  this._outY.connect(this._merger, 0, 1);
  // Z (to channel 2)
  this._outZ.connect(this._merger, 0, 2);
  // X (to channel 3)
  this._outX.connect(this._merger, 0, 3);
  this._outY.gain.value = -1;
  this._outX.gain.value = -1;

  this.setRotationMatrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));

  // input/output proxy.
  this.input = this._splitter;
  this.output = this._merger;
}


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
FOARotator.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  this._m0.gain.value = rotationMatrix3[0];
  this._m1.gain.value = rotationMatrix3[1];
  this._m2.gain.value = rotationMatrix3[2];
  this._m3.gain.value = rotationMatrix3[3];
  this._m4.gain.value = rotationMatrix3[4];
  this._m5.gain.value = rotationMatrix3[5];
  this._m6.gain.value = rotationMatrix3[6];
  this._m7.gain.value = rotationMatrix3[7];
  this._m8.gain.value = rotationMatrix3[8];
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
FOARotator.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  this._m0.gain.value = rotationMatrix4[0];
  this._m1.gain.value = rotationMatrix4[1];
  this._m2.gain.value = rotationMatrix4[2];
  this._m3.gain.value = rotationMatrix4[4];
  this._m4.gain.value = rotationMatrix4[5];
  this._m5.gain.value = rotationMatrix4[6];
  this._m6.gain.value = rotationMatrix4[8];
  this._m7.gain.value = rotationMatrix4[9];
  this._m8.gain.value = rotationMatrix4[10];
};


/**
 * Returns the current 3x3 rotation matrix.
 * @return {Number[]} - A 3x3 rotation matrix. (column-major)
 */
FOARotator.prototype.getRotationMatrix3 = function() {
  return [
    this._m0.gain.value, this._m1.gain.value, this._m2.gain.value,
    this._m3.gain.value, this._m4.gain.value, this._m5.gain.value,
    this._m6.gain.value, this._m7.gain.value, this._m8.gain.value,
  ];
};


/**
 * Returns the current 4x4 rotation matrix.
 * @return {Number[]} - A 4x4 rotation matrix. (column-major)
 */
FOARotator.prototype.getRotationMatrix4 = function() {
  let rotationMatrix4 = new Float32Array(16);
  rotationMatrix4[0] = this._m0.gain.value;
  rotationMatrix4[1] = this._m1.gain.value;
  rotationMatrix4[2] = this._m2.gain.value;
  rotationMatrix4[4] = this._m3.gain.value;
  rotationMatrix4[5] = this._m4.gain.value;
  rotationMatrix4[6] = this._m5.gain.value;
  rotationMatrix4[8] = this._m6.gain.value;
  rotationMatrix4[9] = this._m7.gain.value;
  rotationMatrix4[10] = this._m8.gain.value;
  return rotationMatrix4;
};


module.exports = FOARotator;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file A collection of convolvers. Can be used for the optimized FOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */




/**
 * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
 * @constructor
 * @param {BaseAudioContext} context The associated AudioContext.
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * AudioBuffers for convolution. (i.e. 2 stereo AudioBuffers for FOA)
 */
function FOAConvolver(context, hrirBufferList) {
  this._context = context;

  this._active = false;
  this._isBufferLoaded = false;

  this._buildAudioGraph();

  if (hrirBufferList) {
    this.setHRIRBufferList(hrirBufferList);
  }

  this.enable();
}


/**
 * Build the internal audio graph.
 *
 * @private
 */
FOAConvolver.prototype._buildAudioGraph = function() {
  this._splitterWYZX = this._context.createChannelSplitter(4);
  this._mergerWY = this._context.createChannelMerger(2);
  this._mergerZX = this._context.createChannelMerger(2);
  this._convolverWY = this._context.createConvolver();
  this._convolverZX = this._context.createConvolver();
  this._splitterWY = this._context.createChannelSplitter(2);
  this._splitterZX = this._context.createChannelSplitter(2);
  this._inverter = this._context.createGain();
  this._mergerBinaural = this._context.createChannelMerger(2);
  this._summingBus = this._context.createGain();

  // Group W and Y, then Z and X.
  this._splitterWYZX.connect(this._mergerWY, 0, 0);
  this._splitterWYZX.connect(this._mergerWY, 1, 1);
  this._splitterWYZX.connect(this._mergerZX, 2, 0);
  this._splitterWYZX.connect(this._mergerZX, 3, 1);

  // Create a network of convolvers using splitter/merger.
  this._mergerWY.connect(this._convolverWY);
  this._mergerZX.connect(this._convolverZX);
  this._convolverWY.connect(this._splitterWY);
  this._convolverZX.connect(this._splitterZX);
  this._splitterWY.connect(this._mergerBinaural, 0, 0);
  this._splitterWY.connect(this._mergerBinaural, 0, 1);
  this._splitterWY.connect(this._mergerBinaural, 1, 0);
  this._splitterWY.connect(this._inverter, 1, 0);
  this._inverter.connect(this._mergerBinaural, 0, 1);
  this._splitterZX.connect(this._mergerBinaural, 0, 0);
  this._splitterZX.connect(this._mergerBinaural, 0, 1);
  this._splitterZX.connect(this._mergerBinaural, 1, 0);
  this._splitterZX.connect(this._mergerBinaural, 1, 1);

  // By default, WebAudio's convolver does the normalization based on IR's
  // energy. For the precise convolution, it must be disabled before the buffer
  // assignment.
  this._convolverWY.normalize = false;
  this._convolverZX.normalize = false;

  // For asymmetric degree.
  this._inverter.gain.value = -1;

  // Input/output proxy.
  this.input = this._splitterWYZX;
  this.output = this._summingBus;
};


/**
 * Assigns 2 HRIR AudioBuffers to 2 convolvers: Note that we use 2 stereo
 * convolutions for 4-channel direct convolution. Using mono convolver or
 * 4-channel convolver is not viable because mono convolution wastefully
 * produces the stereo outputs, and the 4-ch convolver does cross-channel
 * convolution. (See Web Audio API spec)
 * @param {AudioBuffer[]} hrirBufferList - An array of stereo AudioBuffers for
 * convolvers.
 */
FOAConvolver.prototype.setHRIRBufferList = function(hrirBufferList) {
  // After these assignments, the channel data in the buffer is immutable in
  // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
  // an exception will be thrown.
  if (this._isBufferLoaded) {
    return;
  }

  this._convolverWY.buffer = hrirBufferList[0];
  this._convolverZX.buffer = hrirBufferList[1];
  this._isBufferLoaded = true;
};


/**
 * Enable FOAConvolver instance. The audio graph will be activated and pulled by
 * the WebAudio engine. (i.e. consume CPU cycle)
 */
FOAConvolver.prototype.enable = function() {
  this._mergerBinaural.connect(this._summingBus);
  this._active = true;
};


/**
 * Disable FOAConvolver instance. The inner graph will be disconnected from the
 * audio destination, thus no CPU cycle will be consumed.
 */
FOAConvolver.prototype.disable = function() {
  this._mergerBinaural.disconnect();
  this._active = false;
};


module.exports = FOAConvolver;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileOverview DEPRECATED at V1. Audio buffer loading utility.
 */



const Utils = __webpack_require__(0);

/**
 * Streamlined audio file loader supports Promise.
 * @param {Object} context          AudioContext
 * @param {Object} audioFileData    Audio file info as [{name, url}]
 * @param {Function} resolve        Resolution handler for promise.
 * @param {Function} reject         Rejection handler for promise.
 * @param {Function} progress       Progress event handler.
 */
function AudioBufferManager(context, audioFileData, resolve, reject, progress) {
  this._context = context;

  this._buffers = new Map();
  this._loadingTasks = {};

  this._resolve = resolve;
  this._reject = reject;
  this._progress = progress;

  // Iterating file loading.
  for (let i = 0; i < audioFileData.length; i++) {
    const fileInfo = audioFileData[i];

    // Check for duplicates filename and quit if it happens.
    if (this._loadingTasks.hasOwnProperty(fileInfo.name)) {
      Utils.log('Duplicated filename when loading: ' + fileInfo.name);
      return;
    }

    // Mark it as pending (0)
    this._loadingTasks[fileInfo.name] = 0;
    this._loadAudioFile(fileInfo);
  }
}

AudioBufferManager.prototype._loadAudioFile = function(fileInfo) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', fileInfo.url);
  xhr.responseType = 'arraybuffer';

  const that = this;
  xhr.onload = function() {
    if (xhr.status === 200) {
      that._context.decodeAudioData(xhr.response,
        function(buffer) {
          // Utils.log('File loaded: ' + fileInfo.url);
          that._done(fileInfo.name, buffer);
        },
        function(message) {
          Utils.log('Decoding failure: '
            + fileInfo.url + ' (' + message + ')');
          that._done(fileInfo.name, null);
        });
    } else {
      Utils.log('XHR Error: ' + fileInfo.url + ' (' + xhr.statusText
        + ')');
      that._done(fileInfo.name, null);
    }
  };

  // TODO: fetch local resources if XHR fails.
  xhr.onerror = function(event) {
    Utils.log('XHR Network failure: ' + fileInfo.url);
    that._done(fileInfo.name, null);
  };

  xhr.send();
};

AudioBufferManager.prototype._done = function(filename, buffer) {
  // Label the loading task.
  this._loadingTasks[filename] = buffer !== null ? 'loaded' : 'failed';

  // A failed task will be a null buffer.
  this._buffers.set(filename, buffer);

  this._updateProgress(filename);
};

AudioBufferManager.prototype._updateProgress = function(filename) {
  let numberOfFinishedTasks = 0;
  let numberOfFailedTask = 0;
  let numberOfTasks = 0;

  for (const task in this._loadingTasks) {
    if (Object.prototype.hasOwnProperty.call(this._loadingTasks, task)) {
      numberOfTasks++;
      if (this._loadingTasks[task] === 'loaded') {
        numberOfFinishedTasks++;
      } else if (this._loadingTasks[task] === 'failed') {
        numberOfFailedTask++;
      }
    }
  }

  if (typeof this._progress === 'function') {
    this._progress(filename, numberOfFinishedTasks, numberOfTasks);
    return;
  }

  if (numberOfFinishedTasks === numberOfTasks) {
    this._resolve(this._buffers);
    return;
  }

  if (numberOfFinishedTasks + numberOfFailedTask === numberOfTasks) {
    this._reject(this._buffers);
    return;
  }
};

module.exports = AudioBufferManager;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file Phase matched filter for first-order-ambisonics decoding.
 */



const Utils = __webpack_require__(0);


// Static parameters.
const CROSSOVER_FREQUENCY = 690;
const GAIN_COEFFICIENTS = [1.4142, 0.8166, 0.8166, 0.8166];


/**
 * Generate the coefficients for dual band filter.
 * @param {Number} crossoverFrequency
 * @param {Number} sampleRate
 * @return {Object} Filter coefficients.
 */
function generateDualBandCoefficients(crossoverFrequency, sampleRate) {
  const k = Math.tan(Math.PI * crossoverFrequency / sampleRate);
  const k2 = k * k;
  const denominator = k2 + 2 * k + 1;

  return {
    lowpassA: [1, 2 * (k2 - 1) / denominator, (k2 - 2 * k + 1) / denominator],
    lowpassB: [k2 / denominator, 2 * k2 / denominator, k2 / denominator],
    hipassA: [1, 2 * (k2 - 1) / denominator, (k2 - 2 * k + 1) / denominator],
    hipassB: [1 / denominator, -2 * 1 / denominator, 1 / denominator],
  };
}


/**
 * FOAPhaseMatchedFilter: A set of filters (LP/HP) with a crossover frequency to
 * compensate the gain of high frequency contents without a phase difference.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 */
function FOAPhaseMatchedFilter(context) {
  this._context = context;

  this._input = this._context.createGain();

  if (!this._context.createIIRFilter) {
    Utils.log('IIR filter is missing. Using Biquad filter instead.');
    this._lpf = this._context.createBiquadFilter();
    this._hpf = this._context.createBiquadFilter();
    this._lpf.frequency.value = CROSSOVER_FREQUENCY;
    this._hpf.frequency.value = CROSSOVER_FREQUENCY;
    this._hpf.type = 'highpass';
  } else {
    const coef = generateDualBandCoefficients(CROSSOVER_FREQUENCY,
                                              this._context.sampleRate);
    this._lpf = this._context.createIIRFilter(coef.lowpassB, coef.lowpassA);
    this._hpf = this._context.createIIRFilter(coef.hipassB, coef.hipassA);
  }

  this._splitterLow = this._context.createChannelSplitter(4);
  this._splitterHigh = this._context.createChannelSplitter(4);
  this._gainHighW = this._context.createGain();
  this._gainHighY = this._context.createGain();
  this._gainHighZ = this._context.createGain();
  this._gainHighX = this._context.createGain();
  this._merger = this._context.createChannelMerger(4);

  this._input.connect(this._hpf);
  this._hpf.connect(this._splitterHigh);
  this._splitterHigh.connect(this._gainHighW, 0);
  this._splitterHigh.connect(this._gainHighY, 1);
  this._splitterHigh.connect(this._gainHighZ, 2);
  this._splitterHigh.connect(this._gainHighX, 3);
  this._gainHighW.connect(this._merger, 0, 0);
  this._gainHighY.connect(this._merger, 0, 1);
  this._gainHighZ.connect(this._merger, 0, 2);
  this._gainHighX.connect(this._merger, 0, 3);

  this._input.connect(this._lpf);
  this._lpf.connect(this._splitterLow);
  this._splitterLow.connect(this._merger, 0, 0);
  this._splitterLow.connect(this._merger, 1, 1);
  this._splitterLow.connect(this._merger, 2, 2);
  this._splitterLow.connect(this._merger, 3, 3);

  // Apply gain correction to hi-passed pressure and velocity components:
  // Inverting sign is necessary as the low-passed and high-passed portion are
  // out-of-phase after the filtering.
  const now = this._context.currentTime;
  this._gainHighW.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[0], now);
  this._gainHighY.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[1], now);
  this._gainHighZ.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[2], now);
  this._gainHighX.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[3], now);

  // Input/output Proxy.
  this.input = this._input;
  this.output = this._merger;
}


module.exports = FOAPhaseMatchedFilter;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file Virtual speaker abstraction for first-order-ambisonics decoding.
 */




/**
 * DEPRECATED at V1: A virtual speaker with ambisonic decoding gain coefficients
 * and HRTF convolution for first-order-ambisonics stream. Note that the
 * subgraph directly connects to context's destination.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} options - Options for speaker.
 * @param {Number[]} options.coefficients - Decoding coefficients for (W,Y,Z,X).
 * @param {AudioBuffer} options.IR - Stereo IR buffer for HRTF convolution.
 * @param {Number} options.gain - Post-gain for the speaker.
 */
function FOAVirtualSpeaker(context, options) {
  if (options.IR.numberOfChannels !== 2) {
    throw new Error('IR does not have 2 channels. cannot proceed.');
  }

  this._active = false;
  this._context = context;

  this._input = this._context.createChannelSplitter(4);
  this._cW = this._context.createGain();
  this._cY = this._context.createGain();
  this._cZ = this._context.createGain();
  this._cX = this._context.createGain();
  this._convolver = this._context.createConvolver();
  this._gain = this._context.createGain();

  this._input.connect(this._cW, 0);
  this._input.connect(this._cY, 1);
  this._input.connect(this._cZ, 2);
  this._input.connect(this._cX, 3);
  this._cW.connect(this._convolver);
  this._cY.connect(this._convolver);
  this._cZ.connect(this._convolver);
  this._cX.connect(this._convolver);
  this._convolver.connect(this._gain);
  this._gain.connect(this._context.destination);

  this.enable();

  this._convolver.normalize = false;
  this._convolver.buffer = options.IR;
  this._gain.gain.value = options.gain;

  // Set gain coefficients for FOA ambisonic streams.
  this._cW.gain.value = options.coefficients[0];
  this._cY.gain.value = options.coefficients[1];
  this._cZ.gain.value = options.coefficients[2];
  this._cX.gain.value = options.coefficients[3];

  // Input proxy. Output directly connects to the destination.
  this.input = this._input;
}


FOAVirtualSpeaker.prototype.enable = function() {
  this._gain.connect(this._context.destination);
  this._active = true;
};


FOAVirtualSpeaker.prototype.disable = function() {
  this._gain.disconnect();
  this._active = false;
};


module.exports = FOAVirtualSpeaker;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file A collection of convolvers. Can be used for the optimized HOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */




/**
 * A convolver network for N-channel HOA stream.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order. (2 or 3)
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
 */
function HOAConvolver(context, ambisonicOrder, hrirBufferList) {
  this._context = context;

  this._active = false;
  this._isBufferLoaded = false;

  // The number of channels K based on the ambisonic order N where K = (N+1)^2.
  this._ambisonicOrder = ambisonicOrder;
  this._numberOfChannels =
      (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);

  this._buildAudioGraph();
  if (hrirBufferList) {
    this.setHRIRBufferList(hrirBufferList);
  }

  this.enable();
}


/**
 * Build the internal audio graph.
 * For TOA convolution:
 *   input -> splitter(16) -[0,1]-> merger(2) -> convolver(2) -> splitter(2)
 *                         -[2,3]-> merger(2) -> convolver(2) -> splitter(2)
 *                         -[4,5]-> ... (6 more, 8 branches total)
 * @private
 */
HOAConvolver.prototype._buildAudioGraph = function() {
  const numberOfStereoChannels = Math.ceil(this._numberOfChannels / 2);

  this._inputSplitter =
      this._context.createChannelSplitter(this._numberOfChannels);
  this._stereoMergers = [];
  this._convolvers = [];
  this._stereoSplitters = [];
  this._positiveIndexSphericalHarmonics = this._context.createGain();
  this._negativeIndexSphericalHarmonics = this._context.createGain();
  this._inverter = this._context.createGain();
  this._binauralMerger = this._context.createChannelMerger(2);
  this._outputGain = this._context.createGain();

  for (let i = 0; i < numberOfStereoChannels; ++i) {
    this._stereoMergers[i] = this._context.createChannelMerger(2);
    this._convolvers[i] = this._context.createConvolver();
    this._stereoSplitters[i] = this._context.createChannelSplitter(2);
    this._convolvers[i].normalize = false;
  }

  for (let l = 0; l <= this._ambisonicOrder; ++l) {
    for (let m = -l; m <= l; m++) {
      // We compute the ACN index (k) of ambisonics channel using the degree (l)
      // and index (m): k = l^2 + l + m
      const acnIndex = l * l + l + m;
      const stereoIndex = Math.floor(acnIndex / 2);

      // Split channels from input into array of stereo convolvers.
      // Then create a network of mergers that produces the stereo output.
      this._inputSplitter.connect(
          this._stereoMergers[stereoIndex], acnIndex, acnIndex % 2);
      this._stereoMergers[stereoIndex].connect(this._convolvers[stereoIndex]);
      this._convolvers[stereoIndex].connect(this._stereoSplitters[stereoIndex]);

      // Positive index (m >= 0) spherical harmonics are symmetrical around the
      // front axis, while negative index (m < 0) spherical harmonics are
      // anti-symmetrical around the front axis. We will exploit this symmetry
      // to reduce the number of convolutions required when rendering to a
      // symmetrical binaural renderer.
      if (m >= 0) {
        this._stereoSplitters[stereoIndex].connect(
            this._positiveIndexSphericalHarmonics, acnIndex % 2);
      } else {
        this._stereoSplitters[stereoIndex].connect(
            this._negativeIndexSphericalHarmonics, acnIndex % 2);
      }
    }
  }

  this._positiveIndexSphericalHarmonics.connect(this._binauralMerger, 0, 0);
  this._positiveIndexSphericalHarmonics.connect(this._binauralMerger, 0, 1);
  this._negativeIndexSphericalHarmonics.connect(this._binauralMerger, 0, 0);
  this._negativeIndexSphericalHarmonics.connect(this._inverter);
  this._inverter.connect(this._binauralMerger, 0, 1);

  // For asymmetric index.
  this._inverter.gain.value = -1;

  // Input/Output proxy.
  this.input = this._inputSplitter;
  this.output = this._outputGain;
};


/**
 * Assigns N HRIR AudioBuffers to N convolvers: Note that we use 2 stereo
 * convolutions for 4-channel direct convolution. Using mono convolver or
 * 4-channel convolver is not viable because mono convolution wastefully
 * produces the stereo outputs, and the 4-ch convolver does cross-channel
 * convolution. (See Web Audio API spec)
 * @param {AudioBuffer[]} hrirBufferList - An array of stereo AudioBuffers for
 * convolvers.
 */
HOAConvolver.prototype.setHRIRBufferList = function(hrirBufferList) {
  // After these assignments, the channel data in the buffer is immutable in
  // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
  // an exception will be thrown.
  if (this._isBufferLoaded) {
    return;
  }

  for (let i = 0; i < hrirBufferList.length; ++i) {
    this._convolvers[i].buffer = hrirBufferList[i];
  }

  this._isBufferLoaded = true;
};


/**
 * Enable HOAConvolver instance. The audio graph will be activated and pulled by
 * the WebAudio engine. (i.e. consume CPU cycle)
 */
HOAConvolver.prototype.enable = function() {
  this._binauralMerger.connect(this._outputGain);
  this._active = true;
};


/**
 * Disable HOAConvolver instance. The inner graph will be disconnected from the
 * audio destination, thus no CPU cycle will be consumed.
 */
HOAConvolver.prototype.disable = function() {
  this._binauralMerger.disconnect();
  this._active = false;
};


module.exports = HOAConvolver;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Sound field rotator for higher-order-ambisonics decoding.
 */




/**
 * Kronecker Delta function.
 * @param {Number} i
 * @param {Number} j
 * @return {Number}
 */
function getKroneckerDelta(i, j) {
  return i === j ? 1 : 0;
}


/**
 * A helper function to allow us to access a matrix array in the same
 * manner, assuming it is a (2l+1)x(2l+1) matrix. [2] uses an odd convention of
 * referring to the rows and columns using centered indices, so the middle row
 * and column are (0, 0) and the upper left would have negative coordinates.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} l
 * @param {Number} i
 * @param {Number} j
 * @param {Number} gainValue
 */
function setCenteredElement(matrix, l, i, j, gainValue) {
  const index = (j + l) * (2 * l + 1) + (i + l);
  // Row-wise indexing.
  matrix[l - 1][index].gain.value = gainValue;
}


/**
 * This is a helper function to allow us to access a matrix array in the same
 * manner, assuming it is a (2l+1) x (2l+1) matrix.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} l
 * @param {Number} i
 * @param {Number} j
 * @return {Number}
 */
function getCenteredElement(matrix, l, i, j) {
  // Row-wise indexing.
  const index = (j + l) * (2 * l + 1) + (i + l);
  return matrix[l - 1][index].gain.value;
}


/**
 * Helper function defined in [2] that is used by the functions U, V, W.
 * This should not be called on its own, as U, V, and W (and their coefficients)
 * select the appropriate matrix elements to access arguments |a| and |b|.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} i
 * @param {Number} a
 * @param {Number} b
 * @param {Number} l
 * @return {Number}
 */
function getP(matrix, i, a, b, l) {
  if (b === l) {
    return getCenteredElement(matrix, 1, i, 1) *
        getCenteredElement(matrix, l - 1, a, l - 1) -
        getCenteredElement(matrix, 1, i, -1) *
        getCenteredElement(matrix, l - 1, a, -l + 1);
  } else if (b === -l) {
    return getCenteredElement(matrix, 1, i, 1) *
        getCenteredElement(matrix, l - 1, a, -l + 1) +
        getCenteredElement(matrix, 1, i, -1) *
        getCenteredElement(matrix, l - 1, a, l - 1);
  } else {
    return getCenteredElement(matrix, 1, i, 0) *
        getCenteredElement(matrix, l - 1, a, b);
  }
}


/**
 * The functions U, V, and W should only be called if the correspondingly
 * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
 * When the coefficient is 0, these would attempt to access matrix elements that
 * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
 * previously completed band rotations. These functions are valid for |l >= 2|.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Number}
 */
function getU(matrix, m, n, l) {
  // Although [1, 2] split U into three cases for m == 0, m < 0, m > 0
  // the actual values are the same for all three cases.
  return getP(matrix, 0, m, n, l);
}


/**
 * The functions U, V, and W should only be called if the correspondingly
 * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
 * When the coefficient is 0, these would attempt to access matrix elements that
 * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
 * previously completed band rotations. These functions are valid for |l >= 2|.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Number}
 */
function getV(matrix, m, n, l) {
  if (m === 0) {
    return getP(matrix, 1, 1, n, l) + getP(matrix, -1, -1, n, l);
  } else if (m > 0) {
    const d = getKroneckerDelta(m, 1);
    return getP(matrix, 1, m - 1, n, l) * Math.sqrt(1 + d) -
        getP(matrix, -1, -m + 1, n, l) * (1 - d);
  } else {
    // Note there is apparent errata in [1,2,2b] dealing with this particular
    // case. [2b] writes it should be P*(1-d)+P*(1-d)^0.5
    // [1] writes it as P*(1+d)+P*(1-d)^0.5, but going through the math by hand,
    // you must have it as P*(1-d)+P*(1+d)^0.5 to form a 2^.5 term, which
    // parallels the case where m > 0.
    const d = getKroneckerDelta(m, -1);
    return getP(matrix, 1, m + 1, n, l) * (1 - d) +
        getP(matrix, -1, -m - 1, n, l) * Math.sqrt(1 + d);
  }
}


/**
 * The functions U, V, and W should only be called if the correspondingly
 * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
 * When the coefficient is 0, these would attempt to access matrix elements that
 * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
 * previously completed band rotations. These functions are valid for |l >= 2|.
 * @param {Number[]} matrix N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Number}
 */
function getW(matrix, m, n, l) {
  // Whenever this happens, w is also 0 so W can be anything.
  if (m === 0) {
    return 0;
  }

  return m > 0 ? getP(matrix, 1, m + 1, n, l) + getP(matrix, -1, -m - 1, n, l) :
                 getP(matrix, 1, m - 1, n, l) - getP(matrix, -1, -m + 1, n, l);
}


/**
 * Calculates the coefficients applied to the U, V, and W functions. Because
 * their equations share many common terms they are computed simultaneously.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Array} 3 coefficients for U, V and W functions.
 */
function computeUVWCoeff(m, n, l) {
  const d = getKroneckerDelta(m, 0);
  const reciprocalDenominator =
      Math.abs(n) === l ? 1 / (2 * l * (2 * l - 1)) : 1 / ((l + n) * (l - n));

  return [
    Math.sqrt((l + m) * (l - m) * reciprocalDenominator),
    0.5 * (1 - 2 * d) * Math.sqrt((1 + d) *
                                  (l + Math.abs(m) - 1) *
                                  (l + Math.abs(m)) *
                                  reciprocalDenominator),
    -0.5 * (1 - d) * Math.sqrt((l - Math.abs(m) - 1) * (l - Math.abs(m))) *
        reciprocalDenominator,
  ];
}


/**
 * Calculates the (2l+1) x (2l+1) rotation matrix for the band l.
 * This uses the matrices computed for band 1 and band l-1 to compute the
 * matrix for band l. |rotations| must contain the previously computed l-1
 * rotation matrices.
 * This implementation comes from p. 5 (6346), Table 1 and 2 in [2] taking
 * into account the corrections from [2b].
 * @param {Number[]} matrix - N matrices of gainNodes, each with where
 * n=1,2,...,N.
 * @param {Number} l
 */
function computeBandRotation(matrix, l) {
  // The lth band rotation matrix has rows and columns equal to the number of
  // coefficients within that band (-l <= m <= l implies 2l + 1 coefficients).
  for (let m = -l; m <= l; m++) {
    for (let n = -l; n <= l; n++) {
      const uvwCoefficients = computeUVWCoeff(m, n, l);

      // The functions U, V, W are only safe to call if the coefficients
      // u, v, w are not zero.
      if (Math.abs(uvwCoefficients[0]) > 0) {
        uvwCoefficients[0] *= getU(matrix, m, n, l);
      }
      if (Math.abs(uvwCoefficients[1]) > 0) {
        uvwCoefficients[1] *= getV(matrix, m, n, l);
      }
      if (Math.abs(uvwCoefficients[2]) > 0) {
        uvwCoefficients[2] *= getW(matrix, m, n, l);
      }

      setCenteredElement(
          matrix, l, m, n,
          uvwCoefficients[0] + uvwCoefficients[1] + uvwCoefficients[2]);
    }
  }
}


/**
 * Compute the HOA rotation matrix after setting the transform matrix.
 * @param {Array} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 */
function computeHOAMatrices(matrix) {
  // We start by computing the 2nd-order matrix from the 1st-order matrix.
  for (let i = 2; i <= matrix.length; i++) {
    computeBandRotation(matrix, i);
  }
}


/**
 * Higher-order-ambisonic decoder based on gain node network. We expect
 * the order of the channels to conform to ACN ordering. Below are the helper
 * methods to compute SH rotation using recursion. The code uses maths described
 * in the following papers:
 *  [1] R. Green, "Spherical Harmonic Lighting: The Gritty Details", GDC 2003,
 *      http://www.research.scea.com/gdc2003/spherical-harmonic-lighting.pdf
 *  [2] J. Ivanic and K. Ruedenberg, "Rotation Matrices for Real
 *      Spherical Harmonics. Direct Determination by Recursion", J. Phys.
 *      Chem., vol. 100, no. 15, pp. 6342-6347, 1996.
 *      http://pubs.acs.org/doi/pdf/10.1021/jp953350u
 *  [2b] Corrections to initial publication:
 *       http://pubs.acs.org/doi/pdf/10.1021/jp9833350
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order.
 */
function HOARotator(context, ambisonicOrder) {
  this._context = context;
  this._ambisonicOrder = ambisonicOrder;

  // We need to determine the number of channels K based on the ambisonic order
  // N where K = (N + 1)^2.
  const numberOfChannels = (ambisonicOrder + 1) * (ambisonicOrder + 1);

  this._splitter = this._context.createChannelSplitter(numberOfChannels);
  this._merger = this._context.createChannelMerger(numberOfChannels);

  // Create a set of per-order rotation matrices using gain nodes.
  this._gainNodeMatrix = [];
  let orderOffset;
  let rows;
  let inputIndex;
  let outputIndex;
  let matrixIndex;
  for (let i = 1; i <= ambisonicOrder; i++) {
    // Each ambisonic order requires a separate (2l + 1) x (2l + 1) rotation
    // matrix. We compute the offset value as the first channel index of the
    // current order where
    //   k_last = l^2 + l + m,
    // and m = -l
    //   k_last = l^2
    orderOffset = i * i;

    // Uses row-major indexing.
    rows = (2 * i + 1);

    this._gainNodeMatrix[i - 1] = [];
    for (let j = 0; j < rows; j++) {
      inputIndex = orderOffset + j;
      for (let k = 0; k < rows; k++) {
        outputIndex = orderOffset + k;
        matrixIndex = j * rows + k;
        this._gainNodeMatrix[i - 1][matrixIndex] = this._context.createGain();
        this._splitter.connect(
            this._gainNodeMatrix[i - 1][matrixIndex], inputIndex);
        this._gainNodeMatrix[i - 1][matrixIndex].connect(
            this._merger, 0, outputIndex);
      }
    }
  }

  // W-channel is not involved in rotation, skip straight to ouput.
  this._splitter.connect(this._merger, 0, 0);

  // Default Identity matrix.
  this.setRotationMatrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));

  // Input/Output proxy.
  this.input = this._splitter;
  this.output = this._merger;
}


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
HOARotator.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  for (let i = 0; i < 9; ++i) {
    this._gainNodeMatrix[0][i].gain.value = rotationMatrix3[i];
  }
  computeHOAMatrices(this._gainNodeMatrix);
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
HOARotator.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  this._gainNodeMatrix[0][0].gain.value = rotationMatrix4[0];
  this._gainNodeMatrix[0][1].gain.value = rotationMatrix4[1];
  this._gainNodeMatrix[0][2].gain.value = rotationMatrix4[2];
  this._gainNodeMatrix[0][3].gain.value = rotationMatrix4[4];
  this._gainNodeMatrix[0][4].gain.value = rotationMatrix4[5];
  this._gainNodeMatrix[0][5].gain.value = rotationMatrix4[6];
  this._gainNodeMatrix[0][6].gain.value = rotationMatrix4[8];
  this._gainNodeMatrix[0][7].gain.value = rotationMatrix4[9];
  this._gainNodeMatrix[0][8].gain.value = rotationMatrix4[10];
  computeHOAMatrices(this._gainNodeMatrix);
};


/**
 * Returns the current 3x3 rotation matrix.
 * @return {Number[]} - A 3x3 rotation matrix. (column-major)
 */
HOARotator.prototype.getRotationMatrix3 = function() {
  let rotationMatrix3 = new Float32Array(9);
  for (let i = 0; i < 9; ++i) {
    rotationMatrix3[i] = this._gainNodeMatrix[0][i].gain.value;
  }
  return rotationMatrix3;
};


/**
 * Returns the current 4x4 rotation matrix.
 * @return {Number[]} - A 4x4 rotation matrix. (column-major)
 */
HOARotator.prototype.getRotationMatrix4 = function() {
  let rotationMatrix4 = new Float32Array(16);
  rotationMatrix4[0] = this._gainNodeMatrix[0][0].gain.value;
  rotationMatrix4[1] = this._gainNodeMatrix[0][1].gain.value;
  rotationMatrix4[2] = this._gainNodeMatrix[0][2].gain.value;
  rotationMatrix4[4] = this._gainNodeMatrix[0][3].gain.value;
  rotationMatrix4[5] = this._gainNodeMatrix[0][4].gain.value;
  rotationMatrix4[6] = this._gainNodeMatrix[0][5].gain.value;
  rotationMatrix4[8] = this._gainNodeMatrix[0][6].gain.value;
  rotationMatrix4[9] = this._gainNodeMatrix[0][7].gain.value;
  rotationMatrix4[10] = this._gainNodeMatrix[0][8].gain.value;
  return rotationMatrix4;
};


/**
 * Get the current ambisonic order.
 * @return {Number}
 */
HOARotator.prototype.getAmbisonicOrder = function() {
  return this._ambisonicOrder;
};


module.exports = HOARotator;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Namespace for Omnitone library.
 */




exports.Omnitone = __webpack_require__(11);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Omnitone library name space and user-facing APIs.
 */




const BufferList = __webpack_require__(1);
const FOAConvolver = __webpack_require__(4);
const FOADecoder = __webpack_require__(12);
const FOAPhaseMatchedFilter = __webpack_require__(6);
const FOARenderer = __webpack_require__(14);
const FOARotator = __webpack_require__(3);
const FOARouter = __webpack_require__(2);
const FOAVirtualSpeaker = __webpack_require__(7);
const HOAConvolver = __webpack_require__(8);
const HOARenderer = __webpack_require__(16);
const HOARotator = __webpack_require__(9);
const Polyfill = __webpack_require__(19);
const Utils = __webpack_require__(0);
const Version = __webpack_require__(20);

// DEPRECATED in V1, in favor of BufferList.
const AudioBufferManager = __webpack_require__(5);


/**
 * Omnitone namespace.
 * @namespace
 */
let Omnitone = {};


/**
 * @typedef {Object} BrowserInfo
 * @property {string} name - Browser name.
 * @property {string} version - Browser version.
 */

/**
 * An object contains the detected browser name and version.
 * @memberOf Omnitone
 * @static {BrowserInfo}
 */
Omnitone.browserInfo = Polyfill.getBrowserInfo();


// DEPRECATED in V1. DO. NOT. USE.
Omnitone.loadAudioBuffers = function(context, speakerData) {
  return new Promise(function(resolve, reject) {
    new AudioBufferManager(context, speakerData, function(buffers) {
      resolve(buffers);
    }, reject);
  });
};


/**
 * Performs the async loading/decoding of multiple AudioBuffers from multiple
 * URLs.
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {string[]} bufferData - An ordered list of URLs.
 * @param {Object} [options] - BufferList options.
 * @param {String} [options.dataType='url'] - BufferList data type.
 * @return {Promise<AudioBuffer[]>} - The promise resolves with an array of
 * AudioBuffer.
 */
Omnitone.createBufferList = function(context, bufferData, options) {
  const bufferList =
      new BufferList(context, bufferData, options || {dataType: 'url'});
  return bufferList.load();
};


/**
 * Perform channel-wise merge on multiple AudioBuffers. The sample rate and
 * the length of buffers to be merged must be identical.
 * @static
 * @function
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer[]} bufferList - An array of AudioBuffers to be merged
 * channel-wise.
 * @return {AudioBuffer} - A single merged AudioBuffer.
 */
Omnitone.mergeBufferListByChannel = Utils.mergeBufferListByChannel;


/**
 * Perform channel-wise split by the given channel count. For example,
 * 1 x AudioBuffer(8) -> splitBuffer(context, buffer, 2) -> 4 x AudioBuffer(2).
 * @static
 * @function
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer} audioBuffer - An AudioBuffer to be splitted.
 * @param {Number} splitBy - Number of channels to be splitted.
 * @return {AudioBuffer[]} - An array of splitted AudioBuffers.
 */
Omnitone.splitBufferbyChannel = Utils.splitBufferbyChannel;


/**
 * Creates an instance of FOA Convolver.
 * @see FOAConvolver
 * @param {BaseAudioContext} context The associated AudioContext.
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * @return {FOAConvolver}
 */
Omnitone.createFOAConvolver = function(context, hrirBufferList) {
  return new FOAConvolver(context, hrirBufferList);
};


/**
 * Create an instance of FOA Router.
 * @see FOARouter
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number[]} channelMap - Routing destination array.
 * @return {FOARouter}
 */
Omnitone.createFOARouter = function(context, channelMap) {
  return new FOARouter(context, channelMap);
};


/**
 * Create an instance of FOA Rotator.
 * @see FOARotator
 * @param {AudioContext} context - Associated AudioContext.
 * @return {FOARotator}
 */
Omnitone.createFOARotator = function(context) {
  return new FOARotator(context);
};


/**
 * Create an instance of FOAPhaseMatchedFilter.
 * @ignore
 * @see FOAPhaseMatchedFilter
 * @param {AudioContext} context - Associated AudioContext.
 * @return {FOAPhaseMatchedFilter}
 */
Omnitone.createFOAPhaseMatchedFilter = function(context) {
  return new FOAPhaseMatchedFilter(context);
};


/**
 * Create an instance of FOAVirtualSpeaker. For parameters, refer the
 * definition of VirtualSpeaker class.
 * @ignore
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} options - Options.
 * @return {FOAVirtualSpeaker}
 */
Omnitone.createFOAVirtualSpeaker = function(context, options) {
  return new FOAVirtualSpeaker(context, options);
};


/**
 * DEPRECATED. Use FOARenderer instance.
 * @see FOARenderer
 * @param {AudioContext} context - Associated AudioContext.
 * @param {DOMElement} videoElement - Video or Audio DOM element to be streamed.
 * @param {Object} options - Options for FOA decoder.
 * @param {String} options.baseResourceUrl - Base URL for resources.
 * (base path for HRIR files)
 * @param {Number} [options.postGain=26.0] - Post-decoding gain compensation.
 * @param {Array} [options.routingDestination]  Custom channel layout.
 * @return {FOADecoder}
 */
Omnitone.createFOADecoder = function(context, videoElement, options) {
  Utils.log('WARNING: FOADecoder is deprecated in favor of FOARenderer.');
  return new FOADecoder(context, videoElement, options);
};


/**
 * Create a FOARenderer, the first-order ambisonic decoder and the optimized
 * binaural renderer.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Array} [config.channelMap] - Custom channel routing map. Useful for
 * handling the inconsistency in browser's multichannel audio decoding.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 * @return {FOARenderer}
 */
Omnitone.createFOARenderer = function(context, config) {
  return new FOARenderer(context, config);
};


/**
 * Creates HOARotator for higher-order ambisonics rotation.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order.
 * @return {HOARotator}
 */
Omnitone.createHOARotator = function(context, ambisonicOrder) {
  return new HOARotator(context, ambisonicOrder);
};


/**
 * Creates HOAConvolver performs the multi-channel convolution for the optmized
 * binaural rendering.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order. (2 or 3)
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
 * @return {HOAConvovler}
 */
Omnitone.createHOAConvolver = function(
    context, ambisonicOrder, hrirBufferList) {
  return new HOAConvolver(context, ambisonicOrder, hrirBufferList);
};


/**
 * Creates HOARenderer for higher-order ambisonic decoding and the optimized
 * binaural rendering.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Number} [config.ambisonicOrder=3] - Ambisonic order.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 * @return {HOARenderer}
 */
Omnitone.createHOARenderer = function(context, config) {
  return new HOARenderer(context, config);
};


// Handler Preload Tasks.
// - Detects the browser information.
// - Prints out the version number.
(function() {
  Utils.log('Version ' + Version + ' (running ' +
      Omnitone.browserInfo.name + ' ' + Omnitone.browserInfo.version +
      ' on ' + Omnitone.browserInfo.platform +')');
  if (Omnitone.browserInfo.name.toLowerCase() === 'safari') {
    Polyfill.patchSafari();
    Utils.log(Omnitone.browserInfo.name + ' detected. Appliying polyfill...');
  }
})();


module.exports = Omnitone;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file Omnitone FOA decoder, DEPRECATED in favor of FOARenderer.
 */



const AudioBufferManager = __webpack_require__(5);
const FOARouter = __webpack_require__(2);
const FOARotator = __webpack_require__(3);
const FOAPhaseMatchedFilter = __webpack_require__(6);
const FOAVirtualSpeaker = __webpack_require__(7);
const FOASpeakerData = __webpack_require__(13);
const Utils = __webpack_require__(0);

// By default, Omnitone fetches IR from the spatial media repository.
const HRTFSET_URL = 'https://raw.githubusercontent.com/GoogleChrome/omnitone/master/build/resources/';

// Post gain compensation value.
let POST_GAIN_DB = 0;


/**
 * Omnitone FOA decoder.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {VideoElement} videoElement - Target video (or audio) element for
 * streaming.
 * @param {Object} options
 * @param {String} options.HRTFSetUrl - Base URL for the cube HRTF sets.
 * @param {Number} options.postGainDB - Post-decoding gain compensation in dB.
 * @param {Number[]} options.channelMap - Custom channel map.
 */
function FOADecoder(context, videoElement, options) {
  this._isDecoderReady = false;
  this._context = context;
  this._videoElement = videoElement;
  this._decodingMode = 'ambisonic';

  this._postGainDB = POST_GAIN_DB;
  this._HRTFSetUrl = HRTFSET_URL;
  this._channelMap = FOARouter.ChannelMap.DEFAULT; // ACN

  if (options) {
    if (options.postGainDB) {
      this._postGainDB = options.postGainDB;
    }
    if (options.HRTFSetUrl) {
      this._HRTFSetUrl = options.HRTFSetUrl;
    }
    if (options.channelMap) {
      this._channelMap = options.channelMap;
    }
  }

  // Rearrange speaker data based on |options.HRTFSetUrl|.
  this._speakerData = [];
  for (let i = 0; i < FOASpeakerData.length; ++i) {
    this._speakerData.push({
      name: FOASpeakerData[i].name,
      url: this._HRTFSetUrl + '/' + FOASpeakerData[i].url,
      coef: FOASpeakerData[i].coef,
    });
  }

  this._tempMatrix4 = new Float32Array(16);
}


/**
 * Initialize and load the resources for the decode.
 * @return {Promise}
 */
FOADecoder.prototype.initialize = function() {
  Utils.log('Initializing... (mode: ' + this._decodingMode + ')');

  // Rerouting channels if necessary.
  let channelMapString = this._channelMap.toString();
  let defaultChannelMapString = FOARouter.ChannelMap.DEFAULT.toString();
  if (channelMapString !== defaultChannelMapString) {
    Utils.log('Remapping channels ([' + defaultChannelMapString + '] -> ['
      + channelMapString + '])');
  }

  this._audioElementSource =
      this._context.createMediaElementSource(this._videoElement);
  this._foaRouter = new FOARouter(this._context, this._channelMap);
  this._foaRotator = new FOARotator(this._context);
  this._foaPhaseMatchedFilter = new FOAPhaseMatchedFilter(this._context);

  this._audioElementSource.connect(this._foaRouter.input);
  this._foaRouter.output.connect(this._foaRotator.input);
  this._foaRotator.output.connect(this._foaPhaseMatchedFilter.input);

  this._foaVirtualSpeakers = [];

  // Bypass signal path.
  this._bypass = this._context.createGain();
  this._audioElementSource.connect(this._bypass);

  // Get the linear amplitude from the post gain option, which is in decibel.
  const postGainLinear = Math.pow(10, this._postGainDB/20);
  Utils.log('Gain compensation: ' + postGainLinear + ' (' + this._postGainDB
    + 'dB)');

  // This returns a promise so developers can use the decoder when it is ready.
  const that = this;
  return new Promise(function(resolve, reject) {
    new AudioBufferManager(that._context, that._speakerData,
      function(buffers) {
        for (let i = 0; i < that._speakerData.length; ++i) {
          that._foaVirtualSpeakers[i] = new FOAVirtualSpeaker(that._context, {
            coefficients: that._speakerData[i].coef,
            IR: buffers.get(that._speakerData[i].name),
            gain: postGainLinear,
          });

          that._foaPhaseMatchedFilter.output.connect(
            that._foaVirtualSpeakers[i].input);
        }

        // Set the decoding mode.
        that.setMode(that._decodingMode);
        that._isDecoderReady = true;
        Utils.log('HRTF IRs are loaded successfully. The decoder is ready.');
        resolve();
      }, reject);
  });
};

/**
 * Set the rotation matrix for the sound field rotation.
 * @param {Array} rotationMatrix      3x3 rotation matrix (row-major
 *                                    representation)
 */
FOADecoder.prototype.setRotationMatrix = function(rotationMatrix) {
  this._foaRotator.setRotationMatrix(rotationMatrix);
};


/**
 * Update the rotation matrix from a Three.js camera object.
 * @param  {Object} cameraMatrix      The Matrix4 obejct of Three.js the camera.
 */
FOADecoder.prototype.setRotationMatrixFromCamera = function(cameraMatrix) {
  // Extract the inner array elements and inverse. (The actual view rotation is
  // the opposite of the camera movement.)
  Utils.invertMatrix4(this._tempMatrix4, cameraMatrix.elements);
  this._foaRotator.setRotationMatrix4(this._tempMatrix4);
};

/**
 * Set the decoding mode.
 * @param {String} mode               Decoding mode. When the mode is 'bypass'
 *                                    the decoder is disabled and bypass the
 *                                    input stream to the output. Setting the
 *                                    mode to 'ambisonic' activates the decoder.
 *                                    When the mode is 'off', all the
 *                                    processing is completely turned off saving
 *                                    the CPU power.
 */
FOADecoder.prototype.setMode = function(mode) {
  if (mode === this._decodingMode) {
    return;
  }

  switch (mode) {
    case 'bypass':
      this._decodingMode = 'bypass';
      for (let i = 0; i < this._foaVirtualSpeakers.length; ++i) {
        this._foaVirtualSpeakers[i].disable();
      }
      this._bypass.connect(this._context.destination);
      break;

    case 'ambisonic':
      this._decodingMode = 'ambisonic';
      for (let i = 0; i < this._foaVirtualSpeakers.length; ++i) {
        this._foaVirtualSpeakers[i].enable();
      }
      this._bypass.disconnect();
      break;

    case 'off':
      this._decodingMode = 'off';
      for (let i = 0; i < this._foaVirtualSpeakers.length; ++i) {
        this._foaVirtualSpeakers[i].disable();
      }
      this._bypass.disconnect();
      break;

    default:
      break;
  }

  Utils.log('Decoding mode changed. (' + mode + ')');
};

module.exports = FOADecoder;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * The data for FOAVirtualSpeaker. Each entry contains the URL for IR files and
 * the gain coefficients for the associated IR files. Note that the order of
 * coefficients follows the ACN channel ordering. (W,Y,Z,X)
 * @type {Object[]}
 */
const FOASpeakerData = [{
  name: 'E35_A135',
  url: 'E35_A135.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, 0.21653, -0.216495],
}, {
  name: 'E35_A-135',
  url: 'E35_A-135.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, 0.21653, -0.216495],
}, {
  name: 'E-35_A135',
  url: 'E-35_A135.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, -0.21653, -0.216495],
}, {
  name: 'E-35_A-135',
  url: 'E-35_A-135.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, -0.21653, -0.216495],
}, {
  name: 'E35_A45',
  url: 'E35_A45.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, 0.21653, 0.216495],
}, {
  name: 'E35_A-45',
  url: 'E35_A-45.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, 0.21653, 0.216495],
}, {
  name: 'E-35_A45',
  url: 'E-35_A45.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, -0.21653, 0.216495],
}, {
  name: 'E-35_A-45',
  url: 'E-35_A-45.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, -0.21653, 0.216495],
}];


module.exports = FOASpeakerData;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file Omnitone FOARenderer. This is user-facing API for the first-order
 * ambisonic decoder and the optimized binaural renderer.
 */



const BufferList = __webpack_require__(1);
const FOAConvolver = __webpack_require__(4);
const FOAHrirBase64 = __webpack_require__(15);
const FOARotator = __webpack_require__(3);
const FOARouter = __webpack_require__(2);
const Utils = __webpack_require__(0);


/**
 * @typedef {string} RenderingMode
 */

/**
 * Rendering mode ENUM.
 * @enum {RenderingMode}
 */
const RenderingMode = {
  /** @type {string} Use ambisonic rendering. */
  AMBISONIC: 'ambisonic',
  /** @type {string} Bypass. No ambisonic rendering. */
  BYPASS: 'bypass',
  /** @type {string} Disable audio output. */
  OFF: 'off',
};


/**
 * Omnitone FOA renderer class. Uses the optimized convolution technique.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Array} [config.channelMap] - Custom channel routing map. Useful for
 * handling the inconsistency in browser's multichannel audio decoding.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 */
function FOARenderer(context, config) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('FOARenderer: Invalid BaseAudioContext.');

  this._config = {
    channelMap: FOARouter.ChannelMap.DEFAULT,
    renderingMode: RenderingMode.AMBISONIC,
  };

  if (config) {
    if (config.channelMap) {
      if (Array.isArray(config.channelMap) && config.channelMap.length === 4) {
        this._config.channelMap = config.channelMap;
      } else {
        Utils.throw(
            'FOARenderer: Invalid channel map. (got ' + config.channelMap
            + ')');
      }
    }

    if (config.hrirPathList) {
      if (Array.isArray(config.hrirPathList) &&
          config.hrirPathList.length === 2) {
        this._config.pathList = config.hrirPathList;
      } else {
        Utils.throw(
            'FOARenderer: Invalid HRIR URLs. It must be an array with ' +
            '2 URLs to HRIR files. (got ' + config.hrirPathList + ')');
      }
    }

    if (config.renderingMode) {
      if (Object.values(RenderingMode).includes(config.renderingMode)) {
        this._config.renderingMode = config.renderingMode;
      } else {
        Utils.log(
            'FOARenderer: Invalid rendering mode order. (got' +
            config.renderingMode + ') Fallbacks to the mode "ambisonic".');
      }
    }
  }

  this._buildAudioGraph();

  this._tempMatrix4 = new Float32Array(16);
  this._isRendererReady = false;
}


/**
 * Builds the internal audio graph.
 * @private
 */
FOARenderer.prototype._buildAudioGraph = function() {
  this.input = this._context.createGain();
  this.output = this._context.createGain();
  this._bypass = this._context.createGain();
  this._foaRouter = new FOARouter(this._context, this._config.channelMap);
  this._foaRotator = new FOARotator(this._context);
  this._foaConvolver = new FOAConvolver(this._context);
  this.input.connect(this._foaRouter.input);
  this.input.connect(this._bypass);
  this._foaRouter.output.connect(this._foaRotator.input);
  this._foaRotator.output.connect(this._foaConvolver.input);
  this._foaConvolver.output.connect(this.output);

  this.input.channelCount = 4;
  this.input.channelCountMode = 'explicit';
  this.input.channelInterpretation = 'discrete';
};


/**
 * Internal callback handler for |initialize| method.
 * @private
 * @param {function} resolve - Resolution handler.
 * @param {function} reject - Rejection handler.
 */
FOARenderer.prototype._initializeCallback = function(resolve, reject) {
  const bufferList = this._config.pathList
      ? new BufferList(this._context, this._config.pathList, {dataType: 'url'})
      : new BufferList(this._context, FOAHrirBase64);
  bufferList.load().then(
      function(hrirBufferList) {
        this._foaConvolver.setHRIRBufferList(hrirBufferList);
        this.setRenderingMode(this._config.renderingMode);
        this._isRendererReady = true;
        Utils.log('FOARenderer: HRIRs loaded successfully. Ready.');
        resolve();
      }.bind(this),
      function() {
        const errorMessage = 'FOARenderer: HRIR loading/decoding failed.';
        Utils.throw(errorMessage);
        reject(errorMessage);
      });
};


/**
 * Initializes and loads the resource for the renderer.
 * @return {Promise}
 */
FOARenderer.prototype.initialize = function() {
  Utils.log(
      'FOARenderer: Initializing... (mode: ' + this._config.renderingMode +
      ')');

  return new Promise(this._initializeCallback.bind(this), function(error) {
    Utils.throw('FOARenderer: Initialization failed. (' + error + ')');
  });
};


/**
 * Set the channel map.
 * @param {Number[]} channelMap - Custom channel routing for FOA stream.
 */
FOARenderer.prototype.setChannelMap = function(channelMap) {
  if (!this._isRendererReady) {
    return;
  }

  if (channelMap.toString() !== this._config.channelMap.toString()) {
    Utils.log(
        'Remapping channels ([' + this._config.channelMap.toString() +
        '] -> [' + channelMap.toString() + ']).');
    this._config.channelMap = channelMap.slice();
    this._foaRouter.setChannelMap(this._config.channelMap);
  }
};


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
FOARenderer.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  if (!this._isRendererReady) {
    return;
  }

  this._foaRotator.setRotationMatrix3(rotationMatrix3);
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
FOARenderer.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  if (!this._isRendererReady) {
    return;
  }

  this._foaRotator.setRotationMatrix4(rotationMatrix4);
};


/**
 * Set the rotation matrix from a Three.js camera object. Depreated in V1, and
 * this exists only for the backward compatiblity. Instead, use
 * |setRotatationMatrix4()| with Three.js |camera.worldMatrix.elements|.
 * @deprecated
 * @param {Object} cameraMatrix - Matrix4 from Three.js |camera.matrix|.
 */
FOARenderer.prototype.setRotationMatrixFromCamera = function(cameraMatrix) {
  if (!this._isRendererReady) {
    return;
  }

  // Extract the inner array elements and inverse. (The actual view rotation is
  // the opposite of the camera movement.)
  Utils.invertMatrix4(this._tempMatrix4, cameraMatrix.elements);
  this._foaRotator.setRotationMatrix4(this._tempMatrix4);
};


/**
 * Set the rendering mode.
 * @param {RenderingMode} mode - Rendering mode.
 *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
 *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
 *    decoding or encoding.
 *  - 'off': all the processing off saving the CPU power.
 */
FOARenderer.prototype.setRenderingMode = function(mode) {
  if (mode === this._config.renderingMode) {
    return;
  }

  switch (mode) {
    case RenderingMode.AMBISONIC:
      this._foaConvolver.enable();
      this._bypass.disconnect();
      break;
    case RenderingMode.BYPASS:
      this._foaConvolver.disable();
      this._bypass.connect(this.output);
      break;
    case RenderingMode.OFF:
      this._foaConvolver.disable();
      this._bypass.disconnect();
      break;
    default:
      Utils.log(
          'FOARenderer: Rendering mode "' + mode + '" is not ' +
          'supported.');
      return;
  }

  this._config.renderingMode = mode;
  Utils.log('FOARenderer: Rendering mode changed. (' + mode + ')');
};


module.exports = FOARenderer;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

const OmnitoneFOAHrirBase64 = [
"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",
];

module.exports = OmnitoneFOAHrirBase64;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file Omnitone HOARenderer. This is user-facing API for the higher-order
 * ambisonic decoder and the optimized binaural renderer.
 */



const BufferList = __webpack_require__(1);
const HOAConvolver = __webpack_require__(8);
const HOARotator = __webpack_require__(9);
const TOAHrirBase64 = __webpack_require__(17);
const SOAHrirBase64 = __webpack_require__(18);
const Utils = __webpack_require__(0);


/**
 * @typedef {string} RenderingMode
 */

/**
 * Rendering mode ENUM.
 * @enum {RenderingMode}
 */
const RenderingMode = {
  /** @type {string} Use ambisonic rendering. */
  AMBISONIC: 'ambisonic',
  /** @type {string} Bypass. No ambisonic rendering. */
  BYPASS: 'bypass',
  /** @type {string} Disable audio output. */
  OFF: 'off',
};


// Currently SOA and TOA are only supported.
const SupportedAmbisonicOrder = [2, 3];


/**
 * Omnitone HOA renderer class. Uses the optimized convolution technique.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Number} [config.ambisonicOrder=3] - Ambisonic order.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 */
function HOARenderer(context, config) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('HOARenderer: Invalid BaseAudioContext.');

  this._config = {
    ambisonicOrder: 3,
    renderingMode: RenderingMode.AMBISONIC,
  };

  if (config && config.ambisonicOrder) {
    if (SupportedAmbisonicOrder.includes(config.ambisonicOrder)) {
      this._config.ambisonicOrder = config.ambisonicOrder;
    } else {
      Utils.log(
          'HOARenderer: Invalid ambisonic order. (got ' +
          config.ambisonicOrder + ') Fallbacks to 3rd-order ambisonic.');
    }
  }

  this._config.numberOfChannels =
      (this._config.ambisonicOrder + 1) * (this._config.ambisonicOrder + 1);
  this._config.numberOfStereoChannels =
      Math.ceil(this._config.numberOfChannels / 2);

  if (config && config.hrirPathList) {
    if (Array.isArray(config.hrirPathList) &&
        config.hrirPathList.length === this._config.numberOfStereoChannels) {
      this._config.pathList = config.hrirPathList;
    } else {
      Utils.throw(
          'HOARenderer: Invalid HRIR URLs. It must be an array with ' +
          this._config.numberOfStereoChannels + ' URLs to HRIR files.' +
          ' (got ' + config.hrirPathList + ')');
    }
  }

  if (config && config.renderingMode) {
    if (Object.values(RenderingMode).includes(config.renderingMode)) {
      this._config.renderingMode = config.renderingMode;
    } else {
      Utils.log(
          'HOARenderer: Invalid rendering mode. (got ' +
          config.renderingMode + ') Fallbacks to "ambisonic".');
    }
  }

  this._buildAudioGraph();

  this._isRendererReady = false;
}


/**
 * Builds the internal audio graph.
 * @private
 */
HOARenderer.prototype._buildAudioGraph = function() {
  this.input = this._context.createGain();
  this.output = this._context.createGain();
  this._bypass = this._context.createGain();
  this._hoaRotator = new HOARotator(this._context, this._config.ambisonicOrder);
  this._hoaConvolver =
      new HOAConvolver(this._context, this._config.ambisonicOrder);
  this.input.connect(this._hoaRotator.input);
  this.input.connect(this._bypass);
  this._hoaRotator.output.connect(this._hoaConvolver.input);
  this._hoaConvolver.output.connect(this.output);

  this.input.channelCount = this._config.numberOfChannels;
  this.input.channelCountMode = 'explicit';
  this.input.channelInterpretation = 'discrete';
};


/**
 * Internal callback handler for |initialize| method.
 * @private
 * @param {function} resolve - Resolution handler.
 * @param {function} reject - Rejection handler.
 */
HOARenderer.prototype._initializeCallback = function(resolve, reject) {
  let bufferList;
  if (this._config.pathList) {
    bufferList =
        new BufferList(this._context, this._config.pathList, {dataType: 'url'});
  } else {
    bufferList = this._config.ambisonicOrder === 2
        ? new BufferList(this._context, SOAHrirBase64)
        : new BufferList(this._context, TOAHrirBase64);
  }

  bufferList.load().then(
      function(hrirBufferList) {
        this._hoaConvolver.setHRIRBufferList(hrirBufferList);
        this.setRenderingMode(this._config.renderingMode);
        this._isRendererReady = true;
        Utils.log('HOARenderer: HRIRs loaded successfully. Ready.');
        resolve();
      }.bind(this),
      function() {
        const errorMessage = 'HOARenderer: HRIR loading/decoding failed.';
        Utils.throw(errorMessage);
        reject(errorMessage);
      });
};


/**
 * Initializes and loads the resource for the renderer.
 * @return {Promise}
 */
HOARenderer.prototype.initialize = function() {
  Utils.log(
      'HOARenderer: Initializing... (mode: ' + this._config.renderingMode +
      ', ambisonic order: ' + this._config.ambisonicOrder + ')');

  return new Promise(this._initializeCallback.bind(this), function(error) {
    Utils.throw('HOARenderer: Initialization failed. (' + error + ')');
  });
};


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
HOARenderer.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  if (!this._isRendererReady) {
    return;
  }

  this._hoaRotator.setRotationMatrix3(rotationMatrix3);
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
HOARenderer.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  if (!this._isRendererReady) {
    return;
  }

  this._hoaRotator.setRotationMatrix4(rotationMatrix4);
};


/**
 * Set the decoding mode.
 * @param {RenderingMode} mode - Decoding mode.
 *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
 *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
 *    decoding or encoding.
 *  - 'off': all the processing off saving the CPU power.
 */
HOARenderer.prototype.setRenderingMode = function(mode) {
  if (mode === this._config.renderingMode) {
    return;
  }

  switch (mode) {
    case RenderingMode.AMBISONIC:
      this._hoaConvolver.enable();
      this._bypass.disconnect();
      break;
    case RenderingMode.BYPASS:
      this._hoaConvolver.disable();
      this._bypass.connect(this.output);
      break;
    case RenderingMode.OFF:
      this._hoaConvolver.disable();
      this._bypass.disconnect();
      break;
    default:
      Utils.log(
          'HOARenderer: Rendering mode "' + mode + '" is not ' +
          'supported.');
      return;
  }

  this._config.renderingMode = mode;
  Utils.log('HOARenderer: Rendering mode changed. (' + mode + ')');
};


module.exports = HOARenderer;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

const OmnitoneTOAHrirBase64 = [
"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AAD7/wEAAgD7//7/AQD8/wAAAwD8//3/AwD9/wAAAgD9//z/AwD/////AgD+//z/AwAAAP7/AQD///3/AgABAP3/AAAAAP3/AgACAPz///8BAP3/AQACAP3//v8BAP7/AAABAP3//v8CAP7///8BAP7//f8CAP////8AAAAA/v8CAAAAAAAAAAAA/v8BAAAAAAD//wAA//8AAP//AAD//wAA//8AAP//",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA/////wAAAQD+////AAAGAP3/OAABAIIAAwBv//f/E/0QAK0ADQCzA/7/8P4u/0cBDQCJA6ABbQDg/w7/z/9o+Vn/SPnL/1//Ef+2+jr9RfZgA5QFZwILDFj+PAb2/nEFKgKk/R0Dlv6b/FUDsP6YAoj9SgAT/iL/tAPwAv8A0P6zAr7/dwAnAf39uP22/skA2v///2YCoP4UAUsAZgF2AJH+4P70/rz9+f+U/Xv/8v7CAcb+TACS/kwAv/+x/tX9oP71/oL/1f8nAEUAZwGtAAgAIgC/AD4BaP8GAGH/dQDF/64Arf8nAakAhAH9/+kAQQD3AFb/q/8p/yIAR/8FAPD/ZAA/AIYA3v8tADQADQBp/3f/CwABAP3/Wf8OANj/WwDH/xoAe/8DAKz/zv96/z8A3f/J/5X/IAD5//j/q//c/+//RADq//D/vv8pADUAFQDI/y8ACAAbANb/OwD3/+3/9f/e/wcAIAAeAMH/8/8xAC0AEADW/+3/HAADAPv/8P8DAOL/OwD3/xcACQAHAM//5f8XAAcAz//T/9D/HgD9////yf/e//v/AgD//9H/6/////H/+/8hAAIA9//7/w0AFgAQAPL/2v/8/xsAGQABANz/9P8YAAQA/v/y/wMA5v8YAAkAAAAAAAMA7/8KABgADwDs//j/BwATABsA8P/1//z/BAAMAAAA9P/s/xAA/v8GAAkA/v/p/wMACwALAP7/9P/p/wcADQAFAPb/7//4/w0ACAD8//b//v/1/wMACwD1//T/8P/8/wAACQDz/+f/5P8GAAkABQD5//D/+v8FAA0AAwD///T/AgACABAA/v8CAPD/+/8FAAoA9f/3//f//v8GAP7/9v/t//z/+f8AAPj/+v/3/wEA+v8HAPr//P/5/wQA//8DAPr/+P/3/wYA///+//X/+//5/wQA/f/7//X/+//4/wMA/f/8//j//v/9/wYA///8//f/AgAAAAUA/f/6//n/AwACAAIA/f/7//z/AwACAAAA/f/6//3/AgADAP7//f/7/wAAAwAFAPz////8/wMAAgAEAPv//v/+/wMAAgADAPv//v///wMAAQABAPv//f8AAAIAAAD///v//f8BAAIA///+//z//v8CAAIA/v/9//3///8CAAEA/v/9//7/AAACAAAA/v/9////AAABAAAA/f/9/wAAAQABAP///f/+/wEAAQAAAP///v/+/wEAAQD///7//v///wEAAQD///7//v///wEAAAD+//7///8AAAAAAAD+//7///8AAAAA///+//7///8AAAAA////////AAAAAP////////////8AAP//////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAAAAAAABAAAAAAD//////////////v////3/////////+//8////AQD9//z/9f8BAAIA+f8dACgAWQBxAJX/qv+Y/uz9aP9k/7UDUQQBAiQA4Pgi/AkB0gKaBsD/+fxp/vz9CQSp/I/+ywDO+vMD0fzK/PABcgBeBfoBv/+uAuH9Sf5gAy39awMmBWUBuP9fA9/9fgDj/2/+EACaACcCSv9Z/2j/rv7hAA0AWf55/7L84P7E/SIAT/67AMv/tf+FAA7/1v+7/gv/IP+E/sQA+P5aAXz/tP9XAFX/tP8o/4r/j//e/yQAMv9mAJT/rgCr/9X/EwCb//H/9f7F/6D/EAAoAK3//v+e/zsAh/+B/7r/if/C/2r/4P/z/6//HwCy/0IA7/9ZALT/y/80ACgA9v/J/9//DgA5ADUALQARADIACwAfAOf/NgArACMACQBBAEcAGAAjAC4AWQBUAHcAAAAfACEAIAAcAPj/CADk/yQA7v89AEEAFwD5/xYA6f8aAOX/AADF/zQADwAUAOT/BQDr/yUA6P8XAOf/HADR/0AA8P8nAAgACQDt/ycAKAAHAPH/IQDz/xsACADn//n/DgADAA4A8P///8z/GgDN/yMA/f8QANj/MwACAC0ACwAOAO3/JgAZAAUACgAAAA4AIgAaAAkADwACAAAAHQATAAUABQACAAgACwAjAO////8AAA8ABQAPAPL//f8GAAsABgAGAPD/8v8GAPz/CAD6//H/6v8PAAgABgD4//3/9v8aAAgABwD1//7//v8QAAoACAD//wUA9v8QAAoABAAFAAgAAgAJAAoAAwD//w0AAgD//wcA/v8DAAoABQAFABUABAAKAAYABwAHAA8ACgAGAAwADwAMAAkAEAAJAAgADwAMAAgADgAJAAUACQAPAAUACwAHAAEABgAIAAEABAAGAP//AgAJAAAAAgAEAP7///8IAAIA//8GAAEAAQAJAAIA/v8EAAMA//8JAAEA/v8DAAMA/v8HAAMA/f8BAAUA/v8FAAMA/v8BAAcA//8DAAMA/v8BAAYA//8CAAMA/////wcAAAAAAAMAAAD//wYAAQD+/wMAAQD//wUAAQD+/wIAAgD//wQAAgD+/wEAAwD//wMAAwD+/wEAAwD//wIAAwD//wEABAAAAAEABAD//wAABAABAAAAAwAAAAAABAABAP//AwABAAAAAwACAP//AgACAAAAAwACAP//AgACAAAAAgACAAAAAQADAAAAAQACAAAAAQADAAAAAQACAAAAAAACAAEAAAACAAEAAAACAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAAAAAAAAAAAAAAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA//8AAP//AAACAAAA+f8BAAYA///4/wIA//8AAA8A/v/V/wEAEwA9AAEBRwA2AF7/kfog/3gBwv99CDYBU/qtAUX/AP7OAfkAX/o9B38FSfwaAuT14/60BAr8CQAI/tfyIQTzAXP+egdUBBwBof7TBMT8bAWi/5EEWwBRAAAKyfxE/8b88vp6ACP+PAF4/qD8MQNM/ygCJ/2XAPD9kP5gAVT/iP9I/lEB4P8qAD0BFAGa/+7/DgB2AOP98gFm/u/+Vv5/AG8ASP9gAM//qv9w//oAcv+2/jIBHgA7/6D/oAAGAKH/lADT/wAAggC8AAYAkP9yAEcAkf8BAOD/RAAr/zUANwDt/xQAJQAkAMT/zwA/AOH/xv9zAGsANQBTAIcALAAvACIATACy/xMADADg/xcAWABvAJL/7f9VAPb/EgDt/wcA4f8kAPP/5P+h/wgACQDy//r/LgAQAMn/8/9CAOX/5v/S/9//3P8pABYAuP/s/w8AFgDt/+3/7v/w/9j/5/8GAOf/2P/2//P//v8kABMAuf/m/xoADADZ/+r/3P8KAAUAKwDe/wsA3P8VAAAADgAfAB0ACAAMAF4AGgAhAPL/MwDz/0kABAAKAPX/LwAbAAkA9v/s/+3/8/8CABAAAADm//n/BQALAAUAAQDj//n/JQAVAPX/9v/+/wIAEQABAPP/8P/1/wAABgD6/+3/7//o//j/DAD8/+b/8P8IAAkABgD4//D/8P8UAAoAAwD4/wAA+f8OAAcAAAAFAPX/9v8TAAkA8v8EAPb/9/8dAA0A7/8CAPn/+f8SAAQA8/8CAOf/+v8DAAgA9P////H//P8IAAUA8//0/wIAAQAGAAgA9//7/wAA+/8EAP//+P/+////AgACAAsA8v/+/wIABQD7/wgA9v/7/wMABAD5/wAA/P/3/wEAAQD7//7//P/1/wQA///3//r////3/wMAAwD1//r/AwD6////AgD4//n/AwD8//7/AgD4//n/AwD+//3/AQD4//n/BQD///n/AAD6//j/BAABAPj/AAD9//v/AwADAPj//v/+//z/AwAEAPj//v8BAP7/AQADAPj//f8CAP////8EAPr//P8DAAAA/v8CAPv//P8DAAEA/f8BAP3//f8DAAIA/P8AAP7//f8DAAIA/P///wAA/f8BAAIA+//+/wEA//8AAAEA+//+/wEA/////wEA/P/+/wEA///+/wAA/f/9/wEAAAD9/wAA/f/+/wEAAQD8/////v/+/wAAAQD8////////////AQD9////AAD/////AAD+////AAAAAP//AAD///////8AAP//AAD//wAA//8AAP//",
];

module.exports = OmnitoneTOAHrirBase64;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

const OmnitoneSOAHrirBase64 = [
"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/P////v//P8CAAQA+//+//3//f8CAAUA+v/9//////8AAAQA+v/8////AAD//wIA+//8/wAAAQD+/wEA+//8/wAAAgD9/////P/9/wEAAgD8//7//f/9/wAAAgD8//3//v/+////AQD8//z/////////AAD8//3///8AAP7/AAD9//7///8AAP7////+//////8AAP7////+////////////////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////v8AAP///////wAAAAAAAP7/AQABAAAABwD///X/BQAjAPL/CQDb/9D/GAAb/7sAYwCW/z0BcP/X/7T/2QDW+wH8yANCCCUJ5QT++UXmhPwhA78FuAxH+p78ifudBlAG9vmu/lAK2fdlB///cfjoCa0E7Akn9Yb/zvba+AkAHPywBGEBFwUNAL8AXAAGA20DFvmR/kz+F/06Ag/+GwHl/5EEKgJd/q0AP/ym/9n6EfxY/2H+/QFtAC4C6QBDAaMCo/20/+3/3f/p/fL9rv9V/6cBhQHuAX4AcwJYAaH/IP/P/gsApP0LAe7/sQBuAI0AAgGDAE4BzACe/5X//v+v/+f+Zf+gAOv/5QBhAOIApAANASYAuP+h/8b/HQBr/9//bACWAGEAFAB5AD0AWQDU/+D/Yf/p//D/s/+R/4QAMQBvABEAkQBfABQAJgDW/wwA8/8XALz/vf8zAFAAKwD1/zEAPwDJ/x0A7/8LAOX/FwDR//H/EQAdAO//6P8QAFEA2f8WABEAMgDy/xIA+f/s/xAALgDv////HQAvAPT/+f8iAAYAEgAFABoAGgD//w0A+f/0/xsAHgDx/9f/GAACAPH/8f8JAPf/GwALABEA7/8cAPT/CgD2//j/BQD8/+3/OgAgAAYA9f8PAN7/DgD9/9r/1//3/+3/9//1//b/8//5//f/AgAJAOf/+v8OAAMACwD9/+7/5f8eAAEA9//q//7/8P8WAP7/+//4/wIA+f8TAAIA9f/5/wcA+P8iAAgA9v/n/xoA//8gAAUABwDj/wAA9v8BAAUAFQDn/wMA7v8QABAAEQDm/wwA8f8aAAAABwDu/wcACgASAAEA7//w//f/BgARAAkA6P/3/wcADgAKAAYA4f/4/wYADgAAAPr/8P/9/xQACgAHAPn/7//9/xEAAgD+//L/8v/8/xUAAwDw//H/9f8CAAsA/v/q//L/+f8FAAYA/P/r//j///8GAAkA+//o//j/AQAIAP//+v/o//v/CAAIAPv/+P/w/wEACQAHAPj/+f/0/wIACwAFAPb/+f/4/wQACwACAPP/+f/+/wYACAD///L/+/8BAAYABQD9//P//P8FAAUAAgD7//T//f8HAAQA///7//f///8IAAMA/P/6//r/AQAIAAEA+v/6//3/AgAHAAAA+f/7/wAAAwAFAP7/+P/8/wIAAgACAP3/+f/9/wMAAwAAAPz/+v/+/wQAAgD+//z/+/8AAAQAAQD8//z//f8BAAQAAAD7//3///8BAAMA///7//3/AAACAAEA/v/7//7/AQABAAAA/v/9////AQAAAP///v/+////AAD/////////////////////////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD////////+//////8AAAAA/v/+/wAAAQD8//3/CQAJAP3/+v8PAAcApABlABkBkwCO/i//lfqa/HQAcf/3BdkCzwJcBCMC0wMN/9/9wgI7AaECYfxV/Tf83vhn/xrt8Owx/8n7cgHABYb43QcZDh4WugNrA7P74gHu/9z/zv0t/acCiQHY/iv4qQOl/ysCE/0//XT9Sf4O//j9xfupAn394gHO+rsCXAFIAxQC9wIXBgcD2AQuAnb/9gJh/6wAVfxEAI4Bvf7oAFv/bALsAMQBe/88/joAT/4dAH39/v9LAXn/gwDI//QBdABcAA0A7f4lAMn///+9/tv/iABp/13/pP/dALv/w/8MAHv//f+y/6////7U/5AAZP+Z/8r/nQDR/5r/DwDr/xAA4v+s/3z/+P9uAOv/t/82AGcAHgCb/yQAFQBGAM7/CgD3/xoAegAaAOz/CgBHAA8Adv8/AAAABQC2/xIAAAA7ABQAKgCj/z4AAQAXAJz/JAADAAcA8f/1/2AAAQAlAPD/NgDx/1wA7v/4/wMAZADv//3/HQAkAFoA8P9FAPv/FgBIAPf/WQAHAEUACQD0/xIAQwDu/wMAwP9VALn/XwCw/yEA5f8sAPj/FgDD/1YAyv8rAOX/HQDo//j/IQAQACAAHwD9/yQAHQBAABgABQAiAAUAKAD3/wkACwAKAAMABwAJAPb/+f8GAOr/JQAHABMA6P8TAA4AGgD//woA8/8ZAP//GADu/w0A9v8SAAMABwD4/wQA5P8XAAQACgDq/wUA+/8VAAcACADs/xIAAAATAPH/+v/1//T/7f///+z/+v/y/+//9/8KAAcACgAJAPT/BAAKAAAABgAIAPL/9v8KAAMABAACAPr/9v8OAAIA+P/x//v/+f8MAPb/+P/w/wQA9f8MAPn////7/woA/v8PAAEAAgD1/xAAAQAPAP//AwD//xQABwALAAAABgADABAAAgAHAAAACAABAA8ABQAFAAMABwAEAA4ABwADAAEACQAFAAoAAwD//wAACQADAAUAAQD/////CAABAAMAAAD/////BwACAAEAAAD/////BwACAP7///8BAAAABgABAP7///8CAAAABAAAAP7///8DAAAAAwAAAP3///8DAAAAAQAAAP3//v8EAAAAAAD+//////8EAP/////+/wAA/v8EAP/////+/wEA/v8EAP///v/+/wIA//8DAP///v/+/wIA//8BAP///v/+/wMA//8BAP/////+/wMA//8AAP//AAD+/wQA//8AAP7/AQD//wIA////////AQD//wIA////////AQAAAAEAAAAAAP//AQD//wEAAAAAAP//AQAAAAEAAAAAAAAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wAA+v8AAPz/AAD//wAA/f8AAAEAAAD+/wAACQAAAAQAAAAZAAAAtgAAAFsBAABW/gAAH/oAAGcBAABoBwAAlAAAAO3/AAARAQAA+wIAAEoEAACe/gAAiv4AALD0AADJ8wAAkQQAAF34AABi8QAAPQAAAAH2AAD19AAADAMAAJwGAACTEAAA0AwAAJkHAACOBwAAuQEAANcDAAC6AgAAHwUAAHEFAAB0AwAAbgEAADz+AADYAQAAGAAAAJwCAADgAAAA//0AAMn+AAAT/AAAwP8AAOn9AAAJAAAAewEAAOn+AACN/wAAOv0AAO3+AADN/gAAcP8AACj/AACq/gAA+f4AAML9AACa/wAA/f4AAN7/AABo/wAA6/4AAE//AAAC/wAAEQAAAHX/AAB0AAAA5f8AAEwAAAB3AAAA5/8AAMIAAABCAAAAzgAAAE8AAAB3AAAAKAAAADMAAACqAAAALwAAAK4AAAASAAAAVgAAACgAAAAtAAAATAAAAP3/AAA7AAAA2/8AACQAAADw/wAALQAAADEAAAAlAAAAbAAAADMAAABUAAAAEAAAACgAAAD1/wAA9v8AAPr/AADu/wAALgAAABIAAABUAAAARAAAAGUAAABGAAAAOAAAAGAAAAAuAAAARQAAACEAAAAfAAAAAAAAAAkAAAAQAAAAAwAAABIAAADs/wAAEAAAAAYAAAASAAAAIgAAABEAAAADAAAABAAAAA8AAAD4/wAAHQAAAAsAAAAIAAAADgAAAP//AAAcAAAADwAAAAYAAAASAAAAFwAAAAMAAAAYAAAAEgAAAPr/AAAQAAAADQAAAAoAAAD3/wAABgAAAPb/AADf/wAA/v8AAPL/AAD6/wAAFAAAAAQAAAAEAAAAGwAAAAEAAAAMAAAAIAAAAAIAAAAdAAAAGAAAAAIAAAAcAAAAEgAAAAcAAAAeAAAADwAAAAQAAAAeAAAABAAAAAYAAAAZAAAAAQAAAA4AAAATAAAA/v8AAAoAAAAOAAAA+/8AAAsAAAAJAAAA+f8AAAsAAAABAAAA+f8AAAoAAAD9/wAA+v8AAAcAAAD5/wAA+v8AAAUAAAD3/wAA/f8AAAQAAAD2/wAAAAAAAAEAAAD3/wAAAgAAAAAAAAD4/wAAAwAAAP7/AAD6/wAABAAAAP3/AAD8/wAABAAAAPv/AAD+/wAAAwAAAPv/AAD//wAAAQAAAPv/AAAAAAAAAAAAAPv/AAACAAAA//8AAPz/AAACAAAA/v8AAP3/AAACAAAA/f8AAP7/AAABAAAA/f8AAP//AAABAAAA/f8AAAAAAAAAAAAA/v8AAAEAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
];

module.exports = OmnitoneSOAHrirBase64;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Cross-browser support polyfill for Omnitone library.
 */




/**
 * Detects browser type and version.
 * @return {string[]} - An array contains the detected browser name and version.
 */
exports.getBrowserInfo = function() {
  const ua = navigator.userAgent;
  let M = ua.match(
      /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) ||
      [];
  let tem;

  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {name: 'IE', version: (tem[1] || '')};
  }

  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/);
    if (tem != null) {
      return {name: 'Opera', version: tem[1]};
    }
  }

  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/([\d.]+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }

  let platform = ua.match(/android|ipad|iphone/i);
  if (!platform) {
    platform = ua.match(/cros|linux|mac os x|windows/i);
  }

  return {
    name: M[0],
    version: M[1],
    platform: platform ? platform[0] : 'unknown',
  };
};


/**
 * Patches AudioContext if the prefixed API is found.
 */
exports.patchSafari = function() {
  if (window.webkitAudioContext && window.webkitOfflineAudioContext) {
    window.AudioContext = window.webkitAudioContext;
    window.OfflineAudioContext = window.webkitOfflineAudioContext;
  }
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Omnitone version.
 */




/**
 * Omnitone library version
 * @type {String}
 */
module.exports = '1.0.6';


/***/ })
/******/ ]);
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file ResonanceAudio version.
 * @author Andrew Allen <bitllama@google.com>
 */




/**
 * ResonanceAudio library version
 * @type {String}
 */
module.exports = '0.0.4';


/***/ })
/******/ ]);
});

/***/ }),

/***/ "./src/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available. Did you include A-Frame?')
}

const ARACVER = __webpack_require__("./src/version.js")

const log = AFRAME.utils.debug
// const error = log('A-Frame Resonance Audio Component:error')
const info = log('A-Frame Resonance Audio Componente:info')
const warn = log('A-Frame Resonance Audio Componente:warn')

if (true) {
  module.hot.accept()
  warn(`Version: ${ARACVER}-dev`)
} else {
  info(`Version: ${ARACVER}`)
}

__webpack_require__("./src/resonance-audio-room.js")
__webpack_require__("./src/resonance-audio-src.js")


/***/ }),

/***/ "./src/resonance-audio-room.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_resonance_audio__ = __webpack_require__("./node_modules/resonance-audio/build/resonance-audio.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_resonance_audio___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_resonance_audio__);
/* global AFRAME AudioContext */


const log = AFRAME.utils.debug
const warn = log('components:resonance-audio-room:warn')

const RESONANCE_MATERIAL = Object.keys(__WEBPACK_IMPORTED_MODULE_0_resonance_audio__["ResonanceAudio"].Utils.ROOM_MATERIAL_COEFFICIENTS)

AFRAME.registerComponent('resonance-audio-room', {
  dependencies: ['geometry', 'position'],
  // To enable multiple instancing on your component,
  // set multiple: true in the component definition:
  multiple: false,

  schema: {
    width: {type: 'number', default: __WEBPACK_IMPORTED_MODULE_0_resonance_audio__["ResonanceAudio"].Utils.DEFAULT_ROOM_DIMENSIONS.width},
    height: {type: 'number', default: __WEBPACK_IMPORTED_MODULE_0_resonance_audio__["ResonanceAudio"].Utils.DEFAULT_ROOM_DIMENSIONS.height},
    depth: {type: 'number', default: __WEBPACK_IMPORTED_MODULE_0_resonance_audio__["ResonanceAudio"].Utils.DEFAULT_ROOM_DIMENSIONS.depth},
    ambisonicOrder: {type: 'int', default: __WEBPACK_IMPORTED_MODULE_0_resonance_audio__["ResonanceAudio"].Utils.DEFAULT_AMBISONIC_ORDER, oneOf: [1, 3]},
    speedOfSound: {type: 'number', default: __WEBPACK_IMPORTED_MODULE_0_resonance_audio__["ResonanceAudio"].Utils.DEFAULT_SPEED_OF_SOUND},
    left: {default: 'brick-bare', oneOf: RESONANCE_MATERIAL},
    right: {default: 'brick-bare', oneOf: RESONANCE_MATERIAL},
    front: {default: 'brick-bare', oneOf: RESONANCE_MATERIAL},
    back: {default: 'brick-bare', oneOf: RESONANCE_MATERIAL},
    down: {default: 'brick-bare', oneOf: RESONANCE_MATERIAL},
    up: {default: 'brick-bare', oneOf: RESONANCE_MATERIAL}
  },
  init () {
    this.hasAudio = false
    this.cameraMoved = false
    this.builtInGeometry = true
    this.cameraMatrix4 = new AFRAME.THREE.Matrix4()
    this.resonanceAudioContext = new AudioContext()
    this.resonanceAudioScene = new __WEBPACK_IMPORTED_MODULE_0_resonance_audio__["ResonanceAudio"](this.resonanceAudioContext)
    this.resonanceAudioScene.output.connect(this.resonanceAudioContext.destination)
    // Create an AudioElement.
    this.el.audioElement = document.createElement('audio')
    this.sound = null
  },

  update (oldData) {
    this.roomSetup(oldData)
    this.acousticsSetup(oldData)
    this.setUpAudio()
  },

  tick () {
    const cameraEl = this.el.sceneEl.camera.el
    this.cameraMatrix4 = cameraEl.object3D.matrixWorld
  },

  // update resonanceAudioScene after room is tocked
  tock () {
    if (!this.hasAudio) { return }
    this.resonanceAudioScene.setListenerFromMatrix(this.cameraMatrix4)
  },

  // room setup
  roomSetup (oldData) {
    // room dimensions
    let dimensions = {
      width: this.data.width,
      height: this.data.height,
      depth: this.data.depth
    }
    if ((this.data.width + this.data.height + this.data.depth) === 0) {
      const bb = new AFRAME.THREE.Box3().setFromObject(this.el.object3D)
      dimensions.width = bb.size().x
      dimensions.height = bb.size().y
      dimensions.depth = bb.size().z
      this.builtInGeometry = false
    }
    // update geometry (only if using default geometry)
    if (this.builtInGeometry) {
      this.el.setAttribute('geometry', dimensions)
    }
    // room materials
    let materials = {
      left: this.data.left,
      right: this.data.right,
      front: this.data.front,
      back: this.data.back,
      down: this.data.down,
      up: this.data.up
    }
    this.resonanceAudioScene.setRoomProperties(dimensions, materials)
  },

  // room acoustics setup
  acousticsSetup (oldData) {
    if (!this.resonanceAudioScene ||
      ((oldData.ambisonicOrder === this.data.ambisonicOrder) &&
      (oldData.speedOfSound === this.data.speedOfSound))) { return }

    this.resonanceAudioScene.setAmbisonicOrder(this.data.ambisonicOrder)
    this.resonanceAudioScene.setSpeedOfSound(this.data.speedOfSound)
  },

  setUpAudio () {
    let children = this.el.object3D.children
    // 1 = this.el
    if (children.length < 2) { return }

    children.forEach((childEl) => {
      if (!childEl.el.getAttribute('resonance-audio-src')) { return }
      if (this.hasAudio) {
        warn('supporting single resonance-audio-src under resonance-audio-room')
      }
      if (this.sound) {
        this.sound.remove()
      }
      this.hasAudio = true
      this.sound = childEl.el.components['resonance-audio-src']
    })

    // Load an audio file into the AudioElement.
    this.el.audioElement.setAttribute('src', this.sound.getSource())
    // Generate a MediaElementSource from the AudioElement.
    let audioElementSource = this.resonanceAudioContext.createMediaElementSource(this.el.audioElement)
    // Add the MediaElementSource to the scene as an audio input source.
    let source = this.resonanceAudioScene.createSource()
    audioElementSource.connect(source.input)
    // Set position
    this.el.object3D.updateMatrixWorld()
    source.setFromMatrix(this.sound.getMatrixWorld())

    // Play the audio.
    if (this.sound.data.autoplay) {
      this.el.audioElement.play()
    }

    // Looping
    this.el.audioElement.setAttribute('loop', this.sound.data.loop)
  },

  remove () {
    this.el.audioEl.pause()
    this.el.audioEl = null
  },

  pause () {
    if (this.el.audioEl) {
      this.el.audioEl.pause()
    }
  },

  play () {
    if (this.el.audioEl && this.el.audioEl.paused) {
      this.el.audioEl.play()
    }
  }
})

AFRAME.registerPrimitive('a-resonance-audio-room', {
  mappings: {
    width: 'resonance-audio-room.width',
    height: 'resonance-audio-room.height',
    depth: 'resonance-audio-room.depth',
    'ambisonic-order': 'resonance-audio-room.ambisonicOrder',
    'speed-of-sound': 'resonance-audio-room.speedOfSound',
    left: 'resonance-audio-room.left',
    right: 'resonance-audio-room.right',
    front: 'resonance-audio-room.front',
    back: 'resonance-audio-room.back',
    down: 'resonance-audio-room.down',
    up: 'resonance-audio-room.up'
  }
})


/***/ }),

/***/ "./src/resonance-audio-src.js":
/***/ (function(module, exports) {

/* global AFRAME */

AFRAME.registerComponent('resonance-audio-src', {
  dependencies: ['geometry', 'position'],
  // To enable multiple instancing on your component,
  // set multiple: true in the component definition:
  multiple: false,

  schema: {
    src: {type: 'asset'},
    loop: {type: 'boolean', default: true},
    autoplay: {type: 'boolean', default: true}
  },
  init () {
    this.pos = new AFRAME.THREE.Vector3()
  },
  getSource () {
    return this.data.src
  },
  getMatrixWorld () {
    return this.el.object3D.matrixWorld
  }
})

AFRAME.registerPrimitive('a-resonance-audio-src', {
  mappings: {
    src: 'resonance-audio-src.src',
    loop: 'resonance-audio-src.loop',
    autoplay: 'resonance-audio-src.autoplay'
  }
})


/***/ }),

/***/ "./src/version.js":
/***/ (function(module, exports) {

/**
 * A-Frame Resonance Audio Component
 * @type {String}
 */
module.exports = '0.1.0'


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjdmMzU3ZjM3ZDc3YTNlNjI3OWUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Jlc29uYW5jZS1hdWRpby9idWlsZC9yZXNvbmFuY2UtYXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9yZXNvbmFuY2UtYXVkaW8tcm9vbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzb25hbmNlLWF1ZGlvLXNyYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVyc2lvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0EsV0FBRzs7QUFFSCxvREFBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxnQkFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBYSx3Q0FBd0M7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7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QUFDVjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxpREFBaUQ7OztBQUdqRDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOzs7QUFHQTtBQUNBLFVBQVU7QUFDVjtBQUNBOzs7QUFHQTtBQUNBLFVBQVU7QUFDVjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7OztBQUdBLFdBQVcsT0FBTztBQUNsQjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Ozs7QUFHQTs7O0FBR0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEIsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOzs7QUFHQTs7O0FBR0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxXQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLFlBQVksU0FBUztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7QUFHQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsaUJBQWlCO0FBQzVCLFdBQVcsY0FBYztBQUN6QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFDQUFxQztBQUMxRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLHFDQUFxQztBQUMxRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLHFDQUFxQztBQUMxRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7O0FBR0Q7OztBQUdBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBOzs7QUFHQTtB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QUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ3ZLRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVSxjQUFjO0FBQ3hCLFdBQVcsK0JBQStCO0FBQzFDLGVBQWU7QUFDZixHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7QUM5QkQ7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBIiwiZmlsZSI6ImFmcmFtZS1yZXNvbmFuY2UtYXVkaW8tY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gXHJcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHRcdGlmKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdH0gO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHQ7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXF1ZXN0VGltZW91dCA9IHJlcXVlc3RUaW1lb3V0IHx8IDEwMDAwO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IHJlcXVlc3RUaW1lb3V0O1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCJiN2YzNTdmMzdkNzdhM2U2Mjc5ZVwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xyXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXHJcbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XHJcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XHJcbiBcdFx0XHR9KS50aGVuKFxyXG4gXHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHQpO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgY2I7XHJcbiBcdFx0dmFyIGk7XHJcbiBcdFx0dmFyIGo7XHJcbiBcdFx0dmFyIG1vZHVsZTtcclxuIFx0XHR2YXIgbW9kdWxlSWQ7XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XHJcbiBcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXHJcbiBcdFx0XHRcdFx0aWQ6IGlkXHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XHJcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX21haW4pIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZighcGFyZW50KSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxyXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcclxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xyXG4gXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiKTtcclxuIFx0XHR9O1xyXG4gXHRcclxuIFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQ7XHJcbiBcdFx0XHRcdGlmKGhvdFVwZGF0ZVtpZF0pIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XHJcbiBcdFx0XHRcdGlmKHJlc3VsdC5jaGFpbikge1xyXG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRzd2l0Y2gocmVzdWx0LnR5cGUpIHtcclxuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vblVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25BY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRpc3Bvc2VkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRkZWZhdWx0OlxyXG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihhYm9ydEVycm9yKSB7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvQXBwbHkpIHtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHRcdFx0XHRmb3IobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9EaXNwb3NlKSB7XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XHJcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcclxuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcclxuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcclxuIFx0XHR2YXIgaWR4O1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdGlmKCFtb2R1bGUpIGNvbnRpbnVlO1xyXG4gXHRcclxuIFx0XHRcdHZhciBkYXRhID0ge307XHJcbiBcdFxyXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXHJcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdFx0aWYoY2IpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyLCAvLyBUT0RPIHJlbW92ZSBpbiB3ZWJwYWNrIDRcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXHJcbiBcdFx0aWYoZXJyb3IpIHtcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xyXG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKFwiLi9zcmMvaW5kZXguanNcIikoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiN2YzNTdmMzdkNzdhM2U2Mjc5ZSIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGk6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bDogZmFsc2UsXG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuLyoqKioqKi8gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4vKioqKioqLyBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4vKioqKioqLyBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4vKioqKioqLyBcdFx0XHRcdGdldDogZ2V0dGVyXG4vKioqKioqLyBcdFx0XHR9KTtcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbi8qKioqKiovIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbi8qKioqKiovIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4vKioqKioqLyBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbi8qKioqKiovIFx0XHRyZXR1cm4gZ2V0dGVyO1xuLyoqKioqKi8gXHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZSBSZXNvbmFuY2VBdWRpbyBsaWJyYXJ5IGNvbW1vbiB1dGlsaXRpZXMsIG1hdGhlbWF0aWNhbCBjb25zdGFudHMsXG4gKiBhbmQgZGVmYXVsdCB2YWx1ZXMuXG4gKiBAYXV0aG9yIEFuZHJldyBBbGxlbiA8Yml0bGxhbWFAZ29vZ2xlLmNvbT5cbiAqL1xuXG5cblxuXG4vKipcbiAqIEBjbGFzcyBVdGlsc1xuICogQGRlc2NyaXB0aW9uIEEgc2V0IG9mIGRlZmF1bHRzLCBjb25zdGFudHMgYW5kIHV0aWxpdHkgZnVuY3Rpb25zLlxuICovXG5mdW5jdGlvbiBVdGlscygpIHt9O1xuXG5cbi8qKlxuICogRGVmYXVsdCBpbnB1dCBnYWluIChsaW5lYXIpLlxuICogQHR5cGUge051bWJlcn1cbiAqL1xuVXRpbHMuREVGQVVMVF9TT1VSQ0VfR0FJTiA9IDE7XG5cblxuLyoqXG4gKiBNYXhpbXVtIG91dHNpZGUtdGhlLXJvb20gZGlzdGFuY2UgdG8gYXR0ZW51YXRlIGZhci1maWVsZCBsaXN0ZW5lciBieS5cbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cblV0aWxzLkxJU1RFTkVSX01BWF9PVVRTSURFX1JPT01fRElTVEFOQ0UgPSAxO1xuXG5cbi8qKlxuICogTWF4aW11bSBvdXRzaWRlLXRoZS1yb29tIGRpc3RhbmNlIHRvIGF0dGVudWF0ZSBmYXItZmllbGQgc291cmNlcyBieS5cbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cblV0aWxzLlNPVVJDRV9NQVhfT1VUU0lERV9ST09NX0RJU1RBTkNFID0gMTtcblxuXG4vKipcbiAqIERlZmF1bHQgZGlzdGFuY2UgZnJvbSBsaXN0ZW5lciB3aGVuIHNldHRpbmcgYW5nbGUuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ERUZBVUxUX1NPVVJDRV9ESVNUQU5DRSA9IDE7XG5cblxuLyoqIEB0eXBlIHtGbG9hdDMyQXJyYXl9ICovXG5VdGlscy5ERUZBVUxUX1BPU0lUSU9OID0gWzAsIDAsIDBdO1xuXG5cbi8qKiBAdHlwZSB7RmxvYXQzMkFycmF5fSAqL1xuVXRpbHMuREVGQVVMVF9GT1JXQVJEID0gWzAsIDAsIC0xXTtcblxuXG4vKiogQHR5cGUge0Zsb2F0MzJBcnJheX0gKi9cblV0aWxzLkRFRkFVTFRfVVAgPSBbMCwgMSwgMF07XG5cblxuLyoqIEB0eXBlIHtGbG9hdDMyQXJyYXl9ICovXG5VdGlscy5ERUZBVUxUX1JJR0hUID0gWzEsIDAsIDBdO1xuXG5cbi8qKlxuICogQHR5cGUge051bWJlcn1cbiAqL1xuVXRpbHMuREVGQVVMVF9TUEVFRF9PRl9TT1VORCA9IDM0MztcblxuXG4vKiogUm9sbG9mZiBtb2RlbHMgKGUuZy4gJ2xvZ2FyaXRobWljJywgJ2xpbmVhcicsIG9yICdub25lJykuXG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cblV0aWxzLkFUVEVOVUFUSU9OX1JPTExPRkZTID0gWydsb2dhcml0aG1pYycsICdsaW5lYXInLCAnbm9uZSddO1xuXG5cbi8qKiBEZWZhdWx0IHJvbGxvZmYgbW9kZWwgKCdsb2dhcml0aG1pYycpLlxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuVXRpbHMuREVGQVVMVF9BVFRFTlVBVElPTl9ST0xMT0ZGID0gJ2xvZ2FyaXRobWljJztcblxuXG4vKiogQHR5cGUge051bWJlcn0gKi9cblV0aWxzLkRFRkFVTFRfTUlOX0RJU1RBTkNFID0gMTtcblxuXG4vKiogQHR5cGUge051bWJlcn0gKi9cblV0aWxzLkRFRkFVTFRfTUFYX0RJU1RBTkNFID0gMTAwMDtcblxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGFscGhhIChpLmUuIG1pY3JvcGhvbmUgcGF0dGVybikuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ERUZBVUxUX0RJUkVDVElWSVRZX0FMUEhBID0gMDtcblxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHBhdHRlcm4gc2hhcnBuZXNzIChpLmUuIHBhdHRlcm4gZXhwb25lbnQpLlxuICogQHR5cGUge051bWJlcn1cbiAqL1xuVXRpbHMuREVGQVVMVF9ESVJFQ1RJVklUWV9TSEFSUE5FU1MgPSAxO1xuXG5cbi8qKlxuICogRGVmYXVsdCBhemltdXRoIChpbiBkZWdyZWVzKS4gU3VpdGFibGUgcmFuZ2UgaXMgMCB0byAzNjAuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ERUZBVUxUX0FaSU1VVEggPSAwO1xuXG5cbi8qKlxuICogRGVmYXVsdCBlbGV2YXRpb24gKGluIGRlZ3JlcykuXG4gKiBTdWl0YWJsZSByYW5nZSBpcyBmcm9tIC05MCAoYmVsb3cpIHRvIDkwIChhYm92ZSkuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ERUZBVUxUX0VMRVZBVElPTiA9IDA7XG5cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBhbWJpc29uaWMgb3JkZXIuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ERUZBVUxUX0FNQklTT05JQ19PUkRFUiA9IDE7XG5cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBzb3VyY2Ugd2lkdGguXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ERUZBVUxUX1NPVVJDRV9XSURUSCA9IDA7XG5cblxuLyoqXG4gKiBUaGUgbWF4aW11bSBkZWxheSAoaW4gc2Vjb25kcykgb2YgYSBzaW5nbGUgd2FsbCByZWZsZWN0aW9uLlxuICogQHR5cGUge051bWJlcn1cbiAqL1xuVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX01BWF9EVVJBVElPTiA9IDAuNTtcblxuXG4vKipcbiAqIFRoZSAtMTJkQiBjdXRvZmYgZnJlcXVlbmN5IChpbiBIZXJ0eikgZm9yIHRoZSBsb3dwYXNzIGZpbHRlciBhcHBsaWVkIHRvXG4gKiBhbGwgcmVmbGVjdGlvbnMuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ERUZBVUxUX1JFRkxFQ1RJT05fQ1VUT0ZGX0ZSRVFVRU5DWSA9IDY0MDA7IC8vIFVzZXMgLTEyZEIgY3V0b2ZmLlxuXG5cbi8qKlxuICogVGhlIGRlZmF1bHQgcmVmbGVjdGlvbiBjb2VmZmljaWVudHMgKHdoZXJlIDAgPSBubyByZWZsZWN0aW9uLCAxID0gcGVyZmVjdFxuICogcmVmbGVjdGlvbiwgLTEgPSBtaXJyb3JlZCByZWZsZWN0aW9uICgxODAtZGVncmVlcyBvdXQgb2YgcGhhc2UpKS5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblV0aWxzLkRFRkFVTFRfUkVGTEVDVElPTl9DT0VGRklDSUVOVFMgPSB7XG4gIGxlZnQ6IDAsIHJpZ2h0OiAwLCBmcm9udDogMCwgYmFjazogMCwgZG93bjogMCwgdXA6IDAsXG59O1xuXG5cbi8qKlxuICogVGhlIG1pbmltdW0gZGlzdGFuY2Ugd2UgY29uc2lkZXIgdGhlIGxpc3RlbmVyIHRvIGJlIHRvIGFueSBnaXZlbiB3YWxsLlxuICogQHR5cGUge051bWJlcn1cbiAqL1xuVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX01JTl9ESVNUQU5DRSA9IDE7XG5cblxuLyoqXG4gKiBEZWZhdWx0IHJvb20gZGltZW5zaW9ucyAoaW4gbWV0ZXJzKS5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblV0aWxzLkRFRkFVTFRfUk9PTV9ESU1FTlNJT05TID0ge1xuICB3aWR0aDogMCwgaGVpZ2h0OiAwLCBkZXB0aDogMCxcbn07XG5cblxuLyoqXG4gKiBUaGUgbXVsdGlwbGllciB0byBhcHBseSB0byBkaXN0YW5jZXMgZnJvbSB0aGUgbGlzdGVuZXIgdG8gZWFjaCB3YWxsLlxuICogQHR5cGUge051bWJlcn1cbiAqL1xuVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX01VTFRJUExJRVIgPSAxO1xuXG5cbi8qKiBUaGUgZGVmYXVsdCBiYW5kd2lkdGggKGluIG9jdGF2ZXMpIG9mIHRoZSBjZW50ZXIgZnJlcXVlbmNpZXMuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ERUZBVUxUX1JFVkVSQl9CQU5EV0lEVEggPSAxO1xuXG5cbi8qKiBUaGUgZGVmYXVsdCBtdWx0aXBsaWVyIGFwcGxpZWQgd2hlbiBjb21wdXRpbmcgdGFpbCBsZW5ndGhzLlxuICogQHR5cGUge051bWJlcn1cbiAqL1xuVXRpbHMuREVGQVVMVF9SRVZFUkJfRFVSQVRJT05fTVVMVElQTElFUiA9IDE7XG5cblxuLyoqXG4gKiBUaGUgbGF0ZSByZWZsZWN0aW9ucyBwcmUtZGVsYXkgKGluIG1pbGxpc2Vjb25kcykuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ERUZBVUxUX1JFVkVSQl9QUkVERUxBWSA9IDEuNTtcblxuXG4vKipcbiAqIFRoZSBsZW5ndGggb2YgdGhlIGJlZ2lubmluZyBvZiB0aGUgaW1wdWxzZSByZXNwb25zZSB0byBhcHBseSBhXG4gKiBoYWxmLUhhbm4gd2luZG93IHRvLlxuICogQHR5cGUge051bWJlcn1cbiAqL1xuVXRpbHMuREVGQVVMVF9SRVZFUkJfVEFJTF9PTlNFVCA9IDMuODtcblxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGdhaW4gKGxpbmVhcikuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ERUZBVUxUX1JFVkVSQl9HQUlOID0gMC4wMTtcblxuXG4vKipcbiAqIFRoZSBtYXhpbXVtIGltcHVsc2UgcmVzcG9uc2UgbGVuZ3RoIChpbiBzZWNvbmRzKS5cbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cblV0aWxzLkRFRkFVTFRfUkVWRVJCX01BWF9EVVJBVElPTiA9IDM7XG5cblxuLyoqXG4gKiBDZW50ZXIgZnJlcXVlbmNpZXMgb2YgdGhlIG11bHRpYmFuZCBsYXRlIHJlZmxlY3Rpb25zLlxuICogTmluZSBiYW5kcyBhcmUgY29tcHV0ZWQgYnk6IDMxLjI1ICogMl4oMDo4KS5cbiAqIEB0eXBlIHtBcnJheX1cbiAqL1xuVXRpbHMuREVGQVVMVF9SRVZFUkJfRlJFUVVFTkNZX0JBTkRTID0gW1xuICAzMS4yNSwgNjIuNSwgMTI1LCAyNTAsIDUwMCwgMTAwMCwgMjAwMCwgNDAwMCwgODAwMCxcbl07XG5cblxuLyoqXG4gKiBUaGUgbnVtYmVyIG9mIGZyZXF1ZW5jeSBiYW5kcy5cbiAqL1xuVXRpbHMuTlVNQkVSX1JFVkVSQl9GUkVRVUVOQ1lfQkFORFMgPVxuICBVdGlscy5ERUZBVUxUX1JFVkVSQl9GUkVRVUVOQ1lfQkFORFMubGVuZ3RoO1xuXG5cbi8qKlxuICogVGhlIGRlZmF1bHQgbXVsdGliYW5kIFJUNjAgZHVyYXRpb25zIChpbiBzZWNvbmRzKS5cbiAqIEB0eXBlIHtGbG9hdDMyQXJyYXl9XG4gKi9cblV0aWxzLkRFRkFVTFRfUkVWRVJCX0RVUkFUSU9OUyA9XG4gIG5ldyBGbG9hdDMyQXJyYXkoVXRpbHMuTlVNQkVSX1JFVkVSQl9GUkVRVUVOQ1lfQkFORFMpO1xuXG5cbi8qKlxuICogUHJlLWRlZmluZWQgZnJlcXVlbmN5LWRlcGVuZGVudCBhYnNvcnB0aW9uIGNvZWZmaWNpZW50cyBmb3IgbGlzdGVkIG1hdGVyaWFscy5cbiAqIEN1cnJlbnRseSBzdXBwb3J0ZWQgbWF0ZXJpYWxzIGFyZTpcbiAqIDx1bD5cbiAqIDxsaT4ndHJhbnNwYXJlbnQnPC9saT5cbiAqIDxsaT4nYWNvdXN0aWMtY2VpbGluZy10aWxlcyc8L2xpPlxuICogPGxpPidicmljay1iYXJlJzwvbGk+XG4gKiA8bGk+J2JyaWNrLXBhaW50ZWQnPC9saT5cbiAqIDxsaT4nY29uY3JldGUtYmxvY2stY29hcnNlJzwvbGk+XG4gKiA8bGk+J2NvbmNyZXRlLWJsb2NrLXBhaW50ZWQnPC9saT5cbiAqIDxsaT4nY3VydGFpbi1oZWF2eSc8L2xpPlxuICogPGxpPidmaWJlci1nbGFzcy1pbnN1bGF0aW9uJzwvbGk+XG4gKiA8bGk+J2dsYXNzLXRoaW4nPC9saT5cbiAqIDxsaT4nZ2xhc3MtdGhpY2snPC9saT5cbiAqIDxsaT4nZ3Jhc3MnPC9saT5cbiAqIDxsaT4nbGlub2xldW0tb24tY29uY3JldGUnPC9saT5cbiAqIDxsaT4nbWFyYmxlJzwvbGk+XG4gKiA8bGk+J21ldGFsJzwvbGk+XG4gKiA8bGk+J3BhcnF1ZXQtb24tY29uY3JldGUnPC9saT5cbiAqIDxsaT4ncGxhc3Rlci1zbW9vdGgnPC9saT5cbiAqIDxsaT4ncGx5d29vZC1wYW5lbCc8L2xpPlxuICogPGxpPidwb2xpc2hlZC1jb25jcmV0ZS1vci10aWxlJzwvbGk+XG4gKiA8bGk+J3NoZWV0cm9jayc8L2xpPlxuICogPGxpPid3YXRlci1vci1pY2Utc3VyZmFjZSc8L2xpPlxuICogPGxpPid3b29kLWNlaWxpbmcnPC9saT5cbiAqIDxsaT4nd29vZC1wYW5lbCc8L2xpPlxuICogPGxpPid1bmlmb3JtJzwvbGk+XG4gKiA8L3VsPlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuVXRpbHMuUk9PTV9NQVRFUklBTF9DT0VGRklDSUVOVFMgPSB7XG4gICd0cmFuc3BhcmVudCc6XG4gIFsxLjAwMCwgMS4wMDAsIDEuMDAwLCAxLjAwMCwgMS4wMDAsIDEuMDAwLCAxLjAwMCwgMS4wMDAsIDEuMDAwXSxcbiAgJ2Fjb3VzdGljLWNlaWxpbmctdGlsZXMnOlxuICBbMC42NzIsIDAuNjc1LCAwLjcwMCwgMC42NjAsIDAuNzIwLCAwLjkyMCwgMC44ODAsIDAuNzUwLCAxLjAwMF0sXG4gICdicmljay1iYXJlJzpcbiAgWzAuMDMwLCAwLjAzMCwgMC4wMzAsIDAuMDMwLCAwLjAzMCwgMC4wNDAsIDAuMDUwLCAwLjA3MCwgMC4xNDBdLFxuICAnYnJpY2stcGFpbnRlZCc6XG4gIFswLjAwNiwgMC4wMDcsIDAuMDEwLCAwLjAxMCwgMC4wMjAsIDAuMDIwLCAwLjAyMCwgMC4wMzAsIDAuMDYwXSxcbiAgJ2NvbmNyZXRlLWJsb2NrLWNvYXJzZSc6XG4gIFswLjM2MCwgMC4zNjAsIDAuMzYwLCAwLjQ0MCwgMC4zMTAsIDAuMjkwLCAwLjM5MCwgMC4yNTAsIDAuNTAwXSxcbiAgJ2NvbmNyZXRlLWJsb2NrLXBhaW50ZWQnOlxuICBbMC4wOTIsIDAuMDkwLCAwLjEwMCwgMC4wNTAsIDAuMDYwLCAwLjA3MCwgMC4wOTAsIDAuMDgwLCAwLjE2MF0sXG4gICdjdXJ0YWluLWhlYXZ5JzpcbiAgWzAuMDczLCAwLjEwNiwgMC4xNDAsIDAuMzUwLCAwLjU1MCwgMC43MjAsIDAuNzAwLCAwLjY1MCwgMS4wMDBdLFxuICAnZmliZXItZ2xhc3MtaW5zdWxhdGlvbic6XG4gIFswLjE5MywgMC4yMjAsIDAuMjIwLCAwLjgyMCwgMC45OTAsIDAuOTkwLCAwLjk5MCwgMC45OTAsIDEuMDAwXSxcbiAgJ2dsYXNzLXRoaW4nOlxuICBbMC4xODAsIDAuMTY5LCAwLjE4MCwgMC4wNjAsIDAuMDQwLCAwLjAzMCwgMC4wMjAsIDAuMDIwLCAwLjA0MF0sXG4gICdnbGFzcy10aGljayc6XG4gIFswLjM1MCwgMC4zNTAsIDAuMzUwLCAwLjI1MCwgMC4xODAsIDAuMTIwLCAwLjA3MCwgMC4wNDAsIDAuMDgwXSxcbiAgJ2dyYXNzJzpcbiAgWzAuMDUwLCAwLjA1MCwgMC4xNTAsIDAuMjUwLCAwLjQwMCwgMC41NTAsIDAuNjAwLCAwLjYwMCwgMC42MDBdLFxuICAnbGlub2xldW0tb24tY29uY3JldGUnOlxuICBbMC4wMjAsIDAuMDIwLCAwLjAyMCwgMC4wMzAsIDAuMDMwLCAwLjAzMCwgMC4wMzAsIDAuMDIwLCAwLjA0MF0sXG4gICdtYXJibGUnOlxuICBbMC4wMTAsIDAuMDEwLCAwLjAxMCwgMC4wMTAsIDAuMDEwLCAwLjAxMCwgMC4wMjAsIDAuMDIwLCAwLjA0MF0sXG4gICdtZXRhbCc6XG4gIFswLjAzMCwgMC4wMzUsIDAuMDQwLCAwLjA0MCwgMC4wNTAsIDAuMDUwLCAwLjA1MCwgMC4wNzAsIDAuMDkwXSxcbiAgJ3BhcnF1ZXQtb24tY29uY3JldGUnOlxuICBbMC4wMjgsIDAuMDMwLCAwLjA0MCwgMC4wNDAsIDAuMDcwLCAwLjA2MCwgMC4wNjAsIDAuMDcwLCAwLjE0MF0sXG4gICdwbGFzdGVyLXJvdWdoJzpcbiAgWzAuMDE3LCAwLjAxOCwgMC4wMjAsIDAuMDMwLCAwLjA0MCwgMC4wNTAsIDAuMDQwLCAwLjAzMCwgMC4wNjBdLFxuICAncGxhc3Rlci1zbW9vdGgnOlxuICBbMC4wMTEsIDAuMDEyLCAwLjAxMywgMC4wMTUsIDAuMDIwLCAwLjAzMCwgMC4wNDAsIDAuMDUwLCAwLjEwMF0sXG4gICdwbHl3b29kLXBhbmVsJzpcbiAgWzAuNDAwLCAwLjM0MCwgMC4yODAsIDAuMjIwLCAwLjE3MCwgMC4wOTAsIDAuMTAwLCAwLjExMCwgMC4yMjBdLFxuICAncG9saXNoZWQtY29uY3JldGUtb3ItdGlsZSc6XG4gIFswLjAwOCwgMC4wMDgsIDAuMDEwLCAwLjAxMCwgMC4wMTUsIDAuMDIwLCAwLjAyMCwgMC4wMjAsIDAuMDQwXSxcbiAgJ3NoZWV0LXJvY2snOlxuICBbMC4yOTAsIDAuMjc5LCAwLjI5MCwgMC4xMDAsIDAuMDUwLCAwLjA0MCwgMC4wNzAsIDAuMDkwLCAwLjE4MF0sXG4gICd3YXRlci1vci1pY2Utc3VyZmFjZSc6XG4gIFswLjAwNiwgMC4wMDYsIDAuMDA4LCAwLjAwOCwgMC4wMTMsIDAuMDE1LCAwLjAyMCwgMC4wMjUsIDAuMDUwXSxcbiAgJ3dvb2QtY2VpbGluZyc6XG4gIFswLjE1MCwgMC4xNDcsIDAuMTUwLCAwLjExMCwgMC4xMDAsIDAuMDcwLCAwLjA2MCwgMC4wNzAsIDAuMTQwXSxcbiAgJ3dvb2QtcGFuZWwnOlxuICBbMC4yODAsIDAuMjgwLCAwLjI4MCwgMC4yMjAsIDAuMTcwLCAwLjA5MCwgMC4xMDAsIDAuMTEwLCAwLjIyMF0sXG4gICd1bmlmb3JtJzpcbiAgWzAuNTAwLCAwLjUwMCwgMC41MDAsIDAuNTAwLCAwLjUwMCwgMC41MDAsIDAuNTAwLCAwLjUwMCwgMC41MDBdLFxufTtcblxuXG4vKipcbiAqIERlZmF1bHQgbWF0ZXJpYWxzIHRoYXQgdXNlIHN0cmluZ3MgZnJvbVxuICoge0BsaW5rY29kZSBVdGlscy5NQVRFUklBTF9DT0VGRklDSUVOVFMgTUFURVJJQUxfQ09FRkZJQ0lFTlRTfVxuICogQHR5cGUge09iamVjdH1cbiAqL1xuVXRpbHMuREVGQVVMVF9ST09NX01BVEVSSUFMUyA9IHtcbiAgbGVmdDogJ3RyYW5zcGFyZW50JywgcmlnaHQ6ICd0cmFuc3BhcmVudCcsIGZyb250OiAndHJhbnNwYXJlbnQnLFxuICBiYWNrOiAndHJhbnNwYXJlbnQnLCBkb3duOiAndHJhbnNwYXJlbnQnLCB1cDogJ3RyYW5zcGFyZW50Jyxcbn07XG5cblxuLyoqXG4gKiBUaGUgbnVtYmVyIG9mIGJhbmRzIHRvIGF2ZXJhZ2Ugb3ZlciB3aGVuIGNvbXB1dGluZyByZWZsZWN0aW9uIGNvZWZmaWNpZW50cy5cbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cblV0aWxzLk5VTUJFUl9SRUZMRUNUSU9OX0FWRVJBR0lOR19CQU5EUyA9IDM7XG5cblxuLyoqXG4gKiBUaGUgc3RhcnRpbmcgYmFuZCB0byBhdmVyYWdlIG92ZXIgd2hlbiBjb21wdXRpbmcgcmVmbGVjdGlvbiBjb2VmZmljaWVudHMuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5VdGlscy5ST09NX1NUQVJUSU5HX0FWRVJBR0lOR19CQU5EID0gNDtcblxuXG4vKipcbiAqIFRoZSBtaW5pbXVtIHRocmVzaG9sZCBmb3Igcm9vbSB2b2x1bWUuXG4gKiBSb29tIG1vZGVsIGlzIGRpc2FibGVkIGlmIHZvbHVtZSBpcyBiZWxvdyB0aGlzIHZhbHVlLlxuICogQHR5cGUge051bWJlcn0gKi9cblV0aWxzLlJPT01fTUlOX1ZPTFVNRSA9IDFlLTQ7XG5cblxuLyoqXG4gKiBBaXIgYWJzb3JwdGlvbiBjb2VmZmljaWVudHMgcGVyIGZyZXF1ZW5jeSBiYW5kLlxuICogQHR5cGUge0Zsb2F0MzJBcnJheX1cbiAqL1xuVXRpbHMuUk9PTV9BSVJfQUJTT1JQVElPTl9DT0VGRklDSUVOVFMgPVxuICBbMC4wMDA2LCAwLjAwMDYsIDAuMDAwNywgMC4wMDA4LCAwLjAwMTAsIDAuMDAxNSwgMC4wMDI2LCAwLjAwNjAsIDAuMDIwN107XG5cblxuLyoqXG4gKiBBIHNjYWxhciBjb3JyZWN0aW9uIHZhbHVlIHRvIGVuc3VyZSBTYWJpbmUgYW5kIEV5cmluZyBwcm9kdWNlIHRoZSBzYW1lIFJUNjBcbiAqIHZhbHVlIGF0IHRoZSBjcm9zcy1vdmVyIHRocmVzaG9sZC5cbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cblV0aWxzLlJPT01fRVlSSU5HX0NPUlJFQ1RJT05fQ09FRkZJQ0lFTlQgPSAxLjM4O1xuXG5cbi8qKlxuICogQHR5cGUge051bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cblV0aWxzLlRXT19QSSA9IDYuMjgzMTg1MzA3MTc5NTk7XG5cblxuLyoqXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xuVXRpbHMuVFdFTlRZX0ZPVVJfTE9HMTAgPSA1NS4yNjIwNDIyMzE4NTcxO1xuXG5cbi8qKlxuICogQHR5cGUge051bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cblV0aWxzLkxPRzEwMDAgPSA2LjkwNzc1NTI3ODk4MjE0O1xuXG5cbi8qKlxuICogQHR5cGUge051bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cblV0aWxzLkxPRzJfRElWMiA9IDAuMzQ2NTczNTkwMjc5OTczO1xuXG5cbi8qKlxuICogQHR5cGUge051bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cblV0aWxzLkRFR1JFRVNfVE9fUkFESUFOUyA9IDAuMDE3NDUzMjkyNTE5OTQzO1xuXG5cbi8qKlxuICogQHR5cGUge051bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cblV0aWxzLlJBRElBTlNfVE9fREVHUkVFUyA9IDU3LjI5NTc3OTUxMzA4MjMyMztcblxuXG4vKipcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG5VdGlscy5FUFNJTE9OX0ZMT0FUID0gMWUtODtcblxuXG4vKipcbiAqIFJlc29uYW5jZUF1ZGlvIGxpYnJhcnkgbG9nZ2luZyBmdW5jdGlvbi5cbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqIEBwYXJhbSB7YW55fSBNZXNzYWdlIHRvIGJlIHByaW50ZWQgb3V0LlxuICogQHByaXZhdGVcbiAqL1xuVXRpbHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIHdpbmRvdy5jb25zb2xlLmxvZy5hcHBseSh3aW5kb3cuY29uc29sZSwgW1xuICAgICclY1tSZXNvbmFuY2VBdWRpb10lYyAnXG4gICAgICArIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignICcpICsgJyAlYyhAJ1xuICAgICAgKyBwZXJmb3JtYW5jZS5ub3coKS50b0ZpeGVkKDIpICsgJ21zKScsXG4gICAgJ2JhY2tncm91bmQ6ICNCQkRFRkI7IGNvbG9yOiAjRkY1NzIyOyBmb250LXdlaWdodDogNzAwJyxcbiAgICAnZm9udC13ZWlnaHQ6IDQwMCcsXG4gICAgJ2NvbG9yOiAjQUFBJyxcbiAgXSk7XG59O1xuXG5cbi8qKlxuICogTm9ybWFsaXplIGEgMy1kIHZlY3Rvci5cbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSB2IDMtZWxlbWVudCB2ZWN0b3IuXG4gKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IDMtZWxlbWVudCB2ZWN0b3IuXG4gKiBAcHJpdmF0ZVxuICovXG5VdGlscy5ub3JtYWxpemVWZWN0b3IgPSBmdW5jdGlvbih2KSB7XG4gIGxldCBuID0gTWF0aC5zcXJ0KHZbMF0gKiB2WzBdICsgdlsxXSAqIHZbMV0gKyB2WzJdICogdlsyXSk7XG4gIGlmIChuID4gZXhwb3J0cy5FUFNJTE9OX0ZMT0FUKSB7XG4gICAgbiA9IDEgLyBuO1xuICAgIHZbMF0gKj0gbjtcbiAgICB2WzFdICo9IG47XG4gICAgdlsyXSAqPSBuO1xuICB9XG4gIHJldHVybiB2O1xufTtcblxuXG4vKipcbiAqIENyb3NzLXByb2R1Y3QgYmV0d2VlbiB0d28gMy1kIHZlY3RvcnMuXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYSAzLWVsZW1lbnQgdmVjdG9yLlxuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGIgMy1lbGVtZW50IHZlY3Rvci5cbiAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX1cbiAqIEBwcml2YXRlXG4gKi9cblV0aWxzLmNyb3NzUHJvZHVjdCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIFtcbiAgICBhWzFdICogYlsyXSAtIGFbMl0gKiBiWzFdLFxuICAgIGFbMl0gKiBiWzBdIC0gYVswXSAqIGJbMl0sXG4gICAgYVswXSAqIGJbMV0gLSBhWzFdICogYlswXSxcbiAgXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVXRpbHM7XG5cblxuLyoqKi8gfSksXG4vKiAxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlIFNwYXRpYWxseSBlbmNvZGVzIGlucHV0IHVzaW5nIHdlaWdodGVkIHNwaGVyaWNhbCBoYXJtb25pY3MuXG4gKiBAYXV0aG9yIEFuZHJldyBBbGxlbiA8Yml0bGxhbWFAZ29vZ2xlLmNvbT5cbiAqL1xuXG5cblxuLy8gSW50ZXJuYWwgZGVwZW5kZW5jaWVzLlxuY29uc3QgVGFibGVzID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKTtcbmNvbnN0IFV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKipcbiAqIEBjbGFzcyBFbmNvZGVyXG4gKiBAZGVzY3JpcHRpb24gU3BhdGlhbGx5IGVuY29kZXMgaW5wdXQgdXNpbmcgd2VpZ2h0ZWQgc3BoZXJpY2FsIGhhcm1vbmljcy5cbiAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBjb250ZXh0XG4gKiBBc3NvY2lhdGVkIHtAbGlua1xuaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0F1ZGlvQ29udGV4dCBBdWRpb0NvbnRleHR9LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmFtYmlzb25pY09yZGVyXG4gKiBEZXNpcmVkIGFtYmlzb25pYyBvcmRlci4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9BTUJJU09OSUNfT1JERVIgREVGQVVMVF9BTUJJU09OSUNfT1JERVJ9LlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuYXppbXV0aFxuICogQXppbXV0aCAoaW4gZGVncmVlcykuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfQVpJTVVUSCBERUZBVUxUX0FaSU1VVEh9LlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuZWxldmF0aW9uXG4gKiBFbGV2YXRpb24gKGluIGRlZ3JlZXMpLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX0VMRVZBVElPTiBERUZBVUxUX0VMRVZBVElPTn0uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5zb3VyY2VXaWR0aFxuICogU291cmNlIHdpZHRoIChpbiBkZWdyZWVzKS4gV2hlcmUgMCBkZWdyZWVzIGlzIGEgcG9pbnQgc291cmNlIGFuZCAzNjAgZGVncmVlc1xuICogaXMgYW4gb21uaWRpcmVjdGlvbmFsIHNvdXJjZS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9TT1VSQ0VfV0lEVEggREVGQVVMVF9TT1VSQ0VfV0lEVEh9LlxuICovXG5mdW5jdGlvbiBFbmNvZGVyKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgLy8gUHVibGljIHZhcmlhYmxlcy5cbiAgLyoqXG4gICAqIE1vbm8gKDEtY2hhbm5lbCkgaW5wdXQge0BsaW5rXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb05vZGUgQXVkaW9Ob2RlfS5cbiAgICogQG1lbWJlciB7QXVkaW9Ob2RlfSBpbnB1dFxuICAgKiBAbWVtYmVyb2YgRW5jb2RlclxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIC8qKlxuICAgKiBBbWJpc29uaWMgKG11bHRpY2hhbm5lbCkgb3V0cHV0IHtAbGlua1xuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Ob2RlIEF1ZGlvTm9kZX0uXG4gICAqIEBtZW1iZXIge0F1ZGlvTm9kZX0gb3V0cHV0XG4gICAqIEBtZW1iZXJvZiBFbmNvZGVyXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cblxuICAvLyBVc2UgZGVmYXVsdHMgZm9yIHVuZGVmaW5lZCBhcmd1bWVudHMuXG4gIGlmIChvcHRpb25zID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAob3B0aW9ucy5hbWJpc29uaWNPcmRlciA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLmFtYmlzb25pY09yZGVyID0gVXRpbHMuREVGQVVMVF9BTUJJU09OSUNfT1JERVI7XG4gIH1cbiAgaWYgKG9wdGlvbnMuYXppbXV0aCA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLmF6aW11dGggPSBVdGlscy5ERUZBVUxUX0FaSU1VVEg7XG4gIH1cbiAgaWYgKG9wdGlvbnMuZWxldmF0aW9uID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMuZWxldmF0aW9uID0gVXRpbHMuREVGQVVMVF9FTEVWQVRJT047XG4gIH1cbiAgaWYgKG9wdGlvbnMuc291cmNlV2lkdGggPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5zb3VyY2VXaWR0aCA9IFV0aWxzLkRFRkFVTFRfU09VUkNFX1dJRFRIO1xuICB9XG5cbiAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG5cbiAgLy8gQ3JlYXRlIEkvTyBub2Rlcy5cbiAgdGhpcy5pbnB1dCA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9jaGFubmVsR2FpbiA9IFtdO1xuICB0aGlzLl9tZXJnZXIgPSB1bmRlZmluZWQ7XG4gIHRoaXMub3V0cHV0ID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG5cbiAgLy8gU2V0IGluaXRpYWwgb3JkZXIsIGFuZ2xlIGFuZCBzb3VyY2Ugd2lkdGguXG4gIHRoaXMuc2V0QW1iaXNvbmljT3JkZXIob3B0aW9ucy5hbWJpc29uaWNPcmRlcik7XG4gIHRoaXMuX2F6aW11dGggPSBvcHRpb25zLmF6aW11dGg7XG4gIHRoaXMuX2VsZXZhdGlvbiA9IG9wdGlvbnMuZWxldmF0aW9uO1xuICB0aGlzLnNldFNvdXJjZVdpZHRoKG9wdGlvbnMuc291cmNlV2lkdGgpO1xufVxuXG4vKipcbiAqIFNldCB0aGUgZGVzaXJlZCBhbWJpc29uaWMgb3JkZXIuXG4gKiBAcGFyYW0ge051bWJlcn0gYW1iaXNvbmljT3JkZXIgRGVzaXJlZCBhbWJpc29uaWMgb3JkZXIuXG4gKi9cbkVuY29kZXIucHJvdG90eXBlLnNldEFtYmlzb25pY09yZGVyID0gZnVuY3Rpb24oYW1iaXNvbmljT3JkZXIpIHtcbiAgdGhpcy5fYW1iaXNvbmljT3JkZXIgPSBFbmNvZGVyLnZhbGlkYXRlQW1iaXNvbmljT3JkZXIoYW1iaXNvbmljT3JkZXIpO1xuXG4gIHRoaXMuaW5wdXQuZGlzY29ubmVjdCgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2NoYW5uZWxHYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5fY2hhbm5lbEdhaW5baV0uZGlzY29ubmVjdCgpO1xuICB9XG4gIGlmICh0aGlzLl9tZXJnZXIgIT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fbWVyZ2VyLmRpc2Nvbm5lY3QoKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fY2hhbm5lbEdhaW47XG4gIGRlbGV0ZSB0aGlzLl9tZXJnZXI7XG5cbiAgLy8gQ3JlYXRlIGF1ZGlvIGdyYXBoLlxuICBsZXQgbnVtQ2hhbm5lbHMgPSAodGhpcy5fYW1iaXNvbmljT3JkZXIgKyAxKSAqICh0aGlzLl9hbWJpc29uaWNPcmRlciArIDEpO1xuICB0aGlzLl9tZXJnZXIgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUNoYW5uZWxNZXJnZXIobnVtQ2hhbm5lbHMpO1xuICB0aGlzLl9jaGFubmVsR2FpbiA9IG5ldyBBcnJheShudW1DaGFubmVscyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ2hhbm5lbHM7IGkrKykge1xuICAgIHRoaXMuX2NoYW5uZWxHYWluW2ldID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy5pbnB1dC5jb25uZWN0KHRoaXMuX2NoYW5uZWxHYWluW2ldKTtcbiAgICB0aGlzLl9jaGFubmVsR2FpbltpXS5jb25uZWN0KHRoaXMuX21lcmdlciwgMCwgaSk7XG4gIH1cbiAgdGhpcy5fbWVyZ2VyLmNvbm5lY3QodGhpcy5vdXRwdXQpO1xufTtcblxuXG4vKipcbiAqIFNldCB0aGUgZGlyZWN0aW9uIG9mIHRoZSBlbmNvZGVkIHNvdXJjZSBzaWduYWwuXG4gKiBAcGFyYW0ge051bWJlcn0gYXppbXV0aFxuICogQXppbXV0aCAoaW4gZGVncmVlcykuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfQVpJTVVUSCBERUZBVUxUX0FaSU1VVEh9LlxuICogQHBhcmFtIHtOdW1iZXJ9IGVsZXZhdGlvblxuICogRWxldmF0aW9uIChpbiBkZWdyZWVzKS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9FTEVWQVRJT04gREVGQVVMVF9FTEVWQVRJT059LlxuICovXG5FbmNvZGVyLnByb3RvdHlwZS5zZXREaXJlY3Rpb24gPSBmdW5jdGlvbihhemltdXRoLCBlbGV2YXRpb24pIHtcbiAgLy8gRm9ybWF0IGlucHV0IGRpcmVjdGlvbiB0byBuZWFyZXN0IGluZGljZXMuXG4gIGlmIChhemltdXRoID09IHVuZGVmaW5lZCB8fCBpc05hTihhemltdXRoKSkge1xuICAgIGF6aW11dGggPSBVdGlscy5ERUZBVUxUX0FaSU1VVEg7XG4gIH1cbiAgaWYgKGVsZXZhdGlvbiA9PSB1bmRlZmluZWQgfHwgaXNOYU4oZWxldmF0aW9uKSkge1xuICAgIGVsZXZhdGlvbiA9IFV0aWxzLkRFRkFVTFRfRUxFVkFUSU9OO1xuICB9XG5cbiAgLy8gU3RvcmUgdGhlIGZvcm1hdHRlZCBpbnB1dCAoZm9yIHVwZGF0aW5nIHNvdXJjZSB3aWR0aCkuXG4gIHRoaXMuX2F6aW11dGggPSBhemltdXRoO1xuICB0aGlzLl9lbGV2YXRpb24gPSBlbGV2YXRpb247XG5cbiAgLy8gRm9ybWF0IGRpcmVjdGlvbiBmb3IgaW5kZXggbG9va3Vwcy5cbiAgYXppbXV0aCA9IE1hdGgucm91bmQoYXppbXV0aCAlIDM2MCk7XG4gIGlmIChhemltdXRoIDwgMCkge1xuICAgIGF6aW11dGggKz0gMzYwO1xuICB9XG4gIGVsZXZhdGlvbiA9IE1hdGgucm91bmQoTWF0aC5taW4oOTAsIE1hdGgubWF4KC05MCwgZWxldmF0aW9uKSkpICsgOTA7XG5cbiAgLy8gQXNzaWduIGdhaW5zIHRvIGVhY2ggb3V0cHV0LlxuICB0aGlzLl9jaGFubmVsR2FpblswXS5nYWluLnZhbHVlID0gVGFibGVzLk1BWF9SRV9XRUlHSFRTW3RoaXMuX3NwcmVhZEluZGV4XVswXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy5fYW1iaXNvbmljT3JkZXI7IGkrKykge1xuICAgIGxldCBkZWdyZWVXZWlnaHQgPSBUYWJsZXMuTUFYX1JFX1dFSUdIVFNbdGhpcy5fc3ByZWFkSW5kZXhdW2ldO1xuICAgIGZvciAobGV0IGogPSAtaTsgaiA8PSBpOyBqKyspIHtcbiAgICAgIGxldCBhY25DaGFubmVsID0gKGkgKiBpKSArIGkgKyBqO1xuICAgICAgbGV0IGVsZXZhdGlvbkluZGV4ID0gaSAqIChpICsgMSkgLyAyICsgTWF0aC5hYnMoaikgLSAxO1xuICAgICAgbGV0IHZhbCA9IFRhYmxlcy5TUEhFUklDQUxfSEFSTU9OSUNTWzFdW2VsZXZhdGlvbl1bZWxldmF0aW9uSW5kZXhdO1xuICAgICAgaWYgKGogIT0gMCkge1xuICAgICAgICBsZXQgYXppbXV0aEluZGV4ID0gVGFibGVzLlNQSEVSSUNBTF9IQVJNT05JQ1NfTUFYX09SREVSICsgaiAtIDE7XG4gICAgICAgIGlmIChqIDwgMCkge1xuICAgICAgICAgIGF6aW11dGhJbmRleCA9IFRhYmxlcy5TUEhFUklDQUxfSEFSTU9OSUNTX01BWF9PUkRFUiArIGo7XG4gICAgICAgIH1cbiAgICAgICAgdmFsICo9IFRhYmxlcy5TUEhFUklDQUxfSEFSTU9OSUNTWzBdW2F6aW11dGhdW2F6aW11dGhJbmRleF07XG4gICAgICB9XG4gICAgICB0aGlzLl9jaGFubmVsR2FpblthY25DaGFubmVsXS5nYWluLnZhbHVlID0gdmFsICogZGVncmVlV2VpZ2h0O1xuICAgIH1cbiAgfVxufTtcblxuXG4vKipcbiAqIFNldCB0aGUgc291cmNlIHdpZHRoIChpbiBkZWdyZWVzKS4gV2hlcmUgMCBkZWdyZWVzIGlzIGEgcG9pbnQgc291cmNlIGFuZCAzNjBcbiAqIGRlZ3JlZXMgaXMgYW4gb21uaWRpcmVjdGlvbmFsIHNvdXJjZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBzb3VyY2VXaWR0aCAoaW4gZGVncmVlcykuXG4gKi9cbkVuY29kZXIucHJvdG90eXBlLnNldFNvdXJjZVdpZHRoID0gZnVuY3Rpb24oc291cmNlV2lkdGgpIHtcbiAgLy8gVGhlIE1BWF9SRV9XRUlHSFRTIGlzIGEgMzYwIHggKFRhYmxlcy5TUEhFUklDQUxfSEFSTU9OSUNTX01BWF9PUkRFUisxKVxuICAvLyBzaXplIHRhYmxlLlxuICB0aGlzLl9zcHJlYWRJbmRleCA9IE1hdGgubWluKDM1OSwgTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChzb3VyY2VXaWR0aCkpKTtcbiAgdGhpcy5zZXREaXJlY3Rpb24odGhpcy5fYXppbXV0aCwgdGhpcy5fZWxldmF0aW9uKTtcbn07XG5cblxuLyoqXG4gKiBWYWxpZGF0ZSB0aGUgcHJvdmlkZWQgYW1iaXNvbmljIG9yZGVyLlxuICogQHBhcmFtIHtOdW1iZXJ9IGFtYmlzb25pY09yZGVyIERlc2lyZWQgYW1iaXNvbmljIG9yZGVyLlxuICogQHJldHVybiB7TnVtYmVyfSBWYWxpZGF0ZWQvYWRqdXN0ZWQgYW1iaXNvbmljIG9yZGVyLlxuICogQHByaXZhdGVcbiAqL1xuRW5jb2Rlci52YWxpZGF0ZUFtYmlzb25pY09yZGVyID0gZnVuY3Rpb24oYW1iaXNvbmljT3JkZXIpIHtcbiAgaWYgKGlzTmFOKGFtYmlzb25pY09yZGVyKSB8fCBhbWJpc29uaWNPcmRlciA9PSB1bmRlZmluZWQpIHtcbiAgICBVdGlscy5sb2coJ0Vycm9yOiBJbnZhbGlkIGFtYmlzb25pYyBvcmRlcicsXG4gICAgb3B0aW9ucy5hbWJpc29uaWNPcmRlciwgJ1xcblVzaW5nIGFtYmlzb25pY09yZGVyPTEgaW5zdGVhZC4nKTtcbiAgICBhbWJpc29uaWNPcmRlciA9IDE7XG4gIH0gZWxzZSBpZiAoYW1iaXNvbmljT3JkZXIgPCAxKSB7XG4gICAgVXRpbHMubG9nKCdFcnJvcjogVW5hYmxlIHRvIHJlbmRlciBhbWJpc29uaWMgb3JkZXInLFxuICAgIG9wdGlvbnMuYW1iaXNvbmljT3JkZXIsICcoTWluIG9yZGVyIGlzIDEpJyxcbiAgICAnXFxuVXNpbmcgbWluIG9yZGVyIGluc3RlYWQuJyk7XG4gICAgYW1iaXNvbmljT3JkZXIgPSAxO1xuICB9IGVsc2UgaWYgKGFtYmlzb25pY09yZGVyID4gVGFibGVzLlNQSEVSSUNBTF9IQVJNT05JQ1NfTUFYX09SREVSKSB7XG4gICAgVXRpbHMubG9nKCdFcnJvcjogVW5hYmxlIHRvIHJlbmRlciBhbWJpc29uaWMgb3JkZXInLFxuICAgIG9wdGlvbnMuYW1iaXNvbmljT3JkZXIsICcoTWF4IG9yZGVyIGlzJyxcbiAgICBUYWJsZXMuU1BIRVJJQ0FMX0hBUk1PTklDU19NQVhfT1JERVIsICcpXFxuVXNpbmcgbWF4IG9yZGVyIGluc3RlYWQuJyk7XG4gICAgb3B0aW9ucy5hbWJpc29uaWNPcmRlciA9IFRhYmxlcy5TUEhFUklDQUxfSEFSTU9OSUNTX01BWF9PUkRFUjtcbiAgfVxuICByZXR1cm4gYW1iaXNvbmljT3JkZXI7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRW5jb2RlcjtcblxuXG4vKioqLyB9KSxcbi8qIDIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGUgTGlzdGVuZXIgbW9kZWwgdG8gc3BhdGlhbGl6ZSBzb3VyY2VzIGluIGFuIGVudmlyb25tZW50LlxuICogQGF1dGhvciBBbmRyZXcgQWxsZW4gPGJpdGxsYW1hQGdvb2dsZS5jb20+XG4gKi9cblxuXG5cblxuLy8gSW50ZXJuYWwgZGVwZW5kZW5jaWVzLlxuY29uc3QgT21uaXRvbmUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEyKTtcbmNvbnN0IEVuY29kZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuY29uc3QgVXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKlxuICogQGNsYXNzIExpc3RlbmVyXG4gKiBAZGVzY3JpcHRpb24gTGlzdGVuZXIgbW9kZWwgdG8gc3BhdGlhbGl6ZSBzb3VyY2VzIGluIGFuIGVudmlyb25tZW50LlxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHRcbiAqIEFzc29jaWF0ZWQge0BsaW5rXG5odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Db250ZXh0IEF1ZGlvQ29udGV4dH0uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuYW1iaXNvbmljT3JkZXJcbiAqIERlc2lyZWQgYW1iaXNvbmljIG9yZGVyLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX0FNQklTT05JQ19PUkRFUiBERUZBVUxUX0FNQklTT05JQ19PUkRFUn0uXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gb3B0aW9ucy5wb3NpdGlvblxuICogSW5pdGlhbCBwb3NpdGlvbiAoaW4gbWV0ZXJzKSwgd2hlcmUgb3JpZ2luIGlzIHRoZSBjZW50ZXIgb2ZcbiAqIHRoZSByb29tLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1BPU0lUSU9OIERFRkFVTFRfUE9TSVRJT059LlxuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IG9wdGlvbnMuZm9yd2FyZFxuICogVGhlIGxpc3RlbmVyJ3MgaW5pdGlhbCBmb3J3YXJkIHZlY3Rvci4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9GT1JXQVJEIERFRkFVTFRfRk9SV0FSRH0uXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gb3B0aW9ucy51cFxuICogVGhlIGxpc3RlbmVyJ3MgaW5pdGlhbCB1cCB2ZWN0b3IuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfVVAgREVGQVVMVF9VUH0uXG4gKi9cbmZ1bmN0aW9uIExpc3RlbmVyKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgLy8gUHVibGljIHZhcmlhYmxlcy5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIChpbiBtZXRlcnMpLlxuICAgKiBAbWVtYmVyIHtGbG9hdDMyQXJyYXl9IHBvc2l0aW9uXG4gICAqIEBtZW1iZXJvZiBMaXN0ZW5lclxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIC8qKlxuICAgKiBBbWJpc29uaWMgKG11bHRpY2hhbm5lbCkgaW5wdXQge0BsaW5rXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb05vZGUgQXVkaW9Ob2RlfS5cbiAgICogQG1lbWJlciB7QXVkaW9Ob2RlfSBpbnB1dFxuICAgKiBAbWVtYmVyb2YgTGlzdGVuZXJcbiAgICogQGluc3RhbmNlXG4gICAqL1xuICAvKipcbiAgICogQmluYXVyYWxseS1yZW5kZXJlZCBzdGVyZW8gKDItY2hhbm5lbCkgb3V0cHV0IHtAbGlua1xuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Ob2RlIEF1ZGlvTm9kZX0uXG4gICAqIEBtZW1iZXIge0F1ZGlvTm9kZX0gb3V0cHV0XG4gICAqIEBtZW1iZXJvZiBMaXN0ZW5lclxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIC8qKlxuICAgKiBBbWJpc29uaWMgKG11bHRpY2hhbm5lbCkgb3V0cHV0IHtAbGlua1xuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Ob2RlIEF1ZGlvTm9kZX0uXG4gICAqIEBtZW1iZXIge0F1ZGlvTm9kZX0gYW1iaXNvbmljT3V0cHV0XG4gICAqIEBtZW1iZXJvZiBMaXN0ZW5lclxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIC8vIFVzZSBkZWZhdWx0cyBmb3IgdW5kZWZpbmVkIGFyZ3VtZW50cy5cbiAgaWYgKG9wdGlvbnMgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmIChvcHRpb25zLmFtYmlzb25pY09yZGVyID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMuYW1iaXNvbmljT3JkZXIgPSBVdGlscy5ERUZBVUxUX0FNQklTT05JQ19PUkRFUjtcbiAgfVxuICBpZiAob3B0aW9ucy5wb3NpdGlvbiA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLnBvc2l0aW9uID0gVXRpbHMuREVGQVVMVF9QT1NJVElPTi5zbGljZSgpO1xuICB9XG4gIGlmIChvcHRpb25zLmZvcndhcmQgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5mb3J3YXJkID0gVXRpbHMuREVGQVVMVF9GT1JXQVJELnNsaWNlKCk7XG4gIH1cbiAgaWYgKG9wdGlvbnMudXAgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy51cCA9IFV0aWxzLkRFRkFVTFRfVVAuc2xpY2UoKTtcbiAgfVxuXG4gIC8vIE1lbWJlciB2YXJpYWJsZXMuXG4gIHRoaXMucG9zaXRpb24gPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xuICB0aGlzLl90ZW1wTWF0cml4MyA9IG5ldyBGbG9hdDMyQXJyYXkoOSk7XG5cbiAgLy8gU2VsZWN0IHRoZSBhcHByb3ByaWF0ZSBIUklSIGZpbHRlcnMgdXNpbmcgMi1jaGFubmVsIGNodW5rcyBzaW5jZVxuICAvLyBtdWx0aWNoYW5uZWwgYXVkaW8gaXMgbm90IHlldCBzdXBwb3J0ZWQgYnkgYSBtYWpvcml0eSBvZiBicm93c2Vycy5cbiAgdGhpcy5fYW1iaXNvbmljT3JkZXIgPVxuICAgIEVuY29kZXIudmFsaWRhdGVBbWJpc29uaWNPcmRlcihvcHRpb25zLmFtYmlzb25pY09yZGVyKTtcblxuICAgIC8vIENyZWF0ZSBhdWRpbyBub2Rlcy5cbiAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gIGlmICh0aGlzLl9hbWJpc29uaWNPcmRlciA9PSAxKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIgPSBPbW5pdG9uZS5PbW5pdG9uZS5jcmVhdGVGT0FSZW5kZXJlcihjb250ZXh0LCB7fSk7XG4gIH0gZWxzZSBpZiAodGhpcy5fYW1iaXNvbmljT3JkZXIgPiAxKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIgPSBPbW5pdG9uZS5PbW5pdG9uZS5jcmVhdGVIT0FSZW5kZXJlcihjb250ZXh0LCB7XG4gICAgICBhbWJpc29uaWNPcmRlcjogdGhpcy5fYW1iaXNvbmljT3JkZXIsXG4gICAgfSk7XG4gIH1cblxuICAvLyBUaGVzZSBub2RlcyBhcmUgY3JlYXRlZCBpbiBvcmRlciB0byBzYWZlbHkgYXN5bmNocm9ub3VzbHkgbG9hZCBPbW5pdG9uZVxuICAvLyB3aGlsZSB0aGUgcmVzdCBvZiB0aGUgc2NlbmUgaXMgYmVpbmcgY3JlYXRlZC5cbiAgdGhpcy5pbnB1dCA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLm91dHB1dCA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLmFtYmlzb25pY091dHB1dCA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuXG4gIC8vIEluaXRpYWxpemUgT21uaXRvbmUgKGFzeW5jKSBhbmQgY29ubmVjdCB0byBhdWRpbyBncmFwaCB3aGVuIGNvbXBsZXRlLlxuICBsZXQgdGhhdCA9IHRoaXM7XG4gIHRoaXMuX3JlbmRlcmVyLmluaXRpYWxpemUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIC8vIENvbm5lY3QgcHJlLXJvdGF0ZWQgc291bmRmaWVsZCB0byByZW5kZXJlci5cbiAgICB0aGF0LmlucHV0LmNvbm5lY3QodGhhdC5fcmVuZGVyZXIuaW5wdXQpO1xuXG4gICAgLy8gQ29ubmVjdCByb3RhdGVkIHNvdW5kZmllbGQgdG8gYW1iaXNvbmljIG91dHB1dC5cbiAgICBpZiAodGhhdC5fYW1iaXNvbmljT3JkZXIgPiAxKSB7XG4gICAgICB0aGF0Ll9yZW5kZXJlci5faG9hUm90YXRvci5vdXRwdXQuY29ubmVjdCh0aGF0LmFtYmlzb25pY091dHB1dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX3JlbmRlcmVyLl9mb2FSb3RhdG9yLm91dHB1dC5jb25uZWN0KHRoYXQuYW1iaXNvbmljT3V0cHV0KTtcbiAgICB9XG5cbiAgICAvLyBDb25uZWN0IGJpbmF1cmFsbHktcmVuZGVyZWQgc291bmRmaWVsZCB0byBiaW5hdXJhbCBvdXRwdXQuXG4gICAgdGhhdC5fcmVuZGVyZXIub3V0cHV0LmNvbm5lY3QodGhhdC5vdXRwdXQpO1xuICB9KTtcblxuICAvLyBTZXQgb3JpZW50YXRpb24gYW5kIHVwZGF0ZSByb3RhdGlvbiBtYXRyaXggYWNjb3JkaW5nbHkuXG4gIHRoaXMuc2V0T3JpZW50YXRpb24ob3B0aW9ucy5mb3J3YXJkWzBdLCBvcHRpb25zLmZvcndhcmRbMV0sXG4gICAgb3B0aW9ucy5mb3J3YXJkWzJdLCBvcHRpb25zLnVwWzBdLCBvcHRpb25zLnVwWzFdLCBvcHRpb25zLnVwWzJdKTtcbn07XG5cblxuLyoqXG4gKiBTZXQgdGhlIHNvdXJjZSdzIG9yaWVudGF0aW9uIHVzaW5nIGZvcndhcmQgYW5kIHVwIHZlY3RvcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gZm9yd2FyZFhcbiAqIEBwYXJhbSB7TnVtYmVyfSBmb3J3YXJkWVxuICogQHBhcmFtIHtOdW1iZXJ9IGZvcndhcmRaXG4gKiBAcGFyYW0ge051bWJlcn0gdXBYXG4gKiBAcGFyYW0ge051bWJlcn0gdXBZXG4gKiBAcGFyYW0ge051bWJlcn0gdXBaXG4gKi9cbkxpc3RlbmVyLnByb3RvdHlwZS5zZXRPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKGZvcndhcmRYLCBmb3J3YXJkWSwgZm9yd2FyZFosXG4gIHVwWCwgdXBZLCB1cFopIHtcbiAgbGV0IHJpZ2h0ID0gVXRpbHMuY3Jvc3NQcm9kdWN0KFtmb3J3YXJkWCwgZm9yd2FyZFksIGZvcndhcmRaXSxcbiAgICBbdXBYLCB1cFksIHVwWl0pO1xuICB0aGlzLl90ZW1wTWF0cml4M1swXSA9IHJpZ2h0WzBdO1xuICB0aGlzLl90ZW1wTWF0cml4M1sxXSA9IHJpZ2h0WzFdO1xuICB0aGlzLl90ZW1wTWF0cml4M1syXSA9IHJpZ2h0WzJdO1xuICB0aGlzLl90ZW1wTWF0cml4M1szXSA9IHVwWDtcbiAgdGhpcy5fdGVtcE1hdHJpeDNbNF0gPSB1cFk7XG4gIHRoaXMuX3RlbXBNYXRyaXgzWzVdID0gdXBaO1xuICB0aGlzLl90ZW1wTWF0cml4M1s2XSA9IGZvcndhcmRYO1xuICB0aGlzLl90ZW1wTWF0cml4M1s3XSA9IGZvcndhcmRZO1xuICB0aGlzLl90ZW1wTWF0cml4M1s4XSA9IGZvcndhcmRaO1xuICB0aGlzLl9yZW5kZXJlci5zZXRSb3RhdGlvbk1hdHJpeDModGhpcy5fdGVtcE1hdHJpeDMpO1xufTtcblxuXG4vKipcbiAqIFNldCB0aGUgbGlzdGVuZXIncyBwb3NpdGlvbiBhbmQgb3JpZW50YXRpb24gdXNpbmcgYSBUaHJlZS5qcyBNYXRyaXg0IG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXRyaXg0XG4gKiBUaGUgVGhyZWUuanMgTWF0cml4NCBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBsaXN0ZW5lcidzIHdvcmxkIHRyYW5zZm9ybS5cbiAqL1xuTGlzdGVuZXIucHJvdG90eXBlLnNldEZyb21NYXRyaXggPSBmdW5jdGlvbihtYXRyaXg0KSB7XG4gIC8vIFVwZGF0ZSBhbWJpc29uaWMgcm90YXRpb24gbWF0cml4IGludGVybmFsbHkuXG4gIHRoaXMuX3JlbmRlcmVyLnNldFJvdGF0aW9uTWF0cml4NChtYXRyaXg0LmVsZW1lbnRzKTtcblxuICAvLyBFeHRyYWN0IHBvc2l0aW9uIGZyb20gbWF0cml4LlxuICB0aGlzLnBvc2l0aW9uWzBdID0gbWF0cml4NC5lbGVtZW50c1sxMl07XG4gIHRoaXMucG9zaXRpb25bMV0gPSBtYXRyaXg0LmVsZW1lbnRzWzEzXTtcbiAgdGhpcy5wb3NpdGlvblsyXSA9IG1hdHJpeDQuZWxlbWVudHNbMTRdO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RlbmVyO1xuXG5cbi8qKiovIH0pLFxuLyogMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlIFByZS1jb21wdXRlZCBsb29rdXAgdGFibGVzIGZvciBlbmNvZGluZyBhbWJpc29uaWMgc291cmNlcy5cbiAqIEBhdXRob3IgQW5kcmV3IEFsbGVuIDxiaXRsbGFtYUBnb29nbGUuY29tPlxuICovXG5cblxuXG5cbi8qKlxuICogUHJlLWNvbXB1dGVkIFNwaGVyaWNhbCBIYXJtb25pY3MgQ29lZmZpY2llbnRzLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gZ2VuZXJhdGVzIGFuIGVmZmljaWVudCBsb29rdXAgdGFibGUgb2YgU0ggY29lZmZpY2llbnRzLiBJdFxuICogZXhwbG9pdHMgdGhlIHdheSBTSHMgYXJlIGdlbmVyYXRlZCAoaS5lLiBZbG0gPSBObG0gKiBQbG0gKiBFbSkuIFNpbmNlIE5sbVxuICogJiBQbG0gY29lZmZpY2llbnRzIG9ubHkgZGVwZW5kIG9uIHRoZXRhLCBhbmQgRW0gb25seSBkZXBlbmRzIG9uIHBoaSwgd2VcbiAqIGNhbiBzZXBhcmF0ZSB0aGUgZXF1YXRpb24gYWxvbmcgdGhlc2UgbGluZXMuIEVtIGRvZXMgbm90IGRlcGVuZCBvblxuICogZGVncmVlLCBzbyB3ZSBvbmx5IG5lZWQgdG8gY29tcHV0ZSAoMiAqIGwpIHBlciBhemltdXRoIEVtIHRvdGFsIGFuZFxuICogTmxtICogUGxtIGlzIHN5bW1ldHJpY2FsIGFjcm9zcyBpbmRleGVzLCBzbyBvbmx5IHBvc2l0aXZlIGluZGV4ZXMgYXJlXG4gKiBjb21wdXRlZCAoKGwgKyAxKSAqIChsICsgMikgLyAyIC0gMSkgcGVyIGVsZXZhdGlvbi5cbiAqIEB0eXBlIHtGbG9hdDMyQXJyYXl9XG4gKi9cbmV4cG9ydHMuU1BIRVJJQ0FMX0hBUk1PTklDUyA9XG5bXG4gIFtcbiAgICBbMC4wMDAwMDAsIDAuMDAwMDAwLCAwLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gICAgWzAuMDUyMzM2LCAwLjAzNDg5OSwgMC4wMTc0NTIsIDAuOTk5ODQ4LCAwLjk5OTM5MSwgMC45OTg2MzBdLFxuICAgIFswLjEwNDUyOCwgMC4wNjk3NTYsIDAuMDM0ODk5LCAwLjk5OTM5MSwgMC45OTc1NjQsIDAuOTk0NTIyXSxcbiAgICBbMC4xNTY0MzQsIDAuMTA0NTI4LCAwLjA1MjMzNiwgMC45OTg2MzAsIDAuOTk0NTIyLCAwLjk4NzY4OF0sXG4gICAgWzAuMjA3OTEyLCAwLjEzOTE3MywgMC4wNjk3NTYsIDAuOTk3NTY0LCAwLjk5MDI2OCwgMC45NzgxNDhdLFxuICAgIFswLjI1ODgxOSwgMC4xNzM2NDgsIDAuMDg3MTU2LCAwLjk5NjE5NSwgMC45ODQ4MDgsIDAuOTY1OTI2XSxcbiAgICBbMC4zMDkwMTcsIDAuMjA3OTEyLCAwLjEwNDUyOCwgMC45OTQ1MjIsIDAuOTc4MTQ4LCAwLjk1MTA1N10sXG4gICAgWzAuMzU4MzY4LCAwLjI0MTkyMiwgMC4xMjE4NjksIDAuOTkyNTQ2LCAwLjk3MDI5NiwgMC45MzM1ODBdLFxuICAgIFswLjQwNjczNywgMC4yNzU2MzcsIDAuMTM5MTczLCAwLjk5MDI2OCwgMC45NjEyNjIsIDAuOTEzNTQ1XSxcbiAgICBbMC40NTM5OTAsIDAuMzA5MDE3LCAwLjE1NjQzNCwgMC45ODc2ODgsIDAuOTUxMDU3LCAwLjg5MTAwN10sXG4gICAgWzAuNTAwMDAwLCAwLjM0MjAyMCwgMC4xNzM2NDgsIDAuOTg0ODA4LCAwLjkzOTY5MywgMC44NjYwMjVdLFxuICAgIFswLjU0NDYzOSwgMC4zNzQ2MDcsIDAuMTkwODA5LCAwLjk4MTYyNywgMC45MjcxODQsIDAuODM4NjcxXSxcbiAgICBbMC41ODc3ODUsIDAuNDA2NzM3LCAwLjIwNzkxMiwgMC45NzgxNDgsIDAuOTEzNTQ1LCAwLjgwOTAxN10sXG4gICAgWzAuNjI5MzIwLCAwLjQzODM3MSwgMC4yMjQ5NTEsIDAuOTc0MzcwLCAwLjg5ODc5NCwgMC43NzcxNDZdLFxuICAgIFswLjY2OTEzMSwgMC40Njk0NzIsIDAuMjQxOTIyLCAwLjk3MDI5NiwgMC44ODI5NDgsIDAuNzQzMTQ1XSxcbiAgICBbMC43MDcxMDcsIDAuNTAwMDAwLCAwLjI1ODgxOSwgMC45NjU5MjYsIDAuODY2MDI1LCAwLjcwNzEwN10sXG4gICAgWzAuNzQzMTQ1LCAwLjUyOTkxOSwgMC4yNzU2MzcsIDAuOTYxMjYyLCAwLjg0ODA0OCwgMC42NjkxMzFdLFxuICAgIFswLjc3NzE0NiwgMC41NTkxOTMsIDAuMjkyMzcyLCAwLjk1NjMwNSwgMC44MjkwMzgsIDAuNjI5MzIwXSxcbiAgICBbMC44MDkwMTcsIDAuNTg3Nzg1LCAwLjMwOTAxNywgMC45NTEwNTcsIDAuODA5MDE3LCAwLjU4Nzc4NV0sXG4gICAgWzAuODM4NjcxLCAwLjYxNTY2MSwgMC4zMjU1NjgsIDAuOTQ1NTE5LCAwLjc4ODAxMSwgMC41NDQ2MzldLFxuICAgIFswLjg2NjAyNSwgMC42NDI3ODgsIDAuMzQyMDIwLCAwLjkzOTY5MywgMC43NjYwNDQsIDAuNTAwMDAwXSxcbiAgICBbMC44OTEwMDcsIDAuNjY5MTMxLCAwLjM1ODM2OCwgMC45MzM1ODAsIDAuNzQzMTQ1LCAwLjQ1Mzk5MF0sXG4gICAgWzAuOTEzNTQ1LCAwLjY5NDY1OCwgMC4zNzQ2MDcsIDAuOTI3MTg0LCAwLjcxOTM0MCwgMC40MDY3MzddLFxuICAgIFswLjkzMzU4MCwgMC43MTkzNDAsIDAuMzkwNzMxLCAwLjkyMDUwNSwgMC42OTQ2NTgsIDAuMzU4MzY4XSxcbiAgICBbMC45NTEwNTcsIDAuNzQzMTQ1LCAwLjQwNjczNywgMC45MTM1NDUsIDAuNjY5MTMxLCAwLjMwOTAxN10sXG4gICAgWzAuOTY1OTI2LCAwLjc2NjA0NCwgMC40MjI2MTgsIDAuOTA2MzA4LCAwLjY0Mjc4OCwgMC4yNTg4MTldLFxuICAgIFswLjk3ODE0OCwgMC43ODgwMTEsIDAuNDM4MzcxLCAwLjg5ODc5NCwgMC42MTU2NjEsIDAuMjA3OTEyXSxcbiAgICBbMC45ODc2ODgsIDAuODA5MDE3LCAwLjQ1Mzk5MCwgMC44OTEwMDcsIDAuNTg3Nzg1LCAwLjE1NjQzNF0sXG4gICAgWzAuOTk0NTIyLCAwLjgyOTAzOCwgMC40Njk0NzIsIDAuODgyOTQ4LCAwLjU1OTE5MywgMC4xMDQ1MjhdLFxuICAgIFswLjk5ODYzMCwgMC44NDgwNDgsIDAuNDg0ODEwLCAwLjg3NDYyMCwgMC41Mjk5MTksIDAuMDUyMzM2XSxcbiAgICBbMS4wMDAwMDAsIDAuODY2MDI1LCAwLjUwMDAwMCwgMC44NjYwMjUsIDAuNTAwMDAwLCAwLjAwMDAwMF0sXG4gICAgWzAuOTk4NjMwLCAwLjg4Mjk0OCwgMC41MTUwMzgsIDAuODU3MTY3LCAwLjQ2OTQ3MiwgLTAuMDUyMzM2XSxcbiAgICBbMC45OTQ1MjIsIDAuODk4Nzk0LCAwLjUyOTkxOSwgMC44NDgwNDgsIDAuNDM4MzcxLCAtMC4xMDQ1MjhdLFxuICAgIFswLjk4NzY4OCwgMC45MTM1NDUsIDAuNTQ0NjM5LCAwLjgzODY3MSwgMC40MDY3MzcsIC0wLjE1NjQzNF0sXG4gICAgWzAuOTc4MTQ4LCAwLjkyNzE4NCwgMC41NTkxOTMsIDAuODI5MDM4LCAwLjM3NDYwNywgLTAuMjA3OTEyXSxcbiAgICBbMC45NjU5MjYsIDAuOTM5NjkzLCAwLjU3MzU3NiwgMC44MTkxNTIsIDAuMzQyMDIwLCAtMC4yNTg4MTldLFxuICAgIFswLjk1MTA1NywgMC45NTEwNTcsIDAuNTg3Nzg1LCAwLjgwOTAxNywgMC4zMDkwMTcsIC0wLjMwOTAxN10sXG4gICAgWzAuOTMzNTgwLCAwLjk2MTI2MiwgMC42MDE4MTUsIDAuNzk4NjM2LCAwLjI3NTYzNywgLTAuMzU4MzY4XSxcbiAgICBbMC45MTM1NDUsIDAuOTcwMjk2LCAwLjYxNTY2MSwgMC43ODgwMTEsIDAuMjQxOTIyLCAtMC40MDY3MzddLFxuICAgIFswLjg5MTAwNywgMC45NzgxNDgsIDAuNjI5MzIwLCAwLjc3NzE0NiwgMC4yMDc5MTIsIC0wLjQ1Mzk5MF0sXG4gICAgWzAuODY2MDI1LCAwLjk4NDgwOCwgMC42NDI3ODgsIDAuNzY2MDQ0LCAwLjE3MzY0OCwgLTAuNTAwMDAwXSxcbiAgICBbMC44Mzg2NzEsIDAuOTkwMjY4LCAwLjY1NjA1OSwgMC43NTQ3MTAsIDAuMTM5MTczLCAtMC41NDQ2MzldLFxuICAgIFswLjgwOTAxNywgMC45OTQ1MjIsIDAuNjY5MTMxLCAwLjc0MzE0NSwgMC4xMDQ1MjgsIC0wLjU4Nzc4NV0sXG4gICAgWzAuNzc3MTQ2LCAwLjk5NzU2NCwgMC42ODE5OTgsIDAuNzMxMzU0LCAwLjA2OTc1NiwgLTAuNjI5MzIwXSxcbiAgICBbMC43NDMxNDUsIDAuOTk5MzkxLCAwLjY5NDY1OCwgMC43MTkzNDAsIDAuMDM0ODk5LCAtMC42NjkxMzFdLFxuICAgIFswLjcwNzEwNywgMS4wMDAwMDAsIDAuNzA3MTA3LCAwLjcwNzEwNywgMC4wMDAwMDAsIC0wLjcwNzEwN10sXG4gICAgWzAuNjY5MTMxLCAwLjk5OTM5MSwgMC43MTkzNDAsIDAuNjk0NjU4LCAtMC4wMzQ4OTksIC0wLjc0MzE0NV0sXG4gICAgWzAuNjI5MzIwLCAwLjk5NzU2NCwgMC43MzEzNTQsIDAuNjgxOTk4LCAtMC4wNjk3NTYsIC0wLjc3NzE0Nl0sXG4gICAgWzAuNTg3Nzg1LCAwLjk5NDUyMiwgMC43NDMxNDUsIDAuNjY5MTMxLCAtMC4xMDQ1MjgsIC0wLjgwOTAxN10sXG4gICAgWzAuNTQ0NjM5LCAwLjk5MDI2OCwgMC43NTQ3MTAsIDAuNjU2MDU5LCAtMC4xMzkxNzMsIC0wLjgzODY3MV0sXG4gICAgWzAuNTAwMDAwLCAwLjk4NDgwOCwgMC43NjYwNDQsIDAuNjQyNzg4LCAtMC4xNzM2NDgsIC0wLjg2NjAyNV0sXG4gICAgWzAuNDUzOTkwLCAwLjk3ODE0OCwgMC43NzcxNDYsIDAuNjI5MzIwLCAtMC4yMDc5MTIsIC0wLjg5MTAwN10sXG4gICAgWzAuNDA2NzM3LCAwLjk3MDI5NiwgMC43ODgwMTEsIDAuNjE1NjYxLCAtMC4yNDE5MjIsIC0wLjkxMzU0NV0sXG4gICAgWzAuMzU4MzY4LCAwLjk2MTI2MiwgMC43OTg2MzYsIDAuNjAxODE1LCAtMC4yNzU2MzcsIC0wLjkzMzU4MF0sXG4gICAgWzAuMzA5MDE3LCAwLjk1MTA1NywgMC44MDkwMTcsIDAuNTg3Nzg1LCAtMC4zMDkwMTcsIC0wLjk1MTA1N10sXG4gICAgWzAuMjU4ODE5LCAwLjkzOTY5MywgMC44MTkxNTIsIDAuNTczNTc2LCAtMC4zNDIwMjAsIC0wLjk2NTkyNl0sXG4gICAgWzAuMjA3OTEyLCAwLjkyNzE4NCwgMC44MjkwMzgsIDAuNTU5MTkzLCAtMC4zNzQ2MDcsIC0wLjk3ODE0OF0sXG4gICAgWzAuMTU2NDM0LCAwLjkxMzU0NSwgMC44Mzg2NzEsIDAuNTQ0NjM5LCAtMC40MDY3MzcsIC0wLjk4NzY4OF0sXG4gICAgWzAuMTA0NTI4LCAwLjg5ODc5NCwgMC44NDgwNDgsIDAuNTI5OTE5LCAtMC40MzgzNzEsIC0wLjk5NDUyMl0sXG4gICAgWzAuMDUyMzM2LCAwLjg4Mjk0OCwgMC44NTcxNjcsIDAuNTE1MDM4LCAtMC40Njk0NzIsIC0wLjk5ODYzMF0sXG4gICAgWzAuMDAwMDAwLCAwLjg2NjAyNSwgMC44NjYwMjUsIDAuNTAwMDAwLCAtMC41MDAwMDAsIC0xLjAwMDAwMF0sXG4gICAgWy0wLjA1MjMzNiwgMC44NDgwNDgsIDAuODc0NjIwLCAwLjQ4NDgxMCwgLTAuNTI5OTE5LCAtMC45OTg2MzBdLFxuICAgIFstMC4xMDQ1MjgsIDAuODI5MDM4LCAwLjg4Mjk0OCwgMC40Njk0NzIsIC0wLjU1OTE5MywgLTAuOTk0NTIyXSxcbiAgICBbLTAuMTU2NDM0LCAwLjgwOTAxNywgMC44OTEwMDcsIDAuNDUzOTkwLCAtMC41ODc3ODUsIC0wLjk4NzY4OF0sXG4gICAgWy0wLjIwNzkxMiwgMC43ODgwMTEsIDAuODk4Nzk0LCAwLjQzODM3MSwgLTAuNjE1NjYxLCAtMC45NzgxNDhdLFxuICAgIFstMC4yNTg4MTksIDAuNzY2MDQ0LCAwLjkwNjMwOCwgMC40MjI2MTgsIC0wLjY0Mjc4OCwgLTAuOTY1OTI2XSxcbiAgICBbLTAuMzA5MDE3LCAwLjc0MzE0NSwgMC45MTM1NDUsIDAuNDA2NzM3LCAtMC42NjkxMzEsIC0wLjk1MTA1N10sXG4gICAgWy0wLjM1ODM2OCwgMC43MTkzNDAsIDAuOTIwNTA1LCAwLjM5MDczMSwgLTAuNjk0NjU4LCAtMC45MzM1ODBdLFxuICAgIFstMC40MDY3MzcsIDAuNjk0NjU4LCAwLjkyNzE4NCwgMC4zNzQ2MDcsIC0wLjcxOTM0MCwgLTAuOTEzNTQ1XSxcbiAgICBbLTAuNDUzOTkwLCAwLjY2OTEzMSwgMC45MzM1ODAsIDAuMzU4MzY4LCAtMC43NDMxNDUsIC0wLjg5MTAwN10sXG4gICAgWy0wLjUwMDAwMCwgMC42NDI3ODgsIDAuOTM5NjkzLCAwLjM0MjAyMCwgLTAuNzY2MDQ0LCAtMC44NjYwMjVdLFxuICAgIFstMC41NDQ2MzksIDAuNjE1NjYxLCAwLjk0NTUxOSwgMC4zMjU1NjgsIC0wLjc4ODAxMSwgLTAuODM4NjcxXSxcbiAgICBbLTAuNTg3Nzg1LCAwLjU4Nzc4NSwgMC45NTEwNTcsIDAuMzA5MDE3LCAtMC44MDkwMTcsIC0wLjgwOTAxN10sXG4gICAgWy0wLjYyOTMyMCwgMC41NTkxOTMsIDAuOTU2MzA1LCAwLjI5MjM3MiwgLTAuODI5MDM4LCAtMC43NzcxNDZdLFxuICAgIFstMC42NjkxMzEsIDAuNTI5OTE5LCAwLjk2MTI2MiwgMC4yNzU2MzcsIC0wLjg0ODA0OCwgLTAuNzQzMTQ1XSxcbiAgICBbLTAuNzA3MTA3LCAwLjUwMDAwMCwgMC45NjU5MjYsIDAuMjU4ODE5LCAtMC44NjYwMjUsIC0wLjcwNzEwN10sXG4gICAgWy0wLjc0MzE0NSwgMC40Njk0NzIsIDAuOTcwMjk2LCAwLjI0MTkyMiwgLTAuODgyOTQ4LCAtMC42NjkxMzFdLFxuICAgIFstMC43NzcxNDYsIDAuNDM4MzcxLCAwLjk3NDM3MCwgMC4yMjQ5NTEsIC0wLjg5ODc5NCwgLTAuNjI5MzIwXSxcbiAgICBbLTAuODA5MDE3LCAwLjQwNjczNywgMC45NzgxNDgsIDAuMjA3OTEyLCAtMC45MTM1NDUsIC0wLjU4Nzc4NV0sXG4gICAgWy0wLjgzODY3MSwgMC4zNzQ2MDcsIDAuOTgxNjI3LCAwLjE5MDgwOSwgLTAuOTI3MTg0LCAtMC41NDQ2MzldLFxuICAgIFstMC44NjYwMjUsIDAuMzQyMDIwLCAwLjk4NDgwOCwgMC4xNzM2NDgsIC0wLjkzOTY5MywgLTAuNTAwMDAwXSxcbiAgICBbLTAuODkxMDA3LCAwLjMwOTAxNywgMC45ODc2ODgsIDAuMTU2NDM0LCAtMC45NTEwNTcsIC0wLjQ1Mzk5MF0sXG4gICAgWy0wLjkxMzU0NSwgMC4yNzU2MzcsIDAuOTkwMjY4LCAwLjEzOTE3MywgLTAuOTYxMjYyLCAtMC40MDY3MzddLFxuICAgIFstMC45MzM1ODAsIDAuMjQxOTIyLCAwLjk5MjU0NiwgMC4xMjE4NjksIC0wLjk3MDI5NiwgLTAuMzU4MzY4XSxcbiAgICBbLTAuOTUxMDU3LCAwLjIwNzkxMiwgMC45OTQ1MjIsIDAuMTA0NTI4LCAtMC45NzgxNDgsIC0wLjMwOTAxN10sXG4gICAgWy0wLjk2NTkyNiwgMC4xNzM2NDgsIDAuOTk2MTk1LCAwLjA4NzE1NiwgLTAuOTg0ODA4LCAtMC4yNTg4MTldLFxuICAgIFstMC45NzgxNDgsIDAuMTM5MTczLCAwLjk5NzU2NCwgMC4wNjk3NTYsIC0wLjk5MDI2OCwgLTAuMjA3OTEyXSxcbiAgICBbLTAuOTg3Njg4LCAwLjEwNDUyOCwgMC45OTg2MzAsIDAuMDUyMzM2LCAtMC45OTQ1MjIsIC0wLjE1NjQzNF0sXG4gICAgWy0wLjk5NDUyMiwgMC4wNjk3NTYsIDAuOTk5MzkxLCAwLjAzNDg5OSwgLTAuOTk3NTY0LCAtMC4xMDQ1MjhdLFxuICAgIFstMC45OTg2MzAsIDAuMDM0ODk5LCAwLjk5OTg0OCwgMC4wMTc0NTIsIC0wLjk5OTM5MSwgLTAuMDUyMzM2XSxcbiAgICBbLTEuMDAwMDAwLCAwLjAwMDAwMCwgMS4wMDAwMDAsIDAuMDAwMDAwLCAtMS4wMDAwMDAsIC0wLjAwMDAwMF0sXG4gICAgWy0wLjk5ODYzMCwgLTAuMDM0ODk5LCAwLjk5OTg0OCwgLTAuMDE3NDUyLCAtMC45OTkzOTEsIDAuMDUyMzM2XSxcbiAgICBbLTAuOTk0NTIyLCAtMC4wNjk3NTYsIDAuOTk5MzkxLCAtMC4wMzQ4OTksIC0wLjk5NzU2NCwgMC4xMDQ1MjhdLFxuICAgIFstMC45ODc2ODgsIC0wLjEwNDUyOCwgMC45OTg2MzAsIC0wLjA1MjMzNiwgLTAuOTk0NTIyLCAwLjE1NjQzNF0sXG4gICAgWy0wLjk3ODE0OCwgLTAuMTM5MTczLCAwLjk5NzU2NCwgLTAuMDY5NzU2LCAtMC45OTAyNjgsIDAuMjA3OTEyXSxcbiAgICBbLTAuOTY1OTI2LCAtMC4xNzM2NDgsIDAuOTk2MTk1LCAtMC4wODcxNTYsIC0wLjk4NDgwOCwgMC4yNTg4MTldLFxuICAgIFstMC45NTEwNTcsIC0wLjIwNzkxMiwgMC45OTQ1MjIsIC0wLjEwNDUyOCwgLTAuOTc4MTQ4LCAwLjMwOTAxN10sXG4gICAgWy0wLjkzMzU4MCwgLTAuMjQxOTIyLCAwLjk5MjU0NiwgLTAuMTIxODY5LCAtMC45NzAyOTYsIDAuMzU4MzY4XSxcbiAgICBbLTAuOTEzNTQ1LCAtMC4yNzU2MzcsIDAuOTkwMjY4LCAtMC4xMzkxNzMsIC0wLjk2MTI2MiwgMC40MDY3MzddLFxuICAgIFstMC44OTEwMDcsIC0wLjMwOTAxNywgMC45ODc2ODgsIC0wLjE1NjQzNCwgLTAuOTUxMDU3LCAwLjQ1Mzk5MF0sXG4gICAgWy0wLjg2NjAyNSwgLTAuMzQyMDIwLCAwLjk4NDgwOCwgLTAuMTczNjQ4LCAtMC45Mzk2OTMsIDAuNTAwMDAwXSxcbiAgICBbLTAuODM4NjcxLCAtMC4zNzQ2MDcsIDAuOTgxNjI3LCAtMC4xOTA4MDksIC0wLjkyNzE4NCwgMC41NDQ2MzldLFxuICAgIFstMC44MDkwMTcsIC0wLjQwNjczNywgMC45NzgxNDgsIC0wLjIwNzkxMiwgLTAuOTEzNTQ1LCAwLjU4Nzc4NV0sXG4gICAgWy0wLjc3NzE0NiwgLTAuNDM4MzcxLCAwLjk3NDM3MCwgLTAuMjI0OTUxLCAtMC44OTg3OTQsIDAuNjI5MzIwXSxcbiAgICBbLTAuNzQzMTQ1LCAtMC40Njk0NzIsIDAuOTcwMjk2LCAtMC4yNDE5MjIsIC0wLjg4Mjk0OCwgMC42NjkxMzFdLFxuICAgIFstMC43MDcxMDcsIC0wLjUwMDAwMCwgMC45NjU5MjYsIC0wLjI1ODgxOSwgLTAuODY2MDI1LCAwLjcwNzEwN10sXG4gICAgWy0wLjY2OTEzMSwgLTAuNTI5OTE5LCAwLjk2MTI2MiwgLTAuMjc1NjM3LCAtMC44NDgwNDgsIDAuNzQzMTQ1XSxcbiAgICBbLTAuNjI5MzIwLCAtMC41NTkxOTMsIDAuOTU2MzA1LCAtMC4yOTIzNzIsIC0wLjgyOTAzOCwgMC43NzcxNDZdLFxuICAgIFstMC41ODc3ODUsIC0wLjU4Nzc4NSwgMC45NTEwNTcsIC0wLjMwOTAxNywgLTAuODA5MDE3LCAwLjgwOTAxN10sXG4gICAgWy0wLjU0NDYzOSwgLTAuNjE1NjYxLCAwLjk0NTUxOSwgLTAuMzI1NTY4LCAtMC43ODgwMTEsIDAuODM4NjcxXSxcbiAgICBbLTAuNTAwMDAwLCAtMC42NDI3ODgsIDAuOTM5NjkzLCAtMC4zNDIwMjAsIC0wLjc2NjA0NCwgMC44NjYwMjVdLFxuICAgIFstMC40NTM5OTAsIC0wLjY2OTEzMSwgMC45MzM1ODAsIC0wLjM1ODM2OCwgLTAuNzQzMTQ1LCAwLjg5MTAwN10sXG4gICAgWy0wLjQwNjczNywgLTAuNjk0NjU4LCAwLjkyNzE4NCwgLTAuMzc0NjA3LCAtMC43MTkzNDAsIDAuOTEzNTQ1XSxcbiAgICBbLTAuMzU4MzY4LCAtMC43MTkzNDAsIDAuOTIwNTA1LCAtMC4zOTA3MzEsIC0wLjY5NDY1OCwgMC45MzM1ODBdLFxuICAgIFstMC4zMDkwMTcsIC0wLjc0MzE0NSwgMC45MTM1NDUsIC0wLjQwNjczNywgLTAuNjY5MTMxLCAwLjk1MTA1N10sXG4gICAgWy0wLjI1ODgxOSwgLTAuNzY2MDQ0LCAwLjkwNjMwOCwgLTAuNDIyNjE4LCAtMC42NDI3ODgsIDAuOTY1OTI2XSxcbiAgICBbLTAuMjA3OTEyLCAtMC43ODgwMTEsIDAuODk4Nzk0LCAtMC40MzgzNzEsIC0wLjYxNTY2MSwgMC45NzgxNDhdLFxuICAgIFstMC4xNTY0MzQsIC0wLjgwOTAxNywgMC44OTEwMDcsIC0wLjQ1Mzk5MCwgLTAuNTg3Nzg1LCAwLjk4NzY4OF0sXG4gICAgWy0wLjEwNDUyOCwgLTAuODI5MDM4LCAwLjg4Mjk0OCwgLTAuNDY5NDcyLCAtMC41NTkxOTMsIDAuOTk0NTIyXSxcbiAgICBbLTAuMDUyMzM2LCAtMC44NDgwNDgsIDAuODc0NjIwLCAtMC40ODQ4MTAsIC0wLjUyOTkxOSwgMC45OTg2MzBdLFxuICAgIFstMC4wMDAwMDAsIC0wLjg2NjAyNSwgMC44NjYwMjUsIC0wLjUwMDAwMCwgLTAuNTAwMDAwLCAxLjAwMDAwMF0sXG4gICAgWzAuMDUyMzM2LCAtMC44ODI5NDgsIDAuODU3MTY3LCAtMC41MTUwMzgsIC0wLjQ2OTQ3MiwgMC45OTg2MzBdLFxuICAgIFswLjEwNDUyOCwgLTAuODk4Nzk0LCAwLjg0ODA0OCwgLTAuNTI5OTE5LCAtMC40MzgzNzEsIDAuOTk0NTIyXSxcbiAgICBbMC4xNTY0MzQsIC0wLjkxMzU0NSwgMC44Mzg2NzEsIC0wLjU0NDYzOSwgLTAuNDA2NzM3LCAwLjk4NzY4OF0sXG4gICAgWzAuMjA3OTEyLCAtMC45MjcxODQsIDAuODI5MDM4LCAtMC41NTkxOTMsIC0wLjM3NDYwNywgMC45NzgxNDhdLFxuICAgIFswLjI1ODgxOSwgLTAuOTM5NjkzLCAwLjgxOTE1MiwgLTAuNTczNTc2LCAtMC4zNDIwMjAsIDAuOTY1OTI2XSxcbiAgICBbMC4zMDkwMTcsIC0wLjk1MTA1NywgMC44MDkwMTcsIC0wLjU4Nzc4NSwgLTAuMzA5MDE3LCAwLjk1MTA1N10sXG4gICAgWzAuMzU4MzY4LCAtMC45NjEyNjIsIDAuNzk4NjM2LCAtMC42MDE4MTUsIC0wLjI3NTYzNywgMC45MzM1ODBdLFxuICAgIFswLjQwNjczNywgLTAuOTcwMjk2LCAwLjc4ODAxMSwgLTAuNjE1NjYxLCAtMC4yNDE5MjIsIDAuOTEzNTQ1XSxcbiAgICBbMC40NTM5OTAsIC0wLjk3ODE0OCwgMC43NzcxNDYsIC0wLjYyOTMyMCwgLTAuMjA3OTEyLCAwLjg5MTAwN10sXG4gICAgWzAuNTAwMDAwLCAtMC45ODQ4MDgsIDAuNzY2MDQ0LCAtMC42NDI3ODgsIC0wLjE3MzY0OCwgMC44NjYwMjVdLFxuICAgIFswLjU0NDYzOSwgLTAuOTkwMjY4LCAwLjc1NDcxMCwgLTAuNjU2MDU5LCAtMC4xMzkxNzMsIDAuODM4NjcxXSxcbiAgICBbMC41ODc3ODUsIC0wLjk5NDUyMiwgMC43NDMxNDUsIC0wLjY2OTEzMSwgLTAuMTA0NTI4LCAwLjgwOTAxN10sXG4gICAgWzAuNjI5MzIwLCAtMC45OTc1NjQsIDAuNzMxMzU0LCAtMC42ODE5OTgsIC0wLjA2OTc1NiwgMC43NzcxNDZdLFxuICAgIFswLjY2OTEzMSwgLTAuOTk5MzkxLCAwLjcxOTM0MCwgLTAuNjk0NjU4LCAtMC4wMzQ4OTksIDAuNzQzMTQ1XSxcbiAgICBbMC43MDcxMDcsIC0xLjAwMDAwMCwgMC43MDcxMDcsIC0wLjcwNzEwNywgLTAuMDAwMDAwLCAwLjcwNzEwN10sXG4gICAgWzAuNzQzMTQ1LCAtMC45OTkzOTEsIDAuNjk0NjU4LCAtMC43MTkzNDAsIDAuMDM0ODk5LCAwLjY2OTEzMV0sXG4gICAgWzAuNzc3MTQ2LCAtMC45OTc1NjQsIDAuNjgxOTk4LCAtMC43MzEzNTQsIDAuMDY5NzU2LCAwLjYyOTMyMF0sXG4gICAgWzAuODA5MDE3LCAtMC45OTQ1MjIsIDAuNjY5MTMxLCAtMC43NDMxNDUsIDAuMTA0NTI4LCAwLjU4Nzc4NV0sXG4gICAgWzAuODM4NjcxLCAtMC45OTAyNjgsIDAuNjU2MDU5LCAtMC43NTQ3MTAsIDAuMTM5MTczLCAwLjU0NDYzOV0sXG4gICAgWzAuODY2MDI1LCAtMC45ODQ4MDgsIDAuNjQyNzg4LCAtMC43NjYwNDQsIDAuMTczNjQ4LCAwLjUwMDAwMF0sXG4gICAgWzAuODkxMDA3LCAtMC45NzgxNDgsIDAuNjI5MzIwLCAtMC43NzcxNDYsIDAuMjA3OTEyLCAwLjQ1Mzk5MF0sXG4gICAgWzAuOTEzNTQ1LCAtMC45NzAyOTYsIDAuNjE1NjYxLCAtMC43ODgwMTEsIDAuMjQxOTIyLCAwLjQwNjczN10sXG4gICAgWzAuOTMzNTgwLCAtMC45NjEyNjIsIDAuNjAxODE1LCAtMC43OTg2MzYsIDAuMjc1NjM3LCAwLjM1ODM2OF0sXG4gICAgWzAuOTUxMDU3LCAtMC45NTEwNTcsIDAuNTg3Nzg1LCAtMC44MDkwMTcsIDAuMzA5MDE3LCAwLjMwOTAxN10sXG4gICAgWzAuOTY1OTI2LCAtMC45Mzk2OTMsIDAuNTczNTc2LCAtMC44MTkxNTIsIDAuMzQyMDIwLCAwLjI1ODgxOV0sXG4gICAgWzAuOTc4MTQ4LCAtMC45MjcxODQsIDAuNTU5MTkzLCAtMC44MjkwMzgsIDAuMzc0NjA3LCAwLjIwNzkxMl0sXG4gICAgWzAuOTg3Njg4LCAtMC45MTM1NDUsIDAuNTQ0NjM5LCAtMC44Mzg2NzEsIDAuNDA2NzM3LCAwLjE1NjQzNF0sXG4gICAgWzAuOTk0NTIyLCAtMC44OTg3OTQsIDAuNTI5OTE5LCAtMC44NDgwNDgsIDAuNDM4MzcxLCAwLjEwNDUyOF0sXG4gICAgWzAuOTk4NjMwLCAtMC44ODI5NDgsIDAuNTE1MDM4LCAtMC44NTcxNjcsIDAuNDY5NDcyLCAwLjA1MjMzNl0sXG4gICAgWzEuMDAwMDAwLCAtMC44NjYwMjUsIDAuNTAwMDAwLCAtMC44NjYwMjUsIDAuNTAwMDAwLCAwLjAwMDAwMF0sXG4gICAgWzAuOTk4NjMwLCAtMC44NDgwNDgsIDAuNDg0ODEwLCAtMC44NzQ2MjAsIDAuNTI5OTE5LCAtMC4wNTIzMzZdLFxuICAgIFswLjk5NDUyMiwgLTAuODI5MDM4LCAwLjQ2OTQ3MiwgLTAuODgyOTQ4LCAwLjU1OTE5MywgLTAuMTA0NTI4XSxcbiAgICBbMC45ODc2ODgsIC0wLjgwOTAxNywgMC40NTM5OTAsIC0wLjg5MTAwNywgMC41ODc3ODUsIC0wLjE1NjQzNF0sXG4gICAgWzAuOTc4MTQ4LCAtMC43ODgwMTEsIDAuNDM4MzcxLCAtMC44OTg3OTQsIDAuNjE1NjYxLCAtMC4yMDc5MTJdLFxuICAgIFswLjk2NTkyNiwgLTAuNzY2MDQ0LCAwLjQyMjYxOCwgLTAuOTA2MzA4LCAwLjY0Mjc4OCwgLTAuMjU4ODE5XSxcbiAgICBbMC45NTEwNTcsIC0wLjc0MzE0NSwgMC40MDY3MzcsIC0wLjkxMzU0NSwgMC42NjkxMzEsIC0wLjMwOTAxN10sXG4gICAgWzAuOTMzNTgwLCAtMC43MTkzNDAsIDAuMzkwNzMxLCAtMC45MjA1MDUsIDAuNjk0NjU4LCAtMC4zNTgzNjhdLFxuICAgIFswLjkxMzU0NSwgLTAuNjk0NjU4LCAwLjM3NDYwNywgLTAuOTI3MTg0LCAwLjcxOTM0MCwgLTAuNDA2NzM3XSxcbiAgICBbMC44OTEwMDcsIC0wLjY2OTEzMSwgMC4zNTgzNjgsIC0wLjkzMzU4MCwgMC43NDMxNDUsIC0wLjQ1Mzk5MF0sXG4gICAgWzAuODY2MDI1LCAtMC42NDI3ODgsIDAuMzQyMDIwLCAtMC45Mzk2OTMsIDAuNzY2MDQ0LCAtMC41MDAwMDBdLFxuICAgIFswLjgzODY3MSwgLTAuNjE1NjYxLCAwLjMyNTU2OCwgLTAuOTQ1NTE5LCAwLjc4ODAxMSwgLTAuNTQ0NjM5XSxcbiAgICBbMC44MDkwMTcsIC0wLjU4Nzc4NSwgMC4zMDkwMTcsIC0wLjk1MTA1NywgMC44MDkwMTcsIC0wLjU4Nzc4NV0sXG4gICAgWzAuNzc3MTQ2LCAtMC41NTkxOTMsIDAuMjkyMzcyLCAtMC45NTYzMDUsIDAuODI5MDM4LCAtMC42MjkzMjBdLFxuICAgIFswLjc0MzE0NSwgLTAuNTI5OTE5LCAwLjI3NTYzNywgLTAuOTYxMjYyLCAwLjg0ODA0OCwgLTAuNjY5MTMxXSxcbiAgICBbMC43MDcxMDcsIC0wLjUwMDAwMCwgMC4yNTg4MTksIC0wLjk2NTkyNiwgMC44NjYwMjUsIC0wLjcwNzEwN10sXG4gICAgWzAuNjY5MTMxLCAtMC40Njk0NzIsIDAuMjQxOTIyLCAtMC45NzAyOTYsIDAuODgyOTQ4LCAtMC43NDMxNDVdLFxuICAgIFswLjYyOTMyMCwgLTAuNDM4MzcxLCAwLjIyNDk1MSwgLTAuOTc0MzcwLCAwLjg5ODc5NCwgLTAuNzc3MTQ2XSxcbiAgICBbMC41ODc3ODUsIC0wLjQwNjczNywgMC4yMDc5MTIsIC0wLjk3ODE0OCwgMC45MTM1NDUsIC0wLjgwOTAxN10sXG4gICAgWzAuNTQ0NjM5LCAtMC4zNzQ2MDcsIDAuMTkwODA5LCAtMC45ODE2MjcsIDAuOTI3MTg0LCAtMC44Mzg2NzFdLFxuICAgIFswLjUwMDAwMCwgLTAuMzQyMDIwLCAwLjE3MzY0OCwgLTAuOTg0ODA4LCAwLjkzOTY5MywgLTAuODY2MDI1XSxcbiAgICBbMC40NTM5OTAsIC0wLjMwOTAxNywgMC4xNTY0MzQsIC0wLjk4NzY4OCwgMC45NTEwNTcsIC0wLjg5MTAwN10sXG4gICAgWzAuNDA2NzM3LCAtMC4yNzU2MzcsIDAuMTM5MTczLCAtMC45OTAyNjgsIDAuOTYxMjYyLCAtMC45MTM1NDVdLFxuICAgIFswLjM1ODM2OCwgLTAuMjQxOTIyLCAwLjEyMTg2OSwgLTAuOTkyNTQ2LCAwLjk3MDI5NiwgLTAuOTMzNTgwXSxcbiAgICBbMC4zMDkwMTcsIC0wLjIwNzkxMiwgMC4xMDQ1MjgsIC0wLjk5NDUyMiwgMC45NzgxNDgsIC0wLjk1MTA1N10sXG4gICAgWzAuMjU4ODE5LCAtMC4xNzM2NDgsIDAuMDg3MTU2LCAtMC45OTYxOTUsIDAuOTg0ODA4LCAtMC45NjU5MjZdLFxuICAgIFswLjIwNzkxMiwgLTAuMTM5MTczLCAwLjA2OTc1NiwgLTAuOTk3NTY0LCAwLjk5MDI2OCwgLTAuOTc4MTQ4XSxcbiAgICBbMC4xNTY0MzQsIC0wLjEwNDUyOCwgMC4wNTIzMzYsIC0wLjk5ODYzMCwgMC45OTQ1MjIsIC0wLjk4NzY4OF0sXG4gICAgWzAuMTA0NTI4LCAtMC4wNjk3NTYsIDAuMDM0ODk5LCAtMC45OTkzOTEsIDAuOTk3NTY0LCAtMC45OTQ1MjJdLFxuICAgIFswLjA1MjMzNiwgLTAuMDM0ODk5LCAwLjAxNzQ1MiwgLTAuOTk5ODQ4LCAwLjk5OTM5MSwgLTAuOTk4NjMwXSxcbiAgICBbMC4wMDAwMDAsIC0wLjAwMDAwMCwgMC4wMDAwMDAsIC0xLjAwMDAwMCwgMS4wMDAwMDAsIC0xLjAwMDAwMF0sXG4gICAgWy0wLjA1MjMzNiwgMC4wMzQ4OTksIC0wLjAxNzQ1MiwgLTAuOTk5ODQ4LCAwLjk5OTM5MSwgLTAuOTk4NjMwXSxcbiAgICBbLTAuMTA0NTI4LCAwLjA2OTc1NiwgLTAuMDM0ODk5LCAtMC45OTkzOTEsIDAuOTk3NTY0LCAtMC45OTQ1MjJdLFxuICAgIFstMC4xNTY0MzQsIDAuMTA0NTI4LCAtMC4wNTIzMzYsIC0wLjk5ODYzMCwgMC45OTQ1MjIsIC0wLjk4NzY4OF0sXG4gICAgWy0wLjIwNzkxMiwgMC4xMzkxNzMsIC0wLjA2OTc1NiwgLTAuOTk3NTY0LCAwLjk5MDI2OCwgLTAuOTc4MTQ4XSxcbiAgICBbLTAuMjU4ODE5LCAwLjE3MzY0OCwgLTAuMDg3MTU2LCAtMC45OTYxOTUsIDAuOTg0ODA4LCAtMC45NjU5MjZdLFxuICAgIFstMC4zMDkwMTcsIDAuMjA3OTEyLCAtMC4xMDQ1MjgsIC0wLjk5NDUyMiwgMC45NzgxNDgsIC0wLjk1MTA1N10sXG4gICAgWy0wLjM1ODM2OCwgMC4yNDE5MjIsIC0wLjEyMTg2OSwgLTAuOTkyNTQ2LCAwLjk3MDI5NiwgLTAuOTMzNTgwXSxcbiAgICBbLTAuNDA2NzM3LCAwLjI3NTYzNywgLTAuMTM5MTczLCAtMC45OTAyNjgsIDAuOTYxMjYyLCAtMC45MTM1NDVdLFxuICAgIFstMC40NTM5OTAsIDAuMzA5MDE3LCAtMC4xNTY0MzQsIC0wLjk4NzY4OCwgMC45NTEwNTcsIC0wLjg5MTAwN10sXG4gICAgWy0wLjUwMDAwMCwgMC4zNDIwMjAsIC0wLjE3MzY0OCwgLTAuOTg0ODA4LCAwLjkzOTY5MywgLTAuODY2MDI1XSxcbiAgICBbLTAuNTQ0NjM5LCAwLjM3NDYwNywgLTAuMTkwODA5LCAtMC45ODE2MjcsIDAuOTI3MTg0LCAtMC44Mzg2NzFdLFxuICAgIFstMC41ODc3ODUsIDAuNDA2NzM3LCAtMC4yMDc5MTIsIC0wLjk3ODE0OCwgMC45MTM1NDUsIC0wLjgwOTAxN10sXG4gICAgWy0wLjYyOTMyMCwgMC40MzgzNzEsIC0wLjIyNDk1MSwgLTAuOTc0MzcwLCAwLjg5ODc5NCwgLTAuNzc3MTQ2XSxcbiAgICBbLTAuNjY5MTMxLCAwLjQ2OTQ3MiwgLTAuMjQxOTIyLCAtMC45NzAyOTYsIDAuODgyOTQ4LCAtMC43NDMxNDVdLFxuICAgIFstMC43MDcxMDcsIDAuNTAwMDAwLCAtMC4yNTg4MTksIC0wLjk2NTkyNiwgMC44NjYwMjUsIC0wLjcwNzEwN10sXG4gICAgWy0wLjc0MzE0NSwgMC41Mjk5MTksIC0wLjI3NTYzNywgLTAuOTYxMjYyLCAwLjg0ODA0OCwgLTAuNjY5MTMxXSxcbiAgICBbLTAuNzc3MTQ2LCAwLjU1OTE5MywgLTAuMjkyMzcyLCAtMC45NTYzMDUsIDAuODI5MDM4LCAtMC42MjkzMjBdLFxuICAgIFstMC44MDkwMTcsIDAuNTg3Nzg1LCAtMC4zMDkwMTcsIC0wLjk1MTA1NywgMC44MDkwMTcsIC0wLjU4Nzc4NV0sXG4gICAgWy0wLjgzODY3MSwgMC42MTU2NjEsIC0wLjMyNTU2OCwgLTAuOTQ1NTE5LCAwLjc4ODAxMSwgLTAuNTQ0NjM5XSxcbiAgICBbLTAuODY2MDI1LCAwLjY0Mjc4OCwgLTAuMzQyMDIwLCAtMC45Mzk2OTMsIDAuNzY2MDQ0LCAtMC41MDAwMDBdLFxuICAgIFstMC44OTEwMDcsIDAuNjY5MTMxLCAtMC4zNTgzNjgsIC0wLjkzMzU4MCwgMC43NDMxNDUsIC0wLjQ1Mzk5MF0sXG4gICAgWy0wLjkxMzU0NSwgMC42OTQ2NTgsIC0wLjM3NDYwNywgLTAuOTI3MTg0LCAwLjcxOTM0MCwgLTAuNDA2NzM3XSxcbiAgICBbLTAuOTMzNTgwLCAwLjcxOTM0MCwgLTAuMzkwNzMxLCAtMC45MjA1MDUsIDAuNjk0NjU4LCAtMC4zNTgzNjhdLFxuICAgIFstMC45NTEwNTcsIDAuNzQzMTQ1LCAtMC40MDY3MzcsIC0wLjkxMzU0NSwgMC42NjkxMzEsIC0wLjMwOTAxN10sXG4gICAgWy0wLjk2NTkyNiwgMC43NjYwNDQsIC0wLjQyMjYxOCwgLTAuOTA2MzA4LCAwLjY0Mjc4OCwgLTAuMjU4ODE5XSxcbiAgICBbLTAuOTc4MTQ4LCAwLjc4ODAxMSwgLTAuNDM4MzcxLCAtMC44OTg3OTQsIDAuNjE1NjYxLCAtMC4yMDc5MTJdLFxuICAgIFstMC45ODc2ODgsIDAuODA5MDE3LCAtMC40NTM5OTAsIC0wLjg5MTAwNywgMC41ODc3ODUsIC0wLjE1NjQzNF0sXG4gICAgWy0wLjk5NDUyMiwgMC44MjkwMzgsIC0wLjQ2OTQ3MiwgLTAuODgyOTQ4LCAwLjU1OTE5MywgLTAuMTA0NTI4XSxcbiAgICBbLTAuOTk4NjMwLCAwLjg0ODA0OCwgLTAuNDg0ODEwLCAtMC44NzQ2MjAsIDAuNTI5OTE5LCAtMC4wNTIzMzZdLFxuICAgIFstMS4wMDAwMDAsIDAuODY2MDI1LCAtMC41MDAwMDAsIC0wLjg2NjAyNSwgMC41MDAwMDAsIDAuMDAwMDAwXSxcbiAgICBbLTAuOTk4NjMwLCAwLjg4Mjk0OCwgLTAuNTE1MDM4LCAtMC44NTcxNjcsIDAuNDY5NDcyLCAwLjA1MjMzNl0sXG4gICAgWy0wLjk5NDUyMiwgMC44OTg3OTQsIC0wLjUyOTkxOSwgLTAuODQ4MDQ4LCAwLjQzODM3MSwgMC4xMDQ1MjhdLFxuICAgIFstMC45ODc2ODgsIDAuOTEzNTQ1LCAtMC41NDQ2MzksIC0wLjgzODY3MSwgMC40MDY3MzcsIDAuMTU2NDM0XSxcbiAgICBbLTAuOTc4MTQ4LCAwLjkyNzE4NCwgLTAuNTU5MTkzLCAtMC44MjkwMzgsIDAuMzc0NjA3LCAwLjIwNzkxMl0sXG4gICAgWy0wLjk2NTkyNiwgMC45Mzk2OTMsIC0wLjU3MzU3NiwgLTAuODE5MTUyLCAwLjM0MjAyMCwgMC4yNTg4MTldLFxuICAgIFstMC45NTEwNTcsIDAuOTUxMDU3LCAtMC41ODc3ODUsIC0wLjgwOTAxNywgMC4zMDkwMTcsIDAuMzA5MDE3XSxcbiAgICBbLTAuOTMzNTgwLCAwLjk2MTI2MiwgLTAuNjAxODE1LCAtMC43OTg2MzYsIDAuMjc1NjM3LCAwLjM1ODM2OF0sXG4gICAgWy0wLjkxMzU0NSwgMC45NzAyOTYsIC0wLjYxNTY2MSwgLTAuNzg4MDExLCAwLjI0MTkyMiwgMC40MDY3MzddLFxuICAgIFstMC44OTEwMDcsIDAuOTc4MTQ4LCAtMC42MjkzMjAsIC0wLjc3NzE0NiwgMC4yMDc5MTIsIDAuNDUzOTkwXSxcbiAgICBbLTAuODY2MDI1LCAwLjk4NDgwOCwgLTAuNjQyNzg4LCAtMC43NjYwNDQsIDAuMTczNjQ4LCAwLjUwMDAwMF0sXG4gICAgWy0wLjgzODY3MSwgMC45OTAyNjgsIC0wLjY1NjA1OSwgLTAuNzU0NzEwLCAwLjEzOTE3MywgMC41NDQ2MzldLFxuICAgIFstMC44MDkwMTcsIDAuOTk0NTIyLCAtMC42NjkxMzEsIC0wLjc0MzE0NSwgMC4xMDQ1MjgsIDAuNTg3Nzg1XSxcbiAgICBbLTAuNzc3MTQ2LCAwLjk5NzU2NCwgLTAuNjgxOTk4LCAtMC43MzEzNTQsIDAuMDY5NzU2LCAwLjYyOTMyMF0sXG4gICAgWy0wLjc0MzE0NSwgMC45OTkzOTEsIC0wLjY5NDY1OCwgLTAuNzE5MzQwLCAwLjAzNDg5OSwgMC42NjkxMzFdLFxuICAgIFstMC43MDcxMDcsIDEuMDAwMDAwLCAtMC43MDcxMDcsIC0wLjcwNzEwNywgMC4wMDAwMDAsIDAuNzA3MTA3XSxcbiAgICBbLTAuNjY5MTMxLCAwLjk5OTM5MSwgLTAuNzE5MzQwLCAtMC42OTQ2NTgsIC0wLjAzNDg5OSwgMC43NDMxNDVdLFxuICAgIFstMC42MjkzMjAsIDAuOTk3NTY0LCAtMC43MzEzNTQsIC0wLjY4MTk5OCwgLTAuMDY5NzU2LCAwLjc3NzE0Nl0sXG4gICAgWy0wLjU4Nzc4NSwgMC45OTQ1MjIsIC0wLjc0MzE0NSwgLTAuNjY5MTMxLCAtMC4xMDQ1MjgsIDAuODA5MDE3XSxcbiAgICBbLTAuNTQ0NjM5LCAwLjk5MDI2OCwgLTAuNzU0NzEwLCAtMC42NTYwNTksIC0wLjEzOTE3MywgMC44Mzg2NzFdLFxuICAgIFstMC41MDAwMDAsIDAuOTg0ODA4LCAtMC43NjYwNDQsIC0wLjY0Mjc4OCwgLTAuMTczNjQ4LCAwLjg2NjAyNV0sXG4gICAgWy0wLjQ1Mzk5MCwgMC45NzgxNDgsIC0wLjc3NzE0NiwgLTAuNjI5MzIwLCAtMC4yMDc5MTIsIDAuODkxMDA3XSxcbiAgICBbLTAuNDA2NzM3LCAwLjk3MDI5NiwgLTAuNzg4MDExLCAtMC42MTU2NjEsIC0wLjI0MTkyMiwgMC45MTM1NDVdLFxuICAgIFstMC4zNTgzNjgsIDAuOTYxMjYyLCAtMC43OTg2MzYsIC0wLjYwMTgxNSwgLTAuMjc1NjM3LCAwLjkzMzU4MF0sXG4gICAgWy0wLjMwOTAxNywgMC45NTEwNTcsIC0wLjgwOTAxNywgLTAuNTg3Nzg1LCAtMC4zMDkwMTcsIDAuOTUxMDU3XSxcbiAgICBbLTAuMjU4ODE5LCAwLjkzOTY5MywgLTAuODE5MTUyLCAtMC41NzM1NzYsIC0wLjM0MjAyMCwgMC45NjU5MjZdLFxuICAgIFstMC4yMDc5MTIsIDAuOTI3MTg0LCAtMC44MjkwMzgsIC0wLjU1OTE5MywgLTAuMzc0NjA3LCAwLjk3ODE0OF0sXG4gICAgWy0wLjE1NjQzNCwgMC45MTM1NDUsIC0wLjgzODY3MSwgLTAuNTQ0NjM5LCAtMC40MDY3MzcsIDAuOTg3Njg4XSxcbiAgICBbLTAuMTA0NTI4LCAwLjg5ODc5NCwgLTAuODQ4MDQ4LCAtMC41Mjk5MTksIC0wLjQzODM3MSwgMC45OTQ1MjJdLFxuICAgIFstMC4wNTIzMzYsIDAuODgyOTQ4LCAtMC44NTcxNjcsIC0wLjUxNTAzOCwgLTAuNDY5NDcyLCAwLjk5ODYzMF0sXG4gICAgWy0wLjAwMDAwMCwgMC44NjYwMjUsIC0wLjg2NjAyNSwgLTAuNTAwMDAwLCAtMC41MDAwMDAsIDEuMDAwMDAwXSxcbiAgICBbMC4wNTIzMzYsIDAuODQ4MDQ4LCAtMC44NzQ2MjAsIC0wLjQ4NDgxMCwgLTAuNTI5OTE5LCAwLjk5ODYzMF0sXG4gICAgWzAuMTA0NTI4LCAwLjgyOTAzOCwgLTAuODgyOTQ4LCAtMC40Njk0NzIsIC0wLjU1OTE5MywgMC45OTQ1MjJdLFxuICAgIFswLjE1NjQzNCwgMC44MDkwMTcsIC0wLjg5MTAwNywgLTAuNDUzOTkwLCAtMC41ODc3ODUsIDAuOTg3Njg4XSxcbiAgICBbMC4yMDc5MTIsIDAuNzg4MDExLCAtMC44OTg3OTQsIC0wLjQzODM3MSwgLTAuNjE1NjYxLCAwLjk3ODE0OF0sXG4gICAgWzAuMjU4ODE5LCAwLjc2NjA0NCwgLTAuOTA2MzA4LCAtMC40MjI2MTgsIC0wLjY0Mjc4OCwgMC45NjU5MjZdLFxuICAgIFswLjMwOTAxNywgMC43NDMxNDUsIC0wLjkxMzU0NSwgLTAuNDA2NzM3LCAtMC42NjkxMzEsIDAuOTUxMDU3XSxcbiAgICBbMC4zNTgzNjgsIDAuNzE5MzQwLCAtMC45MjA1MDUsIC0wLjM5MDczMSwgLTAuNjk0NjU4LCAwLjkzMzU4MF0sXG4gICAgWzAuNDA2NzM3LCAwLjY5NDY1OCwgLTAuOTI3MTg0LCAtMC4zNzQ2MDcsIC0wLjcxOTM0MCwgMC45MTM1NDVdLFxuICAgIFswLjQ1Mzk5MCwgMC42NjkxMzEsIC0wLjkzMzU4MCwgLTAuMzU4MzY4LCAtMC43NDMxNDUsIDAuODkxMDA3XSxcbiAgICBbMC41MDAwMDAsIDAuNjQyNzg4LCAtMC45Mzk2OTMsIC0wLjM0MjAyMCwgLTAuNzY2MDQ0LCAwLjg2NjAyNV0sXG4gICAgWzAuNTQ0NjM5LCAwLjYxNTY2MSwgLTAuOTQ1NTE5LCAtMC4zMjU1NjgsIC0wLjc4ODAxMSwgMC44Mzg2NzFdLFxuICAgIFswLjU4Nzc4NSwgMC41ODc3ODUsIC0wLjk1MTA1NywgLTAuMzA5MDE3LCAtMC44MDkwMTcsIDAuODA5MDE3XSxcbiAgICBbMC42MjkzMjAsIDAuNTU5MTkzLCAtMC45NTYzMDUsIC0wLjI5MjM3MiwgLTAuODI5MDM4LCAwLjc3NzE0Nl0sXG4gICAgWzAuNjY5MTMxLCAwLjUyOTkxOSwgLTAuOTYxMjYyLCAtMC4yNzU2MzcsIC0wLjg0ODA0OCwgMC43NDMxNDVdLFxuICAgIFswLjcwNzEwNywgMC41MDAwMDAsIC0wLjk2NTkyNiwgLTAuMjU4ODE5LCAtMC44NjYwMjUsIDAuNzA3MTA3XSxcbiAgICBbMC43NDMxNDUsIDAuNDY5NDcyLCAtMC45NzAyOTYsIC0wLjI0MTkyMiwgLTAuODgyOTQ4LCAwLjY2OTEzMV0sXG4gICAgWzAuNzc3MTQ2LCAwLjQzODM3MSwgLTAuOTc0MzcwLCAtMC4yMjQ5NTEsIC0wLjg5ODc5NCwgMC42MjkzMjBdLFxuICAgIFswLjgwOTAxNywgMC40MDY3MzcsIC0wLjk3ODE0OCwgLTAuMjA3OTEyLCAtMC45MTM1NDUsIDAuNTg3Nzg1XSxcbiAgICBbMC44Mzg2NzEsIDAuMzc0NjA3LCAtMC45ODE2MjcsIC0wLjE5MDgwOSwgLTAuOTI3MTg0LCAwLjU0NDYzOV0sXG4gICAgWzAuODY2MDI1LCAwLjM0MjAyMCwgLTAuOTg0ODA4LCAtMC4xNzM2NDgsIC0wLjkzOTY5MywgMC41MDAwMDBdLFxuICAgIFswLjg5MTAwNywgMC4zMDkwMTcsIC0wLjk4NzY4OCwgLTAuMTU2NDM0LCAtMC45NTEwNTcsIDAuNDUzOTkwXSxcbiAgICBbMC45MTM1NDUsIDAuMjc1NjM3LCAtMC45OTAyNjgsIC0wLjEzOTE3MywgLTAuOTYxMjYyLCAwLjQwNjczN10sXG4gICAgWzAuOTMzNTgwLCAwLjI0MTkyMiwgLTAuOTkyNTQ2LCAtMC4xMjE4NjksIC0wLjk3MDI5NiwgMC4zNTgzNjhdLFxuICAgIFswLjk1MTA1NywgMC4yMDc5MTIsIC0wLjk5NDUyMiwgLTAuMTA0NTI4LCAtMC45NzgxNDgsIDAuMzA5MDE3XSxcbiAgICBbMC45NjU5MjYsIDAuMTczNjQ4LCAtMC45OTYxOTUsIC0wLjA4NzE1NiwgLTAuOTg0ODA4LCAwLjI1ODgxOV0sXG4gICAgWzAuOTc4MTQ4LCAwLjEzOTE3MywgLTAuOTk3NTY0LCAtMC4wNjk3NTYsIC0wLjk5MDI2OCwgMC4yMDc5MTJdLFxuICAgIFswLjk4NzY4OCwgMC4xMDQ1MjgsIC0wLjk5ODYzMCwgLTAuMDUyMzM2LCAtMC45OTQ1MjIsIDAuMTU2NDM0XSxcbiAgICBbMC45OTQ1MjIsIDAuMDY5NzU2LCAtMC45OTkzOTEsIC0wLjAzNDg5OSwgLTAuOTk3NTY0LCAwLjEwNDUyOF0sXG4gICAgWzAuOTk4NjMwLCAwLjAzNDg5OSwgLTAuOTk5ODQ4LCAtMC4wMTc0NTIsIC0wLjk5OTM5MSwgMC4wNTIzMzZdLFxuICAgIFsxLjAwMDAwMCwgMC4wMDAwMDAsIC0xLjAwMDAwMCwgLTAuMDAwMDAwLCAtMS4wMDAwMDAsIDAuMDAwMDAwXSxcbiAgICBbMC45OTg2MzAsIC0wLjAzNDg5OSwgLTAuOTk5ODQ4LCAwLjAxNzQ1MiwgLTAuOTk5MzkxLCAtMC4wNTIzMzZdLFxuICAgIFswLjk5NDUyMiwgLTAuMDY5NzU2LCAtMC45OTkzOTEsIDAuMDM0ODk5LCAtMC45OTc1NjQsIC0wLjEwNDUyOF0sXG4gICAgWzAuOTg3Njg4LCAtMC4xMDQ1MjgsIC0wLjk5ODYzMCwgMC4wNTIzMzYsIC0wLjk5NDUyMiwgLTAuMTU2NDM0XSxcbiAgICBbMC45NzgxNDgsIC0wLjEzOTE3MywgLTAuOTk3NTY0LCAwLjA2OTc1NiwgLTAuOTkwMjY4LCAtMC4yMDc5MTJdLFxuICAgIFswLjk2NTkyNiwgLTAuMTczNjQ4LCAtMC45OTYxOTUsIDAuMDg3MTU2LCAtMC45ODQ4MDgsIC0wLjI1ODgxOV0sXG4gICAgWzAuOTUxMDU3LCAtMC4yMDc5MTIsIC0wLjk5NDUyMiwgMC4xMDQ1MjgsIC0wLjk3ODE0OCwgLTAuMzA5MDE3XSxcbiAgICBbMC45MzM1ODAsIC0wLjI0MTkyMiwgLTAuOTkyNTQ2LCAwLjEyMTg2OSwgLTAuOTcwMjk2LCAtMC4zNTgzNjhdLFxuICAgIFswLjkxMzU0NSwgLTAuMjc1NjM3LCAtMC45OTAyNjgsIDAuMTM5MTczLCAtMC45NjEyNjIsIC0wLjQwNjczN10sXG4gICAgWzAuODkxMDA3LCAtMC4zMDkwMTcsIC0wLjk4NzY4OCwgMC4xNTY0MzQsIC0wLjk1MTA1NywgLTAuNDUzOTkwXSxcbiAgICBbMC44NjYwMjUsIC0wLjM0MjAyMCwgLTAuOTg0ODA4LCAwLjE3MzY0OCwgLTAuOTM5NjkzLCAtMC41MDAwMDBdLFxuICAgIFswLjgzODY3MSwgLTAuMzc0NjA3LCAtMC45ODE2MjcsIDAuMTkwODA5LCAtMC45MjcxODQsIC0wLjU0NDYzOV0sXG4gICAgWzAuODA5MDE3LCAtMC40MDY3MzcsIC0wLjk3ODE0OCwgMC4yMDc5MTIsIC0wLjkxMzU0NSwgLTAuNTg3Nzg1XSxcbiAgICBbMC43NzcxNDYsIC0wLjQzODM3MSwgLTAuOTc0MzcwLCAwLjIyNDk1MSwgLTAuODk4Nzk0LCAtMC42MjkzMjBdLFxuICAgIFswLjc0MzE0NSwgLTAuNDY5NDcyLCAtMC45NzAyOTYsIDAuMjQxOTIyLCAtMC44ODI5NDgsIC0wLjY2OTEzMV0sXG4gICAgWzAuNzA3MTA3LCAtMC41MDAwMDAsIC0wLjk2NTkyNiwgMC4yNTg4MTksIC0wLjg2NjAyNSwgLTAuNzA3MTA3XSxcbiAgICBbMC42NjkxMzEsIC0wLjUyOTkxOSwgLTAuOTYxMjYyLCAwLjI3NTYzNywgLTAuODQ4MDQ4LCAtMC43NDMxNDVdLFxuICAgIFswLjYyOTMyMCwgLTAuNTU5MTkzLCAtMC45NTYzMDUsIDAuMjkyMzcyLCAtMC44MjkwMzgsIC0wLjc3NzE0Nl0sXG4gICAgWzAuNTg3Nzg1LCAtMC41ODc3ODUsIC0wLjk1MTA1NywgMC4zMDkwMTcsIC0wLjgwOTAxNywgLTAuODA5MDE3XSxcbiAgICBbMC41NDQ2MzksIC0wLjYxNTY2MSwgLTAuOTQ1NTE5LCAwLjMyNTU2OCwgLTAuNzg4MDExLCAtMC44Mzg2NzFdLFxuICAgIFswLjUwMDAwMCwgLTAuNjQyNzg4LCAtMC45Mzk2OTMsIDAuMzQyMDIwLCAtMC43NjYwNDQsIC0wLjg2NjAyNV0sXG4gICAgWzAuNDUzOTkwLCAtMC42NjkxMzEsIC0wLjkzMzU4MCwgMC4zNTgzNjgsIC0wLjc0MzE0NSwgLTAuODkxMDA3XSxcbiAgICBbMC40MDY3MzcsIC0wLjY5NDY1OCwgLTAuOTI3MTg0LCAwLjM3NDYwNywgLTAuNzE5MzQwLCAtMC45MTM1NDVdLFxuICAgIFswLjM1ODM2OCwgLTAuNzE5MzQwLCAtMC45MjA1MDUsIDAuMzkwNzMxLCAtMC42OTQ2NTgsIC0wLjkzMzU4MF0sXG4gICAgWzAuMzA5MDE3LCAtMC43NDMxNDUsIC0wLjkxMzU0NSwgMC40MDY3MzcsIC0wLjY2OTEzMSwgLTAuOTUxMDU3XSxcbiAgICBbMC4yNTg4MTksIC0wLjc2NjA0NCwgLTAuOTA2MzA4LCAwLjQyMjYxOCwgLTAuNjQyNzg4LCAtMC45NjU5MjZdLFxuICAgIFswLjIwNzkxMiwgLTAuNzg4MDExLCAtMC44OTg3OTQsIDAuNDM4MzcxLCAtMC42MTU2NjEsIC0wLjk3ODE0OF0sXG4gICAgWzAuMTU2NDM0LCAtMC44MDkwMTcsIC0wLjg5MTAwNywgMC40NTM5OTAsIC0wLjU4Nzc4NSwgLTAuOTg3Njg4XSxcbiAgICBbMC4xMDQ1MjgsIC0wLjgyOTAzOCwgLTAuODgyOTQ4LCAwLjQ2OTQ3MiwgLTAuNTU5MTkzLCAtMC45OTQ1MjJdLFxuICAgIFswLjA1MjMzNiwgLTAuODQ4MDQ4LCAtMC44NzQ2MjAsIDAuNDg0ODEwLCAtMC41Mjk5MTksIC0wLjk5ODYzMF0sXG4gICAgWzAuMDAwMDAwLCAtMC44NjYwMjUsIC0wLjg2NjAyNSwgMC41MDAwMDAsIC0wLjUwMDAwMCwgLTEuMDAwMDAwXSxcbiAgICBbLTAuMDUyMzM2LCAtMC44ODI5NDgsIC0wLjg1NzE2NywgMC41MTUwMzgsIC0wLjQ2OTQ3MiwgLTAuOTk4NjMwXSxcbiAgICBbLTAuMTA0NTI4LCAtMC44OTg3OTQsIC0wLjg0ODA0OCwgMC41Mjk5MTksIC0wLjQzODM3MSwgLTAuOTk0NTIyXSxcbiAgICBbLTAuMTU2NDM0LCAtMC45MTM1NDUsIC0wLjgzODY3MSwgMC41NDQ2MzksIC0wLjQwNjczNywgLTAuOTg3Njg4XSxcbiAgICBbLTAuMjA3OTEyLCAtMC45MjcxODQsIC0wLjgyOTAzOCwgMC41NTkxOTMsIC0wLjM3NDYwNywgLTAuOTc4MTQ4XSxcbiAgICBbLTAuMjU4ODE5LCAtMC45Mzk2OTMsIC0wLjgxOTE1MiwgMC41NzM1NzYsIC0wLjM0MjAyMCwgLTAuOTY1OTI2XSxcbiAgICBbLTAuMzA5MDE3LCAtMC45NTEwNTcsIC0wLjgwOTAxNywgMC41ODc3ODUsIC0wLjMwOTAxNywgLTAuOTUxMDU3XSxcbiAgICBbLTAuMzU4MzY4LCAtMC45NjEyNjIsIC0wLjc5ODYzNiwgMC42MDE4MTUsIC0wLjI3NTYzNywgLTAuOTMzNTgwXSxcbiAgICBbLTAuNDA2NzM3LCAtMC45NzAyOTYsIC0wLjc4ODAxMSwgMC42MTU2NjEsIC0wLjI0MTkyMiwgLTAuOTEzNTQ1XSxcbiAgICBbLTAuNDUzOTkwLCAtMC45NzgxNDgsIC0wLjc3NzE0NiwgMC42MjkzMjAsIC0wLjIwNzkxMiwgLTAuODkxMDA3XSxcbiAgICBbLTAuNTAwMDAwLCAtMC45ODQ4MDgsIC0wLjc2NjA0NCwgMC42NDI3ODgsIC0wLjE3MzY0OCwgLTAuODY2MDI1XSxcbiAgICBbLTAuNTQ0NjM5LCAtMC45OTAyNjgsIC0wLjc1NDcxMCwgMC42NTYwNTksIC0wLjEzOTE3MywgLTAuODM4NjcxXSxcbiAgICBbLTAuNTg3Nzg1LCAtMC45OTQ1MjIsIC0wLjc0MzE0NSwgMC42NjkxMzEsIC0wLjEwNDUyOCwgLTAuODA5MDE3XSxcbiAgICBbLTAuNjI5MzIwLCAtMC45OTc1NjQsIC0wLjczMTM1NCwgMC42ODE5OTgsIC0wLjA2OTc1NiwgLTAuNzc3MTQ2XSxcbiAgICBbLTAuNjY5MTMxLCAtMC45OTkzOTEsIC0wLjcxOTM0MCwgMC42OTQ2NTgsIC0wLjAzNDg5OSwgLTAuNzQzMTQ1XSxcbiAgICBbLTAuNzA3MTA3LCAtMS4wMDAwMDAsIC0wLjcwNzEwNywgMC43MDcxMDcsIC0wLjAwMDAwMCwgLTAuNzA3MTA3XSxcbiAgICBbLTAuNzQzMTQ1LCAtMC45OTkzOTEsIC0wLjY5NDY1OCwgMC43MTkzNDAsIDAuMDM0ODk5LCAtMC42NjkxMzFdLFxuICAgIFstMC43NzcxNDYsIC0wLjk5NzU2NCwgLTAuNjgxOTk4LCAwLjczMTM1NCwgMC4wNjk3NTYsIC0wLjYyOTMyMF0sXG4gICAgWy0wLjgwOTAxNywgLTAuOTk0NTIyLCAtMC42NjkxMzEsIDAuNzQzMTQ1LCAwLjEwNDUyOCwgLTAuNTg3Nzg1XSxcbiAgICBbLTAuODM4NjcxLCAtMC45OTAyNjgsIC0wLjY1NjA1OSwgMC43NTQ3MTAsIDAuMTM5MTczLCAtMC41NDQ2MzldLFxuICAgIFstMC44NjYwMjUsIC0wLjk4NDgwOCwgLTAuNjQyNzg4LCAwLjc2NjA0NCwgMC4xNzM2NDgsIC0wLjUwMDAwMF0sXG4gICAgWy0wLjg5MTAwNywgLTAuOTc4MTQ4LCAtMC42MjkzMjAsIDAuNzc3MTQ2LCAwLjIwNzkxMiwgLTAuNDUzOTkwXSxcbiAgICBbLTAuOTEzNTQ1LCAtMC45NzAyOTYsIC0wLjYxNTY2MSwgMC43ODgwMTEsIDAuMjQxOTIyLCAtMC40MDY3MzddLFxuICAgIFstMC45MzM1ODAsIC0wLjk2MTI2MiwgLTAuNjAxODE1LCAwLjc5ODYzNiwgMC4yNzU2MzcsIC0wLjM1ODM2OF0sXG4gICAgWy0wLjk1MTA1NywgLTAuOTUxMDU3LCAtMC41ODc3ODUsIDAuODA5MDE3LCAwLjMwOTAxNywgLTAuMzA5MDE3XSxcbiAgICBbLTAuOTY1OTI2LCAtMC45Mzk2OTMsIC0wLjU3MzU3NiwgMC44MTkxNTIsIDAuMzQyMDIwLCAtMC4yNTg4MTldLFxuICAgIFstMC45NzgxNDgsIC0wLjkyNzE4NCwgLTAuNTU5MTkzLCAwLjgyOTAzOCwgMC4zNzQ2MDcsIC0wLjIwNzkxMl0sXG4gICAgWy0wLjk4NzY4OCwgLTAuOTEzNTQ1LCAtMC41NDQ2MzksIDAuODM4NjcxLCAwLjQwNjczNywgLTAuMTU2NDM0XSxcbiAgICBbLTAuOTk0NTIyLCAtMC44OTg3OTQsIC0wLjUyOTkxOSwgMC44NDgwNDgsIDAuNDM4MzcxLCAtMC4xMDQ1MjhdLFxuICAgIFstMC45OTg2MzAsIC0wLjg4Mjk0OCwgLTAuNTE1MDM4LCAwLjg1NzE2NywgMC40Njk0NzIsIC0wLjA1MjMzNl0sXG4gICAgWy0xLjAwMDAwMCwgLTAuODY2MDI1LCAtMC41MDAwMDAsIDAuODY2MDI1LCAwLjUwMDAwMCwgLTAuMDAwMDAwXSxcbiAgICBbLTAuOTk4NjMwLCAtMC44NDgwNDgsIC0wLjQ4NDgxMCwgMC44NzQ2MjAsIDAuNTI5OTE5LCAwLjA1MjMzNl0sXG4gICAgWy0wLjk5NDUyMiwgLTAuODI5MDM4LCAtMC40Njk0NzIsIDAuODgyOTQ4LCAwLjU1OTE5MywgMC4xMDQ1MjhdLFxuICAgIFstMC45ODc2ODgsIC0wLjgwOTAxNywgLTAuNDUzOTkwLCAwLjg5MTAwNywgMC41ODc3ODUsIDAuMTU2NDM0XSxcbiAgICBbLTAuOTc4MTQ4LCAtMC43ODgwMTEsIC0wLjQzODM3MSwgMC44OTg3OTQsIDAuNjE1NjYxLCAwLjIwNzkxMl0sXG4gICAgWy0wLjk2NTkyNiwgLTAuNzY2MDQ0LCAtMC40MjI2MTgsIDAuOTA2MzA4LCAwLjY0Mjc4OCwgMC4yNTg4MTldLFxuICAgIFstMC45NTEwNTcsIC0wLjc0MzE0NSwgLTAuNDA2NzM3LCAwLjkxMzU0NSwgMC42NjkxMzEsIDAuMzA5MDE3XSxcbiAgICBbLTAuOTMzNTgwLCAtMC43MTkzNDAsIC0wLjM5MDczMSwgMC45MjA1MDUsIDAuNjk0NjU4LCAwLjM1ODM2OF0sXG4gICAgWy0wLjkxMzU0NSwgLTAuNjk0NjU4LCAtMC4zNzQ2MDcsIDAuOTI3MTg0LCAwLjcxOTM0MCwgMC40MDY3MzddLFxuICAgIFstMC44OTEwMDcsIC0wLjY2OTEzMSwgLTAuMzU4MzY4LCAwLjkzMzU4MCwgMC43NDMxNDUsIDAuNDUzOTkwXSxcbiAgICBbLTAuODY2MDI1LCAtMC42NDI3ODgsIC0wLjM0MjAyMCwgMC45Mzk2OTMsIDAuNzY2MDQ0LCAwLjUwMDAwMF0sXG4gICAgWy0wLjgzODY3MSwgLTAuNjE1NjYxLCAtMC4zMjU1NjgsIDAuOTQ1NTE5LCAwLjc4ODAxMSwgMC41NDQ2MzldLFxuICAgIFstMC44MDkwMTcsIC0wLjU4Nzc4NSwgLTAuMzA5MDE3LCAwLjk1MTA1NywgMC44MDkwMTcsIDAuNTg3Nzg1XSxcbiAgICBbLTAuNzc3MTQ2LCAtMC41NTkxOTMsIC0wLjI5MjM3MiwgMC45NTYzMDUsIDAuODI5MDM4LCAwLjYyOTMyMF0sXG4gICAgWy0wLjc0MzE0NSwgLTAuNTI5OTE5LCAtMC4yNzU2MzcsIDAuOTYxMjYyLCAwLjg0ODA0OCwgMC42NjkxMzFdLFxuICAgIFstMC43MDcxMDcsIC0wLjUwMDAwMCwgLTAuMjU4ODE5LCAwLjk2NTkyNiwgMC44NjYwMjUsIDAuNzA3MTA3XSxcbiAgICBbLTAuNjY5MTMxLCAtMC40Njk0NzIsIC0wLjI0MTkyMiwgMC45NzAyOTYsIDAuODgyOTQ4LCAwLjc0MzE0NV0sXG4gICAgWy0wLjYyOTMyMCwgLTAuNDM4MzcxLCAtMC4yMjQ5NTEsIDAuOTc0MzcwLCAwLjg5ODc5NCwgMC43NzcxNDZdLFxuICAgIFstMC41ODc3ODUsIC0wLjQwNjczNywgLTAuMjA3OTEyLCAwLjk3ODE0OCwgMC45MTM1NDUsIDAuODA5MDE3XSxcbiAgICBbLTAuNTQ0NjM5LCAtMC4zNzQ2MDcsIC0wLjE5MDgwOSwgMC45ODE2MjcsIDAuOTI3MTg0LCAwLjgzODY3MV0sXG4gICAgWy0wLjUwMDAwMCwgLTAuMzQyMDIwLCAtMC4xNzM2NDgsIDAuOTg0ODA4LCAwLjkzOTY5MywgMC44NjYwMjVdLFxuICAgIFstMC40NTM5OTAsIC0wLjMwOTAxNywgLTAuMTU2NDM0LCAwLjk4NzY4OCwgMC45NTEwNTcsIDAuODkxMDA3XSxcbiAgICBbLTAuNDA2NzM3LCAtMC4yNzU2MzcsIC0wLjEzOTE3MywgMC45OTAyNjgsIDAuOTYxMjYyLCAwLjkxMzU0NV0sXG4gICAgWy0wLjM1ODM2OCwgLTAuMjQxOTIyLCAtMC4xMjE4NjksIDAuOTkyNTQ2LCAwLjk3MDI5NiwgMC45MzM1ODBdLFxuICAgIFstMC4zMDkwMTcsIC0wLjIwNzkxMiwgLTAuMTA0NTI4LCAwLjk5NDUyMiwgMC45NzgxNDgsIDAuOTUxMDU3XSxcbiAgICBbLTAuMjU4ODE5LCAtMC4xNzM2NDgsIC0wLjA4NzE1NiwgMC45OTYxOTUsIDAuOTg0ODA4LCAwLjk2NTkyNl0sXG4gICAgWy0wLjIwNzkxMiwgLTAuMTM5MTczLCAtMC4wNjk3NTYsIDAuOTk3NTY0LCAwLjk5MDI2OCwgMC45NzgxNDhdLFxuICAgIFstMC4xNTY0MzQsIC0wLjEwNDUyOCwgLTAuMDUyMzM2LCAwLjk5ODYzMCwgMC45OTQ1MjIsIDAuOTg3Njg4XSxcbiAgICBbLTAuMTA0NTI4LCAtMC4wNjk3NTYsIC0wLjAzNDg5OSwgMC45OTkzOTEsIDAuOTk3NTY0LCAwLjk5NDUyMl0sXG4gICAgWy0wLjA1MjMzNiwgLTAuMDM0ODk5LCAtMC4wMTc0NTIsIDAuOTk5ODQ4LCAwLjk5OTM5MSwgMC45OTg2MzBdLFxuICBdLFxuICBbXG4gICAgWy0xLjAwMDAwMCwgLTAuMDAwMDAwLCAxLjAwMDAwMCwgLTAuMDAwMDAwLCAwLjAwMDAwMCxcbiAgICAgLTEuMDAwMDAwLCAtMC4wMDAwMDAsIDAuMDAwMDAwLCAtMC4wMDAwMDBdLFxuICAgIFstMC45OTk4NDgsIDAuMDE3NDUyLCAwLjk5OTU0MywgLTAuMDMwMjI0LCAwLjAwMDI2NCxcbiAgICAgLTAuOTk5MDg2LCAwLjA0MjczMywgLTAuMDAwNTkwLCAwLjAwMDAwNF0sXG4gICAgWy0wLjk5OTM5MSwgMC4wMzQ4OTksIDAuOTk4MTczLCAtMC4wNjA0MTEsIDAuMDAxMDU1LFxuICAgICAtMC45OTYzNDgsIDAuMDg1MzU2LCAtMC4wMDIzNTcsIDAuMDAwMDM0XSxcbiAgICBbLTAuOTk4NjMwLCAwLjA1MjMzNiwgMC45OTU4OTEsIC0wLjA5MDUyNCwgMC4wMDIzNzIsXG4gICAgIC0wLjk5MTc5MSwgMC4xMjc3NTcsIC0wLjAwNTI5NywgMC4wMDAxMTNdLFxuICAgIFstMC45OTc1NjQsIDAuMDY5NzU2LCAwLjk5MjcwMSwgLTAuMTIwNTI3LCAwLjAwNDIxNCxcbiAgICAgLTAuOTg1NDI5LCAwLjE2OTgyOCwgLTAuMDA5NDAwLCAwLjAwMDI2OF0sXG4gICAgWy0wLjk5NjE5NSwgMC4wODcxNTYsIDAuOTg4NjA2LCAtMC4xNTAzODQsIDAuMDA2NTc4LFxuICAgICAtMC45NzcyNzcsIDAuMjExNDYwLCAtMC4wMTQ2NTQsIDAuMDAwNTIzXSxcbiAgICBbLTAuOTk0NTIyLCAwLjEwNDUyOCwgMC45ODM2MTEsIC0wLjE4MDA1NywgMC4wMDk0NjIsXG4gICAgIC0wLjk2NzM1NiwgMC4yNTI1NDQsIC0wLjAyMTA0MywgMC4wMDA5MDNdLFxuICAgIFstMC45OTI1NDYsIDAuMTIxODY5LCAwLjk3NzcyMiwgLTAuMjA5NTExLCAwLjAxMjg2MixcbiAgICAgLTAuOTU1NjkzLCAwLjI5Mjk3NiwgLTAuMDI4NTQ3LCAwLjAwMTQzMV0sXG4gICAgWy0wLjk5MDI2OCwgMC4xMzkxNzMsIDAuOTcwOTQ2LCAtMC4yMzg3MDksIDAuMDE2Nzc0LFxuICAgICAtMC45NDIzMTYsIDAuMzMyNjQ5LCAtMC4wMzcxNDMsIDAuMDAyMTMxXSxcbiAgICBbLTAuOTg3Njg4LCAwLjE1NjQzNCwgMC45NjMyOTIsIC0wLjI2NzYxNywgMC4wMjExOTMsXG4gICAgIC0wLjkyNzI2MiwgMC4zNzE0NjMsIC0wLjA0NjgwNiwgMC4wMDMwMjZdLFxuICAgIFstMC45ODQ4MDgsIDAuMTczNjQ4LCAwLjk1NDc2OSwgLTAuMjk2MTk4LCAwLjAyNjExNCxcbiAgICAgLTAuOTEwNTY5LCAwLjQwOTMxNywgLTAuMDU3NTA1LCAwLjAwNDE0MF0sXG4gICAgWy0wLjk4MTYyNywgMC4xOTA4MDksIDAuOTQ1Mzg4LCAtMC4zMjQ0MTksIDAuMDMxNTMwLFxuICAgICAtMC44OTIyNzksIDAuNDQ2MTE0LCAtMC4wNjkyMDksIDAuMDA1NDkyXSxcbiAgICBbLTAuOTc4MTQ4LCAwLjIwNzkxMiwgMC45MzUxNTksIC0wLjM1MjI0NCwgMC4wMzc0MzYsXG4gICAgIC0wLjg3MjQ0MSwgMC40ODE3NTksIC0wLjA4MTg4MCwgMC4wMDcxMDVdLFxuICAgIFstMC45NzQzNzAsIDAuMjI0OTUxLCAwLjkyNDA5NiwgLTAuMzc5NjQxLCAwLjA0MzgyMyxcbiAgICAgLTAuODUxMTA1LCAwLjUxNjE2MiwgLTAuMDk1NDgxLCAwLjAwODk5OV0sXG4gICAgWy0wLjk3MDI5NiwgMC4yNDE5MjIsIDAuOTEyMjExLCAtMC40MDY1NzQsIDAuMDUwNjg1LFxuICAgICAtMC44MjgzMjYsIDAuNTQ5MjMzLCAtMC4xMDk5NjksIDAuMDExMTkzXSxcbiAgICBbLTAuOTY1OTI2LCAwLjI1ODgxOSwgMC44OTk1MTksIC0wLjQzMzAxMywgMC4wNTgwMTMsXG4gICAgIC0wLjgwNDE2NCwgMC41ODA4ODksIC0wLjEyNTMwMCwgMC4wMTM3MDddLFxuICAgIFstMC45NjEyNjIsIDAuMjc1NjM3LCAwLjg4NjAzNiwgLTAuNDU4OTI0LCAwLjA2NTc5NyxcbiAgICAgLTAuNzc4NjgwLCAwLjYxMTA1MCwgLTAuMTQxNDI3LCAwLjAxNjU1Nl0sXG4gICAgWy0wLjk1NjMwNSwgMC4yOTIzNzIsIDAuODcxNzc4LCAtMC40ODQyNzUsIDAuMDc0MDI5LFxuICAgICAtMC43NTE5NDAsIDAuNjM5NjM5LCAtMC4xNTgzMDEsIDAuMDE5NzU4XSxcbiAgICBbLTAuOTUxMDU3LCAwLjMwOTAxNywgMC44NTY3NjMsIC0wLjUwOTAzNywgMC4wODI2OTgsXG4gICAgIC0wLjcyNDAxMiwgMC42NjY1ODMsIC0wLjE3NTg2OCwgMC4wMjMzMjldLFxuICAgIFstMC45NDU1MTksIDAuMzI1NTY4LCAwLjg0MTAwOCwgLTAuNTMzMTc4LCAwLjA5MTc5NCxcbiAgICAgLTAuNjk0OTY5LCAwLjY5MTgxNiwgLTAuMTk0MDc1LCAwLjAyNzI4MV0sXG4gICAgWy0wLjkzOTY5MywgMC4zNDIwMjAsIDAuODI0NTMzLCAtMC41NTY2NzAsIDAuMTAxMzA2LFxuICAgICAtMC42NjQ4ODUsIDAuNzE1Mjc0LCAtMC4yMTI4NjUsIDAuMDMxNjMwXSxcbiAgICBbLTAuOTMzNTgwLCAwLjM1ODM2OCwgMC44MDczNTksIC0wLjU3OTQ4NCwgMC4xMTEyMjIsXG4gICAgIC0wLjYzMzgzNywgMC43MzY4OTgsIC0wLjIzMjE4MCwgMC4wMzYzODVdLFxuICAgIFstMC45MjcxODQsIDAuMzc0NjA3LCAwLjc4OTUwNSwgLTAuNjAxNTkyLCAwLjEyMTUyOSxcbiAgICAgLTAuNjAxOTA0LCAwLjc1NjYzNywgLTAuMjUxOTYwLCAwLjA0MTU1OV0sXG4gICAgWy0wLjkyMDUwNSwgMC4zOTA3MzEsIDAuNzcwOTk0LCAtMC42MjI5NjcsIDAuMTMyMjE3LFxuICAgICAtMC41NjkxNjksIDAuNzc0NDQyLCAtMC4yNzIxNDMsIDAuMDQ3MTYwXSxcbiAgICBbLTAuOTEzNTQ1LCAwLjQwNjczNywgMC43NTE4NDgsIC0wLjY0MzU4MiwgMC4xNDMyNzEsXG4gICAgIC0wLjUzNTcxNSwgMC43OTAyNzAsIC0wLjI5MjY2NiwgMC4wNTMxOTZdLFxuICAgIFstMC45MDYzMDgsIDAuNDIyNjE4LCAwLjczMjA5MSwgLTAuNjYzNDE0LCAwLjE1NDY3OCxcbiAgICAgLTAuNTAxNjI3LCAwLjgwNDA4MywgLTAuMzEzNDY0LCAwLjA1OTY3NF0sXG4gICAgWy0wLjg5ODc5NCwgMC40MzgzNzEsIDAuNzExNzQ2LCAtMC42ODI0MzcsIDAuMTY2NDIzLFxuICAgICAtMC40NjY5OTMsIDAuODE1ODUwLCAtMC4zMzQ0NzIsIDAuMDY2NTk5XSxcbiAgICBbLTAuODkxMDA3LCAwLjQ1Mzk5MCwgMC42OTA4MzksIC0wLjcwMDYyOSwgMC4xNzg0OTQsXG4gICAgIC0wLjQzMTg5OSwgMC44MjU1NDQsIC0wLjM1NTYyMywgMC4wNzM5NzRdLFxuICAgIFstMC44ODI5NDgsIDAuNDY5NDcyLCAwLjY2OTM5NSwgLTAuNzE3OTY4LCAwLjE5MDg3NSxcbiAgICAgLTAuMzk2NDM2LCAwLjgzMzE0NSwgLTAuMzc2ODUxLCAwLjA4MTgwM10sXG4gICAgWy0wLjg3NDYyMCwgMC40ODQ4MTAsIDAuNjQ3NDM5LCAtMC43MzQ0MzEsIDAuMjAzNTUxLFxuICAgICAtMC4zNjA2OTIsIDAuODM4NjM4LCAtMC4zOTgwODYsIDAuMDkwMDg1XSxcbiAgICBbLTAuODY2MDI1LCAwLjUwMDAwMCwgMC42MjUwMDAsIC0wLjc1MDAwMCwgMC4yMTY1MDYsXG4gICAgIC0wLjMyNDc2MCwgMC44NDIwMTIsIC0wLjQxOTI2MywgMC4wOTg4MjFdLFxuICAgIFstMC44NTcxNjcsIDAuNTE1MDM4LCAwLjYwMjEwNCwgLTAuNzY0NjU1LCAwLjIyOTcyNixcbiAgICAgLTAuMjg4NzI4LCAwLjg0MzI2NSwgLTAuNDQwMzExLCAwLjEwODAwOV0sXG4gICAgWy0wLjg0ODA0OCwgMC41Mjk5MTksIDAuNTc4Nzc4LCAtMC43NzgzNzgsIDAuMjQzMTkyLFxuICAgICAtMC4yNTI2ODgsIDAuODQyMzk5LCAtMC40NjExNjQsIDAuMTE3NjQ0XSxcbiAgICBbLTAuODM4NjcxLCAwLjU0NDYzOSwgMC41NTUwNTIsIC0wLjc5MTE1NCwgMC4yNTY4OTEsXG4gICAgIC0wLjIxNjczMCwgMC44Mzk0MjIsIC0wLjQ4MTc1MywgMC4xMjc3MjJdLFxuICAgIFstMC44MjkwMzgsIDAuNTU5MTkzLCAwLjUzMDk1NSwgLTAuODAyOTY1LCAwLjI3MDgwMyxcbiAgICAgLTAuMTgwOTQ0LCAwLjgzNDM0NywgLTAuNTAyMDExLCAwLjEzODIzN10sXG4gICAgWy0wLjgxOTE1MiwgMC41NzM1NzYsIDAuNTA2NTE1LCAtMC44MTM3OTgsIDAuMjg0OTE0LFxuICAgICAtMC4xNDU0MjAsIDAuODI3MTk0LCAtMC41MjE4NzEsIDAuMTQ5MTgxXSxcbiAgICBbLTAuODA5MDE3LCAwLjU4Nzc4NSwgMC40ODE3NjMsIC0wLjgyMzYzOSwgMC4yOTkyMDQsXG4gICAgIC0wLjExMDI0NiwgMC44MTc5ODcsIC0wLjU0MTI2NiwgMC4xNjA1NDVdLFxuICAgIFstMC43OTg2MzYsIDAuNjAxODE1LCAwLjQ1NjcyOCwgLTAuODMyNDc3LCAwLjMxMzY1OCxcbiAgICAgLTAuMDc1NTA4LCAwLjgwNjc1NywgLTAuNTYwMTMyLCAwLjE3MjMxN10sXG4gICAgWy0wLjc4ODAxMSwgMC42MTU2NjEsIDAuNDMxNDQxLCAtMC44NDAzMDEsIDAuMzI4MjU3LFxuICAgICAtMC4wNDEyOTQsIDAuNzkzNTQxLCAtMC41Nzg0MDUsIDAuMTg0NDg3XSxcbiAgICBbLTAuNzc3MTQ2LCAwLjYyOTMyMCwgMC40MDU5MzQsIC0wLjg0NzEwMSwgMC4zNDI5ODQsXG4gICAgIC0wLjAwNzY4NiwgMC43NzgzNzksIC0wLjU5NjAyMSwgMC4xOTcwNDBdLFxuICAgIFstMC43NjYwNDQsIDAuNjQyNzg4LCAwLjM4MDIzNiwgLTAuODUyODY5LCAwLjM1NzgyMSxcbiAgICAgMC4wMjUyMzMsIDAuNzYxMzE5LCAtMC42MTI5MjEsIDAuMjA5OTYzXSxcbiAgICBbLTAuNzU0NzEwLCAwLjY1NjA1OSwgMC4zNTQzODAsIC0wLjg1NzU5NywgMC4zNzI3NDksXG4gICAgIDAuMDU3MzgzLCAwLjc0MjQxMiwgLTAuNjI5MDQ0LCAwLjIyMzIzOF0sXG4gICAgWy0wLjc0MzE0NSwgMC42NjkxMzEsIDAuMzI4Mzk2LCAtMC44NjEyODEsIDAuMzg3NzUxLFxuICAgICAwLjA4ODY4NiwgMC43MjE3MTQsIC0wLjY0NDMzNCwgMC4yMzY4NTBdLFxuICAgIFstMC43MzEzNTQsIDAuNjgxOTk4LCAwLjMwMjMxNywgLTAuODYzOTE2LCAwLjQwMjgwNyxcbiAgICAgMC4xMTkwNjgsIDAuNjk5Mjg4LCAtMC42NTg3MzQsIDAuMjUwNzc4XSxcbiAgICBbLTAuNzE5MzQwLCAwLjY5NDY1OCwgMC4yNzYxNzUsIC0wLjg2NTQ5OCwgMC40MTc5MDEsXG4gICAgIDAuMTQ4NDU0LCAwLjY3NTE5OSwgLTAuNjcyMTkwLCAwLjI2NTAwNV0sXG4gICAgWy0wLjcwNzEwNywgMC43MDcxMDcsIDAuMjUwMDAwLCAtMC44NjYwMjUsIDAuNDMzMDEzLFxuICAgICAwLjE3Njc3NywgMC42NDk1MTksIC0wLjY4NDY1MywgMC4yNzk1MDhdLFxuICAgIFstMC42OTQ2NTgsIDAuNzE5MzQwLCAwLjIyMzgyNSwgLTAuODY1NDk4LCAwLjQ0ODEyNSxcbiAgICAgMC4yMDM5NjksIDAuNjIyMzIyLCAtMC42OTYwNzMsIDAuMjk0MjY3XSxcbiAgICBbLTAuNjgxOTk4LCAwLjczMTM1NCwgMC4xOTc2ODMsIC0wLjg2MzkxNiwgMC40NjMyMTgsXG4gICAgIDAuMjI5OTY3LCAwLjU5MzY4OCwgLTAuNzA2NDA1LCAwLjMwOTI1OV0sXG4gICAgWy0wLjY2OTEzMSwgMC43NDMxNDUsIDAuMTcxNjA0LCAtMC44NjEyODEsIDAuNDc4Mjc1LFxuICAgICAwLjI1NDcxMiwgMC41NjM3MDAsIC0wLjcxNTYwNSwgMC4zMjQ0NTldLFxuICAgIFstMC42NTYwNTksIDAuNzU0NzEwLCAwLjE0NTYyMCwgLTAuODU3NTk3LCAwLjQ5MzI3NixcbiAgICAgMC4yNzgxNDcsIDAuNTMyNDQzLCAtMC43MjM2MzMsIDAuMzM5ODQ0XSxcbiAgICBbLTAuNjQyNzg4LCAwLjc2NjA0NCwgMC4xMTk3NjQsIC0wLjg1Mjg2OSwgMC41MDgyMDUsXG4gICAgIDAuMzAwMjIxLCAwLjUwMDAwOSwgLTAuNzMwNDUxLCAwLjM1NTM4N10sXG4gICAgWy0wLjYyOTMyMCwgMC43NzcxNDYsIDAuMDk0MDY2LCAtMC44NDcxMDEsIDAuNTIzMDQxLFxuICAgICAwLjMyMDg4NCwgMC40NjY0OTAsIC0wLjczNjAyNSwgMC4zNzEwNjNdLFxuICAgIFstMC42MTU2NjEsIDAuNzg4MDExLCAwLjA2ODU1OSwgLTAuODQwMzAxLCAwLjUzNzc2OCxcbiAgICAgMC4zNDAwOTMsIDAuNDMxOTgyLCAtMC43NDAzMjQsIDAuMzg2ODQ1XSxcbiAgICBbLTAuNjAxODE1LCAwLjc5ODYzNiwgMC4wNDMyNzIsIC0wLjgzMjQ3NywgMC41NTIzNjcsXG4gICAgIDAuMzU3ODA3LCAwLjM5NjU4NCwgLTAuNzQzMzIwLCAwLjQwMjcwNF0sXG4gICAgWy0wLjU4Nzc4NSwgMC44MDkwMTcsIDAuMDE4MjM3LCAtMC44MjM2MzksIDAuNTY2ODIxLFxuICAgICAwLjM3Mzk5MSwgMC4zNjAzOTcsIC0wLjc0NDk4OSwgMC40MTg2MTNdLFxuICAgIFstMC41NzM1NzYsIDAuODE5MTUyLCAtMC4wMDY1MTUsIC0wLjgxMzc5OCwgMC41ODExMTIsXG4gICAgIDAuMzg4NjEyLCAwLjMyMzUyNCwgLTAuNzQ1MzA4LCAwLjQzNDU0NF0sXG4gICAgWy0wLjU1OTE5MywgMC44MjkwMzgsIC0wLjAzMDk1NSwgLTAuODAyOTY1LCAwLjU5NTIyMixcbiAgICAgMC40MDE2NDUsIDAuMjg2MDY5LCAtMC43NDQyNjIsIDAuNDUwNDY3XSxcbiAgICBbLTAuNTQ0NjM5LCAwLjgzODY3MSwgLTAuMDU1MDUyLCAtMC43OTExNTQsIDAuNjA5MTM1LFxuICAgICAwLjQxMzA2NiwgMC4yNDgxNDAsIC0wLjc0MTgzNSwgMC40NjYzNTJdLFxuICAgIFstMC41Mjk5MTksIDAuODQ4MDQ4LCAtMC4wNzg3NzgsIC0wLjc3ODM3OCwgMC42MjI4MzMsXG4gICAgIDAuNDIyODU2LCAwLjIwOTg0MywgLTAuNzM4MDE3LCAwLjQ4MjE3MV0sXG4gICAgWy0wLjUxNTAzOCwgMC44NTcxNjcsIC0wLjEwMjEwNCwgLTAuNzY0NjU1LCAwLjYzNjMwMCxcbiAgICAgMC40MzEwMDQsIDAuMTcxMjg4LCAtMC43MzI4MDEsIDAuNDk3ODk0XSxcbiAgICBbLTAuNTAwMDAwLCAwLjg2NjAyNSwgLTAuMTI1MDAwLCAtMC43NTAwMDAsIDAuNjQ5NTE5LFxuICAgICAwLjQzNzUwMCwgMC4xMzI1ODMsIC0wLjcyNjE4NCwgMC41MTM0OTBdLFxuICAgIFstMC40ODQ4MTAsIDAuODc0NjIwLCAtMC4xNDc0MzksIC0wLjczNDQzMSwgMC42NjI0NzQsXG4gICAgIDAuNDQyMzQwLCAwLjA5MzgzNywgLTAuNzE4MTY3LCAwLjUyODkyOV0sXG4gICAgWy0wLjQ2OTQ3MiwgMC44ODI5NDgsIC0wLjE2OTM5NSwgLTAuNzE3OTY4LCAwLjY3NTE1MCxcbiAgICAgMC40NDU1MjQsIDAuMDU1MTYwLCAtMC43MDg3NTMsIDAuNTQ0MTgzXSxcbiAgICBbLTAuNDUzOTkwLCAwLjg5MTAwNywgLTAuMTkwODM5LCAtMC43MDA2MjksIDAuNjg3NTMxLFxuICAgICAwLjQ0NzA1OSwgMC4wMTY2NjIsIC0wLjY5Nzk1MCwgMC41NTkyMjBdLFxuICAgIFstMC40MzgzNzEsIDAuODk4Nzk0LCAtMC4yMTE3NDYsIC0wLjY4MjQzNywgMC42OTk2MDIsXG4gICAgIDAuNDQ2OTUzLCAtMC4wMjE1NTAsIC0wLjY4NTc2OSwgMC41NzQwMTFdLFxuICAgIFstMC40MjI2MTgsIDAuOTA2MzA4LCAtMC4yMzIwOTEsIC0wLjY2MzQxNCwgMC43MTEzNDgsXG4gICAgIDAuNDQ1MjIyLCAtMC4wNTkzNjgsIC0wLjY3MjIyNiwgMC41ODg1MjhdLFxuICAgIFstMC40MDY3MzcsIDAuOTEzNTQ1LCAtMC4yNTE4NDgsIC0wLjY0MzU4MiwgMC43MjI3NTUsXG4gICAgIDAuNDQxODg0LCAtMC4wOTY2ODQsIC0wLjY1NzMzOSwgMC42MDI3NDFdLFxuICAgIFstMC4zOTA3MzEsIDAuOTIwNTA1LCAtMC4yNzA5OTQsIC0wLjYyMjk2NywgMC43MzM4MDksXG4gICAgIDAuNDM2OTY0LCAtMC4xMzMzOTUsIC0wLjY0MTEzMCwgMC42MTY2MjFdLFxuICAgIFstMC4zNzQ2MDcsIDAuOTI3MTg0LCAtMC4yODk1MDUsIC0wLjYwMTU5MiwgMC43NDQ0OTYsXG4gICAgIDAuNDMwNDg4LCAtMC4xNjkzOTcsIC0wLjYyMzYyNCwgMC42MzAxNDFdLFxuICAgIFstMC4zNTgzNjgsIDAuOTMzNTgwLCAtMC4zMDczNTksIC0wLjU3OTQ4NCwgMC43NTQ4MDQsXG4gICAgIDAuNDIyNDkxLCAtMC4yMDQ1ODksIC0wLjYwNDg1MSwgMC42NDMyNzNdLFxuICAgIFstMC4zNDIwMjAsIDAuOTM5NjkzLCAtMC4zMjQ1MzMsIC0wLjU1NjY3MCwgMC43NjQ3MjAsXG4gICAgIDAuNDEzMDA4LCAtMC4yMzg4NzIsIC0wLjU4NDg0MywgMC42NTU5OTBdLFxuICAgIFstMC4zMjU1NjgsIDAuOTQ1NTE5LCAtMC4zNDEwMDgsIC0wLjUzMzE3OCwgMC43NzQyMzEsXG4gICAgIDAuNDAyMDgxLCAtMC4yNzIxNTAsIC0wLjU2MzYzNSwgMC42NjgyNjddLFxuICAgIFstMC4zMDkwMTcsIDAuOTUxMDU3LCAtMC4zNTY3NjMsIC0wLjUwOTAzNywgMC43ODMzMjcsXG4gICAgIDAuMzg5NzU0LCAtMC4zMDQzMjksIC0wLjU0MTI2NiwgMC42ODAwNzhdLFxuICAgIFstMC4yOTIzNzIsIDAuOTU2MzA1LCAtMC4zNzE3NzgsIC0wLjQ4NDI3NSwgMC43OTE5OTcsXG4gICAgIDAuMzc2MDc3LCAtMC4zMzUzMTksIC0wLjUxNzc3OCwgMC42OTEzOTldLFxuICAgIFstMC4yNzU2MzcsIDAuOTYxMjYyLCAtMC4zODYwMzYsIC0wLjQ1ODkyNCwgMC44MDAyMjgsXG4gICAgIDAuMzYxMTAyLCAtMC4zNjUwMzQsIC0wLjQ5MzIxNiwgMC43MDIyMDddLFxuICAgIFstMC4yNTg4MTksIDAuOTY1OTI2LCAtMC4zOTk1MTksIC0wLjQzMzAxMywgMC44MDgwMTMsXG4gICAgIDAuMzQ0ODg1LCAtMC4zOTMzODksIC0wLjQ2NzYyNywgMC43MTI0NzhdLFxuICAgIFstMC4yNDE5MjIsIDAuOTcwMjk2LCAtMC40MTIyMTEsIC0wLjQwNjU3NCwgMC44MTUzNDAsXG4gICAgIDAuMzI3NDg2LCAtMC40MjAzMDYsIC0wLjQ0MTA2MSwgMC43MjIxOTFdLFxuICAgIFstMC4yMjQ5NTEsIDAuOTc0MzcwLCAtMC40MjQwOTYsIC0wLjM3OTY0MSwgMC44MjIyMDIsXG4gICAgIDAuMzA4OTY5LCAtMC40NDU3MDksIC0wLjQxMzU3MiwgMC43MzEzMjddLFxuICAgIFstMC4yMDc5MTIsIDAuOTc4MTQ4LCAtMC40MzUxNTksIC0wLjM1MjI0NCwgMC44Mjg1ODksXG4gICAgIDAuMjg5Mzk5LCAtMC40Njk1MjcsIC0wLjM4NTIxNSwgMC43Mzk4NjZdLFxuICAgIFstMC4xOTA4MDksIDAuOTgxNjI3LCAtMC40NDUzODgsIC0wLjMyNDQxOSwgMC44MzQ0OTUsXG4gICAgIDAuMjY4ODQ2LCAtMC40OTE2OTMsIC0wLjM1NjA0NywgMC43NDc3OTBdLFxuICAgIFstMC4xNzM2NDgsIDAuOTg0ODA4LCAtMC40NTQ3NjksIC0wLjI5NjE5OCwgMC44Mzk5MTIsXG4gICAgIDAuMjQ3MzgyLCAtMC41MTIxNDUsIC0wLjMyNjEyOSwgMC43NTUwODJdLFxuICAgIFstMC4xNTY0MzQsIDAuOTg3Njg4LCAtMC40NjMyOTIsIC0wLjI2NzYxNywgMC44NDQ4MzIsXG4gICAgIDAuMjI1MDgxLCAtMC41MzA4MjcsIC0wLjI5NTUyMSwgMC43NjE3MjhdLFxuICAgIFstMC4xMzkxNzMsIDAuOTkwMjY4LCAtMC40NzA5NDYsIC0wLjIzODcwOSwgMC44NDkyNTEsXG4gICAgIDAuMjAyMDIwLCAtMC41NDc2ODQsIC0wLjI2NDI4NywgMC43Njc3MTJdLFxuICAgIFstMC4xMjE4NjksIDAuOTkyNTQ2LCAtMC40Nzc3MjIsIC0wLjIwOTUxMSwgMC44NTMxNjMsXG4gICAgIDAuMTc4Mjc5LCAtMC41NjI2NzIsIC0wLjIzMjQ5NCwgMC43NzMwMjNdLFxuICAgIFstMC4xMDQ1MjgsIDAuOTk0NTIyLCAtMC40ODM2MTEsIC0wLjE4MDA1NywgMC44NTY1NjMsXG4gICAgIDAuMTUzOTM3LCAtMC41NzU3NDcsIC0wLjIwMDIwNywgMC43Nzc2NDhdLFxuICAgIFstMC4wODcxNTYsIDAuOTk2MTk1LCAtMC40ODg2MDYsIC0wLjE1MDM4NCwgMC44NTk0NDcsXG4gICAgIDAuMTI5MDc4LCAtMC41ODY4NzIsIC0wLjE2NzQ5NCwgMC43ODE1NzldLFxuICAgIFstMC4wNjk3NTYsIDAuOTk3NTY0LCAtMC40OTI3MDEsIC0wLjEyMDUyNywgMC44NjE4MTEsXG4gICAgIDAuMTAzNzg2LCAtMC41OTYwMTgsIC0wLjEzNDQyNiwgMC43ODQ4MDZdLFxuICAgIFstMC4wNTIzMzYsIDAuOTk4NjMwLCAtMC40OTU4OTEsIC0wLjA5MDUyNCwgMC44NjM2NTMsXG4gICAgIDAuMDc4MTQ2LCAtMC42MDMxNTgsIC0wLjEwMTA3MSwgMC43ODczMjRdLFxuICAgIFstMC4wMzQ4OTksIDAuOTk5MzkxLCAtMC40OTgxNzMsIC0wLjA2MDQxMSwgMC44NjQ5NzEsXG4gICAgIDAuMDUyMjQzLCAtMC42MDgyNzIsIC0wLjA2NzUwMCwgMC43ODkxMjZdLFxuICAgIFstMC4wMTc0NTIsIDAuOTk5ODQ4LCAtMC40OTk1NDMsIC0wLjAzMDIyNCwgMC44NjU3NjIsXG4gICAgIDAuMDI2MTY1LCAtMC42MTEzNDcsIC0wLjAzMzc4NiwgMC43OTAyMDhdLFxuICAgIFswLjAwMDAwMCwgMS4wMDAwMDAsIC0wLjUwMDAwMCwgMC4wMDAwMDAsIDAuODY2MDI1LFxuICAgICAtMC4wMDAwMDAsIC0wLjYxMjM3MiwgMC4wMDAwMDAsIDAuNzkwNTY5XSxcbiAgICBbMC4wMTc0NTIsIDAuOTk5ODQ4LCAtMC40OTk1NDMsIDAuMDMwMjI0LCAwLjg2NTc2MixcbiAgICAgLTAuMDI2MTY1LCAtMC42MTEzNDcsIDAuMDMzNzg2LCAwLjc5MDIwOF0sXG4gICAgWzAuMDM0ODk5LCAwLjk5OTM5MSwgLTAuNDk4MTczLCAwLjA2MDQxMSwgMC44NjQ5NzEsXG4gICAgIC0wLjA1MjI0MywgLTAuNjA4MjcyLCAwLjA2NzUwMCwgMC43ODkxMjZdLFxuICAgIFswLjA1MjMzNiwgMC45OTg2MzAsIC0wLjQ5NTg5MSwgMC4wOTA1MjQsIDAuODYzNjUzLFxuICAgICAtMC4wNzgxNDYsIC0wLjYwMzE1OCwgMC4xMDEwNzEsIDAuNzg3MzI0XSxcbiAgICBbMC4wNjk3NTYsIDAuOTk3NTY0LCAtMC40OTI3MDEsIDAuMTIwNTI3LCAwLjg2MTgxMSxcbiAgICAgLTAuMTAzNzg2LCAtMC41OTYwMTgsIDAuMTM0NDI2LCAwLjc4NDgwNl0sXG4gICAgWzAuMDg3MTU2LCAwLjk5NjE5NSwgLTAuNDg4NjA2LCAwLjE1MDM4NCwgMC44NTk0NDcsXG4gICAgIC0wLjEyOTA3OCwgLTAuNTg2ODcyLCAwLjE2NzQ5NCwgMC43ODE1NzldLFxuICAgIFswLjEwNDUyOCwgMC45OTQ1MjIsIC0wLjQ4MzYxMSwgMC4xODAwNTcsIDAuODU2NTYzLFxuICAgICAtMC4xNTM5MzcsIC0wLjU3NTc0NywgMC4yMDAyMDcsIDAuNzc3NjQ4XSxcbiAgICBbMC4xMjE4NjksIDAuOTkyNTQ2LCAtMC40Nzc3MjIsIDAuMjA5NTExLCAwLjg1MzE2MyxcbiAgICAgLTAuMTc4Mjc5LCAtMC41NjI2NzIsIDAuMjMyNDk0LCAwLjc3MzAyM10sXG4gICAgWzAuMTM5MTczLCAwLjk5MDI2OCwgLTAuNDcwOTQ2LCAwLjIzODcwOSwgMC44NDkyNTEsXG4gICAgIC0wLjIwMjAyMCwgLTAuNTQ3Njg0LCAwLjI2NDI4NywgMC43Njc3MTJdLFxuICAgIFswLjE1NjQzNCwgMC45ODc2ODgsIC0wLjQ2MzI5MiwgMC4yNjc2MTcsIDAuODQ0ODMyLFxuICAgICAtMC4yMjUwODEsIC0wLjUzMDgyNywgMC4yOTU1MjEsIDAuNzYxNzI4XSxcbiAgICBbMC4xNzM2NDgsIDAuOTg0ODA4LCAtMC40NTQ3NjksIDAuMjk2MTk4LCAwLjgzOTkxMixcbiAgICAgLTAuMjQ3MzgyLCAtMC41MTIxNDUsIDAuMzI2MTI5LCAwLjc1NTA4Ml0sXG4gICAgWzAuMTkwODA5LCAwLjk4MTYyNywgLTAuNDQ1Mzg4LCAwLjMyNDQxOSwgMC44MzQ0OTUsXG4gICAgIC0wLjI2ODg0NiwgLTAuNDkxNjkzLCAwLjM1NjA0NywgMC43NDc3OTBdLFxuICAgIFswLjIwNzkxMiwgMC45NzgxNDgsIC0wLjQzNTE1OSwgMC4zNTIyNDQsIDAuODI4NTg5LFxuICAgICAtMC4yODkzOTksIC0wLjQ2OTUyNywgMC4zODUyMTUsIDAuNzM5ODY2XSxcbiAgICBbMC4yMjQ5NTEsIDAuOTc0MzcwLCAtMC40MjQwOTYsIDAuMzc5NjQxLCAwLjgyMjIwMixcbiAgICAgLTAuMzA4OTY5LCAtMC40NDU3MDksIDAuNDEzNTcyLCAwLjczMTMyN10sXG4gICAgWzAuMjQxOTIyLCAwLjk3MDI5NiwgLTAuNDEyMjExLCAwLjQwNjU3NCwgMC44MTUzNDAsXG4gICAgIC0wLjMyNzQ4NiwgLTAuNDIwMzA2LCAwLjQ0MTA2MSwgMC43MjIxOTFdLFxuICAgIFswLjI1ODgxOSwgMC45NjU5MjYsIC0wLjM5OTUxOSwgMC40MzMwMTMsIDAuODA4MDEzLFxuICAgICAtMC4zNDQ4ODUsIC0wLjM5MzM4OSwgMC40Njc2MjcsIDAuNzEyNDc4XSxcbiAgICBbMC4yNzU2MzcsIDAuOTYxMjYyLCAtMC4zODYwMzYsIDAuNDU4OTI0LCAwLjgwMDIyOCxcbiAgICAgLTAuMzYxMTAyLCAtMC4zNjUwMzQsIDAuNDkzMjE2LCAwLjcwMjIwN10sXG4gICAgWzAuMjkyMzcyLCAwLjk1NjMwNSwgLTAuMzcxNzc4LCAwLjQ4NDI3NSwgMC43OTE5OTcsXG4gICAgIC0wLjM3NjA3NywgLTAuMzM1MzE5LCAwLjUxNzc3OCwgMC42OTEzOTldLFxuICAgIFswLjMwOTAxNywgMC45NTEwNTcsIC0wLjM1Njc2MywgMC41MDkwMzcsIDAuNzgzMzI3LFxuICAgICAtMC4zODk3NTQsIC0wLjMwNDMyOSwgMC41NDEyNjYsIDAuNjgwMDc4XSxcbiAgICBbMC4zMjU1NjgsIDAuOTQ1NTE5LCAtMC4zNDEwMDgsIDAuNTMzMTc4LCAwLjc3NDIzMSxcbiAgICAgLTAuNDAyMDgxLCAtMC4yNzIxNTAsIDAuNTYzNjM1LCAwLjY2ODI2N10sXG4gICAgWzAuMzQyMDIwLCAwLjkzOTY5MywgLTAuMzI0NTMzLCAwLjU1NjY3MCwgMC43NjQ3MjAsXG4gICAgIC0wLjQxMzAwOCwgLTAuMjM4ODcyLCAwLjU4NDg0MywgMC42NTU5OTBdLFxuICAgIFswLjM1ODM2OCwgMC45MzM1ODAsIC0wLjMwNzM1OSwgMC41Nzk0ODQsIDAuNzU0ODA0LFxuICAgICAtMC40MjI0OTEsIC0wLjIwNDU4OSwgMC42MDQ4NTEsIDAuNjQzMjczXSxcbiAgICBbMC4zNzQ2MDcsIDAuOTI3MTg0LCAtMC4yODk1MDUsIDAuNjAxNTkyLCAwLjc0NDQ5NixcbiAgICAgLTAuNDMwNDg4LCAtMC4xNjkzOTcsIDAuNjIzNjI0LCAwLjYzMDE0MV0sXG4gICAgWzAuMzkwNzMxLCAwLjkyMDUwNSwgLTAuMjcwOTk0LCAwLjYyMjk2NywgMC43MzM4MDksXG4gICAgIC0wLjQzNjk2NCwgLTAuMTMzMzk1LCAwLjY0MTEzMCwgMC42MTY2MjFdLFxuICAgIFswLjQwNjczNywgMC45MTM1NDUsIC0wLjI1MTg0OCwgMC42NDM1ODIsIDAuNzIyNzU1LFxuICAgICAtMC40NDE4ODQsIC0wLjA5NjY4NCwgMC42NTczMzksIDAuNjAyNzQxXSxcbiAgICBbMC40MjI2MTgsIDAuOTA2MzA4LCAtMC4yMzIwOTEsIDAuNjYzNDE0LCAwLjcxMTM0OCxcbiAgICAgLTAuNDQ1MjIyLCAtMC4wNTkzNjgsIDAuNjcyMjI2LCAwLjU4ODUyOF0sXG4gICAgWzAuNDM4MzcxLCAwLjg5ODc5NCwgLTAuMjExNzQ2LCAwLjY4MjQzNywgMC42OTk2MDIsXG4gICAgIC0wLjQ0Njk1MywgLTAuMDIxNTUwLCAwLjY4NTc2OSwgMC41NzQwMTFdLFxuICAgIFswLjQ1Mzk5MCwgMC44OTEwMDcsIC0wLjE5MDgzOSwgMC43MDA2MjksIDAuNjg3NTMxLFxuICAgICAtMC40NDcwNTksIDAuMDE2NjYyLCAwLjY5Nzk1MCwgMC41NTkyMjBdLFxuICAgIFswLjQ2OTQ3MiwgMC44ODI5NDgsIC0wLjE2OTM5NSwgMC43MTc5NjgsIDAuNjc1MTUwLFxuICAgICAtMC40NDU1MjQsIDAuMDU1MTYwLCAwLjcwODc1MywgMC41NDQxODNdLFxuICAgIFswLjQ4NDgxMCwgMC44NzQ2MjAsIC0wLjE0NzQzOSwgMC43MzQ0MzEsIDAuNjYyNDc0LFxuICAgICAtMC40NDIzNDAsIDAuMDkzODM3LCAwLjcxODE2NywgMC41Mjg5MjldLFxuICAgIFswLjUwMDAwMCwgMC44NjYwMjUsIC0wLjEyNTAwMCwgMC43NTAwMDAsIDAuNjQ5NTE5LFxuICAgICAtMC40Mzc1MDAsIDAuMTMyNTgzLCAwLjcyNjE4NCwgMC41MTM0OTBdLFxuICAgIFswLjUxNTAzOCwgMC44NTcxNjcsIC0wLjEwMjEwNCwgMC43NjQ2NTUsIDAuNjM2MzAwLFxuICAgICAtMC40MzEwMDQsIDAuMTcxMjg4LCAwLjczMjgwMSwgMC40OTc4OTRdLFxuICAgIFswLjUyOTkxOSwgMC44NDgwNDgsIC0wLjA3ODc3OCwgMC43NzgzNzgsIDAuNjIyODMzLFxuICAgICAtMC40MjI4NTYsIDAuMjA5ODQzLCAwLjczODAxNywgMC40ODIxNzFdLFxuICAgIFswLjU0NDYzOSwgMC44Mzg2NzEsIC0wLjA1NTA1MiwgMC43OTExNTQsIDAuNjA5MTM1LFxuICAgICAtMC40MTMwNjYsIDAuMjQ4MTQwLCAwLjc0MTgzNSwgMC40NjYzNTJdLFxuICAgIFswLjU1OTE5MywgMC44MjkwMzgsIC0wLjAzMDk1NSwgMC44MDI5NjUsIDAuNTk1MjIyLFxuICAgICAtMC40MDE2NDUsIDAuMjg2MDY5LCAwLjc0NDI2MiwgMC40NTA0NjddLFxuICAgIFswLjU3MzU3NiwgMC44MTkxNTIsIC0wLjAwNjUxNSwgMC44MTM3OTgsIDAuNTgxMTEyLFxuICAgICAtMC4zODg2MTIsIDAuMzIzNTI0LCAwLjc0NTMwOCwgMC40MzQ1NDRdLFxuICAgIFswLjU4Nzc4NSwgMC44MDkwMTcsIDAuMDE4MjM3LCAwLjgyMzYzOSwgMC41NjY4MjEsXG4gICAgIC0wLjM3Mzk5MSwgMC4zNjAzOTcsIDAuNzQ0OTg5LCAwLjQxODYxM10sXG4gICAgWzAuNjAxODE1LCAwLjc5ODYzNiwgMC4wNDMyNzIsIDAuODMyNDc3LCAwLjU1MjM2NyxcbiAgICAgLTAuMzU3ODA3LCAwLjM5NjU4NCwgMC43NDMzMjAsIDAuNDAyNzA0XSxcbiAgICBbMC42MTU2NjEsIDAuNzg4MDExLCAwLjA2ODU1OSwgMC44NDAzMDEsIDAuNTM3NzY4LFxuICAgICAtMC4zNDAwOTMsIDAuNDMxOTgyLCAwLjc0MDMyNCwgMC4zODY4NDVdLFxuICAgIFswLjYyOTMyMCwgMC43NzcxNDYsIDAuMDk0MDY2LCAwLjg0NzEwMSwgMC41MjMwNDEsXG4gICAgIC0wLjMyMDg4NCwgMC40NjY0OTAsIDAuNzM2MDI1LCAwLjM3MTA2M10sXG4gICAgWzAuNjQyNzg4LCAwLjc2NjA0NCwgMC4xMTk3NjQsIDAuODUyODY5LCAwLjUwODIwNSxcbiAgICAgLTAuMzAwMjIxLCAwLjUwMDAwOSwgMC43MzA0NTEsIDAuMzU1Mzg3XSxcbiAgICBbMC42NTYwNTksIDAuNzU0NzEwLCAwLjE0NTYyMCwgMC44NTc1OTcsIDAuNDkzMjc2LFxuICAgICAtMC4yNzgxNDcsIDAuNTMyNDQzLCAwLjcyMzYzMywgMC4zMzk4NDRdLFxuICAgIFswLjY2OTEzMSwgMC43NDMxNDUsIDAuMTcxNjA0LCAwLjg2MTI4MSwgMC40NzgyNzUsXG4gICAgIC0wLjI1NDcxMiwgMC41NjM3MDAsIDAuNzE1NjA1LCAwLjMyNDQ1OV0sXG4gICAgWzAuNjgxOTk4LCAwLjczMTM1NCwgMC4xOTc2ODMsIDAuODYzOTE2LCAwLjQ2MzIxOCxcbiAgICAgLTAuMjI5OTY3LCAwLjU5MzY4OCwgMC43MDY0MDUsIDAuMzA5MjU5XSxcbiAgICBbMC42OTQ2NTgsIDAuNzE5MzQwLCAwLjIyMzgyNSwgMC44NjU0OTgsIDAuNDQ4MTI1LFxuICAgICAtMC4yMDM5NjksIDAuNjIyMzIyLCAwLjY5NjA3MywgMC4yOTQyNjddLFxuICAgIFswLjcwNzEwNywgMC43MDcxMDcsIDAuMjUwMDAwLCAwLjg2NjAyNSwgMC40MzMwMTMsXG4gICAgIC0wLjE3Njc3NywgMC42NDk1MTksIDAuNjg0NjUzLCAwLjI3OTUwOF0sXG4gICAgWzAuNzE5MzQwLCAwLjY5NDY1OCwgMC4yNzYxNzUsIDAuODY1NDk4LCAwLjQxNzkwMSxcbiAgICAgLTAuMTQ4NDU0LCAwLjY3NTE5OSwgMC42NzIxOTAsIDAuMjY1MDA1XSxcbiAgICBbMC43MzEzNTQsIDAuNjgxOTk4LCAwLjMwMjMxNywgMC44NjM5MTYsIDAuNDAyODA3LFxuICAgICAtMC4xMTkwNjgsIDAuNjk5Mjg4LCAwLjY1ODczNCwgMC4yNTA3NzhdLFxuICAgIFswLjc0MzE0NSwgMC42NjkxMzEsIDAuMzI4Mzk2LCAwLjg2MTI4MSwgMC4zODc3NTEsXG4gICAgIC0wLjA4ODY4NiwgMC43MjE3MTQsIDAuNjQ0MzM0LCAwLjIzNjg1MF0sXG4gICAgWzAuNzU0NzEwLCAwLjY1NjA1OSwgMC4zNTQzODAsIDAuODU3NTk3LCAwLjM3Mjc0OSxcbiAgICAgLTAuMDU3MzgzLCAwLjc0MjQxMiwgMC42MjkwNDQsIDAuMjIzMjM4XSxcbiAgICBbMC43NjYwNDQsIDAuNjQyNzg4LCAwLjM4MDIzNiwgMC44NTI4NjksIDAuMzU3ODIxLFxuICAgICAtMC4wMjUyMzMsIDAuNzYxMzE5LCAwLjYxMjkyMSwgMC4yMDk5NjNdLFxuICAgIFswLjc3NzE0NiwgMC42MjkzMjAsIDAuNDA1OTM0LCAwLjg0NzEwMSwgMC4zNDI5ODQsXG4gICAgIDAuMDA3Njg2LCAwLjc3ODM3OSwgMC41OTYwMjEsIDAuMTk3MDQwXSxcbiAgICBbMC43ODgwMTEsIDAuNjE1NjYxLCAwLjQzMTQ0MSwgMC44NDAzMDEsIDAuMzI4MjU3LFxuICAgICAwLjA0MTI5NCwgMC43OTM1NDEsIDAuNTc4NDA1LCAwLjE4NDQ4N10sXG4gICAgWzAuNzk4NjM2LCAwLjYwMTgxNSwgMC40NTY3MjgsIDAuODMyNDc3LCAwLjMxMzY1OCxcbiAgICAgMC4wNzU1MDgsIDAuODA2NzU3LCAwLjU2MDEzMiwgMC4xNzIzMTddLFxuICAgIFswLjgwOTAxNywgMC41ODc3ODUsIDAuNDgxNzYzLCAwLjgyMzYzOSwgMC4yOTkyMDQsXG4gICAgIDAuMTEwMjQ2LCAwLjgxNzk4NywgMC41NDEyNjYsIDAuMTYwNTQ1XSxcbiAgICBbMC44MTkxNTIsIDAuNTczNTc2LCAwLjUwNjUxNSwgMC44MTM3OTgsIDAuMjg0OTE0LFxuICAgICAwLjE0NTQyMCwgMC44MjcxOTQsIDAuNTIxODcxLCAwLjE0OTE4MV0sXG4gICAgWzAuODI5MDM4LCAwLjU1OTE5MywgMC41MzA5NTUsIDAuODAyOTY1LCAwLjI3MDgwMyxcbiAgICAgMC4xODA5NDQsIDAuODM0MzQ3LCAwLjUwMjAxMSwgMC4xMzgyMzddLFxuICAgIFswLjgzODY3MSwgMC41NDQ2MzksIDAuNTU1MDUyLCAwLjc5MTE1NCwgMC4yNTY4OTEsXG4gICAgIDAuMjE2NzMwLCAwLjgzOTQyMiwgMC40ODE3NTMsIDAuMTI3NzIyXSxcbiAgICBbMC44NDgwNDgsIDAuNTI5OTE5LCAwLjU3ODc3OCwgMC43NzgzNzgsIDAuMjQzMTkyLFxuICAgICAwLjI1MjY4OCwgMC44NDIzOTksIDAuNDYxMTY0LCAwLjExNzY0NF0sXG4gICAgWzAuODU3MTY3LCAwLjUxNTAzOCwgMC42MDIxMDQsIDAuNzY0NjU1LCAwLjIyOTcyNixcbiAgICAgMC4yODg3MjgsIDAuODQzMjY1LCAwLjQ0MDMxMSwgMC4xMDgwMDldLFxuICAgIFswLjg2NjAyNSwgMC41MDAwMDAsIDAuNjI1MDAwLCAwLjc1MDAwMCwgMC4yMTY1MDYsXG4gICAgIDAuMzI0NzYwLCAwLjg0MjAxMiwgMC40MTkyNjMsIDAuMDk4ODIxXSxcbiAgICBbMC44NzQ2MjAsIDAuNDg0ODEwLCAwLjY0NzQzOSwgMC43MzQ0MzEsIDAuMjAzNTUxLFxuICAgICAwLjM2MDY5MiwgMC44Mzg2MzgsIDAuMzk4MDg2LCAwLjA5MDA4NV0sXG4gICAgWzAuODgyOTQ4LCAwLjQ2OTQ3MiwgMC42NjkzOTUsIDAuNzE3OTY4LCAwLjE5MDg3NSxcbiAgICAgMC4zOTY0MzYsIDAuODMzMTQ1LCAwLjM3Njg1MSwgMC4wODE4MDNdLFxuICAgIFswLjg5MTAwNywgMC40NTM5OTAsIDAuNjkwODM5LCAwLjcwMDYyOSwgMC4xNzg0OTQsXG4gICAgIDAuNDMxODk5LCAwLjgyNTU0NCwgMC4zNTU2MjMsIDAuMDczOTc0XSxcbiAgICBbMC44OTg3OTQsIDAuNDM4MzcxLCAwLjcxMTc0NiwgMC42ODI0MzcsIDAuMTY2NDIzLFxuICAgICAwLjQ2Njk5MywgMC44MTU4NTAsIDAuMzM0NDcyLCAwLjA2NjU5OV0sXG4gICAgWzAuOTA2MzA4LCAwLjQyMjYxOCwgMC43MzIwOTEsIDAuNjYzNDE0LCAwLjE1NDY3OCxcbiAgICAgMC41MDE2MjcsIDAuODA0MDgzLCAwLjMxMzQ2NCwgMC4wNTk2NzRdLFxuICAgIFswLjkxMzU0NSwgMC40MDY3MzcsIDAuNzUxODQ4LCAwLjY0MzU4MiwgMC4xNDMyNzEsXG4gICAgIDAuNTM1NzE1LCAwLjc5MDI3MCwgMC4yOTI2NjYsIDAuMDUzMTk2XSxcbiAgICBbMC45MjA1MDUsIDAuMzkwNzMxLCAwLjc3MDk5NCwgMC42MjI5NjcsIDAuMTMyMjE3LFxuICAgICAwLjU2OTE2OSwgMC43NzQ0NDIsIDAuMjcyMTQzLCAwLjA0NzE2MF0sXG4gICAgWzAuOTI3MTg0LCAwLjM3NDYwNywgMC43ODk1MDUsIDAuNjAxNTkyLCAwLjEyMTUyOSxcbiAgICAgMC42MDE5MDQsIDAuNzU2NjM3LCAwLjI1MTk2MCwgMC4wNDE1NTldLFxuICAgIFswLjkzMzU4MCwgMC4zNTgzNjgsIDAuODA3MzU5LCAwLjU3OTQ4NCwgMC4xMTEyMjIsXG4gICAgIDAuNjMzODM3LCAwLjczNjg5OCwgMC4yMzIxODAsIDAuMDM2Mzg1XSxcbiAgICBbMC45Mzk2OTMsIDAuMzQyMDIwLCAwLjgyNDUzMywgMC41NTY2NzAsIDAuMTAxMzA2LFxuICAgICAwLjY2NDg4NSwgMC43MTUyNzQsIDAuMjEyODY1LCAwLjAzMTYzMF0sXG4gICAgWzAuOTQ1NTE5LCAwLjMyNTU2OCwgMC44NDEwMDgsIDAuNTMzMTc4LCAwLjA5MTc5NCxcbiAgICAgMC42OTQ5NjksIDAuNjkxODE2LCAwLjE5NDA3NSwgMC4wMjcyODFdLFxuICAgIFswLjk1MTA1NywgMC4zMDkwMTcsIDAuODU2NzYzLCAwLjUwOTAzNywgMC4wODI2OTgsXG4gICAgIDAuNzI0MDEyLCAwLjY2NjU4MywgMC4xNzU4NjgsIDAuMDIzMzI5XSxcbiAgICBbMC45NTYzMDUsIDAuMjkyMzcyLCAwLjg3MTc3OCwgMC40ODQyNzUsIDAuMDc0MDI5LFxuICAgICAwLjc1MTk0MCwgMC42Mzk2MzksIDAuMTU4MzAxLCAwLjAxOTc1OF0sXG4gICAgWzAuOTYxMjYyLCAwLjI3NTYzNywgMC44ODYwMzYsIDAuNDU4OTI0LCAwLjA2NTc5NyxcbiAgICAgMC43Nzg2ODAsIDAuNjExMDUwLCAwLjE0MTQyNywgMC4wMTY1NTZdLFxuICAgIFswLjk2NTkyNiwgMC4yNTg4MTksIDAuODk5NTE5LCAwLjQzMzAxMywgMC4wNTgwMTMsXG4gICAgIDAuODA0MTY0LCAwLjU4MDg4OSwgMC4xMjUzMDAsIDAuMDEzNzA3XSxcbiAgICBbMC45NzAyOTYsIDAuMjQxOTIyLCAwLjkxMjIxMSwgMC40MDY1NzQsIDAuMDUwNjg1LFxuICAgICAwLjgyODMyNiwgMC41NDkyMzMsIDAuMTA5OTY5LCAwLjAxMTE5M10sXG4gICAgWzAuOTc0MzcwLCAwLjIyNDk1MSwgMC45MjQwOTYsIDAuMzc5NjQxLCAwLjA0MzgyMyxcbiAgICAgMC44NTExMDUsIDAuNTE2MTYyLCAwLjA5NTQ4MSwgMC4wMDg5OTldLFxuICAgIFswLjk3ODE0OCwgMC4yMDc5MTIsIDAuOTM1MTU5LCAwLjM1MjI0NCwgMC4wMzc0MzYsXG4gICAgIDAuODcyNDQxLCAwLjQ4MTc1OSwgMC4wODE4ODAsIDAuMDA3MTA1XSxcbiAgICBbMC45ODE2MjcsIDAuMTkwODA5LCAwLjk0NTM4OCwgMC4zMjQ0MTksIDAuMDMxNTMwLFxuICAgICAwLjg5MjI3OSwgMC40NDYxMTQsIDAuMDY5MjA5LCAwLjAwNTQ5Ml0sXG4gICAgWzAuOTg0ODA4LCAwLjE3MzY0OCwgMC45NTQ3NjksIDAuMjk2MTk4LCAwLjAyNjExNCxcbiAgICAgMC45MTA1NjksIDAuNDA5MzE3LCAwLjA1NzUwNSwgMC4wMDQxNDBdLFxuICAgIFswLjk4NzY4OCwgMC4xNTY0MzQsIDAuOTYzMjkyLCAwLjI2NzYxNywgMC4wMjExOTMsXG4gICAgIDAuOTI3MjYyLCAwLjM3MTQ2MywgMC4wNDY4MDYsIDAuMDAzMDI2XSxcbiAgICBbMC45OTAyNjgsIDAuMTM5MTczLCAwLjk3MDk0NiwgMC4yMzg3MDksIDAuMDE2Nzc0LFxuICAgICAwLjk0MjMxNiwgMC4zMzI2NDksIDAuMDM3MTQzLCAwLjAwMjEzMV0sXG4gICAgWzAuOTkyNTQ2LCAwLjEyMTg2OSwgMC45Nzc3MjIsIDAuMjA5NTExLCAwLjAxMjg2MixcbiAgICAgMC45NTU2OTMsIDAuMjkyOTc2LCAwLjAyODU0NywgMC4wMDE0MzFdLFxuICAgIFswLjk5NDUyMiwgMC4xMDQ1MjgsIDAuOTgzNjExLCAwLjE4MDA1NywgMC4wMDk0NjIsXG4gICAgIDAuOTY3MzU2LCAwLjI1MjU0NCwgMC4wMjEwNDMsIDAuMDAwOTAzXSxcbiAgICBbMC45OTYxOTUsIDAuMDg3MTU2LCAwLjk4ODYwNiwgMC4xNTAzODQsIDAuMDA2NTc4LFxuICAgICAwLjk3NzI3NywgMC4yMTE0NjAsIDAuMDE0NjU0LCAwLjAwMDUyM10sXG4gICAgWzAuOTk3NTY0LCAwLjA2OTc1NiwgMC45OTI3MDEsIDAuMTIwNTI3LCAwLjAwNDIxNCxcbiAgICAgMC45ODU0MjksIDAuMTY5ODI4LCAwLjAwOTQwMCwgMC4wMDAyNjhdLFxuICAgIFswLjk5ODYzMCwgMC4wNTIzMzYsIDAuOTk1ODkxLCAwLjA5MDUyNCwgMC4wMDIzNzIsXG4gICAgIDAuOTkxNzkxLCAwLjEyNzc1NywgMC4wMDUyOTcsIDAuMDAwMTEzXSxcbiAgICBbMC45OTkzOTEsIDAuMDM0ODk5LCAwLjk5ODE3MywgMC4wNjA0MTEsIDAuMDAxMDU1LFxuICAgICAwLjk5NjM0OCwgMC4wODUzNTYsIDAuMDAyMzU3LCAwLjAwMDAzNF0sXG4gICAgWzAuOTk5ODQ4LCAwLjAxNzQ1MiwgMC45OTk1NDMsIDAuMDMwMjI0LCAwLjAwMDI2NCxcbiAgICAgMC45OTkwODYsIDAuMDQyNzMzLCAwLjAwMDU5MCwgMC4wMDAwMDRdLFxuICAgIFsxLjAwMDAwMCwgLTAuMDAwMDAwLCAxLjAwMDAwMCwgLTAuMDAwMDAwLCAwLjAwMDAwMCxcbiAgICAgMS4wMDAwMDAsIC0wLjAwMDAwMCwgMC4wMDAwMDAsIC0wLjAwMDAwMF0sXG4gIF0sXG5dO1xuXG5cbi8qKiBAdHlwZSB7TnVtYmVyfSAqL1xuZXhwb3J0cy5TUEhFUklDQUxfSEFSTU9OSUNTX0FaSU1VVEhfUkVTT0xVVElPTiA9XG4gIGV4cG9ydHMuU1BIRVJJQ0FMX0hBUk1PTklDU1swXS5sZW5ndGg7XG5cblxuLyoqIEB0eXBlIHtOdW1iZXJ9ICovXG5leHBvcnRzLlNQSEVSSUNBTF9IQVJNT05JQ1NfRUxFVkFUSU9OX1JFU09MVVRJT04gPVxuICBleHBvcnRzLlNQSEVSSUNBTF9IQVJNT05JQ1NbMV0ubGVuZ3RoO1xuXG5cbi8qKlxuICogVGhlIG1heGltdW0gYWxsb3dlZCBhbWJpc29uaWMgb3JkZXIuXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5leHBvcnRzLlNQSEVSSUNBTF9IQVJNT05JQ1NfTUFYX09SREVSID1cbiAgZXhwb3J0cy5TUEhFUklDQUxfSEFSTU9OSUNTWzBdWzBdLmxlbmd0aCAvIDI7XG5cblxuLyoqXG4gKiBQcmUtY29tcHV0ZWQgcGVyLWJhbmQgd2VpZ2h0aW5nIGNvZWZmaWNpZW50cyBmb3IgcHJvZHVjaW5nIGVuZXJneS1wcmVzZXJ2aW5nXG4gKiBNYXgtUmUgc291cmNlcy5cbiAqL1xuZXhwb3J0cy5NQVhfUkVfV0VJR0hUUyA9XG5bXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMDAwMCwgMS4wMDAwMDAsIDEuMDAwMDAwLCAxLjAwMDAwMF0sXG4gIFsxLjAwMzIzNiwgMS4wMDIxNTYsIDAuOTk5MTUyLCAwLjk5MDAzOF0sXG4gIFsxLjAzMjM3MCwgMS4wMjExOTQsIDAuOTkwNDMzLCAwLjg5ODU3Ml0sXG4gIFsxLjA2MjY5NCwgMS4wNDAyMzEsIDAuOTc5MTYxLCAwLjc5OTgwNl0sXG4gIFsxLjA5Mzk5OSwgMS4wNTg5NTQsIDAuOTY0OTc2LCAwLjY5MzYwM10sXG4gIFsxLjEyNjAwMywgMS4wNzcwMDYsIDAuOTQ3NTI2LCAwLjU3OTg5MF0sXG4gIFsxLjE1ODM0NSwgMS4wOTM5ODIsIDAuOTI2NDc0LCAwLjQ1ODY5MF0sXG4gIFsxLjE5MDU5MCwgMS4xMDk0MzcsIDAuOTAxNTEyLCAwLjMzMDE1OF0sXG4gIFsxLjIyMjIyOCwgMS4xMjI4OTAsIDAuODcyMzcwLCAwLjE5NDYyMV0sXG4gIFsxLjI1MjY4NCwgMS4xMzM4MzcsIDAuODM4ODM5LCAwLjA1MjYxNF0sXG4gIFsxLjI4MTk4NywgMS4xNDIzNTgsIDAuODAxMTk5LCAwLjAwMDAwMF0sXG4gIFsxLjMxMjA3MywgMS4xNTAyMDcsIDAuNzYwODM5LCAwLjAwMDAwMF0sXG4gIFsxLjM0MzAxMSwgMS4xNTc0MjQsIDAuNzE3Nzk5LCAwLjAwMDAwMF0sXG4gIFsxLjM3NDY0OSwgMS4xNjM4NTksIDAuNjcxOTk5LCAwLjAwMDAwMF0sXG4gIFsxLjQwNjgwOSwgMS4xNjkzNTQsIDAuNjIzMzcxLCAwLjAwMDAwMF0sXG4gIFsxLjQzOTI4NiwgMS4xNzM3MzksIDAuNTcxODY4LCAwLjAwMDAwMF0sXG4gIFsxLjQ3MTg0NiwgMS4xNzY4MzcsIDAuNTE3NDY1LCAwLjAwMDAwMF0sXG4gIFsxLjUwNDIyNiwgMS4xNzg0NjUsIDAuNDYwMTc0LCAwLjAwMDAwMF0sXG4gIFsxLjUzNjEzMywgMS4xNzg0MzgsIDAuNDAwMDQzLCAwLjAwMDAwMF0sXG4gIFsxLjU2NzI1MywgMS4xNzY1NzMsIDAuMzM3MTY1LCAwLjAwMDAwMF0sXG4gIFsxLjU5NzI0NywgMS4xNzI2OTUsIDAuMjcxNjg4LCAwLjAwMDAwMF0sXG4gIFsxLjYyNTc2NiwgMS4xNjY2NDUsIDAuMjAzODE1LCAwLjAwMDAwMF0sXG4gIFsxLjY1MjQ1NSwgMS4xNTgyODUsIDAuMTMzODA2LCAwLjAwMDAwMF0sXG4gIFsxLjY3Njk2NiwgMS4xNDc1MDYsIDAuMDYxOTgzLCAwLjAwMDAwMF0sXG4gIFsxLjY5OTAwNiwgMS4xMzQyNjEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjcyMDIyNCwgMS4xMTk3ODksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjc0MTYzMSwgMS4xMDQ4MTAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjc2MzE4MywgMS4wODkzMzAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjc4NDgzNywgMS4wNzMzNTYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjgwNjU0OCwgMS4wNTY4OTgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjgyODI2OSwgMS4wMzk5NjgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjg0OTk1MiwgMS4wMjI1ODAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjg3MTU1MiwgMS4wMDQ3NTIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjg5MzAxOCwgMC45ODY1MDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjkxNDMwNSwgMC45Njc4NTcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjkzNTM2NiwgMC45NDg4MzcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjk1NjE1NCwgMC45Mjk0NzEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjk3NjYyNSwgMC45MDk3OTAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsxLjk5NjczNiwgMC44ODk4MjMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjAxNjQ0OCwgMC44Njk2MDcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjAzNTcyMSwgMC44NDkxNzUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjA1NDUyMiwgMC44Mjg1NjUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjA3MjgxOCwgMC44MDc4MTYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjA5MDU4MSwgMC43ODY5NjQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjEwNzc4NSwgMC43NjYwNTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjEyNDQxMSwgMC43NDUxMTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjE0MDQzOSwgMC43MjQxOTYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjE1NTg1NiwgMC43MDMzMzIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjE3MDY1MywgMC42ODI1NjEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjE4NDgyMywgMC42NjE5MjEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjE5ODM2NCwgMC42NDE0NDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjIxMTI3NSwgMC42MjExNjksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjIyMzU2MiwgMC42MDExMjUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjIzNTIzMCwgMC41ODEzNDEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjI0NjI4OSwgMC41NjE4NDcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjI1Njc1MSwgMC41NDI2NjcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjI2NjYzMSwgMC41MjM4MjYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjI3NTk0MywgMC41MDUzNDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjI4NDcwNywgMC40ODcyMzksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjI5MjkzOSwgMC40Njk1MjgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjMwMDY2MSwgMC40NTIyMjUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjMwNzg5MiwgMC40MzUzNDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjMxNDY1NCwgMC40MTg4ODgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjMyMDk2OSwgMC40MDI4NzAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjMyNjg1OCwgMC4zODcyOTQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjMzMjM0MywgMC4zNzIxNjQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjMzNzQ0NSwgMC4zNTc0ODEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM0MjE4NiwgMC4zNDMyNDYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM0NjU4NSwgMC4zMjk0NTgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM1MDY2NCwgMC4zMTYxMTMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM1NDQ0MiwgMC4zMDMyMDgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM1NzkzNywgMC4yOTA3MzgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM2MTE2OCwgMC4yNzg2OTgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM2NDE1MiwgMC4yNjcwODAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM2NjkwNiwgMC4yNTU4NzgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM2OTQ0NiwgMC4yNDUwODIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM3MTc4NiwgMC4yMzQ2ODUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM3Mzk0MCwgMC4yMjQ2NzcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM3NTkyMywgMC4yMTUwNDgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM3Nzc0NSwgMC4yMDU3OTAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM3OTQyMSwgMC4xOTY4OTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM4MDk1OSwgMC4xODgzNDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM4MjM3MiwgMC4xODAxMzIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM4MzY2NywgMC4xNzIyNTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM4NDg1NiwgMC4xNjQ2ODksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM4NTk0NSwgMC4xNTc0MzUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM4Njk0MywgMC4xNTA0NzksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM4Nzg1NywgMC4xNDM4MTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM4ODY5NCwgMC4xMzc0MjEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM4OTQ2MCwgMC4xMzEyOTksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5MDE2MCwgMC4xMjU0MzUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5MDgwMSwgMC4xMTk4MjAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5MTM4NiwgMC4xMTQ0NDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5MTkyMSwgMC4xMDkzMDAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5MjQxMCwgMC4xMDQzNzYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5Mjg1NywgMC4wOTk2NjYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5MzI2NSwgMC4wOTUxNjAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5MzYzNywgMC4wOTA4NTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5Mzk3NywgMC4wODY3MzEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NDI4OCwgMC4wODI3OTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NDU3MSwgMC4wNzkwMjUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NDgyOSwgMC4wNzU0MjYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NTA2NCwgMC4wNzE5ODYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NTI3OSwgMC4wNjg2OTksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NTQ3NSwgMC4wNjU1NTgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NTY1MywgMC4wNjI1NTgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NTgxNiwgMC4wNTk2OTMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NTk2NCwgMC4wNTY5NTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NjA5OSwgMC4wNTQzNDEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NjIyMiwgMC4wNTE4NDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NjMzNCwgMC4wNDk0NjIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NjQzNiwgMC4wNDcxODYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NjUyOSwgMC4wNDUwMTMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NjYxMywgMC4wNDI5MzksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NjY5MSwgMC4wNDA5NTksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5Njc2MSwgMC4wMzkwNjksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NjgyNSwgMC4wMzcyNjYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5Njg4MywgMC4wMzU1NDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NjkzNiwgMC4wMzM5MDEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5Njk4NCwgMC4wMzIzMzQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzAyOCwgMC4wMzA4MzgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzA2OCwgMC4wMjk0MTAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzEwNCwgMC4wMjgwNDgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzEzNywgMC4wMjY3NDksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzE2NywgMC4wMjU1MDksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzE5NCwgMC4wMjQzMjYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzIxOSwgMC4wMjMxOTgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzI0MiwgMC4wMjIxMjIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzI2MiwgMC4wMjEwOTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzI4MSwgMC4wMjAxMTYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzI5OCwgMC4wMTkxODEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzMxNCwgMC4wMTgyOTAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzMyOCwgMC4wMTc0NDEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzM0MSwgMC4wMTY2MzAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzM1MiwgMC4wMTU4NTcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzM2MywgMC4wMTUxMTksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzM3MiwgMC4wMTQ0MTYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzM4MSwgMC4wMTM3NDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzM4OSwgMC4wMTMxMDYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzM5NiwgMC4wMTI0OTYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQwMywgMC4wMTE5MTQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQwOSwgMC4wMTEzNjAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQxNCwgMC4wMTA4MzEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQxOSwgMC4wMTAzMjYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQyNCwgMC4wMDk4NDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQyOCwgMC4wMDkzODcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQzMiwgMC4wMDg5NDksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQzNSwgMC4wMDg1MzIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQzOCwgMC4wMDgxMzUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ0MSwgMC4wMDc3NTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ0MywgMC4wMDczOTQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ0NiwgMC4wMDcwNDksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ0OCwgMC4wMDY3MjEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ1MCwgMC4wMDY0MDcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ1MSwgMC4wMDYxMDgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ1MywgMC4wMDU4MjQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ1NCwgMC4wMDU1NTIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ1NiwgMC4wMDUyOTMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ1NywgMC4wMDUwNDYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ1OCwgMC4wMDQ4MTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ1OSwgMC4wMDQ1ODYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2MCwgMC4wMDQzNzIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2MSwgMC4wMDQxNjgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2MSwgMC4wMDM5NzQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2MiwgMC4wMDM3ODgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2MywgMC4wMDM2MTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2MywgMC4wMDM0NDMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NCwgMC4wMDMyODIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NCwgMC4wMDMxMjksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NSwgMC4wMDI5ODMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NSwgMC4wMDI4NDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NSwgMC4wMDI3MTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NiwgMC4wMDI1ODQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NiwgMC4wMDI0NjQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NiwgMC4wMDIzNDksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NiwgMC4wMDIyMzksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NywgMC4wMDIxMzUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NywgMC4wMDIwMzUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NywgMC4wMDE5NDAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NywgMC4wMDE4NDksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NywgMC4wMDE3NjMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2NywgMC4wMDE2ODEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDE2MDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDE1MjcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDE0NTYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDEzODgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDEzMjMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDEyNjEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDEyMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDExNDYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDEwOTMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDEwNDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDA5OTMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDA5NDcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDA5MDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDA4NjAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OCwgMC4wMDA4MjAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA3ODIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA3NDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA3MTAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA2NzcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA2NDYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA2MTYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA1ODcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA1NTksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA1MzMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA1MDgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA0ODUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA0NjIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA0NDAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA0MjAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDA0MDAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAzODEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAzNjQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAzNDcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAzMzAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAzMTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAzMDAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAyODYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAyNzMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAyNjAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAyNDgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAyMzYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAyMjUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAyMTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAyMDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxOTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxODYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxNzcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxNjksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxNjEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxNTQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxNDcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxNDAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxMzMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxMjcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxMjEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxMTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxMTAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxMDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAxMDAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwOTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwOTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwODcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwODMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNzksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNzUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNzEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNjgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNjUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNjIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNTksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNTYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNTQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNDksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNDYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwNDAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMzgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMzcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMzUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMzMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMzIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMzAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMjksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMjcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMjYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMjUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMjQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMjMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMjIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMjEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMjAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMTAsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDksIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDgsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDcsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDYsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDUsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDQsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDMsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDIsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG4gIFsyLjM5NzQ2OSwgMC4wMDAwMDEsIDAuMDAwMDAwLCAwLjAwMDAwMF0sXG5dO1xuXG5cbi8qKiBAdHlwZSB7TnVtYmVyfSAqL1xuZXhwb3J0cy5NQVhfUkVfV0VJR0hUU19SRVNPTFVUSU9OID0gZXhwb3J0cy5NQVhfUkVfV0VJR0hUUy5sZW5ndGg7XG5cblxuLyoqKi8gfSksXG4vKiA0ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlIFNvdXJjZSBtb2RlbCB0byBzcGF0aWFsaXplIGFuIGF1ZGlvIGJ1ZmZlci5cbiAqIEBhdXRob3IgQW5kcmV3IEFsbGVuIDxiaXRsbGFtYUBnb29nbGUuY29tPlxuICovXG5cblxuXG5cbi8vIEludGVybmFsIGRlcGVuZGVuY2llcy5cbmNvbnN0IERpcmVjdGl2aXR5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcbmNvbnN0IEF0dGVudWF0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcbmNvbnN0IEVuY29kZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuY29uc3QgVXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKlxuICogQGNsYXNzIFNvdXJjZVxuICogQGRlc2NyaXB0aW9uIFNvdXJjZSBtb2RlbCB0byBzcGF0aWFsaXplIGFuIGF1ZGlvIGJ1ZmZlci5cbiAqIEBwYXJhbSB7UmVzb25hbmNlQXVkaW99IHNjZW5lIEFzc29jaWF0ZWQge0BsaW5rIFJlc29uYW5jZUF1ZGlvXG4gKiBSZXNvbmFuY2VBdWRpb30gaW5zdGFuY2UuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IG9wdGlvbnMucG9zaXRpb25cbiAqIFRoZSBzb3VyY2UncyBpbml0aWFsIHBvc2l0aW9uIChpbiBtZXRlcnMpLCB3aGVyZSBvcmlnaW4gaXMgdGhlIGNlbnRlciBvZlxuICogdGhlIHJvb20uIERlZmF1bHRzIHRvIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9QT1NJVElPTiBERUZBVUxUX1BPU0lUSU9OfS5cbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBvcHRpb25zLmZvcndhcmRcbiAqIFRoZSBzb3VyY2UncyBpbml0aWFsIGZvcndhcmQgdmVjdG9yLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX0ZPUldBUkQgREVGQVVMVF9GT1JXQVJEfS5cbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBvcHRpb25zLnVwXG4gKiBUaGUgc291cmNlJ3MgaW5pdGlhbCB1cCB2ZWN0b3IuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfVVAgREVGQVVMVF9VUH0uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5taW5EaXN0YW5jZVxuICogTWluLiBkaXN0YW5jZSAoaW4gbWV0ZXJzKS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9NSU5fRElTVEFOQ0UgREVGQVVMVF9NSU5fRElTVEFOQ0V9LlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubWF4RGlzdGFuY2VcbiAqIE1heC4gZGlzdGFuY2UgKGluIG1ldGVycykuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfTUFYX0RJU1RBTkNFIERFRkFVTFRfTUFYX0RJU1RBTkNFfS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLnJvbGxvZmZcbiAqIFJvbGxvZmYgbW9kZWwgdG8gdXNlLCBjaG9zZW4gZnJvbSBvcHRpb25zIGluXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkFUVEVOVUFUSU9OX1JPTExPRkZTIEFUVEVOVUFUSU9OX1JPTExPRkZTfS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9BVFRFTlVBVElPTl9ST0xMT0ZGIERFRkFVTFRfQVRURU5VQVRJT05fUk9MTE9GRn0uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5nYWluIElucHV0IGdhaW4gKGxpbmVhcikuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfU09VUkNFX0dBSU4gREVGQVVMVF9TT1VSQ0VfR0FJTn0uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5hbHBoYSBEaXJlY3Rpdml0eSBhbHBoYS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9ESVJFQ1RJVklUWV9BTFBIQSBERUZBVUxUX0RJUkVDVElWSVRZX0FMUEhBfS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnNoYXJwbmVzcyBEaXJlY3Rpdml0eSBzaGFycG5lc3MuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfRElSRUNUSVZJVFlfU0hBUlBORVNTXG4gKiBERUZBVUxUX0RJUkVDVElWSVRZX1NIQVJQTkVTU30uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5zb3VyY2VXaWR0aFxuICogU291cmNlIHdpZHRoIChpbiBkZWdyZWVzKS4gV2hlcmUgMCBkZWdyZWVzIGlzIGEgcG9pbnQgc291cmNlIGFuZCAzNjAgZGVncmVlc1xuICogaXMgYW4gb21uaWRpcmVjdGlvbmFsIHNvdXJjZS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9TT1VSQ0VfV0lEVEggREVGQVVMVF9TT1VSQ0VfV0lEVEh9LlxuICovXG5mdW5jdGlvbiBTb3VyY2Uoc2NlbmUsIG9wdGlvbnMpIHtcbiAgLy8gUHVibGljIHZhcmlhYmxlcy5cbiAgLyoqXG4gICAqIE1vbm8gKDEtY2hhbm5lbCkgaW5wdXQge0BsaW5rXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb05vZGUgQXVkaW9Ob2RlfS5cbiAgICogQG1lbWJlciB7QXVkaW9Ob2RlfSBpbnB1dFxuICAgKiBAbWVtYmVyb2YgU291cmNlXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgLyoqXG4gICAqXG4gICAqL1xuXG4gIC8vIFVzZSBkZWZhdWx0cyBmb3IgdW5kZWZpbmVkIGFyZ3VtZW50cy5cbiAgaWYgKG9wdGlvbnMgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmIChvcHRpb25zLnBvc2l0aW9uID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMucG9zaXRpb24gPSBVdGlscy5ERUZBVUxUX1BPU0lUSU9OLnNsaWNlKCk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuZm9yd2FyZCA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLmZvcndhcmQgPSBVdGlscy5ERUZBVUxUX0ZPUldBUkQuc2xpY2UoKTtcbiAgfVxuICBpZiAob3B0aW9ucy51cCA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLnVwID0gVXRpbHMuREVGQVVMVF9VUC5zbGljZSgpO1xuICB9XG4gIGlmIChvcHRpb25zLm1pbkRpc3RhbmNlID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMubWluRGlzdGFuY2UgPSBVdGlscy5ERUZBVUxUX01JTl9ESVNUQU5DRTtcbiAgfVxuICBpZiAob3B0aW9ucy5tYXhEaXN0YW5jZSA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLm1heERpc3RhbmNlID0gVXRpbHMuREVGQVVMVF9NQVhfRElTVEFOQ0U7XG4gIH1cbiAgaWYgKG9wdGlvbnMucm9sbG9mZiA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLnJvbGxvZmYgPSBVdGlscy5ERUZBVUxUX1JPTExPRkY7XG4gIH1cbiAgaWYgKG9wdGlvbnMuZ2FpbiA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLmdhaW4gPSBVdGlscy5ERUZBVUxUX1NPVVJDRV9HQUlOO1xuICB9XG4gIGlmIChvcHRpb25zLmFscGhhID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMuYWxwaGEgPSBVdGlscy5ERUZBVUxUX0RJUkVDVElWSVRZX0FMUEhBO1xuICB9XG4gIGlmIChvcHRpb25zLnNoYXJwbmVzcyA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLnNoYXJwbmVzcyA9IFV0aWxzLkRFRkFVTFRfRElSRUNUSVZJVFlfU0hBUlBORVNTO1xuICB9XG4gIGlmIChvcHRpb25zLnNvdXJjZVdpZHRoID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMuc291cmNlV2lkdGggPSBVdGlscy5ERUZBVUxUX1NPVVJDRV9XSURUSDtcbiAgfVxuXG4gIC8vIE1lbWJlciB2YXJpYWJsZXMuXG4gIHRoaXMuX3NjZW5lID0gc2NlbmU7XG4gIHRoaXMuX3Bvc2l0aW9uID0gb3B0aW9ucy5wb3NpdGlvbjtcbiAgdGhpcy5fZm9yd2FyZCA9IG9wdGlvbnMuZm9yd2FyZDtcbiAgdGhpcy5fdXAgPSBvcHRpb25zLnVwO1xuICB0aGlzLl9keCA9IG5ldyBGbG9hdDMyQXJyYXkoMyk7XG4gIHRoaXMuX3JpZ2h0ID0gVXRpbHMuY3Jvc3NQcm9kdWN0KHRoaXMuX2ZvcndhcmQsIHRoaXMuX3VwKTtcblxuICAvLyBDcmVhdGUgYXVkaW8gbm9kZXMuXG4gIGxldCBjb250ZXh0ID0gc2NlbmUuX2NvbnRleHQ7XG4gIHRoaXMuaW5wdXQgPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fZGlyZWN0aXZpdHkgPSBuZXcgRGlyZWN0aXZpdHkoY29udGV4dCwge1xuICAgIGFscGhhOiBvcHRpb25zLmFscGhhLFxuICAgIHNoYXJwbmVzczogb3B0aW9ucy5zaGFycG5lc3MsXG4gIH0pO1xuICB0aGlzLl90b0Vhcmx5ID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX3RvTGF0ZSA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9hdHRlbnVhdGlvbiA9IG5ldyBBdHRlbnVhdGlvbihjb250ZXh0LCB7XG4gICAgbWluRGlzdGFuY2U6IG9wdGlvbnMubWluRGlzdGFuY2UsXG4gICAgbWF4RGlzdGFuY2U6IG9wdGlvbnMubWF4RGlzdGFuY2UsXG4gICAgcm9sbG9mZjogb3B0aW9ucy5yb2xsb2ZmLFxuICB9KTtcbiAgdGhpcy5fZW5jb2RlciA9IG5ldyBFbmNvZGVyKGNvbnRleHQsIHtcbiAgICBhbWJpc29uaWNPcmRlcjogc2NlbmUuX2FtYmlzb25pY09yZGVyLFxuICAgIHNvdXJjZVdpZHRoOiBvcHRpb25zLnNvdXJjZVdpZHRoLFxuICB9KTtcblxuICAvLyBDb25uZWN0IG5vZGVzLlxuICB0aGlzLmlucHV0LmNvbm5lY3QodGhpcy5fdG9MYXRlKTtcbiAgdGhpcy5fdG9MYXRlLmNvbm5lY3Qoc2NlbmUuX3Jvb20ubGF0ZS5pbnB1dCk7XG5cbiAgdGhpcy5pbnB1dC5jb25uZWN0KHRoaXMuX2F0dGVudWF0aW9uLmlucHV0KTtcbiAgdGhpcy5fYXR0ZW51YXRpb24ub3V0cHV0LmNvbm5lY3QodGhpcy5fdG9FYXJseSk7XG4gIHRoaXMuX3RvRWFybHkuY29ubmVjdChzY2VuZS5fcm9vbS5lYXJseS5pbnB1dCk7XG5cbiAgdGhpcy5fYXR0ZW51YXRpb24ub3V0cHV0LmNvbm5lY3QodGhpcy5fZGlyZWN0aXZpdHkuaW5wdXQpO1xuICB0aGlzLl9kaXJlY3Rpdml0eS5vdXRwdXQuY29ubmVjdCh0aGlzLl9lbmNvZGVyLmlucHV0KTtcblxuICB0aGlzLl9lbmNvZGVyLm91dHB1dC5jb25uZWN0KHNjZW5lLl9saXN0ZW5lci5pbnB1dCk7XG5cbiAgLy8gQXNzaWduIGluaXRpYWwgY29uZGl0aW9ucy5cbiAgdGhpcy5zZXRQb3NpdGlvbihcbiAgICBvcHRpb25zLnBvc2l0aW9uWzBdLCBvcHRpb25zLnBvc2l0aW9uWzFdLCBvcHRpb25zLnBvc2l0aW9uWzJdKTtcbiAgdGhpcy5pbnB1dC5nYWluLnZhbHVlID0gb3B0aW9ucy5nYWluO1xufTtcblxuXG4vKipcbiAqIFNldCBzb3VyY2UncyBwb3NpdGlvbiAoaW4gbWV0ZXJzKSwgd2hlcmUgb3JpZ2luIGlzIHRoZSBjZW50ZXIgb2ZcbiAqIHRoZSByb29tLlxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcGFyYW0ge051bWJlcn0gelxuICovXG5Tb3VyY2UucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24oeCwgeSwgeikge1xuICAvLyBBc3NpZ24gbmV3IHBvc2l0aW9uLlxuICB0aGlzLl9wb3NpdGlvblswXSA9IHg7XG4gIHRoaXMuX3Bvc2l0aW9uWzFdID0geTtcbiAgdGhpcy5fcG9zaXRpb25bMl0gPSB6O1xuXG4gIC8vIEhhbmRsZSBmYXItZmllbGQgZWZmZWN0LlxuICBsZXQgZGlzdGFuY2UgPSB0aGlzLl9zY2VuZS5fcm9vbS5nZXREaXN0YW5jZU91dHNpZGVSb29tKFxuICAgIHRoaXMuX3Bvc2l0aW9uWzBdLCB0aGlzLl9wb3NpdGlvblsxXSwgdGhpcy5fcG9zaXRpb25bMl0pO1xuICAgIGxldCBnYWluID0gX2NvbXB1dGVEaXN0YW5jZU91dHNpZGVSb29tKGRpc3RhbmNlKTtcbiAgdGhpcy5fdG9MYXRlLmdhaW4udmFsdWUgPSBnYWluO1xuICB0aGlzLl90b0Vhcmx5LmdhaW4udmFsdWUgPSBnYWluO1xuXG4gIHRoaXMuX3VwZGF0ZSgpO1xufTtcblxuXG4vLyBVcGRhdGUgdGhlIHNvdXJjZSB3aGVuIGNoYW5naW5nIHRoZSBsaXN0ZW5lcidzIHBvc2l0aW9uLlxuU291cmNlLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIC8vIENvbXB1dGUgZGlzdGFuY2UgdG8gbGlzdGVuZXIuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgdGhpcy5fZHhbaV0gPSB0aGlzLl9wb3NpdGlvbltpXSAtIHRoaXMuX3NjZW5lLl9saXN0ZW5lci5wb3NpdGlvbltpXTtcbiAgfVxuICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQodGhpcy5fZHhbMF0gKiB0aGlzLl9keFswXSArXG4gICAgdGhpcy5fZHhbMV0gKiB0aGlzLl9keFsxXSArIHRoaXMuX2R4WzJdICogdGhpcy5fZHhbMl0pO1xuICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgLy8gTm9ybWFsaXplIGRpcmVjdGlvbiB2ZWN0b3IuXG4gICAgdGhpcy5fZHhbMF0gLz0gZGlzdGFuY2U7XG4gICAgdGhpcy5fZHhbMV0gLz0gZGlzdGFuY2U7XG4gICAgdGhpcy5fZHhbMl0gLz0gZGlzdGFuY2U7XG4gIH1cblxuICAvLyBDb21wdWV0ZSBhbmdsZSBvZiBkaXJlY3Rpb24gdmVjdG9yLlxuICBsZXQgYXppbXV0aCA9IE1hdGguYXRhbjIoLXRoaXMuX2R4WzBdLCB0aGlzLl9keFsyXSkgKlxuICAgIFV0aWxzLlJBRElBTlNfVE9fREVHUkVFUztcbiAgbGV0IGVsZXZhdGlvbiA9IE1hdGguYXRhbjIodGhpcy5fZHhbMV0sIE1hdGguc3FydCh0aGlzLl9keFswXSAqIHRoaXMuX2R4WzBdICtcbiAgICB0aGlzLl9keFsyXSAqIHRoaXMuX2R4WzJdKSkgKiBVdGlscy5SQURJQU5TX1RPX0RFR1JFRVM7XG5cbiAgLy8gU2V0IGRpc3RhbmNlL2RpcmVjdGl2aXR5L2RpcmVjdGlvbiB2YWx1ZXMuXG4gIHRoaXMuX2F0dGVudWF0aW9uLnNldERpc3RhbmNlKGRpc3RhbmNlKTtcbiAgdGhpcy5fZGlyZWN0aXZpdHkuY29tcHV0ZUFuZ2xlKHRoaXMuX2ZvcndhcmQsIHRoaXMuX2R4KTtcbiAgdGhpcy5fZW5jb2Rlci5zZXREaXJlY3Rpb24oYXppbXV0aCwgZWxldmF0aW9uKTtcbn07XG5cblxuLyoqXG4gKiBTZXQgc291cmNlJ3Mgcm9sbG9mZi5cbiAqIEBwYXJhbSB7c3RyaW5nfSByb2xsb2ZmXG4gKiBSb2xsb2ZmIG1vZGVsIHRvIHVzZSwgY2hvc2VuIGZyb20gb3B0aW9ucyBpblxuICoge0BsaW5rY29kZSBVdGlscy5BVFRFTlVBVElPTl9ST0xMT0ZGUyBBVFRFTlVBVElPTl9ST0xMT0ZGU30uXG4gKi9cblNvdXJjZS5wcm90b3R5cGUuc2V0Um9sbG9mZiA9IGZ1bmN0aW9uKHJvbGxvZmYpIHtcbiAgdGhpcy5fYXR0ZW51YXRpb24uc2V0Um9sbG9mZihyb2xsb2ZmKTtcbn07XG5cblxuLyoqXG4gKiBTZXQgc291cmNlJ3MgbWluaW11bSBkaXN0YW5jZSAoaW4gbWV0ZXJzKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBtaW5EaXN0YW5jZVxuICovXG5Tb3VyY2UucHJvdG90eXBlLnNldE1pbkRpc3RhbmNlID0gZnVuY3Rpb24obWluRGlzdGFuY2UpIHtcbiAgdGhpcy5fYXR0ZW51YXRpb24ubWluRGlzdGFuY2UgPSBtaW5EaXN0YW5jZTtcbn07XG5cblxuLyoqXG4gKiBTZXQgc291cmNlJ3MgbWF4aW11bSBkaXN0YW5jZSAoaW4gbWV0ZXJzKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBtYXhEaXN0YW5jZVxuICovXG5Tb3VyY2UucHJvdG90eXBlLnNldE1heERpc3RhbmNlID0gZnVuY3Rpb24obWF4RGlzdGFuY2UpIHtcbiAgdGhpcy5fYXR0ZW51YXRpb24ubWF4RGlzdGFuY2UgPSBtYXhEaXN0YW5jZTtcbn07XG5cblxuLyoqXG4gKiBTZXQgc291cmNlJ3MgZ2FpbiAobGluZWFyKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBnYWluXG4gKi9cblNvdXJjZS5wcm90b3R5cGUuc2V0R2FpbiA9IGZ1bmN0aW9uKGdhaW4pIHtcbiAgdGhpcy5pbnB1dC5nYWluLnZhbHVlID0gZ2Fpbjtcbn07XG5cblxuLyoqXG4gKiBTZXQgdGhlIHNvdXJjZSdzIG9yaWVudGF0aW9uIHVzaW5nIGZvcndhcmQgYW5kIHVwIHZlY3RvcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gZm9yd2FyZFhcbiAqIEBwYXJhbSB7TnVtYmVyfSBmb3J3YXJkWVxuICogQHBhcmFtIHtOdW1iZXJ9IGZvcndhcmRaXG4gKiBAcGFyYW0ge051bWJlcn0gdXBYXG4gKiBAcGFyYW0ge051bWJlcn0gdXBZXG4gKiBAcGFyYW0ge051bWJlcn0gdXBaXG4gKi9cblNvdXJjZS5wcm90b3R5cGUuc2V0T3JpZW50YXRpb24gPSBmdW5jdGlvbihmb3J3YXJkWCwgZm9yd2FyZFksIGZvcndhcmRaLFxuICAgIHVwWCwgdXBZLCB1cFopIHtcbiAgdGhpcy5fZm9yd2FyZFswXSA9IGZvcndhcmRYO1xuICB0aGlzLl9mb3J3YXJkWzFdID0gZm9yd2FyZFk7XG4gIHRoaXMuX2ZvcndhcmRbMl0gPSBmb3J3YXJkWjtcbiAgdGhpcy5fdXBbMF0gPSB1cFg7XG4gIHRoaXMuX3VwWzFdID0gdXBZO1xuICB0aGlzLl91cFsyXSA9IHVwWjtcbiAgdGhpcy5fcmlnaHQgPSBVdGlscy5jcm9zc1Byb2R1Y3QodGhpcy5fZm9yd2FyZCwgdGhpcy5fdXApO1xufTtcblxuXG4vLyBUT0RPKGJpdGxsYW1hKTogTWFrZSBzdXJlIHRoaXMgd29ya3Mgd2l0aCBUaHJlZS5qcyBhcyBpbnRlbmRlZC5cbi8qKlxuICogU2V0IHNvdXJjZSdzIHBvc2l0aW9uIGFuZCBvcmllbnRhdGlvbiB1c2luZyBhXG4gKiBUaHJlZS5qcyBtb2RlbFZpZXdNYXRyaXggb2JqZWN0LlxuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IG1hdHJpeDRcbiAqIFRoZSBNYXRyaXg0IHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IHBvc2l0aW9uIGFuZCByb3RhdGlvbiBpbiB3b3JsZCBzcGFjZS5cbiAqL1xuU291cmNlLnByb3RvdHlwZS5zZXRGcm9tTWF0cml4ID0gZnVuY3Rpb24obWF0cml4NCkge1xuICB0aGlzLl9yaWdodFswXSA9IG1hdHJpeDQuZWxlbWVudHNbMF07XG4gIHRoaXMuX3JpZ2h0WzFdID0gbWF0cml4NC5lbGVtZW50c1sxXTtcbiAgdGhpcy5fcmlnaHRbMl0gPSBtYXRyaXg0LmVsZW1lbnRzWzJdO1xuICB0aGlzLl91cFswXSA9IG1hdHJpeDQuZWxlbWVudHNbNF07XG4gIHRoaXMuX3VwWzFdID0gbWF0cml4NC5lbGVtZW50c1s1XTtcbiAgdGhpcy5fdXBbMl0gPSBtYXRyaXg0LmVsZW1lbnRzWzZdO1xuICB0aGlzLl9mb3J3YXJkWzBdID0gbWF0cml4NC5lbGVtZW50c1s4XTtcbiAgdGhpcy5fZm9yd2FyZFsxXSA9IG1hdHJpeDQuZWxlbWVudHNbOV07XG4gIHRoaXMuX2ZvcndhcmRbMl0gPSBtYXRyaXg0LmVsZW1lbnRzWzEwXTtcblxuICAvLyBOb3JtYWxpemUgdG8gcmVtb3ZlIHNjYWxpbmcuXG4gIHRoaXMuX3JpZ2h0ID0gVXRpbHMubm9ybWFsaXplVmVjdG9yKHRoaXMuX3JpZ2h0KTtcbiAgdGhpcy5fdXAgPSBVdGlscy5ub3JtYWxpemVWZWN0b3IodGhpcy5fdXApO1xuICB0aGlzLl9mb3J3YXJkID0gVXRpbHMubm9ybWFsaXplVmVjdG9yKHRoaXMuX2ZvcndhcmQpO1xuXG4gIC8vIFVwZGF0ZSBwb3NpdGlvbi5cbiAgdGhpcy5zZXRQb3NpdGlvbihcbiAgICBtYXRyaXg0LmVsZW1lbnRzWzEyXSwgbWF0cml4NC5lbGVtZW50c1sxM10sIG1hdHJpeDQuZWxlbWVudHNbMTRdKTtcbn07XG5cblxuLyoqXG4gKiBTZXQgdGhlIHNvdXJjZSB3aWR0aCAoaW4gZGVncmVlcykuIFdoZXJlIDAgZGVncmVlcyBpcyBhIHBvaW50IHNvdXJjZSBhbmQgMzYwXG4gKiBkZWdyZWVzIGlzIGFuIG9tbmlkaXJlY3Rpb25hbCBzb3VyY2UuXG4gKiBAcGFyYW0ge051bWJlcn0gc291cmNlV2lkdGggKGluIGRlZ3JlZXMpLlxuICovXG5Tb3VyY2UucHJvdG90eXBlLnNldFNvdXJjZVdpZHRoID0gZnVuY3Rpb24oc291cmNlV2lkdGgpIHtcbiAgdGhpcy5fZW5jb2Rlci5zZXRTb3VyY2VXaWR0aChzb3VyY2VXaWR0aCk7XG4gIHRoaXMuc2V0UG9zaXRpb24odGhpcy5fcG9zaXRpb25bMF0sIHRoaXMuX3Bvc2l0aW9uWzFdLCB0aGlzLl9wb3NpdGlvblsyXSk7XG59O1xuXG5cbi8qKlxuICogU2V0IHNvdXJjZSdzIGRpcmVjdGl2aXR5IHBhdHRlcm4gKGRlZmluZWQgYnkgYWxwaGEpLCB3aGVyZSAwIGlzIGFuXG4gKiBvbW5pZGlyZWN0aW9uYWwgcGF0dGVybiwgMSBpcyBhIGJpZGlyZWN0aW9uYWwgcGF0dGVybiwgMC41IGlzIGEgY2FyZGlvZFxuICogcGF0dGVybi4gVGhlIHNoYXJwbmVzcyBvZiB0aGUgcGF0dGVybiBpcyBpbmNyZWFzZWQgZXhwb25lbnRpYWxseS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBhbHBoYVxuICogRGV0ZXJtaW5lcyBkaXJlY3Rpdml0eSBwYXR0ZXJuICgwIHRvIDEpLlxuICogQHBhcmFtIHtOdW1iZXJ9IHNoYXJwbmVzc1xuICogRGV0ZXJtaW5lcyB0aGUgc2hhcnBuZXNzIG9mIHRoZSBkaXJlY3Rpdml0eSBwYXR0ZXJuICgxIHRvIEluZikuXG4gKi9cblNvdXJjZS5wcm90b3R5cGUuc2V0RGlyZWN0aXZpdHlQYXR0ZXJuID0gZnVuY3Rpb24oYWxwaGEsIHNoYXJwbmVzcykge1xuICB0aGlzLl9kaXJlY3Rpdml0eS5zZXRQYXR0ZXJuKGFscGhhLCBzaGFycG5lc3MpO1xuICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuX3Bvc2l0aW9uWzBdLCB0aGlzLl9wb3NpdGlvblsxXSwgdGhpcy5fcG9zaXRpb25bMl0pO1xufTtcblxuXG4vKipcbiAqIERldGVybWluZSB0aGUgZGlzdGFuY2UgYSBzb3VyY2UgaXMgb3V0c2lkZSBvZiBhIHJvb20uIEF0dGVudWF0ZSBnYWluIGdvaW5nXG4gKiB0byB0aGUgcmVmbGVjdGlvbnMgYW5kIHJldmVyYiB3aGVuIHRoZSBzb3VyY2UgaXMgb3V0c2lkZSBvZiB0aGUgcm9vbS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSBEaXN0YW5jZSBpbiBtZXRlcnMuXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEdhaW4gKGxpbmVhcikgb2Ygc291cmNlLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2NvbXB1dGVEaXN0YW5jZU91dHNpZGVSb29tKGRpc3RhbmNlKSB7XG4gIC8vIFdlIGFwcGx5IGEgbGluZWFyIHJhbXAgZnJvbSAxIHRvIDAgYXMgdGhlIHNvdXJjZSBpcyB1cCB0byAxbSBvdXRzaWRlLlxuICBsZXQgZ2FpbiA9IDE7XG4gIGlmIChkaXN0YW5jZSA+IFV0aWxzLkVQU0lMT05fRkxPQVQpIHtcbiAgICBnYWluID0gMSAtIGRpc3RhbmNlIC8gVXRpbHMuU09VUkNFX01BWF9PVVRTSURFX1JPT01fRElTVEFOQ0U7XG5cbiAgICAvLyBDbGFtcCBnYWluIGJldHdlZW4gMCBhbmQgMS5cbiAgICBnYWluID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgZ2FpbikpO1xuICB9XG4gIHJldHVybiBnYWluO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU291cmNlO1xuXG5cbi8qKiovIH0pLFxuLyogNSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZSBEaXJlY3Rpdml0eS9vY2NsdXNpb24gZmlsdGVyLlxuICogQGF1dGhvciBBbmRyZXcgQWxsZW4gPGJpdGxsYW1hQGdvb2dsZS5jb20+XG4gKi9cblxuXG5cbi8vIEludGVybmFsIGRlcGVuZGVuY2llcy5cbmNvbnN0IFV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKipcbiAqIEBjbGFzcyBEaXJlY3Rpdml0eVxuICogQGRlc2NyaXB0aW9uIERpcmVjdGl2aXR5L29jY2x1c2lvbiBmaWx0ZXIuXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY29udGV4dFxuICogQXNzb2NpYXRlZCB7QGxpbmtcbmh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb0NvbnRleHQgQXVkaW9Db250ZXh0fS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5hbHBoYVxuICogRGV0ZXJtaW5lcyBkaXJlY3Rpdml0eSBwYXR0ZXJuICgwIHRvIDEpLiBTZWVcbiAqIHtAbGluayBEaXJlY3Rpdml0eSNzZXRQYXR0ZXJuIHNldFBhdHRlcm59IGZvciBtb3JlIGRldGFpbHMuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfRElSRUNUSVZJVFlfQUxQSEEgREVGQVVMVF9ESVJFQ1RJVklUWV9BTFBIQX0uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5zaGFycG5lc3NcbiAqIERldGVybWluZXMgdGhlIHNoYXJwbmVzcyBvZiB0aGUgZGlyZWN0aXZpdHkgcGF0dGVybiAoMSB0byBJbmYpLiBTZWVcbiAqIHtAbGluayBEaXJlY3Rpdml0eSNzZXRQYXR0ZXJuIHNldFBhdHRlcm59IGZvciBtb3JlIGRldGFpbHMuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfRElSRUNUSVZJVFlfU0hBUlBORVNTXG4gKiBERUZBVUxUX0RJUkVDVElWSVRZX1NIQVJQTkVTU30uXG4gKi9cbmZ1bmN0aW9uIERpcmVjdGl2aXR5KGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgLy8gUHVibGljIHZhcmlhYmxlcy5cbiAgLyoqXG4gICAqIE1vbm8gKDEtY2hhbm5lbCkgaW5wdXQge0BsaW5rXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb05vZGUgQXVkaW9Ob2RlfS5cbiAgICogQG1lbWJlciB7QXVkaW9Ob2RlfSBpbnB1dFxuICAgKiBAbWVtYmVyb2YgRGlyZWN0aXZpdHlcbiAgICogQGluc3RhbmNlXG4gICAqL1xuICAvKipcbiAgICogTW9ubyAoMS1jaGFubmVsKSBvdXRwdXQge0BsaW5rXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb05vZGUgQXVkaW9Ob2RlfS5cbiAgICogQG1lbWJlciB7QXVkaW9Ob2RlfSBvdXRwdXRcbiAgICogQG1lbWJlcm9mIERpcmVjdGl2aXR5XG4gICAqIEBpbnN0YW5jZVxuICAgKi9cblxuICAvLyBVc2UgZGVmYXVsdHMgZm9yIHVuZGVmaW5lZCBhcmd1bWVudHMuXG4gIGlmIChvcHRpb25zID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAob3B0aW9ucy5hbHBoYSA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLmFscGhhID0gVXRpbHMuREVGQVVMVF9ESVJFQ1RJVklUWV9BTFBIQTtcbiAgfVxuICBpZiAob3B0aW9ucy5zaGFycG5lc3MgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5zaGFycG5lc3MgPSBVdGlscy5ERUZBVUxUX0RJUkVDVElWSVRZX1NIQVJQTkVTUztcbiAgfVxuXG4gIC8vIENyZWF0ZSBhdWRpbyBub2RlLlxuICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5fbG93cGFzcyA9IGNvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBmaWx0ZXIgY29lZmZpY2llbnRzLlxuICB0aGlzLl9sb3dwYXNzLnR5cGUgPSAnbG93cGFzcyc7XG4gIHRoaXMuX2xvd3Bhc3MuUS52YWx1ZSA9IDA7XG4gIHRoaXMuX2xvd3Bhc3MuZnJlcXVlbmN5LnZhbHVlID0gY29udGV4dC5zYW1wbGVSYXRlICogMC41O1xuXG4gIHRoaXMuX2Nvc1RoZXRhID0gMDtcbiAgdGhpcy5zZXRQYXR0ZXJuKG9wdGlvbnMuYWxwaGEsIG9wdGlvbnMuc2hhcnBuZXNzKTtcblxuICAvLyBJbnB1dC9PdXRwdXQgcHJveHkuXG4gIHRoaXMuaW5wdXQgPSB0aGlzLl9sb3dwYXNzO1xuICB0aGlzLm91dHB1dCA9IHRoaXMuX2xvd3Bhc3M7XG59XG5cblxuLyoqXG4gKiBDb21wdXRlIHRoZSBmaWx0ZXIgdXNpbmcgdGhlIHNvdXJjZSdzIGZvcndhcmQgb3JpZW50YXRpb24gYW5kIHRoZSBsaXN0ZW5lcidzXG4gKiBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBmb3J3YXJkIFRoZSBzb3VyY2UncyBmb3J3YXJkIHZlY3Rvci5cbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBkaXJlY3Rpb24gVGhlIGRpcmVjdGlvbiBmcm9tIHRoZSBzb3VyY2UgdG8gdGhlXG4gKiBsaXN0ZW5lci5cbiAqL1xuRGlyZWN0aXZpdHkucHJvdG90eXBlLmNvbXB1dGVBbmdsZSA9IGZ1bmN0aW9uKGZvcndhcmQsIGRpcmVjdGlvbikge1xuICBsZXQgZm9yd2FyZE5vcm0gPSBVdGlscy5ub3JtYWxpemVWZWN0b3IoZm9yd2FyZCk7XG4gIGxldCBkaXJlY3Rpb25Ob3JtID0gVXRpbHMubm9ybWFsaXplVmVjdG9yKGRpcmVjdGlvbik7XG4gIGxldCBjb2VmZiA9IDE7XG4gIGlmICh0aGlzLl9hbHBoYSA+IFV0aWxzLkVQU0lMT05fRkxPQVQpIHtcbiAgICBsZXQgY29zVGhldGEgPSBmb3J3YXJkTm9ybVswXSAqIGRpcmVjdGlvbk5vcm1bMF0gK1xuICAgICAgZm9yd2FyZE5vcm1bMV0gKiBkaXJlY3Rpb25Ob3JtWzFdICsgZm9yd2FyZE5vcm1bMl0gKiBkaXJlY3Rpb25Ob3JtWzJdO1xuICAgIGNvZWZmID0gKDEgLSB0aGlzLl9hbHBoYSkgKyB0aGlzLl9hbHBoYSAqIGNvc1RoZXRhO1xuICAgIGNvZWZmID0gTWF0aC5wb3coTWF0aC5hYnMoY29lZmYpLCB0aGlzLl9zaGFycG5lc3MpO1xuICB9XG4gIHRoaXMuX2xvd3Bhc3MuZnJlcXVlbmN5LnZhbHVlID0gdGhpcy5fY29udGV4dC5zYW1wbGVSYXRlICogMC41ICogY29lZmY7XG59O1xuXG5cbi8qKlxuICogU2V0IHNvdXJjZSdzIGRpcmVjdGl2aXR5IHBhdHRlcm4gKGRlZmluZWQgYnkgYWxwaGEpLCB3aGVyZSAwIGlzIGFuXG4gKiBvbW5pZGlyZWN0aW9uYWwgcGF0dGVybiwgMSBpcyBhIGJpZGlyZWN0aW9uYWwgcGF0dGVybiwgMC41IGlzIGEgY2FyZGlvZFxuICogcGF0dGVybi4gVGhlIHNoYXJwbmVzcyBvZiB0aGUgcGF0dGVybiBpcyBpbmNyZWFzZWQgZXhwb25lbmVudGlhbGx5LlxuICogQHBhcmFtIHtOdW1iZXJ9IGFscGhhXG4gKiBEZXRlcm1pbmVzIGRpcmVjdGl2aXR5IHBhdHRlcm4gKDAgdG8gMSkuXG4gKiBAcGFyYW0ge051bWJlcn0gc2hhcnBuZXNzXG4gKiBEZXRlcm1pbmVzIHRoZSBzaGFycG5lc3Mgb2YgdGhlIGRpcmVjdGl2aXR5IHBhdHRlcm4gKDEgdG8gSW5mKS5cbiAqIERFRkFVTFRfRElSRUNUSVZJVFlfU0hBUlBORVNTfS5cbiAqL1xuRGlyZWN0aXZpdHkucHJvdG90eXBlLnNldFBhdHRlcm4gPSBmdW5jdGlvbihhbHBoYSwgc2hhcnBuZXNzKSB7XG4gIC8vIENsYW1wIGFuZCBzZXQgdmFsdWVzLlxuICB0aGlzLl9hbHBoYSA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIGFscGhhKSk7XG4gIHRoaXMuX3NoYXJwbmVzcyA9IE1hdGgubWF4KDEsIHNoYXJwbmVzcyk7XG5cbiAgLy8gVXBkYXRlIGFuZ2xlIGNhbGN1bGF0aW9uIHVzaW5nIG5ldyB2YWx1ZXMuXG4gIHRoaXMuY29tcHV0ZUFuZ2xlKFt0aGlzLl9jb3NUaGV0YSAqIHRoaXMuX2Nvc1RoZXRhLCAwLCAwXSwgWzEsIDAsIDBdKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3Rpdml0eTtcblxuXG4vKioqLyB9KSxcbi8qIDYgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGUgRGlzdGFuY2UtYmFzZWQgYXR0ZW51YXRpb24gZmlsdGVyLlxuICogQGF1dGhvciBBbmRyZXcgQWxsZW4gPGJpdGxsYW1hQGdvb2dsZS5jb20+XG4gKi9cblxuXG5cblxuLy8gSW50ZXJuYWwgZGVwZW5kZW5jaWVzLlxuY29uc3QgVXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKlxuICogQGNsYXNzIEF0dGVudWF0aW9uXG4gKiBAZGVzY3JpcHRpb24gRGlzdGFuY2UtYmFzZWQgYXR0ZW51YXRpb24gZmlsdGVyLlxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHRcbiAqIEFzc29jaWF0ZWQge0BsaW5rXG5odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Db250ZXh0IEF1ZGlvQ29udGV4dH0uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubWluRGlzdGFuY2VcbiAqIE1pbi4gZGlzdGFuY2UgKGluIG1ldGVycykuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfTUlOX0RJU1RBTkNFIERFRkFVTFRfTUlOX0RJU1RBTkNFfS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLm1heERpc3RhbmNlXG4gKiBNYXguIGRpc3RhbmNlIChpbiBtZXRlcnMpLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX01BWF9ESVNUQU5DRSBERUZBVUxUX01BWF9ESVNUQU5DRX0uXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5yb2xsb2ZmXG4gKiBSb2xsb2ZmIG1vZGVsIHRvIHVzZSwgY2hvc2VuIGZyb20gb3B0aW9ucyBpblxuICoge0BsaW5rY29kZSBVdGlscy5BVFRFTlVBVElPTl9ST0xMT0ZGUyBBVFRFTlVBVElPTl9ST0xMT0ZGU30uIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfQVRURU5VQVRJT05fUk9MTE9GRiBERUZBVUxUX0FUVEVOVUFUSU9OX1JPTExPRkZ9LlxuICovXG5mdW5jdGlvbiBBdHRlbnVhdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gIC8vIFB1YmxpYyB2YXJpYWJsZXMuXG4gIC8qKlxuICAgKiBNaW4uIGRpc3RhbmNlIChpbiBtZXRlcnMpLlxuICAgKiBAbWVtYmVyIHtOdW1iZXJ9IG1pbkRpc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBBdHRlbnVhdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIC8qKlxuICAgKiBNYXguIGRpc3RhbmNlIChpbiBtZXRlcnMpLlxuICAgKiBAbWVtYmVyIHtOdW1iZXJ9IG1heERpc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBBdHRlbnVhdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIC8qKlxuICAgKiBNb25vICgxLWNoYW5uZWwpIGlucHV0IHtAbGlua1xuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Ob2RlIEF1ZGlvTm9kZX0uXG4gICAqIEBtZW1iZXIge0F1ZGlvTm9kZX0gaW5wdXRcbiAgICogQG1lbWJlcm9mIEF0dGVudWF0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgLyoqXG4gICAqIE1vbm8gKDEtY2hhbm5lbCkgb3V0cHV0IHtAbGlua1xuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Ob2RlIEF1ZGlvTm9kZX0uXG4gICAqIEBtZW1iZXIge0F1ZGlvTm9kZX0gb3V0cHV0XG4gICAqIEBtZW1iZXJvZiBBdHRlbnVhdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICovXG5cbiAgLy8gVXNlIGRlZmF1bHRzIGZvciB1bmRlZmluZWQgYXJndW1lbnRzLlxuICBpZiAob3B0aW9ucyA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKG9wdGlvbnMubWluRGlzdGFuY2UgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5taW5EaXN0YW5jZSA9IFV0aWxzLkRFRkFVTFRfTUlOX0RJU1RBTkNFO1xuICB9XG4gIGlmIChvcHRpb25zLm1heERpc3RhbmNlID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMubWF4RGlzdGFuY2UgPSBVdGlscy5ERUZBVUxUX01BWF9ESVNUQU5DRTtcbiAgfVxuICBpZiAob3B0aW9ucy5yb2xsb2ZmID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMucm9sbG9mZiA9IFV0aWxzLkRFRkFVTFRfQVRURU5VQVRJT05fUk9MTE9GRjtcbiAgfVxuXG4gIC8vIEFzc2lnbiB2YWx1ZXMuXG4gIHRoaXMubWluRGlzdGFuY2UgPSBvcHRpb25zLm1pbkRpc3RhbmNlO1xuICB0aGlzLm1heERpc3RhbmNlID0gb3B0aW9ucy5tYXhEaXN0YW5jZTtcbiAgdGhpcy5zZXRSb2xsb2ZmKG9wdGlvbnMucm9sbG9mZik7XG5cbiAgLy8gQ3JlYXRlIG5vZGUuXG4gIHRoaXMuX2dhaW5Ob2RlID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBkaXN0YW5jZSB0byBtYXggZGlzdGFuY2UuXG4gIHRoaXMuc2V0RGlzdGFuY2Uob3B0aW9ucy5tYXhEaXN0YW5jZSk7XG5cbiAgLy8gSW5wdXQvT3V0cHV0IHByb3h5LlxuICB0aGlzLmlucHV0ID0gdGhpcy5fZ2Fpbk5vZGU7XG4gIHRoaXMub3V0cHV0ID0gdGhpcy5fZ2Fpbk5vZGU7XG59XG5cblxuLyoqXG4gKiBTZXQgZGlzdGFuY2UgZnJvbSB0aGUgbGlzdGVuZXIuXG4gKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgRGlzdGFuY2UgKGluIG1ldGVycykuXG4gKi9cbkF0dGVudWF0aW9uLnByb3RvdHlwZS5zZXREaXN0YW5jZSA9IGZ1bmN0aW9uKGRpc3RhbmNlKSB7XG4gIGxldCBnYWluID0gMTtcbiAgaWYgKHRoaXMuX3JvbGxvZmYgPT0gJ2xvZ2FyaXRobWljJykge1xuICAgIGlmIChkaXN0YW5jZSA+IHRoaXMubWF4RGlzdGFuY2UpIHtcbiAgICAgIGdhaW4gPSAwO1xuICAgIH0gZWxzZSBpZiAoZGlzdGFuY2UgPiB0aGlzLm1pbkRpc3RhbmNlKSB7XG4gICAgICBsZXQgcmFuZ2UgPSB0aGlzLm1heERpc3RhbmNlIC0gdGhpcy5taW5EaXN0YW5jZTtcbiAgICAgIGlmIChyYW5nZSA+IFV0aWxzLkVQU0lMT05fRkxPQVQpIHtcbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgZGlzdGFuY2UgYXR0ZW51YXRpb24gdmFsdWUgYnkgdGhlIGxvZ2FyaXRobWljIGN1cnZlXG4gICAgICAgIC8vIFwiMSAvIChkICsgMSlcIiB3aXRoIGFuIG9mZnNldCBvZiB8bWluRGlzdGFuY2V8LlxuICAgICAgICBsZXQgcmVsYXRpdmVEaXN0YW5jZSA9IGRpc3RhbmNlIC0gdGhpcy5taW5EaXN0YW5jZTtcbiAgICAgICAgbGV0IGF0dGVudWF0aW9uID0gMSAvIChyZWxhdGl2ZURpc3RhbmNlICsgMSk7XG4gICAgICAgIGxldCBhdHRlbnVhdGlvbk1heCA9IDEgLyAocmFuZ2UgKyAxKTtcbiAgICAgICAgZ2FpbiA9IChhdHRlbnVhdGlvbiAtIGF0dGVudWF0aW9uTWF4KSAvICgxIC0gYXR0ZW51YXRpb25NYXgpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0aGlzLl9yb2xsb2ZmID09ICdsaW5lYXInKSB7XG4gICAgaWYgKGRpc3RhbmNlID4gdGhpcy5tYXhEaXN0YW5jZSkge1xuICAgICAgZ2FpbiA9IDA7XG4gICAgfSBlbHNlIGlmIChkaXN0YW5jZSA+IHRoaXMubWluRGlzdGFuY2UpIHtcbiAgICAgIGxldCByYW5nZSA9IHRoaXMubWF4RGlzdGFuY2UgLSB0aGlzLm1pbkRpc3RhbmNlO1xuICAgICAgaWYgKHJhbmdlID4gVXRpbHMuRVBTSUxPTl9GTE9BVCkge1xuICAgICAgICBnYWluID0gKHRoaXMubWF4RGlzdGFuY2UgLSBkaXN0YW5jZSkgLyByYW5nZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhpcy5fZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IGdhaW47XG59O1xuXG5cbi8qKlxuICogU2V0IHJvbGxvZmYuXG4gKiBAcGFyYW0ge3N0cmluZ30gcm9sbG9mZlxuICogUm9sbG9mZiBtb2RlbCB0byB1c2UsIGNob3NlbiBmcm9tIG9wdGlvbnMgaW5cbiAqIHtAbGlua2NvZGUgVXRpbHMuQVRURU5VQVRJT05fUk9MTE9GRlMgQVRURU5VQVRJT05fUk9MTE9GRlN9LlxuICovXG5BdHRlbnVhdGlvbi5wcm90b3R5cGUuc2V0Um9sbG9mZiA9IGZ1bmN0aW9uKHJvbGxvZmYpIHtcbiAgbGV0IGlzVmFsaWRNb2RlbCA9IH5VdGlscy5BVFRFTlVBVElPTl9ST0xMT0ZGUy5pbmRleE9mKHJvbGxvZmYpO1xuICBpZiAocm9sbG9mZiA9PSB1bmRlZmluZWQgfHwgIWlzVmFsaWRNb2RlbCkge1xuICAgIGlmICghaXNWYWxpZE1vZGVsKSB7XG4gICAgICBVdGlscy5sb2coJ0ludmFsaWQgcm9sbG9mZiBtb2RlbCAoXFxcIicgKyByb2xsb2ZmICtcbiAgICAgICAgJ1xcXCIpLiBVc2luZyBkZWZhdWx0OiBcXFwiJyArIFV0aWxzLkRFRkFVTFRfQVRURU5VQVRJT05fUk9MTE9GRiArICdcXFwiLicpO1xuICAgIH1cbiAgICByb2xsb2ZmID0gVXRpbHMuREVGQVVMVF9BVFRFTlVBVElPTl9ST0xMT0ZGO1xuICB9IGVsc2Uge1xuICAgIHJvbGxvZmYgPSByb2xsb2ZmLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgfVxuICB0aGlzLl9yb2xsb2ZmID0gcm9sbG9mZjtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBBdHRlbnVhdGlvbjtcblxuXG4vKioqLyB9KSxcbi8qIDcgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGUgQ29tcGxldGUgcm9vbSBtb2RlbCB3aXRoIGVhcmx5IGFuZCBsYXRlIHJlZmxlY3Rpb25zLlxuICogQGF1dGhvciBBbmRyZXcgQWxsZW4gPGJpdGxsYW1hQGdvb2dsZS5jb20+XG4gKi9cblxuXG5cblxuLy8gSW50ZXJuYWwgZGVwZW5kZW5jaWVzLlxuY29uc3QgTGF0ZVJlZmxlY3Rpb25zID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4KTtcbmNvbnN0IEVhcmx5UmVmbGVjdGlvbnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDkpO1xuY29uc3QgVXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKlxuICogR2VuZXJhdGUgYWJzb3JwdGlvbiBjb2VmZmljaWVudHMgZnJvbSBtYXRlcmlhbCBuYW1lcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXRlcmlhbHNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gX2dldENvZWZmaWNpZW50c0Zyb21NYXRlcmlhbHMobWF0ZXJpYWxzKSB7XG4gIC8vIEluaXRpYWxpemUgY29lZmZpY2llbnRzIHRvIHVzZSBkZWZhdWx0cy5cbiAgbGV0IGNvZWZmaWNpZW50cyA9IHt9O1xuICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBVdGlscy5ERUZBVUxUX1JPT01fTUFURVJJQUxTKSB7XG4gICAgaWYgKFV0aWxzLkRFRkFVTFRfUk9PTV9NQVRFUklBTFMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICBjb2VmZmljaWVudHNbcHJvcGVydHldID0gVXRpbHMuUk9PTV9NQVRFUklBTF9DT0VGRklDSUVOVFNbXG4gICAgICAgIFV0aWxzLkRFRkFVTFRfUk9PTV9NQVRFUklBTFNbcHJvcGVydHldXTtcbiAgICB9XG4gIH1cblxuICAvLyBTYW5pdGl6ZSBtYXRlcmlhbHMuXG4gIGlmIChtYXRlcmlhbHMgPT0gdW5kZWZpbmVkKSB7XG4gICAgbWF0ZXJpYWxzID0ge307XG4gICAgT2JqZWN0LmFzc2lnbihtYXRlcmlhbHMsIFV0aWxzLkRFRkFVTFRfUk9PTV9NQVRFUklBTFMpO1xuICB9XG5cbiAgLy8gQXNzaWduIGNvZWZmaWNpZW50cyB1c2luZyBwcm92aWRlZCBtYXRlcmlhbHMuXG4gIGZvciAobGV0IHByb3BlcnR5IGluIFV0aWxzLkRFRkFVTFRfUk9PTV9NQVRFUklBTFMpIHtcbiAgICBpZiAoVXRpbHMuREVGQVVMVF9ST09NX01BVEVSSUFMUy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiZcbiAgICAgICAgbWF0ZXJpYWxzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgaWYgKG1hdGVyaWFsc1twcm9wZXJ0eV0gaW4gVXRpbHMuUk9PTV9NQVRFUklBTF9DT0VGRklDSUVOVFMpIHtcbiAgICAgICAgY29lZmZpY2llbnRzW3Byb3BlcnR5XSA9XG4gICAgICAgICAgVXRpbHMuUk9PTV9NQVRFUklBTF9DT0VGRklDSUVOVFNbbWF0ZXJpYWxzW3Byb3BlcnR5XV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBVdGlscy5sb2coJ01hdGVyaWFsIFxcXCInICsgbWF0ZXJpYWxzW3Byb3BlcnR5XSArICdcXFwiIG9uIHdhbGwgXFxcIicgK1xuICAgICAgICAgIHByb3BlcnR5ICsgJ1xcXCIgbm90IGZvdW5kLiBVc2luZyBcXFwiJyArXG4gICAgICAgICAgVXRpbHMuREVGQVVMVF9ST09NX01BVEVSSUFMU1twcm9wZXJ0eV0gKyAnXFxcIi4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgVXRpbHMubG9nKCdXYWxsIFxcXCInICsgcHJvcGVydHkgKyAnXFxcIiBpcyBub3QgZGVmaW5lZC4gRGVmYXVsdCB1c2VkLicpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29lZmZpY2llbnRzO1xufVxuXG4vKipcbiAqIFNhbml0aXplIGNvZWZmaWNpZW50cy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb2VmZmljaWVudHNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gX3Nhbml0aXplQ29lZmZpY2llbnRzKGNvZWZmaWNpZW50cykge1xuICBpZiAoY29lZmZpY2llbnRzID09IHVuZGVmaW5lZCkge1xuICAgIGNvZWZmaWNpZW50cyA9IHt9O1xuICB9XG4gIGZvciAobGV0IHByb3BlcnR5IGluIFV0aWxzLkRFRkFVTFRfUk9PTV9NQVRFUklBTFMpIHtcbiAgICBpZiAoIShjb2VmZmljaWVudHMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSkge1xuICAgICAgLy8gSWYgZWxlbWVudCBpcyBub3QgcHJlc2VudCwgdXNlIGRlZmF1bHQgY29lZmZpY2llbnRzLlxuICAgICAgY29lZmZpY2llbnRzW3Byb3BlcnR5XSA9IFV0aWxzLlJPT01fTUFURVJJQUxfQ09FRkZJQ0lFTlRTW1xuICAgICAgICBVdGlscy5ERUZBVUxUX1JPT01fTUFURVJJQUxTW3Byb3BlcnR5XV07XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2VmZmljaWVudHM7XG59XG5cbi8qKlxuICogU2FuaXRpemUgZGltZW5zaW9ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkaW1lbnNpb25zXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIF9zYW5pdGl6ZURpbWVuc2lvbnMoZGltZW5zaW9ucykge1xuICBpZiAoZGltZW5zaW9ucyA9PSB1bmRlZmluZWQpIHtcbiAgICBkaW1lbnNpb25zID0ge307XG4gIH1cbiAgZm9yIChsZXQgcHJvcGVydHkgaW4gVXRpbHMuREVGQVVMVF9ST09NX0RJTUVOU0lPTlMpIHtcbiAgICBpZiAoIShkaW1lbnNpb25zLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkpIHtcbiAgICAgIGRpbWVuc2lvbnNbcHJvcGVydHldID0gVXRpbHMuREVGQVVMVF9ST09NX0RJTUVOU0lPTlNbcHJvcGVydHldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGltZW5zaW9ucztcbn1cblxuLyoqXG4gKiBDb21wdXRlIGZyZXF1ZW5jeS1kZXBlbmRlbnQgcmV2ZXJiIGR1cmF0aW9ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkaW1lbnNpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gY29lZmZpY2llbnRzXG4gKiBAcGFyYW0ge051bWJlcn0gc3BlZWRPZlNvdW5kXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gX2dldER1cmF0aW9uc0Zyb21Qcm9wZXJ0aWVzKGRpbWVuc2lvbnMsIGNvZWZmaWNpZW50cywgc3BlZWRPZlNvdW5kKSB7XG4gIGxldCBkdXJhdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KFV0aWxzLk5VTUJFUl9SRVZFUkJfRlJFUVVFTkNZX0JBTkRTKTtcblxuICAvLyBTYW5pdGl6ZSBpbnB1dHMuXG4gIGRpbWVuc2lvbnMgPSBfc2FuaXRpemVEaW1lbnNpb25zKGRpbWVuc2lvbnMpO1xuICBjb2VmZmljaWVudHMgPSBfc2FuaXRpemVDb2VmZmljaWVudHMoY29lZmZpY2llbnRzKTtcbiAgaWYgKHNwZWVkT2ZTb3VuZCA9PSB1bmRlZmluZWQpIHtcbiAgICBzcGVlZE9mU291bmQgPSBVdGlscy5ERUZBVUxUX1NQRUVEX09GX1NPVU5EO1xuICB9XG5cbiAgLy8gQWNvdXN0aWMgY29uc3RhbnQuXG4gIGxldCBrID0gVXRpbHMuVFdFTlRZX0ZPVVJfTE9HMTAgLyBzcGVlZE9mU291bmQ7XG5cbiAgLy8gQ29tcHV0ZSB2b2x1bWUsIHNraXAgaWYgcm9vbSBpcyBub3QgcHJlc2VudC5cbiAgbGV0IHZvbHVtZSA9IGRpbWVuc2lvbnMud2lkdGggKiBkaW1lbnNpb25zLmhlaWdodCAqIGRpbWVuc2lvbnMuZGVwdGg7XG4gIGlmICh2b2x1bWUgPCBVdGlscy5ST09NX01JTl9WT0xVTUUpIHtcbiAgICByZXR1cm4gZHVyYXRpb25zO1xuICB9XG5cbiAgLy8gUm9vbSBzdXJmYWNlIGFyZWEuXG4gIGxldCBsZWZ0UmlnaHRBcmVhID0gZGltZW5zaW9ucy53aWR0aCAqIGRpbWVuc2lvbnMuaGVpZ2h0O1xuICBsZXQgZmxvb3JDZWlsaW5nQXJlYSA9IGRpbWVuc2lvbnMud2lkdGggKiBkaW1lbnNpb25zLmRlcHRoO1xuICBsZXQgZnJvbnRCYWNrQXJlYSA9IGRpbWVuc2lvbnMuZGVwdGggKiBkaW1lbnNpb25zLmhlaWdodDtcbiAgbGV0IHRvdGFsQXJlYSA9IDIgKiAobGVmdFJpZ2h0QXJlYSArIGZsb29yQ2VpbGluZ0FyZWEgKyBmcm9udEJhY2tBcmVhKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBVdGlscy5OVU1CRVJfUkVWRVJCX0ZSRVFVRU5DWV9CQU5EUzsgaSsrKSB7XG4gICAgLy8gRWZmZWN0aXZlIGFic29ycHRpdmUgYXJlYS5cbiAgICBsZXQgYWJzb3JidGlvbkFyZWEgPVxuICAgICAgKGNvZWZmaWNpZW50cy5sZWZ0W2ldICsgY29lZmZpY2llbnRzLnJpZ2h0W2ldKSAqIGxlZnRSaWdodEFyZWEgK1xuICAgICAgKGNvZWZmaWNpZW50cy5kb3duW2ldICsgY29lZmZpY2llbnRzLnVwW2ldKSAqIGZsb29yQ2VpbGluZ0FyZWEgK1xuICAgICAgKGNvZWZmaWNpZW50cy5mcm9udFtpXSArIGNvZWZmaWNpZW50cy5iYWNrW2ldKSAqIGZyb250QmFja0FyZWE7XG4gICAgbGV0IG1lYW5BYnNvcmJ0aW9uQXJlYSA9IGFic29yYnRpb25BcmVhIC8gdG90YWxBcmVhO1xuXG4gICAgLy8gQ29tcHV0ZSByZXZlcmJlcmF0aW9uIHVzaW5nIEV5cmluZyBlcXVhdGlvbiBbMV0uXG4gICAgLy8gWzFdIEJlcmFuZWssIExlbyBMLiBcIkFuYWx5c2lzIG9mIFNhYmluZSBhbmQgRXlyaW5nIGVxdWF0aW9ucyBhbmQgdGhlaXJcbiAgICAvLyAgICAgYXBwbGljYXRpb24gdG8gY29uY2VydCBoYWxsIGF1ZGllbmNlIGFuZCBjaGFpciBhYnNvcnB0aW9uLlwiIFRoZVxuICAgIC8vICAgICBKb3VybmFsIG9mIHRoZSBBY291c3RpY2FsIFNvY2lldHkgb2YgQW1lcmljYSwgVm9sLiAxMjAsIE5vLiAzLlxuICAgIC8vICAgICAoMjAwNiksIHBwLiAxMzk5LTEzOTkuXG4gICAgZHVyYXRpb25zW2ldID0gVXRpbHMuUk9PTV9FWVJJTkdfQ09SUkVDVElPTl9DT0VGRklDSUVOVCAqIGsgKiB2b2x1bWUgL1xuICAgICAgKC10b3RhbEFyZWEgKiBNYXRoLmxvZygxIC0gbWVhbkFic29yYnRpb25BcmVhKSArIDQgKlxuICAgICAgVXRpbHMuUk9PTV9BSVJfQUJTT1JQVElPTl9DT0VGRklDSUVOVFNbaV0gKiB2b2x1bWUpO1xuICB9XG4gIHJldHVybiBkdXJhdGlvbnM7XG59XG5cblxuLyoqXG4gKiBDb21wdXRlIHJlZmxlY3Rpb24gY29lZmZpY2llbnRzIGZyb20gYWJzb3JwdGlvbiBjb2VmZmljaWVudHMuXG4gKiBAcGFyYW0ge09iamVjdH0gYWJzb3JwdGlvbkNvZWZmaWNpZW50c1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBfY29tcHV0ZVJlZmxlY3Rpb25Db2VmZmljaWVudHMoYWJzb3JwdGlvbkNvZWZmaWNpZW50cykge1xuICBsZXQgcmVmbGVjdGlvbkNvZWZmaWNpZW50cyA9IFtdO1xuICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBVdGlscy5ERUZBVUxUX1JFRkxFQ1RJT05fQ09FRkZJQ0lFTlRTKSB7XG4gICAgaWYgKFV0aWxzLkRFRkFVTFRfUkVGTEVDVElPTl9DT0VGRklDSUVOVFNcbiAgICAgICAgLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgLy8gQ29tcHV0ZSBhdmVyYWdlIGFic29ycHRpb24gY29lZmZpY2llbnQgKHBlciB3YWxsKS5cbiAgICAgIHJlZmxlY3Rpb25Db2VmZmljaWVudHNbcHJvcGVydHldID0gMDtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgVXRpbHMuTlVNQkVSX1JFRkxFQ1RJT05fQVZFUkFHSU5HX0JBTkRTOyBqKyspIHtcbiAgICAgICAgbGV0IGJhbmRJbmRleCA9IGogKyBVdGlscy5ST09NX1NUQVJUSU5HX0FWRVJBR0lOR19CQU5EO1xuICAgICAgICByZWZsZWN0aW9uQ29lZmZpY2llbnRzW3Byb3BlcnR5XSArPVxuICAgICAgICAgIGFic29ycHRpb25Db2VmZmljaWVudHNbcHJvcGVydHldW2JhbmRJbmRleF07XG4gICAgICB9XG4gICAgICByZWZsZWN0aW9uQ29lZmZpY2llbnRzW3Byb3BlcnR5XSAvPVxuICAgICAgICBVdGlscy5OVU1CRVJfUkVGTEVDVElPTl9BVkVSQUdJTkdfQkFORFM7XG5cbiAgICAgIC8vIENvbnZlcnQgYWJzb3JwdGlvbiBjb2VmZmljaWVudCB0byByZWZsZWN0aW9uIGNvZWZmaWNpZW50LlxuICAgICAgcmVmbGVjdGlvbkNvZWZmaWNpZW50c1twcm9wZXJ0eV0gPVxuICAgICAgICBNYXRoLnNxcnQoMSAtIHJlZmxlY3Rpb25Db2VmZmljaWVudHNbcHJvcGVydHldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlZmxlY3Rpb25Db2VmZmljaWVudHM7XG59XG5cblxuLyoqXG4gKiBAY2xhc3MgUm9vbVxuICogQGRlc2NyaXB0aW9uIE1vZGVsIHRoYXQgbWFuYWdlcyBlYXJseSBhbmQgbGF0ZSByZWZsZWN0aW9ucyB1c2luZyBhY291c3RpY1xuICogcHJvcGVydGllcyBhbmQgbGlzdGVuZXIgcG9zaXRpb24gcmVsYXRpdmUgdG8gYSByZWN0YW5ndWxhciByb29tLlxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHRcbiAqIEFzc29jaWF0ZWQge0BsaW5rXG5odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Db250ZXh0IEF1ZGlvQ29udGV4dH0uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IG9wdGlvbnMubGlzdGVuZXJQb3NpdGlvblxuICogVGhlIGxpc3RlbmVyJ3MgaW5pdGlhbCBwb3NpdGlvbiAoaW4gbWV0ZXJzKSwgd2hlcmUgb3JpZ2luIGlzIHRoZSBjZW50ZXIgb2ZcbiAqIHRoZSByb29tLiBEZWZhdWx0cyB0byB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfUE9TSVRJT04gREVGQVVMVF9QT1NJVElPTn0uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5kaW1lbnNpb25zIFJvb20gZGltZW5zaW9ucyAoaW4gbWV0ZXJzKS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9ST09NX0RJTUVOU0lPTlMgREVGQVVMVF9ST09NX0RJTUVOU0lPTlN9LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMubWF0ZXJpYWxzIE5hbWVkIGFjb3VzdGljIG1hdGVyaWFscyBwZXIgd2FsbC5cbiAqIERlZmF1bHRzIHRvIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9ST09NX01BVEVSSUFMUyBERUZBVUxUX1JPT01fTUFURVJJQUxTfS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnNwZWVkT2ZTb3VuZFxuICogKGluIG1ldGVycy9zZWNvbmQpLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1NQRUVEX09GX1NPVU5EIERFRkFVTFRfU1BFRURfT0ZfU09VTkR9LlxuICovXG5mdW5jdGlvbiBSb29tKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgLy8gUHVibGljIHZhcmlhYmxlcy5cbiAgLyoqXG4gICAqIEVhcmx5UmVmbGVjdGlvbnMge0BsaW5rIEVhcmx5UmVmbGVjdGlvbnMgRWFybHlSZWZsZWN0aW9uc30gc3VibW9kdWxlLlxuICAgKiBAbWVtYmVyIHtBdWRpb05vZGV9IGVhcmx5XG4gICAqIEBtZW1iZXJvZiBSb29tXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgLyoqXG4gICAqIExhdGVSZWZsZWN0aW9ucyB7QGxpbmsgTGF0ZVJlZmxlY3Rpb25zIExhdGVSZWZsZWN0aW9uc30gc3VibW9kdWxlLlxuICAgKiBAbWVtYmVyIHtBdWRpb05vZGV9IGxhdGVcbiAgICogQG1lbWJlcm9mIFJvb21cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICAvKipcbiAgICogQW1iaXNvbmljIChtdWx0aWNoYW5uZWwpIG91dHB1dCB7QGxpbmtcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0F1ZGlvTm9kZSBBdWRpb05vZGV9LlxuICAgKiBAbWVtYmVyIHtBdWRpb05vZGV9IG91dHB1dFxuICAgKiBAbWVtYmVyb2YgUm9vbVxuICAgKiBAaW5zdGFuY2VcbiAgICovXG5cbiAgLy8gVXNlIGRlZmF1bHRzIGZvciB1bmRlZmluZWQgYXJndW1lbnRzLlxuICBpZiAob3B0aW9ucyA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKG9wdGlvbnMubGlzdGVuZXJQb3NpdGlvbiA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLmxpc3RlbmVyUG9zaXRpb24gPSBVdGlscy5ERUZBVUxUX1BPU0lUSU9OLnNsaWNlKCk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuZGltZW5zaW9ucyA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLmRpbWVuc2lvbnMgPSB7fTtcbiAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMuZGltZW5zaW9ucywgVXRpbHMuREVGQVVMVF9ST09NX0RJTUVOU0lPTlMpO1xuICB9XG4gIGlmIChvcHRpb25zLm1hdGVyaWFscyA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLm1hdGVyaWFscyA9IHt9O1xuICAgIE9iamVjdC5hc3NpZ24ob3B0aW9ucy5tYXRlcmlhbHMsIFV0aWxzLkRFRkFVTFRfUk9PTV9NQVRFUklBTFMpO1xuICB9XG4gIGlmIChvcHRpb25zLnNwZWVkT2ZTb3VuZCA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLnNwZWVkT2ZTb3VuZCA9IFV0aWxzLkRFRkFVTFRfU1BFRURfT0ZfU09VTkQ7XG4gIH1cblxuICAvLyBTYW5pdGl6ZSByb29tLXByb3BlcnRpZXMtcmVsYXRlZCBhcmd1bWVudHMuXG4gIG9wdGlvbnMuZGltZW5zaW9ucyA9IF9zYW5pdGl6ZURpbWVuc2lvbnMob3B0aW9ucy5kaW1lbnNpb25zKTtcbiAgbGV0IGFic29ycHRpb25Db2VmZmljaWVudHMgPSBfZ2V0Q29lZmZpY2llbnRzRnJvbU1hdGVyaWFscyhvcHRpb25zLm1hdGVyaWFscyk7XG4gIGxldCByZWZsZWN0aW9uQ29lZmZpY2llbnRzID1cbiAgICBfY29tcHV0ZVJlZmxlY3Rpb25Db2VmZmljaWVudHMoYWJzb3JwdGlvbkNvZWZmaWNpZW50cyk7XG4gIGxldCBkdXJhdGlvbnMgPSBfZ2V0RHVyYXRpb25zRnJvbVByb3BlcnRpZXMob3B0aW9ucy5kaW1lbnNpb25zLFxuICAgIGFic29ycHRpb25Db2VmZmljaWVudHMsIG9wdGlvbnMuc3BlZWRPZlNvdW5kKTtcblxuICAvLyBDb25zdHJ1Y3Qgc3VibW9kdWxlcyBmb3IgZWFybHkgYW5kIGxhdGUgcmVmbGVjdGlvbnMuXG4gIHRoaXMuZWFybHkgPSBuZXcgRWFybHlSZWZsZWN0aW9ucyhjb250ZXh0LCB7XG4gICAgZGltZW5zaW9uczogb3B0aW9ucy5kaW1lbnNpb25zLFxuICAgIGNvZWZmaWNpZW50czogcmVmbGVjdGlvbkNvZWZmaWNpZW50cyxcbiAgICBzcGVlZE9mU291bmQ6IG9wdGlvbnMuc3BlZWRPZlNvdW5kLFxuICAgIGxpc3RlbmVyUG9zaXRpb246IG9wdGlvbnMubGlzdGVuZXJQb3NpdGlvbixcbiAgfSk7XG4gIHRoaXMubGF0ZSA9IG5ldyBMYXRlUmVmbGVjdGlvbnMoY29udGV4dCwge1xuICAgIGR1cmF0aW9uczogZHVyYXRpb25zLFxuICB9KTtcblxuICB0aGlzLnNwZWVkT2ZTb3VuZCA9IG9wdGlvbnMuc3BlZWRPZlNvdW5kO1xuXG4gIC8vIENvbnN0cnVjdCBhdXhpbGxhcnkgYXVkaW8gbm9kZXMuXG4gIHRoaXMub3V0cHV0ID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuZWFybHkub3V0cHV0LmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuICB0aGlzLl9tZXJnZXIgPSBjb250ZXh0LmNyZWF0ZUNoYW5uZWxNZXJnZXIoNCk7XG5cbiAgdGhpcy5sYXRlLm91dHB1dC5jb25uZWN0KHRoaXMuX21lcmdlciwgMCwgMCk7XG4gIHRoaXMuX21lcmdlci5jb25uZWN0KHRoaXMub3V0cHV0KTtcbn1cblxuXG4vKipcbiAqIFNldCB0aGUgcm9vbSdzIGRpbWVuc2lvbnMgYW5kIHdhbGwgbWF0ZXJpYWxzLlxuICogQHBhcmFtIHtPYmplY3R9IGRpbWVuc2lvbnMgUm9vbSBkaW1lbnNpb25zIChpbiBtZXRlcnMpLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1JPT01fRElNRU5TSU9OUyBERUZBVUxUX1JPT01fRElNRU5TSU9OU30uXG4gKiBAcGFyYW0ge09iamVjdH0gbWF0ZXJpYWxzIE5hbWVkIGFjb3VzdGljIG1hdGVyaWFscyBwZXIgd2FsbC4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9ST09NX01BVEVSSUFMUyBERUZBVUxUX1JPT01fTUFURVJJQUxTfS5cbiAqL1xuUm9vbS5wcm90b3R5cGUuc2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uKGRpbWVuc2lvbnMsIG1hdGVyaWFscykge1xuICAvLyBDb21wdXRlIGxhdGUgcmVzcG9uc2UuXG4gIGxldCBhYnNvcnB0aW9uQ29lZmZpY2llbnRzID0gX2dldENvZWZmaWNpZW50c0Zyb21NYXRlcmlhbHMobWF0ZXJpYWxzKTtcbiAgbGV0IGR1cmF0aW9ucyA9IF9nZXREdXJhdGlvbnNGcm9tUHJvcGVydGllcyhkaW1lbnNpb25zLFxuICAgIGFic29ycHRpb25Db2VmZmljaWVudHMsIHRoaXMuc3BlZWRPZlNvdW5kKTtcbiAgdGhpcy5sYXRlLnNldER1cmF0aW9ucyhkdXJhdGlvbnMpO1xuXG4gIC8vIENvbXB1dGUgZWFybHkgcmVzcG9uc2UuXG4gIHRoaXMuZWFybHkuc3BlZWRPZlNvdW5kID0gdGhpcy5zcGVlZE9mU291bmQ7XG4gIGxldCByZWZsZWN0aW9uQ29lZmZpY2llbnRzID1cbiAgICBfY29tcHV0ZVJlZmxlY3Rpb25Db2VmZmljaWVudHMoYWJzb3JwdGlvbkNvZWZmaWNpZW50cyk7XG4gIHRoaXMuZWFybHkuc2V0Um9vbVByb3BlcnRpZXMoZGltZW5zaW9ucywgcmVmbGVjdGlvbkNvZWZmaWNpZW50cyk7XG59O1xuXG5cbi8qKlxuICogU2V0IHRoZSBsaXN0ZW5lcidzIHBvc2l0aW9uIChpbiBtZXRlcnMpLCB3aGVyZSBvcmlnaW4gaXMgdGhlIGNlbnRlciBvZlxuICogdGhlIHJvb20uXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqIEBwYXJhbSB7TnVtYmVyfSB6XG4gKi9cblJvb20ucHJvdG90eXBlLnNldExpc3RlbmVyUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5LCB6KSB7XG4gIHRoaXMuZWFybHkuc3BlZWRPZlNvdW5kID0gdGhpcy5zcGVlZE9mU291bmQ7XG4gIHRoaXMuZWFybHkuc2V0TGlzdGVuZXJQb3NpdGlvbih4LCB5LCB6KTtcblxuICAvLyBEaXNhYmxlIHJvb20gZWZmZWN0cyBpZiB0aGUgbGlzdGVuZXIgaXMgb3V0c2lkZSB0aGUgcm9vbSBib3VuZGFyaWVzLlxuICBsZXQgZGlzdGFuY2UgPSB0aGlzLmdldERpc3RhbmNlT3V0c2lkZVJvb20oeCwgeSwgeik7XG4gIGxldCBnYWluID0gMTtcbiAgaWYgKGRpc3RhbmNlID4gVXRpbHMuRVBTSUxPTl9GTE9BVCkge1xuICAgIGdhaW4gPSAxIC0gZGlzdGFuY2UgLyBVdGlscy5MSVNURU5FUl9NQVhfT1VUU0lERV9ST09NX0RJU1RBTkNFO1xuXG4gICAgLy8gQ2xhbXAgZ2FpbiBiZXR3ZWVuIDAgYW5kIDEuXG4gICAgZ2FpbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIGdhaW4pKTtcbiAgfVxuICB0aGlzLm91dHB1dC5nYWluLnZhbHVlID0gZ2Fpbjtcbn07XG5cblxuLyoqXG4gKiBDb21wdXRlIGRpc3RhbmNlIG91dHNpZGUgcm9vbSBvZiBwcm92aWRlZCBwb3NpdGlvbiAoaW4gbWV0ZXJzKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiBAcGFyYW0ge051bWJlcn0geVxuICogQHBhcmFtIHtOdW1iZXJ9IHpcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIERpc3RhbmNlIG91dHNpZGUgcm9vbSAoaW4gbWV0ZXJzKS4gUmV0dXJucyAwIGlmIGluc2lkZSByb29tLlxuICovXG5Sb29tLnByb3RvdHlwZS5nZXREaXN0YW5jZU91dHNpZGVSb29tID0gZnVuY3Rpb24oeCwgeSwgeikge1xuICBsZXQgZHggPSBNYXRoLm1heCgwLCAtdGhpcy5lYXJseS5faGFsZkRpbWVuc2lvbnMud2lkdGggLSB4LFxuICAgIHggLSB0aGlzLmVhcmx5Ll9oYWxmRGltZW5zaW9ucy53aWR0aCk7XG4gICAgbGV0IGR5ID0gTWF0aC5tYXgoMCwgLXRoaXMuZWFybHkuX2hhbGZEaW1lbnNpb25zLmhlaWdodCAtIHksXG4gICAgeSAtIHRoaXMuZWFybHkuX2hhbGZEaW1lbnNpb25zLmhlaWdodCk7XG4gICAgbGV0IGR6ID0gTWF0aC5tYXgoMCwgLXRoaXMuZWFybHkuX2hhbGZEaW1lbnNpb25zLmRlcHRoIC0geixcbiAgICB6IC0gdGhpcy5lYXJseS5faGFsZkRpbWVuc2lvbnMuZGVwdGgpO1xuICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5ICsgZHogKiBkeik7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUm9vbTtcblxuXG4vKioqLyB9KSxcbi8qIDggKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGUgTGF0ZSByZXZlcmJlcmF0aW9uIGZpbHRlciBmb3IgQW1iaXNvbmljIGNvbnRlbnQuXG4gKiBAYXV0aG9yIEFuZHJldyBBbGxlbiA8Yml0bGxhbWFAZ29vZ2xlLmNvbT5cbiAqL1xuXG5cblxuLy8gSW50ZXJuYWwgZGVwZW5kZW5jaWVzLlxuY29uc3QgVXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKlxuICogQGNsYXNzIExhdGVSZWZsZWN0aW9uc1xuICogQGRlc2NyaXB0aW9uIExhdGUtcmVmbGVjdGlvbnMgcmV2ZXJiZXJhdGlvbiBmaWx0ZXIgZm9yIEFtYmlzb25pYyBjb250ZW50LlxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHRcbiAqIEFzc29jaWF0ZWQge0BsaW5rXG5odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Db250ZXh0IEF1ZGlvQ29udGV4dH0uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheX0gb3B0aW9ucy5kdXJhdGlvbnNcbiAqIE11bHRpYmFuZCBSVDYwIGR1cmF0aW9ucyAoaW4gc2Vjb25kcykgZm9yIGVhY2ggZnJlcXVlbmN5IGJhbmQsIGxpc3RlZCBhc1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1JFVkVSQl9GUkVRVUVOQ1lfQkFORFNcbiAqIEZSRVFVREVGQVVMVF9SRVZFUkJfRlJFUVVFTkNZX0JBTkRTRU5DWV9CQU5EU30uIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfUkVWRVJCX0RVUkFUSU9OUyBERUZBVUxUX1JFVkVSQl9EVVJBVElPTlN9LlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMucHJlZGVsYXkgUHJlLWRlbGF5IChpbiBtaWxsaXNlY29uZHMpLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1JFVkVSQl9QUkVERUxBWSBERUZBVUxUX1JFVkVSQl9QUkVERUxBWX0uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5nYWluIE91dHB1dCBnYWluIChsaW5lYXIpLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1JFVkVSQl9HQUlOIERFRkFVTFRfUkVWRVJCX0dBSU59LlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuYmFuZHdpZHRoIEJhbmR3aWR0aCAoaW4gb2N0YXZlcykgZm9yIGVhY2ggZnJlcXVlbmN5XG4gKiBiYW5kLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1JFVkVSQl9CQU5EV0lEVEggREVGQVVMVF9SRVZFUkJfQkFORFdJRFRIfS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnRhaWxvbnNldCBMZW5ndGggKGluIG1pbGxpc2Vjb25kcykgb2YgaW1wdWxzZVxuICogcmVzcG9uc2UgdG8gYXBwbHkgYSBoYWxmLUhhbm4gd2luZG93LiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1JFVkVSQl9UQUlMX09OU0VUIERFRkFVTFRfUkVWRVJCX1RBSUxfT05TRVR9LlxuICovXG5mdW5jdGlvbiBMYXRlUmVmbGVjdGlvbnMoY29udGV4dCwgb3B0aW9ucykge1xuICAvLyBQdWJsaWMgdmFyaWFibGVzLlxuICAvKipcbiAgICogTW9ubyAoMS1jaGFubmVsKSBpbnB1dCB7QGxpbmtcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0F1ZGlvTm9kZSBBdWRpb05vZGV9LlxuICAgKiBAbWVtYmVyIHtBdWRpb05vZGV9IGlucHV0XG4gICAqIEBtZW1iZXJvZiBMYXRlUmVmbGVjdGlvbnNcbiAgICogQGluc3RhbmNlXG4gICAqL1xuICAvKipcbiAgICogTW9ubyAoMS1jaGFubmVsKSBvdXRwdXQge0BsaW5rXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb05vZGUgQXVkaW9Ob2RlfS5cbiAgICogQG1lbWJlciB7QXVkaW9Ob2RlfSBvdXRwdXRcbiAgICogQG1lbWJlcm9mIExhdGVSZWZsZWN0aW9uc1xuICAgKiBAaW5zdGFuY2VcbiAgICovXG5cbiAgLy8gVXNlIGRlZmF1bHRzIGZvciB1bmRlZmluZWQgYXJndW1lbnRzLlxuICBpZiAob3B0aW9ucyA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKG9wdGlvbnMuZHVyYXRpb25zID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMuZHVyYXRpb25zID0gVXRpbHMuREVGQVVMVF9SRVZFUkJfRFVSQVRJT05TLnNsaWNlKCk7XG4gIH1cbiAgaWYgKG9wdGlvbnMucHJlZGVsYXkgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5wcmVkZWxheSA9IFV0aWxzLkRFRkFVTFRfUkVWRVJCX1BSRURFTEFZO1xuICB9XG4gIGlmIChvcHRpb25zLmdhaW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5nYWluID0gVXRpbHMuREVGQVVMVF9SRVZFUkJfR0FJTjtcbiAgfVxuICBpZiAob3B0aW9ucy5iYW5kd2lkdGggPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5iYW5kd2lkdGggPSBVdGlscy5ERUZBVUxUX1JFVkVSQl9CQU5EV0lEVEg7XG4gIH1cbiAgaWYgKG9wdGlvbnMudGFpbG9uc2V0ID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMudGFpbG9uc2V0ID0gVXRpbHMuREVGQVVMVF9SRVZFUkJfVEFJTF9PTlNFVDtcbiAgfVxuXG4gIC8vIEFzc2lnbiBwcmUtY29tcHV0ZWQgdmFyaWFibGVzLlxuICBsZXQgZGVsYXlTZWNzID0gb3B0aW9ucy5wcmVkZWxheSAvIDEwMDA7XG4gIHRoaXMuX2JhbmR3aWR0aENvZWZmID0gb3B0aW9ucy5iYW5kd2lkdGggKiBVdGlscy5MT0cyX0RJVjI7XG4gIHRoaXMuX3RhaWxvbnNldFNhbXBsZXMgPSBvcHRpb25zLnRhaWxvbnNldCAvIDEwMDA7XG5cbiAgLy8gQ3JlYXRlIG5vZGVzLlxuICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5pbnB1dCA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9wcmVkZWxheSA9IGNvbnRleHQuY3JlYXRlRGVsYXkoZGVsYXlTZWNzKTtcbiAgdGhpcy5fY29udm9sdmVyID0gY29udGV4dC5jcmVhdGVDb252b2x2ZXIoKTtcbiAgdGhpcy5vdXRwdXQgPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuICAvLyBTZXQgcmV2ZXJiIGF0dGVudWF0aW9uLlxuICB0aGlzLm91dHB1dC5nYWluLnZhbHVlID0gb3B0aW9ucy5nYWluO1xuXG4gIC8vIERpc2FibGUgbm9ybWFsaXphdGlvbi5cbiAgdGhpcy5fY29udm9sdmVyLm5vcm1hbGl6ZSA9IGZhbHNlO1xuXG4gIC8vIENvbm5lY3Qgbm9kZXMuXG4gIHRoaXMuaW5wdXQuY29ubmVjdCh0aGlzLl9wcmVkZWxheSk7XG4gIHRoaXMuX3ByZWRlbGF5LmNvbm5lY3QodGhpcy5fY29udm9sdmVyKTtcbiAgdGhpcy5fY29udm9sdmVyLmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuXG4gIC8vIENvbXB1dGUgSVIgdXNpbmcgUlQ2MCB2YWx1ZXMuXG4gIHRoaXMuc2V0RHVyYXRpb25zKG9wdGlvbnMuZHVyYXRpb25zKTtcbn1cblxuXG4vKipcbiAqIFJlLWNvbXB1dGUgYSBuZXcgaW1wdWxzZSByZXNwb25zZSBieSBwcm92aWRpbmcgTXVsdGliYW5kIFJUNjAgZHVyYXRpb25zLlxuICogQHBhcmFtIHtBcnJheX0gZHVyYXRpb25zXG4gKiBNdWx0aWJhbmQgUlQ2MCBkdXJhdGlvbnMgKGluIHNlY29uZHMpIGZvciBlYWNoIGZyZXF1ZW5jeSBiYW5kLCBsaXN0ZWQgYXNcbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9SRVZFUkJfRlJFUVVFTkNZX0JBTkRTXG4gKiBERUZBVUxUX1JFVkVSQl9GUkVRVUVOQ1lfQkFORFN9LlxuICovXG5MYXRlUmVmbGVjdGlvbnMucHJvdG90eXBlLnNldER1cmF0aW9ucyA9IGZ1bmN0aW9uKGR1cmF0aW9ucykge1xuICBpZiAoZHVyYXRpb25zLmxlbmd0aCAhPT0gVXRpbHMuTlVNQkVSX1JFVkVSQl9GUkVRVUVOQ1lfQkFORFMpIHtcbiAgICBVdGlscy5sb2coJ1dhcm5pbmc6IGludmFsaWQgbnVtYmVyIG9mIFJUNjAgdmFsdWVzIHByb3ZpZGVkIHRvIHJldmVyYi4nKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBDb21wdXRlIGltcHVsc2UgcmVzcG9uc2UuXG4gIGxldCBkdXJhdGlvbnNTYW1wbGVzID1cbiAgICBuZXcgRmxvYXQzMkFycmF5KFV0aWxzLk5VTUJFUl9SRVZFUkJfRlJFUVVFTkNZX0JBTkRTKTtcbiAgICBsZXQgc2FtcGxlUmF0ZSA9IHRoaXMuX2NvbnRleHQuc2FtcGxlUmF0ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGR1cmF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIC8vIENsYW1wIHdpdGhpbiBzdWl0YWJsZSByYW5nZS5cbiAgICBkdXJhdGlvbnNbaV0gPVxuICAgICAgTWF0aC5tYXgoMCwgTWF0aC5taW4oVXRpbHMuREVGQVVMVF9SRVZFUkJfTUFYX0RVUkFUSU9OLCBkdXJhdGlvbnNbaV0pKTtcblxuICAgIC8vIENvbnZlcnQgc2Vjb25kcyB0byBzYW1wbGVzLlxuICAgIGR1cmF0aW9uc1NhbXBsZXNbaV0gPSBNYXRoLnJvdW5kKGR1cmF0aW9uc1tpXSAqIHNhbXBsZVJhdGUgKlxuICAgICAgVXRpbHMuREVGQVVMVF9SRVZFUkJfRFVSQVRJT05fTVVMVElQTElFUik7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIG1heCBSVDYwIGxlbmd0aCBpbiBzYW1wbGVzLlxuICBsZXQgZHVyYXRpb25zU2FtcGxlc01heCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZHVyYXRpb25zU2FtcGxlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChkdXJhdGlvbnNTYW1wbGVzW2ldID4gZHVyYXRpb25zU2FtcGxlc01heCkge1xuICAgICAgZHVyYXRpb25zU2FtcGxlc01heCA9IGR1cmF0aW9uc1NhbXBsZXNbaV07XG4gICAgfVxuICB9XG5cbiAgLy8gU2tpcCB0aGlzIHN0ZXAgaWYgdGhlcmUgaXMgbm8gcmV2ZXJiZXJhdGlvbiB0byBjb21wdXRlLlxuICBpZiAoZHVyYXRpb25zU2FtcGxlc01heCA8IDEpIHtcbiAgICBkdXJhdGlvbnNTYW1wbGVzTWF4ID0gMTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBpbXB1bHNlIHJlc3BvbnNlIGJ1ZmZlci5cbiAgbGV0IGJ1ZmZlciA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGR1cmF0aW9uc1NhbXBsZXNNYXgsIHNhbXBsZVJhdGUpO1xuICBsZXQgYnVmZmVyRGF0YSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcblxuICAvLyBDcmVhdGUgbm9pc2Ugc2lnbmFsIChjb21wdXRlZCBvbmNlLCByZWZlcmVuY2VkIGluIGVhY2ggYmFuZCdzIHJvdXRpbmUpLlxuICBsZXQgbm9pc2VTaWduYWwgPSBuZXcgRmxvYXQzMkFycmF5KGR1cmF0aW9uc1NhbXBsZXNNYXgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGR1cmF0aW9uc1NhbXBsZXNNYXg7IGkrKykge1xuICAgIG5vaXNlU2lnbmFsW2ldID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xuICB9XG5cbiAgLy8gQ29tcHV0ZSB0aGUgZGVjYXkgcmF0ZSBwZXItYmFuZCBhbmQgZmlsdGVyIHRoZSBkZWNheWluZyBub2lzZSBzaWduYWwuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgVXRpbHMuTlVNQkVSX1JFVkVSQl9GUkVRVUVOQ1lfQkFORFM7IGkrKykge1xuICAgIC8vIENvbXB1dGUgZGVjYXkgcmF0ZS5cbiAgICBsZXQgZGVjYXlSYXRlID0gLVV0aWxzLkxPRzEwMDAgLyBkdXJhdGlvbnNTYW1wbGVzW2ldO1xuXG4gICAgLy8gQ29uc3RydWN0IGEgc3RhbmRhcmQgb25lLXplcm8sIHR3by1wb2xlIGJhbmRwYXNzIGZpbHRlcjpcbiAgICAvLyBIKHopID0gKGIwICogel4wICsgYjEgKiB6Xi0xICsgYjIgKiB6Xi0yKSAvICgxICsgYTEgKiB6Xi0xICsgYTIgKiB6Xi0yKVxuICAgIGxldCBvbWVnYSA9IFV0aWxzLlRXT19QSSAqXG4gICAgICBVdGlscy5ERUZBVUxUX1JFVkVSQl9GUkVRVUVOQ1lfQkFORFNbaV0gLyBzYW1wbGVSYXRlO1xuICAgIGxldCBzaW5PbWVnYSA9IE1hdGguc2luKG9tZWdhKTtcbiAgICBsZXQgYWxwaGEgPSBzaW5PbWVnYSAqIE1hdGguc2luaCh0aGlzLl9iYW5kd2lkdGhDb2VmZiAqIG9tZWdhIC8gc2luT21lZ2EpO1xuICAgIGxldCBhMENvZWZmUmVjaXByb2NhbCA9IDEgLyAoMSArIGFscGhhKTtcbiAgICBsZXQgYjBDb2VmZiA9IGFscGhhICogYTBDb2VmZlJlY2lwcm9jYWw7XG4gICAgbGV0IGExQ29lZmYgPSAtMiAqIE1hdGguY29zKG9tZWdhKSAqIGEwQ29lZmZSZWNpcHJvY2FsO1xuICAgIGxldCBhMkNvZWZmID0gKDEgLSBhbHBoYSkgKiBhMENvZWZmUmVjaXByb2NhbDtcblxuICAgIC8vIFdlIG9wdGltaXplIHNpbmNlIGIyID0gLWIwLCBiMSA9IDAuXG4gICAgLy8gVXBkYXRlIGVxdWF0aW9uIGZvciB0d28tcG9sZSBiYW5kcGFzcyBmaWx0ZXI6XG4gICAgLy8gICB1W25dID0geFtuXSAtIGExICogeFtuLTFdIC0gYTIgKiB4W24tMl1cbiAgICAvLyAgIHlbbl0gPSBiMCAqICh1W25dIC0gdVtuLTJdKVxuICAgIGxldCB1bTEgPSAwO1xuICAgIGxldCB1bTIgPSAwO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZHVyYXRpb25zU2FtcGxlc1tpXTsgaisrKSB7XG4gICAgICAvLyBFeHBvbmVudGlhbGx5LWRlY2F5aW5nIHdoaXRlIG5vaXNlLlxuICAgICAgbGV0IHggPSBub2lzZVNpZ25hbFtqXSAqIE1hdGguZXhwKGRlY2F5UmF0ZSAqIGopO1xuXG4gICAgICAvLyBGaWx0ZXIgc2lnbmFsIHdpdGggYmFuZHBhc3MgZmlsdGVyIGFuZCBhZGQgdG8gb3V0cHV0LlxuICAgICAgbGV0IHUgPSB4IC0gYTFDb2VmZiAqIHVtMSAtIGEyQ29lZmYgKiB1bTI7XG4gICAgICBidWZmZXJEYXRhW2pdICs9IGIwQ29lZmYgKiAodSAtIHVtMik7XG5cbiAgICAgIC8vIFVwZGF0ZSBjb2VmZmljaWVudHMuXG4gICAgICB1bTIgPSB1bTE7XG4gICAgICB1bTEgPSB1O1xuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZSBhbmQgYXBwbHkgaGFsZiBvZiBhIEhhbm4gd2luZG93IHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlXG4gIC8vIGltcHVsc2UgcmVzcG9uc2UuXG4gIGxldCBoYWxmSGFubkxlbmd0aCA9XG4gICAgTWF0aC5yb3VuZCh0aGlzLl90YWlsb25zZXRTYW1wbGVzKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbihidWZmZXJEYXRhLmxlbmd0aCwgaGFsZkhhbm5MZW5ndGgpOyBpKyspIHtcbiAgICBsZXQgaGFsZkhhbm4gPVxuICAgICAgMC41ICogKDEgLSBNYXRoLmNvcyhVdGlscy5UV09fUEkgKiBpIC8gKDIgKiBoYWxmSGFubkxlbmd0aCAtIDEpKSk7XG4gICAgICBidWZmZXJEYXRhW2ldICo9IGhhbGZIYW5uO1xuICB9XG4gIHRoaXMuX2NvbnZvbHZlci5idWZmZXIgPSBidWZmZXI7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTGF0ZVJlZmxlY3Rpb25zO1xuXG5cbi8qKiovIH0pLFxuLyogOSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZSBSYXktdHJhY2luZy1iYXNlZCBlYXJseSByZWZsZWN0aW9ucyBtb2RlbC5cbiAqIEBhdXRob3IgQW5kcmV3IEFsbGVuIDxiaXRsbGFtYUBnb29nbGUuY29tPlxuICovXG5cblxuXG4vLyBJbnRlcm5hbCBkZXBlbmRlbmNpZXMuXG5jb25zdCBVdGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqXG4gKiBAY2xhc3MgRWFybHlSZWZsZWN0aW9uc1xuICogQGRlc2NyaXB0aW9uIFJheS10cmFjaW5nLWJhc2VkIGVhcmx5IHJlZmxlY3Rpb25zIG1vZGVsLlxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHRcbiAqIEFzc29jaWF0ZWQge0BsaW5rXG5odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Db250ZXh0IEF1ZGlvQ29udGV4dH0uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuZGltZW5zaW9uc1xuICogUm9vbSBkaW1lbnNpb25zIChpbiBtZXRlcnMpLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1JPT01fRElNRU5TSU9OUyBERUZBVUxUX1JPT01fRElNRU5TSU9OU30uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5jb2VmZmljaWVudHNcbiAqIEZyZXF1ZW5jeS1pbmRlcGVuZGVudCByZWZsZWN0aW9uIGNvZWZmcyBwZXIgd2FsbC4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX0NPRUZGSUNJRU5UU1xuICogREVGQVVMVF9SRUZMRUNUSU9OX0NPRUZGSUNJRU5UU30uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5zcGVlZE9mU291bmRcbiAqIChpbiBtZXRlcnMgLyBzZWNvbmQpLiBEZWZhdWx0cyB0byB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfU1BFRURfT0ZfU09VTkRcbiAqIERFRkFVTFRfU1BFRURfT0ZfU09VTkR9LlxuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IG9wdGlvbnMubGlzdGVuZXJQb3NpdGlvblxuICogKGluIG1ldGVycykuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfUE9TSVRJT04gREVGQVVMVF9QT1NJVElPTn0uXG4gKi9cbmZ1bmN0aW9uIEVhcmx5UmVmbGVjdGlvbnMoY29udGV4dCwgb3B0aW9ucykge1xuICAvLyBQdWJsaWMgdmFyaWFibGVzLlxuICAvKipcbiAgICogVGhlIHJvb20ncyBzcGVlZCBvZiBzb3VuZCAoaW4gbWV0ZXJzL3NlY29uZCkuXG4gICAqIEBtZW1iZXIge051bWJlcn0gc3BlZWRPZlNvdW5kXG4gICAqIEBtZW1iZXJvZiBFYXJseVJlZmxlY3Rpb25zXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgLyoqXG4gICAqIE1vbm8gKDEtY2hhbm5lbCkgaW5wdXQge0BsaW5rXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb05vZGUgQXVkaW9Ob2RlfS5cbiAgICogQG1lbWJlciB7QXVkaW9Ob2RlfSBpbnB1dFxuICAgKiBAbWVtYmVyb2YgRWFybHlSZWZsZWN0aW9uc1xuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIC8qKlxuICAgKiBGaXJzdC1vcmRlciBhbWJpc29uaWMgKDQtY2hhbm5lbCkgb3V0cHV0IHtAbGlua1xuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Ob2RlIEF1ZGlvTm9kZX0uXG4gICAqIEBtZW1iZXIge0F1ZGlvTm9kZX0gb3V0cHV0XG4gICAqIEBtZW1iZXJvZiBFYXJseVJlZmxlY3Rpb25zXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cblxuICAvLyBVc2UgZGVmYXVsdHMgZm9yIHVuZGVmaW5lZCBhcmd1bWVudHMuXG4gIGlmIChvcHRpb25zID09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAob3B0aW9ucy5zcGVlZE9mU291bmQgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5zcGVlZE9mU291bmQgPSBVdGlscy5ERUZBVUxUX1NQRUVEX09GX1NPVU5EO1xuICB9XG4gIGlmIChvcHRpb25zLmxpc3RlbmVyUG9zaXRpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5saXN0ZW5lclBvc2l0aW9uID0gVXRpbHMuREVGQVVMVF9QT1NJVElPTi5zbGljZSgpO1xuICB9XG4gIGlmIChvcHRpb25zLmNvZWZmaWNpZW50cyA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLmNvZWZmaWNpZW50cyA9IHt9O1xuICAgIE9iamVjdC5hc3NpZ24ob3B0aW9ucy5jb2VmZmljaWVudHMsIFV0aWxzLkRFRkFVTFRfUkVGTEVDVElPTl9DT0VGRklDSUVOVFMpO1xuICB9XG5cbiAgLy8gQXNzaWduIHJvb20ncyBzcGVlZCBvZiBzb3VuZC5cbiAgdGhpcy5zcGVlZE9mU291bmQgPSBvcHRpb25zLnNwZWVkT2ZTb3VuZDtcblxuICAvLyBDcmVhdGUgbm9kZXMuXG4gIHRoaXMuaW5wdXQgPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5vdXRwdXQgPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbG93cGFzcyA9IGNvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gIHRoaXMuX2RlbGF5cyA9IHt9O1xuICB0aGlzLl9nYWlucyA9IHt9OyAvLyBnYWluUGVyV2FsbCA9IChSZWZsZWN0aW9uQ29lZmYgLyBBdHRlbnVhdGlvbilcbiAgdGhpcy5faW52ZXJ0ZXJzID0ge307IC8vIDMgb2YgdGhlc2UgYXJlIG5lZWRlZCBmb3IgcmlnaHQvYmFjay9kb3duIHdhbGxzLlxuICB0aGlzLl9tZXJnZXIgPSBjb250ZXh0LmNyZWF0ZUNoYW5uZWxNZXJnZXIoNCk7IC8vIEZpcnN0LW9yZGVyIGVuY29kaW5nIG9ubHkuXG5cbiAgLy8gQ29ubmVjdCBhdWRpbyBncmFwaCBmb3IgZWFjaCB3YWxsIHJlZmxlY3Rpb24uXG4gIGZvciAobGV0IHByb3BlcnR5IGluIFV0aWxzLkRFRkFVTFRfUkVGTEVDVElPTl9DT0VGRklDSUVOVFMpIHtcbiAgICBpZiAoVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX0NPRUZGSUNJRU5UU1xuICAgICAgICAuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICB0aGlzLl9kZWxheXNbcHJvcGVydHldID1cbiAgICAgICAgY29udGV4dC5jcmVhdGVEZWxheShVdGlscy5NQVhfRFVSQVRJT04pO1xuICAgICAgdGhpcy5fZ2FpbnNbcHJvcGVydHldID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgfVxuICB9XG4gIHRoaXMuX2ludmVydGVycy5yaWdodCA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9pbnZlcnRlcnMuZG93biA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9pbnZlcnRlcnMuYmFjayA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuXG4gIC8vIEluaXRpYWxpemUgbG93cGFzcyBmaWx0ZXIuXG4gIHRoaXMuX2xvd3Bhc3MudHlwZSA9ICdsb3dwYXNzJztcbiAgdGhpcy5fbG93cGFzcy5mcmVxdWVuY3kudmFsdWUgPSBVdGlscy5ERUZBVUxUX1JFRkxFQ1RJT05fQ1VUT0ZGX0ZSRVFVRU5DWTtcbiAgdGhpcy5fbG93cGFzcy5RLnZhbHVlID0gMDtcblxuICAvLyBJbml0aWFsaXplIGVuY29kZXIgZGlyZWN0aW9ucywgc2V0IGRlbGF5IHRpbWVzIGFuZCBnYWlucyB0byAwLlxuICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBVdGlscy5ERUZBVUxUX1JFRkxFQ1RJT05fQ09FRkZJQ0lFTlRTKSB7XG4gICAgaWYgKFV0aWxzLkRFRkFVTFRfUkVGTEVDVElPTl9DT0VGRklDSUVOVFNcbiAgICAgICAgLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgdGhpcy5fZGVsYXlzW3Byb3BlcnR5XS5kZWxheVRpbWUudmFsdWUgPSAwO1xuICAgICAgdGhpcy5fZ2FpbnNbcHJvcGVydHldLmdhaW4udmFsdWUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgaW52ZXJ0ZXJzIGZvciBvcHBvc2l0ZSB3YWxscyAoJ3JpZ2h0JywgJ2Rvd24nLCAnYmFjaycgb25seSkuXG4gIHRoaXMuX2ludmVydGVycy5yaWdodC5nYWluLnZhbHVlID0gLTE7XG4gIHRoaXMuX2ludmVydGVycy5kb3duLmdhaW4udmFsdWUgPSAtMTtcbiAgdGhpcy5faW52ZXJ0ZXJzLmJhY2suZ2Fpbi52YWx1ZSA9IC0xO1xuXG4gIC8vIENvbm5lY3Qgbm9kZXMuXG4gIHRoaXMuaW5wdXQuY29ubmVjdCh0aGlzLl9sb3dwYXNzKTtcbiAgZm9yIChsZXQgcHJvcGVydHkgaW4gVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX0NPRUZGSUNJRU5UUykge1xuICAgIGlmIChVdGlscy5ERUZBVUxUX1JFRkxFQ1RJT05fQ09FRkZJQ0lFTlRTXG4gICAgICAgIC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgIHRoaXMuX2xvd3Bhc3MuY29ubmVjdCh0aGlzLl9kZWxheXNbcHJvcGVydHldKTtcbiAgICAgIHRoaXMuX2RlbGF5c1twcm9wZXJ0eV0uY29ubmVjdCh0aGlzLl9nYWluc1twcm9wZXJ0eV0pO1xuICAgICAgdGhpcy5fZ2FpbnNbcHJvcGVydHldLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAwKTtcbiAgICB9XG4gIH1cblxuICAvLyBDb25uZWN0IGdhaW5zIHRvIGFtYmlzb25pYyBjaGFubmVsIG91dHB1dC5cbiAgLy8gTGVmdDogWzEgMSAwIDBdXG4gIC8vIFJpZ2h0OiBbMSAtMSAwIDBdXG4gIC8vIFVwOiBbMSAwIDEgMF1cbiAgLy8gRG93bjogWzEgMCAtMSAwXVxuICAvLyBGcm9udDogWzEgMCAwIDFdXG4gIC8vIEJhY2s6IFsxIDAgMCAtMV1cbiAgdGhpcy5fZ2FpbnMubGVmdC5jb25uZWN0KHRoaXMuX21lcmdlciwgMCwgMSk7XG5cbiAgdGhpcy5fZ2FpbnMucmlnaHQuY29ubmVjdCh0aGlzLl9pbnZlcnRlcnMucmlnaHQpO1xuICB0aGlzLl9pbnZlcnRlcnMucmlnaHQuY29ubmVjdCh0aGlzLl9tZXJnZXIsIDAsIDEpO1xuXG4gIHRoaXMuX2dhaW5zLnVwLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAyKTtcblxuICB0aGlzLl9nYWlucy5kb3duLmNvbm5lY3QodGhpcy5faW52ZXJ0ZXJzLmRvd24pO1xuICB0aGlzLl9pbnZlcnRlcnMuZG93bi5jb25uZWN0KHRoaXMuX21lcmdlciwgMCwgMik7XG5cbiAgdGhpcy5fZ2FpbnMuZnJvbnQuY29ubmVjdCh0aGlzLl9tZXJnZXIsIDAsIDMpO1xuXG4gIHRoaXMuX2dhaW5zLmJhY2suY29ubmVjdCh0aGlzLl9pbnZlcnRlcnMuYmFjayk7XG4gIHRoaXMuX2ludmVydGVycy5iYWNrLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAzKTtcbiAgdGhpcy5fbWVyZ2VyLmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuXG4gIC8vIEluaXRpYWxpemUuXG4gIHRoaXMuX2xpc3RlbmVyUG9zaXRpb24gPSBvcHRpb25zLmxpc3RlbmVyUG9zaXRpb247XG4gIHRoaXMuc2V0Um9vbVByb3BlcnRpZXMob3B0aW9ucy5kaW1lbnNpb25zLCBvcHRpb25zLmNvZWZmaWNpZW50cyk7XG59XG5cblxuLyoqXG4gKiBTZXQgdGhlIGxpc3RlbmVyJ3MgcG9zaXRpb24gKGluIG1ldGVycyksXG4gKiB3aGVyZSBbMCwwLDBdIGlzIHRoZSBjZW50ZXIgb2YgdGhlIHJvb20uXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqIEBwYXJhbSB7TnVtYmVyfSB6XG4gKi9cbkVhcmx5UmVmbGVjdGlvbnMucHJvdG90eXBlLnNldExpc3RlbmVyUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5LCB6KSB7XG4gIC8vIEFzc2lnbiBsaXN0ZW5lciBwb3NpdGlvbi5cbiAgdGhpcy5fbGlzdGVuZXJQb3NpdGlvbiA9IFt4LCB5LCB6XTtcblxuICAvLyBEZXRlcm1pbmUgZGlzdGFuY2VzIHRvIGVhY2ggd2FsbC5cbiAgbGV0IGRpc3RhbmNlcyA9IHtcbiAgICBsZWZ0OiBVdGlscy5ERUZBVUxUX1JFRkxFQ1RJT05fTVVMVElQTElFUiAqIE1hdGgubWF4KDAsXG4gICAgICB0aGlzLl9oYWxmRGltZW5zaW9ucy53aWR0aCArIHgpICsgVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX01JTl9ESVNUQU5DRSxcbiAgICByaWdodDogVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX01VTFRJUExJRVIgKiBNYXRoLm1heCgwLFxuICAgICAgdGhpcy5faGFsZkRpbWVuc2lvbnMud2lkdGggLSB4KSArIFV0aWxzLkRFRkFVTFRfUkVGTEVDVElPTl9NSU5fRElTVEFOQ0UsXG4gICAgZnJvbnQ6IFV0aWxzLkRFRkFVTFRfUkVGTEVDVElPTl9NVUxUSVBMSUVSICogTWF0aC5tYXgoMCxcbiAgICAgIHRoaXMuX2hhbGZEaW1lbnNpb25zLmRlcHRoICsgeikgKyBVdGlscy5ERUZBVUxUX1JFRkxFQ1RJT05fTUlOX0RJU1RBTkNFLFxuICAgIGJhY2s6IFV0aWxzLkRFRkFVTFRfUkVGTEVDVElPTl9NVUxUSVBMSUVSICogTWF0aC5tYXgoMCxcbiAgICAgIHRoaXMuX2hhbGZEaW1lbnNpb25zLmRlcHRoIC0geikgKyBVdGlscy5ERUZBVUxUX1JFRkxFQ1RJT05fTUlOX0RJU1RBTkNFLFxuICAgIGRvd246IFV0aWxzLkRFRkFVTFRfUkVGTEVDVElPTl9NVUxUSVBMSUVSICogTWF0aC5tYXgoMCxcbiAgICAgIHRoaXMuX2hhbGZEaW1lbnNpb25zLmhlaWdodCArIHkpICsgVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX01JTl9ESVNUQU5DRSxcbiAgICB1cDogVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX01VTFRJUExJRVIgKiBNYXRoLm1heCgwLFxuICAgICAgdGhpcy5faGFsZkRpbWVuc2lvbnMuaGVpZ2h0IC0geSkgKyBVdGlscy5ERUZBVUxUX1JFRkxFQ1RJT05fTUlOX0RJU1RBTkNFLFxuICB9O1xuXG4gIC8vIEFzc2lnbiBkZWxheSAmIGF0dGVudWF0aW9uIHZhbHVlcyB1c2luZyBkaXN0YW5jZXMuXG4gIGZvciAobGV0IHByb3BlcnR5IGluIFV0aWxzLkRFRkFVTFRfUkVGTEVDVElPTl9DT0VGRklDSUVOVFMpIHtcbiAgICBpZiAoVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX0NPRUZGSUNJRU5UU1xuICAgICAgICAuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAvLyBDb21wdXRlIGFuZCBhc3NpZ24gZGVsYXkgKGluIHNlY29uZHMpLlxuICAgICAgbGV0IGRlbGF5SW5TZWNzID0gZGlzdGFuY2VzW3Byb3BlcnR5XSAvIHRoaXMuc3BlZWRPZlNvdW5kO1xuICAgICAgdGhpcy5fZGVsYXlzW3Byb3BlcnR5XS5kZWxheVRpbWUudmFsdWUgPSBkZWxheUluU2VjcztcblxuICAgICAgLy8gQ29tcHV0ZSBhbmQgYXNzaWduIGdhaW4sIHVzZXMgbG9nYXJpdGhtaWMgcm9sbG9mZjogXCJnID0gUiAvIChkICsgMSlcIlxuICAgICAgbGV0IGF0dGVudWF0aW9uID0gdGhpcy5fY29lZmZpY2llbnRzW3Byb3BlcnR5XSAvIGRpc3RhbmNlc1twcm9wZXJ0eV07XG4gICAgICB0aGlzLl9nYWluc1twcm9wZXJ0eV0uZ2Fpbi52YWx1ZSA9IGF0dGVudWF0aW9uO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKipcbiAqIFNldCB0aGUgcm9vbSdzIHByb3BlcnRpZXMgd2hpY2ggZGV0ZXJtaW5lcyB0aGUgY2hhcmFjdGVyaXN0aWNzIG9mXG4gKiByZWZsZWN0aW9ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkaW1lbnNpb25zXG4gKiBSb29tIGRpbWVuc2lvbnMgKGluIG1ldGVycykuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfUk9PTV9ESU1FTlNJT05TIERFRkFVTFRfUk9PTV9ESU1FTlNJT05TfS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb2VmZmljaWVudHNcbiAqIEZyZXF1ZW5jeS1pbmRlcGVuZGVudCByZWZsZWN0aW9uIGNvZWZmcyBwZXIgd2FsbC4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9SRUZMRUNUSU9OX0NPRUZGSUNJRU5UU1xuICogREVGQVVMVF9SRUZMRUNUSU9OX0NPRUZGSUNJRU5UU30uXG4gKi9cbkVhcmx5UmVmbGVjdGlvbnMucHJvdG90eXBlLnNldFJvb21Qcm9wZXJ0aWVzID0gZnVuY3Rpb24oZGltZW5zaW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29lZmZpY2llbnRzKSB7XG4gIGlmIChkaW1lbnNpb25zID09IHVuZGVmaW5lZCkge1xuICAgIGRpbWVuc2lvbnMgPSB7fTtcbiAgICBPYmplY3QuYXNzaWduKGRpbWVuc2lvbnMsIFV0aWxzLkRFRkFVTFRfUk9PTV9ESU1FTlNJT05TKTtcbiAgfVxuICBpZiAoY29lZmZpY2llbnRzID09IHVuZGVmaW5lZCkge1xuICAgIGNvZWZmaWNpZW50cyA9IHt9O1xuICAgIE9iamVjdC5hc3NpZ24oY29lZmZpY2llbnRzLCBVdGlscy5ERUZBVUxUX1JFRkxFQ1RJT05fQ09FRkZJQ0lFTlRTKTtcbiAgfVxuICB0aGlzLl9jb2VmZmljaWVudHMgPSBjb2VmZmljaWVudHM7XG5cbiAgLy8gU2FuaXRpemUgZGltZW5zaW9ucyBhbmQgc3RvcmUgaGFsZi1kaW1lbnNpb25zLlxuICB0aGlzLl9oYWxmRGltZW5zaW9ucyA9IHt9O1xuICB0aGlzLl9oYWxmRGltZW5zaW9ucy53aWR0aCA9IGRpbWVuc2lvbnMud2lkdGggKiAwLjU7XG4gIHRoaXMuX2hhbGZEaW1lbnNpb25zLmhlaWdodCA9IGRpbWVuc2lvbnMuaGVpZ2h0ICogMC41O1xuICB0aGlzLl9oYWxmRGltZW5zaW9ucy5kZXB0aCA9IGRpbWVuc2lvbnMuZGVwdGggKiAwLjU7XG5cbiAgLy8gVXBkYXRlIGxpc3RlbmVyIHBvc2l0aW9uIHdpdGggbmV3IHJvb20gcHJvcGVydGllcy5cbiAgdGhpcy5zZXRMaXN0ZW5lclBvc2l0aW9uKHRoaXMuX2xpc3RlbmVyUG9zaXRpb25bMF0sXG4gICAgdGhpcy5fbGlzdGVuZXJQb3NpdGlvblsxXSwgdGhpcy5fbGlzdGVuZXJQb3NpdGlvblsyXSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRWFybHlSZWZsZWN0aW9ucztcblxuXG4vKioqLyB9KSxcbi8qIDEwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlIFByaW1hcnkgbmFtZXNwYWNlIGZvciBSZXNvbmFuY2VBdWRpbyBsaWJyYXJ5LlxuICogQGF1dGhvciBBbmRyZXcgQWxsZW4gPGJpdGxsYW1hQGdvb2dsZS5jb20+XG4gKi9cblxuIFxuXG5cbi8vIE1haW4gbW9kdWxlLlxuZXhwb3J0cy5SZXNvbmFuY2VBdWRpbyA9IF9fd2VicGFja19yZXF1aXJlX18oMTEpO1xuXG5cbi8vIFRlc3RhYmxlIFN1Ym1vZHVsZXMuXG5leHBvcnRzLlJlc29uYW5jZUF1ZGlvLkF0dGVudWF0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcbmV4cG9ydHMuUmVzb25hbmNlQXVkaW8uRGlyZWN0aXZpdHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuZXhwb3J0cy5SZXNvbmFuY2VBdWRpby5FYXJseVJlZmxlY3Rpb25zID0gX193ZWJwYWNrX3JlcXVpcmVfXyg5KTtcbmV4cG9ydHMuUmVzb25hbmNlQXVkaW8uRW5jb2RlciA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5leHBvcnRzLlJlc29uYW5jZUF1ZGlvLkxhdGVSZWZsZWN0aW9ucyA9IF9fd2VicGFja19yZXF1aXJlX18oOCk7XG5leHBvcnRzLlJlc29uYW5jZUF1ZGlvLkxpc3RlbmVyID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcbmV4cG9ydHMuUmVzb25hbmNlQXVkaW8uUm9vbSA9IF9fd2VicGFja19yZXF1aXJlX18oNyk7XG5leHBvcnRzLlJlc29uYW5jZUF1ZGlvLlNvdXJjZSA9IF9fd2VicGFja19yZXF1aXJlX18oNCk7XG5leHBvcnRzLlJlc29uYW5jZUF1ZGlvLlRhYmxlcyA9IF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5leHBvcnRzLlJlc29uYW5jZUF1ZGlvLlV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbmV4cG9ydHMuUmVzb25hbmNlQXVkaW8uVmVyc2lvbiA9IF9fd2VicGFja19yZXF1aXJlX18oMTMpO1xuXG5cbi8qKiovIH0pLFxuLyogMTEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGUgUmVzb25hbmNlQXVkaW8gbGlicmFyeSBuYW1lIHNwYWNlIGFuZCBjb21tb24gdXRpbGl0aWVzLlxuICogQGF1dGhvciBBbmRyZXcgQWxsZW4gPGJpdGxsYW1hQGdvb2dsZS5jb20+XG4gKi9cblxuXG5cblxuLy8gSW50ZXJuYWwgZGVwZW5kZW5jaWVzLlxuY29uc3QgTGlzdGVuZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xuY29uc3QgU291cmNlID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KTtcbmNvbnN0IFJvb20gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpO1xuY29uc3QgRW5jb2RlciA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5jb25zdCBVdGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqXG4gKiBAY2xhc3MgUmVzb25hbmNlQXVkaW9cbiAqIEBkZXNjcmlwdGlvbiBNYWluIGNsYXNzIGZvciBtYW5hZ2luZyBzb3VyY2VzLCByb29tIGFuZCBsaXN0ZW5lciBtb2RlbHMuXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY29udGV4dFxuICogQXNzb2NpYXRlZCB7QGxpbmtcbmh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb0NvbnRleHQgQXVkaW9Db250ZXh0fS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5hbWJpc29uaWNPcmRlclxuICogRGVzaXJlZCBhbWJpc29uaWMgT3JkZXIuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfQU1CSVNPTklDX09SREVSIERFRkFVTFRfQU1CSVNPTklDX09SREVSfS5cbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBvcHRpb25zLmxpc3RlbmVyUG9zaXRpb25cbiAqIFRoZSBsaXN0ZW5lcidzIGluaXRpYWwgcG9zaXRpb24gKGluIG1ldGVycyksIHdoZXJlIG9yaWdpbiBpcyB0aGUgY2VudGVyIG9mXG4gKiB0aGUgcm9vbS4gRGVmYXVsdHMgdG8ge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1BPU0lUSU9OIERFRkFVTFRfUE9TSVRJT059LlxuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IG9wdGlvbnMubGlzdGVuZXJGb3J3YXJkXG4gKiBUaGUgbGlzdGVuZXIncyBpbml0aWFsIGZvcndhcmQgdmVjdG9yLlxuICogRGVmYXVsdHMgdG8ge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX0ZPUldBUkQgREVGQVVMVF9GT1JXQVJEfS5cbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBvcHRpb25zLmxpc3RlbmVyVXBcbiAqIFRoZSBsaXN0ZW5lcidzIGluaXRpYWwgdXAgdmVjdG9yLlxuICogRGVmYXVsdHMgdG8ge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX1VQIERFRkFVTFRfVVB9LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuZGltZW5zaW9ucyBSb29tIGRpbWVuc2lvbnMgKGluIG1ldGVycykuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfUk9PTV9ESU1FTlNJT05TIERFRkFVTFRfUk9PTV9ESU1FTlNJT05TfS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLm1hdGVyaWFscyBOYW1lZCBhY291c3RpYyBtYXRlcmlhbHMgcGVyIHdhbGwuXG4gKiBEZWZhdWx0cyB0byB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfUk9PTV9NQVRFUklBTFMgREVGQVVMVF9ST09NX01BVEVSSUFMU30uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5zcGVlZE9mU291bmRcbiAqIChpbiBtZXRlcnMvc2Vjb25kKS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9TUEVFRF9PRl9TT1VORCBERUZBVUxUX1NQRUVEX09GX1NPVU5EfS5cbiAqL1xuZnVuY3Rpb24gUmVzb25hbmNlQXVkaW8oY29udGV4dCwgb3B0aW9ucykge1xuICAvLyBQdWJsaWMgdmFyaWFibGVzLlxuICAvKipcbiAgICogQmluYXVyYWxseS1yZW5kZXJlZCBzdGVyZW8gKDItY2hhbm5lbCkgb3V0cHV0IHtAbGlua1xuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQXVkaW9Ob2RlIEF1ZGlvTm9kZX0uXG4gICAqIEBtZW1iZXIge0F1ZGlvTm9kZX0gb3V0cHV0XG4gICAqIEBtZW1iZXJvZiBSZXNvbmFuY2VBdWRpb1xuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIC8qKlxuICAgKiBBbWJpc29uaWMgKG11bHRpY2hhbm5lbCkgaW5wdXQge0BsaW5rXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb05vZGUgQXVkaW9Ob2RlfVxuICAgKiAoRm9yIHJlbmRlcmluZyBpbnB1dCBzb3VuZGZpZWxkcykuXG4gICAqIEBtZW1iZXIge0F1ZGlvTm9kZX0gYW1iaXNvbmljSW5wdXRcbiAgICogQG1lbWJlcm9mIFJlc29uYW5jZUF1ZGlvXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgLyoqXG4gICAqIEFtYmlzb25pYyAobXVsdGljaGFubmVsKSBvdXRwdXQge0BsaW5rXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb05vZGUgQXVkaW9Ob2RlfVxuICAgKiAoRm9yIGFsbG93aW5nIGV4dGVybmFsIHJlbmRlcmluZyAvIHBvc3QtcHJvY2Vzc2luZykuXG4gICAqIEBtZW1iZXIge0F1ZGlvTm9kZX0gYW1iaXNvbmljT3V0cHV0XG4gICAqIEBtZW1iZXJvZiBSZXNvbmFuY2VBdWRpb1xuICAgKiBAaW5zdGFuY2VcbiAgICovXG5cbiAgLy8gVXNlIGRlZmF1bHRzIGZvciB1bmRlZmluZWQgYXJndW1lbnRzLlxuICBpZiAob3B0aW9ucyA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKG9wdGlvbnMuYW1iaXNvbmljT3JkZXIgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5hbWJpc29uaWNPcmRlciA9IFV0aWxzLkRFRkFVTFRfQU1CSVNPTklDX09SREVSO1xuICB9XG4gIGlmIChvcHRpb25zLmxpc3RlbmVyUG9zaXRpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5saXN0ZW5lclBvc2l0aW9uID0gVXRpbHMuREVGQVVMVF9QT1NJVElPTi5zbGljZSgpO1xuICB9XG4gIGlmIChvcHRpb25zLmxpc3RlbmVyRm9yd2FyZCA9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLmxpc3RlbmVyRm9yd2FyZCA9IFV0aWxzLkRFRkFVTFRfRk9SV0FSRC5zbGljZSgpO1xuICB9XG4gIGlmIChvcHRpb25zLmxpc3RlbmVyVXAgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5saXN0ZW5lclVwID0gVXRpbHMuREVGQVVMVF9VUC5zbGljZSgpO1xuICB9XG4gIGlmIChvcHRpb25zLmRpbWVuc2lvbnMgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5kaW1lbnNpb25zID0ge307XG4gICAgT2JqZWN0LmFzc2lnbihvcHRpb25zLmRpbWVuc2lvbnMsIFV0aWxzLkRFRkFVTFRfUk9PTV9ESU1FTlNJT05TKTtcbiAgfVxuICBpZiAob3B0aW9ucy5tYXRlcmlhbHMgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5tYXRlcmlhbHMgPSB7fTtcbiAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMubWF0ZXJpYWxzLCBVdGlscy5ERUZBVUxUX1JPT01fTUFURVJJQUxTKTtcbiAgfVxuICBpZiAob3B0aW9ucy5zcGVlZE9mU291bmQgPT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5zcGVlZE9mU291bmQgPSBVdGlscy5ERUZBVUxUX1NQRUVEX09GX1NPVU5EO1xuICB9XG5cbiAgLy8gQ3JlYXRlIG1lbWJlciBzdWJtb2R1bGVzLlxuICB0aGlzLl9hbWJpc29uaWNPcmRlciA9IEVuY29kZXIudmFsaWRhdGVBbWJpc29uaWNPcmRlcihvcHRpb25zLmFtYmlzb25pY09yZGVyKTtcbiAgdGhpcy5fc291cmNlcyA9IFtdO1xuICB0aGlzLl9yb29tID0gbmV3IFJvb20oY29udGV4dCwge1xuICAgIGxpc3RlbmVyUG9zaXRpb246IG9wdGlvbnMubGlzdGVuZXJQb3NpdGlvbixcbiAgICBkaW1lbnNpb25zOiBvcHRpb25zLmRpbWVuc2lvbnMsXG4gICAgbWF0ZXJpYWxzOiBvcHRpb25zLm1hdGVyaWFscyxcbiAgICBzcGVlZE9mU291bmQ6IG9wdGlvbnMuc3BlZWRPZlNvdW5kLFxuICB9KTtcbiAgdGhpcy5fbGlzdGVuZXIgPSBuZXcgTGlzdGVuZXIoY29udGV4dCwge1xuICAgIGFtYmlzb25pY09yZGVyOiBvcHRpb25zLmFtYmlzb25pY09yZGVyLFxuICAgIHBvc2l0aW9uOiBvcHRpb25zLmxpc3RlbmVyUG9zaXRpb24sXG4gICAgZm9yd2FyZDogb3B0aW9ucy5saXN0ZW5lckZvcndhcmQsXG4gICAgdXA6IG9wdGlvbnMubGlzdGVuZXJVcCxcbiAgfSk7XG5cbiAgLy8gQ3JlYXRlIGF1eGlsbGFyeSBhdWRpbyBub2Rlcy5cbiAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMub3V0cHV0ID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuYW1iaXNvbmljT3V0cHV0ID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuYW1iaXNvbmljSW5wdXQgPSB0aGlzLl9saXN0ZW5lci5pbnB1dDtcblxuICAvLyBDb25uZWN0IGF1ZGlvIGdyYXBoLlxuICB0aGlzLl9yb29tLm91dHB1dC5jb25uZWN0KHRoaXMuX2xpc3RlbmVyLmlucHV0KTtcbiAgdGhpcy5fbGlzdGVuZXIub3V0cHV0LmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuICB0aGlzLl9saXN0ZW5lci5hbWJpc29uaWNPdXRwdXQuY29ubmVjdCh0aGlzLmFtYmlzb25pY091dHB1dCk7XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgc291cmNlIGZvciB0aGUgc2NlbmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IG9wdGlvbnMucG9zaXRpb25cbiAqIFRoZSBzb3VyY2UncyBpbml0aWFsIHBvc2l0aW9uIChpbiBtZXRlcnMpLCB3aGVyZSBvcmlnaW4gaXMgdGhlIGNlbnRlciBvZlxuICogdGhlIHJvb20uIERlZmF1bHRzIHRvIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9QT1NJVElPTiBERUZBVUxUX1BPU0lUSU9OfS5cbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBvcHRpb25zLmZvcndhcmRcbiAqIFRoZSBzb3VyY2UncyBpbml0aWFsIGZvcndhcmQgdmVjdG9yLiBEZWZhdWx0cyB0b1xuICoge0BsaW5rY29kZSBVdGlscy5ERUZBVUxUX0ZPUldBUkQgREVGQVVMVF9GT1JXQVJEfS5cbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBvcHRpb25zLnVwXG4gKiBUaGUgc291cmNlJ3MgaW5pdGlhbCB1cCB2ZWN0b3IuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfVVAgREVGQVVMVF9VUH0uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5taW5EaXN0YW5jZVxuICogTWluLiBkaXN0YW5jZSAoaW4gbWV0ZXJzKS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9NSU5fRElTVEFOQ0UgREVGQVVMVF9NSU5fRElTVEFOQ0V9LlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubWF4RGlzdGFuY2VcbiAqIE1heC4gZGlzdGFuY2UgKGluIG1ldGVycykuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfTUFYX0RJU1RBTkNFIERFRkFVTFRfTUFYX0RJU1RBTkNFfS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLnJvbGxvZmZcbiAqIFJvbGxvZmYgbW9kZWwgdG8gdXNlLCBjaG9zZW4gZnJvbSBvcHRpb25zIGluXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkFUVEVOVUFUSU9OX1JPTExPRkZTIEFUVEVOVUFUSU9OX1JPTExPRkZTfS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9BVFRFTlVBVElPTl9ST0xMT0ZGIERFRkFVTFRfQVRURU5VQVRJT05fUk9MTE9GRn0uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5nYWluIElucHV0IGdhaW4gKGxpbmVhcikuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfU09VUkNFX0dBSU4gREVGQVVMVF9TT1VSQ0VfR0FJTn0uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5hbHBoYSBEaXJlY3Rpdml0eSBhbHBoYS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9ESVJFQ1RJVklUWV9BTFBIQSBERUZBVUxUX0RJUkVDVElWSVRZX0FMUEhBfS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnNoYXJwbmVzcyBEaXJlY3Rpdml0eSBzaGFycG5lc3MuIERlZmF1bHRzIHRvXG4gKiB7QGxpbmtjb2RlIFV0aWxzLkRFRkFVTFRfRElSRUNUSVZJVFlfU0hBUlBORVNTXG4gKiBERUZBVUxUX0RJUkVDVElWSVRZX1NIQVJQTkVTU30uXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5zb3VyY2VXaWR0aFxuICogU291cmNlIHdpZHRoIChpbiBkZWdyZWVzKS4gV2hlcmUgMCBkZWdyZWVzIGlzIGEgcG9pbnQgc291cmNlIGFuZCAzNjAgZGVncmVlc1xuICogaXMgYW4gb21uaWRpcmVjdGlvbmFsIHNvdXJjZS4gRGVmYXVsdHMgdG9cbiAqIHtAbGlua2NvZGUgVXRpbHMuREVGQVVMVF9TT1VSQ0VfV0lEVEggREVGQVVMVF9TT1VSQ0VfV0lEVEh9LlxuICogQHJldHVybiB7U291cmNlfVxuICovXG5SZXNvbmFuY2VBdWRpby5wcm90b3R5cGUuY3JlYXRlU291cmNlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAvLyBDcmVhdGUgYSBzb3VyY2UgYW5kIHB1c2ggaXQgdG8gdGhlIGludGVybmFsIHNvdXJjZXMgYXJyYXksIHJldHVybmluZ1xuICAvLyB0aGUgb2JqZWN0J3MgcmVmZXJlbmNlIHRvIHRoZSB1c2VyLlxuICBsZXQgc291cmNlID0gbmV3IFNvdXJjZSh0aGlzLCBvcHRpb25zKTtcbiAgdGhpcy5fc291cmNlc1t0aGlzLl9zb3VyY2VzLmxlbmd0aF0gPSBzb3VyY2U7XG4gIHJldHVybiBzb3VyY2U7XG59O1xuXG5cbi8qKlxuICogU2V0IHRoZSBzY2VuZSdzIGRlc2lyZWQgYW1iaXNvbmljIG9yZGVyLlxuICogQHBhcmFtIHtOdW1iZXJ9IGFtYmlzb25pY09yZGVyIERlc2lyZWQgYW1iaXNvbmljIG9yZGVyLlxuICovXG5SZXNvbmFuY2VBdWRpby5wcm90b3R5cGUuc2V0QW1iaXNvbmljT3JkZXIgPSBmdW5jdGlvbihhbWJpc29uaWNPcmRlcikge1xuICB0aGlzLl9hbWJpc29uaWNPcmRlciA9IEVuY29kZXIudmFsaWRhdGVBbWJpc29uaWNPcmRlcihhbWJpc29uaWNPcmRlcik7XG59O1xuXG5cbi8qKlxuICogU2V0IHRoZSByb29tJ3MgZGltZW5zaW9ucyBhbmQgd2FsbCBtYXRlcmlhbHMuXG4gKiBAcGFyYW0ge09iamVjdH0gZGltZW5zaW9ucyBSb29tIGRpbWVuc2lvbnMgKGluIG1ldGVycykuXG4gKiBAcGFyYW0ge09iamVjdH0gbWF0ZXJpYWxzIE5hbWVkIGFjb3VzdGljIG1hdGVyaWFscyBwZXIgd2FsbC5cbiAqL1xuUmVzb25hbmNlQXVkaW8ucHJvdG90eXBlLnNldFJvb21Qcm9wZXJ0aWVzID0gZnVuY3Rpb24oZGltZW5zaW9ucywgbWF0ZXJpYWxzKSB7XG4gIHRoaXMuX3Jvb20uc2V0UHJvcGVydGllcyhkaW1lbnNpb25zLCBtYXRlcmlhbHMpO1xufTtcblxuXG4vKipcbiAqIFNldCB0aGUgbGlzdGVuZXIncyBwb3NpdGlvbiAoaW4gbWV0ZXJzKSwgd2hlcmUgb3JpZ2luIGlzIHRoZSBjZW50ZXIgb2ZcbiAqIHRoZSByb29tLlxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcGFyYW0ge051bWJlcn0gelxuICovXG5SZXNvbmFuY2VBdWRpby5wcm90b3R5cGUuc2V0TGlzdGVuZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHksIHopIHtcbiAgLy8gVXBkYXRlIGxpc3RlbmVyIHBvc2l0aW9uLlxuICB0aGlzLl9saXN0ZW5lci5wb3NpdGlvblswXSA9IHg7XG4gIHRoaXMuX2xpc3RlbmVyLnBvc2l0aW9uWzFdID0geTtcbiAgdGhpcy5fbGlzdGVuZXIucG9zaXRpb25bMl0gPSB6O1xuICB0aGlzLl9yb29tLnNldExpc3RlbmVyUG9zaXRpb24oeCwgeSwgeik7XG5cbiAgLy8gVXBkYXRlIHNvdXJjZXMgd2l0aCBuZXcgbGlzdGVuZXIgcG9zaXRpb24uXG4gIHRoaXMuX3NvdXJjZXMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgIGVsZW1lbnQuX3VwZGF0ZSgpO1xuICB9KTtcbn07XG5cblxuLyoqXG4gKiBTZXQgdGhlIHNvdXJjZSdzIG9yaWVudGF0aW9uIHVzaW5nIGZvcndhcmQgYW5kIHVwIHZlY3RvcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gZm9yd2FyZFhcbiAqIEBwYXJhbSB7TnVtYmVyfSBmb3J3YXJkWVxuICogQHBhcmFtIHtOdW1iZXJ9IGZvcndhcmRaXG4gKiBAcGFyYW0ge051bWJlcn0gdXBYXG4gKiBAcGFyYW0ge051bWJlcn0gdXBZXG4gKiBAcGFyYW0ge051bWJlcn0gdXBaXG4gKi9cblJlc29uYW5jZUF1ZGlvLnByb3RvdHlwZS5zZXRMaXN0ZW5lck9yaWVudGF0aW9uID0gZnVuY3Rpb24oZm9yd2FyZFgsIGZvcndhcmRZLFxuICBmb3J3YXJkWiwgdXBYLCB1cFksIHVwWikge1xuICB0aGlzLl9saXN0ZW5lci5zZXRPcmllbnRhdGlvbihmb3J3YXJkWCwgZm9yd2FyZFksIGZvcndhcmRaLCB1cFgsIHVwWSwgdXBaKTtcbn07XG5cblxuLyoqXG4gKiBTZXQgdGhlIGxpc3RlbmVyJ3MgcG9zaXRpb24gYW5kIG9yaWVudGF0aW9uIHVzaW5nIGEgVGhyZWUuanMgTWF0cml4NCBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gbWF0cml4XG4gKiBUaGUgVGhyZWUuanMgTWF0cml4NCBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBsaXN0ZW5lcidzIHdvcmxkIHRyYW5zZm9ybS5cbiAqL1xuUmVzb25hbmNlQXVkaW8ucHJvdG90eXBlLnNldExpc3RlbmVyRnJvbU1hdHJpeCA9IGZ1bmN0aW9uKG1hdHJpeCkge1xuICB0aGlzLl9saXN0ZW5lci5zZXRGcm9tTWF0cml4KG1hdHJpeCk7XG5cbiAgLy8gVXBkYXRlIHRoZSByZXN0IG9mIHRoZSBzY2VuZSB1c2luZyBuZXcgbGlzdGVuZXIgcG9zaXRpb24uXG4gIHRoaXMuc2V0TGlzdGVuZXJQb3NpdGlvbih0aGlzLl9saXN0ZW5lci5wb3NpdGlvblswXSxcbiAgICB0aGlzLl9saXN0ZW5lci5wb3NpdGlvblsxXSwgdGhpcy5fbGlzdGVuZXIucG9zaXRpb25bMl0pO1xufTtcblxuXG4vKipcbiAqIFNldCB0aGUgc3BlZWQgb2Ygc291bmQuXG4gKiBAcGFyYW0ge051bWJlcn0gc3BlZWRPZlNvdW5kXG4gKi9cblJlc29uYW5jZUF1ZGlvLnByb3RvdHlwZS5zZXRTcGVlZE9mU291bmQgPSBmdW5jdGlvbihzcGVlZE9mU291bmQpIHtcbiAgdGhpcy5fcm9vbS5zcGVlZE9mU291bmQgPSBzcGVlZE9mU291bmQ7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb25hbmNlQXVkaW87XG5cblxuLyoqKi8gfSksXG4vKiAxMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG4oZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0cnVlKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0aTogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsOiBmYWxzZSxcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4vKioqKioqLyBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbi8qKioqKiovIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbi8qKioqKiovIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbi8qKioqKiovIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbi8qKioqKiovIFx0XHRcdH0pO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuLyoqKioqKi8gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuLyoqKioqKi8gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbi8qKioqKiovIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuLyoqKioqKi8gXHRcdHJldHVybiBnZXR0ZXI7XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlIE9tbml0b25lIGxpYnJhcnkgY29tbW9uIHV0aWxpdGllcy5cbiAqL1xuXG5cbi8qKlxuICogT21uaXRvbmUgbGlicmFyeSBsb2dnaW5nIGZ1bmN0aW9uLlxuICogQHBhcmFtIHthbnl9IE1lc3NhZ2UgdG8gYmUgcHJpbnRlZCBvdXQuXG4gKi9cbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIHdpbmRvdy5jb25zb2xlLmxvZy5hcHBseSh3aW5kb3cuY29uc29sZSwgW1xuICAgICclY1tPbW5pdG9uZV0lYyAnICsgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5qb2luKCcgJykgK1xuICAgICAgICAnICVjKEAnICsgcGVyZm9ybWFuY2Uubm93KCkudG9GaXhlZCgyKSArICdtcyknLFxuICAgICdiYWNrZ3JvdW5kOiAjQkJERUZCOyBjb2xvcjogI0ZGNTcyMjsgZm9udC13ZWlnaHQ6IDUwMCcsICdmb250LXdlaWdodDogMzAwJyxcbiAgICAnY29sb3I6ICNBQUEnLFxuICBdKTtcbn07XG5cblxuLyoqXG4gKiBPbW5pdG9uZSBsaWJyYXJ5IGVycm9yLXRocm93aW5nIGZ1bmN0aW9uLlxuICogQHBhcmFtIHthbnl9IE1lc3NhZ2UgdG8gYmUgcHJpbnRlZCBvdXQuXG4gKi9cbmV4cG9ydHMudGhyb3cgPSBmdW5jdGlvbigpIHtcbiAgd2luZG93LmNvbnNvbGUuZXJyb3IuYXBwbHkod2luZG93LmNvbnNvbGUsIFtcbiAgICAnJWNbT21uaXRvbmVdJWMgJyArIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignICcpICtcbiAgICAgICAgJyAlYyhAJyArIHBlcmZvcm1hbmNlLm5vdygpLnRvRml4ZWQoMikgKyAnbXMpJyxcbiAgICAnYmFja2dyb3VuZDogI0M2MjgyODsgY29sb3I6ICNGRkVCRUU7IGZvbnQtd2VpZ2h0OiA4MDAnLCAnZm9udC13ZWlnaHQ6IDQwMCcsXG4gICAgJ2NvbG9yOiAjQUFBJyxcbiAgXSk7XG5cbiAgdGhyb3cgbmV3IEVycm9yKGZhbHNlKTtcbn07XG5cblxuLy8gU3RhdGljIHRlbXAgc3RvcmFnZSBmb3IgbWF0cml4IGludmVyc2lvbi5cbmxldCBhMDA7XG5sZXQgYTAxO1xubGV0IGEwMjtcbmxldCBhMDM7XG5sZXQgYTEwO1xubGV0IGExMTtcbmxldCBhMTI7XG5sZXQgYTEzO1xubGV0IGEyMDtcbmxldCBhMjE7XG5sZXQgYTIyO1xubGV0IGEyMztcbmxldCBhMzA7XG5sZXQgYTMxO1xubGV0IGEzMjtcbmxldCBhMzM7XG5sZXQgYjAwO1xubGV0IGIwMTtcbmxldCBiMDI7XG5sZXQgYjAzO1xubGV0IGIwNDtcbmxldCBiMDU7XG5sZXQgYjA2O1xubGV0IGIwNztcbmxldCBiMDg7XG5sZXQgYjA5O1xubGV0IGIxMDtcbmxldCBiMTE7XG5sZXQgZGV0O1xuXG5cbi8qKlxuICogQSA0eDQgbWF0cml4IGludmVyc2lvbiB1dGlsaXR5LiBUaGlzIGRvZXMgbm90IGhhbmRsZSB0aGUgY2FzZSB3aGVuIHRoZVxuICogYXJndW1lbnRzIGFyZSBub3QgcHJvcGVyIDR4NCBtYXRyaWNlcy5cbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBvdXQgICBUaGUgaW52ZXJ0ZWQgcmVzdWx0LlxuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGEgICAgIFRoZSBzb3VyY2UgbWF0cml4LlxuICogQHJldHVybiB7RmxvYXQzMkFycmF5fSBvdXRcbiAqL1xuZXhwb3J0cy5pbnZlcnRNYXRyaXg0ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gIGEwMCA9IGFbMF07XG4gIGEwMSA9IGFbMV07XG4gIGEwMiA9IGFbMl07XG4gIGEwMyA9IGFbM107XG4gIGExMCA9IGFbNF07XG4gIGExMSA9IGFbNV07XG4gIGExMiA9IGFbNl07XG4gIGExMyA9IGFbN107XG4gIGEyMCA9IGFbOF07XG4gIGEyMSA9IGFbOV07XG4gIGEyMiA9IGFbMTBdO1xuICBhMjMgPSBhWzExXTtcbiAgYTMwID0gYVsxMl07XG4gIGEzMSA9IGFbMTNdO1xuICBhMzIgPSBhWzE0XTtcbiAgYTMzID0gYVsxNV07XG4gIGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMDtcbiAgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwO1xuICBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTA7XG4gIGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMTtcbiAgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExO1xuICBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTI7XG4gIGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMDtcbiAgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwO1xuICBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzA7XG4gIGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMTtcbiAgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxO1xuICBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzI7XG4gIGRldCA9IGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcblxuICBpZiAoIWRldCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZGV0ID0gMS4wIC8gZGV0O1xuICBvdXRbMF0gPSAoYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5KSAqIGRldDtcbiAgb3V0WzFdID0gKGEwMiAqIGIxMCAtIGEwMSAqIGIxMSAtIGEwMyAqIGIwOSkgKiBkZXQ7XG4gIG91dFsyXSA9IChhMzEgKiBiMDUgLSBhMzIgKiBiMDQgKyBhMzMgKiBiMDMpICogZGV0O1xuICBvdXRbM10gPSAoYTIyICogYjA0IC0gYTIxICogYjA1IC0gYTIzICogYjAzKSAqIGRldDtcbiAgb3V0WzRdID0gKGExMiAqIGIwOCAtIGExMCAqIGIxMSAtIGExMyAqIGIwNykgKiBkZXQ7XG4gIG91dFs1XSA9IChhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDcpICogZGV0O1xuICBvdXRbNl0gPSAoYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxKSAqIGRldDtcbiAgb3V0WzddID0gKGEyMCAqIGIwNSAtIGEyMiAqIGIwMiArIGEyMyAqIGIwMSkgKiBkZXQ7XG4gIG91dFs4XSA9IChhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDYpICogZGV0O1xuICBvdXRbOV0gPSAoYTAxICogYjA4IC0gYTAwICogYjEwIC0gYTAzICogYjA2KSAqIGRldDtcbiAgb3V0WzEwXSA9IChhMzAgKiBiMDQgLSBhMzEgKiBiMDIgKyBhMzMgKiBiMDApICogZGV0O1xuICBvdXRbMTFdID0gKGEyMSAqIGIwMiAtIGEyMCAqIGIwNCAtIGEyMyAqIGIwMCkgKiBkZXQ7XG4gIG91dFsxMl0gPSAoYTExICogYjA3IC0gYTEwICogYjA5IC0gYTEyICogYjA2KSAqIGRldDtcbiAgb3V0WzEzXSA9IChhMDAgKiBiMDkgLSBhMDEgKiBiMDcgKyBhMDIgKiBiMDYpICogZGV0O1xuICBvdXRbMTRdID0gKGEzMSAqIGIwMSAtIGEzMCAqIGIwMyAtIGEzMiAqIGIwMCkgKiBkZXQ7XG4gIG91dFsxNV0gPSAoYTIwICogYjAzIC0gYTIxICogYjAxICsgYTIyICogYjAwKSAqIGRldDtcblxuICByZXR1cm4gb3V0O1xufTtcblxuXG4vKipcbiAqIENoZWNrIGlmIGEgdmFsdWUgaXMgZGVmaW5lZCBpbiB0aGUgRU5VTSBkaWN0aW9uYXJ5LlxuICogQHBhcmFtIHtPYmplY3R9IGVudW1EaWN0aW9uYXJ5IC0gRU5VTSBkaWN0aW9uYXJ5LlxuICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBlbnRyeVZhbHVlIC0gYSB2YWx1ZSB0byBwcm9iZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydHMuaXNEZWZpbmVkRU5VTUVudHJ5ID0gZnVuY3Rpb24oZW51bURpY3Rpb25hcnksIGVudHJ5VmFsdWUpIHtcbiAgZm9yIChsZXQgZW51bUtleSBpbiBlbnVtRGljdGlvbmFyeSkge1xuICAgIGlmIChlbnRyeVZhbHVlID09PSBlbnVtRGljdGlvbmFyeVtlbnVtS2V5XSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIEJhc2VBdWRpb0NvbnRleHQuXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY29udGV4dCAtIEEgY29udGV4dCBvYmplY3QgdG8gYmUgY2hlY2tlZC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydHMuaXNBdWRpb0NvbnRleHQgPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gIC8vIFRPRE8oaG9jaCk6IFVwZGF0ZSB0aGlzIHdoZW4gQmFzZUF1ZGlvQ29udGV4dCBpcyBhdmFpbGFibGUgZm9yIGFsbFxuICAvLyBicm93c2Vycy5cbiAgcmV0dXJuIGNvbnRleHQgaW5zdGFuY2VvZiBBdWRpb0NvbnRleHQgfHxcbiAgICBjb250ZXh0IGluc3RhbmNlb2YgT2ZmbGluZUF1ZGlvQ29udGV4dDtcbn07XG5cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgdmFsaWQgQXVkaW9CdWZmZXIuXG4gKiBAcGFyYW0ge09iamVjdH0gYXVkaW9CdWZmZXIgQW4gQXVkaW9CdWZmZXIgb2JqZWN0IHRvIGJlIGNoZWNrZWQuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnRzLmlzQXVkaW9CdWZmZXIgPSBmdW5jdGlvbihhdWRpb0J1ZmZlcikge1xuICByZXR1cm4gYXVkaW9CdWZmZXIgaW5zdGFuY2VvZiBBdWRpb0J1ZmZlcjtcbn07XG5cblxuLyoqXG4gKiBQZXJmb3JtIGNoYW5uZWwtd2lzZSBtZXJnZSBvbiBtdWx0aXBsZSBBdWRpb0J1ZmZlcnMuIFRoZSBzYW1wbGUgcmF0ZSBhbmRcbiAqIHRoZSBsZW5ndGggb2YgYnVmZmVycyB0byBiZSBtZXJnZWQgbXVzdCBiZSBpZGVudGljYWwuXG4gKiBAcGFyYW0ge0Jhc2VBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEJhc2VBdWRpb0NvbnRleHQuXG4gKiBAcGFyYW0ge0F1ZGlvQnVmZmVyW119IGJ1ZmZlckxpc3QgLSBBbiBhcnJheSBvZiBBdWRpb0J1ZmZlcnMgdG8gYmUgbWVyZ2VkXG4gKiBjaGFubmVsLXdpc2UuXG4gKiBAcmV0dXJuIHtBdWRpb0J1ZmZlcn0gLSBBIHNpbmdsZSBtZXJnZWQgQXVkaW9CdWZmZXIuXG4gKi9cbmV4cG9ydHMubWVyZ2VCdWZmZXJMaXN0QnlDaGFubmVsID0gZnVuY3Rpb24oY29udGV4dCwgYnVmZmVyTGlzdCkge1xuICBjb25zdCBidWZmZXJMZW5ndGggPSBidWZmZXJMaXN0WzBdLmxlbmd0aDtcbiAgY29uc3QgYnVmZmVyU2FtcGxlUmF0ZSA9IGJ1ZmZlckxpc3RbMF0uc2FtcGxlUmF0ZTtcbiAgbGV0IGJ1ZmZlck51bWJlck9mQ2hhbm5lbCA9IDA7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXJMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGJ1ZmZlck51bWJlck9mQ2hhbm5lbCA+IDMyKSB7XG4gICAgICBleHBvcnRzLnRocm93KCdVdGlscy5tZXJnZUJ1ZmZlcjogTnVtYmVyIG9mIGNoYW5uZWxzIGNhbm5vdCBleGNlZWQgMzIuJyArXG4gICAgICAgICAgJyhnb3QgJyArIGJ1ZmZlck51bWJlck9mQ2hhbm5lbCArICcpJyk7XG4gICAgfVxuICAgIGlmIChidWZmZXJMZW5ndGggIT09IGJ1ZmZlckxpc3RbaV0ubGVuZ3RoKSB7XG4gICAgICBleHBvcnRzLnRocm93KCdVdGlscy5tZXJnZUJ1ZmZlcjogQXVkaW9CdWZmZXIgbGVuZ3RocyBhcmUgJyArXG4gICAgICAgICAgJ2luY29uc2lzdGVudC4gKGV4cGVjdGVkICcgKyBidWZmZXJMZW5ndGggKyAnIGJ1dCBnb3QgJyArXG4gICAgICAgICAgYnVmZmVyTGlzdFtpXS5sZW5ndGggKyAnKScpO1xuICAgIH1cbiAgICBpZiAoYnVmZmVyU2FtcGxlUmF0ZSAhPT0gYnVmZmVyTGlzdFtpXS5zYW1wbGVSYXRlKSB7XG4gICAgICBleHBvcnRzLnRocm93KCdVdGlscy5tZXJnZUJ1ZmZlcjogQXVkaW9CdWZmZXIgc2FtcGxlIHJhdGVzIGFyZSAnICtcbiAgICAgICAgICAnaW5jb25zaXN0ZW50LiAoZXhwZWN0ZWQgJyArIGJ1ZmZlclNhbXBsZVJhdGUgKyAnIGJ1dCBnb3QgJyArXG4gICAgICAgICAgYnVmZmVyTGlzdFtpXS5zYW1wbGVSYXRlICsgJyknKTtcbiAgICB9XG4gICAgYnVmZmVyTnVtYmVyT2ZDaGFubmVsICs9IGJ1ZmZlckxpc3RbaV0ubnVtYmVyT2ZDaGFubmVscztcbiAgfVxuXG4gIGNvbnN0IGJ1ZmZlciA9IGNvbnRleHQuY3JlYXRlQnVmZmVyKGJ1ZmZlck51bWJlck9mQ2hhbm5lbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyTGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXJTYW1wbGVSYXRlKTtcbiAgbGV0IGRlc3RpbmF0aW9uQ2hhbm5lbEluZGV4ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXJMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBidWZmZXJMaXN0W2ldLm51bWJlck9mQ2hhbm5lbHM7ICsraikge1xuICAgICAgYnVmZmVyLmdldENoYW5uZWxEYXRhKGRlc3RpbmF0aW9uQ2hhbm5lbEluZGV4KyspLnNldChcbiAgICAgICAgICBidWZmZXJMaXN0W2ldLmdldENoYW5uZWxEYXRhKGopKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmZmVyO1xufTtcblxuXG4vKipcbiAqIFBlcmZvcm0gY2hhbm5lbC13aXNlIHNwbGl0IGJ5IHRoZSBnaXZlbiBjaGFubmVsIGNvdW50LiBGb3IgZXhhbXBsZSxcbiAqIDEgeCBBdWRpb0J1ZmZlcig4KSAtPiBzcGxpdEJ1ZmZlcihjb250ZXh0LCBidWZmZXIsIDIpIC0+IDQgeCBBdWRpb0J1ZmZlcigyKS5cbiAqIEBwYXJhbSB7QmFzZUF1ZGlvQ29udGV4dH0gY29udGV4dCAtIEFzc29jaWF0ZWQgQmFzZUF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IGF1ZGlvQnVmZmVyIC0gQW4gQXVkaW9CdWZmZXIgdG8gYmUgc3BsaXR0ZWQuXG4gKiBAcGFyYW0ge051bWJlcn0gc3BsaXRCeSAtIE51bWJlciBvZiBjaGFubmVscyB0byBiZSBzcGxpdHRlZC5cbiAqIEByZXR1cm4ge0F1ZGlvQnVmZmVyW119IC0gQW4gYXJyYXkgb2Ygc3BsaXR0ZWQgQXVkaW9CdWZmZXJzLlxuICovXG5leHBvcnRzLnNwbGl0QnVmZmVyYnlDaGFubmVsID0gZnVuY3Rpb24oY29udGV4dCwgYXVkaW9CdWZmZXIsIHNwbGl0QnkpIHtcbiAgaWYgKGF1ZGlvQnVmZmVyLm51bWJlck9mQ2hhbm5lbHMgPD0gc3BsaXRCeSkge1xuICAgIGV4cG9ydHMudGhyb3coJ1V0aWxzLnNwbGl0QnVmZmVyOiBJbnN1ZmZpY2llbnQgbnVtYmVyIG9mIGNoYW5uZWxzLiAoJyArXG4gICAgICAgIGF1ZGlvQnVmZmVyLm51bWJlck9mQ2hhbm5lbHMgKyAnIHNwbGl0dGVkIGJ5ICcgKyBzcGxpdEJ5ICsgJyknKTtcbiAgfVxuXG4gIGxldCBidWZmbGVyTGlzdCA9IFtdO1xuICBsZXQgc291cmNlQ2hhbm5lbEluZGV4ID0gMDtcbiAgY29uc3QgbnVtYmVyT2ZTcGxpdHRlZEJ1ZmZlciA9XG4gICAgICBNYXRoLmNlaWwoYXVkaW9CdWZmZXIubnVtYmVyT2ZDaGFubmVscyAvIHNwbGl0QnkpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mU3BsaXR0ZWRCdWZmZXI7ICsraSkge1xuICAgIGxldCBidWZmZXIgPSBjb250ZXh0LmNyZWF0ZUJ1ZmZlcihzcGxpdEJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdWRpb0J1ZmZlci5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1ZGlvQnVmZmVyLnNhbXBsZVJhdGUpO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3BsaXRCeTsgKytqKSB7XG4gICAgICBpZiAoc291cmNlQ2hhbm5lbEluZGV4IDwgYXVkaW9CdWZmZXIubnVtYmVyT2ZDaGFubmVscykge1xuICAgICAgICBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoaikuc2V0KFxuICAgICAgICAgIGF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKHNvdXJjZUNoYW5uZWxJbmRleCsrKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGJ1ZmZsZXJMaXN0LnB1c2goYnVmZmVyKTtcbiAgfVxuXG4gIHJldHVybiBidWZmZXJMaXN0O1xufTtcblxuXG4vKipcbiAqIENvbnZlcnRzIEJhc2U2NC1lbmNvZGVkIHN0cmluZyB0byBBcnJheUJ1ZmZlci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlNjRTdHJpbmcgLSBCYXNlNjQtZW5jZG9lZCBzdHJpbmcuXG4gKiBAcmV0dXJuIHtBcnJheUJ5dWZmZXJ9IENvbnZlcnRlZCBBcnJheUJ1ZmZlciBvYmplY3QuXG4gKi9cbmV4cG9ydHMuZ2V0QXJyYXlCdWZmZXJGcm9tQmFzZTY0U3RyaW5nID0gZnVuY3Rpb24oYmFzZTY0U3RyaW5nKSB7XG4gIGxldCBiaW5hcnlTdHJpbmcgPSB3aW5kb3cuYXRvYihiYXNlNjRTdHJpbmcpO1xuICBsZXQgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYmluYXJ5U3RyaW5nLmxlbmd0aCk7XG4gIGJ5dGVBcnJheS5mb3JFYWNoKFxuICAgICh2YWx1ZSwgaW5kZXgpID0+IGJ5dGVBcnJheVtpbmRleF0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpbmRleCkpO1xuICByZXR1cm4gYnl0ZUFycmF5LmJ1ZmZlcjtcbn07XG5cblxuLyoqKi8gfSksXG4vKiAxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGUgU3RyZWFtbGluZWQgQXVkaW9CdWZmZXIgbG9hZGVyLlxuICovXG5cblxuXG5cbmNvbnN0IFV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7c3RyaW5nfSBCdWZmZXJEYXRhVHlwZVxuICovXG5cbi8qKlxuICogQnVmZmVyIGRhdGEgdHlwZSBmb3IgRU5VTS5cbiAqIEBlbnVtIHtCdWZmZXJEYXRhVHlwZX1cbiAqL1xuY29uc3QgQnVmZmVyRGF0YVR5cGUgPSB7XG4gIC8qKiBAdHlwZSB7c3RyaW5nfSBUaGUgZGF0YSBjb250YWlucyBCYXNlNjQtZW5jb2RlZCBzdHJpbmcuLiAqL1xuICBCQVNFNjQ6ICdiYXNlNjQnLFxuICAvKiogQHR5cGUge3N0cmluZ30gVGhlIGRhdGEgaXMgYSBVUkwgZm9yIGF1ZGlvIGZpbGUuICovXG4gIFVSTDogJ3VybCcsXG59O1xuXG5cbi8qKlxuICogQnVmZmVyTGlzdCBvYmplY3QgbWFuYW5nZXMgdGhlIGFzeW5jIGxvYWRpbmcvZGVjb2Rpbmcgb2YgbXVsdGlwbGVcbiAqIEF1ZGlvQnVmZmVycyBmcm9tIG11bHRpcGxlIFVSTHMuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QmFzZUF1ZGlvQ29udGV4dH0gY29udGV4dCAtIEFzc29jaWF0ZWQgQmFzZUF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IGJ1ZmZlckRhdGEgLSBBbiBvcmRlcmVkIGxpc3Qgb2YgVVJMcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9uc1xuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRhdGFUeXBlPSdiYXNlNjQnXSAtIEJ1ZmZlckRhdGFUeXBlIHNwZWNpZmllci5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMudmVyYm9zZT1mYWxzZV0gLSBMb2cgdmVyYm9zaXR5LiB8dHJ1ZXwgcHJpbnRzIHRoZVxuICogaW5kaXZpZHVhbCBtZXNzYWdlIGZyb20gZWFjaCBVUkwgYW5kIEF1ZGlvQnVmZmVyLlxuICovXG5mdW5jdGlvbiBCdWZmZXJMaXN0KGNvbnRleHQsIGJ1ZmZlckRhdGEsIG9wdGlvbnMpIHtcbiAgdGhpcy5fY29udGV4dCA9IFV0aWxzLmlzQXVkaW9Db250ZXh0KGNvbnRleHQpID9cbiAgICAgIGNvbnRleHQgOlxuICAgICAgVXRpbHMudGhyb3coJ0J1ZmZlckxpc3Q6IEludmFsaWQgQmFzZUF1ZGlvQ29udGV4dC4nKTtcblxuICB0aGlzLl9vcHRpb25zID0ge1xuICAgIGRhdGFUeXBlOiBCdWZmZXJEYXRhVHlwZS5CQVNFNjQsXG4gICAgdmVyYm9zZTogZmFsc2UsXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5kYXRhVHlwZSAmJlxuICAgICAgICBVdGlscy5pc0RlZmluZWRFTlVNRW50cnkoQnVmZmVyRGF0YVR5cGUsIG9wdGlvbnMuZGF0YVR5cGUpKSB7XG4gICAgICB0aGlzLl9vcHRpb25zLmRhdGFUeXBlID0gb3B0aW9ucy5kYXRhVHlwZTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMudmVyYm9zZSkge1xuICAgICAgdGhpcy5fb3B0aW9ucy52ZXJib3NlID0gQm9vbGVhbihvcHRpb25zLnZlcmJvc2UpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuX2J1ZmZlckxpc3QgPSBbXTtcbiAgdGhpcy5fYnVmZmVyRGF0YSA9IHRoaXMuX29wdGlvbnMuZGF0YVR5cGUgPT09IEJ1ZmZlckRhdGFUeXBlLkJBU0U2NFxuICAgICAgPyBidWZmZXJEYXRhXG4gICAgICA6IGJ1ZmZlckRhdGEuc2xpY2UoMCk7XG4gIHRoaXMuX251bWJlck9mVGFza3MgPSB0aGlzLl9idWZmZXJEYXRhLmxlbmd0aDtcblxuICB0aGlzLl9yZXNvbHZlSGFuZGxlciA9IG51bGw7XG4gIHRoaXMuX3JlamVjdEhhbmRsZXIgPSBuZXcgRnVuY3Rpb24oKTtcbn1cblxuXG4vKipcbiAqIFN0YXJ0cyBBdWRpb0J1ZmZlciBsb2FkaW5nIHRhc2tzLlxuICogQHJldHVybiB7UHJvbWlzZTxBdWRpb0J1ZmZlcltdPn0gVGhlIHByb21pc2UgcmVzb2x2ZXMgd2l0aCBhbiBhcnJheSBvZlxuICogQXVkaW9CdWZmZXIuXG4gKi9cbkJ1ZmZlckxpc3QucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHRoaXMuX3Byb21pc2VHZW5lcmF0b3IuYmluZCh0aGlzKSk7XG59O1xuXG5cbi8qKlxuICogUHJvbWlzZSBhcmd1bWVudCBnZW5lcmF0b3IuIEludGVybmFsbHkgc3RhcnRzIG11bHRpcGxlIGFzeW5jIGxvYWRpbmcgdGFza3MuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZSBQcm9taXNlIHJlc29sdmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gcmVqZWN0IFByb21pc2UgcmVqZWN0LlxuICovXG5CdWZmZXJMaXN0LnByb3RvdHlwZS5fcHJvbWlzZUdlbmVyYXRvciA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICBpZiAodHlwZW9mIHJlc29sdmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICBVdGlscy50aHJvdygnQnVmZmVyTGlzdDogSW52YWxpZCBQcm9taXNlIHJlc29sdmVyLicpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX3Jlc29sdmVIYW5kbGVyID0gcmVzb2x2ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcmVqZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpcy5fcmVqZWN0SGFuZGxlciA9IHJlamVjdDtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fYnVmZmVyRGF0YS5sZW5ndGg7ICsraSkge1xuICAgIHRoaXMuX29wdGlvbnMuZGF0YVR5cGUgPT09IEJ1ZmZlckRhdGFUeXBlLkJBU0U2NFxuICAgICAgICA/IHRoaXMuX2xhdW5jaEFzeW5jTG9hZFRhc2soaSlcbiAgICAgICAgOiB0aGlzLl9sYXVuY2hBc3luY0xvYWRUYXNrWEhSKGkpO1xuICB9XG59O1xuXG5cbi8qKlxuICogUnVuIGFzeW5jIGxvYWRpbmcgdGFzayBmb3IgQmFzZTY0LWVuY29kZWQgc3RyaW5nLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSB0YXNrSWQgVGFzayBJRCBudW1iZXIgZnJvbSB0aGUgb3JkZXJlZCBsaXN0IHxidWZmZXJEYXRhfC5cbiAqL1xuQnVmZmVyTGlzdC5wcm90b3R5cGUuX2xhdW5jaEFzeW5jTG9hZFRhc2sgPSBmdW5jdGlvbih0YXNrSWQpIHtcbiAgY29uc3QgdGhhdCA9IHRoaXM7XG4gIHRoaXMuX2NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKFxuICAgICAgVXRpbHMuZ2V0QXJyYXlCdWZmZXJGcm9tQmFzZTY0U3RyaW5nKHRoaXMuX2J1ZmZlckRhdGFbdGFza0lkXSksXG4gICAgICBmdW5jdGlvbihhdWRpb0J1ZmZlcikge1xuICAgICAgICB0aGF0Ll91cGRhdGVQcm9ncmVzcyh0YXNrSWQsIGF1ZGlvQnVmZmVyKTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihlcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgdGhhdC5fdXBkYXRlUHJvZ3Jlc3ModGFza0lkLCBudWxsKTtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdCdWZmZXJMaXN0OiBkZWNvZGluZyBBcnJheUJ5ZmZlcihcIicgKyB0YXNrSWQgK1xuICAgICAgICAgICAgJ1wiIGZyb20gQmFzZTY0LWVuY29kZWQgZGF0YSBmYWlsZWQuICgnICsgZXJyb3JNZXNzYWdlICsgJyknO1xuICAgICAgICBVdGlscy50aHJvdyhtZXNzYWdlKTtcbiAgICAgICAgdGhhdC5fcmVqZWN0SGFuZGxlcihtZXNzYWdlKTtcbiAgICAgIH0pO1xufTtcblxuXG4vKipcbiAqIFJ1biBhc3luYyBsb2FkaW5nIHRhc2sgdmlhIFhIUiBmb3IgYXVkaW8gZmlsZSBVUkxzLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSB0YXNrSWQgVGFzayBJRCBudW1iZXIgZnJvbSB0aGUgb3JkZXJlZCBsaXN0IHxidWZmZXJEYXRhfC5cbiAqL1xuQnVmZmVyTGlzdC5wcm90b3R5cGUuX2xhdW5jaEFzeW5jTG9hZFRhc2tYSFIgPSBmdW5jdGlvbih0YXNrSWQpIHtcbiAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHhoci5vcGVuKCdHRVQnLCB0aGlzLl9idWZmZXJEYXRhW3Rhc2tJZF0pO1xuICB4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuICBjb25zdCB0aGF0ID0gdGhpcztcbiAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIHRoYXQuX2NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKFxuICAgICAgICAgIHhoci5yZXNwb25zZSxcbiAgICAgICAgICBmdW5jdGlvbihhdWRpb0J1ZmZlcikge1xuICAgICAgICAgICAgdGhhdC5fdXBkYXRlUHJvZ3Jlc3ModGFza0lkLCBhdWRpb0J1ZmZlcik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbihlcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoYXQuX3VwZGF0ZVByb2dyZXNzKHRhc2tJZCwgbnVsbCk7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJ0J1ZmZlckxpc3Q6IGRlY29kaW5nIFwiJyArXG4gICAgICAgICAgICAgICAgdGhhdC5fYnVmZmVyRGF0YVt0YXNrSWRdICsgJ1wiIGZhaWxlZC4gKCcgKyBlcnJvck1lc3NhZ2UgKyAnKSc7XG4gICAgICAgICAgICBVdGlscy50aHJvdyhtZXNzYWdlKTtcbiAgICAgICAgICAgIHRoYXQuX3JlamVjdEhhbmRsZXIobWVzc2FnZSk7XG4gICAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnQnVmZmVyTGlzdDogWEhSIGVycm9yIHdoaWxlIGxvYWRpbmcgXCInICtcbiAgICAgICAgICB0aGF0Ll9idWZmZXJEYXRhW3Rhc2tJZF0gKyAnKCcgKyB4aHIuc3RhdHVzVGV4dCArICcpJztcbiAgICAgIFV0aWxzLnRocm93KG1lc3NhZ2UpO1xuICAgICAgdGhhdC5fcmVqZWN0SGFuZGxlcihtZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgIFV0aWxzLnRocm93KFxuICAgICAgICAnQnVmZmVyTGlzdDogWEhSIG5ldHdvcmsgZmFpbGVkIG9uIGxvYWRpbmcgXCInICtcbiAgICAgICAgdGhhdC5fYnVmZmVyRGF0YVt0YXNrSWRdICsgJ1wiLicpO1xuICAgIHRoYXQuX3VwZGF0ZVByb2dyZXNzKHRhc2tJZCwgbnVsbCk7XG4gICAgdGhhdC5fcmVqZWN0SGFuZGxlcigpO1xuICB9O1xuXG4gIHhoci5zZW5kKCk7XG59O1xuXG5cbi8qKlxuICogVXBkYXRlcyB0aGUgb3ZlcmFsbCBwcm9ncmVzcyBvbiBsb2FkaW5nIHRhc2tzLlxuICogQHBhcmFtIHtOdW1iZXJ9IHRhc2tJZCBUYXNrIElEIG51bWJlci5cbiAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IGF1ZGlvQnVmZmVyIERlY29kZWQgQXVkaW9CdWZmZXIgb2JqZWN0LlxuICovXG5CdWZmZXJMaXN0LnByb3RvdHlwZS5fdXBkYXRlUHJvZ3Jlc3MgPSBmdW5jdGlvbih0YXNrSWQsIGF1ZGlvQnVmZmVyKSB7XG4gIHRoaXMuX2J1ZmZlckxpc3RbdGFza0lkXSA9IGF1ZGlvQnVmZmVyO1xuXG4gIGlmICh0aGlzLl9vcHRpb25zLnZlcmJvc2UpIHtcbiAgICBsZXQgbWVzc2FnZVN0cmluZyA9IHRoaXMuX29wdGlvbnMuZGF0YVR5cGUgPT09IEJ1ZmZlckRhdGFUeXBlLkJBU0U2NFxuICAgICAgICA/ICdBcnJheUJ1ZmZlcignICsgdGFza0lkICsgJykgZnJvbSBCYXNlNjQtZW5jb2RlZCBIUklSJ1xuICAgICAgICA6ICdcIicgKyB0aGlzLl9idWZmZXJEYXRhW3Rhc2tJZF0gKyAnXCInO1xuICAgIFV0aWxzLmxvZygnQnVmZmVyTGlzdDogJyArIG1lc3NhZ2VTdHJpbmcgKyAnIHN1Y2Nlc3NmdWxseSBsb2FkZWQuJyk7XG4gIH1cblxuICBpZiAoLS10aGlzLl9udW1iZXJPZlRhc2tzID09PSAwKSB7XG4gICAgbGV0IG1lc3NhZ2VTdHJpbmcgPSB0aGlzLl9vcHRpb25zLmRhdGFUeXBlID09PSBCdWZmZXJEYXRhVHlwZS5CQVNFNjRcbiAgICAgICAgPyB0aGlzLl9idWZmZXJEYXRhLmxlbmd0aCArICcgQXVkaW9CdWZmZXJzIGZyb20gQmFzZTY0LWVuY29kZWQgSFJJUnMnXG4gICAgICAgIDogdGhpcy5fYnVmZmVyRGF0YS5sZW5ndGggKyAnIGZpbGVzIHZpYSBYSFInO1xuICAgIFV0aWxzLmxvZygnQnVmZmVyTGlzdDogJyArIG1lc3NhZ2VTdHJpbmcgKyAnIGxvYWRlZCBzdWNjZXNzZnVsbHkuJyk7XG4gICAgdGhpcy5fcmVzb2x2ZUhhbmRsZXIodGhpcy5fYnVmZmVyTGlzdCk7XG4gIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCdWZmZXJMaXN0O1xuXG5cbi8qKiovIH0pLFxuLyogMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlIEFuIGF1ZGlvIGNoYW5uZWwgcm91dGVyIHRvIHJlc29sdmUgZGlmZmVyZW50IGNoYW5uZWwgbGF5b3V0cyBiZXR3ZWVuXG4gKiBicm93c2Vycy5cbiAqL1xuXG5cblxuXG4vKipcbiAqIEB0eXBlZGVmIHtOdW1iZXJbXX0gQ2hhbm5lbE1hcFxuICovXG5cbi8qKlxuICogQ2hhbm5lbCBtYXAgZGljdGlvbmFyeSBFTlVNLlxuICogQGVudW0ge0NoYW5uZWxNYXB9XG4gKi9cbmNvbnN0IENoYW5uZWxNYXAgPSB7XG4gIC8qKiBAdHlwZSB7TnVtYmVyW119IC0gQUNOIGNoYW5uZWwgbWFwIGZvciBDaHJvbWUgYW5kIEZpcmVGb3guIChGRk1QRUcpICovXG4gIERFRkFVTFQ6IFswLCAxLCAyLCAzXSxcbiAgLyoqIEB0eXBlIHtOdW1iZXJbXX0gLSBTYWZhcmkncyA0LWNoYW5uZWwgbWFwIGZvciBBQUMgY29kZWMuICovXG4gIFNBRkFSSTogWzIsIDAsIDEsIDNdLFxuICAvKiogQHR5cGUge051bWJlcltdfSAtIEFDTiA+IEZ1TWEgY29udmVyc2lvbiBtYXAuICovXG4gIEZVTUE6IFswLCAzLCAxLCAyXSxcbn07XG5cblxuLyoqXG4gKiBDaGFubmVsIHJvdXRlciBmb3IgRk9BIHN0cmVhbS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7TnVtYmVyW119IGNoYW5uZWxNYXAgLSBSb3V0aW5nIGRlc3RpbmF0aW9uIGFycmF5LlxuICovXG5mdW5jdGlvbiBGT0FSb3V0ZXIoY29udGV4dCwgY2hhbm5lbE1hcCkge1xuICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcblxuICB0aGlzLl9zcGxpdHRlciA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKDQpO1xuICB0aGlzLl9tZXJnZXIgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUNoYW5uZWxNZXJnZXIoNCk7XG5cbiAgLy8gaW5wdXQvb3V0cHV0IHByb3h5LlxuICB0aGlzLmlucHV0ID0gdGhpcy5fc3BsaXR0ZXI7XG4gIHRoaXMub3V0cHV0ID0gdGhpcy5fbWVyZ2VyO1xuXG4gIHRoaXMuc2V0Q2hhbm5lbE1hcChjaGFubmVsTWFwIHx8IENoYW5uZWxNYXAuREVGQVVMVCk7XG59XG5cblxuLyoqXG4gKiBTZXRzIGNoYW5uZWwgbWFwLlxuICogQHBhcmFtIHtOdW1iZXJbXX0gY2hhbm5lbE1hcCAtIEEgbmV3IGNoYW5uZWwgbWFwIGZvciBGT0Egc3RyZWFtLlxuICovXG5GT0FSb3V0ZXIucHJvdG90eXBlLnNldENoYW5uZWxNYXAgPSBmdW5jdGlvbihjaGFubmVsTWFwKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShjaGFubmVsTWFwKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX2NoYW5uZWxNYXAgPSBjaGFubmVsTWFwO1xuICB0aGlzLl9zcGxpdHRlci5kaXNjb25uZWN0KCk7XG4gIHRoaXMuX3NwbGl0dGVyLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCB0aGlzLl9jaGFubmVsTWFwWzBdKTtcbiAgdGhpcy5fc3BsaXR0ZXIuY29ubmVjdCh0aGlzLl9tZXJnZXIsIDEsIHRoaXMuX2NoYW5uZWxNYXBbMV0pO1xuICB0aGlzLl9zcGxpdHRlci5jb25uZWN0KHRoaXMuX21lcmdlciwgMiwgdGhpcy5fY2hhbm5lbE1hcFsyXSk7XG4gIHRoaXMuX3NwbGl0dGVyLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAzLCB0aGlzLl9jaGFubmVsTWFwWzNdKTtcbn07XG5cblxuLyoqXG4gKiBTdGF0aWMgY2hhbm5lbCBtYXAgRU5VTS5cbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtDaGFubmVsTWFwfVxuICovXG5GT0FSb3V0ZXIuQ2hhbm5lbE1hcCA9IENoYW5uZWxNYXA7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBGT0FSb3V0ZXI7XG5cblxuLyoqKi8gfSksXG4vKiAzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGUgU291bmQgZmllbGQgcm90YXRvciBmb3IgZmlyc3Qtb3JkZXItYW1iaXNvbmljcyBkZWNvZGluZy5cbiAqL1xuXG5cblxuXG4vKipcbiAqIEZpcnN0LW9yZGVyLWFtYmlzb25pYyBkZWNvZGVyIGJhc2VkIG9uIGdhaW4gbm9kZSBuZXR3b3JrLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY29udGV4dCAtIEFzc29jaWF0ZWQgQXVkaW9Db250ZXh0LlxuICovXG5mdW5jdGlvbiBGT0FSb3RhdG9yKGNvbnRleHQpIHtcbiAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG5cbiAgdGhpcy5fc3BsaXR0ZXIgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUNoYW5uZWxTcGxpdHRlcig0KTtcbiAgdGhpcy5faW5ZID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX2luWiA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9pblggPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbTAgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbTEgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbTIgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbTMgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbTQgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbTUgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbTYgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbTcgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbTggPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fb3V0WSA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9vdXRaID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX291dFggPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbWVyZ2VyID0gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsTWVyZ2VyKDQpO1xuXG4gIC8vIEFDTiBjaGFubmVsIG9yZGVyaW5nOiBbMSwgMiwgM10gPT4gWy1ZLCBaLCAtWF1cbiAgLy8gWSAoZnJvbSBjaGFubmVsIDEpXG4gIHRoaXMuX3NwbGl0dGVyLmNvbm5lY3QodGhpcy5faW5ZLCAxKTtcbiAgLy8gWiAoZnJvbSBjaGFubmVsIDIpXG4gIHRoaXMuX3NwbGl0dGVyLmNvbm5lY3QodGhpcy5faW5aLCAyKTtcbiAgLy8gWCAoZnJvbSBjaGFubmVsIDMpXG4gIHRoaXMuX3NwbGl0dGVyLmNvbm5lY3QodGhpcy5faW5YLCAzKTtcbiAgdGhpcy5faW5ZLmdhaW4udmFsdWUgPSAtMTtcbiAgdGhpcy5faW5YLmdhaW4udmFsdWUgPSAtMTtcblxuICAvLyBBcHBseSB0aGUgcm90YXRpb24gaW4gdGhlIHdvcmxkIHNwYWNlLlxuICAvLyB8WXwgICB8IG0wICBtMyAgbTYgfCAgIHwgWSAqIG0wICsgWiAqIG0zICsgWCAqIG02IHwgICB8IFlyIHxcbiAgLy8gfFp8ICogfCBtMSAgbTQgIG03IHwgPSB8IFkgKiBtMSArIFogKiBtNCArIFggKiBtNyB8ID0gfCBaciB8XG4gIC8vIHxYfCAgIHwgbTIgIG01ICBtOCB8ICAgfCBZICogbTIgKyBaICogbTUgKyBYICogbTggfCAgIHwgWHIgfFxuICB0aGlzLl9pblkuY29ubmVjdCh0aGlzLl9tMCk7XG4gIHRoaXMuX2luWS5jb25uZWN0KHRoaXMuX20xKTtcbiAgdGhpcy5faW5ZLmNvbm5lY3QodGhpcy5fbTIpO1xuICB0aGlzLl9pblouY29ubmVjdCh0aGlzLl9tMyk7XG4gIHRoaXMuX2luWi5jb25uZWN0KHRoaXMuX200KTtcbiAgdGhpcy5faW5aLmNvbm5lY3QodGhpcy5fbTUpO1xuICB0aGlzLl9pblguY29ubmVjdCh0aGlzLl9tNik7XG4gIHRoaXMuX2luWC5jb25uZWN0KHRoaXMuX203KTtcbiAgdGhpcy5faW5YLmNvbm5lY3QodGhpcy5fbTgpO1xuICB0aGlzLl9tMC5jb25uZWN0KHRoaXMuX291dFkpO1xuICB0aGlzLl9tMS5jb25uZWN0KHRoaXMuX291dFopO1xuICB0aGlzLl9tMi5jb25uZWN0KHRoaXMuX291dFgpO1xuICB0aGlzLl9tMy5jb25uZWN0KHRoaXMuX291dFkpO1xuICB0aGlzLl9tNC5jb25uZWN0KHRoaXMuX291dFopO1xuICB0aGlzLl9tNS5jb25uZWN0KHRoaXMuX291dFgpO1xuICB0aGlzLl9tNi5jb25uZWN0KHRoaXMuX291dFkpO1xuICB0aGlzLl9tNy5jb25uZWN0KHRoaXMuX291dFopO1xuICB0aGlzLl9tOC5jb25uZWN0KHRoaXMuX291dFgpO1xuXG4gIC8vIFRyYW5zZm9ybSAzOiB3b3JsZCBzcGFjZSB0byBhdWRpbyBzcGFjZS5cbiAgLy8gVyAtPiBXICh0byBjaGFubmVsIDApXG4gIHRoaXMuX3NwbGl0dGVyLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAwKTtcbiAgLy8gWSAodG8gY2hhbm5lbCAxKVxuICB0aGlzLl9vdXRZLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAxKTtcbiAgLy8gWiAodG8gY2hhbm5lbCAyKVxuICB0aGlzLl9vdXRaLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAyKTtcbiAgLy8gWCAodG8gY2hhbm5lbCAzKVxuICB0aGlzLl9vdXRYLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAzKTtcbiAgdGhpcy5fb3V0WS5nYWluLnZhbHVlID0gLTE7XG4gIHRoaXMuX291dFguZ2Fpbi52YWx1ZSA9IC0xO1xuXG4gIHRoaXMuc2V0Um90YXRpb25NYXRyaXgzKG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdKSk7XG5cbiAgLy8gaW5wdXQvb3V0cHV0IHByb3h5LlxuICB0aGlzLmlucHV0ID0gdGhpcy5fc3BsaXR0ZXI7XG4gIHRoaXMub3V0cHV0ID0gdGhpcy5fbWVyZ2VyO1xufVxuXG5cbi8qKlxuICogVXBkYXRlcyB0aGUgcm90YXRpb24gbWF0cml4IHdpdGggM3gzIG1hdHJpeC5cbiAqIEBwYXJhbSB7TnVtYmVyW119IHJvdGF0aW9uTWF0cml4MyAtIEEgM3gzIHJvdGF0aW9uIG1hdHJpeC4gKGNvbHVtbi1tYWpvcilcbiAqL1xuRk9BUm90YXRvci5wcm90b3R5cGUuc2V0Um90YXRpb25NYXRyaXgzID0gZnVuY3Rpb24ocm90YXRpb25NYXRyaXgzKSB7XG4gIHRoaXMuX20wLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDNbMF07XG4gIHRoaXMuX20xLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDNbMV07XG4gIHRoaXMuX20yLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDNbMl07XG4gIHRoaXMuX20zLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDNbM107XG4gIHRoaXMuX200LmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDNbNF07XG4gIHRoaXMuX201LmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDNbNV07XG4gIHRoaXMuX202LmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDNbNl07XG4gIHRoaXMuX203LmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDNbN107XG4gIHRoaXMuX204LmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDNbOF07XG59O1xuXG5cbi8qKlxuICogVXBkYXRlcyB0aGUgcm90YXRpb24gbWF0cml4IHdpdGggNHg0IG1hdHJpeC5cbiAqIEBwYXJhbSB7TnVtYmVyW119IHJvdGF0aW9uTWF0cml4NCAtIEEgNHg0IHJvdGF0aW9uIG1hdHJpeC4gKGNvbHVtbi1tYWpvcilcbiAqL1xuRk9BUm90YXRvci5wcm90b3R5cGUuc2V0Um90YXRpb25NYXRyaXg0ID0gZnVuY3Rpb24ocm90YXRpb25NYXRyaXg0KSB7XG4gIHRoaXMuX20wLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbMF07XG4gIHRoaXMuX20xLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbMV07XG4gIHRoaXMuX20yLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbMl07XG4gIHRoaXMuX20zLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbNF07XG4gIHRoaXMuX200LmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbNV07XG4gIHRoaXMuX201LmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbNl07XG4gIHRoaXMuX202LmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbOF07XG4gIHRoaXMuX203LmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbOV07XG4gIHRoaXMuX204LmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbMTBdO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIGN1cnJlbnQgM3gzIHJvdGF0aW9uIG1hdHJpeC5cbiAqIEByZXR1cm4ge051bWJlcltdfSAtIEEgM3gzIHJvdGF0aW9uIG1hdHJpeC4gKGNvbHVtbi1tYWpvcilcbiAqL1xuRk9BUm90YXRvci5wcm90b3R5cGUuZ2V0Um90YXRpb25NYXRyaXgzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXG4gICAgdGhpcy5fbTAuZ2Fpbi52YWx1ZSwgdGhpcy5fbTEuZ2Fpbi52YWx1ZSwgdGhpcy5fbTIuZ2Fpbi52YWx1ZSxcbiAgICB0aGlzLl9tMy5nYWluLnZhbHVlLCB0aGlzLl9tNC5nYWluLnZhbHVlLCB0aGlzLl9tNS5nYWluLnZhbHVlLFxuICAgIHRoaXMuX202LmdhaW4udmFsdWUsIHRoaXMuX203LmdhaW4udmFsdWUsIHRoaXMuX204LmdhaW4udmFsdWUsXG4gIF07XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgY3VycmVudCA0eDQgcm90YXRpb24gbWF0cml4LlxuICogQHJldHVybiB7TnVtYmVyW119IC0gQSA0eDQgcm90YXRpb24gbWF0cml4LiAoY29sdW1uLW1ham9yKVxuICovXG5GT0FSb3RhdG9yLnByb3RvdHlwZS5nZXRSb3RhdGlvbk1hdHJpeDQgPSBmdW5jdGlvbigpIHtcbiAgbGV0IHJvdGF0aW9uTWF0cml4NCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xuICByb3RhdGlvbk1hdHJpeDRbMF0gPSB0aGlzLl9tMC5nYWluLnZhbHVlO1xuICByb3RhdGlvbk1hdHJpeDRbMV0gPSB0aGlzLl9tMS5nYWluLnZhbHVlO1xuICByb3RhdGlvbk1hdHJpeDRbMl0gPSB0aGlzLl9tMi5nYWluLnZhbHVlO1xuICByb3RhdGlvbk1hdHJpeDRbNF0gPSB0aGlzLl9tMy5nYWluLnZhbHVlO1xuICByb3RhdGlvbk1hdHJpeDRbNV0gPSB0aGlzLl9tNC5nYWluLnZhbHVlO1xuICByb3RhdGlvbk1hdHJpeDRbNl0gPSB0aGlzLl9tNS5nYWluLnZhbHVlO1xuICByb3RhdGlvbk1hdHJpeDRbOF0gPSB0aGlzLl9tNi5nYWluLnZhbHVlO1xuICByb3RhdGlvbk1hdHJpeDRbOV0gPSB0aGlzLl9tNy5nYWluLnZhbHVlO1xuICByb3RhdGlvbk1hdHJpeDRbMTBdID0gdGhpcy5fbTguZ2Fpbi52YWx1ZTtcbiAgcmV0dXJuIHJvdGF0aW9uTWF0cml4NDtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBGT0FSb3RhdG9yO1xuXG5cbi8qKiovIH0pLFxuLyogNCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5cbi8qKlxuICogQGZpbGUgQSBjb2xsZWN0aW9uIG9mIGNvbnZvbHZlcnMuIENhbiBiZSB1c2VkIGZvciB0aGUgb3B0aW1pemVkIEZPQSBiaW5hdXJhbFxuICogcmVuZGVyaW5nLiAoZS5nLiBTSC1NYXhSZSBIUlRGcylcbiAqL1xuXG5cblxuXG4vKipcbiAqIEZPQUNvbnZvbHZlci4gQSBjb2xsZWN0aW9uIG9mIDIgc3RlcmVvIGNvbnZvbHZlcnMgZm9yIDQtY2hhbm5lbCBGT0Egc3RyZWFtLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0Jhc2VBdWRpb0NvbnRleHR9IGNvbnRleHQgVGhlIGFzc29jaWF0ZWQgQXVkaW9Db250ZXh0LlxuICogQHBhcmFtIHtBdWRpb0J1ZmZlcltdfSBbaHJpckJ1ZmZlckxpc3RdIC0gQW4gb3JkZXJlZC1saXN0IG9mIHN0ZXJlb1xuICogQXVkaW9CdWZmZXJzIGZvciBjb252b2x1dGlvbi4gKGkuZS4gMiBzdGVyZW8gQXVkaW9CdWZmZXJzIGZvciBGT0EpXG4gKi9cbmZ1bmN0aW9uIEZPQUNvbnZvbHZlcihjb250ZXh0LCBocmlyQnVmZmVyTGlzdCkge1xuICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcblxuICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgdGhpcy5faXNCdWZmZXJMb2FkZWQgPSBmYWxzZTtcblxuICB0aGlzLl9idWlsZEF1ZGlvR3JhcGgoKTtcblxuICBpZiAoaHJpckJ1ZmZlckxpc3QpIHtcbiAgICB0aGlzLnNldEhSSVJCdWZmZXJMaXN0KGhyaXJCdWZmZXJMaXN0KTtcbiAgfVxuXG4gIHRoaXMuZW5hYmxlKCk7XG59XG5cblxuLyoqXG4gKiBCdWlsZCB0aGUgaW50ZXJuYWwgYXVkaW8gZ3JhcGguXG4gKlxuICogQHByaXZhdGVcbiAqL1xuRk9BQ29udm9sdmVyLnByb3RvdHlwZS5fYnVpbGRBdWRpb0dyYXBoID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NwbGl0dGVyV1laWCA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKDQpO1xuICB0aGlzLl9tZXJnZXJXWSA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbE1lcmdlcigyKTtcbiAgdGhpcy5fbWVyZ2VyWlggPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUNoYW5uZWxNZXJnZXIoMik7XG4gIHRoaXMuX2NvbnZvbHZlcldZID0gdGhpcy5fY29udGV4dC5jcmVhdGVDb252b2x2ZXIoKTtcbiAgdGhpcy5fY29udm9sdmVyWlggPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUNvbnZvbHZlcigpO1xuICB0aGlzLl9zcGxpdHRlcldZID0gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsU3BsaXR0ZXIoMik7XG4gIHRoaXMuX3NwbGl0dGVyWlggPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUNoYW5uZWxTcGxpdHRlcigyKTtcbiAgdGhpcy5faW52ZXJ0ZXIgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbWVyZ2VyQmluYXVyYWwgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUNoYW5uZWxNZXJnZXIoMik7XG4gIHRoaXMuX3N1bW1pbmdCdXMgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuICAvLyBHcm91cCBXIGFuZCBZLCB0aGVuIFogYW5kIFguXG4gIHRoaXMuX3NwbGl0dGVyV1laWC5jb25uZWN0KHRoaXMuX21lcmdlcldZLCAwLCAwKTtcbiAgdGhpcy5fc3BsaXR0ZXJXWVpYLmNvbm5lY3QodGhpcy5fbWVyZ2VyV1ksIDEsIDEpO1xuICB0aGlzLl9zcGxpdHRlcldZWlguY29ubmVjdCh0aGlzLl9tZXJnZXJaWCwgMiwgMCk7XG4gIHRoaXMuX3NwbGl0dGVyV1laWC5jb25uZWN0KHRoaXMuX21lcmdlclpYLCAzLCAxKTtcblxuICAvLyBDcmVhdGUgYSBuZXR3b3JrIG9mIGNvbnZvbHZlcnMgdXNpbmcgc3BsaXR0ZXIvbWVyZ2VyLlxuICB0aGlzLl9tZXJnZXJXWS5jb25uZWN0KHRoaXMuX2NvbnZvbHZlcldZKTtcbiAgdGhpcy5fbWVyZ2VyWlguY29ubmVjdCh0aGlzLl9jb252b2x2ZXJaWCk7XG4gIHRoaXMuX2NvbnZvbHZlcldZLmNvbm5lY3QodGhpcy5fc3BsaXR0ZXJXWSk7XG4gIHRoaXMuX2NvbnZvbHZlclpYLmNvbm5lY3QodGhpcy5fc3BsaXR0ZXJaWCk7XG4gIHRoaXMuX3NwbGl0dGVyV1kuY29ubmVjdCh0aGlzLl9tZXJnZXJCaW5hdXJhbCwgMCwgMCk7XG4gIHRoaXMuX3NwbGl0dGVyV1kuY29ubmVjdCh0aGlzLl9tZXJnZXJCaW5hdXJhbCwgMCwgMSk7XG4gIHRoaXMuX3NwbGl0dGVyV1kuY29ubmVjdCh0aGlzLl9tZXJnZXJCaW5hdXJhbCwgMSwgMCk7XG4gIHRoaXMuX3NwbGl0dGVyV1kuY29ubmVjdCh0aGlzLl9pbnZlcnRlciwgMSwgMCk7XG4gIHRoaXMuX2ludmVydGVyLmNvbm5lY3QodGhpcy5fbWVyZ2VyQmluYXVyYWwsIDAsIDEpO1xuICB0aGlzLl9zcGxpdHRlclpYLmNvbm5lY3QodGhpcy5fbWVyZ2VyQmluYXVyYWwsIDAsIDApO1xuICB0aGlzLl9zcGxpdHRlclpYLmNvbm5lY3QodGhpcy5fbWVyZ2VyQmluYXVyYWwsIDAsIDEpO1xuICB0aGlzLl9zcGxpdHRlclpYLmNvbm5lY3QodGhpcy5fbWVyZ2VyQmluYXVyYWwsIDEsIDApO1xuICB0aGlzLl9zcGxpdHRlclpYLmNvbm5lY3QodGhpcy5fbWVyZ2VyQmluYXVyYWwsIDEsIDEpO1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFdlYkF1ZGlvJ3MgY29udm9sdmVyIGRvZXMgdGhlIG5vcm1hbGl6YXRpb24gYmFzZWQgb24gSVInc1xuICAvLyBlbmVyZ3kuIEZvciB0aGUgcHJlY2lzZSBjb252b2x1dGlvbiwgaXQgbXVzdCBiZSBkaXNhYmxlZCBiZWZvcmUgdGhlIGJ1ZmZlclxuICAvLyBhc3NpZ25tZW50LlxuICB0aGlzLl9jb252b2x2ZXJXWS5ub3JtYWxpemUgPSBmYWxzZTtcbiAgdGhpcy5fY29udm9sdmVyWlgubm9ybWFsaXplID0gZmFsc2U7XG5cbiAgLy8gRm9yIGFzeW1tZXRyaWMgZGVncmVlLlxuICB0aGlzLl9pbnZlcnRlci5nYWluLnZhbHVlID0gLTE7XG5cbiAgLy8gSW5wdXQvb3V0cHV0IHByb3h5LlxuICB0aGlzLmlucHV0ID0gdGhpcy5fc3BsaXR0ZXJXWVpYO1xuICB0aGlzLm91dHB1dCA9IHRoaXMuX3N1bW1pbmdCdXM7XG59O1xuXG5cbi8qKlxuICogQXNzaWducyAyIEhSSVIgQXVkaW9CdWZmZXJzIHRvIDIgY29udm9sdmVyczogTm90ZSB0aGF0IHdlIHVzZSAyIHN0ZXJlb1xuICogY29udm9sdXRpb25zIGZvciA0LWNoYW5uZWwgZGlyZWN0IGNvbnZvbHV0aW9uLiBVc2luZyBtb25vIGNvbnZvbHZlciBvclxuICogNC1jaGFubmVsIGNvbnZvbHZlciBpcyBub3QgdmlhYmxlIGJlY2F1c2UgbW9ubyBjb252b2x1dGlvbiB3YXN0ZWZ1bGx5XG4gKiBwcm9kdWNlcyB0aGUgc3RlcmVvIG91dHB1dHMsIGFuZCB0aGUgNC1jaCBjb252b2x2ZXIgZG9lcyBjcm9zcy1jaGFubmVsXG4gKiBjb252b2x1dGlvbi4gKFNlZSBXZWIgQXVkaW8gQVBJIHNwZWMpXG4gKiBAcGFyYW0ge0F1ZGlvQnVmZmVyW119IGhyaXJCdWZmZXJMaXN0IC0gQW4gYXJyYXkgb2Ygc3RlcmVvIEF1ZGlvQnVmZmVycyBmb3JcbiAqIGNvbnZvbHZlcnMuXG4gKi9cbkZPQUNvbnZvbHZlci5wcm90b3R5cGUuc2V0SFJJUkJ1ZmZlckxpc3QgPSBmdW5jdGlvbihocmlyQnVmZmVyTGlzdCkge1xuICAvLyBBZnRlciB0aGVzZSBhc3NpZ25tZW50cywgdGhlIGNoYW5uZWwgZGF0YSBpbiB0aGUgYnVmZmVyIGlzIGltbXV0YWJsZSBpblxuICAvLyBGaXJlRm94LiAoaS5lLiBuZXV0ZXJlZCkgU28gd2Ugc2hvdWxkIGF2b2lkIHJlLWFzc2lnbmluZyBidWZmZXJzLCBvdGhlcndpc2VcbiAgLy8gYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duLlxuICBpZiAodGhpcy5faXNCdWZmZXJMb2FkZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9jb252b2x2ZXJXWS5idWZmZXIgPSBocmlyQnVmZmVyTGlzdFswXTtcbiAgdGhpcy5fY29udm9sdmVyWlguYnVmZmVyID0gaHJpckJ1ZmZlckxpc3RbMV07XG4gIHRoaXMuX2lzQnVmZmVyTG9hZGVkID0gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBFbmFibGUgRk9BQ29udm9sdmVyIGluc3RhbmNlLiBUaGUgYXVkaW8gZ3JhcGggd2lsbCBiZSBhY3RpdmF0ZWQgYW5kIHB1bGxlZCBieVxuICogdGhlIFdlYkF1ZGlvIGVuZ2luZS4gKGkuZS4gY29uc3VtZSBDUFUgY3ljbGUpXG4gKi9cbkZPQUNvbnZvbHZlci5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX21lcmdlckJpbmF1cmFsLmNvbm5lY3QodGhpcy5fc3VtbWluZ0J1cyk7XG4gIHRoaXMuX2FjdGl2ZSA9IHRydWU7XG59O1xuXG5cbi8qKlxuICogRGlzYWJsZSBGT0FDb252b2x2ZXIgaW5zdGFuY2UuIFRoZSBpbm5lciBncmFwaCB3aWxsIGJlIGRpc2Nvbm5lY3RlZCBmcm9tIHRoZVxuICogYXVkaW8gZGVzdGluYXRpb24sIHRodXMgbm8gQ1BVIGN5Y2xlIHdpbGwgYmUgY29uc3VtZWQuXG4gKi9cbkZPQUNvbnZvbHZlci5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9tZXJnZXJCaW5hdXJhbC5kaXNjb25uZWN0KCk7XG4gIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEZPQUNvbnZvbHZlcjtcblxuXG4vKioqLyB9KSxcbi8qIDUgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IERFUFJFQ0FURUQgYXQgVjEuIEF1ZGlvIGJ1ZmZlciBsb2FkaW5nIHV0aWxpdHkuXG4gKi9cblxuXG5cbmNvbnN0IFV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuLyoqXG4gKiBTdHJlYW1saW5lZCBhdWRpbyBmaWxlIGxvYWRlciBzdXBwb3J0cyBQcm9taXNlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgICAgICAgICAgQXVkaW9Db250ZXh0XG4gKiBAcGFyYW0ge09iamVjdH0gYXVkaW9GaWxlRGF0YSAgICBBdWRpbyBmaWxlIGluZm8gYXMgW3tuYW1lLCB1cmx9XVxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSAgICAgICAgUmVzb2x1dGlvbiBoYW5kbGVyIGZvciBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ICAgICAgICAgUmVqZWN0aW9uIGhhbmRsZXIgZm9yIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcm9ncmVzcyAgICAgICBQcm9ncmVzcyBldmVudCBoYW5kbGVyLlxuICovXG5mdW5jdGlvbiBBdWRpb0J1ZmZlck1hbmFnZXIoY29udGV4dCwgYXVkaW9GaWxlRGF0YSwgcmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xuICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcblxuICB0aGlzLl9idWZmZXJzID0gbmV3IE1hcCgpO1xuICB0aGlzLl9sb2FkaW5nVGFza3MgPSB7fTtcblxuICB0aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgdGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuICB0aGlzLl9wcm9ncmVzcyA9IHByb2dyZXNzO1xuXG4gIC8vIEl0ZXJhdGluZyBmaWxlIGxvYWRpbmcuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXVkaW9GaWxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGZpbGVJbmZvID0gYXVkaW9GaWxlRGF0YVtpXTtcblxuICAgIC8vIENoZWNrIGZvciBkdXBsaWNhdGVzIGZpbGVuYW1lIGFuZCBxdWl0IGlmIGl0IGhhcHBlbnMuXG4gICAgaWYgKHRoaXMuX2xvYWRpbmdUYXNrcy5oYXNPd25Qcm9wZXJ0eShmaWxlSW5mby5uYW1lKSkge1xuICAgICAgVXRpbHMubG9nKCdEdXBsaWNhdGVkIGZpbGVuYW1lIHdoZW4gbG9hZGluZzogJyArIGZpbGVJbmZvLm5hbWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE1hcmsgaXQgYXMgcGVuZGluZyAoMClcbiAgICB0aGlzLl9sb2FkaW5nVGFza3NbZmlsZUluZm8ubmFtZV0gPSAwO1xuICAgIHRoaXMuX2xvYWRBdWRpb0ZpbGUoZmlsZUluZm8pO1xuICB9XG59XG5cbkF1ZGlvQnVmZmVyTWFuYWdlci5wcm90b3R5cGUuX2xvYWRBdWRpb0ZpbGUgPSBmdW5jdGlvbihmaWxlSW5mbykge1xuICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgeGhyLm9wZW4oJ0dFVCcsIGZpbGVJbmZvLnVybCk7XG4gIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gIGNvbnN0IHRoYXQgPSB0aGlzO1xuICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgdGhhdC5fY29udGV4dC5kZWNvZGVBdWRpb0RhdGEoeGhyLnJlc3BvbnNlLFxuICAgICAgICBmdW5jdGlvbihidWZmZXIpIHtcbiAgICAgICAgICAvLyBVdGlscy5sb2coJ0ZpbGUgbG9hZGVkOiAnICsgZmlsZUluZm8udXJsKTtcbiAgICAgICAgICB0aGF0Ll9kb25lKGZpbGVJbmZvLm5hbWUsIGJ1ZmZlcik7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICBVdGlscy5sb2coJ0RlY29kaW5nIGZhaWx1cmU6ICdcbiAgICAgICAgICAgICsgZmlsZUluZm8udXJsICsgJyAoJyArIG1lc3NhZ2UgKyAnKScpO1xuICAgICAgICAgIHRoYXQuX2RvbmUoZmlsZUluZm8ubmFtZSwgbnVsbCk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBVdGlscy5sb2coJ1hIUiBFcnJvcjogJyArIGZpbGVJbmZvLnVybCArICcgKCcgKyB4aHIuc3RhdHVzVGV4dFxuICAgICAgICArICcpJyk7XG4gICAgICB0aGF0Ll9kb25lKGZpbGVJbmZvLm5hbWUsIG51bGwpO1xuICAgIH1cbiAgfTtcblxuICAvLyBUT0RPOiBmZXRjaCBsb2NhbCByZXNvdXJjZXMgaWYgWEhSIGZhaWxzLlxuICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgVXRpbHMubG9nKCdYSFIgTmV0d29yayBmYWlsdXJlOiAnICsgZmlsZUluZm8udXJsKTtcbiAgICB0aGF0Ll9kb25lKGZpbGVJbmZvLm5hbWUsIG51bGwpO1xuICB9O1xuXG4gIHhoci5zZW5kKCk7XG59O1xuXG5BdWRpb0J1ZmZlck1hbmFnZXIucHJvdG90eXBlLl9kb25lID0gZnVuY3Rpb24oZmlsZW5hbWUsIGJ1ZmZlcikge1xuICAvLyBMYWJlbCB0aGUgbG9hZGluZyB0YXNrLlxuICB0aGlzLl9sb2FkaW5nVGFza3NbZmlsZW5hbWVdID0gYnVmZmVyICE9PSBudWxsID8gJ2xvYWRlZCcgOiAnZmFpbGVkJztcblxuICAvLyBBIGZhaWxlZCB0YXNrIHdpbGwgYmUgYSBudWxsIGJ1ZmZlci5cbiAgdGhpcy5fYnVmZmVycy5zZXQoZmlsZW5hbWUsIGJ1ZmZlcik7XG5cbiAgdGhpcy5fdXBkYXRlUHJvZ3Jlc3MoZmlsZW5hbWUpO1xufTtcblxuQXVkaW9CdWZmZXJNYW5hZ2VyLnByb3RvdHlwZS5fdXBkYXRlUHJvZ3Jlc3MgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICBsZXQgbnVtYmVyT2ZGaW5pc2hlZFRhc2tzID0gMDtcbiAgbGV0IG51bWJlck9mRmFpbGVkVGFzayA9IDA7XG4gIGxldCBudW1iZXJPZlRhc2tzID0gMDtcblxuICBmb3IgKGNvbnN0IHRhc2sgaW4gdGhpcy5fbG9hZGluZ1Rhc2tzKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9sb2FkaW5nVGFza3MsIHRhc2spKSB7XG4gICAgICBudW1iZXJPZlRhc2tzKys7XG4gICAgICBpZiAodGhpcy5fbG9hZGluZ1Rhc2tzW3Rhc2tdID09PSAnbG9hZGVkJykge1xuICAgICAgICBudW1iZXJPZkZpbmlzaGVkVGFza3MrKztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbG9hZGluZ1Rhc2tzW3Rhc2tdID09PSAnZmFpbGVkJykge1xuICAgICAgICBudW1iZXJPZkZhaWxlZFRhc2srKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHRoaXMuX3Byb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpcy5fcHJvZ3Jlc3MoZmlsZW5hbWUsIG51bWJlck9mRmluaXNoZWRUYXNrcywgbnVtYmVyT2ZUYXNrcyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKG51bWJlck9mRmluaXNoZWRUYXNrcyA9PT0gbnVtYmVyT2ZUYXNrcykge1xuICAgIHRoaXMuX3Jlc29sdmUodGhpcy5fYnVmZmVycyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKG51bWJlck9mRmluaXNoZWRUYXNrcyArIG51bWJlck9mRmFpbGVkVGFzayA9PT0gbnVtYmVyT2ZUYXNrcykge1xuICAgIHRoaXMuX3JlamVjdCh0aGlzLl9idWZmZXJzKTtcbiAgICByZXR1cm47XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9CdWZmZXJNYW5hZ2VyO1xuXG5cbi8qKiovIH0pLFxuLyogNiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5cbi8qKlxuICogQGZpbGUgUGhhc2UgbWF0Y2hlZCBmaWx0ZXIgZm9yIGZpcnN0LW9yZGVyLWFtYmlzb25pY3MgZGVjb2RpbmcuXG4gKi9cblxuXG5cbmNvbnN0IFV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vLyBTdGF0aWMgcGFyYW1ldGVycy5cbmNvbnN0IENST1NTT1ZFUl9GUkVRVUVOQ1kgPSA2OTA7XG5jb25zdCBHQUlOX0NPRUZGSUNJRU5UUyA9IFsxLjQxNDIsIDAuODE2NiwgMC44MTY2LCAwLjgxNjZdO1xuXG5cbi8qKlxuICogR2VuZXJhdGUgdGhlIGNvZWZmaWNpZW50cyBmb3IgZHVhbCBiYW5kIGZpbHRlci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBjcm9zc292ZXJGcmVxdWVuY3lcbiAqIEBwYXJhbSB7TnVtYmVyfSBzYW1wbGVSYXRlXG4gKiBAcmV0dXJuIHtPYmplY3R9IEZpbHRlciBjb2VmZmljaWVudHMuXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlRHVhbEJhbmRDb2VmZmljaWVudHMoY3Jvc3NvdmVyRnJlcXVlbmN5LCBzYW1wbGVSYXRlKSB7XG4gIGNvbnN0IGsgPSBNYXRoLnRhbihNYXRoLlBJICogY3Jvc3NvdmVyRnJlcXVlbmN5IC8gc2FtcGxlUmF0ZSk7XG4gIGNvbnN0IGsyID0gayAqIGs7XG4gIGNvbnN0IGRlbm9taW5hdG9yID0gazIgKyAyICogayArIDE7XG5cbiAgcmV0dXJuIHtcbiAgICBsb3dwYXNzQTogWzEsIDIgKiAoazIgLSAxKSAvIGRlbm9taW5hdG9yLCAoazIgLSAyICogayArIDEpIC8gZGVub21pbmF0b3JdLFxuICAgIGxvd3Bhc3NCOiBbazIgLyBkZW5vbWluYXRvciwgMiAqIGsyIC8gZGVub21pbmF0b3IsIGsyIC8gZGVub21pbmF0b3JdLFxuICAgIGhpcGFzc0E6IFsxLCAyICogKGsyIC0gMSkgLyBkZW5vbWluYXRvciwgKGsyIC0gMiAqIGsgKyAxKSAvIGRlbm9taW5hdG9yXSxcbiAgICBoaXBhc3NCOiBbMSAvIGRlbm9taW5hdG9yLCAtMiAqIDEgLyBkZW5vbWluYXRvciwgMSAvIGRlbm9taW5hdG9yXSxcbiAgfTtcbn1cblxuXG4vKipcbiAqIEZPQVBoYXNlTWF0Y2hlZEZpbHRlcjogQSBzZXQgb2YgZmlsdGVycyAoTFAvSFApIHdpdGggYSBjcm9zc292ZXIgZnJlcXVlbmN5IHRvXG4gKiBjb21wZW5zYXRlIHRoZSBnYWluIG9mIGhpZ2ggZnJlcXVlbmN5IGNvbnRlbnRzIHdpdGhvdXQgYSBwaGFzZSBkaWZmZXJlbmNlLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY29udGV4dCAtIEFzc29jaWF0ZWQgQXVkaW9Db250ZXh0LlxuICovXG5mdW5jdGlvbiBGT0FQaGFzZU1hdGNoZWRGaWx0ZXIoY29udGV4dCkge1xuICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcblxuICB0aGlzLl9pbnB1dCA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuXG4gIGlmICghdGhpcy5fY29udGV4dC5jcmVhdGVJSVJGaWx0ZXIpIHtcbiAgICBVdGlscy5sb2coJ0lJUiBmaWx0ZXIgaXMgbWlzc2luZy4gVXNpbmcgQmlxdWFkIGZpbHRlciBpbnN0ZWFkLicpO1xuICAgIHRoaXMuX2xwZiA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgdGhpcy5faHBmID0gdGhpcy5fY29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICB0aGlzLl9scGYuZnJlcXVlbmN5LnZhbHVlID0gQ1JPU1NPVkVSX0ZSRVFVRU5DWTtcbiAgICB0aGlzLl9ocGYuZnJlcXVlbmN5LnZhbHVlID0gQ1JPU1NPVkVSX0ZSRVFVRU5DWTtcbiAgICB0aGlzLl9ocGYudHlwZSA9ICdoaWdocGFzcyc7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgY29lZiA9IGdlbmVyYXRlRHVhbEJhbmRDb2VmZmljaWVudHMoQ1JPU1NPVkVSX0ZSRVFVRU5DWSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250ZXh0LnNhbXBsZVJhdGUpO1xuICAgIHRoaXMuX2xwZiA9IHRoaXMuX2NvbnRleHQuY3JlYXRlSUlSRmlsdGVyKGNvZWYubG93cGFzc0IsIGNvZWYubG93cGFzc0EpO1xuICAgIHRoaXMuX2hwZiA9IHRoaXMuX2NvbnRleHQuY3JlYXRlSUlSRmlsdGVyKGNvZWYuaGlwYXNzQiwgY29lZi5oaXBhc3NBKTtcbiAgfVxuXG4gIHRoaXMuX3NwbGl0dGVyTG93ID0gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsU3BsaXR0ZXIoNCk7XG4gIHRoaXMuX3NwbGl0dGVySGlnaCA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKDQpO1xuICB0aGlzLl9nYWluSGlnaFcgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fZ2FpbkhpZ2hZID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX2dhaW5IaWdoWiA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9nYWluSGlnaFggPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fbWVyZ2VyID0gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsTWVyZ2VyKDQpO1xuXG4gIHRoaXMuX2lucHV0LmNvbm5lY3QodGhpcy5faHBmKTtcbiAgdGhpcy5faHBmLmNvbm5lY3QodGhpcy5fc3BsaXR0ZXJIaWdoKTtcbiAgdGhpcy5fc3BsaXR0ZXJIaWdoLmNvbm5lY3QodGhpcy5fZ2FpbkhpZ2hXLCAwKTtcbiAgdGhpcy5fc3BsaXR0ZXJIaWdoLmNvbm5lY3QodGhpcy5fZ2FpbkhpZ2hZLCAxKTtcbiAgdGhpcy5fc3BsaXR0ZXJIaWdoLmNvbm5lY3QodGhpcy5fZ2FpbkhpZ2haLCAyKTtcbiAgdGhpcy5fc3BsaXR0ZXJIaWdoLmNvbm5lY3QodGhpcy5fZ2FpbkhpZ2hYLCAzKTtcbiAgdGhpcy5fZ2FpbkhpZ2hXLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAwKTtcbiAgdGhpcy5fZ2FpbkhpZ2hZLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAxKTtcbiAgdGhpcy5fZ2FpbkhpZ2haLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAyKTtcbiAgdGhpcy5fZ2FpbkhpZ2hYLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAzKTtcblxuICB0aGlzLl9pbnB1dC5jb25uZWN0KHRoaXMuX2xwZik7XG4gIHRoaXMuX2xwZi5jb25uZWN0KHRoaXMuX3NwbGl0dGVyTG93KTtcbiAgdGhpcy5fc3BsaXR0ZXJMb3cuY29ubmVjdCh0aGlzLl9tZXJnZXIsIDAsIDApO1xuICB0aGlzLl9zcGxpdHRlckxvdy5jb25uZWN0KHRoaXMuX21lcmdlciwgMSwgMSk7XG4gIHRoaXMuX3NwbGl0dGVyTG93LmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAyLCAyKTtcbiAgdGhpcy5fc3BsaXR0ZXJMb3cuY29ubmVjdCh0aGlzLl9tZXJnZXIsIDMsIDMpO1xuXG4gIC8vIEFwcGx5IGdhaW4gY29ycmVjdGlvbiB0byBoaS1wYXNzZWQgcHJlc3N1cmUgYW5kIHZlbG9jaXR5IGNvbXBvbmVudHM6XG4gIC8vIEludmVydGluZyBzaWduIGlzIG5lY2Vzc2FyeSBhcyB0aGUgbG93LXBhc3NlZCBhbmQgaGlnaC1wYXNzZWQgcG9ydGlvbiBhcmVcbiAgLy8gb3V0LW9mLXBoYXNlIGFmdGVyIHRoZSBmaWx0ZXJpbmcuXG4gIGNvbnN0IG5vdyA9IHRoaXMuX2NvbnRleHQuY3VycmVudFRpbWU7XG4gIHRoaXMuX2dhaW5IaWdoVy5nYWluLnNldFZhbHVlQXRUaW1lKC0xICogR0FJTl9DT0VGRklDSUVOVFNbMF0sIG5vdyk7XG4gIHRoaXMuX2dhaW5IaWdoWS5nYWluLnNldFZhbHVlQXRUaW1lKC0xICogR0FJTl9DT0VGRklDSUVOVFNbMV0sIG5vdyk7XG4gIHRoaXMuX2dhaW5IaWdoWi5nYWluLnNldFZhbHVlQXRUaW1lKC0xICogR0FJTl9DT0VGRklDSUVOVFNbMl0sIG5vdyk7XG4gIHRoaXMuX2dhaW5IaWdoWC5nYWluLnNldFZhbHVlQXRUaW1lKC0xICogR0FJTl9DT0VGRklDSUVOVFNbM10sIG5vdyk7XG5cbiAgLy8gSW5wdXQvb3V0cHV0IFByb3h5LlxuICB0aGlzLmlucHV0ID0gdGhpcy5faW5wdXQ7XG4gIHRoaXMub3V0cHV0ID0gdGhpcy5fbWVyZ2VyO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gRk9BUGhhc2VNYXRjaGVkRmlsdGVyO1xuXG5cbi8qKiovIH0pLFxuLyogNyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5cbi8qKlxuICogQGZpbGUgVmlydHVhbCBzcGVha2VyIGFic3RyYWN0aW9uIGZvciBmaXJzdC1vcmRlci1hbWJpc29uaWNzIGRlY29kaW5nLlxuICovXG5cblxuXG5cbi8qKlxuICogREVQUkVDQVRFRCBhdCBWMTogQSB2aXJ0dWFsIHNwZWFrZXIgd2l0aCBhbWJpc29uaWMgZGVjb2RpbmcgZ2FpbiBjb2VmZmljaWVudHNcbiAqIGFuZCBIUlRGIGNvbnZvbHV0aW9uIGZvciBmaXJzdC1vcmRlci1hbWJpc29uaWNzIHN0cmVhbS4gTm90ZSB0aGF0IHRoZVxuICogc3ViZ3JhcGggZGlyZWN0bHkgY29ubmVjdHMgdG8gY29udGV4dCdzIGRlc3RpbmF0aW9uLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY29udGV4dCAtIEFzc29jaWF0ZWQgQXVkaW9Db250ZXh0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIGZvciBzcGVha2VyLlxuICogQHBhcmFtIHtOdW1iZXJbXX0gb3B0aW9ucy5jb2VmZmljaWVudHMgLSBEZWNvZGluZyBjb2VmZmljaWVudHMgZm9yIChXLFksWixYKS5cbiAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IG9wdGlvbnMuSVIgLSBTdGVyZW8gSVIgYnVmZmVyIGZvciBIUlRGIGNvbnZvbHV0aW9uLlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuZ2FpbiAtIFBvc3QtZ2FpbiBmb3IgdGhlIHNwZWFrZXIuXG4gKi9cbmZ1bmN0aW9uIEZPQVZpcnR1YWxTcGVha2VyKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuSVIubnVtYmVyT2ZDaGFubmVscyAhPT0gMikge1xuICAgIHRocm93IG5ldyBFcnJvcignSVIgZG9lcyBub3QgaGF2ZSAyIGNoYW5uZWxzLiBjYW5ub3QgcHJvY2VlZC4nKTtcbiAgfVxuXG4gIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcblxuICB0aGlzLl9pbnB1dCA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKDQpO1xuICB0aGlzLl9jVyA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9jWSA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9jWiA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9jWCA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9jb252b2x2ZXIgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUNvbnZvbHZlcigpO1xuICB0aGlzLl9nYWluID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG5cbiAgdGhpcy5faW5wdXQuY29ubmVjdCh0aGlzLl9jVywgMCk7XG4gIHRoaXMuX2lucHV0LmNvbm5lY3QodGhpcy5fY1ksIDEpO1xuICB0aGlzLl9pbnB1dC5jb25uZWN0KHRoaXMuX2NaLCAyKTtcbiAgdGhpcy5faW5wdXQuY29ubmVjdCh0aGlzLl9jWCwgMyk7XG4gIHRoaXMuX2NXLmNvbm5lY3QodGhpcy5fY29udm9sdmVyKTtcbiAgdGhpcy5fY1kuY29ubmVjdCh0aGlzLl9jb252b2x2ZXIpO1xuICB0aGlzLl9jWi5jb25uZWN0KHRoaXMuX2NvbnZvbHZlcik7XG4gIHRoaXMuX2NYLmNvbm5lY3QodGhpcy5fY29udm9sdmVyKTtcbiAgdGhpcy5fY29udm9sdmVyLmNvbm5lY3QodGhpcy5fZ2Fpbik7XG4gIHRoaXMuX2dhaW4uY29ubmVjdCh0aGlzLl9jb250ZXh0LmRlc3RpbmF0aW9uKTtcblxuICB0aGlzLmVuYWJsZSgpO1xuXG4gIHRoaXMuX2NvbnZvbHZlci5ub3JtYWxpemUgPSBmYWxzZTtcbiAgdGhpcy5fY29udm9sdmVyLmJ1ZmZlciA9IG9wdGlvbnMuSVI7XG4gIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZSA9IG9wdGlvbnMuZ2FpbjtcblxuICAvLyBTZXQgZ2FpbiBjb2VmZmljaWVudHMgZm9yIEZPQSBhbWJpc29uaWMgc3RyZWFtcy5cbiAgdGhpcy5fY1cuZ2Fpbi52YWx1ZSA9IG9wdGlvbnMuY29lZmZpY2llbnRzWzBdO1xuICB0aGlzLl9jWS5nYWluLnZhbHVlID0gb3B0aW9ucy5jb2VmZmljaWVudHNbMV07XG4gIHRoaXMuX2NaLmdhaW4udmFsdWUgPSBvcHRpb25zLmNvZWZmaWNpZW50c1syXTtcbiAgdGhpcy5fY1guZ2Fpbi52YWx1ZSA9IG9wdGlvbnMuY29lZmZpY2llbnRzWzNdO1xuXG4gIC8vIElucHV0IHByb3h5LiBPdXRwdXQgZGlyZWN0bHkgY29ubmVjdHMgdG8gdGhlIGRlc3RpbmF0aW9uLlxuICB0aGlzLmlucHV0ID0gdGhpcy5faW5wdXQ7XG59XG5cblxuRk9BVmlydHVhbFNwZWFrZXIucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9nYWluLmNvbm5lY3QodGhpcy5fY29udGV4dC5kZXN0aW5hdGlvbik7XG4gIHRoaXMuX2FjdGl2ZSA9IHRydWU7XG59O1xuXG5cbkZPQVZpcnR1YWxTcGVha2VyLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2dhaW4uZGlzY29ubmVjdCgpO1xuICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBGT0FWaXJ0dWFsU3BlYWtlcjtcblxuXG4vKioqLyB9KSxcbi8qIDggKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuXG4vKipcbiAqIEBmaWxlIEEgY29sbGVjdGlvbiBvZiBjb252b2x2ZXJzLiBDYW4gYmUgdXNlZCBmb3IgdGhlIG9wdGltaXplZCBIT0EgYmluYXVyYWxcbiAqIHJlbmRlcmluZy4gKGUuZy4gU0gtTWF4UmUgSFJURnMpXG4gKi9cblxuXG5cblxuLyoqXG4gKiBBIGNvbnZvbHZlciBuZXR3b3JrIGZvciBOLWNoYW5uZWwgSE9BIHN0cmVhbS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBhbWJpc29uaWNPcmRlciAtIEFtYmlzb25pYyBvcmRlci4gKDIgb3IgMylcbiAqIEBwYXJhbSB7QXVkaW9CdWZmZXJbXX0gW2hyaXJCdWZmZXJMaXN0XSAtIEFuIG9yZGVyZWQtbGlzdCBvZiBzdGVyZW9cbiAqIEF1ZGlvQnVmZmVycyBmb3IgY29udm9sdXRpb24uIChTT0E6IDUgQXVkaW9CdWZmZXJzLCBUT0E6IDggQXVkaW9CdWZmZXJzKVxuICovXG5mdW5jdGlvbiBIT0FDb252b2x2ZXIoY29udGV4dCwgYW1iaXNvbmljT3JkZXIsIGhyaXJCdWZmZXJMaXN0KSB7XG4gIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuXG4gIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICB0aGlzLl9pc0J1ZmZlckxvYWRlZCA9IGZhbHNlO1xuXG4gIC8vIFRoZSBudW1iZXIgb2YgY2hhbm5lbHMgSyBiYXNlZCBvbiB0aGUgYW1iaXNvbmljIG9yZGVyIE4gd2hlcmUgSyA9IChOKzEpXjIuXG4gIHRoaXMuX2FtYmlzb25pY09yZGVyID0gYW1iaXNvbmljT3JkZXI7XG4gIHRoaXMuX251bWJlck9mQ2hhbm5lbHMgPVxuICAgICAgKHRoaXMuX2FtYmlzb25pY09yZGVyICsgMSkgKiAodGhpcy5fYW1iaXNvbmljT3JkZXIgKyAxKTtcblxuICB0aGlzLl9idWlsZEF1ZGlvR3JhcGgoKTtcbiAgaWYgKGhyaXJCdWZmZXJMaXN0KSB7XG4gICAgdGhpcy5zZXRIUklSQnVmZmVyTGlzdChocmlyQnVmZmVyTGlzdCk7XG4gIH1cblxuICB0aGlzLmVuYWJsZSgpO1xufVxuXG5cbi8qKlxuICogQnVpbGQgdGhlIGludGVybmFsIGF1ZGlvIGdyYXBoLlxuICogRm9yIFRPQSBjb252b2x1dGlvbjpcbiAqICAgaW5wdXQgLT4gc3BsaXR0ZXIoMTYpIC1bMCwxXS0+IG1lcmdlcigyKSAtPiBjb252b2x2ZXIoMikgLT4gc3BsaXR0ZXIoMilcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIC1bMiwzXS0+IG1lcmdlcigyKSAtPiBjb252b2x2ZXIoMikgLT4gc3BsaXR0ZXIoMilcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIC1bNCw1XS0+IC4uLiAoNiBtb3JlLCA4IGJyYW5jaGVzIHRvdGFsKVxuICogQHByaXZhdGVcbiAqL1xuSE9BQ29udm9sdmVyLnByb3RvdHlwZS5fYnVpbGRBdWRpb0dyYXBoID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG51bWJlck9mU3RlcmVvQ2hhbm5lbHMgPSBNYXRoLmNlaWwodGhpcy5fbnVtYmVyT2ZDaGFubmVscyAvIDIpO1xuXG4gIHRoaXMuX2lucHV0U3BsaXR0ZXIgPVxuICAgICAgdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsU3BsaXR0ZXIodGhpcy5fbnVtYmVyT2ZDaGFubmVscyk7XG4gIHRoaXMuX3N0ZXJlb01lcmdlcnMgPSBbXTtcbiAgdGhpcy5fY29udm9sdmVycyA9IFtdO1xuICB0aGlzLl9zdGVyZW9TcGxpdHRlcnMgPSBbXTtcbiAgdGhpcy5fcG9zaXRpdmVJbmRleFNwaGVyaWNhbEhhcm1vbmljcyA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9uZWdhdGl2ZUluZGV4U3BoZXJpY2FsSGFybW9uaWNzID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX2ludmVydGVyID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX2JpbmF1cmFsTWVyZ2VyID0gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsTWVyZ2VyKDIpO1xuICB0aGlzLl9vdXRwdXRHYWluID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZlN0ZXJlb0NoYW5uZWxzOyArK2kpIHtcbiAgICB0aGlzLl9zdGVyZW9NZXJnZXJzW2ldID0gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsTWVyZ2VyKDIpO1xuICAgIHRoaXMuX2NvbnZvbHZlcnNbaV0gPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUNvbnZvbHZlcigpO1xuICAgIHRoaXMuX3N0ZXJlb1NwbGl0dGVyc1tpXSA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKDIpO1xuICAgIHRoaXMuX2NvbnZvbHZlcnNbaV0ubm9ybWFsaXplID0gZmFsc2U7XG4gIH1cblxuICBmb3IgKGxldCBsID0gMDsgbCA8PSB0aGlzLl9hbWJpc29uaWNPcmRlcjsgKytsKSB7XG4gICAgZm9yIChsZXQgbSA9IC1sOyBtIDw9IGw7IG0rKykge1xuICAgICAgLy8gV2UgY29tcHV0ZSB0aGUgQUNOIGluZGV4IChrKSBvZiBhbWJpc29uaWNzIGNoYW5uZWwgdXNpbmcgdGhlIGRlZ3JlZSAobClcbiAgICAgIC8vIGFuZCBpbmRleCAobSk6IGsgPSBsXjIgKyBsICsgbVxuICAgICAgY29uc3QgYWNuSW5kZXggPSBsICogbCArIGwgKyBtO1xuICAgICAgY29uc3Qgc3RlcmVvSW5kZXggPSBNYXRoLmZsb29yKGFjbkluZGV4IC8gMik7XG5cbiAgICAgIC8vIFNwbGl0IGNoYW5uZWxzIGZyb20gaW5wdXQgaW50byBhcnJheSBvZiBzdGVyZW8gY29udm9sdmVycy5cbiAgICAgIC8vIFRoZW4gY3JlYXRlIGEgbmV0d29yayBvZiBtZXJnZXJzIHRoYXQgcHJvZHVjZXMgdGhlIHN0ZXJlbyBvdXRwdXQuXG4gICAgICB0aGlzLl9pbnB1dFNwbGl0dGVyLmNvbm5lY3QoXG4gICAgICAgICAgdGhpcy5fc3RlcmVvTWVyZ2Vyc1tzdGVyZW9JbmRleF0sIGFjbkluZGV4LCBhY25JbmRleCAlIDIpO1xuICAgICAgdGhpcy5fc3RlcmVvTWVyZ2Vyc1tzdGVyZW9JbmRleF0uY29ubmVjdCh0aGlzLl9jb252b2x2ZXJzW3N0ZXJlb0luZGV4XSk7XG4gICAgICB0aGlzLl9jb252b2x2ZXJzW3N0ZXJlb0luZGV4XS5jb25uZWN0KHRoaXMuX3N0ZXJlb1NwbGl0dGVyc1tzdGVyZW9JbmRleF0pO1xuXG4gICAgICAvLyBQb3NpdGl2ZSBpbmRleCAobSA+PSAwKSBzcGhlcmljYWwgaGFybW9uaWNzIGFyZSBzeW1tZXRyaWNhbCBhcm91bmQgdGhlXG4gICAgICAvLyBmcm9udCBheGlzLCB3aGlsZSBuZWdhdGl2ZSBpbmRleCAobSA8IDApIHNwaGVyaWNhbCBoYXJtb25pY3MgYXJlXG4gICAgICAvLyBhbnRpLXN5bW1ldHJpY2FsIGFyb3VuZCB0aGUgZnJvbnQgYXhpcy4gV2Ugd2lsbCBleHBsb2l0IHRoaXMgc3ltbWV0cnlcbiAgICAgIC8vIHRvIHJlZHVjZSB0aGUgbnVtYmVyIG9mIGNvbnZvbHV0aW9ucyByZXF1aXJlZCB3aGVuIHJlbmRlcmluZyB0byBhXG4gICAgICAvLyBzeW1tZXRyaWNhbCBiaW5hdXJhbCByZW5kZXJlci5cbiAgICAgIGlmIChtID49IDApIHtcbiAgICAgICAgdGhpcy5fc3RlcmVvU3BsaXR0ZXJzW3N0ZXJlb0luZGV4XS5jb25uZWN0KFxuICAgICAgICAgICAgdGhpcy5fcG9zaXRpdmVJbmRleFNwaGVyaWNhbEhhcm1vbmljcywgYWNuSW5kZXggJSAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3N0ZXJlb1NwbGl0dGVyc1tzdGVyZW9JbmRleF0uY29ubmVjdChcbiAgICAgICAgICAgIHRoaXMuX25lZ2F0aXZlSW5kZXhTcGhlcmljYWxIYXJtb25pY3MsIGFjbkluZGV4ICUgMik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fcG9zaXRpdmVJbmRleFNwaGVyaWNhbEhhcm1vbmljcy5jb25uZWN0KHRoaXMuX2JpbmF1cmFsTWVyZ2VyLCAwLCAwKTtcbiAgdGhpcy5fcG9zaXRpdmVJbmRleFNwaGVyaWNhbEhhcm1vbmljcy5jb25uZWN0KHRoaXMuX2JpbmF1cmFsTWVyZ2VyLCAwLCAxKTtcbiAgdGhpcy5fbmVnYXRpdmVJbmRleFNwaGVyaWNhbEhhcm1vbmljcy5jb25uZWN0KHRoaXMuX2JpbmF1cmFsTWVyZ2VyLCAwLCAwKTtcbiAgdGhpcy5fbmVnYXRpdmVJbmRleFNwaGVyaWNhbEhhcm1vbmljcy5jb25uZWN0KHRoaXMuX2ludmVydGVyKTtcbiAgdGhpcy5faW52ZXJ0ZXIuY29ubmVjdCh0aGlzLl9iaW5hdXJhbE1lcmdlciwgMCwgMSk7XG5cbiAgLy8gRm9yIGFzeW1tZXRyaWMgaW5kZXguXG4gIHRoaXMuX2ludmVydGVyLmdhaW4udmFsdWUgPSAtMTtcblxuICAvLyBJbnB1dC9PdXRwdXQgcHJveHkuXG4gIHRoaXMuaW5wdXQgPSB0aGlzLl9pbnB1dFNwbGl0dGVyO1xuICB0aGlzLm91dHB1dCA9IHRoaXMuX291dHB1dEdhaW47XG59O1xuXG5cbi8qKlxuICogQXNzaWducyBOIEhSSVIgQXVkaW9CdWZmZXJzIHRvIE4gY29udm9sdmVyczogTm90ZSB0aGF0IHdlIHVzZSAyIHN0ZXJlb1xuICogY29udm9sdXRpb25zIGZvciA0LWNoYW5uZWwgZGlyZWN0IGNvbnZvbHV0aW9uLiBVc2luZyBtb25vIGNvbnZvbHZlciBvclxuICogNC1jaGFubmVsIGNvbnZvbHZlciBpcyBub3QgdmlhYmxlIGJlY2F1c2UgbW9ubyBjb252b2x1dGlvbiB3YXN0ZWZ1bGx5XG4gKiBwcm9kdWNlcyB0aGUgc3RlcmVvIG91dHB1dHMsIGFuZCB0aGUgNC1jaCBjb252b2x2ZXIgZG9lcyBjcm9zcy1jaGFubmVsXG4gKiBjb252b2x1dGlvbi4gKFNlZSBXZWIgQXVkaW8gQVBJIHNwZWMpXG4gKiBAcGFyYW0ge0F1ZGlvQnVmZmVyW119IGhyaXJCdWZmZXJMaXN0IC0gQW4gYXJyYXkgb2Ygc3RlcmVvIEF1ZGlvQnVmZmVycyBmb3JcbiAqIGNvbnZvbHZlcnMuXG4gKi9cbkhPQUNvbnZvbHZlci5wcm90b3R5cGUuc2V0SFJJUkJ1ZmZlckxpc3QgPSBmdW5jdGlvbihocmlyQnVmZmVyTGlzdCkge1xuICAvLyBBZnRlciB0aGVzZSBhc3NpZ25tZW50cywgdGhlIGNoYW5uZWwgZGF0YSBpbiB0aGUgYnVmZmVyIGlzIGltbXV0YWJsZSBpblxuICAvLyBGaXJlRm94LiAoaS5lLiBuZXV0ZXJlZCkgU28gd2Ugc2hvdWxkIGF2b2lkIHJlLWFzc2lnbmluZyBidWZmZXJzLCBvdGhlcndpc2VcbiAgLy8gYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duLlxuICBpZiAodGhpcy5faXNCdWZmZXJMb2FkZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGhyaXJCdWZmZXJMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdGhpcy5fY29udm9sdmVyc1tpXS5idWZmZXIgPSBocmlyQnVmZmVyTGlzdFtpXTtcbiAgfVxuXG4gIHRoaXMuX2lzQnVmZmVyTG9hZGVkID0gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBFbmFibGUgSE9BQ29udm9sdmVyIGluc3RhbmNlLiBUaGUgYXVkaW8gZ3JhcGggd2lsbCBiZSBhY3RpdmF0ZWQgYW5kIHB1bGxlZCBieVxuICogdGhlIFdlYkF1ZGlvIGVuZ2luZS4gKGkuZS4gY29uc3VtZSBDUFUgY3ljbGUpXG4gKi9cbkhPQUNvbnZvbHZlci5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2JpbmF1cmFsTWVyZ2VyLmNvbm5lY3QodGhpcy5fb3V0cHV0R2Fpbik7XG4gIHRoaXMuX2FjdGl2ZSA9IHRydWU7XG59O1xuXG5cbi8qKlxuICogRGlzYWJsZSBIT0FDb252b2x2ZXIgaW5zdGFuY2UuIFRoZSBpbm5lciBncmFwaCB3aWxsIGJlIGRpc2Nvbm5lY3RlZCBmcm9tIHRoZVxuICogYXVkaW8gZGVzdGluYXRpb24sIHRodXMgbm8gQ1BVIGN5Y2xlIHdpbGwgYmUgY29uc3VtZWQuXG4gKi9cbkhPQUNvbnZvbHZlci5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9iaW5hdXJhbE1lcmdlci5kaXNjb25uZWN0KCk7XG4gIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEhPQUNvbnZvbHZlcjtcblxuXG4vKioqLyB9KSxcbi8qIDkgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZSBTb3VuZCBmaWVsZCByb3RhdG9yIGZvciBoaWdoZXItb3JkZXItYW1iaXNvbmljcyBkZWNvZGluZy5cbiAqL1xuXG5cblxuXG4vKipcbiAqIEtyb25lY2tlciBEZWx0YSBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TnVtYmVyfSBpXG4gKiBAcGFyYW0ge051bWJlcn0galxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXRLcm9uZWNrZXJEZWx0YShpLCBqKSB7XG4gIHJldHVybiBpID09PSBqID8gMSA6IDA7XG59XG5cblxuLyoqXG4gKiBBIGhlbHBlciBmdW5jdGlvbiB0byBhbGxvdyB1cyB0byBhY2Nlc3MgYSBtYXRyaXggYXJyYXkgaW4gdGhlIHNhbWVcbiAqIG1hbm5lciwgYXNzdW1pbmcgaXQgaXMgYSAoMmwrMSl4KDJsKzEpIG1hdHJpeC4gWzJdIHVzZXMgYW4gb2RkIGNvbnZlbnRpb24gb2ZcbiAqIHJlZmVycmluZyB0byB0aGUgcm93cyBhbmQgY29sdW1ucyB1c2luZyBjZW50ZXJlZCBpbmRpY2VzLCBzbyB0aGUgbWlkZGxlIHJvd1xuICogYW5kIGNvbHVtbiBhcmUgKDAsIDApIGFuZCB0aGUgdXBwZXIgbGVmdCB3b3VsZCBoYXZlIG5lZ2F0aXZlIGNvb3JkaW5hdGVzLlxuICogQHBhcmFtIHtOdW1iZXJbXX0gbWF0cml4IC0gTiBtYXRyaWNlcyBvZiBnYWluTm9kZXMsIGVhY2ggd2l0aCAoMm4rMSkgeCAoMm4rMSlcbiAqIGVsZW1lbnRzLCB3aGVyZSBuPTEsMiwuLi4sTi5cbiAqIEBwYXJhbSB7TnVtYmVyfSBsXG4gKiBAcGFyYW0ge051bWJlcn0gaVxuICogQHBhcmFtIHtOdW1iZXJ9IGpcbiAqIEBwYXJhbSB7TnVtYmVyfSBnYWluVmFsdWVcbiAqL1xuZnVuY3Rpb24gc2V0Q2VudGVyZWRFbGVtZW50KG1hdHJpeCwgbCwgaSwgaiwgZ2FpblZhbHVlKSB7XG4gIGNvbnN0IGluZGV4ID0gKGogKyBsKSAqICgyICogbCArIDEpICsgKGkgKyBsKTtcbiAgLy8gUm93LXdpc2UgaW5kZXhpbmcuXG4gIG1hdHJpeFtsIC0gMV1baW5kZXhdLmdhaW4udmFsdWUgPSBnYWluVmFsdWU7XG59XG5cblxuLyoqXG4gKiBUaGlzIGlzIGEgaGVscGVyIGZ1bmN0aW9uIHRvIGFsbG93IHVzIHRvIGFjY2VzcyBhIG1hdHJpeCBhcnJheSBpbiB0aGUgc2FtZVxuICogbWFubmVyLCBhc3N1bWluZyBpdCBpcyBhICgybCsxKSB4ICgybCsxKSBtYXRyaXguXG4gKiBAcGFyYW0ge051bWJlcltdfSBtYXRyaXggLSBOIG1hdHJpY2VzIG9mIGdhaW5Ob2RlcywgZWFjaCB3aXRoICgybisxKSB4ICgybisxKVxuICogZWxlbWVudHMsIHdoZXJlIG49MSwyLC4uLixOLlxuICogQHBhcmFtIHtOdW1iZXJ9IGxcbiAqIEBwYXJhbSB7TnVtYmVyfSBpXG4gKiBAcGFyYW0ge051bWJlcn0galxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXRDZW50ZXJlZEVsZW1lbnQobWF0cml4LCBsLCBpLCBqKSB7XG4gIC8vIFJvdy13aXNlIGluZGV4aW5nLlxuICBjb25zdCBpbmRleCA9IChqICsgbCkgKiAoMiAqIGwgKyAxKSArIChpICsgbCk7XG4gIHJldHVybiBtYXRyaXhbbCAtIDFdW2luZGV4XS5nYWluLnZhbHVlO1xufVxuXG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIGRlZmluZWQgaW4gWzJdIHRoYXQgaXMgdXNlZCBieSB0aGUgZnVuY3Rpb25zIFUsIFYsIFcuXG4gKiBUaGlzIHNob3VsZCBub3QgYmUgY2FsbGVkIG9uIGl0cyBvd24sIGFzIFUsIFYsIGFuZCBXIChhbmQgdGhlaXIgY29lZmZpY2llbnRzKVxuICogc2VsZWN0IHRoZSBhcHByb3ByaWF0ZSBtYXRyaXggZWxlbWVudHMgdG8gYWNjZXNzIGFyZ3VtZW50cyB8YXwgYW5kIHxifC5cbiAqIEBwYXJhbSB7TnVtYmVyW119IG1hdHJpeCAtIE4gbWF0cmljZXMgb2YgZ2Fpbk5vZGVzLCBlYWNoIHdpdGggKDJuKzEpIHggKDJuKzEpXG4gKiBlbGVtZW50cywgd2hlcmUgbj0xLDIsLi4uLE4uXG4gKiBAcGFyYW0ge051bWJlcn0gaVxuICogQHBhcmFtIHtOdW1iZXJ9IGFcbiAqIEBwYXJhbSB7TnVtYmVyfSBiXG4gKiBAcGFyYW0ge051bWJlcn0gbFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXRQKG1hdHJpeCwgaSwgYSwgYiwgbCkge1xuICBpZiAoYiA9PT0gbCkge1xuICAgIHJldHVybiBnZXRDZW50ZXJlZEVsZW1lbnQobWF0cml4LCAxLCBpLCAxKSAqXG4gICAgICAgIGdldENlbnRlcmVkRWxlbWVudChtYXRyaXgsIGwgLSAxLCBhLCBsIC0gMSkgLVxuICAgICAgICBnZXRDZW50ZXJlZEVsZW1lbnQobWF0cml4LCAxLCBpLCAtMSkgKlxuICAgICAgICBnZXRDZW50ZXJlZEVsZW1lbnQobWF0cml4LCBsIC0gMSwgYSwgLWwgKyAxKTtcbiAgfSBlbHNlIGlmIChiID09PSAtbCkge1xuICAgIHJldHVybiBnZXRDZW50ZXJlZEVsZW1lbnQobWF0cml4LCAxLCBpLCAxKSAqXG4gICAgICAgIGdldENlbnRlcmVkRWxlbWVudChtYXRyaXgsIGwgLSAxLCBhLCAtbCArIDEpICtcbiAgICAgICAgZ2V0Q2VudGVyZWRFbGVtZW50KG1hdHJpeCwgMSwgaSwgLTEpICpcbiAgICAgICAgZ2V0Q2VudGVyZWRFbGVtZW50KG1hdHJpeCwgbCAtIDEsIGEsIGwgLSAxKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2V0Q2VudGVyZWRFbGVtZW50KG1hdHJpeCwgMSwgaSwgMCkgKlxuICAgICAgICBnZXRDZW50ZXJlZEVsZW1lbnQobWF0cml4LCBsIC0gMSwgYSwgYik7XG4gIH1cbn1cblxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbnMgVSwgViwgYW5kIFcgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjb3JyZXNwb25kaW5nbHlcbiAqIG5hbWVkIGNvZWZmaWNpZW50IHUsIHYsIHcgZnJvbSB0aGUgZnVuY3Rpb24gQ29tcHV0ZVVWV0NvZWZmKCkgaXMgbm9uLXplcm8uXG4gKiBXaGVuIHRoZSBjb2VmZmljaWVudCBpcyAwLCB0aGVzZSB3b3VsZCBhdHRlbXB0IHRvIGFjY2VzcyBtYXRyaXggZWxlbWVudHMgdGhhdFxuICogYXJlIG91dCBvZiBib3VuZHMuIFRoZSB2ZWN0b3Igb2Ygcm90YXRpb25zLCB8cnwsIG11c3QgaGF2ZSB0aGUgfGwgLSAxfFxuICogcHJldmlvdXNseSBjb21wbGV0ZWQgYmFuZCByb3RhdGlvbnMuIFRoZXNlIGZ1bmN0aW9ucyBhcmUgdmFsaWQgZm9yIHxsID49IDJ8LlxuICogQHBhcmFtIHtOdW1iZXJbXX0gbWF0cml4IC0gTiBtYXRyaWNlcyBvZiBnYWluTm9kZXMsIGVhY2ggd2l0aCAoMm4rMSkgeCAoMm4rMSlcbiAqIGVsZW1lbnRzLCB3aGVyZSBuPTEsMiwuLi4sTi5cbiAqIEBwYXJhbSB7TnVtYmVyfSBtXG4gKiBAcGFyYW0ge051bWJlcn0gblxuICogQHBhcmFtIHtOdW1iZXJ9IGxcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0VShtYXRyaXgsIG0sIG4sIGwpIHtcbiAgLy8gQWx0aG91Z2ggWzEsIDJdIHNwbGl0IFUgaW50byB0aHJlZSBjYXNlcyBmb3IgbSA9PSAwLCBtIDwgMCwgbSA+IDBcbiAgLy8gdGhlIGFjdHVhbCB2YWx1ZXMgYXJlIHRoZSBzYW1lIGZvciBhbGwgdGhyZWUgY2FzZXMuXG4gIHJldHVybiBnZXRQKG1hdHJpeCwgMCwgbSwgbiwgbCk7XG59XG5cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb25zIFUsIFYsIGFuZCBXIHNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY29ycmVzcG9uZGluZ2x5XG4gKiBuYW1lZCBjb2VmZmljaWVudCB1LCB2LCB3IGZyb20gdGhlIGZ1bmN0aW9uIENvbXB1dGVVVldDb2VmZigpIGlzIG5vbi16ZXJvLlxuICogV2hlbiB0aGUgY29lZmZpY2llbnQgaXMgMCwgdGhlc2Ugd291bGQgYXR0ZW1wdCB0byBhY2Nlc3MgbWF0cml4IGVsZW1lbnRzIHRoYXRcbiAqIGFyZSBvdXQgb2YgYm91bmRzLiBUaGUgdmVjdG9yIG9mIHJvdGF0aW9ucywgfHJ8LCBtdXN0IGhhdmUgdGhlIHxsIC0gMXxcbiAqIHByZXZpb3VzbHkgY29tcGxldGVkIGJhbmQgcm90YXRpb25zLiBUaGVzZSBmdW5jdGlvbnMgYXJlIHZhbGlkIGZvciB8bCA+PSAyfC5cbiAqIEBwYXJhbSB7TnVtYmVyW119IG1hdHJpeCAtIE4gbWF0cmljZXMgb2YgZ2Fpbk5vZGVzLCBlYWNoIHdpdGggKDJuKzEpIHggKDJuKzEpXG4gKiBlbGVtZW50cywgd2hlcmUgbj0xLDIsLi4uLE4uXG4gKiBAcGFyYW0ge051bWJlcn0gbVxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEBwYXJhbSB7TnVtYmVyfSBsXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldFYobWF0cml4LCBtLCBuLCBsKSB7XG4gIGlmIChtID09PSAwKSB7XG4gICAgcmV0dXJuIGdldFAobWF0cml4LCAxLCAxLCBuLCBsKSArIGdldFAobWF0cml4LCAtMSwgLTEsIG4sIGwpO1xuICB9IGVsc2UgaWYgKG0gPiAwKSB7XG4gICAgY29uc3QgZCA9IGdldEtyb25lY2tlckRlbHRhKG0sIDEpO1xuICAgIHJldHVybiBnZXRQKG1hdHJpeCwgMSwgbSAtIDEsIG4sIGwpICogTWF0aC5zcXJ0KDEgKyBkKSAtXG4gICAgICAgIGdldFAobWF0cml4LCAtMSwgLW0gKyAxLCBuLCBsKSAqICgxIC0gZCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTm90ZSB0aGVyZSBpcyBhcHBhcmVudCBlcnJhdGEgaW4gWzEsMiwyYl0gZGVhbGluZyB3aXRoIHRoaXMgcGFydGljdWxhclxuICAgIC8vIGNhc2UuIFsyYl0gd3JpdGVzIGl0IHNob3VsZCBiZSBQKigxLWQpK1AqKDEtZCleMC41XG4gICAgLy8gWzFdIHdyaXRlcyBpdCBhcyBQKigxK2QpK1AqKDEtZCleMC41LCBidXQgZ29pbmcgdGhyb3VnaCB0aGUgbWF0aCBieSBoYW5kLFxuICAgIC8vIHlvdSBtdXN0IGhhdmUgaXQgYXMgUCooMS1kKStQKigxK2QpXjAuNSB0byBmb3JtIGEgMl4uNSB0ZXJtLCB3aGljaFxuICAgIC8vIHBhcmFsbGVscyB0aGUgY2FzZSB3aGVyZSBtID4gMC5cbiAgICBjb25zdCBkID0gZ2V0S3JvbmVja2VyRGVsdGEobSwgLTEpO1xuICAgIHJldHVybiBnZXRQKG1hdHJpeCwgMSwgbSArIDEsIG4sIGwpICogKDEgLSBkKSArXG4gICAgICAgIGdldFAobWF0cml4LCAtMSwgLW0gLSAxLCBuLCBsKSAqIE1hdGguc3FydCgxICsgZCk7XG4gIH1cbn1cblxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbnMgVSwgViwgYW5kIFcgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjb3JyZXNwb25kaW5nbHlcbiAqIG5hbWVkIGNvZWZmaWNpZW50IHUsIHYsIHcgZnJvbSB0aGUgZnVuY3Rpb24gQ29tcHV0ZVVWV0NvZWZmKCkgaXMgbm9uLXplcm8uXG4gKiBXaGVuIHRoZSBjb2VmZmljaWVudCBpcyAwLCB0aGVzZSB3b3VsZCBhdHRlbXB0IHRvIGFjY2VzcyBtYXRyaXggZWxlbWVudHMgdGhhdFxuICogYXJlIG91dCBvZiBib3VuZHMuIFRoZSB2ZWN0b3Igb2Ygcm90YXRpb25zLCB8cnwsIG11c3QgaGF2ZSB0aGUgfGwgLSAxfFxuICogcHJldmlvdXNseSBjb21wbGV0ZWQgYmFuZCByb3RhdGlvbnMuIFRoZXNlIGZ1bmN0aW9ucyBhcmUgdmFsaWQgZm9yIHxsID49IDJ8LlxuICogQHBhcmFtIHtOdW1iZXJbXX0gbWF0cml4IE4gbWF0cmljZXMgb2YgZ2Fpbk5vZGVzLCBlYWNoIHdpdGggKDJuKzEpIHggKDJuKzEpXG4gKiBlbGVtZW50cywgd2hlcmUgbj0xLDIsLi4uLE4uXG4gKiBAcGFyYW0ge051bWJlcn0gbVxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEBwYXJhbSB7TnVtYmVyfSBsXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldFcobWF0cml4LCBtLCBuLCBsKSB7XG4gIC8vIFdoZW5ldmVyIHRoaXMgaGFwcGVucywgdyBpcyBhbHNvIDAgc28gVyBjYW4gYmUgYW55dGhpbmcuXG4gIGlmIChtID09PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gbSA+IDAgPyBnZXRQKG1hdHJpeCwgMSwgbSArIDEsIG4sIGwpICsgZ2V0UChtYXRyaXgsIC0xLCAtbSAtIDEsIG4sIGwpIDpcbiAgICAgICAgICAgICAgICAgZ2V0UChtYXRyaXgsIDEsIG0gLSAxLCBuLCBsKSAtIGdldFAobWF0cml4LCAtMSwgLW0gKyAxLCBuLCBsKTtcbn1cblxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGNvZWZmaWNpZW50cyBhcHBsaWVkIHRvIHRoZSBVLCBWLCBhbmQgVyBmdW5jdGlvbnMuIEJlY2F1c2VcbiAqIHRoZWlyIGVxdWF0aW9ucyBzaGFyZSBtYW55IGNvbW1vbiB0ZXJtcyB0aGV5IGFyZSBjb21wdXRlZCBzaW11bHRhbmVvdXNseS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBtXG4gKiBAcGFyYW0ge051bWJlcn0gblxuICogQHBhcmFtIHtOdW1iZXJ9IGxcbiAqIEByZXR1cm4ge0FycmF5fSAzIGNvZWZmaWNpZW50cyBmb3IgVSwgViBhbmQgVyBmdW5jdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVVVldDb2VmZihtLCBuLCBsKSB7XG4gIGNvbnN0IGQgPSBnZXRLcm9uZWNrZXJEZWx0YShtLCAwKTtcbiAgY29uc3QgcmVjaXByb2NhbERlbm9taW5hdG9yID1cbiAgICAgIE1hdGguYWJzKG4pID09PSBsID8gMSAvICgyICogbCAqICgyICogbCAtIDEpKSA6IDEgLyAoKGwgKyBuKSAqIChsIC0gbikpO1xuXG4gIHJldHVybiBbXG4gICAgTWF0aC5zcXJ0KChsICsgbSkgKiAobCAtIG0pICogcmVjaXByb2NhbERlbm9taW5hdG9yKSxcbiAgICAwLjUgKiAoMSAtIDIgKiBkKSAqIE1hdGguc3FydCgoMSArIGQpICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobCArIE1hdGguYWJzKG0pIC0gMSkgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsICsgTWF0aC5hYnMobSkpICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNpcHJvY2FsRGVub21pbmF0b3IpLFxuICAgIC0wLjUgKiAoMSAtIGQpICogTWF0aC5zcXJ0KChsIC0gTWF0aC5hYnMobSkgLSAxKSAqIChsIC0gTWF0aC5hYnMobSkpKSAqXG4gICAgICAgIHJlY2lwcm9jYWxEZW5vbWluYXRvcixcbiAgXTtcbn1cblxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlICgybCsxKSB4ICgybCsxKSByb3RhdGlvbiBtYXRyaXggZm9yIHRoZSBiYW5kIGwuXG4gKiBUaGlzIHVzZXMgdGhlIG1hdHJpY2VzIGNvbXB1dGVkIGZvciBiYW5kIDEgYW5kIGJhbmQgbC0xIHRvIGNvbXB1dGUgdGhlXG4gKiBtYXRyaXggZm9yIGJhbmQgbC4gfHJvdGF0aW9uc3wgbXVzdCBjb250YWluIHRoZSBwcmV2aW91c2x5IGNvbXB1dGVkIGwtMVxuICogcm90YXRpb24gbWF0cmljZXMuXG4gKiBUaGlzIGltcGxlbWVudGF0aW9uIGNvbWVzIGZyb20gcC4gNSAoNjM0NiksIFRhYmxlIDEgYW5kIDIgaW4gWzJdIHRha2luZ1xuICogaW50byBhY2NvdW50IHRoZSBjb3JyZWN0aW9ucyBmcm9tIFsyYl0uXG4gKiBAcGFyYW0ge051bWJlcltdfSBtYXRyaXggLSBOIG1hdHJpY2VzIG9mIGdhaW5Ob2RlcywgZWFjaCB3aXRoIHdoZXJlXG4gKiBuPTEsMiwuLi4sTi5cbiAqIEBwYXJhbSB7TnVtYmVyfSBsXG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVCYW5kUm90YXRpb24obWF0cml4LCBsKSB7XG4gIC8vIFRoZSBsdGggYmFuZCByb3RhdGlvbiBtYXRyaXggaGFzIHJvd3MgYW5kIGNvbHVtbnMgZXF1YWwgdG8gdGhlIG51bWJlciBvZlxuICAvLyBjb2VmZmljaWVudHMgd2l0aGluIHRoYXQgYmFuZCAoLWwgPD0gbSA8PSBsIGltcGxpZXMgMmwgKyAxIGNvZWZmaWNpZW50cykuXG4gIGZvciAobGV0IG0gPSAtbDsgbSA8PSBsOyBtKyspIHtcbiAgICBmb3IgKGxldCBuID0gLWw7IG4gPD0gbDsgbisrKSB7XG4gICAgICBjb25zdCB1dndDb2VmZmljaWVudHMgPSBjb21wdXRlVVZXQ29lZmYobSwgbiwgbCk7XG5cbiAgICAgIC8vIFRoZSBmdW5jdGlvbnMgVSwgViwgVyBhcmUgb25seSBzYWZlIHRvIGNhbGwgaWYgdGhlIGNvZWZmaWNpZW50c1xuICAgICAgLy8gdSwgdiwgdyBhcmUgbm90IHplcm8uXG4gICAgICBpZiAoTWF0aC5hYnModXZ3Q29lZmZpY2llbnRzWzBdKSA+IDApIHtcbiAgICAgICAgdXZ3Q29lZmZpY2llbnRzWzBdICo9IGdldFUobWF0cml4LCBtLCBuLCBsKTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRoLmFicyh1dndDb2VmZmljaWVudHNbMV0pID4gMCkge1xuICAgICAgICB1dndDb2VmZmljaWVudHNbMV0gKj0gZ2V0VihtYXRyaXgsIG0sIG4sIGwpO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGguYWJzKHV2d0NvZWZmaWNpZW50c1syXSkgPiAwKSB7XG4gICAgICAgIHV2d0NvZWZmaWNpZW50c1syXSAqPSBnZXRXKG1hdHJpeCwgbSwgbiwgbCk7XG4gICAgICB9XG5cbiAgICAgIHNldENlbnRlcmVkRWxlbWVudChcbiAgICAgICAgICBtYXRyaXgsIGwsIG0sIG4sXG4gICAgICAgICAgdXZ3Q29lZmZpY2llbnRzWzBdICsgdXZ3Q29lZmZpY2llbnRzWzFdICsgdXZ3Q29lZmZpY2llbnRzWzJdKTtcbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIENvbXB1dGUgdGhlIEhPQSByb3RhdGlvbiBtYXRyaXggYWZ0ZXIgc2V0dGluZyB0aGUgdHJhbnNmb3JtIG1hdHJpeC5cbiAqIEBwYXJhbSB7QXJyYXl9IG1hdHJpeCAtIE4gbWF0cmljZXMgb2YgZ2Fpbk5vZGVzLCBlYWNoIHdpdGggKDJuKzEpIHggKDJuKzEpXG4gKiBlbGVtZW50cywgd2hlcmUgbj0xLDIsLi4uLE4uXG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVIT0FNYXRyaWNlcyhtYXRyaXgpIHtcbiAgLy8gV2Ugc3RhcnQgYnkgY29tcHV0aW5nIHRoZSAybmQtb3JkZXIgbWF0cml4IGZyb20gdGhlIDFzdC1vcmRlciBtYXRyaXguXG4gIGZvciAobGV0IGkgPSAyOyBpIDw9IG1hdHJpeC5sZW5ndGg7IGkrKykge1xuICAgIGNvbXB1dGVCYW5kUm90YXRpb24obWF0cml4LCBpKTtcbiAgfVxufVxuXG5cbi8qKlxuICogSGlnaGVyLW9yZGVyLWFtYmlzb25pYyBkZWNvZGVyIGJhc2VkIG9uIGdhaW4gbm9kZSBuZXR3b3JrLiBXZSBleHBlY3RcbiAqIHRoZSBvcmRlciBvZiB0aGUgY2hhbm5lbHMgdG8gY29uZm9ybSB0byBBQ04gb3JkZXJpbmcuIEJlbG93IGFyZSB0aGUgaGVscGVyXG4gKiBtZXRob2RzIHRvIGNvbXB1dGUgU0ggcm90YXRpb24gdXNpbmcgcmVjdXJzaW9uLiBUaGUgY29kZSB1c2VzIG1hdGhzIGRlc2NyaWJlZFxuICogaW4gdGhlIGZvbGxvd2luZyBwYXBlcnM6XG4gKiAgWzFdIFIuIEdyZWVuLCBcIlNwaGVyaWNhbCBIYXJtb25pYyBMaWdodGluZzogVGhlIEdyaXR0eSBEZXRhaWxzXCIsIEdEQyAyMDAzLFxuICogICAgICBodHRwOi8vd3d3LnJlc2VhcmNoLnNjZWEuY29tL2dkYzIwMDMvc3BoZXJpY2FsLWhhcm1vbmljLWxpZ2h0aW5nLnBkZlxuICogIFsyXSBKLiBJdmFuaWMgYW5kIEsuIFJ1ZWRlbmJlcmcsIFwiUm90YXRpb24gTWF0cmljZXMgZm9yIFJlYWxcbiAqICAgICAgU3BoZXJpY2FsIEhhcm1vbmljcy4gRGlyZWN0IERldGVybWluYXRpb24gYnkgUmVjdXJzaW9uXCIsIEouIFBoeXMuXG4gKiAgICAgIENoZW0uLCB2b2wuIDEwMCwgbm8uIDE1LCBwcC4gNjM0Mi02MzQ3LCAxOTk2LlxuICogICAgICBodHRwOi8vcHVicy5hY3Mub3JnL2RvaS9wZGYvMTAuMTAyMS9qcDk1MzM1MHVcbiAqICBbMmJdIENvcnJlY3Rpb25zIHRvIGluaXRpYWwgcHVibGljYXRpb246XG4gKiAgICAgICBodHRwOi8vcHVicy5hY3Mub3JnL2RvaS9wZGYvMTAuMTAyMS9qcDk4MzMzNTBcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBhbWJpc29uaWNPcmRlciAtIEFtYmlzb25pYyBvcmRlci5cbiAqL1xuZnVuY3Rpb24gSE9BUm90YXRvcihjb250ZXh0LCBhbWJpc29uaWNPcmRlcikge1xuICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5fYW1iaXNvbmljT3JkZXIgPSBhbWJpc29uaWNPcmRlcjtcblxuICAvLyBXZSBuZWVkIHRvIGRldGVybWluZSB0aGUgbnVtYmVyIG9mIGNoYW5uZWxzIEsgYmFzZWQgb24gdGhlIGFtYmlzb25pYyBvcmRlclxuICAvLyBOIHdoZXJlIEsgPSAoTiArIDEpXjIuXG4gIGNvbnN0IG51bWJlck9mQ2hhbm5lbHMgPSAoYW1iaXNvbmljT3JkZXIgKyAxKSAqIChhbWJpc29uaWNPcmRlciArIDEpO1xuXG4gIHRoaXMuX3NwbGl0dGVyID0gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsU3BsaXR0ZXIobnVtYmVyT2ZDaGFubmVscyk7XG4gIHRoaXMuX21lcmdlciA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbE1lcmdlcihudW1iZXJPZkNoYW5uZWxzKTtcblxuICAvLyBDcmVhdGUgYSBzZXQgb2YgcGVyLW9yZGVyIHJvdGF0aW9uIG1hdHJpY2VzIHVzaW5nIGdhaW4gbm9kZXMuXG4gIHRoaXMuX2dhaW5Ob2RlTWF0cml4ID0gW107XG4gIGxldCBvcmRlck9mZnNldDtcbiAgbGV0IHJvd3M7XG4gIGxldCBpbnB1dEluZGV4O1xuICBsZXQgb3V0cHV0SW5kZXg7XG4gIGxldCBtYXRyaXhJbmRleDtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gYW1iaXNvbmljT3JkZXI7IGkrKykge1xuICAgIC8vIEVhY2ggYW1iaXNvbmljIG9yZGVyIHJlcXVpcmVzIGEgc2VwYXJhdGUgKDJsICsgMSkgeCAoMmwgKyAxKSByb3RhdGlvblxuICAgIC8vIG1hdHJpeC4gV2UgY29tcHV0ZSB0aGUgb2Zmc2V0IHZhbHVlIGFzIHRoZSBmaXJzdCBjaGFubmVsIGluZGV4IG9mIHRoZVxuICAgIC8vIGN1cnJlbnQgb3JkZXIgd2hlcmVcbiAgICAvLyAgIGtfbGFzdCA9IGxeMiArIGwgKyBtLFxuICAgIC8vIGFuZCBtID0gLWxcbiAgICAvLyAgIGtfbGFzdCA9IGxeMlxuICAgIG9yZGVyT2Zmc2V0ID0gaSAqIGk7XG5cbiAgICAvLyBVc2VzIHJvdy1tYWpvciBpbmRleGluZy5cbiAgICByb3dzID0gKDIgKiBpICsgMSk7XG5cbiAgICB0aGlzLl9nYWluTm9kZU1hdHJpeFtpIC0gMV0gPSBbXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJvd3M7IGorKykge1xuICAgICAgaW5wdXRJbmRleCA9IG9yZGVyT2Zmc2V0ICsgajtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgcm93czsgaysrKSB7XG4gICAgICAgIG91dHB1dEluZGV4ID0gb3JkZXJPZmZzZXQgKyBrO1xuICAgICAgICBtYXRyaXhJbmRleCA9IGogKiByb3dzICsgaztcbiAgICAgICAgdGhpcy5fZ2Fpbk5vZGVNYXRyaXhbaSAtIDFdW21hdHJpeEluZGV4XSA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgICB0aGlzLl9zcGxpdHRlci5jb25uZWN0KFxuICAgICAgICAgICAgdGhpcy5fZ2Fpbk5vZGVNYXRyaXhbaSAtIDFdW21hdHJpeEluZGV4XSwgaW5wdXRJbmRleCk7XG4gICAgICAgIHRoaXMuX2dhaW5Ob2RlTWF0cml4W2kgLSAxXVttYXRyaXhJbmRleF0uY29ubmVjdChcbiAgICAgICAgICAgIHRoaXMuX21lcmdlciwgMCwgb3V0cHV0SW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFctY2hhbm5lbCBpcyBub3QgaW52b2x2ZWQgaW4gcm90YXRpb24sIHNraXAgc3RyYWlnaHQgdG8gb3VwdXQuXG4gIHRoaXMuX3NwbGl0dGVyLmNvbm5lY3QodGhpcy5fbWVyZ2VyLCAwLCAwKTtcblxuICAvLyBEZWZhdWx0IElkZW50aXR5IG1hdHJpeC5cbiAgdGhpcy5zZXRSb3RhdGlvbk1hdHJpeDMobmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV0pKTtcblxuICAvLyBJbnB1dC9PdXRwdXQgcHJveHkuXG4gIHRoaXMuaW5wdXQgPSB0aGlzLl9zcGxpdHRlcjtcbiAgdGhpcy5vdXRwdXQgPSB0aGlzLl9tZXJnZXI7XG59XG5cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSByb3RhdGlvbiBtYXRyaXggd2l0aCAzeDMgbWF0cml4LlxuICogQHBhcmFtIHtOdW1iZXJbXX0gcm90YXRpb25NYXRyaXgzIC0gQSAzeDMgcm90YXRpb24gbWF0cml4LiAoY29sdW1uLW1ham9yKVxuICovXG5IT0FSb3RhdG9yLnByb3RvdHlwZS5zZXRSb3RhdGlvbk1hdHJpeDMgPSBmdW5jdGlvbihyb3RhdGlvbk1hdHJpeDMpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyArK2kpIHtcbiAgICB0aGlzLl9nYWluTm9kZU1hdHJpeFswXVtpXS5nYWluLnZhbHVlID0gcm90YXRpb25NYXRyaXgzW2ldO1xuICB9XG4gIGNvbXB1dGVIT0FNYXRyaWNlcyh0aGlzLl9nYWluTm9kZU1hdHJpeCk7XG59O1xuXG5cbi8qKlxuICogVXBkYXRlcyB0aGUgcm90YXRpb24gbWF0cml4IHdpdGggNHg0IG1hdHJpeC5cbiAqIEBwYXJhbSB7TnVtYmVyW119IHJvdGF0aW9uTWF0cml4NCAtIEEgNHg0IHJvdGF0aW9uIG1hdHJpeC4gKGNvbHVtbi1tYWpvcilcbiAqL1xuSE9BUm90YXRvci5wcm90b3R5cGUuc2V0Um90YXRpb25NYXRyaXg0ID0gZnVuY3Rpb24ocm90YXRpb25NYXRyaXg0KSB7XG4gIHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzBdLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbMF07XG4gIHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzFdLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbMV07XG4gIHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzJdLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbMl07XG4gIHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzNdLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbNF07XG4gIHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzRdLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbNV07XG4gIHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzVdLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbNl07XG4gIHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzZdLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbOF07XG4gIHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzddLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbOV07XG4gIHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzhdLmdhaW4udmFsdWUgPSByb3RhdGlvbk1hdHJpeDRbMTBdO1xuICBjb21wdXRlSE9BTWF0cmljZXModGhpcy5fZ2Fpbk5vZGVNYXRyaXgpO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIGN1cnJlbnQgM3gzIHJvdGF0aW9uIG1hdHJpeC5cbiAqIEByZXR1cm4ge051bWJlcltdfSAtIEEgM3gzIHJvdGF0aW9uIG1hdHJpeC4gKGNvbHVtbi1tYWpvcilcbiAqL1xuSE9BUm90YXRvci5wcm90b3R5cGUuZ2V0Um90YXRpb25NYXRyaXgzID0gZnVuY3Rpb24oKSB7XG4gIGxldCByb3RhdGlvbk1hdHJpeDMgPSBuZXcgRmxvYXQzMkFycmF5KDkpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDk7ICsraSkge1xuICAgIHJvdGF0aW9uTWF0cml4M1tpXSA9IHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdW2ldLmdhaW4udmFsdWU7XG4gIH1cbiAgcmV0dXJuIHJvdGF0aW9uTWF0cml4Mztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjdXJyZW50IDR4NCByb3RhdGlvbiBtYXRyaXguXG4gKiBAcmV0dXJuIHtOdW1iZXJbXX0gLSBBIDR4NCByb3RhdGlvbiBtYXRyaXguIChjb2x1bW4tbWFqb3IpXG4gKi9cbkhPQVJvdGF0b3IucHJvdG90eXBlLmdldFJvdGF0aW9uTWF0cml4NCA9IGZ1bmN0aW9uKCkge1xuICBsZXQgcm90YXRpb25NYXRyaXg0ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG4gIHJvdGF0aW9uTWF0cml4NFswXSA9IHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzBdLmdhaW4udmFsdWU7XG4gIHJvdGF0aW9uTWF0cml4NFsxXSA9IHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzFdLmdhaW4udmFsdWU7XG4gIHJvdGF0aW9uTWF0cml4NFsyXSA9IHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzJdLmdhaW4udmFsdWU7XG4gIHJvdGF0aW9uTWF0cml4NFs0XSA9IHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzNdLmdhaW4udmFsdWU7XG4gIHJvdGF0aW9uTWF0cml4NFs1XSA9IHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzRdLmdhaW4udmFsdWU7XG4gIHJvdGF0aW9uTWF0cml4NFs2XSA9IHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzVdLmdhaW4udmFsdWU7XG4gIHJvdGF0aW9uTWF0cml4NFs4XSA9IHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzZdLmdhaW4udmFsdWU7XG4gIHJvdGF0aW9uTWF0cml4NFs5XSA9IHRoaXMuX2dhaW5Ob2RlTWF0cml4WzBdWzddLmdhaW4udmFsdWU7XG4gIHJvdGF0aW9uTWF0cml4NFsxMF0gPSB0aGlzLl9nYWluTm9kZU1hdHJpeFswXVs4XS5nYWluLnZhbHVlO1xuICByZXR1cm4gcm90YXRpb25NYXRyaXg0O1xufTtcblxuXG4vKipcbiAqIEdldCB0aGUgY3VycmVudCBhbWJpc29uaWMgb3JkZXIuXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbkhPQVJvdGF0b3IucHJvdG90eXBlLmdldEFtYmlzb25pY09yZGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9hbWJpc29uaWNPcmRlcjtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBIT0FSb3RhdG9yO1xuXG5cbi8qKiovIH0pLFxuLyogMTAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGUgTmFtZXNwYWNlIGZvciBPbW5pdG9uZSBsaWJyYXJ5LlxuICovXG5cblxuXG5cbmV4cG9ydHMuT21uaXRvbmUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDExKTtcblxuXG4vKioqLyB9KSxcbi8qIDExICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGUgT21uaXRvbmUgbGlicmFyeSBuYW1lIHNwYWNlIGFuZCB1c2VyLWZhY2luZyBBUElzLlxuICovXG5cblxuXG5cbmNvbnN0IEJ1ZmZlckxpc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuY29uc3QgRk9BQ29udm9sdmVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KTtcbmNvbnN0IEZPQURlY29kZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEyKTtcbmNvbnN0IEZPQVBoYXNlTWF0Y2hlZEZpbHRlciA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5jb25zdCBGT0FSZW5kZXJlciA9IF9fd2VicGFja19yZXF1aXJlX18oMTQpO1xuY29uc3QgRk9BUm90YXRvciA9IF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5jb25zdCBGT0FSb3V0ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xuY29uc3QgRk9BVmlydHVhbFNwZWFrZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpO1xuY29uc3QgSE9BQ29udm9sdmVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4KTtcbmNvbnN0IEhPQVJlbmRlcmVyID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNik7XG5jb25zdCBIT0FSb3RhdG9yID0gX193ZWJwYWNrX3JlcXVpcmVfXyg5KTtcbmNvbnN0IFBvbHlmaWxsID0gX193ZWJwYWNrX3JlcXVpcmVfXygxOSk7XG5jb25zdCBVdGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5jb25zdCBWZXJzaW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXygyMCk7XG5cbi8vIERFUFJFQ0FURUQgaW4gVjEsIGluIGZhdm9yIG9mIEJ1ZmZlckxpc3QuXG5jb25zdCBBdWRpb0J1ZmZlck1hbmFnZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cbi8qKlxuICogT21uaXRvbmUgbmFtZXNwYWNlLlxuICogQG5hbWVzcGFjZVxuICovXG5sZXQgT21uaXRvbmUgPSB7fTtcblxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEJyb3dzZXJJbmZvXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSAtIEJyb3dzZXIgbmFtZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2ZXJzaW9uIC0gQnJvd3NlciB2ZXJzaW9uLlxuICovXG5cbi8qKlxuICogQW4gb2JqZWN0IGNvbnRhaW5zIHRoZSBkZXRlY3RlZCBicm93c2VyIG5hbWUgYW5kIHZlcnNpb24uXG4gKiBAbWVtYmVyT2YgT21uaXRvbmVcbiAqIEBzdGF0aWMge0Jyb3dzZXJJbmZvfVxuICovXG5PbW5pdG9uZS5icm93c2VySW5mbyA9IFBvbHlmaWxsLmdldEJyb3dzZXJJbmZvKCk7XG5cblxuLy8gREVQUkVDQVRFRCBpbiBWMS4gRE8uIE5PVC4gVVNFLlxuT21uaXRvbmUubG9hZEF1ZGlvQnVmZmVycyA9IGZ1bmN0aW9uKGNvbnRleHQsIHNwZWFrZXJEYXRhKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBuZXcgQXVkaW9CdWZmZXJNYW5hZ2VyKGNvbnRleHQsIHNwZWFrZXJEYXRhLCBmdW5jdGlvbihidWZmZXJzKSB7XG4gICAgICByZXNvbHZlKGJ1ZmZlcnMpO1xuICAgIH0sIHJlamVjdCk7XG4gIH0pO1xufTtcblxuXG4vKipcbiAqIFBlcmZvcm1zIHRoZSBhc3luYyBsb2FkaW5nL2RlY29kaW5nIG9mIG11bHRpcGxlIEF1ZGlvQnVmZmVycyBmcm9tIG11bHRpcGxlXG4gKiBVUkxzLlxuICogQHBhcmFtIHtCYXNlQXVkaW9Db250ZXh0fSBjb250ZXh0IC0gQXNzb2NpYXRlZCBCYXNlQXVkaW9Db250ZXh0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gYnVmZmVyRGF0YSAtIEFuIG9yZGVyZWQgbGlzdCBvZiBVUkxzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIEJ1ZmZlckxpc3Qgb3B0aW9ucy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5kYXRhVHlwZT0ndXJsJ10gLSBCdWZmZXJMaXN0IGRhdGEgdHlwZS5cbiAqIEByZXR1cm4ge1Byb21pc2U8QXVkaW9CdWZmZXJbXT59IC0gVGhlIHByb21pc2UgcmVzb2x2ZXMgd2l0aCBhbiBhcnJheSBvZlxuICogQXVkaW9CdWZmZXIuXG4gKi9cbk9tbml0b25lLmNyZWF0ZUJ1ZmZlckxpc3QgPSBmdW5jdGlvbihjb250ZXh0LCBidWZmZXJEYXRhLCBvcHRpb25zKSB7XG4gIGNvbnN0IGJ1ZmZlckxpc3QgPVxuICAgICAgbmV3IEJ1ZmZlckxpc3QoY29udGV4dCwgYnVmZmVyRGF0YSwgb3B0aW9ucyB8fCB7ZGF0YVR5cGU6ICd1cmwnfSk7XG4gIHJldHVybiBidWZmZXJMaXN0LmxvYWQoKTtcbn07XG5cblxuLyoqXG4gKiBQZXJmb3JtIGNoYW5uZWwtd2lzZSBtZXJnZSBvbiBtdWx0aXBsZSBBdWRpb0J1ZmZlcnMuIFRoZSBzYW1wbGUgcmF0ZSBhbmRcbiAqIHRoZSBsZW5ndGggb2YgYnVmZmVycyB0byBiZSBtZXJnZWQgbXVzdCBiZSBpZGVudGljYWwuXG4gKiBAc3RhdGljXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7QmFzZUF1ZGlvQ29udGV4dH0gY29udGV4dCAtIEFzc29jaWF0ZWQgQmFzZUF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7QXVkaW9CdWZmZXJbXX0gYnVmZmVyTGlzdCAtIEFuIGFycmF5IG9mIEF1ZGlvQnVmZmVycyB0byBiZSBtZXJnZWRcbiAqIGNoYW5uZWwtd2lzZS5cbiAqIEByZXR1cm4ge0F1ZGlvQnVmZmVyfSAtIEEgc2luZ2xlIG1lcmdlZCBBdWRpb0J1ZmZlci5cbiAqL1xuT21uaXRvbmUubWVyZ2VCdWZmZXJMaXN0QnlDaGFubmVsID0gVXRpbHMubWVyZ2VCdWZmZXJMaXN0QnlDaGFubmVsO1xuXG5cbi8qKlxuICogUGVyZm9ybSBjaGFubmVsLXdpc2Ugc3BsaXQgYnkgdGhlIGdpdmVuIGNoYW5uZWwgY291bnQuIEZvciBleGFtcGxlLFxuICogMSB4IEF1ZGlvQnVmZmVyKDgpIC0+IHNwbGl0QnVmZmVyKGNvbnRleHQsIGJ1ZmZlciwgMikgLT4gNCB4IEF1ZGlvQnVmZmVyKDIpLlxuICogQHN0YXRpY1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Jhc2VBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEJhc2VBdWRpb0NvbnRleHQuXG4gKiBAcGFyYW0ge0F1ZGlvQnVmZmVyfSBhdWRpb0J1ZmZlciAtIEFuIEF1ZGlvQnVmZmVyIHRvIGJlIHNwbGl0dGVkLlxuICogQHBhcmFtIHtOdW1iZXJ9IHNwbGl0QnkgLSBOdW1iZXIgb2YgY2hhbm5lbHMgdG8gYmUgc3BsaXR0ZWQuXG4gKiBAcmV0dXJuIHtBdWRpb0J1ZmZlcltdfSAtIEFuIGFycmF5IG9mIHNwbGl0dGVkIEF1ZGlvQnVmZmVycy5cbiAqL1xuT21uaXRvbmUuc3BsaXRCdWZmZXJieUNoYW5uZWwgPSBVdGlscy5zcGxpdEJ1ZmZlcmJ5Q2hhbm5lbDtcblxuXG4vKipcbiAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRk9BIENvbnZvbHZlci5cbiAqIEBzZWUgRk9BQ29udm9sdmVyXG4gKiBAcGFyYW0ge0Jhc2VBdWRpb0NvbnRleHR9IGNvbnRleHQgVGhlIGFzc29jaWF0ZWQgQXVkaW9Db250ZXh0LlxuICogQHBhcmFtIHtBdWRpb0J1ZmZlcltdfSBbaHJpckJ1ZmZlckxpc3RdIC0gQW4gb3JkZXJlZC1saXN0IG9mIHN0ZXJlb1xuICogQHJldHVybiB7Rk9BQ29udm9sdmVyfVxuICovXG5PbW5pdG9uZS5jcmVhdGVGT0FDb252b2x2ZXIgPSBmdW5jdGlvbihjb250ZXh0LCBocmlyQnVmZmVyTGlzdCkge1xuICByZXR1cm4gbmV3IEZPQUNvbnZvbHZlcihjb250ZXh0LCBocmlyQnVmZmVyTGlzdCk7XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEZPQSBSb3V0ZXIuXG4gKiBAc2VlIEZPQVJvdXRlclxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7TnVtYmVyW119IGNoYW5uZWxNYXAgLSBSb3V0aW5nIGRlc3RpbmF0aW9uIGFycmF5LlxuICogQHJldHVybiB7Rk9BUm91dGVyfVxuICovXG5PbW5pdG9uZS5jcmVhdGVGT0FSb3V0ZXIgPSBmdW5jdGlvbihjb250ZXh0LCBjaGFubmVsTWFwKSB7XG4gIHJldHVybiBuZXcgRk9BUm91dGVyKGNvbnRleHQsIGNoYW5uZWxNYXApO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBGT0EgUm90YXRvci5cbiAqIEBzZWUgRk9BUm90YXRvclxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEF1ZGlvQ29udGV4dC5cbiAqIEByZXR1cm4ge0ZPQVJvdGF0b3J9XG4gKi9cbk9tbml0b25lLmNyZWF0ZUZPQVJvdGF0b3IgPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gIHJldHVybiBuZXcgRk9BUm90YXRvcihjb250ZXh0KTtcbn07XG5cblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgRk9BUGhhc2VNYXRjaGVkRmlsdGVyLlxuICogQGlnbm9yZVxuICogQHNlZSBGT0FQaGFzZU1hdGNoZWRGaWx0ZXJcbiAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBjb250ZXh0IC0gQXNzb2NpYXRlZCBBdWRpb0NvbnRleHQuXG4gKiBAcmV0dXJuIHtGT0FQaGFzZU1hdGNoZWRGaWx0ZXJ9XG4gKi9cbk9tbml0b25lLmNyZWF0ZUZPQVBoYXNlTWF0Y2hlZEZpbHRlciA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgcmV0dXJuIG5ldyBGT0FQaGFzZU1hdGNoZWRGaWx0ZXIoY29udGV4dCk7XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEZPQVZpcnR1YWxTcGVha2VyLiBGb3IgcGFyYW1ldGVycywgcmVmZXIgdGhlXG4gKiBkZWZpbml0aW9uIG9mIFZpcnR1YWxTcGVha2VyIGNsYXNzLlxuICogQGlnbm9yZVxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucy5cbiAqIEByZXR1cm4ge0ZPQVZpcnR1YWxTcGVha2VyfVxuICovXG5PbW5pdG9uZS5jcmVhdGVGT0FWaXJ0dWFsU3BlYWtlciA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBGT0FWaXJ0dWFsU3BlYWtlcihjb250ZXh0LCBvcHRpb25zKTtcbn07XG5cblxuLyoqXG4gKiBERVBSRUNBVEVELiBVc2UgRk9BUmVuZGVyZXIgaW5zdGFuY2UuXG4gKiBAc2VlIEZPQVJlbmRlcmVyXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY29udGV4dCAtIEFzc29jaWF0ZWQgQXVkaW9Db250ZXh0LlxuICogQHBhcmFtIHtET01FbGVtZW50fSB2aWRlb0VsZW1lbnQgLSBWaWRlbyBvciBBdWRpbyBET00gZWxlbWVudCB0byBiZSBzdHJlYW1lZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBmb3IgRk9BIGRlY29kZXIuXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5iYXNlUmVzb3VyY2VVcmwgLSBCYXNlIFVSTCBmb3IgcmVzb3VyY2VzLlxuICogKGJhc2UgcGF0aCBmb3IgSFJJUiBmaWxlcylcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5wb3N0R2Fpbj0yNi4wXSAtIFBvc3QtZGVjb2RpbmcgZ2FpbiBjb21wZW5zYXRpb24uXG4gKiBAcGFyYW0ge0FycmF5fSBbb3B0aW9ucy5yb3V0aW5nRGVzdGluYXRpb25dICBDdXN0b20gY2hhbm5lbCBsYXlvdXQuXG4gKiBAcmV0dXJuIHtGT0FEZWNvZGVyfVxuICovXG5PbW5pdG9uZS5jcmVhdGVGT0FEZWNvZGVyID0gZnVuY3Rpb24oY29udGV4dCwgdmlkZW9FbGVtZW50LCBvcHRpb25zKSB7XG4gIFV0aWxzLmxvZygnV0FSTklORzogRk9BRGVjb2RlciBpcyBkZXByZWNhdGVkIGluIGZhdm9yIG9mIEZPQVJlbmRlcmVyLicpO1xuICByZXR1cm4gbmV3IEZPQURlY29kZXIoY29udGV4dCwgdmlkZW9FbGVtZW50LCBvcHRpb25zKTtcbn07XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBGT0FSZW5kZXJlciwgdGhlIGZpcnN0LW9yZGVyIGFtYmlzb25pYyBkZWNvZGVyIGFuZCB0aGUgb3B0aW1pemVkXG4gKiBiaW5hdXJhbCByZW5kZXJlci5cbiAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBjb250ZXh0IC0gQXNzb2NpYXRlZCBBdWRpb0NvbnRleHQuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmNoYW5uZWxNYXBdIC0gQ3VzdG9tIGNoYW5uZWwgcm91dGluZyBtYXAuIFVzZWZ1bCBmb3JcbiAqIGhhbmRsaW5nIHRoZSBpbmNvbnNpc3RlbmN5IGluIGJyb3dzZXIncyBtdWx0aWNoYW5uZWwgYXVkaW8gZGVjb2RpbmcuXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmhyaXJQYXRoTGlzdF0gLSBBIGxpc3Qgb2YgcGF0aHMgdG8gSFJJUiBmaWxlcy4gSXRcbiAqIG92ZXJyaWRlcyB0aGUgaW50ZXJuYWwgSFJJUiBsaXN0IGlmIGdpdmVuLlxuICogQHBhcmFtIHtSZW5kZXJpbmdNb2RlfSBbY29uZmlnLnJlbmRlcmluZ01vZGU9J2FtYmlzb25pYyddIC0gUmVuZGVyaW5nIG1vZGUuXG4gKiBAcmV0dXJuIHtGT0FSZW5kZXJlcn1cbiAqL1xuT21uaXRvbmUuY3JlYXRlRk9BUmVuZGVyZXIgPSBmdW5jdGlvbihjb250ZXh0LCBjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBGT0FSZW5kZXJlcihjb250ZXh0LCBjb25maWcpO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZXMgSE9BUm90YXRvciBmb3IgaGlnaGVyLW9yZGVyIGFtYmlzb25pY3Mgcm90YXRpb24uXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY29udGV4dCAtIEFzc29jaWF0ZWQgQXVkaW9Db250ZXh0LlxuICogQHBhcmFtIHtOdW1iZXJ9IGFtYmlzb25pY09yZGVyIC0gQW1iaXNvbmljIG9yZGVyLlxuICogQHJldHVybiB7SE9BUm90YXRvcn1cbiAqL1xuT21uaXRvbmUuY3JlYXRlSE9BUm90YXRvciA9IGZ1bmN0aW9uKGNvbnRleHQsIGFtYmlzb25pY09yZGVyKSB7XG4gIHJldHVybiBuZXcgSE9BUm90YXRvcihjb250ZXh0LCBhbWJpc29uaWNPcmRlcik7XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlcyBIT0FDb252b2x2ZXIgcGVyZm9ybXMgdGhlIG11bHRpLWNoYW5uZWwgY29udm9sdXRpb24gZm9yIHRoZSBvcHRtaXplZFxuICogYmluYXVyYWwgcmVuZGVyaW5nLlxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBhbWJpc29uaWNPcmRlciAtIEFtYmlzb25pYyBvcmRlci4gKDIgb3IgMylcbiAqIEBwYXJhbSB7QXVkaW9CdWZmZXJbXX0gW2hyaXJCdWZmZXJMaXN0XSAtIEFuIG9yZGVyZWQtbGlzdCBvZiBzdGVyZW9cbiAqIEF1ZGlvQnVmZmVycyBmb3IgY29udm9sdXRpb24uIChTT0E6IDUgQXVkaW9CdWZmZXJzLCBUT0E6IDggQXVkaW9CdWZmZXJzKVxuICogQHJldHVybiB7SE9BQ29udm92bGVyfVxuICovXG5PbW5pdG9uZS5jcmVhdGVIT0FDb252b2x2ZXIgPSBmdW5jdGlvbihcbiAgICBjb250ZXh0LCBhbWJpc29uaWNPcmRlciwgaHJpckJ1ZmZlckxpc3QpIHtcbiAgcmV0dXJuIG5ldyBIT0FDb252b2x2ZXIoY29udGV4dCwgYW1iaXNvbmljT3JkZXIsIGhyaXJCdWZmZXJMaXN0KTtcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIEhPQVJlbmRlcmVyIGZvciBoaWdoZXItb3JkZXIgYW1iaXNvbmljIGRlY29kaW5nIGFuZCB0aGUgb3B0aW1pemVkXG4gKiBiaW5hdXJhbCByZW5kZXJpbmcuXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY29udGV4dCAtIEFzc29jaWF0ZWQgQXVkaW9Db250ZXh0LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICogQHBhcmFtIHtOdW1iZXJ9IFtjb25maWcuYW1iaXNvbmljT3JkZXI9M10gLSBBbWJpc29uaWMgb3JkZXIuXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmhyaXJQYXRoTGlzdF0gLSBBIGxpc3Qgb2YgcGF0aHMgdG8gSFJJUiBmaWxlcy4gSXRcbiAqIG92ZXJyaWRlcyB0aGUgaW50ZXJuYWwgSFJJUiBsaXN0IGlmIGdpdmVuLlxuICogQHBhcmFtIHtSZW5kZXJpbmdNb2RlfSBbY29uZmlnLnJlbmRlcmluZ01vZGU9J2FtYmlzb25pYyddIC0gUmVuZGVyaW5nIG1vZGUuXG4gKiBAcmV0dXJuIHtIT0FSZW5kZXJlcn1cbiAqL1xuT21uaXRvbmUuY3JlYXRlSE9BUmVuZGVyZXIgPSBmdW5jdGlvbihjb250ZXh0LCBjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBIT0FSZW5kZXJlcihjb250ZXh0LCBjb25maWcpO1xufTtcblxuXG4vLyBIYW5kbGVyIFByZWxvYWQgVGFza3MuXG4vLyAtIERldGVjdHMgdGhlIGJyb3dzZXIgaW5mb3JtYXRpb24uXG4vLyAtIFByaW50cyBvdXQgdGhlIHZlcnNpb24gbnVtYmVyLlxuKGZ1bmN0aW9uKCkge1xuICBVdGlscy5sb2coJ1ZlcnNpb24gJyArIFZlcnNpb24gKyAnIChydW5uaW5nICcgK1xuICAgICAgT21uaXRvbmUuYnJvd3NlckluZm8ubmFtZSArICcgJyArIE9tbml0b25lLmJyb3dzZXJJbmZvLnZlcnNpb24gK1xuICAgICAgJyBvbiAnICsgT21uaXRvbmUuYnJvd3NlckluZm8ucGxhdGZvcm0gKycpJyk7XG4gIGlmIChPbW5pdG9uZS5icm93c2VySW5mby5uYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzYWZhcmknKSB7XG4gICAgUG9seWZpbGwucGF0Y2hTYWZhcmkoKTtcbiAgICBVdGlscy5sb2coT21uaXRvbmUuYnJvd3NlckluZm8ubmFtZSArICcgZGV0ZWN0ZWQuIEFwcGxpeWluZyBwb2x5ZmlsbC4uLicpO1xuICB9XG59KSgpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gT21uaXRvbmU7XG5cblxuLyoqKi8gfSksXG4vKiAxMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5cbi8qKlxuICogQGZpbGUgT21uaXRvbmUgRk9BIGRlY29kZXIsIERFUFJFQ0FURUQgaW4gZmF2b3Igb2YgRk9BUmVuZGVyZXIuXG4gKi9cblxuXG5cbmNvbnN0IEF1ZGlvQnVmZmVyTWFuYWdlciA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5jb25zdCBGT0FSb3V0ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xuY29uc3QgRk9BUm90YXRvciA9IF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5jb25zdCBGT0FQaGFzZU1hdGNoZWRGaWx0ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuY29uc3QgRk9BVmlydHVhbFNwZWFrZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpO1xuY29uc3QgRk9BU3BlYWtlckRhdGEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEzKTtcbmNvbnN0IFV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuLy8gQnkgZGVmYXVsdCwgT21uaXRvbmUgZmV0Y2hlcyBJUiBmcm9tIHRoZSBzcGF0aWFsIG1lZGlhIHJlcG9zaXRvcnkuXG5jb25zdCBIUlRGU0VUX1VSTCA9ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vR29vZ2xlQ2hyb21lL29tbml0b25lL21hc3Rlci9idWlsZC9yZXNvdXJjZXMvJztcblxuLy8gUG9zdCBnYWluIGNvbXBlbnNhdGlvbiB2YWx1ZS5cbmxldCBQT1NUX0dBSU5fREIgPSAwO1xuXG5cbi8qKlxuICogT21uaXRvbmUgRk9BIGRlY29kZXIuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBjb250ZXh0IC0gQXNzb2NpYXRlZCBBdWRpb0NvbnRleHQuXG4gKiBAcGFyYW0ge1ZpZGVvRWxlbWVudH0gdmlkZW9FbGVtZW50IC0gVGFyZ2V0IHZpZGVvIChvciBhdWRpbykgZWxlbWVudCBmb3JcbiAqIHN0cmVhbWluZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5IUlRGU2V0VXJsIC0gQmFzZSBVUkwgZm9yIHRoZSBjdWJlIEhSVEYgc2V0cy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnBvc3RHYWluREIgLSBQb3N0LWRlY29kaW5nIGdhaW4gY29tcGVuc2F0aW9uIGluIGRCLlxuICogQHBhcmFtIHtOdW1iZXJbXX0gb3B0aW9ucy5jaGFubmVsTWFwIC0gQ3VzdG9tIGNoYW5uZWwgbWFwLlxuICovXG5mdW5jdGlvbiBGT0FEZWNvZGVyKGNvbnRleHQsIHZpZGVvRWxlbWVudCwgb3B0aW9ucykge1xuICB0aGlzLl9pc0RlY29kZXJSZWFkeSA9IGZhbHNlO1xuICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5fdmlkZW9FbGVtZW50ID0gdmlkZW9FbGVtZW50O1xuICB0aGlzLl9kZWNvZGluZ01vZGUgPSAnYW1iaXNvbmljJztcblxuICB0aGlzLl9wb3N0R2FpbkRCID0gUE9TVF9HQUlOX0RCO1xuICB0aGlzLl9IUlRGU2V0VXJsID0gSFJURlNFVF9VUkw7XG4gIHRoaXMuX2NoYW5uZWxNYXAgPSBGT0FSb3V0ZXIuQ2hhbm5lbE1hcC5ERUZBVUxUOyAvLyBBQ05cblxuICBpZiAob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLnBvc3RHYWluREIpIHtcbiAgICAgIHRoaXMuX3Bvc3RHYWluREIgPSBvcHRpb25zLnBvc3RHYWluREI7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLkhSVEZTZXRVcmwpIHtcbiAgICAgIHRoaXMuX0hSVEZTZXRVcmwgPSBvcHRpb25zLkhSVEZTZXRVcmw7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmNoYW5uZWxNYXApIHtcbiAgICAgIHRoaXMuX2NoYW5uZWxNYXAgPSBvcHRpb25zLmNoYW5uZWxNYXA7XG4gICAgfVxuICB9XG5cbiAgLy8gUmVhcnJhbmdlIHNwZWFrZXIgZGF0YSBiYXNlZCBvbiB8b3B0aW9ucy5IUlRGU2V0VXJsfC5cbiAgdGhpcy5fc3BlYWtlckRhdGEgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBGT0FTcGVha2VyRGF0YS5sZW5ndGg7ICsraSkge1xuICAgIHRoaXMuX3NwZWFrZXJEYXRhLnB1c2goe1xuICAgICAgbmFtZTogRk9BU3BlYWtlckRhdGFbaV0ubmFtZSxcbiAgICAgIHVybDogdGhpcy5fSFJURlNldFVybCArICcvJyArIEZPQVNwZWFrZXJEYXRhW2ldLnVybCxcbiAgICAgIGNvZWY6IEZPQVNwZWFrZXJEYXRhW2ldLmNvZWYsXG4gICAgfSk7XG4gIH1cblxuICB0aGlzLl90ZW1wTWF0cml4NCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xufVxuXG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhbmQgbG9hZCB0aGUgcmVzb3VyY2VzIGZvciB0aGUgZGVjb2RlLlxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuRk9BRGVjb2Rlci5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICBVdGlscy5sb2coJ0luaXRpYWxpemluZy4uLiAobW9kZTogJyArIHRoaXMuX2RlY29kaW5nTW9kZSArICcpJyk7XG5cbiAgLy8gUmVyb3V0aW5nIGNoYW5uZWxzIGlmIG5lY2Vzc2FyeS5cbiAgbGV0IGNoYW5uZWxNYXBTdHJpbmcgPSB0aGlzLl9jaGFubmVsTWFwLnRvU3RyaW5nKCk7XG4gIGxldCBkZWZhdWx0Q2hhbm5lbE1hcFN0cmluZyA9IEZPQVJvdXRlci5DaGFubmVsTWFwLkRFRkFVTFQudG9TdHJpbmcoKTtcbiAgaWYgKGNoYW5uZWxNYXBTdHJpbmcgIT09IGRlZmF1bHRDaGFubmVsTWFwU3RyaW5nKSB7XG4gICAgVXRpbHMubG9nKCdSZW1hcHBpbmcgY2hhbm5lbHMgKFsnICsgZGVmYXVsdENoYW5uZWxNYXBTdHJpbmcgKyAnXSAtPiBbJ1xuICAgICAgKyBjaGFubmVsTWFwU3RyaW5nICsgJ10pJyk7XG4gIH1cblxuICB0aGlzLl9hdWRpb0VsZW1lbnRTb3VyY2UgPVxuICAgICAgdGhpcy5fY29udGV4dC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodGhpcy5fdmlkZW9FbGVtZW50KTtcbiAgdGhpcy5fZm9hUm91dGVyID0gbmV3IEZPQVJvdXRlcih0aGlzLl9jb250ZXh0LCB0aGlzLl9jaGFubmVsTWFwKTtcbiAgdGhpcy5fZm9hUm90YXRvciA9IG5ldyBGT0FSb3RhdG9yKHRoaXMuX2NvbnRleHQpO1xuICB0aGlzLl9mb2FQaGFzZU1hdGNoZWRGaWx0ZXIgPSBuZXcgRk9BUGhhc2VNYXRjaGVkRmlsdGVyKHRoaXMuX2NvbnRleHQpO1xuXG4gIHRoaXMuX2F1ZGlvRWxlbWVudFNvdXJjZS5jb25uZWN0KHRoaXMuX2ZvYVJvdXRlci5pbnB1dCk7XG4gIHRoaXMuX2ZvYVJvdXRlci5vdXRwdXQuY29ubmVjdCh0aGlzLl9mb2FSb3RhdG9yLmlucHV0KTtcbiAgdGhpcy5fZm9hUm90YXRvci5vdXRwdXQuY29ubmVjdCh0aGlzLl9mb2FQaGFzZU1hdGNoZWRGaWx0ZXIuaW5wdXQpO1xuXG4gIHRoaXMuX2ZvYVZpcnR1YWxTcGVha2VycyA9IFtdO1xuXG4gIC8vIEJ5cGFzcyBzaWduYWwgcGF0aC5cbiAgdGhpcy5fYnlwYXNzID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX2F1ZGlvRWxlbWVudFNvdXJjZS5jb25uZWN0KHRoaXMuX2J5cGFzcyk7XG5cbiAgLy8gR2V0IHRoZSBsaW5lYXIgYW1wbGl0dWRlIGZyb20gdGhlIHBvc3QgZ2FpbiBvcHRpb24sIHdoaWNoIGlzIGluIGRlY2liZWwuXG4gIGNvbnN0IHBvc3RHYWluTGluZWFyID0gTWF0aC5wb3coMTAsIHRoaXMuX3Bvc3RHYWluREIvMjApO1xuICBVdGlscy5sb2coJ0dhaW4gY29tcGVuc2F0aW9uOiAnICsgcG9zdEdhaW5MaW5lYXIgKyAnICgnICsgdGhpcy5fcG9zdEdhaW5EQlxuICAgICsgJ2RCKScpO1xuXG4gIC8vIFRoaXMgcmV0dXJucyBhIHByb21pc2Ugc28gZGV2ZWxvcGVycyBjYW4gdXNlIHRoZSBkZWNvZGVyIHdoZW4gaXQgaXMgcmVhZHkuXG4gIGNvbnN0IHRoYXQgPSB0aGlzO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgbmV3IEF1ZGlvQnVmZmVyTWFuYWdlcih0aGF0Ll9jb250ZXh0LCB0aGF0Ll9zcGVha2VyRGF0YSxcbiAgICAgIGZ1bmN0aW9uKGJ1ZmZlcnMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGF0Ll9zcGVha2VyRGF0YS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIHRoYXQuX2ZvYVZpcnR1YWxTcGVha2Vyc1tpXSA9IG5ldyBGT0FWaXJ0dWFsU3BlYWtlcih0aGF0Ll9jb250ZXh0LCB7XG4gICAgICAgICAgICBjb2VmZmljaWVudHM6IHRoYXQuX3NwZWFrZXJEYXRhW2ldLmNvZWYsXG4gICAgICAgICAgICBJUjogYnVmZmVycy5nZXQodGhhdC5fc3BlYWtlckRhdGFbaV0ubmFtZSksXG4gICAgICAgICAgICBnYWluOiBwb3N0R2FpbkxpbmVhcixcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoYXQuX2ZvYVBoYXNlTWF0Y2hlZEZpbHRlci5vdXRwdXQuY29ubmVjdChcbiAgICAgICAgICAgIHRoYXQuX2ZvYVZpcnR1YWxTcGVha2Vyc1tpXS5pbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIGRlY29kaW5nIG1vZGUuXG4gICAgICAgIHRoYXQuc2V0TW9kZSh0aGF0Ll9kZWNvZGluZ01vZGUpO1xuICAgICAgICB0aGF0Ll9pc0RlY29kZXJSZWFkeSA9IHRydWU7XG4gICAgICAgIFV0aWxzLmxvZygnSFJURiBJUnMgYXJlIGxvYWRlZCBzdWNjZXNzZnVsbHkuIFRoZSBkZWNvZGVyIGlzIHJlYWR5LicpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCByZWplY3QpO1xuICB9KTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSByb3RhdGlvbiBtYXRyaXggZm9yIHRoZSBzb3VuZCBmaWVsZCByb3RhdGlvbi5cbiAqIEBwYXJhbSB7QXJyYXl9IHJvdGF0aW9uTWF0cml4ICAgICAgM3gzIHJvdGF0aW9uIG1hdHJpeCAocm93LW1ham9yXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcHJlc2VudGF0aW9uKVxuICovXG5GT0FEZWNvZGVyLnByb3RvdHlwZS5zZXRSb3RhdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKHJvdGF0aW9uTWF0cml4KSB7XG4gIHRoaXMuX2ZvYVJvdGF0b3Iuc2V0Um90YXRpb25NYXRyaXgocm90YXRpb25NYXRyaXgpO1xufTtcblxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgcm90YXRpb24gbWF0cml4IGZyb20gYSBUaHJlZS5qcyBjYW1lcmEgb2JqZWN0LlxuICogQHBhcmFtICB7T2JqZWN0fSBjYW1lcmFNYXRyaXggICAgICBUaGUgTWF0cml4NCBvYmVqY3Qgb2YgVGhyZWUuanMgdGhlIGNhbWVyYS5cbiAqL1xuRk9BRGVjb2Rlci5wcm90b3R5cGUuc2V0Um90YXRpb25NYXRyaXhGcm9tQ2FtZXJhID0gZnVuY3Rpb24oY2FtZXJhTWF0cml4KSB7XG4gIC8vIEV4dHJhY3QgdGhlIGlubmVyIGFycmF5IGVsZW1lbnRzIGFuZCBpbnZlcnNlLiAoVGhlIGFjdHVhbCB2aWV3IHJvdGF0aW9uIGlzXG4gIC8vIHRoZSBvcHBvc2l0ZSBvZiB0aGUgY2FtZXJhIG1vdmVtZW50LilcbiAgVXRpbHMuaW52ZXJ0TWF0cml4NCh0aGlzLl90ZW1wTWF0cml4NCwgY2FtZXJhTWF0cml4LmVsZW1lbnRzKTtcbiAgdGhpcy5fZm9hUm90YXRvci5zZXRSb3RhdGlvbk1hdHJpeDQodGhpcy5fdGVtcE1hdHJpeDQpO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGRlY29kaW5nIG1vZGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gbW9kZSAgICAgICAgICAgICAgIERlY29kaW5nIG1vZGUuIFdoZW4gdGhlIG1vZGUgaXMgJ2J5cGFzcydcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGRlY29kZXIgaXMgZGlzYWJsZWQgYW5kIGJ5cGFzcyB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgc3RyZWFtIHRvIHRoZSBvdXRwdXQuIFNldHRpbmcgdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGUgdG8gJ2FtYmlzb25pYycgYWN0aXZhdGVzIHRoZSBkZWNvZGVyLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaGVuIHRoZSBtb2RlIGlzICdvZmYnLCBhbGwgdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NpbmcgaXMgY29tcGxldGVseSB0dXJuZWQgb2ZmIHNhdmluZ1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgQ1BVIHBvd2VyLlxuICovXG5GT0FEZWNvZGVyLnByb3RvdHlwZS5zZXRNb2RlID0gZnVuY3Rpb24obW9kZSkge1xuICBpZiAobW9kZSA9PT0gdGhpcy5fZGVjb2RpbmdNb2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3dpdGNoIChtb2RlKSB7XG4gICAgY2FzZSAnYnlwYXNzJzpcbiAgICAgIHRoaXMuX2RlY29kaW5nTW9kZSA9ICdieXBhc3MnO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9mb2FWaXJ0dWFsU3BlYWtlcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdGhpcy5fZm9hVmlydHVhbFNwZWFrZXJzW2ldLmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2J5cGFzcy5jb25uZWN0KHRoaXMuX2NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdhbWJpc29uaWMnOlxuICAgICAgdGhpcy5fZGVjb2RpbmdNb2RlID0gJ2FtYmlzb25pYyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2ZvYVZpcnR1YWxTcGVha2Vycy5sZW5ndGg7ICsraSkge1xuICAgICAgICB0aGlzLl9mb2FWaXJ0dWFsU3BlYWtlcnNbaV0uZW5hYmxlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9ieXBhc3MuZGlzY29ubmVjdCgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdvZmYnOlxuICAgICAgdGhpcy5fZGVjb2RpbmdNb2RlID0gJ29mZic7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2ZvYVZpcnR1YWxTcGVha2Vycy5sZW5ndGg7ICsraSkge1xuICAgICAgICB0aGlzLl9mb2FWaXJ0dWFsU3BlYWtlcnNbaV0uZGlzYWJsZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fYnlwYXNzLmRpc2Nvbm5lY3QoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgVXRpbHMubG9nKCdEZWNvZGluZyBtb2RlIGNoYW5nZWQuICgnICsgbW9kZSArICcpJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZPQURlY29kZXI7XG5cblxuLyoqKi8gfSksXG4vKiAxMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG4vKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuXG4vKipcbiAqIFRoZSBkYXRhIGZvciBGT0FWaXJ0dWFsU3BlYWtlci4gRWFjaCBlbnRyeSBjb250YWlucyB0aGUgVVJMIGZvciBJUiBmaWxlcyBhbmRcbiAqIHRoZSBnYWluIGNvZWZmaWNpZW50cyBmb3IgdGhlIGFzc29jaWF0ZWQgSVIgZmlsZXMuIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2ZcbiAqIGNvZWZmaWNpZW50cyBmb2xsb3dzIHRoZSBBQ04gY2hhbm5lbCBvcmRlcmluZy4gKFcsWSxaLFgpXG4gKiBAdHlwZSB7T2JqZWN0W119XG4gKi9cbmNvbnN0IEZPQVNwZWFrZXJEYXRhID0gW3tcbiAgbmFtZTogJ0UzNV9BMTM1JyxcbiAgdXJsOiAnRTM1X0ExMzUud2F2JyxcbiAgZ2FpbkZhY3RvcjogMSxcbiAgY29lZjogWy4xMjUwLCAwLjIxNjQ5NSwgMC4yMTY1MywgLTAuMjE2NDk1XSxcbn0sIHtcbiAgbmFtZTogJ0UzNV9BLTEzNScsXG4gIHVybDogJ0UzNV9BLTEzNS53YXYnLFxuICBnYWluRmFjdG9yOiAxLFxuICBjb2VmOiBbLjEyNTAsIC0wLjIxNjQ5NSwgMC4yMTY1MywgLTAuMjE2NDk1XSxcbn0sIHtcbiAgbmFtZTogJ0UtMzVfQTEzNScsXG4gIHVybDogJ0UtMzVfQTEzNS53YXYnLFxuICBnYWluRmFjdG9yOiAxLFxuICBjb2VmOiBbLjEyNTAsIDAuMjE2NDk1LCAtMC4yMTY1MywgLTAuMjE2NDk1XSxcbn0sIHtcbiAgbmFtZTogJ0UtMzVfQS0xMzUnLFxuICB1cmw6ICdFLTM1X0EtMTM1LndhdicsXG4gIGdhaW5GYWN0b3I6IDEsXG4gIGNvZWY6IFsuMTI1MCwgLTAuMjE2NDk1LCAtMC4yMTY1MywgLTAuMjE2NDk1XSxcbn0sIHtcbiAgbmFtZTogJ0UzNV9BNDUnLFxuICB1cmw6ICdFMzVfQTQ1LndhdicsXG4gIGdhaW5GYWN0b3I6IDEsXG4gIGNvZWY6IFsuMTI1MCwgMC4yMTY0OTUsIDAuMjE2NTMsIDAuMjE2NDk1XSxcbn0sIHtcbiAgbmFtZTogJ0UzNV9BLTQ1JyxcbiAgdXJsOiAnRTM1X0EtNDUud2F2JyxcbiAgZ2FpbkZhY3RvcjogMSxcbiAgY29lZjogWy4xMjUwLCAtMC4yMTY0OTUsIDAuMjE2NTMsIDAuMjE2NDk1XSxcbn0sIHtcbiAgbmFtZTogJ0UtMzVfQTQ1JyxcbiAgdXJsOiAnRS0zNV9BNDUud2F2JyxcbiAgZ2FpbkZhY3RvcjogMSxcbiAgY29lZjogWy4xMjUwLCAwLjIxNjQ5NSwgLTAuMjE2NTMsIDAuMjE2NDk1XSxcbn0sIHtcbiAgbmFtZTogJ0UtMzVfQS00NScsXG4gIHVybDogJ0UtMzVfQS00NS53YXYnLFxuICBnYWluRmFjdG9yOiAxLFxuICBjb2VmOiBbLjEyNTAsIC0wLjIxNjQ5NSwgLTAuMjE2NTMsIDAuMjE2NDk1XSxcbn1dO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRk9BU3BlYWtlckRhdGE7XG5cblxuLyoqKi8gfSksXG4vKiAxNCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5cbi8qKlxuICogQGZpbGUgT21uaXRvbmUgRk9BUmVuZGVyZXIuIFRoaXMgaXMgdXNlci1mYWNpbmcgQVBJIGZvciB0aGUgZmlyc3Qtb3JkZXJcbiAqIGFtYmlzb25pYyBkZWNvZGVyIGFuZCB0aGUgb3B0aW1pemVkIGJpbmF1cmFsIHJlbmRlcmVyLlxuICovXG5cblxuXG5jb25zdCBCdWZmZXJMaXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcbmNvbnN0IEZPQUNvbnZvbHZlciA9IF9fd2VicGFja19yZXF1aXJlX18oNCk7XG5jb25zdCBGT0FIcmlyQmFzZTY0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNSk7XG5jb25zdCBGT0FSb3RhdG9yID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKTtcbmNvbnN0IEZPQVJvdXRlciA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XG5jb25zdCBVdGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqXG4gKiBAdHlwZWRlZiB7c3RyaW5nfSBSZW5kZXJpbmdNb2RlXG4gKi9cblxuLyoqXG4gKiBSZW5kZXJpbmcgbW9kZSBFTlVNLlxuICogQGVudW0ge1JlbmRlcmluZ01vZGV9XG4gKi9cbmNvbnN0IFJlbmRlcmluZ01vZGUgPSB7XG4gIC8qKiBAdHlwZSB7c3RyaW5nfSBVc2UgYW1iaXNvbmljIHJlbmRlcmluZy4gKi9cbiAgQU1CSVNPTklDOiAnYW1iaXNvbmljJyxcbiAgLyoqIEB0eXBlIHtzdHJpbmd9IEJ5cGFzcy4gTm8gYW1iaXNvbmljIHJlbmRlcmluZy4gKi9cbiAgQllQQVNTOiAnYnlwYXNzJyxcbiAgLyoqIEB0eXBlIHtzdHJpbmd9IERpc2FibGUgYXVkaW8gb3V0cHV0LiAqL1xuICBPRkY6ICdvZmYnLFxufTtcblxuXG4vKipcbiAqIE9tbml0b25lIEZPQSByZW5kZXJlciBjbGFzcy4gVXNlcyB0aGUgb3B0aW1pemVkIGNvbnZvbHV0aW9uIHRlY2huaXF1ZS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuY2hhbm5lbE1hcF0gLSBDdXN0b20gY2hhbm5lbCByb3V0aW5nIG1hcC4gVXNlZnVsIGZvclxuICogaGFuZGxpbmcgdGhlIGluY29uc2lzdGVuY3kgaW4gYnJvd3NlcidzIG11bHRpY2hhbm5lbCBhdWRpbyBkZWNvZGluZy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuaHJpclBhdGhMaXN0XSAtIEEgbGlzdCBvZiBwYXRocyB0byBIUklSIGZpbGVzLiBJdFxuICogb3ZlcnJpZGVzIHRoZSBpbnRlcm5hbCBIUklSIGxpc3QgaWYgZ2l2ZW4uXG4gKiBAcGFyYW0ge1JlbmRlcmluZ01vZGV9IFtjb25maWcucmVuZGVyaW5nTW9kZT0nYW1iaXNvbmljJ10gLSBSZW5kZXJpbmcgbW9kZS5cbiAqL1xuZnVuY3Rpb24gRk9BUmVuZGVyZXIoY29udGV4dCwgY29uZmlnKSB7XG4gIHRoaXMuX2NvbnRleHQgPSBVdGlscy5pc0F1ZGlvQ29udGV4dChjb250ZXh0KSA/XG4gICAgICBjb250ZXh0IDpcbiAgICAgIFV0aWxzLnRocm93KCdGT0FSZW5kZXJlcjogSW52YWxpZCBCYXNlQXVkaW9Db250ZXh0LicpO1xuXG4gIHRoaXMuX2NvbmZpZyA9IHtcbiAgICBjaGFubmVsTWFwOiBGT0FSb3V0ZXIuQ2hhbm5lbE1hcC5ERUZBVUxULFxuICAgIHJlbmRlcmluZ01vZGU6IFJlbmRlcmluZ01vZGUuQU1CSVNPTklDLFxuICB9O1xuXG4gIGlmIChjb25maWcpIHtcbiAgICBpZiAoY29uZmlnLmNoYW5uZWxNYXApIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbmZpZy5jaGFubmVsTWFwKSAmJiBjb25maWcuY2hhbm5lbE1hcC5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnLmNoYW5uZWxNYXAgPSBjb25maWcuY2hhbm5lbE1hcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFV0aWxzLnRocm93KFxuICAgICAgICAgICAgJ0ZPQVJlbmRlcmVyOiBJbnZhbGlkIGNoYW5uZWwgbWFwLiAoZ290ICcgKyBjb25maWcuY2hhbm5lbE1hcFxuICAgICAgICAgICAgKyAnKScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb25maWcuaHJpclBhdGhMaXN0KSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjb25maWcuaHJpclBhdGhMaXN0KSAmJlxuICAgICAgICAgIGNvbmZpZy5ocmlyUGF0aExpc3QubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZy5wYXRoTGlzdCA9IGNvbmZpZy5ocmlyUGF0aExpc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBVdGlscy50aHJvdyhcbiAgICAgICAgICAgICdGT0FSZW5kZXJlcjogSW52YWxpZCBIUklSIFVSTHMuIEl0IG11c3QgYmUgYW4gYXJyYXkgd2l0aCAnICtcbiAgICAgICAgICAgICcyIFVSTHMgdG8gSFJJUiBmaWxlcy4gKGdvdCAnICsgY29uZmlnLmhyaXJQYXRoTGlzdCArICcpJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5yZW5kZXJpbmdNb2RlKSB7XG4gICAgICBpZiAoT2JqZWN0LnZhbHVlcyhSZW5kZXJpbmdNb2RlKS5pbmNsdWRlcyhjb25maWcucmVuZGVyaW5nTW9kZSkpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnLnJlbmRlcmluZ01vZGUgPSBjb25maWcucmVuZGVyaW5nTW9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFV0aWxzLmxvZyhcbiAgICAgICAgICAgICdGT0FSZW5kZXJlcjogSW52YWxpZCByZW5kZXJpbmcgbW9kZSBvcmRlci4gKGdvdCcgK1xuICAgICAgICAgICAgY29uZmlnLnJlbmRlcmluZ01vZGUgKyAnKSBGYWxsYmFja3MgdG8gdGhlIG1vZGUgXCJhbWJpc29uaWNcIi4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLl9idWlsZEF1ZGlvR3JhcGgoKTtcblxuICB0aGlzLl90ZW1wTWF0cml4NCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xuICB0aGlzLl9pc1JlbmRlcmVyUmVhZHkgPSBmYWxzZTtcbn1cblxuXG4vKipcbiAqIEJ1aWxkcyB0aGUgaW50ZXJuYWwgYXVkaW8gZ3JhcGguXG4gKiBAcHJpdmF0ZVxuICovXG5GT0FSZW5kZXJlci5wcm90b3R5cGUuX2J1aWxkQXVkaW9HcmFwaCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmlucHV0ID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMub3V0cHV0ID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX2J5cGFzcyA9IHRoaXMuX2NvbnRleHQuY3JlYXRlR2FpbigpO1xuICB0aGlzLl9mb2FSb3V0ZXIgPSBuZXcgRk9BUm91dGVyKHRoaXMuX2NvbnRleHQsIHRoaXMuX2NvbmZpZy5jaGFubmVsTWFwKTtcbiAgdGhpcy5fZm9hUm90YXRvciA9IG5ldyBGT0FSb3RhdG9yKHRoaXMuX2NvbnRleHQpO1xuICB0aGlzLl9mb2FDb252b2x2ZXIgPSBuZXcgRk9BQ29udm9sdmVyKHRoaXMuX2NvbnRleHQpO1xuICB0aGlzLmlucHV0LmNvbm5lY3QodGhpcy5fZm9hUm91dGVyLmlucHV0KTtcbiAgdGhpcy5pbnB1dC5jb25uZWN0KHRoaXMuX2J5cGFzcyk7XG4gIHRoaXMuX2ZvYVJvdXRlci5vdXRwdXQuY29ubmVjdCh0aGlzLl9mb2FSb3RhdG9yLmlucHV0KTtcbiAgdGhpcy5fZm9hUm90YXRvci5vdXRwdXQuY29ubmVjdCh0aGlzLl9mb2FDb252b2x2ZXIuaW5wdXQpO1xuICB0aGlzLl9mb2FDb252b2x2ZXIub3V0cHV0LmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuXG4gIHRoaXMuaW5wdXQuY2hhbm5lbENvdW50ID0gNDtcbiAgdGhpcy5pbnB1dC5jaGFubmVsQ291bnRNb2RlID0gJ2V4cGxpY2l0JztcbiAgdGhpcy5pbnB1dC5jaGFubmVsSW50ZXJwcmV0YXRpb24gPSAnZGlzY3JldGUnO1xufTtcblxuXG4vKipcbiAqIEludGVybmFsIGNhbGxiYWNrIGhhbmRsZXIgZm9yIHxpbml0aWFsaXplfCBtZXRob2QuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZSAtIFJlc29sdXRpb24gaGFuZGxlci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHJlamVjdCAtIFJlamVjdGlvbiBoYW5kbGVyLlxuICovXG5GT0FSZW5kZXJlci5wcm90b3R5cGUuX2luaXRpYWxpemVDYWxsYmFjayA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICBjb25zdCBidWZmZXJMaXN0ID0gdGhpcy5fY29uZmlnLnBhdGhMaXN0XG4gICAgICA/IG5ldyBCdWZmZXJMaXN0KHRoaXMuX2NvbnRleHQsIHRoaXMuX2NvbmZpZy5wYXRoTGlzdCwge2RhdGFUeXBlOiAndXJsJ30pXG4gICAgICA6IG5ldyBCdWZmZXJMaXN0KHRoaXMuX2NvbnRleHQsIEZPQUhyaXJCYXNlNjQpO1xuICBidWZmZXJMaXN0LmxvYWQoKS50aGVuKFxuICAgICAgZnVuY3Rpb24oaHJpckJ1ZmZlckxpc3QpIHtcbiAgICAgICAgdGhpcy5fZm9hQ29udm9sdmVyLnNldEhSSVJCdWZmZXJMaXN0KGhyaXJCdWZmZXJMaXN0KTtcbiAgICAgICAgdGhpcy5zZXRSZW5kZXJpbmdNb2RlKHRoaXMuX2NvbmZpZy5yZW5kZXJpbmdNb2RlKTtcbiAgICAgICAgdGhpcy5faXNSZW5kZXJlclJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgVXRpbHMubG9nKCdGT0FSZW5kZXJlcjogSFJJUnMgbG9hZGVkIHN1Y2Nlc3NmdWxseS4gUmVhZHkuJyk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSAnRk9BUmVuZGVyZXI6IEhSSVIgbG9hZGluZy9kZWNvZGluZyBmYWlsZWQuJztcbiAgICAgICAgVXRpbHMudGhyb3coZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgcmVqZWN0KGVycm9yTWVzc2FnZSk7XG4gICAgICB9KTtcbn07XG5cblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbmQgbG9hZHMgdGhlIHJlc291cmNlIGZvciB0aGUgcmVuZGVyZXIuXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5GT0FSZW5kZXJlci5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICBVdGlscy5sb2coXG4gICAgICAnRk9BUmVuZGVyZXI6IEluaXRpYWxpemluZy4uLiAobW9kZTogJyArIHRoaXMuX2NvbmZpZy5yZW5kZXJpbmdNb2RlICtcbiAgICAgICcpJyk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKHRoaXMuX2luaXRpYWxpemVDYWxsYmFjay5iaW5kKHRoaXMpLCBmdW5jdGlvbihlcnJvcikge1xuICAgIFV0aWxzLnRocm93KCdGT0FSZW5kZXJlcjogSW5pdGlhbGl6YXRpb24gZmFpbGVkLiAoJyArIGVycm9yICsgJyknKTtcbiAgfSk7XG59O1xuXG5cbi8qKlxuICogU2V0IHRoZSBjaGFubmVsIG1hcC5cbiAqIEBwYXJhbSB7TnVtYmVyW119IGNoYW5uZWxNYXAgLSBDdXN0b20gY2hhbm5lbCByb3V0aW5nIGZvciBGT0Egc3RyZWFtLlxuICovXG5GT0FSZW5kZXJlci5wcm90b3R5cGUuc2V0Q2hhbm5lbE1hcCA9IGZ1bmN0aW9uKGNoYW5uZWxNYXApIHtcbiAgaWYgKCF0aGlzLl9pc1JlbmRlcmVyUmVhZHkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2hhbm5lbE1hcC50b1N0cmluZygpICE9PSB0aGlzLl9jb25maWcuY2hhbm5lbE1hcC50b1N0cmluZygpKSB7XG4gICAgVXRpbHMubG9nKFxuICAgICAgICAnUmVtYXBwaW5nIGNoYW5uZWxzIChbJyArIHRoaXMuX2NvbmZpZy5jaGFubmVsTWFwLnRvU3RyaW5nKCkgK1xuICAgICAgICAnXSAtPiBbJyArIGNoYW5uZWxNYXAudG9TdHJpbmcoKSArICddKS4nKTtcbiAgICB0aGlzLl9jb25maWcuY2hhbm5lbE1hcCA9IGNoYW5uZWxNYXAuc2xpY2UoKTtcbiAgICB0aGlzLl9mb2FSb3V0ZXIuc2V0Q2hhbm5lbE1hcCh0aGlzLl9jb25maWcuY2hhbm5lbE1hcCk7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSByb3RhdGlvbiBtYXRyaXggd2l0aCAzeDMgbWF0cml4LlxuICogQHBhcmFtIHtOdW1iZXJbXX0gcm90YXRpb25NYXRyaXgzIC0gQSAzeDMgcm90YXRpb24gbWF0cml4LiAoY29sdW1uLW1ham9yKVxuICovXG5GT0FSZW5kZXJlci5wcm90b3R5cGUuc2V0Um90YXRpb25NYXRyaXgzID0gZnVuY3Rpb24ocm90YXRpb25NYXRyaXgzKSB7XG4gIGlmICghdGhpcy5faXNSZW5kZXJlclJlYWR5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fZm9hUm90YXRvci5zZXRSb3RhdGlvbk1hdHJpeDMocm90YXRpb25NYXRyaXgzKTtcbn07XG5cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSByb3RhdGlvbiBtYXRyaXggd2l0aCA0eDQgbWF0cml4LlxuICogQHBhcmFtIHtOdW1iZXJbXX0gcm90YXRpb25NYXRyaXg0IC0gQSA0eDQgcm90YXRpb24gbWF0cml4LiAoY29sdW1uLW1ham9yKVxuICovXG5GT0FSZW5kZXJlci5wcm90b3R5cGUuc2V0Um90YXRpb25NYXRyaXg0ID0gZnVuY3Rpb24ocm90YXRpb25NYXRyaXg0KSB7XG4gIGlmICghdGhpcy5faXNSZW5kZXJlclJlYWR5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fZm9hUm90YXRvci5zZXRSb3RhdGlvbk1hdHJpeDQocm90YXRpb25NYXRyaXg0KTtcbn07XG5cblxuLyoqXG4gKiBTZXQgdGhlIHJvdGF0aW9uIG1hdHJpeCBmcm9tIGEgVGhyZWUuanMgY2FtZXJhIG9iamVjdC4gRGVwcmVhdGVkIGluIFYxLCBhbmRcbiAqIHRoaXMgZXhpc3RzIG9ubHkgZm9yIHRoZSBiYWNrd2FyZCBjb21wYXRpYmxpdHkuIEluc3RlYWQsIHVzZVxuICogfHNldFJvdGF0YXRpb25NYXRyaXg0KCl8IHdpdGggVGhyZWUuanMgfGNhbWVyYS53b3JsZE1hdHJpeC5lbGVtZW50c3wuXG4gKiBAZGVwcmVjYXRlZFxuICogQHBhcmFtIHtPYmplY3R9IGNhbWVyYU1hdHJpeCAtIE1hdHJpeDQgZnJvbSBUaHJlZS5qcyB8Y2FtZXJhLm1hdHJpeHwuXG4gKi9cbkZPQVJlbmRlcmVyLnByb3RvdHlwZS5zZXRSb3RhdGlvbk1hdHJpeEZyb21DYW1lcmEgPSBmdW5jdGlvbihjYW1lcmFNYXRyaXgpIHtcbiAgaWYgKCF0aGlzLl9pc1JlbmRlcmVyUmVhZHkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBFeHRyYWN0IHRoZSBpbm5lciBhcnJheSBlbGVtZW50cyBhbmQgaW52ZXJzZS4gKFRoZSBhY3R1YWwgdmlldyByb3RhdGlvbiBpc1xuICAvLyB0aGUgb3Bwb3NpdGUgb2YgdGhlIGNhbWVyYSBtb3ZlbWVudC4pXG4gIFV0aWxzLmludmVydE1hdHJpeDQodGhpcy5fdGVtcE1hdHJpeDQsIGNhbWVyYU1hdHJpeC5lbGVtZW50cyk7XG4gIHRoaXMuX2ZvYVJvdGF0b3Iuc2V0Um90YXRpb25NYXRyaXg0KHRoaXMuX3RlbXBNYXRyaXg0KTtcbn07XG5cblxuLyoqXG4gKiBTZXQgdGhlIHJlbmRlcmluZyBtb2RlLlxuICogQHBhcmFtIHtSZW5kZXJpbmdNb2RlfSBtb2RlIC0gUmVuZGVyaW5nIG1vZGUuXG4gKiAgLSAnYW1iaXNvbmljJzogYWN0aXZhdGVzIHRoZSBhbWJpc29uaWMgZGVjb2RpbmcvYmluYXVybCByZW5kZXJpbmcuXG4gKiAgLSAnYnlwYXNzJzogYnlwYXNzZXMgdGhlIGlucHV0IHN0cmVhbSBkaXJlY3RseSB0byB0aGUgb3V0cHV0LiBObyBhbWJpc29uaWNcbiAqICAgIGRlY29kaW5nIG9yIGVuY29kaW5nLlxuICogIC0gJ29mZic6IGFsbCB0aGUgcHJvY2Vzc2luZyBvZmYgc2F2aW5nIHRoZSBDUFUgcG93ZXIuXG4gKi9cbkZPQVJlbmRlcmVyLnByb3RvdHlwZS5zZXRSZW5kZXJpbmdNb2RlID0gZnVuY3Rpb24obW9kZSkge1xuICBpZiAobW9kZSA9PT0gdGhpcy5fY29uZmlnLnJlbmRlcmluZ01vZGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzd2l0Y2ggKG1vZGUpIHtcbiAgICBjYXNlIFJlbmRlcmluZ01vZGUuQU1CSVNPTklDOlxuICAgICAgdGhpcy5fZm9hQ29udm9sdmVyLmVuYWJsZSgpO1xuICAgICAgdGhpcy5fYnlwYXNzLmRpc2Nvbm5lY3QoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUmVuZGVyaW5nTW9kZS5CWVBBU1M6XG4gICAgICB0aGlzLl9mb2FDb252b2x2ZXIuZGlzYWJsZSgpO1xuICAgICAgdGhpcy5fYnlwYXNzLmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBSZW5kZXJpbmdNb2RlLk9GRjpcbiAgICAgIHRoaXMuX2ZvYUNvbnZvbHZlci5kaXNhYmxlKCk7XG4gICAgICB0aGlzLl9ieXBhc3MuZGlzY29ubmVjdCgpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIFV0aWxzLmxvZyhcbiAgICAgICAgICAnRk9BUmVuZGVyZXI6IFJlbmRlcmluZyBtb2RlIFwiJyArIG1vZGUgKyAnXCIgaXMgbm90ICcgK1xuICAgICAgICAgICdzdXBwb3J0ZWQuJyk7XG4gICAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9jb25maWcucmVuZGVyaW5nTW9kZSA9IG1vZGU7XG4gIFV0aWxzLmxvZygnRk9BUmVuZGVyZXI6IFJlbmRlcmluZyBtb2RlIGNoYW5nZWQuICgnICsgbW9kZSArICcpJyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRk9BUmVuZGVyZXI7XG5cblxuLyoqKi8gfSksXG4vKiAxNSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5jb25zdCBPbW5pdG9uZUZPQUhyaXJCYXNlNjQgPSBbXG5cIlVrbEdSaVFFQUFCWFFWWkZabTEwSUJBQUFBQUJBQUlBZ0xzQUFBRHVBZ0FFQUJBQVpHRjBZUUFFQUFEKy93SUE5djhRQVB2L0N3RCsvd2NBL3Y4TUFQLy9BUUQ3L3dFQUNBQUVBUGovK3Y4WUFCQUE3di9uLy92LzlQL00vOEQvL2YzNC9SMzhFdnp4QWZFQnRBMmxEVGNCSlFGSjlUNzFGUDBEL2NEMXRmVm8vV3Y5dVBUTzlQUG1PdWZjL1UvK2FnTDNBaXNjL1J4dUdLRVpCdjNqL2lZTXpRMmdBenNFUVFVQUJpUUZyQVN6QTVjQjJRbXlDeTBBdGdSNEFlWUd0ZmdBQTJqNU9RSFArc2NBclBzTUJKZ0VnZ0lFQnR6NitRVnEvcGovYVBnOEJQUDNnUUVpK2pFQW9mMGZBMXY5Ky83Uys4SUJqdndkL3hENElBREwvUGY5enZzKy9sMyt3Z0I3LytMKzdmekZBREg5a2Y2QStuMytEUDYrL1RQOXhQNjgvcG4rdy8yNi9pMzlZZ0EwL3U3OTBQdDkva0QrN3Yxcy9XYis4ZjRDLzFQK3BmL3gvY1QrNi8zcC9YejlmZjVGLzBmOUcvNHIvNnYvNFA1TC9zTCtmZjdjL3BqK092N1gvVVQrOVA1Ry9veis2djZBLzJEKzkvNlAvOHIvYlA3bS9paitDLy9lL3RqL0dmNGUvOXYrRndEUC9sei9zUDdGLzJIK3J2L0cvczcvSGY3eS80UCtOQUQ5L2swQUsvNncvelAvaEFDaC9zWC9nZjQ0QU9QK2RnQ20vaVVBay81cUFPRCtQd0MrL2pFQVdQNENBQXIvYlFCdy92di96ZjVpQUNEL09nQ1MvdUQvQ3Y5b0FBYi9DZ0RLL2t3QS8vNXRBQ0gvVGdDZy9oNEFIUDlhQUJQL0pBRFAvaEVBWXY5Z0FBai8zZjhtL3lzQVl2OGdBQ1gvOC84ay95c0FYdjhiQUJILy92OGoveWdBYS84cUFBRC85ZjlnLzFZQVdmOEpBQ0gvQWdCMi96NEFYUC93L3ozL0ZnQjIveWtBWC8vOS96Ly9Fd0NWL3pVQVMvL24vMVQvR0FDSy94NEFUdi8wLzRQL1FRQjQvL3YvV1AvMi8zWC9IQUI4Ly9QL1YvLzMvMmYvQVFCaC85di9UZi94LzVQL0l3Q0kvd01BZi84aEFLUC9KQUNaL3hVQWl2OG5BSy8vSGdDci95TUFtLzh1QU16L09BQ2kveVFBcWY4N0FNVC9Nd0NZL3lVQXRQOUZBTUgvS2dDdS95Y0F5UDg1QU12L0l3Q3oveG9BMWY4cUFNbi9GZ0M4L3hRQTQvOG5BTVgvQ3dESi94UUE0ZjhaQU1IL0JnRE8veFFBNGY4V0FNUC9Cd0RVL3hRQTRQOFFBTUgvQVFEYi94UUEzUDhKQU1QL0FnRGgveElBMnY4RUFNai9BZ0RrL3cwQTFmLysvOHYvQXdEbS93d0Ewdi8rLzlIL0JnRGwvd2tBenYvOC85VC9Cd0RrL3djQXp2LzgvOXIvQ1FEaS93UUF6Zi84LzkvL0NBRGYvLy8vMFAvOS8rTC9Cd0RkLy83LzAvLy8vK1QvQmdEYi8vei8xZjhBQU9mL0JRRFovL3YvMnY4Q0FPYi9Bd0RZLy92LzN2OEVBT2IvQWdEWS8vMy80ZjhGQU9YL0FRRFovLzcvNVA4R0FPUC9BQURiL3dBQTUvOEdBT0gvLy8vZC93SUE1LzhGQU9ELy8vL2Yvd01BNlA4RkFPRC8vLy9oL3dRQTZQOEVBTjcvLy8vaC93VUE0djhEQU52L0FRRGQvd1FBM1A4Q0FObi9BZ0RiL3dNQTIvOENBTnYvQWdEZC93SUEzdjhDQU9IL0FRRGovd0VBXCIsXG5cIlVrbEdSaVFFQUFCWFFWWkZabTEwSUJBQUFBQUJBQUlBZ0xzQUFBRHVBZ0FFQUJBQVpHRjBZUUFFQUFBQUFBQUEvZjhDQVAvL0FRRC8vd0VBLy84QkFQMy9BQUFDQVA3LytmOEFBQUlBL1A4RkFBUUE4LzhBQUJvQStmL1Yvd1FBSFFETy94b0FRUUJPL29jQTBQeDEvdWNIVy80VUNtOEhMTzZrQWp2OC9mQ1JEZEFBWWZQaUJJZ0ZYdmVVQ00wR0J2aDYvbno3cmYwSi9RY1FTUlZkQmdvQlNnRlI2MnI5TlA4bStMb0VBdnJpQlZBQWlBUG1BQkVHTWYybCtTd0JqdmE2L0c0QS8vOFAvQ1lETWdYbS9SMENLQUU2L2ZjQkJ3QXRBTkQra1FBMEE1VURod0ZzLzhJQjhmeWRBRVAvQS84di9lNy9tUDhqLzJZQkl3RTNBdjBBWXYrdUFPRDhsZ0FnL3d3QUlmL0wvbjBBZS8vT0FKTUIzUC9YQUYvL1h3Q00vMDhBQi84TkFFZi9yZjRqQVQzL2xnQUpBUDRBSGdEcEFPOEFVZjlMLzA3L1FmOEtBT0QveC8rRC8zc0FUUUNEQU1vQTBmNzkvK0wvRVFEdC83RUFxditTLzdJQXV2L28vd2dBYy8vWC8vSC9Td0NtLyszL1lmL0IveW9BQUFESS83WC9Bd0JnLzVFQVRnQ1gveFlBL1ArcS8wMEFWQUNZLzZ2L0JBREQvendBTFFDTi84ei9LUUR1L3lnQUVnQ1ovNmYvVlFEQy8vVC9LUUNzLzdQL1VnQWZBTzcvTmdDOC81Ny9hd0FaQVBQLytQL1YvOHovYlFCQkFMLy9EZ0QwLytUL1RBQkJBTXovQ3dBeEFQei9TUUJxQUxuL0JnQUxBUHovRUFBN0FJei8zLzhpQUFVQS8vOGtBTGYveS85VkFCUUErdjgxQU9qLzBQOWNBQjRBK2Y4V0FPci92djgzQUJnQXcvOEpBT2ovNGY4bkFDSUFzZi95L3c0QTN2OGdBQ1FBeFAvbi95Y0E3UDhXQUMwQXlmL1UveWNBOXYvNy95VUEwUC9QL3pVQUJBRGMveFVBNVAvSi96Y0FDd0RTL3hVQTlQL20vekFBQ1FEWC8rMy85di8yL3lRQUNnRFovK1AvQXdBS0FCWUEvLy9iLzlqL0VRQUxBQmtBRGdENi8rNy9Hd0Q0L3c0QThQL3cvL2ovRWdBRUFBVUE5Zi8xL3dRQUdnRDQvd0FBNS8vLy93QUFHUUQxLy8vLzdmOEZBQVVBRlFEdi93QUE2djhMQUFjQUZRRHMvd0VBOVA4U0FBWUFDd0RyLy83L0FRQVNBQVlBQlFEdi93SUFBd0FXQUFJQUFnRHYvd0FBQmdBVEFBRUEvZi91L3dRQUJnQVFBUHIvK1Avei93VUFDUUFMQVBqLzkvLzQvd2dBQndBS0FQVC8rZi81L3c0QUJ3QUlBUFQvKy8vOS93NEFBd0FEQVBILy9mLy8vdzhBLy84QkFQUC8vLzhCQUEwQS9mLysvL1gvQWdBQ0FBMEErLy84Ly9iL0JBQURBQW9BK2YvNy8vbi9CZ0FEQUFjQStQLzcvL3YvQndBQkFBUUErUC84Ly8zL0NRQUJBQUlBOS8vOS8vLy9DUUQvLy8vLytQLy8vd0FBQ0FEOS8vNy8rZjhBQUFBQUJ3RDgvLzMvK3Y4Q0FBQUFCZ0Q3Ly96Ly9QOEVBQUFBQkFENi8vMy8vUDhGQVAvL0FnRDYvLzcvL3Y4RkFQNy9BUUQ3Ly8vLy8vOEdBUDcvQUFENy93RUEvLzhFQVAzL0FBRDkvd0VBL3Y4REFQMy9BQUQ5L3dJQS92OENBUDMvQVFEOS93SUEvdjhDQVA3L0FRRCsvd0VBXCIsXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9tbml0b25lRk9BSHJpckJhc2U2NDtcblxuXG4vKioqLyB9KSxcbi8qIDE2ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cblxuLyoqXG4gKiBAZmlsZSBPbW5pdG9uZSBIT0FSZW5kZXJlci4gVGhpcyBpcyB1c2VyLWZhY2luZyBBUEkgZm9yIHRoZSBoaWdoZXItb3JkZXJcbiAqIGFtYmlzb25pYyBkZWNvZGVyIGFuZCB0aGUgb3B0aW1pemVkIGJpbmF1cmFsIHJlbmRlcmVyLlxuICovXG5cblxuXG5jb25zdCBCdWZmZXJMaXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcbmNvbnN0IEhPQUNvbnZvbHZlciA9IF9fd2VicGFja19yZXF1aXJlX18oOCk7XG5jb25zdCBIT0FSb3RhdG9yID0gX193ZWJwYWNrX3JlcXVpcmVfXyg5KTtcbmNvbnN0IFRPQUhyaXJCYXNlNjQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE3KTtcbmNvbnN0IFNPQUhyaXJCYXNlNjQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4KTtcbmNvbnN0IFV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKipcbiAqIEB0eXBlZGVmIHtzdHJpbmd9IFJlbmRlcmluZ01vZGVcbiAqL1xuXG4vKipcbiAqIFJlbmRlcmluZyBtb2RlIEVOVU0uXG4gKiBAZW51bSB7UmVuZGVyaW5nTW9kZX1cbiAqL1xuY29uc3QgUmVuZGVyaW5nTW9kZSA9IHtcbiAgLyoqIEB0eXBlIHtzdHJpbmd9IFVzZSBhbWJpc29uaWMgcmVuZGVyaW5nLiAqL1xuICBBTUJJU09OSUM6ICdhbWJpc29uaWMnLFxuICAvKiogQHR5cGUge3N0cmluZ30gQnlwYXNzLiBObyBhbWJpc29uaWMgcmVuZGVyaW5nLiAqL1xuICBCWVBBU1M6ICdieXBhc3MnLFxuICAvKiogQHR5cGUge3N0cmluZ30gRGlzYWJsZSBhdWRpbyBvdXRwdXQuICovXG4gIE9GRjogJ29mZicsXG59O1xuXG5cbi8vIEN1cnJlbnRseSBTT0EgYW5kIFRPQSBhcmUgb25seSBzdXBwb3J0ZWQuXG5jb25zdCBTdXBwb3J0ZWRBbWJpc29uaWNPcmRlciA9IFsyLCAzXTtcblxuXG4vKipcbiAqIE9tbml0b25lIEhPQSByZW5kZXJlciBjbGFzcy4gVXNlcyB0aGUgb3B0aW1pemVkIGNvbnZvbHV0aW9uIHRlY2huaXF1ZS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGNvbnRleHQgLSBBc3NvY2lhdGVkIEF1ZGlvQ29udGV4dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEBwYXJhbSB7TnVtYmVyfSBbY29uZmlnLmFtYmlzb25pY09yZGVyPTNdIC0gQW1iaXNvbmljIG9yZGVyLlxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5ocmlyUGF0aExpc3RdIC0gQSBsaXN0IG9mIHBhdGhzIHRvIEhSSVIgZmlsZXMuIEl0XG4gKiBvdmVycmlkZXMgdGhlIGludGVybmFsIEhSSVIgbGlzdCBpZiBnaXZlbi5cbiAqIEBwYXJhbSB7UmVuZGVyaW5nTW9kZX0gW2NvbmZpZy5yZW5kZXJpbmdNb2RlPSdhbWJpc29uaWMnXSAtIFJlbmRlcmluZyBtb2RlLlxuICovXG5mdW5jdGlvbiBIT0FSZW5kZXJlcihjb250ZXh0LCBjb25maWcpIHtcbiAgdGhpcy5fY29udGV4dCA9IFV0aWxzLmlzQXVkaW9Db250ZXh0KGNvbnRleHQpID9cbiAgICAgIGNvbnRleHQgOlxuICAgICAgVXRpbHMudGhyb3coJ0hPQVJlbmRlcmVyOiBJbnZhbGlkIEJhc2VBdWRpb0NvbnRleHQuJyk7XG5cbiAgdGhpcy5fY29uZmlnID0ge1xuICAgIGFtYmlzb25pY09yZGVyOiAzLFxuICAgIHJlbmRlcmluZ01vZGU6IFJlbmRlcmluZ01vZGUuQU1CSVNPTklDLFxuICB9O1xuXG4gIGlmIChjb25maWcgJiYgY29uZmlnLmFtYmlzb25pY09yZGVyKSB7XG4gICAgaWYgKFN1cHBvcnRlZEFtYmlzb25pY09yZGVyLmluY2x1ZGVzKGNvbmZpZy5hbWJpc29uaWNPcmRlcikpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hbWJpc29uaWNPcmRlciA9IGNvbmZpZy5hbWJpc29uaWNPcmRlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgVXRpbHMubG9nKFxuICAgICAgICAgICdIT0FSZW5kZXJlcjogSW52YWxpZCBhbWJpc29uaWMgb3JkZXIuIChnb3QgJyArXG4gICAgICAgICAgY29uZmlnLmFtYmlzb25pY09yZGVyICsgJykgRmFsbGJhY2tzIHRvIDNyZC1vcmRlciBhbWJpc29uaWMuJyk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fY29uZmlnLm51bWJlck9mQ2hhbm5lbHMgPVxuICAgICAgKHRoaXMuX2NvbmZpZy5hbWJpc29uaWNPcmRlciArIDEpICogKHRoaXMuX2NvbmZpZy5hbWJpc29uaWNPcmRlciArIDEpO1xuICB0aGlzLl9jb25maWcubnVtYmVyT2ZTdGVyZW9DaGFubmVscyA9XG4gICAgICBNYXRoLmNlaWwodGhpcy5fY29uZmlnLm51bWJlck9mQ2hhbm5lbHMgLyAyKTtcblxuICBpZiAoY29uZmlnICYmIGNvbmZpZy5ocmlyUGF0aExpc3QpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb25maWcuaHJpclBhdGhMaXN0KSAmJlxuICAgICAgICBjb25maWcuaHJpclBhdGhMaXN0Lmxlbmd0aCA9PT0gdGhpcy5fY29uZmlnLm51bWJlck9mU3RlcmVvQ2hhbm5lbHMpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5wYXRoTGlzdCA9IGNvbmZpZy5ocmlyUGF0aExpc3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIFV0aWxzLnRocm93KFxuICAgICAgICAgICdIT0FSZW5kZXJlcjogSW52YWxpZCBIUklSIFVSTHMuIEl0IG11c3QgYmUgYW4gYXJyYXkgd2l0aCAnICtcbiAgICAgICAgICB0aGlzLl9jb25maWcubnVtYmVyT2ZTdGVyZW9DaGFubmVscyArICcgVVJMcyB0byBIUklSIGZpbGVzLicgK1xuICAgICAgICAgICcgKGdvdCAnICsgY29uZmlnLmhyaXJQYXRoTGlzdCArICcpJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbmZpZyAmJiBjb25maWcucmVuZGVyaW5nTW9kZSkge1xuICAgIGlmIChPYmplY3QudmFsdWVzKFJlbmRlcmluZ01vZGUpLmluY2x1ZGVzKGNvbmZpZy5yZW5kZXJpbmdNb2RlKSkge1xuICAgICAgdGhpcy5fY29uZmlnLnJlbmRlcmluZ01vZGUgPSBjb25maWcucmVuZGVyaW5nTW9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgVXRpbHMubG9nKFxuICAgICAgICAgICdIT0FSZW5kZXJlcjogSW52YWxpZCByZW5kZXJpbmcgbW9kZS4gKGdvdCAnICtcbiAgICAgICAgICBjb25maWcucmVuZGVyaW5nTW9kZSArICcpIEZhbGxiYWNrcyB0byBcImFtYmlzb25pY1wiLicpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuX2J1aWxkQXVkaW9HcmFwaCgpO1xuXG4gIHRoaXMuX2lzUmVuZGVyZXJSZWFkeSA9IGZhbHNlO1xufVxuXG5cbi8qKlxuICogQnVpbGRzIHRoZSBpbnRlcm5hbCBhdWRpbyBncmFwaC5cbiAqIEBwcml2YXRlXG4gKi9cbkhPQVJlbmRlcmVyLnByb3RvdHlwZS5fYnVpbGRBdWRpb0dyYXBoID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuaW5wdXQgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5vdXRwdXQgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fYnlwYXNzID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX2hvYVJvdGF0b3IgPSBuZXcgSE9BUm90YXRvcih0aGlzLl9jb250ZXh0LCB0aGlzLl9jb25maWcuYW1iaXNvbmljT3JkZXIpO1xuICB0aGlzLl9ob2FDb252b2x2ZXIgPVxuICAgICAgbmV3IEhPQUNvbnZvbHZlcih0aGlzLl9jb250ZXh0LCB0aGlzLl9jb25maWcuYW1iaXNvbmljT3JkZXIpO1xuICB0aGlzLmlucHV0LmNvbm5lY3QodGhpcy5faG9hUm90YXRvci5pbnB1dCk7XG4gIHRoaXMuaW5wdXQuY29ubmVjdCh0aGlzLl9ieXBhc3MpO1xuICB0aGlzLl9ob2FSb3RhdG9yLm91dHB1dC5jb25uZWN0KHRoaXMuX2hvYUNvbnZvbHZlci5pbnB1dCk7XG4gIHRoaXMuX2hvYUNvbnZvbHZlci5vdXRwdXQuY29ubmVjdCh0aGlzLm91dHB1dCk7XG5cbiAgdGhpcy5pbnB1dC5jaGFubmVsQ291bnQgPSB0aGlzLl9jb25maWcubnVtYmVyT2ZDaGFubmVscztcbiAgdGhpcy5pbnB1dC5jaGFubmVsQ291bnRNb2RlID0gJ2V4cGxpY2l0JztcbiAgdGhpcy5pbnB1dC5jaGFubmVsSW50ZXJwcmV0YXRpb24gPSAnZGlzY3JldGUnO1xufTtcblxuXG4vKipcbiAqIEludGVybmFsIGNhbGxiYWNrIGhhbmRsZXIgZm9yIHxpbml0aWFsaXplfCBtZXRob2QuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZSAtIFJlc29sdXRpb24gaGFuZGxlci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHJlamVjdCAtIFJlamVjdGlvbiBoYW5kbGVyLlxuICovXG5IT0FSZW5kZXJlci5wcm90b3R5cGUuX2luaXRpYWxpemVDYWxsYmFjayA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICBsZXQgYnVmZmVyTGlzdDtcbiAgaWYgKHRoaXMuX2NvbmZpZy5wYXRoTGlzdCkge1xuICAgIGJ1ZmZlckxpc3QgPVxuICAgICAgICBuZXcgQnVmZmVyTGlzdCh0aGlzLl9jb250ZXh0LCB0aGlzLl9jb25maWcucGF0aExpc3QsIHtkYXRhVHlwZTogJ3VybCd9KTtcbiAgfSBlbHNlIHtcbiAgICBidWZmZXJMaXN0ID0gdGhpcy5fY29uZmlnLmFtYmlzb25pY09yZGVyID09PSAyXG4gICAgICAgID8gbmV3IEJ1ZmZlckxpc3QodGhpcy5fY29udGV4dCwgU09BSHJpckJhc2U2NClcbiAgICAgICAgOiBuZXcgQnVmZmVyTGlzdCh0aGlzLl9jb250ZXh0LCBUT0FIcmlyQmFzZTY0KTtcbiAgfVxuXG4gIGJ1ZmZlckxpc3QubG9hZCgpLnRoZW4oXG4gICAgICBmdW5jdGlvbihocmlyQnVmZmVyTGlzdCkge1xuICAgICAgICB0aGlzLl9ob2FDb252b2x2ZXIuc2V0SFJJUkJ1ZmZlckxpc3QoaHJpckJ1ZmZlckxpc3QpO1xuICAgICAgICB0aGlzLnNldFJlbmRlcmluZ01vZGUodGhpcy5fY29uZmlnLnJlbmRlcmluZ01vZGUpO1xuICAgICAgICB0aGlzLl9pc1JlbmRlcmVyUmVhZHkgPSB0cnVlO1xuICAgICAgICBVdGlscy5sb2coJ0hPQVJlbmRlcmVyOiBIUklScyBsb2FkZWQgc3VjY2Vzc2Z1bGx5LiBSZWFkeS4nKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdIT0FSZW5kZXJlcjogSFJJUiBsb2FkaW5nL2RlY29kaW5nIGZhaWxlZC4nO1xuICAgICAgICBVdGlscy50aHJvdyhlcnJvck1lc3NhZ2UpO1xuICAgICAgICByZWplY3QoZXJyb3JNZXNzYWdlKTtcbiAgICAgIH0pO1xufTtcblxuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuZCBsb2FkcyB0aGUgcmVzb3VyY2UgZm9yIHRoZSByZW5kZXJlci5cbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cbkhPQVJlbmRlcmVyLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gIFV0aWxzLmxvZyhcbiAgICAgICdIT0FSZW5kZXJlcjogSW5pdGlhbGl6aW5nLi4uIChtb2RlOiAnICsgdGhpcy5fY29uZmlnLnJlbmRlcmluZ01vZGUgK1xuICAgICAgJywgYW1iaXNvbmljIG9yZGVyOiAnICsgdGhpcy5fY29uZmlnLmFtYmlzb25pY09yZGVyICsgJyknKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UodGhpcy5faW5pdGlhbGl6ZUNhbGxiYWNrLmJpbmQodGhpcyksIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgVXRpbHMudGhyb3coJ0hPQVJlbmRlcmVyOiBJbml0aWFsaXphdGlvbiBmYWlsZWQuICgnICsgZXJyb3IgKyAnKScpO1xuICB9KTtcbn07XG5cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSByb3RhdGlvbiBtYXRyaXggd2l0aCAzeDMgbWF0cml4LlxuICogQHBhcmFtIHtOdW1iZXJbXX0gcm90YXRpb25NYXRyaXgzIC0gQSAzeDMgcm90YXRpb24gbWF0cml4LiAoY29sdW1uLW1ham9yKVxuICovXG5IT0FSZW5kZXJlci5wcm90b3R5cGUuc2V0Um90YXRpb25NYXRyaXgzID0gZnVuY3Rpb24ocm90YXRpb25NYXRyaXgzKSB7XG4gIGlmICghdGhpcy5faXNSZW5kZXJlclJlYWR5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5faG9hUm90YXRvci5zZXRSb3RhdGlvbk1hdHJpeDMocm90YXRpb25NYXRyaXgzKTtcbn07XG5cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSByb3RhdGlvbiBtYXRyaXggd2l0aCA0eDQgbWF0cml4LlxuICogQHBhcmFtIHtOdW1iZXJbXX0gcm90YXRpb25NYXRyaXg0IC0gQSA0eDQgcm90YXRpb24gbWF0cml4LiAoY29sdW1uLW1ham9yKVxuICovXG5IT0FSZW5kZXJlci5wcm90b3R5cGUuc2V0Um90YXRpb25NYXRyaXg0ID0gZnVuY3Rpb24ocm90YXRpb25NYXRyaXg0KSB7XG4gIGlmICghdGhpcy5faXNSZW5kZXJlclJlYWR5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5faG9hUm90YXRvci5zZXRSb3RhdGlvbk1hdHJpeDQocm90YXRpb25NYXRyaXg0KTtcbn07XG5cblxuLyoqXG4gKiBTZXQgdGhlIGRlY29kaW5nIG1vZGUuXG4gKiBAcGFyYW0ge1JlbmRlcmluZ01vZGV9IG1vZGUgLSBEZWNvZGluZyBtb2RlLlxuICogIC0gJ2FtYmlzb25pYyc6IGFjdGl2YXRlcyB0aGUgYW1iaXNvbmljIGRlY29kaW5nL2JpbmF1cmwgcmVuZGVyaW5nLlxuICogIC0gJ2J5cGFzcyc6IGJ5cGFzc2VzIHRoZSBpbnB1dCBzdHJlYW0gZGlyZWN0bHkgdG8gdGhlIG91dHB1dC4gTm8gYW1iaXNvbmljXG4gKiAgICBkZWNvZGluZyBvciBlbmNvZGluZy5cbiAqICAtICdvZmYnOiBhbGwgdGhlIHByb2Nlc3Npbmcgb2ZmIHNhdmluZyB0aGUgQ1BVIHBvd2VyLlxuICovXG5IT0FSZW5kZXJlci5wcm90b3R5cGUuc2V0UmVuZGVyaW5nTW9kZSA9IGZ1bmN0aW9uKG1vZGUpIHtcbiAgaWYgKG1vZGUgPT09IHRoaXMuX2NvbmZpZy5yZW5kZXJpbmdNb2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3dpdGNoIChtb2RlKSB7XG4gICAgY2FzZSBSZW5kZXJpbmdNb2RlLkFNQklTT05JQzpcbiAgICAgIHRoaXMuX2hvYUNvbnZvbHZlci5lbmFibGUoKTtcbiAgICAgIHRoaXMuX2J5cGFzcy5kaXNjb25uZWN0KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFJlbmRlcmluZ01vZGUuQllQQVNTOlxuICAgICAgdGhpcy5faG9hQ29udm9sdmVyLmRpc2FibGUoKTtcbiAgICAgIHRoaXMuX2J5cGFzcy5jb25uZWN0KHRoaXMub3V0cHV0KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUmVuZGVyaW5nTW9kZS5PRkY6XG4gICAgICB0aGlzLl9ob2FDb252b2x2ZXIuZGlzYWJsZSgpO1xuICAgICAgdGhpcy5fYnlwYXNzLmRpc2Nvbm5lY3QoKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBVdGlscy5sb2coXG4gICAgICAgICAgJ0hPQVJlbmRlcmVyOiBSZW5kZXJpbmcgbW9kZSBcIicgKyBtb2RlICsgJ1wiIGlzIG5vdCAnICtcbiAgICAgICAgICAnc3VwcG9ydGVkLicpO1xuICAgICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fY29uZmlnLnJlbmRlcmluZ01vZGUgPSBtb2RlO1xuICBVdGlscy5sb2coJ0hPQVJlbmRlcmVyOiBSZW5kZXJpbmcgbW9kZSBjaGFuZ2VkLiAoJyArIG1vZGUgKyAnKScpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEhPQVJlbmRlcmVyO1xuXG5cbi8qKiovIH0pLFxuLyogMTcgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuY29uc3QgT21uaXRvbmVUT0FIcmlyQmFzZTY0ID0gW1xuXCJVa2xHUmlRRUFBQlhRVlpGWm0xMElCQUFBQUFCQUFJQWdMc0FBQUR1QWdBRUFCQUFaR0YwWVFBRUFBRCsvd1FBOC84WUFQMy9DZ0FDQUFBQS8vOENBQVlBOC84QUFQSC9DZ0R2Lzk3L2UvK3kvOVArVVFEd0FIVUJFd1Y3L3BQOFAveTA5YnNEd0FmTkJHWUlGZi9ZKzczNitmUDg5MEh2OEFHY0MzVC92d1l5K1M3MEFBSUNBM0FENEFhZ0J3MFI0dzNaRUFjTjhSVllBVjhROFAyeitrRUNId2RLL2pJRzBRTktBWVVFbGY4SUNsajdCZ2pYKy9mOGovbDMvNWYvNmZrSyt4ejhGUDB2L25qL01mL24vRmNCUGZ2SC8xSDMrZ0JQL0hmOGNmaUNBUi81NFFCaCtVUUFjdmt6QVdMOFRQMTMraUQvVi83Myt3djlLditZL2h2K3hQejcvVUw4My8vYS96LzlBUDZSLzVMK2pmMjYvUDMrclAyNi90RDhuUDdCL1B2K1dQMVYvc1A5Z3Y5MS8zUDl4UDNKL252L0dQNVMvc2IrSVA4di85ai9kdjdVL3ByKzZ2K3UvWjMvc3Y1Y0FPcjlRLzgzLytuL3pQNXgvNTcrMi8vay9ud0EvdjAxLy9MK1NBQ0Ivc0QvRmY4MUFKVCtUZ0RwL29jQW0vNWRBRlQrTWdEKy9wTUFXLzdvL3lIL3hRREEva2tBOVA2TEFMMytwQUMwL2lRQXovNVVBTEQrVXdBdC8zVUFoZjRVQUEvL3B3Qysvam9Bei81YUFBdi9md0RZL2lNQUlmK3VBUFArWkFBYy8wUUF5LzR4QUI3L1RnRHMvZ29BRFA4d0FFTC9Od0RvL3ViL1VmOUJBQzMvK3Y5Ri95NEFSUDlIQUZQL0VRQTMveE1BVFA4MUFHMy9IUUF1L3dnQWFQOUZBQ2IvOWY5Qi95MEFVUDhyQUVEL0N3QlYvejRBVy84VEFHSC9CUUJLL3hzQWZ2OGVBRm4vQWdCMy96d0FmZjhSQUdqLy92K0UveUFBYi8vMC8zbi9Gd0J6L3hjQWl2OFBBSG4vRlFDSi94Z0FnLy94LzNqL0VRQ2EveWNBZmYvdy80Ny9Id0NJLy9YL2l2LzcvNDMvSlFDTS8rbi9rUDhBQUpiL0pBQ2ovLzcvb1A4WkFNTC9Td0NvL3c0QXR2OHRBTWIvUEFDci94Y0F3UDlIQU1QL09BREYveTRBMGY5SUFOTC9Od0MvL3pFQTBmOUxBTWIvTUFDOC95NEEzZjlHQU1IL0ZRRFEveVlBMi84c0FNVC9Bd0RYL3hrQTN2OFNBTTMvOXYvYy93OEE0ZjhMQU1qLzhmL2gveFFBMlA4Q0FNbi84Ly9qL3hRQTB2LzcvOUgvL1AvaS94RUEwdi8xLzlMLy9mL2ovdzBBMGYveC85Zi8vdi9rL3dnQXovL3UvOXovQXdEZy93TUEwUC92LzkvL0JRRGYvLy8vMHYveS8rRC9DQURjLy8zLzB2LzIvK0wvQ2dEYS8vci8xdi81LytUL0NnRFkvL2ovMmYvOS8rVC9DQURZLy9mLzNQOEFBT1QvQndEWS8vZi80UDhFQU9QL0JBRFovL2ovNHY4R0FPTC9Bd0RhLy9yLzVmOElBT0gvQVFEYy8vMy81djhKQU9ELy92L2YvLy8vNXY4SUFPRC8vdi9oL3dJQTUvOEhBT0QvL2Yvai93TUE1LzhHQU9ELy9mL2wvd1lBNXY4RUFPRC8vdi9tL3dZQTVmOENBT0wvLy8vbi93WUE1UDhCQU9IL0FBRGwvd1VBNGYvLy8rSC9BUURrL3dNQTRmLy8vK1QvQVFEbS93RUE1Ly8vLytyL0FBRHQvd0FBNy8vLy8vUC9BQUQxLy8vL1wiLFxuXCJVa2xHUmlRRUFBQlhRVlpGWm0xMElCQUFBQUFCQUFJQWdMc0FBQUR1QWdBRUFCQUFaR0YwWVFBRUFBRC8vLy8vL3YvLy93QUFBQUFBQUFBQUFRQUFBQUFBLy8vOS93QUFCQUQrLy9uL0FnQUpBQUFBK3YvKy8vZi9EQUFkQVB2Lyt2K2wvOEwramYvNC92Z0Fkd1ZQQVFBQ0xRQm8rUWovRXY3by9OMy9WZ0NiQTA4QnhmK0wreW45Si8ySENVOEZtZ0J2RGUzMFJ2NWgvTFQwOWdpNUN4a0E1Z09pOC8zMGt3RU0rNFlKTWYybkJta0pKQVFRQkxvRnR2dnYrbTRBN1BGNi9SMEJpZjNxQXVmOFdBUkFBZjRHeUFCRy9CSUF3dnI0QWN2OFUvL2MveUlDOEFFbi9COERhZjJDQWdNQkFmM01BTjM4dmdMSy9VVC9Rd0N5QVBZQ2xQeXZBVy8rcFFBb0FTRCt6UCtSL0lZQzFmN0MvbkVCUVA5NkFaYisxUUFJQU0vL3lRRTcvdGtBWi83VEFYTC93LzgrQUlzQXR3QjcvMjRBNHY5YS96NEE3djRpQURiL2R3Q2ovMjMva2dCT0FOVUFJdjhsQUtFQXhQOWdBSzcvQndDUC81a0E3Lzl2LzB3QXp2OURBR1QvMy85dkFIdi82UCtxL3hVQTdQOFhBTy8vdXYvZy8yVUFFZ0NWL3dFQVRBRE0vKzcvKy8vai8rRC85di9pLy9qL0lnRCsveG9BeGYvNi96NEE1Lys4LzlEL1F3RHEvKzMvT1FEVC96VUFJZ0EvQVBQL1BnQWpBUEQvQndBR0FDQUFEQUMzLy9iL0hBQTNBTi8vUmdETi93OEFJQUFDQU4vL0dRQkRBQ0VBSXdBK0FDb0FKUUFlQVB6L0tnQVlBUHIvRGdBRUFCWUFJZ0FjQU1ULzdmOE9BT0wvNVAvMi8vTC85UDhHQVBULzd2LzgvKzcvNnYvdC8vei9BZ0FVQU9MLy9QOFZBQU1BNC84SUFQYi8rUDhNQUFvQTV2OE5BQXNBOXYvLy93RUFBQUQ5Ly9uLzkvOEpBQVlBN3YvNi93TUErZjhHQUFFQTdmLzcveGdBQ0FENC93OEEvLy8zL3cwQStmOEJBQUlBL1AvNS94SUEvLy85Ly9yLzd2LysveFlBQ1FELy8vSC9Dd0R6L3dFQURnQUhBUFAvRkFEbi8rMy9BUUQ1Ly9mL0FnRDcvd0VBQndBTUFBRUFEUUQ4Ly9uLzhmOE9BUFgvQkFEKy8vWC8rdjhXQUFRQStmOENBQUVBNy84UUFBRUEvUDhEQUFVQTlmOEtBQXdBOXY4REFBVUErZjhPQUFvQTlmLzcvdzBBK3Y4RUFBZ0E4UC82L3dvQSsvLzgvd2tBK1AvMy93b0ErLy84L3djQTkvLzEvd29BQXdENS93Y0EvUC8zL3cwQUF3RDMvd0VBQkFEMi93a0FCZ0QzL3dFQUJRRDMvd1VBQlFEMy8vdi9Cd0QzL3dNQUJRRDMvL3IvQ1FENy8vLy9CUUQ2Ly9uL0NRRDkvLzMvQkFEOS8vai9Cd0FBQVB2L0F3RC8vL2ovQndBQkFQbi9BUUFCQVBuL0JRQUNBUG4vLy84REFQci9Bd0FEQVByLy92OEVBUHYvQVFBREFQdi8vUDhGQVAzLy8vOERBUHovKy84RkFQNy8vZjhDQVA3LysvOEVBUC8vL1A4QkFQLy8rLzhEQUFFQSsvOEFBQUVBKy84Q0FBSUErLy8vL3dJQS9mOEFBQUlBL1AvKy93SUEvZjhBQUFJQS9mLzkvd01BLy8vLy93RUEvLy8rL3dJQS8vLy8vd0FBQUFEKy93QUFBQUQvLy8vL0FBRC8vd0FBLy84QUFQLy9BQUQvL3dBQVwiLFxuXCJVa2xHUmlRRUFBQlhRVlpGWm0xMElCQUFBQUFCQUFJQWdMc0FBQUR1QWdBRUFCQUFaR0YwWVFBRUFBRC8vLy8vLy8vKy8vLy8vLzhBQVAvLy8vOEFBUC8vQUFBQUFQei8vZjhJQUFNQTkvLy8vdzRBQVFENi93d0E4Ly8rL3k4QWZ2LzAvMkgvVVA1Z0FiSCsyUUcxQjJjQVZBSWgvbDMyRlB5TS9uQUNQUURWLytVRW8vUTZBUXdDdS9vTEQ5a0Y4UUpBL1V6K1dmMktDT2NDK3dVS0JzTDVhUUJROTdyd09QaVBBdm41Q0FsOEFIRURrUVBjQUE4Qm4vbElBZHo3SFFGMSt4ejljQU00Lzk0RTRnREtBdW4rY2dQWUFZcjlKZ0pyL2JmK2l2eHovTW9CZ3Y1VUE4RUJTZ0FRQUo3L1VnRWsvY1FCN2Y2My9zRC92ZjRYQWhUL0JRRkNBRFlBblFHSS85RUJ0djNoQUxEL3ZQK2MvM0gvVGdJTi8xc0JwZjh5QVAzLzRmOHFBQnIrMWY4T0FKMy9kd0FHQURFQm52OUpBUHovSVFCd0FJSC9qZ0FTLzR3QXNBQ1RBT24vRFFEQ0FMbi9aUUNTQUFJQUF3RDEvOS8vanY5YUFEUUEvdjlFQUIwQWZnQThBQVFBQ2dCOUFQci9JQUFSQVBULzV2OXhBQ0FBQkFBSEFHVUF0Lzg5QUM0QUNnQWpBTVAvK3YvOS94WUE3Zi8xLytELzdQODdBQzBBdXY4UkFBY0E5LzhGQUM4QTIvL3kveElBRXdBYUFEUUFKQURwL3pvQUFnQWZBQklBMmYvZS96VUErUC82L3c0QTkvL0EvemNBNC8vUC8vVC81Zi9SLy8vL0V3RGIvdzRBOC84QkFCa0FOQURoL3hFQStmLzAvd0lBSEFEYy8vai9Hd0QxLy9mL0dBRHMvK3YvRUFBQUFQei9FZ0QzLytyL0ZnQU1BQWtBR0FEOS8rei9JUUFRQVBIL0dRRDMvL3ovQ2dBZkFPWC9BZ0Q4Ly9IL0JBQVRBT3YvK3YvLy93SUFCQUFkQU9qL0JRQVBBQWNBQVFBVEFPei84LzhKQUFrQTZmOFZBT3YvK2Y4UUFCVUEvdjhPQU8zLytQOEtBQlVBOWY4RkFQdi81LzhUQUEwQTdmOFhBQWtBQVFBSkFCWUE0LzhXQUFjQUNnQU5BQkVBN3Y4RUFQNy9BQUQrL3dNQTkvLzcveEFBQVFEOC93UUErZi83L3dNQUJnRHEvd0FBK3YvMy93WUFDUUQxLy8zL0JBRDkvd2dBRGdEdy8vci9BZ0Q2L3dFQUNBRHYvL2ovQlFELy8vWC9Cd0R1Ly9qL0FnQUNBUFAvQkFEMi8vbi9CQUFHQVBiL0JBRDgvLzMvQlFBSkFQTC9Bd0QrLy8zL0JBQUlBUFAvL2Y4REFQei9BQUFHQVBQLysvOENBUDcvL2Y4RkFQWC8rZjhEQUFBQS9QOEVBUGYvK3Y4R0FBTUErLzhFQVB2LysvOEdBQVFBK3Y4Q0FQLy8vUDhFQUFVQStmOEFBUC8vL2Y4Q0FBVUErUC8vL3dFQS92OEJBQVVBK2YvKy93SUFBQUQvL3dVQSt2Lzkvd01BQVFEOS93UUErLy85L3dNQUFnRDgvd01BL1AvOS93TUFBd0Q3L3dFQS92Lysvd0lBQXdENi93RUEvLy8rL3dBQUJBRDYvd0FBQVFELy93QUFBd0Q3Ly8vL0FRQUFBUC8vQXdEOC8vNy9BZ0FCQVAzL0FnRDkvLzcvQVFBQkFQMy9BUUQrLy83L0FBQUNBUHovQUFEKy8vLy8vLzhCQVAzL0FBRC8vd0FBLy84QkFQNy9BQUQvL3dBQS92OEFBUDcvQUFELy93QUEvLzhBQVAvL1wiLFxuXCJVa2xHUmlRRUFBQlhRVlpGWm0xMElCQUFBQUFCQUFJQWdMc0FBQUR1QWdBRUFCQUFaR0YwWVFBRUFBRC8vLy8vL1AvOS8vMy8vLy8vL3dBQUFBQUFBQUlBQWdBQ0FQLy9DQUFFQUVFQS8vK2NBQVVBYi84SEFBSDkrUDllQVJrQW9nUVVBSm44QndDZC9nWC8rUVFOQUtvQzlnRmRBdGIvYi92ZC85MzZUUC82QXNEL25mcW4vdW4xVy8wZEE4SUVzUUx2QUp2MmJQNzIrV01Ba1A4ZEFjWCtuUU8yQUlyNmJQL0VBQlgrTmdLL0JkajJJUXYyQUU0RVVBaUQveFFBbndJbS9CMEIvd0dOQW9IN3NRYVAvYjhDaVFha0FxRCtSLzl4QTQ3N0tRTC8vNnI3NXYvTy9wY0NnUUN0QWlNQ0JRQWtBTkFBUndIZi8vMzloZ0JsL2tVQUpnRXRBVUVBVGdBL0Fnb0FTQURLL3pVQUp2MjkvdkwrbC85Yy8wY0FVd0JCQUU4QTZRRTUvODcvV3Y5TkFPZis1djdQLzVQLzQvOUJBS1lBUXdERC96WUI1dityL3pZQVR3QXAvMXYvV1FBRUFCMEFod0EwQUEwQUlBQTNBQUVBenYvdS8rLy81djltL3p3QUlBRFEvOFQvU0FCaUFOYi9Td0FiQUZmL01RRFgvN0wvaFA4VEFQci9BZ0FNQUFzQUh3QVpBSTMvVmdEQy85di81Ly94LzZQL0F3QmxBTXYveWY4MkFCNEErUDlXQVBqL053RGkvMUVBMHY5SkFOai9Kd0FjQUFFQURBQllBTmovNGY4TUFFd0FtUDgyQU4vLzNQOFVBRFlBNy8vNi93SUFDQURVL3lnQXl2ODJBTjcvOXYvMi95Z0F4di85LyszLzUvL24velVBNi8vZy95NEFEZ0Q1L3dzQUJ3RHYveElBRHdBR0FDb0FKUUQzL3pJQSsvOEZBQnNBRmdETy96QUFIQUFJQUJRQUxBRHAveGNBQ0FBQUFQSC9HQURzL3drQUNRQUZBQWdBRlFEcC93SUFIQUQxLy9QL0VRRHcvKzMvR0FEOS8rZi9IQUQ4Ly9UL0RBQVFBUEgvSHdENC8vci9Ed0FQQU9qL0VRQUNBT24vREFBWEFPWC9CQUFPQU5ILzkvOE1BTy8vOWY4TEFOVC85ZjhFQU8vLzZmOE5BTmIvK1A4S0FPei81djhNQU9ELzdmOFVBTy8vNy8vKy8vNy85djhZQVBqLzlmL3ovd3NBK3Y4U0FQRC8rdi94L3hZQStmOFNBUGIvOS8vMy94RUFCUUFDQVBuLzkvL3kveFFBQ1FELy8vYi8vdi83L3hJQUNRRDkvL0gvQUFENy94RUFBZ0Q1Ly9QL0F3RDkvdzhBQWdEMy8vRC9CQUQvL3dVQS92LzAvL0QvQmdBREFBTUEvUC8yLy9mL0J3QUdBUDcvKy8vMi8vai9DQUFGQVB2LytmLzUvL3YvQndBSEFQbi85Ly83Ly83L0JRQUZBUGYvOS8vKy93RUFCQUFDQVBmLytQOEJBQUlBQWdBQUFQai85LzhDQUFNQUFBRCsvL24vK2Y4RUFBUUEvdi84Ly9yLysvOEVBQU1BL1AvNy8vei8vUDhFQUFJQS9QLzUvLzcvL3Y4REFBRUErLy81Ly8vLy8vOENBQUFBKy8vNS93RUFBQUFCQVAvLysvLzYvd0lBQVFELy8vMy8vUC83L3dNQUFRRC8vLzMvL2YvOS93SUFBUUQ5Ly8zLy92Lzkvd01BQVFEOS8vei9BQUQvL3dFQUFBRDkvL3ovQUFBQUFBQUEvLy85Ly8zL0FBRC8vd0FBL3YvLy8vNy9BQUQvL3dBQS8vLy8vLy8vQUFELy93QUEvLzhBQVAvL1wiLFxuXCJVa2xHUmlRRUFBQlhRVlpGWm0xMElCQUFBQUFCQUFJQWdMc0FBQUR1QWdBRUFCQUFaR0YwWVFBRUFBRCsvLy8vK2YvLy8vdi8vdi8vL3dBQS8vLy8vd1VBQVFBSUFBSUFCd0FDQUhrQVRBQU9BYU1BQWY5Qy85WDZRdndoQXJBQXRnaEFCVzM3bnYveSswd0FXUU5jQUU4SlJ3U09DNkFFSmU4UDhTL3pyUFdhQkkvK0xRQS8rMEwrUC80SzhBZ0FiLzh1Q2g3OEJRdEM2MTRHYVFXZkFpbjVVZnpOOFRmK0dRaXpBWjRNQ1FNYkdKNEJvUlM3QXZjSHlRQVJBNm45WndIWi96NER2d0FaQWxBQjZnYk5BUzRHRkFERkFUTDdFLzJLK2ozN0MveHAvU0Q5VXYwVkFPc0RzLy9XQWQzK2J2N0YvZjc5bVAyWC9LSCtGd0MwLzFuK1ZnRmNBVEFCSFFHYUFFVCtuZjhZL2hvQW92cHFBWGo5Q1FLVy9sc0NsLzRSQXBqK2JBSGsvUmNBbHY0QkFHLytEZ0RpLy8zL0d3QU9BRUlBcS8reS8zei84djgrLzdUL1R2OC8vMjcvbWdEWi8xc0ErUCtjQUFBQS9QL2kveU1BaS84NUFNUC9LZ0RNLzlNQTlQK1FBQm9BNFFBaUFDd0FDd0JkQVA3L1RRRGIveTBBeWYrU0FBMEFad0RnLzR3QSsvOC9BQU1BZ1FEcC93MEFEQUFRQUFvQU5nQWdBQTRBS0FCSUFCNEE0di8zLytmLyt2L2MvK24vRUFEbi93Z0FGQUFxQU96L0l3RGMvOS8vM2Y4WEFORC8ydi9hL3cwQTV2OEJBTmIvOVAvbS93QUE4UDhaQU4zL1J3QUdBRXNBQmdCL0FQNy9OQUFTQUVnQUJBQTNBUDMvS2dEOS8xc0E4UDhsQU9yL0ZnRDEveEFBNC84a0FPdi9Bd0Q0L3hFQTVmOE5BUFQvK3YvMy94OEE3ZjhQQVBqL0l3RDUveUFBOS84WkFBRUFHZ0Q0L3hvQTlmOEhBQU1BQ0FEMC94Z0ErUDhBQVByL0lRRHAvdzRBOHY4SEFQWC9JZ0QxL3dZQStQOEdBUFgvR2dEMy93b0FCUUFTQUFjQUdRRHcvK3YvOVA4YkFQMy9IQURzLytmLzcvOExBUHIvL3YvMC8vVC9BZ0QyL3dzQTZQLy8vK1AvQ0FEWS8vNy81di8zL3dRQS92OExBUEQvR2dEMS95TUEvUDhRQU92L0xBRHcveVFBK1A4WEFPNy9NUUQ5L3lFQUFRQWNBUEQvSWdEOS94TUErLzhPQU8vL0ZRQUJBQW9BKy84UEFQUC9GUUFCQUFRQTkvOFBBUFgvQ0FBREFBRUErUDhOQVB2L0NBQUdBQVVBOS84SkFQLy9BQUFGQVB6LytmOEhBQVFBL2Y4RkFQMy8vUDhGQUFZQStQOERBUDcvKy84QUFBY0E5LzhCQVAvLy9mLy8vd2dBOS8vKy93QUEvdi84L3dVQTkvLzgvd0lBLy8vNy93VUErdi83L3dJQUFBRDYvd01BL1AvNi93RUFBUUQ2L3dFQS92Lzcvd0lBQWdENi8vLy9BQUQ3L3dFQUFnRDcvLzcvQVFEOC93QUFBd0Q4Ly8zL0F3RDkvd0FBQWdEOS8vei9Bd0QvLy8vL0FnRCsvL3ovQXdBQUFQNy9BUUQvLy8zL0FnQUJBUDMvQUFBQUFQMy9BZ0FDQVB6Ly8vOEJBUDMvQVFBQ0FQMy8vdjhCQVA3L0FBQUJBUDMvL3Y4Q0FQNy8vLzhCQVA3Ly9mOENBUC8vLy84QUFBQUEvdjhDQUFBQUFBQUFBQUFBL3Y4QkFBQUFBQUQvL3dBQS8vOEFBUC8vQUFELy93QUEvLzhBQVAvL1wiLFxuXCJVa2xHUmlRRUFBQlhRVlpGWm0xMElCQUFBQUFCQUFJQWdMc0FBQUR1QWdBRUFCQUFaR0YwWVFBRUFBQUFBUC8vQUFELy93QUEvLzhBQUFBQS8vLy8vd0FBQVFEKy8vLy9BQUFHQVAzL09BQUJBSUlBQXdCdi8vZi9FLzBRQUswQURRQ3pBLzcvOFA0dS8wY0JEUUNKQTZBQmJRRGcvdzcvei85bytWbi9TUG5MLzEvL0VmKzIranI5UmZaZ0E1UUZad0lMREZqK1BBYjIvbkVGS2dLay9SMERsdjZiL0ZVRHNQNllBb2o5U2dBVC9pTC90QVB3QXY4QTBQNnpBcjcvZHdBbkFmMzl1UDIyL3NrQTJ2Ly8vMllDb1A0VUFVc0FaZ0YyQUpIKzRQNzAvcno5K2YrVS9Ydi84djdDQWNiK1RBQ1Mva3dBdi8reC90WDlvUDcxL29MLzFmOG5BRVVBWndHdEFBZ0FJZ0MvQUQ0QmFQOEdBR0gvZFFERi82NEFyZjhuQWFrQWhBSDkvK2tBUVFEM0FGYi9xLzhwL3lJQVIvOEZBUEQvWkFBL0FJWUEzdjh0QURRQURRQnAvM2YvQ3dBQkFQMy9XZjhPQU5qL1d3REgveG9BZS84REFLei96djk2L3o4QTNmL0ovNVgvSUFENS8vai9xLy9jLysvL1JBRHEvL0QvdnY4cEFEVUFGUURJL3k4QUNBQWJBTmIvT3dEMy8rMy85Zi9lL3djQUlBQWVBTUgvOC84eEFDMEFFQURXLyszL0hBQURBUHYvOFA4REFPTC9Pd0QzL3hjQUNRQUhBTS8vNWY4WEFBY0F6Ly9ULzlEL0hnRDkvLy8veWYvZS8vdi9BZ0QvLzlILzYvLy8vL0gvKy84aEFBSUE5Ly83L3cwQUZnQVFBUEwvMnYvOC94c0FHUUFCQU56LzlQOFlBQVFBL3YveS93TUE1djhZQUFrQUFBQUFBQU1BNy84S0FCZ0FEd0RzLy9qL0J3QVRBQnNBOFAvMS8vei9CQUFNQUFBQTlQL3MveEFBL3Y4R0FBa0Evdi9wL3dNQUN3QUxBUDcvOVAvcC93Y0FEUUFGQVBiLzcvLzQvdzBBQ0FEOC8vYi8vdi8xL3dNQUN3RDEvL1QvOFAvOC93QUFDUUR6LytmLzVQOEdBQWtBQlFENS8vRC8rdjhGQUEwQUF3RC8vL1QvQWdBQ0FCQUEvdjhDQVBELysvOEZBQW9BOWYvMy8vZi8vdjhHQVA3Lzl2L3QvL3ovK2Y4QUFQai8rdi8zL3dFQSt2OEhBUHIvL1AvNS93UUEvLzhEQVByLytQLzMvd1lBLy8vKy8vWC8rLy81L3dRQS9mLzcvL1gvKy8vNC93TUEvZi84Ly9qLy92Lzkvd1lBLy8vOC8vZi9BZ0FBQUFVQS9mLzYvL24vQXdBQ0FBSUEvZi83Ly96L0F3QUNBQUFBL2YvNi8vMy9BZ0FEQVA3Ly9mLzcvd0FBQXdBRkFQei8vLy84L3dNQUFnQUVBUHYvL3YvKy93TUFBZ0FEQVB2Ly92Ly8vd01BQVFBQkFQdi8vZjhBQUFJQUFBRC8vL3YvL2Y4QkFBSUEvLy8rLy96Ly92OENBQUlBL3YvOS8vMy8vLzhDQUFFQS92LzkvLzcvQUFBQ0FBQUEvdi85Ly8vL0FBQUJBQUFBL2YvOS93QUFBUUFCQVAvLy9mLysvd0VBQVFBQUFQLy8vdi8rL3dFQUFRRC8vLzcvL3YvLy93RUFBUUQvLy83Ly92Ly8vd0VBQUFEKy8vNy8vLzhBQUFBQUFBRCsvLzcvLy84QUFBQUEvLy8rLy83Ly8vOEFBQUFBLy8vLy8vLy9BQUFBQVAvLy8vLy8vLy8vLy84QUFQLy8vLy8vLy8vL1wiLFxuXCJVa2xHUmlRRUFBQlhRVlpGWm0xMElCQUFBQUFCQUFJQWdMc0FBQUR1QWdBRUFCQUFaR0YwWVFBRUFBQUFBQUFBQUFBQkFBQUFBQUQvLy8vLy8vLy8vLy8vL3YvLy8vMy8vLy8vLy8vLysvLzgvLy8vQVFEOS8vei85ZjhCQUFJQStmOGRBQ2dBV1FCeEFKWC9xditZL3V6OWFQOWsvN1VEVVFRQkFpUUE0UGdpL0FrQjBnS2FCc0QvK2Z4cC92ejlDUVNwL0kvK3l3RE8rdk1EMGZ6Sy9QQUJjZ0JlQmZvQnYvK3VBdUg5U2Y1Z0F5Mzlhd01tQldVQnVQOWZBOS85ZmdEai8yLytFQUNhQUNjQ1N2OVovMmovcnY3aEFBMEFXZjU1LzdMODRQN0UvU0lBVC82N0FNdi90ZitGQUE3LzF2KzcvZ3YvSVArRS9zUUErUDVhQVh6L3RQOVhBRlgvdFA4by80ci9qLy9lL3lRQU12OW1BSlQvcmdDci85WC9Fd0NiLy9ILzlmN0YvNkQvRUFBb0FLMy8vditlL3pzQWgvK0IvN3IvaWYvQy8yci80UC96LzYvL0h3Q3kvMElBNy85WkFMVC95LzgwQUNnQTl2L0ovOS8vRGdBNUFEVUFMUUFSQURJQUN3QWZBT2YvTmdBckFDTUFDUUJCQUVjQUdBQWpBQzRBV1FCVUFIY0FBQUFmQUNFQUlBQWNBUGovQ0FEay95UUE3djg5QUVFQUZ3RDUveFlBNmY4YUFPWC9BQURGL3pRQUR3QVVBT1QvQlFEci95VUE2UDhYQU9mL0hBRFIvMEFBOFA4bkFBZ0FDUUR0L3ljQUtBQUhBUEgvSVFEei94c0FDQURuLy9uL0RnQURBQTRBOFAvLy84ei9HZ0ROL3lNQS9mOFFBTmovTXdBQ0FDMEFDd0FPQU8zL0pnQVpBQVVBQ2dBQUFBNEFJZ0FhQUFrQUR3QUNBQUFBSFFBVEFBVUFCUUFDQUFnQUN3QWpBTy8vLy84QUFBOEFCUUFQQVBMLy9mOEdBQXNBQmdBR0FQRC84djhHQVB6L0NBRDYvL0gvNnY4UEFBZ0FCZ0Q0Ly8zLzl2OGFBQWdBQndEMS8vNy8vdjhRQUFvQUNBRC8vd1VBOXY4UUFBb0FCQUFGQUFnQUFnQUpBQW9BQXdELy93MEFBZ0QvL3djQS92OERBQW9BQlFBRkFCVUFCQUFLQUFZQUJ3QUhBQThBQ2dBR0FBd0FEd0FNQUFrQUVBQUpBQWdBRHdBTUFBZ0FEZ0FKQUFVQUNRQVBBQVVBQ3dBSEFBRUFCZ0FJQUFFQUJBQUdBUC8vQWdBSkFBQUFBZ0FFQVA3Ly8vOElBQUlBLy84R0FBRUFBUUFKQUFJQS92OEVBQU1BLy84SkFBRUEvdjhEQUFNQS92OEhBQU1BL2Y4QkFBVUEvdjhGQUFNQS92OEJBQWNBLy84REFBTUEvdjhCQUFZQS8vOENBQU1BLy8vLy93Y0FBQUFBQUFNQUFBRC8vd1lBQVFEKy93TUFBUUQvL3dVQUFRRCsvd0lBQWdELy93UUFBZ0QrL3dFQUF3RC8vd01BQXdEKy93RUFBd0QvL3dJQUF3RC8vd0VBQkFBQUFBRUFCQUQvL3dBQUJBQUJBQUFBQXdBQUFBQUFCQUFCQVAvL0F3QUJBQUFBQXdBQ0FQLy9BZ0FDQUFBQUF3QUNBUC8vQWdBQ0FBQUFBZ0FDQUFBQUFRQURBQUFBQVFBQ0FBQUFBUUFEQUFBQUFRQUNBQUFBQUFBQ0FBRUFBQUFDQUFFQUFBQUNBQUVBQUFBQkFBRUFBQUFCQUFFQUFBQUJBQUVBQUFBQkFBRUFBQUFCQUFFQUFBQUJBQUVBQUFBQUFBQUFBQUFBQUFBQVwiLFxuXCJVa2xHUmlRRUFBQlhRVlpGWm0xMElCQUFBQUFCQUFJQWdMc0FBQUR1QWdBRUFCQUFaR0YwWVFBRUFBQUFBUC8vQUFELy93QUEvLzhBQUFBQS8vOEFBUC8vQUFBQ0FBQUErZjhCQUFZQS8vLzQvd0lBLy84QUFBOEEvdi9WL3dFQUV3QTlBQUVCUndBMkFGNy9rZm9nLzNnQnd2OTlDRFlCVS9xdEFVWC9BUDdPQWZrQVgvbzlCMzhGU2Z3YUF1VDE0LzYwQkFyOENRQUkvdGZ5SVFUekFYUCtlZ2RVQkJ3Qm9mN1RCTVQ4YkFXaS81RUVXd0JSQUFBS3lmeEUvOGI4OHZwNkFDUCtQQUY0L3FEOE1RTk0veWdDSi8yWEFQRDlrUDVnQVZUL2lQOUkvbEVCNFA4cUFEMEJGQUdhLys3L0RnQjJBT1A5OGdGbS91LytWdjUvQUc4QVNQOWdBTS8vcXY5dy8vb0FjdisyL2pJQkhnQTcvNkQvb0FBR0FLSC9sQURUL3dBQWdnQzhBQVlBa1A5eUFFY0FrZjhCQU9EL1JBQXIvelVBTndEdC94UUFKUUFrQU1UL3p3QS9BT0gveHY5ekFHc0FOUUJUQUljQUxBQXZBQ0lBVEFDeS94TUFEQURnL3hjQVdBQnZBSkwvN2Y5VkFQYi9FZ0R0L3djQTRmOGtBUFAvNVAraC93Z0FDUUR5Ly9yL0xnQVFBTW4vOC85Q0FPWC81di9TLzkvLzNQOHBBQllBdVAvcy93OEFGZ0R0LyszLzd2L3cvOWovNS84R0FPZi8yUC8yLy9QLy92OGtBQk1BdWYvbS94b0FEQURaLytyLzNQOEtBQVVBS3dEZS93c0EzUDhWQUFBQURnQWZBQjBBQ0FBTUFGNEFHZ0FoQVBML013RHovMGtBQkFBS0FQWC9Md0FiQUFrQTl2L3MvKzMvOC84Q0FCQUFBQURtLy9uL0JRQUxBQVVBQVFEai8vbi9KUUFWQVBYLzl2Lysvd0lBRVFBQkFQUC84UC8xL3dBQUJnRDYvKzMvNy8vby8vai9EQUQ4LytiLzhQOElBQWtBQmdENC8vRC84UDhVQUFvQUF3RDQvd0FBK2Y4T0FBY0FBQUFGQVBYLzl2OFRBQWtBOHY4RUFQYi85LzhkQUEwQTcvOENBUG4vK2Y4U0FBUUE4LzhDQU9mLyt2OERBQWdBOVAvLy8vSC8vUDhJQUFVQTgvLzAvd0lBQVFBR0FBZ0E5Ly83L3dBQSsvOEVBUC8vK1AvKy8vLy9BZ0FDQUFzQTh2Lysvd0lBQlFENy93Z0E5di83L3dNQUJBRDUvd0FBL1AvMy93RUFBUUQ3Ly83Ly9QLzEvd1FBLy8vMy8vci8vLy8zL3dNQUF3RDEvL3IvQXdENi8vLy9BZ0Q0Ly9uL0F3RDgvLzcvQWdENC8vbi9Bd0QrLy8zL0FRRDQvL24vQlFELy8vbi9BQUQ2Ly9qL0JBQUJBUGovQUFEOS8vdi9Bd0FEQVBqLy92LysvL3ovQXdBRUFQai8vdjhCQVA3L0FRQURBUGovL2Y4Q0FQLy8vLzhFQVByLy9QOERBQUFBL3Y4Q0FQdi8vUDhEQUFFQS9mOEJBUDMvL2Y4REFBSUEvUDhBQVA3Ly9mOERBQUlBL1AvLy93QUEvZjhCQUFJQSsvLysvd0VBLy84QUFBRUErLy8rL3dFQS8vLy8vd0VBL1AvKy93RUEvLy8rL3dBQS9mLzkvd0VBQUFEOS93QUEvZi8rL3dFQUFRRDgvLy8vL3YvKy93QUFBUUQ4Ly8vLy8vLy8vLy8vQVFEOS8vLy9BQUQvLy8vL0FBRCsvLy8vQUFBQUFQLy9BQUQvLy8vLy8vOEFBUC8vQUFELy93QUEvLzhBQVAvL1wiLFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBPbW5pdG9uZVRPQUhyaXJCYXNlNjQ7XG5cblxuLyoqKi8gfSksXG4vKiAxOCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5jb25zdCBPbW5pdG9uZVNPQUhyaXJCYXNlNjQgPSBbXG5cIlVrbEdSaVFFQUFCWFFWWkZabTEwSUJBQUFBQUJBQUlBZ0xzQUFBRHVBZ0FFQUJBQVpHRjBZUUFFQUFEKy93UUE4LzhaQVByL0RBRCsvd01BL3Y4S0FBUUEvZjhEQUFNQUJBRHMvL3ovOHYvei84Zi9SLzkwL29iKy8vekFBV3NEQXdZM0RLbjkvL3R1OTNEdmt3STZBbjRDdXdKMC9CSDdWUHV4OTJYMEd1N04vRVg5bWdmcUNra0lpUk1nQmQ0TlFRR0wvYzBHL3hCeEFLRUxaQVRVQS9zSUhSU3grZmtDeUFVbUJORUpJQVJsQWRIejJBak5BQ2NJc0FXNEFsRUNzdnRKL1AvN0svdGYrK244YVA0VytnMEZYQUVsQU1uOG5RSG4vc1QrWnY3Tis5WDJ4dnpNL08zK0V2cHFCQkQ3U1FMZCt2Yi9zUGx3L0pENzIvM24rUnIrTC93Uy92ejZVUUdnL05mK0F2NUwvNVg5R3YyLy9TUCttZjNqL2xmK3YvMkIvWkgvNVAwNS9pTDlNUDlGL3VmOVVQNHYvcXY5bXY3by9Ybit3UDJrLzhMK3VQNUovdEQrRHYvWS9iTCttUDcyL24zK3BQKzcvaEFBKy81ekFHSCtaLyt1L2c4QXp2MnkvNkwrLy85by9pSUFEUDhWQUN6L0N3Q04vcGIvMXY0eUFGUCt3Zis0L2pzQWNmNVZBUDMrYkFEYS9uTUE2ZjRzQU9UK0lRQmQvdjcvN3Y2YUFJTCtRQURlL25FQTBQNHlBS3orQ1FDby9tb0F1ZjV4QU43K21BQzgvamNBTmY5ZUFQWCtJQUExLzFrQUFQOWhBTXorUFFENS9tMEEyLzRnQVByK1VRRGgvalFBRXY5QkFQSCtGQUJOL3prQVN2OURBRFAvQkFCZS8xSUFHZjhvQUUzL1JRQXcveklBUWY4bUFEbi9HZ0JFL3hJQVIvOGhBRDcvQkFCeS96RUFLUC8wLzA3L0d3QlgvejRBUmY4bUFGci9RUUJWL3pVQVZQOGVBRnovSkFCdC8wRUFVUDhNQUh6L0tnQnIveWNBWXY4RUFIMy9NQUJsL3g4QWd2OGJBSWovR2dCdi8vei9mZjhBQUpYL0lBQnUvK1QvanYvci80ei85LzluLzc3L3BQOEpBSkQvRVFDSi8vci9xLzhXQUovL0dRQ1UveFlBdHY4cUFLci9QUUNXL3lzQXdmOCtBTGIvT2dDMy95Z0F6Lzh1QU03L09nREgveWdBei84a0FNei9PZ0MvL3hzQTFmOHFBTW4vTHdETi94Y0ExZjhvQU12L0pRRFIveE1BemY4YkFNLy9IZ0RVL3dVQTJ2OFpBTkwvRXdEVy93RUExZjhaQU16L0J3RFgvd0lBMHY4U0FOVC9CUURXL3dNQTAvOFBBTlQvQUFEWS93SUExZjhNQU5YLytmL2Evd1VBMHY4SUFOZi8rLy9ZL3dVQTAvOERBTnIvK2YvWS93UUExdjhCQU5yLytmL1ovd1VBMS8vOC85ei8rdi9ZL3dZQTJmLzgvOTMvL3YvWS93VUEydi85LzkzLy8vL1ovd1VBM1AvOC85Ny9BZ0RhL3dNQTN2LzgvOTcvQXdEYi93SUEzLy85Lzk3L0JBRGQvd0VBNGYvLy85Ly9CUURmL3dBQTR2OEFBTi8vQlFEZi93QUE0LzhDQU4vL0JBRGgvd0FBNC84REFPRC9CQURpLy8vLzQvOERBT0gvQXdEay93QUE1UDhGQU9ML0FnRGwvd0VBNVA4RkFPTC9BUURsL3dFQTQvOEVBT0wvQVFEai93SUE0UDhEQU4vL0FBRGcvd0lBM3Y4Q0FPRC9BQURoL3dFQTR2OEFBT1AvQUFEbS93QUE2UDhBQU96L0FBRHUvd0FBXCIsXG5cIlVrbEdSaVFFQUFCWFFWWkZabTEwSUJBQUFBQUJBQUlBZ0xzQUFBRHVBZ0FFQUJBQVpHRjBZUUFFQUFELy8vLy8vZi8rLy83Ly8vOEFBUC8vLy84QkFBRUEvZjhBQUFFQUFRQUZBQVVBOS8vNi94MEEyZi85L3hNQTNQK2pBRS8vb2Y5SEFLUC8vZ0NqLzc3L1ovdmkvMjhEOS95d0RKQUpJdnI2QXNYMFhlYzRCaGNHemYyM0RaUDd5Zlo2QzEvL253QkRCSUh5WWdvYi9UZjNzUTQxQU5vS1JBL0ErRTd5ZmZBYTlnRDVFUVVCRE13TXlnaXFBSE1BcVBxaEFHVUIyL2dFK2E3OEgvKzRBUFQ2RHdJVUFBMEhOd01oQmZMOEUvOTBBNW43ZFA5Y0FMSUMrdjVDL3EwQU92OWtBb2dCSHYwMS8rMy9xQVFEL3ViOFQvNHZBT1VBNVA2S0FUdit5d0VZQWVUK0tQNmkvM2dDRlA2aC9oci8rUDgzQUNML1ZBRG4vOFVBUlFKSS80TUF1LzhxQWxqK3dmNGlBUGIvTGdGSi84UUFVQUJBQUk0QUJmK2svM1gvWWdGSy9pai9qLzlIQURvQWkvK1dBQTBCVndDL0FDTC9MQUNlLy9jQVJ2OWkveGdBVWdBMEFDai9GZ0JnQUlqLzVQOU0vN3ovenY4L0FLei9ndjhzQUVRQTYvK0kveVlBYXdETC83VC94ZjhxQU92L0ZRQ3UvNW4vRWdBeUFPMy9pLzlMQUU0QSsvL1IvL1AvRmdEZS84ei91LzhEQURJQUxBQVpBTEwvVEFBOEFCd0FvLy8xL3h3QS9QL0wvejBBNlA4akFONy83dithL3pBQXdmLzcvMy8vS1FBdUFDd0E5djhSQUdZQUl3Qk5BRGdBS2dBU0FGMEFEZ0FOQUNFQU1RREgvL0gvTFFBQ0FCMEF5Ly8vL3gwQVBBQUJBQVFBMnY4aUFBY0FFZ0RFLyt2L0ZRRCsvK1AvREFEMS85Ny82di80Ly9YL0V3RDQvKzcvNVA4Y0FBMEFDUURILy83L0NRQVhBQUVBL1AvNS8vai9Dd0FXQUFFQUJRRDkvL24vQVFBV0FCMEE3di9rL3dBQUNRQW1BUC8vOS84QUFQbi84LzhhQU8vLzYvOGZBT3YvNXY4aEFQLy81LzhQQU9mL0FBQUdBUG4vNnY4SkFBWUFCZ0FCQU92LzEvLzEvL0wvK1A4REFCY0E2Zi84L3dNQUNnRDcveEFBM3YvMi8vei9EQUR1Ly96LzV2LzUvd0VBL1AvNi8vNy83di94L3dRQUJnRDUvd0FBOHYvdy93a0FFUUQyLy9qLyt2OEVBQWNBRUFEMy8vdi8rdjhDQUFBQUNRRDMvL3YvL3YvOS93VUFEQUQyLy9YL0FnQUhBQUFBQndEMi8vVC9CZ0FLQVA3L0FRRDQvL3IvQkFBSUFQbi9BQUQzLy9mL0JRQUhBUHYvL3YvNy8vbi9CUUFKQVBqLyt2LzkvLzcvQWdBR0FQai8rZjhCQUFFQUFnQUZBUG4vK3Y4QkFBSUFBQUFFQVBuLytmOENBQVFBL3Y4QkFQci8rdjhDQUFRQS9QLy8vL3YvL1A4Q0FBUUErLy8rLy8zLy9mOENBQVVBK3YvOS8vLy8vLzhBQUFRQSt2LzgvLy8vQUFELy93SUErLy84L3dBQUFRRCsvd0VBKy8vOC93QUFBZ0Q5Ly8vLy9QLzkvd0VBQWdEOC8vNy8vZi85L3dBQUFnRDgvLzMvL3YvKy8vLy9BUUQ4Ly96Ly8vLy8vLy8vQUFEOC8vMy8vLzhBQVA3L0FBRDkvLzcvLy84QUFQNy8vLy8rLy8vLy8vOEFBUDcvLy8vKy8vLy8vLy8vLy8vLy8vLy8vLy8vXCIsXG5cIlVrbEdSaVFFQUFCWFFWWkZabTEwSUJBQUFBQUJBQUlBZ0xzQUFBRHVBZ0FFQUJBQVpHRjBZUUFFQUFELy8vLy8vdjhBQVAvLy8vLy8vd0FBQUFBQUFQNy9BUUFCQUFBQUJ3RC8vL1gvQlFBakFQTC9DUURiLzlEL0dBQWIvN3NBWXdDVy96MEJjUC9YLzdULzJRRFcrd0g4eUFOQ0NDVUo1UVQrK1VYbWhQd2hBNzhGdUF4SCtwNzhpZnVkQmxBRzl2bXUvbEFLMmZkbEIvLy9jZmpvQ2EwRTdBa245WWIvenZiYStBa0FIUHl3QkdFQkZ3VU5BTDhBWEFBR0EyMERGdm1SL2t6K0YvMDZBZy8rR3dIbC81RUVLZ0pkL3EwQVAveW0vOW42RWZ4WS8ySCsvUUZ0QUM0QzZRQkRBYU1Dby8yMC8rMy8zZi9wL2ZMOXJ2OVYvNmNCaFFIdUFYNEFjd0pZQWFIL0lQL1AvZ3NBcFAwTEFlNy9zUUJ1QUkwQUFnR0RBRTRCekFDZS81WC8vdit2LytmK1pmK2dBT3YvNVFCaEFPSUFwQUFOQVNZQXVQK2gvOGIvSFFCci85Ly9iQUNXQUdFQUZBQjVBRDBBV1FEVS8rRC9ZZi9wLy9EL3MvK1IvNFFBTVFCdkFCRUFrUUJmQUJRQUpnRFcvd3dBOC84WEFMei92Zjh6QUZBQUt3RDEvekVBUHdESi94MEE3LzhMQU9YL0Z3RFIvL0gvRVFBZEFPLy82UDhRQUZFQTJmOFdBQkVBTWdEeS94SUErZi9zL3hBQUxnRHYvLy8vSFFBdkFQVC8rZjhpQUFZQUVnQUZBQm9BR2dELy93MEErZi8wL3hzQUhnRHgvOWYvR0FBQ0FQSC84ZjhKQVBmL0d3QUxBQkVBNy84Y0FQVC9DZ0QyLy9qL0JRRDgvKzMvT2dBZ0FBWUE5ZjhQQU43L0RnRDkvOXIvMS8vMy8rMy85Ly8xLy9iLzgvLzUvL2YvQWdBSkFPZi8rdjhPQUFNQUN3RDkvKzcvNWY4ZUFBRUE5Ly9xLy83LzhQOFdBUDcvKy8vNC93SUErZjhUQUFJQTlmLzUvd2NBK1A4aUFBZ0E5di9uL3hvQS8vOGdBQVVBQndEai93QUE5djhCQUFVQUZRRG4vd01BN3Y4UUFCQUFFUURtL3d3QThmOGFBQUFBQndEdS93Y0FDZ0FTQUFFQTcvL3cvL2YvQmdBUkFBa0E2UC8zL3djQURnQUtBQVlBNGYvNC93WUFEZ0FBQVByLzhQLzkveFFBQ2dBSEFQbi83Ly85L3hFQUFnRCsvL0wvOHYvOC94VUFBd0R3Ly9ILzlmOENBQXNBL3YvcS8vTC8rZjhGQUFZQS9QL3IvL2ovLy84R0FBa0ErLy9vLy9qL0FRQUlBUC8vK3Yvby8vdi9DQUFJQVB2LytQL3cvd0VBQ1FBSEFQai8rZi8wL3dJQUN3QUZBUGIvK2YvNC93UUFDd0FDQVBQLytmLysvd1lBQ0FELy8vTC8rLzhCQUFZQUJRRDkvL1AvL1A4RkFBVUFBZ0Q3Ly9ULy9mOEhBQVFBLy8vNy8vZi8vLzhJQUFNQS9QLzYvL3IvQVFBSUFBRUErdi82Ly8zL0FnQUhBQUFBK2YvNy93QUFBd0FGQVA3LytQLzgvd0lBQWdBQ0FQMy8rZi85L3dNQUF3QUFBUHovK3YvKy93UUFBZ0QrLy96LysvOEFBQVFBQVFEOC8vei8vZjhCQUFRQUFBRDcvLzMvLy84QkFBTUEvLy83Ly8zL0FBQUNBQUVBL3YvNy8vNy9BUUFCQUFBQS92LzkvLy8vQVFBQUFQLy8vdi8rLy8vL0FBRC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXCIsXG5cIlVrbEdSaVFFQUFCWFFWWkZabTEwSUJBQUFBQUJBQUlBZ0xzQUFBRHVBZ0FFQUJBQVpHRjBZUUFFQUFELy8vLy8vLy8rLy8vLy8vOEFBQUFBL3YvKy93QUFBUUQ4Ly8zL0NRQUpBUDMvK3Y4UEFBY0FwQUJsQUJrQmt3Q08vaS8vbGZxYS9IUUFjZi8zQmRrQ3p3SmNCQ01DMHdNTi85Lzl3Z0k3QWFFQ1lmeFYvVGY4M3Zobi94cnQ4T3d4LzhuN2NnSEFCWWI0M1FjWkRoNFd1Z05yQTdQNzRnSHUvOXovenYwdC9hY0NpUUhZL2l2NHFRT2wveXNDRS8wLy9YVDlTZjRPLy9qOXhmdXBBbjM5NGdITytyc0NYQUZJQXhRQzl3SVhCZ2NEMkFRdUFuYi85Z0poLzZ3QVZmeEVBSTRCdmY3b0FGdi9iQUxzQU1RQmUvODgvam9BVC80ZEFIMzkvdjlMQVhuL2d3REkvL1FCZEFCY0FBMEE3ZjRsQU1uLy8vKzkvdHYvaUFCcC8xMy9wUC9kQUx2L3cvOE1BSHYvL2YreS82Ly8vLzdVLzVBQVpQK1ovOHIvblFEUi81ci9Ed0RyL3hBQTR2K3MvM3ovK1A5dUFPdi90LzgyQUdjQUhnQ2IveVFBRlFCR0FNNy9DZ0QzL3hvQWVnQWFBT3ovQ2dCSEFBOEFkdjgvQUFBQUJRQzIveElBQUFBN0FCUUFLZ0NqL3o0QUFRQVhBSnovSkFBREFBY0E4Zi8xLzJBQUFRQWxBUEQvTmdEeC8xd0E3di80L3dNQVpBRHYvLzMvSFFBa0FGb0E4UDlGQVB2L0ZnQklBUGYvV1FBSEFFVUFDUUQwL3hJQVF3RHUvd01Bd1A5VkFMbi9Yd0N3L3lFQTVmOHNBUGovRmdERC8xWUF5djhyQU9YL0hRRG8vL2ovSVFBUUFDQUFId0Q5L3lRQUhRQkFBQmdBQlFBaUFBVUFLQUQzL3drQUN3QUtBQU1BQndBSkFQYi8rZjhHQU9yL0pRQUhBQk1BNlA4VEFBNEFHZ0QvL3dvQTgvOFpBUC8vR0FEdS93MEE5djhTQUFNQUJ3RDQvd1FBNVA4WEFBUUFDZ0RxL3dVQSsvOFZBQWNBQ0FEcy94SUFBQUFUQVBILyt2LzEvL1QvN2YvLy8rei8rdi95LysvLzkvOEtBQWNBQ2dBSkFQVC9CQUFLQUFBQUJnQUlBUEwvOXY4S0FBTUFCQUFDQVByLzl2OE9BQUlBK1AveC8vdi8rZjhNQVBiLytQL3cvd1FBOWY4TUFQbi8vLy83L3dvQS92OFBBQUVBQWdEMS94QUFBUUFQQVAvL0F3RC8veFFBQndBTEFBQUFCZ0FEQUJBQUFnQUhBQUFBQ0FBQkFBOEFCUUFGQUFNQUJ3QUVBQTRBQndBREFBRUFDUUFGQUFvQUF3RC8vd0FBQ1FBREFBVUFBUUQvLy8vL0NBQUJBQU1BQUFELy8vLy9Cd0FDQUFFQUFBRC8vLy8vQndBQ0FQNy8vLzhCQUFBQUJnQUJBUDcvLy84Q0FBQUFCQUFBQVA3Ly8vOERBQUFBQXdBQUFQMy8vLzhEQUFBQUFRQUFBUDMvL3Y4RUFBQUFBQUQrLy8vLy8vOEVBUC8vLy8vKy93QUEvdjhFQVAvLy8vLysvd0VBL3Y4RUFQLy8vdi8rL3dJQS8vOERBUC8vL3YvKy93SUEvLzhCQVAvLy92Lysvd01BLy84QkFQLy8vLy8rL3dNQS8vOEFBUC8vQUFEKy93UUEvLzhBQVA3L0FRRC8vd0lBLy8vLy8vLy9BUUQvL3dJQS8vLy8vLy8vQVFBQUFBRUFBQUFBQVAvL0FRRC8vd0VBQUFBQUFQLy9BUUFBQUFFQUFBQUFBQUFBXCIsXG5cIlVrbEdSaVFFQUFCWFFWWkZabTEwSUJBQUFBQUJBQUlBZ0xzQUFBRHVBZ0FFQUJBQVpHRjBZUUFFQUFEKy93QUErdjhBQVB6L0FBRC8vd0FBL2Y4QUFBRUFBQUQrL3dBQUNRQUFBQVFBQUFBWkFBQUF0Z0FBQUZzQkFBQlcvZ0FBSC9vQUFHY0JBQUJvQndBQWxBQUFBTzMvQUFBUkFRQUErd0lBQUVvRUFBQ2UvZ0FBaXY0QUFMRDBBQURKOHdBQWtRUUFBRjM0QUFCaThRQUFQUUFBQUFIMkFBRDE5QUFBREFNQUFKd0dBQUNURUFBQTBBd0FBSmtIQUFDT0J3QUF1UUVBQU5jREFBQzZBZ0FBSHdVQUFIRUZBQUIwQXdBQWJnRUFBRHorQUFEWUFRQUFHQUFBQUp3Q0FBRGdBQUFBLy8wQUFNbitBQUFUL0FBQXdQOEFBT245QUFBSkFBQUFld0VBQU9uK0FBQ04vd0FBT3YwQUFPMytBQUROL2dBQWNQOEFBQ2ovQUFDcS9nQUErZjRBQU1MOUFBQ2Evd0FBL2Y0QUFONy9BQUJvL3dBQTYvNEFBRS8vQUFBQy93QUFFUUFBQUhYL0FBQjBBQUFBNWY4QUFFd0FBQUIzQUFBQTUvOEFBTUlBQUFCQ0FBQUF6Z0FBQUU4QUFBQjNBQUFBS0FBQUFETUFBQUNxQUFBQUx3QUFBSzRBQUFBU0FBQUFWZ0FBQUNnQUFBQXRBQUFBVEFBQUFQMy9BQUE3QUFBQTIvOEFBQ1FBQUFEdy93QUFMUUFBQURFQUFBQWxBQUFBYkFBQUFETUFBQUJVQUFBQUVBQUFBQ2dBQUFEMS93QUE5djhBQVByL0FBRHUvd0FBTGdBQUFCSUFBQUJVQUFBQVJBQUFBR1VBQUFCR0FBQUFPQUFBQUdBQUFBQXVBQUFBUlFBQUFDRUFBQUFmQUFBQUFBQUFBQWtBQUFBUUFBQUFBd0FBQUJJQUFBRHMvd0FBRUFBQUFBWUFBQUFTQUFBQUlnQUFBQkVBQUFBREFBQUFCQUFBQUE4QUFBRDQvd0FBSFFBQUFBc0FBQUFJQUFBQURnQUFBUC8vQUFBY0FBQUFEd0FBQUFZQUFBQVNBQUFBRndBQUFBTUFBQUFZQUFBQUVnQUFBUHIvQUFBUUFBQUFEUUFBQUFvQUFBRDMvd0FBQmdBQUFQYi9BQURmL3dBQS92OEFBUEwvQUFENi93QUFGQUFBQUFRQUFBQUVBQUFBR3dBQUFBRUFBQUFNQUFBQUlBQUFBQUlBQUFBZEFBQUFHQUFBQUFJQUFBQWNBQUFBRWdBQUFBY0FBQUFlQUFBQUR3QUFBQVFBQUFBZUFBQUFCQUFBQUFZQUFBQVpBQUFBQVFBQUFBNEFBQUFUQUFBQS92OEFBQW9BQUFBT0FBQUErLzhBQUFzQUFBQUpBQUFBK2Y4QUFBc0FBQUFCQUFBQStmOEFBQW9BQUFEOS93QUErdjhBQUFjQUFBRDUvd0FBK3Y4QUFBVUFBQUQzL3dBQS9mOEFBQVFBQUFEMi93QUFBQUFBQUFFQUFBRDMvd0FBQWdBQUFBQUFBQUQ0L3dBQUF3QUFBUDcvQUFENi93QUFCQUFBQVAzL0FBRDgvd0FBQkFBQUFQdi9BQUQrL3dBQUF3QUFBUHYvQUFELy93QUFBUUFBQVB2L0FBQUFBQUFBQUFBQUFQdi9BQUFDQUFBQS8vOEFBUHovQUFBQ0FBQUEvdjhBQVAzL0FBQUNBQUFBL2Y4QUFQNy9BQUFCQUFBQS9mOEFBUC8vQUFBQkFBQUEvZjhBQUFBQUFBQUFBQUFBL3Y4QUFBRUFBQUFBQUFBQS8vOEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBXCIsXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9tbml0b25lU09BSHJpckJhc2U2NDtcblxuXG4vKioqLyB9KSxcbi8qIDE5ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGUgQ3Jvc3MtYnJvd3NlciBzdXBwb3J0IHBvbHlmaWxsIGZvciBPbW5pdG9uZSBsaWJyYXJ5LlxuICovXG5cblxuXG5cbi8qKlxuICogRGV0ZWN0cyBicm93c2VyIHR5cGUgYW5kIHZlcnNpb24uXG4gKiBAcmV0dXJuIHtzdHJpbmdbXX0gLSBBbiBhcnJheSBjb250YWlucyB0aGUgZGV0ZWN0ZWQgYnJvd3NlciBuYW1lIGFuZCB2ZXJzaW9uLlxuICovXG5leHBvcnRzLmdldEJyb3dzZXJJbmZvID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgbGV0IE0gPSB1YS5tYXRjaChcbiAgICAgIC8ob3BlcmF8Y2hyb21lfHNhZmFyaXxmaXJlZm94fG1zaWV8dHJpZGVudCg/PVxcLykpXFwvP1xccyooW1xcZFxcLl0rKS9pKSB8fFxuICAgICAgW107XG4gIGxldCB0ZW07XG5cbiAgaWYgKC90cmlkZW50L2kudGVzdChNWzFdKSkge1xuICAgIHRlbSA9IC9cXGJydlsgOl0rKFxcZCspL2cuZXhlYyh1YSkgfHwgW107XG4gICAgcmV0dXJuIHtuYW1lOiAnSUUnLCB2ZXJzaW9uOiAodGVtWzFdIHx8ICcnKX07XG4gIH1cblxuICBpZiAoTVsxXSA9PT0gJ0Nocm9tZScpIHtcbiAgICB0ZW0gPSB1YS5tYXRjaCgvXFxiT1BSfEVkZ2VcXC8oXFxkKykvKTtcbiAgICBpZiAodGVtICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB7bmFtZTogJ09wZXJhJywgdmVyc2lvbjogdGVtWzFdfTtcbiAgICB9XG4gIH1cblxuICBNID0gTVsyXSA/IFtNWzFdLCBNWzJdXSA6IFtuYXZpZ2F0b3IuYXBwTmFtZSwgbmF2aWdhdG9yLmFwcFZlcnNpb24sICctPyddO1xuICBpZiAoKHRlbSA9IHVhLm1hdGNoKC92ZXJzaW9uXFwvKFtcXGQuXSspL2kpKSAhPSBudWxsKSB7XG4gICAgTS5zcGxpY2UoMSwgMSwgdGVtWzFdKTtcbiAgfVxuXG4gIGxldCBwbGF0Zm9ybSA9IHVhLm1hdGNoKC9hbmRyb2lkfGlwYWR8aXBob25lL2kpO1xuICBpZiAoIXBsYXRmb3JtKSB7XG4gICAgcGxhdGZvcm0gPSB1YS5tYXRjaCgvY3Jvc3xsaW51eHxtYWMgb3MgeHx3aW5kb3dzL2kpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBNWzBdLFxuICAgIHZlcnNpb246IE1bMV0sXG4gICAgcGxhdGZvcm06IHBsYXRmb3JtID8gcGxhdGZvcm1bMF0gOiAndW5rbm93bicsXG4gIH07XG59O1xuXG5cbi8qKlxuICogUGF0Y2hlcyBBdWRpb0NvbnRleHQgaWYgdGhlIHByZWZpeGVkIEFQSSBpcyBmb3VuZC5cbiAqL1xuZXhwb3J0cy5wYXRjaFNhZmFyaSA9IGZ1bmN0aW9uKCkge1xuICBpZiAod2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCAmJiB3aW5kb3cud2Via2l0T2ZmbGluZUF1ZGlvQ29udGV4dCkge1xuICAgIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgIHdpbmRvdy5PZmZsaW5lQXVkaW9Db250ZXh0ID0gd2luZG93LndlYmtpdE9mZmxpbmVBdWRpb0NvbnRleHQ7XG4gIH1cbn07XG5cblxuLyoqKi8gfSksXG4vKiAyMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlIE9tbml0b25lIHZlcnNpb24uXG4gKi9cblxuXG5cblxuLyoqXG4gKiBPbW5pdG9uZSBsaWJyYXJ5IHZlcnNpb25cbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gJzEuMC42JztcblxuXG4vKioqLyB9KVxuLyoqKioqKi8gXSk7XG59KTtcblxuLyoqKi8gfSksXG4vKiAxMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlIFJlc29uYW5jZUF1ZGlvIHZlcnNpb24uXG4gKiBAYXV0aG9yIEFuZHJldyBBbGxlbiA8Yml0bGxhbWFAZ29vZ2xlLmNvbT5cbiAqL1xuXG5cblxuXG4vKipcbiAqIFJlc29uYW5jZUF1ZGlvIGxpYnJhcnkgdmVyc2lvblxuICogQHR5cGUge1N0cmluZ31cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAnMC4wLjQnO1xuXG5cbi8qKiovIH0pXG4vKioqKioqLyBdKTtcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Jlc29uYW5jZS1hdWRpby9idWlsZC9yZXNvbmFuY2UtYXVkaW8uanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3Jlc29uYW5jZS1hdWRpby9idWlsZC9yZXNvbmFuY2UtYXVkaW8uanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogZ2xvYmFsIEFGUkFNRSAqL1xuXG5pZiAodHlwZW9mIEFGUkFNRSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgYXR0ZW1wdGVkIHRvIHJlZ2lzdGVyIGJlZm9yZSBBRlJBTUUgd2FzIGF2YWlsYWJsZS4gRGlkIHlvdSBpbmNsdWRlIEEtRnJhbWU/Jylcbn1cblxuY29uc3QgQVJBQ1ZFUiA9IHJlcXVpcmUoJy4vdmVyc2lvbicpXG5cbmNvbnN0IGxvZyA9IEFGUkFNRS51dGlscy5kZWJ1Z1xuLy8gY29uc3QgZXJyb3IgPSBsb2coJ0EtRnJhbWUgUmVzb25hbmNlIEF1ZGlvIENvbXBvbmVudDplcnJvcicpXG5jb25zdCBpbmZvID0gbG9nKCdBLUZyYW1lIFJlc29uYW5jZSBBdWRpbyBDb21wb25lbnRlOmluZm8nKVxuY29uc3Qgd2FybiA9IGxvZygnQS1GcmFtZSBSZXNvbmFuY2UgQXVkaW8gQ29tcG9uZW50ZTp3YXJuJylcblxuaWYgKG1vZHVsZS5ob3QpIHtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB3YXJuKGBWZXJzaW9uOiAke0FSQUNWRVJ9LWRldmApXG59IGVsc2Uge1xuICBpbmZvKGBWZXJzaW9uOiAke0FSQUNWRVJ9YClcbn1cblxucmVxdWlyZSgnLi9yZXNvbmFuY2UtYXVkaW8tcm9vbScpXG5yZXF1aXJlKCcuL3Jlc29uYW5jZS1hdWRpby1zcmMnKVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGdsb2JhbCBBRlJBTUUgQXVkaW9Db250ZXh0ICovXG5pbXBvcnQge1Jlc29uYW5jZUF1ZGlvfSBmcm9tICdyZXNvbmFuY2UtYXVkaW8nXG5cbmNvbnN0IGxvZyA9IEFGUkFNRS51dGlscy5kZWJ1Z1xuY29uc3Qgd2FybiA9IGxvZygnY29tcG9uZW50czpyZXNvbmFuY2UtYXVkaW8tcm9vbTp3YXJuJylcblxuY29uc3QgUkVTT05BTkNFX01BVEVSSUFMID0gT2JqZWN0LmtleXMoUmVzb25hbmNlQXVkaW8uVXRpbHMuUk9PTV9NQVRFUklBTF9DT0VGRklDSUVOVFMpXG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgncmVzb25hbmNlLWF1ZGlvLXJvb20nLCB7XG4gIGRlcGVuZGVuY2llczogWydnZW9tZXRyeScsICdwb3NpdGlvbiddLFxuICAvLyBUbyBlbmFibGUgbXVsdGlwbGUgaW5zdGFuY2luZyBvbiB5b3VyIGNvbXBvbmVudCxcbiAgLy8gc2V0IG11bHRpcGxlOiB0cnVlIGluIHRoZSBjb21wb25lbnQgZGVmaW5pdGlvbjpcbiAgbXVsdGlwbGU6IGZhbHNlLFxuXG4gIHNjaGVtYToge1xuICAgIHdpZHRoOiB7dHlwZTogJ251bWJlcicsIGRlZmF1bHQ6IFJlc29uYW5jZUF1ZGlvLlV0aWxzLkRFRkFVTFRfUk9PTV9ESU1FTlNJT05TLndpZHRofSxcbiAgICBoZWlnaHQ6IHt0eXBlOiAnbnVtYmVyJywgZGVmYXVsdDogUmVzb25hbmNlQXVkaW8uVXRpbHMuREVGQVVMVF9ST09NX0RJTUVOU0lPTlMuaGVpZ2h0fSxcbiAgICBkZXB0aDoge3R5cGU6ICdudW1iZXInLCBkZWZhdWx0OiBSZXNvbmFuY2VBdWRpby5VdGlscy5ERUZBVUxUX1JPT01fRElNRU5TSU9OUy5kZXB0aH0sXG4gICAgYW1iaXNvbmljT3JkZXI6IHt0eXBlOiAnaW50JywgZGVmYXVsdDogUmVzb25hbmNlQXVkaW8uVXRpbHMuREVGQVVMVF9BTUJJU09OSUNfT1JERVIsIG9uZU9mOiBbMSwgM119LFxuICAgIHNwZWVkT2ZTb3VuZDoge3R5cGU6ICdudW1iZXInLCBkZWZhdWx0OiBSZXNvbmFuY2VBdWRpby5VdGlscy5ERUZBVUxUX1NQRUVEX09GX1NPVU5EfSxcbiAgICBsZWZ0OiB7ZGVmYXVsdDogJ2JyaWNrLWJhcmUnLCBvbmVPZjogUkVTT05BTkNFX01BVEVSSUFMfSxcbiAgICByaWdodDoge2RlZmF1bHQ6ICdicmljay1iYXJlJywgb25lT2Y6IFJFU09OQU5DRV9NQVRFUklBTH0sXG4gICAgZnJvbnQ6IHtkZWZhdWx0OiAnYnJpY2stYmFyZScsIG9uZU9mOiBSRVNPTkFOQ0VfTUFURVJJQUx9LFxuICAgIGJhY2s6IHtkZWZhdWx0OiAnYnJpY2stYmFyZScsIG9uZU9mOiBSRVNPTkFOQ0VfTUFURVJJQUx9LFxuICAgIGRvd246IHtkZWZhdWx0OiAnYnJpY2stYmFyZScsIG9uZU9mOiBSRVNPTkFOQ0VfTUFURVJJQUx9LFxuICAgIHVwOiB7ZGVmYXVsdDogJ2JyaWNrLWJhcmUnLCBvbmVPZjogUkVTT05BTkNFX01BVEVSSUFMfVxuICB9LFxuICBpbml0ICgpIHtcbiAgICB0aGlzLmhhc0F1ZGlvID0gZmFsc2VcbiAgICB0aGlzLmNhbWVyYU1vdmVkID0gZmFsc2VcbiAgICB0aGlzLmJ1aWx0SW5HZW9tZXRyeSA9IHRydWVcbiAgICB0aGlzLmNhbWVyYU1hdHJpeDQgPSBuZXcgQUZSQU1FLlRIUkVFLk1hdHJpeDQoKVxuICAgIHRoaXMucmVzb25hbmNlQXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpXG4gICAgdGhpcy5yZXNvbmFuY2VBdWRpb1NjZW5lID0gbmV3IFJlc29uYW5jZUF1ZGlvKHRoaXMucmVzb25hbmNlQXVkaW9Db250ZXh0KVxuICAgIHRoaXMucmVzb25hbmNlQXVkaW9TY2VuZS5vdXRwdXQuY29ubmVjdCh0aGlzLnJlc29uYW5jZUF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbilcbiAgICAvLyBDcmVhdGUgYW4gQXVkaW9FbGVtZW50LlxuICAgIHRoaXMuZWwuYXVkaW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKVxuICAgIHRoaXMuc291bmQgPSBudWxsXG4gIH0sXG5cbiAgdXBkYXRlIChvbGREYXRhKSB7XG4gICAgdGhpcy5yb29tU2V0dXAob2xkRGF0YSlcbiAgICB0aGlzLmFjb3VzdGljc1NldHVwKG9sZERhdGEpXG4gICAgdGhpcy5zZXRVcEF1ZGlvKClcbiAgfSxcblxuICB0aWNrICgpIHtcbiAgICBjb25zdCBjYW1lcmFFbCA9IHRoaXMuZWwuc2NlbmVFbC5jYW1lcmEuZWxcbiAgICB0aGlzLmNhbWVyYU1hdHJpeDQgPSBjYW1lcmFFbC5vYmplY3QzRC5tYXRyaXhXb3JsZFxuICB9LFxuXG4gIC8vIHVwZGF0ZSByZXNvbmFuY2VBdWRpb1NjZW5lIGFmdGVyIHJvb20gaXMgdG9ja2VkXG4gIHRvY2sgKCkge1xuICAgIGlmICghdGhpcy5oYXNBdWRpbykgeyByZXR1cm4gfVxuICAgIHRoaXMucmVzb25hbmNlQXVkaW9TY2VuZS5zZXRMaXN0ZW5lckZyb21NYXRyaXgodGhpcy5jYW1lcmFNYXRyaXg0KVxuICB9LFxuXG4gIC8vIHJvb20gc2V0dXBcbiAgcm9vbVNldHVwIChvbGREYXRhKSB7XG4gICAgLy8gcm9vbSBkaW1lbnNpb25zXG4gICAgbGV0IGRpbWVuc2lvbnMgPSB7XG4gICAgICB3aWR0aDogdGhpcy5kYXRhLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmRhdGEuaGVpZ2h0LFxuICAgICAgZGVwdGg6IHRoaXMuZGF0YS5kZXB0aFxuICAgIH1cbiAgICBpZiAoKHRoaXMuZGF0YS53aWR0aCArIHRoaXMuZGF0YS5oZWlnaHQgKyB0aGlzLmRhdGEuZGVwdGgpID09PSAwKSB7XG4gICAgICBjb25zdCBiYiA9IG5ldyBBRlJBTUUuVEhSRUUuQm94MygpLnNldEZyb21PYmplY3QodGhpcy5lbC5vYmplY3QzRClcbiAgICAgIGRpbWVuc2lvbnMud2lkdGggPSBiYi5zaXplKCkueFxuICAgICAgZGltZW5zaW9ucy5oZWlnaHQgPSBiYi5zaXplKCkueVxuICAgICAgZGltZW5zaW9ucy5kZXB0aCA9IGJiLnNpemUoKS56XG4gICAgICB0aGlzLmJ1aWx0SW5HZW9tZXRyeSA9IGZhbHNlXG4gICAgfVxuICAgIC8vIHVwZGF0ZSBnZW9tZXRyeSAob25seSBpZiB1c2luZyBkZWZhdWx0IGdlb21ldHJ5KVxuICAgIGlmICh0aGlzLmJ1aWx0SW5HZW9tZXRyeSkge1xuICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2dlb21ldHJ5JywgZGltZW5zaW9ucylcbiAgICB9XG4gICAgLy8gcm9vbSBtYXRlcmlhbHNcbiAgICBsZXQgbWF0ZXJpYWxzID0ge1xuICAgICAgbGVmdDogdGhpcy5kYXRhLmxlZnQsXG4gICAgICByaWdodDogdGhpcy5kYXRhLnJpZ2h0LFxuICAgICAgZnJvbnQ6IHRoaXMuZGF0YS5mcm9udCxcbiAgICAgIGJhY2s6IHRoaXMuZGF0YS5iYWNrLFxuICAgICAgZG93bjogdGhpcy5kYXRhLmRvd24sXG4gICAgICB1cDogdGhpcy5kYXRhLnVwXG4gICAgfVxuICAgIHRoaXMucmVzb25hbmNlQXVkaW9TY2VuZS5zZXRSb29tUHJvcGVydGllcyhkaW1lbnNpb25zLCBtYXRlcmlhbHMpXG4gIH0sXG5cbiAgLy8gcm9vbSBhY291c3RpY3Mgc2V0dXBcbiAgYWNvdXN0aWNzU2V0dXAgKG9sZERhdGEpIHtcbiAgICBpZiAoIXRoaXMucmVzb25hbmNlQXVkaW9TY2VuZSB8fFxuICAgICAgKChvbGREYXRhLmFtYmlzb25pY09yZGVyID09PSB0aGlzLmRhdGEuYW1iaXNvbmljT3JkZXIpICYmXG4gICAgICAob2xkRGF0YS5zcGVlZE9mU291bmQgPT09IHRoaXMuZGF0YS5zcGVlZE9mU291bmQpKSkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5yZXNvbmFuY2VBdWRpb1NjZW5lLnNldEFtYmlzb25pY09yZGVyKHRoaXMuZGF0YS5hbWJpc29uaWNPcmRlcilcbiAgICB0aGlzLnJlc29uYW5jZUF1ZGlvU2NlbmUuc2V0U3BlZWRPZlNvdW5kKHRoaXMuZGF0YS5zcGVlZE9mU291bmQpXG4gIH0sXG5cbiAgc2V0VXBBdWRpbyAoKSB7XG4gICAgbGV0IGNoaWxkcmVuID0gdGhpcy5lbC5vYmplY3QzRC5jaGlsZHJlblxuICAgIC8vIDEgPSB0aGlzLmVsXG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA8IDIpIHsgcmV0dXJuIH1cblxuICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkRWwpID0+IHtcbiAgICAgIGlmICghY2hpbGRFbC5lbC5nZXRBdHRyaWJ1dGUoJ3Jlc29uYW5jZS1hdWRpby1zcmMnKSkgeyByZXR1cm4gfVxuICAgICAgaWYgKHRoaXMuaGFzQXVkaW8pIHtcbiAgICAgICAgd2Fybignc3VwcG9ydGluZyBzaW5nbGUgcmVzb25hbmNlLWF1ZGlvLXNyYyB1bmRlciByZXNvbmFuY2UtYXVkaW8tcm9vbScpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zb3VuZCkge1xuICAgICAgICB0aGlzLnNvdW5kLnJlbW92ZSgpXG4gICAgICB9XG4gICAgICB0aGlzLmhhc0F1ZGlvID0gdHJ1ZVxuICAgICAgdGhpcy5zb3VuZCA9IGNoaWxkRWwuZWwuY29tcG9uZW50c1sncmVzb25hbmNlLWF1ZGlvLXNyYyddXG4gICAgfSlcblxuICAgIC8vIExvYWQgYW4gYXVkaW8gZmlsZSBpbnRvIHRoZSBBdWRpb0VsZW1lbnQuXG4gICAgdGhpcy5lbC5hdWRpb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCB0aGlzLnNvdW5kLmdldFNvdXJjZSgpKVxuICAgIC8vIEdlbmVyYXRlIGEgTWVkaWFFbGVtZW50U291cmNlIGZyb20gdGhlIEF1ZGlvRWxlbWVudC5cbiAgICBsZXQgYXVkaW9FbGVtZW50U291cmNlID0gdGhpcy5yZXNvbmFuY2VBdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKHRoaXMuZWwuYXVkaW9FbGVtZW50KVxuICAgIC8vIEFkZCB0aGUgTWVkaWFFbGVtZW50U291cmNlIHRvIHRoZSBzY2VuZSBhcyBhbiBhdWRpbyBpbnB1dCBzb3VyY2UuXG4gICAgbGV0IHNvdXJjZSA9IHRoaXMucmVzb25hbmNlQXVkaW9TY2VuZS5jcmVhdGVTb3VyY2UoKVxuICAgIGF1ZGlvRWxlbWVudFNvdXJjZS5jb25uZWN0KHNvdXJjZS5pbnB1dClcbiAgICAvLyBTZXQgcG9zaXRpb25cbiAgICB0aGlzLmVsLm9iamVjdDNELnVwZGF0ZU1hdHJpeFdvcmxkKClcbiAgICBzb3VyY2Uuc2V0RnJvbU1hdHJpeCh0aGlzLnNvdW5kLmdldE1hdHJpeFdvcmxkKCkpXG5cbiAgICAvLyBQbGF5IHRoZSBhdWRpby5cbiAgICBpZiAodGhpcy5zb3VuZC5kYXRhLmF1dG9wbGF5KSB7XG4gICAgICB0aGlzLmVsLmF1ZGlvRWxlbWVudC5wbGF5KClcbiAgICB9XG5cbiAgICAvLyBMb29waW5nXG4gICAgdGhpcy5lbC5hdWRpb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdsb29wJywgdGhpcy5zb3VuZC5kYXRhLmxvb3ApXG4gIH0sXG5cbiAgcmVtb3ZlICgpIHtcbiAgICB0aGlzLmVsLmF1ZGlvRWwucGF1c2UoKVxuICAgIHRoaXMuZWwuYXVkaW9FbCA9IG51bGxcbiAgfSxcblxuICBwYXVzZSAoKSB7XG4gICAgaWYgKHRoaXMuZWwuYXVkaW9FbCkge1xuICAgICAgdGhpcy5lbC5hdWRpb0VsLnBhdXNlKClcbiAgICB9XG4gIH0sXG5cbiAgcGxheSAoKSB7XG4gICAgaWYgKHRoaXMuZWwuYXVkaW9FbCAmJiB0aGlzLmVsLmF1ZGlvRWwucGF1c2VkKSB7XG4gICAgICB0aGlzLmVsLmF1ZGlvRWwucGxheSgpXG4gICAgfVxuICB9XG59KVxuXG5BRlJBTUUucmVnaXN0ZXJQcmltaXRpdmUoJ2EtcmVzb25hbmNlLWF1ZGlvLXJvb20nLCB7XG4gIG1hcHBpbmdzOiB7XG4gICAgd2lkdGg6ICdyZXNvbmFuY2UtYXVkaW8tcm9vbS53aWR0aCcsXG4gICAgaGVpZ2h0OiAncmVzb25hbmNlLWF1ZGlvLXJvb20uaGVpZ2h0JyxcbiAgICBkZXB0aDogJ3Jlc29uYW5jZS1hdWRpby1yb29tLmRlcHRoJyxcbiAgICAnYW1iaXNvbmljLW9yZGVyJzogJ3Jlc29uYW5jZS1hdWRpby1yb29tLmFtYmlzb25pY09yZGVyJyxcbiAgICAnc3BlZWQtb2Ytc291bmQnOiAncmVzb25hbmNlLWF1ZGlvLXJvb20uc3BlZWRPZlNvdW5kJyxcbiAgICBsZWZ0OiAncmVzb25hbmNlLWF1ZGlvLXJvb20ubGVmdCcsXG4gICAgcmlnaHQ6ICdyZXNvbmFuY2UtYXVkaW8tcm9vbS5yaWdodCcsXG4gICAgZnJvbnQ6ICdyZXNvbmFuY2UtYXVkaW8tcm9vbS5mcm9udCcsXG4gICAgYmFjazogJ3Jlc29uYW5jZS1hdWRpby1yb29tLmJhY2snLFxuICAgIGRvd246ICdyZXNvbmFuY2UtYXVkaW8tcm9vbS5kb3duJyxcbiAgICB1cDogJ3Jlc29uYW5jZS1hdWRpby1yb29tLnVwJ1xuICB9XG59KVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcmVzb25hbmNlLWF1ZGlvLXJvb20uanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL3Jlc29uYW5jZS1hdWRpby1yb29tLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGdsb2JhbCBBRlJBTUUgKi9cblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdyZXNvbmFuY2UtYXVkaW8tc3JjJywge1xuICBkZXBlbmRlbmNpZXM6IFsnZ2VvbWV0cnknLCAncG9zaXRpb24nXSxcbiAgLy8gVG8gZW5hYmxlIG11bHRpcGxlIGluc3RhbmNpbmcgb24geW91ciBjb21wb25lbnQsXG4gIC8vIHNldCBtdWx0aXBsZTogdHJ1ZSBpbiB0aGUgY29tcG9uZW50IGRlZmluaXRpb246XG4gIG11bHRpcGxlOiBmYWxzZSxcblxuICBzY2hlbWE6IHtcbiAgICBzcmM6IHt0eXBlOiAnYXNzZXQnfSxcbiAgICBsb29wOiB7dHlwZTogJ2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlfSxcbiAgICBhdXRvcGxheToge3R5cGU6ICdib29sZWFuJywgZGVmYXVsdDogdHJ1ZX1cbiAgfSxcbiAgaW5pdCAoKSB7XG4gICAgdGhpcy5wb3MgPSBuZXcgQUZSQU1FLlRIUkVFLlZlY3RvcjMoKVxuICB9LFxuICBnZXRTb3VyY2UgKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGEuc3JjXG4gIH0sXG4gIGdldE1hdHJpeFdvcmxkICgpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5vYmplY3QzRC5tYXRyaXhXb3JsZFxuICB9XG59KVxuXG5BRlJBTUUucmVnaXN0ZXJQcmltaXRpdmUoJ2EtcmVzb25hbmNlLWF1ZGlvLXNyYycsIHtcbiAgbWFwcGluZ3M6IHtcbiAgICBzcmM6ICdyZXNvbmFuY2UtYXVkaW8tc3JjLnNyYycsXG4gICAgbG9vcDogJ3Jlc29uYW5jZS1hdWRpby1zcmMubG9vcCcsXG4gICAgYXV0b3BsYXk6ICdyZXNvbmFuY2UtYXVkaW8tc3JjLmF1dG9wbGF5J1xuICB9XG59KVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcmVzb25hbmNlLWF1ZGlvLXNyYy5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvcmVzb25hbmNlLWF1ZGlvLXNyYy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIEEtRnJhbWUgUmVzb25hbmNlIEF1ZGlvIENvbXBvbmVudFxuICogQHR5cGUge1N0cmluZ31cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAnMC4xLjAnXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZXJzaW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy92ZXJzaW9uLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=