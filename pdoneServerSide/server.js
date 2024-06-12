const oracle=require('oracledb');
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const urlEncodedBodyParser=bodyParser.urlencoded({extended:false});


class Student
{
constructor(id,name,placementType,company,salary)
{
this.id=id;
this.name=name;
this.placementType=placementType;
this.company=company;
this.salary=salary;
}
}

class Company
{
constructor(name,studentsCount)
{
this.name=name;
this.studentsCount=studentsCount;
}
getName()
{
return this.name;
}
getStudentsCount()
{
return this.studentsCount;
}
}

app.get("/placements",async (request,response)=>{
var connection=await oracle.getConnection({
"user":"hr",
"password":"hr",
"connectionString":"localhost:1521/xepdb1"
});
resultSet=await connection.execute("select * from student order by id");
await connection.close();

var students=[]
var id,name,jobType,placementType,company,salary,salaryType;

resultSet.rows.forEach((row)=>{
id=row[0];
name=row[1].trim();
jobType=row[2];
company=row[3].trim();
salary=row[4];
salaryType=row[5];

if(jobType==='F') placementType="Full Time";
else if(jobType==='I') placementType="Internship";
if(salaryType==='Y' && salary>99000) salary=(row[4]/100000) +" Lac Per Annum";
else if(salaryType==='Y' && salary<=99000) salary=row[4] +" Per Annum";
else if(salaryType==='M' && salary>99000) salary=(row[4]/100000) +" Lac Per Month";
else if(salaryType==='M' && salary<=99000) salary=row[4] +" Per Month";

students.push(new Student(id,name,placementType,company,salary));
});
response.send(students);
})

app.post("/addPlacement",urlEncodedBodyParser,async (request,response)=>{
    var id=request.body.id;
    var name=request.body.name;
    var placementType=request.body.placementType;
    var company=request.body.company;
    var salary=request.body.salary;
    var salaryType=request.body.salaryType;
    
    var connection=await oracle.getConnection({
    "user":"hr",
    "password":"hr",
    "connectionString":"localhost:1521/xepdb1"
    });
    
    resultSet=await connection.execute(`select * from student where id=${id}`);
    if(resultSet.rows.length>0)
    {
    await connection.close();
    response.send({"success":false,"error":`${id} already exists`});
    return;
    }
    
    await connection.execute(`insert into student values(${id},'${name}','${placementType}','${company}',${salary},'${salaryType}')`);
    await connection.commit();
    await connection.close();
    response.send({"success":true});
    });
    
    app.post("/deletePlacement",urlEncodedBodyParser,async (request,response)=>{
    var id=request.body.id;
    
    var connection=await oracle.getConnection({
    "user":"hr",
    "password":"hr",
    "connectionString":"localhost:1521/xepdb1"
    });
    
    resultSet=await connection.execute(`select * from student where id=${id}`);
    if(resultSet.rows.length==0)
    {
    await connection.close();
    response.send({"success":false,"error":`${id} does not exists`});
    return;
    }
    
    await connection.execute(`delete from student where id=${id}`);
    await connection.commit();
    await connection.close();
    response.send({"success":true});
    });
    
    app.post("/updatePlacement",urlEncodedBodyParser,async (request,response)=>{
    var id=request.body.id;
    var name=request.body.name;
    var placementType=request.body.placementType;
    var company=request.body.company;
    var salary=request.body.salary;
    var salaryType=request.body.salaryType;
    
    var connection=await oracle.getConnection({
    "user":"hr",
    "password":"hr",
    "connectionString":"localhost:1521/xepdb1"
    });
    
    resultSet=await connection.execute(`select * from student where id=${id}`);
    if(resultSet.rows.length==0)
    {
    await connection.close();
    response.send({"success":false,"error":`${id} does not exists`});
    return;
    }
    
    await connection.execute(`update student set name='${name}',job_type='${placementType}',company='${company}',salary='${salary}',salary_type='${salaryType}' where id=${id}`);
    await connection.commit();
    await connection.close();
    response.send({"success":true});
    });

app.get("/companies",async (request,response)=>{
var connection=await oracle.getConnection({
"user":"hr",
"password":"hr",
"connectionString":"localhost:1521/xepdb1"
});
resultSet = await connection.execute("select company,count(*) from student group by company order by company");
await connection.close();
var companies=[];
var name,studentsCount;

resultSet.rows.forEach((row)=>{
name=row[0].trim();
studentsCount=row[1];
companies.push(new Company(name,studentsCount));
});
response.send(companies);
})

app.listen(5050,()=>{
console.log("Server is ready to listen on port 5050");
})