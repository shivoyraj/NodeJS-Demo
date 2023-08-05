const { openDBConnection, closeDBConnection } = require('./mongodb');

async function getEmployeeById(employeeId) {
    try {
        const db = await openDBConnection();

        // Find the employee by their ID
        const employee = await db.collection('employee')
            .findOne({ id: employeeId });

        if (!employee)
            throw new Error('Employee not found');

        // Retrieve identity data using the reference stored in the employee document
        const identity = await db.collection('identity')
            .findOne({ _id: employee.identity });

        // Combine employee and identity data
        return { ...employee, identity };
    } catch (error) {
        console.error('Error retrieving employee data:', error);
    } finally {
        closeDBConnection();
    }
}


(async () => {
    const employee = await getEmployeeById(111);
    console.log(employee);
})();
