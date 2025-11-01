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
var Card_1 = require("../../components/shared/Card");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Icons_1 = require("../../components/shared/Icons");
var Icons_2 = require("../../components/shared/Icons");
var useAuth_1 = require("../../hooks/useAuth");
var react_router_dom_1 = require("react-router-dom");
var VideoConsults = function () {
    var _a;
    var user = (0, useAuth_1.useAuth)().user;
    var _b = (0, react_1.useState)('checking'), cameraStatus = _b[0], setCameraStatus = _b[1];
    var _c = (0, react_1.useState)('checking'), micStatus = _c[0], setMicStatus = _c[1];
    var _d = (0, react_1.useState)(false), inCall = _d[0], setInCall = _d[1];
    var videoRef = (0, react_1.useRef)(null);
    var _e = (0, react_1.useState)(null), stream = _e[0], setStream = _e[1];
    var _f = (0, react_1.useState)(false), isMicMuted = _f[0], setIsMicMuted = _f[1];
    var _g = (0, react_1.useState)(false), isCamOff = _g[0], setIsCamOff = _g[1];
    var isSubscribed = ((_a = user === null || user === void 0 ? void 0 : user.subscription) === null || _a === void 0 ? void 0 : _a.status) === 'Active';
    var setupMedia = function () { return __awaiter(void 0, void 0, void 0, function () {
        var mediaStream, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true, audio: true })];
                case 1:
                    mediaStream = _a.sent();
                    setCameraStatus('ok');
                    setMicStatus('ok');
                    setStream(mediaStream);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    setCameraStatus('error');
                    setMicStatus('error');
                    console.error("Media access denied:", err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        if (inCall && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        return function () {
            if (!inCall) {
                stream === null || stream === void 0 ? void 0 : stream.getTracks().forEach(function (track) { return track.stop(); });
                setStream(null);
            }
        };
    }, [inCall, stream]);
    (0, react_1.useEffect)(function () {
        setupMedia();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var handleJoinCall = function () {
        if (cameraStatus === 'ok' && micStatus === 'ok') {
            setInCall(true);
        }
        else {
            alert('Please fix camera and microphone issues before joining.');
        }
    };
    var handleEndCall = function () {
        setInCall(false);
        setIsCamOff(false);
        setIsMicMuted(false);
        // Re-run setup to get permissions and preview for next time
        setupMedia();
    };
    var toggleMic = function () {
        stream === null || stream === void 0 ? void 0 : stream.getAudioTracks().forEach(function (track) { return track.enabled = !track.enabled; });
        setIsMicMuted(function (prev) { return !prev; });
    };
    var toggleCam = function () {
        stream === null || stream === void 0 ? void 0 : stream.getVideoTracks().forEach(function (track) { return track.enabled = !track.enabled; });
        setIsCamOff(function (prev) { return !prev; });
    };
    if (inCall) {
        return (<div className="bg-gray-900 rounded-lg p-4 h-[calc(100vh-10rem)] flex flex-col relative text-white animate-fade-in">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    {/* Remote Video (Placeholder) */}
                    <div className="bg-black rounded-md flex items-center justify-center">
                        <p className="text-gray-400">Waiting for provider...</p>
                    </div>
                    {/* Local Video */}
                    <div className="bg-black rounded-md flex items-center justify-center relative md:absolute md:bottom-4 md:right-4 md:w-1/4 md:h-1/4">
                        <video ref={videoRef} autoPlay playsInline muted className={"w-full h-full object-cover rounded-md ".concat(isCamOff ? 'hidden' : '')}/>
                        {isCamOff && <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold">{user === null || user === void 0 ? void 0 : user.name[0]}</div>}
                    </div>
                </div>
                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4 p-3 bg-gray-800/70 rounded-full backdrop-blur-sm">
                    <button onClick={toggleMic} className={"p-3 rounded-full ".concat(isMicMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500')}><Icons_2.MicrophoneIcon className="w-6 h-6"/></button>
                    <button onClick={toggleCam} className={"p-3 rounded-full ".concat(isCamOff ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500')}><Icons_1.VideoCameraIcon className="w-6 h-6"/></button>
                    <button onClick={handleEndCall} className="p-3 rounded-full bg-red-600 hover:bg-red-700"><Icons_1.PhoneIcon className="w-6 h-6 rotate-[135deg]"/></button>
                </div>
            </div>);
    }
    return (<div>
            <PageHeader_1.default title="Video Consultations" subtitle="Connect with your provider from anywhere."/>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card_1.default title="Consultation Room">
                    <div className="space-y-4">
                        <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                            <h3 className="text-xl font-bold text-primary-700">Your virtual visit is ready.</h3>
                            <p className="text-gray-600 mt-1">When it's time for your appointment, click the button below to join the secure session.</p>
                        </div>

                        <div>
                             <p className="font-semibold text-gray-700 mb-2">Status</p>
                             <div className={"p-3 rounded-lg flex items-center ".concat(isSubscribed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                                <Icons_1.ShieldCheckIcon className="w-5 h-5 mr-3"/>
                                <span className="text-sm font-medium">{isSubscribed ? 'Subscription Active: You can join consultations.' : 'Subscription Required to Join Calls'}</span>
                             </div>
                        </div>

                        <div className="pt-4 border-t">
                            <button disabled={!isSubscribed || cameraStatus !== 'ok' || micStatus !== 'ok'} onClick={handleJoinCall} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-all transform hover:scale-105 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none">
                                <Icons_1.VideoCameraIcon className="w-5 h-5"/>
                                <span>Join Consultation</span>
                            </button>
                             {!isSubscribed && (<p className="text-center text-sm text-gray-600 mt-3">
                                    Please <react_router_dom_1.Link to="/subscription" className="font-semibold text-primary-600 hover:underline">subscribe to a plan</react_router_dom_1.Link> to enable video consultations.
                                </p>)}
                        </div>
                    </div>
                </Card_1.default>

                <Card_1.default title="System Check">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div className="flex items-center"><Icons_1.VideoCameraIcon className="w-6 h-6 text-gray-500 mr-3"/><span className="font-medium text-gray-700">Camera</span></div>
                            {cameraStatus === 'ok' ? <Icons_1.CheckCircleIcon className="w-6 h-6 text-emerald-500"/> : <Icons_1.XCircleIcon className="w-6 h-6 text-red-500"/>}
                        </div>
                         <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div className="flex items-center"><Icons_2.MicrophoneIcon className="w-6 h-6 text-gray-500 mr-3"/><span className="font-medium text-gray-700">Microphone</span></div>
                            {micStatus === 'ok' ? <Icons_1.CheckCircleIcon className="w-6 h-6 text-emerald-500"/> : <Icons_1.XCircleIcon className="w-6 h-6 text-red-500"/>}
                        </div>
                         <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div className="flex items-center"><Icons_2.SpeakerWaveIcon className="w-6 h-6 text-gray-500 mr-3"/><span className="font-medium text-gray-700">Speakers</span></div>
                            <Icons_1.CheckCircleIcon className="w-6 h-6 text-emerald-500"/>
                        </div>
                    </div>
                    <div className="mt-4 p-2 border rounded-md bg-gray-100 h-32">
                        {cameraStatus === 'ok' ? (<video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-md"/>) : (<div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                                {cameraStatus === 'checking' ? 'Checking camera...' : 'Camera preview unavailable'}
                            </div>)}
                    </div>
                </Card_1.default>
            </div>
             <Card_1.default title="Tips for a Successful Consultation" className="mt-8">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Find a quiet, well-lit space to avoid distractions.</li>
                    <li>Ensure you have a stable internet connection.</li>
                    <li>Write down any questions or concerns you want to discuss beforehand.</li>
                    <li>Close other applications on your device that might use your camera or microphone.</li>
                </ul>
            </Card_1.default>
        </div>);
};
exports.default = VideoConsults;
