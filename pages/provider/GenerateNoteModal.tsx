"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var genai_1 = require("@google/genai");
var Modal_1 = require("../../components/shared/Modal");
var useAuth_1 = require("../../hooks/useAuth");
var types_1 = require("../../types");
var Icons_1 = require("../../components/shared/Icons");
var App_1 = require("../../App");
var GenerateNoteModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave;
    var _b = (0, useAuth_1.useAuth)(), provider = _b.user, users = _b.users;
    var showToast = (0, App_1.useApp)().showToast;
    var _c = (0, react_1.useState)(''), transcript = _c[0], setTranscript = _c[1];
    var _d = (0, react_1.useState)(null), generatedNote = _d[0], setGeneratedNote = _d[1];
    var _e = (0, react_1.useState)(false), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)(''), selectedPatientId = _f[0], setSelectedPatientId = _f[1];
    var patients = (0, react_1.useMemo)(function () { return users.filter(function (u) { return u.role === types_1.UserRole.PATIENT; }); }, [users]);
    var handleGenerate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var ai, systemInstruction, result, noteText, parsedNote, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!transcript.trim() || !selectedPatientId) {
                        showToast('Please select a patient and provide a transcript.', 'error');
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    setGeneratedNote(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    ai = new genai_1.GoogleGenAI({ apiKey: process.env.API_KEY });
                    systemInstruction = "You are a medical scribe AI. Your task is to take a raw transcript of a patient-provider conversation and convert it into a structured SOAP note. The output must be in JSON format with four keys: 'subjective', 'objective', 'assessment', and 'plan'. Ensure the content is professional, concise, and accurately reflects the transcript.";
                    return [4 /*yield*/, ai.models.generateContent({
                            model: 'gemini-2.5-pro',
                            contents: "Transcript:\n".concat(transcript),
                            config: {
                                systemInstruction: systemInstruction,
                                responseMimeType: "application/json",
                                responseSchema: {
                                    type: 'OBJECT',
                                    properties: {
                                        subjective: { type: 'STRING', description: "Patient's subjective complaints, history of present illness, and review of systems as stated by the patient." },
                                        objective: { type: 'STRING', description: "Provider's objective findings from physical examination, vital signs, and test results mentioned in the transcript." },
                                        assessment: { type: 'STRING', description: "Provider's diagnosis or assessment of the patient's condition based on the subjective and objective information." },
                                        plan: { type: 'STRING', description: "The treatment plan, including medications, therapies, follow-up instructions, and patient education." }
                                    },
                                    required: ['subjective', 'objective', 'assessment', 'plan']
                                },
                            },
                        })];
                case 2:
                    result = _a.sent();
                    noteText = result.text.trim();
                    parsedNote = JSON.parse(noteText);
                    setGeneratedNote(parsedNote);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error generating SOAP note:", error_1);
                    showToast('Failed to generate note. The AI may not have been able to process the transcript. Please try again.', 'error');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSave = function () {
        var patient = patients.find(function (p) { return p.id === selectedPatientId; });
        if (!generatedNote || !patient || !provider)
            return;
        var newNote = {
            patientId: patient.id,
            patientName: patient.name,
            providerId: provider.id,
            date: new Date().toISOString().split('T')[0],
            status: 'Draft',
            content: generatedNote
        };
        onSave(newNote);
        handleClose();
    };
    var handleClose = function () {
        setTranscript('');
        setGeneratedNote(null);
        setSelectedPatientId('');
        setIsLoading(false);
        onClose();
    };
    var handleNoteChange = function (section, value) {
        setGeneratedNote(function (prev) {
            var _a;
            return prev ? __assign(__assign({}, prev), (_a = {}, _a[section] = value, _a)) : null;
        });
    };
    return (<Modal_1.default isOpen={isOpen} onClose={handleClose} title="Generate SOAP Note with AI" size="xl">
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                  <select value={selectedPatientId} onChange={function (e) { return setSelectedPatientId(e.target.value); }} className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500">
                      <option value="">-- Select a patient --</option>
                      {patients.map(function (p) { return <option key={p.id} value={p.id}>{p.name}</option>; })}
                  </select>
              </div>
              {!generatedNote && (<>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visit Transcript</label>
                      <textarea value={transcript} onChange={function (e) { return setTranscript(e.target.value); }} rows={10} placeholder="Paste or type the patient conversation transcript here..." className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500" disabled={isLoading}/>
                  </div>
                  <div className="text-right">
                      <button onClick={handleGenerate} disabled={isLoading || !transcript.trim() || !selectedPatientId} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg w-48 flex justify-center items-center disabled:bg-gray-400">
                          {isLoading ? <Icons_1.SpinnerIcon /> : 'Generate Note'}
                      </button>
                  </div>
                </>)}
              {isLoading && !generatedNote && (<div className="flex justify-center items-center p-8">
                    <Icons_1.SpinnerIcon className="w-8 h-8"/>
                    <p className="ml-3 text-gray-600">Generating SOAP note, please wait...</p>
                </div>)}
              {generatedNote && (<div className="space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-lg text-gray-800">Review and Edit Generated Note</h3>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Subjective</label>
                        <textarea value={generatedNote.subjective} onChange={function (e) { return handleNoteChange('subjective', e.target.value); }} rows={4} className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Objective</label>
                        <textarea value={generatedNote.objective} onChange={function (e) { return handleNoteChange('objective', e.target.value); }} rows={4} className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Assessment</label>
                        <textarea value={generatedNote.assessment} onChange={function (e) { return handleNoteChange('assessment', e.target.value); }} rows={3} className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Plan</label>
                        <textarea value={generatedNote.plan} onChange={function (e) { return handleNoteChange('plan', e.target.value); }} rows={4} className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                        <button onClick={function () { return setGeneratedNote(null); }} className="text-sm font-medium text-gray-600 hover:underline">← Back to Transcript</button>
                        <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg">Save as Draft</button>
                    </div>
                </div>)}
          </div>
      </Modal_1.default>);
};
exports.default = GenerateNoteModal;
