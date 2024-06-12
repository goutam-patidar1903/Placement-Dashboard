import React from 'react';
import progress from './progress.gif';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit,faTrash} from '@fortawesome/free-solid-svg-icons';

function addStudent(student)
{
var promise=new Promise((resolve)=>{

var dataString=`id=${student.id}&name=${encodeURIComponent(student.name)}&placementType=${student.placementType}&company=${encodeURIComponent(student.company)}&salary=${student.salary}&salaryType=${student.salaryType}`;

fetch("/addPlacement",{
"method":"POST",
"headers":{
"Content-Type":"application/x-www-form-urlencoded"
},
"body":dataString
}).then((response)=>{
return response.json();
}).then((responseJSON)=>{
resolve(responseJSON);
});
});
return promise;
}

function deleteStudent(id)
{
var promise=new Promise((resolve)=>{
fetch("/deletePlacement",{
"method":"POST",
"headers":{
"Content-Type":"application/x-www-form-urlencoded"
},
"body":`id=${id}`
}).then((response)=>{
return response.json();
}).then((responseJSON)=>{
resolve(responseJSON);
});
});
return promise;
}

function updateStudent(student)
{
var promise=new Promise((resolve)=>{
var dataString=`id=${student.id}&name=${encodeURIComponent(student.name)}&placementType=${student.placementType}&company=${encodeURIComponent(student.company)}&salary=${student.salary}&salaryType=${student.salaryType}`;
fetch("/updatePlacement",{
"method":"POST",
"headers":{
"Content-Type":"application/x-www-form-urlencoded"
},
"body":dataString
}).then((response)=>{
return response.json();
}).then((responseJSON)=>{
resolve(responseJSON);
});
});
return promise;
}

const getCompanies=()=>{
    var promise=new Promise((resolve,reject)=>{
    fetch('/companies').then((response)=>{
    return response.json();
    }).then((companies)=>{
    resolve(companies);
    }).catch((error)=>{
    reject(error);
    });
    });
    return promise;
    }

function getPlacements()
{
var promise=new Promise((resolve)=>{
fetch("/placements").then((response)=>{
return response.json();
}).then((students)=>{
resolve(students);
})
});
return promise;
}

const AppOne=()=>{

const [title]=React.useState("Placement List");
const [year]=React.useState(2023);
const [activeMode,setActiveMode]=React.useState("view");
const [students,setStudents]=React.useState([]);
const [selectedStudent,setSelectedStudent]=React.useState(null);
const [companies,setCompanies]=React.useState([]);
const [filter,setFilter]=React.useState({jobTypes:[],salaryTypes:[],companies:[]});

React.useEffect(()=>{
getCompanies().then((c)=>{
setCompanies(c);
getPlacements().then((s)=>{
setStudents(s);
},(error)=>{
alert(error);
});
},(error)=>{
alert(error);
});
},[]);

const applyFilter=(f)=>{
// console.log(JSON.stringify(f));
setFilter(f);
}

const onToolBarItemSelected=(item)=>{
if(item==="add") setActiveMode("add");
if(item==="cancel") setActiveMode("view");
setFilter({jobTypes:[],salaryTypes:[],companies:[]});
}

const updateStudentsList=()=>{
    getCompanies().then((c)=>{
        setCompanies(c);
        getPlacements().then((s)=>{
        setStudents(s);
        },(error)=>{
        alert(error);
        });
        },(error)=>{
        alert(error);
        });
        setFilter({jobTypes:[],salaryTypes:[],companies:[]});
}

const changeActiveMode=(mode)=>{
setFilter({jobTypes:[],salaryTypes:[],companies:[]});
setActiveMode(mode);
}

const onStudentButtonClicked=(student,mode)=>{
setActiveMode(mode);
setSelectedStudent(student);
}

return (
<div>
<TitleComponent title={title} year={year} />
<ToolBarComponent mode={activeMode} onItemSelected={onToolBarItemSelected} />
{activeMode==="view" && <StudentListComponent students={students} companies={companies} filter={filter} applyFilter={applyFilter} onStudentButtonClicked={onStudentButtonClicked}/>}
{activeMode==="add" && <AddStudent updateStudentsList={updateStudentsList} changeActiveMode={changeActiveMode}/>}
{activeMode==="delete" && <DeleteStudent student={selectedStudent} updateStudentsList={updateStudentsList} changeActiveMode={changeActiveMode}/>}
{activeMode==="edit" && <EditStudent student={selectedStudent} updateStudentsList={updateStudentsList} changeActiveMode={changeActiveMode}/>}
</div>
)
}

const TitleComponent=({title,year})=>{
return (
<div>
<h1 style={{marginLeft : '20px'}}><em>Goms Tech : {title} ({year})</em></h1>
</div>
)
}  //TitleComponent ends here

const ToolBarComponent=({mode,onItemSelected})=>{
const takeAction=(ev)=>{
var action=ev.currentTarget.getAttribute("target_action");
onItemSelected(action);
}
return (
<div>
<hr/>
{mode==="view" && <button type='button' onClick={takeAction} target_action="add">Add</button>}
{(mode==="add" || mode==="delete" || mode==="edit") && <button type='button' onClick={takeAction} target_action="cancel">Cancel</button>}
<hr/>
</div>
)
}  //ToolBarComponent ends here

const StudentListComponent=({students,companies,applyFilter,filter,onStudentButtonClicked})=>{
return (
<div style={{display : 'flex'}}>
<div style={{marginLeft : '20px' , paddingRight : '20px' , borderRight : '2px solid #d14c13'}}>
<div style={{width : '100%' , backgroundColor : '#d14c13' , fontWeight : 'bold' , color : '#FFFFFF' , textAlign : 'center' , padding : '2px'}}>F  I  L  T  E  R  S</div>
{companies.length>0 && <FilterComponent companies={companies} onChange={applyFilter}/> }
</div>
<div style={{flexGrow : 1,marginLeft : '20px'}}>
<PlacementComponent filterBy={filter} students={students} onStudentButtonClicked={onStudentButtonClicked}/>
</div>
</div>
)
} //StudentListComponent ends here

const FilterComponent=({companies,onChange})=>{

    const [jobTypesState,setJobTypesState]=React.useState([]);
    const [salaryTypesState,setSalaryTypesState]=React.useState([]);
    const [companiesState,setCompaniesState]=React.useState([]);
    
    React.useEffect(()=>{
    var j=[];
    j.push({type:'F',state:false});
    j.push({type:'I',state:false});
    setJobTypesState(j);
    var s=[];
    s.push({type:'Y',state:false});
    s.push({type:'M',state:false});
    setSalaryTypesState(s);
    var c=[];
    companies.forEach((company)=>{
    c.push({name:company.name,state:false});
    });
    setCompaniesState(c);
    },[companies]);
    
    const jobTypesChanged=(jt)=>{
    var filter={};
    filter.salaryTypes=salaryTypesState;
    filter.companies=companiesState;
    var j=[];
    j.push({type:'F',state: jt.fullTime});
    j.push({type:'I',state: jt.internship});
    setJobTypesState(j);
    filter.jobTypes=j;
    onChange(filter);
    }
    
    const salaryTypesChanged=(st)=>{
    var filter={};
    filter.jobTypes=jobTypesState;
    filter.companies=companiesState;
    var s=[];
    s.push({type:'Y',state: st.yearly});
    s.push({type:'M',state: st.monthly});
    setSalaryTypesState(s);
    filter.salaryTypes=s;
    onChange(filter);
    }
    
    const companiesSelected=(cs)=>{
    var filter={};
    filter.jobTypes=jobTypesState;
    filter.salaryTypes=salaryTypesState;
    filter.companies=cs;
    setCompaniesState(cs);
    onChange(filter);
    }
    
    return(
    <div>
    <JobTypeComponent onChange={jobTypesChanged}/>
    <SalaryTypeComponent onChange={salaryTypesChanged}/>
    <CompanyComponent companies={companies} companiesState={companiesState} onChange={companiesSelected}/>
    </div>
    )
    } //FilterComponent Ends Here

    const JobTypeComponent=({onChange})=>{

        const [fullTimeChecked,setFullTimeChecked]=React.useState(false);
        const [internshipChecked,setInternshipChecked]=React.useState(false);
        
        const statesChanged=(ev)=>{
        var jobTypes={
        "fullTime":fullTimeChecked,
        "internship":internshipChecked
        };
        if(ev.currentTarget.value==='F')
        {
        setFullTimeChecked(ev.currentTarget.checked);
        jobTypes.fullTime=ev.currentTarget.checked;
        } else
        if(ev.currentTarget.value==='I')
        {
        setInternshipChecked(ev.currentTarget.checked);
        jobTypes.internship=ev.currentTarget.checked;
        }
        onChange(jobTypes);
        }
        
        return(
        <fieldset>
        <legend>Job Type</legend>
        <input type='checkbox' checked={fullTimeChecked} onChange={statesChanged} value='F' style={{width : '20px' , height : '20px'}} />Full Time<br/>
        <input type='checkbox' checked={internshipChecked} onChange={statesChanged} value='I' style={{width : '20px' , height : '20px'}} />Internship<br/>
        </fieldset>
        )
        } //Job TYpe Component Ends here

        const SalaryTypeComponent=({onChange})=>{

            const [yearlyChecked,setYearlyChecked]=React.useState(false);
            const [monthlyChecked,setMonthlyChecked]=React.useState(false);
            
            const statesChanged=(ev)=>{
            var salaryTypes={
            "yearly":yearlyChecked,
            "monthly":monthlyChecked
            };
            if(ev.currentTarget.value==='Y')
            {
            setYearlyChecked(ev.currentTarget.checked);
            salaryTypes.yearly=ev.currentTarget.checked;
            } else
            if(ev.currentTarget.value==='M')
            {
            setMonthlyChecked(ev.currentTarget.checked);
            salaryTypes.monthly=ev.currentTarget.checked;
            }
            onChange(salaryTypes);
            }
            
            return(
            <fieldset>
            <legend>Salary Type</legend>
            <input type='checkbox' checked={yearlyChecked} onChange={statesChanged} value='Y' style={{width : '20px' , height : '20px'}} />Yearly<br/>
            <input type='checkbox' checked={monthlyChecked} onChange={statesChanged} value='M' style={{width : '20px' , height : '20px'}} />Monthly<br/>
            </fieldset>
            )
            } // SalaryType Component end here

            const CompanyComponent=({companies,companiesState,onChange})=>{
                const statesChanged=(ev)=>{
                var c=[];
                companiesState.forEach((company)=>{
                if(ev.currentTarget.value===company.name) c.push({name:company.name,state:! (company.state)});
                else c.push(company);
                });
                onChange(c);
                }
                
                return(
                <fieldset>
                <legend>Job Type</legend>
                {
                companies.map((company)=>{
                return (
                <span key={company.name}>
                <input type='checkbox' onChange={statesChanged} value={company.name} style={{width : '20px' , height : '20px'}} /> {company.name} ({company.studentsCount}) <br/>
                </span>
                )
                })
                }
                </fieldset>
                )
                } //Company Component End here
            
                const PlacementComponent=({filterBy,students,onStudentButtonClicked})=>{
                    var filteredStudent=[];
                    var considerFullTime=false;
                    var considerInternship=false;
                    var considerYearly=false;
                    var considerMonthly=false;
                    if(filterBy.jobTypes.length===2)
                    {
                    considerFullTime=filterBy.jobTypes[0].state;
                    considerInternship=filterBy.jobTypes[1].state;
                    }
                    if(filterBy.salaryTypes.length===2)
                    {
                    considerYearly=filterBy.salaryTypes[0].state;
                    considerMonthly=filterBy.salaryTypes[1].state;
                    }
                    
                    students.forEach((student)=>{
                    if(considerFullTime && ! considerInternship)
                    {
                    if(considerYearly && ! considerMonthly)
                    {
                    if(student.placementType.startsWith('F') && student.salary.endsWith('Annum')) filteredStudent.push(student);
                    }
                    else if(considerMonthly && ! considerYearly)
                    {
                    if(student.placementType.startsWith('F') && student.salary.endsWith('Month')) filteredStudent.push(student);
                    } 
                    else
                    {
                    if(student.placementType.startsWith('F')) filteredStudent.push(student);
                    }
                    } 
                    else if(considerInternship && ! considerFullTime)
                    {
                    if(considerYearly && ! considerMonthly)
                    {
                    if(student.placementType.startsWith('I') && student.salary.endsWith('Annum')) filteredStudent.push(student);
                    }
                    else if(considerMonthly && ! considerYearly)
                    {
                    if(student.placementType.startsWith('I') && student.salary.endsWith('Month')) filteredStudent.push(student);
                    } 
                    else
                    {
                    if(student.placementType.startsWith('I')) filteredStudent.push(student);
                    }
                    } 
                    else
                    {
                    if(considerYearly && ! considerMonthly)
                    {
                    if(student.salary.endsWith('Annum')) filteredStudent.push(student);
                    }
                    else if(considerMonthly && ! considerYearly)
                    {
                    if(student.salary.endsWith('Month')) filteredStudent.push(student);
                    } 
                    else
                    {
                    filteredStudent.push(student);
                    }
                    }
                    });
                    
                    
                    var newCompanies=filterBy.companies.filter((company) => company.state );
                    if(newCompanies.length>0)
                    {
                    var filteredStudentByCompany=[];
                    filteredStudent.forEach((student)=>{
                    newCompanies.forEach((company)=>{
                    if(student.company===company.name) filteredStudentByCompany.push(student);
                    });
                    });
                    filteredStudent=[...filteredStudentByCompany];
                    }
                    if(filteredStudent.length===0)
                    {
                    return (
                    <div>
                    <h2 style={{color : '#d14c13'}}>Placement Record</h2>
                    <h4 style={{color : 'red'}}>No such placement details for applied filters exists in the record</h4>
                    </div>
                    )
                    }
                    else
                    {
                    return (
                    <div>
                    <h2 style={{color : '#d14c13'}}>Placement Record</h2>
                    <hr/>
                    {
                    filteredStudent.map((student)=>{
                    return (
                    <StudentComponent key={student.id} student={student} onButtonClicked={onStudentButtonClicked}/>
                    )
                    })
                    }
                    </div>
                    )
                    }
                    }    

const StudentComponent=({student,onButtonClicked})=>{
const clickHandler=(ev)=>{
var elemID=ev.currentTarget.id;
var mode="";
if(elemID.substring(0,1)==='E') mode="edit";
else if(elemID.substring(0,1)==='D') mode="delete";
onButtonClicked(student,mode);
}
return (
<div>
<center>
<FontAwesomeIcon icon={faEdit} style={{cursor:'pointer'}} onClick={clickHandler} id={'E'+student.id} /> &nbsp;&nbsp;&nbsp;&nbsp;
<FontAwesomeIcon icon={faTrash} style={{cursor:'pointer'}} onClick={clickHandler} id={'D'+student.id} />
</center>
ID : <b>{student.id}</b><br/>
Name : <b>{student.name}</b><br/>
Company : <b>{student.company}</b><br/>
Placement Type : <b>{student.placementType}</b><br/>
Salary : <b>{student.salary}</b>
<hr/>
</div>
)
} //StudentComponent ends here

const AddStudent=({updateStudentsList,changeActiveMode})=>{

const [id,setId]=React.useState(0);
const [name,setName]=React.useState("");
const [salary,setSalary]=React.useState(0);
const [salaryType,setSalaryType]=React.useState('Y');
const [company,setCompany]=React.useState("");
const [placementType,setPlacementType]=React.useState('F');
const [fullTimeChecked,setFullTimeChecked]=React.useState("checked");
const [internshipChecked,setInternshipChecked]=React.useState("");

const [idError,setIdError]=React.useState("");
const [nameError,setNameError]=React.useState("");
const [companyError,setCompanyError]=React.useState("");
const [salaryError,setSalaryError]=React.useState("");
const [formError,setFormError]=React.useState("");

const [displayWhat,setDisplayWhat]=React.useState("formSection");

const idChanged=(ev)=>{
setId(ev.target.value);
}

const nameChanged=(ev)=>{
setName(ev.target.value);
}

const salaryChanged=(ev)=>{
setSalary(ev.target.value);
}

const salaryTypeChanged=(ev)=>{
setSalaryType(ev.target.value);
}

const companyChanged=(ev)=>{
setCompany(ev.target.value);
}

const placementTypeChanged=(ev)=>{
if(ev.target.value==='F' && ev.target.checked)
{
setPlacementType("F");
setFullTimeChecked("checked");
setInternshipChecked("");
}
if(ev.target.value==='I' && ev.target.checked)
{
setPlacementType("I");
setFullTimeChecked("");
setInternshipChecked("checked");
}
}

const clearAllError=()=>{
setFormError("");
setIdError("");
setNameError("");
setCompanyError("");
setSalaryError("");
}

const clearFormData=()=>{
setId(0);
setName("");
setPlacementType("F");
setCompany("");
setSalary(0);
setSalaryType("Y");
setFullTimeChecked("checked");
setInternshipChecked("");
}

const onClickingSaveButton=(ev)=>{
clearAllError();
var hasError=false;
if(id<=0)
{
setIdError(" * ");
hasError=true;
} 
if(name.trim()==="") 
{
setNameError(" * ");
hasError=true;
}
if(company.trim()==="") 
{
setCompanyError(" * ");
hasError=true;
}
if(salary<=0) 
{
setSalaryError(" * ");
hasError=true;
}

if(hasError===true) return;

var student={
"id":id,
"name":name.trim(),
"placementType":placementType,
"company":company.trim(),
"salary":salary,
"salaryType":salaryType
};
setDisplayWhat("processing");
addStudent(student).then((responseJSON)=>{
if(responseJSON.success===true)
{
updateStudentsList();
clearFormData();
setDisplayWhat("addMoreSection");
}
else
{
setFormError(responseJSON.error);
setDisplayWhat("formSection");
}
});
}

const setVisibleMode=(ev)=>{
var action=ev.target.getAttribute("target_action");
if(action==="cancel" || action==="no")
{
changeActiveMode("view");
}
else if(action==="yes")
{
setDisplayWhat("formSection");
}
}

if(displayWhat===("processing")) return (
<div>
<center>
<h3>Processing</h3>
<img src={progress} alt="" />
</center>
</div>
)

if(displayWhat===("addMoreSection")) return (
<div>
<center>
<h3>Want to Add More Student ??</h3>
<button type='button' onClick={setVisibleMode} target_action="yes"> YES </button> &nbsp;&nbsp;&nbsp;
<button type='button' onClick={setVisibleMode} target_action="no"> NO </button>
</center>
</div>
)

if(displayWhat===("formSection")) return (
<div>
<center>
<b>Student Add Module</b><br></br>
<span style={{color:'red'}}>{formError}</span><br/>
<label htmlFor='id'>ID : </label>
<input type='number' id='id' value={id} onChange={idChanged}></input>
<span style={{color:'red'}}>{idError}</span><br/>

<label htmlFor='name'>Name : </label>
<input type='text' id='name' value={name} onChange={nameChanged}></input>
<span style={{color:'red'}}>{nameError}</span><br/>

<label htmlFor='placementType'>Placement Type : </label>
<input type='radio' id='placementType' value='F' name='placementType' checked={fullTimeChecked} onChange={placementTypeChanged}></input> Full Time 
<input type='radio' id='placementType' value='I' name='placementType' checked={internshipChecked} onChange={placementTypeChanged} ></input> Internship <br/>

<label htmlFor='company'>Company : </label>
<input type='text' id='company' value={company} onChange={companyChanged}></input>
<span style={{color:'red'}}>{companyError}</span><br/>

<label htmlFor='salary'>Salary : </label>
<input type='number' id='salary' value={salary} onChange={salaryChanged}></input>&nbsp;
<select id='salaryType' value={salaryType} onChange={salaryTypeChanged}>
<option value='Y'>Per Annum</option>
<option value='M'>Per Month</option>
</select>
<span style={{color:'red'}}>{salaryError}</span><br/>
<button type='button' onClick={onClickingSaveButton} >Save</button>
&nbsp;&nbsp;
<button type='button' onClick={setVisibleMode} target_action="cancel">Cancel</button>
</center>
</div>
)
} //AddStudent ends here

const DeleteStudent=({student,updateStudentsList,changeActiveMode})=>{

const clickHandler=(ev)=>{
var action=ev.target.getAttribute("action");
if(action==="cancel") 
{
changeActiveMode("view");
}
if(action==="delete")
{
deleteStudent(student.id).then((responseJSON)=>{
if(responseJSON.success===true)
{
updateStudentsList();
changeActiveMode("view");
}
});
}
}

return (
<div>
<center>
<b>Student Delete Module</b><br/><br/>
ID : <b>{student.id}</b><br/>
Name : <b>{student.name}</b><br/>
Company : <b>{student.company}</b><br/>
Placement Type : <b>{student.placementType}</b><br/>
Salary : <b>{student.salary}</b><br/><br/>
<button type='button' onClick={clickHandler} action="delete">Delete</button> &nbsp;&nbsp;
<button type='button' onClick={clickHandler} action="cancel">Cancel</button>
</center>
</div>
)
} //DeleteStudent ends here

const EditStudent=({student,updateStudentsList,changeActiveMode})=>{

const [id]=React.useState(student.id);
const [name,setName]=React.useState(student.name);
const [company,setCompany]=React.useState(student.company);
var jobType,fullTimeType,internshipType;
if(student.placementType==="Full Time") 
{
jobType="F";
fullTimeType="checked";
internshipType="";
}
else if(student.placementType==="Internship")
{
jobType="I";
fullTimeType="";
internshipType="checked";
}
const [placementType,setPlacementType]=React.useState(jobType);
const [fullTimeChecked,setFullTimeChecked]=React.useState(fullTimeType);
const [internshipChecked,setInternshipChecked]=React.useState(internshipType);

var salaryString=student.salary;
var salaryValue,salaryTypeValue;

var indexOfLac=salaryString.indexOf("Lac");
if(indexOfLac!==-1)   salaryValue=salaryString.substring(0,indexOfLac-1)*100000;
else   salaryValue=salaryString.substring(0,salaryString.indexOf("Per")-1);

if(salaryString.endsWith("Per Annum")) salaryTypeValue='Y';
else if(salaryString.endsWith("Per Month")) salaryTypeValue='M';

const [salary,setSalary]=React.useState(salaryValue);
const [salaryType,setSalaryType]=React.useState(salaryTypeValue);

const [nameError,setNameError]=React.useState("");
const [companyError,setCompanyError]=React.useState("");
const [salaryError,setSalaryError]=React.useState("");
const [formError,setFormError]=React.useState("");

// handlers starts here

const onNameChangedHandler=(ev)=>{
setName(ev.target.value);
}

const onPlacementTypeChangedHandler=(ev)=>{
if(ev.target.value==='F' && ev.target.checked) 
{
setFullTimeChecked("checked");
setInternshipChecked("");
setPlacementType(ev.target.value);
}
if(ev.target.value==='I' && ev.target.checked) 
{
setInternshipChecked("checked");
setFullTimeChecked("");
setPlacementType(ev.target.value);
}
}

const onCompanyChangedHandler=(ev)=>{
setCompany(ev.target.value);
}

const onSalaryChangedHandler=(ev)=>{
setSalary(ev.target.value);
}

const onSalaryTypeChangedHandler=(ev)=>{
setSalaryType(ev.target.value);
}

const cancelButtonHandler=()=>{
changeActiveMode("view");
}

const clearAllError=()=>{
setFormError("");
setNameError("");
setCompanyError("");
setSalaryError("");
}

const onClickingUpdateButton=()=>{
clearAllError();
var hasError=false;
if(name.trim()==="")
{
setNameError(" * ");
hasError=true;
}
if(company.trim()==="")
{
setCompanyError(" * ");
hasError=true;
} 
if(salary<=0)
{
setSalaryError(" * ");
hasError=true;
}

if(hasError===true) return;

var student={
"id":id,
"name":name.trim(),
"placementType":placementType,
"company":company.trim(),
"salary":salary,
"salaryType":salaryType
}
updateStudent(student).then((responseJSON)=>{
if(responseJSON.success===true)
{
updateStudentsList();
changeActiveMode("view");
}
else
{
setFormError(responseJSON.error);
}
});
} //onClickingUpdateButton ends here

return (
<div>
<center>
<b>Student Edit Module</b><br/><br/>
<span style={{color:'red'}}>{formError}</span><br/>
ID : <b>{id}</b><br/>
Name : <input type='text' value={name} onChange={onNameChangedHandler}></input>
<span style={{color:'red'}}>{nameError}</span><br/>
PlacementType : <input type='radio' value='F' checked={fullTimeChecked} onChange={onPlacementTypeChangedHandler}></input>Full Time
<input type='radio' value='I' checked={internshipChecked} onChange={onPlacementTypeChangedHandler}></input>Internship  <br/>
Company : <input type='text' value={company} onChange={onCompanyChangedHandler}></input>
<span style={{color:'red'}}>{companyError}</span><br/>
Salary : <input type='number' value={salary} onChange={onSalaryChangedHandler}></input> &nbsp;
<select value={salaryType} onChange={onSalaryTypeChangedHandler}>
<option value='Y'>Per Annum</option>
<option value='M'>Per Month</option>
</select>
<span style={{color:'red'}}>{salaryError}</span><br/>
<button type='button' onClick={onClickingUpdateButton}>Update</button> &nbsp;
<button type='button' onClick={cancelButtonHandler}>Cancel</button>
</center>
</div>
)
} //EditStudent ends here

export default AppOne;