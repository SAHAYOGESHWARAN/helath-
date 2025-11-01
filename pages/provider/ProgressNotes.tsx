"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Card_1 = require("../../components/shared/Card");
var PageHeader_1 = require("../../components/shared/PageHeader");
var useAuth_1 = require("../../hooks/useAuth");
var Icons_1 = require("../../components/shared/Icons");
var GenerateNoteModal_1 = require("./GenerateNoteModal");
var App_1 = require("../../App");
var getStatusPill = function (status) {
    switch (status) {
        case 'Signed': return 'bg-emerald-100 text-emerald-800';
        case 'Pending Signature': return 'bg-yellow-100 text-yellow-800';
        case 'Draft': return 'bg-gray-100 text-gray-800';
    }
};
var ProgressNotes = function () {
    var _a = (0, useAuth_1.useAuth)(), progressNotes = _a.progressNotes, addProgressNote = _a.addProgressNote;
    var showToast = (0, App_1.useApp)().showToast;
    var _b = (0, react_1.useState)(progressNotes.length > 0 ? progressNotes.sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); })[0] : null), selectedNote = _b[0], setSelectedNote = _b[1];
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)(false), isAiModalOpen = _d[0], setIsAiModalOpen = _d[1];
    var filteredNotes = (0, react_1.useMemo)(function () {
        return progressNotes.filter(function (note) {
            return note.patientName.toLowerCase().includes(searchTerm.toLowerCase());
        }).sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
    }, [progressNotes, searchTerm]);
    var handleSaveNote = function (note) {
        addProgressNote(note);
        showToast("Draft note for ".concat(note.patientName, " has been saved."), 'success');
        setIsAiModalOpen(false);
    };
    return (<div>
            <PageHeader_1.default title="Progress Notes">
                <button onClick={function () { return setIsAiModalOpen(true); }} className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105 flex items-center">
                    <Icons_1.SparklesIcon className="w-5 h-5 mr-2" fill="currentColor"/>
                    <span>Generate with AI</span>
                </button>
            </PageHeader_1.default>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-14rem)]">
                <Card_1.default className="lg:col-span-1 p-0 flex flex-col">
                    <div className="p-4 border-b">
                        <input type="text" placeholder="Search notes..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="w-full px-4 py-2 border rounded-full bg-white focus:ring-2 focus:ring-primary-300"/>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredNotes.length > 0 ? (filteredNotes.map(function (note) { return (<div key={note.id} onClick={function () { return setSelectedNote(note); }} className={"p-4 border-b cursor-pointer ".concat((selectedNote === null || selectedNote === void 0 ? void 0 : selectedNote.id) === note.id ? 'bg-primary-50' : 'hover:bg-gray-50')}>
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800">{note.patientName}</p>
                                        <span className={"px-2 py-0.5 text-xs font-semibold rounded-full ".concat(getStatusPill(note.status))}>
                                            {note.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{note.date}</p>
                                </div>); })) : (<div className="p-4 text-center text-gray-500 text-sm h-full flex flex-col justify-center items-center">
                                <Icons_1.DocumentTextIcon className="w-12 h-12 text-gray-300 mb-2"/>
                                <p className="font-semibold">No Notes Found</p>
                                <p>Create a new note to get started.</p>
                            </div>)}
                    </div>
                </Card_1.default>

                <Card_1.default className="lg:col-span-2 flex flex-col">
                    {selectedNote ? (<div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedNote.patientName}</h2>
                                    <p className="text-gray-500">{selectedNote.date}</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-2">
                                <div>
                                    <h3 className="font-bold text-gray-700">Subjective</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.subjective}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-700">Objective</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.objective}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-700">Assessment</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.assessment}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-700">Plan</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.plan}</p>
                                </div>
                            </div>
                        </div>) : (<div className="text-center self-center">
                            <p className="text-gray-500">Select a note to view its details.</p>
                        </div>)}
                </Card_1.default>
            </div>
            <GenerateNoteModal_1.default isOpen={isAiModalOpen} onClose={function () { return setIsAiModalOpen(false); }} onSave={handleSaveNote}/>
        </div>);
};
exports.default = ProgressNotes;
