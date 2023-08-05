const { openDBConnection, closeDBConnection } = require('./mongodb');

async function deleteEmployee(employeeId) {
    try {
        const db = await openDBConnection();

        // Find the employee by their ID
        const employee = await db.collection('employee')
            .findOne({ id: employeeId });
        if (!employee)
            throw new Error('Employee not found');
        
        // Delete the employee document
        await db.collection('employee').deleteOne({ _id: employee._id });
        console.log('Employee data deleted successfully.');

        // Delete the associated identity document
        await db.collection('identity').deleteOne({ _id: employee.identity });
        console.log('Associated Identity data deleted successfully.');
    } catch (error) {
        console.error('Error deleting employee data:', error);
    } finally {
        closeDBConnection();
    }
}

// Usage example
const employeeIdToDelete = 222;
deleteEmployee(employeeIdToDelete);
