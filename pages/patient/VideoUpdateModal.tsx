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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Modal_1 = require("../../components/shared/Modal");
var Icons_1 = require("../../components/shared/Icons");
var VideoUpdateModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSend = _a.onSend;
    var _b = (0, react_1.useState)('idle'), recordingStatus = _b[0], setRecordingStatus = _b[1];
    var _c = (0, react_1.useState)(null), videoBlobUrl = _c[0], setVideoBlobUrl = _c[1];
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(0), countdown = _e[0], setCountdown = _e[1];
    var videoRef = (0, react_1.useRef)(null);
    var mediaStreamRef = (0, react_1.useRef)(null);
    var mediaRecorderRef = (0, react_1.useRef)(null);
    var recordedChunksRef = (0, react_1.useRef)([]);
    var countdownIntervalRef = (0, react_1.useRef)(null);
    var MAX_RECORDING_TIME = 30; // 30 seconds
    var cleanup = (0, react_1.useCallback)(function () {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(function (track) { return track.stop(); });
            mediaStreamRef.current = null;
        }
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current = null;
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
        recordedChunksRef.current = [];
        setVideoBlobUrl(null);
        setError(null);
        setRecordingStatus('idle');
        setCountdown(0);
    }, []);
    var setupMedia = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var stream, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cleanup();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true, audio: true })];
                case 2:
                    stream = _a.sent();
                    mediaStreamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play().catch(console.error);
                    }
                    setError(null);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error('Media access denied:', err_1);
                    setError('Camera and microphone access is required. Please enable permissions in your browser settings.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [cleanup]);
    (0, react_1.useEffect)(function () {
        if (isOpen && recordingStatus === 'idle') {
            setupMedia();
        }
        if (!isOpen) {
            cleanup();
        }
    }, [isOpen, recordingStatus, setupMedia, cleanup]);
    var handleStartRecording = function () {
        if (!mediaStreamRef.current)
            return;
        setRecordingStatus('recording');
        recordedChunksRef.current = [];
        var recorder = new MediaRecorder(mediaStreamRef.current);
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };
        recorder.onstop = function () {
            var blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            var url = URL.createObjectURL(blob);
            setVideoBlobUrl(url);
            setRecordingStatus('preview');
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(function (track) { return track.stop(); });
            }
        };
        recorder.start();
        setCountdown(MAX_RECORDING_TIME);
        countdownIntervalRef.current = window.setInterval(function () {
            setCountdown(function (prev) {
                if (prev <= 1) {
                    handleStopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    var handleStopRecording = function () {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
        setCountdown(0);
    };
    var handleRetake = function () {
        cleanup();
        setupMedia();
    };
    var handleSend = function () {
        if (videoBlobUrl) {
            onSend(videoBlobUrl);
        }
    };
    var renderContent = function () {
        if (error) {
            return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;
        }
        switch (recordingStatus) {
            case 'recording':
                return (<div className="relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-72 object-cover rounded-md bg-black"/>
            <div className="absolute top-2 right-2 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              REC {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
            </div>
             <div className="mt-4 flex justify-center">
              <button onClick={handleStopRecording} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2">
                <Icons_1.StopIcon className="w-5 h-5"/> Stop Recording
              </button>
            </div>
          </div>);
            case 'preview':
                return (<div>
            <video src={videoBlobUrl} controls autoPlay className="w-full h-72 object-cover rounded-md bg-black"/>
            <div className="mt-4 flex justify-between">
              <button onClick={handleRetake} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg flex items-center gap-2">
                <Icons_1.ArrowPathIcon className="w-5 h-5"/> Retake
              </button>
              <button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2">
                <Icons_1.PaperAirplaneIcon className="w-5 h-5"/> Send Update
              </button>
            </div>
          </div>);
            case 'idle':
            default:
                return (<div>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-72 object-cover rounded-md bg-black"/>
            <div className="mt-4 flex justify-center">
              <button onClick={handleStartRecording} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2">
                <Icons_1.CameraIcon className="w-5 h-5"/> Start Recording
              </button>
            </div>
             <p className="text-xs text-center text-gray-500 mt-2">Max recording time: {MAX_RECORDING_TIME} seconds</p>
          </div>);
        }
    };
    return (<Modal_1.default isOpen={isOpen} onClose={onClose} title="Record a Video Update">
      {renderContent()}
    </Modal_1.default>);
};
exports.default = VideoUpdateModal;
