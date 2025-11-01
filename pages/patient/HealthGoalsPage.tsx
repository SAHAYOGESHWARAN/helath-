"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useAuth_1 = require("../../hooks/useAuth");
var Card_1 = require("../../components/shared/Card");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Modal_1 = require("../../components/shared/Modal");
var formik_1 = require("formik");
var Yup = require("yup");
var Icons_1 = require("../../components/shared/Icons");
var App_1 = require("../../App");
var GoalSchema = Yup.object().shape({
    title: Yup.string().required('Goal title is required'),
    current: Yup.number().min(0, 'Current value cannot be negative').required('Current value is required'),
    target: Yup.number().positive('Target value must be positive').required('Target value is required'),
    unit: Yup.string().required('Unit is required'),
});
var GoalCard = function (_a) {
    var goal = _a.goal, onEdit = _a.onEdit, onDelete = _a.onDelete;
    var progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
    var isAchieved = goal.current >= goal.target;
    return (<Card_1.default className={"transition-all duration-300 ".concat(isAchieved ? 'bg-emerald-50 border-emerald-200 shadow-lg' : 'bg-white hover:shadow-md')}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{goal.title}</h3>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            {goal.current.toLocaleString()} / <span className="text-xl text-gray-500">{goal.target.toLocaleString()} {goal.unit}</span>
          </p>
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <button onClick={function () { return onEdit(goal); }} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full" aria-label={"Edit goal: ".concat(goal.title)}><Icons_1.PencilAltIcon className="w-5 h-5"/></button>
          <button onClick={function () { return onDelete(goal); }} className="p-2 text-red-500 hover:bg-red-100 rounded-full" aria-label={"Delete goal: ".concat(goal.title)}><Icons_1.TrashIcon className="w-5 h-5"/></button>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className={"h-4 rounded-full flex items-center justify-end px-2 text-white text-xs font-bold transition-all duration-500 ".concat(isAchieved ? 'bg-emerald-500' : 'bg-primary-600')} style={{ width: "".concat(progress, "%") }}>
            {progress > 15 && "".concat(progress.toFixed(0), "%")}
          </div>
        </div>
      </div>
      {isAchieved && (<div className="mt-3 flex items-center text-emerald-600 font-semibold text-sm">
          <Icons_1.CheckCircleIcon className="w-5 h-5 mr-2"/>
          Goal Achieved! Well done!
        </div>)}
    </Card_1.default>);
};
var HealthGoalsPage = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, addHealthGoal = _a.addHealthGoal, updateHealthGoal = _a.updateHealthGoal, deleteHealthGoal = _a.deleteHealthGoal;
    var showToast = (0, App_1.useApp)().showToast;
    var _b = (0, react_1.useState)(false), isModalOpen = _b[0], setIsModalOpen = _b[1];
    var _c = (0, react_1.useState)(null), editingGoal = _c[0], setEditingGoal = _c[1];
    var _d = (0, react_1.useState)(null), deletingGoal = _d[0], setDeletingGoal = _d[1];
    var goals = (0, react_1.useMemo)(function () { return (user === null || user === void 0 ? void 0 : user.healthGoals) || []; }, [user]);
    var handleOpenModal = function (goal) {
        if (goal === void 0) { goal = null; }
        setEditingGoal(goal);
        setIsModalOpen(true);
    };
    var handleCloseModal = function () {
        setEditingGoal(null);
        setIsModalOpen(false);
    };
    var handleSaveGoal = function (values) {
        if ('id' in values) {
            updateHealthGoal(values);
            showToast('Goal updated!', 'success');
        }
        else {
            addHealthGoal(values);
            showToast('New goal added!', 'success');
        }
        handleCloseModal();
    };
    var handleDelete = function (goal) {
        setDeletingGoal(goal);
    };
    var handleConfirmDelete = function () {
        if (deletingGoal) {
            deleteHealthGoal(deletingGoal.id);
            showToast('Goal deleted.', 'success');
            setDeletingGoal(null);
        }
    };
    return (<div>
            <PageHeader_1.default title="Health Goals" subtitle="Set targets and track your progress." buttonText="Add New Goal" onButtonClick={function () { return handleOpenModal(); }}/>

            {goals.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(function (goal) { return (<GoalCard key={goal.id} goal={goal} onEdit={handleOpenModal} onDelete={handleDelete}/>); })}
                </div>) : (<Card_1.default>
                    <div className="text-center py-12 text-gray-500">
                        <Icons_1.DumbbellIcon className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                        <h3 className="text-xl font-semibold text-gray-800">No Goals Set Yet</h3>
                        <p className="mt-2">Click "Add New Goal" to start tracking your progress.</p>
                    </div>
                </Card_1.default>)}

            <Modal_1.default isOpen={isModalOpen} onClose={handleCloseModal} title={editingGoal ? 'Edit Goal' : 'Add New Goal'}>
                <formik_1.Formik initialValues={editingGoal || { title: '', current: 0, target: 1, unit: '' }} validationSchema={GoalSchema} onSubmit={handleSaveGoal}>
                    {function (_a) {
            var isSubmitting = _a.isSubmitting, errors = _a.errors, touched = _a.touched;
            return (<formik_1.Form className="space-y-4">
                             <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Goal</label>
                                <formik_1.Field type="text" name="title" placeholder="e.g., Daily Steps" className={"w-full p-2 border rounded mt-1 ".concat(errors.title && touched.title ? 'border-red-500' : 'border-gray-300')}/>
                                <formik_1.ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1"/>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="current" className="block text-sm font-medium text-gray-700">Current Progress</label>
                                    <formik_1.Field type="number" name="current" className={"w-full p-2 border rounded mt-1 ".concat(errors.current && touched.current ? 'border-red-500' : 'border-gray-300')}/>
                                    <formik_1.ErrorMessage name="current" component="div" className="text-red-500 text-xs mt-1"/>
                                </div>
                                <div>
                                    <label htmlFor="target" className="block text-sm font-medium text-gray-700">Target Value</label>
                                    <formik_1.Field type="number" name="target" className={"w-full p-2 border rounded mt-1 ".concat(errors.target && touched.target ? 'border-red-500' : 'border-gray-300')}/>
                                     <formik_1.ErrorMessage name="target" component="div" className="text-red-500 text-xs mt-1"/>
                                </div>
                            </div>
                             <div>
                                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                                <formik_1.Field type="text" name="unit" placeholder="e.g., steps, lbs, minutes" className={"w-full p-2 border rounded mt-1 ".concat(errors.unit && touched.unit ? 'border-red-500' : 'border-gray-300')}/>
                                 <formik_1.ErrorMessage name="unit" component="div" className="text-red-500 text-xs mt-1"/>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">{editingGoal ? 'Save Changes' : 'Add Goal'}</button>
                            </div>
                        </formik_1.Form>);
        }}
                </formik_1.Formik>
            </Modal_1.default>

            <Modal_1.default isOpen={!!deletingGoal} onClose={function () { return setDeletingGoal(null); }} title="Confirm Deletion" size="sm" footer={<>
                        <button onClick={function () { return setDeletingGoal(null); }} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={handleConfirmDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
                    </>}>
                <p>Are you sure you want to delete the goal "<strong>{deletingGoal === null || deletingGoal === void 0 ? void 0 : deletingGoal.title}</strong>"? This action cannot be undone.</p>
            </Modal_1.default>
        </div>);
};
exports.default = HealthGoalsPage;
