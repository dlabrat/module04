

class EmployeeFilter extends React.Component {
    render() {
        return (<div>This is a placeholder for the employee filter.</div>)
    }
}

function EmployeeTable(props) {
    const employeeRows = props.employees.map(employee => 
        <EmployeeRow key={employee.id} employee={employee}/>)
    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Extension</th>
                    <th>Email</th>
                    <th>Title</th>
                    <th>Date Hired</th>
                    <th>Currently Employed?</th>
                </tr>
            </thead>
            <tbody>
                {employeeRows}
            </tbody>
        </table>
    )
}

function EmployeeRow(props) {
    const employee = props.employee
    return (
        <tr>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.ext}</td>
            <td>{employee.email}</td>
            <td>{employee.title}</td>
            <td>{employee.dateHired.toDateString()}</td>
            <td>{employee.isEmployed ? 'Yes' : 'No'}</td>
        </tr>
    )
}

class EmployeeAdd extends React.Component {
    constructor() {
        super()
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(e) {
        e.preventDefault()
        const form = document.forms.employeeAdd
        const employee = {
            name: form.name.value,
            ext: form.ext.value,
            email: form.email.value,
            title: form.title.value,
            dateHired: new Date(),
            isEmployed: true,
        }
        this.props.createEmployee(employee)
        form.name.value = ''
        form.ext.value = ''
        form.email.value = ''
        form.title.value = ''
    }
    render() {
        return (
            <form name="employeeAdd" onSubmit={this.handleSubmit}>
                Name: <input type="text" name="name" /><br/>
                Extension: <input type="text" name="ext" /><br/>
                Email: <input type="text" name="email" /><br/>
                Title: <input type="text" name="title" /><br/>
                <button>Add</button>
            </form>
        )
    }
}

class EmployeeList extends React.Component {
    constructor() {
        super()
        this.state = { employees: [] }
        this.createEmployee = this.createEmployee.bind(this)
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
       fetch('/api/employees')
       .then(response => response.json())
       .then(data=> { 
            console.log('Total count of employees: ', data.count)
            data.employee.forEach(employee => {
                employee.dataHired = new Date(employee.dateHired)           
         })
         this.setState({employees: data.employees})
       })
       .catch(err => {console.log(err)})
    }
    createEmployee(employee) {
        employee.id = this.state.employees.length + 1
        const newEmployeeList = this.state.employees.slice()
        newEmployeeList.push(employee)
        this.setState({ employees: newEmployeeList })
    }
    render() {
        return (
            <React.Fragment>
                <h1>Employee Management Application</h1>
                <EmployeeFilter />
                <hr />
                <EmployeeTable employees={this.state.employees} />
                <hr /> 
                <EmployeeAdd createEmployee={this.createEmployee} />
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    <React.StrictMode>
        <EmployeeList />
    </React.StrictMode>, 
    document.getElementById('content')
)