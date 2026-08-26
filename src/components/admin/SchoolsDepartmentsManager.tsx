import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { SchoolInfo, DepartmentInfo, FacultyMember, ProgrammeItem } from '../../types';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  Award, 
  Mail, 
  Phone, 
  DollarSign, 
  Clock, 
  Search 
} from 'lucide-react';

export const SchoolsDepartmentsManager: React.FC = () => {
  const { 
    schools, 
    saveSchool, 
    deleteSchool, 
    saveDepartment, 
    deleteDepartment, 
    saveFacultyMember, 
    deleteFacultyMember, 
    saveProgramme, 
    deleteProgramme 
  } = useAppStore();

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || '');
  const [selectedDeptId, setSelectedDeptId] = useState<string>(schools[0]?.departments[0]?.id || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal / Form states
  const [modalType, setModalType] = useState<
    'NONE' | 'EDIT_SCHOOL' | 'ADD_SCHOOL' | 'EDIT_DEPT' | 'ADD_DEPT' | 'EDIT_FACULTY' | 'ADD_FACULTY' | 'EDIT_PROG' | 'ADD_PROG'
  >('NONE');

  // School Form State
  const [schoolName, setSchoolName] = useState('');
  const [schoolDean, setSchoolDean] = useState('');
  const [schoolDesc, setSchoolDesc] = useState('');
  const [schoolIcon, setSchoolIcon] = useState('BookOpen');

  // Dept Form State
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHead, setDeptHead] = useState('');
  const [deptEmail, setDeptEmail] = useState('');
  const [deptPhone, setDeptPhone] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  // Faculty Form State
  const [facultyId, setFacultyId] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [facultyDesig, setFacultyDesig] = useState('');
  const [facultyQual, setFacultyQual] = useState('');
  const [facultySpec, setFacultySpec] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPhone, setFacultyPhone] = useState('');

  // Programme Form State
  const [progCode, setProgCode] = useState('');
  const [progName, setProgName] = useState('');
  const [progLevel, setProgLevel] = useState<'UG' | 'PG' | 'Diploma' | 'Doctoral'>('PG');
  const [progDuration, setProgDuration] = useState('2 Years (4 Semesters)');
  const [progIntake, setProgIntake] = useState(40);
  const [progEligibility, setProgEligibility] = useState('');
  const [progFee, setProgFee] = useState(12500);

  const activeSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];
  const activeDept = activeSchool?.departments.find((d) => d.id === selectedDeptId) || activeSchool?.departments[0];

  const handleOpenAddSchool = () => {
    setSchoolName('');
    setSchoolDean('');
    setSchoolDesc('');
    setSchoolIcon('GraduationCap');
    setModalType('ADD_SCHOOL');
  };

  const handleOpenEditSchool = (s: SchoolInfo) => {
    setSchoolName(s.name);
    setSchoolDean(s.dean || '');
    setSchoolDesc(s.description || '');
    setSchoolIcon(s.icon || 'GraduationCap');
    setModalType('EDIT_SCHOOL');
  };

  const handleSaveSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName) return;

    if (modalType === 'EDIT_SCHOOL' && activeSchool) {
      await saveSchool({
        ...activeSchool,
        name: schoolName,
        dean: schoolDean,
        description: schoolDesc,
        icon: schoolIcon,
      });
      setFeedback(`School updated.`);
    } else {
      const newId = `sch-${Date.now()}`;
      const newSchool: SchoolInfo = {
        id: newId,
        name: schoolName,
        dean: schoolDean,
        description: schoolDesc,
        icon: schoolIcon,
        departments: [],
      };
      await saveSchool(newSchool);
      setSelectedSchoolId(newId);
      setFeedback(`New school established.`);
    }
    setModalType('NONE');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenAddDept = () => {
    setDeptName('');
    setDeptCode(`DEPT-${Math.floor(100 + Math.random() * 900)}`);
    setDeptHead('');
    setDeptEmail('');
    setDeptPhone('');
    setDeptDesc('');
    setModalType('ADD_DEPT');
  };

  const handleOpenEditDept = (d: DepartmentInfo) => {
    setDeptName(d.name);
    setDeptCode(d.code);
    setDeptHead(d.head);
    setDeptEmail(d.email || '');
    setDeptPhone(d.phone || '');
    setDeptDesc(d.description || '');
    setModalType('EDIT_DEPT');
  };

  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !selectedSchoolId) return;

    if (modalType === 'EDIT_DEPT' && activeDept) {
      await saveDepartment(selectedSchoolId, {
        ...activeDept,
        name: deptName,
        code: deptCode,
        head: deptHead,
        email: deptEmail,
        phone: deptPhone,
        description: deptDesc,
      });
      setFeedback(`Department updated.`);
    } else {
      const newDeptId = `dept-${Date.now()}`;
      const newDept: DepartmentInfo = {
        id: newDeptId,
        name: deptName,
        code: deptCode || `DEPT-${Date.now().toString().slice(-4)}`,
        head: deptHead || 'Head of Department',
        email: deptEmail || 'hod@ruraluniv.ac.in',
        phone: deptPhone || '+91 451 245 2371',
        description: deptDesc,
        programmes: [],
        faculty: [],
        researchAreas: ['Rural Innovation', 'Interdisciplinary Studies'],
      };
      await saveDepartment(selectedSchoolId, newDept);
      setSelectedDeptId(newDeptId);
      setFeedback(`Department created.`);
    }
    setModalType('NONE');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenAddFaculty = () => {
    setFacultyId(`FAC-${Date.now()}`);
    setFacultyName('');
    setFacultyDesig('Assistant Professor');
    setFacultyQual('Ph.D.');
    setFacultySpec('');
    setFacultyEmail('');
    setFacultyPhone('+91 ');
    setModalType('ADD_FACULTY');
  };

  const handleOpenEditFaculty = (f: FacultyMember) => {
    setFacultyId(f.id);
    setFacultyName(f.name);
    setFacultyDesig(f.designation);
    setFacultyQual(f.qualification);
    setFacultySpec(f.specialization);
    setFacultyEmail(f.email);
    setFacultyPhone(f.phone || '');
    setModalType('EDIT_FACULTY');
  };

  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName || !selectedSchoolId || !activeDept) return;

    const facultyObj: FacultyMember = {
      id: facultyId || `fac-${Date.now()}`,
      name: facultyName,
      designation: facultyDesig,
      qualification: facultyQual,
      specialization: facultySpec,
      email: facultyEmail,
      phone: facultyPhone,
    };

    await saveFacultyMember(selectedSchoolId, activeDept.id, facultyObj);
    setFeedback(`Faculty profile saved.`);
    setModalType('NONE');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenAddProgramme = () => {
    setProgCode(`PRG-${Math.floor(100 + Math.random() * 900)}`);
    setProgName('');
    setProgLevel('PG');
    setProgDuration('2 Years (4 Semesters)');
    setProgIntake(40);
    setProgEligibility('Bachelor degree in relevant discipline with minimum 55% marks.');
    setProgFee(12500);
    setModalType('ADD_PROG');
  };

  const handleOpenEditProgramme = (p: ProgrammeItem) => {
    setProgCode(p.id);
    setProgName(p.name);
    setProgLevel(p.level);
    setProgDuration(p.duration);
    setProgIntake(p.intake);
    setProgEligibility(p.eligibility);
    setProgFee(p.feesPerSem || 12000);
    setModalType('EDIT_PROG');
  };

  const handleSaveProgramme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progName || !selectedSchoolId || !activeDept) return;

    const progObj: ProgrammeItem = {
      code: progCode,
      name: progName,
      level: progLevel,
      duration: progDuration,
      intake: Number(progIntake) || 40,
      eligibility: progEligibility,
      feePerSemester: Number(progFee) || 12000,
    };

    await saveProgramme(selectedSchoolId, activeDept.id, progObj);
    setFeedback(`Programme saved.`);
    setModalType('NONE');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Alert */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-600/60 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Academic Hierarchy Control: Schools, Departments, Faculty & Programmes
          </h2>
          <p className="text-xs text-slate-400">
            Real-time management of GRI's 8+ Schools, 28+ Departments, Faculty Profiles, Degrees, and Curricula.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddSchool}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add School</span>
          </button>

          <button
            onClick={handleOpenAddDept}
            disabled={!selectedSchoolId}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-900/30 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Navigation & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Schools & Departments Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Schools of Study ({schools.length})</h3>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {schools.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSchoolId(s.id);
                    if (s.departments.length > 0) setSelectedDeptId(s.departments[0].id);
                  }}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    selectedSchoolId === s.id
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="truncate flex-1">
                    <div>{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{s.departments.length} Departments</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Departments Under Active School */}
          {activeSchool && (
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Departments ({activeSchool.departments.length})
                </h3>
                <button
                  onClick={() => handleOpenEditSchool(activeSchool)}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit School</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {activeSchool.departments.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDeptId(d.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                      selectedDeptId === d.id
                        ? 'bg-indigo-950/60 border-indigo-500/50 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="truncate flex-1">
                      <div>{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {d.faculty.length} Faculty • {d.programmes.length} Programmes
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Selected Department Detailed Manager */}
        <div className="lg:col-span-8 space-y-6">
          {activeDept ? (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
              {/* Dept Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                      {activeDept.code}
                    </span>
                    <span className="text-xs text-slate-400">School: {activeSchool?.name}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white font-display mt-1">{activeDept.name}</h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{activeDept.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-3">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      HoD: <strong>{activeDept.head}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      <strong>{activeDept.email}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <strong>{activeDept.phone}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEditDept(activeDept)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    title="Edit Department"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm(`Delete department ${activeDept.name}?`)) {
                        await deleteDepartment(selectedSchoolId, activeDept.id);
                        setFeedback(`Department deleted.`);
                        setTimeout(() => setFeedback(null), 3000);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                    title="Delete Department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Faculty Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Faculty Directory ({activeDept.faculty.length})
                  </h3>
                  <button
                    onClick={handleOpenAddFaculty}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Faculty Profile</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {activeDept.faculty.map((f) => (
                    <div key={f.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 relative group">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-white text-xs">{f.name}</div>
                          <div className="text-[11px] text-emerald-400">{f.designation} • {f.qualification}</div>
                        </div>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleOpenEditFaculty(f)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteFacultyMember(selectedSchoolId, activeDept.id, f.id)}
                            className="p-1 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 line-clamp-1">Specialization: {f.specialization}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{f.email}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Programmes Offered Section */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    Academic Programmes & Curricula ({activeDept.programmes.length})
                  </h3>
                  <button
                    onClick={handleOpenAddProgramme}
                    className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Programme</span>
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {activeDept.programmes.map((p) => (
                    <div key={p.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              {p.id}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                              {p.level}
                            </span>
                            <h4 className="font-bold text-white text-xs">{p.name}</h4>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            Duration: <strong>{p.duration}</strong> • Approved Intake: <strong>{p.intake} seats</strong> • Fee: <strong>₹{p.feesPerSem?.toLocaleString() || '12,000'}/Sem</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditProgramme(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteProgramme(selectedSchoolId, activeDept.id, p.id)}
                            className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                        Eligibility: {p.eligibility}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 p-12 rounded-3xl border border-slate-800 text-center text-slate-500">
              Select a school and department to manage faculty profiles and curricula.
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {/* School Form Modal */}
      {(modalType === 'ADD_SCHOOL' || modalType === 'EDIT_SCHOOL') && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveSchool} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-display">
                {modalType === 'EDIT_SCHOOL' ? 'Edit School of Study' : 'Establish New School of Study'}
              </h3>
              <button type="button" onClick={() => setModalType('NONE')} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g., School of Sciences"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Dean of School</label>
              <input
                type="text"
                value={schoolDean}
                onChange={(e) => setSchoolDean(e.target.value)}
                placeholder="e.g., Prof. Dr. S. Meenakshi"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Description / Academic Charter</label>
              <textarea
                value={schoolDesc}
                onChange={(e) => setSchoolDesc(e.target.value)}
                rows={3}
                placeholder="Overview of disciplines, research labs, and academic focus..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalType('NONE')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Save School
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dept Form Modal */}
      {(modalType === 'ADD_DEPT' || modalType === 'EDIT_DEPT') && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveDept} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-display">
                {modalType === 'EDIT_DEPT' ? 'Edit Department' : 'Add New Academic Department'}
              </h3>
              <button type="button" onClick={() => setModalType('NONE')} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g., Department of Physics"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Dept Code</label>
                <input
                  type="text"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  placeholder="e.g., PHY"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Head of Dept (HoD)</label>
                <input
                  type="text"
                  value={deptHead}
                  onChange={(e) => setDeptHead(e.target.value)}
                  placeholder="Dr. P. Subramani"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={deptEmail}
                  onChange={(e) => setDeptEmail(e.target.value)}
                  placeholder="hod@ruraluniv.ac.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  value={deptPhone}
                  onChange={(e) => setDeptPhone(e.target.value)}
                  placeholder="+91 451 245..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Description</label>
              <textarea
                value={deptDesc}
                onChange={(e) => setDeptDesc(e.target.value)}
                rows={3}
                placeholder="Department mission, labs, achievements..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalType('NONE')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Save Department
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Faculty Modal */}
      {(modalType === 'ADD_FACULTY' || modalType === 'EDIT_FACULTY') && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveFaculty} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-display">
                {modalType === 'EDIT_FACULTY' ? 'Edit Faculty Profile' : 'Add Faculty Member'}
              </h3>
              <button type="button" onClick={() => setModalType('NONE')} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="Dr. K. Annamalai"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Designation</label>
                <input
                  type="text"
                  value={facultyDesig}
                  onChange={(e) => setFacultyDesig(e.target.value)}
                  placeholder="Associate Professor"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Qualification</label>
                <input
                  type="text"
                  value={facultyQual}
                  onChange={(e) => setFacultyQual(e.target.value)}
                  placeholder="M.Sc., M.Phil., Ph.D."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Specialization</label>
                <input
                  type="text"
                  value={facultySpec}
                  onChange={(e) => setFacultySpec(e.target.value)}
                  placeholder="Nanotechnology & Solar"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={facultyEmail}
                  onChange={(e) => setFacultyEmail(e.target.value)}
                  placeholder="faculty@ruraluniv.ac.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  value={facultyPhone}
                  onChange={(e) => setFacultyPhone(e.target.value)}
                  placeholder="+91 98421..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalType('NONE')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Save Faculty
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Programme Modal */}
      {(modalType === 'ADD_PROG' || modalType === 'EDIT_PROG') && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveProgramme} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-display">
                {modalType === 'EDIT_PROG' ? 'Edit Degree Programme' : 'Add Degree Programme'}
              </h3>
              <button type="button" onClick={() => setModalType('NONE')} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Programme Code</label>
                <input
                  type="text"
                  value={progCode}
                  onChange={(e) => setProgCode(e.target.value)}
                  placeholder="e.g., MCA-2026"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Level</label>
                <select
                  value={progLevel}
                  onChange={(e) => setProgLevel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                >
                  <option value="UG">UG (Undergraduate)</option>
                  <option value="PG">PG (Postgraduate)</option>
                  <option value="Diploma">Diploma / Post-Diploma</option>
                  <option value="Doctoral">Doctoral (Ph.D.)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Programme Name</label>
              <input
                type="text"
                value={progName}
                onChange={(e) => setProgName(e.target.value)}
                placeholder="e.g., Master of Computer Applications (MCA)"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Duration</label>
                <input
                  type="text"
                  value={progDuration}
                  onChange={(e) => setProgDuration(e.target.value)}
                  placeholder="2 Years (4 Sem)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Intake (Seats)</label>
                <input
                  type="number"
                  value={progIntake}
                  onChange={(e) => setProgIntake(Number(e.target.value))}
                  placeholder="60"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Fee/Sem (₹)</label>
                <input
                  type="number"
                  value={progFee}
                  onChange={(e) => setProgFee(Number(e.target.value))}
                  placeholder="14500"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Eligibility Criteria</label>
              <textarea
                value={progEligibility}
                onChange={(e) => setProgEligibility(e.target.value)}
                rows={2}
                placeholder="Minimum qualification and entrance marks required..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalType('NONE')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Save Programme
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
