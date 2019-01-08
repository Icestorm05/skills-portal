# Skills Portal API

## Get up and running
1. Install npm modules: `npm install`
2. Set configuration: `cp config.sample.js config.js`
3. Launch `nodemon`

## Routes
The `limit` param is used to override the default value from the source DB when performing a query.

### Skills
To get a list of predefined skills that can be applied to an employee: -
`http://localhost:8080/skills?limit=100`
Method: GET

### Employees
To get a list of employees: -
`http://localhost:8080/employees?limit=100`
Method: GET

To get a specific employee: -
`http://localhost:8080/employees/:id`
Method: GET

### Employee Skills
To get a list of skills that belong to an employee: -
`http://localhost:8080/employees/:empId/skills`
Method: GET

To get a specific skill thats belong to an employee: -
`http://localhost:8080/employees/:empId/skills/:id`
Method: GET

To add a skill to an employee: -
`http://localhost:8080/employees/89/skills`
Method: POST
Body:
```
{
	"employee": {
		"EmployeeId": 89
	},
	"skill": {
		"EmployeeSkillAttributeId": 1,
		"SkillCurrencyId": 1,
		"SkillLevelId": 1
	}
}
```

To edit an employee skill: -
`http://localhost:8080/employees/:empId/skills/:id`
Method: PUT
Body:
```
{
	"skill": {
                "EmployeeSkillId": 1,
                "EmployeeId": 89,
                "EmployeeSkillAttributeId": 2,
                "SkillCurrencyId": 2,
                "SkillLevelId": 2
            }
}
```

To approve an employee skill: -
`http://localhost:8080/employees/:empid/skills/:id?action=approve`
Method: PUT
Body:
```
{
	"skill": {
                "EmployeeSkillId": 1,
                "EmployeeId": 89,
                "EmployeeSkillAttributeId": 2,
                "SkillCurrencyId": 2,
                "SkillLevelId": 2
            }
}
```

To delete an employee skill: -
`http://localhost:8080/employees/:empId/skills/:id`
Method: DELETE

### Employee Approved Skills
To get a specific approved skill that belongs to an employee: -
`http://localhost:8080/employees/:empId/approvedskills/:id`
Method: GET

To edit an employee approved skill: -
`http://localhost:8080/employees/:empId/approvedskills/:id`
Method: PUT
Body:
```
{
	"skill": {
                "EmployeeSkillId": 1,
                "EmployeeId": 89,
                "EmployeeSkillAttributeId": 2,
                "SkillCurrencyId": 2,
                "SkillLevelId": 2
            }
}
```

To delete all approved skills for an employee: -
`http://localhost:8080/employees/:id/approvedskills/`
Method: DELETE

### User Accounts
To get a list of user accounts: -
`http://localhost:8080/users`
Method: GET

To get a specific user: -
`http://localhost:8080/users/:id`
Method: GET

### Audit
All data changes are recorded in MongoDB.

To get the audit history, ordered by the most recent: -
`http://localhost:8080/audit`
Method: GET

To get the audit history with a filter, sort or limit: -
`http://localhost:8080/audit`
Method: POST
Body:
```
{
	"filter": {[query]},
	"sort": {"when": -1},
	"limit": 1000
}
```




