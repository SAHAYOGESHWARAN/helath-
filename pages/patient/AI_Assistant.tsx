"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var genai_1 = require("@google/genai");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
var Icons_1 = require("../../components/shared/Icons");
var SkeletonChatBubble_1 = require("../../components/shared/skeletons/SkeletonChatBubble");
var PageHeader_1 = require("../../components/shared/PageHeader");
var audioUtils_1 = require("../../services/audioUtils");
// --- Helper Functions ---
var fileToGenerativePart = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var base64EncodedDataPromise;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                base64EncodedDataPromise = new Promise(function (resolve) {
                    var reader = new FileReader();
                    reader.onloadend = function () { return resolve(reader.result.split(',')[1]); };
                    reader.readAsDataURL(file);
                });
                _a = {};
                _b = {};
                return [4 /*yield*/, base64EncodedDataPromise];
            case 1: return [2 /*return*/, (_a.inlineData = (_b.data = _c.sent(), _b.mimeType = file.type, _b),
                    _a)];
        }
    });
}); };
var createAudioBlob = function (data) {
    var l = data.length;
    var int16 = new Int16Array(l);
    for (var i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: (0, audioUtils_1.encode)(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
};
var AIAssistant = function () {
    var user = (0, useAuth_1.useAuth)().user;
    var _a = (0, react_1.useState)(''), prompt = _a[0], setPrompt = _a[1];
    var _b = (0, react_1.useState)([]), history = _b[0], setHistory = _b[1];
    var _c = (0, react_1.useState)([]), filesToUpload = _c[0], setFilesToUpload = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    var messagesEndRef = (0, react_1.useRef)(null);
    var ai = (0, react_1.useRef)(null);
    // --- Audio & Live Conversation State ---
    var _e = (0, react_1.useState)(false), isRecording = _e[0], setIsRecording = _e[1];
    var _f = (0, react_1.useState)(false), isLiveConversation = _f[0], setIsLiveConversation = _f[1];
    var mediaRecorderRef = (0, react_1.useRef)(null);
    var audioChunksRef = (0, react_1.useRef)([]);
    // Live API refs
    var sessionPromiseRef = (0, react_1.useRef)(null);
    var inputAudioContextRef = (0, react_1.useRef)(null);
    var outputAudioContextRef = (0, react_1.useRef)(null);
    var liveAudioStreamRef = (0, react_1.useRef)(null);
    var scriptProcessorRef = (0, react_1.useRef)(null);
    var liveSourcesRef = (0, react_1.useRef)(new Set());
    var nextStartTime = 0;
    (0, react_1.useEffect)(function () {
        ai.current = new genai_1.GoogleGenAI({ apiKey: process.env.API_KEY });
    }, []);
    (0, react_1.useEffect)(function () {
        if (user && history.length === 0) {
            setHistory([{ role: 'model', parts: [{ text: "Hello, ".concat(user.name, "! I am your AI Health Assistant. How can I help you with your health goals today?") }] }]);
        }
    }, [user, history.length]);
    var scrollToBottom = (0, react_1.useCallback)(function () {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, []);
    (0, react_1.useEffect)(scrollToBottom, [history, loading]);
    var handleSendMessage = function () { return __awaiter(void 0, void 0, void 0, function () {
        var mediaParts, textPart, userParts, userMessage, currentHistory, modelToUse, resultStream, fullText_1, _a, resultStream_1, resultStream_1_1, chunk, chunkText, e_1_1, error_1;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if ((!prompt.trim() && filesToUpload.length === 0) || loading || !ai.current || !user)
                        return [2 /*return*/];
                    setLoading(true);
                    return [4 /*yield*/, Promise.all(filesToUpload.map(function (file) { return fileToGenerativePart(file); }))];
                case 1:
                    mediaParts = _e.sent();
                    textPart = { text: prompt };
                    userParts = __spreadArray(__spreadArray([], mediaParts, true), [textPart], false);
                    userMessage = { role: 'user', parts: userParts };
                    currentHistory = history.map(function (h) { return ({ role: h.role, parts: h.parts }); });
                    setHistory(function (prev) { return __spreadArray(__spreadArray([], prev, true), [userMessage], false); });
                    setPrompt('');
                    setFilesToUpload([]);
                    modelToUse = filesToUpload.some(function (f) { return f.type.startsWith('video/'); })
                        ? 'gemini-2.5-pro'
                        : filesToUpload.some(function (f) { return f.type.startsWith('image/'); })
                            // FIX: Use the correct model name for gemini-pro-vision, which is now gemini-2.5-flash for this use case.
                            ? 'gemini-2.5-flash'
                            // FIX: Use the correct model name for gemini flash lite.
                            : 'gemini-flash-lite-latest';
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 16, 17, 18]);
                    setHistory(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{ role: 'model', parts: [{ text: '' }] }], false); });
                    return [4 /*yield*/, ai.current.models.generateContentStream({
                            model: modelToUse,
                            contents: __spreadArray(__spreadArray([], currentHistory, true), [{ role: 'user', parts: userParts }], false),
                        })];
                case 3:
                    resultStream = _e.sent();
                    fullText_1 = '';
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 9, 10, 15]);
                    _a = true, resultStream_1 = __asyncValues(resultStream);
                    _e.label = 5;
                case 5: return [4 /*yield*/, resultStream_1.next()];
                case 6:
                    if (!(resultStream_1_1 = _e.sent(), _b = resultStream_1_1.done, !_b)) return [3 /*break*/, 8];
                    _d = resultStream_1_1.value;
                    _a = false;
                    chunk = _d;
                    chunkText = chunk.text;
                    if (chunkText) {
                        fullText_1 += chunkText;
                        setHistory(function (prev) {
                            var newHistory = __spreadArray([], prev, true);
                            var lastMessage = newHistory[newHistory.length - 1];
                            if (lastMessage.role === 'model') {
                                lastMessage.parts = [{ text: fullText_1 }];
                            }
                            return newHistory;
                        });
                    }
                    _e.label = 7;
                case 7:
                    _a = true;
                    return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 15];
                case 9:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 15];
                case 10:
                    _e.trys.push([10, , 13, 14]);
                    if (!(!_a && !_b && (_c = resultStream_1.return))) return [3 /*break*/, 12];
                    return [4 /*yield*/, _c.call(resultStream_1)];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 14: return [7 /*endfinally*/];
                case 15: return [3 /*break*/, 18];
                case 16:
                    error_1 = _e.sent();
                    console.error("Error generating content:", error_1);
                    setHistory(function (prev) { return __spreadArray(__spreadArray([], prev.slice(0, -1), true), [{ role: 'model', parts: [{ text: "I'm sorry, I encountered an error. Please try again." }] }], false); });
                    return [3 /*break*/, 18];
                case 17:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    }); };
    var handleFileChange = function (event) {
        if (event.target.files) {
            setFilesToUpload(function (prev) { return __spreadArray(__spreadArray([], prev, true), Array.from(event.target.files), true); });
        }
    };
    var handleToggleRecording = function () { return __awaiter(void 0, void 0, void 0, function () {
        var stream_1, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isRecording) return [3 /*break*/, 1];
                    (_a = mediaRecorderRef.current) === null || _a === void 0 ? void 0 : _a.stop();
                    setIsRecording(false);
                    return [3 /*break*/, 4];
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 2:
                    stream_1 = _b.sent();
                    mediaRecorderRef.current = new MediaRecorder(stream_1);
                    audioChunksRef.current = [];
                    mediaRecorderRef.current.ondataavailable = function (event) {
                        audioChunksRef.current.push(event.data);
                    };
                    mediaRecorderRef.current.onstop = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var audioBlob, audioFile, audioPart, transcriptionPrompt, result, text;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                                    audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" });
                                    stream_1.getTracks().forEach(function (track) { return track.stop(); });
                                    setLoading(true);
                                    return [4 /*yield*/, fileToGenerativePart(audioFile)];
                                case 1:
                                    audioPart = _a.sent();
                                    transcriptionPrompt = "Transcribe this audio.";
                                    return [4 /*yield*/, ai.current.models.generateContent({
                                            model: 'gemini-2.5-flash',
                                            contents: [{ role: "user", parts: [audioPart, { text: transcriptionPrompt }] }],
                                        })];
                                case 2:
                                    result = _a.sent();
                                    text = result.text;
                                    setPrompt(function (prev) { return prev + ' ' + text; });
                                    setLoading(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    mediaRecorderRef.current.start();
                    setIsRecording(true);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    console.error("Microphone access denied:", err_1);
                    alert("Microphone access is required for this feature.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleLiveConversation = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var stream, chat_1, source, scriptProcessor, e_2;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (isLiveConversation) {
                        setIsLiveConversation(false);
                        (_a = scriptProcessorRef.current) === null || _a === void 0 ? void 0 : _a.disconnect();
                        (_b = inputAudioContextRef.current) === null || _b === void 0 ? void 0 : _b.close();
                        (_c = outputAudioContextRef.current) === null || _c === void 0 ? void 0 : _c.close();
                        (_d = liveAudioStreamRef.current) === null || _d === void 0 ? void 0 : _d.getTracks().forEach(function (track) { return track.stop(); });
                        nextStartTime = 0;
                        liveSourcesRef.current.clear();
                        return [2 /*return*/];
                    }
                    setIsLiveConversation(true);
                    if (!ai.current)
                        return [2 /*return*/];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    inputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                    outputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 2:
                    stream = _e.sent();
                    liveAudioStreamRef.current = stream;
                    chat_1 = ai.current.chats.create({
                        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                        history: [],
                    });
                    sessionPromiseRef.current = chat_1;
                    source = inputAudioContextRef.current.createMediaStreamSource(stream);
                    scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;
                    scriptProcessor.onaudioprocess = function (audioProcessingEvent) { return __awaiter(void 0, void 0, void 0, function () {
                        var inputData, pcmBlob, result, _loop_1, _a, result_1, result_1_1, e_3_1;
                        var _b, e_3, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                                    pcmBlob = createAudioBlob(inputData);
                                    return [4 /*yield*/, chat_1.sendMessageStream({
                                            message: [{
                                                    inlineData: {
                                                        mimeType: pcmBlob.mimeType,
                                                        data: pcmBlob.data
                                                    }
                                                }]
                                        })];
                                case 1:
                                    result = _e.sent();
                                    _e.label = 2;
                                case 2:
                                    _e.trys.push([2, 8, 9, 14]);
                                    _loop_1 = function () {
                                        var chunk, audioData, audioBuffer, source_1;
                                        return __generator(this, function (_f) {
                                            switch (_f.label) {
                                                case 0:
                                                    _d = result_1_1.value;
                                                    _a = false;
                                                    chunk = _d;
                                                    audioData = chunk.candidates[0].content.parts[0].inlineData.data;
                                                    if (!(audioData && outputAudioContextRef.current)) return [3 /*break*/, 2];
                                                    nextStartTime = Math.max(nextStartTime, outputAudioContextRef.current.currentTime);
                                                    return [4 /*yield*/, (0, audioUtils_1.decodeAudioData)((0, audioUtils_1.decode)(audioData), outputAudioContextRef.current, 24000, 1)];
                                                case 1:
                                                    audioBuffer = _f.sent();
                                                    source_1 = outputAudioContextRef.current.createBufferSource();
                                                    source_1.buffer = audioBuffer;
                                                    source_1.connect(outputAudioContextRef.current.destination);
                                                    source_1.addEventListener('ended', function () { return liveSourcesRef.current.delete(source_1); });
                                                    source_1.start(nextStartTime);
                                                    nextStartTime += audioBuffer.duration;
                                                    liveSourcesRef.current.add(source_1);
                                                    _f.label = 2;
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a = true, result_1 = __asyncValues(result);
                                    _e.label = 3;
                                case 3: return [4 /*yield*/, result_1.next()];
                                case 4:
                                    if (!(result_1_1 = _e.sent(), _b = result_1_1.done, !_b)) return [3 /*break*/, 7];
                                    return [5 /*yield**/, _loop_1()];
                                case 5:
                                    _e.sent();
                                    _e.label = 6;
                                case 6:
                                    _a = true;
                                    return [3 /*break*/, 3];
                                case 7: return [3 /*break*/, 14];
                                case 8:
                                    e_3_1 = _e.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 14];
                                case 9:
                                    _e.trys.push([9, , 12, 13]);
                                    if (!(!_a && !_b && (_c = result_1.return))) return [3 /*break*/, 11];
                                    return [4 /*yield*/, _c.call(result_1)];
                                case 10:
                                    _e.sent();
                                    _e.label = 11;
                                case 11: return [3 /*break*/, 13];
                                case 12:
                                    if (e_3) throw e_3.error;
                                    return [7 /*endfinally*/];
                                case 13: return [7 /*endfinally*/];
                                case 14: return [2 /*return*/];
                            }
                        });
                    }); };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current.destination);
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _e.sent();
                    console.error("Failed to start live conversation", e_2);
                    setIsLiveConversation(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [isLiveConversation]);
    var renderPart = function (part, index) {
        var _a, _b;
        if ('text' in part) {
            return <p key={index} className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{part.text}</p>;
        }
        if ((_a = part.inlineData) === null || _a === void 0 ? void 0 : _a.mimeType.startsWith('image/')) {
            return <img key={index} src={"data:".concat(part.inlineData.mimeType, ";base64,").concat(part.inlineData.data)} alt="user upload" className="rounded-lg max-w-xs mt-2"/>;
        }
        if ((_b = part.inlineData) === null || _b === void 0 ? void 0 : _b.mimeType.startsWith('video/')) {
            return <video key={index} src={"data:".concat(part.inlineData.mimeType, ";base64,").concat(part.inlineData.data)} controls className="rounded-lg max-w-xs mt-2"/>;
        }
        return null;
    };
    return (<div className="flex flex-col h-full">
      <PageHeader_1.default title="AI Assistant & Gemini Lab" subtitle="Your multimodal guide to a healthier lifestyle."/>

      <Card_1.default className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {history.map(function (msg, index) { return (<div key={index} className={"flex items-start gap-3 animate-fade-in-up ".concat(msg.role === 'user' ? 'justify-end' : '')} style={{ animationDelay: "".concat(index * 50, "ms") }}>
              {msg.role === 'model' && <div className={"w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 bg-primary-500"}><Icons_1.SparklesIcon className="w-5 h-5"/></div>}
              <div className="flex-1 max-w-xl">
                <div className={"p-3 rounded-lg shadow-sm ".concat(msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800')}>
                  {msg.parts.map(renderPart)}
                </div>
              </div>
              {msg.role === 'user' && <img src={user === null || user === void 0 ? void 0 : user.avatarUrl} alt="user avatar" className="w-8 h-8 rounded-full flex-shrink-0"/>}
            </div>); })}
          {loading && <SkeletonChatBubble_1.default />}
          <div ref={messagesEndRef}/>
        </div>

        {isLiveConversation && (<div className="p-4 border-t bg-gray-100 text-center animate-fade-in">
                <Icons_1.SpeakerWaveIcon className="w-8 h-8 text-primary-600 mx-auto animate-pulse"/>
                <p className="font-semibold text-gray-700 mt-2">Live conversation is active...</p>
                <button onClick={handleToggleLiveConversation} className="mt-2 text-sm text-red-500 font-semibold hover:underline">End Conversation</button>
            </div>)}

        <div className="border-t p-4 bg-white rounded-b-xl">
          {filesToUpload.length > 0 && (<div className="mb-2 flex flex-wrap gap-2">
              {filesToUpload.map(function (file, i) { return (<div key={i} className="bg-gray-100 p-1 rounded-md text-xs flex items-center gap-2">
                  <span>{file.name}</span>
                  <button onClick={function () { return setFilesToUpload(function (f) { return f.filter(function (fl) { return fl !== file; }); }); }} className="text-gray-500 hover:text-red-500">
                    &times;
                  </button>
                </div>); })}
            </div>)}
          <form onSubmit={function (e) { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
            <label htmlFor="file-upload" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer">
              <Icons_1.PaperClipIcon className="w-6 h-6"/>
              <input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*,video/*"/>
            </label>
            <button type="button" onClick={handleToggleRecording} className={"p-2 rounded-full transition-colors ".concat(isRecording ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100')}>
              {isRecording ? <Icons_1.StopIcon className="w-6 h-6"/> : <Icons_1.MicrophoneIcon className="w-6 h-6"/>}
            </button>
            <input type="text" value={prompt} onChange={function (e) { return setPrompt(e.target.value); }} placeholder="Ask a question, or attach a file..." className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading || isLiveConversation}/>
            <button type="button" onClick={handleToggleLiveConversation} className={"p-2 rounded-full transition-colors ".concat(isLiveConversation ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100')}>
              <Icons_1.SpeakerWaveIcon className="w-6 h-6"/>
            </button>
            <button type="submit" disabled={loading || (!prompt.trim() && filesToUpload.length === 0)} className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
            </button>
          </form>
        </div>
      </Card_1.default>
    </div>);
};
exports.default = AIAssistant;
